import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useLanguage } from '../../context/LanguageContext';
import { Job, JobStatus } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  PhoneCall,
  Share2,
  Check,
  AlertTriangle,
  Camera,
  ThumbsUp,
  ThumbsDown,
  Star,
  ArrowRight,
  FileText,
  MessageSquare,
  ShieldAlert,
  Navigation,
  Lock,
  Flag,
} from 'lucide-react';
import { JobChatModal } from '../chat/JobChatModal';
import { EmergencySosModal } from '../EmergencySosModal';

interface ActiveJobTrackerProps {
  job: Job;
  onBack: () => void;
  onOpenDispute: (jobId: string) => void;
}

export const ActiveJobTracker: React.FC<ActiveJobTrackerProps> = ({
  job,
  onBack,
  onOpenDispute,
}) => {
  const { approveQuote, confirmJobSignOff } = useMarketplace();
  const { t, language } = useLanguage();

  const [copied, setCopied] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [workmanship, setWorkmanship] = useState(5);
  const [conduct, setConduct] = useState(5);
  const [problemSolved, setProblemSolved] = useState<'yes' | 'partly' | 'no'>('yes');
  const [conductThumbsUp, setConductThumbsUp] = useState<boolean>(true);
  const [isFlagged, setIsFlagged] = useState<boolean>(false);
  const [flagReason, setFlagReason] = useState<
    'late_arrival' | 'unclean_site' | 'payment_dispute' | 'unprofessional_behavior' | 'other'
  >('late_arrival');
  const [flagNote, setFlagNote] = useState<string>('');
  const [reviewText, setReviewText] = useState('');

  const handleShare = () => {
    navigator.clipboard.writeText(
      `https://fixly.gh/track/${job.id}?gps=${job.location.ghanaPostGps}&pro=${encodeURIComponent(job.proName || 'artisan')}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApproveQuote = async () => {
    await approveQuote(job.id);
  };

  const handleSubmitSignOff = async () => {
    await confirmJobSignOff(job.id, {
      workmanship,
      conduct,
      conductThumbsUp,
      conductFlag: isFlagged
        ? {
            isFlagged: true,
            reason: flagReason,
            note: flagNote,
          }
        : undefined,
      problemSolved,
      reviewText,
    });
    setRatingModalOpen(false);
  };

  const getStepNumber = (status: JobStatus) => {
    switch (status) {
      case 'requested':
        return 1;
      case 'matched':
      case 'pro_en_route':
        return 2;
      case 'arrived':
        return 3;
      case 'diagnosed':
        return 4;
      case 'quote_approved':
      case 'in_progress':
        return 5;
      case 'completed':
        return 6;
      case 'hold_period':
      case 'closed':
        return 7;
      default:
        return 1;
    }
  };

  const currentStep = getStepNumber(job.status);

  return (
    <div className="max-w-3xl mx-auto space-y-5 animate-fade-in pb-12">
      {/* Top back bar & Job Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <button
          onClick={onBack}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
        >
          ← Back to Services
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono">Job ID: {job.id}</span>
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            title="Share with family or diaspora property owner"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Link Copied' : 'Share Job'}</span>
          </button>
        </div>
      </div>

      {/* WIREFRAME 3: Pro on the way, ETA live Map Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Map Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-bold tracking-wide">
              {job.status === 'pro_en_route' || job.status === 'matched'
                ? 'Pro on the way, ETA live'
                : job.status === 'arrived'
                ? 'Artisan Arrived at Gate (GPS Verified)'
                : 'Job in Progress at Location'}
            </span>
          </div>
          <span className="text-xs font-mono font-extrabold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
            {job.status === 'arrived' ? 'Arrived' : '~14 mins away (2.4 km)'}
          </span>
        </div>

        {/* Live Tracking Map SVG Simulation */}
        <div className="h-44 sm:h-52 bg-slate-950 relative overflow-hidden flex items-center justify-center">
          {/* Subtle grid background */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:20px_20px]" />

          {/* Curved route line */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <path
              d="M 50 150 Q 200 40 450 120"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeDasharray="6 6"
              className="animate-pulse"
            />
          </svg>

          {/* Pro origin pin */}
          <div className="absolute left-8 bottom-8 flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-lg animate-bounce">
              🏍️
            </div>
            <span className="text-[10px] font-bold text-slate-200 bg-slate-900/90 px-2 py-0.5 rounded mt-1 border border-slate-700">
              {job.proName?.split(' ')[0] || 'Pro'}
            </span>
          </div>

          {/* Client Destination Pin */}
          <div className="absolute right-10 top-10 flex flex-col items-center">
            <div className="relative">
              <span className="absolute -inset-1 rounded-full bg-emerald-500/40 animate-ping" />
              <div className="relative w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <span className="text-[10px] font-bold text-white bg-slate-900/90 px-2 py-0.5 rounded mt-1 border border-slate-700">
              Your Gate ({job.location.ghanaPostGps || 'GA-492-3841'})
            </span>
          </div>

          {/* Bottom GPS overlay pill */}
          <div className="absolute bottom-3 left-4 right-4 bg-slate-900/90 backdrop-blur-xs text-white p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-300 truncate">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Speed: 28 km/h via Liberation Rd</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              GPS Verified
            </span>
          </div>
        </div>

        {/* Stepper Status Bar */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="grid grid-cols-5 gap-1.5 text-center">
            <div className={`p-1.5 rounded-lg text-[10px] font-bold ${currentStep >= 1 ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
              1. Matched
            </div>
            <div className={`p-1.5 rounded-lg text-[10px] font-bold ${currentStep >= 2 ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
              2. En Route
            </div>
            <div className={`p-1.5 rounded-lg text-[10px] font-bold ${currentStep >= 3 ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
              3. Arrived
            </div>
            <div className={`p-1.5 rounded-lg text-[10px] font-bold ${currentStep >= 5 ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
              4. Working
            </div>
            <div className={`p-1.5 rounded-lg text-[10px] font-bold ${currentStep >= 6 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
              5. Completed
            </div>
          </div>
        </div>
      </div>

      {/* WIREFRAME 3: Pro Card with [Call] [Chat] [Share] */}
      {job.proName && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-xs">
                {job.proName.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-slate-900 truncate">
                    {job.proName}
                  </h3>
                  <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                    {job.proTier || 'Pro'} Tier
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>ID Verified</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 capitalize mt-0.5">
                  Verified {job.trade.replace(/_/g, ' ')} Specialist · 98% Problem Solved
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs text-slate-400 block">Total Agreed Price</span>
              <span className="font-mono text-lg font-black text-slate-900">
                GH₵ {job.totalAmount}
              </span>
            </div>
          </div>

          {/* Action Row: [Call] [Chat] [Share] */}
          <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-100">
            <a
              href={`tel:${job.proPhone || '+233244567890'}`}
              className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>Call</span>
            </a>

            <button
              onClick={() => setIsChatOpen(true)}
              className="py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs relative"
            >
              <MessageSquare className="w-4 h-4 text-slate-950" />
              <span>Chat</span>
              <span className="w-2 h-2 rounded-full bg-rose-600 absolute -top-0.5 -right-0.5 ring-2 ring-white" />
            </button>

            <button
              onClick={handleShare}
              className="py-2.5 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-slate-600" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>

          {/* Wireframe Trust Prompts */}
          <div className="space-y-2 pt-1 text-xs">
            <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[11px] font-medium">
                <strong>Arrival is GPS-verified:</strong> The artisan must physically check in within 50m of your gate.
              </span>
            </div>

            <div className="flex items-center gap-2 text-amber-900 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60">
              <FileText className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-[11px] font-medium">
                <strong>Review the quote on arrival:</strong> Any extra parts or revised labor must be approved by you before physical work begins.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SERVICE ADDRESS CARD - STRICT WRAPPING TO PREVENT OVERFLOW */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3 overflow-hidden">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Service Address & Gate Access</span>
          </span>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded shrink-0">
            Navigation Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs min-w-0">
          <div className="min-w-0 overflow-hidden">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Street & Neighborhood
            </span>
            <p className="text-xs font-bold text-slate-900 break-words max-w-full overflow-hidden mt-0.5 leading-snug">
              {job.location?.address || 'East Legon, Greater Accra'}
            </p>
          </div>

          <div className="min-w-0 overflow-hidden">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Ghana Post Digital GPS
            </span>
            <p className="font-mono text-xs font-bold text-amber-900 bg-amber-50 px-2 py-1 rounded border border-amber-200 inline-block break-all max-w-full mt-0.5">
              {job.location?.ghanaPostGps || 'GA-492-3841'}
            </p>
          </div>
        </div>

        {job.location?.landmark && (
          <div className="min-w-0 overflow-hidden pt-1 border-t border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Prominent Landmark & House Note
            </span>
            <p className="text-xs text-slate-700 break-words max-w-full overflow-hidden mt-0.5 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
              {job.location.landmark}
            </p>
          </div>
        )}
      </div>

      {/* PAYMENT HELD IN ESCROW BREAKDOWN (INCLUDES ESCROW COVER IN PRICE) */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
          <div className="flex items-center gap-2 text-emerald-900">
            <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Payment Held Until You Confirm
            </h4>
          </div>
          <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
            100% Escrow Protected
          </span>
        </div>

        <div className="space-y-1.5 text-xs text-slate-700">
          <div className="flex items-center justify-between">
            <span>Base Service Rate</span>
            <span className="font-mono font-semibold text-slate-900">GH₵ {job.basePrice}.00</span>
          </div>

          <div className="flex items-center justify-between text-emerald-800 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>5% Fixly Escrow & Dispute Cover (Included in Price)</span>
            </span>
            <span className="font-mono font-bold">GH₵ {job.protectionFee}.00</span>
          </div>

          <div className="pt-2 border-t border-emerald-200 flex items-center justify-between text-sm font-extrabold text-slate-900">
            <span>Total Escrow Deposit</span>
            <span className="font-mono text-base text-emerald-800">GH₵ {job.totalAmount}.00</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-600 leading-relaxed">
          Your payment is held safely in Fixly Escrow. The artisan receives payout only after you verify the work is done, followed by a 24-hour guarantee hold.
        </p>

        {/* SOS AND SAFETY TOOLS BUTTON (from wireframe 3) */}
        <div className="pt-2">
          <button
            onClick={() => setIsSosOpen(true)}
            className="w-full py-2.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>SOS and Safety Tools (1-Tap Emergency Beacon)</span>
          </button>
        </div>
      </div>

      {/* Captured Voice-to-Text & Acoustic Nuance Notice if present */}
      {job.audioNuanceInfo && (
        <div className="bg-white rounded-2xl p-4 border border-amber-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <span>🎙️ Voice-Captured Task Nuances</span>
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              job.audioNuanceInfo.detectedUrgency === 'Immediate'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {job.audioNuanceInfo.detectedUrgency} Priority
            </span>
          </div>

          <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            "{job.audioNuanceInfo.transcript}"
          </p>

          <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 pt-1">
            <span>Acoustic Signal: <strong className="text-slate-800">{job.audioNuanceInfo.detectedAcoustics[0]}</strong></span>
            <span>·</span>
            <span>Target Keywords: <strong className="text-amber-700">{job.audioNuanceInfo.extractedKeywords.join(', ')}</strong></span>
          </div>
        </div>
      )}

      {/* DIAGNOSTIC QUOTE APPROVAL GATEWAY (CRITICAL FEATURE from document) */}
      {job.status === 'diagnosed' && job.quoteItems && (
        <div className="bg-amber-50 border-2 border-amber-500 rounded-2xl p-5 shadow-sm space-y-4 animate-pulse-border">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
                Artisan Diagnosis Completed on Site
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                Review & Approve Itemized Quote
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                The artisan has inspected the repair in person. Work will NOT start until you approve this quote.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 border border-amber-200 divide-y divide-slate-100">
            {job.quoteItems.map((qi) => (
              <div key={qi.id} className="py-2 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{qi.description}</span>
                  <span className="text-[10px] text-slate-400 capitalize">Type: {qi.type}</span>
                </div>
                <span className="font-mono font-bold text-slate-900">
                  GH₵ {qi.total}.00
                </span>
              </div>
            ))}

            <div className="pt-2 flex items-center justify-between font-extrabold text-sm text-slate-900">
              <span>Revised Total (Labor + Parts)</span>
              <span className="font-mono text-base text-amber-600">
                GH₵ {job.revisedQuote || job.basePrice}.00
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => onOpenDispute(job.id)}
              className="px-4 py-2 border border-slate-300 hover:bg-white text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
            >
              Question Quote
            </button>
            <button
              onClick={handleApproveQuote}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Approve Quote & Authorize Work</span>
            </button>
          </div>
        </div>
      )}

      {/* Completion Sign-Off & Escrow Release */}
      {job.status === 'completed' && (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 block">
                Artisan Completed Work
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                Inspect Work & Confirm Resolution
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Please inspect the repair. Confirming completion releases payment from escrow into a 24-hour protection hold.
              </p>
            </div>
          </div>

          {job.afterPhotos && job.afterPhotos.length > 0 && (
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1">
                Proof Photo Submitted by Pro:
              </span>
              <div className="w-48 h-32 rounded-xl overflow-hidden border border-emerald-200">
                <img src={job.afterPhotos[0]} alt="Work proof" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => onOpenDispute(job.id)}
              className="px-3.5 py-2 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold cursor-pointer"
            >
              Report Problem (Freeze Escrow)
            </button>

            <button
              onClick={() => setRatingModalOpen(true)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>Confirm Solved & Rate Pro</span>
            </button>
          </div>
        </div>
      )}

      {/* Closed State Notification */}
      {job.status === 'closed' && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
          <h4 className="text-sm font-bold text-slate-900">Job Successfully Closed & Escrow Paid</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Thank you for using Fixly. The artisan was compensated and warranty coverage remains active.
          </p>
        </div>
      )}

      {/* Problem / Dispute Trigger */}
      {job.status !== 'closed' && job.status !== 'disputed' && (
        <div className="text-center pt-2">
          <button
            onClick={() => onOpenDispute(job.id)}
            className="text-xs text-slate-500 hover:text-rose-600 underline cursor-pointer"
          >
            Have an issue with this job? Open an Ops Dispute
          </button>
        </div>
      )}

      {/* 20-Second Rating Modal */}
      {ratingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Rate {job.proName} (Takes ~20 seconds)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Objective client feedback determines the pro's claim limit and dispatch tier.
            </p>

            <div className="mt-4 space-y-4">
              {/* Question 1: Problem Solved? */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5">
                  1. Was the problem completely solved?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['yes', 'partly', 'no'] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setProblemSolved(opt)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize cursor-pointer transition-colors ${
                        problemSolved === opt
                          ? 'border-amber-500 bg-amber-50 text-amber-900 ring-1 ring-amber-500'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Workmanship */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                  <span>2. Quality of Workmanship:</span>
                  <span className="text-amber-600">{workmanship} / 5</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setWorkmanship(star)}
                      className="p-1 cursor-pointer hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= workmanship ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Professional Conduct (Thumbs Up / Flag) */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5">
                  3. Professional Conduct (Thumbs-up or Flag)
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => {
                      setConductThumbsUp(true);
                      setIsFlagged(false);
                      setConduct(5);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                      conductThumbsUp && !isFlagged
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4 text-emerald-600" />
                    <span>Thumbs Up (Good Conduct)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setConductThumbsUp(false);
                      setIsFlagged(true);
                      setConduct(2);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                      !conductThumbsUp || isFlagged
                        ? 'border-rose-500 bg-rose-50 text-rose-800 ring-1 ring-rose-500'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4 text-rose-600" />
                    <span>Flag Issue / Thumbs Down</span>
                  </button>
                </div>

                {/* If Flagged or Conduct issue */}
                {(!conductThumbsUp || isFlagged) && (
                  <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2 mt-2 animate-fade-in">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900">
                      <Flag className="w-3.5 h-3.5 text-rose-600" />
                      <span>Select Conduct Flag Reason:</span>
                    </div>
                    <select
                      value={flagReason}
                      onChange={(e) => setFlagReason(e.target.value as any)}
                      className="w-full p-2 bg-white border border-rose-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none"
                    >
                      <option value="late_arrival">Late arrival / uncommunicated delay</option>
                      <option value="unclean_site">Messy site / did not clean up work area</option>
                      <option value="payment_dispute">Off-app payment request / overcharging</option>
                      <option value="unprofessional_behavior">Rude or unprofessional conduct</option>
                      <option value="other">Other conduct concern</option>
                    </select>
                    <input
                      type="text"
                      value={flagNote}
                      onChange={(e) => setFlagNote(e.target.value)}
                      placeholder="Brief detail for operations review..."
                      className="w-full p-2 bg-white border border-rose-200 rounded-lg text-xs text-slate-900 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mt-2.5 mb-1.5">
                  <span>Conduct Rating Score:</span>
                  <span className="text-amber-600">{conduct} / 5</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setConduct(star)}
                      className="p-1 cursor-pointer hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= conduct ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Comments */}
              <div>
                <label className="text-xs text-slate-600 block mb-1">
                  Optional Review Notes:
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="e.g. Very fast arrival, cleaned up the granite counter after..."
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setRatingModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitSignOff}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors"
              >
                Submit Sign-Off
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Job Chat Modal */}
      <JobChatModal
        job={job}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Emergency SOS & Safety Incident Modal */}
      <EmergencySosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
      />
    </div>
  );
};
