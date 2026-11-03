import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useLanguage } from '../context/LanguageContext';
import { usePreventScroll } from '../hooks/usePreventScroll';
import { AlertTriangle, PhoneCall, ShieldAlert, Share2, Check, X, MapPin, Radio } from 'lucide-react';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({ isOpen, onClose }) => {
  const { triggerSos, currentUser, activeJob } = useMarketplace();
  const { t } = useLanguage();
  usePreventScroll(isOpen);
  const [triggered, setTriggered] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const location = activeJob?.location || currentUser.location || {
    lat: 5.6354,
    lng: -0.1582,
    address: 'Bawaleshie Road, East Legon',
    ghanaPostGps: 'GA-492-3841',
    landmark: 'Behind A&C Mall, Green Gate House',
    area: 'East Legon',
  };

  const handleTriggerAlarm = (silent: boolean) => {
    triggerSos(silent);
    setTriggered(true);
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(
      `https://fixly.gh/track/${activeJob?.id || 'live-sos'}?gps=${location.ghanaPostGps}&user=${encodeURIComponent(currentUser.name)}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border-2 border-rose-500 overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-rose-100">
          <div className="flex items-center gap-2 text-rose-600">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
            <h2 className="text-lg font-black tracking-tight text-slate-900">
              Fixly Safety & SOS Incident Center
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Location beacon box */}
        <div className="mt-4 p-3.5 bg-rose-50 rounded-xl border border-rose-200">
          <div className="flex items-start gap-2 text-xs text-rose-900">
            <MapPin className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <div>
              <span className="font-bold block">Live Verified Location:</span>
              <span className="font-mono text-sm font-bold text-rose-700 block">
                {location.ghanaPostGps}
              </span>
              <span className="text-[11px] text-rose-800 block">
                {location.address} · {location.landmark}
              </span>
            </div>
          </div>
        </div>

        {/* Main Trigger state */}
        {!triggered ? (
          <div className="mt-5 space-y-3">
            <p className="text-xs text-slate-600">
              Safety is guaranteed both ways. Tap below to alert the 24/7 Fixly Operations Response Team, notify Ghana Emergency Services, and beacon your live location.
            </p>

            {/* Giant SOS Trigger */}
            <button
              onClick={() => handleTriggerAlarm(false)}
              className="w-full py-4 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-extrabold text-base tracking-wide flex items-center justify-center gap-3 shadow-lg shadow-rose-600/30 cursor-pointer transition-all"
            >
              <AlertTriangle className="w-6 h-6" />
              <span>BROADCAST EMERGENCY SOS</span>
            </button>

            {/* Silent Trigger */}
            <button
              onClick={() => handleTriggerAlarm(true)}
              className="w-full py-2.5 px-4 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Radio className="w-4 h-4" />
              <span>Send Silent Beacon to Ops (No Sound On-Screen)</span>
            </button>
          </div>
        ) : (
          <div className="mt-5 p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-2 font-black text-lg">
              ✓
            </div>
            <h4 className="text-sm font-bold text-emerald-900">Incident Alert Active</h4>
            <p className="text-xs text-emerald-700 mt-1">
              Fixly Ops supervisor dispatched. Incident ticket logged with GPS coordinate {location.ghanaPostGps}.
            </p>
          </div>
        )}

        {/* Rapid Call Hotlines */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
          <a
            href="tel:191"
            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-center text-xs font-bold flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
            <span>Police (191 / 112)</span>
          </a>

          <a
            href="tel:+233240001122"
            className="p-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-center text-xs font-bold flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Fixly Ops Hotline</span>
          </a>
        </div>

        {/* Check-in Prompt (Screen 3 Wireframe) */}
        <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block">
              Check-in Prompt
            </span>
            <span className="text-[10px] text-slate-400">GPS Check-in</span>
          </div>
          <p className="text-slate-700 font-medium">Are you okay?</p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => onClose()}
              className="py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl cursor-pointer"
            >
              I am OK
            </button>
            <button
              onClick={() => handleTriggerAlarm(false)}
              className="py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl cursor-pointer shadow-xs"
            >
              Need Help
            </button>
          </div>
        </div>

        {/* Share Live Tracking Link */}
        <div className="mt-3">
          <button
            onClick={handleShareLink}
            className="w-full py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Tracking Link Copied!' : 'Share Live Job Status'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
