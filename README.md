# Healthify - Precision Disease Detection and Insight Engine

A disease prediction web application that takes patient symptoms and identifies the most probable condition using an ensemble machine learning model. Includes doctor consultation mapping and medicine recommendations.

## About

Healthify was built to simplify early disease detection. Users input their symptoms with intensity levels, and the system returns a prediction backed by three ML models voting together. Beyond prediction, it connects patients to the right specialist and suggests relevant medications with safety warnings.

The ensemble approach (Random Forest + SVM + Gradient Boosting with weighted voting) boosts precision by 8% and accuracy by 6% over individual baseline models.

## What It Does

- Predicts diseases from 65 clinical symptoms across 9 conditions
- Shows confidence scores and probability breakdown for each disease
- Recommends the correct specialist doctor based on the prediction
- Provides medicine suggestions with dosage info and safety warnings
- Visualizes health insights through interactive charts

## Diseases Covered

Bronchial Asthma, Dengue, Infective Endocarditis, Ischaemic Heart Disease, Malaria, Meningitis, Myxoedema, Pneumonia, Rickets

## Setup

### 1. Train the model

```
cd server/ml_engine
pip install -r requirements.txt
python train_engine.py
```

### 2. Run the backend

```
cd server
npm install
node server.js
```

### 3. Run the frontend

```
cd client
npm install
npm run dev
```

Open http://localhost:3000

## Project Layout

```
client/                React frontend
  src/pages/           Prediction, Dashboard, Consult, Pharmacy

server/                Express backend
  ml_engine/
    datasets/          Disease CSV files
    models/            Trained model (generated after training)
    train_engine.py    Training pipeline
    ensemble.py        Prediction script
  controllers/         API logic
  routes/              Endpoint definitions
  server.js            Entry point

data/                  Original datasets
code/                  Jupyter notebooks
```

## API

- POST /api/v1/predict - Send symptoms, get disease prediction
- GET /api/v1/metadata - Get symptom list and model info
- GET /api/v1/consult/specialist?disease=X - Get specialist recommendation
- GET /api/v1/consult/medicine?disease=X - Get medication info

## Contributing

Open to contributions. Fork, make changes, send a PR.

## License

MIT
