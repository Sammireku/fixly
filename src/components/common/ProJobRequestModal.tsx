import React, { useState } from 'react';
import {
  ArrowLeft,
  X,
  Wrench,
  Plus,
  Check,
  Calendar,
  Clock,
  FileText,
  ShieldCheck,
  Send,
  AlertTriangle,
  ChevronDown,
  Sparkles,
  Trash2,
  Star,
  Share2,
  Zap,
  MessageCircle,
  ThumbsUp,
  CheckCircle2,
  Layers,
  MapPin,
  CalendarDays,
  UserCheck,
  Camera,
  Image as ImageIcon,
  CheckSquare,
  Square,
  Package,
  HardHat,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { ProItem } from '../handyman/types';
import { HANDYMAN_CATALOG, HandymanSubservice } from '../../data/handymanServicesCatalog';
import { formatCurrency } from '../../lib/currency';
import { GhanaCardBadge } from '../handyman/GhanaCardBadge';
import { getReviewsForPro, ProCustomerReview } from '../../data/proReviewsData';
import { getPortfolioForPro, ProPortfolioProject } from '../../data/proPortfolioData';

export interface CommonAddonItem {
  id: string;
  name: string;
  description: string;
  priceGhs: number;
  badge: string;
}

export const COMMON_ADDONS: CommonAddonItem[] = [
  {
    id: 'addon-tools',
    name: 'Bring Own Heavy Tools & Equipment',
    description: 'Artisan supplies specialized equipment (rotary hammer, pipe threader, laser level, angle grinder)',
    priceGhs: 35,
    badge: 'Equipment',
  },
  {
    id: 'addon-cleanup',
    name: 'Post-Job Deep Cleanup & Waste Bagging',
    description: 'Full sweeping, debris wipe-down, and packaging of residue into heavy-duty disposal sacks',
    priceGhs: 45,
    badge: 'Cleanup',
  },
  {
    id: 'addon-haul',
    name: 'Rubble & Scrap Material Haul-away',
    description: 'Off-site carting of old pipes, damaged tiles, plaster scrap, or drywall to licensed landfill',
    priceGhs: 75,
    badge: 'Disposal',
  },
  {
    id: 'addon-safety',
    name: 'Safety Isolation & Pressure/Voltage Verification',
    description: 'Dual diagnostic verification of stopcocks, pressure gauges, and circuit earth resistance tests',
    priceGhs: 30,
    badge: 'Safety',
  },
  {
    id: 'addon-express',
    name: 'Priority Fast-Track Dispatch Guarantee',
    description: 'Guarantees pro departure within 15 minutes with dedicated Fixly Operations monitoring',
    priceGhs: 40,
    badge: 'Express',
  },
];

interface ProJobRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  pro: ProItem | null;
  onSubmitRequest: (details: {
    primaryService: string;
    additionalSubservices: HandymanSubservice[];
    commonAddons?: string[];
    notes: string;
    arrivalWindow: string;
    totalGhs: number;
  }) => void;
}

export const ProJobRequestModal: React.FC<ProJobRequestModalProps> = ({
  isOpen,
  onClose,
  pro,
  onSubmitRequest,
}) => {
  if (!isOpen || !pro) return null;

  // Active top-level modal tab: 'request' or 'portfolio'
  const [activeModalTab, setActiveModalTab] = useState<'request' | 'portfolio'>('request');

  // Flatten all subservices for quick selection
  const allSubservices = HANDYMAN_CATALOG.flatMap((c) => c.services);

  // Default primary service based on pro trade category
  const matchingSubservice =
    allSubservices.find(
      (s) =>
        s.categoryName.toLowerCase().includes(pro.category.toLowerCase()) ||
        s.serviceName.toLowerCase().includes(pro.category.toLowerCase())
    ) || allSubservices[0];

  const [primaryServiceId, setPrimaryServiceId] = useState<string>(matchingSubservice.id);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [selectedCommonAddonIds, setSelectedCommonAddonIds] = useState<string[]>([
    'addon-tools', // Default: bring own tools enabled
  ]);
  const [jobNotes, setJobNotes] = useState<string>('');
  const [isAddonPickerOpen, setIsAddonPickerOpen] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Pro schedule availability toggle state (Real-time manage bookings)
  const [isProAvailable, setIsProAvailable] = useState<boolean>(true);
  const [scheduleToggleToast, setScheduleToggleToast] = useState<string | null>(null);

  // Interactive Availability Calendar Date & Time Slot selection
  const [selectedDateTab, setSelectedDateTab] = useState<'today' | 'tomorrow' | 'upcoming'>('today');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('09:00 AM - 10:30 AM (Urgent Slot)');
  const [arrivalWindow, setArrivalWindow] = useState<string>('Today • 09:00 AM - 10:30 AM (Urgent Slot)');

  // Quick Request Notification State
  const [quickRequestToast, setQuickRequestToast] = useState<boolean>(false);

  // Social Share State
  const [shareSuccessToast, setShareSuccessToast] = useState<string | null>(null);

  // Selected portfolio project preview modal state
  const [previewProject, setPreviewProject] = useState<ProPortfolioProject | null>(null);

  // Customer Reviews & Portfolio Projects
  const reviews: ProCustomerReview[] = getReviewsForPro(pro.id, pro.name, pro.category);
  const portfolioProjects: ProPortfolioProject[] = getPortfolioForPro(pro.id, pro.category);

  const currentPrimarySub =
    allSubservices.find((s) => s.id === primaryServiceId) || matchingSubservice;

  const selectedSubservicesList = allSubservices.filter((s) => selectedAddonIds.includes(s.id));

  // Base rate from pro or primary subservice
  const baseRate = Math.max(pro.hourlyRate || 0, currentPrimarySub.basePriceGhs || 0);
  const subservicesAddonsTotal = selectedSubservicesList.reduce(
    (acc, curr) => acc + curr.basePriceGhs,
    0
  );

  // Common Add-ons Total Calculation
  const commonAddonsTotal = COMMON_ADDONS.filter((item) =>
    selectedCommonAddonIds.includes(item.id)
  ).reduce((acc, curr) => acc + curr.priceGhs, 0);

  // Total Escrow Authorization
  const totalGhs = baseRate + subservicesAddonsTotal + commonAddonsTotal;

  // 40 / 40 / 20 Escrow Milestone Calculations dynamically reflecting add-ons
  const milestone1Amount = Math.round(totalGhs * 0.4);
  const milestone2Amount = Math.round(totalGhs * 0.4);
  const milestone3Amount = Math.max(0, totalGhs - milestone1Amount - milestone2Amount);

  const handleToggleSubserviceAddon = (id: string) => {
    if (id === primaryServiceId) return;
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRemoveSubserviceAddon = (id: string) => {
    setSelectedAddonIds((prev) => prev.filter((item) => item !== id));
  };

  const handleToggleCommonAddon = (id: string) => {
    setSelectedCommonAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 1-Tap Quick Request handler
  const handleQuickRequest = () => {
    setPrimaryServiceId(matchingSubservice.id);
    setSelectedAddonIds([]);
    setSelectedCommonAddonIds(['addon-tools']);
    setSelectedDateTab('today');
    const urgentSlot = 'Immediate (Within 45 mins) • Fast-Track';
    setSelectedTimeSlot(urgentSlot);
    setArrivalWindow(`Today • ${urgentSlot}`);
    setJobNotes(
      `Fast-track diagnostic request for ${matchingSubservice.serviceName}. Client requesting immediate on-site arrival and inspection.`
    );
    setQuickRequestToast(true);
    setTimeout(() => setQuickRequestToast(false), 3000);
  };

  // Toggle Pro Schedule handler
  const handleToggleSchedule = () => {
    const nextState = !isProAvailable;
    setIsProAvailable(nextState);
    const msg = nextState
      ? `Artisan is now ONLINE: Accepting instant dispatches & today's schedule.`
      : `Artisan schedule set to BUSY: Accepting advance bookings only.`;
    setScheduleToggleToast(msg);
    setTimeout(() => setScheduleToggleToast(null), 3000);
  };

  // Social Share handler (WhatsApp & Native Share)
  const handleSocialShare = () => {
    const shareUrl = `https://fixly.gh/pro/${pro.id}`;
    const shareText = `Check out ${pro.name} (${pro.category}, ${pro.rating.toFixed(1)}★, ${pro.experience}) on Fixly Ghana! Ghana Card verified master artisan with 40/40/20 Escrow Guarantee. Book directly at: ${shareUrl}`;

    if (navigator.share) {
      navigator
        .share({
          title: `${pro.name} - ${pro.category} on Fixly Ghana`,
          text: shareText,
          url: shareUrl,
        })
        .then(() => {
          setShareSuccessToast('Shared successfully!');
          setTimeout(() => setShareSuccessToast(null), 2500);
        })
        .catch(() => {
          openWhatsAppAndCopy(shareText);
        });
    } else {
      openWhatsAppAndCopy(shareText);
    }
  };

  const openWhatsAppAndCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    setShareSuccessToast('Profile link copied & opened WhatsApp!');
    setTimeout(() => setShareSuccessToast(null), 3000);
  };

  // Calendar time slots configuration
  const CALENDAR_SLOTS = {
    today: [
      { id: 't1', label: '09:00 AM - 10:30 AM', badge: '⚡ Urgent Slot', available: isProAvailable },
      { id: 't2', label: '11:30 AM - 01:00 PM', badge: 'Popular', available: isProAvailable },
      { id: 't3', label: '02:30 PM - 04:00 PM', badge: 'Afternoon', available: isProAvailable },
      { id: 't4', label: '04:30 PM - 06:00 PM', badge: 'Evening', available: isProAvailable },
    ],
    tomorrow: [
      { id: 'tm1', label: '09:00 AM - 10:30 AM', badge: 'Morning', available: true },
      { id: 'tm2', label: '11:00 AM - 12:30 PM', badge: 'Midday', available: true },
      { id: 'tm3', label: '02:00 PM - 03:30 PM', badge: 'Afternoon', available: true },
      { id: 'tm4', label: '04:00 PM - 05:30 PM', badge: 'Evening', available: true },
    ],
    upcoming: [
      { id: 'u1', label: '10:00 AM - 11:30 AM', badge: 'Morning Slot', available: true },
      { id: 'u2', label: '01:30 PM - 03:00 PM', badge: 'Afternoon Slot', available: true },
      { id: 'u3', label: '03:30 PM - 05:00 PM', badge: 'Evening Slot', available: true },
    ],
  };

  const handleSelectSlot = (dateLabel: string, slotText: string) => {
    setSelectedTimeSlot(slotText);
    setArrivalWindow(`${dateLabel} • ${slotText}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      const selectedCommonAddonNames = COMMON_ADDONS.filter((item) =>
        selectedCommonAddonIds.includes(item.id)
      ).map((item) => `${item.name} (${formatCurrency(item.priceGhs)})`);

      onSubmitRequest({
        primaryService: currentPrimarySub.serviceName,
        additionalSubservices: selectedSubservicesList,
        commonAddons: selectedCommonAddonNames,
        notes: jobNotes,
        arrivalWindow,
        totalGhs,
      });
      setIsSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-fade-in dark:bg-black/85">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        {/* Header Bar with Back Icon & Actions */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-[#F8F9FB] dark:bg-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-slate-200/70 dark:hover:bg-slate-700/70 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer transition-colors"
              title="Return to previous screen"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="w-8 h-8 rounded-xl bg-[#1E5BF0] text-white flex items-center justify-center font-bold shrink-0">
              <Wrench className="w-4 h-4" />
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                <span>Book {pro.name}</span>
                <span className="text-[10px] bg-blue-100 dark:bg-blue-900/60 text-[#1E5BF0] dark:text-blue-300 font-bold px-2 py-0.2 rounded-full">
                  {pro.category}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Customize services, add-ons & view verified portfolio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Social Share Button */}
            <button
              type="button"
              onClick={handleSocialShare}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Share pro profile via WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-700/60 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Toast Feedback (Share, Quick Request, Schedule) */}
        {shareSuccessToast && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between animate-fade-in shadow-inner">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{shareSuccessToast}</span>
            </div>
            <button onClick={() => setShareSuccessToast(null)} className="text-white/80 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {scheduleToggleToast && (
          <div className="bg-amber-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between animate-fade-in shadow-inner">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{scheduleToggleToast}</span>
            </div>
            <button onClick={() => setScheduleToggleToast(null)} className="text-white/80 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Pro Card Summary Banner with Schedule Toggle & Quick Request */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-800 text-white border-b border-slate-800">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-[#EBF1FF] text-[#1E5BF0] font-black text-sm flex items-center justify-center border-2 border-white/20 shrink-0">
                  {pro.initials}
                </div>
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                    isProAvailable ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  title={isProAvailable ? 'Available Now' : 'Busy on site'}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-white tracking-tight">{pro.name}</h4>
                  {pro.isGhanaCardVerified && <GhanaCardBadge size="sm" />}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
                  <span className="flex items-center gap-0.5 text-amber-300 font-bold">
                    <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                    {pro.rating.toFixed(1)}
                  </span>
                  <span>•</span>
                  <span>{pro.experience}</span>
                  <span>•</span>
                  <span>{pro.jobsCompleted} jobs</span>
                </div>
              </div>
            </div>

            {/* Fast-Track Actions */}
            <div className="flex flex-col items-end gap-1.5">
              <button
                type="button"
                onClick={handleToggleSchedule}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isProAvailable
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                }`}
                title="Toggle artisan active status"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isProAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span>{isProAvailable ? 'Available Now' : 'On Break / Busy'}</span>
                <span className="text-[9px] text-slate-400 ml-0.5 underline">Toggle</span>
              </button>

              <button
                type="button"
                onClick={handleQuickRequest}
                className="px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-[11px] rounded-lg shadow-sm flex items-center gap-1 cursor-pointer transition-transform active:scale-95"
                title="1-Tap Fast Track"
              >
                <Zap className="w-3 h-3 fill-slate-950" />
                <span>⚡ Quick Request</span>
              </button>
            </div>
          </div>

          {quickRequestToast && (
            <div className="mt-2.5 p-2 bg-amber-400/20 border border-amber-400/40 rounded-xl text-xs text-amber-200 font-bold flex items-center gap-2 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Quick Request applied: Top service & immediate arrival pre-filled!</span>
            </div>
          )}
        </div>

        {/* Modal Top Tab Switcher: "Request & Pricing" vs "Portfolio & Past Work" */}
        <div className="px-5 pt-2.5 pb-2 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveModalTab('request')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeModalTab === 'request'
                ? 'bg-[#1E5BF0] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Customize Request & Escrow</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModalTab('portfolio')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeModalTab === 'portfolio'
                ? 'bg-[#1E5BF0] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Verified Work Portfolio</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                activeModalTab === 'portfolio'
                  ? 'bg-white/20 text-white'
                  : 'bg-blue-100 dark:bg-blue-900/60 text-[#1E5BF0] dark:text-blue-300'
              }`}
            >
              {portfolioProjects.length}
            </span>
          </button>
        </div>

        {/* TAB 1: CUSTOMIZE REQUEST & ESCROW FORM */}
        {activeModalTab === 'request' ? (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* Step 1: Select Preferred Primary Service */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  1. Select Preferred Primary Service
                </label>
                <span className="text-[10px] text-slate-400 font-medium">17 Ghana Categories</span>
              </div>

              <div className="relative">
                <select
                  value={primaryServiceId}
                  onChange={(e) => setPrimaryServiceId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none pr-8"
                >
                  {HANDYMAN_CATALOG.map((cat) => (
                    <optgroup key={cat.id} label={`${cat.categoryNumber}. ${cat.categoryName}`}>
                      {cat.services.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.serviceName} ({sub.flowAndPriceModel}) — {formatCurrency(sub.basePriceGhs)}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800 rounded-xl flex items-start gap-2 text-xs">
                <Wrench className="w-4 h-4 text-[#1E5BF0] dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    {currentPrimarySub.serviceName}
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                    {currentPrimarySub.jobDescription}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold">
                      {currentPrimarySub.flowAndPriceModel}
                    </span>
                    {currentPrimarySub.safetyFlags.length > 0 && currentPrimarySub.safetyFlags[0] !== 'None' && (
                      <span className="text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {currentPrimarySub.safetyFlags.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Additional Subservices */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  2. Additional Subservices (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddonPickerOpen((prev) => !prev)}
                  className="text-xs text-[#1E5BF0] dark:text-blue-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddonPickerOpen ? 'Hide Subservices List' : 'Add Additional Job'}</span>
                </button>
              </div>

              {selectedSubservicesList.length > 0 ? (
                <div className="space-y-2">
                  {selectedSubservicesList.map((addon) => (
                    <div
                      key={addon.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">
                          + {addon.serviceName}
                        </span>
                        <span className="text-[10px] text-slate-400 block">{addon.categoryName}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-[#1E5BF0] dark:text-blue-400">
                          {formatCurrency(addon.basePriceGhs)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubserviceAddon(addon.id)}
                          className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer p-1"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                  No additional subservices added. Click "Add Additional Job" to append extras (e.g. tap replacement, socket fix).
                </p>
              )}

              {isAddonPickerOpen && (
                <div className="p-3.5 bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-2 max-h-48 overflow-y-auto">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Check extra subservices to add:
                  </span>
                  {allSubservices
                    .filter((s) => s.id !== primaryServiceId)
                    .slice(0, 15)
                    .map((sub) => {
                      const isChecked = selectedAddonIds.includes(sub.id);
                      return (
                        <div
                          key={sub.id}
                          onClick={() => handleToggleSubserviceAddon(sub.id)}
                          className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                            isChecked
                              ? 'border-[#1E5BF0] bg-blue-50 dark:bg-blue-950/50 dark:border-blue-500'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                                isChecked ? 'bg-[#1E5BF0] text-white' : 'border border-slate-300 dark:border-slate-600'
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white block">
                                {sub.serviceName}
                              </span>
                              <span className="text-[10px] text-slate-400">{sub.categoryName}</span>
                            </div>
                          </div>
                          <span className="font-bold text-[#1E5BF0] dark:text-blue-400">
                            {formatCurrency(sub.basePriceGhs)}
                          </span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* NEW: Step 3: Common Add-ons (Flat Fees) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#1E5BF0] dark:text-blue-400" />
                  <span>3. Common Add-ons (Flat Fee Upgrades)</span>
                </label>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                  {selectedCommonAddonIds.length} selected (+{formatCurrency(commonAddonsTotal)})
                </span>
              </div>

              <div className="space-y-2">
                {COMMON_ADDONS.map((addon) => {
                  const isChecked = selectedCommonAddonIds.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => handleToggleCommonAddon(addon.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        isChecked
                          ? 'border-[#1E5BF0] bg-blue-50/70 dark:bg-blue-950/40 dark:border-blue-500 shadow-2xs'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 shrink-0 text-[#1E5BF0] dark:text-blue-400">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 fill-[#1E5BF0] text-white" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {addon.name}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold uppercase">
                              {addon.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                            {addon.description}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-extrabold text-[#1E5BF0] dark:text-blue-400 shrink-0">
                        +{formatCurrency(addon.priceGhs)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Professional Availability Calendar & Specific Time Slots */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-[#1E5BF0] dark:text-blue-400" />
                  <span>4. Artisan Availability Calendar & Time Slots</span>
                </label>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  {isProAvailable ? '● Slots Open' : '● Tomorrow Only'}
                </span>
              </div>

              {/* Date Selection Tabs */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                {[
                  { id: 'today', label: 'Today (Nov 7)' },
                  { id: 'tomorrow', label: 'Tomorrow (Nov 8)' },
                  { id: 'upcoming', label: 'Mon (Nov 10)' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedDateTab(tab.id as any)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedDateTab === tab.id
                        ? 'bg-white dark:bg-slate-700 text-[#1E5BF0] dark:text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Time Slots Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CALENDAR_SLOTS[selectedDateTab].map((slot) => {
                  const isSelected = selectedTimeSlot.includes(slot.label);
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => {
                        const dateTitle =
                          selectedDateTab === 'today'
                            ? 'Today'
                            : selectedDateTab === 'tomorrow'
                            ? 'Tomorrow'
                            : 'Upcoming Mon';
                        handleSelectSlot(dateTitle, `${slot.label} (${slot.badge})`);
                      }}
                      className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                        !slot.available
                          ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/40'
                          : isSelected
                          ? 'border-[#1E5BF0] bg-blue-50 dark:bg-blue-950/60 text-[#1E5BF0] dark:text-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-bold leading-tight">{slot.label}</span>
                      </div>
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          isSelected
                            ? 'bg-[#1E5BF0] text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {slot.badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
                <span>Selected Window:</span>
                <strong className="text-slate-900 dark:text-white font-bold">{arrivalWindow}</strong>
              </div>
            </div>

            {/* Step 5: Job Notes & Special Instructions */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                5. Job Notes & Special Instructions for {pro.name}
              </label>
              <textarea
                rows={3}
                value={jobNotes}
                onChange={(e) => setJobNotes(e.target.value)}
                placeholder="Describe the issue, specific brand names (e.g. Polytank, Legrand sockets), access codes, or call preferences..."
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Step 6: Visual Progress Indicator for 40/40/20 Escrow Milestones */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3.5 border border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    40/40/20 Escrow Milestone Split
                  </h4>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                  100% Protected in Trust
                </span>
              </div>

              {/* Segmented Visual Progress Bar */}
              <div className="space-y-1">
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex p-0.5 gap-1">
                  <div
                    style={{ width: '40%' }}
                    className="h-full bg-blue-500 rounded-full transition-all"
                    title="Milestone 1: 40% Mobilization"
                  />
                  <div
                    style={{ width: '40%' }}
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    title="Milestone 2: 40% Workmanship"
                  />
                  <div
                    style={{ width: '20%' }}
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    title="Milestone 3: 20% Sign-off"
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold px-0.5">
                  <span className="text-blue-300">Stage 1: 40%</span>
                  <span className="text-indigo-300">Stage 2: 40%</span>
                  <span className="text-emerald-300">Stage 3: 20%</span>
                </div>
              </div>

              {/* Milestone Cards Breakdown */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-left">
                <div className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/80">
                  <span className="text-[10px] text-blue-300 font-bold block">1. Mobilization (40%)</span>
                  <strong className="text-xs font-extrabold text-white mt-0.5 block">
                    {formatCurrency(milestone1Amount)}
                  </strong>
                  <p className="text-[9px] text-slate-400 mt-1 leading-tight">
                    Released when pro arrives on site with tools.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/80">
                  <span className="text-[10px] text-indigo-300 font-bold block">2. Midpoint (40%)</span>
                  <strong className="text-xs font-extrabold text-white mt-0.5 block">
                    {formatCurrency(milestone2Amount)}
                  </strong>
                  <p className="text-[9px] text-slate-400 mt-1 leading-tight">
                    Released upon pipe/wire install check.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/80">
                  <span className="text-[10px] text-emerald-300 font-bold block">3. Sign-off (20%)</span>
                  <strong className="text-xs font-extrabold text-emerald-300 mt-0.5 block">
                    {formatCurrency(milestone3Amount)}
                  </strong>
                  <p className="text-[9px] text-slate-400 mt-1 leading-tight">
                    Released only after testing & 24-hr sign-off.
                  </p>
                </div>
              </div>

              {/* Itemized Total Breakdown */}
              <div className="pt-2 border-t border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Primary Service Base:</span>
                  <span>{formatCurrency(baseRate)}</span>
                </div>
                {selectedSubservicesList.length > 0 && (
                  <div className="flex items-center justify-between text-slate-400">
                    <span>{selectedSubservicesList.length} Additional Subservice(s):</span>
                    <span>+{formatCurrency(subservicesAddonsTotal)}</span>
                  </div>
                )}
                {selectedCommonAddonIds.length > 0 && (
                  <div className="flex items-center justify-between text-blue-300 font-medium">
                    <span>{selectedCommonAddonIds.length} Common Add-on(s):</span>
                    <span>+{formatCurrency(commonAddonsTotal)}</span>
                  </div>
                )}
                <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-slate-200 uppercase tracking-wider">
                    Total Escrow Authorization:
                  </span>
                  <span className="text-base font-black text-amber-300">{formatCurrency(totalGhs)}</span>
                </div>
              </div>
            </div>

            {/* Step 7: Verified Customer Reviews Section */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Verified Customer Reviews ({reviews.length})
                  </h4>
                </div>
                <div className="flex items-center gap-1 text-xs text-amber-500 font-extrabold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{pro.rating.toFixed(1)} Overall Rating</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2 transition-all hover:border-slate-300 dark:hover:border-slate-600"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <strong className="text-xs font-bold text-slate-900 dark:text-white">
                            {rev.clientName}
                          </strong>
                          {rev.isGhanaCardVerifiedClient && (
                            <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                              <span>Verified Client</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{rev.clientArea}</span>
                          <span>•</span>
                          <span>{rev.dateStr}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 shrink-0">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed italic">
                      "{rev.comment}"
                    </p>

                    <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Service: {rev.serviceCompleted}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                        <ThumbsUp className="w-2.5 h-2.5" />
                        <span>Workmanship Approved</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isSubmitted && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Job request sent directly to {pro.name} for confirmation!</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitted}
                className="px-6 py-2.5 bg-[#1E5BF0] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Request to {pro.name}</span>
              </button>
            </div>
          </form>
        ) : (
          /* TAB 2: VERIFIED WORK PORTFOLIO GALLERY */
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl space-y-2 border border-blue-800/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Field Verified Project Gallery
                </span>
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">
                  Accra & Tema Jobs
                </span>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed">
                Browse completed installations and repairs inspected by Fixly engineering field supervisors. Each project was released through our 40/40/20 milestone escrow with signed client handoffs.
              </p>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {portfolioProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Project Image Container */}
                    <div className="relative h-44 overflow-hidden bg-slate-950">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                      <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <span>{project.clientArea}</span>
                      </div>

                      <div className="absolute top-2.5 right-2.5 bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-slate-950" />
                        <span>{project.rating.toFixed(1)}</span>
                      </div>

                      <div className="absolute bottom-2.5 left-2.5 right-2.5">
                        <span className="text-[10px] text-blue-300 font-bold block uppercase tracking-wider">
                          {project.category} • {project.dateCompleted}
                        </span>
                        <h4 className="text-xs font-bold text-white line-clamp-1 leading-snug">
                          {project.title}
                        </h4>
                      </div>
                    </div>

                    {/* Details Body */}
                    <div className="p-3.5 space-y-2.5">
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                        {project.description}
                      </p>

                      {/* Scope Tags */}
                      <div className="flex flex-wrap gap-1">
                        {project.scopeItems.map((item, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-medium"
                          >
                            ✓ {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer & Select Action */}
                  <div className="p-3.5 pt-2 border-t border-slate-100 dark:border-slate-700/70 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Escrow Value:</span>
                      <strong className="text-xs font-extrabold text-slate-900 dark:text-white">
                        {formatCurrency(project.costGhs)}
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveModalTab('request');
                        setJobNotes(`Referencing portfolio project: "${project.title}" in ${project.clientArea}.`);
                      }}
                      className="px-3 py-1.5 bg-[#1E5BF0] hover:bg-blue-700 text-white text-[11px] font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
                    >
                      Book Similar Job
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pro Portfolio Upload Note */}
            <div className="p-3.5 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-1">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Are you an artisan on Fixly?
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                You can upload completed job photographs directly through the Fixly Artisan Console or WhatsApp field bot for inspector verification.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
