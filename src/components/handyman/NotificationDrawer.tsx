import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  CheckCircle2,
  Tag,
  Wallet,
  Radio,
  ChevronRight,
  Coins,
  Camera,
  Play,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  getStoredPushNotifications,
  FcmNotificationPayload,
  triggerArtisanAcceptedPush,
  triggerEscrowUpdatePush,
  scheduleDelayedBackgroundPush,
} from '../../lib/fcmNotifications';

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
  const [notifications, setNotifications] = useState<FcmNotificationPayload[]>([]);
  const [delayCountdown, setDelayCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setNotifications(getStoredPushNotifications());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestTabSwitchAlert = (type: 'artisan_accepted' | 'escrow_update') => {
    scheduleDelayedBackgroundPush(3, type, (sec) => {
      setDelayCountdown(sec > 0 ? sec : null);
    }).then((notif) => {
      setNotifications(getStoredPushNotifications());
    });
  };

  const getNotifIcon = (type: FcmNotificationPayload['type']) => {
    switch (type) {
      case 'job_accepted':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'escrow_funded':
      case 'escrow_milestone_released':
        return <Coins className="w-4 h-4 text-amber-600" />;
      case 'escrow_milestone_ready':
        return <Camera className="w-4 h-4 text-sky-600" />;
      default:
        return <Bell className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bell className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Push Notifications</h3>
              <span className="text-[10px] text-slate-500 block">
                Real-time & background alerts
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Background Alert Simulator Card */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Test Background Alerts
            </span>
            <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
              Switch Tabs in 3s
            </span>
          </div>
          <p className="text-[10px] text-amber-800 leading-tight">
            Click a test below, then switch to another browser tab or minimize to see the native alert pop up!
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => handleTestTabSwitchAlert('artisan_accepted')}
              className="px-2.5 py-1.5 bg-white border border-amber-300 rounded-xl text-[10px] font-bold text-slate-800 hover:bg-amber-100 cursor-pointer transition-colors flex items-center justify-center gap-1 shadow-2xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Artisan Accepts (3s)</span>
            </button>
            <button
              onClick={() => handleTestTabSwitchAlert('escrow_update')}
              className="px-2.5 py-1.5 bg-white border border-amber-300 rounded-xl text-[10px] font-bold text-slate-800 hover:bg-amber-100 cursor-pointer transition-colors flex items-center justify-center gap-1 shadow-2xs"
            >
              <Coins className="w-3.5 h-3.5 text-amber-600" />
              <span>Escrow Release (3s)</span>
            </button>
          </div>

          {delayCountdown !== null && (
            <div className="text-center py-1 bg-amber-200/60 rounded-lg text-[10px] font-extrabold text-amber-900 animate-pulse flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              <span>Switch tabs now! Firing in {delayCountdown}s...</span>
            </div>
          )}
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

        {/* Notification list */}
        <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs font-medium">
              No push notifications yet
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-2xl border flex items-start gap-3 transition-colors ${
                  n.read ? 'bg-slate-50/70 border-slate-100' : 'bg-blue-50/40 border-blue-200'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                  {getNotifIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h5 className="text-xs font-bold text-slate-900 truncate">{n.title}</h5>
                    <span className="text-[9px] text-slate-400 font-mono shrink-0">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                    {n.body}
                  </p>
                  {n.amount && (
                    <span className="inline-block mt-1 font-mono text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                      GH₵ {n.amount.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors shrink-0"
        >
          Close
        </button>
      </div>
    </div>
  );
};

