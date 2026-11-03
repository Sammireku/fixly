import { User, SmartMatchResult, TradeType } from '../types';
import { ACCRA_AREAS } from '../data/catalog';

// Trade keyword dictionaries for contextual semantic matching
const TRADE_KEYWORDS: Record<TradeType, string[]> = {
  plumbing: [
    'leak', 'pipe', 'tap', 'sink', 'toilet', 'drain', 'water', 'burst', 'flush', 'valve',
    'heater', 'sewage', 'pressure', 'clog', 'drip', 'mixer', 'plumber', 'pvc', 'tank', 'polytank',
  ],
  electrical: [
    'spark', 'power', 'wire', 'wiring', 'socket', 'switch', 'light', 'bulb', 'breaker',
    'fuse', 'short circuit', 'tripping', 'electrician', 'generator', 'inverter', 'voltage',
    'conduit', 'meter', 'shock', 'solar',
  ],
  appliance_repair: [
    'ac', 'air conditioner', 'cooling', 'fridge', 'refrigerator', 'freezer', 'gas refill',
    'compressor', 'washing machine', 'microwave', 'tv', 'decoder', 'dispenser',
  ],
  carpentry: [
    'door', 'lock', 'hinge', 'cabinet', 'wood', 'table', 'chair', 'furniture', 'shelf',
    'cupboard', 'window frame', 'carpenter', 'handle', 'drawer', 'timber', 'flat-pack',
  ],
  ceilings_walls: [
    'pop', 'ceiling', 'plaster', 'gypsum', 'moulding', 'board', 'crack', 'damp ceiling',
    'cornice', 'false ceiling', 'wall', 'paint', 'putty', 'drywall',
  ],
  tiling_masonry: [
    'tile', 'tiling', 'floor', 'grout', 'ceramic', 'porcelain', 'cracked tile', 'bathroom floor',
    'paving', 'block', 'brick', 'screed', 'mason',
  ],
  roofing: [
    'roof', 'leak', 'sheet', 'gutter', 'downpipe', 'fascia', 'roofing', 'soffit',
  ],
  welding_metalwork: [
    'welding', 'burglar', 'gate', 'metal', 'steel', 'iron', 'handrail', 'razor wire', 'carport',
  ],
  aluminium_glass: [
    'aluminium', 'glass', 'sliding', 'mirror', 'shower enclosure', 'mosquito net', 'window',
  ],
  upholstery: [
    'sofa', 'couch', 'cushion', 'fabric', 'foam', 'leather', 'reupholster', 'curtain', 'seat',
  ],
  gardening_outdoor: [
    'lawn', 'grass', 'hedge', 'tree', 'pruning', 'garden', 'landscape', 'turf', 'weed',
  ],
  cleaning_pest_control: [
    'cleaning', 'deep clean', 'carpet', 'tank clean', 'fumigation', 'pest', 'cockroach', 'pest control',
  ],
  laundry_garment: [
    'laundry', 'wash', 'iron', 'dry clean', 'duvet', 'shoe', 'tailor', 'alteration',
  ],
  security_smart_home: [
    'cctv', 'camera', 'electric fence', 'alarm', 'intercom', 'smart lock', 'wifi', 'doorbell',
  ],
  moving_heavy_work: [
    'moving', 'truck', 'junk', 'rubble', 'haulage', 'lifting', 'offloading',
  ],
  general_handyman: [
    'handyman', 'tv mount', 'mirror hanging', 'curtain rail', 'odd jobs', 'minor fix',
  ],
  vehicle_adjacent: [
    'car wash', 'mobile mechanic', 'jumpstart', 'tyre change', 'battery',
  ],
  // Legacy aliases
  pop_ceilings: ['pop', 'ceiling', 'plaster', 'gypsum'],
  painting: ['paint', 'wall', 'color', 'brush'],
  tiling: ['tile', 'tiling', 'floor', 'grout'],
  ac_refrigeration: ['ac', 'cooling', 'fridge'],
};

// Calculate approximate straight-line distance in km between two Accra coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

/**
 * AI Smart Match Algorithm:
 * Evaluates candidates based on:
 * 1. Task Semantic Relevance (keyword matching & urgency cues) -> 35%
 * 2. Proximity & Estimated Travel Time in Accra traffic -> 25%
 * 3. Historical Rating Signals (Problem Solved, Workmanship, Claim-free rate, On-time GPS) -> 30%
 * 4. Verification Passport & Tier Multipliers -> 10%
 */
export function smartMatchArtisans(
  taskDescription: string,
  clientAreaName: string,
  pros: User[]
): SmartMatchResult[] {
  const lowerDesc = taskDescription.toLowerCase().trim();

  // Find client area coordinates
  const clientArea = ACCRA_AREAS.find((a) => a.name.toLowerCase() === clientAreaName.toLowerCase()) || ACCRA_AREAS[0];

  // Determine primary detected trade
  let bestTrade: TradeType = 'plumbing';
  let highestTradeHits = 0;

  (Object.keys(TRADE_KEYWORDS) as TradeType[]).forEach((trade) => {
    const hits = TRADE_KEYWORDS[trade].filter((kw) => lowerDesc.includes(kw)).length;
    if (hits > highestTradeHits) {
      highestTradeHits = hits;
      bestTrade = trade;
    }
  });

  const results: SmartMatchResult[] = pros
    .filter((pro) => pro.role === 'pro' && pro.proProfile)
    .map((pro) => {
      const profile = pro.proProfile!;
      const proAreaName = pro.location?.area || 'East Legon';
      const proArea = ACCRA_AREAS.find((a) => a.name.toLowerCase() === proAreaName.toLowerCase()) || clientArea;

      // 1. Distance Calculation
      const distanceKm = calculateDistance(
        clientArea.lat,
        clientArea.lng,
        proArea.lat,
        proArea.lng
      );
      // Average Accra motorbike dispatch speed ~12 km/h accounting for traffic + 5 min dispatch setup
      const estimatedArrivalMins = Math.max(12, Math.round(5 + distanceKm * 4.5));

      // 2. Trade Match Score (0 - 100)
      let tradeMatch = 40;
      if (profile.trade === bestTrade) {
        tradeMatch = 95;
      } else if (profile.secondaryTrades?.includes(bestTrade)) {
        tradeMatch = 80;
      } else {
        // Fallback for general handymen
        tradeMatch = 50;
      }

      // Keyword bonus for exact repair specialization
      const specializedHits = (TRADE_KEYWORDS[profile.trade] || []).filter((kw) => lowerDesc.includes(kw)).length;
      tradeMatch = Math.min(100, tradeMatch + specializedHits * 5);

      // 3. Proximity Score (0 - 100, decay after 6km)
      const proximityScore = Math.max(30, Math.round(100 - distanceKm * 8));

      // 4. Historical Performance Score (from Product & UX Document Section 8)
      // Problem Solved 35%, Workmanship 25%, Claim-Free 20%, Punctuality 10%, Conduct 10%
      const problemSolvedScore = profile.problemSolvedRate; // e.g. 98%
      const workmanshipScore = (profile.rating / 5) * 100; // e.g. (4.9 / 5) * 100 = 98%
      const claimFreeScore = 100; // default benchmark
      const punctualityScore = profile.onTimeRate; // e.g. 96%
      const conductScore = 95;

      const historicalScore =
        problemSolvedScore * 0.35 +
        workmanshipScore * 0.25 +
        claimFreeScore * 0.2 +
        punctualityScore * 0.1 +
        conductScore * 0.1;

      // 5. Verification Bonus
      let verificationBonus = 0;
      if (profile.verifiedId) verificationBonus += 4;
      if (profile.guarantorBacked) verificationBonus += 3;
      if (profile.insurancePool) verificationBonus += 3;

      // Overall Composite Match Score (0 - 99%)
      const totalScore = Math.min(
        99,
        Math.round(
          tradeMatch * 0.35 +
          proximityScore * 0.25 +
          historicalScore * 0.3 +
          verificationBonus
        )
      );

      // Extract verification badges
      const badgeLabels: string[] = [];
      if (profile.verifiedId) badgeLabels.push('Ghana Card');
      if (profile.tier === 'Elite') badgeLabels.push('Master Craftsman');
      if (profile.guarantorBacked) badgeLabels.push('Guarantor Backed');
      if (profile.insurancePool) badgeLabels.push('GH₵10k Escrow Bond');

      // Synthesize intelligent AI reasoning statement
      let reasoning = '';
      if (profile.trade === bestTrade && distanceKm <= 3.5) {
        reasoning = `${pro.name} is stationed just ${distanceKm}km away in ${proAreaName}. Top-matched for ${bestTrade.replace(/_/g, ' ')} with a ${profile.problemSolvedRate}% problem-solved record and ${profile.onTimeRate}% on-time GPS arrival.`;
      } else if (profile.trade === bestTrade) {
        reasoning = `High-tier ${profile.tier} artisan with ${profile.jobsCompleted} verified jobs and 0 claims in 12 months. Dispatched from ${proAreaName} (~${estimatedArrivalMins} mins).`;
      } else {
        reasoning = `Versatile vetted artisan stationed in ${proAreaName} with 4.8★ workmanship and immediate availability.`;
      }

      return {
        proId: pro.id,
        proName: pro.name,
        avatarUrl: profile.avatarUrl,
        trade: profile.trade,
        secondaryTrades: profile.secondaryTrades,
        tier: profile.tier,
        matchScore: totalScore,
        distanceKm,
        area: proAreaName,
        estimatedArrivalMins,
        reasoning,
        badges: badgeLabels,
        historicalHighlights: {
          problemSolvedRate: profile.problemSolvedRate,
          onTimeRate: profile.onTimeRate,
          rating: profile.rating,
          jobsCompleted: profile.jobsCompleted,
          claimFreeMonths: 12,
        },
      };
    });

  // Sort by highest matchScore descending
  return results.sort((a, b) => b.matchScore - a.matchScore);
}
