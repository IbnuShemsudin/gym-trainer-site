const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  membershipPlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'MembershipPlan', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'ETB' },
  paymentMethod: { type: String, enum: ['cash', 'card', 'bank_transfer', 'cheque', 'other'], default: 'cash' },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'completed' },
  
  // Payment details
  transactionId: { type: String, unique: true },
  paymentDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
  
  // Membership dates
  membershipStartDate: { type: Date },
  membershipExpiryDate: { type: Date },
  
  // Notes
  notes: { type: String },
  receiptNumber: { type: String, unique: true },
  
  // Who recorded it
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
