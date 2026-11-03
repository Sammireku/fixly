import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Bell,
  Droplets,
  Lightbulb,
  Tv,
  Hammer,
  Paintbrush,
  Grid,
  Home,
  Shield,
  Maximize2,
  Armchair,
  Flower2,
  Sparkles,
  Shirt,
  Camera,
  Truck,
  Wrench,
  Car,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { BottomNavBar } from './BottomNavBar';
import { BottomTabId } from './types';
import { SERVICE_CATEGORIES } from '../../data/catalog';
import { FlowTag } from '../../types';

interface Screen2CategoriesProps {
  onSelectCategory: (categoryName: string) => void;
  onOpenNotifications?: () => void;
  onTabChange: (tab: BottomTabId) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Droplets,
  Lightbulb,
  Tv,
  Hammer,
  Paintbrush,
  Grid,
  Home,
  Shield,
  Maximize2,
  Armchair,
  Flower2,
  Sparkles,
  Shirt,
  Camera,
  Truck,
  Wrench,
  Car,
};

export const Screen2Categories: React.FC<Screen2CategoriesProps> = ({
  onSelectCategory,
  onOpenNotifications,
  onTabChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFlowFilter, setActiveFlowFilter] = useState<'ALL' | FlowTag>('ALL');

  const filteredCategories = useMemo(() => {
    return SERVICE_CATEGORIES.filter((cat) => {
      const matchesSearch =
        cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFlow =
        activeFlowFilter === 'ALL' || cat.flows.includes(activeFlowFilter);

      return matchesSearch && matchesFlow;
    });
  }, [searchQuery, activeFlowFilter]);

  return (
    <div className="flex flex-col h-full bg-[#F4F5F8] text-slate-900 select-none">
      {/* Header & Sticky Controls */}
      <div className="px-5 pt-7 pb-3 bg-[#F4F5F8] border-b border-slate-200/60 space-y-3">
        {/* Top Title Row */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              17 Service Categories
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Service Catalog
            </h1>
          </div>
          <button
            onClick={onOpenNotifications}
            className="w-10 h-10 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-700 stroke-[1.8]" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center px-3.5 py-2.5 gap-2.5 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
          <Search className="w-4 h-4 text-slate-400 shrink-0 stroke-[1.8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all 17 categories or services..."
            className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[10px] text-slate-400 hover:text-slate-600 font-bold px-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Flow Tag Filter Chips: All | OD (On-demand) | PR (Project) | RC (Recurring) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          <span className="text-[10px] font-bold text-slate-400 mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3" /> Flow:
          </span>
          {[
            { id: 'ALL', label: 'All Services (17)' },
            { id: 'OD', label: 'OD (On-demand)' },
            { id: 'PR', label: 'PR (Project / Quoted)' },
            { id: 'RC', label: 'RC (Recurring)' },
          ].map((flow) => {
            const isActive = activeFlowFilter === flow.id;
            return (
              <button
                key={flow.id}
                onClick={() => setActiveFlowFilter(flow.id as any)}
                className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1E5BF0] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {flow.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Category Grid */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {filteredCategories.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-slate-400 text-xs">
            No categories match your search filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredCategories.map((cat) => {
              const Icon = ICON_MAP[cat.iconName] || Wrench;
              return (
                <div
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.title)}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group flex items-start justify-between gap-3 active:scale-[0.99]"
                >
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#EBF1FF] text-[#1E5BF0] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#1E5BF0] transition-colors">
                          {cat.title}
                        </h3>
                        {/* Flow Badges (OD, PR, RC) */}
                        <div className="flex items-center gap-1">
                          {cat.flows.map((flow) => (
                            <span
                              key={flow}
                              className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                                flow === 'OD'
                                  ? 'bg-blue-100 text-blue-700'
                                  : flow === 'PR'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {flow}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-[11px] font-medium text-slate-500">
                        {cat.subtitle}
                      </p>

                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#1E5BF0] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                </div>
              );
            })}
          </div>
        )}

        {/* Promo Footer Info */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-[#1E5BF0] text-white space-y-1.5 shadow-sm mt-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
              Flow Guarantee
            </span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
              Escrow Protected
            </span>
          </div>
          <p className="text-xs font-semibold leading-snug">
            On-Demand (OD) dispatches in 30m • Project (PR) 40/40/20 milestones • Recurring (RC) auto-schedule
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar activeTab="home" onTabChange={onTabChange} />
    </div>
  );
};
