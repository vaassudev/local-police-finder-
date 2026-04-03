const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const { protect, admin } = require('../middleware/authMiddleware');

// Create a report
router.post('/', async (req, res) => {
  try {
    const report_id = 'REP-' + Date.now();
    const report = await Report.create({ ...req.body, report_id });
    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a specific report
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findOne({ report_id: req.params.id });
    if (report) res.json(report);
    else res.status(404).json({ message: 'Report not found' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Get all reports
router.get('/', protect, admin, async (req, res) => {
  try {
    const reports = await Report.find({});
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Update report status
router.put('/status/:id', protect, admin, async (req, res) => {
  try {
    const report = await Report.findOneAndUpdate({ report_id: req.params.id }, { status: req.body.status }, { new: true });
    if (report) res.json(report);
    else res.status(404).json({ message: 'Report not found' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Update report details
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const report = await Report.findOneAndUpdate(
      { report_id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (report) res.json(report);
    else res.status(404).json({ message: 'Report not found' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Delete report
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const report = await Report.findOneAndDelete({ report_id: req.params.id });
    if (report) res.json({ message: 'Report removed' });
    else res.status(404).json({ message: 'Report not found' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
