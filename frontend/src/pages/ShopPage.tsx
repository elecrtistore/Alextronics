import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import { useInquiry } from '../contexts/InquiryContext';
import { Product } from '../types/product';
import { fetchProducts, updateProduct } from '../services/productService';
import api from '../services/api';
import { Search, SlidersHorizontal, ChevronDown, MoreHorizontal } from 'lucide-react';
import CustomDropdown from '../components/CustomDropdown';
import { productSlug } from '../utils/slug';
import { handleShare } from '../utils/share';

interface HeroContent { title: string; subtitle: string; body: string; sections: { heading: string; content: string }[]; }

function ShopPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const { addItem } = useInquiry();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('Newest');
  const [availability, setAvailability] = useState<'All' | 'In Stock' | 'Out of Stock'>('All');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceLabel, setPriceLabel] = useState('All Price');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [draggedProductId, setDraggedProductId] = useState<string | null>(null);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [discountTargetId, setDiscountTargetId] = useState<string | null>(null);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const [shareMenuId, setShareMenuId] = useState<string | null>(null);
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

  const categoryOptions = useMemo(
    () => [
      { label: `All Products (${products.length})`, value: 'All' },
      ...categories.slice(1).map((cat) => ({ label: `${cat} (${categoryCounts[cat] || 0})`, value: cat })),
    ],
    [categories, categoryCounts, products.length]
  );

  const sortOptions = useMemo(
    () => [
      { label: 'Newest First', value: 'Newest' },
      { label: 'Lowest Price', value: 'Lowest' },
      { label: 'Highest Price', value: 'Highest' },
    ],
    []
  );

  const priceOptionItems = useMemo(
    () => priceOptions.map((opt) => ({ label: opt.label, value: opt.label })),
    [priceOptions]
  );

  useEffect(() => {
    setLoading(true);
    fetchProducts().then(setProducts).catch(console.error).finally(() => setLoading(false));
    api.get('/site/hero').then((res) => { if (res.data.title) setHero(res.data); }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!shareMenuId) return;
    const close = () => setShareMenuId(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [shareMenuId]);

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

  const handleAddToCart = (product: Product) => {
    if (addingProductId) return;
    setAddingProductId(product._id);
    addItem(product);
    window.setTimeout(() => setAddingProductId(null), 1200);
  };

  return (
    <div className="pt-0">
      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* Toolbar: search + selects */}
        <div className="mb-4">
          <div className="rounded-3xl bg-slate-50 p-3 flex items-center gap-4">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-soft" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="w-full rounded-full border border-border bg-white pl-12 pr-4 py-3 text-sm outline-none focus:border-primary transition" />
            </div>

            <div className="hidden md:flex items-center gap-3">
              <div className="w-40">
                <CustomDropdown selected={category} options={categoryOptions} onSelect={setCategory} label="Category" />
              </div>

              <div className="w-40">
                <CustomDropdown selected={sort} options={sortOptions} onSelect={setSort} label="Sort" />
              </div>

              <div className="w-48">
                <CustomDropdown selected={priceLabel} options={priceOptionItems} onSelect={(value) => {
                  const selected = priceOptions.find((opt) => opt.label === value) ?? priceOptions[0];
                  setPriceLabel(selected.label);
                  setPriceRange(selected.range);
                }} label="Price" />
              </div>
            </div>

            <div className="md:hidden">
              <button onClick={() => setFiltersOpen(!filtersOpen)} className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-charcoal hover:bg-slate-50 transition">
                <SlidersHorizontal size={16} />
                {filtersOpen ? 'Hide' : 'Filters'}
                <ChevronDown size={14} className={`transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {filtersOpen && (
          <div className="mb-4 space-y-3 rounded-3xl border border-border bg-white p-4 shadow-sm md:hidden">
            <div className="grid gap-3">
              <label className="block text-sm text-slate-600">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-2xl border border-border bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary transition">
                <option value="All">All Products ({products.length})</option>
                {categories.slice(1).map((cat) => (
                  <option key={cat} value={cat}>{cat} ({categoryCounts[cat] || 0})</option>
                ))}
              </select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <label className="text-sm text-slate-600">Sort</label>
                <CustomDropdown selected={sort} options={sortOptions} onSelect={setSort} label="Sort" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-slate-600">Price</label>
                <CustomDropdown selected={priceLabel} options={priceOptionItems} onSelect={(value) => {
                  const selected = priceOptions.find((opt) => opt.label === value) ?? priceOptions[0];
                  setPriceLabel(selected.label);
                  setPriceRange(selected.range);
                }} label="Price" />
              </div>
            </div>
          </div>
        )}

        {/* Product grid */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-white border border-border/60 overflow-hidden animate-pulse">
                  <div className="h-36 bg-slate-200" />
                  <div className="p-4">
                    <div className="h-3 w-24 bg-slate-200 rounded-full" />
                    <div className="h-4 w-3/4 bg-slate-200 rounded-full mt-3" />
                  </div>
                </div>
              ))
            ) : (
              filtered.map((product) => {
                const shareId = product.shareId || product._id;
                const menuOpen = shareMenuId === product._id;
                return (
                  <div key={product._id} className="relative rounded-2xl bg-white border border-border/60 overflow-hidden">
                    <Link to={`/products/${productSlug(product.name, product._id)}`} className="group block">
                      <div className="h-36 flex items-center justify-center bg-slate-50 overflow-hidden">
                        <img src={product.images[0]} alt={product.name} className="max-h-full max-w-full object-contain p-2 group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="p-4 space-y-1">
                        <p className="text-xs font-medium text-primary uppercase tracking-wider">{product.brand}</p>
                        <h3 className="font-semibold text-charcoal text-sm truncate">{product.name}</h3>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold text-charcoal">KSh {product.price.toLocaleString()}</span>
                          <button
                            onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}
                            disabled={addingProductId === product._id}
                            className="rounded-full bg-[#0f2b55] px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
                          >
                            {addingProductId === product._id ? 'Adding...' : 'Add to cart'}
                          </button>
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={(e) => { e.stopPropagation(); setShareMenuId(menuOpen ? null : product._id); }}
                      className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-slate-500 hover:bg-white hover:text-charcoal shadow-sm transition"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {menuOpen && (
                      <div className="absolute top-10 right-2 z-50 w-40 rounded-xl border border-border bg-white py-1 shadow-lg">
                        <button
                          onClick={(e) => { e.stopPropagation(); setShareMenuId(null); handleShare(shareId, product.name); }}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-charcoal hover:bg-slate-50 transition"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                          Share this
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopPage;
