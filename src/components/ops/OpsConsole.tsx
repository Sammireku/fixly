import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useLanguage } from '../../context/LanguageContext';
import { DisputeRecord, SosAlert } from '../../types';
import {
  ShieldAlert,
  AlertTriangle,
  FileText,
  UserCheck,
  CheckCircle2,
  XCircle,
  RefreshCw,
  PhoneCall,
  MapPin,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const OpsConsole: React.FC = () => {
  const { disputes, resolveDispute, sosAlerts, resolveSos, allUsers } = useMarketplace();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'disputes' | 'sos' | 'vetting'>('disputes');
  const [selectedDisputeId, setSelectedDisputeId] = useState<string>(disputes[0]?.id || '');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const selectedDispute = disputes.find((d) => d.id === selectedDisputeId) || disputes[0];

  const handleResolve = (action: 'rework_ordered' | 'partial_refund' | 'full_refund' | 'released_to_pro') => {
    if (!selectedDispute) return;
    resolveDispute(selectedDispute.id, {
      action,
      notes: resolutionNotes || `Action ${action} executed by Ops supervisor.`,
      resolvedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-12 animate-fade-in">
      {/* Ops Admin Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-600 text-white shadow-xs">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">Fixly Operations & Trust Console</h2>
            <p className="text-xs text-slate-400">
              Dispute mediation, Claims Waterfall execution, and 24/7 SOS safety incidents
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-slate-800 text-purple-300 px-3 py-1.5 rounded-lg border border-slate-700">
            SLA: 24h Pro / 48h Ops
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('disputes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'disputes' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Disputes Queue ({disputes.filter((d) => d.status !== 'resolved').length})
        </button>

        <button
          onClick={() => setActiveTab('sos')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'sos' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>SOS Beacons ({sosAlerts.filter((s) => s.status === 'active').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('vetting')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'vetting' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Artisan Vetting Queue
        </button>
      </div>

      {/* TAB 1: DISPUTES & CLAIMS MEDIATION */}
      {activeTab === 'disputes' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Dispute List */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Dispute Cases:
            </label>
            {disputes.map((d) => (
              <div
                key={d.id}
                onClick={() => setSelectedDisputeId(d.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedDispute?.id === d.id
                    ? 'border-purple-600 bg-purple-50/50 ring-1 ring-purple-600'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400">{d.id}</span>
                  <span
                    className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      d.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {d.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-1 truncate">{d.jobTitle}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 capitalize">
                  Issue: {d.category.replace(/_/g, ' ')}
                </p>
              </div>
            ))}
          </div>

          {/* Evidence Viewer & Decision Engine (2 cols) */}
          <div className="md:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            {selectedDispute ? (
              <>
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-purple-700 uppercase bg-purple-50 px-2 py-0.5 rounded">
                      Case Evidence & Timeline
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">
                      {selectedDispute.jobTitle}
                    </h3>
                    <span className="text-xs text-slate-500">
                      Filed by: <strong>{selectedDispute.initiatorName}</strong> ({selectedDispute.initiatorRole})
                    </span>
                  </div>

                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 capitalize">
                    Desired: {selectedDispute.desiredOutcome.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Evidence Details */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <span className="font-bold text-slate-800 block">Client Statement:</span>
                  <p className="text-slate-600">{selectedDispute.description}</p>

                  {selectedDispute.proResponse && (
                    <div className="pt-2 border-t border-slate-200">
                      <span className="font-bold text-slate-800 block">Pro Response:</span>
                      <p className="text-slate-600">{selectedDispute.proResponse}</p>
                    </div>
                  )}
                </div>

                {/* Evidence Photo Thumbnails */}
                {selectedDispute.evidencePhotos.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-slate-700 block mb-1">
                      Submitted Photographic Evidence:
                    </span>
                    <div className="flex items-center gap-2">
                      {selectedDispute.evidencePhotos.map((photo, i) => (
                        <div key={i} className="w-28 h-20 rounded-xl overflow-hidden border border-slate-200">
                          <img src={photo} alt="evidence" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Claims Waterfall Decision Buttons */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                    Mediation Ruling (Claims Waterfall):
                  </label>

                  <input
                    type="text"
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Enter official written decision rationale for client and pro..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <button
                      onClick={() => handleResolve('rework_ordered')}
                      className="py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      Order Rework (5 Days)
                    </button>
                    <button
                      onClick={() => handleResolve('partial_refund')}
                      className="py-2.5 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      Partial Refund (50%)
                    </button>
                    <button
                      onClick={() => handleResolve('full_refund')}
                      className="py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      Full Refund to Client
                    </button>
                    <button
                      onClick={() => handleResolve('released_to_pro')}
                      className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      Dismiss & Release Escrow
                    </button>
                  </div>

                  {selectedDispute.opsResolution && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 mt-2">
                      <strong>Ruling Executed:</strong> {selectedDispute.opsResolution.action} —{' '}
                      {selectedDispute.opsResolution.notes}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400">Select a dispute case on the left.</div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LIVE SOS INCIDENTS */}
      {activeTab === 'sos' && (
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Live Emergency Beacons in Accra:
          </label>

          {sosAlerts.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
              <h4 className="text-sm font-bold text-slate-800">Zero Active Emergency Beacons</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                All field jobs in Accra are operating safely without distress signals.
              </p>
            </div>
          ) : (
            sosAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  alert.status === 'active'
                    ? 'border-rose-500 bg-rose-50/70 shadow-sm'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-600 text-white">
                    <AlertTriangle className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{alert.userName}</h4>
                      <span className="text-[10px] font-bold uppercase text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
                        {alert.silent ? 'SILENT BEACON' : 'AUDIBLE ALARM'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-600" />
                      <span>{alert.location.ghanaPostGps} · {alert.location.address}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${alert.userPhone}`}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                    <span>Call User</span>
                  </a>
                  {alert.status === 'active' && (
                    <button
                      onClick={() => resolveSos(alert.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                    >
                      Resolve Incident
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: ARTISAN VETTING QUEUE */}
      {activeTab === 'vetting' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Stage 2 & 3 Artisan Vetting Queue</h3>
            <p className="text-xs text-slate-500">
              Ghana Card facial liveness match and Master Craftsman association checks.
            </p>
          </div>

          <div className="space-y-3">
            {allUsers
              .filter((u) => u.role === 'pro')
              .map((pro) => (
                <div
                  key={pro.id}
                  className="p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
                      {pro.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">{pro.name}</h4>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                          {pro.proProfile?.tier} Tier
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span>Trade: {pro.proProfile?.trade}</span>
                        <span>·</span>
                        <span>Ghana Card: GHA-002941-8</span>
                        <span>·</span>
                        <span>Score: {pro.proProfile?.qualityScore}/100</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                      Vetted & Active
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
