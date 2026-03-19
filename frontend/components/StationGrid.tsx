import { useState, useEffect } from 'react';
import StationCard from './StationCard';
import { stationService } from '../services';

interface Station {
  id: number;
  name: string;
  address: string;
  distance: number;
  chargers: number;
  available: number;
  rating: number;
  price: number;
  type: string;
}

interface StationGridProps {
  limit?: number;
}

export default function StationGrid({ limit }: StationGridProps) {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from real API
        const response = await stationService.getStations();
        const data = response.data;
        
        // Transform API response to match Station interface
        const transformedStations = (Array.isArray(data) ? data : data.stations || data.data || []).map((station: any) => ({
          id: station.id,
          name: station.name || 'Unknown Station',
          address: station.address || '',
          distance: station.distance || 0,
          chargers: station.total_chargers || station.chargers || 0,
          available: station.available_chargers || station.available || 0,
          rating: station.rating || 4.5,
          price: station.price_per_kwh || 0.30,
          type: station.charger_types?.[0] || 'DC Fast',
        }));
        
        setStations(limit ? transformedStations.slice(0, limit) : transformedStations);
      } catch (err) {
        console.error('Failed to fetch stations:', err);
        setError('Could not load stations. Showing demo data.');
        
        // Fallback to mock data
        const mockStations = [
          {
            id: 1,
            name: 'Downtown Station',
            address: '123 Main St, Downtown',
            distance: 0.5,
            chargers: 12,
            available: 8,
            rating: 4.8,
            price: 0.35,
            type: 'DC Fast',
          },
          {
            id: 2,
            name: 'Green Park Charging Hub',
            address: '456 Park Ave, Green District',
            distance: 1.2,
            chargers: 20,
            available: 15,
            rating: 4.9,
            price: 0.28,
            type: 'Level 3',
          },
          {
            id: 3,
            name: 'Tech Central Station',
            address: '789 Tech Blvd, Innovation Hub',
            distance: 2.1,
            chargers: 8,
            available: 3,
            rating: 4.5,
            price: 0.32,
            type: 'DC Fast',
          },
          {
            id: 4,
            name: 'Shopping Mall Charger',
            address: '321 Mall Rd, Commerce Zone',
            distance: 1.8,
            chargers: 16,
            available: 10,
            rating: 4.7,
            price: 0.30,
            type: 'Level 2',
          },
          {
            id: 5,
            name: 'Airport EV Hub',
            address: '654 Airport Way, Terminal 1',
            distance: 5.0,
            chargers: 24,
            available: 18,
            rating: 4.6,
            price: 0.38,
            type: 'DC Fast',
          },
          {
            id: 6,
            name: 'Riverside Station',
            address: '987 River Rd, Eco District',
            distance: 3.2,
            chargers: 10,
            available: 7,
            rating: 4.8,
            price: 0.26,
            type: 'Level 2',
          },
        ];
        
        setStations(limit ? mockStations.slice(0, limit) : mockStations);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStations();
  }, [limit]);

  if (loading) {
    return (
      <div className="container-fluid py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-accent-50">
      <div className="container-fluid">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">Popular Stations</h2>
          <p className="text-accent-600 text-lg max-w-2xl mx-auto">
            Discover highly-rated charging stations in your area
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.map((station) => (
            <StationCard key={station.id} station={station} />
          ))}
        </div>

        {limit && (
          <div className="text-center mt-12">
            <a href="/stations" className="btn btn-primary btn-large">
              View All Stations
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
