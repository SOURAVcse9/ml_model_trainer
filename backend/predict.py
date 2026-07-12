import os
import joblib
import pandas as pd
from pathlib import Path
from utils import preprocess_single_input

# Path definitions using pathlib
BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR / "models"
MODEL_PATH = MODELS_DIR / "saved_model.pkl"
SCALER_PATH = MODELS_DIR / "saved_scaler.pkl"
FEATURES_PATH = MODELS_DIR / "saved_features.pkl"
PIPELINE_PATH = MODELS_DIR / "saved_pipeline.pkl"

# Global variables loaded on startup
_model = None
_scaler = None
_feature_columns = None
_pipeline_meta = None

def load_artifacts():
    global _model, _scaler, _feature_columns, _pipeline_meta
    if _model is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError("Trained model artifact not found. Please run train.py first.")
        _model = joblib.load(MODEL_PATH)
        _scaler = joblib.load(SCALER_PATH)
        _feature_columns = joblib.load(FEATURES_PATH)
        _pipeline_meta = joblib.load(PIPELINE_PATH)

def make_prediction(data: dict) -> dict:
    """
    Loads artifacts, preprocesses the raw clinical data, and runs Naive Bayes inference.
    """
    load_artifacts()
    
    # 1. Preprocess and scale the input data row
    df_row = preprocess_single_input(
        data=data,
        feature_columns=_feature_columns,
        scaler=_scaler,
        scale_cols_final=_pipeline_meta['scale_cols_final']
    )
    
    # 2. Compute prediction probability
    probs = _model.predict_proba(df_row)[0]
    prob_disease = probs[1] * 100.0  # Probability of target = 1
    
    prediction = int(_model.predict(df_row)[0])
    
    # 3. Determine clinical risk label and advice
    if prediction == 1:
        risk_level = "High Risk"
        recommendation = "Immediate cardiology consultation is recommended."
    else:
        risk_level = "Low Risk"
        recommendation = "Maintain heart-healthy diet, exercise regularly, and monitor baseline parameters biannually."
        
    # Statistical Confidence is the likelihood of the selected class
    confidence = max(probs) * 100.0
    
    # 4. Extract Top Contributing Risk Factors based on patient abnormal readings
    top_features = []
    if data['cp'] > 0:
        top_features.append("Chest Pain")
    if data['oldpeak'] > 1.0:
        top_features.append("ST Depression (Oldpeak)")
    if data['ca'] > 0:
        top_features.append("Fluoroscopy Vessels (CA)")
    if data['thal'] == 3:
        top_features.append("Thalassemia (Thal)")
    if data['thalach'] < 140:
        top_features.append("Max Heart Rate (Thalach)")
    if data['trestbps'] > 130:
        top_features.append("Blood Pressure")
    if data['chol'] > 240:
        top_features.append("Cholesterol")
    if data['age'] > 55:
        top_features.append("Patient Age")
        
    # Default fallback list if patient has perfectly clean metrics
    if not top_features:
        top_features = ["Age", "Resting Heart Rate", "Cholesterol"]
        
    return {
        "prediction": prediction,
        "probability": round(prob_disease, 2),
        "risk_level": risk_level,
        "confidence": round(confidence, 2),
        "best_model": "Naive Bayes",
        "recommendation": recommendation,
        "top_features": top_features[:5]
    }
