function PrivacyPage() {
  return (
    <div className="pt-0 bg-white min-h-screen">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Privacy</p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold">Privacy Policy</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-300">Last updated: July 2026</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-[2rem] bg-white p-10 shadow-sm border border-slate-200">
          <div className="space-y-12 text-slate-700">
            <div>
              <h2 className="text-2xl font-semibold text-charcoal mb-4">Information We Collect</h2>
              <p>When you use ALEXTRONICS, we collect information you provide directly:</p>
              <ul className="mt-4 space-y-3 pl-5 list-disc text-sm text-slate-600">
                <li><strong>Account Information:</strong> If you sign up, we collect your email address and display name via Firebase Authentication.</li>
                <li><strong>Inquiry Information:</strong> When you submit an inquiry, we collect your name, phone number, county, town, estate, landmark, and any notes you provide.</li>
                <li><strong>Subscription Information:</strong> If you subscribe to our newsletter, we collect your email address and optional name.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-charcoal mb-4">Local Storage & Cookies</h2>
              <p className="text-sm text-slate-600">ALEXTRONICS uses browser local storage for essential functionality:</p>
              <ul className="mt-4 space-y-3 pl-5 list-disc text-sm text-slate-600">
                <li><strong>User Role:</strong> We store your assigned role (e.g., Buyer, Admin) in local storage to manage access control.</li>
                <li><strong>Inquiry Cart:</strong> Items you add to your inquiry cart are stored locally so your selection persists between sessions.</li>
                <li><strong>Firebase Auth:</strong> Firebase Authentication uses local storage and cookies to maintain your login session.</li>
              </ul>
              <p className="mt-4 text-sm text-slate-600">We do not use tracking cookies, analytics cookies, or third-party advertising cookies. All local storage is used solely for functionality.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-charcoal mb-4">How We Use Your Information</h2>
              <ul className="mt-4 space-y-3 pl-5 list-disc text-sm text-slate-600">
                <li>To process and respond to product inquiries</li>
                <li>To send requested newsletters and promotional emails (with consent)</li>
                <li>To manage user accounts and admin access</li>
                <li>To improve our marketplace and user experience</li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-charcoal mb-4">Data Sharing</h2>
              <p className="text-sm text-slate-600">We do not sell your personal information. We may share data with:</p>
              <ul className="mt-4 space-y-3 pl-5 list-disc text-sm text-slate-600">
                <li><strong>Firebase (Google):</strong> Authentication services and user account management</li>
                <li><strong>MongoDB Atlas:</strong> Database hosting for storing your inquiries and account data</li>
                <li><strong>Gmail SMTP:</strong> Sending transactional and promotional emails</li>
              </ul>
              <p className="mt-4 text-sm text-slate-600">All third-party services are GDPR-compliant and use industry-standard security measures.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-charcoal mb-4">Data Retention</h2>
              <ul className="mt-4 space-y-3 pl-5 list-disc text-sm text-slate-600">
                <li>Inquiry records are kept for order fulfillment and record-keeping purposes</li>
                <li>Subscription data is kept until you unsubscribe</li>
                <li>Account data is kept until you request deletion</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-charcoal mb-4">Your Rights</h2>
              <ul className="mt-4 space-y-3 pl-5 list-disc text-sm text-slate-600">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Withdraw consent for email marketing at any time</li>
                <li>Export your data in a portable format</li>
              </ul>
              <p className="mt-4 text-sm text-slate-600">To exercise these rights, contact us at alextronics.shop01@gmail.com.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-charcoal mb-4">Security</h2>
              <p className="text-sm text-slate-600">We implement appropriate security measures including HTTPS encryption, Firebase Authentication for secure access, and database access controls. However, no online service is 100% secure.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-charcoal mb-4">Changes to This Policy</h2>
              <p className="text-sm text-slate-600">We may update this policy from time to time. Changes will be posted on this page with an updated date.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-charcoal mb-4">Contact</h2>
              <p className="text-sm text-slate-600">For questions about this policy, contact us at:</p>
              <p className="mt-3 text-sm text-slate-600">Email: alextronics.shop01@gmail.com<br />Phone: 0708309429</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PrivacyPage;
