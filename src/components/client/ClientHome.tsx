import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useLanguage } from '../../context/LanguageContext';
import { SERVICE_CATALOG, ACCRA_AREAS } from '../../data/catalog';
import { CatalogServiceItem, TradeType } from '../../types';
import {
  Wrench,
  Zap,
  Hammer,
  Paintbrush,
  Sparkles,
  Grid3X3,
  Armchair,
  Fan,
  MapPin,
  Search,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ShieldAlert,
  Smartphone,
  Mic,
} from 'lucide-react';
import { SmartMatchFinder } from './SmartMatchFinder';
import { ArtisanMapView } from '../map/ArtisanMapView';
import { AccraCostEstimator } from '../common/AccraCostEstimator';
import { VoiceCommandInterface } from './VoiceCommandInterface';

interface ClientHomeProps {
  onStartOnDemand: (service?: CatalogServiceItem) => void;
  onStartProject: (trade?: TradeType) => void;
  onViewJob: (jobId: string) => void;
}

export const ClientHome: React.FC<ClientHomeProps> = ({
  onStartOnDemand,
  onStartProject,
  onViewJob,
}) => {
  const { jobs, currentUser, allUsers } = useMarketplace();
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTradeFilter, setSelectedTradeFilter] = useState<string>('all');
  const [selectedArea, setSelectedArea] = useState(ACCRA_AREAS[0]);
  const [aiMatchOpen, setAiMatchOpen] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

  // Active or pending jobs for current client
  const activeJobs = jobs.filter(
    (j) => j.clientId === currentUser.id && j.status !== 'closed'
  );

  const getTradeIcon = (trade: TradeType) => {
    switch (trade) {
      case 'plumbing':
        return <Wrench className="w-5 h-5 text-sky-600" />;
      case 'electrical':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'carpentry':
        return <Hammer className="w-5 h-5 text-amber-700" />;
      case 'painting':
        return <Paintbrush className="w-5 h-5 text-purple-600" />;
      case 'pop_ceilings':
        return <Sparkles className="w-5 h-5 text-emerald-600" />;
      case 'tiling':
        return <Grid3X3 className="w-5 h-5 text-indigo-600" />;
      case 'upholstery':
        return <Armchair className="w-5 h-5 text-rose-600" />;
      case 'ac_refrigeration':
        return <Fan className="w-5 h-5 text-cyan-600" />;
      default:
        return <Wrench className="w-5 h-5 text-slate-600" />;
    }
  };

  const filteredCatalog = SERVICE_CATALOG.filter((item) => {
    const matchesFilter = selectedTradeFilter === 'all' || item.trade === selectedTradeFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.titleTwi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.trade.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Location Chip & Search Header */}
      <div className="bg-[#131D38] rounded-2xl p-5 border border-[#1E2B4D] shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#1E2B4D]">
          <div className="flex items-center gap-2 text-xs text-slate-300 min-w-0 max-w-full flex-wrap">
            <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="shrink-0 font-medium text-slate-300">Service Address in Accra:</span>
            <select
              value={selectedArea.name}
              onChange={(e) => {
                const found = ACCRA_AREAS.find((a) => a.name === e.target.value);
                if (found) setSelectedArea(found);
              }}
              className="font-bold text-white bg-[#0B132B] border border-[#1E2B4D] rounded-xl px-3 py-1.5 text-xs cursor-pointer focus:outline-none focus:border-sky-500 max-w-full break-words"
            >
              {ACCRA_AREAS.map((a) => (
                <option key={a.name} value={a.name} className="bg-[#0B132B] text-white">
                  {a.name} ({a.gpsPrefix})
                </option>
              ))}
            </select>
          </div>

          <div className="text-[11px] text-slate-400 font-mono break-all shrink-0">
            Digital GPS: <strong className="text-sky-400">{selectedArea.gpsPrefix}</strong>
          </div>
        </div>

        {/* Big Search Bar with Voice Command Button */}
        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchServices')}
              className="w-full pl-11 pr-4 py-3 bg-[#0B132B] border border-[#1E2B4D] rounded-xl text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>

          <button
            type="button"
            onClick={() => setVoiceModalOpen(true)}
            className="px-3.5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md shadow-amber-400/20 transition-all hover:scale-105 active:scale-95"
            title="Search or book using Ghanaian Dialect Voice Commands (Twi, Ga, English, Pidgin)"
          >
            <Mic className="w-4 h-4 text-slate-950" />
            <span className="hidden sm:inline">Voice Search</span>
          </button>
        </div>
      </div>

      {/* Live Accra Vicinity Map immediately under Service Address */}
      <ArtisanMapView
        pros={allUsers.filter((u) => u.role === 'pro')}
        currentAreaName={selectedArea.name}
        onBookArtisan={(proId, suggestedService) => {
          if (suggestedService) {
            onStartOnDemand(suggestedService);
          } else {
            onStartOnDemand();
          }
        }}
      />

      {/* Transparent Accra Cost Estimator & Price Range Benchmark */}
      <AccraCostEstimator
        initialAreaName={selectedArea.name}
        onSelectAndBook={(service) => onStartOnDemand(service)}
      />

      {/* Floating "Find with AI" Button with yellow outline */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setAiMatchOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#131D38] border-2 border-amber-400 text-amber-400 font-black text-xs shadow-2xl shadow-amber-500/25 hover:bg-[#1E2B4D] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          title="Find with AI - Smart Match Artisan"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span className="tracking-wide text-white">Find with AI</span>
          <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded-full">
            Fast
          </span>
        </button>
      </div>

      {/* Floating Smart Match Modal */}
      {aiMatchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="max-w-4xl w-full max-h-[92vh] overflow-y-auto">
            <SmartMatchFinder
              currentAreaName={selectedArea.name}
              onClose={() => setAiMatchOpen(false)}
              onSelectPro={(proId, matchedService) => {
                setAiMatchOpen(false);
                if (matchedService) {
                  onStartOnDemand(matchedService);
                } else {
                  onStartOnDemand();
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Active Jobs Live Alert Banner */}
      {activeJobs.length > 0 && (
        <div className="bg-[#131D38] border border-amber-500/40 rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
                <Clock className="w-5 h-5 animate-spin text-slate-950" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                  Active Service in Progress
                </span>
                <h4 className="text-sm font-bold text-white">
                  {activeJobs[0].title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
                  <span>Status: <strong className="text-sky-400">{t('status_' + activeJobs[0].status)}</strong></span>
                  {activeJobs[0].proName && (
                    <>
                      <span>·</span>
                      <span>Pro: <strong className="text-white">{activeJobs[0].proName}</strong></span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => onViewJob(activeJobs[0].id)}
              className="px-3.5 py-2 bg-[#2B83D3] hover:bg-sky-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors shrink-0"
            >
              <span>View Live Job</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Two Centerpiece Entry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Need Someone Now */}
        <div
          onClick={() => onStartOnDemand()}
          className="bg-[#131D38] rounded-2xl p-6 border border-[#1E2B4D] hover:border-sky-500 shadow-lg hover:shadow-sky-950/40 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/30">
              <Zap className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-extrabold text-sky-300 bg-sky-950/80 border border-sky-500/30 px-2.5 py-1 rounded-full">
              ⚡ Dispatch in ~25 mins
            </span>
          </div>

          <h3 className="text-lg font-bold text-white mt-4 group-hover:text-sky-400 transition-colors">
            {t('needNow')}
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {t('needNowSub')}
          </p>

          <div className="mt-4 pt-3 border-t border-[#1E2B4D] flex items-center justify-between text-xs font-bold text-sky-400">
            <span>Book On-Demand Repair</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Plan a Project */}
        <div
          onClick={() => onStartProject()}
          className="bg-[#131D38] rounded-2xl p-6 border border-[#1E2B4D] hover:border-emerald-500 shadow-lg hover:shadow-emerald-950/40 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-extrabold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-1 rounded-full">
              🏛️ Staged Milestones (40/40/20)
            </span>
          </div>

          <h3 className="text-lg font-bold text-white mt-4 group-hover:text-emerald-400 transition-colors">
            {t('planProject')}
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {t('planProjectSub')}
          </p>

          <div className="mt-4 pt-3 border-t border-[#1E2B4D] flex items-center justify-between text-xs font-bold text-emerald-400">
            <span>Request Project Quotes</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Trade Quick Filter Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Trades' },
          { id: 'plumbing', label: 'Plumbing' },
          { id: 'electrical', label: 'Electrical' },
          { id: 'pop_ceilings', label: 'POP Ceilings' },
          { id: 'painting', label: 'Painting' },
          { id: 'tiling', label: 'Tiling' },
          { id: 'ac_refrigeration', label: 'AC & Cold' },
        ].map((tItem) => (
          <button
            key={tItem.id}
            onClick={() => setSelectedTradeFilter(tItem.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
              selectedTradeFilter === tItem.id
                ? 'bg-[#2B83D3] text-white shadow-sm'
                : 'bg-[#131D38] text-slate-300 hover:bg-[#1E2B4D] border border-[#1E2B4D]'
            }`}
          >
            {tItem.label}
          </button>
        ))}
      </div>

      {/* Fixed Price Catalog Menu */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">
            Transparent Price Menu (Accra Standard)
          </h3>
          <span className="text-xs text-slate-400">
            Locked before work begins
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredCatalog.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (item.type === 'project') {
                  onStartProject(item.trade);
                } else {
                  onStartOnDemand(item);
                }
              }}
              className="bg-[#131D38] rounded-2xl p-4 border border-[#1E2B4D] hover:border-sky-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="p-2 rounded-xl bg-[#0B132B] border border-[#1E2B4D]">
                    {getTradeIcon(item.trade)}
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-base font-black text-sky-400 block">
                      GH₵ {item.basePrice + Math.round(item.basePrice * 0.05)}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold block">
                      Includes 5% (GH₵ {Math.round(item.basePrice * 0.05)}) Escrow Cover
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white mt-2.5">
                  {language === 'twi' ? item.titleTwi : language === 'ga' ? item.titleGa : item.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {language === 'twi' ? item.includesTwi : item.includes}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#1E2B4D] flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="text-[11px] text-slate-400 capitalize">
                  {item.trade.replace(/_/g, ' ')}
                </span>
                <span className="text-sky-400 font-bold flex items-center gap-1">
                  Book <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VETTED ARTISANS SEARCH RESULTS WITH VISUAL BADGES */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">
              Vetted & Insured Artisans in {selectedArea.name}
            </h3>
            <p className="text-xs text-slate-400">
              Verified by Ghana Card biometric match, master associations, and property guarantors
            </p>
          </div>
          <span className="hidden sm:inline-block text-xs font-extrabold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-xl border border-emerald-500/40">
            100% Identity Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {allUsers
            .filter((u) => u.role === 'pro')
            .map((pro) => (
              <div
                key={pro.id}
                className="bg-[#131D38] rounded-2xl p-4 sm:p-5 border border-[#1E2B4D] hover:border-sky-500 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-[#0B132B] text-sky-400 border border-[#1E2B4D] flex items-center justify-center font-black text-base shrink-0">
                        {pro.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-sm font-bold text-white truncate">
                            {pro.name}
                          </h4>
                          <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-full shrink-0">
                            {pro.proProfile?.tier} Tier
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 block truncate capitalize mt-0.5">
                          {pro.proProfile?.trade} Pro · {pro.location?.area}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center justify-end gap-1 text-amber-400 text-xs font-extrabold">
                        <span>★</span>
                        <span className="font-mono text-white">{pro.proProfile?.rating}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                        {pro.proProfile?.jobsCompleted} jobs
                      </span>
                    </div>
                  </div>

                  {/* VISUAL VERIFICATION BADGES STRIP */}
                  <div className="mt-3 pt-3 border-t border-[#1E2B4D] flex flex-wrap gap-1.5">
                    {pro.proProfile?.badges ? (
                      pro.proProfile.badges.map((b) => (
                        <span
                          key={b.id}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-[#0B132B] border border-[#1E2B4D] rounded-lg text-[10px] font-bold text-slate-200"
                          title={b.tooltip}
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate max-w-[120px]">{b.shortLabel}</span>
                        </span>
                      ))
                    ) : (
                      <>
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 rounded-lg text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Ghana Card</span>
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-sky-950/60 text-sky-300 border border-sky-500/40 rounded-lg text-[10px] font-bold">
                          <span>Master Craftsman</span>
                        </span>
                      </>
                    )}
                  </div>

                  {/* Trust metrics */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-xl bg-[#0B132B] border border-[#1E2B4D] text-slate-300">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Problem Solved</span>
                      <strong className="text-white font-mono">{pro.proProfile?.problemSolvedRate}% Fix Rate</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Claim Limit</span>
                      <strong className="text-emerald-400 font-mono">GH₵ {pro.proProfile?.claimLimit}</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#1E2B4D] flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    GPS: {pro.location?.ghanaPostGps}
                  </span>
                  <button
                    onClick={() => onStartOnDemand()}
                    className="px-3.5 py-1.5 bg-[#2B83D3] hover:bg-sky-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm"
                  >
                    Request Artisan
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Escrow Guarantee Trust Banner */}
      <div className="bg-[#131D38] text-white rounded-2xl p-6 border border-[#1E2B4D] shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Six-Layer Protection Promise</span>
            </div>
            <h4 className="text-lg font-bold text-white">Your Money Is Never Handed Over In Advance</h4>
            <p className="text-xs text-slate-300 max-w-xl">
              100% of payments are placed into Fixly Escrow and only released 24 to 48 hours after you confirm the repair is solved. If workmanship is defective, our dispute waterfall protects your money.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <div className="px-3 py-2 rounded-xl bg-[#0B132B] border border-[#1E2B4D] text-left">
              <span className="text-[10px] text-slate-400 block">Ghana Card</span>
              <span className="text-xs font-bold text-white">100% Verified Pros</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-[#0B132B] border border-[#1E2B4D] text-left">
              <span className="text-[10px] text-slate-400 block">Claims Waterfall</span>
              <span className="text-xs font-bold text-amber-400">Insurer Backed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Command Dialect Interface Modal */}
      <VoiceCommandInterface
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onInitiateBooking={(service, areaName) => {
          if (areaName) {
            const foundArea = ACCRA_AREAS.find(
              (a) => a.name.toLowerCase() === areaName.toLowerCase()
            );
            if (foundArea) setSelectedArea(foundArea);
          }
          onStartOnDemand(service);
        }}
        onApplySearch={(trade, areaName, query) => {
          setSelectedTradeFilter(trade);
          if (areaName) {
            const foundArea = ACCRA_AREAS.find(
              (a) => a.name.toLowerCase() === areaName.toLowerCase()
            );
            if (foundArea) setSelectedArea(foundArea);
          }
          setSearchQuery(query);
        }}
      />
    </div>
  );
};
