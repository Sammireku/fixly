import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  CreditCard,
  Smartphone,
  ChevronRight,
  Check,
} from 'lucide-react';
import { BottomNavBar } from './BottomNavBar';
import { BottomTabId } from './types';

interface Screen6WalletProps {
  onOpenNotifications?: () => void;
  onTabChange: (tab: BottomTabId) => void;
}

export const Screen6Wallet: React.FC<Screen6WalletProps> = ({
  onOpenNotifications,
  onTabChange,
}) => {
  const [balance, setBalance] = useState(128.5);
  const [selectedFund, setSelectedFund] = useState<number | null>(null);
  const [justAddedAmount, setJustAddedAmount] = useState<number | null>(null);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const fundOptions = [25.0, 50.0, 100.0, 200.0];

  const handleAddFund = (amt: number) => {
    setSelectedFund(amt);
    setBalance((prev) => prev + amt);
    setJustAddedAmount(amt);
    setTimeout(() => {
      setJustAddedAmount(null);
    }, 2200);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText('https://handyman.app/invite/maya-j');
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
              Wallet
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Payment methods
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

        {/* Royal Blue Balance Card */}
        <div className="bg-[#1E5BF0] text-white rounded-2xl p-4.5 shadow-sm space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-100 font-medium tracking-tight">
              Available balance
            </span>
            <span className="bg-white/20 text-white font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
              CASH
            </span>
          </div>

          <div className="pt-1">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              ${balance.toFixed(2)}
            </h2>
            <p className="text-[11px] text-blue-100 font-normal mt-1 tracking-tight">
              Use it for service deposits and tips
            </p>
          </div>

          {justAddedAmount && (
            <div className="absolute right-4 bottom-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-fade-in flex items-center gap-1 shadow-sm">
              <Check className="w-3 h-3" />
              <span>+${justAddedAmount.toFixed(2)} Added!</span>
            </div>
          )}
        </div>

        {/* Section: Add funds */}
        <div className="space-y-1.5 pt-1">
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            Add funds
          </h3>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {fundOptions.map((amt) => {
              const isSelected = selectedFund === amt;
              return (
                <div
                  key={amt}
                  onClick={() => handleAddFund(amt)}
                  className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors group"
                >
                  <span className="text-xs font-semibold text-slate-800 tracking-tight">
                    ${amt.toFixed(2)}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'text-[#1E5BF0]'
                        : 'text-slate-300 group-hover:text-slate-400'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[2]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section: Payment methods */}
        <div className="space-y-1.5 pt-1">
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            Payment methods
          </h3>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-slate-500 stroke-[1.8]" />
                <span className="text-xs font-medium text-slate-800 tracking-tight">
                  Visa ending in 4242
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </div>

            <div className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-slate-500 stroke-[1.8]" />
                <span className="text-xs font-medium text-slate-800 tracking-tight">
                  Apple Pay
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </div>
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

      {/* Bottom Navigation */}
      <BottomNavBar activeTab="wallet" onTabChange={onTabChange} />
    </div>
  );
};
