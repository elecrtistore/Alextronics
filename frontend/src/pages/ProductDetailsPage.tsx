import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../services/productService';
import { Product } from '../types/product';

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchProductById(id).then(setProduct).catch(console.error);
  }, [id]);

  if (!product) {
    return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">Loading product...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <div className="rounded-[1.75rem] bg-white p-6 ring-1 ring-slate-200/70 shadow-soft">
            <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
              <div className="aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-slate-100">
                <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-4">
                <h1 className="text-3xl font-semibold text-charcoal">{product.name}</h1>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{product.category} · {product.brand}</p>
                <p className="text-2xl font-semibold text-charcoal">KSh {product.price.toLocaleString()}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button onClick={() => navigate('/inquiry-list')} className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">Add to Inquiry</button>
                  <a href={`https://wa.me/${product.sellerWhatsapp}`} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 text-center transition hover:bg-slate-50">Contact the seller</a>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[1.75rem] bg-white p-6 ring-1 ring-slate-200/70 shadow-soft">
              <h2 className="text-xl font-semibold text-charcoal">Overview</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{product.description}</p>
              <div className="mt-6 space-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between border-b border-slate-100 py-3">
                    <span className="text-sm text-slate-500">{key}</span>
                    <span className="text-sm font-medium text-charcoal">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-white p-6 ring-1 ring-slate-200/70 shadow-soft">
              <h2 className="text-xl font-semibold text-charcoal">Seller details</h2>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Seller</p>
                  <p className="mt-1 text-lg font-semibold text-charcoal">{product.sellerName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="text-lg font-semibold text-charcoal">{product.sellerPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Availability</p>
                  <p className={`text-lg font-semibold ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{product.stock > 0 ? 'In stock' : 'Out of stock'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[1.75rem] bg-white p-6 ring-1 ring-slate-200/70 shadow-soft">
            <h2 className="text-xl font-semibold text-charcoal">Product summary</h2>
            <div className="mt-6 space-y-4 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Original price</span>
                <span>KSh {product.price.toLocaleString()}</span>
              </div>
              {product.discount && (
                <div className="flex items-center justify-between">
                  <span>Discount</span>
                  <span className="text-primary">{product.discount}%</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                <span className="font-semibold text-charcoal">Availability</span>
                <span>{product.stock > 0 ? `${product.stock} in stock` : 'Unavailable'}</span>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-white p-6 ring-1 ring-slate-200/70 shadow-soft">
            <h2 className="text-xl font-semibold text-charcoal">Related products</h2>
            <p className="mt-3 text-sm text-slate-500">Browse more in the same category.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
