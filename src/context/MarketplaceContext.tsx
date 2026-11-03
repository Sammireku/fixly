import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Job,
  JobStatus,
  QuoteLineItem,
  DisputeRecord,
  SosAlert,
  QueuedMutation,
  ProTier,
  ChatMessage,
  UrgencyWindow,
  EscrowStatus,
  TradeCertificate,
  ProReview,
} from '../types';
import { INITIAL_PROS, INITIAL_DEMO_CLIENT, INITIAL_SAMPLE_JOBS, VERIFICATION_BADGES } from '../data/catalog';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { sendFcmNotification } from '../lib/fcmNotifications';

interface MarketplaceContextType {
  currentUser: User;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  updateUserAvatar: (avatarUrl: string) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  allUsers: User[];
  jobs: Job[];
  activeJob: Job | null;
  setActiveJobId: (id: string | null) => void;
  disputes: DisputeRecord[];
  sosAlerts: SosAlert[];
  createJob: (jobData: Partial<Job>) => Promise<Job>;
  acceptJob: (jobId: string, pro: User) => Promise<void>;
  declineJob: (jobId: string) => Promise<void>;
  cancelUnacceptedJob: (jobId: string) => Promise<void>;
  markArrived: (jobId: string) => Promise<void>;
  submitDiagnosticQuote: (jobId: string, items: QuoteLineItem[], revisedTotal: number) => Promise<void>;
  approveQuote: (jobId: string) => Promise<void>;
  toggleMaterialShopRun: (jobId: string, shopRun: boolean) => Promise<void>;
  completeJob: (jobId: string, afterPhotoUrl?: string) => Promise<void>;
  confirmJobSignOff: (jobId: string, ratings: Job['ratings']) => Promise<void>;
  uploadProCertificate: (certData: Omit<TradeCertificate, 'id' | 'status' | 'verifiedAt'>) => Promise<void>;
  submitProReview: (jobId: string, review: Omit<ProReview, 'id' | 'createdAt'>) => Promise<void>;
  reportDispute: (jobId: string, dispute: Partial<DisputeRecord>) => Promise<void>;
  resolveDispute: (disputeId: string, resolution: DisputeRecord['opsResolution']) => Promise<void>;
  triggerSos: (silent: boolean) => Promise<void>;
  resolveSos: (alertId: string) => Promise<void>;
  cashoutProWallet: (amount: number, momoNetwork: string, momoNumber: string) => Promise<boolean>;
  toggleProOnline: (online: boolean) => void;
  updateUserLanguage: (lang: 'en' | 'twi' | 'ga') => void;
  sendChatMessage: (
    jobId: string,
    message: { text?: string; photoUrl?: string; voiceNoteUrl?: string; voiceDurationSeconds?: number }
  ) => Promise<ChatMessage>;
  getJobMessages: (jobId: string, callback: (messages: ChatMessage[]) => void) => () => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | null>(null);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('fixly_authenticated');
    return saved !== null ? saved === 'true' : true; // default true for seamless initial preview
  });

  const [activeRole, setActiveRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('fixly_active_role') as UserRole) || 'client';
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('fixly_users');
    return saved ? JSON.parse(saved) : [INITIAL_DEMO_CLIENT, ...INITIAL_PROS];
  });

  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('fixly_jobs');
    return saved ? JSON.parse(saved) : INITIAL_SAMPLE_JOBS;
  });

  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  const [disputes, setDisputes] = useState<DisputeRecord[]>(() => {
    const saved = localStorage.getItem('fixly_disputes');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'disp-001',
            jobId: 'job-fix-001',
            jobTitle: 'Kitchen Sink Mixer Tap Heavily Leaking',
            initiatorRole: 'client',
            initiatorName: 'Afia Addo',
            category: 'overcharge',
            description: 'The artisan quoted GH₵50 for the ceramic cartridge, but told me in person he might need extra glue.',
            evidencePhotos: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'],
            desiredOutcome: 'partial_refund',
            status: 'pro_responded',
            proResponse: 'The cartridge was seized and needed penetrating oil. I did not charge extra for labor.',
            createdAt: '2026-11-02T10:50:00Z',
          },
        ];
  });

  const [sosAlerts, setSosAlerts] = useState<SosAlert[]>(() => {
    const saved = localStorage.getItem('fixly_sos');
    return saved ? JSON.parse(saved) : [];
  });

  const [chatMessagesMap, setChatMessagesMap] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('fixly_chat_messages');
    if (saved) return JSON.parse(saved);
    return {
      'job-fix-001': [
        {
          id: 'msg-seed-1',
          jobId: 'job-fix-001',
          senderId: 'pro-kwame-mensah',
          senderName: 'Kwame Mensah',
          senderRole: 'pro',
          text: 'Hello Madam Afia! I am on my way from Bawaleshie Road. ETA is approximately 14 minutes.',
          timestamp: '2026-11-02T10:32:00Z',
          isDelivered: true,
        },
        {
          id: 'msg-seed-2',
          jobId: 'job-fix-001',
          senderId: 'client-afia-addo',
          senderName: 'Afia Addo',
          senderRole: 'client',
          text: 'Thank you Kwame. The gate is black, right next to the big mango tree. Water valve is already closed under the sink.',
          timestamp: '2026-11-02T10:35:00Z',
          isDelivered: true,
        },
      ],
    };
  });

  useEffect(() => {
    localStorage.setItem('fixly_chat_messages', JSON.stringify(chatMessagesMap));
  }, [chatMessagesMap]);

  // Current User resolution based on activeRole
  const currentUser: User = React.useMemo(() => {
    if (activeRole === 'client') {
      return allUsers.find((u) => u.id === 'client-afia-addo') || INITIAL_DEMO_CLIENT;
    } else if (activeRole === 'pro') {
      return allUsers.find((u) => u.id === 'pro-kwame-mensah') || INITIAL_PROS[0];
    } else {
      return {
        id: 'ops-samuel-mireku',
        name: 'Samuel Mireku',
        email: 'ops.samuel@fixly.gh',
        role: 'ops',
        phone: '+233 24 000 1122',
        language: 'en',
        createdAt: '2025-01-01T00:00:00Z',
      };
    }
  }, [activeRole, allUsers]);

  // Persist local storage snapshots for offline resilience
  useEffect(() => {
    localStorage.setItem('fixly_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('fixly_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('fixly_disputes', JSON.stringify(disputes));
  }, [disputes]);

  useEffect(() => {
    localStorage.setItem('fixly_sos', JSON.stringify(sosAlerts));
  }, [sosAlerts]);

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    localStorage.setItem('fixly_active_role', role);
  };

  const activeJob = jobs.find((j) => j.id === activeJobId) || jobs[0] || null;

  // Background sync helper to save updates to Firestore if reachable
  const persistJobToFirestore = async (job: Job) => {
    try {
      if (navigator.onLine && db) {
        await setDoc(doc(db, 'jobs', job.id), job, { merge: true });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `jobs/${job.id}`);
    }
  };

  const createJob = async (jobData: Partial<Job>): Promise<Job> => {
    const basePrice = jobData.basePrice || 150;
    const protectionFee = Math.round(basePrice * 0.05);
    const totalAmount = basePrice + protectionFee;
    const commissionRate = 0.15; // 15% growth/pro average
    const poolRate = 0.025; // 2.5% pool contribution
    const platformFee = Math.round(basePrice * commissionRate);
    const poolFee = Math.round(basePrice * poolRate);
    const netProEarnings = basePrice - platformFee - poolFee;

    const urgencyWindow: UrgencyWindow = jobData.urgencyWindow || (
      jobData.urgency === 'now' ? 'within_30m' :
      jobData.urgency === 'today' ? 'within_3h' : 'scheduled'
    );

    // Compute deadline for artisan confirmation before auto-release
    const nowMs = Date.now();
    let confirmDeadlineMs = nowMs + 30 * 60 * 1000;
    if (urgencyWindow === 'within_30m') {
      confirmDeadlineMs = nowMs + 30 * 60 * 1000; // 30 minutes
    } else if (urgencyWindow === 'within_1h') {
      confirmDeadlineMs = nowMs + 60 * 60 * 1000; // 60 minutes
    } else if (urgencyWindow === 'within_3h') {
      confirmDeadlineMs = nowMs + 3 * 60 * 60 * 1000; // 3 hours
    } else if (urgencyWindow === 'scheduled') {
      if (jobData.scheduledTime) {
        confirmDeadlineMs = Math.max(nowMs + 60 * 60 * 1000, new Date(jobData.scheduledTime).getTime() - 2 * 3600 * 1000);
      } else {
        confirmDeadlineMs = nowMs + 12 * 60 * 60 * 1000;
      }
    }

    const confirmDeadline = new Date(confirmDeadlineMs).toISOString();

    const newJob: Job = {
      id: 'job_' + Date.now().toString(36),
      clientId: currentUser.id,
      clientName: currentUser.name,
      clientPhone: currentUser.phone,
      trade: jobData.trade || 'plumbing',
      type: jobData.type || 'on_demand',
      title: jobData.title || 'General Home Repair',
      description: jobData.description || 'Inspection and repair needed.',
      urgency: jobData.urgency || 'now',
      urgencyWindow,
      confirmDeadline,
      escrowStatus: 'authorized_pending_acceptance', // Mobile money pre-authorized reservation; held until pro accepts or expires
      scheduledTime: jobData.scheduledTime,
      status: 'requested',
      basePrice,
      protectionFee,
      totalAmount,
      platformFee,
      poolFee,
      netProEarnings,
      location: jobData.location ||
        currentUser.location || {
          lat: 5.6354,
          lng: -0.1582,
          address: 'East Legon, Accra',
          ghanaPostGps: 'GA-492-3841',
          landmark: 'American House',
          area: 'East Legon',
        },
      clientVoiceNoteUrl: jobData.clientVoiceNoteUrl,
      clientVoiceDuration: jobData.clientVoiceDuration,
      clientPhotos: jobData.clientPhotos || [],
      milestones: jobData.milestones,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setJobs((prev) => [newJob, ...prev]);
    setActiveJobId(newJob.id);
    persistJobToFirestore(newJob);

    // Send FCM Notification to Pros
    sendFcmNotification({
      recipientUserId: 'pro-kwame-mensah',
      recipientRole: 'pro',
      title: '⚡ New Job Request Arrived!',
      body: `Client ${currentUser.name} in ${newJob.location.area} needs ${newJob.title}. Total: GH₵${newJob.totalAmount}. Confirm now to lock escrow!`,
      type: 'job_requested',
      jobId: newJob.id,
    });

    return newJob;
  };

  const acceptJob = async (jobId: string, pro: User) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const updated: Job = {
            ...j,
            status: 'pro_en_route',
            escrowStatus: 'held_in_escrow', // Funds formally locked into Fixly Escrow vault ONLY upon pro acceptance!
            proId: pro.id,
            proName: pro.name,
            proPhone: pro.phone,
            proTier: pro.proProfile?.tier || 'Growth',
            updatedAt: new Date().toISOString(),
          };
          persistJobToFirestore(updated);

          // Send FCM Notification to Client
          sendFcmNotification({
            recipientUserId: j.clientId,
            recipientRole: 'client',
            title: `✅ ${pro.name} Accepted Your Job!`,
            body: `${pro.name} (${pro.proProfile?.tier || 'Verified'} Artisan) is en route to ${j.location.area}. Funds locked in Fixly Escrow!`,
            type: 'job_accepted',
            jobId: j.id,
          });

          return updated;
        }
        return j;
      })
    );
  };

  const declineJob = async (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'requested', updatedAt: new Date().toISOString() } : j))
    );
  };

  const cancelUnacceptedJob = async (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const updated: Job = {
            ...j,
            status: 'cancelled',
            escrowStatus: 'released_unaccepted', // Pre-authorization hold cancelled and released back to client MoMo with 0 fee
            updatedAt: new Date().toISOString(),
          };
          persistJobToFirestore(updated);
          return updated;
        }
        return j;
      })
    );
  };

  const markArrived = async (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const updated: Job = {
            ...j,
            status: 'arrived',
            updatedAt: new Date().toISOString(),
          };
          persistJobToFirestore(updated);
          return updated;
        }
        return j;
      })
    );
  };

  const submitDiagnosticQuote = async (jobId: string, items: QuoteLineItem[], revisedTotal: number) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const protectionFee = Math.round(revisedTotal * 0.05);
          const totalAmount = revisedTotal + protectionFee;
          const platformFee = Math.round(revisedTotal * 0.15);
          const poolFee = Math.round(revisedTotal * 0.025);
          const netProEarnings = revisedTotal - platformFee - poolFee;

          const updated: Job = {
            ...j,
            status: 'diagnosed',
            quoteItems: items,
            revisedQuote: revisedTotal,
            protectionFee,
            totalAmount,
            platformFee,
            poolFee,
            netProEarnings,
            updatedAt: new Date().toISOString(),
          };
          persistJobToFirestore(updated);
          return updated;
        }
        return j;
      })
    );
  };

  const approveQuote = async (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const updated: Job = {
            ...j,
            status: 'in_progress',
            updatedAt: new Date().toISOString(),
          };
          persistJobToFirestore(updated);
          return updated;
        }
        return j;
      })
    );
  };

  const toggleMaterialShopRun = async (jobId: string, shopRun: boolean) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, materialShopRun: shopRun, updatedAt: new Date().toISOString() } : j))
    );
  };

  const completeJob = async (jobId: string, afterPhotoUrl?: string) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const afterPhotos = afterPhotoUrl ? [afterPhotoUrl, ...(j.afterPhotos || [])] : j.afterPhotos;
          const updated: Job = {
            ...j,
            status: 'completed',
            escrowStatus: 'hold_period_24h',
            afterPhotos,
            updatedAt: new Date().toISOString(),
          };
          persistJobToFirestore(updated);
          return updated;
        }
        return j;
      })
    );
  };

  const confirmJobSignOff = async (jobId: string, ratings: Job['ratings']) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const updated: Job = {
            ...j,
            status: 'closed',
            escrowStatus: 'released_to_pro',
            ratings,
            escrowReleaseTime: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // Release funds to Pro wallet & record review
          if (j.proId) {
            const newReview: ProReview | null = ratings ? {
              id: 'rev_' + Date.now().toString(36),
              jobId: j.id,
              jobTitle: j.title,
              clientId: j.clientId,
              clientName: j.clientName,
              workmanshipRating: ratings.workmanship,
              conductRating: ratings.conduct,
              conductThumbsUp: ratings.conductThumbsUp ?? true,
              conductFlag: ratings.conductFlag,
              reviewText: ratings.reviewText || 'Job completed successfully.',
              problemSolved: ratings.problemSolved,
              createdAt: new Date().toISOString(),
            } : null;

            setAllUsers((users) =>
              users.map((u) => {
                if (u.id === j.proId && u.proProfile) {
                  const existingReviews = u.proProfile.reviews || [];
                  const updatedReviews = newReview ? [newReview, ...existingReviews] : existingReviews;
                  const totalRatings = updatedReviews.map((r) => r.workmanshipRating);
                  const avgRating = totalRatings.length > 0
                    ? Number((totalRatings.reduce((a, b) => a + b, 0) / totalRatings.length).toFixed(1))
                    : u.proProfile.rating;

                  return {
                    ...u,
                    proProfile: {
                      ...u.proProfile,
                      walletAvailable: u.proProfile.walletAvailable + j.netProEarnings,
                      jobsCompleted: u.proProfile.jobsCompleted + 1,
                      rating: avgRating,
                      reviews: updatedReviews,
                    },
                  };
                }
                return u;
              })
            );
          }

          persistJobToFirestore(updated);
          return updated;
        }
        return j;
      })
    );
  };

  const uploadProCertificate = async (certData: Omit<TradeCertificate, 'id' | 'status' | 'verifiedAt'>) => {
    const newCert: TradeCertificate = {
      ...certData,
      id: 'cert_' + Date.now().toString(36),
      status: 'verified',
      verifiedAt: new Date().toISOString().split('T')[0],
    };

    const verifiedBadgeItem = {
      id: 'trade_cert_' + newCert.id,
      label: `Ghana Certified: ${newCert.title}`,
      shortLabel: 'Verified Trade',
      category: 'craft' as const,
      status: 'verified' as const,
      icon: 'Award',
      tooltip: `Verified ${newCert.issuingBody} certificate issued ${newCert.issueYear}`,
      proofDocName: newCert.documentName || newCert.title,
      issuedBy: newCert.issuingBody,
      verifiedAt: newCert.verifiedAt,
    };

    setAllUsers((users) =>
      users.map((u) => {
        if (u.id === currentUser.id && u.proProfile) {
          const currentCerts = u.proProfile.tradeCertificates || [];
          const currentBadges = u.proProfile.badges || [];
          return {
            ...u,
            proProfile: {
              ...u.proProfile,
              isTradeVerified: true,
              tradeCertificates: [newCert, ...currentCerts],
              badges: [verifiedBadgeItem, ...currentBadges.filter((b) => b.id !== verifiedBadgeItem.id)],
            },
          };
        }
        return u;
      })
    );
  };

  const submitProReview = async (jobId: string, reviewData: Omit<ProReview, 'id' | 'createdAt'>) => {
    const targetJob = jobs.find((j) => j.id === jobId);
    if (!targetJob || !targetJob.proId) return;

    const fullReview: ProReview = {
      ...reviewData,
      id: 'rev_' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };

    setAllUsers((users) =>
      users.map((u) => {
        if (u.id === targetJob.proId && u.proProfile) {
          const existingReviews = u.proProfile.reviews || [];
          const updatedReviews = [fullReview, ...existingReviews];
          const totalRatings = updatedReviews.map((r) => r.workmanshipRating);
          const avgRating = totalRatings.length > 0
            ? Number((totalRatings.reduce((a, b) => a + b, 0) / totalRatings.length).toFixed(1))
            : u.proProfile.rating;

          return {
            ...u,
            proProfile: {
              ...u.proProfile,
              rating: avgRating,
              reviews: updatedReviews,
            },
          };
        }
        return u;
      })
    );
  };

  const reportDispute = async (jobId: string, disputeData: Partial<DisputeRecord>) => {
    const targetJob = jobs.find((j) => j.id === jobId);
    const newDispute: DisputeRecord = {
      id: 'disp_' + Date.now().toString(36),
      jobId,
      jobTitle: targetJob?.title || 'Job Dispute',
      initiatorRole: activeRole as 'client' | 'pro',
      initiatorName: currentUser.name,
      category: disputeData.category || 'poor_workmanship',
      description: disputeData.description || 'Issue reported by client during inspection.',
      evidencePhotos: disputeData.evidencePhotos || [],
      desiredOutcome: disputeData.desiredOutcome || 'redo',
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    setDisputes((prev) => [newDispute, ...prev]);

    // Freeze job status to disputed
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'disputed', updatedAt: new Date().toISOString() } : j))
    );
  };

  const resolveDispute = async (disputeId: string, resolution: DisputeRecord['opsResolution']) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: 'resolved', opsResolution: resolution } : d))
    );

    const dispute = disputes.find((d) => d.id === disputeId);
    if (dispute) {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === dispute.jobId
            ? { ...j, status: resolution?.action === 'released_to_pro' ? 'closed' : 'completed', updatedAt: new Date().toISOString() }
            : j
        )
      );
    }
  };

  const triggerSos = async (silent: boolean) => {
    const alert: SosAlert = {
      id: 'sos_' + Date.now().toString(36),
      jobId: activeJob?.id || 'job-general',
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: activeRole,
      userPhone: currentUser.phone,
      location: activeJob?.location ||
        currentUser.location || {
          lat: 5.6354,
          lng: -0.1582,
          address: 'East Legon, Accra',
          ghanaPostGps: 'GA-492-3841',
          landmark: 'American House',
          area: 'East Legon',
        },
      timestamp: new Date().toISOString(),
      status: 'active',
      silent,
    };
    setSosAlerts((prev) => [alert, ...prev]);
  };

  const resolveSos = async (alertId: string) => {
    setSosAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'resolved' } : a))
    );
  };

  const cashoutProWallet = async (amount: number, momoNetwork: string, momoNumber: string): Promise<boolean> => {
    if (!currentUser.proProfile || currentUser.proProfile.walletAvailable < amount) {
      return false;
    }

    setAllUsers((users) =>
      users.map((u) => {
        if (u.id === currentUser.id && u.proProfile) {
          return {
            ...u,
            proProfile: {
              ...u.proProfile,
              walletAvailable: u.proProfile.walletAvailable - amount,
              walletPaidOut: u.proProfile.walletPaidOut + amount,
            },
          };
        }
        return u;
      })
    );
    return true;
  };

  const toggleProOnline = (online: boolean) => {
    setAllUsers((users) =>
      users.map((u) => {
        if (u.id === currentUser.id && u.proProfile) {
          return {
            ...u,
            proProfile: {
              ...u.proProfile,
              isOnline: online,
            },
          };
        }
        return u;
      })
    );
  };

  const updateUserLanguage = (lang: 'en' | 'twi' | 'ga') => {
    setAllUsers((users) =>
      users.map((u) => (u.id === currentUser.id ? { ...u, language: lang } : u))
    );
  };

  const sendChatMessage = async (
    jobId: string,
    messageData: { text?: string; photoUrl?: string; voiceNoteUrl?: string; voiceDurationSeconds?: number }
  ): Promise<ChatMessage> => {
    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      jobId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: activeRole,
      text: messageData.text,
      photoUrl: messageData.photoUrl,
      voiceNoteUrl: messageData.voiceNoteUrl,
      voiceDurationSeconds: messageData.voiceDurationSeconds,
      timestamp: new Date().toISOString(),
      isDelivered: true,
    };

    setChatMessagesMap((prev) => {
      const existing = prev[jobId] || [];
      return {
        ...prev,
        [jobId]: [...existing, newMsg],
      };
    });

    try {
      if (navigator.onLine && db) {
        const msgDocRef = doc(collection(db, 'jobs', jobId, 'messages'), newMsg.id);
        await setDoc(msgDocRef, {
          id: newMsg.id,
          jobId: newMsg.jobId,
          senderId: newMsg.senderId,
          senderName: newMsg.senderName,
          senderRole: newMsg.senderRole,
          text: newMsg.text || '',
          photoUrl: newMsg.photoUrl || '',
          voiceNoteUrl: newMsg.voiceNoteUrl || '',
          voiceDurationSeconds: newMsg.voiceDurationSeconds || 0,
          createdAt: newMsg.timestamp,
        });
      }
    } catch (err) {
      console.warn('Real-time chat sync notice (stored locally):', err);
    }

    return newMsg;
  };

  const getJobMessages = (jobId: string, callback: (msgs: ChatMessage[]) => void) => {
    // Deliver local cached messages immediately
    const current = chatMessagesMap[jobId] || [];
    callback(current);

    try {
      if (navigator.onLine && db) {
        const messagesCol = collection(db, 'jobs', jobId, 'messages');
        const unsub = onSnapshot(
          messagesCol,
          (snapshot) => {
            if (!snapshot.empty) {
              const serverMsgs: ChatMessage[] = snapshot.docs.map((d) => {
                const data = d.data();
                return {
                  id: data.id || d.id,
                  jobId: data.jobId || jobId,
                  senderId: data.senderId,
                  senderName: data.senderName,
                  senderRole: data.senderRole,
                  text: data.text,
                  photoUrl: data.photoUrl,
                  voiceNoteUrl: data.voiceNoteUrl,
                  voiceDurationSeconds: data.voiceDurationSeconds,
                  timestamp: data.createdAt || new Date().toISOString(),
                  isDelivered: true,
                };
              });

              setChatMessagesMap((prev) => {
                const existing = prev[jobId] || [];
                const mergedMap = new Map<string, ChatMessage>();
                existing.forEach((m) => mergedMap.set(m.id, m));
                serverMsgs.forEach((m) => mergedMap.set(m.id, m));
                const merged = Array.from(mergedMap.values()).sort(
                  (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                );
                callback(merged);
                return { ...prev, [jobId]: merged };
              });
            }
          },
          (err) => {
            console.warn('Firestore snapshot notice: using offline chat queue', err);
          }
        );
        return unsub;
      }
    } catch (e) {
      console.warn('Error setting up onSnapshot for chat:', e);
    }

    return () => {};
  };

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('fixly_authenticated', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('fixly_authenticated', 'false');
  };

  const updateUserAvatar = (avatarUrl: string) => {
    setAllUsers((users) =>
      users.map((u) => {
        if (u.id === currentUser.id) {
          return {
            ...u,
            avatarUrl,
            proProfile: u.proProfile ? { ...u.proProfile, avatarUrl } : undefined,
          };
        }
        return u;
      })
    );
  };

  return (
    <MarketplaceContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        logout,
        updateUserAvatar,
        activeRole,
        setActiveRole,
        allUsers,
        jobs,
        activeJob,
        setActiveJobId,
        disputes,
        sosAlerts,
        createJob,
        acceptJob,
        declineJob,
        cancelUnacceptedJob,
        markArrived,
        submitDiagnosticQuote,
        approveQuote,
        toggleMaterialShopRun,
        completeJob,
        confirmJobSignOff,
        uploadProCertificate,
        submitProReview,
        reportDispute,
        resolveDispute,
        triggerSos,
        resolveSos,
        cashoutProWallet,
        toggleProOnline,
        updateUserLanguage,
        sendChatMessage,
        getJobMessages,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) throw new Error('useMarketplace must be used within MarketplaceProvider');
  return context;
};
