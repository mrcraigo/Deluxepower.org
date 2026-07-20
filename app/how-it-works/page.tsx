import Link from 'next/link';
import {
  CalendarDays, CreditCard, Zap, ThumbsUp, Lock, Shield, RefreshCw,
  ArrowRight, CheckCircle2, AlertCircle,
} from 'lucide-react';

export const metadata = {
  title: 'How Secure Booking Works | DeluxePower Canberra',
  description: 'Understand our escrow payment system — pay securely, funds released only when you approve the completed work.',
};

export default function HowItWorksPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="section-heading">How Secure Booking Works</h1>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto">
            Our escrow payment model protects both customers and our business — fair for everyone.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-14 space-y-8">
          {[
            {
              step: 1,
              icon: CalendarDays,
              color: 'bg-blue-100 text-blue-700',
              title: 'Choose Your Service & Book a Time',
              content: [
                'Browse our services and upfront pricing guide.',
                'Select a date and time slot that suits you — available Mon–Fri 7am–5:30pm, Saturday 8am–2pm.',
                'Fill in your address (Canberra/ACT) and a brief description of the job.',
                'Get an instant indicative quote based on the service selected.',
              ],
            },
            {
              step: 2,
              icon: CreditCard,
              color: 'bg-purple-100 text-purple-700',
              title: 'Pay — Materials Deposit + Escrow Balance',
              content: [
                'You pay a materials deposit upfront (typically 30–40% of the quote). This covers the cost of parts and materials the electrician needs to buy before arriving.',
                'Your labour balance is charged to your card and held securely. It is NOT paid to us until you approve the completed work.',
                'All payments are processed via Stripe — bank-level security, no card details stored on our servers.',
                'You\'ll receive an instant email confirmation with your booking reference.',
              ],
            },
            {
              step: 3,
              icon: Zap,
              color: 'bg-electric-500/10 text-electric-600',
              title: 'Job Gets Done',
              content: [
                'Your licensed electrician arrives at the booked time.',
                'All work is carried out to Australian Standard AS/NZS 3000.',
                'A Certificate of Compliance is issued for all licensed electrical work.',
                'Any changes to scope (additional materials or labour) are communicated and agreed before proceeding.',
              ],
            },
            {
              step: 4,
              icon: ThumbsUp,
              color: 'bg-green-100 text-green-700',
              title: 'Approve & Release Payment',
              content: [
                'Once the job is complete, you\'ll receive an email asking you to review and approve the work.',
                'If you\'re happy, approve it — the held balance is released to us.',
                'If there\'s an issue, raise a dispute within 7 days. We\'ll investigate and resolve it fairly.',
                'If you don\'t respond within 7 days of approval request, funds are released automatically.',
              ],
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-5">
              <div className="shrink-0">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="card flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="rounded-full bg-navy-900 px-2.5 py-0.5 text-xs font-bold text-white">
                    Step {item.step}
                  </span>
                  <h2 className="font-semibold text-navy-900 text-lg">{item.title}</h2>
                </div>
                <ul className="space-y-2">
                  {item.content.map((line) => (
                    <li key={line} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Payment breakdown example */}
        <div className="mt-12 card border-2 border-electric-500/20">
          <h2 className="font-semibold text-navy-900 text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-electric-500" />
            Example Payment Breakdown
          </h2>
          <p className="text-sm text-slate-500 mt-1">For an EV Charger Installation quoted at $1,400:</p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center rounded-lg bg-slate-50 px-4 py-3">
              <div>
                <div className="text-sm font-medium text-slate-800">Materials Deposit (40%)</div>
                <div className="text-xs text-slate-500">Charged today — covers EV charger unit & wiring</div>
              </div>
              <span className="font-bold text-navy-900">$560</span>
            </div>
            <div className="flex justify-between items-center rounded-lg bg-electric-500/10 border border-electric-500/20 px-4 py-3">
              <div>
                <div className="text-sm font-medium text-navy-900 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" /> Labour Balance (Held in Escrow)
                </div>
                <div className="text-xs text-slate-500">Charged today but held — released only when you approve</div>
              </div>
              <span className="font-bold text-navy-900">$840</span>
            </div>
            <div className="flex justify-between items-center px-4 py-2 font-semibold text-slate-800">
              <span>Total Charged Today</span>
              <span>$1,400</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            * The labour balance is immediately charged to your card and held. If you dispute the job, we investigate and can issue a refund. Auto-release occurs 7 days after job completion if no dispute is raised.
          </p>
        </div>

        {/* Protections */}
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[
            {
              icon: Shield,
              title: 'Customer Protection',
              points: [
                'Funds released only on your approval',
                '7-day dispute window',
                'Full refund if job not completed',
                'Licensed & insured electrician',
              ],
              color: 'text-blue-600',
              bg: 'bg-blue-50',
            },
            {
              icon: Lock,
              title: 'Payment Security',
              points: [
                'Stripe-powered (bank grade security)',
                'No card details stored by us',
                'PCI DSS compliant',
                'Instant email receipts',
              ],
              color: 'text-purple-600',
              bg: 'bg-purple-50',
            },
            {
              icon: RefreshCw,
              title: 'Electrician Protection',
              points: [
                'Materials deposit secured upfront',
                'Payment guaranteed on completion',
                'Clear job scope agreed before start',
                'Auto-release prevents non-response',
              ],
              color: 'text-green-600',
              bg: 'bg-green-50',
            },
          ].map((section) => (
            <div key={section.title} className={`rounded-2xl ${section.bg} p-5`}>
              <section.icon className={`h-7 w-7 ${section.color} mb-3`} />
              <h3 className="font-semibold text-slate-800">{section.title}</h3>
              <ul className="mt-2 space-y-1.5">
                {section.points.map((p) => (
                  <li key={p} className="flex items-start gap-1.5 text-sm text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Dispute */}
        <div className="mt-8 rounded-xl bg-amber-50 border border-amber-200 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-900">Dispute Resolution</h3>
              <p className="mt-1 text-sm text-amber-800">
                If you&apos;re not satisfied with the completed work, raise a dispute within 7 days of the job completion notification. We&apos;ll investigate promptly, and in most cases return within 24 hours to rectify the issue at no additional cost. If a resolution can&apos;t be reached, we&apos;ll work with Stripe to process a partial or full refund.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href="/book" className="btn-primary px-10 py-4 text-base">
            Book a Job <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
