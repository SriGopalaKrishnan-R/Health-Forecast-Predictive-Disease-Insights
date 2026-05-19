"""
Healthify Precision Disease Detection Engine - Training Pipeline
Ensemble: Random Forest + SVM + XGBoost (Weighted Voting Classifier)
"""

import os
import json
import warnings
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier, VotingClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import joblib

warnings.filterwarnings('ignore')

DATASET_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'datasets')
MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')

DISEASE_FILES = {
    'Bronchial Asthma': 'bronchial_asthma.csv',
    'Dengue': 'dengue.csv',
    'Infective Endocarditis': 'infective_endocarditis.csv',
    'Ischaemic Heart Disease': 'ischaemic_heart.csv',
    'Malaria': 'malaria.csv',
    'Meningitis': 'meningitis.csv',
    'Myxoedema': 'myxoedema.csv',
    'Pneumonia': 'pneumonia.csv',
    'Rickets': 'rickets.csv',
}


def load_and_merge_datasets():
    """Load all CSV files, normalize symptoms, merge into unified dataset."""
    all_symptoms = set()
    disease_data = {}

    for disease_name, filename in DISEASE_FILES.items():
        filepath = os.path.join(DATASET_DIR, filename)
        df = pd.read_csv(filepath)
        columns = list(df.columns)
        symptom_cols = columns[:-1]
        label_col = columns[-1]
        all_symptoms.update(symptom_cols)
        disease_data[disease_name] = {
            'df': df,
            'symptom_cols': symptom_cols,
            'label_col': label_col
        }

    all_symptoms = sorted(list(all_symptoms))
    print(f"[INFO] Total unique symptoms across all diseases: {len(all_symptoms)}")
    print(f"[INFO] Symptoms: {all_symptoms}")

    merged_rows = []

    for disease_name, data in disease_data.items():
        df = data['df']
        symptom_cols = data['symptom_cols']
        label_col = data['label_col']

        positive_samples = df[df[label_col] == 1]

        for _, row in positive_samples.iterrows():
            symptom_values = {}
            for symptom in all_symptoms:
                if symptom in symptom_cols:
                    symptom_values[symptom] = row[symptom]
                else:
                    symptom_values[symptom] = 0
            symptom_values['disease'] = disease_name
            merged_rows.append(symptom_values)

    merged_df = pd.DataFrame(merged_rows)
    merged_df[all_symptoms] = merged_df[all_symptoms].fillna(0).astype(float)

    print(f"[INFO] Total positive samples in merged dataset: {len(merged_df)}")
    print(f"[INFO] Disease distribution:")
    print(merged_df['disease'].value_counts().to_string())

    return merged_df, all_symptoms


def build_ensemble(X_train, y_train):
    """Build Weighted Voting Classifier: RF + SVM + XGBoost."""
    rf_clf = RandomForestClassifier(
        n_estimators=200,
        max_depth=15,
        min_samples_split=5,
        random_state=42,
        n_jobs=-1
    )

    svm_clf = SVC(
        kernel='rbf',
        C=10,
        gamma='scale',
        probability=True,
        random_state=42
    )

    xgb_clf = GradientBoostingClassifier(
        n_estimators=200,
        max_depth=5,
        learning_rate=0.1,
        subsample=0.8,
        random_state=42
    )

    ensemble = VotingClassifier(
        estimators=[
            ('rf', rf_clf),
            ('svm', svm_clf),
            ('xgb', xgb_clf)
        ],
        voting='soft',
        weights=[2, 1, 3]  # XGBoost weighted highest for precision
    )

    print("[INFO] Training ensemble model (RF + SVM + XGBoost)...")
    ensemble.fit(X_train, y_train)
    return ensemble


def evaluate_model(model, X_test, y_test, label_encoder):
    """Evaluate and report model performance."""
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(
        y_test, y_pred,
        target_names=label_encoder.classes_,
        output_dict=True
    )
    print(f"\n[RESULT] Ensemble Accuracy: {accuracy * 100:.2f}%")
    print(f"\n[REPORT] Classification Report:")
    print(classification_report(y_test, y_pred, target_names=label_encoder.classes_))
    return accuracy, report


def evaluate_baseline(X_train, y_train, X_test, y_test):
    """Train baseline models for comparison."""
    baselines = {}

    rf_base = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_base.fit(X_train, y_train)
    baselines['Random Forest (baseline)'] = accuracy_score(y_test, rf_base.predict(X_test))

    svm_base = SVC(kernel='rbf', probability=True, random_state=42)
    svm_base.fit(X_train, y_train)
    baselines['SVM (baseline)'] = accuracy_score(y_test, svm_base.predict(X_test))

    xgb_base = GradientBoostingClassifier(n_estimators=100, random_state=42)
    xgb_base.fit(X_train, y_train)
    baselines['XGBoost (baseline)'] = accuracy_score(y_test, xgb_base.predict(X_test))

    print("\n[BASELINES]")
    for name, acc in baselines.items():
        print(f"  {name}: {acc * 100:.2f}%")

    return baselines


def main():
    os.makedirs(MODEL_DIR, exist_ok=True)

    print("=" * 60)
    print("  HEALTHIFY - Precision Disease Detection Engine")
    print("  Training Pipeline v1.0")
    print("=" * 60)

    merged_df, all_symptoms = load_and_merge_datasets()

    X = merged_df[all_symptoms].values
    y = merged_df['disease'].values

    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )

    print(f"\n[INFO] Training set: {len(X_train)} samples")
    print(f"[INFO] Test set: {len(X_test)} samples")

    baselines = evaluate_baseline(X_train, y_train, X_test, y_test)

    ensemble = build_ensemble(X_train, y_train)
    ensemble_acc, report = evaluate_model(ensemble, X_test, y_test, label_encoder)

    best_baseline = max(baselines.values())
    boost = (ensemble_acc - best_baseline) * 100
    print(f"\n[PRECISION BOOST] +{boost:.2f}% over best baseline ({best_baseline*100:.2f}%)")

    cv_scores = cross_val_score(ensemble, X_scaled, y_encoded, cv=5, scoring='accuracy')
    print(f"[CROSS-VAL] 5-Fold CV Accuracy: {cv_scores.mean()*100:.2f}% (+/- {cv_scores.std()*100:.2f}%)")

    joblib.dump(ensemble, os.path.join(MODEL_DIR, 'ensemble_model.joblib'))
    joblib.dump(scaler, os.path.join(MODEL_DIR, 'scaler.joblib'))
    joblib.dump(label_encoder, os.path.join(MODEL_DIR, 'label_encoder.joblib'))

    metadata = {
        'symptoms': all_symptoms,
        'diseases': list(label_encoder.classes_),
        'ensemble_accuracy': float(ensemble_acc),
        'baseline_best': float(best_baseline),
        'precision_boost': float(boost),
        'cv_mean': float(cv_scores.mean()),
        'cv_std': float(cv_scores.std()),
        'model_weights': {'rf': 2, 'svm': 1, 'xgb': 3},
        'total_samples': len(merged_df),
        'report': report
    }

    with open(os.path.join(MODEL_DIR, 'model_metadata.json'), 'w') as f:
        json.dump(metadata, f, indent=2)

    print(f"\n[SAVED] Model artifacts saved to: {MODEL_DIR}")
    print("[DONE] Training complete.")


if __name__ == '__main__':
    main()
