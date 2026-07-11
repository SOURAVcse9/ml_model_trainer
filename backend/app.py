import time
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from backend.schemas import PredictionRequest, PredictionResponse
from backend.predict import make_prediction

app = FastAPI(
    title="HealthPlus Heart Disease API",
    description="Production-ready FastAPI backend for Cleveland Heart Disease Risk assessment using Naive Bayes.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local testing and cross-origin calls
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers for request validation formatting
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    errors = []
    for error in exc.errors():
        field = " -> ".join([str(x) for x in error.get("loc", [])])
        msg = error.get("msg")
        errors.append(f"Field '{field}': {msg}")
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Input validation failed.", "errors": errors}
    )

@app.get("/", tags=["General"])
async def root():
    return {
        "status": "online",
        "service": "HealthPlus Heart Diagnostics API",
        "model": "Naive Bayes (GaussianNB)"
    }

@app.post("/api/predict", response_model=PredictionResponse, tags=["Diagnostics"])
async def predict_heart_disease(payload: PredictionRequest):
    """
    Evaluates patient cardiac parameters using the preprocessed Naive Bayes pipeline.
    """
    t0 = time.time()
    try:
        data = payload.model_dump()
        result = make_prediction(data)
        
        # Calculate training/inference latency trace (simulated benchmark indicator)
        inference_time_ms = round((time.time() - t0) * 1000, 2)
        
        return result
    except FileNotFoundError as fnf:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(fnf)
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference execution failed: {str(e)}"
        )
