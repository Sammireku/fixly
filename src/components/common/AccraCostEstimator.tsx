import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ACCRA_AREAS, SERVICE_CATALOG } from '../../data/catalog';
import { CatalogServiceItem, TradeType } from '../../types';
import { formatCurrency } from '../../lib/currency';
import {
  Calculator,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Info,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface AccraCostEstimatorProps {
  initialServiceId?: string;
  initialAreaName?: string;
  onSelectAndBook?: (service: CatalogServiceItem) => void;
  compact?: boolean;
}

interface MarketPriceBenchmark {
  trade: TradeType;
  title: string;
  baseLaborMin: number;
  baseLaborMax: number;
  typicalPartsMin: number;
  typicalPartsMax: number;
  diagnosticFee: number;
  typicalDuration: string;
}

const ACCRA_BENCHMARKS: Record<string, MarketPriceBenchmark> = {
  'plumb-pipe-leak': {
    trade: 'plumbing',
    title: 'Burst / Leaking Pipe Repair',
    baseLaborMin: 70,
    baseLaborMax: 130,
    typicalPartsMin: 30,
    typicalPartsMax: 70,
    diagnosticFee: 30,
    typicalDuration: '45-90 mins',
  },
  'plumb-drain-unclog': {
    trade: 'plumbing',
    title: 'Drain & Toilet Unclogging',
    baseLaborMin: 90,
    baseLaborMax: 160,
    typicalPartsMin: 20,
    typicalPartsMax: 50,
    diagnosticFee: 30,
    typicalDuration: '60 mins',
  },
  'elec-breaker-trip': {
    trade: 'electrical',
    title: 'Main Breaker Tripping & Load Test',
    baseLaborMin: 80,
    baseLaborMax: 150,
    typicalPartsMin: 40,
    typicalPartsMax: 90,
    diagnosticFee: 40,
    typicalDuration: '45-60 mins',
  },
  'elec-generator-changeover': {
    trade: 'electrical',
    title: 'Generator Changeover Switch Fault',
    baseLaborMin: 180,
    baseLaborMax: 320,
    typicalPartsMin: 100,
    typicalPartsMax: 250,
    diagnosticFee: 50,
    typicalDuration: '2-3 hours',
  },
  'proj-pop-ceiling': {
    trade: 'pop_ceilings',
    title: 'POP False Ceiling & Spotlights',
    baseLaborMin: 1200,
    baseLaborMax: 2200,
    typicalPartsMin: 900,
    typicalPartsMax: 1800,
    diagnosticFee: 60,
    typicalDuration: '2-4 days',
  },
  'proj-painting-interior': {
    trade: 'painting',
    title: 'Full Apartment Interior Painting',
    baseLaborMin: 900,
    baseLaborMax: 1700,
    typicalPartsMin: 700,
    typicalPartsMax: 1400,
    diagnosticFee: 50,
    typicalDuration: '2-3 days',
  },
  'proj-tiling-floor': {
    trade: 'tiling',
    title: 'Porcelain Floor & Wall Tiling',
    baseLaborMin: 1400,
    baseLaborMax: 2500,
    typicalPartsMin: 1100,
    typicalPartsMax: 2200,
    diagnosticFee: 60,
    typicalDuration: '3-5 days',
  },
  'proj-upholstery-sofa': {
    trade: 'upholstery',
    title: 'Living Room Sofa Reupholstery',
    baseLaborMin: 700,
    baseLaborMax: 1300,
    typicalPartsMin: 600,
    typicalPartsMax: 1100,
    diagnosticFee: 40,
    typicalDuration: '3-4 days',
  },
};

export const AccraCostEstimator: React.FC<AccraCostEstimatorProps> = ({
  initialServiceId,
  initialAreaName,
  onSelectAndBook,
  compact = false,
}) => {
  const { language } = useLanguage();
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || SERVICE_CATALOG[0]?.id || 'plumb-pipe-leak'
  );
  const [selectedAreaName, setSelectedAreaName] = useState<string>(
    initialAreaName || ACCRA_AREAS[0]?.name || 'East Legon'
  );
  const [jobScope, setJobScope] = useState<'minor' | 'standard' | 'major'>('standard');
  const [includeParts, setIncludeParts] = useState(true);

  const matchedCatalogItem = SERVICE_CATALOG.find((s) => s.id === selectedServiceId) || SERVICE_CATALOG[0];

  // Determine benchmark
  const benchmark = useMemo(() => {
    if (ACCRA_BENCHMARKS[selectedServiceId]) {
      return ACCRA_BENCHMARKS[selectedServiceId];
    }
    const base = matchedCatalogItem.basePrice || 120;
    return {
      trade: matchedCatalogItem.trade,
      title: matchedCatalogItem.title,
      baseLaborMin: Math.round(base * 0.7),
      baseLaborMax: Math.round(base * 1.2),
      typicalPartsMin: Math.round(base * 0.3),
      typicalPartsMax: Math.round(base * 0.6),
      diagnosticFee: matchedCatalogItem.callOutFee || 40,
      typicalDuration: '1-2 hours',
    };
  }, [selectedServiceId, matchedCatalogItem]);

  // Scope multiplier
  const scopeFactor = jobScope === 'minor' ? 0.8 : jobScope === 'major' ? 1.4 : 1.0;

  // Local Accra Area rate modifier (based on distance, transit, and parts market accessibility)
  const areaMultiplier = useMemo(() => {
    const highTier = ['Airport Residential', 'Cantonments', 'East Legon'];
    const standardTier = ['Osu', 'Spintex', 'Ridge', 'Dzorwulu', 'Labone', 'Achimota'];
    if (highTier.includes(selectedAreaName)) return 1.1;
    if (standardTier.includes(selectedAreaName)) return 1.0;
    return 0.95; // Outskirts like Kasoa, Madina, Pokuase
  }, [selectedAreaName]);

  const estimatedLaborMin = Math.round(benchmark.baseLaborMin * scopeFactor * areaMultiplier);
  const estimatedLaborMax = Math.round(benchmark.baseLaborMax * scopeFactor * areaMultiplier);

  const estimatedPartsMin = includeParts ? Math.round(benchmark.typicalPartsMin * scopeFactor) : 0;
  const estimatedPartsMax = includeParts ? Math.round(benchmark.typicalPartsMax * scopeFactor) : 0;

  const totalMin = benchmark.diagnosticFee + estimatedLaborMin + estimatedPartsMin;
  const totalMax = benchmark.diagnosticFee + estimatedLaborMax + estimatedPartsMax;
  const escrowCover = Math.round(totalMax * 0.05);

  return (
    <div className={`bg-[#131D38] border border-[#1E2B4D] rounded-3xl p-5 sm:p-6 shadow-xl text-slate-100 ${compact ? 'space-y-4' : 'space-y-6'}`}>
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E2B4D]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-400/40 text-amber-400 flex items-center justify-center font-black">
            <Calculator className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">
                Accra Transparent Cost Estimator
              </h3>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                Accra Market Rates
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live price ranges based on verified Accra artisan job averages & market parts indices.
            </p>
          </div>
        </div>

        {/* Area selection with wrapping and max-width bounds to prevent container overlap */}
        <div className="flex flex-wrap items-center gap-2 bg-[#0B132B] border border-[#1E2B4D] rounded-xl px-3 py-1.5 self-start sm:self-auto text-xs max-w-full min-w-0 overflow-hidden">
          <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="text-slate-400 font-medium shrink-0">Zone:</span>
          <select
            value={selectedAreaName}
            onChange={(e) => setSelectedAreaName(e.target.value)}
            className="bg-transparent font-bold text-white focus:outline-none cursor-pointer max-w-full min-w-0 truncate"
          >
            {ACCRA_AREAS.map((a) => (
              <option key={a.name} value={a.name} className="bg-[#0B132B] text-white">
                {a.name} ({a.gpsPrefix})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* 1. Service picker */}
        <div>
          <label className="text-[11px] font-bold text-slate-300 block mb-1 uppercase tracking-wider">
            Select Trade / Service
          </label>
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="w-full bg-[#0B132B] border border-[#1E2B4D] rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            {SERVICE_CATALOG.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#0B132B] text-white">
                [{s.trade.toUpperCase()}] {s.title}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Job Complexity / Scope */}
        <div>
          <label className="text-[11px] font-bold text-slate-300 block mb-1 uppercase tracking-wider">
            Scope / Severity
          </label>
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#0B132B] border border-[#1E2B4D] rounded-xl">
            {(['minor', 'standard', 'major'] as const).map((sc) => (
              <button
                key={sc}
                onClick={() => setJobScope(sc)}
                className={`py-1.5 text-[11px] font-extrabold rounded-lg capitalize cursor-pointer transition-all ${
                  jobScope === sc
                    ? 'bg-[#2B83D3] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sc}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Include Parts Toggle */}
        <div>
          <label className="text-[11px] font-bold text-slate-300 block mb-1 uppercase tracking-wider">
            Materials Included?
          </label>
          <button
            onClick={() => setIncludeParts(!includeParts)}
            className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
              includeParts
                ? 'bg-sky-950/60 border-sky-500/50 text-sky-200'
                : 'bg-[#0B132B] border-[#1E2B4D] text-slate-400'
            }`}
          >
            <span>{includeParts ? '✓ Standard Parts Included' : 'Labor & Callout Only'}</span>
            <span className="text-[10px] font-mono">{includeParts ? 'Materials Est.' : 'Client Provides'}</span>
          </button>
        </div>
      </div>

      {/* Transparent Price Range Spotlight */}
      <div className="bg-[#0B132B] border border-[#1E2B4D] rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 block">
              Estimated Accra Market Range ({selectedAreaName})
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black font-mono text-white tracking-tight">
                {formatCurrency(totalMin)} - {formatCurrency(totalMax)}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                (~{benchmark.typicalDuration})
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Funds held safely in Fixly Escrow until you inspect & sign off.</span>
            </p>
          </div>

          {onSelectAndBook && (
            <button
              onClick={() => onSelectAndBook(matchedCatalogItem)}
              className="px-5 py-3 rounded-2xl bg-[#2B83D3] hover:bg-sky-500 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-sky-900/40 transition-all shrink-0"
            >
              <span>Book With This Estimate</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Detailed Itemized Line Breakdown */}
        <div className="mt-4 pt-4 border-t border-[#1E2B4D] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-[#131D38] p-2.5 rounded-xl border border-[#1E2B4D]">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">1. Call-Out & Diag.</span>
            <span className="font-mono font-bold text-white">{formatCurrency(benchmark.diagnosticFee)}</span>
            <span className="text-[9px] text-slate-500 block">Deducted on job accept</span>
          </div>

          <div className="bg-[#131D38] p-2.5 rounded-xl border border-[#1E2B4D]">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">2. Skilled Labor</span>
            <span className="font-mono font-bold text-white">{formatCurrency(estimatedLaborMin)} - {formatCurrency(estimatedLaborMax)}</span>
            <span className="text-[9px] text-slate-500 block">Fair Accra artisan wage</span>
          </div>

          <div className="bg-[#131D38] p-2.5 rounded-xl border border-[#1E2B4D]">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">3. Parts & Consumables</span>
            <span className="font-mono font-bold text-white">
              {includeParts ? `${formatCurrency(estimatedPartsMin)} - ${formatCurrency(estimatedPartsMax)}` : 'None (Client supplies)'}
            </span>
            <span className="text-[9px] text-slate-500 block">Opera Square/Abossey Okai index</span>
          </div>

          <div className="bg-[#131D38] p-2.5 rounded-xl border border-[#1E2B4D]">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">4. Escrow Protection</span>
            <span className="font-mono font-bold text-emerald-400">Included (~{formatCurrency(escrowCover)})</span>
            <span className="text-[9px] text-emerald-500/80 block">Dispute waterfall backed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
