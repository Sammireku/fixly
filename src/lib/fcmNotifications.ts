import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, doc, setDoc, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';

export interface FcmNotificationPayload {
  id: string;
  recipientUserId: string;
  recipientRole: 'client' | 'pro' | 'ops';
  title: string;
  body: string;
  type:
    | 'job_accepted'
    | 'job_requested'
    | 'job_arrived'
    | 'quote_submitted'
    | 'job_completed'
    | 'escrow_funded'
    | 'escrow_milestone_ready'
    | 'escrow_milestone_released'
    | 'escrow_refund'
    | 'quote_approved';
  jobId?: string;
  amount?: number;
  timestamp: string;
  read: boolean;
  data?: Record<string, string>;
}

let messagingInstance: any = null;
const NOTIF_STORAGE_KEY = 'fixly_push_notifications';
let titleBlinkInterval: any = null;
const ORIGINAL_DOCUMENT_TITLE = typeof document !== 'undefined' ? document.title || 'Fixly Ghana' : 'Fixly Ghana';

// Get stored push notifications
export function getStoredPushNotifications(): FcmNotificationPayload[] {
  try {
    const raw = localStorage.getItem(NOTIF_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Error reading stored push notifications:', err);
  }
  return [
    {
      id: 'notif-seed-1',
      recipientUserId: 'client-maya-johnson',
      recipientRole: 'client',
      title: 'Artisan Accepted Job #FLX-8821',
      body: 'Kwame Mensah (Plumbing Pro ⭐4.9) accepted your Kitchen Tap leak repair. En route to East Legon.',
      type: 'job_accepted',
      jobId: 'FLX-8821',
      amount: 180,
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: 'notif-seed-2',
      recipientUserId: 'client-maya-johnson',
      recipientRole: 'client',
      title: 'Escrow Milestone 1 Funded',
      body: 'GH₵1,430.00 securely locked in Fixly Escrow for POP False Ceiling project.',
      type: 'escrow_funded',
      jobId: 'PRJ-302',
      amount: 1430,
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      read: true,
    },
  ];
}

export function saveStoredPushNotifications(list: FcmNotificationPayload[]): void {
  try {
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(list.slice(0, 30)));
  } catch (err) {
    console.warn('Error storing push notifications:', err);
  }
}

// Stop title blink when user returns to app
if (typeof window !== 'undefined') {
  window.addEventListener('focus', () => {
    if (titleBlinkInterval) {
      clearInterval(titleBlinkInterval);
      titleBlinkInterval = null;
      document.title = ORIGINAL_DOCUMENT_TITLE;
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && titleBlinkInterval) {
      clearInterval(titleBlinkInterval);
      titleBlinkInterval = null;
      document.title = ORIGINAL_DOCUMENT_TITLE;
    }
  });
}

function flashDocumentTitle(alertText: string) {
  if (typeof document === 'undefined') return;
  if (titleBlinkInterval) clearInterval(titleBlinkInterval);

  let step = 0;
  titleBlinkInterval = setInterval(() => {
    document.title = step % 2 === 0 ? `🔔 ${alertText}` : ORIGINAL_DOCUMENT_TITLE;
    step++;
  }, 1200);
}

// Initialize FCM Messaging defensively
export async function initializeFcmMessaging(): Promise<boolean> {
  try {
    const supported = await isSupported();
    if (supported && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      messagingInstance = getMessaging();
      console.log('FCM Messaging initialized successfully.');
      return true;
    }
  } catch (err) {
    console.warn('FCM Messaging initialization notice (falling back to Firestore real-time push):', err);
  }
  return false;
}

// Request Notification permission
export async function requestFcmToken(userId: string, role: 'client' | 'pro'): Promise<string | null> {
  try {
    if (typeof window === 'undefined' || !('Notification' in window)) return null;

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const initialized = await initializeFcmMessaging();
      let fcmToken = `fcm_demo_token_${userId}_${Date.now()}`;

      if (initialized && messagingInstance) {
        try {
          const token = await getToken(messagingInstance, {
            vapidKey: 'BEl62iUYgUivxIkv69yViEuiC2ACTX2mO3_p_3xO_FIXLY_GHANA_DEMO',
          });
          if (token) fcmToken = token;
        } catch (e) {
          console.warn('FCM token generation notice:', e);
        }
      }

      // Save token to user record in Firestore
      if (db) {
        await setDoc(
          doc(db, 'users', userId),
          {
            fcmToken,
            notificationsEnabled: true,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }

      localStorage.setItem(`fixly_fcm_token_${userId}`, fcmToken);
      return fcmToken;
    }
  } catch (err) {
    console.warn('FCM Notification permission error:', err);
  }
  return null;
}

// Play notification chime using Web Audio API (no external asset needed)
export function playNotificationChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc1.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5

    osc2.frequency.setValueAtTime(293.66, ctx.currentTime);
    osc2.frequency.setValueAtTime(440, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.5);
    osc2.stop(ctx.currentTime + 0.5);
  } catch (e) {
    // Audio context may be blocked prior to user interaction
  }
}

// Trigger FCM / Browser Push Notification
export async function sendFcmNotification(
  payload: Omit<FcmNotificationPayload, 'id' | 'timestamp' | 'read'>
): Promise<FcmNotificationPayload> {
  const notifId = 'notif_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
  const notification: FcmNotificationPayload = {
    ...payload,
    id: notifId,
    timestamp: new Date().toISOString(),
    read: false,
  };

  // Play audio chime
  playNotificationChime();

  // Mobile vibration
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([200, 100, 200]);
    } catch (_) {}
  }

  // Save to local storage history
  const currentList = getStoredPushNotifications();
  saveStoredPushNotifications([notification, ...currentList]);

  // Flash document title if user is in background / not looking at app
  const isHidden = typeof document !== 'undefined' && document.hidden;
  if (isHidden) {
    flashDocumentTitle(notification.title);
  }

  // Trigger Native Browser Notification (works even when tab is minimized or hidden!)
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      const nativeNotif = new Notification(notification.title, {
        body: notification.body,
        icon: '/favicon.ico',
        tag: notification.jobId || notifId,
        requireInteraction: true,
      });

      nativeNotif.onclick = () => {
        window.focus();
        nativeNotif.close();
        window.dispatchEvent(
          new CustomEvent('fixly-notification-clicked', {
            detail: notification,
          })
        );
      };
    } catch (e) {
      console.warn('Native notification notice:', e);
    }
  }

  // Persist notification to Firestore for real-time delivery
  try {
    if (db) {
      await setDoc(doc(db, 'notifications', notifId), notification);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `notifications/${notifId}`);
  }

  // Dispatch custom window event for in-app floating banner & drawer
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('fixly-fcm-push', {
        detail: notification,
      })
    );
  }

  return notification;
}

/**
 * Triggers a simulated Artisan Accepted push alert
 */
export async function triggerArtisanAcceptedPush(
  jobId: string,
  jobTitle: string,
  proName = 'Kwame Mensah',
  location = 'East Legon (GA-492-3841)'
): Promise<FcmNotificationPayload> {
  return sendFcmNotification({
    recipientUserId: 'client-maya-johnson',
    recipientRole: 'client',
    title: `⚡ Artisan Accepted: ${proName}`,
    body: `${proName} (Verified Artisan ⭐4.9) accepted "${jobTitle}". En route to ${location}. Live GPS tracker active!`,
    type: 'job_accepted',
    jobId,
    data: {
      proName,
      location,
      trackingUrl: `https://fixly.gh/track/${jobId}`,
    },
  });
}

/**
 * Triggers an Escrow Update push alert (Funded, Released, or Approved)
 */
export async function triggerEscrowUpdatePush(
  type: 'escrow_funded' | 'escrow_milestone_ready' | 'escrow_milestone_released' | 'escrow_refund' | 'quote_approved',
  amount: number,
  milestoneTitle = 'Milestone 1: Surface Prep (40%)',
  jobId = 'PRJ-302',
  jobTitle = 'POP False Ceiling Project'
): Promise<FcmNotificationPayload> {
  let title = '🔒 Escrow Update';
  let body = `GH₵${amount.toFixed(2)} updated in Fixly Escrow.`;

  if (type === 'escrow_funded') {
    title = `🔒 Escrow Funded: GH₵${amount.toFixed(2)}`;
    body = `Your deposit for "${jobTitle}" is safely locked in Fixly Escrow. Artisan will receive payout upon your photo sign-off.`;
  } else if (type === 'escrow_milestone_ready') {
    title = `📸 Milestone Ready for Inspection`;
    body = `Artisan uploaded completion photos for "${milestoneTitle}". Tap to inspect and release GH₵${amount.toFixed(2)}.`;
  } else if (type === 'escrow_milestone_released') {
    title = `✅ Escrow Released: GH₵${amount.toFixed(2)}`;
    body = `You approved "${milestoneTitle}". GH₵${amount.toFixed(2)} disbursed to artisan via MTN MoMo escrow transfer.`;
  } else if (type === 'quote_approved') {
    title = `📋 Diagnostic Quote Approved: GH₵${amount.toFixed(2)}`;
    body = `Quote for "${jobTitle}" approved. Funds placed in Escrow protection.`;
  }

  return sendFcmNotification({
    recipientUserId: 'client-maya-johnson',
    recipientRole: 'client',
    title,
    body,
    type,
    jobId,
    amount,
    data: {
      amount: amount.toString(),
      milestoneTitle,
    },
  });
}

/**
 * Schedule a delayed background mock push notification so user can switch tabs to test
 */
export function scheduleDelayedBackgroundPush(
  delaySeconds: number,
  type: 'artisan_accepted' | 'escrow_update',
  onTick?: (remaining: number) => void
): Promise<FcmNotificationPayload> {
  return new Promise((resolve) => {
    let secondsLeft = delaySeconds;
    if (onTick) onTick(secondsLeft);

    const interval = setInterval(() => {
      secondsLeft--;
      if (onTick) onTick(secondsLeft);

      if (secondsLeft <= 0) {
        clearInterval(interval);
        if (type === 'artisan_accepted') {
          triggerArtisanAcceptedPush(
            'FLX-9921',
            'Overhead Polytank & Booster Pump Plumbing',
            'Kwame Mensah',
            'East Legon (GA-392-1049)'
          ).then(resolve);
        } else {
          triggerEscrowUpdatePush(
            'escrow_milestone_released',
            1430,
            'Milestone 1: Surface Prep & Framing (40%)',
            'PRJ-302',
            'POP Ceiling Renovation'
          ).then(resolve);
        }
      }
    }, 1000);
  });
}

// Subscribe to real-time FCM notifications for a user from Firestore
export function subscribeFcmNotifications(
  userId: string,
  onNewNotification: (notification: FcmNotificationPayload) => void
): () => void {
  try {
    if (db) {
      const q = query(
        collection(db, 'notifications'),
        where('recipientUserId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(10)
      );

      const unsub = onSnapshot(
        q,
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              const data = change.doc.data() as FcmNotificationPayload;
              const ageSeconds = (Date.now() - new Date(data.timestamp).getTime()) / 1000;
              if (ageSeconds < 60 && !data.read) {
                playNotificationChime();
                onNewNotification(data);
              }
            }
          });
        },
        (err) => {
          console.warn('FCM snapshot listener fallback notice:', err);
        }
      );

      return unsub;
    }
  } catch (e) {
    console.warn('Error setting up FCM snapshot listener:', e);
  }

  return () => {};
}
