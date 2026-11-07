import React, { useState } from 'react';
import { X, Search, Check, AlertTriangle, ShieldCheck, ShoppingCart, ChevronRight, Wrench } from 'lucide-react';
import { HANDYMAN_CATALOG, HandymanSubservice } from '../../data/handymanServicesCatalog';
import { formatCurrency } from '../../lib/currency';

interface SubserviceSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  proName?: string;
  proCategory?: string;
  customProPrices?: Record<string, number>; // subserviceId -> custom GHS rate
  onConfirmSelection: (selectedSubservices: HandymanSubservice[], totalGhs: number) => void;
}

export const SubserviceSelectorModal: React.FC<SubserviceSelectorModalProps> = ({
  isOpen,
  onClose,
  proName = 'Ghana Master Artisan',
  proCategory,
  customProPrices = {},
  onConfirmSelection,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('cat-1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubserviceIds, setSelectedSubserviceIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const currentCat = HANDYMAN_CATALOG.find((c) => c.id === selectedCategory) || HANDYMAN_CATALOG[0];

  const handleToggleSubservice = (id: string) => {
    setSelectedSubserviceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getSubservicePrice = (sub: HandymanSubservice) => {
    return customProPrices[sub.id] ?? sub.basePriceGhs;
  };

  // Filter subservices based on search query or selected category
  const displayedSubservices: HandymanSubservice[] = searchQuery.trim()
    ? HANDYMAN_CATALOG.flatMap((cat) => cat.services).filter(
        (s) =>
          s.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.jobDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentCat.services;

  // Selected subservice list and total
  const selectedSubservicesList = HANDYMAN_CATALOG.flatMap((c) => c.services).filter((s) =>
    selectedSubserviceIds.includes(s.id)
  );

  const totalGhs = selectedSubservicesList.reduce((acc, sub) => acc + getSubservicePrice(sub), 0);

  const handleConfirm = () => {
    onConfirmSelection(selectedSubservicesList, totalGhs);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in dark:bg-black/80">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-[#F8F9FB] dark:bg-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EBF1FF] dark:bg-blue-950/80 text-[#1E5BF0] dark:text-blue-400 flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Select Specific Services from {proName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Pick individual jobs from the Ghana Handyman Service Menu with upfront GHS pricing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-700/60 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 17 categories (e.g., tap leak, POP ceiling, CCTV, AC service, generator)..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {!searchQuery && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {HANDYMAN_CATALOG.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#1E5BF0] text-white shadow-2xs'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{cat.categoryName}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {cat.services.length}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              {searchQuery ? `Search Results (${displayedSubservices.length})` : currentCat.categoryName}
            </span>
            <span className="text-[11px] font-semibold text-[#1E5BF0] dark:text-blue-400">
              Flow: {currentCat.flowMix} • Vetting: {currentCat.vetting}
            </span>
          </div>

          {displayedSubservices.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No subservices found</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Try searching for a different keyword or category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {displayedSubservices.map((sub) => {
                const isChecked = selectedSubserviceIds.includes(sub.id);
                const price = getSubservicePrice(sub);
                return (
                  <div
                    key={sub.id}
                    onClick={() => handleToggleSubservice(sub.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isChecked
                        ? 'border-[#1E5BF0] bg-blue-50/50 dark:bg-blue-950/30 dark:border-blue-500 shadow-2xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                              isChecked
                                ? 'bg-[#1E5BF0] text-white'
                                : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                            {sub.serviceName}
                          </h4>
                        </div>
                        <span className="text-xs font-extrabold text-[#1E5BF0] dark:text-blue-400 shrink-0">
                          {formatCurrency(price)}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {sub.jobDescription}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[10px]">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                        {sub.flowAndPriceModel}
                      </span>

                      {sub.safetyFlags.length > 0 && sub.safetyFlags[0] !== 'None' && (
                        <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{sub.safetyFlags.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with Selected Summary & Action Button */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
              {selectedSubserviceIds.length} job(s) selected
            </span>
            <span className="text-base font-black text-slate-900 dark:text-white">
              Total Escrow: {formatCurrency(totalGhs)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={selectedSubserviceIds.length === 0}
              onClick={handleConfirm}
              className="px-6 py-2.5 rounded-xl bg-[#1E5BF0] hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Confirm & Add to Escrow Contract</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
