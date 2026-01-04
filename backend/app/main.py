"""
FastAPI application for Psychiatric Disorder Detection.

This API provides:
- Health check endpoint
- Prediction endpoint for mental health screening

Note: This tool is for educational purposes only and is NOT a medical diagnosis.
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .schemas import PredictionRequest, PredictionResponse, HealthResponse
from .model import model_manager

# Configure logging
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load model on startup."""
    print("Starting up... Loading model...")
    success = model_manager.load()
    if not success:
        print("WARNING: Model failed to load. Predictions will not work.")
        print("Please run 'python ml/train.py' first to train and save the model.")
    yield
    print("Shutting down...")


app = FastAPI(
    title="Psychiatric Disorder Detection API",
    description="""
    An ML-powered API for screening psychiatric disorder indicators based on the DASS-42 questionnaire.
    
    ## ⚠️ Important Disclaimer
    
    This tool is for **educational and informational purposes only**. It is NOT a medical diagnosis.
    If you are experiencing mental health concerns, please consult a qualified mental health professional.
    
    ## How it works
    
    1. Submit responses to 30 questions from the DASS-42 questionnaire
    2. Each response should be 1-4 based on how much it applied to you in the past week
    3. The model returns a severity classification and confidence score
    
    ## Response Scale
    
    - **1**: Did not apply to me at all
    - **2**: Applied to me to some degree, or some of the time
    - **3**: Applied to me to a considerable degree, or a good part of the time
    - **4**: Applied to me very much, or most of the time
    """,
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # Local Next.js dev
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"^https://.*\.vercel\.app$",  # Vercel deployments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Check if the API is running and model is loaded."""
    return HealthResponse(
        status="healthy" if model_manager.is_loaded else "degraded",
        model_loaded=model_manager.is_loaded,
        version="1.0.0"
    )


@app.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
async def predict(request: PredictionRequest):
    """
    Make a prediction based on questionnaire responses.
    
    Submit answers to all 30 questions (values 1-4) and receive:
    - Predicted severity level (None/Mild/Moderate/Severe)
    - Confidence score
    - Probability distribution across all classes
    - Personalized description and recommendations
    
    ## Example Request
    
    ```json
    {
        "q1": 2, "q2": 1, "q3": 1, "q4": 2, "q5": 1,
        "q6": 2, "q7": 1, "q8": 1, "q9": 2, "q10": 1,
        "q11": 1, "q12": 1, "q13": 2, "q14": 1, "q15": 1,
        "q16": 2, "q17": 1, "q18": 2, "q19": 1, "q20": 1,
        "q21": 2, "q22": 1, "q23": 1, "q24": 2, "q25": 1,
        "q26": 1, "q27": 1, "q28": 2, "q29": 1, "q30": 1
    }
    ```
    """
    if not model_manager.is_loaded:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Please run training script first."
        )
    
    try:
        # Convert request to feature array
        features = request.to_feature_array()
        
        # Get prediction
        class_id, confidence, probabilities = model_manager.predict(features)
        
        # Build response
        return PredictionResponse(
            prediction=model_manager.get_class_label(class_id),
            severity_level=class_id,
            confidence=round(confidence, 4),
            probabilities={k: round(v, 4) for k, v in probabilities.items()},
            description=model_manager.get_class_description(class_id)
        )
        
    except ValueError as e:
        logger.warning(f"Validation error: {e}")
        raise HTTPException(status_code=400, detail="Invalid input data. Please check your responses.")
    except Exception as e:
        logger.error(f"Prediction failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An error occurred while processing your request. Please try again.")


# OpenAPI customization for better docs
app.openapi_tags = [
    {
        "name": "Health",
        "description": "Health check and status endpoints"
    },
    {
        "name": "Prediction", 
        "description": "Mental health screening prediction endpoints"
    }
]
