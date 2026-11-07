export interface ProPortfolioProject {
  id: string;
  proId?: string;
  category: string;
  title: string;
  clientArea: string;
  dateCompleted: string;
  description: string;
  imageUrl: string;
  beforeImageUrl?: string;
  scopeItems: string[];
  costGhs: number;
  durationHours: number;
  verifiedByOps: boolean;
  clientName: string;
  rating: number;
}

export const PORTFOLIO_PROJECTS: ProPortfolioProject[] = [
  // Plumbing Projects
  {
    id: 'port-plumb-1',
    proId: 'ava-patel',
    category: 'Plumbing',
    title: 'Dual Polytank Installation & Automatic Booster Pump',
    clientArea: 'East Legon (Bawaleshie), Accra',
    dateCompleted: 'October 2026',
    description:
      'Installed two 2,500L overhead water storage tanks on a reinforced concrete plinth with automatic float valves, inline filtration, and 1HP Pedrollo pressure booster pump.',
    imageUrl:
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    beforeImageUrl:
      'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80',
    scopeItems: ['PPR & Brass pipe fusion', 'Pressure testing at 6 bar', 'Bypass line for GWCL mains'],
    costGhs: 1450,
    durationHours: 6,
    verifiedByOps: true,
    clientName: 'Nana Osei Tutu',
    rating: 5,
  },
  {
    id: 'port-plumb-2',
    proId: 'kwame-mensah',
    category: 'Plumbing',
    title: 'Luxury Bathroom Concealed Shower & Mixer Re-pipe',
    clientArea: 'Trassaco Valley, Accra',
    dateCompleted: 'October 2026',
    description:
      'Complete bathroom plumbing renovation. Chipped and replaced compromised galvanized iron lines with multi-layer PEX piping, installed concealed thermostatic rain shower and vanity basin.',
    imageUrl:
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    scopeItems: ['PEX concealed lines', 'Anti-scald thermostatic valve', 'Full 24-hr pressure hold'],
    costGhs: 2200,
    durationHours: 8,
    verifiedByOps: true,
    clientName: 'Archbishop Samuel Boateng',
    rating: 5,
  },
  {
    id: 'port-plumb-3',
    proId: 'ava-patel',
    category: 'Plumbing',
    title: 'Ariston 50L Water Heater & PEX Piping System',
    clientArea: 'Cantonments, Accra',
    dateCompleted: 'September 2026',
    description:
      'Fitted heavy-duty electric water heater with safety relief valve, independent power isolation switch, and flexible stainless steel braided connections.',
    imageUrl:
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    scopeItems: ['Temperature calibration (60°C)', 'Thermal relief drain routing', 'Bonded earthing check'],
    costGhs: 680,
    durationHours: 3.5,
    verifiedByOps: true,
    clientName: 'Priscilla Darko',
    rating: 5,
  },

  // Electrical Projects
  {
    id: 'port-elec-1',
    proId: 'jordan-diaz',
    category: 'Electrical',
    title: '3-Phase Distribution Board & Surge Protector Upgrade',
    clientArea: 'Airport Residential Area, Accra',
    dateCompleted: 'October 2026',
    description:
      'Upgraded burnt distribution board to a modern 16-way Hager enclosure with Type 2 surge protection, RCBOs for all air-conditioning circuits, and phase load-balancing.',
    imageUrl:
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    scopeItems: ['Phase balance audit', '10kA breaking capacity breakers', 'Legrand lightning arrestor'],
    costGhs: 1850,
    durationHours: 5,
    verifiedByOps: true,
    clientName: 'Capt. Gerald Mensah',
    rating: 5,
  },
  {
    id: 'port-elec-2',
    proId: 'jordan-diaz',
    category: 'Electrical',
    title: 'Compound Security Floodlights & Automatic Generator Switch',
    clientArea: 'Osu (Danquah Circle), Accra',
    dateCompleted: 'September 2026',
    description:
      'Installed 6 commercial-grade 100W IP66 LED compound floodlights with twilight photocell sensors and 63A manual changeover switch for home backup generator.',
    imageUrl:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    scopeItems: ['Armoured underground cabling', 'Heavy waterproof junction boxes', 'Generator test run'],
    costGhs: 1200,
    durationHours: 4,
    verifiedByOps: true,
    clientName: 'Afia Mansa',
    rating: 4.9,
  },

  // Carpentry & Woodwork / Handyman Projects
  {
    id: 'port-carp-1',
    proId: 'marcus-kim',
    category: 'Carpentry',
    title: 'Floor-to-Ceiling Mahogany Wardrobe & Soft-Close Drawers',
    clientArea: 'East Legon, Accra',
    dateCompleted: 'October 2026',
    description:
      'Custom crafted and installed high-grade marine plywood and mahogany veneer wardrobe system with Blum soft-close hinges, internal LED sensor strips, and tie rack.',
    imageUrl:
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    scopeItems: ['Laser-aligned level mounting', 'Anti-termite treated base', 'High gloss polyurethane finish'],
    costGhs: 3400,
    durationHours: 12,
    verifiedByOps: true,
    clientName: 'Dr. Kwesi Appiah',
    rating: 5,
  },
  {
    id: 'port-carp-2',
    proId: 'marcus-kim',
    category: 'Handyman',
    title: 'Floating TV Media Console & Concealed Cable Conduit',
    clientArea: 'Cantonments, Accra',
    dateCompleted: 'October 2026',
    description:
      'Fabricated and mounted acoustic slat wall paneling with a floating console, concealed 4K HDMI conduits into concrete wall, and integrated multi-socket surge bar.',
    imageUrl:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    scopeItems: ['Ultra-heavy wall toggles', 'Concealed power chase', 'Natural teak wood stain'],
    costGhs: 1100,
    durationHours: 4.5,
    verifiedByOps: true,
    clientName: 'Kofi Twumasi',
    rating: 5,
  },
  {
    id: 'port-handy-1',
    proId: 'marcus-kim',
    category: 'Handyman',
    title: 'Security Door Alignment & Multi-Point Deadbolt Fitting',
    clientArea: 'Airport Residential Area, Accra',
    dateCompleted: 'September 2026',
    description:
      'Repaired sagging heavy steel-reinforced front entry door, replaced worn ball-bearing hinges, and fitted Yale high-security British Standard mortice deadbolt.',
    imageUrl:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    scopeItems: ['Heavy steel shimming', 'Pick-resistant cylinder', 'Smooth latch action test'],
    costGhs: 420,
    durationHours: 2.5,
    verifiedByOps: true,
    clientName: 'Evelyn Addo-Kufuor',
    rating: 5,
  },
];

export function getPortfolioForPro(proId: string, proCategory: string): ProPortfolioProject[] {
  const matches = PORTFOLIO_PROJECTS.filter(
    (p) =>
      p.proId === proId ||
      p.category.toLowerCase().includes(proCategory.toLowerCase()) ||
      proCategory.toLowerCase().includes(p.category.toLowerCase())
  );

  if (matches.length > 0) {
    return matches;
  }

  // Fallback to all portfolio projects
  return PORTFOLIO_PROJECTS;
}
