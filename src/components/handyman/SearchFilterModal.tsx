import React, { useState } from 'react';
import {
  X,
  SlidersHorizontal,
  MapPin,
  Star,
  CheckCircle2,
  ShieldCheck,
  Award,
  Banknote,
  RotateCcw,
} from 'lucide-react';
import { FilterState } from './types';

interface SearchFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (updated: FilterState) => void;
  onResetFilters: () => void;
}

export const SearchFilterModal: React.FC<SearchFilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}) => {
  const [maxDistance, setMaxDistance] = useState(filters.maxDistanceMiles);
  const [minRating, setMinRating] = useState(filters.minRating);
  const [minJobs, setMinJobs] = useState(filters.minJobsCompleted);
  const [verifiedOnly, setVerifiedOnly] = useState(filters.verifiedOnly);
  const [insuredOnly, setInsuredOnly] = useState(filters.insuredOnly);
  const [maxRate, setMaxRate] = useState(filters.maxHourlyRate);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters({
      searchQuery: filters.searchQuery,
      maxDistanceMiles: maxDistance,
      minRating,
      minJobsCompleted: minJobs,
      verifiedOnly,
      insuredOnly,
      maxHourlyRate: maxRate,
    });
    onClose();
  };

  const handleReset = () => {
    setMaxDistance(15);
    setMinRating(4.0);
    setMinJobs(0);
    setVerifiedOnly(false);
    setInsuredOnly(false);
    setMaxRate(120);
    onResetFilters();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EBF1FF] text-[#1E5BF0] flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Filter Search & Pros
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                Refine by proximity, verified credentials, and rating
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          {/* Proximity / Distance */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#1E5BF0]" />
                Proximity / Radius
              </span>
              <span className="text-[#1E5BF0]">{maxDistance} miles</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[2, 5, 10, 20].map((dist) => (
                <button
                  type="button"
                  key={dist}
                  onClick={() => setMaxDistance(dist)}
                  className={`py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    maxDistance === dist
                      ? 'bg-[#1E5BF0] text-white border-[#1E5BF0] shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {dist} mi
                </button>
              ))}
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Minimum Rating
              </span>
              <span className="text-amber-600">{minRating}+ Stars</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[4.0, 4.5, 4.8].map((rt) => (
                <button
                  type="button"
                  key={rt}
                  onClick={() => setMinRating(rt)}
                  className={`py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    minRating === rt
                      ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {rt}+ Stars
                </button>
              ))}
            </div>
          </div>

          {/* Jobs Completed */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#1E5BF0]" />
                Experience / Completed Jobs
              </span>
              <span className="text-slate-600">{minJobs ? `${minJobs}+ jobs` : 'Any'}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[0, 10, 30, 50].map((count) => (
                <button
                  type="button"
                  key={count}
                  onClick={() => setMinJobs(count)}
                  className={`py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    minJobs === count
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {count === 0 ? 'All' : `${count}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Verification & Insurance Toggles */}
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            {/* Ghana Card Verified */}
            <label className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-950 block">
                    Ghana Card Verified Only
                  </span>
                  <span className="text-[10px] text-emerald-700">
                    National ID biometric authentication confirmed
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
            </label>

            {/* Insured & Warranty Pool */}
            <label className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#1E5BF0] text-white flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-950 block">
                    Insured & Escrow Protected
                  </span>
                  <span className="text-[10px] text-blue-700">
                    Up to $10,000 warranty pool guarantee
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={insuredOnly}
                onChange={(e) => setInsuredOnly(e.target.checked)}
                className="w-4 h-4 accent-[#1E5BF0] rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Maximum Hourly Rate */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
              <span className="flex items-center gap-1.5">
                <Banknote className="w-3.5 h-3.5 text-slate-600" />
                Maximum Rate / Hour
              </span>
              <span className="font-extrabold text-slate-900">GH₵{maxRate}/hr</span>
            </div>
            <input
              type="range"
              min={35}
              max={120}
              step={5}
              value={maxRate}
              onChange={(e) => setMaxRate(Number(e.target.value))}
              className="w-full accent-[#1E5BF0] cursor-pointer"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-2.5 bg-[#1E5BF0] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
