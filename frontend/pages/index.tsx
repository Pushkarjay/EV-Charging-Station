import Head from 'next/head';
import Hero from '@components/Hero';
import Features from '@components/Features';
import StationGrid from '@components/StationGrid';
import Testimonials from '@components/Testimonials';
import CTA from '@components/CTA';

export default function Home() {
  return (
    <>
      <Head>
        <title>Home - EV Charging Station</title>
      </Head>
      <Hero />
      <Features />
      <StationGrid limit={6} />
      <Testimonials />
      <CTA />
    </>
  );
}
