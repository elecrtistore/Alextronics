import { useEffect, useState, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useInquiry } from '../contexts/InquiryContext';
import { ShoppingCart, Package, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
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
  const logoSrc = `${import.meta.env.BASE_URL}logo.png`;
  const [scrolled, setScrolled] = useState(false);
  const [shopName, setShopName] = useState('ALEXTRONICS');
  const [logoError, setLogoError] = useState(false);
  const [footerSections, setFooterSections] = useState<{ heading: string; content: string }[]>([]);
  const [footerMeta, setFooterMeta] = useState<Record<string, string>>({});

  useEffect(() => {
    api.get<SiteContent>('/site/settings').then((r) => { if (r.data.title) setShopName(r.data.title); }).catch(() => {});
    api.get<SiteContent>('/site/footer').then(async (r) => {
      if (r.data.sections) setFooterSections(r.data.sections);
      if (r.data.meta) {
        setFooterMeta(r.data.meta);
        if (!r.data.meta.contact && !r.data.meta.email) {
          try {
            const c = await api.get<SiteContent>('/site/contact');
            const email = c.data.sections?.find(s => s.heading === 'Email')?.content;
            if (email) setFooterMeta((prev) => ({ ...prev, contact: email }));
          } catch {}
        }
      } else {
        try {
          const c = await api.get<SiteContent>('/site/contact');
          if (c.data.sections) setFooterSections((prev) => (prev.length ? prev : c.data.sections));
          const email = c.data.sections?.find(s => s.heading === 'Email')?.content;
          if (email) setFooterMeta((prev) => ({ ...prev, contact: email }));
        } catch {}
      }
    }).catch(() => {});
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [location]);

  const isHome = location.pathname === '/' || location.pathname.endsWith('/Alextronics/') || location.pathname.endsWith('/Alextronics/shop');
  const transparent = isHome && !scrolled;

  const navLinks = [
    { to: '/shop', label: 'Shop' },
    ...(user?.role !== 'Admin' ? [{ to: '/inquiry-list', label: 'Cart' }] : []),
    ...(user ? [{ to: '/messages', label: 'Messages' }] : []),
    { to: '/about', label: 'About' },
    { to: '/contacts', label: 'Contacts' },
    ...(user?.role === 'Admin' ? [{ to: '/admin', label: 'Admin' }] : []),
  ];

  const navigate = useNavigate();

  const mobileNav = [
    { to: '/shop', label: 'Shop', icon: Package },
    { to: '/inquiry-list', label: 'Cart', icon: ShoppingCart },
    { to: '/messages', label: 'Chat', icon: MessageCircle },
    { to: '/contacts', label: 'Help', icon: Phone },
  ];

  const footerColumns = (() => {
    const cols: { heading: string; items?: { label: string; to?: string }[]; content?: string }[] = [];

    cols.push({ heading: shopName, content: footerSections[0]?.content || 'Inquiry-first marketplace for quality electronics. Direct contact between buyers and sellers.' });

    cols.push({ heading: 'Explore', items: [
      { label: 'Shop', to: '/shop' },
      { label: 'Cart', to: '/inquiry-list' },
      { label: 'Messages', to: '/messages' },
      { label: 'About', to: '/about' },
    ] });

    cols.push({ heading: 'Contact', content: footerMeta.email || footerMeta.contact || 'support@alextronics.example' });

    cols.push({ heading: 'Support', items: [ { label: 'Privacy Policy', to: '/privacy' }, { label: 'Terms of Service', to: '/terms' } ] });

    if (user?.role === 'Admin') {
      cols.splice(2, 0, { heading: 'Admin', items: [ { label: 'Admin Panel', to: '/admin' }, { label: 'Site Settings', to: '/admin/site' } ] });
    }

    return cols;
  })();

  return (
    <div className="min-h-screen flex flex-col">
      <header className={`relative z-50 transition-all duration-300 ${transparent ? 'bg-transparent' : 'bg-white/90 backdrop-blur-md shadow-sm'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 md:px-6 md:py-3">
          <Link to="/shop" className="flex items-center gap-3">
            {!logoError ? (
              <img src={logoSrc} alt={shopName} className="h-10 w-10 rounded-2xl object-cover shadow-sm" onError={() => setLogoError(true)} />
            ) : (
              <div className="h-10 w-10 rounded-2xl bg-[#1E3A5F] flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {shopName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <span className="text-sm font-semibold text-charcoal leading-none">{shopName}</span>
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

          <div className="md:hidden flex items-center gap-2">
            {user ? (
              <>
                <span className="rounded-full border border-border bg-slate-50 px-3 py-2 text-xs font-semibold text-charcoal truncate max-w-[120px]">{user.displayName || user.email}</span>
                <button onClick={logout} className="rounded-full bg-primary px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-hover transition">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-hover transition">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 pt-0 pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-24">{children}</main>

      <div className="fixed inset-x-0 bottom-0 z-40 md:hidden border-t border-border/80 bg-white/95 backdrop-blur-sm shadow-[0_-10px_20px_rgba(15,23,42,0.08)]" style={{ transform: 'translateZ(0)', willChange: 'transform', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2">
          {mobileNav.map((link) => {
            const Icon = link.icon;
            const active = location.pathname.startsWith(link.to);
            return (
              <button
                key={link.to}
                onClick={() => {
                  if (location.pathname === link.to) {
                    window.location.href = link.to;
                  } else {
                    navigate(link.to);
                  }
                }}
                className={`inline-flex flex-col items-center gap-0 rounded-2xl px-2 py-1 text-[11px] font-semibold transition ${active ? 'text-primary' : 'text-soft hover:text-charcoal'}`}
                aria-label={link.label}
              >
                <Icon size={20} />
                <span className="sr-only">{link.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <footer id="site-footer" className="bg-slate-950 text-slate-300">
        <div className="mx-auto max-w-7xl px-6 pt-8 pb-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {footerColumns.map((col, i) => (
              <div key={i}>
                <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 mb-3">{col.heading}</h4>

                {col.heading === 'Contact' ? (
                  <div className="space-y-3 text-sm text-slate-400">
                    <div className="flex items-start gap-3">
                      <Phone size={16} className="mt-1 text-primary" />
                      <a href={`tel:${footerMeta.phone || footerMeta.contact || '0708309429'}`} className="hover:text-white transition">{footerMeta.phone || footerMeta.contact || '0708309429'}</a>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail size={16} className="mt-1 text-primary" />
                      <a href={`mailto:${footerMeta.email || footerMeta.contact || 'alextronics.shop01@gmail.com'}`} className="hover:text-white transition">{footerMeta.email || footerMeta.contact || 'alextronics.shop01@gmail.com'}</a>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="mt-1 text-primary" />
                      <span>{footerMeta.address || 'Nairobi, Kenya'}</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {col.content && <p className="text-sm leading-relaxed text-slate-400">{col.content}</p>}
                    {i === 0 && (
                      <div className="mt-5 flex items-center gap-3">
                        <a href={footerMeta.facebook || '#'} className="text-slate-400 hover:text-white transition">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-xs font-semibold">f</span>
                        </a>
                        <a href={footerMeta.twitter || '#'} className="text-slate-400 hover:text-white transition">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-xs font-semibold">t</span>
                        </a>
                        <a href={footerMeta.instagram || '#'} className="text-slate-400 hover:text-white transition">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-xs font-semibold">i</span>
                        </a>
                      </div>
                    )}
                    {col.items && (
                      <ul className="mt-3 space-y-3 text-sm">
                        {col.items.map((it, idx) => (
                          <li key={idx}>
                            {it.to ? <Link to={it.to} className="hover:text-white transition">{it.label}</Link> : <span className="text-slate-400">{it.label}</span>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-slate-800 pt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-400">
            <p>&copy; 2026 {shopName}. All rights reserved.</p>
            <div className="flex flex-wrap gap-2">
              <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
      <CookieConsent />
    </div>
  );
}

export default Layout;
