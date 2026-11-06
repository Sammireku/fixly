export type ScreenId = 'home' | 'categories' | 'pros' | 'confirmation' | 'profile' | 'wallet' | 'pro_profile';

export type BottomTabId = 'home' | 'bookings' | 'wallet' | 'account';

export type UserRole = 'client' | 'pro' | 'ops';

export interface ProItem {
  id: string;
  initials: string;
  name: string;
  category: string;
  experience: string;
  hourlyRate: number;
  rating: number;
  reviewsCount?: number;
  jobsCompleted: number;
  distanceMiles: number;
  isGhanaCardVerified: boolean;
  isInsured: boolean;
  avatarUrl?: string;
  phone?: string;
}

export interface BookingState {
  serviceName: string;
  proName: string;
  proInitials: string;
  duration: string;
  address: string;
  paymentMethod: string;
  total: number;
  escrowAmount: number;
  arrivalWindow: string;
  status: 'Confirmed' | 'In Progress' | 'Completed';
  dateStr: string;
  isGhanaCardVerified: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  avatarUrl?: string;
  isGhanaCardVerified: boolean;
  ghanaCardNumber: string;
  amountSpent: number;
  amountInEscrow: number;
  completedBookingsCount: number;
  emergencyContact: string;
  role: UserRole;
  proProfile?: ProProfileDetails;
}

export interface ProProfileDetails {
  primaryTrade: string;
  secondaryTrades: string[];
  hourlyRate: number;
  experienceYears: number;
  rating: number;
  jobsCompleted: number;
  onTimeRate: number;
  problemSolvedRate: number;
  isOnline: boolean;
  walletAvailable: number;
  walletPending: number;
  walletPaidOut: number;
  momoNumber: string;
  momoNetwork: string;
  testScore: number;
  testedServices: string[];
  certifications: string[];
}

export interface BookingHistoryItem {
  id: string;
  serviceTitle: string;
  category: string;
  date: string;
  proName: string;
  proInitials: string;
  proRating: number;
  isGhanaCardVerified: boolean;
  price: number;
  status: 'Completed' | 'Confirmed' | 'In Escrow' | 'Refunded';
  address: string;
  paymentMethod: string;
}

export interface FilterState {
  searchQuery: string;
  maxDistanceMiles: number;
  minRating: number;
  minJobsCompleted: number;
  verifiedOnly: boolean;
  insuredOnly: boolean;
  maxHourlyRate: number;
}

export interface SkillTestQuestion {
  id: string;
  field: string;
  serviceName: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
