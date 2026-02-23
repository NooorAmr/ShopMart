import { useState, useEffect } from 'react';
import Head from 'next/head';
import { getProducts, getCategories } from '../../services/api';
import ProductCard from '../../components/common/ProductCard';
import Spinner from '../../components/common/Spinner';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 40;

  useEffect(() => {
    fetchProducts();
  }, [page]);

  useEffect(() => {
    if (search.trim()) {
      setFiltered(products.filter(p => p.title.toLowerCase().includes(search.toLowerCase())));
    } else {
      setFiltered(products);
    }
  }, [search, products]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await getProducts(page, LIMIT);
      setProducts(data.data || []);
      setFiltered(data.data || []);
      setTotalPages(data.metadata?.numberOfPages || 1);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <>
      <Head>
        <title>Products - ShopMart</title>
      </Head>

      <div className="container py-4">
        {/* Optional search bar */}
        <div className="mb-4" style={{ maxWidth: 320 }}>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: '1px solid #ddd', borderRadius: 6, fontSize: '0.85rem' }}
          />
        </div>

        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">📦</span>
            <h5>No products found</h5>
            <p>Try a different search term</p>
          </div>
        ) : (
          <>
            <div className="row g-3">
              {filtered.map(product => (
                <div className="col-6 col-md-4 col-lg-3" key={product._id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Pagination - matches screenshot bottom */}
            {totalPages > 1 && (
              <div className="pagination-bar">
                <button
                  className="pagination-btn"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  ‹
                </button>
                {pages.map(p => (
                  <button
                    key={p}
                    className={`pagination-btn ${page === p ? 'active' : ''}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="pagination-btn"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  ›
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
