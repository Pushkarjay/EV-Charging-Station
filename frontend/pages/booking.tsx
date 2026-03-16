import Head from 'next/head';
import { useState } from 'react';
import BookingForm from '@components/BookingForm';
import BookingDetails from '@components/BookingDetails';

export default function Booking() {
  const [bookingData, setBookingData] = useState(null);

  return (
    <>
      <Head>
        <title>Book Charging Session - EV Charging Station</title>
      </Head>
      <div className="container-fluid py-8">
        <h1 className="text-4xl font-bold mb-2 text-gradient">Book Your Charging Session</h1>
        <p className="text-accent-600 mb-8">Reserve your charging slot and get real-time updates</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BookingForm onBooking={setBookingData} />
          {bookingData && <BookingDetails booking={bookingData} />}
        </div>
      </div>
    </>
  );
}
