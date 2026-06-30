function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="rounded-[1.5rem] bg-white p-10 shadow-soft">
        <h1 className="text-3xl font-semibold text-charcoal">About ElectriShop</h1>
        <p className="mt-4 text-slate-600">ElectriShop is an inquiry-first private shop built for direct customer contact. We focus on product browsing, simple inquiry tracking, and a direct connection between you and the seller.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-[1.25rem] border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-charcoal">Explore</h2>
            <p className="mt-3 text-sm text-slate-600">Browse curated electronics and request product details directly from the shop owner.</p>
          </div>
          <div className="rounded-[1.25rem] border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-charcoal">Inquire</h2>
            <p className="mt-3 text-sm text-slate-600">Organize your inquiry list and send the shop owner a single request for pricing, stock, and delivery details.</p>
          </div>
          <div className="rounded-[1.25rem] border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-charcoal">Connect</h2>
            <p className="mt-3 text-sm text-slate-600">Use built-in contact details to follow up by phone, WhatsApp, or direct message.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
