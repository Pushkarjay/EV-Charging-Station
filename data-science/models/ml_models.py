"""
ML Models for EV Charging Station Demand Forecasting

Implements multiple models for:
1. Availability Prediction - Predict available slots at a station
2. Demand Forecasting - Forecast future demand patterns
3. Anomaly Detection - Detect unusual charging patterns
"""

import numpy as np
import pandas as pd
import logging
from typing import Tuple, Dict, List, Optional
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score, mean_absolute_percentage_error
import joblib
from datetime import datetime
import json

logger = logging.getLogger(__name__)


class AvailabilityPredictionModel:
    """
    Random Forest model for predicting available charging slots
    
    Target: available_slots
    Features: Temporal, location, and demand features
    """
    
    def __init__(self, random_state: int = 42):
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=15,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=random_state,
            n_jobs=-1
        )
        self.scaler = StandardScaler()
        self.is_fitted = False
        self.feature_names = []
        self.feature_importances_ = {}
    
    def fit(
        self,
        X: pd.DataFrame,
        y: pd.Series,
        validation_data: Optional[Tuple] = None
    ) -> Dict:
        """
        Train the availability prediction model
        
        Args:
            X: Feature matrix
            y: Target variable (available_slots)
            validation_data: Optional (X_val, y_val) for validation metrics
            
        Returns:
            Dictionary with training metrics
        """
        
        logger.info("=" * 50)
        logger.info("Training Availability Prediction Model")
        logger.info("=" * 50)
        
        # Store feature names
        self.feature_names = X.columns.tolist()
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y,
            test_size=0.2,
            random_state=42
        )
        
        # Train model
        self.model.fit(X_train, y_train)
        
        # Training predictions
        y_train_pred = self.model.predict(X_train)
        train_r2 = r2_score(y_train, y_train_pred)
        train_rmse = np.sqrt(mean_squared_error(y_train, y_train_pred))
        train_mae = mean_absolute_error(y_train, y_train_pred)
        
        # Test predictions
        y_test_pred = self.model.predict(X_test)
        test_r2 = r2_score(y_test, y_test_pred)
        test_rmse = np.sqrt(mean_squared_error(y_test, y_test_pred))
        test_mae = mean_absolute_error(y_test, y_test_pred)
        test_mape = mean_absolute_percentage_error(y_test, y_test_pred)
        
        # Feature importances
        self.feature_importances_ = dict(
            sorted(
                zip(self.feature_names, self.model.feature_importances_),
                key=lambda x: x[1],
                reverse=True
            )
        )
        
        self.is_fitted = True
        
        metrics = {
            'train': {
                'r2': train_r2,
                'rmse': train_rmse,
                'mae': train_mae,
                'samples': len(y_train)
            },
            'test': {
                'r2': test_r2,
                'rmse': test_rmse,
                'mae': test_mae,
                'mape': test_mape,
                'samples': len(y_test)
            },
            'top_features': dict(list(self.feature_importances_.items())[:10])
        }
        
        logger.info(f"\n✓ Model Training Complete")
        logger.info(f"  Train R²: {train_r2:.4f} | Test R²: {test_r2:.4f}")
        logger.info(f"  Train RMSE: {train_rmse:.2f} | Test RMSE: {test_rmse:.2f}")
        logger.info(f"  Train MAE: {train_mae:.2f} | Test MAE: {test_mae:.2f}")
        logger.info(f"  Test MAPE: {test_mape:.2%}")
        logger.info(f"\nTop 5 Important Features:")
        for i, (feat, imp) in enumerate(list(self.feature_importances_.items())[:5], 1):
            logger.info(f"  {i}. {feat}: {imp:.4f}")
        
        return metrics
    
    def predict(
        self,
        X: pd.DataFrame,
        return_confidence: bool = False
    ) -> np.ndarray:
        """
        Predict available slots
        
        Args:
            X: Feature matrix
            return_confidence: If True, return prediction intervals
            
        Returns:
            Predictions or (predictions, confidence_intervals)
        """
        
        if not self.is_fitted:
            raise ValueError("Model must be fitted before making predictions")
        
        X_scaled = self.scaler.transform(X)
        predictions = self.model.predict(X_scaled)
        
        # Ensure non-negative predictions
        predictions = np.maximum(predictions, 0)
        
        if return_confidence:
            # Get prediction intervals from trees
            tree_predictions = np.array([tree.predict(X_scaled) for tree in self.model.estimators_])
            std = np.std(tree_predictions, axis=0)
            
            return predictions, std
        
        return predictions
    
    def save(self, filepath: str):
        """Save model and scaler"""
        joblib.dump({
            'model': self.model,
            'scaler': self.scaler,
            'feature_names': self.feature_names,
            'feature_importances': self.feature_importances_,
            'timestamp': datetime.now().isoformat()
        }, filepath)
        logger.info(f"✓ Model saved to {filepath}")
    
    @classmethod
    def load(cls, filepath: str) -> 'AvailabilityPredictionModel':
        """Load saved model and scaler"""
        data = joblib.load(filepath)
        
        instance = cls()
        instance.model = data['model']
        instance.scaler = data['scaler']
        instance.feature_names = data['feature_names']
        instance.feature_importances_ = data['feature_importances']
        instance.is_fitted = True
        
        logger.info(f"✓ Model loaded from {filepath}")
        return instance


class DemandForecastingModel:
    """
    Gradient Boosting model for forecasting peak demand hours
    
    Target: demand_level (0-4 scale)
    Features: Temporal, location, and historical patterns
    """
    
    def __init__(self, random_state: int = 42):
        self.model = GradientBoostingRegressor(
            n_estimators=150,
            learning_rate=0.1,
            max_depth=5,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=random_state,
            subsample=0.8
        )
        self.scaler = StandardScaler()
        self.is_fitted = False
        self.feature_names = []
    
    def fit(
        self,
        X: pd.DataFrame,
        y: pd.Series
    ) -> Dict:
        """
        Train demand forecasting model
        
        Args:
            X: Feature matrix
            y: Target variable (demand level 0-4)
            
        Returns:
            Dictionary with training metrics
        """
        
        logger.info("=" * 50)
        logger.info("Training Demand Forecasting Model")
        logger.info("=" * 50)
        
        self.feature_names = X.columns.tolist()
        
        X_scaled = self.scaler.fit_transform(X)
        
        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y,
            test_size=0.2,
            random_state=42
        )
        
        self.model.fit(X_train, y_train)
        
        # Metrics
        y_train_pred = self.model.predict(X_train)
        y_test_pred = self.model.predict(X_test)
        
        train_r2 = r2_score(y_train, y_train_pred)
        test_r2 = r2_score(y_test, y_test_pred)
        test_mae = mean_absolute_error(y_test, y_test_pred)
        
        self.is_fitted = True
        
        logger.info(f"✓ Train R²: {train_r2:.4f} | Test R²: {test_r2:.4f}")
        logger.info(f"✓ Test MAE: {test_mae:.4f}")
        
        return {
            'train_r2': train_r2,
            'test_r2': test_r2,
            'test_mae': test_mae
        }
    
    def predict(self, X: pd.DataFrame) -> np.ndarray:
        """Predict demand levels (0-4)"""
        X_scaled = self.scaler.transform(X)
        predictions = self.model.predict(X_scaled)
        return np.clip(predictions, 0, 4)  # Ensure 0-4 range


class AnomalyDetector:
    """
    Detect unusual charging patterns using Isolation Forest
    
    Can identify:
    - Hardware failures
    - Unexpected demand spikes
    - User behavior anomalies
    """
    
    def __init__(self):
        from sklearn.ensemble import IsolationForest
        self.model = IsolationForest(
            contamination=0.05,
            random_state=42,
            n_jobs=-1
        )
        self.scaler = MinMaxScaler()
        self.is_fitted = False
    
    def fit(self, X: pd.DataFrame):
        """Fit anomaly detection model"""
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled)
        self.is_fitted = True
        logger.info("✓ Anomaly detector fitted")
    
    def detect(self, X: pd.DataFrame) -> Dict:
        """
        Detect anomalies
        
        Returns:
            {
                'predictions': array (-1 for anomaly, 1 for normal),
                'anomaly_indices': indices of anomalies detected,
                'anomaly_percentage': percentage of anomalies
            }
        """
        X_scaled = self.scaler.transform(X)
        predictions = self.model.predict(X_scaled)
        anomaly_indices = np.where(predictions == -1)[0]
        
        return {
            'predictions': predictions,
            'anomaly_indices': anomaly_indices,
            'anomaly_percentage': len(anomaly_indices) / len(predictions) * 100,
            'anomaly_count': len(anomaly_indices)
        }


class ModelEnsemble:
    """
    Ensemble of models for comprehensive predictions
    
    Combines:
    - Availability prediction (Random Forest)
    - Demand forecasting (Gradient Boosting)
    - Anomaly detection (Isolation Forest)
    """
    
    def __init__(self):
        self.availability_model = AvailabilityPredictionModel()
        self.demand_model = DemandForecastingModel()
        self.anomaly_detector = AnomalyDetector()
    
    def train_all(
        self,
        X: pd.DataFrame,
        y_availability: pd.Series,
        y_demand: pd.Series
    ):
        """Train all models"""
        
        logger.info("\n" + "=" * 60)
        logger.info("TRAINING COMPLETE MODEL ENSEMBLE")
        logger.info("=" * 60)
        
        # Train availability model
        self.availability_model.fit(X, y_availability)
        
        # Train demand model
        self.demand_model.fit(X, y_demand)
        
        # Train anomaly detector
        self.anomaly_detector.fit(X)
        
        logger.info("\n✓ All models trained successfully!")
    
    def predict_comprehensive(self, X: pd.DataFrame) -> Dict:
        """
        Get comprehensive predictions
        
        Returns:
            {
                'available_slots': predictions from availability model,
                'demand_level': predictions from demand model,
                'anomalies': anomaly detection results,
                'confidence': confidence metrics
            }
        """
        
        available_slots, confidence = self.availability_model.predict(X, return_confidence=True)
        demand_level = self.demand_model.predict(X)
        anomalies = self.anomaly_detector.detect(X)
        
        return {
            'available_slots': available_slots.round(0).astype(int),
            'available_slots_confidence': confidence,
            'demand_level': demand_level.round(1),
            'anomalies': anomalies,
            'predictions_timestamp': datetime.now().isoformat()
        }


# Usage Example:
# ensemble = ModelEnsemble()
# ensemble.train_all(X_train, y_availability, y_demand)
# predictions = ensemble.predict_comprehensive(X_new)
# print(predictions)
