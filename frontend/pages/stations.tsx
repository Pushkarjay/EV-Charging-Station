import Head from 'next/head';
import StationMap from '@components/StationMap';
import { useState } from 'react';
import StationList from '@components/StationList';

export default function Stations() {
  const [selectedStation, setSelectedStation] = useState(null);

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <StationMap onStationSelect={setSelectedStation} />
          </div>
          <div className="lg:col-span-1">
            <StationList selectedStation={selectedStation} />
          </div>
        </div>
      </div>
    </>
  );
}
