const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['membership_expiry', 'payment_reminder', 'announcement', 'appointment', 'progress_update', 'system'], default: 'system' },
  
  // Related data
  relatedMemberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  relatedWorkoutPlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkoutPlan' },
  relatedPaymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  
  // Status
  isRead: { type: Boolean, default: false },
  readAt: { type: Date },
  
  // Priority
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } // 30 days
});

// Auto-delete old notifications
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Notification', notificationSchema);
