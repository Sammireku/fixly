export type ScreenId = 'home' | 'categories' | 'pros' | 'confirmation' | 'profile' | 'wallet';

export type BottomTabId = 'home' | 'bookings' | 'wallet' | 'account';

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
