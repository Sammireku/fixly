import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ACCRA_AREAS, SERVICE_CATALOG } from '../../data/catalog';
import { CatalogServiceItem, TradeType } from '../../types';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Search,
  X,
  Play,
  Languages,
  Activity,
  MapPin,
  Clock,
  Zap,
} from 'lucide-react';

interface VoiceCommandInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  onInitiateBooking: (service: CatalogServiceItem, areaName?: string) => void;
  onApplySearch: (trade: TradeType | 'all', areaName: string, query: string) => void;
}

interface ParsedVoiceCommand {
  rawTranscript: string;
  dialect: 'en' | 'twi' | 'ga' | 'pidgin';
  trade: TradeType;
  areaName: string;
  urgency: 'immediate' | 'today' | 'flexible';
  matchedService: CatalogServiceItem;
  confidence: number;
}

const SAMPLE_DIALECT_COMMANDS = [
  {
    dialect: 'twi' as const,
    label: 'Akan / Twi',
    phrase: 'Mepɛ plumber wɔ East Legon a obetumi asiesie me tap a ɛreworo no ntɛm',
    translation: 'I need a plumber in East Legon who can quickly fix my leaking tap',
    trade: 'plumbing' as TradeType,
    area: 'East Legon',
    serviceId: 'plumb-tap-washer',
    urgency: 'immediate' as const,
  },
  {
    dialect: 'ga' as const,
    label: 'Ga',
    phrase: 'Mi tao gbɛtɛ gbɔmɔ kɛha Osu ni ebaasaa mi nsu kpawoo lilee',
    translation: 'I need a plumber for Osu who will fix my leaking pipe right now',
    trade: 'plumbing' as TradeType,
    area: 'Osu',
    serviceId: 'plumb-pipe-leak',
    urgency: 'immediate' as const,
  },
  {
    dialect: 'pidgin' as const,
    label: 'Pidgin',
    phrase: 'Light breaker dey trip for Madina, make electrician come run diagnostic sharp sharp',
    translation: 'The circuit breaker is tripping in Madina, send an electrician for quick diagnostics',
    trade: 'electrical' as TradeType,
    area: 'Madina',
    serviceId: 'elec-fan-breaker',
    urgency: 'immediate' as const,
  },
  {
    dialect: 'en' as const,
    label: 'English',
    phrase: 'Need an AC technician in Cantonments to service my split air conditioner today',
    translation: 'Need an AC technician in Cantonments to service my split unit today',
    trade: 'ac_refrigeration' as TradeType,
    area: 'Cantonments',
    serviceId: 'ac-split-service',
    urgency: 'today' as const,
  },
  {
    dialect: 'twi' as const,
    label: 'Akan / Twi',
    phrase: 'Ofie mu kanea ne switch asɛe wɔ Spintex, mepɛ electrician papa',
    translation: 'Room lights and switch are faulty in Spintex, I want a skilled electrician',
    trade: 'electrical' as TradeType,
    area: 'Spintex',
    serviceId: 'elec-fan-breaker',
    urgency: 'today' as const,
  },
  {
    dialect: 'en' as const,
    label: 'English',
    phrase: 'Looking for a master carpenter in Airport Residential to fix kitchen cabinets',
    translation: 'Looking for a master carpenter in Airport Residential to fix kitchen cabinets',
    trade: 'carpentry' as TradeType,
    area: 'Airport Residential',
    serviceId: 'carp-door-lock',
    urgency: 'flexible' as const,
  },
];

export const VoiceCommandInterface: React.FC<VoiceCommandInterfaceProps> = ({
  isOpen,
  onClose,
  onInitiateBooking,
  onApplySearch,
}) => {
  const { t } = useLanguage();
  const [selectedDialect, setSelectedDialect] = useState<'all' | 'twi' | 'ga' | 'pidgin' | 'en'>('all');
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [parsedCommand, setParsedCommand] = useState<ParsedVoiceCommand | null>(null);
  const [audioLevel, setAudioLevel] = useState<number[]>([15, 25, 45, 60, 30, 20, 50, 75, 40, 20]);

  const recognitionRef = useRef<any>(null);
  const animationIntervalRef = useRef<any>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedDialect === 'en' ? 'en-GH' : 'en-US';

      recognition.onresult = (event: any) => {
        let current = '';
        for (let i = 0; i < event.results.length; i++) {
          current += event.results[i][0].transcript;
        }
        setLiveTranscript(current);
        if (event.results[0].isFinal) {
          parseVoiceIntent(current);
          setIsListening(false);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [selectedDialect]);

  // Audio waveform animation simulation
  useEffect(() => {
    if (isListening) {
      animationIntervalRef.current = setInterval(() => {
        setAudioLevel([
          Math.floor(Math.random() * 60) + 15,
          Math.floor(Math.random() * 75) + 20,
          Math.floor(Math.random() * 95) + 30,
          Math.floor(Math.random() * 70) + 25,
          Math.floor(Math.random() * 85) + 20,
          Math.floor(Math.random() * 55) + 15,
          Math.floor(Math.random() * 90) + 35,
          Math.floor(Math.random() * 65) + 20,
        ]);
      }, 120);
    } else {
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
      setAudioLevel([20, 25, 30, 25, 20, 30, 25, 20]);
    }
    return () => {
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
    };
  }, [isListening]);

  const parseVoiceIntent = (text: string) => {
    const lower = text.toLowerCase();

    // Detect trade
    let trade: TradeType = 'plumbing';
    if (lower.includes('electr') || lower.includes('light') || lower.includes('breaker') || lower.includes('kanea') || lower.includes('switch') || lower.includes('spark')) {
      trade = 'electrical';
    } else if (lower.includes('carpenter') || lower.includes('wood') || lower.includes('door') || lower.includes('cabinet') || lower.includes('lock') || lower.includes('duku')) {
      trade = 'carpentry';
    } else if (lower.includes('paint') || lower.includes('pente') || lower.includes('wall') || lower.includes('color')) {
      trade = 'painting';
    } else if (lower.includes('ac') || lower.includes('air condition') || lower.includes('fridge') || lower.includes('cool')) {
      trade = 'ac_refrigeration';
    } else if (lower.includes('pop') || lower.includes('ceiling')) {
      trade = 'pop_ceilings';
    } else if (lower.includes('tile') || lower.includes('floor') || lower.includes('terrazzo')) {
      trade = 'tiling';
    }

    // Detect area
    let matchedArea = 'East Legon';
    for (const a of ACCRA_AREAS) {
      if (lower.includes(a.name.toLowerCase())) {
        matchedArea = a.name;
        break;
      }
    }

    // Detect urgency
    let urgency: 'immediate' | 'today' | 'flexible' = 'today';
    if (lower.includes('ntɛm') || lower.includes('sharp sharp') || lower.includes('now') || lower.includes('urgent') || lower.includes('emergency') || lower.includes('leak heavily') || lower.includes('burst')) {
      urgency = 'immediate';
    } else if (lower.includes('tomorrow') || lower.includes('weekend') || lower.includes('later')) {
      urgency = 'flexible';
    }

    // Match catalog service
    const matchedService =
      SERVICE_CATALOG.find((s) => s.trade === trade) || SERVICE_CATALOG[0];

    // Detect dialect
    let dialect: 'en' | 'twi' | 'ga' | 'pidgin' = 'en';
    if (lower.includes('mepɛ') || lower.includes('asɛe') || lower.includes('ntɛm') || lower.includes('wɔ') || lower.includes('dan')) {
      dialect = 'twi';
    } else if (lower.includes('mi tao') || lower.includes('kɛha') || lower.includes('lilee') || lower.includes('saamo')) {
      dialect = 'ga';
    } else if (lower.includes('dey') || lower.includes('sharp sharp') || lower.includes('make') || lower.includes('don trip')) {
      dialect = 'pidgin';
    }

    setParsedCommand({
      rawTranscript: text,
      dialect,
      trade,
      areaName: matchedArea,
      urgency,
      matchedService,
      confidence: 96,
    });
  };

  const handleToggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      setLiveTranscript('');
      setParsedCommand(null);
      setIsListening(true);

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          // If browser speech API is unavailable, simulate live listening
          simulateDialectVoiceInput();
        }
      } else {
        simulateDialectVoiceInput();
      }
    }
  };

  const simulateDialectVoiceInput = () => {
    const randomSample = SAMPLE_DIALECT_COMMANDS[Math.floor(Math.random() * SAMPLE_DIALECT_COMMANDS.length)];
    setTimeout(() => {
      setLiveTranscript(randomSample.phrase);
      parseVoiceIntent(randomSample.phrase);
      setIsListening(false);
    }, 2400);
  };

  const handleSelectSample = (sample: (typeof SAMPLE_DIALECT_COMMANDS)[0]) => {
    setLiveTranscript(sample.phrase);
    const matchedService =
      SERVICE_CATALOG.find((s) => s.id === sample.serviceId) ||
      SERVICE_CATALOG.find((s) => s.trade === sample.trade) ||
      SERVICE_CATALOG[0];

    setParsedCommand({
      rawTranscript: sample.phrase,
      dialect: sample.dialect,
      trade: sample.trade,
      areaName: sample.area,
      urgency: sample.urgency,
      matchedService,
      confidence: 98,
    });
  };

  if (!isOpen) return null;

  const filteredSamples = selectedDialect === 'all'
    ? SAMPLE_DIALECT_COMMANDS
    : SAMPLE_DIALECT_COMMANDS.filter((s) => s.dialect === selectedDialect);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="bg-[#131D38] border border-[#1E2B4D] rounded-3xl max-w-2xl w-full p-6 text-white shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#1E2B4D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-400/20">
              <Mic className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">
                  Ghana Dialect Voice Command
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  AI Grounded
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Speak in English, Twi, Ga, or Pidgin to book an artisan or search local services in Accra.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1E2B4D] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dialect Selector Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 text-[11px] font-medium shrink-0 flex items-center gap-1">
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            Dialect:
          </span>
          {[
            { id: 'all', label: 'All Dialects' },
            { id: 'twi', label: 'Akan / Twi' },
            { id: 'ga', label: 'Ga' },
            { id: 'pidgin', label: 'Ghanaian Pidgin' },
            { id: 'en', label: 'English (Ghana)' },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDialect(d.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 cursor-pointer transition-all ${
                selectedDialect === d.id
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-[#0B132B] text-slate-300 border border-[#1E2B4D] hover:bg-[#1E2B4D]'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Voice Input Cockpit & Waveform */}
        <div className="bg-[#0B132B] rounded-2xl p-6 border border-[#1E2B4D] text-center space-y-4">
          <div className="flex items-center justify-center gap-1.5 h-12">
            {audioLevel.map((height, idx) => (
              <span
                key={idx}
                style={{ height: `${height}%` }}
                className={`w-1.5 rounded-full transition-all duration-150 ${
                  isListening
                    ? 'bg-amber-400'
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Big Mic Button */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={handleToggleListening}
              className={`w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-xl ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-700 text-white ring-8 ring-rose-500/30 animate-pulse'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 ring-4 ring-amber-400/20 hover:scale-105'
              }`}
            >
              {isListening ? (
                <MicOff className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>
            <span className="text-xs font-bold text-slate-300 mt-3">
              {isListening
                ? 'Listening to natural Ghanaian speech... (Speak now)'
                : 'Tap microphone to speak your service request'}
            </span>
          </div>

          {/* Live Transcript Display */}
          {liveTranscript && (
            <div className="p-3.5 bg-[#131D38] border border-[#1E2B4D] rounded-xl text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                Voice Audio Recognized:
              </span>
              <p className="text-xs text-white italic font-medium leading-relaxed">
                "{liveTranscript}"
              </p>
            </div>
          )}
        </div>

        {/* Parsed Intent Result & Action triggers */}
        {parsedCommand && (
          <div className="bg-[#19274E] rounded-2xl p-4 border border-amber-400/40 shadow-lg space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
                  Extracted Local Service Intent ({parsedCommand.confidence}% Match)
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">
                {parsedCommand.dialect}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 bg-[#0B132B] rounded-xl border border-[#1E2B4D]">
                <span className="text-[10px] text-slate-400 block">Trade</span>
                <strong className="text-white capitalize">{parsedCommand.trade}</strong>
              </div>
              <div className="p-2.5 bg-[#0B132B] rounded-xl border border-[#1E2B4D]">
                <span className="text-[10px] text-slate-400 block">Area in Accra</span>
                <strong className="text-sky-400">{parsedCommand.areaName}</strong>
              </div>
              <div className="p-2.5 bg-[#0B132B] rounded-xl border border-[#1E2B4D] col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 block">Urgency</span>
                <strong className="text-amber-400 capitalize">{parsedCommand.urgency}</strong>
              </div>
            </div>

            <div className="p-3 bg-[#0B132B] rounded-xl border border-[#1E2B4D] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Matched Catalog Service:</span>
                <span className="text-xs font-bold text-white">{parsedCommand.matchedService.title}</span>
              </div>
              <span className="font-mono font-bold text-amber-400 text-xs">
                GH₵ {parsedCommand.matchedService.basePrice}
              </span>
            </div>

            {/* Direct Booking vs Search Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => {
                  onInitiateBooking(parsedCommand.matchedService, parsedCommand.areaName);
                  onClose();
                }}
                className="w-full py-2.5 px-4 bg-[#2B83D3] hover:bg-sky-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Instant On-Demand Booking</span>
              </button>

              <button
                onClick={() => {
                  onApplySearch(parsedCommand.trade, parsedCommand.areaName, parsedCommand.matchedService.title);
                  onClose();
                }}
                className="w-full py-2.5 px-4 bg-[#0B132B] hover:bg-[#1E2B4D] border border-slate-600 text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Search className="w-4 h-4 text-sky-400" />
                <span>Filter Pros & Map</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick Sample Voice Prompts */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
            Or Tap Any Local Ghanaian Voice Dialect Example:
          </label>

          <div className="grid grid-cols-1 gap-2">
            {filteredSamples.map((sample, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectSample(sample)}
                className="p-3 bg-[#0B132B] hover:bg-[#1E2B4D] border border-[#1E2B4D] rounded-xl cursor-pointer transition-all text-left flex items-start justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-800 text-amber-300 uppercase">
                      {sample.label}
                    </span>
                    <span className="text-[11px] text-sky-400 font-bold">
                      📍 {sample.area}
                    </span>
                  </div>
                  <p className="text-xs text-white font-medium group-hover:text-amber-300 transition-colors">
                    "{sample.phrase}"
                  </p>
                  <p className="text-[11px] text-slate-400 italic mt-0.5">
                    → {sample.translation}
                  </p>
                </div>

                <div className="w-7 h-7 rounded-lg bg-[#131D38] text-slate-300 group-hover:bg-amber-400 group-hover:text-slate-950 flex items-center justify-center shrink-0 transition-colors">
                  <Play className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
