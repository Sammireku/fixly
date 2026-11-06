/**
 * Fixly Ghana Mock SMS & WhatsApp Automated Notification Service.
 * - Broadcasts job requests and quote approvals to artisans with low/no internet (2G SMS & WhatsApp)
 * - Two-way SMS shortcode reply keywords (YES [ID] / NO [ID])
 * - Generates and manages 1-hour appointment reminders for clients and artisans.
 */

import { Job } from '../types';

export interface AppointmentReminderLog {
  id: string;
  jobId: string;
  jobTitle: string;
  clientName: string;
  clientPhone: string;
  proName: string;
  proPhone: string;
  scheduledTime: string;
  reminderMinutesBefore: number;
  channel: 'SMS' | 'WhatsApp';
  recipientRole: 'client' | 'pro';
  recipientPhone: string;
  messageText: string;
  sentAt: string;
  status: 'Sent' | 'Delivered' | 'Read';
  trackingUrl?: string;
}

export interface JobBroadcastRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  broadcastType: 'NEW_JOB_REQUEST' | 'QUOTE_APPROVED' | 'APPOINTMENT_REMINDER';
  channel: 'SMS' | 'WhatsApp';
  recipientName: string;
  recipientPhone: string;
  recipientRole: 'pro' | 'client';
  locationAddress: string;
  ghanaPostGps: string;
  amountGh: number;
  messageText: string;
  smsReplyCode: string; // e.g. "YES 8821" or "NO 8821"
  sentAt: string;
  status: 'Dispatched' | 'Delivered' | 'Accepted' | 'Declined';
  artisanReply?: string;
  replyTimestamp?: string;
  whatsappUrl?: string;
}

const REMINDER_STORAGE_KEY = 'fixly_reminder_logs';
const BROADCAST_STORAGE_KEY = 'fixly_job_broadcast_logs';

export function getStoredReminderLogs(): AppointmentReminderLog[] {
  try {
    const saved = localStorage.getItem(REMINDER_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.warn('Error reading reminder logs:', err);
  }

  // Pre-seed demo reminder logs for instant visualization
  return [
    {
      id: 'rem-001',
      jobId: 'job-fix-001',
      jobTitle: 'Kitchen Sink Mixer Tap Replacement',
      clientName: 'Afia Addo',
      clientPhone: '+233 24 491 0029',
      proName: 'Kwame Mensah',
      proPhone: '+233 55 812 3901',
      scheduledTime: '14:00 Today',
      reminderMinutesBefore: 60,
      channel: 'WhatsApp',
      recipientRole: 'client',
      recipientPhone: '+233 24 491 0029',
      messageText:
        '🔔 *Fixly Ghana 1-Hour Reminder*\nHello Afia, your verified artisan *Kwame Mensah* (Plumbing Pro ⭐4.9) is arriving in 1 HOUR at 2:00 PM for "Kitchen Sink Mixer Tap Replacement".\n📍 Location: East Legon (GA-492-3841)\n🛡️ Escrow Protected: GH₵180.00 held safely.',
      sentAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      status: 'Read',
      trackingUrl: 'https://fixly.gh/track/job-fix-001',
    },
    {
      id: 'rem-002',
      jobId: 'job-fix-001',
      jobTitle: 'Kitchen Sink Mixer Tap Replacement',
      clientName: 'Afia Addo',
      clientPhone: '+233 24 491 0029',
      proName: 'Kwame Mensah',
      proPhone: '+233 55 812 3901',
      scheduledTime: '14:00 Today',
      reminderMinutesBefore: 60,
      channel: 'SMS',
      recipientRole: 'pro',
      recipientPhone: '+233 55 812 3901',
      messageText:
        'Fixly SMS Alert: Appointment #job-fix-001 starts in 1 HOUR (2:00 PM) at East Legon. Client: Afia Addo. Tap to open GPS map & diagnostic quote builder.',
      sentAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      status: 'Delivered',
    },
  ];
}

export function saveReminderLogs(logs: AppointmentReminderLog[]): void {
  try {
    localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(logs));
  } catch (err) {
    console.warn('Error saving reminder logs:', err);
  }
}

/**
 * Creates 1-hour appointment reminders for both client and pro for a given job.
 */
export function generate1HourJobReminders(
  job: Job,
  channel: 'SMS' | 'WhatsApp' = 'WhatsApp'
): AppointmentReminderLog[] {
  const nowStr = new Date().toISOString();
  const timeLabel = job.scheduledTime || 'in 1 Hour';

  const clientLog: AppointmentReminderLog = {
    id: `rem_c_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    jobId: job.id,
    jobTitle: job.title,
    clientName: job.clientName,
    clientPhone: job.clientPhone || '+233 24 491 0029',
    proName: job.proName || 'Assigned Artisan',
    proPhone: '+233 55 812 3901',
    scheduledTime: timeLabel,
    reminderMinutesBefore: 60,
    channel,
    recipientRole: 'client',
    recipientPhone: job.clientPhone || '+233 24 491 0029',
    messageText:
      channel === 'WhatsApp'
        ? `⏰ *Fixly Appointment Reminder (1 Hour)*\nHello ${job.clientName}! Your artisan *${job.proName || 'Kwame Mensah'}* is scheduled for *${job.title}* at *${timeLabel}*.\n📍 ${job.location.address} (${job.location.ghanaPostGps})\n🛡️ Payment is safely locked in Escrow.`
        : `Fixly SMS: Reminder! Your scheduled repair for "${job.title}" with artisan ${job.proName || 'Kwame Mensah'} is in 1 HOUR (${timeLabel}). GhanaPost: ${job.location.ghanaPostGps}.`,
    sentAt: nowStr,
    status: channel === 'WhatsApp' ? 'Read' : 'Delivered',
    trackingUrl: `https://fixly.gh/track/${job.id}`,
  };

  const proLog: AppointmentReminderLog = {
    id: `rem_p_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    jobId: job.id,
    jobTitle: job.title,
    clientName: job.clientName,
    clientPhone: job.clientPhone || '+233 24 491 0029',
    proName: job.proName || 'Kwame Mensah',
    proPhone: '+233 55 812 3901',
    scheduledTime: timeLabel,
    reminderMinutesBefore: 60,
    channel,
    recipientRole: 'pro',
    recipientPhone: '+233 55 812 3901',
    messageText:
      channel === 'WhatsApp'
        ? `🔧 *Fixly Pro Dispatch Alert*\nMaster Artisan ${job.proName || 'Kwame'}! You have an upcoming appointment in 1 HOUR (${timeLabel}).\nJob: ${job.title}\nClient: ${job.clientName}\nGPS: ${job.location.ghanaPostGps} - ${job.location.landmark}\nTap to tap-in en route.`
        : `Fixly Pro SMS: Reminder! Job "${job.title}" starts in 1 HOUR (${timeLabel}). GPS: ${job.location.ghanaPostGps}. Call client via Fixly app when en route.`,
    sentAt: nowStr,
    status: 'Delivered',
  };

  const currentLogs = getStoredReminderLogs();
  const updated = [clientLog, proLog, ...currentLogs];
  saveReminderLogs(updated);
  return [clientLog, proLog];
}

export function clearStoredReminderLogs(): void {
  localStorage.removeItem(REMINDER_STORAGE_KEY);
}

// =========================================================================
// OFFLINE ARTISAN BROADCAST SERVICE (SMS 2G SHORTCODE & WHATSAPP GATEWAY)
// =========================================================================

export function getWhatsAppDispatchUrl(phoneNumber: string, message: string): string {
  const sanitized = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${sanitized}?text=${encodedMsg}`;
}

export function getStoredBroadcastRecords(): JobBroadcastRecord[] {
  try {
    const saved = localStorage.getItem(BROADCAST_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.warn('Error reading broadcast logs:', err);
  }

  // Pre-seed realistic Ghanaian artisan broadcasts
  return [
    {
      id: 'bc-901',
      jobId: 'job-101',
      jobTitle: 'Overhead Polytank & Booster Pump Plumbing',
      broadcastType: 'NEW_JOB_REQUEST',
      channel: 'SMS',
      recipientName: 'Kofi Owusu',
      recipientPhone: '+233 24 551 8840',
      recipientRole: 'pro',
      locationAddress: 'East Legon, near American House',
      ghanaPostGps: 'GA-392-1049',
      amountGh: 280,
      smsReplyCode: 'YES 901',
      sentAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      status: 'Accepted',
      artisanReply: 'YES 901 - On my way with pipe fittings',
      replyTimestamp: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
      messageText:
        'FIXLY JOB ALERT #901:\nOverhead Polytank & Booster Pump Plumbing at East Legon (GA-392-1049).\nClient: Maya Johnson.\nEst. Escrow Pay: GH₵280.00.\nReply YES 901 to accept or NO 901 to decline via free SMS.',
    },
    {
      id: 'bc-902',
      jobId: 'job-102',
      jobTitle: 'Main Breaker Tripping & Distribution Board Wiring',
      broadcastType: 'QUOTE_APPROVED',
      channel: 'WhatsApp',
      recipientName: 'Kwabena Darko',
      recipientPhone: '+233 55 981 4410',
      recipientRole: 'pro',
      locationAddress: 'Airport Residential, Accra',
      ghanaPostGps: 'GA-112-9021',
      amountGh: 350,
      smsReplyCode: 'START 902',
      sentAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      status: 'Dispatched',
      messageText:
        '⚡ *FIXLY QUOTE APPROVED!*\nClient Maya Johnson has approved your diagnostic quote for *GH₵350.00*.\n🔒 *Funds Locked in Escrow* (Guaranteed payout upon completion).\n📍 Location: Airport Residential (GA-112-9021)\n👉 Tap here to start job: https://fixly.gh/start/902 or text START 902.',
      whatsappUrl: getWhatsAppDispatchUrl(
        '+233559814410',
        '⚡ FIXLY QUOTE APPROVED!\nClient approved quote for GH₵350.00. Funds locked in Escrow. Location: Airport Residential.'
      ),
    },
  ];
}

export function saveBroadcastRecords(records: JobBroadcastRecord[]): void {
  try {
    localStorage.setItem(BROADCAST_STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.warn('Error saving broadcast logs:', err);
  }
}

/**
 * Broadcasts a new job request to an artisan's phone via 2G SMS or WhatsApp
 */
export function broadcastJobRequestToArtisan(
  job: Job,
  channel: 'SMS' | 'WhatsApp' = 'SMS',
  proName = 'Kwame Mensah',
  proPhone = '+233 24 551 8840'
): JobBroadcastRecord {
  const shortId = Math.floor(100 + Math.random() * 900).toString();
  const amount = job.totalAmount || job.basePrice || 150;
  const replyKeyword = `YES ${shortId}`;

  const smsText = `FIXLY 2G ALERT #${shortId}:\nNew Job: ${job.title}\nArea: ${job.location.address} (${job.location.ghanaPostGps})\nPay: GH₵${amount.toFixed(2)} in Escrow.\nReply "${replyKeyword}" to ACCEPT or "NO ${shortId}" to pass via free SMS.`;

  const waText = `🛠️ *NEW FIXLY JOB BROADCAST #${shortId}*\n\nHello Master *${proName}*,\nA new job is waiting for your trade:\n*${job.title}*\n\n📍 *Location:* ${job.location.address} (${job.location.ghanaPostGps})\n💰 *Budget:* GH₵${amount.toFixed(2)} (Escrow Guaranteed)\n👤 *Client:* ${job.clientName}\n\n👉 Reply *YES* to claim this dispatch or click: https://fixly.gh/claim/${shortId}`;

  const record: JobBroadcastRecord = {
    id: `bc-${shortId}`,
    jobId: job.id,
    jobTitle: job.title,
    broadcastType: 'NEW_JOB_REQUEST',
    channel,
    recipientName: proName,
    recipientPhone: proPhone,
    recipientRole: 'pro',
    locationAddress: job.location.address,
    ghanaPostGps: job.location.ghanaPostGps,
    amountGh: amount,
    smsReplyCode: replyKeyword,
    sentAt: new Date().toISOString(),
    status: 'Dispatched',
    messageText: channel === 'SMS' ? smsText : waText,
    whatsappUrl: channel === 'WhatsApp' ? getWhatsAppDispatchUrl(proPhone, waText) : undefined,
  };

  const stored = getStoredBroadcastRecords();
  const updated = [record, ...stored];
  saveBroadcastRecords(updated);
  return record;
}

/**
 * Broadcasts quote approval notification to artisan via 2G SMS or WhatsApp
 */
export function broadcastQuoteApprovalToArtisan(
  job: Job,
  channel: 'SMS' | 'WhatsApp' = 'SMS',
  proName = 'Kwame Mensah',
  proPhone = '+233 24 551 8840',
  approvedAmount?: number
): JobBroadcastRecord {
  const shortId = Math.floor(100 + Math.random() * 900).toString();
  const amount = approvedAmount || job.totalAmount || job.basePrice || 200;
  const replyKeyword = `START ${shortId}`;

  const smsText = `FIXLY SMS NOTICE #${shortId}:\nClient ${job.clientName} APPROVED your quote of GH₵${amount.toFixed(2)} for "${job.title}".\nEscrow secured. Reply "${replyKeyword}" when you begin work on site.`;

  const waText = `✅ *FIXLY QUOTE APPROVED #${shortId}*\n\nHello Master *${proName}*,\nGreat news! Client *${job.clientName}* just approved your itemized quote of *GH₵${amount.toFixed(2)}* for:\n*${job.title}*\n\n🔒 *Payment Status:* GH₵${amount.toFixed(2)} is now 100% funded and locked in Fixly Escrow.\n📍 *Site GPS:* ${job.location.ghanaPostGps}\n\n👉 Reply *START* when you arrive on site.`;

  const record: JobBroadcastRecord = {
    id: `bc-${shortId}`,
    jobId: job.id,
    jobTitle: job.title,
    broadcastType: 'QUOTE_APPROVED',
    channel,
    recipientName: proName,
    recipientPhone: proPhone,
    recipientRole: 'pro',
    locationAddress: job.location.address,
    ghanaPostGps: job.location.ghanaPostGps,
    amountGh: amount,
    smsReplyCode: replyKeyword,
    sentAt: new Date().toISOString(),
    status: 'Dispatched',
    messageText: channel === 'SMS' ? smsText : waText,
    whatsappUrl: channel === 'WhatsApp' ? getWhatsAppDispatchUrl(proPhone, waText) : undefined,
  };

  const stored = getStoredBroadcastRecords();
  const updated = [record, ...stored];
  saveBroadcastRecords(updated);
  return record;
}

/**
 * Simulates an artisan texting back via 2G GSM SMS shortcode
 */
export function simulateArtisanSmsReply(
  recordId: string,
  replyKeyword: 'YES' | 'NO' | 'START' | 'DONE'
): JobBroadcastRecord | null {
  const records = getStoredBroadcastRecords();
  const idx = records.findIndex((r) => r.id === recordId);
  if (idx === -1) return null;

  const current = records[idx];
  let newStatus: JobBroadcastRecord['status'] = 'Accepted';
  let replyText = `${replyKeyword} ${current.id.replace('bc-', '')}`;

  if (replyKeyword === 'NO') {
    newStatus = 'Declined';
    replyText += ' - Artisan currently engaged on another site';
  } else if (replyKeyword === 'YES') {
    newStatus = 'Accepted';
    replyText += ' - Accepted. Artisan en route with tool kit';
  } else if (replyKeyword === 'START') {
    newStatus = 'Accepted';
    replyText += ' - Artisan checked in on site. Work commenced';
  }

  const updatedRecord: JobBroadcastRecord = {
    ...current,
    status: newStatus,
    artisanReply: replyText,
    replyTimestamp: new Date().toISOString(),
  };

  records[idx] = updatedRecord;
  saveBroadcastRecords(records);
  return updatedRecord;
}

export function clearStoredBroadcastRecords(): void {
  localStorage.removeItem(BROADCAST_STORAGE_KEY);
}

// =========================================================================
// ARTISAN BROADCAST OPT-IN PREFERENCES & AUTOMATIC DISPATCH
// =========================================================================

export interface ArtisanBroadcastPreference {
  artisanId: string;
  artisanName: string;
  phone: string;
  optedIn: boolean;
  channel: 'SMS' | 'WhatsApp' | 'Both';
  autoAcceptUrgent: boolean;
  optedServices: string[];
  lastDispatchedAt?: string;
}

const PREFERENCE_STORAGE_KEY = 'fixly_artisan_broadcast_pref';

export function getArtisanBroadcastPreference(): ArtisanBroadcastPreference {
  try {
    const saved = localStorage.getItem(PREFERENCE_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.warn('Error reading broadcast preference:', err);
  }

  // Default: Ghanaian artisan opted-in to 2G SMS & WhatsApp alerts
  return {
    artisanId: 'pro-kwame-mensah',
    artisanName: 'Kwame Mensah',
    phone: '+233 24 551 8840',
    optedIn: true,
    channel: 'Both',
    autoAcceptUrgent: true,
    optedServices: [
      'Plumbing & Water',
      'Leak repair',
      'Tap & mixer replacement',
      'Toilet repair',
      'Polytank & booster pump',
    ],
  };
}

export function saveArtisanBroadcastPreference(pref: ArtisanBroadcastPreference): void {
  try {
    localStorage.setItem(PREFERENCE_STORAGE_KEY, JSON.stringify(pref));
  } catch (err) {
    console.warn('Error saving broadcast preference:', err);
  }
}

/**
 * Automatically triggers an offline 2G SMS or WhatsApp broadcast when a job is requested or quote approved,
 * ONLY IF the artisan has opted into that option or service.
 */
export function autoDispatchJobBroadcastIfOptedIn(
  job: Job,
  proName = 'Kwame Mensah',
  proPhone = '+233 24 551 8840'
): { dispatched: boolean; record?: JobBroadcastRecord; reason?: string } {
  const pref = getArtisanBroadcastPreference();

  if (!pref.optedIn) {
    return {
      dispatched: false,
      reason: 'Artisan has opted out of automated offline broadcasts.',
    };
  }

  // Check if existing broadcast already exists for this job
  const existing = getStoredBroadcastRecords();
  const alreadyBroadcast = existing.find(
    (b) => b.jobId === job.id && b.broadcastType === 'NEW_JOB_REQUEST'
  );
  if (alreadyBroadcast) {
    return {
      dispatched: true,
      record: alreadyBroadcast,
      reason: 'Existing broadcast record found.',
    };
  }

  // Determine channel
  const primaryChannel = pref.channel === 'Both' ? 'SMS' : pref.channel;
  const record = broadcastJobRequestToArtisan(job, primaryChannel, proName, proPhone);

  if (pref.channel === 'Both') {
    broadcastJobRequestToArtisan(job, 'WhatsApp', proName, proPhone);
  }

  // Update last dispatched timestamp
  saveArtisanBroadcastPreference({
    ...pref,
    lastDispatchedAt: new Date().toISOString(),
  });

  return { dispatched: true, record };
}

