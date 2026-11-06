import React, { useEffect, useState } from 'react';
import {
  Bell,
  Briefcase,
  MapPin,
  CreditCard,
  Clock,
  ShieldCheck,
  Lock,
  Radio,
  Smartphone,
  MessageSquare,
  ChevronRight,
  Check,
  Zap,
  CornerDownRight,
} from 'lucide-react';
import { BottomNavBar } from './BottomNavBar';
import { BottomTabId, BookingState } from './types';
import { GhanaCardBadge } from './GhanaCardBadge';
import {
  autoDispatchJobBroadcastIfOptedIn,
  getArtisanBroadcastPreference,
  simulateArtisanSmsReply,
  JobBroadcastRecord,
} from '../../lib/smsWhatsappService';

interface Screen4ConfirmationProps {
  booking?: BookingState;
  onEditBooking?: () => void;
  onOpenNotifications?: () => void;
  onOpenBroadcastCenter?: () => void;
  onTabChange: (tab: BottomTabId) => void;
}

export const Screen4Confirmation: React.FC<Screen4ConfirmationProps> = ({
  booking = {
    serviceName: 'Handyman visit',
    proName: 'Marcus Kim',
    proInitials: 'MK',
    duration: '2 hours',
    address: 'East Legon (GA-492-3841), Accra',
    paymentMethod: 'MTN MoMo (+233 24 412 8891)',
    total: 120.0,
    escrowAmount: 120.0,
    arrivalWindow: '10:30 AM – 11:30 AM',
    status: 'Confirmed',
    dateStr: 'Today • 10:30 AM',
    isGhanaCardVerified: true,
  },
  onEditBooking,
  onOpenNotifications,
  onOpenBroadcastCenter,
  onTabChange,
}) => {
  const [autoDispatchStatus, setAutoDispatchStatus] = useState<{
    dispatched: boolean;
    record?: JobBroadcastRecord;
    reason?: string;
  }>({ dispatched: false });

  const [simulatedReply, setSimulatedReply] = useState<string | null>(null);

  // AUTOMATIC BROADCAST TRIGGER:
  // When booking confirms, automatically dispatch 2G SMS / WhatsApp broadcast
  // if artisan has opted in for this service/trade.
  useEffect(() => {
    const syntheticJob = {
      id: `bkg-${booking.serviceName.toLowerCase().replace(/\s+/g, '-')}-001`,
      clientId: 'client-maya',
      clientName: 'Maya Johnson',
      clientPhone: '+233 24 412 8891',
      trade: 'plumbing' as const,
      type: 'on_demand' as const,
      title: booking.serviceName,
      description: `Visit by ${booking.proName} at ${booking.address}`,
      urgency: 'now' as const,
      status: 'requested' as const,
      basePrice: booking.total,
      protectionFee: 6.0,
      totalAmount: booking.total,
      platformFee: 15.0,
      poolFee: 3.0,
      netProEarnings: booking.total - 18,
      location: {
        lat: 5.6354,
        lng: -0.1582,
        address: booking.address,
        ghanaPostGps: 'GA-492-3841',
        landmark: 'American House / A&C Mall',
        area: 'East Legon',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = autoDispatchJobBroadcastIfOptedIn(
      syntheticJob,
      booking.proName,
      '+233 24 551 8840'
    );
    setAutoDispatchStatus(res);
  }, [booking]);

  const handleSimulateReply = (keyword: 'YES' | 'NO') => {
    if (autoDispatchStatus.record) {
      const updated = simulateArtisanSmsReply(autoDispatchStatus.record.id, keyword);
      if (updated) {
        setAutoDispatchStatus((prev) => ({ ...prev, record: updated }));
        setSimulatedReply(
          `Artisan replied "${keyword}" via 2G SMS Shortcode. Status: ${updated.status}`
        );
        setTimeout(() => setSimulatedReply(null), 4000);
      }
    }
  };

  const pref = getArtisanBroadcastPreference();

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
            <span>GH₵{booking.total.toFixed(2)} held safely in Fixly Escrow until your sign-off</span>
          </div>

          {/* Divider & Total */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-normal tracking-tight">
              Estimated total
            </span>
            <span className="text-base font-extrabold text-slate-900 tracking-tight">
              GH₵{booking.total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* AUTOMATED ARTISAN 2G BROADCAST CARD (OPT-IN TRIGGERED) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-blue-50 text-[#1E5BF0] flex items-center justify-center shrink-0">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Automated 2G SMS Dispatch
                </h4>
                <span className="text-[10px] text-slate-400 font-medium">
                  Triggered because artisan opted into offline broadcast
                </span>
              </div>
            </div>

            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                pref.optedIn
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {pref.optedIn ? 'AUTO-DISPATCHED' : 'OPTED OUT'}
            </span>
          </div>

          {pref.optedIn ? (
            <>
              <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Artisan {booking.proName} Opt-In Active ({pref.channel})</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-snug">
                  An automated 2G SMS alert was immediately transmitted to {pref.phone} via Telco Shortcode 1400. The artisan can accept by texting "{autoDispatchStatus.record?.smsReplyCode || 'YES'}" without needing internet access.
                </p>
              </div>

              {/* Message preview snippet */}
              {autoDispatchStatus.record && (
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono text-slate-800 leading-relaxed">
                  <strong>Beamed via SMS Shortcode 1400:</strong>
                  <div className="mt-1 whitespace-pre-wrap text-slate-700">
                    {autoDispatchStatus.record.messageText}
                  </div>
                </div>
              )}

              {/* Inbound Reply Status */}
              {autoDispatchStatus.record?.artisanReply && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                  <div className="flex items-center gap-1.5">
                    <CornerDownRight className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      <strong>Artisan Inbound SMS:</strong> {autoDispatchStatus.record.artisanReply}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    {autoDispatchStatus.record.status.toUpperCase()}
                  </span>
                </div>
              )}

              {/* Reply Simulator Trigger */}
              <div className="pt-1 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-500">Test Artisan SMS:</span>
                  <button
                    type="button"
                    onClick={() => handleSimulateReply('YES')}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg cursor-pointer transition-colors shadow-2xs"
                  >
                    Simulate "YES"
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateReply('NO')}
                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] rounded-lg cursor-pointer transition-colors shadow-2xs"
                  >
                    Simulate "NO"
                  </button>
                </div>

                {onOpenBroadcastCenter && (
                  <button
                    type="button"
                    onClick={onOpenBroadcastCenter}
                    className="text-[11px] font-bold text-[#1E5BF0] hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Broadcast Logs</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {simulatedReply && (
                <div className="p-2 bg-emerald-100/70 text-emerald-950 rounded-lg text-[11px] font-medium flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>{simulatedReply}</span>
                </div>
              )}
            </>
          ) : (
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
              This artisan has disabled automated 2G broadcasts and relies exclusively on in-app notifications.
            </div>
          )}
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


