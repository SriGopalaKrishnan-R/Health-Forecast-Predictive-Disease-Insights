"""
Healthify Precision Prediction Engine
Accepts symptom JSON via sys.argv, returns disease prediction with confidence scores.
Usage: python ensemble.py '{"breathlessness": 70, "fever": 80, ...}'
"""

import sys
import os
import json
import numpy as np
import joblib

MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')


def load_model():
    """Load trained ensemble model and preprocessing artifacts."""
    ensemble = joblib.load(os.path.join(MODEL_DIR, 'ensemble_model.joblib'))
    scaler = joblib.load(os.path.join(MODEL_DIR, 'scaler.joblib'))
    label_encoder = joblib.load(os.path.join(MODEL_DIR, 'label_encoder.joblib'))

    with open(os.path.join(MODEL_DIR, 'model_metadata.json'), 'r') as f:
        metadata = json.load(f)

    return ensemble, scaler, label_encoder, metadata


def predict(symptoms_input):
    """Run prediction on input symptoms."""
    ensemble, scaler, label_encoder, metadata = load_model()
    all_symptoms = metadata['symptoms']

    feature_vector = np.zeros(len(all_symptoms))
    for symptom, intensity in symptoms_input.items():
        symptom_lower = symptom.lower().strip()
        for i, s in enumerate(all_symptoms):
            if s.lower().strip() == symptom_lower:
                feature_vector[i] = float(intensity)
                break

    feature_vector = feature_vector.reshape(1, -1)
    feature_scaled = scaler.transform(feature_vector)

    prediction = ensemble.predict(feature_scaled)[0]
    probabilities = ensemble.predict_proba(feature_scaled)[0]

    predicted_disease = label_encoder.inverse_transform([prediction])[0]

    disease_probabilities = {}
    for i, disease in enumerate(label_encoder.classes_):
        disease_probabilities[disease] = round(float(probabilities[i]) * 100, 2)

    sorted_diseases = sorted(
        disease_probabilities.items(),
        key=lambda x: x[1],
        reverse=True
    )

    top_symptoms = []
    for symptom, intensity in symptoms_input.items():
        if float(intensity) > 0:
            top_symptoms.append({'symptom': symptom, 'intensity': float(intensity)})
    top_symptoms.sort(key=lambda x: x['intensity'], reverse=True)

    result = {
        'prediction': predicted_disease,
        'confidence': disease_probabilities[predicted_disease],
        'all_probabilities': dict(sorted_diseases),
        'top_symptoms': top_symptoms[:5],
        'model_accuracy': metadata['ensemble_accuracy'] * 100,
        'precision_boost': metadata['precision_boost'],
        'reasoning': f"Based on weighted voting ensemble (RF:2, SVM:1, XGBoost:3), "
                     f"the highest probability is {predicted_disease} at "
                     f"{disease_probabilities[predicted_disease]:.1f}% confidence. "
                     f"Key contributing symptoms: {', '.join([s['symptom'] for s in top_symptoms[:3]])}."
    }

    return result


def main():
    if len(sys.argv) < 2:
        error_result = {'error': 'No symptoms provided. Pass JSON as argument.'}
        print(json.dumps(error_result))
        sys.exit(1)

    try:
        symptoms_input = json.loads(sys.argv[1])
    except json.JSONDecodeError as e:
        error_result = {'error': f'Invalid JSON input: {str(e)}'}
        print(json.dumps(error_result))
        sys.exit(1)

    try:
        result = predict(symptoms_input)
        print(json.dumps(result))
    except Exception as e:
        error_result = {'error': f'Prediction failed: {str(e)}'}
        print(json.dumps(error_result))
        sys.exit(1)


if __name__ == '__main__':
    main()
