import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { usePreventScroll } from '../../hooks/usePreventScroll';
import {
  getStoredReminderLogs,
  generate1HourJobReminders,
  clearStoredReminderLogs,
  AppointmentReminderLog,
  getStoredBroadcastRecords,
  broadcastJobRequestToArtisan,
  broadcastQuoteApprovalToArtisan,
  simulateArtisanSmsReply,
  clearStoredBroadcastRecords,
  JobBroadcastRecord,
  getWhatsAppDispatchUrl,
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
  Radio,
  CornerDownRight,
  RefreshCw,
} from 'lucide-react';

interface SmsWhatsappNotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'broadcast' | 'inbox' | 'trigger' | 'templates';
}

export const SmsWhatsappNotificationCenter: React.FC<SmsWhatsappNotificationCenterProps> = ({
  isOpen,
  onClose,
  initialTab = 'broadcast',
}) => {
  const { jobs } = useMarketplace();
  usePreventScroll(isOpen);

  const [reminderLogs, setReminderLogs] = useState<AppointmentReminderLog[]>([]);
  const [broadcastRecords, setBroadcastRecords] = useState<JobBroadcastRecord[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<'WhatsApp' | 'SMS'>('SMS');
  const [lastDispatchedToast, setLastDispatchedToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'broadcast' | 'inbox' | 'trigger' | 'templates'>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setReminderLogs(getStoredReminderLogs());
      setBroadcastRecords(getStoredBroadcastRecords());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBroadcastJob = (jobId: string, type: 'REQUEST' | 'QUOTE') => {
    const targetJob = jobs.find((j) => j.id === jobId) || jobs[0];
    let record: JobBroadcastRecord;
    if (type === 'REQUEST') {
      record = broadcastJobRequestToArtisan(targetJob, selectedChannel, targetJob.proName || 'Kwame Mensah');
      setLastDispatchedToast(
        `Job Request #${record.id} broadcast via ${selectedChannel} to ${record.recipientName} (${record.recipientPhone})`
      );
    } else {
      record = broadcastQuoteApprovalToArtisan(targetJob, selectedChannel, targetJob.proName || 'Kwame Mensah');
      setLastDispatchedToast(
        `Quote Approval #${record.id} broadcast via ${selectedChannel} to ${record.recipientName} (Escrow Secured)`
      );
    }
    setBroadcastRecords(getStoredBroadcastRecords());
    setTimeout(() => setLastDispatchedToast(null), 5000);
  };

  const handleSimulateSmsReply = (broadcastId: string, replyKeyword: 'YES' | 'NO' | 'START') => {
    simulateArtisanSmsReply(broadcastId, replyKeyword);
    setBroadcastRecords(getStoredBroadcastRecords());
    setLastDispatchedToast(
      `2G GSM Gateway simulated incoming SMS reply "${replyKeyword}" from artisan phone.`
    );
    setTimeout(() => setLastDispatchedToast(null), 4000);
  };

  const handleTrigger1HourReminder = (jobId: string) => {
    const targetJob = jobs.find((j) => j.id === jobId) || jobs[0];
    generate1HourJobReminders(targetJob, selectedChannel);
    setReminderLogs(getStoredReminderLogs());
    setLastDispatchedToast(
      `Automated 1-Hour ${selectedChannel} Reminder dispatched to ${targetJob.clientName} and Artisan ${targetJob.proName || 'Kwame'}`
    );
    setTimeout(() => setLastDispatchedToast(null), 4000);
  };

  const handleClearBroadcasts = () => {
    clearStoredBroadcastRecords();
    setBroadcastRecords([]);
  };

  const handleClearReminders = () => {
    clearStoredReminderLogs();
    setReminderLogs([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header Bar */}
        <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1E5BF0] text-white flex items-center justify-center shadow-sm">
              <Radio className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  Artisan SMS & WhatsApp Broadcast Center
                </h3>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                  2G / GSM Offline Ready
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Delivers instant job alerts & quote approvals to Ghanaian artisans without constant internet access
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
              <Zap className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{lastDispatchedToast}</span>
            </div>
            <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded uppercase font-mono">
              MTN / Telecel Gateway OK
            </span>
          </div>
        )}

        {/* Tab Controls & Channel Toggle */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveTab('broadcast')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'broadcast'
                  ? 'bg-[#1E5BF0] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Artisan Broadcasts ({broadcastRecords.length})
            </button>
            <button
              onClick={() => setActiveTab('inbox')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'inbox'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              1-Hour Reminders ({reminderLogs.length})
            </button>
            <button
              onClick={() => setActiveTab('trigger')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'trigger'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Trigger Job Broadcast
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'templates'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              SMS Shortcodes & wa.me
            </button>
          </div>

          {/* Channel Selector Toggle */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setSelectedChannel('SMS')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold flex items-center gap-1 cursor-pointer transition-all ${
                selectedChannel === 'SMS'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3 h-3" />
              <span>2G SMS Shortcode</span>
            </button>
            <button
              onClick={() => setSelectedChannel('WhatsApp')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold flex items-center gap-1 cursor-pointer transition-all ${
                selectedChannel === 'WhatsApp'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>WhatsApp Direct</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-100/50">
          {/* TAB 1: ARTISAN BROADCASTS */}
          {activeTab === 'broadcast' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600 font-medium bg-blue-50/70 p-3 rounded-2xl border border-blue-200/80">
                <div>
                  <span className="font-bold text-blue-900 block">Offline Artisan Connectivity Protocol:</span>
                  <span>Artisans receive direct 2G SMS or WhatsApp alerts with zero data consumption. They can accept or decline by texting back <strong>YES</strong> or <strong>NO</strong>.</span>
                </div>
                {broadcastRecords.length > 0 && (
                  <button
                    onClick={handleClearBroadcasts}
                    className="text-rose-600 hover:underline flex items-center gap-1 cursor-pointer shrink-0 ml-3"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Logs</span>
                  </button>
                )}
              </div>

              {broadcastRecords.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 space-y-2">
                  <Radio className="w-8 h-8 text-slate-400 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-800">No Job Broadcasts Recorded</h4>
                  <p className="text-xs text-slate-500">
                    Switch to the "Trigger Job Broadcast" tab to dispatch a test job request or quote approval to an artisan.
                  </p>
                </div>
              ) : (
                broadcastRecords.map((bc) => (
                  <div
                    key={bc.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            bc.channel === 'WhatsApp'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {bc.channel}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            bc.broadcastType === 'NEW_JOB_REQUEST'
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          }`}
                        >
                          {bc.broadcastType === 'NEW_JOB_REQUEST' ? 'NEW JOB ALERT' : 'ESCROW QUOTE APPROVED'}
                        </span>

                        <span className="text-xs font-bold text-slate-800">
                          To Artisan: {bc.recipientName}
                        </span>

                        <span className="text-[11px] font-mono text-slate-500">
                          ({bc.recipientPhone})
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-slate-400">
                          {new Date(bc.sentAt).toLocaleTimeString()}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            bc.status === 'Accepted'
                              ? 'bg-emerald-500 text-white'
                              : bc.status === 'Declined'
                              ? 'bg-rose-500 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {bc.status}
                        </span>
                      </div>
                    </div>

                    {/* Formatted Message Preview */}
                    <div
                      className={`p-3 rounded-xl border text-xs font-mono leading-relaxed whitespace-pre-wrap ${
                        bc.channel === 'WhatsApp'
                          ? 'bg-emerald-50/60 border-emerald-200 text-slate-900'
                          : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    >
                      {bc.messageText}
                    </div>

                    {/* Artisan Reply Log if available */}
                    {bc.artisanReply && (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-emerald-900">
                          <CornerDownRight className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>
                            <strong>Artisan 2G SMS Inbound:</strong> {bc.artisanReply}
                          </span>
                        </div>
                        {bc.replyTimestamp && (
                          <span className="text-[10px] text-emerald-700 font-mono">
                            {new Date(bc.replyTimestamp).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action Bar: WhatsApp Open link & 2-Way SMS response simulator */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-500">Simulate Artisan Action:</span>
                        <button
                          onClick={() => handleSimulateSmsReply(bc.id, 'YES')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg cursor-pointer transition-colors shadow-2xs"
                        >
                          Artisan texts "{bc.smsReplyCode || 'YES'}"
                        </button>
                        <button
                          onClick={() => handleSimulateSmsReply(bc.id, 'NO')}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] rounded-lg cursor-pointer transition-colors shadow-2xs"
                        >
                          Artisan texts "NO"
                        </button>
                      </div>

                      {bc.whatsappUrl && (
                        <a
                          href={bc.whatsappUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                        >
                          <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Open wa.me Link</span>
                          <ExternalLink className="w-3 h-3 text-emerald-700" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: SENT LOG INBOX (1-HOUR REMINDERS) */}
          {activeTab === 'inbox' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Showing automated 60-min lead reminders sent to MTN & Telecel lines</span>
                {reminderLogs.length > 0 && (
                  <button
                    onClick={handleClearReminders}
                    className="text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Log</span>
                  </button>
                )}
              </div>

              {reminderLogs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 space-y-2">
                  <Bell className="w-8 h-8 text-slate-400 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-800">No Reminders Dispatched Yet</h4>
                  <p className="text-xs text-slate-500">
                    Switch to the "Trigger Job Broadcast" tab to simulate automated appointment alerts.
                  </p>
                </div>
              ) : (
                reminderLogs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
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

          {/* TAB 3: TRIGGER JOB BROADCAST */}
          {activeTab === 'trigger' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-1">
                  Active Jobs Ready for Artisan Dispatch:
                </h4>
                <p className="text-xs text-slate-500">
                  Broadcast active job requests or quote approvals directly to artisans with 2G SMS or WhatsApp fallback.
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
                      <span>Location: <strong className="text-slate-800">{job.location.ghanaPostGps}</strong></span>
                      <span>·</span>
                      <span>Budget: <strong className="text-blue-700">GH₵{(job.totalAmount || job.basePrice || 150).toFixed(2)}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <button
                      onClick={() => {
                        handleBroadcastJob(job.id, 'REQUEST');
                        setActiveTab('broadcast');
                      }}
                      className="px-3.5 py-2 bg-[#1E5BF0] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>Broadcast Job Alert ({selectedChannel})</span>
                    </button>

                    <button
                      onClick={() => {
                        handleBroadcastJob(job.id, 'QUOTE');
                        setActiveTab('broadcast');
                      }}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Approve Quote & Broadcast</span>
                    </button>

                    <button
                      onClick={() => handleTrigger1HourReminder(job.id)}
                      className="px-2.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 cursor-pointer shadow-xs transition-all"
                      title="Send 1-hour appointment reminder"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>1-Hr Reminder</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: TEMPLATES & SHORTCODES */}
          {activeTab === 'templates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-blue-800 font-bold text-xs">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span>2G GSM SMS Shortcode Format (Zero Internet Required)</span>
                </div>
                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-xs font-mono text-slate-800 space-y-2 leading-relaxed">
                  <p><strong>Outbound Broadcast:</strong></p>
                  <p className="bg-white p-2 rounded border border-blue-100">
                    FIXLY 2G ALERT #901:<br />
                    New Job: Overhead Polytank & Booster Pump Plumbing<br />
                    Area: East Legon (GA-392-1049)<br />
                    Pay: GH₵280.00 in Escrow.<br />
                    Reply "YES 901" to ACCEPT or "NO 901" to pass via free SMS.
                  </p>
                  <p><strong>Artisan 2-Way Reply:</strong></p>
                  <p className="bg-white p-2 rounded border border-blue-100 text-emerald-800 font-bold">
                    To: 1400 (Fixly Ghana Shortcode)<br />
                    Text: "YES 901"
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Works on basic Nokia feature phones or smartphones with no data bundle active.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Business API / wa.me Direct Format</span>
                </div>
                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs font-mono text-slate-800 space-y-2 leading-relaxed">
                  <p><strong>Outbound WhatsApp Message:</strong></p>
                  <p className="bg-white p-2 rounded border border-emerald-100">
                    🛠️ *NEW FIXLY JOB BROADCAST #901*<br /><br />
                    Hello Master *Kwame Mensah*,<br />
                    A new job is waiting for your trade:<br />
                    *Overhead Polytank & Booster Pump Plumbing*<br /><br />
                    📍 *Location:* East Legon (GA-392-1049)<br />
                    💰 *Budget:* GH₵280.00 (Escrow Guaranteed)<br />
                    👤 *Client:* Maya Johnson<br /><br />
                    👉 Reply *YES* to claim this dispatch or click: https://fixly.gh/claim/901
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Artisans can view GPS location and tap one button to open Google Maps or initiate direct phone call.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Ghana Telco Gateway (MTN Shortcode 1400 & Telecel WhatsApp Business API integrated)</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer"
          >
            Close Broadcast Center
          </button>
        </div>
      </div>
    </div>
  );
};

