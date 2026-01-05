---
title: Psychiatric Disorder Detection API
emoji: 🧠
colorFrom: purple
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
license: mit
---

# 🧠 Psychiatric Disorder Detection API

FastAPI backend for mental health screening using machine learning.

## ⚠️ Important Disclaimer

This tool is for **educational and informational purposes only**. It is NOT a medical diagnosis. If you are experiencing mental health concerns, please consult a qualified mental health professional.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check - returns API status |
| `/docs` | GET | Interactive Swagger documentation |
| `/predict` | POST | Submit questionnaire for prediction |

## Quick Start

### Health Check
```bash
curl https://YOUR-USERNAME-psychiatric-disorder-api.hf.space/
```

### Make Prediction
```bash
curl -X POST https://YOUR-USERNAME-psychiatric-disorder-api.hf.space/predict \
  -H "Content-Type: application/json" \
  -d '{
    "q1": 2, "q2": 1, "q3": 1, "q4": 2, "q5": 1,
    "q6": 2, "q7": 1, "q8": 1, "q9": 2, "q10": 1,
    "q11": 1, "q12": 1, "q13": 2, "q14": 1, "q15": 1,
    "q16": 2, "q17": 1, "q18": 2, "q19": 1, "q20": 1,
    "q21": 2, "q22": 1, "q23": 1, "q24": 2, "q25": 1,
    "q26": 1, "q27": 1, "q28": 2, "q29": 1, "q30": 1
  }'
```

## Technology Stack

- **Framework**: FastAPI
- **ML Model**: Random Forest (scikit-learn)
- **Deployment**: Docker on Hugging Face Spaces

## Links

- [Interactive API Docs](https://YOUR-USERNAME-psychiatric-disorder-api.hf.space/docs)
- [Frontend App](https://your-frontend.vercel.app)
