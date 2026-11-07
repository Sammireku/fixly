import React, { useState } from 'react';
import { Bell, ChevronRight, MapPin, ShieldCheck, Award, Wrench, ListFilter } from 'lucide-react';
import { BottomNavBar } from './BottomNavBar';
import { BottomTabId, ProItem, FilterState } from './types';
import { GhanaCardBadge } from './GhanaCardBadge';
import { formatCurrency } from '../../lib/currency';
import { SubserviceSelectorModal } from '../common/SubserviceSelectorModal';
import { HandymanSubservice } from '../../data/handymanServicesCatalog';

interface Screen3ProfessionalsProps {
  onSelectPro: (pro: ProItem) => void;
  onOpenNotifications?: () => void;
  onTabChange: (tab: BottomTabId) => void;
  filterState?: FilterState;
}

export const Screen3Professionals: React.FC<Screen3ProfessionalsProps> = ({
  onSelectPro,
  onOpenNotifications,
  onTabChange,
  filterState,
}) => {
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'top' | 'nearby' | 'verified'>('all');
  const [isSubserviceSelectorOpen, setIsSubserviceSelectorOpen] = useState(false);
  const [selectedProForMenu, setSelectedProForMenu] = useState<ProItem | null>(null);

  const defaultPros: ProItem[] = [
    {
      id: 'marcus-kim',
      initials: 'MK',
      name: 'Marcus Kim',
      category: 'Handyman',
      experience: '12 yrs exp',
      hourlyRate: 45,
      rating: 4.9,
      jobsCompleted: 142,
      distanceMiles: 1.8,
      isGhanaCardVerified: true,
      isInsured: true,
    },
    {
      id: 'ava-patel',
      initials: 'AP',
      name: 'Ava Patel',
      category: 'Plumbing',
      experience: '8 yrs exp',
      hourlyRate: 60,
      rating: 4.8,
      jobsCompleted: 98,
      distanceMiles: 3.2,
      isGhanaCardVerified: true,
      isInsured: true,
    },
    {
      id: 'jordan-diaz',
      initials: 'JD',
      name: 'Jordan Diaz',
      category: 'Electrician',
      experience: '9 yrs exp',
      hourlyRate: 70,
      rating: 4.7,
      jobsCompleted: 76,
      distanceMiles: 4.5,
      isGhanaCardVerified: true,
      isInsured: true,
    },
    {
      id: 'kwame-mensah',
      initials: 'KM',
      name: 'Kwame Mensah',
      category: 'Master Plumber',
      experience: '14 yrs exp',
      hourlyRate: 55,
      rating: 4.95,
      jobsCompleted: 180,
      distanceMiles: 2.1,
      isGhanaCardVerified: true,
      isInsured: true,
    },
  ];

  const filteredPros = defaultPros.filter((pro) => {
    if (activeTabFilter === 'top' && pro.rating < 4.8) return false;
    if (activeTabFilter === 'nearby' && pro.distanceMiles > 3.0) return false;
    if (activeTabFilter === 'verified' && !pro.isGhanaCardVerified) return false;

    if (filterState) {
      if (filterState.verifiedOnly && !pro.isGhanaCardVerified) return false;
      if (filterState.insuredOnly && !pro.isInsured) return false;
      if (pro.distanceMiles > filterState.maxDistanceMiles) return false;
      if (pro.rating < filterState.minRating) return false;
      if (pro.jobsCompleted < filterState.minJobsCompleted) return false;
      if (pro.hourlyRate > filterState.maxHourlyRate) return false;
    }
    return true;
  });

  const handleOpenSubservicePicker = (pro: ProItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProForMenu(pro);
    setIsSubserviceSelectorOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-[#F4F5F8] dark:bg-slate-900 text-slate-900 dark:text-white select-none transition-colors">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-7 pb-5 space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-normal text-slate-400 dark:text-slate-400 block tracking-tight">
              Professionals
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
              Choose a pro
            </h1>
          </div>
          <button
            onClick={onOpenNotifications}
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs cursor-pointer transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-700 dark:text-slate-200 stroke-[1.8]" />
          </button>
        </div>

        {/* Global Subservice Menu Button */}
        <button
          type="button"
          onClick={() => {
            setSelectedProForMenu(null);
            setIsSubserviceSelectorOpen(true);
          }}
          className="w-full p-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-bold text-xs flex items-center justify-between shadow-xs hover:opacity-95 cursor-pointer transition-all"
        >
          <div className="flex items-center gap-2.5">
            <Wrench className="w-4 h-4 text-amber-300" />
            <div className="text-left">
              <span className="block text-white font-extrabold">
                Browse Full Ghana Service & Subservice Menu
              </span>
              <span className="block text-[10px] text-blue-100 font-medium">
                17 Categories (Plumbing, Solar, AC, POP, Fumigation, etc.)
              </span>
            </div>
          </div>
          <span className="bg-white/20 text-white text-[10px] px-2.5 py-1 rounded-full font-black uppercase">
            Pick Jobs
          </span>
        </button>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pt-0.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTabFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all shrink-0 ${
              activeTabFilter === 'all'
                ? 'bg-[#1E5BF0] text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTabFilter('top')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all shrink-0 ${
              activeTabFilter === 'top'
                ? 'bg-[#1E5BF0] text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            Top rated
          </button>
          <button
            onClick={() => setActiveTabFilter('nearby')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all shrink-0 ${
              activeTabFilter === 'nearby'
                ? 'bg-[#1E5BF0] text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            Nearby
          </button>
          <button
            onClick={() => setActiveTabFilter('verified')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all shrink-0 ${
              activeTabFilter === 'verified'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
            }`}
          >
            Ghana Card Verified
          </button>
        </div>

        {/* Pro Cards List */}
        <div className="space-y-2.5">
          {filteredPros.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center text-slate-400 text-xs border border-slate-200 dark:border-slate-700">
              No pros found matching current filters. Try resetting filters.
            </div>
          ) : (
            filteredPros.map((pro) => (
              <div
                key={pro.id}
                onClick={() => onSelectPro(pro)}
                className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-3.5 shadow-xs flex flex-col gap-2.5 cursor-pointer hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-sm transition-all group active:scale-99"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#EBF1FF] dark:bg-blue-950 text-[#1E5BF0] dark:text-blue-400 font-bold text-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {pro.initials}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">
                          {pro.name}
                        </h4>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5 tracking-tight">
                        {pro.category} • {pro.experience}
                      </span>
                      <span className="text-[11px] text-slate-800 dark:text-slate-200 font-medium block mt-0.5 tracking-tight">
                        Starting at {formatCurrency(pro.hourlyRate)}/hr
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleOpenSubservicePicker(pro, e)}
                      className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 text-[#1E5BF0] dark:text-blue-300 font-bold text-[10px] rounded-lg transition-colors border border-blue-200 dark:border-blue-800"
                    >
                      Select Jobs
                    </button>

                    <span className="bg-[#EBF1FF] dark:bg-blue-950 text-[#1E5BF0] dark:text-blue-400 font-bold text-[11px] px-2 py-0.5 rounded-md">
                      {pro.rating.toFixed(1)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>

                {/* Micro Badges Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[10px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    {pro.isGhanaCardVerified && <GhanaCardBadge size="sm" />}
                    <span className="text-slate-400">{pro.jobsCompleted} jobs</span>
                  </div>
                  <span className="text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {pro.distanceMiles} mi away
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Royal Blue Banner: Need a team? */}
        <div
          onClick={() => onSelectPro(defaultPros[0])}
          className="bg-[#1E5BF0] text-white rounded-2xl p-4.5 cursor-pointer hover:opacity-98 transition-all shadow-sm relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight">Need a team?</h3>
            <span className="bg-white/20 text-white font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
              CREW
            </span>
          </div>

          <p className="text-xs text-blue-100 font-medium mt-1 leading-snug">
            Book a crew for bigger home jobs
          </p>

          <p className="text-[10px] text-blue-200/90 font-normal mt-3 tracking-tight">
            Verified pros • fast booking • clear pricing
          </p>
        </div>
      </div>

      {/* Subservice Selector Modal */}
      <SubserviceSelectorModal
        isOpen={isSubserviceSelectorOpen}
        onClose={() => setIsSubserviceSelectorOpen(false)}
        proName={selectedProForMenu ? selectedProForMenu.name : 'Ghana Master Artisan'}
        proCategory={selectedProForMenu ? selectedProForMenu.category : undefined}
        onConfirmSelection={(selectedSubservices, totalGhs) => {
          if (selectedProForMenu) {
            onSelectPro(selectedProForMenu);
          }
        }}
      />

      {/* Bottom Navigation */}
      <BottomNavBar activeTab="home" onTabChange={onTabChange} />
    </div>
  );
};
