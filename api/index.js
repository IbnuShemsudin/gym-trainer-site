require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const path = require('path'); 

// 1. IMPORT MODELS & MIDDLEWARE
const Lead = require('./src/models/Lead');
const User = require('./src/models/User'); 
const Gallery = require('./src/models/Gallery');
const Pricing = require('./src/models/Pricing');
const Member = require('./src/models/Member');
const MembershipPlan = require('./src/models/MembershipPlan');
const Payment = require('./src/models/Payment');
const Attendance = require('./src/models/Attendance');
const Trainer = require('./src/models/Trainer');
const WorkoutPlan = require('./src/models/WorkoutPlan');
const Notification = require('./src/models/Notification');
const auth = require('./src/middleware/auth');
const roleAuth = require('./src/middleware/roleAuth');

// IMPORT CONTROLLERS
const memberController = require('./src/controllers/memberController');
const paymentController = require('./src/controllers/paymentController');
const attendanceController = require('./src/controllers/attendanceController');
const trainerController = require('./src/controllers/trainerController');
const workoutController = require('./src/controllers/workoutController');
const notificationController = require('./src/controllers/notificationController');
const membershipController = require('./src/controllers/membershipController');

// IMPORT ROUTER SUB-MODULES
const membershipRoutes = require('./src/routes/membershipRoutes'); 
const adminRoutes = require("./src/routes/adminRoutes");

const app = express();

const ensureAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
};

// 2. MANUAL CORS HANDSHAKE
const allowedOrigins = [
    "https://ethiofit.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (origin && (origin.startsWith('http://192.168.') || origin.startsWith('http://10.'))) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.status(200).json({});
    }
    next();
});

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Serve static assets out of the src/uploads folder structure safely
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// 3. DATABASE CONNECTION INTERFACES
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas');
    } catch (err) {
        console.error('❌ Database Connection Error:', err.message);
    }
};

// Hot-reload target hook for runtime database connections
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// 💡 STRUCTURAL RE-ORDER FIX: Database availability verification now runs BEFORE all router modules
app.use((req, res, next) => {
    if (req.path.startsWith('/api') && mongoose.connection.readyState === 0) {
        return res.status(503).json({ success: false, message: 'Service temporarily unavailable: database connection not established.' });
    }
    next();
});

// Fire connection pool configuration globally on initial runtime startup
connectDB();

// --- MOUNT ROUTER MODULE GATEWAYS ---
app.use("/api/admin", adminRoutes);
app.use('/api/memberships', membershipRoutes);

// 4. MAIN ROUTE INTERFACES
app.get('/', (req, res) => res.send('Ethio Fit API: System Online'));

app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, roleRequest, adminSecret } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        let assignedRole = 'member';
        let accountStatus = 'pending';

        if (roleRequest === 'admin') {
            if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
                return res.status(403).json({ success: false, message: "Invalid Admin Secret Key" });
            }
            assignedRole = 'admin';
            accountStatus = 'approved';
        }

        user = new User({ name, email, password, role: assignedRole, status: accountStatus });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        
        const message = assignedRole === 'admin'
            ? "Admin account created. Access granted."
            : "Client account created. Pending admin approval.";

        res.status(201).json({ success: true, message, role: user.role });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, message: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid Credentials" });

        const accountStatus = user.status || 'approved';
        if (user.role === 'member' && accountStatus !== 'approved') {
            return res.status(403).json({ success: false, message: 'Account pending admin approval.' });
        }

        const payload = { user: { id: user._id, role: user.role } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });
        
        res.json({ success: true, token, role: user.role, name: user.name });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.put('/api/auth/profile', auth, async (req, res) => {
    try {
        const { name, password } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        if (name) user.name = name;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        await user.save();
        res.json({ success: true, message: "Profile updated", name: user.name });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.put('/api/admin/update-profile', auth, ensureAdmin, async (req, res) => {
    try {
        const { name, password } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        if (name) user.name = name;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        await user.save();
        res.json({ success: true, message: "Admin profile updated", name: user.name });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/admin/requests', auth, ensureAdmin, async (req, res) => {
    try {
        const requests = await User.find({ role: 'member', status: 'pending' }).select('name email createdAt');
        res.json({ success: true, data: requests });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.put('/api/admin/requests/:id/approve', auth, ensureAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'Request not found' });
        if (user.role !== 'member') return res.status(400).json({ success: false, message: 'Only member requests can be approved' });

        user.status = 'approved';
        await user.save();
        res.json({ success: true, message: 'Client approved' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.put('/api/admin/requests/:id/reject', auth, ensureAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'Request not found' });
        if (user.role !== 'member') return res.status(400).json({ success: false, message: 'Only member requests can be rejected' });

        user.status = 'rejected';
        await user.save();
        res.json({ success: true, message: 'Client request rejected' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- LEADS MANAGEMENT ---
app.get('/api/leads', auth, async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json({ success: true, count: leads.length, data: leads });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/leads', async (req, res) => {
    try {
        const { name, email, phone, program } = req.body;
        const newLead = new Lead({ name, email, phone, program });
        await newLead.save();
        res.status(201).json({ success: true, message: 'Lead captured' });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

app.delete('/api/leads/:id', auth, async (req, res) => {
    try {
        await Lead.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Lead removed" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- GALLERY MANAGEMENT ---
app.get('/api/gallery', async (req, res) => {
    try {
        const images = await Gallery.find().sort({ createdAt: -1 });
        res.json({ success: true, data: images });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/gallery', auth, async (req, res) => {
    try {
        const { title, url } = req.body;
        const newImage = new Gallery({ title, url });
        await newImage.save();
        res.status(201).json({ success: true, data: newImage });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

app.delete('/api/gallery/:id', auth, async (req, res) => {
    try {
        await Gallery.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Asset purged" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- PRICING PROTOCOLS ---
app.get('/api/pricing', async (req, res) => {
    try {
        const pricing = await Pricing.find().sort({ amount: 1 });
        res.json({ success: true, data: pricing });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/pricing', auth, async (req, res) => {
    try {
        const { name, amount, features } = req.body;
        const featureArray = typeof features === 'string' ? features.split(',').map(f => f.trim()) : features;
        const newPrice = new Pricing({ name, amount, features: featureArray });
        await newPrice.save();
        res.status(201).json({ success: true, data: newPrice });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

app.delete('/api/pricing/:id', auth, async (req, res) => {
    try {
        await Pricing.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Price protocol deactivated" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- MEMBER MANAGEMENT ---
app.get('/api/members', auth, roleAuth(['admin', 'receptionist', 'trainer']), memberController.getAllMembers);
app.get('/api/members/search', auth, roleAuth(['admin', 'receptionist']), memberController.searchMembers);
app.get('/api/members/active', auth, roleAuth(['admin', 'receptionist']), memberController.getActiveMembers);
app.get('/api/members/expired', auth, roleAuth(['admin', 'receptionist']), memberController.getExpiredMembers);
app.get('/api/members/:id', auth, roleAuth(['admin', 'receptionist', 'trainer']), memberController.getMemberById);
app.post('/api/members', auth, roleAuth(['admin', 'receptionist']), memberController.createMember);
app.put('/api/members/:id', auth, roleAuth(['admin', 'receptionist']), memberController.updateMember);
app.delete('/api/members/:id', auth, roleAuth(['admin']), memberController.deleteMember);
app.post('/api/members/:id/assign-trainer', auth, roleAuth(['admin', 'trainer']), memberController.assignTrainer);

// --- MEMBERSHIP PLAN MANAGEMENT ---
app.get('/api/membership-plans', membershipController.getAllPlans);
app.get('/api/membership-plans/active', membershipController.getActivePlans);
app.get('/api/membership-plans/type/:type', membershipController.getPlansByType);
app.get('/api/membership-plans/:id', membershipController.getPlanById);
app.post('/api/membership-plans', auth, roleAuth(['admin']), membershipController.createPlan);
app.put('/api/membership-plans/:id', auth, roleAuth(['admin']), membershipController.updatePlan);
app.delete('/api/membership-plans/:id', auth, roleAuth(['admin']), membershipController.deletePlan);
app.put('/api/membership-plans/:id/deactivate', auth, roleAuth(['admin']), membershipController.deactivatePlan);
app.put('/api/membership-plans/:id/activate', auth, roleAuth(['admin']), membershipController.activatePlan);

// --- PAYMENT MANAGEMENT ---
app.get('/api/payments', auth, roleAuth(['admin', 'receptionist']), paymentController.getAllPayments);
app.get('/api/payments/member/:memberId', auth, roleAuth(['admin', 'receptionist', 'member']), paymentController.getPaymentsByMember);
app.get('/api/payments/report', auth, roleAuth(['admin']), paymentController.getPaymentReport);
app.get('/api/payments/revenue/monthly', auth, roleAuth(['admin']), paymentController.getMonthlyRevenue);
app.get('/api/payments/:id', auth, roleAuth(['admin', 'receptionist']), paymentController.getPaymentById);
app.post('/api/payments', auth, roleAuth(['admin', 'receptionist']), paymentController.recordPayment);
app.put('/api/payments/:id', auth, roleAuth(['admin', 'receptionist']), paymentController.updatePayment);

// --- ATTENDANCE MANAGEMENT ---
app.get('/api/attendance', auth, roleAuth(['admin', 'receptionist']), attendanceController.getAllAttendance);
app.get('/api/attendance/today', auth, roleAuth(['admin', 'receptionist']), attendanceController.getTodayAttendance);
app.get('/api/attendance/member/:memberId', auth, roleAuth(['admin', 'receptionist', 'member']), attendanceController.getAttendanceByMember);
app.get('/api/attendance/report', auth, roleAuth(['admin']), attendanceController.getAttendanceReport);
app.post('/api/attendance/check-in', auth, attendanceController.checkIn);
app.put('/api/attendance/:attendanceId/check-out', auth, attendanceController.checkOut);
app.delete('/api/attendance/:id', auth, roleAuth(['admin', 'receptionist']), attendanceController.deleteAttendance);

// --- TRAINER MANAGEMENT ---
app.get('/api/trainers', auth, roleAuth(['admin', 'receptionist']), trainerController.getAllTrainers);
app.get('/api/trainers/active', auth, roleAuth(['admin', 'receptionist']), trainerController.getActiveTrainers);
app.get('/api/trainers/specialization', auth, trainerController.getTrainersBySpecialization);
// ... [the rest of your trainers, workout plans, notifications, and start server blocks are fully optimized and intact]
app.get('/api/trainers/:id', auth, roleAuth(['admin', 'receptionist', 'trainer']), trainerController.getTrainerById);
app.get('/api/trainers/:id/members', auth, roleAuth(['admin', 'receptionist', 'trainer']), trainerController.getTrainerMembers);
app.post('/api/trainers', auth, roleAuth(['admin']), trainerController.createTrainer);
app.put('/api/trainers/:id', auth, roleAuth(['admin', 'trainer']), trainerController.updateTrainer);
app.delete('/api/trainers/:id', auth, roleAuth(['admin']), trainerController.deleteTrainer);
app.post('/api/trainers/assign-member', auth, roleAuth(['admin', 'trainer']), trainerController.assignMember);
app.post('/api/trainers/remove-member', auth, roleAuth(['admin', 'trainer']), trainerController.removeMember);

// --- WORKOUT PLAN MANAGEMENT ---
app.get('/api/workout-plans', auth, roleAuth(['admin', 'trainer']), workoutController.getAllWorkoutPlans);
app.get('/api/workout-plans/member/:memberId', auth, roleAuth(['admin', 'trainer', 'member']), workoutController.getWorkoutPlansByMember);
app.get('/api/workout-plans/trainer/:trainerId', auth, roleAuth(['admin', 'trainer']), workoutController.getWorkoutPlansByTrainer);
app.get('/api/workout-plans/:id', auth, roleAuth(['admin', 'trainer', 'member']), workoutController.getWorkoutPlanById);
app.post('/api/workout-plans', auth, roleAuth(['admin', 'trainer']), workoutController.createWorkoutPlan);
app.put('/api/workout-plans/:id', auth, roleAuth(['admin', 'trainer']), workoutController.updateWorkoutPlan);
app.post('/api/workout-plans/:id/add-exercise', auth, roleAuth(['admin', 'trainer']), workoutController.addExercise);
app.post('/api/workout-plans/:id/complete', auth, roleAuth(['admin', 'trainer']), workoutController.completeWorkoutPlan);
app.post('/api/workout-plans/:id/progress', auth, roleAuth(['admin', 'trainer']), workoutController.addProgressNote);
app.delete('/api/workout-plans/:id', auth, roleAuth(['admin', 'trainer']), workoutController.deleteWorkoutPlan);

// --- NOTIFICATIONS ---
app.get('/api/notifications/user/:userId', auth, notificationController.getUserNotifications);
app.get('/api/notifications/user/:userId/unread', auth, notificationController.getUnreadCount);
app.post('/api/notifications', auth, roleAuth(['admin']), notificationController.createNotification);
app.put('/api/notifications/:id/read', auth, notificationController.markAsRead);
app.put('/api/notifications/user/:userId/read-all', auth, notificationController.markAllAsRead);
app.post('/api/notifications/send-expiry-reminders', auth, roleAuth(['admin']), notificationController.sendExpiryReminders);
app.post('/api/notifications/send-payment-reminders', auth, roleAuth(['admin']), notificationController.sendPaymentReminders);
app.delete('/api/notifications/:id', auth, notificationController.deleteNotification);

// 5. START SERVER
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Elite Server running locally on port ${PORT}`));
}

module.exports = app;