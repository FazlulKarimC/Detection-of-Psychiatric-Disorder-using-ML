"""
Configuration for the Psychiatric Disorder Detection ML model.
Contains question mappings, class labels, and training parameters.
"""

# Reproducibility seed - used across all random operations
RANDOM_STATE = 42

# Dataset configuration
KAGGLE_DATASET = "lucasgreenwell/depression-anxiety-stress-scales-responses"
DATA_FILENAME = "data.csv"

# The 30 features selected by RFE (Recursive Feature Elimination) from original study
# These are the answer columns (Q#A format) for the selected DASS-42 questions
SELECTED_FEATURES = [
    'Q1A', 'Q3A', 'Q4A', 'Q5A', 'Q7A', 'Q8A', 'Q9A', 'Q10A', 'Q11A', 'Q12A',
    'Q13A', 'Q16A', 'Q17A', 'Q20A', 'Q21A', 'Q22A', 'Q24A', 'Q26A', 'Q27A',
    'Q28A', 'Q29A', 'Q30A', 'Q32A', 'Q33A', 'Q34A', 'Q36A', 'Q38A', 'Q39A',
    'Q40A', 'Q41A'
]

# Mapping of feature columns to question text for the frontend
# Questions are from the DASS-42 (Depression Anxiety Stress Scales)
QUESTIONS = {
    'Q1A': "I found myself getting upset by quite trivial things.",
    'Q3A': "I couldn't seem to experience any positive feeling at all.",
    'Q4A': "I experienced breathing difficulty (e.g., excessively rapid breathing, breathlessness in the absence of physical exertion).",
    'Q5A': "I just couldn't seem to get going.",
    'Q7A': "I had a feeling of shakiness (e.g., legs going to give way).",
    'Q8A': "I found it difficult to relax.",
    'Q9A': "I found myself in situations that made me so anxious I was most relieved when they ended.",
    'Q10A': "I felt that I had nothing to look forward to.",
    'Q11A': "I found myself getting upset rather easily.",
    'Q12A': "I felt that I was using a lot of nervous energy.",
    'Q13A': "I felt sad and depressed.",
    'Q16A': "I felt that I had lost interest in just about everything.",
    'Q17A': "I felt I wasn't worth much as a person.",
    'Q20A': "I felt scared without any good reason.",
    'Q21A': "I felt that life wasn't worthwhile.",
    'Q22A': "I found it hard to wind down.",
    'Q24A': "I couldn't seem to get any enjoyment out of the things I did.",
    'Q26A': "I felt down-hearted and blue.",
    'Q27A': "I found that I was very irritable.",
    'Q28A': "I felt I was close to panic.",
    'Q29A': "I found it hard to calm down after something upset me.",
    'Q30A': "I feared that I would be 'thrown' by some trivial but unfamiliar task.",
    'Q32A': "I found it difficult to tolerate interruptions to what I was doing.",
    'Q33A': "I was in a state of nervous tension.",
    'Q34A': "I felt I was pretty worthless.",
    'Q36A': "I felt terrified.",
    'Q38A': "I felt that life was meaningless.",
    'Q39A': "I found myself getting agitated.",
    'Q40A': "I was worried about situations in which I might panic and make a fool of myself.",
    'Q41A': "I experienced trembling (e.g., in the hands).",
}

# Response scale (same for all questions)
RESPONSE_SCALE = {
    1: "Did not apply to me at all",
    2: "Applied to me to some degree, or some of the time",
    3: "Applied to me to a considerable degree, or a good part of the time",
    4: "Applied to me very much, or most of the time"
}

# Target class labels and descriptions
# Classes are derived from total score thresholds
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

# Colors for frontend display (severity-coded)
CLASS_COLORS = {
    0: "#22c55e",  # Green
    1: "#eab308",  # Yellow
    2: "#f97316",  # Orange
    3: "#ef4444",  # Red
}

# Train/test split ratio
TEST_SIZE = 0.2

# Model configurations
MODEL_CONFIGS = {
    'logistic_regression': {
        'max_iter': 1000,
        'random_state': RANDOM_STATE,
        'multi_class': 'multinomial'
    },
    'random_forest': {
        'n_estimators': 100,
        'random_state': RANDOM_STATE,
        'n_jobs': -1
    },
    'svm': {
        'kernel': 'rbf',
        'probability': True,
        'random_state': RANDOM_STATE
    },
    'gradient_boosting': {
        'n_estimators': 100,
        'random_state': RANDOM_STATE
    }
}
