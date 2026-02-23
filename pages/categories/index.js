import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getCategories } from '../../services/api';
import Spinner from '../../components/common/Spinner';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getCategories()
      .then(r => setCategories(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head><title>Categories - ShopMart</title></Head>
      <div className="container py-4">
        <div className="page-header"><h1>Categories</h1></div>
        {loading ? <Spinner /> : (
          <div className="row g-3">
            {categories.map(cat => (
              <div className="col-6 col-md-4 col-lg-3" key={cat._id}>
                <div className="category-card" onClick={() => router.push(`/categories/${cat._id}`)}>
                  <img src={cat.image} alt={cat.name} onError={e => { e.target.src = 'https://via.placeholder.com/300x160'; }} />
                  <div className="cat-name">{cat.name}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
