import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useInquiry } from '../contexts/InquiryContext';
import { Product } from '../types/product';
import { fetchProducts, updateProduct } from '../services/productService';
import api from '../services/api';
import DiscountModal from '../components/DiscountModal';

interface HeroContent {
  title: string;
  subtitle: string;
  body: string;
  sections: { heading: string; content: string }[];
}

function ShopPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const { addItem } = useInquiry();
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('Newest');
  const [draggedProductId, setDraggedProductId] = useState<string | null>(null);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [discountTargetId, setDiscountTargetId] = useState<string | null>(null);
  const [hero, setHero] = useState<HeroContent>({
    title: 'Shop electronics',
    subtitle: 'Browse the private shop\'s inventory and add products to your inquiry list.',
    body: '',
    sections: []
  });

  useEffect(() => {
    fetchProducts().then(setProducts).catch(console.error);
    api.get('/site/hero').then((res) => {
      if (res.data.title) setHero(res.data);
    }).catch(() => {});
  }, []);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((product) => product.category)))],
    [products]
  );

  const filtered = useMemo(() => {
    const visible = products
      .filter((product) => category === 'All' || product.category === category)
      .filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase())
      );

    if (sort === 'Lowest') return [...visible].sort((a, b) => a.price - b.price);
    if (sort === 'Highest') return [...visible].sort((a, b) => b.price - a.price);
    if (sort === 'Custom') return visible;
    return [...visible].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [products, category, query, sort]);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, productId: string) => {
    setDraggedProductId(productId);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, targetProductId: string) => {
    event.preventDefault();
    if (!draggedProductId || draggedProductId === targetProductId) return;

    setProducts((current) => {
      const next = [...current];
      const fromIndex = next.findIndex((product) => product._id === draggedProductId);
      const toIndex = next.findIndex((product) => product._id === targetProductId);
      if (fromIndex === -1 || toIndex === -1) return current;
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    setDraggedProductId(null);
  };

  const handlePriceChange = async (productId: string, value: number) => {
    setProducts((current) =>
      current.map((product) =>
        product._id === productId ? { ...product, price: Number(value) } : product
      )
    );
    try {
      await updateProduct(productId, { price: Number(value) });
    } catch (err) {
      console.error('Failed to update price', err);
    }
  };

  const handleApplyDiscount = async (percent: number) => {
    if (!discountTargetId) return;
    setProducts((current) => current.map((p) => (p._id === discountTargetId ? { ...p, discount: percent } : p)));
    try {
      await updateProduct(discountTargetId, { discount: percent });
    } catch (err) {
      console.error('Failed to update discount', err);
    }
    setDiscountTargetId(null);
    setDiscountModalOpen(false);
  };

  const handleRemoveDiscount = async (productId: string) => {
    setProducts((current) => current.map((p) => (p._id === productId ? { ...p, discount: undefined } : p)));
    try {
      await updateProduct(productId, { discount: 0 });
    } catch (err) {
      console.error('Failed to remove discount', err);
    }
  };

  const toggleDiscount = (productId: string) => {
    setDiscountTargetId(productId);
    setDiscountModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-white via-orange-50 to-slate-100 p-6 shadow-soft ring-1 ring-slate-200/70">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-charcoal">{hero.title}</h1>
            <p className="mt-2 text-sm text-slate-600">{hero.subtitle}</p>
            {hero.body && <p className="mt-3 text-sm text-slate-600">{hero.body}</p>}
            {isAdmin && (
              <p className="mt-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">Admin mode: drag cards to reorder products, edit prices, and apply discounts.</p>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products or brands"
              className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-charcoal shadow-sm focus:border-primary focus:outline-none"
            />
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-charcoal shadow-sm focus:border-primary focus:outline-none"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-charcoal shadow-sm focus:border-primary focus:outline-none"
            >
              <option value="Newest">Newest</option>
              <option value="Lowest">Lowest Price</option>
              <option value="Highest">Highest Price</option>
              {isAdmin && <option value="Custom">Custom order</option>}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((product) => {
          const discountedPrice = product.discount
            ? Math.max(0, Math.round(product.price * (1 - product.discount / 100)))
            : product.price;

          return (
            <div
              key={product._id}
              draggable={isAdmin}
              onDragStart={(event) => isAdmin && handleDragStart(event, product._id)}
              onDragOver={(event) => isAdmin && event.preventDefault()}
              onDrop={(event) => isAdmin && handleDrop(event, product._id)}
              className={`relative z-0 flex h-full flex-col overflow-hidden isolate rounded-[1.75rem] bg-white p-5 ring-1 ring-slate-200/70 shadow-soft transition hover:z-50 hover:-translate-y-1 hover:shadow-xl ${
                isAdmin ? 'cursor-grab' : ''
              }`}
            >
              <Link to={`/products/${product._id}`} className="block">
                <div className="aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-slate-100">
                  <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                </div>
              </Link>
              <div className="mt-4 flex h-full flex-col justify-between gap-3">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-[0.15em] text-slate-400">{product.brand}</p>
                      <h2 className="mt-2 text-xl font-semibold text-charcoal">{product.name}</h2>
                    </div>
                    {product.discount ? (
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
                        {product.discount}%
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-3 text-sm text-slate-600 line-clamp-2">{product.description}</p>

                  <div className="mt-4 space-y-3">
                    {product.discount ? (
                      <div className="rounded-3xl bg-orange-50 p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-slate-500 line-through">KSh {product.price.toLocaleString()}</span>
                          <span className="text-xl font-semibold text-orange-700">KSh {discountedPrice.toLocaleString()}</span>
                        </div>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-orange-600">Discounted price layout active</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-charcoal">KSh {product.price.toLocaleString()}</span>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => setEditingPriceId(product._id)}
                            className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    )}

                    {editingPriceId === product._id && (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={product.price}
                          onChange={(event) => handlePriceChange(product._id, Number(event.target.value))}
                          className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-charcoal shadow-sm focus:border-primary focus:outline-none"
                        />
                        <button
                          onClick={() => setEditingPriceId(null)}
                          className="rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <Link
                    to={`/products/${product._id}`}
                    className="flex h-12 w-full items-center justify-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() => product.discount ? handleRemoveDiscount(product._id) : toggleDiscount(product._id)}
                    className="flex h-12 w-full items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    {product.discount ? 'Remove discount' : 'Add discount'}
                  </button>
                  <button
                    type="button"
                    onClick={() => addItem(product)}
                    className="flex h-12 w-full items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Add to Inquiry
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
        <DiscountModal open={discountModalOpen} initial={10} onClose={() => { setDiscountModalOpen(false); setDiscountTargetId(null); }} onApply={handleApplyDiscount} />
    </div>
  );
}

export default ShopPage;
