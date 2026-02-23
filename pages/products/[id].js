import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { getProduct } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import Stars from '../../components/common/Stars';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addProduct, loadingCart } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { token } = useAuth();

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await getProduct(id);
      setProduct(data.data);
    } catch {
      router.push('/products');
    }
    setLoading(false);
  };

  if (loading) return <Spinner />;
  if (!product) return null;

  const isWishlisted = wishlistIds.includes(product._id);

  const handleAddToCart = () => {
    const currentToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!currentToken) { toast.error('Please login first'); router.push('/auth/login'); return; }
    addProduct(product._id);
  };

  const handleWishlist = () => {
    const currentToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!currentToken) { toast.error('Please login first'); router.push('/auth/login'); return; }
    toggleWishlist(product._id);
  };

  return (
    <>
      <Head>
        <title>{product.title} - ShopMart</title>
      </Head>

      <div className="container py-4">
        {/* Breadcrumb */}
        <div className="breadcrumb-bar mb-4">
          <Link href="/">Home</Link>
          <span>›</span>
          <Link href="/products">Products</Link>
          <span>›</span>
          <span className="active">Product Details</span>
        </div>

        {/* Product Card */}
        <div className="product-detail-card">
          <div className="row g-4 align-items-start">
            {/* Image */}
            <div className="col-md-5 col-lg-4 text-center">
              <img
                src={product.imageCover}
                alt={product.title}
                className="product-detail-img"
                onError={e => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
              />
            </div>

            {/* Info */}
            <div className="col-md-7 col-lg-8">
              <div className="product-detail-brand">{product.brand?.name}</div>
              <h1 className="product-detail-title">{product.title}</h1>
              <div className="product-detail-cat">{product.category?.name}</div>

              {product.description && (
                <p className="product-detail-desc">{product.description}</p>
              )}

              <div className="product-detail-price">EGP: {product.price?.toLocaleString()}</div>

              <div className="product-detail-rating">
                <Stars rating={product.ratingsAverage} count={`${product.ratingsAverage?.toFixed(1)}`} />
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn-add-to-cart-detail"
                  onClick={handleAddToCart}
                  disabled={loadingCart}
                  style={{ flex: 1 }}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart
                </button>
                <button
                  className={`btn-wishlist-detail ${isWishlisted ? 'active' : ''}`}
                  onClick={handleWishlist}
                >
                  {isWishlisted ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#dc3545" stroke="#dc3545">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
