import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { registerUser } from '../../services/api';
import toast from 'react-hot-toast';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', rePassword: '', phone: '' },
    validationSchema: Yup.object({
      name: Yup.string().min(3, 'Min 3 chars').max(30, 'Max 30 chars').required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string()
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, 'Password must include letters and numbers')
        .required('Password is required'),
      rePassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Required'),
      phone: Yup.string().matches(/^01[0125][0-9]{8}$/, 'Invalid Egyptian phone number').required('Phone is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const { data } = await registerUser(values);
        if (data.message === 'success') {
          toast.success('Account created! Please sign in.');
          router.push('/auth/login');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Registration failed');
      }
      setLoading(false);
    },
  });

  const fields = [
    { name: 'name', label: 'Full name', type: 'text', placeholder: 'John Doe' },
    { name: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com' },
    { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
    { name: 'rePassword', label: 'Confirm password', type: 'password', placeholder: '••••••••' },
    { name: 'phone', label: 'Phone number', type: 'tel', placeholder: '01XXXXXXXXX' },
  ];

  return (
    <>
      <Head><title>Register - ShopMart</title></Head>
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

          <h2 className="auth-title">Create an account</h2>
          <p className="auth-subtitle">Join ShopMart and start shopping today</p>

          <form onSubmit={formik.handleSubmit} noValidate>
            {fields.map(f => (
              <div className="mb-3" key={f.name}>
                <label className="form-label-sm">{f.label}</label>
                <input
                  type={f.type}
                  className={`form-control-sm-custom ${formik.touched[f.name] && formik.errors[f.name] ? 'is-error' : ''}`}
                  placeholder={f.placeholder}
                  {...formik.getFieldProps(f.name)}
                />
                {formik.touched[f.name] && formik.errors[f.name] && (
                  <div className="field-error">{formik.errors[f.name]}</div>
                )}
              </div>
            ))}

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.85rem', color: '#666' }}>
            Already have an account?{' '}
            <Link href="/auth/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}
