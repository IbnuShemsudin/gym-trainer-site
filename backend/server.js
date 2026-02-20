require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 

// 1. IMPORT MODELS & MIDDLEWARE
// Ensure these paths are 100% correct relative to this server.js file
const Lead = require('./src/models/Lead');
const User = require('./src/models/User'); 
const Gallery = require('./src/models/Gallery');
const auth = require('./src/middleware/auth');

const app = express();

// 2. MIDDLEWARE
app.use(cors());
app.use(express.json()); // Parses incoming JSON. Essential for req.body.

// 3. ROUTES

// System Health Check
app.get('/', (req, res) => res.send('Ethio Fit API: System Online'));

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate admin & return token
 */
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }

        // Payload structure must match what 'auth' middleware expects
        const payload = {
            user: { id: user._id }
        };

        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '12h' }
        );

        res.json({ success: true, token });

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

/**
 * @route   GET /api/leads
 * @desc    Fetch all leads (Protected)
 */
app.get('/api/leads', auth, async (req, res) => {
    try {
        // req.user comes from the 'auth' middleware
        console.log(`User ${req.user.id} is fetching leads...`);
        
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json({ success: true, count: leads.length, data: leads });
    } catch (err) {
        console.error("GET /api/leads Error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @route   POST /api/leads
 * @desc    Public submission from contact form
 */
app.post('/api/leads', async (req, res) => {
    try {
        const { name, email, phone, program } = req.body;
        const newLead = new Lead({ name, email, phone, program });
        await newLead.save();
        res.status(201).json({ success: true, message: 'Lead captured successfully' });
    } catch (err) {
        console.error("POST /api/leads Error:", err.message);
        res.status(400).json({ success: false, error: err.message });
    }
});

/**
 * @route   DELETE /api/leads/:id
 * @desc    Remove a lead (Protected)
 */
app.delete('/api/leads/:id', auth, async (req, res) => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id);
        if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
        res.json({ success: true, message: "Lead permanently removed" });
    } catch (err) {
        console.error("DELETE /api/leads Error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @route   GET /api/gallery
 * @desc    Public route to fetch gallery images
 */
app.get('/api/gallery', async (req, res) => {
    try {
        const images = await Gallery.find();
        res.json({ success: true, data: images });
    } catch (err) {
        console.error("GET /api/gallery Error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// 4. DATABASE & SERVER START
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas');
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`🚀 Elite Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('❌ Database Connection Error:', err.message);
        process.exit(1); // Stop server if DB fails
    });