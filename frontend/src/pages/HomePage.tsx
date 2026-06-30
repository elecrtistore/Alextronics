import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Product } from '../types/product';
import { fetchProducts } from '../services/productService';
import api from '../services/api';

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [newInquiries, setNewInquiries] = useState(0);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(console.error);
    api.get('/dashboard/stats')
      .then((res) => {
        setTotalProducts(res.data.totalProducts || 0);
        setNewInquiries(res.data.newInquiries || 0);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-50 via-white to-slate-100 p-8 shadow-soft">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,_#fb923c_0%,_transparent_40%)] opacity-60" />
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center relative">
          <div className="space-y-6">
            <p className="inline-flex rounded-full bg-orange-100 px-4 py-1 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Private electronics shop</p>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-charcoal sm:text-5xl">Browse curated electronics and request a quote directly from the seller.</h1>
            <p className="max-w-2xl text-base text-slate-600">ElectriShop is a private owner shop focused on inquiry-based purchases. Save products to your inquiry list and contact the seller directly for pricing and availability.</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/shop" className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-orange-600">Start shopping</Link>
              <Link to="/inquiry-list" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">View inquiry list</Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-white/95 p-6 ring-1 ring-slate-200/70 shadow-soft backdrop-blur-sm">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Total products</p>
                  <p className="mt-3 text-3xl font-semibold text-charcoal">{totalProducts}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">New inquiries</p>
                  <p className="mt-3 text-3xl font-semibold text-charcoal">{newInquiries}</p>
                </div>
              </div>
              {products.length > 0 && (
                <div className="rounded-3xl bg-slate-50 p-4 shadow-sm">
                  <p className="text-sm text-slate-500">Latest products</p>
                  <div className="mt-4 grid gap-3">
                    {products.slice(0, 3).map((product) => (
                      <Link key={product._id} to={`/products/${product._id}`} className="rounded-3xl bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <h3 className="font-semibold text-charcoal">{product.name}</h3>
                        <p className="text-sm text-slate-500 truncate">{product.brand}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-charcoal">Featured products</h2>
          <Link to="/shop" className="text-sm font-semibold text-primary">Browse all</Link>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.slice(0, 6).map((product) => (
            <Link key={product._id} to={`/products/${product._id}`} className="group rounded-[1rem] bg-white p-5 shadow-soft transition hover:-translate-y-1">
              <div className="aspect-[4/3] overflow-hidden rounded-[1rem] bg-slate-100">
                <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div className="mt-4">
                <p className="text-sm text-slate-500">{product.brand}</p>
                <h3 className="mt-2 text-lg font-semibold text-charcoal">{product.name}</h3>
                <p className="mt-3 text-sm text-slate-600 line-clamp-2">{product.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-semibold text-charcoal">KSh {product.price.toLocaleString()}</span>
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-primary">{product.discount ? `${product.discount}%` : 'No discount'}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
