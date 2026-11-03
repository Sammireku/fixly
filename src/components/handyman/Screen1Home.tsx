import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Bell,
  Wrench,
  Droplets,
  Lightbulb,
  Paintbrush,
  Briefcase,
  Fan,
  Zap,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Compass,
  Layers,
} from 'lucide-react';
import { BottomNavBar } from './BottomNavBar';
import { BottomTabId } from './types';
import { FixlyLogo } from './FixlyLogo';

interface Screen1HomeProps {
  onNavigateToCategories: () => void;
  onNavigateToPros: (category?: string) => void;
  onSelectService: (serviceName: string, price: number) => void;
  onOpenNotifications?: () => void;
  onOpenFilters?: () => void;
  onOpenSos?: () => void;
  onTabChange: (tab: BottomTabId) => void;
}

interface ServiceItem {
  id: string;
  title: string;
  category: string;
  price: number;
  priceLabel: string;
  icon: any;
  popular?: boolean;
}

export const Screen1Home: React.FC<Screen1HomeProps> = ({
  onNavigateToCategories,
  onNavigateToPros,
  onSelectService,
  onOpenNotifications,
  onOpenFilters,
  onOpenSos,
  onTabChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [gpsCode, setGpsCode] = useState('GA-183-9021');

  const quickCategories = [
    { id: 'handyman', label: 'Handyman', icon: Wrench },
    { id: 'plumbing', label: 'Plumbing', icon: Droplets },
    { id: 'electric', label: 'Electric', icon: Lightbulb },
    { id: 'cleaning', label: 'Cleaning', icon: Paintbrush },
  ];

  // Comprehensive searchable services catalog
  const allServices: ServiceItem[] = [
    {
      id: 'furniture',
      title: 'Furniture assembly',
      category: 'Handyman',
      price: 45,
      priceLabel: 'From $45',
      icon: Briefcase,
      popular: true,
    },
    {
      id: 'plumbing',
      title: 'Plumbing fix',
      category: 'Plumbing',
      price: 60,
      priceLabel: 'From $60',
      icon: Droplets,
      popular: true,
    },
    {
      id: 'ac_split',
      title: 'AC & Split service',
      category: 'Cooling',
      price: 50,
      priceLabel: 'From $50',
      icon: Fan,
      popular: true,
    },
    {
      id: 'electrical_diag',
      title: 'Electrical diagnostic',
      category: 'Electric',
      price: 40,
      priceLabel: 'From $40',
      icon: Lightbulb,
      popular: true,
    },
    {
      id: 'pipe_leak',
      title: 'Pipe leak & fixture seal',
      category: 'Plumbing',
      price: 55,
      priceLabel: 'From $55',
      icon: Droplets,
    },
    {
      id: 'breaker_panel',
      title: 'Circuit breaker & fuse replacement',
      category: 'Electric',
      price: 65,
      priceLabel: 'From $65',
      icon: Zap,
    },
    {
      id: 'door_lock',
      title: 'Door lock & hinge replacement',
      category: 'Handyman',
      price: 35,
      priceLabel: 'From $35',
      icon: Wrench,
    },
    {
      id: 'wall_painting',
      title: 'Interior room painting',
      category: 'Painting',
      price: 110,
      priceLabel: 'From $110',
      icon: Paintbrush,
    },
  ];

  // Filter 4 popular services
  const popularServices = allServices.filter((s) => s.popular);

  // Dynamic live search results as user types characters
  const liveSearchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return allServices.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="flex flex-col h-full bg-[#F4F5F8] text-slate-900 select-none">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-7 pb-5 space-y-4">
        {/* Top Header with Fixly Branding & SOS Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FixlyLogo size="md" showText={true} />
          </div>

          <div className="flex items-center gap-2">
            {/* 1-Tap Emergency SOS Trigger */}
            <button
              onClick={onOpenSos}
              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold rounded-full flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
              title="1-Tap Emergency SOS Alert"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span>SOS</span>
            </button>

            <button
              onClick={onOpenNotifications}
              className="w-10 h-10 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-slate-700 stroke-[1.8]" />
            </button>
          </div>
        </div>

        {/* Location Chip with Ghana Post GPS & Landmark */}
        <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-600 min-w-0">
            <MapPin className="w-4 h-4 text-[#1E5BF0] shrink-0 stroke-[2]" />
            <div className="truncate">
              <span className="font-bold text-slate-900 block truncate">
                East Legon, Accra
              </span>
              <span className="text-[10px] text-slate-400 block font-mono truncate">
                GPS: {gpsCode} • Near Ankyiah Street
              </span>
            </div>
          </div>

          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
            Auto-GPS
          </span>
        </div>

        {/* Search Bar with live search & Filter Icon */}
        <div className="relative">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center px-3.5 py-3 gap-2.5 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
            <Search className="w-4 h-4 text-slate-400 shrink-0 stroke-[1.8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onNavigateToPros(searchQuery || undefined);
              }}
              placeholder="Search services, pros or zip"
              className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[10px] text-slate-400 hover:text-slate-600 px-1 font-bold"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={onOpenFilters}
              className="p-1 rounded-lg hover:bg-blue-50 text-slate-500 hover:text-[#1E5BF0] transition-colors cursor-pointer"
              title="Filter by proximity, rating, verified, insured..."
            >
              <SlidersHorizontal className="w-4 h-4 stroke-[1.8]" />
            </button>
          </div>

          {/* DYNAMIC LIVE SEARCH LIST: Displays as characters are entered */}
          {searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden divide-y divide-slate-100 animate-fade-in max-h-64 overflow-y-auto">
              <div className="px-3.5 py-2 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Matching Services ({liveSearchResults.length})</span>
                <span className="text-blue-600 font-semibold lowercase">Tap to book</span>
              </div>
              {liveSearchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No services matching "{searchQuery}". Try "plumbing", "electric", or "handyman".
                </div>
              ) : (
                liveSearchResults.map((srv) => {
                  const Icon = srv.icon;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => {
                        onSelectService(srv.title, srv.price);
                        setSearchQuery('');
                      }}
                      className="px-3.5 py-2.5 flex items-center justify-between hover:bg-blue-50/50 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#EBF1FF] text-[#1E5BF0] flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5 stroke-[2]" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 group-hover:text-[#1E5BF0] transition-colors block">
                            {srv.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {srv.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">
                          {srv.priceLabel}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1E5BF0] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* TWO ENTRY CARDS: Need Someone Now (On-Demand) vs. Plan a Project (Projects) */}
        <div className="grid grid-cols-2 gap-2.5">
          <div
            onClick={() => onSelectService('Urgent Plumbing / Electrical Fix', 50)}
            className="p-3.5 rounded-2xl bg-[#1E5BF0] text-white shadow-sm cursor-pointer hover:opacity-95 transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-blue-200 stroke-[2]" />
              <span className="text-[9px] font-bold bg-white/20 px-1.5 py-0.5 rounded text-white">
                RAPID
              </span>
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-white tracking-tight">
                Need someone now
              </h3>
              <span className="text-[10px] text-blue-100 block mt-0.5">
                On-demand fixed price
              </span>
            </div>
          </div>

          <div
            onClick={onNavigateToCategories}
            className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs cursor-pointer hover:border-blue-300 transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-2">
              <Layers className="w-5 h-5 text-[#1E5BF0] stroke-[2]" />
              <span className="text-[9px] font-bold bg-blue-50 text-[#1E5BF0] px-1.5 py-0.5 rounded">
                PROJECT
              </span>
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 tracking-tight">
                Plan a project
              </h3>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                POP, tiling, 40/40/20 stages
              </span>
            </div>
          </div>
        </div>

        {/* Horizontal Category Carousel */}
        <div className="grid grid-cols-4 gap-2 pt-0.5">
          {quickCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => onNavigateToPros(cat.label)}
                className="bg-white rounded-2xl border border-slate-200/80 p-3 flex flex-col items-center justify-center shadow-xs cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all group active:scale-95"
              >
                <div className="w-9 h-9 rounded-full bg-[#EBF1FF] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  <Icon className="w-4 h-4 text-[#1E5BF0] stroke-[2]" />
                </div>
                <span className="text-[11px] font-semibold text-slate-800 tracking-tight">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Promo Hero Banner (Royal Blue) */}
        <div
          onClick={onNavigateToCategories}
          className="bg-[#1E5BF0] text-white rounded-2xl p-4.5 cursor-pointer hover:opacity-98 transition-all shadow-sm relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Book a pro today
            </h3>
            <span className="bg-white/20 text-white font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
              NEW
            </span>
          </div>

          <p className="text-xs text-blue-100 font-medium mt-1 leading-snug">
            Get 20% off your first home service
          </p>

          <p className="text-[10px] text-blue-200/90 font-normal mt-3 tracking-tight">
            Verified pros • fast booking • clear pricing
          </p>
        </div>

        {/* Popular Services Section (4 Service Cards in 2x2 Grid) */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 tracking-tight">
              Popular services
            </h2>
            <button
              onClick={onNavigateToCategories}
              className="text-xs font-semibold text-[#1E5BF0] hover:underline cursor-pointer tracking-tight"
            >
              See all
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {popularServices.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  onClick={() => onSelectService(service.title, service.price)}
                  className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all flex flex-col justify-between group active:scale-98"
                >
                  <div className="w-8 h-8 rounded-full bg-[#EBF1FF] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4 text-[#1E5BF0] stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 tracking-tight leading-snug">
                      {service.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                      {service.priceLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar activeTab="home" onTabChange={onTabChange} />
    </div>
  );
};
