import React, { createContext, useContext, useState, useEffect } from 'react';
import { NetworkMode, QueuedMutation } from '../types';
import {
  saveOfflineAudioItem,
  getPendingAudioItems,
  markAudioItemSynced,
  getPendingAudioCount,
  OfflineAudioItem,
} from '../lib/audioOfflineStorage';

interface OfflineContextType {
  networkMode: NetworkMode;
  setNetworkMode: (mode: NetworkMode) => void;
  queuedMutations: QueuedMutation[];
  enqueueMutation: (action: QueuedMutation['action'], payload: any) => void;
  clearQueue: () => void;
  syncPendingQueue: () => Promise<void>;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  pendingVoiceNotesCount: number;
  enqueueOfflineVoiceNote: (
    note: Omit<OfflineAudioItem, 'id' | 'timestamp' | 'status'>
  ) => Promise<OfflineAudioItem>;
  syncPendingVoiceNotes: () => Promise<number>;
}

const OfflineContext = createContext<OfflineContextType>({
  networkMode: 'online',
  setNetworkMode: () => {},
  queuedMutations: [],
  enqueueMutation: () => {},
  clearQueue: () => {},
  syncPendingQueue: async () => {},
  isSyncing: false,
  lastSyncedAt: null,
  drawerOpen: false,
  setDrawerOpen: () => {},
  pendingVoiceNotesCount: 0,
  enqueueOfflineVoiceNote: async () => ({}) as any,
  syncPendingVoiceNotes: async () => 0,
});

export const OfflineProvider: React.FC<{
  children: React.ReactNode;
  onFlushMutation?: (mutation: QueuedMutation) => Promise<boolean>;
}> = ({ children, onFlushMutation }) => {
  const [networkMode, setNetworkModeState] = useState<NetworkMode>(() => {
    return (localStorage.getItem('fixly_network_mode') as NetworkMode) || 'online';
  });

  const [queuedMutations, setQueuedMutations] = useState<QueuedMutation[]>(() => {
    try {
      const saved = localStorage.getItem('fixly_offline_queue');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(new Date());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pendingVoiceNotesCount, setPendingVoiceNotesCount] = useState<number>(0);

  // Sync state to local storage & refresh pending voice note count
  useEffect(() => {
    localStorage.setItem('fixly_offline_queue', JSON.stringify(queuedMutations));
  }, [queuedMutations]);

  const refreshPendingAudioCount = async () => {
    try {
      const count = await getPendingAudioCount();
      setPendingVoiceNotesCount(count);
    } catch {
      setPendingVoiceNotesCount(0);
    }
  };

  useEffect(() => {
    refreshPendingAudioCount();
  }, []);

  // Listen to browser online event
  useEffect(() => {
    const handleOnline = () => {
      if (networkMode !== 'offline') {
        triggerAutoSync();
        syncPendingVoiceNotes();
      }
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [networkMode]);

  const setNetworkMode = (mode: NetworkMode) => {
    setNetworkModeState(mode);
    localStorage.setItem('fixly_network_mode', mode);
    if (mode === 'online') {
      triggerAutoSync();
      syncPendingVoiceNotes();
    }
  };

  const enqueueOfflineVoiceNote = async (
    note: Omit<OfflineAudioItem, 'id' | 'timestamp' | 'status'>
  ) => {
    const saved = await saveOfflineAudioItem(note);
    await refreshPendingAudioCount();

    if (networkMode === 'online') {
      // Sync immediately if online
      setTimeout(() => {
        syncPendingVoiceNotes();
      }, 500);
    }
    return saved;
  };

  const syncPendingVoiceNotes = async (): Promise<number> => {
    try {
      const pendingNotes = await getPendingAudioItems();
      if (pendingNotes.length === 0) return 0;

      setIsSyncing(true);
      // Simulate real-time upload to Firestore collection
      for (const note of pendingNotes) {
        await new Promise((r) => setTimeout(r, 400));
        await markAudioItemSynced(note.id);
      }

      await refreshPendingAudioCount();
      setIsSyncing(false);
      setLastSyncedAt(new Date());
      return pendingNotes.length;
    } catch (err) {
      console.warn('Error syncing pending voice notes:', err);
      setIsSyncing(false);
      return 0;
    }
  };

  const enqueueMutation = (action: QueuedMutation['action'], payload: any) => {
    const newMutation: QueuedMutation = {
      id: 'mut_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      action,
      payload,
      timestamp: Date.now(),
      status: networkMode === 'online' ? 'synced' : 'pending',
      retryCount: 0,
    };

    setQueuedMutations((prev) => [newMutation, ...prev]);

    // If online, immediately resolve
    if (networkMode === 'online') {
      setTimeout(() => {
        setQueuedMutations((prev) => prev.filter((m) => m.id !== newMutation.id));
        setLastSyncedAt(new Date());
      }, 600);
    }
  };

  const triggerAutoSync = async () => {
    if ((queuedMutations.length === 0 && pendingVoiceNotesCount === 0) || isSyncing) return;
    setIsSyncing(true);

    // Simulate batch network handshake and processing
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (onFlushMutation) {
      for (const mut of queuedMutations) {
        try {
          await onFlushMutation(mut);
        } catch (err) {
          console.warn('Sync item error:', err);
        }
      }
    }

    await syncPendingVoiceNotes();

    setQueuedMutations([]);
    setIsSyncing(false);
    setLastSyncedAt(new Date());
  };

  const syncPendingQueue = async () => {
    if (networkMode === 'offline') {
      alert('Cannot sync while offline. Switch network simulator to Online or Patchy first.');
      return;
    }
    await triggerAutoSync();
  };

  const clearQueue = () => {
    setQueuedMutations([]);
    localStorage.removeItem('fixly_offline_queue');
  };

  return (
    <OfflineContext.Provider
      value={{
        networkMode,
        setNetworkMode,
        queuedMutations,
        enqueueMutation,
        clearQueue,
        syncPendingQueue,
        isSyncing,
        lastSyncedAt,
        drawerOpen,
        setDrawerOpen,
        pendingVoiceNotesCount,
        enqueueOfflineVoiceNote,
        syncPendingVoiceNotes,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => useContext(OfflineContext);
