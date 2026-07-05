import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useInquiry } from '../contexts/InquiryContext';
import { Product } from '../types/product';
import { fetchProducts, updateProduct } from '../services/productService';
import api from '../services/api';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import DiscountModal from '../components/DiscountModal';

interface HeroContent { title: string; subtitle: string; body: string; sections: { heading: string; content: string }[]; }

function ShopPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const { addItem } = useInquiry();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('Newest');
  const [availability, setAvailability] = useState<'All' | 'In Stock' | 'Out of Stock'>('All');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [draggedProductId, setDraggedProductId] = useState<string | null>(null);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [discountTargetId, setDiscountTargetId] = useState<string | null>(null);
  const [hero, setHero] = useState<HeroContent>({ title: 'Shop Electronics', subtitle: 'Browse 350+ quality electronic products.', body: '', sections: [] });
  const priceOptions = [
    { label: 'All Price', range: [0, 500000] as [number, number] },
    { label: 'Under KSh 500', range: [0, 500] as [number, number] },
    { label: 'KSh 500 - KSh 1,000', range: [500, 1000] as [number, number] },
    { label: 'KSh 1,000 - KSh 2,000', range: [1000, 2000] as [number, number] },
    { label: 'Above KSh 2,000', range: [2000, 500000] as [number, number] },
  ];
  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map((p) => p.category)))], [products]);
  const categoryCounts = useMemo(
    () => products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    [products]
  );

  useEffect(() => {
    setLoading(true);
    fetchProducts().then(setProducts).catch(console.error).finally(() => setLoading(false));
    api.get('/site/hero').then((res) => { if (res.data.title) setHero(res.data); }).catch(() => {});
  }, []);

  useEffect(() => {
    if (searchParams.get('category')) setCategory(searchParams.get('category')!);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let visible = products
      .filter((p) => category === 'All' || p.category === category)
      .filter((p) => availability === 'All' || (availability === 'In Stock' ? p.stock > 0 : p.stock <= 0))
      .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase()))
      .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sort === 'Lowest') return [...visible].sort((a, b) => a.price - b.price);
    if (sort === 'Highest') return [...visible].sort((a, b) => b.price - a.price);
    if (sort === 'Custom') return visible;
    return [...visible].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [products, category, query, sort, priceRange]);

  const handleDragStart = (e: React.DragEvent, id: string) => { setDraggedProductId(id); e.dataTransfer.effectAllowed = 'move'; };
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedProductId || draggedProductId === targetId) return;
    setProducts((prev) => {
      const next = [...prev];
      const from = next.findIndex((p) => p._id === draggedProductId);
      const to = next.findIndex((p) => p._id === targetId);
      if (from === -1 || to === -1) return prev;
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDraggedProductId(null);
  };

  const handlePriceChange = async (id: string, value: number) => {
    setProducts((prev) => prev.map((p) => p._id === id ? { ...p, price: value } : p));
    try { await updateProduct(id, { price: value }); } catch {}
  };

  const handleApplyDiscount = async (percent: number) => {
    if (!discountTargetId) return;
    setProducts((prev) => prev.map((p) => p._id === discountTargetId ? { ...p, discount: percent } : p));
    try { await updateProduct(discountTargetId, { discount: percent }); } catch {}
    setDiscountTargetId(null); setDiscountModalOpen(false);
  };

  return (
    <div className="pt-20">
      {/* ─── PAGE HEADER ─── */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <h1 className="text-3xl font-bold text-charcoal">{hero.title}</h1>
          <p className="mt-2 text-soft">{hero.subtitle}</p>
          <div className="mt-6 grid gap-4 xl:grid-cols-[1.4fr_1.6fr] items-center">
            <div className="rounded-3xl border border-border bg-slate-50 p-4">
              <p className="text-sm text-soft uppercase tracking-[0.15em]">Products available</p>
              <p className="mt-2 text-3xl font-semibold text-charcoal">{products.length}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-3xl border border-border bg-white p-4 text-center">
                <p className="text-sm text-soft">Categories</p>
                <p className="mt-2 text-xl font-semibold text-charcoal">{categories.length - 1}</p>
              </div>
              <div className="rounded-3xl border border-border bg-white p-4 text-center">
                <p className="text-sm text-soft">In stock</p>
                <p className="mt-2 text-xl font-semibold text-charcoal">{products.filter((p) => p.stock > 0).length}</p>
              </div>
              <div className="rounded-3xl border border-border bg-white p-4 text-center">
                <p className="text-sm text-soft">Out of stock</p>
                <p className="mt-2 text-xl font-semibold text-charcoal">{products.filter((p) => p.stock <= 0).length}</p>
              </div>
              <div className="rounded-3xl border border-border bg-white p-4 text-center">
                <p className="text-sm text-soft">Showing</p>
                <p className="mt-2 text-xl font-semibold text-charcoal">{filtered.length}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6 grid gap-4 xl:grid-cols-[1.4fr_1.6fr] items-end">
          <div className="relative w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-soft" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="w-full rounded-full border border-border bg-white pl-12 pr-4 py-3 text-sm outline-none focus:border-primary transition" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-primary">
              <option value="All">All Products ({products.length})</option>
              {categories.slice(1).map((cat) => (
                <option key={cat} value={cat}>{cat} ({categoryCounts[cat] || 0})</option>
              ))}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-primary">
              <option value="Newest">Newest First</option>
              <option value="Lowest">Lowest Price</option>
              <option value="Highest">Highest Price</option>
              {isAdmin && <option value="Custom">Custom order</option>}
            </select>
            <select value={priceOptions.find((option) => option.range[0] === priceRange[0] && option.range[1] === priceRange[1])?.label || 'All Price'} onChange={(e) => {
              const selected = priceOptions.find((opt) => opt.label === e.target.value);
              if (selected) setPriceRange(selected.range);
            }} className="w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-primary">
              {priceOptions.map((option) => (
                <option key={option.label} value={option.label}>{option.label}</option>
              ))}
            </select>
            <div className="grid gap-3 sm:grid-cols-2">
              <select value={availability} onChange={(e) => setAvailability(e.target.value as any)} className="w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-primary">
                <option value="All">Any Availability</option>
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
              <button onClick={() => {
                setQuery('');
                setCategory('All');
                setSort('Newest');
                setPriceRange([0, 500000]);
                setAvailability('All');
              }} className="rounded-3xl border border-border bg-white px-4 py-3 text-sm font-semibold text-charcoal hover:bg-slate-50 transition">
                Clear filters
              </button>
            </div>
          </div>
        </div>
        {/* ─── MOBILE FILTER TOGGLE ─── */}
        <div className="md:hidden mb-6">
          <button onClick={() => setFiltersOpen(!filtersOpen)} className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-charcoal hover:bg-slate-50 transition">
            <SlidersHorizontal size={16} />
            {filtersOpen ? 'Hide filters' : 'Filter & sort'}
            <ChevronDown size={14} className={`transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
          </button>
          {filtersOpen && (
            <div className="mt-4 space-y-6">
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-soft" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="w-full rounded-full border border-border bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary transition" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-charcoal mb-3">Category</h4>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button key={cat} onClick={() => { setCategory(cat); setFiltersOpen(false); }} className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${category === cat ? 'bg-primary/10 text-primary font-semibold' : 'text-soft hover:text-charcoal'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-charcoal mb-3">Price</h4>
                <div className="space-y-2">
                  {priceOptions.map((option) => (
                    <button key={option.label} onClick={() => { setPriceRange(option.range); setFiltersOpen(false); }} className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${priceRange[0] === option.range[0] && priceRange[1] === option.range[1] ? 'bg-primary/10 text-primary font-semibold' : 'text-soft hover:text-charcoal'}`}>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-charcoal mb-3">Availability</h4>
                <div className="space-y-2">
                  {['All', 'In Stock', 'Out of Stock'].map((option) => (
                    <button key={option} onClick={() => { setAvailability(option as any); setFiltersOpen(false); }} className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${availability === option ? 'bg-primary/10 text-primary font-semibold' : 'text-soft hover:text-charcoal'}`}>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-charcoal mb-3">Sort</h4>
                <div className="relative">
                  <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full appearance-none cursor-pointer rounded-lg border border-border bg-white px-3 py-2.5 pr-10 text-sm outline-none transition focus:border-primary">
                    <option value="Newest">Newest</option>
                    <option value="Lowest">Lowest Price</option>
                    <option value="Highest">Highest Price</option>
                    {isAdmin && <option value="Custom">Custom order</option>}
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-soft" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          {/* ─── DESKTOP SIDEBAR ─── */}
          <aside className="hidden md:block space-y-8">
            <div>
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-soft" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="w-full rounded-full border border-border bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary transition" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-charcoal mb-3">Category</h4>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${category === cat ? 'bg-primary/10 text-primary font-semibold' : 'text-soft hover:text-charcoal'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-charcoal mb-3">Sort</h4>
              <div className="relative">
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full appearance-none cursor-pointer rounded-lg border border-border bg-white px-3 py-2.5 pr-10 text-sm outline-none transition focus:border-primary">
                  <option value="Newest">Newest</option>
                  <option value="Lowest">Lowest Price</option>
                  <option value="Highest">Highest Price</option>
                  {isAdmin && <option value="Custom">Custom order</option>}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-soft" />
              </div>
            </div>
          </aside>

          {/* ─── PRODUCTS ─── */}
          <div>
            {isAdmin && (
              <div className="mb-6 rounded-xl bg-primary/5 px-5 py-3 text-sm text-soft">
                Admin mode: drag to reorder &middot; click price to edit &middot; use discount buttons
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white border border-border/60 overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-slate-200" />
                    <div className="p-5 space-y-3">
                      <div className="h-3 w-16 bg-slate-200 rounded-full" />
                      <div className="h-4 w-3/4 bg-slate-200 rounded-full" />
                      <div className="h-5 w-24 bg-slate-200 rounded-full" />
                      <div className="h-3 w-20 bg-slate-200 rounded-full" />
                      <div className="h-9 w-full bg-slate-200 rounded-full mt-3" />
                    </div>
                  </div>
                ))
              ) : (
                filtered.map((product) => {
                  const discounted = product.discount ? Math.round(product.price * (1 - product.discount / 100)) : null;
                  return (
                    <div
                      key={product._id}
                      draggable={isAdmin}
                      onDragStart={(e) => isAdmin && handleDragStart(e, product._id)}
                      onDragOver={(e) => isAdmin && e.preventDefault()}
                      onDrop={(e) => isAdmin && handleDrop(e, product._id)}
                      className={`group rounded-2xl bg-white border border-border/60 overflow-hidden animate-lift ${isAdmin ? 'cursor-grab' : ''}`}
                    >
                      <Link to={`/products/${product._id}`} className="block aspect-[4/3] overflow-hidden bg-slate-50">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500" />
                      </Link>
                      <div className="p-5 space-y-2">
                        <p className="text-xs font-medium text-primary uppercase tracking-wider">{product.brand}</p>
                        <Link to={`/products/${product._id}`}>
                          <h3 className="font-semibold text-charcoal leading-snug hover:text-primary transition-colors">{product.name}</h3>
                        </Link>
                        <div className="flex items-center gap-2">
                          {discounted ? (
                            <>
                              <span className="text-lg font-bold text-charcoal">KSh {discounted.toLocaleString()}</span>
                              <span className="text-sm text-soft line-through">KSh {product.price.toLocaleString()}</span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-charcoal">KSh {product.price.toLocaleString()}</span>
                          )}
                        </div>
                        {product.discount ? (
                          <span className="inline-block rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-600">{product.discount}% OFF</span>
                        ) : (
                          <span className="inline-block rounded-full bg-slate-100 px-3 py-0.5 text-xs font-medium text-soft">{product.stock > 0 ? 'In stock' : 'Out of stock'}</span>
                        )}
                        <div className="pt-3 flex gap-2">
                          {isAdmin && (
                            <>
                              {editingPriceId === product._id ? (
                                <input type="number" value={product.price} onChange={(e) => handlePriceChange(product._id, Number(e.target.value))}
                                  onBlur={() => setEditingPriceId(null)} className="flex-1 rounded-full border border-border px-3 py-2 text-sm outline-none focus:border-primary" autoFocus />
                              ) : (
                                <button onClick={() => setEditingPriceId(product._id)} className="flex-1 rounded-full border border-border bg-white text-sm font-medium text-charcoal py-2 hover:bg-slate-50 transition">Edit price</button>
                              )}
                              <button onClick={() => { setDiscountTargetId(product._id); setDiscountModalOpen(true); }} className="rounded-full border border-border bg-white px-3 py-2 text-sm font-medium text-charcoal hover:bg-slate-50 transition">
                                {product.discount ? `${product.discount}%` : 'Discount'}
                              </button>
                            </>
                          )}
                          <button onClick={() => addItem(product)} className="flex-1 rounded-full bg-primary text-sm font-semibold text-white py-2 hover:bg-primary-hover transition">
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {!loading && filtered.length === 0 && (
              <div className="text-center py-20 text-soft">
                <p className="text-lg font-medium">No products found</p>
                <p className="text-sm mt-2">Try adjusting your filters.</p>
              </div>
            )}
          </div>

        </div>
      </div>
      <DiscountModal open={discountModalOpen} initial={10} onClose={() => { setDiscountModalOpen(false); setDiscountTargetId(null); }} onApply={handleApplyDiscount} />
    </div>
  );
}

export default ShopPage;
