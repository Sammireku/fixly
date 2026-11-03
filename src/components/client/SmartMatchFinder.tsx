import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useLanguage } from '../../context/LanguageContext';
import { smartMatchArtisans } from '../../lib/smartMatch';
import { SmartMatchResult, CatalogServiceItem } from '../../types';
import { ACCRA_AREAS, SERVICE_CATALOG } from '../../data/catalog';
import { VoiceToTextRecorder } from '../VoiceToTextRecorder';
import {
  Sparkles,
  Search,
  MapPin,
  Clock,
  ShieldCheck,
  Star,
  CheckCircle2,
  ArrowRight,
  Zap,
  Mic,
  ChevronDown,
  X,
} from 'lucide-react';

interface SmartMatchFinderProps {
  currentAreaName: string;
  onSelectPro: (proId: string, suggestedService?: CatalogServiceItem) => void;
  onClose?: () => void;
}

export const SmartMatchFinder: React.FC<SmartMatchFinderProps> = ({
  currentAreaName,
  onSelectPro,
  onClose,
}) => {
  const { allUsers } = useMarketplace();
  const { t } = useLanguage();

  const [taskQuery, setTaskQuery] = useState('Kitchen sink water pipe leaking heavily under the cabinet');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState(currentAreaName || 'East Legon');
  const [matchResults, setMatchResults] = useState<SmartMatchResult[]>(() =>
    smartMatchArtisans('Kitchen sink water pipe leaking heavily under the cabinet', currentAreaName || 'East Legon', allUsers)
  );
  const [isSearching, setIsSearching] = useState(false);

  const handleRunMatch = (queryText: string, areaName: string) => {
    setIsSearching(true);
    setTimeout(() => {
      const results = smartMatchArtisans(queryText, areaName, allUsers);
      setMatchResults(results);
      setIsSearching(false);
    }, 400);
  };

  const samplePrompts = [
    'Emergency: Burst water pipe flooding bathroom',
    'Main electrical circuit breaker tripping repeatedly',
    'POP ceiling moisture cracks after rain in living room',
    'Broken deadlock on solid hardwood entrance door',
  ];

  return (
    <div className="bg-[#131D38] rounded-3xl p-5 sm:p-6 border-2 border-amber-400 shadow-2xl text-slate-100 space-y-4">
      {/* Header Badge, Title & Close Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-400 text-slate-950 shadow-md font-black shrink-0">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">
                AI Smart Match Artisan Engine
              </h3>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase tracking-wider">
                Multi-Factor Algorithmic
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Evaluates task nuance, Accra GPS proximity, problem-solved rate (35%), and verified trade badges.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Selected Area Selector */}
          <div className="flex items-center gap-1.5 bg-[#0B132B] border border-[#1E2B4D] rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-200">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-slate-400 text-[11px]">Area:</span>
            <select
              value={selectedArea}
              onChange={(e) => {
                setSelectedArea(e.target.value);
                handleRunMatch(taskQuery, e.target.value);
              }}
              className="bg-transparent font-bold text-white focus:outline-none cursor-pointer text-xs"
            >
              {ACCRA_AREAS.map((a) => (
                <option key={a.name} value={a.name} className="bg-[#0B132B] text-white">
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[#0B132B] border border-[#1E2B4D] hover:bg-[#1E2B4D] text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search Input Bar with Voice Button */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={taskQuery}
              onChange={(e) => {
                setTaskQuery(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRunMatch(taskQuery, selectedArea);
              }}
              placeholder="Describe what needs fixing (e.g., leaking tap, tripping breaker, POP ceiling crack)..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#0B132B] border border-[#1E2B4D] rounded-xl text-xs font-medium text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all shadow-inner"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsVoiceOpen(!isVoiceOpen)}
            className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-sm ${
              isVoiceOpen
                ? 'bg-amber-400 border-amber-500 text-slate-950 font-black'
                : 'bg-[#0B132B] border-[#1E2B4D] hover:border-amber-400 text-slate-200'
            }`}
            title="Describe with voice"
          >
            <Mic className={`w-4 h-4 ${isVoiceOpen ? 'text-slate-950' : 'text-amber-400'}`} />
            <span className="hidden sm:inline">Voice Note</span>
          </button>

          <button
            type="button"
            onClick={() => handleRunMatch(taskQuery, selectedArea)}
            className="px-4 py-2.5 bg-[#2B83D3] hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-sky-900/40 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Match</span>
          </button>
        </div>

        {/* Voice recording accordion if open */}
        {isVoiceOpen && (
          <div className="p-3 bg-[#0B132B] rounded-2xl border border-amber-400/50 animate-fade-in">
            <VoiceToTextRecorder
              onTranscriptComplete={(transcript: string) => {
                setTaskQuery(transcript);
                setIsVoiceOpen(false);
                handleRunMatch(transcript, selectedArea);
              }}
            />
          </div>
        )}

        {/* Quick Sample Task Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
          <span className="text-[10px] text-slate-400 uppercase font-bold shrink-0">Try:</span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTaskQuery(prompt);
                handleRunMatch(prompt, selectedArea);
              }}
              className="text-[11px] text-slate-300 bg-[#0B132B] hover:bg-[#1E2B4D] hover:text-amber-300 px-2.5 py-1 rounded-xl border border-[#1E2B4D] whitespace-nowrap cursor-pointer transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Matched Artisans Ranking List */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white">
            Top Matched Artisans for "{selectedArea}" ({matchResults.length} Available)
          </span>
          <span className="text-[11px] text-amber-400 font-medium">
            Ranked by AI compatibility & arrival ETA
          </span>
        </div>

        {isSearching ? (
          <div className="p-6 text-center text-slate-300 bg-[#0B132B] rounded-2xl border border-[#1E2B4D] animate-pulse">
            <Sparkles className="w-6 h-6 text-amber-400 mx-auto mb-1 animate-spin" />
            <p className="text-xs font-bold text-white">Calculating optimal GPS distance & trust metrics...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {matchResults.slice(0, 3).map((match, rank) => {
              const matchedService = SERVICE_CATALOG.find((s) => s.trade === match.trade);
              return (
                <div
                  key={match.proId}
                  className="bg-[#0B132B] rounded-2xl p-4 border border-[#1E2B4D] hover:border-amber-400 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    {/* Top Row: Rank & Match Score */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#131D38] text-slate-300 border border-[#1E2B4D]">
                        #{rank + 1} Best Fit
                      </span>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold">
                        <Zap className="w-3 h-3 text-emerald-400" />
                        <span>{match.matchScore}% Match</span>
                      </div>
                    </div>

                    {/* Pro Identity & Badges */}
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-[#131D38] text-sky-400 border border-sky-500/30 flex items-center justify-center font-black text-sm shrink-0">
                        {match.proName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs font-bold text-white truncate">
                            {match.proName}
                          </h4>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                            {match.tier}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 capitalize">
                          {match.trade.replace(/_/g, ' ')} Specialist
                        </p>
                      </div>
                    </div>

                    {/* Distance & ETA Strip */}
                    <div className="p-2 rounded-xl bg-[#131D38] text-[11px] text-slate-300 flex items-center justify-between border border-[#1E2B4D]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        <strong className="text-white">{match.distanceKm} km</strong> ({match.area})
                      </span>
                      <span className="flex items-center gap-1 font-bold text-white">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>~{match.estimatedArrivalMins} mins</span>
                      </span>
                    </div>

                    {/* AI Reasoning Blurb */}
                    <p className="text-[11px] text-slate-300 leading-snug bg-[#131D38]/80 p-2.5 rounded-xl border border-amber-400/20 italic">
                      "{match.reasoning}"
                    </p>

                    {/* Historical Trust Signals */}
                    <div className="grid grid-cols-3 gap-1 text-center pt-1 border-t border-[#1E2B4D]">
                      <div className="p-1 rounded-lg bg-[#131D38]">
                        <span className="text-[9px] text-slate-400 block font-bold">Solved</span>
                        <span className="text-[10px] font-bold text-emerald-400 font-mono">
                          {match.historicalHighlights.problemSolvedRate}%
                        </span>
                      </div>
                      <div className="p-1 rounded-lg bg-[#131D38]">
                        <span className="text-[9px] text-slate-400 block font-bold">Rating</span>
                        <span className="text-[10px] font-bold text-amber-400 font-mono">
                          {match.historicalHighlights.rating}★
                        </span>
                      </div>
                      <div className="p-1 rounded-lg bg-[#131D38]">
                        <span className="text-[9px] text-slate-400 block font-bold">On-Time</span>
                        <span className="text-[10px] font-bold text-white font-mono">
                          {match.historicalHighlights.onTimeRate}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Booking CTA Button */}
                  <button
                    onClick={() => {
                      onSelectPro(match.proId, matchedService);
                      if (onClose) onClose();
                    }}
                    className="mt-3 w-full py-2 bg-[#2B83D3] hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <span>Instant Dispatch (Escrow)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
