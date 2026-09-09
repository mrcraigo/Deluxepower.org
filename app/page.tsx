import Link from 'next/link';
import {
  Zap, Phone, ShieldCheck, Clock, Star, CheckCircle2,
  ArrowRight, Plug, Lightbulb, CircuitBoard, Car, Sun, AlertTriangle,
  Lock, Wrench, CreditCard, ThumbsUp,
} from 'lucide-react';
import { SERVICES, BUSINESS_INFO, ACT_SUBURBS } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';

const POPULAR_SERVICES = SERVICES.filter((s) => s.popular);

export default function HomePage() {
  return (
    <div>
      {/* Emergency banner */}
      <div className="bg-red-600 py-2.5 text-center text-sm font-medium text-white">
        <span className="mr-2">⚡ 24/7 Emergency Electrical</span>
        <a href={`tel:${BUSINESS_INFO.phone}`} className="underline underline-offset-2 hover:no-underline">
          Call {BUSINESS_INFO.phone}
        </a>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-900 py-20 lg:py-28">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #F59E0B 0%, transparent 60%)' }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-electric-500/20 px-4 py-1.5 text-sm font-medium text-electric-400">
                <span className="h-2 w-2 rounded-full bg-electric-400 animate-pulse" />
                Canberra & ACT — Licensed &amp; Insured
              </div>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Your Canberra<br />
                <span className="text-electric-400">Electrician</span>,<br />
                Book Online.
              </h1>
              <p className="mt-5 max-w-lg text-lg text-slate-300">
                Transparent upfront pricing. Book your preferred date, pay securely — funds held in escrow and only released when you&apos;re happy with the work.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/book" className="btn-primary text-base px-8 py-4">
                  Book a Job <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/services" className="btn-secondary border-white/40 text-white hover:bg-white/10 hover:text-white px-8 py-4">
                  View Rates
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-slate-400">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-electric-400" />Licensed ACT Electrician</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-electric-400" />Fully Insured</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-electric-400" />Escrow Protected</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-electric-400" />Fixed-Price Quotes</span>
              </div>
            </div>

            {/* Hero stats card */}
            <div className="hidden lg:block">
              <div className="rounded-2xl bg-white/10 p-8 ring-1 ring-white/20 backdrop-blur">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: 'Jobs Completed', value: '500+' },
                    { label: 'Google Rating', value: '5.0 ★' },
                    { label: 'Response Time', value: '< 2 hrs' },
                    { label: 'Years in Canberra', value: '10+' },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl bg-white/10 p-4 text-center">
                      <div className="text-2xl font-bold text-electric-400">{stat.value}</div>
                      <div className="mt-1 text-xs text-slate-300">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-3 rounded-xl bg-electric-500/20 p-4">
                  <Phone className="h-8 w-8 shrink-0 text-electric-400" />
                  <div>
                    <div className="text-xs text-slate-400">Emergency 24/7</div>
                    <a href={`tel:${BUSINESS_INFO.phone}`} className="text-xl font-bold text-white hover:text-electric-400">
                      {BUSINESS_INFO.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-b border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600 sm:gap-10">
            {[
              { icon: ShieldCheck, text: 'ACT Licensed Contractor' },
              { icon: Lock, text: 'Secure Escrow Payments' },
              { icon: Star, text: '5-Star Google Reviews' },
              { icon: Clock, text: '24/7 Emergency Callout' },
              { icon: CheckCircle2, text: 'Certificate of Compliance' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-electric-500" />
                <span className="font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="section-heading">How Secure Booking Works</h2>
            <p className="mt-3 text-slate-500">
              We protect both you and the electrician with a simple, transparent escrow process.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: '1',
                icon: Wrench,
                title: 'Choose Your Job',
                desc: 'Select a service, pick your preferred date and time slot in Canberra.',
              },
              {
                step: '2',
                icon: CreditCard,
                title: 'Pay Securely',
                desc: 'A materials deposit is charged upfront. Your labour balance is held securely — not paid to us until you approve.',
              },
              {
                step: '3',
                icon: Zap,
                title: 'Job Gets Done',
                desc: 'Your licensed electrician arrives, completes the work, and issues a Certificate of Compliance.',
              },
              {
                step: '4',
                icon: ThumbsUp,
                title: 'Approve & Release',
                desc: 'Happy with the work? Approve it and funds are released. If there\'s an issue, we have a dispute process.',
              },
            ].map((item) => (
              <div key={item.step} className="relative rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 text-white font-bold">
                    {item.step}
                  </div>
                  <item.icon className="h-6 w-6 text-electric-500" />
                </div>
                <h3 className="font-semibold text-navy-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-electric-500/10 border border-electric-500/20 p-6 text-center">
            <p className="text-sm font-medium text-navy-900">
              <Lock className="mr-1.5 inline h-4 w-4 text-electric-500" />
              Your payment is protected: materials deposit only — labour funds held until <strong>you approve</strong> the completed work.
            </p>
          </div>
          <div className="mt-6 text-center">
            <Link href="/how-it-works" className="btn-outline">
              Learn More About Safe Payments <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="section-heading">Popular Services</h2>
              <p className="mt-2 text-slate-500">Fixed upfront pricing — no hidden costs.</p>
            </div>
            <Link href="/services" className="hidden text-sm font-medium text-navy-700 hover:text-navy-900 sm:flex items-center gap-1">
              All Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR_SERVICES.map((service) => (
              <div key={service.id} className="card group hover:ring-electric-500/30 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="badge bg-navy-50 text-navy-700 text-[11px]">
                      {service.category.replace('-', ' ').toUpperCase()}
                    </span>
                    <h3 className="mt-2 font-semibold text-navy-900 group-hover:text-navy-700">{service.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{service.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-navy-900">
                      ${service.priceMin}{service.priceMax ? `–$${service.priceMax}` : ''}
                    </span>
                    <span className="ml-1 text-sm text-slate-400">{service.unit}</span>
                  </div>
                  <Link
                    href={`/book?service=${service.id}`}
                    className="rounded-lg bg-electric-500 px-4 py-2 text-sm font-semibold text-white hover:bg-electric-600 transition"
                  >
                    Book
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/services" className="btn-outline">
              View All Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Service categories quick grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="section-heading text-center">What We Do</h2>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[
              { icon: Plug, label: 'Powerpoints', href: '/services#powerpoints', desc: 'From $195' },
              { icon: Lightbulb, label: 'Lighting', href: '/services#lighting', desc: 'From $120' },
              { icon: ShieldCheck, label: 'Safety Devices', href: '/services#safety', desc: 'From $200' },
              { icon: CircuitBoard, label: 'Switchboards', href: '/services#switchboard', desc: 'From $1,800' },
              { icon: Car, label: 'EV Chargers', href: '/services#ev-charging', desc: 'From $900' },
              { icon: Sun, label: 'Solar & Battery', href: '/services#solar', desc: 'From $600' },
              { icon: Zap, label: 'General Electrical', href: '/services#general', desc: '$145/hr' },
              { icon: AlertTriangle, label: 'Emergency 24/7', href: '/services#emergency', desc: 'From $260' },
            ].map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="flex flex-col items-center rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-slate-100 transition hover:ring-electric-500/40 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900">
                  <cat.icon className="h-6 w-6 text-electric-400" />
                </div>
                <span className="mt-3 text-sm font-semibold text-navy-900">{cat.label}</span>
                <span className="mt-0.5 text-xs text-slate-500">{cat.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Service areas */}
      <section className="bg-navy-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Serving All of Canberra &amp; ACT</h2>
            <p className="mt-2 text-slate-400">We cover every suburb in the ACT, plus Queanbeyan and surrounding NSW.</p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {ACT_SUBURBS.slice(0, 36).map((suburb) => (
              <span
                key={suburb}
                className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-300 hover:bg-electric-500/30 transition"
              >
                {suburb}
              </span>
            ))}
            <span className="rounded-full bg-electric-500/20 px-3 py-1 text-sm font-medium text-electric-400">
              + more...
            </span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="section-heading">Ready to Book?</h2>
          <p className="mt-3 text-slate-500">
            Choose your service, pick a time, and pay securely online. Your money is protected until you approve the work.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/book" className="btn-primary px-10 py-4 text-base">
              Book a Job Online <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={`tel:${BUSINESS_INFO.phone}`} className="btn-outline px-10 py-4 text-base">
              <Phone className="h-4 w-4" /> Call {BUSINESS_INFO.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
