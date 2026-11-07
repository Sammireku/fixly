import React, { useState } from 'react';
import { X, Search, Check, Save, Wrench, Shield, DollarSign, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { HANDYMAN_CATALOG, HandymanSubservice } from '../../data/handymanServicesCatalog';
import { formatCurrency } from '../../lib/currency';

interface ProServiceManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  proName?: string;
  initialOfferedSubservices?: string[]; // IDs of offered subservices
  initialCustomPrices?: Record<string, number>; // subserviceId -> priceGhs
  onSaveProServices: (offeredIds: string[], customPrices: Record<string, number>) => void;
}

export const ProServiceManagerModal: React.FC<ProServiceManagerModalProps> = ({
  isOpen,
  onClose,
  proName = 'Artisan',
  initialOfferedSubservices = [
    'plumb-1',
    'plumb-2',
    'plumb-3',
    'elec-1',
    'elec-2',
    'elec-3',
    'app-1',
    'carp-1',
    'carp-5',
    'gen-1',
    'gen-2',
    'gen-3',
  ],
  initialCustomPrices = {},
  onSaveProServices,
}) => {
  const [offeredIds, setOfferedIds] = useState<string[]>(initialOfferedSubservices);
  const [customPrices, setCustomPrices] = useState<Record<string, number>>(initialCustomPrices);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('cat-1');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const currentCat = HANDYMAN_CATALOG.find((c) => c.id === activeCategory) || HANDYMAN_CATALOG[0];

  const handleToggleSubservice = (id: string) => {
    setOfferedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handlePriceChange = (id: string, priceStr: string) => {
    const val = parseFloat(priceStr);
    if (!isNaN(val) && val >= 0) {
      setCustomPrices((prev) => ({ ...prev, [id]: val }));
    }
  };

  const handleSave = () => {
    onSaveProServices(offeredIds, customPrices);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const displayedServices: HandymanSubservice[] = searchQuery.trim()
    ? HANDYMAN_CATALOG.flatMap((c) => c.services).filter(
        (s) =>
          s.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.jobDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentCat.services;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in dark:bg-black/80">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-[#F8F9FB] dark:bg-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1E5BF0] text-white flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Artisan Trade Menu & Custom Rates
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Assign customized GHS prices for 17 handyman categories and enable subservices for client booking
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

        {/* Top Stats Banner */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Offered Subservices
              </span>
              <span className="text-sm font-black text-white">{offeredIds.length} active</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Custom Rates Overridden
              </span>
              <span className="text-sm font-black text-emerald-400">
                {Object.keys(customPrices).length} custom set
              </span>
            </div>
          </div>

          <span className="text-[11px] bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full font-semibold border border-blue-500/30">
            Default Currency: GHS
          </span>
        </div>

        {/* Search & Category Tabs */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all 17 categories (e.g., Leaks, Rewiring, POP ceiling, Fumigation)..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {!searchQuery && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {HANDYMAN_CATALOG.map((cat) => {
                const isActive = activeCategory === cat.id;
                const activeCountInCat = cat.services.filter((s) => offeredIds.includes(s.id)).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#1E5BF0] text-white shadow-2xs'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{cat.categoryName}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {activeCountInCat}/{cat.services.length}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Subservice List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {displayedServices.map((sub) => {
            const isOffered = offeredIds.includes(sub.id);
            const currentPrice = customPrices[sub.id] ?? sub.basePriceGhs;

            return (
              <div
                key={sub.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isOffered
                    ? 'border-[#1E5BF0] bg-blue-50/40 dark:bg-blue-950/20 dark:border-blue-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 opacity-75'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleSubservice(sub.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition-colors ${
                        isOffered
                          ? 'bg-[#1E5BF0] text-white'
                          : 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                      }`}
                    >
                      {isOffered && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {sub.serviceName}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                          {sub.flowAndPriceModel}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        {sub.jobDescription}
                      </p>
                    </div>
                  </div>

                  {/* Pricing Input Field */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">GHS</span>
                    <input
                      type="number"
                      disabled={!isOffered}
                      value={currentPrice}
                      onChange={(e) => handlePriceChange(sub.id, e.target.value)}
                      className="w-24 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-extrabold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40"
                    />
                    <span className="text-[10px] text-slate-400 font-mono">
                      (Base: {formatCurrency(sub.basePriceGhs)})
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {saveSuccess && (
          <div className="mx-5 my-2 p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Artisan services catalog and custom rates updated!</span>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-[#1E5BF0] hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Artisan Rates</span>
          </button>
        </div>
      </div>
    </div>
  );
};
