import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { forgotPass, verifyCode, resetPass } from '../../services/api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Step 1
  const step1 = useFormik({
    initialValues: { email: '' },
    validationSchema: Yup.object({ email: Yup.string().email('Invalid email').required('Required') }),
    onSubmit: async (v) => {
      setLoading(true);
      try {
        await forgotPass({ email: v.email });
        setEmail(v.email);
        toast.success('Reset code sent to your email');
        setStep(2);
      } catch (err) { toast.error(err.response?.data?.message || 'Email not found'); }
      setLoading(false);
    },
  });

  // Step 2
  const step2 = useFormik({
    initialValues: { resetCode: '' },
    validationSchema: Yup.object({ resetCode: Yup.string().length(6, 'Must be 6 digits').required('Required') }),
    onSubmit: async (v) => {
      setLoading(true);
      try {
        await verifyCode({ resetCode: v.resetCode });
        toast.success('Code verified');
        setStep(3);
      } catch (err) { toast.error(err.response?.data?.message || 'Invalid code'); }
      setLoading(false);
    },
  });

  // Step 3
  const step3 = useFormik({
    initialValues: { newPassword: '' },
    validationSchema: Yup.object({ newPassword: Yup.string().min(6, 'Min 6 chars').required('Required') }),
    onSubmit: async (v) => {
      setLoading(true);
      try {
        await resetPass({ email, newPassword: v.newPassword });
        toast.success('Password reset successfully');
        router.push('/auth/login');
      } catch (err) { toast.error(err.response?.data?.message || 'Failed to reset'); }
      setLoading(false);
    },
  });

  const LogoBlock = () => (
    <Link href="/" className="auth-logo">
      <span style={{
        width: 30, height: 30, background: '#000', color: '#fff',
        borderRadius: 6, display: 'inline-flex', alignItems: 'center',
        justifyContent: 'center', fontWeight: 800, fontSize: '1rem'
      }}>S</span>
      ShopMart
    </Link>
  );

  return (
    <>
      <Head><title>Reset Password - ShopMart</title></Head>
      <div className="auth-wrapper">
        <div className="auth-card">
          <LogoBlock />

          {step === 1 && (
            <>
              <h2 className="auth-title">Forgot password?</h2>
              <p className="auth-subtitle">Enter your email to receive a reset code</p>
              <form onSubmit={step1.handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label-sm">Email address</label>
                  <input type="email" className={`form-control-sm-custom ${step1.touched.email && step1.errors.email ? 'is-error' : ''}`}
                    placeholder="you@example.com" {...step1.getFieldProps('email')} />
                  {step1.touched.email && step1.errors.email && <div className="field-error">{step1.errors.email}</div>}
                </div>
                <button type="submit" className="btn-auth" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Code'}</button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="auth-title">Check your email</h2>
              <p className="auth-subtitle">We sent a 6-digit code to <strong>{email}</strong></p>
              <form onSubmit={step2.handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label-sm">Reset Code</label>
                  <input type="text" maxLength={6} className={`form-control-sm-custom ${step2.touched.resetCode && step2.errors.resetCode ? 'is-error' : ''}`}
                    placeholder="000000" {...step2.getFieldProps('resetCode')} style={{ letterSpacing: 4, fontSize: '1.1rem' }} />
                  {step2.touched.resetCode && step2.errors.resetCode && <div className="field-error">{step2.errors.resetCode}</div>}
                </div>
                <button type="submit" className="btn-auth" disabled={loading}>{loading ? 'Verifying...' : 'Verify Code'}</button>
              </form>
              <p style={{ textAlign: 'center', marginTop: 14, fontSize: '0.82rem', color: '#888', cursor: 'pointer' }}
                onClick={() => setStep(1)}>← Back</p>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="auth-title">New password</h2>
              <p className="auth-subtitle">Create your new password</p>
              <form onSubmit={step3.handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label-sm">New Password</label>
                  <input type="password" className={`form-control-sm-custom ${step3.touched.newPassword && step3.errors.newPassword ? 'is-error' : ''}`}
                    placeholder="••••••••" {...step3.getFieldProps('newPassword')} />
                  {step3.touched.newPassword && step3.errors.newPassword && <div className="field-error">{step3.errors.newPassword}</div>}
                </div>
                <button type="submit" className="btn-auth" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
              </form>
            </>
          )}

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.85rem', color: '#888' }}>
            <Link href="/auth/login" className="auth-link">← Back to sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}
