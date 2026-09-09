import Link from 'next/link';
import { Zap, Phone, Mail, MapPin, Clock, Shield, Star } from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-electric-500">
                <Zap className="h-5 w-5 text-white" fill="currentColor" />
              </div>
              <div>
                <span className="block text-base font-bold leading-none text-white">DeluxePower</span>
                <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  Electrical · Canberra
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Licensed Canberra electrician serving all of ACT and surrounding NSW. Book online, pay safely, get the job done right.
            </p>
            <div className="mt-4 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-electric-400 text-electric-400" />
              ))}
              <span className="ml-1 text-sm text-slate-400">5.0 on Google</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">Services</h3>
            <ul className="space-y-2 text-sm">
              {[
                ['Powerpoints & Outlets', '/services#powerpoints'],
                ['Lighting & Fans', '/services#lighting'],
                ['Safety Switches & Alarms', '/services#safety'],
                ['Switchboard Upgrades', '/services#switchboard'],
                ['EV Charger Installation', '/services#ev-charging'],
                ['Solar & Battery Wiring', '/services#solar'],
                ['Data & Network Points', '/services#data'],
                ['Emergency Callout', '/services#emergency'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-slate-400 transition hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">Service Areas</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              {[
                'Belconnen & Gungahlin',
                'Tuggeranong & Woden',
                'Inner North & Inner South',
                'Molonglo Valley',
                'Fyshwick & Hume',
                'Queanbeyan & Jerrabomberra',
                'All of ACT',
              ].map((area) => (
                <li key={area} className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-electric-500" />
                  {area}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`tel:${BUSINESS_INFO.phone}`} className="flex items-center gap-2 text-slate-400 transition hover:text-white">
                  <Phone className="h-4 w-4 shrink-0 text-electric-500" />
                  {BUSINESS_INFO.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${BUSINESS_INFO.email}`} className="flex items-center gap-2 text-slate-400 transition hover:text-white">
                  <Mail className="h-4 w-4 shrink-0 text-electric-500" />
                  {BUSINESS_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-electric-500" />
                {BUSINESS_INFO.address}
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-electric-500" />
                <div>
                  <div>Mon–Fri: {BUSINESS_INFO.hours.weekday}</div>
                  <div>Saturday: {BUSINESS_INFO.hours.saturday}</div>
                  <div className="text-electric-400">Emergency: {BUSINESS_INFO.hours.emergency}</div>
                </div>
              </li>
            </ul>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-navy-900/60 px-3 py-2">
              <Shield className="h-4 w-4 text-electric-400" />
              <span className="text-xs text-slate-400">{BUSINESS_INFO.license}</span>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-8 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DeluxePower Electrical. All rights reserved. ABN: {BUSINESS_INFO.abn}</p>
          <p className="mt-1">
            <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
            {' · '}
            <Link href="/terms" className="hover:text-slate-300">Terms & Conditions</Link>
            {' · '}
            <Link href="/dashboard" className="hover:text-slate-300">Admin</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
