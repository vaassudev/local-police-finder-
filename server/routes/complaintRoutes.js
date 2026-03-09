const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { protect, admin } = require('../middleware/authMiddleware');
const sendEmail = require('../utils/mailService');

// Create a complaint
router.post('/', async (req, res) => {
  try {
    const complaint_id = 'CMP-' + Date.now();
    const complaint = await Complaint.create({ ...req.body, complaint_id });

    // Send confirmation email
    const emailMessage = `
      Dear ${complaint.name},

      Your official complaint has been successfully registered with the Tamil Nadu Police Digital Portal.
      
      Docket Reference ID: ${complaint.complaint_id}
      Category: ${complaint.category}
      Submission Date: ${new Date().toLocaleString()}

      You can track the status of your complaint using your Reference ID.

      This is an automated message. Please do not reply.
    `;

    const emailHtml = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px;">
        <h2 style="color: #1e1b4b;">Complaint Registered Successfully</h2>
        <p>Dear <strong>${complaint.name}</strong>,</p>
        <p>Your official complaint has been securely logged and assigned a priority tracking ID.</p>
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Docket Reference:</strong> <span style="color: #b91c1c;">${complaint.complaint_id}</span></p>
          <p style="margin: 5px 0;"><strong>Category:</strong> ${complaint.category}</p>
          <p style="margin: 5px 0;"><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <p>Our administrative team will review your grievance and update the status shortly.</p>
        <p style="font-size: 12px; color: #64748b; margin-top: 30px;">© 2026 Tamil Nadu Police Digital Division. This is an automated notification.</p>
      </div>
    `;

    await sendEmail({
      email: complaint.email,
      subject: `Complaint Registered: ${complaint.complaint_id}`,
      message: emailMessage,
      html: emailHtml
    });

    res.status(201).json(complaint);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a specific complaint
router.get('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ complaint_id: req.params.id });
    if (complaint) res.json(complaint);
    else res.status(404).json({ message: 'Complaint not found' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Get all complaints
router.get('/', protect, admin, async (req, res) => {
  try {
    const complaints = await Complaint.find({});
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Update complaint status
router.put('/status/:id', protect, admin, async (req, res) => {
  try {
    const complaint = await Complaint.findOneAndUpdate({ complaint_id: req.params.id }, { status: req.body.status }, { new: true });
    if (complaint) res.json(complaint);
    else res.status(404).json({ message: 'Complaint not found' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
