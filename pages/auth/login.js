import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { loginUser } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const { data } = await loginUser(values);
        if (data.message === 'success') {
          login(data.user, data.token);
          toast.success(`Welcome back, ${data.user.name}!`);
          router.push('/');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Invalid email or password');
      }
      setLoading(false);
    },
  });

  return (
    <>
      <Head><title>Login - ShopMart</title></Head>
      <div className="auth-wrapper">
        <div className="auth-card">
          <Link href="/" className="auth-logo">
            <span style={{
              width: 30, height: 30, background: '#000', color: '#fff',
              borderRadius: 6, display: 'inline-flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 800, fontSize: '1rem'
            }}>S</span>
            ShopMart
          </Link>

          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Sign in to your account to continue</p>

          <form onSubmit={formik.handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label-sm">Email address</label>
              <input
                type="email"
                className={`form-control-sm-custom ${formik.touched.email && formik.errors.email ? 'is-error' : ''}`}
                placeholder="you@example.com"
                {...formik.getFieldProps('email')}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="field-error">{formik.errors.email}</div>
              )}
            </div>

            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label-sm" style={{ marginBottom: 0 }}>Password</label>
                <Link href="/auth/forgot-password" className="auth-link" style={{ fontSize: '0.8rem' }}>
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                className={`form-control-sm-custom ${formik.touched.password && formik.errors.password ? 'is-error' : ''}`}
                placeholder="••••••••"
                {...formik.getFieldProps('password')}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="field-error">{formik.errors.password}</div>
              )}
            </div>

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.85rem', color: '#666' }}>
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="auth-link">Create one</Link>
          </p>
        </div>
      </div>
    </>
  );
}
