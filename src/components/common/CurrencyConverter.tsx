import React, { useState } from 'react';
import { DollarSign, ArrowRightLeft, Coins, Check, RefreshCw, X, Sparkles, Globe } from 'lucide-react';
import { formatCurrency, USD_TO_GHS_RATE, convertUsdToGhs, convertGhsToUsd } from '../../lib/currency';

interface CurrencyConverterProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialAmountUsd?: number;
  onSelectGhsAmount?: (ghsAmount: number) => void;
  className?: string;
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  isOpen = true,
  onClose,
  initialAmountUsd = 50,
  onSelectGhsAmount,
  className = '',
}) => {
  const [direction, setDirection] = useState<'USD_TO_GHS' | 'GHS_TO_USD'>('USD_TO_GHS');
  const [inputValue, setInputValue] = useState<string>(
    direction === 'USD_TO_GHS' ? initialAmountUsd.toString() : (initialAmountUsd * USD_TO_GHS_RATE).toString()
  );

  const numVal = parseFloat(inputValue) || 0;

  const convertedResult =
    direction === 'USD_TO_GHS' ? convertUsdToGhs(numVal) : convertGhsToUsd(numVal);

  const handleSwapDirection = () => {
    setDirection((prev) => (prev === 'USD_TO_GHS' ? 'GHS_TO_USD' : 'USD_TO_GHS'));
    setInputValue(convertedResult.toFixed(2));
  };

  const handleApplyGhs = () => {
    const finalGhs = direction === 'USD_TO_GHS' ? convertedResult : numVal;
    if (onSelectGhsAmount) {
      onSelectGhsAmount(finalGhs);
    }
    if (onClose) {
      onClose();
    }
  };

  const presetsUsd = [20, 50, 100, 250, 500];
  const presetsGhs = [300, 750, 1500, 3500, 7500];

  const content = (
    <div className={`bg-white rounded-3xl p-5 shadow-xl border border-slate-200/90 space-y-4 text-slate-900 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/80">
            <ArrowRightLeft className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Currency Converter</span>
              <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full uppercase">
                USD ↔ GHS
              </span>
            </h3>
            <span className="text-[11px] text-slate-500 block">
              Live rate: 1 USD = GHS {USD_TO_GHS_RATE.toFixed(2)}
            </span>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Converter Body */}
      <div className="space-y-3">
        {/* Input Box */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            {direction === 'USD_TO_GHS' ? 'Amount in USD ($):' : 'Amount in GHS (Cedi):'}
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 font-mono font-bold text-xs text-slate-400">
              {direction === 'USD_TO_GHS' ? '$' : 'GHS'}
            </span>
            <input
              type="number"
              min="0"
              step="any"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E5BF0]/40"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center my-1">
          <button
            onClick={handleSwapDirection}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 border border-slate-200"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#1E5BF0]" />
            <span>Swap Currency ({direction === 'USD_TO_GHS' ? 'USD to GHS' : 'GHS to USD'})</span>
          </button>
        </div>

        {/* Converted Output Display */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/90 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
              Equivalent Escrow Value
            </span>
            <span className="text-base font-extrabold font-mono text-slate-900">
              {direction === 'USD_TO_GHS'
                ? formatCurrency(convertedResult)
                : `$ ${convertedResult.toFixed(2)} USD`}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Standard FX Rate
            </span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 block">Quick Presets:</span>
          <div className="flex flex-wrap gap-1.5">
            {(direction === 'USD_TO_GHS' ? presetsUsd : presetsGhs).map((val) => (
              <button
                key={val}
                onClick={() => setInputValue(val.toString())}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-mono font-bold rounded-lg cursor-pointer transition-colors"
              >
                {direction === 'USD_TO_GHS' ? `$${val}` : `GHS ${val}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      {onSelectGhsAmount && (
        <button
          onClick={handleApplyGhs}
          className="w-full py-2.5 bg-[#1E5BF0] hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
        >
          <Check className="w-4 h-4" />
          <span>Apply {formatCurrency(direction === 'USD_TO_GHS' ? convertedResult : numVal)} to Escrow</span>
        </button>
      )}
    </div>
  );

  if (onClose) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
        <div className="max-w-sm w-full">{content}</div>
      </div>
    );
  }

  return content;
};
