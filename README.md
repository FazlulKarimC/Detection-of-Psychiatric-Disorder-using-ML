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

### Data Preprocessing
- **StandardScaler** applied to normalize feature distributions
- Median imputation for missing values
- Quartile-based severity classification

### Models Trained & Compared

| Model | Accuracy | F1-Score | ROC-AUC |
|-------|----------|----------|--------|
| **Logistic Regression** ★ | 92.0% | 0.920 | 0.992 |
| SVM (RBF kernel) | 91.9% | 0.919 | 0.992 |
| Random Forest | 89.4% | 0.894 | 0.986 |
| Gradient Boosting | 89.2% | 0.893 | 0.987 |

★ Selected as best model based on weighted F1-score

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
│   (Vercel)      │     Prediction     │   (HF Space)    │
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

### 1. Train the Model (Google Colab)

We recommend using **Google Colab** for training to leverage free GPU resources:

1. Open `ml/train_colab.ipynb` in Google Colab
2. Run all cells to:
   - Download the DASS dataset from Kaggle
   - Train and compare 4 classifiers (Logistic Regression, Random Forest, SVM, Gradient Boosting)
   - Apply StandardScaler for feature normalization
   - Generate evaluation metrics and confusion matrices
   - Save the best model to your Drive or download directly
3. Copy these files to `backend/models/`:
   - `psychiatric_model.joblib` (trained model)
   - `scaler.joblib` (fitted StandardScaler)
   - `feature_names.json` (feature configuration)

**Current Best Model**: Logistic Regression with 92.0% accuracy and 99.2% ROC-AUC

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

### Backend on Hugging Face Spaces (Recommended)

1. Create a new Space on [Hugging Face](https://huggingface.co/new-space)
2. Select **Docker** as the Space SDK
3. Upload the contents of the `backend` directory to the Space
4. The Space will build automatically using the provided Dockerfile
5. Note the Space URL (e.g., `https://your-username-space-name.hf.space`) for frontend configuration

### Frontend on Vercel

1. Import project to [Vercel](https://vercel.com)
2. Set root directory to `frontend`
3. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-url.run.app`
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

