import React, { useState, useEffect } from 'react';
import {
  FcmNotificationPayload,
  requestFcmToken,
  triggerArtisanAcceptedPush,
  triggerEscrowUpdatePush,
  scheduleDelayedBackgroundPush,
} from '../../lib/fcmNotifications';
import {
  Bell,
  CheckCircle2,
  ShieldCheck,
  Wrench,
  X,
  Navigation,
  Coins,
  Camera,
  Play,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export const FcmToastBanner: React.FC = () => {
  const { currentUser, setActiveJobId } = useMarketplace();
  const [activeNotification, setActiveNotification] = useState<FcmNotificationPayload | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  });
  const [showPermissionPrompt, setShowPermissionPrompt] = useState<boolean>(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default';
  });
  const [delayedCountdown, setDelayedCountdown] = useState<number | null>(null);
  const [showTestControls, setShowTestControls] = useState(false);

  useEffect(() => {
    const handlePushEvent = (e: Event) => {
      const customEvent = e as CustomEvent<FcmNotificationPayload>;
      if (customEvent.detail) {
        const notif = customEvent.detail;
        setActiveNotification(notif);

        // Auto dismiss after 10 seconds
        setTimeout(() => {
          setActiveNotification((prev) => (prev?.id === notif.id ? null : prev));
        }, 10000);
      }
    };

    window.addEventListener('fixly-fcm-push', handlePushEvent);
    return () => window.removeEventListener('fixly-fcm-push', handlePushEvent);
  }, [currentUser]);

  const handleEnableNotifications = async () => {
    const token = await requestFcmToken(currentUser.id, currentUser.role as any);
    if (token || (typeof window !== 'undefined' && Notification.permission === 'granted')) {
      setPermissionGranted(true);
      setShowPermissionPrompt(false);
    }
  };

  const handleNotificationClick = () => {
    if (activeNotification?.jobId) {
      setActiveJobId(activeNotification.jobId);
    }
    setActiveNotification(null);
  };

  const handleStartDelayedTest = (type: 'artisan_accepted' | 'escrow_update') => {
    scheduleDelayedBackgroundPush(3, type, (remaining) => {
      setDelayedCountdown(remaining > 0 ? remaining : null);
    });
  };

  const getNotificationIcon = (type: FcmNotificationPayload['type']) => {
    switch (type) {
      case 'job_accepted':
        return <CheckCircle2 className="w-5 h-5 text-emerald-300" />;
      case 'escrow_funded':
      case 'escrow_milestone_released':
        return <Coins className="w-5 h-5 text-amber-300" />;
      case 'escrow_milestone_ready':
        return <Camera className="w-5 h-5 text-sky-300" />;
      case 'quote_approved':
        return <ShieldCheck className="w-5 h-5 text-purple-300" />;
      default:
        return <Navigation className="w-5 h-5 text-blue-300" />;
    }
  };

  return (
    <>
      {/* Delayed Background Notification Countdown Indicator */}
      {delayedCountdown !== null && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-full shadow-2xl border-2 border-amber-400 flex items-center gap-3 animate-pulse">
          <Clock className="w-5 h-5 text-amber-400 animate-spin" />
          <span className="text-xs font-bold">
            Switch tabs or minimize now! Alert fires in <span className="text-amber-400 text-sm font-extrabold">{delayedCountdown}s</span>...
          </span>
        </div>
      )}

      {/* Permission Opt-in Bar */}
      {showPermissionPrompt && (
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-4 py-2 flex items-center justify-between text-xs font-bold shadow-md border-b border-blue-700">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>Enable browser alerts for artisan arrivals & escrow releases even when tabbed away</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleEnableNotifications}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-1 rounded-lg text-[11px] font-extrabold cursor-pointer transition-colors shadow-xs"
            >
              Allow Browser Alerts
            </button>
            <button
              onClick={() => setShowPermissionPrompt(false)}
              className="p-1 hover:bg-blue-800 rounded text-slate-300 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Active Floating Alert Toast */}
      {activeNotification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border-2 border-amber-400 animate-slide-down flex flex-col gap-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-slate-800 border border-slate-700 rounded-xl">
                {getNotificationIcon(activeNotification.type)}
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  {activeNotification.type.replace('_', ' ')}
                </span>
                <h4 className="text-sm font-extrabold text-white leading-tight">
                  {activeNotification.title}
                </h4>
              </div>
            </div>
            <button
              onClick={() => setActiveNotification(null)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-snug pl-1 font-medium">
            {activeNotification.body}
          </p>

          <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px]">
            <span className="text-slate-500 font-mono">
              {new Date(activeNotification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleNotificationClick}
                className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-lg cursor-pointer transition-colors"
              >
                View Details →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
