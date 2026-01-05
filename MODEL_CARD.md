# Model Card: Psychiatric Disorder Detection Model

## Model Details

| Attribute | Value |
|-----------|-------|
| **Model Name** | Psychiatric Disorder Severity Classifier |
| **Version** | 1.0.0 |
| **Type** | Multi-class Classification |
| **Framework** | scikit-learn |
| **Algorithm** | Logistic Regression (selected via comparison) |
| **Preprocessing** | StandardScaler for feature normalization |
| **Input** | 30 integer features (1-4) |
| **Output** | 4 classes (None, Mild, Moderate, Severe) |

## Intended Use

### Primary Use Case
Educational demonstration of ML-powered mental health screening. Designed to help individuals understand potential indicators of psychological distress.

### Not Suitable For
- Clinical diagnosis or treatment decisions
- Crisis intervention or emergency situations
- Use as sole basis for any mental health decisions
- Employment, insurance, or legal decisions

### Target Users
- Students learning about ML in healthcare
- Researchers studying digital mental health tools
- Individuals curious about self-assessment (with clear understanding of limitations)

## Training Data

### Source
OpenPsychometrics DASS-42 Dataset (2017-2019)
- **URL**: https://openpsychometrics.org/_rawdata/
- **Citation**: OpenPsychometrics. (2019). Depression Anxiety Stress Scales Responses [Data set].

### Dataset Statistics
| Metric | Value |
|--------|-------|
| Total Samples | 39,775 |
| Original Features | 42 questions |
| Selected Features | 30 (via RFE) |
| Train/Test Split | 80/20 (stratified) |

### Data Collection
- Voluntary online survey
- Self-selected participants seeking personalized results
- Participants consented to research use
- Anonymous data collection

## Evaluation Metrics

Metrics computed on held-out test set (20% of data, stratified split):

### Best Model: Logistic Regression

| Metric | Value |
|--------|-------|
| **Accuracy** | 92.0% |
| **Precision (weighted)** | 92.0% |
| **Recall (weighted)** | 92.0% |
| **F1 Score (weighted)** | 92.0% |
| **F1 Score (macro)** | 92.0% |
| **ROC-AUC (OvR)** | 99.2% |
| **CV Mean (5-fold)** | 92.1% |
| **CV Std** | 0.54% |

### Model Comparison

| Model | F1-Score | ROC-AUC | CV Mean |
|-------|----------|---------|--------|
| Logistic Regression ★ | 0.920 | 0.992 | 0.921 |
| SVM (RBF) | 0.919 | 0.992 | 0.919 |
| Random Forest | 0.894 | 0.986 | 0.895 |
| Gradient Boosting | 0.893 | 0.987 | 0.896 |

★ Selected based on highest weighted F1-score

## Limitations

### Data Limitations
1. **Self-selection bias**: Participants chose to take the survey
2. **Online population**: May not represent general population
3. **Western-centric**: DASS developed in Australia/UK context
4. **Point-in-time**: Captures state, not trait characteristics
5. **Self-reported**: Subject to response biases

### Model Limitations
1. **No temporal context**: Cannot detect changes over time
2. **Ordinal response scale**: Uses 1-4 ordinal inputs; nuance beyond this scale is lost
3. **No demographic adjustment**: Same model for all age/gender groups
4. **Threshold-based classes**: Severity cutoffs based on score percentiles, not clinical thresholds

## Ethical Considerations

### Potential Benefits
- Increased mental health awareness
- Low-barrier entry to self-reflection
- Educational value for ML students

### Potential Harms
- **False confidence**: "None" prediction may delay help-seeking
- **Stigma reinforcement**: Labels may be internalized negatively
- **Privacy concerns**: Mental health data is sensitive
- **Misuse**: Could be used in inappropriate contexts

### Mitigation Measures
- Prominent disclaimers on all interfaces
- No personal data storage
- Probability display to convey uncertainty
- Recommendations for professional consultation

## Transparency

### Feature Importance
The model can output feature importances showing which questions most influenced predictions. This supports interpretability.

### Confidence Scores
All predictions include probability distributions across classes, allowing users to understand prediction certainty.

## Maintenance

| Aspect | Status |
|--------|--------|
| Active Development | Yes (educational) |
| Monitoring | Manual only |
| Retraining Schedule | Not planned |
| Bug Reports | Via GitHub Issues |

## Contact

For questions about this model, please open an issue on the GitHub repository.

---

*This model card follows best practices from [Mitchell et al. (2019)](https://arxiv.org/abs/1810.03993)*
