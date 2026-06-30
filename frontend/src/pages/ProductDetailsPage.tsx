import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchProductById, fetchProducts } from '../services/productService';
import { Product } from '../types/product';
import { useInquiry } from '../contexts/InquiryContext';
import { ChevronLeft, ShoppingCart, MessageCircle, Phone, Package, Shield, Truck } from 'lucide-react';

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useInquiry();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetchProductById(id).then((p) => {
      setProduct(p);
      setSelectedImage(0);
      fetchProducts().then((all) => setRelated(all.filter((r) => r.category === p.category && r._id !== p._id).slice(0, 4))).catch(() => {});
    }).catch(console.error);
  }, [id]);

  if (!product) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-soft">Loading...</div>
      </div>
    );
  }

  const discounted = product.discount ? Math.round(product.price * (1 - product.discount / 100)) : null;

  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-soft hover:text-charcoal transition mb-8">
          <ChevronLeft size={16} /> Back
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* GALLERY */}
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-2xl bg-slate-50 overflow-hidden">
              <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-contain p-4" />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${selectedImage === i ? 'border-primary' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div className="lg:sticky lg:top-28 lg:self-start space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-medium text-primary uppercase tracking-wider">{product.brand} &middot; {product.category}</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-charcoal leading-tight">{product.name}</h1>
              <div className="flex items-center gap-3">
                {discounted ? (
                  <>
                    <span className="text-3xl font-bold text-charcoal">KSh {discounted.toLocaleString()}</span>
                    <span className="text-xl text-soft line-through">KSh {product.price.toLocaleString()}</span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-600">{product.discount}% OFF</span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-charcoal">KSh {product.price.toLocaleString()}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-400'}`} />
                <span className="text-sm text-soft">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
              </div>
            </div>

            <p className="text-soft leading-relaxed">{product.description}</p>

            {Object.keys(product.specifications).length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-charcoal">Specifications</h3>
                <div className="divide-y divide-border rounded-xl border border-border">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between px-4 py-3 text-sm">
                      <span className="text-soft">{key}</span>
                      <span className="font-medium text-charcoal">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="font-semibold text-charcoal">Seller</h3>
              <div className="rounded-xl bg-slate-50 p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <Package size={16} className="text-primary" />
                  <span className="text-sm font-medium text-charcoal">{product.sellerName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-soft" />
                  <a href={`tel:${product.sellerPhone}`} className="text-sm text-soft hover:text-primary transition">{product.sellerPhone}</a>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle size={16} className="text-emerald-500" />
                  <a href={`https://wa.me/${product.sellerWhatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-sm text-soft hover:text-emerald-600 transition">WhatsApp</a>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { addItem(product); navigate('/inquiry-list'); }}
                className="flex-1 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white hover:bg-primary-hover transition shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                <ShoppingCart size={16} /> Add to Inquiry
              </button>
              <a href={`https://wa.me/${product.sellerWhatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer"
                className="rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-charcoal hover:bg-slate-50 transition flex items-center justify-center gap-2">
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="mt-20 pt-12 border-t border-border">
            <h2 className="text-2xl font-bold text-charcoal mb-8">Related Products</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <Link key={p._id} to={`/products/${p._id}`} className="group rounded-2xl bg-background overflow-hidden animate-lift">
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4 space-y-1">
                    <h3 className="font-semibold text-charcoal text-sm">{p.name}</h3>
                    <p className="text-sm font-bold text-charcoal">KSh {p.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ProductDetailsPage;
