const { execFile } = require('child_process');
const path = require('path');
const Prediction = require('../models/Prediction');

const PYTHON_SCRIPT = path.join(__dirname, '..', 'ml_engine', 'ensemble.py');

const predictDisease = async (req, res) => {
  try {
    const { symptoms, userId } = req.body;

    if (!symptoms || Object.keys(symptoms).length === 0) {
      return res.status(400).json({ error: 'No symptoms provided' });
    }

    const symptomsJson = JSON.stringify(symptoms);

    execFile('python', [PYTHON_SCRIPT, symptomsJson], { timeout: 30000 }, async (error, stdout, stderr) => {
      if (error) {
        console.error('[Prediction Error]', stderr || error.message);
        return res.status(500).json({ error: 'Prediction engine failed', details: stderr || error.message });
      }

      try {
        const result = JSON.parse(stdout.trim());

        if (result.error) {
          return res.status(500).json({ error: result.error });
        }

        if (userId) {
          try {
            await Prediction.create({
              userId,
              symptoms,
              prediction: result.prediction,
              confidence: result.confidence,
              allProbabilities: result.all_probabilities,
              reasoning: result.reasoning
            });
          } catch (dbErr) {
            console.warn('[DB] Could not save prediction:', dbErr.message);
          }
        }

        res.json({
          success: true,
          data: result
        });
      } catch (parseError) {
        console.error('[Parse Error]', stdout);
        res.status(500).json({ error: 'Failed to parse prediction result' });
      }
    });
  } catch (err) {
    console.error('[Controller Error]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMetadata = (req, res) => {
  const metadataPath = path.join(__dirname, '..', 'ml_engine', 'models', 'model_metadata.json');
  try {
    const metadata = require(metadataPath);
    res.json({ success: true, data: metadata });
  } catch (err) {
    res.status(500).json({ error: 'Model metadata not found. Train the model first.' });
  }
};

const getPredictionHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const predictions = await Prediction.find({ userId }).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, data: predictions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch prediction history' });
  }
};

module.exports = { predictDisease, getMetadata, getPredictionHistory };
