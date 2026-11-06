import React, { useState } from 'react';
import {
  Bell,
  Wrench,
  CheckCircle2,
  DollarSign,
  Clock,
  Award,
  ChevronRight,
  Smartphone,
  Check,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Briefcase,
  UserCheck,
  Radio,
} from 'lucide-react';
import { BottomNavBar } from './BottomNavBar';
import { BottomTabId, UserProfile, ProProfileDetails } from './types';
import { GhanaCardBadge } from './GhanaCardBadge';
import {
  getArtisanBroadcastPreference,
  saveArtisanBroadcastPreference,
  broadcastJobRequestToArtisan,
  ArtisanBroadcastPreference,
} from '../../lib/smsWhatsappService';

interface ProProfileScreenProps {
  userProfile: UserProfile;
  proProfile: ProProfileDetails;
  onOpenNotifications?: () => void;
  onSwitchToClient: () => void;
  onTakeMoreSkillTests: () => void;
  onTabChange: (tab: BottomTabId) => void;
}

export const ProProfileScreen: React.FC<ProProfileScreenProps> = ({
  userProfile,
  proProfile,
  onOpenNotifications,
  onSwitchToClient,
  onTakeMoreSkillTests,
  onTabChange,
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(proProfile.isOnline ?? true);
  const [cashoutAmount, setCashoutAmount] = useState<string>('150');
  const [cashoutSuccess, setCashoutSuccess] = useState<boolean>(false);
  const [broadcastPref, setBroadcastPref] = useState<ArtisanBroadcastPreference>(
    getArtisanBroadcastPreference()
  );
  const [testBroadcastSent, setTestBroadcastSent] = useState(false);

  const handleToggleBroadcastOptIn = () => {
    const updated = { ...broadcastPref, optedIn: !broadcastPref.optedIn };
    setBroadcastPref(updated);
    saveArtisanBroadcastPreference(updated);
  };

  const handleUpdateChannel = (ch: 'SMS' | 'WhatsApp' | 'Both') => {
    const updated = { ...broadcastPref, channel: ch };
    setBroadcastPref(updated);
    saveArtisanBroadcastPreference(updated);
  };

  const handleToggleService = (srv: string) => {
    const exists = broadcastPref.optedServices.includes(srv);
    const updatedServices = exists
      ? broadcastPref.optedServices.filter((s) => s !== srv)
      : [...broadcastPref.optedServices, srv];
    const updated = { ...broadcastPref, optedServices: updatedServices };
    setBroadcastPref(updated);
    saveArtisanBroadcastPreference(updated);
  };

  const handleSendTestBroadcast = () => {
    broadcastJobRequestToArtisan(
      {
        id: `test-${Date.now()}`,
        clientId: 'client-test',
        clientName: 'Nana Osei (Test Alert)',
        clientPhone: '+233 24 491 0029',
        trade: 'plumbing',
        type: 'on_demand',
        title: 'Emergency Tap Leak Diagnostic (Test)',
        description: 'Testing 2G SMS Shortcode Broadcast',
        urgency: 'now',
        status: 'requested',
        basePrice: 90,
        protectionFee: 4.5,
        totalAmount: 94.5,
        platformFee: 10,
        poolFee: 2.5,
        netProEarnings: 82,
        location: {
          lat: 5.6354,
          lng: -0.1582,
          address: '42 Cantonments Road, Accra',
          ghanaPostGps: 'GA-014-9912',
          landmark: 'US Embassy Junction',
          area: 'Cantonments',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      broadcastPref.channel === 'Both' ? 'SMS' : broadcastPref.channel,
      userProfile.name,
      broadcastPref.phone
    );
    setTestBroadcastSent(true);
    setTimeout(() => setTestBroadcastSent(false), 4000);
  };

  // Incoming Job Dispatch simulation
  const [assignedJob, setAssignedJob] = useState<{
    id: string;
    title: string;
    clientName: string;
    address: string;
    payout: number;
    status: 'Requested' | 'En Route' | 'In Progress' | 'Completed';
  } | null>({
    id: 'JOB-9021',
    title: 'Burst Pipe Leak & Water Pressure Diagnostic',
    clientName: 'Nana Osei',
    address: '42 Cantonments Road, Accra',
    payout: 90.0,
    status: 'Requested',
  });

  const handleCashout = () => {
    setCashoutSuccess(true);
    setTimeout(() => {
      setCashoutSuccess(false);
    }, 3000);
  };

  const handleAcceptJob = () => {
    if (assignedJob) {
      setAssignedJob({
        ...assignedJob,
        status: 'En Route',
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F4F5F8] text-slate-900 select-none">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-7 pb-5 space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1E5BF0] uppercase tracking-wider block">
                Artisan Pro Dashboard
              </span>
              <GhanaCardBadge size="sm" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {userProfile.name}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSwitchToClient}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer shadow-2xs transition-colors"
            >
              Switch to Client
            </button>
            <button
              onClick={onOpenNotifications}
              className="w-10 h-10 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-slate-700 stroke-[1.8]" />
            </button>
          </div>
        </div>

        {/* Pro Cockpit Header Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {userProfile.avatarUrl ? (
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.name}
                className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-2xs"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#EBF1FF] text-[#1E5BF0] font-black text-lg flex items-center justify-center shrink-0">
                {userProfile.name.slice(0, 2).toUpperCase()}
              </div>
            )}

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-slate-900">
                  {proProfile.primaryTrade} Specialist
                </h3>
                <span className="text-[10px] bg-blue-50 text-[#1E5BF0] font-bold px-1.5 py-0.5 rounded">
                  Level 2 Tested
                </span>
              </div>
              <span className="text-xs text-slate-400 block mt-0.5">
                GH₵{proProfile.hourlyRate}/hr • {proProfile.experienceYears} yrs experience
              </span>
            </div>
          </div>

          {/* Big Tactile Online/Offline Switch */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-2xs shrink-0 ${
              isOnline
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isOnline ? 'bg-white animate-ping' : 'bg-slate-500'
              }`}
            />
            <span>{isOnline ? 'ONLINE & READY' : 'OFFLINE (PAUSED)'}</span>
          </button>
        </div>

        {/* ARTISAN OFFLINE BROADCAST OPT-IN SETTINGS CARD */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1E5BF0] flex items-center justify-center shrink-0">
                <Radio className="w-4 h-4 animate-pulse text-[#1E5BF0]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Automated 2G SMS & WhatsApp Broadcast
                </h4>
                <span className="text-[10px] text-slate-400 font-medium">
                  Receive job alerts when offline or in low-data areas
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleBroadcastOptIn}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                broadcastPref.optedIn
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              {broadcastPref.optedIn ? 'OPTED IN' : 'OPTED OUT'}
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {broadcastPref.optedIn
              ? '✅ ACTIVE: Fixly will automatically dispatch incoming jobs in your trade to your phone via 2G SMS Shortcode (1400) and WhatsApp, even if you do not have mobile data turned on.'
              : '⚠️ PAUSED: You will only receive jobs when actively online in the app. Opt-in to receive free SMS alerts on site.'}
          </p>

          {broadcastPref.optedIn && (
            <div className="space-y-3 pt-1 border-t border-slate-100">
              {/* Channel Selector */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Preferred Automated Dispatch Channel:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['SMS', 'WhatsApp', 'Both'] as const).map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => handleUpdateChannel(ch)}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer text-center ${
                        broadcastPref.channel === ch
                          ? 'border-[#1E5BF0] bg-blue-50 text-[#1E5BF0] ring-1 ring-blue-500'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {ch === 'Both' ? 'SMS + WhatsApp' : ch === 'SMS' ? '2G SMS Only' : 'WhatsApp'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Opted-in Services */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Services Opted-In for Instant Auto-Dispatch:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Leak repair',
                    'Tap & mixer replacement',
                    'Toilet repair',
                    'Water heaters',
                    'Polytank & booster pump',
                  ].map((srv) => {
                    const isChecked = broadcastPref.optedServices.includes(srv);
                    return (
                      <button
                        key={srv}
                        type="button"
                        onClick={() => handleToggleService(srv)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                          isChecked
                            ? 'bg-blue-50 border-blue-300 text-[#1E5BF0]'
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[2.5]" />}
                        <span>{srv}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Destination phone & test trigger */}
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between flex-wrap gap-2">
                <div className="text-[11px] text-slate-600 font-mono">
                  Dispatch Line: <strong>{broadcastPref.phone}</strong> (Shortcode 1400)
                </div>

                <button
                  type="button"
                  onClick={handleSendTestBroadcast}
                  className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Send Test 2G Alert
                </button>
              </div>

              {testBroadcastSent && (
                <div className="p-2 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-fade-in">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Test 2G SMS Alert dispatched to {broadcastPref.phone}!</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Active Incoming Job Request */}
        {assignedJob && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 border border-slate-700 shadow-md space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>New Job Dispatch</span>
              </span>
              <span className="text-xs font-mono font-extrabold text-emerald-400">
                +GH₵{assignedJob.payout.toFixed(2)} Net Payout
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">{assignedJob.title}</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Client: {assignedJob.clientName} • {assignedJob.address}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-700">
              <span className="text-[11px] text-slate-400">
                Status: <strong className="text-sky-300">{assignedJob.status}</strong>
              </span>

              {assignedJob.status === 'Requested' ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAssignedJob(null)}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Decline
                  </button>
                  <button
                    onClick={handleAcceptJob}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    Accept Job
                  </button>
                </div>
              ) : (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  En Route to Client
                </span>
              )}
            </div>
          </div>
        )}

        {/* Pro Wallet & MoMo Cashout Card */}
        <div className="bg-[#1E5BF0] text-white rounded-2xl p-4.5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-100 tracking-tight">
              Pro Earnings Wallet
            </span>
            <span className="bg-white/20 text-white font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
              MOMO LINKED
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
              <span className="text-[10px] text-blue-100 block">Available</span>
              <strong className="text-sm font-extrabold text-white mt-0.5 block">
                ${proProfile.walletAvailable.toFixed(2)}
              </strong>
            </div>

            <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
              <span className="text-[10px] text-blue-100 block">Pending Escrow</span>
              <strong className="text-sm font-extrabold text-emerald-300 mt-0.5 block">
                ${proProfile.walletPending.toFixed(2)}
              </strong>
            </div>

            <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
              <span className="text-[10px] text-blue-100 block">Total Earned</span>
              <strong className="text-sm font-extrabold text-white mt-0.5 block">
                ${proProfile.walletPaidOut.toFixed(2)}
              </strong>
            </div>
          </div>

          {/* MoMo Payout Trigger */}
          <div className="pt-2 border-t border-blue-400/40 flex items-center justify-between gap-2">
            <div className="text-[11px] text-blue-100">
              Payout to: <strong>{proProfile.momoNetwork} ({proProfile.momoNumber})</strong>
            </div>

            <button
              onClick={handleCashout}
              className="px-3.5 py-1.5 bg-white text-[#1E5BF0] hover:bg-blue-50 text-xs font-extrabold rounded-xl cursor-pointer shadow-xs transition-colors shrink-0"
            >
              Cash Out
            </button>
          </div>

          {cashoutSuccess && (
            <div className="p-2.5 bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 animate-fade-in shadow-xs">
              <Check className="w-4 h-4" />
              <span>
                Transferred ${cashoutAmount} directly to {proProfile.momoNumber}!
              </span>
            </div>
          )}
        </div>

        {/* Quality Scorecard */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs space-y-2.5">
          <span className="text-xs font-bold text-slate-800 block uppercase tracking-wider">
            Verified Pro Scorecard
          </span>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-medium">Rating</span>
              <span className="text-xs font-extrabold text-slate-900 block mt-0.5">
                {proProfile.rating} ★
              </span>
            </div>

            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-medium">Jobs</span>
              <span className="text-xs font-extrabold text-slate-900 block mt-0.5">
                {proProfile.jobsCompleted}
              </span>
            </div>

            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-medium">On-Time</span>
              <span className="text-xs font-extrabold text-sky-600 block mt-0.5">
                {proProfile.onTimeRate}%
              </span>
            </div>

            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-medium">Solved</span>
              <span className="text-xs font-extrabold text-emerald-600 block mt-0.5">
                {proProfile.problemSolvedRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Tested Field Skills & Option to take more tests */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#1E5BF0]" />
              <h4 className="text-xs font-bold text-slate-900">
                Verified Skill Assessments
              </h4>
            </div>

            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Test Score: {proProfile.testScore}%
            </span>
          </div>

          <div className="space-y-1.5">
            {proProfile.testedServices.map((srv, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between"
              >
                <span className="font-semibold text-slate-800">{srv}</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                  Passed Level 2
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onTakeMoreSkillTests}
            className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#1E5BF0] font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#1E5BF0]" />
            <span>Take Technical Skill Test for Additional Field</span>
          </button>
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <BottomNavBar activeTab="account" onTabChange={onTabChange} />
    </div>
  );
};
