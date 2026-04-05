import Head from 'next/head';
import StationMap from '@components/StationMap';
import { useState } from 'react';
import StationList from '@components/StationList';
import StationSearchControls from '@components/StationSearchControls';
import StationDetail from '@components/StationDetail';

export default function Stations() {
  const [selectedStation, setSelectedStation] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState({ lat: 20.2961, lng: 85.8245 });
  const [detailMode, setDetailMode] = useState(false);

  const handleStationSelect = (station: any) => {
    setSelectedStation(station);
    setDetailMode(true);
  };

  return (
    <>
      <Head>
        <title>Find Charging Stations - EV Charging Station</title>
      </Head>
      <div className="container-fluid py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gradient">
            Find Charging Stations
          </h1>
          <p className="text-accent-600 text-lg">
            Discover and reserve charging stations near you with real-time availability
          </p>
        </div>

        {/* Search and Filter Controls */}
        <StationSearchControls
          onFilterChange={setActiveFilter}
          onSearchChange={setSearchQuery}
          onLocationChange={(lat, lng) => setMapCenter({ lat, lng })}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <StationMap onStationSelect={handleStationSelect} center={mapCenter} />
          </div>
          <div className="lg:col-span-1">
            {detailMode && selectedStation ? (
              <StationDetail station={selectedStation} onClose={() => setDetailMode(false)} />
            ) : (
              <StationList 
                selectedStation={selectedStation} 
                filter={activeFilter} 
                searchQuery={searchQuery}
                onStationSelect={handleStationSelect}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
