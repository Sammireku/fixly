import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useLanguage } from '../../context/LanguageContext';
import { useOffline } from '../../context/OfflineContext';
import { Job, QuoteLineItem } from '../../types';
import {
  Wrench,
  Wifi,
  WifiOff,
  Volume2,
  MapPin,
  Clock,
  PhoneCall,
  CheckCircle2,
  Camera,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  Share2,
  Award,
  Sparkles,
  Check,
  ShieldCheck,
  MessageSquare,
  BarChart3,
  Star,
  ThumbsUp,
  ThumbsDown,
  Flag,
  UserCheck,
} from 'lucide-react';
import { ProBadgesCenter } from './ProBadgesCenter';
import { ProFinancialInsights } from './ProFinancialInsights';
import { JobChatModal } from '../chat/JobChatModal';

export const ProDashboard: React.FC<{ initialTab?: string }> = ({ initialTab }) => {
  const {
    currentUser,
    jobs,
    acceptJob,
    declineJob,
    markArrived,
    submitDiagnosticQuote,
    toggleMaterialShopRun,
    completeJob,
    cashoutProWallet,
    toggleProOnline,
  } = useMarketplace();

  const { t, language, speakPrompt } = useLanguage();
  const { enqueueMutation, networkMode } = useOffline();

  const [activeTab, setActiveTab] = useState<'now' | 'wallet' | 'tier' | 'badges' | 'insights' | 'reviews'>(
    (initialTab as any) || 'now'
  );
  const [cashoutAmount, setCashoutAmount] = useState('500');
  const [cashoutSuccess, setCashoutSuccess] = useState(false);
  const [whatsappCopied, setWhatsappCopied] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Incoming Job Dispatch Countdown simulation (30s)
  const [countdown, setCountdown] = useState(38);

  // Quote Builder State
  const [quoteItems, setQuoteItems] = useState<QuoteLineItem[]>([
    { id: 'q-1', description: 'Labor - Inspection & Cartridge Replacement', type: 'labor', quantity: 1, unitPrice: 130, total: 130 },
    { id: 'q-2', description: 'Ceramic 35mm Brass Cartridge Valve', type: 'material', quantity: 1, unitPrice: 50, total: 50 },
  ]);
  const [newPartName, setNewPartName] = useState('');
  const [newPartPrice, setNewPartPrice] = useState('40');

  // Find incoming requested job for this pro or active job
  const proProfile = currentUser.proProfile;
  const isOnline = proProfile?.isOnline ?? true;

  const assignedActiveJob = jobs.find(
    (j) => j.proId === currentUser.id && j.status !== 'closed'
  );

  const incomingRequest = !assignedActiveJob
    ? jobs.find((j) => j.status === 'requested')
    : null;

  useEffect(() => {
    let timer: any;
    if (incomingRequest && isOnline && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [incomingRequest, isOnline, countdown]);

  const handleAcceptIncoming = async (job: Job) => {
    speakPrompt('voice_new_job');
    enqueueMutation('UPDATE_JOB_STATUS', { jobId: job.id, status: 'pro_en_route' });
    await acceptJob(job.id, currentUser);
  };

  const handleDeclineIncoming = async (jobId: string) => {
    await declineJob(jobId);
  };

  const handleArrival = async (jobId: string) => {
    speakPrompt('voice_arrived');
    enqueueMutation('UPDATE_JOB_STATUS', { jobId, status: 'arrived' });
    await markArrived(jobId);
  };

  const handleAddQuoteItem = () => {
    if (!newPartName) return;
    const price = parseInt(newPartPrice) || 0;
    const newItem: QuoteLineItem = {
      id: 'qi_' + Date.now(),
      description: newPartName,
      type: 'material',
      quantity: 1,
      unitPrice: price,
      total: price,
    };
    setQuoteItems((prev) => [...prev, newItem]);
    setNewPartName('');
  };

  const handleSubmitQuote = async (jobId: string) => {
    const total = quoteItems.reduce((acc, item) => acc + item.total, 0);
    speakPrompt('voice_quote_sent');
    enqueueMutation('SUBMIT_QUOTE', { jobId, items: quoteItems, total });
    await submitDiagnosticQuote(jobId, quoteItems, total);
  };

  const handleCompleteWork = async (jobId: string) => {
    speakPrompt('voice_payment_held');
    enqueueMutation('UPDATE_JOB_STATUS', { jobId, status: 'completed' });
    await completeJob(
      jobId,
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
    );
  };

  const handleCashout = async () => {
    const amt = parseInt(cashoutAmount);
    if (!amt) return;
    const ok = await cashoutProWallet(amt, 'MTN MoMo', currentUser.phone);
    if (ok) {
      setCashoutSuccess(true);
      setTimeout(() => setCashoutSuccess(false), 3000);
    }
  };

  const handleShareWhatsAppReceipt = () => {
    const text = `*Fixly Ghana Official Receipt*\nArtisan: ${currentUser.name}\nTrade: ${currentUser.proProfile?.trade}\nGhana Post GPS: ${currentUser.location?.ghanaPostGps}\nEscrow Protected: Yes\nVerified on Fixly App`;
    navigator.clipboard.writeText(text);
    setWhatsappCopied(true);
    setTimeout(() => setWhatsappCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-12 animate-fade-in">
      {/* Artisan Status Cockpit Header (Large Touch Elements) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-xl shadow-sm shrink-0">
            {currentUser.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-900">{currentUser.name}</h2>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                {proProfile?.tier || 'Growth'} Tier
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>Trade: <strong className="text-slate-800 capitalize">{proProfile?.trade}</strong></span>
              <span>·</span>
              <span>Claim Limit: <strong className="text-emerald-700">GH₵ {proProfile?.claimLimit}</strong></span>
            </div>
          </div>
        </div>

        {/* Big Tactile Online/Offline Switch */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleProOnline(!isOnline)}
            className={`px-5 py-3 rounded-xl font-extrabold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-sm ${
              isOnline
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-white animate-ping' : 'bg-slate-500'}`} />
            <span>{isOnline ? 'ONLINE & READY' : 'OFFLINE (PAUSED)'}</span>
          </button>
        </div>
      </div>

      {/* Pro Tabs: Now, Wallet & Mobile Money, Tier & Growth */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('now')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'now'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Today's Jobs {assignedActiveJob && '🟢 (1 Active)'}
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'wallet'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Wallet & Mobile Money
        </button>

        <button
          onClick={() => setActiveTab('tier')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'tier'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Tier Progress
        </button>

        <button
          onClick={() => setActiveTab('insights')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'insights'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
          <span>Financial Insights (D3)</span>
        </button>

        <button
          onClick={() => setActiveTab('badges')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'badges'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Verification Badges</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'reviews'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>Reviews & Conduct</span>
        </button>
      </div>

      {/* TAB 1: TODAY'S JOBS & EXECUTION FLOW */}
      {activeTab === 'now' && (
        <div className="space-y-4">
          {/* Incoming Request Radar Card (Section 5 Wireframe from UX Doc) */}
          {incomingRequest && isOnline && (
            <div className="bg-amber-50 border-2 border-amber-500 rounded-2xl p-5 shadow-md space-y-4 animate-bounce-subtle">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-md">
                  ⚡ INCOMING JOB DISPATCH
                </span>
                <span className="font-mono text-sm font-extrabold text-amber-900">
                  {countdown}s remaining
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {incomingRequest.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>{incomingRequest.location.area} · {incomingRequest.location.ghanaPostGps}</span>
                  <span>·</span>
                  <span>Client: {incomingRequest.clientName}</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">
                    Agreed Job Price
                  </span>
                  <span className="font-mono text-lg font-black text-slate-900">
                    GH₵ {incomingRequest.basePrice}.00
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">
                    Est. Net Take-Home
                  </span>
                  <span className="font-mono text-base font-bold text-emerald-600">
                    GH₵ {incomingRequest.netProEarnings}.00
                  </span>
                </div>
              </div>

              {/* Big Dual Accept / Decline Buttons (3 taps design) */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => handleDeclineIncoming(incomingRequest.id)}
                  className="py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Decline (No Penalty)
                </button>
                <button
                  onClick={() => handleAcceptIncoming(incomingRequest)}
                  className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Accept Job</span>
                </button>
              </div>
            </div>
          )}

          {/* ACTIVE ASSIGNED JOB WORKFLOW */}
          {assignedActiveJob ? (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Active Job In Progress
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1 truncate">
                    {assignedActiveJob.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5 flex-wrap">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="break-words font-medium">{assignedActiveJob.location.address}</span>
                    <span className="font-mono text-[10px] font-bold text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 break-all">
                      {assignedActiveJob.location.ghanaPostGps}
                    </span>
                  </div>

                  {/* Chat & Call Action Buttons for Pro */}
                  <div className="flex items-center gap-2 mt-2.5">
                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="py-1.5 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat with Client</span>
                    </button>
                    <a
                      href={`tel:${assignedActiveJob.clientPhone}`}
                      className="py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                      <span>Masked Call</span>
                    </a>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs text-slate-400 block">Net Payout</span>
                  <span className="font-mono text-lg font-black text-emerald-600">
                    GH₵ {assignedActiveJob.netProEarnings}
                  </span>
                </div>
              </div>

              {/* Workflow Step 1: En Route -> I Have Arrived */}
              {assignedActiveJob.status === 'pro_en_route' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-700">
                    <span>Target Landmark: <strong>{assignedActiveJob.location.landmark}</strong></span>
                    <a
                      href={`https://maps.google.com/?q=${assignedActiveJob.location.lat},${assignedActiveJob.location.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-600 font-bold underline"
                    >
                      Open in Maps
                    </a>
                  </div>

                  <button
                    onClick={() => handleArrival(assignedActiveJob.id)}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t('iHaveArrived')}</span>
                  </button>
                </div>
              )}

              {/* Workflow Step 2: Arrived -> Diagnose & Submit Itemized Quote */}
              {assignedActiveJob.status === 'arrived' && (
                <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-4">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                      Step 2: Inspect Problem & Build Itemized Quote
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Client must approve your diagnostic quote before tools touch the work.
                    </p>
                  </div>

                  {/* Quote line items */}
                  <div className="space-y-1.5 bg-white p-3 rounded-xl border border-amber-200">
                    {quoteItems.map((qi) => (
                      <div key={qi.id} className="flex items-center justify-between text-xs py-1">
                        <span className="font-medium text-slate-800">{qi.description}</span>
                        <span className="font-mono font-bold text-slate-900">GH₵ {qi.total}.00</span>
                      </div>
                    ))}

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-extrabold text-xs text-slate-900">
                      <span>Total Diagnostic Quote:</span>
                      <span className="font-mono text-sm text-amber-700">
                        GH₵ {quoteItems.reduce((a, b) => a + b.total, 0)}.00
                      </span>
                    </div>
                  </div>

                  {/* Tap to add common replacement parts */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newPartName}
                      onChange={(e) => setNewPartName(e.target.value)}
                      placeholder="Add part e.g. Flexi pipe 1/2 inch"
                      className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
                    />
                    <input
                      type="number"
                      value={newPartPrice}
                      onChange={(e) => setNewPartPrice(e.target.value)}
                      className="w-20 p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none"
                    />
                    <button
                      onClick={handleAddQuoteItem}
                      className="px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg cursor-pointer shrink-0"
                    >
                      + Add
                    </button>
                  </div>

                  <button
                    onClick={() => handleSubmitQuote(assignedActiveJob.id)}
                    className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Submit Itemized Quote to Client for Approval</span>
                  </button>
                </div>
              )}

              {/* Workflow Step 3: Diagnosed / Waiting for Client Approval */}
              {assignedActiveJob.status === 'diagnosed' && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-center space-y-2">
                  <Clock className="w-6 h-6 text-amber-600 mx-auto animate-spin" />
                  <h4 className="text-xs font-bold text-amber-900">Quote Awaiting Client Tap Approval</h4>
                  <p className="text-[11px] text-amber-700">
                    The quote has been sent to {assignedActiveJob.clientName}'s screen. Work pauses until approved.
                  </p>
                </div>
              )}

              {/* Workflow Step 4: In Progress -> Materials Needed or Complete */}
              {assignedActiveJob.status === 'in_progress' && (
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-emerald-900">
                      Work In Progress (Quote Approved)
                    </span>
                    <button
                      onClick={() => toggleMaterialShopRun(assignedActiveJob.id, !assignedActiveJob.materialShopRun)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer border ${
                        assignedActiveJob.materialShopRun
                          ? 'bg-amber-500 text-white border-amber-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{assignedActiveJob.materialShopRun ? 'On Shop Run...' : 'Run to Hardware Shop'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleCompleteWork(assignedActiveJob.id)}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Upload After-Photo & Submit Completed</span>
                  </button>
                </div>
              )}

              {/* Workflow Step 5: Completed / Awaiting Sign-Off */}
              {assignedActiveJob.status === 'completed' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                  <h4 className="text-xs font-bold text-slate-900">Work Submitted for Client Sign-Off</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Funds release to your Available balance after the 24-hour protection hold window.
                  </p>
                </div>
              )}
            </div>
          ) : (
            !incomingRequest && (
              <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Wrench className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Radar Active in Accra</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {isOnline
                    ? 'You are Online. Nearby jobs in your trade will pop up here with an audio alert and 40s countdown.'
                    : 'You are currently offline. Switch your status to Online to start receiving repair calls.'}
                </p>
              </div>
            )
          )}

          {/* Wireframe Pro App Sub-tabs (Now, Scheduled, Projects, Done) & Footer Note */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-around text-xs font-extrabold border-b border-slate-100 pb-2.5">
              <button className="text-amber-600 border-b-2 border-amber-600 pb-1 cursor-pointer">
                Now
              </button>
              <button className="text-slate-500 hover:text-slate-900 pb-1 cursor-pointer">
                Scheduled
              </button>
              <button className="text-slate-500 hover:text-slate-900 pb-1 cursor-pointer">
                Projects
              </button>
              <button className="text-slate-500 hover:text-slate-900 pb-1 cursor-pointer">
                Done
              </button>
            </div>
            <p className="text-[11px] text-center text-slate-500 font-medium italic">
              Alerts also sent via instant SMS & WhatsApp notifications
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: WALLET & MOBILE MONEY PAYOUTS */}
      {activeTab === 'wallet' && (
        <div className="space-y-4">
          {/* Three Balance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                Pending (In Escrow Hold)
              </span>
              <span className="font-mono text-xl font-extrabold text-amber-600 block mt-1">
                GH₵ {proProfile?.walletPending || 0}.00
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">Releases in 24h</span>
            </div>

            <div className="bg-white rounded-xl p-4 border border-emerald-300 bg-emerald-50/30 shadow-xs">
              <span className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider block">
                Available to Withdraw
              </span>
              <span className="font-mono text-xl font-extrabold text-emerald-700 block mt-1">
                GH₵ {proProfile?.walletAvailable || 0}.00
              </span>
              <span className="text-[10px] text-emerald-600 mt-1 block">Instant MoMo Ready</span>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                Total Paid Out
              </span>
              <span className="font-mono text-xl font-extrabold text-slate-900 block mt-1">
                GH₵ {proProfile?.walletPaidOut || 0}.00
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">58 Completed Jobs</span>
            </div>
          </div>

          {/* Instant Cash-Out Widget */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Instant Mobile Money Cash-Out</h3>
                <p className="text-xs text-slate-500">
                  Withdraw available earnings directly to MTN MoMo, Telecel Cash, or AT Money.
                </p>
              </div>
              <button
                onClick={handleShareWhatsAppReceipt}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{whatsappCopied ? 'Copied!' : 'WhatsApp Receipt'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400 text-xs">
                  GH₵
                </span>
                <input
                  type="number"
                  value={cashoutAmount}
                  onChange={(e) => setCashoutAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <button
                onClick={handleCashout}
                disabled={(proProfile?.walletAvailable || 0) < parseInt(cashoutAmount || '0')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold cursor-pointer transition-colors shadow-xs shrink-0"
              >
                Cash Out to MoMo
              </button>
            </div>

            {cashoutSuccess && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 animate-fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>
                  GH₵ {cashoutAmount} transferred successfully to {currentUser.phone} (MTN MoMo).
                </span>
              </div>
            )}
          </div>

          {/* Fee & Commission Transparency Breakdown (from Section 12) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-900 block">
              Transparent Pro Fee Model ({proProfile?.tier} Tier):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600">
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Platform Commission</span>
                <span className="font-mono font-bold text-slate-900">15%</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Insurance Pool</span>
                <span className="font-mono font-bold text-emerald-700">2.5%</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Fixly Matching Top-up</span>
                <span className="font-mono font-bold text-amber-600">+1.0%</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Net Artisan Share</span>
                <span className="font-mono font-bold text-slate-900">82.5%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TIER PROGRESS & CLAIM LIMITS */}
      {activeTab === 'tier' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Current Standing: {proProfile?.tier} Tier
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your insurance-backed claim limit is: <strong className="text-slate-900">GH₵ {proProfile?.claimLimit}</strong>
                </p>
              </div>
              <Award className="w-8 h-8 text-amber-500" />
            </div>

            {/* Formula Breakdown from Section 8 */}
            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 text-xs space-y-2">
              <span className="font-bold text-slate-900 block font-mono text-[11px]">
                Limit Formula: (Base + a·J + b·E) × Quality(Q) × Risk(R)
              </span>
              <p className="text-slate-600 text-[11px]">
                58 in-app verified jobs, 0 valid claims in 12 months, and 98% problem-solved rate provide you with priority dispatch and project eligibility.
              </p>
            </div>

            {/* Next Tier Roadmap */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-800 block">
                Path to Elite Tier (GH₵20,000 Cap & Tool Financing):
              </span>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>58 of 100 required jobs completed (58%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Quality Score 94 / 100 (Required: 85+)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Ghana Card & Association Master Craftsman verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: D3 FINANCIAL INSIGHTS */}
      {activeTab === 'insights' && <ProFinancialInsights />}

      {/* TAB 5: VISUAL VERIFICATION BADGES PASSPORT */}
      {activeTab === 'badges' && <ProBadgesCenter />}

      {/* TAB 6: CUSTOMER REVIEWS & PROFESSIONAL CONDUCT */}
      {activeTab === 'reviews' && (
        <div className="space-y-4 animate-fade-in">
          {/* Header Overview Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
                  Quality & Reputation System
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                  Client Reviews & Professional Conduct
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xl">
                  Client sign-off ratings are gathered through Fixly's 20-second objective completion audit, verifying workmanship quality and professional conduct.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-amber-50/70 p-3 rounded-2xl border border-amber-200 shrink-0">
                <div className="text-center">
                  <span className="text-2xl font-black text-slate-900 block font-mono">
                    {proProfile?.rating || 4.9}
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-500 justify-center">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <div className="border-l border-amber-200 pl-3 text-[11px] text-slate-600">
                  <div><strong>{proProfile?.jobsCompleted || 58}</strong> Verified Jobs</div>
                  <div className="text-emerald-700 font-bold">100% Escrow Released</div>
                </div>
              </div>
            </div>

            {/* 4 Scorecard Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[11px] font-bold">Conduct Score</span>
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-base font-extrabold text-slate-900">98.4%</div>
                <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                  Thumbs Up Conduct
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[11px] font-bold">Problem Solved</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-base font-extrabold text-slate-900">
                  {proProfile?.problemSolvedRate || 98}%
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  1st-visit resolution
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[11px] font-bold">On-Time Arrival</span>
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                </div>
                <div className="text-base font-extrabold text-slate-900">
                  {proProfile?.onTimeRate || 98.5}%
                </div>
                <span className="text-[10px] text-sky-700 font-semibold block mt-0.5">
                  GPS-verified
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[11px] font-bold">Conduct Flags</span>
                  <Flag className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="text-base font-extrabold text-emerald-700">0 Flags</div>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Past 12 months
                </span>
              </div>
            </div>
          </div>

          {/* Conduct Safeguard Protocol */}
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 text-xs flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-950 font-bold block">
                Professional Conduct Standards & Guarantee:
              </strong>
              <p className="text-emerald-800 text-[11px] mt-0.5 leading-relaxed">
                Fixly monitors punctual arrival, respectful communication, work site cleanliness, and transparent billing. Verified thumbs-up feedback directly increases your insurance claim limit and tier ranking.
              </p>
            </div>
          </div>

          {/* Verified Client Reviews List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Client Feedback History ({proProfile?.reviews?.length || 3} Verified)
            </h4>

            {(proProfile?.reviews && proProfile.reviews.length > 0
              ? proProfile.reviews
              : [
                  {
                    id: 'rev-def-1',
                    jobId: 'job-1',
                    jobTitle: 'Kitchen sink pipe repair & cartridge installation',
                    clientId: 'c1',
                    clientName: 'Nana Osei Tutu',
                    workmanshipRating: 5,
                    conductRating: 5,
                    conductThumbsUp: true,
                    problemSolved: 'yes' as const,
                    reviewText:
                      'Arrived in 18 minutes to East Legon. Super neat work, had the exact brass fittings, and left the floor completely dry.',
                    createdAt: '2026-10-28T14:32:00Z',
                  },
                  {
                    id: 'rev-def-2',
                    jobId: 'job-2',
                    jobTitle: 'Bathroom shower mixer replacement',
                    clientId: 'c2',
                    clientName: 'Abena Mansa',
                    workmanshipRating: 5,
                    conductRating: 5,
                    conductThumbsUp: true,
                    problemSolved: 'yes' as const,
                    reviewText:
                      'Courteous, showed his Ghana Card without asking, and explained the escrow guarantee clearly. Highly recommended!',
                    createdAt: '2026-10-25T11:15:00Z',
                  },
                  {
                    id: 'rev-def-3',
                    jobId: 'job-3',
                    jobTitle: 'Overhead water tank float valve maintenance',
                    clientId: 'c3',
                    clientName: 'Dr. Kobina Adams',
                    workmanshipRating: 4,
                    conductRating: 5,
                    conductThumbsUp: true,
                    problemSolved: 'yes' as const,
                    reviewText:
                      'Very dependable. Solved the overflow issue cleanly within an hour.',
                    createdAt: '2026-10-20T09:40:00Z',
                  },
                ]
            ).map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                      {rev.clientName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{rev.clientName}</h5>
                      <span className="text-[10px] text-slate-400">
                        {rev.jobTitle} · {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Workmanship Stars */}
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 text-xs font-bold text-amber-900">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{rev.workmanshipRating}.0</span>
                    </div>

                    {/* Conduct Thumbs Up / Flag */}
                    {rev.conductThumbsUp !== false ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 text-[10px] font-bold">
                        <ThumbsUp className="w-3 h-3 text-emerald-600" />
                        <span>Good Conduct</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-rose-50 text-rose-800 rounded-lg border border-rose-200 text-[10px] font-bold">
                        <Flag className="w-3 h-3 text-rose-600" />
                        <span>Flagged Conduct</span>
                      </span>
                    )}

                    {/* Problem Solved */}
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-sky-50 text-sky-800 rounded-lg border border-sky-200 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3 text-sky-600" />
                      <span>Solved: {rev.problemSolved}</span>
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 italic bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  "{rev.reviewText}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real-time Job Chat Modal for Pro */}
      {assignedActiveJob && (
        <JobChatModal
          job={assignedActiveJob}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};
