const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  symptoms: { type: Map, of: Number, required: true },
  prediction: { type: String, required: true },
  confidence: { type: Number, required: true },
  allProbabilities: { type: Map, of: Number },
  reasoning: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prediction', predictionSchema);
