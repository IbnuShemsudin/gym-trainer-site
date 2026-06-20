const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  profilePhoto: { type: String }, // URL to photo
  emergencyContact: { type: String },
  emergencyPhone: { type: String },
  
  // Membership details
  currentMembershipId: { type: mongoose.Schema.Types.ObjectId, ref: 'MembershipPlan' },
  membershipStartDate: { type: Date },
  membershipExpiryDate: { type: Date },
  membershipStatus: { type: String, enum: ['active', 'expired', 'suspended', 'inactive'], default: 'active' },
  
  // Trainer assignment
  assignedTrainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },
  
  // Fitness data
  height: { type: Number }, // in cm
  weight: { type: Number }, // in kg
  targetWeight: { type: Number },
  fitnessGoals: [{ type: String }], // e.g., ['weight loss', 'muscle gain']
  
  // Status
  isActive: { type: Boolean, default: true },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Member', memberSchema);
