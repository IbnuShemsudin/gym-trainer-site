const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  checkInTime: { type: Date, required: true, default: Date.now },
  checkOutTime: { type: Date },
  duration: { type: Number }, // in minutes
  checkInMethod: { type: String, enum: ['qr_code', 'rfid', 'manual', 'app'], default: 'manual' },
  qrCodeData: { type: String },
  notes: { type: String },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Status
  status: { type: String, enum: ['checked_in', 'checked_out', 'no_show'], default: 'checked_in' },
  
  createdAt: { type: Date, default: Date.now }
});

// Index for finding attendance by member and date
attendanceSchema.index({ memberId: 1, checkInTime: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
