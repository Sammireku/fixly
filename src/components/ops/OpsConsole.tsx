import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  DisputeRecord,
  SosAlert,
  User,
  Job,
  GhanaCardAuditRecord,
  EscrowAuditLog,
  ProTier,
} from '../../types';
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
  ShieldCheck,
  DollarSign,
  Lock,
  Unlock,
  Sliders,
  Search,
  Filter,
  Eye,
  Camera,
  Check,
  Ban,
  FileCheck,
  LogOut,
  Sparkles,
  Award,
} from 'lucide-react';

interface OpsConsoleProps {
  onLogoutAdmin?: () => void;
}

export const OpsConsole: React.FC<OpsConsoleProps> = ({ onLogoutAdmin }) => {
  const { disputes, resolveDispute, sosAlerts, resolveSos, allUsers, jobs } = useMarketplace();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'disputes' | 'ghana_card' | 'claim_limits' | 'escrow' | 'sos'>('disputes');

  // --- DISPUTES STATE ---
  const [disputeFilter, setDisputeFilter] = useState<'all' | 'needs_action' | 'resolved'>('all');
  const [selectedDisputeId, setSelectedDisputeId] = useState<string>(disputes[0]?.id || '');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [customRefundAmount, setCustomRefundAmount] = useState<number>(75);

  const filteredDisputes = disputes.filter((d) => {
    if (disputeFilter === 'needs_action') return d.status !== 'resolved';
    if (disputeFilter === 'resolved') return d.status === 'resolved';
    return true;
  });

  const selectedDispute = disputes.find((d) => d.id === selectedDisputeId) || filteredDisputes[0];

  const handleResolve = (action: 'rework_ordered' | 'partial_refund' | 'full_refund' | 'released_to_pro' | 'escalated_to_claim') => {
    if (!selectedDispute) return;
    resolveDispute(selectedDispute.id, {
      action,
      amount: action === 'partial_refund' ? customRefundAmount : undefined,
      notes: resolutionNotes || `Action ${action} executed by Ops supervisor (admin@fixlygh.com).`,
      resolvedAt: new Date().toISOString(),
      adminEmail: 'admin@fixlygh.com',
    });
    setResolutionNotes('');
  };

  // --- GHANA CARD AUDIT QUEUE STATE ---
  const [ghanaCardQueue, setGhanaCardQueue] = useState<GhanaCardAuditRecord[]>([
    {
      id: 'gca-001',
      userId: 'pro-kojo-owusu',
      userName: 'Kojo Owusu',
      userRole: 'pro',
      phone: '+233 24 551 8892',
      trade: 'Plumbing & Pipeworks',
      ghanaCardNumber: 'GHA-89210471-3',
      cardFrontUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80',
      cardBackUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80',
      selfieUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      submissionDate: '2026-11-05 14:22',
      status: 'failed',
      biometricMatchScore: 62,
      failureReason: 'Biometric liveness score 62% is below automated 75% threshold. Glare on portrait photo.',
    },
    {
      id: 'gca-002',
      userId: 'pro-emmanuel-tetteh',
      userName: 'Emmanuel Tetteh',
      userRole: 'pro',
      phone: '+233 20 890 1234',
      trade: 'Electrical Services',
      ghanaCardNumber: 'GHA-002941-8',
      cardFrontUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80',
      cardBackUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80',
      selfieUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      submissionDate: '2026-11-04 09:15',
      status: 'pending',
      biometricMatchScore: 88,
      failureReason: 'Middle name variation between NIA database and phone KYC.',
    },
    {
      id: 'gca-003',
      userId: 'client-abena-serwaa',
      userName: 'Abena Serwaa',
      userRole: 'client',
      phone: '+233 55 992 1044',
      ghanaCardNumber: 'GHA-10492817-9',
      cardFrontUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80',
      submissionDate: '2026-11-05 18:40',
      status: 'failed',
      biometricMatchScore: 45,
      failureReason: 'Blurry camera capture of National ID back barcode.',
    },
    {
      id: 'gca-004',
      userId: 'pro-kwame-mensah',
      userName: 'Kwame Mensah',
      userRole: 'pro',
      phone: '+233 24 456 7890',
      trade: 'Plumbing & Water',
      ghanaCardNumber: 'GHA-72019482-1',
      submissionDate: '2026-10-12 11:00',
      status: 'verified',
      biometricMatchScore: 98,
      reviewedBy: 'admin@fixlygh.com',
      reviewedAt: '2026-10-12 11:30',
    },
  ]);

  const [selectedAuditId, setSelectedAuditId] = useState<string>('gca-001');
  const [auditNote, setAuditNote] = useState<string>('');

  const selectedAudit = ghanaCardQueue.find((a) => a.id === selectedAuditId) || ghanaCardQueue[0];

  const handleAuditAction = (recordId: string, action: 'verified' | 'rejected' | 'flagged') => {
    setGhanaCardQueue((prev) =>
      prev.map((item) =>
        item.id === recordId
          ? {
              ...item,
              status: action === 'rejected' ? 'failed' : action,
              reviewedBy: 'admin@fixlygh.com',
              reviewedAt: new Date().toISOString(),
              notes: auditNote || `Marked ${action} by supervisor.`,
            }
          : item
      )
    );
    setAuditNote('');
  };

  // --- CLAIM LIMITS STATE ---
  const [prosList, setProsList] = useState<User[]>(() => {
    return allUsers.filter((u) => u.role === 'pro');
  });

  const [editingProId, setEditingProId] = useState<string | null>(null);
  const [claimLimitInput, setClaimLimitInput] = useState<number>(6500);
  const [tierInput, setTierInput] = useState<ProTier>('Pro');

  const handleSaveClaimLimit = (proId: string) => {
    setProsList((prev) =>
      prev.map((p) => {
        if (p.id === proId && p.proProfile) {
          return {
            ...p,
            proProfile: {
              ...p.proProfile,
              claimLimit: claimLimitInput,
              tier: tierInput,
            },
          };
        }
        return p;
      })
    );
    setEditingProId(null);
  };

  const handleToggleGuarantor = (proId: string) => {
    setProsList((prev) =>
      prev.map((p) => {
        if (p.id === proId && p.proProfile) {
          return {
            ...p,
            proProfile: {
              ...p.proProfile,
              guarantorBacked: !p.proProfile.guarantorBacked,
            },
          };
        }
        return p;
      })
    );
  };

  const handleToggleInsurance = (proId: string) => {
    setProsList((prev) =>
      prev.map((p) => {
        if (p.id === proId && p.proProfile) {
          return {
            ...p,
            proProfile: {
              ...p.proProfile,
              insurancePool: !p.proProfile.insurancePool,
            },
          };
        }
        return p;
      })
    );
  };

  // --- ESCROW OVERRIDES STATE ---
  const [escrowAuditLogs, setEscrowAuditLogs] = useState<EscrowAuditLog[]>([
    {
      id: 'eal-001',
      jobId: 'job-closed-003',
      jobTitle: 'Replace Sparks in Master Bedroom AC Switch',
      action: 'force_release_pro',
      amount: 147.0,
      reason: 'Client was on an international flight; telephone voice confirmation received on 112 recording.',
      adminEmail: 'admin@fixlygh.com',
      timestamp: '2026-11-03 14:10',
    },
  ]);

  const [escrowOverrideReason, setEscrowOverrideReason] = useState<string>('');

  const handleEscrowAction = (
    jobItem: Job,
    action: 'force_release_pro' | 'freeze_escrow' | 'force_refund_client' | 'release_preauth'
  ) => {
    const newLog: EscrowAuditLog = {
      id: `eal-${Date.now()}`,
      jobId: jobItem.id,
      jobTitle: jobItem.title,
      action,
      amount: jobItem.totalAmount,
      reason: escrowOverrideReason || `Manual ${action.replace(/_/g, ' ')} executed via Operations Tower.`,
      adminEmail: 'admin@fixlygh.com',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setEscrowAuditLogs((prev) => [newLog, ...prev]);
    setEscrowOverrideReason('');
  };

  // Metrics
  const activeDisputesCount = disputes.filter((d) => d.status !== 'resolved').length;
  const pendingAuditsCount = ghanaCardQueue.filter((g) => g.status === 'failed' || g.status === 'pending').length;
  const activeSosCount = sosAlerts.filter((s) => s.status === 'active').length;
  const totalEscrowInVault = jobs
    .filter((j) => j.escrowStatus === 'held_in_escrow' || j.escrowStatus === 'hold_period_24h')
    .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-16 animate-fade-in text-slate-900 select-none">
      {/* Super-Admin Top Header Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-md shrink-0">
            <ShieldAlert className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-tight text-white">Fixly Operations Tower</h2>
              <span className="text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-400/30 px-2 py-0.5 rounded-full tracking-wider">
                SUPERVISOR ACCESS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Logged in as: <strong className="text-purple-300 font-mono">admin@fixlygh.com</strong> · Airport Residential Trust Hub
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {onLogoutAdmin && (
            <button
              onClick={onLogoutAdmin}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
              title="Return to standard client or artisan profile"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Exit Admin Portal</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Escrow In Vault</span>
            <Lock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-black text-slate-900">
            GH₵ {totalEscrowInVault > 0 ? totalEscrowInVault.toFixed(2) : '8,674.00'}
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold block">
            Guaranteed in Ecobank / MoMo Escrow
          </span>
        </div>

        <div
          onClick={() => setActiveTab('disputes')}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1 cursor-pointer hover:border-purple-300 transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Disputes</span>
            <FileText className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-black text-slate-900">{activeDisputesCount}</div>
          <span className="text-[10px] text-amber-700 font-semibold block">
            SLA: 24h Pro / 48h Ops
          </span>
        </div>

        <div
          onClick={() => setActiveTab('ghana_card')}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1 cursor-pointer hover:border-purple-300 transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Failed ID Audits</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-slate-900">{pendingAuditsCount}</div>
          <span className="text-[10px] text-rose-600 font-semibold block">
            Awaiting supervisor review
          </span>
        </div>

        <div
          onClick={() => setActiveTab('sos')}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1 cursor-pointer hover:border-rose-300 transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Safety SOS Beacons</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl font-black text-slate-900">{activeSosCount}</div>
          <span className="text-[10px] text-slate-500 font-semibold block">
            Accra Police 112 Hotline Link
          </span>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200/80 scrollbar-none text-xs font-bold">
        {[
          { id: 'disputes', label: `Dispute Tickets (${activeDisputesCount})`, icon: FileText },
          { id: 'ghana_card', label: `Ghana Card Audits (${pendingAuditsCount})`, icon: ShieldCheck },
          { id: 'claim_limits', label: 'Pro Claim Limits & Guarantors', icon: Sliders },
          { id: 'escrow', label: 'Manual Escrow Releases & Overrides', icon: DollarSign },
          { id: 'sos', label: `Emergency SOS (${activeSosCount})`, icon: AlertTriangle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: ACTIVE DISPUTE TICKETS & CLAIMS WATERFALL
      ========================================================================= */}
      {activeTab === 'disputes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column: Dispute Ticket List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Dispute Tickets Queue:
              </span>
              <div className="flex items-center gap-1 text-[10px]">
                <button
                  onClick={() => setDisputeFilter('all')}
                  className={`px-2 py-0.5 rounded font-bold ${
                    disputeFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-500'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setDisputeFilter('needs_action')}
                  className={`px-2 py-0.5 rounded font-bold ${
                    disputeFilter === 'needs_action' ? 'bg-amber-500 text-white' : 'text-slate-500'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setDisputeFilter('resolved')}
                  className={`px-2 py-0.5 rounded font-bold ${
                    disputeFilter === 'resolved' ? 'bg-emerald-600 text-white' : 'text-slate-500'
                  }`}
                >
                  Resolved
                </button>
              </div>
            </div>

            {filteredDisputes.length === 0 ? (
              <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                No disputes matching filter.
              </div>
            ) : (
              filteredDisputes.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setSelectedDisputeId(d.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    selectedDispute?.id === d.id
                      ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-500/20 shadow-xs'
                      : 'border-slate-200/90 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-mono font-bold text-slate-400">{d.id}</span>
                    <span
                      className={`font-black uppercase px-2 py-0.5 rounded-full ${
                        d.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {d.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900 mt-1 truncate">
                    {d.jobTitle}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                    <span>By: {d.initiatorName}</span>
                    <span className="capitalize font-semibold text-purple-700">
                      Issue: {d.category.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right 2 Columns: Dispute Case Inspection & Resolution Ruling */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
            {selectedDispute ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-3 border-b border-slate-100 gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                        Ticket #{selectedDispute.id}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Job: {selectedDispute.jobId}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">
                      {selectedDispute.jobTitle}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Initiator: <strong>{selectedDispute.initiatorName}</strong> ({selectedDispute.initiatorRole}) · Filed on {selectedDispute.createdAt.substring(0, 10)}
                    </p>
                  </div>

                  <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl capitalize shrink-0">
                    Desired: {selectedDispute.desiredOutcome.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Side-by-side statements: Client vs Pro */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="font-extrabold text-slate-800 uppercase text-[10px] block text-rose-600">
                      Client Complaint:
                    </span>
                    <p className="text-slate-700 leading-relaxed">{selectedDispute.description}</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="font-extrabold text-slate-800 uppercase text-[10px] block text-blue-600">
                      Pro Response:
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {selectedDispute.proResponse || 'Pro has not submitted a formal response yet. Mediation timeout in 14 hours.'}
                    </p>
                  </div>
                </div>

                {/* Evidence Photo Thumbnails */}
                {selectedDispute.evidencePhotos.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 block">
                      Submitted Photographic Proof:
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto">
                      {selectedDispute.evidencePhotos.map((photo, i) => (
                        <a
                          key={i}
                          href={photo}
                          target="_blank"
                          rel="noreferrer"
                          className="w-28 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-2xs group relative shrink-0"
                        >
                          <img src={photo} alt="evidence" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold">
                            View Proof
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* CLAIMS WATERFALL RULING ENGINE */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                    Claims Waterfall Mediation Ruling:
                  </span>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      placeholder="Enter official written mediation ruling rationale..."
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500"
                    />

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] font-bold text-slate-400">GH₵</span>
                      <input
                        type="number"
                        value={customRefundAmount}
                        onChange={(e) => setCustomRefundAmount(Number(e.target.value))}
                        className="w-20 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        title="Partial refund amount"
                      />
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-xs">
                    <button
                      onClick={() => handleResolve('rework_ordered')}
                      className="py-2.5 px-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-2xs text-center"
                    >
                      Order Rework (5d)
                    </button>

                    <button
                      onClick={() => handleResolve('partial_refund')}
                      className="py-2.5 px-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-2xs text-center"
                    >
                      Partial (GH₵{customRefundAmount})
                    </button>

                    <button
                      onClick={() => handleResolve('full_refund')}
                      className="py-2.5 px-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-2xs text-center"
                    >
                      Full Client Refund
                    </button>

                    <button
                      onClick={() => handleResolve('released_to_pro')}
                      className="py-2.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-2xs text-center"
                    >
                      Release to Pro
                    </button>

                    <button
                      onClick={() => handleResolve('escalated_to_claim')}
                      className="py-2.5 px-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-2xs text-center col-span-2 sm:col-span-1"
                    >
                      Insurer Pool Claim
                    </button>
                  </div>

                  {selectedDispute.opsResolution && (
                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 mt-2 space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Ruling Executed: {selectedDispute.opsResolution.action.replace(/_/g, ' ').toUpperCase()}</span>
                      </div>
                      <p className="text-[11px] text-emerald-800 pl-5">
                        {selectedDispute.opsResolution.notes} · Logged by {selectedDispute.opsResolution.adminEmail || 'admin@fixlygh.com'}
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Select a dispute case on the left to inspect and issue a ruling.
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: AUDITING FAILED / PENDING GHANA CARD UPLOADS
      ========================================================================= */}
      {activeTab === 'ghana_card' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column: Submissions List */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              National ID Audit Submissions:
            </span>

            <div className="space-y-2">
              {ghanaCardQueue.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedAuditId(item.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    selectedAudit?.id === item.id
                      ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-500/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-mono font-bold text-slate-500">{item.ghanaCardNumber}</span>
                    <span
                      className={`font-black uppercase px-2 py-0.5 rounded-full ${
                        item.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'failed'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-extrabold text-slate-900 mt-1">{item.userName}</h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                    <span>{item.userRole.toUpperCase()} · {item.phone}</span>
                    {item.biometricMatchScore && (
                      <span className={`font-bold ${item.biometricMatchScore >= 75 ? 'text-emerald-700' : 'text-rose-600'}`}>
                        Match: {item.biometricMatchScore}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 2 Columns: Audit Inspection & Supervisor Action */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
            {selectedAudit ? (
              <>
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-black uppercase bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                      National Identification Authority (NIA) Audit
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">
                      {selectedAudit.userName} ({selectedAudit.userRole.toUpperCase()})
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      Ghana Card Number: <strong>{selectedAudit.ghanaCardNumber}</strong> · Phone: {selectedAudit.phone}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-black px-3 py-1 rounded-xl uppercase ${
                      selectedAudit.status === 'verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedAudit.status === 'failed'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {selectedAudit.status}
                  </span>
                </div>

                {/* Failure Rationale */}
                {selectedAudit.failureReason && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 space-y-1">
                    <span className="font-extrabold block text-rose-800">
                      Automated Verification Flag:
                    </span>
                    <p>{selectedAudit.failureReason}</p>
                  </div>
                )}

                {/* Side-by-side Biometric Images: Front, Back, Selfie */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 block">
                    Biometric Liveness & ID Document Scans:
                  </span>
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-semibold block">Front Card Scan</span>
                      <div className="h-28 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden">
                        <img
                          src={selectedAudit.cardFrontUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80'}
                          alt="card front"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-semibold block">Back QR Code Scan</span>
                      <div className="h-28 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden">
                        <img
                          src={selectedAudit.cardBackUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80'}
                          alt="card back"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-semibold block">Live Selfie Capture</span>
                      <div className="h-28 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden">
                        <img
                          src={selectedAudit.selfieUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
                          alt="selfie"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Supervisor Manual Audit Decision */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                    Supervisor Audit Action:
                  </span>

                  <input
                    type="text"
                    value={auditNote}
                    onChange={(e) => setAuditNote(e.target.value)}
                    placeholder="Enter audit note for user or SMS notification..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500 font-medium"
                  />

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleAuditAction(selectedAudit.id, 'verified')}
                      className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Approve & Grant Badge</span>
                    </button>

                    <button
                      onClick={() => handleAuditAction(selectedAudit.id, 'rejected')}
                      className="py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Reject & Request Re-upload</span>
                    </button>

                    <button
                      onClick={() => handleAuditAction(selectedAudit.id, 'flagged')}
                      className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Ban className="w-4 h-4" />
                      <span>Flag for Fraud</span>
                    </button>
                  </div>

                  {selectedAudit.reviewedBy && (
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                      Audit logged by <strong>{selectedAudit.reviewedBy}</strong> on {selectedAudit.reviewedAt?.substring(0, 16)}: {selectedAudit.notes}
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: PRO CLAIM LIMITS & GUARANTORS MANAGEMENT
      ========================================================================= */}
      {activeTab === 'claim_limits' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Artisan Risk Tier & Insurance Pool Waterfall Limits
              </h3>
              <p className="text-xs text-slate-500">
                Adjust maximum claim limits covered by Fixly Insurer Pool, Guarantor Deeds, and quality score multiplier.
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-purple-50 text-purple-700 px-3 py-1 rounded-xl border border-purple-200">
              Total Artisans: {prosList.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Artisan</th>
                  <th className="py-2.5 px-3">Trade</th>
                  <th className="py-2.5 px-3">Tier</th>
                  <th className="py-2.5 px-3">Claim Limit</th>
                  <th className="py-2.5 px-3">Guarantor Backed</th>
                  <th className="py-2.5 px-3">Insurer Pool</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prosList.map((pro) => {
                  const p = pro.proProfile;
                  const isEditing = editingProId === pro.id;
                  return (
                    <tr key={pro.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-extrabold text-slate-900 block">{pro.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{pro.phone}</span>
                      </td>

                      <td className="py-3 px-3 capitalize font-medium text-slate-700">
                        {p?.trade}
                      </td>

                      <td className="py-3 px-3">
                        {isEditing ? (
                          <select
                            value={tierInput}
                            onChange={(e) => setTierInput(e.target.value as any)}
                            className="p-1 bg-white border border-slate-300 rounded font-bold text-xs"
                          >
                            <option value="Starter">Starter</option>
                            <option value="Growth">Growth</option>
                            <option value="Pro">Pro</option>
                            <option value="Elite">Elite</option>
                          </select>
                        ) : (
                          <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-[10px]">
                            {p?.tier}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400">GH₵</span>
                            <input
                              type="number"
                              value={claimLimitInput}
                              onChange={(e) => setClaimLimitInput(Number(e.target.value))}
                              className="w-24 p-1 bg-white border border-slate-300 rounded font-mono font-bold text-xs"
                            />
                          </div>
                        ) : (
                          <span className="font-mono font-extrabold text-slate-900">
                            GH₵ {p?.claimLimit.toLocaleString()}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleToggleGuarantor(pro.id)}
                          className={`px-2 py-0.5 rounded font-bold text-[10px] cursor-pointer transition-colors ${
                            p?.guarantorBacked
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {p?.guarantorBacked ? 'GH₵10k Deed Active' : 'No Guarantor'}
                        </button>
                      </td>

                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleToggleInsurance(pro.id)}
                          className={`px-2 py-0.5 rounded font-bold text-[10px] cursor-pointer transition-colors ${
                            p?.insurancePool
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {p?.insurancePool ? 'Policy Active' : 'Excluded'}
                        </button>
                      </td>

                      <td className="py-3 px-3 text-right">
                        {isEditing ? (
                          <button
                            onClick={() => handleSaveClaimLimit(pro.id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingProId(pro.id);
                              setClaimLimitInput(p?.claimLimit || 5000);
                              setTierInput(p?.tier || 'Pro');
                            }}
                            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                          >
                            Edit Limit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: MANUAL ESCROW RELEASES & OVERRIDES
      ========================================================================= */}
      {activeTab === 'escrow' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Live Escrow Ledger & Supervisor Override Console
                </h3>
                <p className="text-xs text-slate-500">
                  Force manual release to Pro MoMo, freeze funds in disputed jobs, or refund clients immediately.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={escrowOverrideReason}
                  onChange={(e) => setEscrowOverrideReason(e.target.value)}
                  placeholder="Supervisor override justification note..."
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 w-64 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              {jobs.map((j) => (
                <div
                  key={j.id}
                  className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-slate-400">{j.id}</span>
                      <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        {j.escrowStatus?.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs font-extrabold text-slate-900">GH₵ {j.totalAmount.toFixed(2)}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800">{j.title}</h4>
                    <p className="text-[11px] text-slate-500">
                      Client: <strong>{j.clientName}</strong> · Pro: <strong>{j.proName || 'Unassigned'}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleEscrowAction(j, 'force_release_pro')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Force Release Pro MoMo</span>
                    </button>

                    <button
                      onClick={() => handleEscrowAction(j, 'freeze_escrow')}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Freeze Vault</span>
                    </button>

                    <button
                      onClick={() => handleEscrowAction(j, 'force_refund_client')}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <span>Force Refund Client</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Log Table */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-2">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
              Supervisor Escrow Override Audit Trail:
            </span>

            <div className="divide-y divide-slate-100 text-xs">
              {escrowAuditLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-slate-900 capitalize block">
                      {log.action.replace(/_/g, ' ')} — GH₵ {log.amount.toFixed(2)}
                    </span>
                    <p className="text-[11px] text-slate-500">{log.reason} · Job: {log.jobId}</p>
                  </div>
                  <div className="text-right text-[10px] text-slate-400 font-mono">
                    <span className="text-purple-700 font-bold block">{log.adminEmail}</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: LIVE SOS & SAFETY BEACONS
      ========================================================================= */}
      {activeTab === 'sos' && (
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Accra Emergency Distress Monitor:
          </span>

          {sosAlerts.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h4 className="text-sm font-extrabold text-slate-900">Zero Active Distress Signals</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                All field artisan visits across Accra (East Legon, Cantonments, Osu, Spintex) are running with zero active emergency alerts.
              </p>
            </div>
          ) : (
            sosAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  alert.status === 'active'
                    ? 'border-rose-500 bg-rose-50/70 shadow-md'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-3 rounded-2xl bg-rose-600 text-white">
                    <AlertTriangle className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-extrabold text-slate-900">{alert.userName}</h4>
                      <span className="text-[10px] font-black uppercase text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full">
                        {alert.silent ? 'SILENT BEACON' : 'AUDIBLE ALARM'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>{alert.location.ghanaPostGps} · {alert.location.address}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${alert.userPhone}`}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                    <span>Call User</span>
                  </a>

                  {alert.status === 'active' && (
                    <button
                      onClick={() => resolveSos(alert.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
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
    </div>
  );
};
