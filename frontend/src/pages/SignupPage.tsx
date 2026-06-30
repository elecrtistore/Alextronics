import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function SignupPage() {
  const { signupWithRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState<'Buyer' | 'Admin'>('Buyer');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (role === 'Admin' && !adminCode.trim()) {
      setError('Enter the admin code to create an admin account.');
      return;
    }

    setSubmitting(true);
    try {
      await signupWithRole(email, password, role, adminCode.trim() || undefined);
      navigate('/shop');
    } catch (err: any) {
      const serverMsg = err?.response?.data?.message;
      if (serverMsg) {
        setError(serverMsg);
      } else {
        const msg =
          err.code === 'auth/email-already-in-use'
            ? 'An account with this email already exists.'
            : err.code === 'auth/invalid-email'
              ? 'Please enter a valid email address.'
              : err.code === 'auth/weak-password'
                ? 'Password is too weak.'
                : err.message || 'Signup failed. Please try again.';
        setError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-14 sm:px-6">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-white via-orange-50 to-slate-100 p-8 shadow-soft ring-1 ring-slate-200/70">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-charcoal">Create account</h1>
          <p className="mt-2 text-sm text-slate-600">Sign up to start browsing and submitting inquiries.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
              <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
            )}

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-charcoal outline-none focus:border-primary"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-charcoal outline-none focus:border-primary"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Confirm password</span>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={6}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-charcoal outline-none focus:border-primary"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Account type</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'Buyer' | 'Admin')}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-charcoal outline-none focus:border-primary"
              >
                <option value="Buyer">Buyer</option>
                <option value="Admin">Admin</option>
              </select>
            </label>

            {role === 'Admin' && (
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Admin code</span>
                <input
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Enter the admin secret code"
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-charcoal outline-none focus:border-primary"
                />
                <p className="mt-1 text-xs text-slate-500">Only one admin account can exist.</p>
              </label>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-[1.25rem] bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
            >
              {submitting ? 'Creating account…' : 'Create account'}
            </button>

            <p className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
