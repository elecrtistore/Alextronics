function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="rounded-[1.5rem] bg-white p-10 shadow-soft">
        <h1 className="text-3xl font-semibold text-charcoal">Contact us</h1>
        <p className="mt-4 text-slate-600">Have a question about the platform or want to learn more about buyer and seller support? Reach out through the channels below.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-[1.25rem] border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-charcoal">Email</h2>
            <p className="mt-3 text-sm text-slate-600">support@electrishop.example</p>
          </div>
          <div className="rounded-[1.25rem] border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-charcoal">Phone</h2>
            <p className="mt-3 text-sm text-slate-600">+254 700 000 000</p>
          </div>
          <div className="rounded-[1.25rem] border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-charcoal">WhatsApp</h2>
            <p className="mt-3 text-sm text-slate-600">+254 711 000 000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
