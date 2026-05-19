# Healthify — Precision Disease Detection Engine

> A high-precision disease prediction platform powered by a Weighted Voting Ensemble ML Engine (Random Forest + SVM + XGBoost), exposed via a Node.js Express API with a React.js frontend.

---

## Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        HEALTHIFY PLATFORM                              │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────────┐ │
│  │   React.js   │───▶│  Express.js  │───▶│   Python ML Engine       │ │
│  │   Frontend   │◀───│   REST API   │◀───│   (Ensemble Classifier)  │ │
│  │  (Vite+TW)   │    │  Port: 5000  │    │                          │ │
│  └──────────────┘    └──────┬───────┘    │  ┌─────┐ ┌─────┐ ┌────┐ │ │
│                              │            │  │ RF  │ │ SVM │ │XGB │ │ │
│                              ▼            │  │ w=2 │ │ w=1 │ │w=3 │ │ │
│                       ┌──────────────┐   │  └──┬──┘ └──┬──┘ └─┬──┘ │ │
│                       │   MongoDB    │   │     └───────┴───────┘    │ │
│                       │  (Optional)  │   │     Soft Voting Ensemble │ │
│                       └──────────────┘   └──────────────────────────┘ │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

## Ensemble Mathematics — Precision Boost Calculation

The engine uses **Weighted Soft Voting** to combine predictions:

```
P_final(disease_k) = Σ(w_i × P_i(disease_k)) / Σ(w_i)

Where:
  w_RF  = 2  (Random Forest — non-linear feature selection)
  w_SVM = 1  (Support Vector Machine — high-dimensional boundary)
  w_XGB = 3  (XGBoost — gradient-boosted precision optimization)

Final Prediction = argmax_k [ P_final(disease_k) ]
```

**Why This Works:**
- XGBoost (weight 3x) excels at learning subtle feature interactions
- Random Forest (weight 2x) handles noisy inputs and prevents overfitting
- SVM (weight 1x) provides high-dimensional decision boundaries
- Combined: the ensemble eliminates individual model weaknesses through democratic voting

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React.js (Vite) + Tailwind CSS + Bootstrap | Medical-grade UI |
| Backend | Node.js + Express.js | REST API gateway |
| ML Bridge | `child_process.execFile` | Python ↔ Node.js |
| ML Engine | scikit-learn + XGBoost | Ensemble classifier |
| Database | MongoDB (Mongoose) | User history & doctor data |
| Charts | Chart.js + react-chartjs-2 | Health analytics |

## Disease Coverage

| Disease | Key Symptoms | Specialist |
|---------|-------------|-----------|
| Bronchial Asthma | breathlessness, wheezing, cough | Pulmonologist |
| Dengue | high fever, muscle pain, rashes | Infectious Disease |
| Infective Endocarditis | fever, breathlessness, petechiae | Cardiologist |
| Ischaemic Heart Disease | chest pain, breathlessness, palpitation | Cardiologist |
| Malaria | recurrent fever, chills, sweating | Infectious Disease |
| Meningitis | decreased consciousness, neck stiffness | Neurologist |
| Myxoedema | puffy face, dry skin, lethargy | Endocrinologist |
| Pneumonia | high fever, breathlessness, cough | Pulmonologist |
| Rickets | delayed development, poor dentition, tetany | Orthopedics |

## Quick Start

### Prerequisites
- Node.js >= 18
- Python >= 3.9
- MongoDB (optional)

### 1. Train the ML Model

```bash
cd server/ml_engine
pip install -r requirements.txt
python train_engine.py
```

### 2. Start the Backend

```bash
cd server
npm install
npm run dev
```

### 3. Start the Frontend

```bash
cd client
npm install
npm run dev
```

### 4. Open in Browser

Navigate to `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/predict` | Run disease prediction |
| GET | `/api/v1/metadata` | Get model metadata & symptoms |
| GET | `/api/v1/consult/specialist?disease=X` | Get specialist recommendation |
| GET | `/api/v1/consult/medicine?disease=X` | Get medication info |
| GET | `/api/v1/health` | Health check |

### Example Request

```bash
curl -X POST http://localhost:5000/api/v1/predict \
  -H "Content-Type: application/json" \
  -d '{"symptoms": {"breathlessness": 75, "wheezing": 60, "chest pain": 40}}'
```

### Example Response

```json
{
  "success": true,
  "data": {
    "prediction": "Bronchial Asthma",
    "confidence": 83.09,
    "all_probabilities": {
      "Bronchial Asthma": 83.09,
      "Infective Endocarditis": 6.82,
      "Pneumonia": 4.80,
      "Ischaemic Heart Disease": 3.68
    },
    "reasoning": "Based on weighted voting ensemble (RF:2, SVM:1, XGBoost:3)..."
  }
}
```

## Project Structure

```
healthify-engine/
├── client/                     # React Vite Frontend
│   ├── src/
│   │   ├── components/         # Navbar, shared UI
│   │   ├── pages/              # Home, Prediction, Dashboard, Consult, Pharmacy
│   │   └── services/           # Axios API client
│   ├── package.json
│   └── vite.config.js
├── server/                     # Node.js Express Backend
│   ├── ml_engine/
│   │   ├── datasets/           # 9 disease CSV files
│   │   ├── models/             # Trained .joblib artifacts
│   │   ├── train_engine.py     # Training pipeline
│   │   ├── ensemble.py         # Prediction script (CLI)
│   │   └── requirements.txt
│   ├── controllers/            # predictionController, consultController
│   ├── routes/                 # REST route definitions
│   ├── models/                 # Mongoose schemas
│   ├── config/                 # Database config
│   ├── server.js               # Express app entry
│   └── package.json
├── .env.example
└── README.md
```

## Model Performance

- **Ensemble Accuracy:** 100% (on test set)
- **Cross-Validation:** 100% (5-Fold CV)
- **Total Symptoms:** 65 unique clinical features
- **Training Samples:** 3,363 positive samples
- **Diseases:** 9 clinical conditions

## License

MIT
