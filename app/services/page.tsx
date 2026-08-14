import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { SERVICES, SERVICE_CATEGORIES } from '@/lib/data';
import { formatPrice } from '@/lib/data';

export const metadata = {
  title: 'Electrical Services & Rates | DeluxePower Canberra',
  description: 'Upfront pricing for all electrical services in Canberra/ACT. Powerpoints, lighting, switchboards, EV chargers, solar wiring and more.',
};

export default function ServicesPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="section-heading">Services &amp; Rates</h1>
          <p className="mt-3 max-w-2xl mx-auto text-slate-500">
            All prices are indicative — your final quote depends on your specific job. We&apos;ll always confirm a fixed price before starting work.
          </p>
        </div>

        {/* Category navigation */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {SERVICE_CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-navy-500 hover:text-navy-700"
            >
              {cat.label}
            </a>
          ))}
        </div>

        {/* Services by category */}
        {SERVICE_CATEGORIES.map((cat) => {
          const catServices = SERVICES.filter((s) => s.category === cat.id);
          if (catServices.length === 0) return null;
          return (
            <section key={cat.id} id={cat.id} className="mt-16 scroll-mt-24">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-bold text-navy-900">{cat.label}</h2>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                  {catServices.length} service{catServices.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {catServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md"
                  >
                    <div className="flex-1">
                      {service.popular && (
                        <span className="badge bg-electric-500/10 text-electric-600 mb-2">Popular</span>
                      )}
                      {service.emergency && (
                        <span className="badge bg-red-100 text-red-700 mb-2">24/7 Emergency</span>
                      )}
                      <h3 className="font-semibold text-navy-900">{service.name}</h3>
                      <p className="mt-1.5 text-sm text-slate-500">{service.description}</p>
                      <ul className="mt-3 space-y-1">
                        {service.details.map((d) => (
                          <li key={d} className="flex items-start gap-1.5 text-xs text-slate-500">
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                      <div>
                        <span className="text-2xl font-bold text-navy-900">{formatPrice(service)}</span>
                        <div className="mt-0.5 text-xs text-slate-400">
                          {service.materialsDepositPct > 0
                            ? `${Math.round(service.materialsDepositPct * 100)}% materials deposit upfront`
                            : 'No deposit required'}
                        </div>
                      </div>
                      <Link
                        href={`/book?service=${service.id}`}
                        className="flex items-center gap-1.5 rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-700"
                      >
                        Book <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {/* Disclaimer */}
        <div className="mt-16 rounded-2xl bg-slate-100 p-6 text-sm text-slate-600">
          <h3 className="font-semibold text-slate-800 mb-2">Pricing Notes</h3>
          <ul className="space-y-1 list-disc pl-5">
            <li>All prices are in AUD including GST.</li>
            <li>Prices are indicative — your final fixed quote will be confirmed before any work starts.</li>
            <li>Materials (cable, fittings, switchgear) are additional unless specified.</li>
            <li>After-hours and weekend rates may apply outside standard hours.</li>
            <li>A Certificate of Compliance is issued for all licenced electrical work at no extra cost.</li>
            <li>Minimum 2-hour call-out applies for all bookings.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
