import React, { useState } from 'react';
import {
  Bell,
  ChevronRight,
  User,
  Calendar,
  Shield,
  HelpCircle,
  Check,
  Lock,
  DollarSign,
  Camera,
  Wrench,
  Sparkles,
} from 'lucide-react';
import { BottomNavBar } from './BottomNavBar';
import { BottomTabId, UserProfile } from './types';
import { GhanaCardBadge } from './GhanaCardBadge';

interface Screen5ProfileProps {
  profile: UserProfile;
  onOpenNotifications?: () => void;
  onOpenProfileSettings: () => void;
  onOpenBookingHistory: () => void;
  onSwitchToPro: () => void;
  onTabChange: (tab: BottomTabId) => void;
}

export const Screen5Profile: React.FC<Screen5ProfileProps> = ({
  profile,
  onOpenNotifications,
  onOpenProfileSettings,
  onOpenBookingHistory,
  onSwitchToPro,
  onTabChange,
}) => {
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [activeHelpModal, setActiveHelpModal] = useState<'safety' | 'help' | null>(null);

  const handleShare = () => {
    navigator.clipboard?.writeText(
      `https://handyman.app/invite/${profile.name.toLowerCase().replace(/\s+/g, '-')}`
    );
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#F4F5F8] text-slate-900 select-none">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-7 pb-5 space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-normal text-slate-400 block tracking-tight">
              Account
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Your profile
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

        {/* User Profile Card with Avatar & Ghana Card Verified Badge */}
        <div
          onClick={onOpenProfileSettings}
          className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between cursor-pointer hover:border-blue-300 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-xs"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#EBF1FF] text-[#1E5BF0] font-bold text-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {profile.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#1E5BF0] text-white flex items-center justify-center">
                <Camera className="w-2.5 h-2.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-xs font-bold text-slate-900 tracking-tight">
                  {profile.name}
                </h3>
                {profile.isGhanaCardVerified && <GhanaCardBadge size="sm" />}
              </div>
              <span className="text-[11px] text-slate-400 font-normal block mt-0.5 tracking-tight">
                {profile.email}
              </span>
              <span className="text-[10px] text-blue-600 font-medium block mt-0.5">
                Tap to edit profile & photo
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
        </div>

        {/* Mini Dashboard: Amount Spent & Amount in Escrow */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-700 tracking-tight uppercase">
              Financial Summary
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Escrow Protected
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-medium">Spent</span>
              <strong className="text-xs font-bold text-slate-900 mt-0.5 block">
                ${profile.amountSpent.toFixed(2)}
              </strong>
            </div>

            <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100">
              <div className="flex items-center gap-1 text-[10px] text-blue-700 font-medium">
                <Lock className="w-2.5 h-2.5 text-[#1E5BF0]" />
                <span>In Escrow</span>
              </div>
              <strong className="text-xs font-bold text-[#1E5BF0] mt-0.5 block">
                ${profile.amountInEscrow.toFixed(2)}
              </strong>
            </div>

            <div
              onClick={onOpenBookingHistory}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <span className="text-[10px] text-slate-400 block font-medium">Bookings</span>
              <strong className="text-xs font-bold text-slate-900 mt-0.5 block">
                {profile.completedBookingsCount} visits
              </strong>
            </div>
          </div>
        </div>

        {/* Menu Navigation Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {/* SWITCH TO PRO BUTTON */}
          <div
            onClick={onSwitchToPro}
            className="px-4 py-3.5 bg-blue-50/80 hover:bg-blue-100/80 flex items-center justify-between cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#1E5BF0] text-white flex items-center justify-center shrink-0">
                <Wrench className="w-3.5 h-3.5 stroke-[2]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 tracking-tight">
                    Switch to Pro
                  </span>
                  <span className="text-[9px] font-black bg-[#1E5BF0] text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    ARTISAN
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal block">
                  Earn money by providing home services & taking skill tests
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#1E5BF0] group-hover:translate-x-0.5 transition-all" />
          </div>

          <div
            onClick={onOpenProfileSettings}
            className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-slate-500 stroke-[1.8]" />
              <span className="text-xs font-medium text-slate-800 tracking-tight">
                Profile settings
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
          </div>

          <div
            onClick={onOpenBookingHistory}
            className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-slate-500 stroke-[1.8]" />
              <span className="text-xs font-medium text-slate-800 tracking-tight">
                Booking history
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-blue-50 text-[#1E5BF0] font-bold px-1.5 py-0.5 rounded">
                {profile.completedBookingsCount}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>

          <div
            onClick={() => setActiveHelpModal('safety')}
            className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-slate-500 stroke-[1.8]" />
              <span className="text-xs font-medium text-slate-800 tracking-tight">
                Safety & privacy
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
          </div>

          <div
            onClick={() => setActiveHelpModal('help')}
            className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-slate-500 stroke-[1.8]" />
              <span className="text-xs font-medium text-slate-800 tracking-tight">
                Help center
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        {/* Royal Blue Banner: Invite friends */}
        <div
          onClick={handleShare}
          className="bg-[#1E5BF0] text-white rounded-2xl p-4.5 cursor-pointer hover:opacity-98 transition-all shadow-sm relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Invite friends
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              className="bg-white/20 text-white font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs flex items-center gap-1 hover:bg-white/30 transition-colors"
            >
              {copiedInvite ? <Check className="w-2.5 h-2.5" /> : null}
              <span>{copiedInvite ? 'COPIED' : 'SHARE'}</span>
            </button>
          </div>

          <p className="text-xs text-blue-100 font-medium mt-1 leading-snug">
            Share Handyman and earn credits
          </p>

          <p className="text-[10px] text-blue-200/90 font-normal mt-3 tracking-tight">
            Verified pros • fast booking • clear pricing
          </p>
        </div>
      </div>

      {/* Safety & Help Modals */}
      {activeHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 capitalize">
              {activeHelpModal === 'safety'
                ? 'Safety & Privacy Guarantee'
                : 'Help & Customer Care'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {activeHelpModal === 'safety'
                ? 'All clients and artisans on Fixly are verified against the National Identification Authority (Ghana Card) biometric database. Payments remain protected in escrow until work is inspected and signed off.'
                : 'Need help with a pro or an active job? Our support operations team is available 24/7. Call +233 30 200 4400 or chat directly in the app.'}
            </p>
            <button
              onClick={() => setActiveHelpModal(null)}
              className="w-full py-2 bg-[#1E5BF0] hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavBar activeTab="account" onTabChange={onTabChange} />
    </div>
  );
};
