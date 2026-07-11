from pydantic import BaseModel, Field, field_validator
from typing import List

class PredictionRequest(BaseModel):
    age: int = Field(..., description="Age in years", example=55)
    sex: int = Field(..., description="Sex (1 = male; 0 = female)", example=1)
    cp: int = Field(..., description="Chest pain type (0-3)", example=2)
    trestbps: int = Field(..., description="Resting blood pressure in mmHg", example=140)
    chol: int = Field(..., description="Serum cholesterol in mg/dl", example=250)
    fbs: int = Field(..., description="Fasting blood sugar > 120 mg/dl (1 = true; 0 = false)", example=0)
    restecg: int = Field(..., description="Resting electrocardiographic results (0-2)", example=1)
    thalach: int = Field(..., description="Maximum heart rate achieved", example=150)
    exang: int = Field(..., description="Exercise induced angina (1 = yes; 0 = no)", example=0)
    oldpeak: float = Field(..., description="ST depression induced by exercise relative to rest", example=1.2)
    slope: int = Field(..., description="Slope of peak exercise ST segment (0-2)", example=2)
    ca: int = Field(..., description="Number of major vessels (0-4) colored by fluoroscopy", example=0)
    thal: int = Field(..., description="Thalassemia (0-3)", example=2)

    @field_validator('age')
    @classmethod
    def check_age(cls, v):
        if not (18 <= v <= 100):
            raise ValueError("Age must be between 18 and 100.")
        return v

    @field_validator('trestbps')
    @classmethod
    def check_bp(cls, v):
        if not (80 <= v <= 250):
            raise ValueError("Resting blood pressure must be between 80 and 250 mmHg.")
        return v

    @field_validator('chol')
    @classmethod
    def check_chol(cls, v):
        if not (100 <= v <= 700):
            raise ValueError("Serum cholesterol must be between 100 and 700 mg/dl.")
        return v

    @field_validator('oldpeak')
    @classmethod
    def check_oldpeak(cls, v):
        if not (0.0 <= v <= 10.0):
            raise ValueError("Oldpeak ST depression must be between 0.0 and 10.0.")
        return v

    @field_validator('thalach')
    @classmethod
    def check_hr(cls, v):
        if not (50 <= v <= 250):
            raise ValueError("Maximum heart rate must be between 50 and 250 bpm.")
        return v


class PredictionResponse(BaseModel):
    prediction: int
    probability: float
    risk_level: str
    confidence: float
    best_model: str
    recommendation: str
    top_features: List[str]
