import Head from 'next/head';
import DashboardStats from '@components/DashboardStats';
import RecentBookings from '@components/RecentBookings';
import UsageChart from '@components/UsageChart';
import AccountSettings from '@components/AccountSettings';

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard - EV Charging Station</title>
      </Head>
      <div className="container-fluid py-8">
        <h1 className="text-4xl font-bold mb-8 text-gradient">Your Dashboard</h1>

        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <RecentBookings />
            <UsageChart />
          </div>
          <div className="lg:col-span-1">
            <AccountSettings />
          </div>
        </div>
      </div>
    </>
  );
}
