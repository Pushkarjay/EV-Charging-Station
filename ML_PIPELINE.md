# ML PIPELINE & DATA SCIENCE WORKFLOW

## Smart EV Charging Station Finder & Management Platform

**Date:** March 13, 2026  
**Version:** 1.0

---

## Table of Contents

1. [ML Pipeline Overview](#ml-pipeline-overview)
2. [Data Ingestion](#data-ingestion)
3. [Data Preprocessing](#data-preprocessing)
4. [Feature Engineering](#feature-engineering)
5. [Model Development](#model-development)
6. [Model Training](#model-training)
7. [Model Evaluation](#model-evaluation)
8. [Model Deployment](#model-deployment)
9. [Monitoring & Maintenance](#monitoring--maintenance)
10. [Implementation Guide](#implementation-guide)

---

## ML Pipeline Overview

### End-to-End ML Workflow

```
┌──────────────────────────────────────────────────────────────────┐
│                   DATA SCIENCE PIPELINE                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Data         │  │ Data         │  │ Feature      │          │
│  │ Ingestion    │◄─│ Preprocessing│◄─│ Engineering  │          │
│  └──────┬───────┘  └──────────────┘  └──────────────┘          │
│         │                                     ▲                  │
│         │ Raw Data                           │                  │
│         └─────────────┬──────────────────────┘                  │
│                       │                                         │
│         ┌─────────────▼──────────────┐                         │
│         │                            │                         │
│         │  Exploratory Data          │                         │
│         │  Analysis (EDA)            │                         │
│         │  - Distributions           │                         │
│         │  - Correlations            │                         │
│         │  - Anomalies               │                         │
│         │                            │                         │
│         └─────────────┬──────────────┘                         │
│                       │ Insights                               │
│                       ▼                                         │
│         ┌──────────────────────────────┐                       │
│         │  Train/Test/Validation Split │                       │
│         │  70/20/10 or 70/15/15       │                       │
│         └──────────────┬───────────────┘                       │
│                        │                                        │
│  ┌─────────────────────┴────────────────────────┐              │
│  │                                              │              │
│  ▼                                              ▼              │
│  ┌───────────────────────────┐    ┌───────────────────────┐  │
│  │ Model Development         │    │ Hyperparameter Tuning │  │
│  │ - Algorithm Selection     │    │ - GridSearch CV       │  │
│  │ - Model Training          │    │ - RandomSearch CV     │  │
│  │ - Cross-Validation (5-fold)    │ - Bayesian Optimization
│  │                           │    │                       │  │
│  └───────────┬───────────────┘    └─────┬─────────────────┘  │
│              │                          │                     │
│              └──────────────┬───────────┘                     │
│                             │                                 │
│          ┌──────────────────▼──────────────────┐             │
│          │                                     │             │
│          │  Model Evaluation                  │             │
│          │  - RMSE (Primary Metric)           │             │
│          │  - MAE, R², MAPE                   │             │
│          │  - Cross-validation Score          │             │
│          │  - Test Set Performance            │             │
│          │                                     │             │
│          └──────────────────┬──────────────────┘             │
│                             │                                 │
│                  ┌──────────▼──────────┐                     │
│                  │ Performance OK?     │                     │
│                  │ R² > 0.85?          │                     │
│                  │ RMSE < 2 slots?     │                     │
│                  └──────┬──────────────┘                     │
│                         │                                    │
│        ┌────────────────┴────────────────┐                  │
│        │                                 │                  │
│       NO                                YES                 │
│        │                                 │                  │
│        ▼                                 ▼                  │
│    Iterate                        ┌─────────────────┐      │
│    (Try different                 │ Model Deployment│      │
│    algorithms, features,          │ Serialization   │      │
│    parameters)                    │ (Pickle/ONNX)   │      │
│        │                          │ Versioning      │      │
│        └──────────────────┬───────┘ API Serving     │      │
│                           │        └────┬──────────┘      │
│                           │             │                 │
│                           └──────┬──────┘                 │
│                                  │                        │
│                 ┌────────────────▼──────────────┐         │
│                 │   Production Deployment      │         │
│                 │  - Cloud Run API Endpoint    │         │
│                 │  - Redis Cache for serving   │         │
│                 │  - Real-time predictions     │         │
│                 └────────────────┬──────────────┘         │
│                                  │                        │
│                 ┌────────────────▼──────────────┐         │
│                 │   Monitoring & Maintenance   │         │
│                 │  - Track prediction accuracy │         │
│                 │  - Monitor feature drift     │         │
│                 │  - Retraining trigger       │         │
│                 │  - Model performance logs    │         │
│                 └──────────────────────────────┘         │
│                                                          │
│             ┌─────────────────────────────────┐         │
│             │ Weekly Retraining Job          │         │
│             │ Continuous Improvement Cycle   │         │
│             └─────────────────────────────────┘         │
│                                                          │
└──────────────────────────────────────────────────────────────────┘
```

---

## Data Ingestion

### Data Sources

**Operational Data (Real-time):**
```python
# Charging Sessions Table
- session_id, user_id, station_id
- start_time, end_time
- battery_level_start, battery_level_end
- energy_consumed_kwh, cost_paid
- charging_speed, payment_method

# Availability Logs (Every 5 minutes)
- station_id, timestamp
- available_slots, total_slots
- occupancy_rate
- weather_condition, temperature

# User Interactions (Streaming)
- searches: (user_id, source_location, filters)
- reservations: (user_id, station_id, reserved_slots)
- ratings: (user_id, station_id, score)
```

**External Data:**
```python
# Weather Data (from weather API)
- date, hour, location
- temperature, precipitation, wind_speed
- visibility, humidity

# Calendar Events
- holidays (national, regional)
- special events (festivals, conferences)
- local events (sports, concerts)

# Traffic & Infrastructure
- local_events: boolean
- highway_proximity_km: float
- population_density: int
```

### Data Storage & Access

```python
# Raw Data Lake (Google Cloud Storage)
gs://ev-charging-data-lake/raw/
├── charging_sessions/ (Parquet)
├── availability_logs/ (Parquet)
├── weather_data/ (CSV/Parquet)
├── calendar_data/ (JSON)
└── user_interactions/ (Parquet)

# Database Extraction
# Query: SELECT * FROM charging_sessions 
#        WHERE start_time >= DATE_SUB(NOW(), INTERVAL 24 MONTHS)

# Approximately 500K-1M rows for 24 months of data
# Size: ~2-3 GB uncompressed
```

**Data Extraction Code:**
```python
import pandas as pd
from sqlalchemy import create_engine

# Connect to MySQL
engine = create_engine('mysql+pymysql://user:pass@host/ev_charging_db')

# Extract historical data (24 months)
query = """
    SELECT 
        cs.session_id, cs.user_id, cs.station_id,
        cs.start_time, cs.end_time, cs.duration_minutes,
        cs.battery_level_start, cs.battery_level_end,
        cs.energy_consumed_kwh,
        s.total_slots, s.latitude, s.longitude, s.price_per_kwh,
        al.available_slots, al.occupancy_rate, al.weather_condition
    FROM charging_sessions cs
    JOIN charging_stations s ON cs.station_id = s.station_id
    JOIN availability_logs al ON s.station_id = al.station_id 
                              AND HOUR(cs.start_time) = HOUR(al.timestamp)
    WHERE cs.start_time >= DATE_SUB(NOW(), INTERVAL 24 MONTH)
    LIMIT 1000000
"""

df = pd.read_sql(query, engine)
print(f"Extracted {len(df)} records")
print(df.head())
```

---

## Data Preprocessing

### Missing Value Handling

```python
import numpy as np
import pandas as pd

# Strategy: Different handling for different data types
df = df.copy()

# 1. Numerical columns: Forward fill (time-series) with max 2 hours
time_series_cols = ['available_slots', 'occupancy_rate', 'energy_consumed_kwh']
df[time_series_cols] = df.groupby('station_id')[time_series_cols] \
    .fillna(method='ffill', limit=24)  # Max 2 hours (24 × 5 min intervals)

# 2. Categorical: Fill with mode
categorical_cols = ['weather_condition', 'charging_speed']
for col in categorical_cols:
    df[col] = df[col].fillna(df[col].mode()[0])

# 3. Remove rows with >30% missing values
missing_threshold = 0.3
df = df[df.isnull().sum(axis=1) / len(df.columns) < missing_threshold]

print(f"After handling missing values: {len(df)} records")
```

### Outlier Detection & Handling

```python
# IQR Method for outlier detection
def remove_outliers_iqr(df, col, multiplier=1.5):
    Q1 = df[col].quantile(0.25)
    Q3 = df[col].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - multiplier * IQR
    upper_bound = Q3 + multiplier * IQR
    return df[(df[col] >= lower_bound) & (df[col] <= upper_bound)]

# Apply to key columns
df = remove_outliers_iqr(df, 'duration_minutes', multiplier=1.5)  # 0.1-99.9 percentile
df = remove_outliers_iqr(df, 'energy_consumed_kwh', multiplier=1.5)
df = remove_outliers_iqr(df, 'cost_paid', multiplier=2.0)

print(f"After outlier removal: {len(df)} records")
```

### Feature Scaling & Normalization

```python
from sklearn.preprocessing import StandardScaler, MinMaxScaler

# Standardization (Z-score): For most features
scaler_standard = StandardScaler()
standard_cols = ['temperature', 'duration_minutes', 'energy_consumed_kwh']
df[standard_cols] = scaler_standard.fit_transform(df[standard_cols])

# Min-Max Scaling: For price-related features (0-1 range)
scaler_minmax = MinMaxScaler()
minmax_cols = ['price_per_kwh', 'cost_paid', 'occupancy_rate']
df[minmax_cols] = scaler_minmax.fit_transform(df[minmax_cols])

# Log Transformation: For skewed distributions
df['log_energy'] = np.log1p(df['energy_consumed_kwh'])  # Log(1 + x)

print("Scaling complete")
```

### Categorical Encoding

```python
# One-Hot Encoding: For station type and charging speed
df = pd.get_dummies(df, columns=['charging_speed'], prefix='speed')
# Creates: speed_SLOW, speed_STANDARD, speed_FAST (binary columns)

# Label Encoding: For ordinal features
from sklearn.preprocessing import LabelEncoder
le = LabelEncoder()
df['weather_encoded'] = le.fit_transform(df['weather_condition'])
# SUNNY=0, RAINY=1, CLOUDY=2, SNOWY=3

print("Encoding complete")
print(df.dtypes)
```

---

## Feature Engineering

### Time-Based Features

```python
# Extract temporal information
df['start_time'] = pd.to_datetime(df['start_time'])

# Hourly features
df['hour_of_day'] = df['start_time'].dt.hour  # 0-23
df['day_of_week'] = df['start_time'].dt.dayofweek  # 0=Mon, 6=Sun
df['is_weekend'] = (df['day_of_week'] >= 5).astype(int)  # 0 or 1

# Monthly/Seasonal features
df['day_of_month'] = df['start_time'].dt.day  # 1-31
df['month_of_year'] = df['start_time'].dt.month  # 1-12
df['quarter'] = df['start_time'].dt.quarter  # 1-4

# Seasonal encoding (meteorological seasons)
def get_season(month):
    if month in [3, 4, 5]: return 'SPRING'
    elif month in [6, 7, 8]: return 'SUMMER'
    elif month in [9, 10, 11]: return 'AUTUMN'
    else: return 'WINTER'

df['season'] = df['month_of_year'].apply(get_season)

# Holiday indicator
holidays = ['2024-08-15', '2024-10-02', '2024-12-25']  # Independence Day, Gandhi Jayanti, Christmas
df['is_holiday'] = df['start_time'].dt.date.isin(holidays).astype(int)

print(df[['hour_of_day', 'day_of_week', 'is_weekend', 'season', 'is_holiday']].head())
```

### Location-Based Features

```python
from geopy.distance import geodesic

# Assuming city_center = (28.6139, 77.2090) for Delhi
CITY_CENTER = (28.6139, 77.2090)

# Distance to city center
df['distance_to_city_center'] = df.apply(
    lambda row: geodesic((row['latitude'], row['longitude']), CITY_CENTER).km,
    axis=1
)

# Geohash approximation (grid-based location clustering)
df['lat_round_2'] = df['latitude'].round(2)   # ~1 km precision
df['lon_round_2'] = df['longitude'].round(2)  # ~0.6 km precision

# Neighborhood type (simple heuristic)
def get_neighborhood_type(population_density):
    if population_density > 5000: return 'URBAN'
    elif population_density > 500: return 'SUBURBAN'
    else: return 'RURAL'

df['neighborhood_type'] = df['population_density'].apply(get_neighborhood_type)

print(df[['distance_to_city_center', 'lat_round_2', 'lon_round_2', 'neighborhood_type']].head())
```

### Station-Based Features

```python
# Station age (days since opening)
station_opening_date = {
    1: '2020-01-15',
    2: '2019-06-20',
    # ... (from stations table)
}

df['station_age_days'] = df['station_id'].map(station_opening_date).apply(
    lambda x: (pd.Timestamp.now() - pd.to_datetime(x)).days
)

# Historical availability (7-day rolling average)
df['rolling_avg_availability_7d'] = df.groupby('station_id')['available_slots'] \
    .transform(lambda x: x.rolling(window=7*288, min_periods=1).mean())  # 7 days × 288 (5-min readings)

# Peak hour indicator (if hour is in peak hours list for that station)
peak_hours_per_station = {
    1: [8, 9, 17, 18, 19],  # Station 1: Morning and evening rush
    2: [12, 13, 18, 19],    # Station 2: Lunch and evening
    # ...
}

df['is_peak_hour'] = df.apply(
    lambda row: 1 if row['hour_of_day'] in peak_hours_per_station.get(row['station_id'], []) else 0,
    axis=1
)

print(df[['station_age_days', 'rolling_avg_availability_7d', 'is_peak_hour']].head())
```

### Derived Features

```python
# Availability trend (comparing to historical mean)
station_mean_availability = df.groupby('station_id')['available_slots'].mean()
df['availability_vs_mean'] = df.apply(
    lambda row: row['available_slots'] - station_mean_availability[row['station_id']],
    axis=1
)

# Station popularity score (based on search frequency and sessions)
df['search_frequency'] = df.groupby('station_id')['session_id'].transform('count')
df['station_popularity_score'] = (df['search_frequency'] / df['search_frequency'].max()) * 100

# Expected waiting time (simple queue model)
df['expected_waiting_time_min'] = (df['total_slots'] - df['available_slots']) * 2  # 2 min per occupied slot

# Price competitiveness (percentile vs local stations)
df['price_percentile'] = df.groupby('day_of_week')['price_per_kwh'] \
    .transform(lambda x: x.rank(pct=True) * 100)

print(df[['availability_vs_mean', 'station_popularity_score', 'expected_waiting_time_min', 'price_percentile']].head())
```

---

## Model Development

### Algorithm Selection

**Availability Prediction Model: Random Forest Regressor**

**Why Random Forest?**
- Handles non-linear relationships (energy consumption patterns vary by time/day)
- Robust to outliers (occupancy can be 0 or 100%)
- Feature importance ranking (identify key factors)
- Multiple tree ensemble reduces overfitting
- Fast inference time (< 100ms for single prediction)

**Alternative Models Considered:**
- XGBoost: Better performance but more prone to overfitting
- LSTM: Better for sequences but requires more data and computation
- Prophet: Designed for time-series but may miss non-temporal patterns
- Linear Regression: Too simple for complex patterns

```python
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split

# Prepare data
X = df[['hour_of_day', 'day_of_week', 'month_of_year', 
        'is_weekend', 'is_holiday', 'temperature',
        'available_slots_lag1', 'available_slots_lag24',
        'station_age_days', 'rolling_avg_availability_7d',
        'is_peak_hour', 'station_popularity_score']]

y = df['available_slots_next_hour']  # Target variable

# Train/validation/test split
X_temp, X_test, y_temp, y_test = train_test_split(
    X, y, test_size=0.1, random_state=42
)
X_train, X_val, y_train, y_val = train_test_split(
    X_temp, y_temp, test_size=0.2/(0.9), random_state=42
)

print(f"Train: {len(X_train)}, Val: {len(X_val)}, Test: {len(X_test)}")

# Initialize Random Forest
rf_model = RandomForestRegressor(
    n_estimators=200,      # Number of trees
    max_depth=15,          # Tree depth limit
    min_samples_split=5,   # Min samples to split node
    min_samples_leaf=2,    # Min samples in leaf
    random_state=42,
    n_jobs=-1,             # Use all CPU cores
    verbose=1
)

# Train
rf_model.fit(X_train, y_train)

print("Model training complete")
```

### Cross-Validation

```python
from sklearn.model_selection import cross_val_score, KFold

# 5-Fold Cross-Validation
kfold = KFold(n_splits=5, shuffle=True, random_state=42)

cv_scores = cross_val_score(
    rf_model, X_train, y_train,
    cv=kfold,
    scoring='r2',  # R² score
    n_jobs=-1
)

print(f"CV R² Scores: {cv_scores}")
print(f"Mean R²: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
# Expected: Mean R² > 0.82
```

---

## Model Training

### Hyperparameter Tuning

```python
from sklearn.model_selection import GridSearchCV

# Define parameter grid
param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [10, 15, 20],
    'min_samples_split': [3, 5, 7],
    'min_samples_leaf': [1, 2, 4]
}

# GridSearch with 5-fold CV
grid_search = GridSearchCV(
    rf_model,
    param_grid,
    cv=5,
    scoring='r2',
    n_jobs=-1,
    verbose=2
)

grid_search.fit(X_train, y_train)

print(f"Best Parameters: {grid_search.best_params_}")
print(f"Best CV Score: {grid_search.best_score_:.4f}")

# Use best model
best_rf_model = grid_search.best_estimator_
```

---

## Model Evaluation

### Performance Metrics

```python
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

# Predictions
y_train_pred = best_rf_model.predict(X_train)
y_val_pred = best_rf_model.predict(X_val)
y_test_pred = best_rf_model.predict(X_test)

# Metrics
def calculate_metrics(y_true, y_pred, set_name):
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    mae = mean_absolute_error(y_true, y_pred)
    r2 = r2_score(y_true, y_pred)
    mape = np.mean(np.abs((y_true - y_pred) / y_true)) * 100
    
    print(f"\n{set_name} Set Metrics:")
    print(f"  RMSE: {rmse:.4f} slots")
    print(f"  MAE:  {mae:.4f} slots")
    print(f"  R²:   {r2:.4f}")
    print(f"  MAPE: {mape:.2f}%")
    
    return {'RMSE': rmse, 'MAE': mae, 'R²': r2, 'MAPE': mape}

train_metrics = calculate_metrics(y_train, y_train_pred, "Train")
val_metrics = calculate_metrics(y_val, y_val_pred, "Validation")
test_metrics = calculate_metrics(y_test, y_test_pred, "Test")

# Performance targets
TARGET_R2 = 0.85
TARGET_RMSE = 2.0

print(f"\nTarget Metrics:")
print(f"  R² > {TARGET_R2}: {'✓ PASS' if test_metrics['R²'] > TARGET_R2 else '✗ FAIL'}")
print(f"  RMSE < {TARGET_RMSE}: {'✓ PASS' if test_metrics['RMSE'] < TARGET_RMSE else '✗ FAIL'}")
```

### Feature Importance

```python
# Get feature importance from trained model
feature_importance = pd.DataFrame({
    'feature': X_train.columns,
    'importance': best_rf_model.feature_importances_
}).sort_values('importance', ascending=False)

print("\nTop 10 Important Features:")
print(feature_importance.head(10))

# Visualization
import matplotlib.pyplot as plt

plt.figure(figsize=(10, 6))
plt.barh(feature_importance.head(10)['feature'], 
         feature_importance.head(10)['importance'])
plt.xlabel('Feature Importance')
plt.title('Top 10 Features for Availability Prediction')
plt.tight_layout()
plt.savefig('feature_importance.png')
plt.close()
```

---

## Model Deployment

### Model Serialization

```python
import pickle
import json
from datetime import datetime

# Save model
model_version = "v1.3"
with open(f'model_{model_version}.pkl', 'wb') as f:
    pickle.dump(best_rf_model, f)

# Save scaler (for feature preprocessing)
with open(f'scaler_{model_version}.pkl', 'wb') as f:
    pickle.dump(scaler_standard, f)

# Save metadata
metadata = {
    'model_version': model_version,
    'created_at': datetime.now().isoformat(),
    'train_samples': len(X_train),
    'test_r2': float(test_metrics['R²']),
    'test_rmse': float(test_metrics['RMSE']),
    'model_type': 'RandomForestRegressor',
    'parameters': {
        'n_estimators': best_rf_model.n_estimators,
        'max_depth': best_rf_model.max_depth,
        'min_samples_split': best_rf_model.min_samples_split,
        'min_samples_leaf': best_rf_model.min_samples_leaf
    }
}

with open(f'metadata_{model_version}.json', 'w') as f:
    json.dump(metadata, f, indent=2)

print(f"Model {model_version} saved successfully")
```

### Batch Prediction Pipeline

```python
def generate_batch_predictions(model, scaler, hours_ahead=[1, 4, 8, 24]):
    """
    Generate predictions for all stations for multiple time horizons
    """
    predictions = []
    
    for station_id in df['station_id'].unique():
        station_data = df[df['station_id'] == station_id].iloc[-1]  # Latest record
        
        for hours in hours_ahead:
            # Create feature vector
            X_pred = pd.DataFrame({
                'hour_of_day': [(station_data['hour_of_day'] + hours) % 24],
                'day_of_week': [station_data['day_of_week']],
                # ... other features
            })
            
            # Preprocess
            X_pred_scaled = scaler.transform(X_pred)
            
            # Predict
            pred_slots = model.predict(X_pred_scaled)[0]
            confidence = calculate_confidence(model, X_pred_scaled)
            
            predictions.append({
                'station_id': station_id,
                'prediction_timestamp': pd.Timestamp.now(),
                'hours_ahead': hours,
                'predicted_available_slots': int(max(0, pred_slots)),
                'confidence_score': confidence,
                'model_version': 'v1.3'
            })
    
    predictions_df = pd.DataFrame(predictions)
    
    # Save to database
    predictions_df.to_sql('ml_model_predictions', con=engine, 
                         if_exists='append', index=False)
    
    return predictions_df

# Run batch job
batch_preds = generate_batch_predictions(best_rf_model, scaler_standard)
print(f"Generated {len(batch_preds)} predictions")
```

### REST API for Real-time Predictions

```python
from fastapi import FastAPI
from pydantic import BaseModel
import pickle

app = FastAPI()

# Load model
with open('model_v1.3.pkl', 'rb') as f:
    model = pickle.load(f)

with open('scaler_v1.3.pkl', 'rb') as f:
    scaler = pickle.load(f)

class PredictionRequest(BaseModel):
    station_id: int
    hour_of_day: int
    day_of_week: int
    temperature: float
    is_peak_hour: int

@app.post("/api/v1/predictions/availability")
async def predict_availability(request: PredictionRequest):
    # Prepare features
    X = pd.DataFrame([{
        'hour_of_day': request.hour_of_day,
        'day_of_week': request.day_of_week,
        'temperature': request.temperature,
        'is_peak_hour': request.is_peak_hour,
        # ... other features
    }])
    
    # Scale
    X_scaled = scaler.transform(X)
    
    # Predict
    pred_slots = model.predict(X_scaled)[0]
    
    return {
        'station_id': request.station_id,
        'predicted_available_slots': int(max(0, pred_slots)),
        'confidence': 0.87,
        'model_version': 'v1.3',
        'timestamp': pd.Timestamp.now().isoformat()
    }
```

---

## Monitoring & Maintenance

### Model Performance Tracking

```python
# Weekly job to evaluate model on new data
def evaluate_model_on_new_data():
    # Query new sessions from past week
    query = """
        SELECT * FROM charging_sessions
        WHERE start_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    """
    
    new_data = pd.read_sql(query, engine)
    
    # Prepare features and predictions
    X_new = prepare_features(new_data)
    y_actual = new_data['available_slots_next_hour']
    y_pred = model.predict(X_new)
    
    # Calculate metrics
    current_r2 = r2_score(y_actual, y_pred)
    current_rmse = np.sqrt(mean_squared_error(y_actual, y_pred))
    
    # Log to database
    performance_log = {
        'model_version': 'v1.3',
        'evaluation_date': pd.Timestamp.now(),
        'num_samples': len(new_data),
        'r2_score': current_r2,
        'rmse': current_rmse
    }
    
    # Check for drift
    if current_r2 < 0.82:  # Threshold
        print("⚠️ Model performance degradation detected!")
        trigger_retraining()
    
    return performance_log
```

### Retraining Strategy

```python
# Automatic retraining pipeline
def should_retrain():
    # Trigger conditions:
    # 1. Performance degradation detected (R² < 0.82)
    # 2. Weekly scheduled retraining
    # 3. Manual trigger by operations team
    
    last_retraining = get_last_retraining_date()  # From database
    days_since = (datetime.now() - last_retraining).days
    
    return days_since >= 7  # Weekly retraining

if should_retrain():
    print("Starting automated retraining...")
    
    # 1. Extract latest data
    # 2. Preprocess
    # 3. Train new model
    # 4. Evaluate
    # 5. If performance > current model, deploy
    # 6. Log retraining event
    
    new_model_performance = train_and_evaluate()
    
    if new_model_performance['r2'] > current_model_performance['r2']:
        deploy_new_model(new_model_performance)
    else:
        print("New model performance not better, keeping current model")
```

---

## Implementation Guide

### Recommended Architecture

```
ml_pipeline/
├── data/
│   ├── raw/
│   ├── processed/
│   └── features/
├── models/
│   ├── v1.0/
│   ├── v1.1/
│   ├── v1.3/ (current)
│   └── v1.4/ (experimental)
├── notebooks/
│   ├── 01_eda.ipynb
│   ├── 02_preprocessing.ipynb
│   ├── 03_feature_engineering.ipynb
│   ├── 04_model_training.ipynb
│   └── 05_evaluation.ipynb
├── src/
│   ├── data_loader.py
│   ├── preprocessor.py
│   ├── feature_engineer.py
│   ├── model_trainer.py
│   ├── evaluator.py
│   └── predictor.py
├── api/
│   ├── main.py (FastAPI app)
│   └── models_router.py
├── jobs/
│   ├── batch_prediction_job.py
│   ├── model_retraining_job.py
│   └── performance_monitoring_job.py
└── requirements.txt
```

### Dependencies

```
requirements.txt:
pandas==1.5.3
numpy==1.24.3
scikit-learn==1.3.0
xgboost==2.0.0
matplotlib==3.7.1
plotly==5.14.0
sqlalchemy==2.0.19
pymysql==1.1.0
redis==4.5.5
fastapi==0.100.0
uvicorn==0.23.1
pydantic==2.0.0
python-jose==3.3.0
```

---

*End of ML Pipeline & Data Science Workflow Document*
