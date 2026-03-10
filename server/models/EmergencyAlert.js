const mongoose = require('mongoose');

const emergencyAlertSchema = new mongoose.Schema({
  alert_id: { type: String, required: true, unique: true },
  user_location: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  station_notified: { type: String },
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('EmergencyAlert', emergencyAlertSchema);
