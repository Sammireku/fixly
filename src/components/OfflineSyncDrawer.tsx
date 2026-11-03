import React from 'react';
import { useOffline } from '../context/OfflineContext';
import { useLanguage } from '../context/LanguageContext';
import { usePreventScroll } from '../hooks/usePreventScroll';
import { NetworkMode } from '../types';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Trash2,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  Database,
  Smartphone,
} from 'lucide-react';

export const OfflineSyncDrawer: React.FC = () => {
  const {
    networkMode,
    setNetworkMode,
    queuedMutations,
    clearQueue,
    syncPendingQueue,
    isSyncing,
    lastSyncedAt,
    drawerOpen,
    setDrawerOpen,
    pendingVoiceNotesCount,
  } = useOffline();
  const { t, speakPrompt } = useLanguage();
  usePreventScroll(drawerOpen);

  if (!drawerOpen) return null;

  const modes: { id: NetworkMode; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'online',
      label: 'Online (Broadband / 4G)',
      desc: 'Instant cloud synchronization and real-time radar matching',
      icon: <Wifi className="w-4 h-4 text-emerald-600" />,
      color: 'border-emerald-500 bg-emerald-50/50',
    },
    {
      id: 'patchy',
      label: 'Patchy Network (2G / Edge)',
      desc: 'Simulates underground compound or rainy day signal drops',
      icon: <Wifi className="w-4 h-4 text-amber-600" />,
      color: 'border-amber-500 bg-amber-50/50',
    },
    {
      id: 'offline',
      label: 'Completely Offline',
      desc: 'Photos & quotes queue locally; zero mobile data consumption',
      icon: <WifiOff className="w-4 h-4 text-rose-600" />,
      color: 'border-rose-500 bg-rose-50/50',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Network & Offline Queue</h3>
              <p className="text-[11px] text-slate-500">
                Low-connectivity tolerance for Ghanaian field conditions
              </p>
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Network Mode Simulator */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/70">
          <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">
            Simulate Connection State:
          </label>
          <div className="space-y-2">
            {modes.map((m) => {
              const active = networkMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setNetworkMode(m.id);
                    if (m.id === 'offline') {
                      speakPrompt('voice_offline_warning');
                    }
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    active ? `${m.color} ring-1 ring-amber-500` : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white border border-slate-200">{m.icon}</div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{m.label}</span>
                      <span className="text-[11px] text-slate-500 block leading-tight">{m.desc}</span>
                    </div>
                  </div>
                  {active && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      ACTIVE
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sync Controls & Info */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div>
            <span className="text-xs text-slate-500 block">
              Last Synced: <strong className="text-slate-700">{lastSyncedAt ? lastSyncedAt.toLocaleTimeString() : 'Never'}</strong>
            </span>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
              <span>Mutations: <strong className="text-amber-600">{queuedMutations.length}</strong></span>
              <span>·</span>
              <span>IndexedDB Audio: <strong className="text-indigo-600">{pendingVoiceNotesCount}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={syncPendingQueue}
              disabled={isSyncing || (queuedMutations.length === 0 && pendingVoiceNotesCount === 0) || networkMode === 'offline'}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Cloud'}</span>
            </button>

            {queuedMutations.length > 0 && (
              <button
                onClick={clearQueue}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                title="Clear local offline queue"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Queued Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {queuedMutations.length === 0 ? (
            <div className="text-center py-12 px-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
              <h4 className="text-sm font-bold text-slate-800">Queue is Clear</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                All status updates, photos, and quotes are in sync with Google Cloud & Firebase.
              </p>
            </div>
          ) : (
            queuedMutations.map((mut) => (
              <div
                key={mut.id}
                className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {mut.action.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {JSON.stringify(mut.payload).slice(0, 60)}...
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Queued: {new Date(mut.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded shrink-0">
                  {mut.status}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Low-Data Mode Note */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            Fixly automatically defers large photo uploads until Wi-Fi or strong 4G is detected to preserve artisan data airtime.
          </span>
        </div>
      </div>
    </div>
  );
};
