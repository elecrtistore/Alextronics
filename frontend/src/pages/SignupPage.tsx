import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, Mail, Lock, User, Shield, ChevronDown, Eye, EyeOff } from 'lucide-react';

function SignupPage() {
  const { signupWithRole } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ displayName: '', email: '', password: '', role: 'Buyer' as 'Buyer' | 'Admin', adminCode: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSubmitting(true);
    try {
      await signupWithRole(form.email, form.password, form.role, form.role === 'Admin' ? form.adminCode : undefined, form.displayName);
      navigate('/shop');
    } catch (err: any) {
      setError(err.message || 'Signup failed.');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-white py-24 px-6">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 lg:flex lg:items-stretch">
        <div className="hidden lg:block lg:w-1/2 bg-slate-950 p-16 text-white">
          <div className="inline-flex items-center gap-3 rounded-3xl bg-white/10 px-4 py-3 text-sm uppercase tracking-[0.3em] text-white/80 mb-8">
            <UserPlus size={18} />
            Create account
          </div>
          <h1 className="text-4xl font-bold">Join ALEXTRONICS</h1>
          <p className="mt-6 text-sm leading-7 text-slate-300">Start inquiring, manage your cart, and connect with sellers directly.</p>
        </div>

        <div className="w-full p-10 lg:w-1/2">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary mb-4">
              <UserPlus size={28} />
            </div>
            <h2 className="text-3xl font-semibold text-charcoal">Create account</h2>
            <p className="mt-2 text-sm text-slate-500">Join ALEXTRONICS to start inquiring.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">{error}</div>}

            <div>
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <div className="relative mt-2">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={form.displayName} onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))} required
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <div className="relative mt-2">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="relative mt-2">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 pl-11 pr-11 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10" />
                <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Role</label>
              <div className="relative mt-2">
                <select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as 'Buyer' | 'Admin' }))}
                  className="w-full appearance-none cursor-pointer rounded-3xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10">
                  <option value="Buyer">Buyer</option>
                  <option value="Admin">Admin</option>
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {form.role === 'Admin' && (
              <div>
                <label className="text-sm font-medium text-slate-700">Admin code</label>
                <div className="relative mt-2">
                  <Shield size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="password" value={form.adminCode} onChange={(e) => setForm((p) => ({ ...p, adminCode: e.target.value }))} required
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10" />
                </div>
              </div>
            )}

            <button type="submit" disabled={submitting}
              className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary-hover transition disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? 'Creating account...' : 'Create account'}
            </button>

            <p className="text-center text-sm text-slate-500">
              Already have an account? <Link to="/login" className="font-semibold text-primary hover:text-primary-hover">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
