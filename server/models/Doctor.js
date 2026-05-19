const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  diseases: [{ type: String }],
  hospital: { type: String },
  contact: { type: String },
  availability: { type: String },
  rating: { type: Number, min: 0, max: 5 }
});

module.exports = mongoose.model('Doctor', doctorSchema);
