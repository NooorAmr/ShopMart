import { useState, useEffect } from 'react';
import Head from 'next/head';
import { getUserOrders } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import Spinner from '../../components/common/Spinner';
import Link from 'next/link';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user?._id) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await getUserOrders(user._id);
      setOrders(Array.isArray(data) ? [...data].reverse() : []);
    } catch { setOrders([]); }
    setLoading(false);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    });
  };

  return (
    <ProtectedRoute>
      <Head><title>All Orders - ShopMart</title></Head>
      <div className="container py-4">
        <h1 className="orders-page-title">All Orders</h1>

        {loading ? <Spinner /> : orders.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">📦</span>
            <h5>No orders yet</h5>
            <p>Start shopping to see your orders here</p>
            <Link href="/products" className="btn-shopmart-primary">Shop Now</Link>
          </div>
        ) : (
          orders.map(order => (
            <div className="order-card" key={order._id || order.id}>
              <h6>Order #{order.id}</h6>

              <div className="order-meta">
                Order Date: {formatDate(order.createdAt)}
              </div>
              <div className="order-meta">
                Payment: {order.paymentMethodType}{' '}
                {order.isPaid
                  ? <span className="badge-paid">(Paid)</span>
                  : <span className="badge-pending">(Pending)</span>
                }
              </div>
              <div className="order-meta">
                Delivered:{' '}
                {order.isDelivered
                  ? <span className="badge-paid">Yes</span>
                  : <span className="badge-no">No</span>
                }
              </div>
              <div className="order-meta">
                Total: <span>{order.totalOrderPrice} EGP</span>
              </div>

              {order.shippingAddress && (
                <div className="order-address">
                  <strong>Shipping Address</strong>
                  <div>{order.shippingAddress.city}, Egypt</div>
                  <div>Phone: {order.shippingAddress.phone}</div>
                </div>
              )}

              <button
                className="btn-view-items"
                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
              >
                {expandedOrder === order._id ? 'Hide Order Items' : 'View Order Items'}
              </button>

              {/* Expanded items */}
              {expandedOrder === order._id && order.cartItems && (
                <div style={{ marginTop: 16, borderTop: '1px solid #eee', paddingTop: 14 }}>
                  {order.cartItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <img
                        src={item.product?.imageCover}
                        alt={item.product?.title}
                        style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 6, border: '1px solid #eee', background: '#f8f8f8' }}
                        onError={e => { e.target.src = 'https://via.placeholder.com/48'; }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.product?.title}</div>
                        <div style={{ fontSize: '0.78rem', color: '#888' }}>x{item.count} · EGP {item.price} each</div>
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                        EGP {(item.price * item.count).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="order-last-updated">
                Last updated: {formatDate(order.updatedAt || order.createdAt)}
              </div>
            </div>
          ))
        )}
      </div>
    </ProtectedRoute>
  );
}
