/**
 * Fixly Ghana Mock SMS & WhatsApp Automated Notification Service.
 * Generates and manages 1-hour appointment reminders for clients and artisans.
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

const STORAGE_KEY = 'fixly_reminder_logs';

export function getStoredReminderLogs(): AppointmentReminderLog[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
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

/**
 * Clear reminder logs.
 */
export function clearStoredReminderLogs(): void {
  localStorage.removeItem(STORAGE_KEY);
}
