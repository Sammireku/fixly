import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Gift,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Smartphone,
  Wallet,
} from 'lucide-react';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCode?: string;
  onApplyCode?: (code: string) => void;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({
  isOpen,
  onClose,
  userCode = 'FIXLY-AFIA-8821',
  onApplyCode,
}) => {
  const [copied, setCopied] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [redeemed, setRedeemed] = useState(false);
  const [redeemError, setRedeemError] = useState('');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(userCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) {
      setRedeemError('Please enter a valid referral code');
      return;
    }
    if (inputCode.trim().toUpperCase() === userCode.toUpperCase()) {
      setRedeemError('You cannot use your own referral code!');
      return;
    }

    setRedeemError('');
    setRedeemed(true);
    if (onApplyCode) onApplyCode(inputCode.trim().toUpperCase());
  };

  const shareText = `Use my Fixly code ${userCode} to get GH₵25 OFF your first home service fix in Accra! Download Fixly now: https://fixly.gh/invite/${userCode}`;

  const handleWhatsAppShare = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in select-none">
      <div className="bg-white rounded-3xl max-w-md w-full flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-900 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#F8F9FB]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#1E5BF0] text-white flex items-center justify-center shadow-xs">
              <Gift className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Invite Friends & Earn
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                Fixly Referral Rewards Program
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Promo Hero Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1E5BF0] to-blue-800 text-white space-y-2 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full text-white backdrop-blur-xs">
                GH₵25 + GH₵25 Bonus
              </span>
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>

            <h3 className="text-lg font-black text-white leading-snug">
              Give GH₵25, Get GH₵25
            </h3>

            <p className="text-xs text-blue-100 leading-relaxed font-medium">
              Share your referral code with friends in Ghana. They get <strong>GH₵25 off</strong> their first service, and you get <strong>GH₵25 wallet credit</strong> when they complete their first booking!
            </p>
          </div>

          {/* User Referral Code Card */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Your Personal Invite Code:
            </label>

            <div className="p-3 bg-slate-50 border-2 border-dashed border-blue-200 rounded-2xl flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 pl-1">
                <Gift className="w-4 h-4 text-[#1E5BF0]" />
                <span className="text-base font-black font-mono tracking-wider text-slate-900">
                  {userCode}
                </span>
              </div>

              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 bg-[#1E5BF0] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Direct Share Options */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleWhatsAppShare}
              className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Share via WhatsApp</span>
            </button>

            <button
              onClick={handleCopy}
              className="p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Copy Link</span>
            </button>
          </div>

          {/* Enter Friend's Code Section */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <label className="text-xs font-bold text-slate-800 block">
              Have a Friend's Referral Code?
            </label>

            {!redeemed ? (
              <form onSubmit={handleRedeem} className="flex gap-2">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="e.g. FIXLY-KWAME-9921"
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500 uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer"
                >
                  Apply
                </button>
              </form>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[3]" />
                <span>Code applied! GH₵25 discount will be applied at checkout.</span>
              </div>
            )}

            {redeemError && (
              <p className="text-[11px] font-semibold text-rose-600 pl-1">
                {redeemError}
              </p>
            )}
          </div>

          {/* Referral Earnings Stats Dashboard */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Your Referral Stats
            </span>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2 bg-white rounded-xl border border-slate-200/60">
                <span className="text-base font-black text-slate-900 block">3</span>
                <span className="text-[10px] text-slate-400 font-semibold block">Invited</span>
              </div>

              <div className="p-2 bg-white rounded-xl border border-slate-200/60">
                <span className="text-base font-black text-emerald-600 block">2</span>
                <span className="text-[10px] text-slate-400 font-semibold block">Completed</span>
              </div>

              <div className="p-2 bg-white rounded-xl border border-slate-200/60">
                <span className="text-base font-black text-[#1E5BF0] block">GH₵50</span>
                <span className="text-[10px] text-slate-400 font-semibold block">Earned</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-[#F8F9FB] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
