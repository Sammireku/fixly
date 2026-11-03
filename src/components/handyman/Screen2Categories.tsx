import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Bell,
  Briefcase,
  Droplets,
  Lightbulb,
  Compass,
  Paintbrush,
  Truck,
} from 'lucide-react';
import { BottomNavBar } from './BottomNavBar';
import { BottomTabId } from './types';

interface Screen2CategoriesProps {
  onSelectCategory: (categoryName: string) => void;
  onOpenNotifications?: () => void;
  onTabChange: (tab: BottomTabId) => void;
}

export const Screen2Categories: React.FC<Screen2CategoriesProps> = ({
  onSelectCategory,
  onOpenNotifications,
  onTabChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      id: 'handyman',
      title: 'Handyman',
      subtitle: 'Fixtures & repairs',
      icon: Briefcase,
    },
    {
      id: 'plumbing',
      title: 'Plumbing',
      subtitle: 'Leaks & installs',
      icon: Droplets,
    },
    {
      id: 'electric',
      title: 'Electric',
      subtitle: 'Lights & outlets',
      icon: Lightbulb,
    },
    {
      id: 'gardening',
      title: 'Gardening',
      subtitle: 'Yard & cleanup',
      icon: Compass,
    },
    {
      id: 'painting',
      title: 'Painting',
      subtitle: 'Walls & trim',
      icon: Paintbrush,
    },
    {
      id: 'moving',
      title: 'Moving',
      subtitle: 'Heavy items',
      icon: Truck,
    },
  ];

  const filteredCategories = categories.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#F4F5F8] text-slate-900 select-none">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-7 pb-5 space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-normal text-slate-400 block tracking-tight">
              Categories
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Find the right service
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
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center px-3.5 py-3 gap-2.5 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
          <Search className="w-4 h-4 text-slate-400 shrink-0 stroke-[1.8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services or pros"
            className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            className="p-1 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            title="Filter"
          >
            <SlidersHorizontal className="w-4 h-4 stroke-[1.8]" />
          </button>
        </div>

        {/* 2-Column Categories Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-0.5">
          {filteredCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.title)}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all flex flex-col justify-between group active:scale-98"
              >
                <div className="w-8 h-8 rounded-full bg-[#EBF1FF] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Icon className="w-4 h-4 text-[#1E5BF0] stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                    {cat.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                    {cat.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Royal Blue Banner: Need help fast? */}
        <div
          onClick={() => onSelectCategory('Handyman')}
          className="bg-[#1E5BF0] text-white rounded-2xl p-4.5 cursor-pointer hover:opacity-98 transition-all shadow-sm relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Need help fast?
            </h3>
            <span className="bg-white/20 text-white font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
              SAME DAY
            </span>
          </div>

          <p className="text-xs text-blue-100 font-medium mt-1 leading-snug">
            Same-day handyman visits available
          </p>

          <p className="text-[10px] text-blue-200/90 font-normal mt-3 tracking-tight">
            Verified pros • fast booking • clear pricing
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar activeTab="home" onTabChange={onTabChange} />
    </div>
  );
};
