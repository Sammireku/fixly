import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { usePreventScroll } from '../../hooks/usePreventScroll';
import {
  getStoredReminderLogs,
  generate1HourJobReminders,
  clearStoredReminderLogs,
  AppointmentReminderLog,
} from '../../lib/smsWhatsappService';
import {
  MessageSquare,
  Smartphone,
  Clock,
  Send,
  CheckCheck,
  Check,
  Bell,
  X,
  Trash2,
  Sparkles,
  UserCheck,
  Wrench,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface SmsWhatsappNotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmsWhatsappNotificationCenter: React.FC<SmsWhatsappNotificationCenterProps> = ({
  isOpen,
  onClose,
}) => {
  const { jobs } = useMarketplace();
  usePreventScroll(isOpen);

  const [logs, setLogs] = useState<AppointmentReminderLog[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<'WhatsApp' | 'SMS'>('WhatsApp');
  const [lastDispatchedToast, setLastDispatchedToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'inbox' | 'trigger' | 'templates'>('inbox');

  useEffect(() => {
    if (isOpen) {
      setLogs(getStoredReminderLogs());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTrigger1HourReminder = (jobId: string) => {
    const targetJob = jobs.find((j) => j.id === jobId) || jobs[0];
    const generated = generate1HourJobReminders(targetJob, selectedChannel);
    setLogs(getStoredReminderLogs());
    setLastDispatchedToast(
      `Automated 1-Hour ${selectedChannel} Reminder dispatched to ${targetJob.clientName} and Artisan ${targetJob.proName || 'Kwame'}`
    );
    setTimeout(() => setLastDispatchedToast(null), 4000);
  };

  const handleClearLogs = () => {
    clearStoredReminderLogs();
    setLogs([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header Bar */}
        <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  Automated SMS & WhatsApp Reminder System
                </h3>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-900/60 px-2 py-0.5 rounded border border-amber-500/30">
                  1-Hour Lead Time
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Dispatches automated 60-minute appointment reminders for clients & pro artisans in Ghana
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dispatch Alert Toast Banner */}
        {lastDispatchedToast && (
          <div className="p-3 bg-emerald-600 text-white text-xs font-bold flex items-center justify-between px-5 animate-slide-down">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{lastDispatchedToast}</span>
            </div>
            <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded">STATUS 200 OK</span>
          </div>
        )}

        {/* Tab Controls */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'inbox'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Sent Log Inbox ({logs.length})
            </button>
            <button
              onClick={() => setActiveTab('trigger')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'trigger'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Trigger 1-Hour Reminder
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'templates'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Ghana SMS & WhatsApp Templates
            </button>
          </div>

          {/* Channel Selector Toggle */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setSelectedChannel('WhatsApp')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold flex items-center gap-1 cursor-pointer transition-all ${
                selectedChannel === 'WhatsApp'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={() => setSelectedChannel('SMS')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold flex items-center gap-1 cursor-pointer transition-all ${
                selectedChannel === 'SMS'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3 h-3" />
              <span>SMS Gateway</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-100/40">
          {/* TAB 1: SENT LOG INBOX */}
          {activeTab === 'inbox' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Showing automated 60-min lead reminders sent to MTN & Telecel lines</span>
                {logs.length > 0 && (
                  <button
                    onClick={handleClearLogs}
                    className="text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Log</span>
                  </button>
                )}
              </div>

              {logs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 space-y-2">
                  <Bell className="w-8 h-8 text-slate-400 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-800">No Reminders Dispatched Yet</h4>
                  <p className="text-xs text-slate-500">
                    Switch to the "Trigger 1-Hour Reminder" tab to simulate automated appointment alerts.
                  </p>
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            log.channel === 'WhatsApp'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {log.channel}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.recipientRole === 'client'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-purple-100 text-purple-900'
                          }`}
                        >
                          To {log.recipientRole === 'client' ? 'Client' : 'Pro Artisan'}: {log.recipientRole === 'client' ? log.clientName : log.proName}
                        </span>

                        <span className="text-[11px] font-mono text-slate-500">
                          ({log.recipientPhone})
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{new Date(log.sentAt).toLocaleTimeString()}</span>
                        <span className="text-emerald-600 font-bold flex items-center gap-0.5 ml-1">
                          {log.status === 'Read' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span>{log.status}</span>
                        </span>
                      </div>
                    </div>

                    {/* Rendered Message Bubble */}
                    <div
                      className={`p-3 rounded-xl border text-xs font-mono leading-relaxed whitespace-pre-wrap ${
                        log.channel === 'WhatsApp'
                          ? 'bg-emerald-50/70 border-emerald-200 text-slate-800'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      {log.messageText}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Appointment Job: <strong>{log.jobTitle}</strong></span>
                      <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        1 HOUR REMINDER (Scheduled {log.scheduledTime})
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: TRIGGER 1-HOUR REMINDER */}
          {activeTab === 'trigger' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-1">
                  Active Scheduled Jobs Ready for 1-Hour Sweep:
                </h4>
                <p className="text-xs text-slate-500">
                  Select an active booking to trigger automated SMS & WhatsApp appointment notifications.
                </p>
              </div>

              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-extrabold text-slate-900 truncate">
                        {job.title}
                      </h4>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {job.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                      <span>Client: <strong className="text-slate-800">{job.clientName}</strong></span>
                      <span>·</span>
                      <span>Artisan: <strong className="text-slate-800">{job.proName || 'Kwame Mensah'}</strong></span>
                      <span>·</span>
                      <span>Scheduled: <strong className="text-amber-700">{job.scheduledTime || 'Today 2:00 PM'}</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTrigger1HourReminder(job.id)}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs shrink-0 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send 1-Hour Reminder ({selectedChannel})</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: TEMPLATES */}
          {activeTab === 'templates' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>Client WhatsApp Template (1 Hour Before)</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-mono text-slate-800 space-y-2 leading-relaxed">
                  <p>🔔 *Fixly Ghana 1-Hour Reminder*</p>
                  <p>Hello [Client Name], your verified artisan *[Artisan Name]* ([Trade] ⭐[Rating]) is arriving in 1 HOUR at [Scheduled Time] for "[Job Title]".</p>
                  <p>📍 Location: [GPS Code] - [Landmark]</p>
                  <p>🛡️ Escrow Protected: GH₵[Amount] held safely until you confirm completion.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-blue-800 font-bold text-xs">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span>Pro Artisan SMS Template (1 Hour Before)</span>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs font-mono text-slate-800 space-y-2 leading-relaxed">
                  <p>Fixly Pro SMS: Reminder! Appointment #[Job ID] for "[Job Title]" starts in 1 HOUR ([Scheduled Time]) at [Area].</p>
                  <p>Client: [Client Name] ([Client Phone]).</p>
                  <p>Tap link to open GPS map & build itemized quote: fixly.gh/job/[Job ID]</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Ghana Telco Gateway (MTN MoMo SMS / Telecel WhatsApp Business API integrated)</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer"
          >
            Close Notification Center
          </button>
        </div>
      </div>
    </div>
  );
};
