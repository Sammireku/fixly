import React, { useState } from 'react';
import {
  X,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Receipt,
  Search,
} from 'lucide-react';
import { BookingHistoryItem } from './types';
import { GhanaCardBadge } from './GhanaCardBadge';
import { formatCurrency } from '../../lib/currency';

interface BookingHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingHistoryItem[];
  onRebook: (booking: BookingHistoryItem) => void;
}

export const BookingHistoryModal: React.FC<BookingHistoryModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onRebook,
}) => {
  const [filterTerm, setFilterTerm] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<BookingHistoryItem | null>(null);

  if (!isOpen) return null;

  const filtered = bookings.filter(
    (b) =>
      b.serviceTitle.toLowerCase().includes(filterTerm.toLowerCase()) ||
      b.proName.toLowerCase().includes(filterTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(filterTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#F8F9FB]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EBF1FF] text-[#1E5BF0] flex items-center justify-center">
              <Calendar className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Booking History
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                {bookings.length} verified home visits & project jobs
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

        {/* Filter Input */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterTerm}
              onChange={(e) => setFilterTerm(e.target.value)}
              placeholder="Filter by job, artisan name, or trade..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* List of Bookings */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No booking records matching "{filterTerm}"
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 rounded-2xl p-4 transition-all space-y-3"
              >
                {/* Top Row: Service Title & Status */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#1E5BF0] uppercase tracking-wider block">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                      {item.serviceTitle}
                    </h4>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {item.date} • {item.address}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'In Escrow'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 block mt-1">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                </div>

                {/* Middle Row: Pro Info & Ghana Card Badge */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#EBF1FF] text-[#1E5BF0] font-bold text-xs flex items-center justify-center shrink-0">
                      {item.proInitials}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800">
                        {item.proName}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Rating: {item.proRating} ★
                      </span>
                    </div>
                  </div>

                  {item.isGhanaCardVerified && (
                    <GhanaCardBadge size="sm" />
                  )}
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => setSelectedReceipt(item)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5 text-slate-500" />
                    <span>Receipt</span>
                  </button>

                  <button
                    onClick={() => {
                      onRebook(item);
                      onClose();
                    }}
                    className="px-3.5 py-1.5 bg-[#1E5BF0] hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Rebook</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-[#F8F9FB] flex items-center justify-between text-xs text-slate-500">
          <span>All completed payments backed by Fixly Escrow Warranty.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>

      {/* Mini Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4 animate-fade-in text-slate-900">
            <div className="text-center pb-3 border-b border-dashed border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Official Receipt & Escrow Sign-off
              </span>
              <h4 className="text-lg font-black text-slate-900 mt-1">
                Handyman Pro
              </h4>
              <span className="text-[10px] text-slate-400">
                Transaction ID: TX-{selectedReceipt.id}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Service:</span>
                <span className="font-bold text-slate-900">{selectedReceipt.serviceTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pro Artisan:</span>
                <span className="font-bold text-slate-900">{selectedReceipt.proName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date:</span>
                <span>{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment:</span>
                <span>{selectedReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100 font-extrabold text-sm">
                <span>Amount Paid:</span>
                <span className="text-[#1E5BF0]">{formatCurrency(selectedReceipt.price)}</span>
              </div>
            </div>

            <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 text-[11px] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Escrow released after client 100% problem solved confirmation.</span>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
