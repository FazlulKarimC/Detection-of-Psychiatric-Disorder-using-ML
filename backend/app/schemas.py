"""
Pydantic schemas for the Psychiatric Disorder Detection API.
"""

from typing import Dict, Optional
from pydantic import BaseModel, Field, field_validator


class PredictionRequest(BaseModel):
    """Request schema for prediction endpoint.
    
    Each field represents one of the 30 DASS-42 questions selected by RFE.
    Values must be between 1 and 4:
        1 = Did not apply to me at all
        2 = Applied to me to some degree
        3 = Applied to me to a considerable degree  
        4 = Applied to me very much
    """
    q1: int = Field(..., ge=1, le=4, description="I found myself getting upset by quite trivial things")
    q2: int = Field(..., ge=1, le=4, description="I couldn't seem to experience any positive feeling at all")
    q3: int = Field(..., ge=1, le=4, description="I experienced breathing difficulty")
    q4: int = Field(..., ge=1, le=4, description="I just couldn't seem to get going")
    q5: int = Field(..., ge=1, le=4, description="I had a feeling of shakiness")
    q6: int = Field(..., ge=1, le=4, description="I found it difficult to relax")
    q7: int = Field(..., ge=1, le=4, description="I found myself in anxious situations")
    q8: int = Field(..., ge=1, le=4, description="I felt that I had nothing to look forward to")
    q9: int = Field(..., ge=1, le=4, description="I found myself getting upset rather easily")
    q10: int = Field(..., ge=1, le=4, description="I felt that I was using a lot of nervous energy")
    q11: int = Field(..., ge=1, le=4, description="I felt sad and depressed")
    q12: int = Field(..., ge=1, le=4, description="I felt that I had lost interest in just about everything")
    q13: int = Field(..., ge=1, le=4, description="I felt I wasn't worth much as a person")
    q14: int = Field(..., ge=1, le=4, description="I felt scared without any good reason")
    q15: int = Field(..., ge=1, le=4, description="I felt that life wasn't worthwhile")
    q16: int = Field(..., ge=1, le=4, description="I found it hard to wind down")
    q17: int = Field(..., ge=1, le=4, description="I couldn't seem to get any enjoyment out of things")
    q18: int = Field(..., ge=1, le=4, description="I felt down-hearted and blue")
    q19: int = Field(..., ge=1, le=4, description="I found that I was very irritable")
    q20: int = Field(..., ge=1, le=4, description="I felt I was close to panic")
    q21: int = Field(..., ge=1, le=4, description="I found it hard to calm down after something upset me")
    q22: int = Field(..., ge=1, le=4, description="I feared being thrown by trivial tasks")
    q23: int = Field(..., ge=1, le=4, description="I found it difficult to tolerate interruptions")
    q24: int = Field(..., ge=1, le=4, description="I was in a state of nervous tension")
    q25: int = Field(..., ge=1, le=4, description="I felt I was pretty worthless")
    q26: int = Field(..., ge=1, le=4, description="I felt terrified")
    q27: int = Field(..., ge=1, le=4, description="I felt that life was meaningless")
    q28: int = Field(..., ge=1, le=4, description="I found myself getting agitated")
    q29: int = Field(..., ge=1, le=4, description="I was worried about situations in which I might panic")
    q30: int = Field(..., ge=1, le=4, description="I experienced trembling")

    def to_feature_array(self) -> list:
        """Convert request to feature array in correct order for model."""
        return [
            self.q1, self.q2, self.q3, self.q4, self.q5,
            self.q6, self.q7, self.q8, self.q9, self.q10,
            self.q11, self.q12, self.q13, self.q14, self.q15,
            self.q16, self.q17, self.q18, self.q19, self.q20,
            self.q21, self.q22, self.q23, self.q24, self.q25,
            self.q26, self.q27, self.q28, self.q29, self.q30
        ]

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "q1": 2, "q2": 1, "q3": 1, "q4": 2, "q5": 1,
                    "q6": 2, "q7": 1, "q8": 1, "q9": 2, "q10": 1,
                    "q11": 1, "q12": 1, "q13": 2, "q14": 1, "q15": 1,
                    "q16": 2, "q17": 1, "q18": 2, "q19": 1, "q20": 1,
                    "q21": 2, "q22": 1, "q23": 1, "q24": 2, "q25": 1,
                    "q26": 1, "q27": 1, "q28": 2, "q29": 1, "q30": 1
                }
            ]
        }
    }


class PredictionResponse(BaseModel):
    """Response schema for prediction endpoint."""
    prediction: str = Field(..., description="Human-readable prediction label (None/Mild/Moderate/Severe)")
    severity_level: int = Field(..., ge=0, le=3, description="Numeric severity class (0-3)")
    confidence: float = Field(..., ge=0, le=1, description="Confidence score for the prediction")
    probabilities: Dict[str, float] = Field(..., description="Probability distribution across all classes")
    description: str = Field(..., description="Description and recommendation for the severity level")
    disclaimer: str = Field(
        default="⚠️ This tool is for educational and informational purposes only. "
                "It is NOT a medical diagnosis. If you are experiencing mental health concerns, "
                "please consult a qualified mental health professional.",
        description="Important disclaimer about the tool's limitations"
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "prediction": "Mild",
                    "severity_level": 1,
                    "confidence": 0.68,
                    "probabilities": {
                        "none": 0.25,
                        "mild": 0.68,
                        "moderate": 0.05,
                        "severe": 0.02
                    },
                    "description": "Mild indicators detected. Consider self-care practices and monitoring.",
                    "disclaimer": "⚠️ This tool is for educational and informational purposes only..."
                }
            ]
        }
    }


class HealthResponse(BaseModel):
    """Response schema for health check endpoint."""
    status: str = Field(..., description="Service status")
    model_loaded: bool = Field(..., description="Whether the ML model is loaded")
    version: str = Field(default="1.0.0", description="API version")
