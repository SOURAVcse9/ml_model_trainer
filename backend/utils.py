import numpy as np
import pandas as pd

def compute_risk_score(age: float, sex: int, exang: int, oldpeak: float, ca: int, thal: int) -> int:
    """
    Computes a composite Framingham-style risk score by summing 6 binary cardiological markers:
    - age > 55
    - male sex (1)
    - exercise-induced angina (1)
    - oldpeak > 1.0
    - vessel count colored by fluoroscopy (ca) > 0
    - thalassemia test result == 3
    """
    score = 0
    if age > 55:
        score += 1
    if sex == 1:
        score += 1
    if exang == 1:
        score += 1
    if oldpeak > 1.0:
        score += 1
    if ca > 0:
        score += 1
    if thal == 3:
        score += 1
    return score

def compute_age_group(age: float) -> str:
    if age <= 40:
        return '<40'
    elif age <= 50:
        return '40-50'
    elif age <= 60:
        return '50-60'
    else:
        return '60+'

def compute_bp_category(trestbps: float) -> str:
    if trestbps <= 120:
        return 'normal'
    elif trestbps <= 130:
        return 'elevated'
    elif trestbps <= 140:
        return 'stage1_htn'
    else:
        return 'stage2_htn'

def compute_chol_category(chol: float) -> str:
    if chol <= 200:
        return 'desirable'
    elif chol <= 240:
        return 'borderline'
    else:
        return 'high'

def preprocess_single_input(data: dict, feature_columns: list, scaler, scale_cols_final: list) -> pd.DataFrame:
    """
    Cleans, caps outliers, engineers features, encodes nominal variables, 
    aligns final columns, and scales the inputs to match the model training layout.
    """
    # 1. Clip continuous outliers using predefined Cleveland train thresholds:
    # age: Q1=48, Q3=61 -> iqr=13 -> lower=28.5, upper=80.5 (Capped at: Min=29, Max=77)
    # trestbps: Q1=120, Q3=140 -> iqr=20 -> lower=90, upper=170.
    # chol: Q1=211, Q3=275 -> iqr=64 -> lower=115, upper=371.
    # thalach: Q1=132, Q3=166 -> iqr=34 -> lower=81, upper=217.
    # oldpeak: Q1=0, Q3=1.8 -> iqr=1.8 -> lower=-2.7, upper=4.5.
    
    age = np.clip(data['age'], 29, 77)
    trestbps = np.clip(data['trestbps'], 90, 170)
    chol = np.clip(data['chol'], 115, 371)
    thalach = np.clip(data['thalach'], 81, 217)
    oldpeak = np.clip(data['oldpeak'], 0.0, 4.5)
    
    # 2. Extract and compute engineered features
    age_group = compute_age_group(age)
    bp_category = compute_bp_category(trestbps)
    chol_category = compute_chol_category(chol)
    risk_score = compute_risk_score(age, data['sex'], data['exang'], oldpeak, data['ca'], data['thal'])
    age_thalach_interaction = age * ((220 - age) - thalach)
    oldpeak_log = np.log1p(oldpeak)
    
    # 3. Build a base row DataFrame
    row = {
        'age': age,
        'sex': data['sex'],
        'trestbps': trestbps,
        'chol': chol,
        'fbs': data['fbs'],
        'thalach': thalach,
        'exang': data['exang'],
        'oldpeak': oldpeak,
        'ca': data['ca'],
        'risk_score': risk_score,
        'age_thalach_interaction': age_thalach_interaction,
        'oldpeak_log': oldpeak_log
    }
    
    # 4. Handle One-Hot encoding parameters (nominal categoricals check)
    # Add target nominal flags: cp, restecg, slope, thal, age_group, bp_category, chol_category
    nominals = {
        'cp': data['cp'],
        'restecg': data['restecg'],
        'slope': data['slope'],
        'thal': data['thal'],
        'age_group': age_group,
        'bp_category': bp_category,
        'chol_category': chol_category
    }
    
    # Map nominal levels to dummy columns (representing drop_first=True)
    # cp (0 baseline)
    for i in [1, 2, 3]:
        row[f'cp_{i}'] = 1 if nominals['cp'] == i else 0
        
    # restecg (0 baseline)
    for i in [1, 2]:
        row[f'restecg_{i}'] = 1 if nominals['restecg'] == i else 0
        
    # slope (0 baseline)
    for i in [1, 2]:
        row[f'slope_{i}'] = 1 if nominals['slope'] == i else 0
        
    # thal (0 baseline)
    for i in [1, 2, 3]:
        row[f'thal_{i}'] = 1 if nominals['thal'] == i else 0
        
    # age_group (<40 baseline)
    for lbl in ['40-50', '50-60', '60+']:
        row[f'age_group_{lbl}'] = 1 if nominals['age_group'] == lbl else 0
        
    # bp_category (normal baseline)
    for lbl in ['elevated', 'stage1_htn', 'stage2_htn']:
        row[f'bp_category_{lbl}'] = 1 if nominals['bp_category'] == lbl else 0
        
    # chol_category (desirable baseline)
    for lbl in ['borderline', 'high']:
        row[f'chol_category_{lbl}'] = 1 if nominals['chol_category'] == lbl else 0

    df_row = pd.DataFrame([row])
    
    # Reindex columns to match training features exactly (in case of order or missing levels)
    df_row = df_row.reindex(columns=feature_columns, fill_value=0)
    
    # 5. Apply fitting scale transformation to scale_cols_final columns
    df_row[scale_cols_final] = scaler.transform(df_row[scale_cols_final])
    
    return df_row
