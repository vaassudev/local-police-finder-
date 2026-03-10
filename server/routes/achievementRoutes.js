const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Achievement = require('../models/Achievement');
const { protect, admin } = require('../middleware/authMiddleware');

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Make sure uploads/ directory exists
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ date: -1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching achievements', error: error.message });
  }
});

// @desc    Create an achievement
// @route   POST /api/achievements
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const imageUrl = `/${req.file.path.replace(/\\/g, '/')}`;

    const achievement = new Achievement({
      title,
      description,
      imageUrl
    });

    const savedAchievement = await achievement.save();
    res.status(201).json(savedAchievement);
  } catch (error) {
    res.status(500).json({ message: 'Server Error creating achievement', error: error.message });
  }
});

// @desc    Delete an achievement
// @route   DELETE /api/achievements/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    await achievement.deleteOne();
    res.json({ message: 'Achievement removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting achievement', error: error.message });
  }
});

module.exports = router;
