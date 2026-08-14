export const metadata = { title: 'Privacy Policy | DeluxePower Electrical' };

export default function PrivacyPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="section-heading">Privacy Policy</h1>
        <p className="mt-2 text-slate-500">Last updated: {new Date().toLocaleDateString('en-AU')}</p>
        <div className="mt-8 prose prose-slate max-w-none space-y-6 text-sm text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-navy-900">Information We Collect</h2>
            <p>When you book a job, we collect your name, email address, phone number, and service address. This information is used solely to arrange and complete your electrical job.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-navy-900">Payment Information</h2>
            <p>All payment processing is handled by Stripe. We do not store your card details on our servers. Stripe is PCI DSS Level 1 certified.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-navy-900">How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To arrange and complete your electrical job</li>
              <li>To contact you about your booking</li>
              <li>To process your payment and issue receipts</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-navy-900">Contact</h2>
            <p>Privacy questions: <a href="mailto:bookings@deluxepower.org" className="text-navy-700 hover:underline">bookings@deluxepower.org</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
