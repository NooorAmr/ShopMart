import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCart } from '../../context/CartContext';
import ProtectedRoute from '../../components/common/ProtectedRoute';

export default function Cart() {
  const { cart, cartCount, removeProduct, updateQuantity, emptyCart } = useCart();
  const router = useRouter();

  const cartItems = cart?.data?.products || [];
  const totalPrice = cart?.data?.totalCartPrice || 0;

  return (
    <ProtectedRoute>
      <Head><title>Shopping Cart - ShopMart</title></Head>

      <div className="container py-5">
        <h1 className="cart-page-title">Shopping Cart</h1>
        <p className="cart-subtitle">
          {cartCount === 0 ? 'Your cart is empty' : `${cartCount} item${cartCount > 1 ? 's' : ''} in your cart`}
        </p>

        {cartItems.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🛒</span>
            <h5>Your cart is empty</h5>
            <p>Add some products to get started</p>
            <Link href="/products" className="btn-shopmart-primary">Continue Shopping</Link>
          </div>
        ) : (
          <div className="row g-4">
            {/* Items */}
            <div className="col-lg-8">
              {cartItems.map(item => (
                <div className="cart-item-row" key={item._id}>
                  {/* Image */}
                  <img
                    className="cart-item-img"
                    src={item.product.imageCover}
                    alt={item.product.title}
                    onError={e => { e.target.src = 'https://via.placeholder.com/72'; }}
                  />

                  {/* Info */}
                  <div className="cart-item-info">
                    <div className="cart-item-brand">{item.product.brand?.name} · {item.product.category?.name}</div>
                    <div className="cart-item-title">{item.product.title}</div>

                    {/* Quantity control */}
                    <div className="qty-control">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.product._id, item.count - 1)}
                        disabled={item.count <= 1}
                      >−</button>
                      <span className="qty-num">{item.count}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.product._id, item.count + 1)}
                      >+</button>
                      <button
                        className="btn-remove"
                        onClick={() => removeProduct(item.product._id)}
                      >Remove</button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="cart-item-price">
                    EGP {(item.price * item.count).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    <small>each</small>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="col-lg-4">
              <div className="order-summary-box">
                <h5>Order Summary</h5>

                <div className="summary-row">
                  <span>Subtotal ({cartCount} Items)</span>
                  <span>EGP {totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span style={{ color: '#16a34a', fontWeight: 600 }}>Free</span>
                </div>
                <hr style={{ borderColor: '#eee', margin: '10px 0' }} />
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{totalPrice.toLocaleString()}</span>
                </div>

                <button
                  className="btn-shopmart-outline w-100 justify-content-center mt-3"
                  onClick={() => router.push('/products')}
                >
                  Continue Shopping
                </button>
                <button
                  className="btn-shopmart-primary w-100 justify-content-center mt-2"
                  onClick={() => router.push('/cart/checkout')}
                >
                  Proceed to Checkout
                </button>

                <button className="clear-cart-btn mx-auto d-flex" onClick={emptyCart}>
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  clear cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
