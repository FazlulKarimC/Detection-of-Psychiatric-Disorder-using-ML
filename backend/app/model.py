"""
Model loading and inference module.
"""

import json
import logging
from pathlib import Path
from typing import Tuple, Dict, Optional

import numpy as np
import joblib

# Configure logging
logger = logging.getLogger(__name__)

# Load shared configuration (single source of truth)
# Check multiple paths for Docker deployment flexibility
_config_paths = [
    Path(__file__).parent.parent.parent / "shared_config.json",  # Local dev
    Path("/app/shared_config.json"),  # Docker root
    Path(__file__).parent.parent / "shared_config.json",  # Backend root
]

_config = None
for _config_path in _config_paths:
    if _config_path.exists():
        try:
            with open(_config_path, 'r') as f:
                _config = json.load(f)
            logger.info(f"Loaded configuration from {_config_path}")
            break
        except Exception as e:
            logger.warning(f"Failed to load config from {_config_path}: {e}")

if _config:
    CLASS_LABELS = {int(k): v for k, v in _config["class_labels"].items()}
    CLASS_DESCRIPTIONS = {int(k): v for k, v in _config["class_descriptions"].items()}
else:
    # Fallback to hardcoded values if config not found (OK for Docker deployment)
    logger.info("Using default class labels and descriptions")
    CLASS_LABELS = {
        0: "None",
        1: "Mild",
        2: "Moderate", 
        3: "Severe"
    }
    CLASS_DESCRIPTIONS = {
        0: "No significant indicators of psychiatric distress detected.",
        1: "Mild indicators detected. Consider self-care practices and monitoring.",
        2: "Moderate indicators detected. We recommend consulting with a mental health professional.",
        3: "Severe indicators detected. We strongly recommend seeking professional help immediately."
    }


class ModelManager:
    """Manages the ML model lifecycle."""
    
    def __init__(self):
        self.model = None
        self.scaler = None  # StandardScaler for feature scaling
        self.feature_names = None
        self.is_loaded = False
    
    def load(self, model_path: Optional[Path] = None) -> bool:
        """Load the trained model and feature names.
        
        Args:
            model_path: Path to model file. If None, uses default location.
            
        Returns:
            True if model loaded successfully, False otherwise.
        """
        if model_path is None:
            # Default path relative to this file
            model_path = Path(__file__).parent.parent / "models" / "psychiatric_model.joblib"
        
        features_path = model_path.parent / "feature_names.json"
        
        try:
            # Load model
            if not model_path.exists():
                logger.error(f"Model file not found: {model_path}")
                return False
            
            self.model = joblib.load(model_path)
            logger.info(f"Model loaded from: {model_path}")
            
            # Load feature names
            if features_path.exists():
                with open(features_path, 'r') as f:
                    self.feature_names = json.load(f)
                logger.info(f"Loaded {len(self.feature_names)} feature names")
            else:
                # Use default feature order
                self.feature_names = [f"q{i}" for i in range(1, 31)]
                logger.warning("Using default feature names")
            
            # Load scaler (optional - model works without it)
            scaler_path = model_path.parent / "scaler.joblib"
            if scaler_path.exists():
                self.scaler = joblib.load(scaler_path)
                logger.info(f"Scaler loaded from: {scaler_path}")
            else:
                self.scaler = None
                logger.info("No scaler found - using raw features")
            
            self.is_loaded = True
            return True
            
        except Exception as e:
            logger.error(f"Error loading model: {e}", exc_info=True)
            self.is_loaded = False
            return False
    
    def predict(self, features: list) -> Tuple[int, float, Dict[str, float]]:
        """Make a prediction using the loaded model.
        
        Args:
            features: List of 30 feature values (integers 1-4)
            
        Returns:
            Tuple of (predicted_class, confidence, probability_dict)
            
        Raises:
            RuntimeError: If model is not loaded
            ValueError: If features are invalid
        """
        if not self.is_loaded or self.model is None:
            raise RuntimeError("Model not loaded. Call load() first.")
        
        # Validate input
        if len(features) != 30:
            raise ValueError(f"Expected 30 features, got {len(features)}")
        
        for i, val in enumerate(features):
            if not isinstance(val, (int, float)) or val < 1 or val > 4:
                raise ValueError(f"Feature {i+1} must be between 1 and 4, got {val}")
        
        # Convert to numpy array
        X = np.array([features])
        
        # Apply scaler if available
        if self.scaler is not None:
            X = self.scaler.transform(X)
        
        # Get prediction
        prediction = int(self.model.predict(X)[0])
        
        # Get probabilities
        if hasattr(self.model, 'predict_proba'):
            probabilities = self.model.predict_proba(X)[0]
            confidence = float(max(probabilities))
            
            # Validate probability array length matches class labels
            if len(probabilities) != len(CLASS_LABELS):
                logger.error(
                    f"Probability length mismatch: got {len(probabilities)}, "
                    f"expected {len(CLASS_LABELS)}"
                )
                raise ValueError("Model output does not match expected class count")
            
            # Map to class labels
            prob_dict = {
                CLASS_LABELS[i].lower(): float(probabilities[i])
                for i in range(len(probabilities))
            }
        else:
            # Model doesn't support probability prediction
            confidence = 1.0
            prob_dict = {CLASS_LABELS[prediction].lower(): 1.0}
        
        return prediction, confidence, prob_dict
    
    def get_class_label(self, class_id: int) -> str:
        """Get human-readable label for class ID."""
        return CLASS_LABELS.get(class_id, f"Unknown ({class_id})")
    
    def get_class_description(self, class_id: int) -> str:
        """Get description for class ID."""
        return CLASS_DESCRIPTIONS.get(class_id, "No description available.")


# Global model manager instance
model_manager = ModelManager()
