const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  station_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  phone: { type: String, required: true },
  officer_name: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Station', stationSchema);
