import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { getCategory, getProducts } from '../../services/api';
import ProductCard from '../../components/common/ProductCard';
import Spinner from '../../components/common/Spinner';

export default function CategoryDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cRes, pRes] = await Promise.all([getCategory(id), getProducts(1, 100)]);
      setCategory(cRes.data.data);
      setProducts((pRes.data.data || []).filter(p => p.category?._id === id));
    } catch { router.push('/categories'); }
    setLoading(false);
  };

  if (loading) return <Spinner />;
  if (!category) return null;

  return (
    <>
      <Head><title>{category.name} - ShopMart</title></Head>
      <div className="container py-4">
        <div className="breadcrumb-bar mb-4">
          <Link href="/">Home</Link><span>›</span>
          <Link href="/categories">Categories</Link><span>›</span>
          <span className="active">{category.name}</span>
        </div>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 20 }}>{category.name}</h1>
        {products.length === 0 ? (
          <div className="empty-state"><span className="empty-state-icon">📦</span><h5>No products in this category</h5></div>
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
