const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const predictionRoutes = require('./routes/predictionRoutes');
const consultRoutes = require('./routes/consultRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1', predictionRoutes);
app.use('/api/v1/consult', consultRoutes);

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'healthy', engine: 'Healthify Precision Engine v1.0' });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
  });
}

const startServer = async () => {
  if (process.env.MONGO_URI) {
    await connectDB();
  } else {
    console.log('[DB] No MONGO_URI set - running without database');
  }

  app.listen(PORT, () => {
    console.log(`\n[SERVER] Healthify API running on http://localhost:${PORT}`);
    console.log(`[SERVER] Prediction endpoint: POST /api/v1/predict`);
    console.log(`[SERVER] Health check: GET /api/v1/health\n`);
  });
};

startServer();
