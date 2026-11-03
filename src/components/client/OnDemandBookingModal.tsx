import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useLanguage } from '../../context/LanguageContext';
import { usePreventScroll } from '../../hooks/usePreventScroll';
import { SERVICE_CATALOG, ACCRA_AREAS } from '../../data/catalog';
import { CatalogServiceItem, LocationInfo, AudioNuanceInfo, UrgencyWindow } from '../../types';
import { VoiceToTextRecorder } from '../VoiceToTextRecorder';
import {
  X,
  Mic,
  Square,
  Volume2,
  Camera,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Radio,
  ChevronRight,
  ArrowLeft,
  Smartphone,
  Calendar,
  Zap,
  Info,
  Calculator,
} from 'lucide-react';

interface OnDemandBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: CatalogServiceItem;
  onJobCreated: (jobId: string) => void;
}

export const OnDemandBookingModal: React.FC<OnDemandBookingModalProps> = ({
  isOpen,
  onClose,
  preselectedService,
  onJobCreated,
}) => {
  const { createJob, currentUser } = useMarketplace();
  const { t, language } = useLanguage();
  usePreventScroll(isOpen);

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedService, setSelectedService] = useState<CatalogServiceItem>(
    preselectedService || SERVICE_CATALOG[0]
  );
  const [description, setDescription] = useState('');
  const [urgencyWindow, setUrgencyWindow] = useState<UrgencyWindow>('within_30m');
  const [scheduledDate, setScheduledDate] = useState('2026-11-03');
  const [scheduledTimeSlot, setScheduledTimeSlot] = useState('14:00');
  const [audioNuance, setAudioNuance] = useState<AudioNuanceInfo | null>(null);

  // Photos
  const [attachedPhotos, setAttachedPhotos] = useState<string[]>([]);

  // Location
  const [selectedArea, setSelectedArea] = useState(ACCRA_AREAS[0]);
  const [landmark, setLandmark] = useState('Behind A&C Mall, Green Gate House');
  const [customGps, setCustomGps] = useState(ACCRA_AREAS[0].gpsPrefix);

  // Payment
  const [momoProvider, setMomoProvider] = useState<'mtn' | 'telecel' | 'at'>('mtn');
  const [momoNumber, setMomoNumber] = useState(currentUser.phone || '+233 24 998 7766');

  // Matching Radar
  const [radarSeconds, setRadarSeconds] = useState(4);
  const [createdJobId, setCreatedJobId] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedService) {
      setSelectedService(preselectedService);
      setStep(2);
    }
  }, [preselectedService]);

  // Radar countdown
  useEffect(() => {
    if (step === 5 && radarSeconds > 0) {
      const timer = setTimeout(() => setRadarSeconds((s) => s - 1), 1000);
      return () => clearTimeout(timer);
    } else if (step === 5 && radarSeconds === 0 && createdJobId) {
      onJobCreated(createdJobId);
      onClose();
    }
  }, [step, radarSeconds, createdJobId]);

  if (!isOpen) return null;

  const basePrice = selectedService.basePrice;
  const protectionFee = Math.round(basePrice * 0.05);
  const totalAmount = basePrice + protectionFee;

  const handleSimulatePhoto = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=600&q=80',
    ];
    setAttachedPhotos((prev) => [...prev, samplePhotos[prev.length % samplePhotos.length]]);
  };

  const handleConfirmAndPay = async () => {
    const locationInfo: LocationInfo = {
      lat: selectedArea.lat,
      lng: selectedArea.lng,
      address: `${selectedArea.name}, Accra`,
      ghanaPostGps: customGps || selectedArea.gpsPrefix,
      landmark: landmark || selectedArea.defaultLandmark,
      area: selectedArea.name,
    };

    const urgencyVal: 'now' | 'today' | 'scheduled' =
      urgencyWindow === 'within_30m' ? 'now' : urgencyWindow === 'scheduled' ? 'scheduled' : 'today';

    const newJob = await createJob({
      trade: selectedService.trade,
      type: 'on_demand',
      title: selectedService.title,
      description: description || `Urgent repair for ${selectedService.title}`,
      urgency: urgencyVal,
      urgencyWindow,
      scheduledTime: urgencyWindow === 'scheduled' ? `${scheduledDate}T${scheduledTimeSlot}:00` : undefined,
      basePrice,
      protectionFee,
      totalAmount,
      location: locationInfo,
      clientVoiceNoteUrl: audioNuance ? 'recorded_nuance_audio.wav' : undefined,
      clientVoiceDuration: audioNuance?.durationSeconds || 12,
      audioNuanceInfo: audioNuance || undefined,
      clientPhotos: attachedPhotos,
    });

    setCreatedJobId(newJob.id);
    setStep(5); // Show matching radar
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            {step > 1 && step < 5 && (
              <button
                onClick={() => setStep((s) => (s - 1) as any)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {step === 5 ? 'Dispatching Vetted Artisan' : 'Book Urgent On-Demand Repair'}
              </h2>
              <span className="text-[11px] text-slate-500">
                Step {step} of 4 · Guaranteed Price & Escrow
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body based on Step */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* STEP 1: Select Service */}
          {step === 1 && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                Select Your Specific Issue:
              </label>
              <div className="space-y-2">
                {SERVICE_CATALOG.filter((s) => s.type === 'on_demand').map((svc) => (
                  <div
                    key={svc.id}
                    onClick={() => setSelectedService(svc)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedService.id === svc.id
                        ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{svc.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{svc.includes}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono text-sm font-extrabold text-slate-900 block">
                        GH₵ {svc.basePrice}
                      </span>
                      <span className="text-[10px] text-slate-400">Fixed Menu</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Transparent Accra Cost Benchmark Card */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 mt-2 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5 text-amber-700">
                    <Calculator className="w-4 h-4 text-amber-500" />
                    <span>Accra Market Price Benchmark:</span>
                  </span>
                  <span className="font-mono text-xs text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                    GH₵ {Math.round(selectedService.basePrice * 0.85)} - GH₵ {Math.round(selectedService.basePrice * 1.35)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-600 pt-1.5 border-t border-slate-200">
                  <div>
                    <span className="block text-slate-400">Call-Out Fee</span>
                    <strong className="text-slate-800 font-mono">GH₵ {selectedService.callOutFee}</strong>
                  </div>
                  <div>
                    <span className="block text-slate-400">Avg. Skilled Labor</span>
                    <strong className="text-slate-800 font-mono">GH₵ {Math.round(selectedService.basePrice * 0.75)}</strong>
                  </div>
                  <div>
                    <span className="block text-slate-400">Escrow Warranty</span>
                    <strong className="text-emerald-700 font-mono">5% Included</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Describe Issue + Urgency Window + Voice Note */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider mb-1">
                  Describe what is happening:
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Water is leaking from the flexible pipe underneath the master bathroom sink..."
                  rows={2}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Voice-to-Text Recording Interface with Nuance Capture */}
              <div>
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider mb-1.5">
                  Describe Task by Voice or Text:
                </label>
                <VoiceToTextRecorder
                  initialTranscript={description}
                  onTranscriptComplete={(spokenText, nuances) => {
                    setDescription(spokenText);
                    setAudioNuance(nuances);
                    if (nuances.detectedUrgency === 'Immediate') {
                      setUrgencyWindow('within_30m');
                    } else if (nuances.detectedUrgency === 'Today') {
                      setUrgencyWindow('within_3h');
                    }
                  }}
                />
              </div>

              {/* HOW SOON DO YOU NEED THE SERVICE (CONFIRMATION DEADLINE SELECTOR) */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>How soon do you need the service?</span>
                  </label>
                  <span className="text-[10px] text-amber-800 bg-amber-100 font-bold px-2 py-0.5 rounded-full">
                    Artisan Must Confirm
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Select your required response window. If no professional confirms within this time, your booking automatically voids with zero fees.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {/* Option 1: Immediate */}
                  <button
                    type="button"
                    onClick={() => setUrgencyWindow('within_30m')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                      urgencyWindow === 'within_30m'
                        ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                        <span>Immediate</span>
                      </span>
                      <span className="text-[9px] font-bold text-amber-900 bg-amber-200/80 px-1.5 py-0.2 rounded">
                        15–30 mins
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600 mt-1 font-medium">
                      Confirm within 30 mins
                    </p>
                    <span className="text-[9px] text-slate-400 block mt-0.5">
                      For burst pipes, blackouts, urgent leaks
                    </span>
                  </button>

                  {/* Option 2: Urgent 1h */}
                  <button
                    type="button"
                    onClick={() => setUrgencyWindow('within_1h')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                      urgencyWindow === 'within_1h'
                        ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-sky-600" />
                        <span>Urgent</span>
                      </span>
                      <span className="text-[9px] font-bold text-sky-900 bg-sky-100 px-1.5 py-0.2 rounded">
                        ~1 Hour
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600 mt-1 font-medium">
                      Confirm within 60 mins
                    </p>
                    <span className="text-[9px] text-slate-400 block mt-0.5">
                      Fast arrival within 1–2 hours today
                    </span>
                  </button>

                  {/* Option 3: Today 3h */}
                  <button
                    type="button"
                    onClick={() => setUrgencyWindow('within_3h')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                      urgencyWindow === 'within_3h'
                        ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Today</span>
                      </span>
                      <span className="text-[9px] font-bold text-emerald-900 bg-emerald-100 px-1.5 py-0.2 rounded">
                        Flexible
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600 mt-1 font-medium">
                      Confirm within 3 hours
                    </p>
                    <span className="text-[9px] text-slate-400 block mt-0.5">
                      Convenient morning or afternoon slot
                    </span>
                  </button>

                  {/* Option 4: Scheduled */}
                  <button
                    type="button"
                    onClick={() => setUrgencyWindow('scheduled')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                      urgencyWindow === 'scheduled'
                        ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-purple-600" />
                        <span>Schedule</span>
                      </span>
                      <span className="text-[9px] font-bold text-purple-900 bg-purple-100 px-1.5 py-0.2 rounded">
                        Future Date
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600 mt-1 font-medium">
                      Confirm before appointment
                    </p>
                    <span className="text-[9px] text-slate-400 block mt-0.5">
                      Pick specific calendar day & time
                    </span>
                  </button>
                </div>

                {/* Scheduled picker if selected */}
                {urgencyWindow === 'scheduled' && (
                  <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Appointment Date</label>
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Preferred Time</label>
                      <select
                        value={scheduledTimeSlot}
                        onChange={(e) => setScheduledTimeSlot(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none"
                      >
                        <option value="09:00">Morning (09:00 AM)</option>
                        <option value="11:30">Late Morning (11:30 AM)</option>
                        <option value="14:00">Afternoon (02:00 PM)</option>
                        <option value="16:30">Late Afternoon (04:30 PM)</option>
                        <option value="18:00">Evening (06:00 PM)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Photo Evidence Attachment */}
              <div>
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider mb-1.5">
                  Attach Photo of Problem (Helps Pro bring correct parts):
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {attachedPhotos.map((img, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                      <img src={img} alt="problem" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <button
                    onClick={handleSimulatePhoto}
                    className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-300 hover:border-amber-400 bg-slate-50 flex flex-col items-center justify-center text-slate-500 hover:text-amber-600 cursor-pointer text-xs"
                  >
                    <Camera className="w-4 h-4 mb-0.5" />
                    <span className="text-[10px] font-bold">+Photo</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Location & Ghana Post GPS */}
          {step === 3 && (
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                Confirm Service Location in Accra:
              </label>

              {/* Neighborhood select */}
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Neighborhood Area</label>
                <select
                  value={selectedArea.name}
                  onChange={(e) => {
                    const found = ACCRA_AREAS.find((a) => a.name === e.target.value);
                    if (found) {
                      setSelectedArea(found);
                      setCustomGps(found.gpsPrefix);
                      setLandmark(found.defaultLandmark);
                    }
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                >
                  {ACCRA_AREAS.map((a) => (
                    <option key={a.name} value={a.name}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ghana Post GPS Code */}
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">
                  Ghana Post GPS Digital Address (Mandatory for Accra navigation)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customGps}
                    onChange={(e) => setCustomGps(e.target.value)}
                    placeholder="e.g. GA-492-3841"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-900 focus:outline-none"
                  />
                  <span className="px-2.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 shrink-0">
                    Verified
                  </span>
                </div>
              </div>

              {/* Landmark note */}
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">
                  Prominent Landmark & House description
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opposite A&C Mall, Black gate with water tank"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                />
              </div>

              {/* Map Preview Simulation */}
              <div className="h-28 w-full rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative flex items-center justify-center">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="relative flex flex-col items-center">
                  <MapPin className="w-6 h-6 text-amber-600 animate-bounce" />
                  <span className="text-[10px] font-bold text-slate-700 bg-white/90 px-2 py-0.5 rounded shadow-xs mt-1">
                    {customGps}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review, Escrow Guarantee & Mobile Money */}
          {step === 4 && (
            <div className="space-y-4">
              {/* Service Destination Address with Wrap */}
              <div className="p-3 bg-slate-100 rounded-xl text-xs space-y-1 overflow-hidden">
                <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Service Destination:</span>
                </div>
                <p className="font-bold text-slate-900 break-words max-w-full overflow-hidden leading-snug">
                  {selectedArea.name}, Accra
                </p>
                <p className="font-mono text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block break-all max-w-full">
                  GPS: {customGps}
                </p>
                {landmark && (
                  <p className="text-[11px] text-slate-600 break-words max-w-full overflow-hidden mt-0.5">
                    Landmark: {landmark}
                  </p>
                )}
              </div>

              {/* Receipt Style Price Breakdown with Escrow Cover Included */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>{selectedService.title}</span>
                  <span className="font-mono font-bold text-slate-900">GH₵ {basePrice}.00</span>
                </div>

                <div className="flex items-center justify-between text-xs text-emerald-700">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Fixly Escrow & Rework Protection (5% Included)</span>
                  </span>
                  <span className="font-mono font-bold">GH₵ {protectionFee}.00</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-extrabold text-slate-900">
                  <span>Total Escrow Price (All-Inclusive)</span>
                  <span className="font-mono text-base text-amber-600">GH₵ {totalAmount}.00</span>
                </div>
              </div>

              {/* Explicit Escrow Timing Protocol (Answers: Are funds held in escrow only when artisan confirms/accepts?) */}
              <div className="p-4 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-emerald-500/10 rounded-2xl border border-amber-300 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                      When Are Your Funds Held in Escrow?
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Fixly Mobile Money Escrow Guarantee Protocol
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
                  {/* Step 1: Pre-Authorization */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-700 font-bold text-[11px]">
                      <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-800 text-[9px] flex items-center justify-center font-black">1</span>
                      <span>1. Request Placed</span>
                    </div>
                    <p className="text-[10px] text-slate-600 leading-snug">
                      Funds (GH₵ {totalAmount}) are <strong>only pre-authorized</strong> on your MoMo wallet. No money is transferred into pro escrow yet.
                    </p>
                  </div>

                  {/* Step 2: Escrow Locked ONLY on Acceptance */}
                  <div className="p-2.5 rounded-xl bg-amber-100/90 border border-amber-400 shadow-2xs space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-950 font-black text-[11px]">
                      <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] flex items-center justify-center font-black">2</span>
                      <span>2. Pro Confirms Job</span>
                    </div>
                    <p className="text-[10px] text-amber-900 leading-snug font-medium">
                      Funds are <strong>formally locked in Fixly Escrow ONLY when the artisan accepts</strong> your request.
                    </p>
                  </div>

                  {/* Step 3: Zero-Risk Expiry / Completion */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px]">
                      <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-900 text-[9px] flex items-center justify-center font-black">3</span>
                      <span>3. Auto-Release</span>
                    </div>
                    <p className="text-[10px] text-slate-600 leading-snug">
                      If unconfirmed before your selected window ({urgencyWindow === 'within_30m' ? '30 mins' : urgencyWindow === 'within_1h' ? '1 hour' : urgencyWindow === 'within_3h' ? '3 hours' : 'appointment'}), the hold <strong>releases instantly at GH₵ 0 fee</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Money Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider mb-2">
                  Select Mobile Money Wallet:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setMomoProvider('mtn')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      momoProvider === 'mtn'
                        ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500 font-bold text-slate-900'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs block font-bold text-amber-600">MTN MoMo</span>
                    <span className="text-[10px] text-slate-400">*170# Prompt</span>
                  </button>

                  <button
                    onClick={() => setMomoProvider('telecel')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      momoProvider === 'telecel'
                        ? 'border-rose-500 bg-rose-50 ring-1 ring-rose-500 font-bold text-slate-900'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs block font-bold text-rose-600">Telecel Cash</span>
                    <span className="text-[10px] text-slate-400">*110# Prompt</span>
                  </button>

                  <button
                    onClick={() => setMomoProvider('at')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      momoProvider === 'at'
                        ? 'border-sky-500 bg-sky-50 ring-1 ring-sky-500 font-bold text-slate-900'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs block font-bold text-sky-600">AT Money</span>
                    <span className="text-[10px] text-slate-400">AirtelTigo</span>
                  </button>
                </div>

                <div className="mt-3">
                  <label className="text-[11px] text-slate-500 block mb-1">
                    Ghana Mobile Money Number
                  </label>
                  <input
                    type="tel"
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Matching Radar Simulation */}
          {step === 5 && (
            <div className="py-8 text-center space-y-4">
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 animate-ping" />
                <div className="absolute inset-2 rounded-full border-2 border-amber-500/40 animate-pulse" />
                <div className="w-14 h-14 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-amber-500/30">
                  <Radio className="w-7 h-7" />
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Matching Verified Artisans in {selectedArea.name}
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Broadcasting your Ghana Post GPS location to top-rated, Ghana Card verified pros nearby...
                </p>
                <div className="font-mono text-xs font-bold text-amber-600 mt-2">
                  Dispatch confirmed in {radarSeconds}s
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {step < 5 && (
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              GH₵ {totalAmount}.00 <span className="text-slate-400 font-normal">in escrow</span>
            </span>

            {step < 4 ? (
              <button
                onClick={() => setStep((s) => (s + 1) as any)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <span>Continue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleConfirmAndPay}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm & Authorize Escrow</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
