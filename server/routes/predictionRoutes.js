const express = require('express');
const router = express.Router();
const { predictDisease, getMetadata, getPredictionHistory } = require('../controllers/predictionController');

router.post('/predict', predictDisease);
router.get('/metadata', getMetadata);
router.get('/history/:userId', getPredictionHistory);

module.exports = router;
