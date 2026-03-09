const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaint_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  evidence: { type: String },
  location: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Reviewed', 'Resolved'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
