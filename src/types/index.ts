export type UserRole = 'client' | 'pro' | 'ops';

export type LanguageCode = 'en' | 'twi' | 'ga' | 'ewe' | 'hausa';

export type NetworkMode = 'online' | 'patchy' | 'offline';

export type FlowTag = 'OD' | 'PR' | 'RC';

export type TradeType =
  | 'plumbing'
  | 'electrical'
  | 'appliance_repair'
  | 'carpentry'
  | 'ceilings_walls'
  | 'tiling_masonry'
  | 'roofing'
  | 'welding_metalwork'
  | 'aluminium_glass'
  | 'upholstery'
  | 'gardening_outdoor'
  | 'cleaning_pest_control'
  | 'laundry_garment'
  | 'security_smart_home'
  | 'moving_heavy_work'
  | 'general_handyman'
  | 'vehicle_adjacent'
  // Legacy aliases
  | 'pop_ceilings'
  | 'painting'
  | 'tiling'
  | 'ac_refrigeration';

export type JobType = 'on_demand' | 'project' | 'recurring';

export interface ServiceCategoryDef {
  id: string;
  trade: TradeType;
  title: string;
  subtitle: string;
  flows: FlowTag[];
  flowBadgeText: string;
  iconName: string;
  description: string;
  popularServicesCount: number;
}

export interface CatalogServiceItem {
  id: string;
  trade: TradeType;
  categoryTitle: string;
  title: string;
  titleTwi: string;
  titleGa: string;
  basePrice: number; // In GHS
  callOutFee: number;
  includes: string;
  includesTwi: string;
  popular?: boolean;
  type: JobType;
  flowTag: FlowTag;
}

export type JobStatus =
  | 'draft'
  | 'requested'
  | 'matched'
  | 'pro_en_route'
  | 'arrived'
  | 'diagnosed'
  | 'quote_approved'
  | 'in_progress'
  | 'completed'
  | 'hold_period'
  | 'closed'
  | 'disputed'
  | 'cancelled';

export type EscrowStatus =
  | 'authorized_pending_acceptance' // Mobile money pre-authorized reservation; held until pro accepts or expires
  | 'held_in_escrow'                // Formally locked in Fixly Escrow vault ONLY upon pro acceptance
  | 'hold_period_24h'              // Job completed, 24-hr guarantee hold before auto-release
  | 'released_to_pro'              // Released to pro's wallet
  | 'released_unaccepted'          // Auto-released back to client when pro doesn't accept in time
  | 'refunded';                    // Refunded via dispute resolution

export type UrgencyWindow =
  | 'within_30m'  // Immediate / Emergency: Pro must confirm within 30 mins
  | 'within_1h'   // Urgent: Pro must confirm within 1 hour
  | 'within_3h'   // Today: Pro must confirm within 3 hours
  | 'scheduled';  // Scheduled Date & Time

export type ProTier = 'Starter' | 'Growth' | 'Pro' | 'Elite';

export interface VerificationBadge {
  id: string;
  label: string;
  shortLabel: string;
  category: 'identity' | 'craft' | 'financial' | 'conduct';
  status: 'verified' | 'pending' | 'locked';
  icon: string;
  tooltip: string;
  proofDocName?: string;
  issuedBy: string;
  verifiedAt?: string;
  unlockRequirement?: string;
}

export interface AudioNuanceInfo {
  transcript: string;
  detectedUrgency: 'Immediate' | 'Today' | 'Flexible';
  detectedAcoustics: string[];
  extractedKeywords: string[];
  confidence: number;
  durationSeconds: number;
}

export interface LocationInfo {
  lat: number;
  lng: number;
  address: string;
  ghanaPostGps: string;
  landmark: string;
  area: string;
}

export interface QuoteLineItem {
  id: string;
  description: string;
  type: 'labor' | 'material';
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  percentage: number;
  amount: number;
  status: 'pending' | 'funded' | 'submitted' | 'approved';
  proofPhoto?: string;
  completedAt?: string;
}

export interface TradeCertificate {
  id: string;
  title: string;
  certType: 'nvti' | 'energy_commission' | 'master_artisan_letter' | 'ghana_card' | 'police_clearance' | 'union_membership' | 'other';
  issuingBody: string;
  issueYear: string;
  documentUrl?: string;
  documentName?: string;
  status: 'verified' | 'under_review' | 'rejected';
  verifiedAt?: string;
}

export interface ProReview {
  id: string;
  jobId: string;
  jobTitle: string;
  clientId: string;
  clientName: string;
  workmanshipRating: number;
  conductRating: number;
  conductThumbsUp: boolean;
  conductFlag?: {
    isFlagged: boolean;
    reason?: 'late_arrival' | 'unclean_site' | 'payment_dispute' | 'unprofessional_behavior' | 'other';
    note?: string;
  };
  reviewText: string;
  problemSolved: 'yes' | 'partly' | 'no';
  createdAt: string;
}

export interface ProProfile {
  trade: TradeType;
  secondaryTrades?: TradeType[];
  tier: ProTier;
  claimLimit: number; // e.g. GHS 1,000 to 20,000
  qualityScore: number; // 0 - 100
  jobsCompleted: number;
  problemSolvedRate: number; // percentage
  onTimeRate: number; // percentage
  rating: number; // 1.0 - 5.0
  verifiedId: boolean; // Ghana Card verified
  guarantorBacked: boolean;
  insurancePool: boolean;
  walletPending: number;
  walletAvailable: number;
  walletPaidOut: number;
  isOnline: boolean;
  avatarUrl?: string;
  trialJobCompleted: boolean;
  badges?: VerificationBadge[];
  tradeCertificates?: TradeCertificate[];
  isTradeVerified?: boolean;
  reviews?: ProReview[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  language: LanguageCode;
  avatarUrl?: string;
  location?: LocationInfo;
  proProfile?: ProProfile;
  createdAt: string;
  updatedAt?: string;
}

export interface Job {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  proId?: string;
  proName?: string;
  proPhone?: string;
  proAvatar?: string;
  proTier?: ProTier;
  trade: TradeType;
  type: JobType;
  title: string;
  description: string;
  urgency: 'now' | 'today' | 'scheduled';
  urgencyWindow?: UrgencyWindow;
  confirmDeadline?: string; // ISO string when unaccepted job auto-cancels & pre-auth expires
  escrowStatus?: EscrowStatus;
  scheduledTime?: string;
  status: JobStatus;
  basePrice: number;
  revisedQuote?: number;
  protectionFee: number;
  totalAmount: number;
  platformFee: number;
  poolFee: number;
  netProEarnings: number;
  location: LocationInfo;
  quoteItems?: QuoteLineItem[];
  milestones?: ProjectMilestone[];
  clientVoiceNoteUrl?: string;
  clientVoiceDuration?: number;
  audioNuanceInfo?: AudioNuanceInfo;
  clientPhotos?: string[];
  beforePhotos?: string[];
  afterPhotos?: string[];
  materialShopRun?: boolean;
  createdAt: string;
  updatedAt: string;
  escrowReleaseTime?: string; // 24h after completion
  ratings?: {
    workmanship: number;
    conduct: number;
    problemSolved: 'yes' | 'partly' | 'no';
    reviewText?: string;
    conductThumbsUp?: boolean;
    conductFlag?: {
      isFlagged: boolean;
      reason?: 'late_arrival' | 'unclean_site' | 'payment_dispute' | 'unprofessional_behavior' | 'other';
      note?: string;
    };
  };
}

export interface DisputeRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  initiatorRole: 'client' | 'pro';
  initiatorName: string;
  category: 'not_completed' | 'poor_workmanship' | 'damage' | 'overcharge' | 'no_show' | 'safety';
  description: string;
  evidencePhotos: string[];
  desiredOutcome: 'redo' | 'partial_refund' | 'full_refund';
  status: 'open' | 'pro_responded' | 'ops_review' | 'resolved' | 'escalated_to_claim';
  proResponse?: string;
  opsResolution?: {
    action: 'rework_ordered' | 'partial_refund' | 'full_refund' | 'released_to_pro';
    amount?: number;
    notes: string;
    resolvedAt: string;
  };
  createdAt: string;
}

export interface SosAlert {
  id: string;
  jobId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userPhone: string;
  location: LocationInfo;
  timestamp: string;
  status: 'active' | 'resolved';
  silent: boolean;
}

export interface QueuedMutation {
  id: string;
  action: 'UPDATE_JOB_STATUS' | 'SUBMIT_QUOTE' | 'UPLOAD_PHOTO' | 'CREATE_JOB' | 'RESOLVE_DISPUTE';
  payload: any;
  timestamp: number;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  retryCount: number;
}

export interface CatalogServiceItem {
  id: string;
  trade: TradeType;
  title: string;
  titleTwi: string;
  titleGa: string;
  basePrice: number;
  callOutFee: number;
  includes: string;
  includesTwi: string;
  popular?: boolean;
  type: JobType;
}

export interface ChatMessage {
  id: string;
  jobId: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'pro' | 'ops';
  text?: string;
  photoUrl?: string;
  voiceNoteUrl?: string;
  voiceDurationSeconds?: number;
  timestamp: string;
  isDelivered?: boolean;
}

export interface SmartMatchResult {
  proId: string;
  proName: string;
  avatarUrl?: string;
  trade: TradeType;
  secondaryTrades?: TradeType[];
  tier: ProTier;
  matchScore: number; // 0 - 100 percentage
  distanceKm: number;
  area: string;
  estimatedArrivalMins: number;
  reasoning: string;
  badges: string[];
  historicalHighlights: {
    problemSolvedRate: number;
    onTimeRate: number;
    rating: number;
    jobsCompleted: number;
    claimFreeMonths: number;
  };
}
