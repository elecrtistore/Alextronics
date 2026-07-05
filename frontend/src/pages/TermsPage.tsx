function TermsPage() {
  return (
    <div className="pt-24 bg-slate-50 min-h-screen">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Terms</p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold">Terms of Service</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-300">Last updated: July 2026</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-[2rem] bg-white p-10 shadow-sm border border-slate-200 space-y-12 text-slate-700">
          <div>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">Acceptance of Terms</h2>
            <p>By accessing or using ALEXTRONICS, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">Description of Service</h2>
            <p>ALEXTRONICS is an inquiry-first electronics marketplace that connects buyers with sellers. We facilitate communication between parties but are not a party to any sale transaction. Prices and availability are provided by sellers and subject to change.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">User Accounts</h2>
            <ul className="list-disc pl-5 space-y-3 text-sm text-slate-600">
              <li>You must provide accurate information when creating an account</li>
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You must notify us immediately of any unauthorized account use</li>
              <li>We reserve the right to suspend or terminate accounts for violations</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">Inquiry Process</h2>
            <ul className="list-disc pl-5 space-y-3 text-sm text-slate-600">
              <li>Submitting an inquiry is a request for information, not a binding purchase</li>
              <li>Sellers may respond with pricing and availability details</li>
              <li>All transactions are between the buyer and seller directly</li>
              <li>ALEXTRONICS does not process payments or handle transactions</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">User Conduct</h2>
            <p className="text-sm text-slate-600">You agree not to:</p>
            <ul className="list-disc pl-5 space-y-3 text-sm text-slate-600 mt-4">
              <li>Use the platform for any unlawful purpose</li>
              <li>Submit false or misleading information</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated tools to scrape or interfere with the platform</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">Intellectual Property</h2>
            <p>All content on ALEXTRONICS, including logos, text, images, and design, is owned by or licensed to ALEXTRONICS and may not be reproduced without permission. Product images are provided by sellers.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">Limitation of Liability</h2>
            <p>ALEXTRONICS is provided "as is" without warranties of any kind. We are not liable for any damages arising from the use of the platform, including but not limited to failed transactions, misrepresentation by sellers, or technical issues.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">Termination</h2>
            <p>We reserve the right to terminate or suspend access to the platform at our sole discretion, without prior notice, for conduct that we believe violates these Terms or is harmful to other users or the platform.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">Changes to Terms</h2>
            <p>We may modify these Terms at any time. Continued use of the platform after changes constitutes acceptance of the new Terms.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">Contact</h2>
            <p className="text-sm text-slate-600">For questions about these Terms, contact us at:</p>
            <p className="mt-3 text-sm text-slate-600">Email: alextronics.shop01@gmail.com<br />Phone: 0708309429</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TermsPage;
