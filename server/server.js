const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/stations', require('./routes/stationRoutes'));
app.use('/api/report', require('./routes/reportRoutes'));
app.use('/api/complaint', require('./routes/complaintRoutes'));
app.use('/api/emergency', require('./routes/emergencyRoutes'));
app.use('/api/achievements', require('./routes/achievementRoutes'));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../client')));

// Any uncaught routes (that aren't API calls) return the frontend's index.html
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
