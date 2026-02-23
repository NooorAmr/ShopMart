import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { cashOrder, onlineOrder } from '../../services/api';
import { useCart } from '../../context/CartContext';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import toast from 'react-hot-toast';

export default function Checkout() {
  const [method, setMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const { cart, emptyCart } = useCart();
  const router = useRouter();

  const cartId = cart?.data?._id;
  const total = cart?.data?.totalCartPrice || 0;

  const formik = useFormik({
    initialValues: { details: '', phone: '', city: '' },
    validationSchema: Yup.object({
      details: Yup.string().required('Address is required'),
      phone: Yup.string().matches(/^01[0125][0-9]{8}$/, 'Invalid Egyptian phone').required('Phone is required'),
      city: Yup.string().required('City is required'),
    }),
    onSubmit: async (values) => {
      if (!cartId) { toast.error('Cart is empty!'); return; }
      setLoading(true);
      const orderData = { shippingAddress: values };
      try {
        if (method === 'cash') {
          await cashOrder(cartId, orderData);
          await emptyCart();
          toast.success('Order placed successfully!');
          router.push('/orders');
        } else {
          const { data } = await onlineOrder(cartId, orderData);
          if (data.session?.url) window.location.href = data.session.url;
          else toast.error('Payment session error');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Order failed');
      }
      setLoading(false);
    },
  });

  const Field = ({ name, label, type = 'text', placeholder }) => (
    <div className="mb-3">
      <label className="form-label-sm">{label}</label>
      <input
        type={type}
        className={`form-control-sm-custom ${formik.touched[name] && formik.errors[name] ? 'is-error' : ''}`}
        placeholder={placeholder}
        {...formik.getFieldProps(name)}
      />
      {formik.touched[name] && formik.errors[name] && (
        <div className="field-error">{formik.errors[name]}</div>
      )}
    </div>
  );

  return (
    <ProtectedRoute>
      <Head><title>Checkout - ShopMart</title></Head>
      <div className="container py-5" style={{ maxWidth: 760 }}>
        <div className="breadcrumb-bar mb-4">
          <Link href="/">Home</Link><span>›</span>
          <Link href="/cart">Cart</Link><span>›</span>
          <span className="active">Checkout</span>
        </div>

        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 24 }}>Checkout</h1>

        <form onSubmit={formik.handleSubmit} noValidate>
          <div style={{ border: '1px solid #eee', borderRadius: 10, padding: 24, marginBottom: 20 }}>
            <h6 style={{ fontWeight: 700, marginBottom: 16 }}>Shipping Address</h6>

            <div className="mb-3">
              <label className="form-label-sm">Address Details</label>
              <textarea
                className={`form-control-sm-custom ${formik.touched.details && formik.errors.details ? 'is-error' : ''}`}
                rows={3}
                placeholder="Street, building, floor..."
                {...formik.getFieldProps('details')}
                style={{ resize: 'none' }}
              />
              {formik.touched.details && formik.errors.details && (
                <div className="field-error">{formik.errors.details}</div>
              )}
            </div>

            <Field name="phone" label="Phone" type="tel" placeholder="01XXXXXXXXX" />

            <div className="mb-3">
              <label className="form-label-sm">City</label>
              <select
                className={`form-control-sm-custom ${formik.touched.city && formik.errors.city ? 'is-error' : ''}`}
                {...formik.getFieldProps('city')}
              >
                <option value="">Select city</option>
                {['Cairo', 'Alexandria', 'Giza', 'Mansoura', 'Tanta', 'Aswan', 'Luxor', 'Suez', 'Port Said', 'Ismailia', 'Fayyum', 'Zagazig', 'Damanhur', 'Damietta'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              {formik.touched.city && formik.errors.city && (
                <div className="field-error">{formik.errors.city}</div>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div style={{ border: '1px solid #eee', borderRadius: 10, padding: 24, marginBottom: 24 }}>
            <h6 style={{ fontWeight: 700, marginBottom: 16 }}>Payment Method</h6>
            <div className="d-flex gap-3">
              {[
                { id: 'cash', label: 'Cash on Delivery', icon: '💵' },
                { id: 'online', label: 'Online Payment', icon: '💳' },
              ].map(m => (
                <div
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  style={{
                    flex: 1, border: `1.5px solid ${method === m.id ? '#000' : '#ddd'}`,
                    borderRadius: 8, padding: '16px 12px', textAlign: 'center',
                    cursor: 'pointer', transition: 'border-color 0.15s',
                    background: method === m.id ? '#f8f8f8' : 'white',
                  }}
                >
                  <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>{m.icon}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div style={{ background: '#f8f8f8', borderRadius: 8, padding: '14px 18px', marginBottom: 20, fontSize: '0.88rem' }}>
            <div className="d-flex justify-content-between mb-1">
              <span style={{ color: '#666' }}>Total</span>
              <strong>EGP {total.toLocaleString()}</strong>
            </div>
            <div className="d-flex justify-content-between">
              <span style={{ color: '#666' }}>Shipping</span>
              <span style={{ color: '#16a34a', fontWeight: 600 }}>Free</span>
            </div>
          </div>

          <button type="submit" className="btn-shopmart-primary w-100 justify-content-center py-3" disabled={loading}>
            {loading ? 'Processing...' : method === 'cash' ? 'Place Order' : `Pay EGP ${total.toLocaleString()}`}
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
