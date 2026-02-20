const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true }, // Verified required
  program: { type: String },
  createdAt: { type: Date, default: Date.now }
});