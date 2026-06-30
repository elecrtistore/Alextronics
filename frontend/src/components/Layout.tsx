import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div>
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/" className="text-xl font-semibold tracking-tight text-charcoal">ElectriShop</Link>

          <nav className="hidden items-center gap-6 md:flex">
            <NavLink to="/shop" className={({ isActive }) => isActive ? 'font-semibold text-primary' : 'text-sm text-slate-600'}>Store</NavLink>
            <NavLink to="/inquiry-list" className={({ isActive }) => isActive ? 'font-semibold text-primary' : 'text-sm text-slate-600'}>Inquiry Cart</NavLink>
            {user && (
              <NavLink to="/my-inquiries" className={({ isActive }) => isActive ? 'font-semibold text-primary' : 'text-sm text-slate-600'}>My Inquiries</NavLink>
            )}
            <NavLink to="/about" className={({ isActive }) => isActive ? 'font-semibold text-primary' : 'text-sm text-slate-600'}>About</NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? 'font-semibold text-primary' : 'text-sm text-slate-600'}>Contact</NavLink>
            {user?.role === 'Admin' && (
              <NavLink to="/admin" className={({ isActive }) => isActive ? 'font-semibold text-primary' : 'text-sm text-slate-600'}>Admin</NavLink>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 md:block">
                  {user.displayName || user.email} · <span className="font-semibold text-charcoal">{user.role}</span>
                </div>
                <button onClick={logout} className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-800">Logout</button>
              </>
            ) : (
              <Link to="/login" className="rounded-full bg-primary px-4 py-2 text-sm text-white transition hover:bg-orange-600">Sign in</Link>
            )}

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 md:hidden"
            >
              <span className="text-xl">☰</span>
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-slate-200 bg-white md:hidden">
            <div className="space-y-2 px-4 py-4">
              <NavLink to="/shop" onClick={() => setOpen(false)} className="block text-sm text-slate-700">Store</NavLink>
              <NavLink to="/inquiry-list" onClick={() => setOpen(false)} className="block text-sm text-slate-700">Inquiry Cart</NavLink>
              {user && (
                <NavLink to="/my-inquiries" onClick={() => setOpen(false)} className="block text-sm text-slate-700">My Inquiries</NavLink>
              )}
              <NavLink to="/about" onClick={() => setOpen(false)} className="block text-sm text-slate-700">About</NavLink>
              <NavLink to="/contact" onClick={() => setOpen(false)} className="block text-sm text-slate-700">Contact</NavLink>
              {user?.role === 'Admin' && (
                <NavLink to="/admin" onClick={() => setOpen(false)} className="block text-sm text-slate-700">Admin</NavLink>
              )}
            </div>
          </div>
        )}
      </header>
      <main>{children}</main>
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
            <p>© 2026 ElectriShop. A private electronics shop for direct buyer inquiries.</p>
            <p>Browse inventory, request details, and contact us directly.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
