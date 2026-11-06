import React from 'react';
import { Bell, X, CheckCircle2, Tag, Wallet, Radio, ChevronRight } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBroadcastCenter?: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onOpenBroadcastCenter,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: '1',
      title: 'Artisan 2G Broadcast Sent',
      message: 'Job request sent via 2G SMS Shortcode (1400) & WhatsApp to plumbers in East Legon.',
      time: 'Just now',
      icon: Radio,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      id: '2',
      title: 'Booking Confirmed',
      message: 'Marcus Kim confirmed your Handyman visit for Today at 10:30 AM.',
      time: '10m ago',
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: '3',
      title: 'Special Promo Active',
      message: 'Get GH₵25 credit when you invite neighbors using your referral code.',
      time: '1h ago',
      icon: Tag,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      id: '4',
      title: 'Wallet Balance Pre-Funded',
      message: 'GH₵250.00 pre-authorized for Escrow lock upon artisan arrival.',
      time: 'Yesterday',
      icon: Wallet,
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bell className="w-4 h-4 stroke-[2]" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcut to Artisan SMS & WhatsApp Broadcast Center */}
        {onOpenBroadcastCenter && (
          <div
            onClick={() => {
              onClose();
              onOpenBroadcastCenter();
            }}
            className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex items-center justify-between cursor-pointer hover:border-blue-400 transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#1E5BF0] text-white flex items-center justify-center shrink-0">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Artisan SMS/WhatsApp Gateway
                </span>
                <span className="text-[10px] text-blue-600 font-medium">
                  Dispatch 2G SMS & simulate replies
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#1E5BF0] group-hover:translate-x-0.5 transition-transform" />
          </div>
        )}

        <div className="space-y-2.5 max-h-60 overflow-y-auto">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${n.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-900">{n.title}</h5>
                    <span className="text-[10px] text-slate-400">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                    {n.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

