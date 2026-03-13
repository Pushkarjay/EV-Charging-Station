# Data Science - ML Pipeline & Analytics

## Overview
This folder contains all data science workflows, machine learning models, feature engineering, and analytics for the EV Charging Station platform.

## Folder Structure

```
data-science/
├── notebooks/          # Jupyter notebooks for EDA and experimentation
├── preprocessing/      # Data cleaning and preparation scripts
├── features/           # Feature engineering pipelines
├── models/             # Model training, evaluation, and serialization
├── predictions/        # Inference, batch predictions, and scheduled jobs
├── datasets/           # Raw and processed datasets
└── README.md           # This file
```

## Key Responsibilities

- **Notebooks**: Exploratory data analysis, model experimentation, visualization
- **Preprocessing**: Data cleaning, normalization, handling missing values
- **Features**: Feature engineering, time-series features, geospatial features
- **Models**: Model training (Random Forest, XGBoost), hyperparameter tuning, evaluation
- **Predictions**: Inference pipelines, batch scoring, API integration
- **Datasets**: Data storage and version control

## ML Models & Objectives

### 1. Demand Forecasting (Primary)
- **Target**: Predict charger availability and demand by location/time
- **Algorithm**: Random Forest Regressor, XGBoost, LSTM
- **Performance Target**: R² > 0.85
- **Frequency**: Daily/Weekly forecasts
- **Output**: Predictions sent to backend API

### 2. Charger Fault Detection (Secondary)
- **Target**: Predict equipment failures before they occur
- **Algorithm**: Isolation Forest, Autoencoders
- **Features**: Voltage, current, temperature, usage patterns
- **Output**: Alerts and maintenance schedules

### 3. User Demand Pattern Analysis
- **Target**: Analyze user behavior and charging patterns
- **Algorithm**: K-Means Clustering, Time Series Analysis
- **Features**: Location, time, vehicle type, pricing
- **Output**: User segmentation for targeted incentives

## Tech Stack

- **Language**: Python 3.9+
- **Data Processing**: Pandas, NumPy
- **Visualization**: Matplotlib, Seaborn, Plotly
- **ML Libraries**: Scikit-Learn, XGBoost, TensorFlow/Keras
- **Time Series**: Statsmodels, Prophet
- **Feature Engineering**: Feature-engine, Tsfresh
- **Model Persistence**: Pickle, MLflow, ONNX
- **Notebooks**: Jupyter, JupyterLab
- **Testing**: Pytest, Pytest-mock

## Getting Started

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set up Jupyter notebook environment:
   ```bash
   jupyter notebook
   ```

3. Explore data:
   ```bash
   # Open notebooks/01_exploratory_analysis.ipynb
   ```

4. Prepare data:
   ```bash
   python preprocessing/prepare_data.py
   python features/engineer_features.py
   ```

5. Train models:
   ```bash
   python models/train_demand_forecasting.py
   python models/train_fault_detection.py
   ```

6. Make predictions:
   ```bash
   python predictions/batch_predict.py
   python predictions/serve_predictions.py
   ```

## Workflow Pipeline

```
Raw Data (datasets/raw/)
    ↓
Data Cleaning (preprocessing/)
    ↓
Feature Engineering (features/)
    ↓
Model Training (models/)
    ↓
Model Evaluation & Validation
    ↓
Model Serialization & Registration
    ↓
Inference & Predictions (predictions/)
    ↓
API Integration (send to backend/)
```

## File Organization Example

```
notebooks/
├── 01_exploratory_analysis.ipynb       # Initial data exploration
├── 02_feature_correlation.ipynb        # Feature importance analysis
├── 03_model_experimentation.ipynb      # Model comparison and tuning

preprocessing/
├── prepare_data.py                     # Main data loading and cleaning
├── normalize_data.py                   # Standardization and scaling
└── handle_missing_values.py            # Imputation strategies

features/
├── time_features.py                    # Hour, day, week, month extraction
├── geospatial_features.py              # Distance, location-based features
├── lag_features.py                     # Time-lagged features
└── aggregate_features.py               # Rolling statistics

models/
├── train_demand_forecasting.py         # Random Forest/XGBoost training
├── train_fault_detection.py            # Anomaly detection model
├── model_evaluation.py                 # Metrics and validation
└── hyperparameter_tuning.py            # Grid search, Bayesian optimization

predictions/
├── batch_predict.py                    # Daily batch scoring
├── serve_predictions.py                # Real-time API inference
└── schedule_predictions.py             # Celery task scheduling

datasets/
├── raw/                                # Original unprocessed data
├── processed/                          # Cleaned and normalized data
├── features/                           # Engineered feature sets
└── splits/                             # Train/test/validation splits
```

## Development Guidelines

- Use Jupyter notebooks for experimentation only; move validated code to `.py` files
- Document all feature engineering decisions
- Track model versions with git + MLflow
- Log hyperparameters and performance metrics
- Write unit tests for preprocessing and feature functions
- Implement cross-validation for model evaluation
- Use proper train/test data splitting (no data leakage)
- Save trained models with timestamps and version numbers

## Integration with Backend

Predictions are served via:
- **API Endpoint**: `POST /api/predictions/demand`
- **Batch Job**: Scheduled Celery task (e.g., daily at 2 AM)
- **Real-time**: Direct inference for user requests

See [backend/app/services/prediction_service.py](../backend/app/services/prediction_service.py) for integration code.

## Related Documentation

- See [Documnets/ML_PIPELINE.md](../Documnets/ML_PIPELINE.md) for detailed ML workflow
- See [Documnets/SYSTEM_ARCHITECTURE.md](../Documnets/SYSTEM_ARCHITECTURE.md) for system overview
- See [Documnets/DATABASE_SCHEMA.md](../Documnets/DATABASE_SCHEMA.md) for data sources
