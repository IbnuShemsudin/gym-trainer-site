const mongoose = require('mongoose');

const membershipPlanSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., 'Monthly Basic', 'Quarterly Premium'
  duration: { type: Number, required: true }, // in days
  price: { type: Number, required: true }, // in currency units
  currency: { type: String, default: 'ETB' },
  description: { type: String },
  features: [{ type: String }], // e.g., ['Gym access', 'Pool access', 'Personal training']
  maxTrainingSessions: { type: Number },
  discountPercentage: { type: Number, default: 0 },
  
  // Plan type
  planType: { type: String, enum: ['monthly', 'quarterly', 'annual', 'custom'], default: 'monthly' },
  
  // Status
  isActive: { type: Boolean, default: true },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MembershipPlan', membershipPlanSchema);
