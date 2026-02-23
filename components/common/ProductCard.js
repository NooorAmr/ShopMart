import { useRouter } from 'next/router';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import Stars from './Stars';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const router = useRouter();
  const { addProduct, loadingCart } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { token } = useAuth();

  const isWishlisted = wishlistIds.includes(product._id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const currentToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!currentToken) { toast.error('Please login first'); router.push('/auth/login'); return; }
    addProduct(product._id);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    const currentToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!currentToken) { toast.error('Please login first'); router.push('/auth/login'); return; }
    toggleWishlist(product._id);
  };

  return (
    <div className="product-card" onClick={() => router.push(`/products/${product._id}`)}>
      <img
        className="card-img-top"
        src={product.imageCover}
        alt={product.title}
        onError={e => { e.target.src = 'https://via.placeholder.com/300x220?text=No+Image'; }}
      />
      <div className="card-body">
        {/* Brand */}
        <div className="brand-name">{product.brand?.name}</div>

        {/* Title */}
        <div className="product-title">{product.title}</div>

        {/* Category */}
        <div className="category-name">{product.category?.name}</div>

        {/* Stars */}
        <Stars rating={product.ratingsAverage} count={product.ratingsQuantity} />

        {/* Price */}
        <div className="price">EGP {product.price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>

        {/* Actions */}
        <div className="card-actions">
          <button
            className="btn-add-to-cart"
            onClick={handleAddToCart}
            disabled={loadingCart}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add To Cart
          </button>
          <button
            className={`btn-wishlist ${isWishlisted ? 'active' : ''}`}
            onClick={handleWishlist}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isWishlisted ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#dc3545" stroke="#dc3545">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
