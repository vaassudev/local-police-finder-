const express = require('express');
const router = express.Router();
const EmergencyAlert = require('../models/EmergencyAlert');
const { protect, admin } = require('../middleware/authMiddleware');

// Create an emergency alert
router.post('/', async (req, res) => {
  try {
    const alert_id = 'EMG-' + Date.now();
    const alert = await EmergencyAlert.create({ ...req.body, alert_id });
    res.status(201).json(alert);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Get all emergency alerts
router.get('/', protect, admin, async (req, res) => {
  try {
    const alerts = await EmergencyAlert.find({}).sort({ timestamp: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Update alert status
router.put('/status/:id', protect, admin, async (req, res) => {
  try {
    const alert = await EmergencyAlert.findOneAndUpdate({ alert_id: req.params.id }, { status: req.body.status }, { new: true });
    if (alert) res.json(alert);
    else res.status(404).json({ message: 'Alert not found' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
