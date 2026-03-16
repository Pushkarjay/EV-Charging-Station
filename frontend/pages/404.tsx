import Head from 'next/head';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page Not Found - EV Charging Station</title>
      </Head>
      <div className="container-fluid min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-accent-900 mb-4">Page Not Found</h2>
          <p className="text-accent-600 text-lg mb-8 max-w-md">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
          <Link href="/" className="btn btn-primary">
            Go Back Home
          </Link>
        </div>
      </div>
    </>
  );
}
