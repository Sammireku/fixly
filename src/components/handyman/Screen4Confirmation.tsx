import React from 'react';
import {
  Bell,
  Briefcase,
  MapPin,
  CreditCard,
  Clock,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { BottomNavBar } from './BottomNavBar';
import { BottomTabId, BookingState } from './types';
import { GhanaCardBadge } from './GhanaCardBadge';

interface Screen4ConfirmationProps {
  booking?: BookingState;
  onEditBooking?: () => void;
  onOpenNotifications?: () => void;
  onTabChange: (tab: BottomTabId) => void;
}

export const Screen4Confirmation: React.FC<Screen4ConfirmationProps> = ({
  booking = {
    serviceName: 'Handyman visit',
    proName: 'Marcus Kim',
    proInitials: 'MK',
    duration: '2 hours',
    address: '123 Oak Street, Austin, TX 78701',
    paymentMethod: 'Visa ending in 4242',
    total: 120.0,
    escrowAmount: 120.0,
    arrivalWindow: '10:30 AM – 11:30 AM',
    status: 'Confirmed',
    dateStr: 'Today • 10:30 AM',
    isGhanaCardVerified: true,
  },
  onEditBooking,
  onOpenNotifications,
  onTabChange,
}) => {
  return (
    <div className="flex flex-col h-full bg-[#F4F5F8] text-slate-900 select-none">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-7 pb-5 space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-normal text-slate-400 block tracking-tight">
              Booking
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Confirmation
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

        {/* Primary Confirmation Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3.5">
          {/* Status badge & timestamp */}
          <div className="flex items-center justify-between">
            <span className="bg-[#EBF7EE] text-[#1E9E49] font-bold text-[11px] px-2.5 py-0.5 rounded-full">
              {booking.status}
            </span>
            <span className="text-[11px] text-slate-400 font-medium tracking-tight">
              {booking.dateStr}
            </span>
          </div>

          {/* Service details */}
          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#EBF1FF] flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4 text-[#1E5BF0] stroke-[2]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                  {booking.serviceName}
                </h4>
                <span className="text-[11px] text-slate-400 font-normal block mt-0.5">
                  {booking.proName} • {booking.duration}
                </span>
              </div>
            </div>

            {booking.isGhanaCardVerified && (
              <GhanaCardBadge size="sm" />
            )}
          </div>

          {/* Address */}
          <div className="flex items-center gap-2.5 text-xs text-slate-600">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 stroke-[1.8]" />
            <span className="tracking-tight text-[11px] text-slate-600 font-normal">
              {booking.address}
            </span>
          </div>

          {/* Payment Method */}
          <div className="flex items-center gap-2.5 text-xs text-slate-600">
            <CreditCard className="w-4 h-4 text-slate-400 shrink-0 stroke-[1.8]" />
            <span className="tracking-tight text-[11px] text-slate-600 font-normal">
              {booking.paymentMethod}
            </span>
          </div>

          {/* Escrow Banner Note */}
          <div className="p-2.5 bg-blue-50/70 border border-blue-200/70 rounded-xl flex items-center gap-2 text-[11px] text-blue-900">
            <Lock className="w-3.5 h-3.5 text-[#1E5BF0] shrink-0" />
            <span>${booking.total.toFixed(2)} held safely in Fixly Escrow until your sign-off</span>
          </div>

          {/* Divider & Total */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-normal tracking-tight">
              Estimated total
            </span>
            <span className="text-base font-extrabold text-slate-900 tracking-tight">
              ${booking.total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Booking Details Section */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 tracking-tight">
              Booking details
            </h2>
            <button
              onClick={onEditBooking}
              className="text-xs font-semibold text-[#1E5BF0] hover:underline cursor-pointer tracking-tight"
            >
              Edit
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs space-y-3">
            {/* Arrival window */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#EBF1FF] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-[#1E5BF0] stroke-[2]" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900 tracking-tight">
                  Arrival window
                </h5>
                <span className="text-[10px] text-slate-400 font-normal block mt-0.5">
                  {booking.arrivalWindow}
                </span>
              </div>
            </div>

            {/* Safety check */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#EBF1FF] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-[#1E5BF0] stroke-[2]" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900 tracking-tight">
                  Safety check
                </h5>
                <span className="text-[10px] text-slate-400 font-normal block mt-0.5">
                  Background verified • ID confirmed (Ghana Card Match)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Royal Blue Banner: Need changes? */}
        <div
          onClick={onEditBooking}
          className="bg-[#1E5BF0] text-white rounded-2xl p-4.5 cursor-pointer hover:opacity-98 transition-all shadow-sm relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Need changes?
            </h3>
            <span className="bg-white/20 text-white font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
              EDIT
            </span>
          </div>

          <p className="text-xs text-blue-100 font-medium mt-1 leading-snug">
            Update your booking before the visit
          </p>

          <p className="text-[10px] text-blue-200/90 font-normal mt-3 tracking-tight">
            Verified pros • fast booking • clear pricing
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar activeTab="bookings" onTabChange={onTabChange} />
    </div>
  );
};
