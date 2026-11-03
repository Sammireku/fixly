import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useLanguage } from '../context/LanguageContext';
import { usePreventScroll } from '../hooks/usePreventScroll';
import { UserRole } from '../types';
import { UserCheck, Wrench, ShieldAlert, Check, X, PhoneCall } from 'lucide-react';

interface RoleSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSelectorModal: React.FC<RoleSelectorModalProps> = ({ isOpen, onClose }) => {
  const { activeRole, setActiveRole, currentUser } = useMarketplace();
  const { t } = useLanguage();
  usePreventScroll(isOpen);

  if (!isOpen) return null;

  const roles: {
    id: UserRole;
    title: string;
    subtitle: string;
    badge: string;
    icon: React.ReactNode;
    features: string[];
    sampleUser: string;
  }[] = [
    {
      id: 'client',
      title: 'Homeowner / Client',
      subtitle: 'Residents & diaspora clients managing home fixes in Accra',
      badge: 'Protected Escrow & Fixed Prices',
      icon: <UserCheck className="w-6 h-6 text-amber-600" />,
      features: [
        'On-demand emergency booking (Plumbing, Electrical, AC)',
        'Price locked before work starts + 5% Escrow Protection',
        'Live GPS tracking, masked contact & diaspora progress links',
        'Approve itemized quotes and release funds after 24h hold',
      ],
      sampleUser: 'Afia Addo (East Legon)',
    },
    {
      id: 'pro',
      title: 'Pro Artisan (Handyman)',
      subtitle: 'Vetted informal tradespeople with high-tactile, voice-guided UI',
      badge: 'Guaranteed Payouts & WhatsApp Receipts',
      icon: <Wrench className="w-6 h-6 text-emerald-600" />,
      features: [
        'Incoming dispatch radar with 40s countdown and audio alerts',
        'GPS check-in arrival & tap-to-add parts quote builder',
        'Works offline in low-connectivity with auto-sync queue',
        'Earnings wallet with instant Mobile Money cashout',
      ],
      sampleUser: 'Kwame Mensah (Plumbing Pro · 58 Jobs)',
    },
    {
      id: 'ops',
      title: 'Dispute & Ops Admin',
      subtitle: 'Platform verification, mediation console & safety monitoring',
      badge: 'Claims Waterfall & SOS Dispatch',
      icon: <ShieldAlert className="w-6 h-6 text-purple-600" />,
      features: [
        'Ghana Card and association trade verification queue',
        'Side-by-side evidence viewer (Before/After photos, GPS, Chat)',
        'Mediation decision engine: Rework order vs. Payout waterfall',
        'Live SOS emergency beacon dashboard with location pins',
      ],
      sampleUser: 'Samuel Mireku (Operations Lead)',
    },
  ];

  const handleSelectRole = (role: UserRole) => {
    setActiveRole(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 overflow-hidden relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Select Fixly Perspective</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Experience the marketplace from each user viewpoint with full interactive features.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {roles.map((r) => {
            const isSelected = activeRole === r.id;
            return (
              <div
                key={r.id}
                onClick={() => handleSelectRole(r.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/50 shadow-sm ring-1 ring-amber-500'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                      {r.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">{r.title}</h3>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {r.sampleUser}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{r.subtitle}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-2 border-t border-slate-100/80">
                  {r.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Currently logged in as: <strong className="text-slate-800">{currentUser.name}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
