"""
Feature Engineering Pipeline for EV Charging Station Demand Forecasting

This module handles feature engineering for ML models including:
- Temporal features (hour, day, month, season)
- Location-based features (station density, proximity)
- Historical features (demand patterns, availability trends)
- Weather features (if available)
- Holiday & special events features
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import logging
from typing import Tuple, List, Dict

logger = logging.getLogger(__name__)


class TemporalFeatures:
    """Generate temporal features"""
    
    @staticmethod
    def create_temporal_features(df: pd.DataFrame, datetime_col: str = 'timestamp') -> pd.DataFrame:
        """
        Create temporal features from datetime column
        
        Args:
            df: DataFrame with datetime column
            datetime_col: Name of datetime column
            
        Returns:
            DataFrame with temporal features added
        """
        
        df = df.copy()
        df[datetime_col] = pd.to_datetime(df[datetime_col])
        
        # Hour of day (0-23)
        df['hour'] = df[datetime_col].dt.hour
        
        # Day of week (0-6, 0=Monday)
        df['day_of_week'] = df[datetime_col].dt.dayofweek
        
        # Day of month (1-31)
        df['day_of_month'] = df[datetime_col].dt.day
        
        # Month (1-12)
        df['month'] = df[datetime_col].dt.month
        
        # Quarter (1-4)
        df['quarter'] = df[datetime_col].dt.quarter
        
        # Week of year
        df['week_of_year'] = df[datetime_col].dt.isocalendar().week
        
        # Is weekend (0 or 1)
        df['is_weekend'] = (df['day_of_week'] >= 5).astype(int)
        
        # Is holiday (simplified - can be enhanced with holiday calendar)
        holidays = [
            (1, 1),   # New Year
            (12, 25), # Christmas
        ]
        df['is_holiday'] = df.apply(
            lambda row: 1 if (row[datetime_col].month, row[datetime_col].day) in holidays else 0, axis=1
        )
        
        # Time period of day
        def get_time_period(hour):
            if 5 <= hour < 9:
                return 'morning_rush'  # 1
            elif 9 <= hour < 12:
                return 'morning'  # 2
            elif 12 <= hour < 14:
                return 'lunch'  # 3
            elif 14 <= hour < 17:
                return 'afternoon'  # 4
            elif 17 <= hour < 20:
                return 'evening_rush'  # 5
            elif 20 <= hour < 23:
                return 'evening'  # 6
            else:
                return 'night'  # 0
        
        df['time_period'] = df['hour'].apply(get_time_period)
        
        # Encode time periods
        time_period_map = {
            'night': 0, 'morning_rush': 1, 'morning': 2,
            'lunch': 3, 'afternoon': 4, 'evening_rush': 5, 'evening': 6
        }
        df['time_period_encoded'] = df['time_period'].map(time_period_map)
        
        # Business hours (9-17)
        df['is_business_hours'] = ((df['hour'] >= 9) & (df['hour'] <= 17) & (df['is_weekend'] == 0)).astype(int)
        
        logger.info(f"✓ Created temporal features: {[col for col in df.columns if col not in ['timestamp']]}")
        
        return df


class LocationFeatures:
    """Generate location-based features"""
    
    @staticmethod
    def create_distance_features(
        df: pd.DataFrame,
        center_lat: float = 28.5355,
        center_lng: float = 77.3910
    ) -> pd.DataFrame:
        """
        Create distance features from center point (New Delhi center by default)
        
        Args:
            df: DataFrame with latitude and longitude columns
            center_lat: Reference latitude center
            center_lng: Reference longitude center
            
        Returns:
            DataFrame with distance features
        """
        
        df = df.copy()
        
        # Distance from city center (Haversine formula)
        from math import radians, sin, cos, sqrt, atan2
        
        def haversine(row):
            lat1, lon1, lat2, lon2 = map(radians, [
                center_lat, center_lng, row['latitude'], row['longitude']
            ])
            
            dlat = lat2 - lat1
            dlon = lon2 - lon1
            
            a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
            c = 2 * atan2(sqrt(a), sqrt(1 - a))
            
            return 6371 * c  # Earth's radius in km
        
        df['distance_from_center'] = df.apply(haversine, axis=1)
        
        # Zone classification based on distance
        def get_zone(distance):
            if distance < 5:
                return 'inner'  # 1
            elif distance < 15:
                return 'mid'  # 2
            else:
                return 'outer'  # 3
        
        df['zone'] = df['distance_from_center'].apply(get_zone).astype('category')
        df['zone_encoded'] = df['zone'].cat.codes
        
        logger.info("✓ Created location features: distance_from_center, zone")
        
        return df


class DemandFeatures:
    """Generate features related to demand patterns"""
    
    @staticmethod
    def create_historical_demand_features(
        df: pd.DataFrame,
        station_id_col: str = 'station_id',
        windows: List[int] = [1, 3, 7, 30]
    ) -> pd.DataFrame:
        """
        Create rolling statistics for demand patterns
        
        Args:
            df: DataFrame with demand/occupancy data sorted by time
            station_id_col: Column name for station ID
            windows: Window sizes in hours for rolling statistics
            
        Returns:
            DataFrame with historical demand features
        """
        
        df = df.copy()
        df = df.sort_values('timestamp')
        
        # Create available_slots if not present
        if 'available_slots' not in df.columns and 'total_slots' in df.columns:
            df['available_slots'] = df['total_slots'] - df['occupied_slots']
        
        # Rolling statistics for availability
        for window in windows:
            # Mean availability
            df[f'mean_available_{window}h'] = df.groupby(station_id_col)['available_slots'].rolling(
                window=window, min_periods=1
            ).mean().values
            
            # Std deviation
            df[f'std_available_{window}h'] = df.groupby(station_id_col)['available_slots'].rolling(
                window=window, min_periods=1
            ).std().values
            
            # Min availability
            df[f'min_available_{window}h'] = df.groupby(station_id_col)['available_slots'].rolling(
                window=window, min_periods=1
            ).min().values
            
            # Max availability
            df[f'max_available_{window}h'] = df.groupby(station_id_col)['available_slots'].rolling(
                window=window, min_periods=1
            ).max().values
        
        logger.info(f"✓ Created historical demand features for windows: {windows}")
        
        return df
    
    @staticmethod
    def create_occupancy_rate_features(df: pd.DataFrame) -> pd.DataFrame:
        """
        Create occupancy rate features
        
        Args:
            df: DataFrame with total_slots and available_slots
            
        Returns:
            DataFrame with occupancy features
        """
        
        df = df.copy()
        
        # Occupancy rate (0-1)
        if 'occupied_slots' in df.columns and 'total_slots' in df.columns:
            df['occupancy_rate'] = df['occupied_slots'] / df['total_slots']
        elif 'available_slots' in df.columns and 'total_slots' in df.columns:
            df['occupancy_rate'] = 1 - (df['available_slots'] / df['total_slots'])
        
        # Availability rate
        df['availability_rate'] = 1 - df['occupancy_rate']
        
        # Occupancy category
        def categorize_occupancy(rate):
            if rate < 0.25:
                return 'plenty'  # 0
            elif rate < 0.50:
                return 'available'  # 1
            elif rate < 0.75:
                return 'busy'  # 2
            else:
                return 'full'  # 3
        
        df['occupancy_category'] = df['occupancy_rate'].apply(categorize_occupancy).astype('category')
        df['occupancy_encoded'] = df['occupancy_category'].cat.codes
        
        logger.info("✓ Created occupancy rate features")
        
        return df


class FeatureEngineeringPipeline:
    """Complete feature engineering pipeline"""
    
    def __init__(self):
        self.temporal = TemporalFeatures()
        self.location = LocationFeatures()
        self.demand = DemandFeatures()
    
    def transform(
        self,
        df: pd.DataFrame,
        datetime_col: str = 'timestamp',
        station_id_col: str = 'station_id'
    ) -> pd.DataFrame:
        """
        Apply complete feature engineering pipeline
        
        Args:
            df: Raw input DataFrame
            datetime_col: Name of datetime column
            station_id_col: Name of station ID column
            
        Returns:
            DataFrame with all engineered features
        """
        
        logger.info("=" * 50)
        logger.info("Starting Feature Engineering Pipeline")
        logger.info("=" * 50)
        
        # Step 1: Temporal features
        df = self.temporal.create_temporal_features(df, datetime_col)
        
        # Step 2: Location features (if latitude/longitude present)
        if 'latitude' in df.columns and 'longitude' in df.columns:
            df = self.location.create_distance_features(df)
        
        # Step 3: Occupancy features
        if 'available_slots' in df.columns or 'occupied_slots' in df.columns:
            df = self.demand.create_occupancy_rate_features(df)
        
        # Step 4: Historical demand features
        if station_id_col in df.columns:
            df = self.demand.create_historical_demand_features(df, station_id_col)
        
        logger.info("=" * 50)
        logger.info(f"✓ Feature Engineering Complete")
        logger.info(f"  Total features: {len(df.columns)}")
        logger.info(f"  Feature types: {df.dtypes.value_counts().to_dict()}")
        logger.info("=" * 50)
        
        return df
    
    def get_feature_names(
        self,
        include_temporal: bool = True,
        include_location: bool = True,
        include_demand: bool = True
    ) -> List[str]:
        """Get list of engineered feature names"""
        
        features = []
        
        if include_temporal:
            features.extend([
                'hour', 'day_of_week', 'day_of_month', 'month', 'quarter',
                'week_of_year', 'is_weekend', 'is_holiday', 'time_period_encoded',
                'is_business_hours'
            ])
        
        if include_location:
            features.extend(['distance_from_center', 'zone_encoded'])
        
        if include_demand:
            features.extend([
                'occupancy_rate', 'availability_rate', 'occupancy_encoded',
                'mean_available_1h', 'std_available_1h', 'min_available_1h', 'max_available_1h',
                'mean_available_3h', 'std_available_3h', 'min_available_3h', 'max_available_3h',
                'mean_available_7h', 'std_available_7h', 'min_available_7h', 'max_available_7h',
                'mean_available_30h', 'std_available_30h', 'min_available_30h', 'max_available_30h',
            ])
        
        return features


# Usage example:
# pipeline = FeatureEngineeringPipeline()
# processed_df = pipeline.transform(raw_df)
# feature_names = pipeline.get_feature_names()
