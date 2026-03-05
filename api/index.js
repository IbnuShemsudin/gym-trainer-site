require('dotenv').config();
const express = require('express');
const cors = require('cors');
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

// 2. MIDDLEWARE & CORS CONFIGURATION
// Since deployments are separate, we must explicitly allow your frontend domain
app.use(cors({
    origin: "https://ethiofit.vercel.app", // Your exact frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.options("*", cors());

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

// 4. ROUTES

// Root Route - Good for health checks
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
        if (roleRequest === 'admin') {
            if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
                return res.status(403).json({ success: false, message: "Invalid Admin Secret Key" });
            }
            assignedRole = 'admin';
        }

        user = new User({ 
            name, 
            email, 
            password, 
            role: assignedRole 
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        
        res.status(201).json({ success: true, message: "Account authorized and created.", role: user.role });
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

        const payload = { 
            user: { 
                id: user._id,
                role: user.role 
            } 
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

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (name) user.name = name;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.json({ 
            success: true, 
            message: "Profile updated successfully",
            name: user.name 
        });
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
        res.status(201).json({ success: true, message: 'Lead captured successfully' });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

app.delete('/api/leads/:id', auth, async (req, res) => {
    try {
        await Lead.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Lead permanently removed" });
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
        res.json({ success: true, message: "Asset purged from gallery" });
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

// 6. EXPORT APP (Essential for Vercel)
module.exports = app;