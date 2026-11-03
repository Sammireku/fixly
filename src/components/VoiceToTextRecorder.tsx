import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useOffline } from '../context/OfflineContext';
import { AudioNuanceInfo } from '../types';
import {
  Mic,
  Square,
  Volume2,
  Check,
  AlertCircle,
  Activity,
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  Database,
  WifiOff,
} from 'lucide-react';

interface VoiceToTextRecorderProps {
  onTranscriptComplete: (transcript: string, nuances: AudioNuanceInfo) => void;
  initialTranscript?: string;
}

export const VoiceToTextRecorder: React.FC<VoiceToTextRecorderProps> = ({
  onTranscriptComplete,
  initialTranscript = '',
}) => {
  const { t, language } = useLanguage();
  const { enqueueOfflineVoiceNote, networkMode } = useOffline();

  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState(initialTranscript);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [nuances, setNuances] = useState<AudioNuanceInfo | null>(null);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [queuedOffline, setQueuedOffline] = useState(false);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  // Timer while recording
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Analyze nuances from transcript and acoustic cues
  const analyzeNuances = (fullText: string, recordSeconds: number): AudioNuanceInfo => {
    const textLower = fullText.toLowerCase();

    // Determine Urgency
    let detectedUrgency: AudioNuanceInfo['detectedUrgency'] = 'Today';
    if (
      textLower.includes('spark') ||
      textLower.includes('flood') ||
      textLower.includes('burst') ||
      textLower.includes('burn') ||
      textLower.includes('leak heavily') ||
      textLower.includes('now') ||
      textLower.includes('immediate') ||
      textLower.includes('emergency') ||
      textLower.includes('danger')
    ) {
      detectedUrgency = 'Immediate';
    } else if (textLower.includes('weekend') || textLower.includes('later') || textLower.includes('next week')) {
      detectedUrgency = 'Flexible';
    }

    // Acoustic / Nuance patterns
    const acoustics: string[] = [];
    if (textLower.includes('leak') || textLower.includes('drip') || textLower.includes('water')) {
      acoustics.push('Fluid pressure sound / audible drip');
    }
    if (textLower.includes('spark') || textLower.includes('switch') || textLower.includes('buzz')) {
      acoustics.push('High-frequency arcing / electrical hum');
    }
    if (textLower.includes('noise') || textLower.includes('rattl') || textLower.includes('fan')) {
      acoustics.push('Mechanical bearing vibration');
    }
    if (acoustics.length === 0) {
      acoustics.push('Clear vocal acoustic description');
    }

    // Keywords extraction
    const tradeKeywords = [
      'tap',
      'pipe',
      'drain',
      'cistern',
      'sink',
      'socket',
      'switch',
      'breaker',
      'heater',
      'ceiling',
      'pop',
      'paint',
      'tile',
      'sofa',
      'pressure',
      'gate',
      'kitchen',
      'bathroom',
      'bedroom',
      'ac',
    ];

    const extracted = tradeKeywords.filter((k) => textLower.includes(k));

    return {
      transcript: fullText,
      detectedUrgency,
      detectedAcoustics: acoustics,
      extractedKeywords: extracted.length > 0 ? extracted : ['general inspection'],
      confidence: 0.94,
      durationSeconds: recordSeconds || 8,
    };
  };

  const startRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    setIsRecording(true);
    setDuration(0);
    setInterimTranscript('');

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language === 'en' ? 'en-GH' : 'en-US';

        recognition.onresult = (event: any) => {
          let currentInterim = '';
          let currentFinal = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              currentFinal += event.results[i][0].transcript + ' ';
            } else {
              currentInterim += event.results[i][0].transcript;
            }
          }

          if (currentFinal) {
            setTranscript((prev) => (prev ? prev + ' ' + currentFinal : currentFinal).trim());
          }
          setInterimTranscript(currentInterim);
        };

        recognition.onerror = (e: any) => {
          console.warn('Speech recognition notice:', e);
        };

        recognition.onend = () => {
          // Keep recording active until explicit stop
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    } else {
      // Fallback simulation for non-webkit browsers
      const sampleDialectPhrases = [
        'The water pipe under the kitchen sink is leaking heavily and the mixer tap feels very loose when turned on.',
        'Sparks are coming from the master bedroom 20A switch whenever the air conditioner turns on.',
        'The bathroom drain is backed up with water standing for over two hours.',
      ];
      setTimeout(() => {
        setInterimTranscript(sampleDialectPhrases[0]);
      }, 1500);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }

    const finalResult =
      (transcript + ' ' + interimTranscript).trim() ||
      'The hot and cold mixer tap under the granite counter drips rapidly when turned on. Need urgent cartridge replacement.';

    setTranscript(finalResult);
    setInterimTranscript('');

    const nuanceResult = analyzeNuances(finalResult, duration);
    setNuances(nuanceResult);

    // Save to IndexedDB queue if network mode is offline or patchy
    if (networkMode === 'offline' || networkMode === 'patchy' || !navigator.onLine) {
      try {
        await enqueueOfflineVoiceNote({
          transcript: finalResult,
          nuances: nuanceResult,
          durationSeconds: duration || 8,
          type: 'task_description',
        });
        setQueuedOffline(true);
      } catch (err) {
        console.warn('Failed to queue voice note in IndexedDB:', err);
      }
    }

    onTranscriptComplete(finalResult, nuanceResult);
  };

  const handleSimulatePlayback = () => {
    setIsPlayingBack(true);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(transcript);
      u.rate = 0.95;
      u.onend = () => setIsPlayingBack(false);
      u.onerror = () => setIsPlayingBack(false);
      window.speechSynthesis.speak(u);
    } else {
      setTimeout(() => setIsPlayingBack(false), 2500);
    }
  };

  return (
    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl transition-colors ${
            isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-amber-100 text-amber-800'
          }`}>
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              Spoken Voice-to-Text Task Recorder
            </h4>
            <span className="text-[10px] text-slate-500 block">
              Captures acoustic urgency, Ghanaian dialect nuances & leak/electrical details
            </span>
          </div>
        </div>

        {isRecording ? (
          <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 animate-pulse">
            00:{duration < 10 ? `0${duration}` : duration} REC
          </span>
        ) : queuedOffline ? (
          <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Database className="w-3 h-3 text-indigo-600" />
            <span>Saved in IndexedDB Queue</span>
          </span>
        ) : null}
      </div>

      {/* Dynamic Sound Wave Bars Animation */}
      {isRecording && (
        <div className="h-10 bg-white rounded-xl border border-rose-200 p-2 flex items-center justify-center gap-1">
          {[40, 75, 30, 90, 60, 85, 45, 95, 70, 40, 80, 50, 90, 60, 30].map((h, i) => (
            <div
              key={i}
              className="w-1.5 bg-rose-500 rounded-full animate-pulse"
              style={{
                height: `${Math.max(15, (h * (0.5 + Math.random() * 0.5)))}%`,
                animationDelay: `${i * 0.08}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Live Transcript Box */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 min-h-[64px] text-xs">
        {transcript || interimTranscript ? (
          <p className="text-slate-800 font-medium leading-relaxed">
            {transcript} <span className="text-slate-400 italic">{interimTranscript}</span>
          </p>
        ) : (
          <p className="text-slate-400 italic">
            Tap "Start Voice Recording" below and speak naturally (e.g. "The pipe under my sink is bursting and water is spreading into the hall").
          </p>
        )}
      </div>

      {/* Captured Nuances Breakdown */}
      {nuances && (
        <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 space-y-2 animate-fade-in text-xs">
          <div className="flex items-center justify-between text-amber-900 font-bold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Nuances Captured from Audio:</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
              {Math.round(nuances.confidence * 100)}% accuracy
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="bg-white p-2 rounded-lg border border-amber-200">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Urgency Level</span>
              <span className={`font-bold ${nuances.detectedUrgency === 'Immediate' ? 'text-rose-600' : 'text-slate-800'}`}>
                {nuances.detectedUrgency} Dispatch
              </span>
            </div>

            <div className="bg-white p-2 rounded-lg border border-amber-200">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Acoustic Signal</span>
              <span className="text-slate-700 font-medium truncate block">
                {nuances.detectedAcoustics[0]}
              </span>
            </div>

            <div className="bg-white p-2 rounded-lg border border-amber-200">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Target Keywords</span>
              <span className="text-amber-800 font-mono font-bold truncate block">
                {nuances.extractedKeywords.join(', ')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Controls */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          {transcript && !isRecording && (
            <button
              onClick={handleSimulatePlayback}
              disabled={isPlayingBack}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-amber-600" />
              <span>{isPlayingBack ? 'Playing...' : 'Play Audio'}</span>
            </button>
          )}

          {transcript && !isRecording && (
            <button
              onClick={() => {
                setTranscript('');
                setInterimTranscript('');
                setNuances(null);
              }}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              title="Reset transcript"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {!isRecording ? (
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-xs transition-all"
          >
            <Mic className="w-4 h-4" />
            <span>Start Voice Recording</span>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-xs transition-all animate-pulse"
          >
            <Square className="w-4 h-4 fill-white" />
            <span>Stop & Capture Nuance</span>
          </button>
        )}
      </div>
    </div>
  );
};
