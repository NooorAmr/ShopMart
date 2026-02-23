import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import Stars from '../../components/common/Stars';
import ProtectedRoute from '../../components/common/ProtectedRoute';

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addProduct } = useCart();
  const router = useRouter();

  return (
    <ProtectedRoute>
      <Head><title>Wishlist - ShopMart</title></Head>
      <div className="container py-4">
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 20 }}>
          Wishlist {wishlist.length > 0 && <span style={{ fontSize: '1rem', color: '#888', fontWeight: 400 }}>({wishlist.length} items)</span>}
        </h1>

        {wishlist.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">♡</span>
            <h5>Your wishlist is empty</h5>
            <p>Save items you love</p>
            <Link href="/products" className="btn-shopmart-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="row g-3">
            {wishlist.map(product => (
              <div className="col-6 col-md-4 col-lg-3" key={product._id}>
                <div className="product-card">
                  <img
                    className="card-img-top"
                    src={product.imageCover}
                    alt={product.title}
                    onClick={() => router.push(`/products/${product._id}`)}
                    style={{ cursor: 'pointer' }}
                    onError={e => { e.target.src = 'https://via.placeholder.com/300'; }}
                  />
                  <div className="card-body">
                    <div className="brand-name">{product.brand?.name}</div>
                    <div className="product-title">{product.title}</div>
                    <div className="category-name">{product.category?.name}</div>
                    <Stars rating={product.ratingsAverage} count={product.ratingsQuantity} />
                    <div className="price">EGP {product.price?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    <div className="card-actions">
                      <button
                        className="btn-add-to-cart"
                        onClick={() => { addProduct(product._id); toggleWishlist(product._id); }}
                      >
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Move to Cart
                      </button>
                      <button className="btn-wishlist active" onClick={() => toggleWishlist(product._id)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#dc3545" stroke="#dc3545">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
