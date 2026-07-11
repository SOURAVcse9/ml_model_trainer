# HealthPlus Heart Disease Prediction Backend

This directory contains the production-ready FastAPI backend for the Cleveland Heart Disease Prediction System. 

It replicates the exact data cleaning, duplicate-row suppression, outlier IQR clipping, feature engineering, categorical encoding, and feature scaling steps described in the Google Colab Notebook and Final Report.

The best model determined by ROC-AUC is **Naive Bayes (GaussianNB)** (ROC-AUC = 89.83%), which is saved and used for real-time predictions.

## Project Structure

```
backend/
├── app.py                # FastAPI server entry point (CORS and middleware)
├── predict.py            # Model loading and inference orchestration
├── train.py              # Cleaning, feature engineering, and model training script
├── utils.py              # Custom preprocessing pipeline functions
├── schemas.py            # Pydantic input/output schemas
├── requirements.txt      # Python dependencies list
└── models/               # Saved artifact store
    ├── saved_model.pkl
    ├── saved_scaler.pkl
    ├── saved_features.pkl
    └── saved_pipeline.pkl
```

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Train the Model**:
   Run the training pipeline script. This loads `heart.csv` from the parent directory, executes preprocessing, trains the Naive Bayes model, and exports the serialized picklers:
   ```bash
   python train.py
   ```

3. **Start the FastAPI Server**:
   Launch uvicorn on the default port:
   ```bash
   uvicorn app:app --host 127.0.0.1 --port 8000 --reload
   ```

## API Documentation

FastAPI automatically generates interactive Swagger API documentation when the server is running. You can access it at:
[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
