import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';
import '../styles/theme.css';
import Layout from '@components/Layout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0ea5e9" />
        <title>EV Charging Station - Find Charge Stations Near You</title>
        <meta
          name="description"
          content="Find and reserve EV charging stations near you. Easy booking, real-time availability, and competitive pricing."
        />
        <meta name="keywords" content="EV charging, electric vehicle, charging station, sustainable transport" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="EV Charging Station" />
        <meta
          property="og:description"
          content="Find and book EV charging stations with real-time availability"
        />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
