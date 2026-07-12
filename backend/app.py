import time
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from schemas import PredictionRequest, PredictionResponse;
from predict import make_prediction;

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

import os
import logging

# Configure logger
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("healthplus_api")

@app.get("/", tags=["General"])
async def root():
    logger.info("Root endpoint queried.")
    return {
        "status": "online",
        "service": "HealthPlus Heart Diagnostics API",
        "model": "Naive Bayes (GaussianNB)"
    }

@app.get("/api/health", tags=["General"])
async def health_check():
    logger.info("Health check endpoint queried.")
    # Check if model pipeline files exist
    from predict import MODEL_PATH
    model_state = "loaded" if MODEL_PATH.exists() else "missing"
    return {
        "status": "running",
        "model": model_state,
        "backend": "online"
    }

@app.post("/api/predict", response_model=PredictionResponse, tags=["Diagnostics"])
async def predict_heart_disease(payload: PredictionRequest):
    """
    Evaluates patient cardiac parameters using the preprocessed Naive Bayes pipeline.
    """
    logger.info("Diagnostics predict request received.")
    t0 = time.time()
    try:
        data = payload.model_dump()
        logger.info(f"Intake parameters: {data}")
        logger.info("Prediction started using Naive Bayes classifier...")
        result = make_prediction(data)
        
        inference_time_ms = round((time.time() - t0) * 1000, 2)
        logger.info(f"Prediction finished successfully. Execution time: {inference_time_ms}ms")
        
        return result
    except FileNotFoundError as fnf:
        logger.error(f"Prediction aborted: model artifacts missing. Details: {str(fnf)}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(fnf)
        )
    except ValueError as ve:
        logger.error(f"Prediction aborted: validation parameter boundaries mismatch. Details: {str(ve)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        logger.error(f"Internal predict handler error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference execution failed: {str(e)}"
        )
