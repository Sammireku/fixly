import React from 'react';
import { ShieldCheck, Check } from 'lucide-react';

interface GhanaCardBadgeProps {
  idNumber?: string;
  size?: 'sm' | 'md';
  showDetails?: boolean;
}

export const GhanaCardBadge: React.FC<GhanaCardBadgeProps> = ({
  idNumber = 'GHA-72019482-1',
  size = 'sm',
  showDetails = false,
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full font-bold tracking-tight border transition-all ${
        size === 'sm'
          ? 'px-2 py-0.5 text-[10px] bg-emerald-50 text-emerald-800 border-emerald-200/80 shadow-2xs'
          : 'px-2.5 py-1 text-xs bg-emerald-50 text-emerald-900 border-emerald-200 shadow-xs'
      }`}
      title={`National ID Verified: ${idNumber} (NIA Ghana Biometric Match)`}
    >
      <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
        <Check className="w-2.5 h-2.5 stroke-[3]" />
      </div>
      <span className="font-semibold text-emerald-900">Ghana Card Verified</span>
      {showDetails && (
        <span className="text-[10px] text-emerald-700/80 font-mono pl-1 border-l border-emerald-200">
          {idNumber}
        </span>
      )}
    </div>
  );
};
