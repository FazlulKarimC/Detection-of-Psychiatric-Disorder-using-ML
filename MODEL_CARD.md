# Model Card: Psychiatric Disorder Detection Model

## Model Details

| Attribute | Value |
|-----------|-------|
| **Model Name** | Psychiatric Disorder Severity Classifier |
| **Version** | 1.0.0 |
| **Type** | Multi-class Classification |
| **Framework** | scikit-learn |
| **Algorithm** | Selected via comparison (see Training section) |
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

Metrics are computed on held-out test set. Exact values will be populated after training.

| Metric | Description |
|--------|-------------|
| Accuracy | Overall correct predictions |
| Precision (weighted) | Positive predictive value across classes |
| Recall (weighted) | True positive rate across classes |
| F1 Score (weighted) | Harmonic mean of precision and recall |
| F1 Score (macro) | Unweighted average F1 across classes |
| ROC-AUC (OvR) | One-vs-Rest area under ROC curve |

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
