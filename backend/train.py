import os
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.naive_bayes import GaussianNB

def train_pipeline():
    print("Starting Model Training Pipeline...")
    
    # 1. Load the dataset
    csv_path = os.path.join(os.path.dirname(__file__), "..", "heart.csv")
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Source file {csv_path} not found.")
    
    df = pd.read_csv(csv_path)
    print(f"Loaded dataset shape: {df.shape}")
    
    # 2. Missing Value Imputation Safeguard
    numerical_features = ['age', 'trestbps', 'chol', 'thalach', 'oldpeak']
    categorical_features = ['sex', 'cp', 'fbs', 'restecg', 'exang', 'slope', 'ca', 'thal']
    
    for col in numerical_features:
        if df[col].isnull().any():
            df[col] = df[col].fillna(df[col].median())
            
    for col in categorical_features:
        if df[col].isnull().any():
            df[col] = df[col].fillna(df[col].mode()[0])
            
    # 3. Remove duplicates
    df_clean = df.drop_duplicates().reset_index(drop=True)
    print(f"Shape after duplicate removal: {df_clean.shape}")
    
    # 4. Outlier treatment (IQR Capping)
    def cap_outliers_iqr(frame, columns, factor=1.5):
        frame = frame.copy()
        for col in columns:
            q1 = frame[col].quantile(0.25)
            q3 = frame[col].quantile(0.75)
            iqr = q3 - q1
            lower = q1 - factor * iqr
            upper = q3 + factor * iqr
            frame[col] = frame[col].clip(lower, upper)
        return frame
        
    df_clean = cap_outliers_iqr(df_clean, numerical_features)
    
    # 5. Feature Engineering
    df_fe = df_clean.copy()
    
    # Age brackets
    df_fe['age_group'] = pd.cut(
        df_fe['age'], 
        bins=[0, 40, 50, 60, 100], 
        labels=['<40', '40-50', '50-60', '60+']
    )
    
    # BP category
    df_fe['bp_category'] = pd.cut(
        df_fe['trestbps'], 
        bins=[0, 120, 130, 140, 300], 
        labels=['normal', 'elevated', 'stage1_htn', 'stage2_htn']
    )
    
    # Cholesterol category
    df_fe['chol_category'] = pd.cut(
        df_fe['chol'], 
        bins=[0, 200, 240, 700], 
        labels=['desirable', 'borderline', 'high']
    )
    
    # Composite risk score
    df_fe['risk_score'] = (
        (df_fe['age'] > 55).astype(int) + 
        df_fe['sex'] + 
        df_fe['exang'] + 
        (df_fe['oldpeak'] > 1.0).astype(int) + 
        (df_fe['ca'] > 0).astype(int) + 
        (df_fe['thal'] == 3).astype(int)
    )
    
    # Interaction term
    df_fe['age_thalach_interaction'] = df_fe['age'] * ((220 - df_fe['age']) - df_fe['thalach'])
    
    # Log transform oldpeak
    df_fe['oldpeak_log'] = np.log1p(df_fe['oldpeak'])
    
    # 6. One-hot encoding nominal variables
    nominal_for_model = ['cp', 'restecg', 'slope', 'thal', 'age_group', 'bp_category', 'chol_category']
    df_model = pd.get_dummies(df_fe, columns=nominal_for_model, drop_first=True)
    
    print(f"Feature matrix shape after one-hot encoding: {df_model.shape}")
    
    # 7. Split data
    X = df_model.drop(columns=['target'])
    y = df_model['target']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, 
        test_size=0.2, 
        random_state=42, 
        stratify=y
    )
    
    # 8. Feature Scaling
    scale_cols_final = ['age', 'trestbps', 'chol', 'thalach', 'oldpeak', 'oldpeak_log', 'risk_score', 'age_thalach_interaction']
    scaler = StandardScaler()
    
    # Fit scaler only on train
    X_train_scaled = X_train.copy()
    X_train_scaled[scale_cols_final] = scaler.fit_transform(X_train[scale_cols_final])
    
    # 9. Train best model (Naive Bayes / GaussianNB)
    model = GaussianNB()
    model.fit(X_train_scaled, y_train)
    
    # 10. Save artifacts
    models_dir = os.path.join(os.path.dirname(__file__), "models")
    os.makedirs(models_dir, exist_ok=True)
    
    joblib.dump(model, os.path.join(models_dir, "saved_model.pkl"))
    joblib.dump(scaler, os.path.join(models_dir, "saved_scaler.pkl"))
    joblib.dump(list(X.columns), os.path.join(models_dir, "saved_features.pkl"))
    
    # Also save metadata/config lists
    metadata = {
        "nominal_for_model": nominal_for_model,
        "scale_cols_final": scale_cols_final,
        "numerical_features": numerical_features
    }
    joblib.dump(metadata, os.path.join(models_dir, "saved_pipeline.pkl"))
    
    print(f"Artifacts successfully written to: {models_dir}")
    print(f"Trained Naive Bayes model features list length: {len(X.columns)}")

if __name__ == "__main__":
    train_pipeline()
