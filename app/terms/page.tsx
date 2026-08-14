export const metadata = { title: 'Terms & Conditions | DeluxePower Electrical' };

export default function TermsPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="section-heading">Terms & Conditions</h1>
        <p className="mt-2 text-slate-500">Last updated: {new Date().toLocaleDateString('en-AU')}</p>
        <div className="mt-8 space-y-6 text-sm text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-navy-900">1. Bookings & Quotes</h2>
            <p>Prices shown are indicative. A fixed price will be confirmed before any work commences. You will not be charged more than the confirmed fixed price without prior written agreement.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-navy-900">2. Payment & Escrow</h2>
            <p>A materials deposit (approximately 30–40% of the quote) is charged upon booking confirmation. The labour balance is held by the payment processor and released to DeluxePower Electrical only upon your approval of completed work, or automatically after 7 days with no dispute lodged.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-navy-900">3. Cancellation</h2>
            <p>Cancellations made more than 24 hours before the scheduled job will receive a full refund. Cancellations within 24 hours will forfeit the materials deposit. The labour balance will always be refunded on cancellation.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-navy-900">4. Disputes</h2>
            <p>Disputes must be raised within 7 days of the job completion notification. We will investigate and respond within 24 hours. If we cannot resolve the dispute, we will issue a partial or full refund as appropriate.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-navy-900">5. Warranty</h2>
            <p>All electrical work is warranted against defects in workmanship for 12 months. This does not cover damage caused by the customer, third parties, or events outside our control.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-navy-900">6. Compliance</h2>
            <p>All work is carried out by licensed ACT electrical contractors in accordance with Australian Standard AS/NZS 3000. A Certificate of Compliance is issued for all licenced electrical work.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-navy-900">7. Contact</h2>
            <p>Questions: <a href="mailto:bookings@deluxepower.org" className="text-navy-700 hover:underline">bookings@deluxepower.org</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
