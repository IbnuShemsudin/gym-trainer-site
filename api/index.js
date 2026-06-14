require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 

// 1. IMPORT MODELS & MIDDLEWARE
const Lead = require('./src/models/Lead');
const User = require('./src/models/User'); 
const Gallery = require('./src/models/Gallery');
const Pricing = require('./src/models/Pricing');
const auth = require('./src/middleware/auth');

const app = express();

const ensureAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
};

// 2. MANUAL CORS HANDSHAKE (Optimized for Serverless)
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
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Respond immediately to browser preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).json({});
    }
    next();
});

app.use(express.json()); 

// 3. DATABASE CONNECTION (Optimized for Serverless)
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas');
    } catch (err) {
        console.error('❌ Database Connection Error:', err.message);
    }
};

// Middleware to ensure DB connection on every request
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// Attempt an initial DB connection at startup for clearer diagnostics
connectDB();

// If DB connection not established, return 503 for API routes
app.use((req, res, next) => {
    if (req.path.startsWith('/api') && mongoose.connection.readyState === 0) {
        return res.status(503).json({ success: false, message: 'Service temporarily unavailable: database connection not established.' });
    }
    next();
});

// 4. ROUTES

// Root Route - Health Check
app.get('/', (req, res) => res.send('Ethio Fit API: System Online'));

/**
 * @route   POST /api/auth/register
 */
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

        let assignedRole = 'client';
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

/**
 * @route   POST /api/auth/login
 */
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, message: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid Credentials" });

        const accountStatus = user.status || 'approved';
        if (user.role === 'client' && accountStatus !== 'approved') {
            return res.status(403).json({ success: false, message: 'Account pending admin approval.' });
        }

        const payload = { 
            user: { id: user._id, role: user.role } 
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });
        
        res.json({ 
            success: true, 
            token, 
            role: user.role, 
            name: user.name 
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @route   PUT /api/auth/profile
 */
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
        const requests = await User.find({ role: 'client', status: 'pending' }).select('name email createdAt');
        res.json({ success: true, data: requests });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.put('/api/admin/requests/:id/approve', auth, ensureAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'Request not found' });
        if (user.role !== 'client') return res.status(400).json({ success: false, message: 'Only client requests can be approved' });

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
        if (user.role !== 'client') return res.status(400).json({ success: false, message: 'Only client requests can be rejected' });

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

// 5. START SERVER ONLY IN LOCAL DEVELOPMENT
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Elite Server running locally on port ${PORT}`));
}

// 6. EXPORT APP
module.exports = app;