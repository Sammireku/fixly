import React, { useState, useEffect } from 'react';
import { FcmNotificationPayload, requestFcmToken } from '../../lib/fcmNotifications';
import { Bell, BellOff, CheckCircle2, ShieldCheck, Wrench, X, Sparkles, Navigation } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export const FcmToastBanner: React.FC = () => {
  const { currentUser, setActiveJobId, setActiveRole } = useMarketplace();
  const [activeNotification, setActiveNotification] = useState<FcmNotificationPayload | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  });
  const [showPermissionPrompt, setShowPermissionPrompt] = useState<boolean>(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default';
  });

  useEffect(() => {
    const handlePushEvent = (e: Event) => {
      const customEvent = e as CustomEvent<FcmNotificationPayload>;
      if (customEvent.detail) {
        // Show notification toast if it belongs to current user or active role
        const notif = customEvent.detail;
        if (
          notif.recipientUserId === currentUser.id ||
          (currentUser.role === 'pro' && notif.type === 'job_requested') ||
          (currentUser.role === 'client' && notif.type === 'job_accepted')
        ) {
          setActiveNotification(notif);
          // Auto dismiss after 8 seconds
          setTimeout(() => {
            setActiveNotification((prev) => (prev?.id === notif.id ? null : prev));
          }, 8000);
        }
      }
    };

    window.addEventListener('fixly-fcm-push', handlePushEvent);
    return () => window.removeEventListener('fixly-fcm-push', handlePushEvent);
  }, [currentUser]);

  const handleEnableNotifications = async () => {
    const token = await requestFcmToken(currentUser.id, currentUser.role as any);
    if (token || Notification.permission === 'granted') {
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

  return (
    <>
      {/* Top Notification Permission Opt-In Banner (Non-intrusive) */}
      {showPermissionPrompt && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-4 py-2 flex items-center justify-between text-xs font-bold shadow-md animate-fade-in border-b border-amber-600">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-950 animate-bounce" />
            <span>Enable Real-Time FCM Push Notifications for Instant Artisan Dispatch Alerts</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleEnableNotifications}
              className="bg-slate-950 hover:bg-slate-900 text-amber-400 px-3 py-1 rounded-lg text-[11px] font-extrabold cursor-pointer transition-colors shadow-xs"
            >
              Allow Notifications
            </button>
            <button
              onClick={() => setShowPermissionPrompt(false)}
              className="p-1 hover:bg-amber-600/50 rounded text-slate-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Real-time Push Toast Alert Card */}
      {activeNotification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border-2 border-amber-500 animate-slide-down flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500 text-slate-950 rounded-xl font-bold">
                {activeNotification.type === 'job_accepted' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : activeNotification.type === 'job_requested' ? (
                  <Wrench className="w-5 h-5" />
                ) : (
                  <Navigation className="w-5 h-5" />
                )}
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  ⚡ FCM Push Notification
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
            <button
              onClick={handleNotificationClick}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-lg cursor-pointer transition-colors"
            >
              View Job Status →
            </button>
          </div>
        </div>
      )}
    </>
  );
};
