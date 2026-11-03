/**
 * IndexedDB storage manager for offline voice note recordings in Fixly.
 * Enables storing high-fidelity audio blobs and transcripts when low/no connectivity,
 * auto-syncing to Firestore once connection is restored.
 */

export interface OfflineAudioItem {
  id: string;
  jobId?: string;
  senderRole?: 'client' | 'pro';
  transcript: string;
  audioDataUri?: string; // Base64 representation of recorded audio
  nuances?: {
    detectedUrgency?: string;
    detectedAcoustics?: string[];
    extractedKeywords?: string[];
    confidence?: number;
    durationSeconds?: number;
  };
  durationSeconds: number;
  timestamp: number;
  status: 'pending' | 'synced';
  type: 'task_description' | 'chat_voicenote' | 'quote_audio';
}

const DB_NAME = 'fixly_audio_offline_db';
const STORE_NAME = 'voice_notes_queue';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('IndexedDB open error:', event);
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

/**
 * Save a voice note audio item to IndexedDB queue.
 */
export async function saveOfflineAudioItem(
  item: Omit<OfflineAudioItem, 'id' | 'timestamp' | 'status'> & { id?: string }
): Promise<OfflineAudioItem> {
  const db = await openDB();
  const fullItem: OfflineAudioItem = {
    ...item,
    id: item.id || `vn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    status: 'pending',
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(fullItem);

    req.onsuccess = () => resolve(fullItem);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Retrieve all pending (unsynced) offline voice notes from IndexedDB.
 */
export async function getPendingAudioItems(): Promise<OfflineAudioItem[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('status');
    const req = index.getAll('pending');

    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Mark a voice note item as synced.
 */
export async function markAudioItemSynced(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(id);

    getReq.onsuccess = () => {
      const item: OfflineAudioItem = getReq.result;
      if (item) {
        item.status = 'synced';
        const updateReq = store.put(item);
        updateReq.onsuccess = () => resolve();
        updateReq.onerror = () => reject(updateReq.error);
      } else {
        resolve();
      }
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

/**
 * Remove synced items from IndexedDB store to save memory.
 */
export async function clearSyncedAudioItems(): Promise<void> {
  const db = await openDB();
  const pending = await getPendingAudioItems();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    // Keep pending, clear all items
    const clearReq = store.clear();
    clearReq.onsuccess = async () => {
      // Re-insert pending items if any
      for (const item of pending) {
        store.put(item);
      }
      resolve();
    };
    clearReq.onerror = () => reject(clearReq.error);
  });
}

/**
 * Get count of pending voice notes in IndexedDB.
 */
export async function getPendingAudioCount(): Promise<number> {
  try {
    const items = await getPendingAudioItems();
    return items.length;
  } catch {
    return 0;
  }
}
