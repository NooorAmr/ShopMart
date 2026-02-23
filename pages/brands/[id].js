import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { getBrand, getProducts } from '../../services/api';
import ProductCard from '../../components/common/ProductCard';
import Spinner from '../../components/common/Spinner';

export default function BrandDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bRes, pRes] = await Promise.all([getBrand(id), getProducts(1, 100)]);
      setBrand(bRes.data.data);
      setProducts((pRes.data.data || []).filter(p => p.brand?._id === id));
    } catch { router.push('/brands'); }
    setLoading(false);
  };

  if (loading) return <Spinner />;
  if (!brand) return null;

  return (
    <>
      <Head><title>{brand.name} - ShopMart</title></Head>
      <div className="container py-4">
        <div className="breadcrumb-bar mb-4">
          <Link href="/">Home</Link><span>›</span>
          <Link href="/brands">Brands</Link><span>›</span>
          <span className="active">{brand.name}</span>
        </div>
        <div className="d-flex align-items-center gap-3 mb-4">
          <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, background: '#f8f8f8' }}>
            <img src={brand.image} alt={brand.name} style={{ maxHeight: 50, maxWidth: 120, objectFit: 'contain', filter: 'grayscale(100%)' }} />
          </div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>{brand.name}</h1>
        </div>
        {products.length === 0 ? (
          <div className="empty-state"><span className="empty-state-icon">📦</span><h5>No products for this brand</h5></div>
        ) : (
          <div className="row g-3">
            {products.map(p => (
              <div className="col-6 col-md-4 col-lg-3" key={p._id}><ProductCard product={p} /></div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
