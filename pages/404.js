import Link from 'next/link';
import Head from 'next/head';

export default function NotFound() {
  return (
    <>
      <Head><title>404 - ShopMart</title></Head>
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 40 }}>
        <div>
          <div style={{ fontSize: '5rem', fontWeight: 900, color: '#eee', marginBottom: 8 }}>404</div>
          <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Page not found</h2>
          <p style={{ color: '#888', marginBottom: 24, fontSize: '0.9rem' }}>
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/" className="btn-shopmart-primary">Go to Home</Link>
        </div>
      </div>
    </>
  );
}
