require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Needed for login
const jwt = require('jsonwebtoken'); // Needed for login

// 1. IMPORT MODELS & MIDDLEWARE
const Lead = require('./src/models/Lead');
const User = require('./src/models/User'); // Import User model for login
const Gallery = require('./src/models/Gallery');
const auth = require('./src/middleware/auth');

const app = express();

// 2. MIDDLEWARE
app.use(cors());
app.use(express.json());

// 3. ROUTES

// Health Check
app.get('/', (req, res) => res.send('Ethio Fit API: System Online'));

/**
 * @route   POST /api/auth/login
 * @desc    Admin Login to get Token
 */
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }

        // 2. Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }

        // 3. Create Token
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '12h' }
        );

        res.json({ success: true, token });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Fetch Gallery Data
app.get('/api/gallery', async (req, res) => {
    try {
        const images = await Gallery.find();
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route   POST /api/leads
 * @desc    Submit a new lead (Public)
 */
app.post('/api/leads', async (req, res) => {
    try {
        const { name, email, phone, program } = req.body;
        const newLead = new Lead({ name, email, phone, program });
        await newLead.save();
        res.status(201).json({ success: true, message: 'Success!' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @route   GET /api/leads
 * @desc    View all leads (Private)
 */
app.get('/api/leads', auth, async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json({ success: true, count: leads.length, data: leads });
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

/**
 * @route   DELETE /api/leads/:id
 * @desc    Delete a lead (Private)
 */
app.delete('/api/leads/:id', auth, async (req, res) => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id);
        if (!lead) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, message: "Lead removed" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. DATABASE & SERVER START
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas');
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`🚀 Elite Server running on port ${PORT}`));
    })
    .catch(err => console.error('❌ Database Connection Error:', err));