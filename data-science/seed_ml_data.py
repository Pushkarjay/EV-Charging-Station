"""
Sample Dataset Generator for EV Charging Station ML Models

Generates synthetic but realistic EV charging data for:
1. Availability Prediction
2. Demand Forecasting  
3. Anomaly Detection

Usage:
    python seed_ml_data.py [--output data/samples] [--rows 10000] [--stations 50]
"""

import pandas as pd
import numpy as np
import argparse
from datetime import datetime, timedelta
import logging
import os
import json

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class SyntheticDataGenerator:
    """Generate realistic synthetic EV charging station data"""
    
    def __init__(self, random_seed: int = 42, n_stations: int = 50):
        """
        Initialize data generator
        
        Args:
            random_seed: Random seed for reproducibility
            n_stations: Number of charging stations
        """
        np.random.seed(random_seed)
        self.n_stations = n_stations
        self.stations = self._create_stations()
    
    def _create_stations(self) -> pd.DataFrame:
        """Create station metadata"""
        
        stations = []
        for i in range(1, self.n_stations + 1):
            # Simulate stations in/around a city (e.g., Delhi area 28°N, 77°E)
            lat = np.random.uniform(28.4, 28.6)
            lng = np.random.uniform(77.0, 77.5)
            
            stations.append({
                'station_id': i,
                'station_name': f'Charging Station {i}',
                'latitude': lat,
                'longitude': lng,
                'total_slots': np.random.choice([4, 6, 8, 10, 12, 16]),
                'charger_types': np.random.choice(['AC', 'DC', 'Both']),
                'location_type': np.random.choice(['mall', 'parking', 'highway', 'residential', 'commercial'])
            })
        
        return pd.DataFrame(stations)
    
    def _simulate_occupancy_pattern(
        self,
        hour: int,
        day_of_week: int,
        total_slots: int
    ) -> int:
        """
        Simulate realistic occupancy patterns
        
        Peak hours: 8-11 AM, 5-8 PM (weekdays)
        Off-peak: 2-4 AM
        Weekend patterns similar but lower magnitude
        """
        
        # Base occupancy rate by hour
        base_rates = {
            0: 0.1,   # Midnight
            1: 0.05,  # 1 AM
            2: 0.02,  # 2 AM (lowest)
            3: 0.02,
            4: 0.05,
            5: 0.1,
            6: 0.2,
            7: 0.4,
            8: 0.7,   # 8 AM
            9: 0.8,   # Morning peak starts
            10: 0.85, # Morning peak
            11: 0.75,
            12: 0.65,
            13: 0.60,
            14: 0.65,
            15: 0.70,
            16: 0.75,
            17: 0.85, # Evening rush
            18: 0.90, # Evening peak
            19: 0.85,
            20: 0.75,
            21: 0.60,
            22: 0.40,
            23: 0.20
        }
        
        base_rate = base_rates.get(hour, 0.5)
        
        # Adjust for weekday vs weekend
        if day_of_week >= 5:  # Saturday(5) or Sunday(6)
            base_rate *= 0.7  # 30% lower on weekends
        
        # Add some random noise
        noise = np.random.normal(0, 0.05)
        base_rate = np.clip(base_rate + noise, 0, 1)
        
        available_slots = total_slots - int(np.round(base_rate * total_slots))
        return max(0, available_slots)
    
    def _simulate_charging_duration(self) -> int:
        """Simulate charging session duration in minutes"""
        # Most sessions: 30-120 min, some fast charges: 15-30 min, some slow: 120+ min
        choice = np.random.random()
        if choice < 0.7:
            return np.random.randint(30, 120)  # Standard duration
        elif choice < 0.85:
            return np.random.randint(15, 30)   # Fast charging
        else:
            return np.random.randint(120, 300) # Extended charging
    
    def generate_time_series_data(
        self,
        n_rows: int = 10000,
        start_date: str = '2025-01-01',
        end_date: str = '2025-12-31'
    ) -> pd.DataFrame:
        """
        Generate time series data for each station
        
        Args:
            n_rows: Total number of records to generate
            start_date: Start date for data
            end_date: End date for data
            
        Returns:
            DataFrame with time series data
        """
        
        logger.info(f"Generating {n_rows} records from {start_date} to {end_date}...")
        
        start = pd.Timestamp(start_date)
        end = pd.Timestamp(end_date)
        date_range = end - start
        
        data = []
        
        for _ in range(n_rows):
            # Random station
            station = self.stations.sample(1).iloc[0]
            
            # Random timestamp
            random_days = np.random.randint(0, date_range.days)
            random_hours = np.random.randint(0, 24)
            random_minutes = np.random.randint(0, 60)
            timestamp = start + timedelta(
                days=random_days,
                hours=random_hours,
                minutes=random_minutes
            )
            
            # Calculate features
            available = self._simulate_occupancy_pattern(
                hour=timestamp.hour,
                day_of_week=timestamp.weekday(),
                total_slots=station['total_slots']
            )
            
            # Simulate charging events
            n_sessions = np.random.poisson(
                lam=2 if timestamp.hour in [8, 18] else 0.5
            )
            total_kwh = sum([
                np.random.uniform(10, 80) * (self._simulate_charging_duration() / 60)
                for _ in range(n_sessions)
            ])
            
            # Revenue estimation (assuming $0.25/kWh)
            revenue = total_kwh * 0.25
            
            data.append({
                'timestamp': timestamp,
                'station_id': station['station_id'],
                'station_name': station['station_name'],
                'latitude': station['latitude'],
                'longitude': station['longitude'],
                'total_slots': station['total_slots'],
                'available_slots': available,
                'occupied_slots': station['total_slots'] - available,
                'occupancy_rate': 1 - (available / station['total_slots']),
                'n_charging_sessions': n_sessions,
                'total_kwh': total_kwh,
                'revenue': revenue,
                'avg_session_duration': np.mean([
                    self._simulate_charging_duration() for _ in range(max(1, n_sessions))
                ]),
                'charger_type': station['charger_types'],
                'location_type': station['location_type']
            })
        
        df = pd.DataFrame(data)
        
        # Sort by timestamp and station
        df = df.sort_values(['station_id', 'timestamp']).reset_index(drop=True)
        
        logger.info(f"✓ Generated {len(df)} records")
        logger.info(f"  Time range: {df['timestamp'].min()} to {df['timestamp'].max()}")
        logger.info(f"  Stations: {df['station_id'].nunique()}")
        
        return df
    
    def generate_aggregated_daily_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Generate daily aggregated data for trend analysis
        
        Args:
            df: Time series data
            
        Returns:
            Daily aggregated DataFrame
        """
        
        logger.info("Generating daily aggregated data...")
        
        df_daily = df.copy()
        df_daily['date'] = df_daily['timestamp'].dt.date
        
        daily_agg = df_daily.groupby(['date', 'station_id']).agg({
            'available_slots': 'mean',
            'occupied_slots': 'mean',
            'occupancy_rate': 'mean',
            'n_charging_sessions': 'sum',
            'total_kwh': 'sum',
            'revenue': 'sum',
            'avg_session_duration': 'mean'
        }).reset_index()
        
        logger.info(f"✓ Generated {len(daily_agg)} daily records")
        
        return daily_agg
    
    def generate_training_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Generate feature-engineered data ready for ML training
        
        Args:
            df: Raw time series data
            
        Returns:
            Feature-engineered DataFrame
        """
        
        logger.info("Generating training features...")
        
        df = df.copy()
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        
        # Temporal features
        df['hour'] = df['timestamp'].dt.hour
        df['day_of_week'] = df['timestamp'].dt.dayofweek
        df['day_of_month'] = df['timestamp'].dt.day
        df['month'] = df['timestamp'].dt.month
        df['quarter'] = df['timestamp'].dt.quarter
        df['week_of_year'] = df['timestamp'].dt.isocalendar().week
        df['is_weekend'] = (df['day_of_week'] >= 5).astype(int)
        
        # Time period encoding
        def get_time_period_encoded(hour):
            if 5 <= hour < 9:
                return 1  # morning_rush
            elif 9 <= hour < 12:
                return 2  # morning
            elif 12 <= hour < 14:
                return 3  # lunch
            elif 14 <= hour < 17:
                return 4  # afternoon
            elif 17 <= hour < 20:
                return 5  # evening_rush
            elif 20 <= hour < 23:
                return 6  # evening
            else:
                return 0  # night
        
        df['time_period_encoded'] = df['hour'].apply(get_time_period_encoded)
        
        # Business hours
        df['is_business_hours'] = (
            (df['hour'] >= 9) & (df['hour'] <= 17) & (df['is_weekend'] == 0)
        ).astype(int)
        
        # Distance from center (Delhi center: 28.5355, 77.3910)
        from math import radians, sin, cos, sqrt, atan2
        
        def haversine_distance(lat, lng):
            center_lat, center_lng = 28.5355, 77.3910
            lat1, lon1, lat2, lon2 = map(radians, [
                center_lat, center_lng, lat, lng
            ])
            dlat = lat2 - lat1
            dlon = lon2 - lon1
            a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
            c = 2 * atan2(sqrt(a), sqrt(1 - a))
            return 6371 * c  # Earth radius in km
        
        df['distance_from_center'] = df.apply(
            lambda row: haversine_distance(row['latitude'], row['longitude']),
            axis=1
        )
        
        # Zone classification
        def get_zone_encoded(distance):
            if distance < 5:
                return 1  # inner
            elif distance < 15:
                return 2  # mid
            else:
                return 3  # outer
        
        df['zone_encoded'] = df['distance_from_center'].apply(get_zone_encoded)
        
        # Location type encoding
        location_map = {
            'mall': 1, 'parking': 2, 'highway': 3, 'residential': 4, 'commercial': 5
        }
        df['location_type_encoded'] = df['location_type'].map(location_map)
        
        # Rolling statistics (for recently added records)
        for window in [1, 3, 7]:
            df[f'rolling_mean_occupancy_{window}d'] = df.groupby('station_id')[
                'occupancy_rate'
            ].transform(lambda x: x.rolling(window=window, min_periods=1).mean())
            
            df[f'rolling_std_occupancy_{window}d'] = df.groupby('station_id')[
                'occupancy_rate'
            ].transform(lambda x: x.rolling(window=window, min_periods=1).std())
        
        logger.info(f"✓ Generated features for {len(df)} records")
        logger.info(f"  Total features: {len(df.columns)}")
        
        return df


def main():
    parser = argparse.ArgumentParser(
        description='Generate synthetic ML training data for EV charging stations'
    )
    parser.add_argument(
        '--output',
        default='data-science/datasets/training_data',
        help='Output directory for datasets'
    )
    parser.add_argument(
        '--rows',
        type=int,
        default=10000,
        help='Number of records to generate'
    )
    parser.add_argument(
        '--stations',
        type=int,
        default=50,
        help='Number of charging stations'
    )
    parser.add_argument(
        '--seed',
        type=int,
        default=42,
        help='Random seed for reproducibility'
    )
    
    args = parser.parse_args()
    
    # Create output directory
    os.makedirs(args.output, exist_ok=True)
    
    logger.info("=" * 60)
    logger.info("ML Training Data Generation")
    logger.info("=" * 60)
    logger.info(f"Output directory: {args.output}")
    logger.info(f"Records to generate: {args.rows}")
    logger.info(f"Number of stations: {args.stations}")
    logger.info("")
    
    # Initialize generator
    generator = SyntheticDataGenerator(
        random_seed=args.seed,
        n_stations=args.stations
    )
    
    # Generate time series data
    df_timeseries = generator.generate_time_series_data(n_rows=args.rows)
    
    # Generate daily aggregated data
    df_daily = generator.generate_aggregated_daily_data(df_timeseries)
    
    # Generate feature-engineered data
    df_features = generator.generate_training_features(df_timeseries)
    
    # Save datasets
    logger.info("\nSaving datasets...")
    
    # Time series data
    ts_path = os.path.join(args.output, 'timeseries_data.csv')
    df_timeseries.to_csv(ts_path, index=False)
    logger.info(f"✓ Time series data: {ts_path} ({len(df_timeseries)} rows)")
    
    # Daily aggregated data
    daily_path = os.path.join(args.output, 'daily_aggregated_data.csv')
    df_daily.to_csv(daily_path, index=False)
    logger.info(f"✓ Daily data: {daily_path} ({len(df_daily)} rows)")
    
    # Feature-engineered data
    features_path = os.path.join(args.output, 'training_features.csv')
    df_features.to_csv(features_path, index=False)
    logger.info(f"✓ Training features: {features_path} ({len(df_features)} rows, {len(df_features.columns)} features)")
    
    # Generate metadata
    metadata = {
        'generated_at': datetime.now().isoformat(),
        'n_records': len(df_timeseries),
        'n_stations': args.stations,
        'time_period': {
            'start': str(df_timeseries['timestamp'].min()),
            'end': str(df_timeseries['timestamp'].max())
        },
        'datasets': {
            'timeseries': ts_path,
            'daily_aggregated': daily_path,
            'training_features': features_path
        },
        'data_statistics': {
            'occupancy_rate_mean': float(df_timeseries['occupancy_rate'].mean()),
            'occupancy_rate_std': float(df_timeseries['occupancy_rate'].std()),
            'avg_revenue_per_station': float(df_timeseries['revenue'].sum() / args.stations),
            'total_kwh': float(df_timeseries['total_kwh'].sum())
        }
    }
    
    metadata_path = os.path.join(args.output, 'metadata.json')
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    logger.info(f"✓ Metadata: {metadata_path}")
    
    logger.info("\n" + "=" * 60)
    logger.info("Dataset Generation Complete!")
    logger.info("=" * 60)
    logger.info("\nDatasets Ready for Training:")
    logger.info("  • Availability Prediction: training_features.csv")
    logger.info("  • Demand Forecasting: daily_aggregated_data.csv")
    logger.info("  • Anomaly Detection: timeseries_data.csv")
    logger.info("\nUsage:")
    logger.info("  python data-science/models/ml_models.py  # to train models")
    

if __name__ == '__main__':
    main()
