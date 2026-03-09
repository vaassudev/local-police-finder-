const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  report_id: { type: String, required: true, unique: true },
  incident_type: { type: String, required: true },
  description: { type: String, required: true },
  media_file: { type: String },
  location: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
