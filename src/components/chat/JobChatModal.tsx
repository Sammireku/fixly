import React, { useState, useEffect, useRef } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { usePreventScroll } from '../../hooks/usePreventScroll';
import { ChatMessage, Job } from '../../types';
import {
  X,
  Send,
  Mic,
  Square,
  Image as ImageIcon,
  Play,
  Pause,
  PhoneCall,
  ShieldCheck,
  CheckCheck,
  Clock,
  Sparkles,
  Paperclip,
} from 'lucide-react';

interface JobChatModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
}

export const JobChatModal: React.FC<JobChatModalProps> = ({ job, isOpen, onClose }) => {
  const { currentUser, sendChatMessage, getJobMessages } = useMarketplace();
  usePreventScroll(isOpen);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [isAttachingPhoto, setIsAttachingPhoto] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load and subscribe to real-time messages
  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = getJobMessages(job.id, (loadedMessages) => {
      setMessages(loadedMessages);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isOpen, job.id]);

  // Scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isRecordingVoice]);

  // Voice recording timer
  useEffect(() => {
    let timer: any;
    if (isRecordingVoice) {
      timer = setInterval(() => setVoiceSeconds((s) => s + 1), 1000);
    } else {
      setVoiceSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecordingVoice]);

  if (!isOpen) return null;

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText.trim();
    setInputText('');
    await sendChatMessage(job.id, { text });
  };

  const handleSendVoiceNote = async () => {
    setIsRecordingVoice(false);
    const duration = voiceSeconds || 4;
    await sendChatMessage(job.id, {
      voiceNoteUrl: 'demo-audio-note',
      voiceDurationSeconds: duration,
      text: `🎙️ Voice Note (${duration}s)`,
    });
  };

  const handleSendPhoto = async (photoUrl: string) => {
    setIsAttachingPhoto(false);
    await sendChatMessage(job.id, {
      photoUrl,
      text: '📷 Photo attached for job inspection',
    });
  };

  const quickChips = [
    "I'm at the gate, please honk",
    "Water main is shut off",
    'Electricity breaker is off',
    'Where can you park?',
    'What is your current ETA?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full h-[90vh] sm:h-[650px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header with Masked Call & Pro Info */}
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
              {(currentUser.role === 'client' ? job.proName : job.clientName)?.slice(0, 2).toUpperCase() || 'FX'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold truncate">
                  {currentUser.role === 'client' ? job.proName || 'Artisan' : job.clientName}
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-0.5">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  <span>Masked</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate">
                Job #{job.id} · <span className="capitalize">{job.trade}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`tel:${job.proPhone || '+233244123456'}`}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs font-bold flex items-center gap-1 border border-slate-700 transition-colors"
              title="Masked secure call"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Call</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Masked Privacy & Escrow Guarantee Ribbon */}
        <div className="px-4 py-1.5 bg-amber-50 border-b border-amber-200 text-[11px] text-amber-900 flex items-center justify-between shrink-0">
          <span className="flex items-center gap-1 font-medium truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Real numbers hidden · Communications backed by Fixly Escrow</span>
          </span>
          <span className="font-bold text-amber-800 shrink-0">GPS Protected</span>
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Sparkles className="w-8 h-8 text-amber-400 mb-2" />
              <p className="text-sm font-bold text-slate-700">Direct Chat Connected</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Discuss landmark details, parking, gate access, or share photos of the issue.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-600">{msg.senderName}</span>
                    <span>·</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 shadow-xs ${
                      isMine
                        ? 'bg-amber-600 text-white rounded-tr-xs'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-tl-xs'
                    }`}
                  >
                    {/* Attached Photo */}
                    {msg.photoUrl && (
                      <div className="mb-2 rounded-xl overflow-hidden border border-black/10">
                        <img
                          src={msg.photoUrl}
                          alt="Shared attachment"
                          className="w-full max-h-48 object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    )}

                    {/* Voice Note Bubble */}
                    {msg.voiceNoteUrl ? (
                      <div className="flex items-center gap-3 py-1">
                        <button
                          type="button"
                          onClick={() =>
                            setPlayingVoiceId(playingVoiceId === msg.id ? null : msg.id)
                          }
                          className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-transform active:scale-95 ${
                            isMine
                              ? 'bg-white text-amber-600'
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          {playingVoiceId === msg.id ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4 ml-0.5" />
                          )}
                        </button>

                        <div className="flex-1">
                          {/* Animated or scrub soundwave bars */}
                          <div className="flex items-center gap-0.5 h-6">
                            {[40, 70, 30, 90, 50, 80, 60, 100, 45, 65, 85, 30, 75].map((h, i) => (
                              <div
                                key={i}
                                style={{ height: `${h}%` }}
                                className={`w-1 rounded-full ${
                                  isMine ? 'bg-white/80' : 'bg-slate-400'
                                } ${playingVoiceId === msg.id ? 'animate-pulse' : ''}`}
                              />
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-[10px] mt-0.5 opacity-80">
                            <span>{msg.voiceDurationSeconds || 5}s Voice Memo</span>
                            <span>{playingVoiceId === msg.id ? 'Playing...' : 'Tap to listen'}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs leading-relaxed whitespace-pre-wrap break-words">
                        {msg.text}
                      </p>
                    )}

                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                        isMine ? 'text-amber-100' : 'text-slate-400'
                      }`}
                    >
                      <CheckCheck className="w-3 h-3 text-current" />
                      <span>Delivered</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(chip);
              }}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium whitespace-nowrap cursor-pointer transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Photo Selection Tray */}
        {isAttachingPhoto && (
          <div className="p-3 bg-amber-50/70 border-t border-amber-200 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-900">
                Attach Diagnostic Photo / Receipt:
              </span>
              <button
                onClick={() => setIsAttachingPhoto(false)}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() =>
                  handleSendPhoto(
                    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
                  )
                }
                className="p-1 rounded-lg border border-slate-300 hover:border-amber-500 bg-white cursor-pointer text-left overflow-hidden"
              >
                <img
                  src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=300&q=80"
                  alt="Pipe leak"
                  className="w-full h-14 object-cover rounded"
                />
                <span className="text-[10px] font-bold text-slate-700 block truncate mt-1">
                  Damaged Valve
                </span>
              </button>

              <button
                onClick={() =>
                  handleSendPhoto(
                    'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=600&q=80'
                  )
                }
                className="p-1 rounded-lg border border-slate-300 hover:border-amber-500 bg-white cursor-pointer text-left overflow-hidden"
              >
                <img
                  src="https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=300&q=80"
                  alt="Circuit breaker"
                  className="w-full h-14 object-cover rounded"
                />
                <span className="text-[10px] font-bold text-slate-700 block truncate mt-1">
                  Distribution Board
                </span>
              </button>

              <button
                onClick={() =>
                  handleSendPhoto(
                    'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=600&q=80'
                  )
                }
                className="p-1 rounded-lg border border-slate-300 hover:border-amber-500 bg-white cursor-pointer text-left overflow-hidden"
              >
                <img
                  src="https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=300&q=80"
                  alt="Spare parts receipt"
                  className="w-full h-14 object-cover rounded"
                />
                <span className="text-[10px] font-bold text-slate-700 block truncate mt-1">
                  Hardware Receipt
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          {isRecordingVoice ? (
            <div className="flex items-center justify-between bg-rose-50 border border-rose-200 rounded-xl p-2.5">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
                <span className="text-xs font-bold text-rose-800">
                  Recording Voice Note... 00:{voiceSeconds < 10 ? `0${voiceSeconds}` : voiceSeconds}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecordingVoice(false)}
                  className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleSendVoiceNote}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Send className="w-3 h-3" />
                  <span>Send Voice</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAttachingPhoto(!isAttachingPhoto)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Attach photo"
              >
                <ImageIcon className="w-5 h-5 text-slate-600" />
              </button>

              <button
                type="button"
                onClick={() => setIsRecordingVoice(true)}
                className="p-2 rounded-xl text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                title="Record voice note"
              >
                <Mic className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message or landmark instruction..."
                className="flex-1 min-w-0 px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:hover:bg-amber-600 text-white cursor-pointer shadow-xs transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
