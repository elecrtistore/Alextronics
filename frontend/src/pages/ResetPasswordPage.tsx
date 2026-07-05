import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../firebase';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get('oobCode');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!oobCode) {
      setError('Invalid or missing reset code. Please request a new password reset link.');
      return;
    }

    setSubmitting(true);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setSuccess(true);
    } catch (err: any) {
      const msg =
        err.code === 'auth/expired-action-code' ? 'This reset link has expired. Please request a new one.'
        : err.code === 'auth/invalid-action-code' ? 'This reset link is invalid. Please request a new one.'
        : err.code === 'auth/weak-password' ? 'Password must be at least 6 characters.'
        : err.message || 'Failed to reset password.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!oobCode) {
    return (
      <div className="min-h-screen bg-white py-24 px-6">
        <div className="mx-auto max-w-md">
          <div className="rounded-[2rem] bg-white p-10 shadow-xl shadow-slate-200/50 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-red-50 text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h2 className="text-2xl font-semibold text-charcoal mb-2">Invalid Reset Link</h2>
            <p className="text-sm text-slate-500 mb-6">This password reset link is missing required information. Please request a new one.</p>
            <Link to="/login" className="inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white py-24 px-6">
        <div className="mx-auto max-w-md">
          <div className="rounded-[2rem] bg-white p-10 shadow-xl shadow-slate-200/50 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h2 className="text-2xl font-semibold text-charcoal mb-2">Password Reset Successful</h2>
            <p className="text-sm text-slate-500 mb-6">Your password has been updated. You can now sign in with your new password.</p>
            <Link to="/login" className="inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-24 px-6">
      <div className="mx-auto max-w-md">
        <div className="rounded-[2rem] bg-white p-10 shadow-xl shadow-slate-200/50">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h2 className="text-3xl font-semibold text-charcoal">Set New Password</h2>
            <p className="mt-2 text-sm text-slate-500">Enter your new password below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">{error}</div>}

            <div>
              <label className="text-sm font-medium text-slate-700">New Password</label>
              <div className="relative mt-2">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 pl-11 pr-11 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10" />
                <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Confirm Password</label>
              <div className="relative mt-2">
                <Shield size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showConfirm ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6}
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 pl-11 pr-11 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10" />
                <button type="button" onClick={() => setShowConfirm((p) => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={submitting}
              className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary-hover transition disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? 'Resetting...' : 'Reset Password'}
            </button>

            <p className="text-center text-sm text-slate-500">
              <Link to="/login" className="font-semibold text-primary hover:text-primary-hover">Back to Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;