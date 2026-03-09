const express = require('express');
const router = express.Router();
const Station = require('../models/Station');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all stations
router.get('/', async (req, res) => {
  try {
    const stations = await Station.find({});
    res.json(stations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Add a new station
router.post('/', protect, admin, async (req, res) => {
  try {
    const station = await Station.create(req.body);
    res.status(201).json(station);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Update a station
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const station = await Station.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (station) res.json(station);
    else res.status(404).json({ message: 'Station not found' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Delete a station
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const station = await Station.findByIdAndDelete(req.params.id);
    if (station) res.json({ message: 'Station removed' });
    else res.status(404).json({ message: 'Station not found' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
