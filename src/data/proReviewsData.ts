export interface ProCustomerReview {
  id: string;
  clientName: string;
  clientArea: string;
  rating: number;
  dateStr: string;
  serviceCompleted: string;
  comment: string;
  isGhanaCardVerifiedClient: boolean;
}

export const REVIEWS_BY_PRO_ID: Record<string, ProCustomerReview[]> = {
  'marcus-kim': [
    {
      id: 'rev-mk-1',
      clientName: 'Dr. Kwesi Appiah',
      clientArea: 'East Legon (GA-492-3841)',
      rating: 5,
      dateStr: '2 days ago',
      serviceCompleted: 'Cabinet & Door Lock Fitting',
      comment:
        'Marcus arrived right on time with full professional carpentry gear. Fitted 3 security locks and re-aligned our heavy mahogany front door. Very neat, swept up shavings, and escrow release was seamless!',
      isGhanaCardVerifiedClient: true,
    },
    {
      id: 'rev-mk-2',
      clientName: 'Evelyn Addo-Kufuor',
      clientArea: 'Airport Residential Area',
      rating: 5,
      dateStr: '5 days ago',
      serviceCompleted: 'Curtain Rails & Wall Mounting',
      comment:
        'Mounted our 75-inch smart TV and installed double curtain tracks in two bedrooms. Used laser level, verified all brackets were solid into concrete. Highly recommended for neat home setups.',
      isGhanaCardVerifiedClient: true,
    },
    {
      id: 'rev-mk-3',
      clientName: 'Kofi Twumasi',
      clientArea: 'Cantonments, Accra',
      rating: 4.9,
      dateStr: 'Oct 29, 2026',
      serviceCompleted: 'Flat-pack Wardrobe Assembly',
      comment:
        'Assembled a complex 4-door wardrobe in 2.5 hours without any scratches. Very courteous and showed his Ghana Card credential upon arrival.',
      isGhanaCardVerifiedClient: true,
    },
  ],
  'ava-patel': [
    {
      id: 'rev-ap-1',
      clientName: 'Nana Osei Tutu',
      clientArea: 'East Legon (Bawaleshie)',
      rating: 5,
      dateStr: 'Yesterday',
      serviceCompleted: 'Burst Sink Pipe & Mixer Tap',
      comment:
        'Burst water pipe under our kitchen sink had flooded the room. Ava arrived in 25 minutes, isolated the main stopcock, replaced the flexi pipes with heavy brass fittings, and tested pressure thoroughly.',
      isGhanaCardVerifiedClient: true,
    },
    {
      id: 'rev-ap-2',
      clientName: 'Priscilla Darko',
      clientArea: 'Dzorwulu, Accra',
      rating: 5,
      dateStr: '3 days ago',
      serviceCompleted: 'Water Heater Installation',
      comment:
        'Superb plumbing technician. Installed an Ariston 30L water heater with power isolation safety valves. Zero leaks and clean electrical bonding.',
      isGhanaCardVerifiedClient: true,
    },
    {
      id: 'rev-ap-3',
      clientName: 'Emmanuel Ansah',
      clientArea: 'Spintex Road (Kotobabi)',
      rating: 4.8,
      dateStr: 'Oct 26, 2026',
      serviceCompleted: 'Polytank Float Valve Replacement',
      comment:
        'Sorted our overhead water storage overflow issue immediately. Replaced faulty brass float valve and calibrated automatic booster pump.',
      isGhanaCardVerifiedClient: true,
    },
  ],
  'jordan-diaz': [
    {
      id: 'rev-jd-1',
      clientName: 'Afia Mansa',
      clientArea: 'Osu (Oxford Street)',
      rating: 5,
      dateStr: '1 day ago',
      serviceCompleted: 'Tripping Breaker & Meter Box Work',
      comment:
        'Our circuit breakers were constantly tripping whenever the AC and fridge turned on. Jordan traced an earthing fault within 30 minutes, re-balanced the load across phases, and issued a safety report.',
      isGhanaCardVerifiedClient: true,
    },
    {
      id: 'rev-jd-2',
      clientName: 'Capt. Gerald Mensah',
      clientArea: 'Labone, Accra',
      rating: 4.9,
      dateStr: '4 days ago',
      serviceCompleted: 'Inverter & Generator Changeover',
      comment:
        'Master electrician who knows Ghanaian wiring inside and out. Installed an automatic changeover switch for our 7.5kVA generator with clean cabling.',
      isGhanaCardVerifiedClient: true,
    },
    {
      id: 'rev-jd-3',
      clientName: 'Naa Amerley Tagoe',
      clientArea: 'Ridge Residential',
      rating: 4.8,
      dateStr: 'Oct 27, 2026',
      serviceCompleted: 'Security Floodlights & Sockets',
      comment:
        'Replaced 4 compound LED floodlights and installed IP66 weatherproof outdoor sockets. Very professional and polite technician.',
      isGhanaCardVerifiedClient: true,
    },
  ],
  'kwame-mensah': [
    {
      id: 'rev-km-1',
      clientName: 'Archbishop Samuel Boateng',
      clientArea: 'Trassaco Valley',
      rating: 5,
      dateStr: 'Today',
      serviceCompleted: 'Full Bathroom Plumbing Fit-out',
      comment:
        'Kwame is an absolute master plumber with over 14 years experience. Replaced concealed PEX pipes, installed thermostatic shower mixer, and verified pressure across all faucets. Flawless workmanship.',
      isGhanaCardVerifiedClient: true,
    },
    {
      id: 'rev-km-2',
      clientName: 'Mavis Gyasi',
      clientArea: 'Cantonments, Accra',
      rating: 5,
      dateStr: '3 days ago',
      serviceCompleted: 'Overhead Polytank & Booster Pump',
      comment:
        'Installed 2,500L Polytank and Pedrollo booster pump on concrete plinth. Very transparent on material quotes and released milestones smoothly through Fixly Escrow.',
      isGhanaCardVerifiedClient: true,
    },
    {
      id: 'rev-km-3',
      clientName: 'Kwabena Agyepong',
      clientArea: 'East Legon Hills',
      rating: 4.9,
      dateStr: 'Oct 24, 2026',
      serviceCompleted: 'Blocked Drain & Soakaway Inspection',
      comment:
        'Cleared chronic kitchen grease blockage using mechanical drain snake. Gave practical preventative maintenance advice. Top Ghanaian artisan!',
      isGhanaCardVerifiedClient: true,
    },
  ],
};

export function getReviewsForPro(proId: string, proName: string, proCategory: string): ProCustomerReview[] {
  if (REVIEWS_BY_PRO_ID[proId]) {
    return REVIEWS_BY_PRO_ID[proId];
  }

  // Fallback realistic reviews based on pro category and name
  return [
    {
      id: `rev-${proId}-1`,
      clientName: 'Nana Osei Tutu',
      clientArea: 'East Legon (GA-492-3841)',
      rating: 5,
      dateStr: '2 days ago',
      serviceCompleted: `${proCategory} Diagnostic & Repair`,
      comment: `${proName} arrived quickly, presented his Ghana Card for verification, and completed the job with great precision. The 40/40/20 escrow gave us total confidence!`,
      isGhanaCardVerifiedClient: true,
    },
    {
      id: `rev-${proId}-2`,
      clientName: 'Abena Mansa',
      clientArea: 'Cantonments, Accra',
      rating: 5,
      dateStr: '5 days ago',
      serviceCompleted: `${proCategory} Maintenance & Installation`,
      comment: `Polite, tidy, and highly skilled master artisan. Tested everything thoroughly before asking for escrow release. We will definitely re-book!`,
      isGhanaCardVerifiedClient: true,
    },
    {
      id: `rev-${proId}-3`,
      clientName: 'Kofi Twumasi',
      clientArea: 'Airport Residential Area',
      rating: 4.9,
      dateStr: 'Oct 28, 2026',
      serviceCompleted: `Emergency ${proCategory} Service`,
      comment: `Fast response on site, brought genuine replacement parts with clear receipts, and backed the work with Fixly 24-hr guarantee.`,
      isGhanaCardVerifiedClient: true,
    },
  ];
}
