export type ServiceCategory =
  | 'powerpoints'
  | 'lighting'
  | 'safety'
  | 'switchboard'
  | 'ev-charging'
  | 'solar'
  | 'data'
  | 'general'
  | 'emergency';

export interface Service {
  id: string;
  name: string;
  description: string;
  details: string[];
  category: ServiceCategory;
  priceType: 'fixed' | 'hourly' | 'range';
  priceMin: number;
  priceMax?: number;
  unit: string;
  duration: number; // minimum hours for booking block
  materialsDepositPct: number; // % of quote charged upfront for materials
  popular?: boolean;
  emergency?: boolean;
}

export const SERVICES: Service[] = [
  // POWERPOINTS
  {
    id: 'gpo-single',
    name: 'Powerpoint Installation (Single)',
    description: 'Install a new single GPO (general purpose outlet) in any room.',
    details: [
      'New circuit or extension from existing',
      'All wall patching included',
      'Tested and certified',
    ],
    category: 'powerpoints',
    priceType: 'range',
    priceMin: 195,
    priceMax: 280,
    unit: 'per point',
    duration: 2,
    materialsDepositPct: 0.3,
    popular: true,
  },
  {
    id: 'gpo-double',
    name: 'Powerpoint Installation (Double)',
    description: 'Install a new double GPO outlet — ideal for kitchens, offices and living areas.',
    details: [
      'Double outlet (2 x sockets)',
      'Extension from existing circuit',
      'Includes wall plate and wiring',
    ],
    category: 'powerpoints',
    priceType: 'range',
    priceMin: 220,
    priceMax: 320,
    unit: 'per point',
    duration: 2,
    materialsDepositPct: 0.3,
  },
  {
    id: 'gpo-usb',
    name: 'USB Powerpoint Installation',
    description: 'Modern outlet with built-in USB-A and USB-C charging ports.',
    details: [
      'Dual USB-C + USB-A charging',
      'GPO sockets included',
      'Flush wall mount',
    ],
    category: 'powerpoints',
    priceType: 'range',
    priceMin: 260,
    priceMax: 380,
    unit: 'per point',
    duration: 2,
    materialsDepositPct: 0.35,
  },
  {
    id: 'gpo-outdoor',
    name: 'Outdoor / Weatherproof Powerpoint',
    description: 'IP-rated weatherproof outdoor powerpoint — ideal for pergolas, garages and entertainment areas.',
    details: [
      'IP56 rated outdoor outlet',
      'Safety switch protected',
      'UV-resistant faceplate',
    ],
    category: 'powerpoints',
    priceType: 'range',
    priceMin: 280,
    priceMax: 420,
    unit: 'per point',
    duration: 3,
    materialsDepositPct: 0.35,
  },

  // LIGHTING
  {
    id: 'downlight-install',
    name: 'LED Downlight Installation',
    description: 'Supply and install LED downlights. Dimmable options available.',
    details: [
      'Dimmable LED downlights',
      'Fire rated options for residential',
      'Wiring and fitting included',
    ],
    category: 'lighting',
    priceType: 'range',
    priceMin: 120,
    priceMax: 200,
    unit: 'per light',
    duration: 2,
    materialsDepositPct: 0.4,
    popular: true,
  },
  {
    id: 'ceiling-fan',
    name: 'Ceiling Fan with Light Installation',
    description: 'Install a ceiling fan with integrated light. Wiring, mounting and testing included.',
    details: [
      'Full wiring from switch to fan',
      'Remote control or wall switch',
      'Balancing and commissioning',
    ],
    category: 'lighting',
    priceType: 'range',
    priceMin: 280,
    priceMax: 450,
    unit: 'per fan',
    duration: 3,
    materialsDepositPct: 0.3,
  },
  {
    id: 'outdoor-lighting',
    name: 'Outdoor / Security Lighting',
    description: 'Motion sensor lights, sensor floodlights and outdoor decorative lighting.',
    details: [
      'Motion sensor options available',
      'LED floodlights or feature lights',
      'Timer and sensor programming',
    ],
    category: 'lighting',
    priceType: 'range',
    priceMin: 220,
    priceMax: 480,
    unit: 'per fitting',
    duration: 3,
    materialsDepositPct: 0.35,
  },

  // SAFETY
  {
    id: 'smoke-alarm',
    name: 'Smoke Alarm Installation',
    description: 'Hardwired, interconnected smoke alarm installation to meet ACT regulations.',
    details: [
      'Photoelectric smoke alarms',
      'Hardwired with battery backup',
      'Interconnected (optional)',
      'Compliant with AS 3786',
    ],
    category: 'safety',
    priceType: 'range',
    priceMin: 200,
    priceMax: 380,
    unit: 'per alarm',
    duration: 2,
    materialsDepositPct: 0.4,
    popular: true,
  },
  {
    id: 'safety-switch',
    name: 'Safety Switch / RCD Installation',
    description: 'Install or replace a residual current device (safety switch) in your switchboard.',
    details: [
      'Type I, II or combined RCD/MCB',
      'Protects circuits from electric shock',
      'AS/NZS 3000 compliant',
    ],
    category: 'safety',
    priceType: 'range',
    priceMin: 280,
    priceMax: 480,
    unit: 'per RCD',
    duration: 2,
    materialsDepositPct: 0.3,
  },
  {
    id: 'surge-protection',
    name: 'Whole-Home Surge Protection',
    description: 'Protect appliances and electronics from power surges with a whole-home SPD.',
    details: [
      'Type 1 + Type 2 SPD',
      'Installed at main switchboard',
      'Protects all circuits',
    ],
    category: 'safety',
    priceType: 'range',
    priceMin: 380,
    priceMax: 650,
    unit: 'installed',
    duration: 2,
    materialsDepositPct: 0.4,
  },

  // SWITCHBOARD
  {
    id: 'switchboard-upgrade',
    name: 'Switchboard Upgrade',
    description: 'Full switchboard upgrade to modern circuit breakers, safety switches and metering.',
    details: [
      'Remove old fuse-wire board',
      'Install modern MCBs and RCDs',
      'Energex/Evoenergy approved',
      'Certificate of Compliance issued',
    ],
    category: 'switchboard',
    priceType: 'range',
    priceMin: 1800,
    priceMax: 4200,
    unit: 'per job',
    duration: 8,
    materialsDepositPct: 0.4,
    popular: true,
  },
  {
    id: 'circuit-addition',
    name: 'New Circuit Installation',
    description: 'Add a new dedicated circuit from your switchboard — ideal for A/C units, ovens or workshops.',
    details: [
      'Dedicated circuit from board',
      'Correct cable sizing',
      'RCD protection included',
    ],
    category: 'switchboard',
    priceType: 'range',
    priceMin: 350,
    priceMax: 700,
    unit: 'per circuit',
    duration: 3,
    materialsDepositPct: 0.35,
  },

  // EV CHARGING
  {
    id: 'ev-charger',
    name: 'EV Home Charger Installation',
    description: 'Install a Level 2 EV charger (7kW or 11kW) at home. Compatible with all major EVs.',
    details: [
      '7kW or 11kW charging station',
      'Dedicated 32A circuit',
      'Load management available',
      'All brands supported',
    ],
    category: 'ev-charging',
    priceType: 'range',
    priceMin: 900,
    priceMax: 2200,
    unit: 'installed',
    duration: 4,
    materialsDepositPct: 0.4,
    popular: true,
  },
  {
    id: 'ev-load-management',
    name: 'EV Load Management Setup',
    description: 'Smart load management so your EV charger won\'t trip the house supply.',
    details: [
      'CT clamp energy monitoring',
      'Dynamic load balancing',
      'Solar integration option',
    ],
    category: 'ev-charging',
    priceType: 'range',
    priceMin: 350,
    priceMax: 650,
    unit: 'per job',
    duration: 3,
    materialsDepositPct: 0.3,
  },

  // SOLAR
  {
    id: 'solar-ready',
    name: 'Solar Ready Wiring',
    description: 'Pre-wire your home for future solar panel installation, including isolators and metering.',
    details: [
      'Roof cable conduit run',
      'Inverter mounting location',
      'Metering and isolation gear',
    ],
    category: 'solar',
    priceType: 'range',
    priceMin: 600,
    priceMax: 1500,
    unit: 'per job',
    duration: 4,
    materialsDepositPct: 0.4,
  },
  {
    id: 'battery-wiring',
    name: 'Battery Storage Wiring',
    description: 'Electrical wiring and installation for home battery storage systems (Tesla Powerwall, SolarEdge etc).',
    details: [
      'AC or DC coupled battery systems',
      'Switchboard integration',
      'Grid metering configuration',
    ],
    category: 'solar',
    priceType: 'range',
    priceMin: 800,
    priceMax: 2200,
    unit: 'per job',
    duration: 6,
    materialsDepositPct: 0.4,
  },

  // DATA & COMMUNICATIONS
  {
    id: 'data-point',
    name: 'Data / Network Point Installation',
    description: 'Cat6 network point installation — hardwired is always faster and more reliable than WiFi.',
    details: [
      'Cat6 cabling',
      'Patch panel or direct run',
      'Tested to standard',
    ],
    category: 'data',
    priceType: 'range',
    priceMin: 150,
    priceMax: 280,
    unit: 'per point',
    duration: 2,
    materialsDepositPct: 0.3,
  },
  {
    id: 'tv-antenna',
    name: 'TV Antenna Point',
    description: 'Install a new TV antenna outlet point in any room.',
    details: [
      'Coax cable installation',
      'Splitter if needed',
      'Signal tested',
    ],
    category: 'data',
    priceType: 'range',
    priceMin: 150,
    priceMax: 280,
    unit: 'per point',
    duration: 2,
    materialsDepositPct: 0.25,
  },

  // GENERAL
  {
    id: 'hourly-rate',
    name: 'General Electrical Work (Hourly)',
    description: 'General electrical repairs, fault finding, and miscellaneous work. Charged per hour.',
    details: [
      'Fault finding and diagnosis',
      'General repairs',
      'Appliance connection',
      'Minimum 2-hour booking',
    ],
    category: 'general',
    priceType: 'hourly',
    priceMin: 145,
    unit: 'per hour',
    duration: 2,
    materialsDepositPct: 0.0,
  },

  // EMERGENCY
  {
    id: 'emergency-callout',
    name: 'Emergency After-Hours Callout',
    description: '24/7 emergency electrical response for Canberra/ACT. Call-out fee plus hourly rate.',
    details: [
      '$260 call-out fee',
      '$195/hr after hours rate',
      'Available 24/7',
      'ACT-wide coverage',
    ],
    category: 'emergency',
    priceType: 'range',
    priceMin: 260,
    priceMax: 800,
    unit: 'call-out + hourly',
    duration: 2,
    materialsDepositPct: 0.0,
    emergency: true,
  },
];

export const SERVICE_CATEGORIES: { id: ServiceCategory; label: string; icon: string }[] = [
  { id: 'general', label: 'General Electrical', icon: 'Wrench' },
  { id: 'powerpoints', label: 'Powerpoints', icon: 'Plug' },
  { id: 'lighting', label: 'Lighting', icon: 'Lightbulb' },
  { id: 'safety', label: 'Safety Devices', icon: 'ShieldCheck' },
  { id: 'switchboard', label: 'Switchboard', icon: 'CircuitBoard' },
  { id: 'ev-charging', label: 'EV Charging', icon: 'Zap' },
  { id: 'solar', label: 'Solar & Battery', icon: 'Sun' },
  { id: 'data', label: 'Data & Comms', icon: 'Network' },
  { id: 'emergency', label: 'Emergency', icon: 'AlertTriangle' },
];

export const ACT_SUBURBS = [
  'Belconnen', 'Bruce', 'Charnwood', 'Florey', 'Fraser', 'Hawker', 'Macquarie',
  'Dunlop', 'Page', 'Scullin',
  'Gungahlin', 'Amaroo', 'Casey', 'Forde', 'Harrison', 'Ngunnawal', 'Nicholls',
  'Palmerston', 'Taylor', 'Wells Station',
  'Tuggeranong', 'Calwell', 'Chisholm', 'Fadden', 'Greenway', 'Gordon', 'Kambah',
  'Macarthur', 'Monash', 'Theodore',
  'Woden', 'Curtin', 'Garran', 'Hughes', 'Lyons', 'Pearce', 'Phillip',
  'Inner North', 'Ainslie', 'Braddon', 'Campbell', 'Dickson', 'Downer',
  'Hackett', 'O\'Connor', 'Reid', 'Turner', 'Watson',
  'Inner South', 'Barton', 'Deakin', 'Forrest', 'Griffith', 'Kingston',
  'Manuka', 'Narrabundah', 'Red Hill', 'Symonston',
  'Molonglo', 'Denman Prospect', 'Coombs', 'Whitlam',
  'Fyshwick', 'Hume', 'Pialligo',
  'Queanbeyan', 'Jerrabomberra',
];

export const BUSINESS_INFO = {
  name: 'DeluxePower Electrical',
  abn: 'XX XXX XXX XXX',
  license: 'ACT Electrical Contractor Licence #EC XXXXX',
  phone: '(02) 6100 XXXX',
  email: 'bookings@deluxepower.org',
  address: 'Canberra, ACT 2600',
  hours: {
    weekday: '7:00 AM – 5:30 PM',
    saturday: '8:00 AM – 2:00 PM',
    emergency: '24/7',
  },
  serviceArea: 'All of ACT and surrounding NSW including Queanbeyan',
};

export function getServiceById(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}

export function getServicesByCategory(category: ServiceCategory): Service[] {
  return SERVICES.filter((s) => s.category === category);
}

export function formatPrice(service: Service): string {
  if (service.priceType === 'hourly') {
    return `$${service.priceMin}/hr`;
  }
  if (service.priceType === 'fixed') {
    return `$${service.priceMin}`;
  }
  return `$${service.priceMin} – $${service.priceMax}`;
}
