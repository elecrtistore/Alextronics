import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useInquiry } from '../contexts/InquiryContext';
import { Menu, X, ShoppingCart, Package, MessageCircle } from 'lucide-react';
import api from '../services/api';
import CookieConsent from './CookieConsent';

interface SiteContent {
  page: string; title: string; subtitle: string; body: string;
  sections: { heading: string; content: string }[];
  meta: Record<string, string>;
}

function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { totalItems } = useInquiry();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const logoSrc = `${import.meta.env.BASE_URL}logo.png`;
  const [scrolled, setScrolled] = useState(false);
  const [shopName, setShopName] = useState('ALEXTRONICS');
  const [logoError, setLogoError] = useState(false);
  const [footerSections, setFooterSections] = useState<{ heading: string; content: string }[]>([]);
  const [footerMeta, setFooterMeta] = useState<Record<string, string>>({});
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    api.get<SiteContent>('/site/settings').then((r) => { if (r.data.title) setShopName(r.data.title); }).catch(() => {});
    api.get<SiteContent>('/site/footer').then((r) => {
      if (r.data.sections) setFooterSections(r.data.sections);
      if (r.data.meta) setFooterMeta(r.data.meta);
    }).catch(() => {});
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  const isHome = location.pathname === '/' || location.pathname === '/shop' || location.pathname.endsWith('/Alextronics/') || location.pathname.endsWith('/Alextronics/shop');
  const transparent = isHome && !scrolled;

  const navLinks = [
    { to: '/shop', label: 'Shop' },
    ...(user?.role !== 'Admin' ? [{ to: '/inquiry-list', label: 'Cart' }] : []),
    ...(user ? [{ to: '/messages', label: 'Messages' }] : []),
    { to: '/about', label: 'About' },
    { to: '/contacts', label: 'Contacts' },
    ...(user?.role === 'Admin' ? [{ to: '/admin', label: 'Admin' }] : []),
  ];

  const mobileNav = [
    { to: '/shop', label: 'Shop', icon: Package },
    { to: '/inquiry-list', label: 'Cart', icon: ShoppingCart },
    { to: '/messages', label: 'Chat', icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent ? 'bg-transparent' : 'bg-white/90 backdrop-blur-md shadow-sm'
      }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#1E3A5F] flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {shopName.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-charcoal leading-none">{shopName}</p>
              <p className="text-[11px] text-soft uppercase tracking-[0.18em]">Mobile-first electronics marketplace</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors relative after:absolute after:bottom-[-6px] after:left-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 ${
                    isActive
                      ? 'text-charcoal after:w-full'
                      : 'text-soft hover:text-charcoal after:w-0'
                  }`
                }
              >
                {link.to === '/inquiry-list' ? (
                  <span className="inline-flex items-center gap-1.5">
                    <ShoppingCart size={16} />
                    {link.label}
                    {totalItems > 0 && (
                      <span className="bg-primary text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                        {totalItems > 99 ? '99+' : totalItems}
                      </span>
                    )}
                  </span>
                ) : (
                  link.label
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-soft">
                  {user.displayName || user.email}
                </span>
                <button onClick={logout} className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-hover transition">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-hover transition">
                Sign in
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setOpen(!open)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-charcoal shadow-sm transition hover:bg-slate-50">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-border bg-white">
            <div className="px-6 py-4 space-y-3">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} className="block text-sm font-medium text-charcoal">
                  {link.to === '/inquiry-list' ? (
                    <span className="inline-flex items-center gap-1.5">
                      <ShoppingCart size={16} />
                      {link.label}
                      {totalItems > 0 && (
                        <span className="bg-primary text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                          {totalItems > 99 ? '99+' : totalItems}
                        </span>
                      )}
                    </span>
                  ) : (
                    link.label
                  )}
                </NavLink>
              ))}
            </div>
            <div className="border-t border-border px-6 py-4">
              {user ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-charcoal">{user.displayName || user.email}</p>
                  <button onClick={logout} className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition">
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="w-full inline-flex justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition">
                  Sign in
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 pb-24">{children}</main>

      <div className="fixed inset-x-0 bottom-0 z-40 md:hidden border-t border-border/80 bg-white/95 backdrop-blur-sm shadow-[0_-12px_24px_rgba(15,23,42,0.08)]">
        <div className="mx-auto flex max-w-7xl items-center justify-around px-6 py-2">
          {mobileNav.map((link) => {
            const Icon = link.icon;
            const active = location.pathname.startsWith(link.to);
            return (
              <Link key={link.to} to={link.to} className={`inline-flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-semibold transition ${active ? 'text-primary' : 'text-soft hover:text-charcoal'}`}>
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
          <button onClick={() => setOpen(!open)} className="inline-flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-semibold text-soft hover:text-charcoal transition">
            {open ? <X size={18} /> : <Menu size={18} />}
            Menu
          </button>
        </div>
      </div>

      <footer className="bg-white border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-lg font-bold text-charcoal">{shopName}</h3>
              <p className="mt-3 text-sm text-soft leading-relaxed">Inquiry-first marketplace for quality electronics. Direct contact between buyers and sellers.</p>
            </div>
            {footerSections.map((section, i) => (
              <div key={i}>
                <h4 className="text-sm font-semibold text-charcoal uppercase tracking-wider">{section.heading}</h4>
                <p className="mt-3 text-sm text-soft leading-relaxed">{section.content}</p>
              </div>
            ))}
            {footerMeta.contact && (
              <div>
                <h4 className="text-sm font-semibold text-charcoal uppercase tracking-wider">Contact</h4>
                <p className="mt-3 text-sm text-soft">{footerMeta.contact}</p>
              </div>
            )}
          </div>
          <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-soft">
            <p>&copy; 2026 {shopName}. All rights reserved.</p>
            <div className="flex gap-4">
              <Link to="/privacy" className="hover:text-primary transition">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary transition">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
      <CookieConsent />
    </div>
  );
}

export default Layout;
