import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, doc, setDoc, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';

export interface FcmNotificationPayload {
  id: string;
  recipientUserId: string;
  recipientRole: 'client' | 'pro' | 'ops';
  title: string;
  body: string;
  type: 'job_accepted' | 'job_requested' | 'job_arrived' | 'quote_submitted' | 'job_completed';
  jobId?: string;
  timestamp: string;
  read: boolean;
  data?: Record<string, string>;
}

let messagingInstance: any = null;

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

// Request FCM Notification permission and save token
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
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc1.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5

    osc2.frequency.setValueAtTime(293.66, ctx.currentTime);
    osc2.frequency.setValueAtTime(440, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
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

// Trigger FCM Notification push event to specific user
export async function sendFcmNotification(payload: Omit<FcmNotificationPayload, 'id' | 'timestamp' | 'read'>): Promise<FcmNotificationPayload> {
  const notifId = 'notif_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
  const notification: FcmNotificationPayload = {
    ...payload,
    id: notifId,
    timestamp: new Date().toISOString(),
    read: false,
  };

  // Play audio chime
  playNotificationChime();

  // Try Native Browser Notification if allowed
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(notification.title, {
        body: notification.body,
        icon: '/favicon.ico',
        tag: notification.jobId || notifId,
      });
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

  // Dispatch custom window event for in-app toast
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('fixly-fcm-push', {
        detail: notification,
      })
    );
  }

  return notification;
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
              // Check if notification is recent (within 1 minute)
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
