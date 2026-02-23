import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Head from 'next/head';
import { changePass } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import toast from 'react-hot-toast';

export default function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  const formik = useFormik({
    initialValues: { currentPassword: '', password: '', rePassword: '' },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required('Current password required'),
      password: Yup.string().min(6, 'Min 6 chars').required('New password required'),
      rePassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await changePass(values);
        toast.success('Password changed! Please sign in again.');
        setTimeout(() => logout(), 1500);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to change password');
      }
      setLoading(false);
    },
  });

  const fields = [
    { name: 'currentPassword', label: 'Current Password', placeholder: 'Your current password' },
    { name: 'password', label: 'New Password', placeholder: 'New password' },
    { name: 'rePassword', label: 'Confirm New Password', placeholder: 'Confirm new password' },
  ];

  return (
    <ProtectedRoute>
      <Head><title>Change Password - ShopMart</title></Head>
      <div className="container py-5" style={{ maxWidth: 480 }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 24 }}>Change Password</h1>
        <div style={{ border: '1px solid #eee', borderRadius: 10, padding: 28 }}>
          <form onSubmit={formik.handleSubmit} noValidate>
            {fields.map(f => (
              <div className="mb-3" key={f.name}>
                <label className="form-label-sm">{f.label}</label>
                <input
                  type="password"
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
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
