import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Mail, Lock, Shield, Eye, EyeOff } from 'lucide-react';

function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminMode, setAdminMode] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSubmitting(true);
    try {
      await login(email, password, adminMode ? adminCode : undefined);
      navigate('/shop');
    } catch (err: any) {
      const msg = err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential'
        ? 'Invalid email or password.' : err.code === 'auth/invalid-email' ? 'Invalid email address.' : err.message || 'Login failed.';
      setError(msg);
    } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-6">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 lg:flex lg:items-stretch">
        <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-primary to-primary-hover p-16 text-white">
          <div className="inline-flex items-center gap-3 rounded-3xl bg-white/10 px-4 py-3 text-sm uppercase tracking-[0.3em] text-white/80 mb-8">
            <LogIn size={18} />
            Welcome back
          </div>
          <h1 className="text-4xl font-bold">Sign in to ALEXTRONICS</h1>
          <p className="mt-6 text-sm leading-7 text-white/80">Access your inquiry history, message sellers, and continue shopping in a seamless dashboard experience.</p>
        </div>

        <div className="w-full p-10 lg:w-1/2">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary mb-4">
              <LogIn size={28} />
            </div>
            <h2 className="text-3xl font-semibold text-charcoal">Sign in</h2>
            <p className="mt-2 text-sm text-slate-500">Welcome back to ALEXTRONICS.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">{error}</div>}

            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <div className="relative mt-2">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="relative mt-2">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 pl-11 pr-11 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10" />
                <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-3 text-sm text-slate-600">
              <input type="checkbox" checked={adminMode} onChange={(e) => setAdminMode(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" />
              Sign in as admin
            </label>

            {adminMode && (
              <div>
                <label className="text-sm font-medium text-slate-700">Admin code</label>
                <div className="relative mt-2">
                  <Shield size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="password" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} required
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10" />
                </div>
              </div>
            )}

            <button type="submit" disabled={submitting}
              className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary-hover transition disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>

            <p className="text-center text-sm text-slate-500">
              Don't have an account? <Link to="/signup" className="font-semibold text-primary hover:text-primary-hover">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
