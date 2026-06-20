const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  profilePhoto: { type: String },
  specializations: [{ type: String }], // e.g., ['cardio', 'strength', 'flexibility']
  certifications: [{ type: String }],
  yearsOfExperience: { type: Number },
  bio: { type: String },
  hourlyRate: { type: Number },
  
  // Availability
  availableDays: [{ type: String }], // e.g., ['Monday', 'Tuesday']
  startTime: { type: String }, // HH:mm format
  endTime: { type: String },
  
  // Members assigned
  assignedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
  
  // Performance
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviews: [{ type: String }],
  
  // Status
  isActive: { type: Boolean, default: true },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trainer', trainerSchema);
