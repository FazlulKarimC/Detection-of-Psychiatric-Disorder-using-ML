# Psychiatric Disorder Detection using Machine Learning

A full-stack web application for mental health screening based on the DASS-42 (Depression Anxiety Stress Scales) questionnaire. This project demonstrates production-ready ML deployment with proper evaluation metrics, ethical considerations, and modern web technologies.

> ⚠️ **Important Disclaimer**: This tool is for educational and informational purposes only. It is NOT a medical diagnosis. If you are experiencing mental health concerns, please consult a qualified mental health professional.

## 🎯 Problem Motivation

Mental health disorders affect approximately 1 in 4 people globally, yet many cases remain undiagnosed due to stigma, lack of awareness, or limited access to professional evaluation. This project aims to provide an accessible screening tool that can help individuals become aware of potential mental health concerns-not to replace professional diagnosis, but to encourage those who may benefit from professional help to seek it.

## 📊 Dataset Description

**Source**: [OpenPsychometrics DASS Dataset](https://openpsychometrics.org/_rawdata/) (also available on [Kaggle](https://www.kaggle.com/datasets/lucasgreenwell/depression-anxiety-stress-scales-responses))

| Attribute | Value |
|-----------|-------|
| Samples | 39,775 |
| Features | 42 questions (30 selected via RFE) |
| Collection Period | 2017-2019 |
| Response Scale | 1-4 (frequency of symptoms) |
| Target Classes | 4 (None, Mild, Moderate, Severe) |

The DASS-42 is a validated psychological instrument measuring three related negative emotional states:
- **Depression**: Dysphoria, hopelessness, devaluation of life, self-deprecation, lack of interest
- **Anxiety**: Autonomic arousal, skeletal muscle effects, situational anxiety, subjective experience
- **Stress**: Difficulty relaxing, nervous arousal, easily upset/agitated, irritability

## 🔬 ML Methodology

### Feature Selection
Used **Recursive Feature Elimination (RFE)** with Random Forest to select the 30 most predictive questions from the original 42, ensuring a balance between model performance and questionnaire length.

### Models Trained & Compared

| Model | Purpose |
|-------|---------|
| Logistic Regression | Baseline linear model with interpretability |
| Random Forest | Ensemble method capturing non-linear patterns |
| SVM (RBF kernel) | Robust classifier for complex decision boundaries |
| Gradient Boosting | Sequential ensemble for improved accuracy |

### Evaluation Strategy
- **Stratified Train/Test Split** (80/20) to maintain class distribution
- **5-Fold Cross-Validation** for robust performance estimation
- **Multiple Metrics** (see below) to avoid accuracy-only evaluation

## 📈 Why Accuracy Alone is Insufficient

In mental health screening, **class imbalance** and **cost asymmetry** make accuracy a misleading metric:

| Issue | Impact |
|-------|--------|
| **Class Imbalance** | Most samples are "None" or "Mild" - a model predicting only these classes could achieve high accuracy while missing severe cases |
| **False Negatives are Costly** | Missing a severe case (predicting "None" when actual is "Severe") could delay critical intervention |
| **False Positives Cause Anxiety** | Over-predicting severity could cause unnecessary worry |

This is why we report:
- **Precision**: Of those predicted as a class, how many actually are?
- **Recall**: Of actual cases, how many did we correctly identify?
- **F1-Score**: Harmonic mean balancing precision and recall
- **ROC-AUC**: Model's ability to distinguish between classes

## ⚖️ Ethical Considerations

### Potential Harms
1. **False Reassurance**: Predicting "None" for someone who is struggling could delay help-seeking
2. **Stigmatization**: Predicting "Severe" could cause distress or be misused
3. **Cultural Bias**: DASS was developed in Western contexts; responses may vary cross-culturally

### Mitigations Implemented
1. **Clear Disclaimers**: Prominent warnings that this is not a diagnosis
2. **Probability Display**: Showing confidence prevents over-reliance on single prediction
3. **Actionable Recommendations**: Encouraging professional consultation regardless of result
4. **No Data Storage**: We do not store individual responses

### This Tool Is NOT:
- A replacement for professional mental health evaluation
- Suitable for clinical decision-making
- Validated for crisis situations (please contact emergency services if in crisis)

## 🏗️ System Architecture

```
┌─────────────────┐     HTTP/JSON      ┌─────────────────┐
│                 │  ──────────────▶   │                 │
│   Next.js       │                    │   FastAPI       │
│   Frontend      │  ◀──────────────   │   Backend       │
│   (Vercel)      │     Prediction     │   (Render)      │
│                 │                    │                 │
└─────────────────┘                    └────────┬────────┘
                                                │
                                                ▼
                                       ┌─────────────────┐
                                       │   Trained ML    │
                                       │   Model         │
                                       │   (joblib)      │
                                       └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### 1. Train the Model

```bash
# Install ML dependencies
cd ml
pip install -r requirements.txt

# Run training (auto-downloads dataset from Kaggle)
python train.py
```

This will:
- Download the DASS dataset from Kaggle
- Train and compare 4 models
- Generate evaluation metrics and visualizations
- Save the best model to `backend/models/`

### 2. Start the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API docs will be available at http://localhost:8000/docs

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## 📦 Project Structure

```
.
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # API endpoints
│   │   ├── schemas.py      # Pydantic models
│   │   └── model.py        # ML model loading
│   ├── models/             # Saved ML models
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/               # Next.js frontend
│   ├── app/
│   │   └── page.tsx       # Questionnaire UI
│   └── package.json
├── ml/                     # ML training
│   ├── train.py           # Training script
│   ├── config.py          # Configuration
│   └── outputs/           # Training artifacts
├── data/                   # Dataset documentation
└── README.md
```

## 🌐 Deployment

### Backend on Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Set build command: `pip install -r backend/requirements.txt`
4. Set start command: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables as needed

### Frontend on Vercel

1. Import project to [Vercel](https://vercel.com)
2. Set root directory to `frontend`
3. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
4. Deploy

## 🔮 Future Improvements

- [ ] Add longitudinal tracking (with proper consent and security)
- [ ] Implement SHAP values for prediction explanations
- [ ] Add multi-language support
- [ ] Create progressive web app (PWA) for offline access
- [ ] Conduct formal validation study
- [ ] Add comparison with other validated screening tools

## 📚 References

1. Lovibond, S.H. & Lovibond, P.F. (1995). Manual for the Depression Anxiety Stress Scales. Sydney: Psychology Foundation.
2. [OpenPsychometrics DASS Dataset](https://openpsychometrics.org/_rawdata/)
3. [DASS Official Website](http://www2.psy.unsw.edu.au/dass/)

## 📄 License

This project is for educational purposes. The DASS questionnaire is in the public domain.

---

**Remember**: If you or someone you know is struggling with mental health, please reach out to a qualified professional or contact a mental health helpline in your country.
