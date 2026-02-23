import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>ShopMart - Welcome</title>
      </Head>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1>Welcome to ShopMart</h1>
          <p>
            Discover the latest technology, fashion, and lifestyle products. Quality guaranteed with fast shipping and excellent customer service.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <button className="btn-shopmart-primary" onClick={() => router.push('/products')}>
              Shop Now
            </button>
            <button className="btn-shopmart-outline" onClick={() => router.push('/categories')}>
              Browse Categories
            </button>
          </div>
        </div>
      </section>

      {/* Divider */}
      <hr className="section-divider" />
    </>
  );
}
