const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    program: { type: String },
    createdAt: { type: Date, default: Date.now }
});

// THIS IS THE CRITICAL LINE
module.exports = mongoose.model('Lead', LeadSchema);