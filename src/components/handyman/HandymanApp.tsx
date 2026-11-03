import React, { useState } from 'react';
import {
  ScreenId,
  BottomTabId,
  ProItem,
  BookingState,
  UserProfile,
  BookingHistoryItem,
  FilterState,
  ProProfileDetails,
} from './types';
import { Screen1Home } from './Screen1Home';
import { Screen2Categories } from './Screen2Categories';
import { Screen3Professionals } from './Screen3Professionals';
import { Screen4Confirmation } from './Screen4Confirmation';
import { Screen5Profile } from './Screen5Profile';
import { Screen6Wallet } from './Screen6Wallet';
import { ProProfileScreen } from './ProProfileScreen';
import { NotificationDrawer } from './NotificationDrawer';
import { ProfileSettingsModal } from './ProfileSettingsModal';
import { BookingHistoryModal } from './BookingHistoryModal';
import { SearchFilterModal } from './SearchFilterModal';
import { ProOnboardingModal } from './ProOnboardingModal';
import { EmergencySosModal } from '../EmergencySosModal';
import { DisputeModal } from '../DisputeModal';

export const HandymanApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileSettingsOpen, setProfileSettingsOpen] = useState(false);
  const [bookingHistoryOpen, setBookingHistoryOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [proOnboardingOpen, setProOnboardingOpen] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeJobId, setDisputeJobId] = useState('BKG-9921');

  // User Profile State with Mini Dashboard metrics & Ghana Card & Pro profile capability
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Maya Johnson',
    email: 'maya.johnson@email.com',
    phone: '+233 24 412 8891',
    address: '123 Oak Street, Austin, TX 78701',
    isGhanaCardVerified: true,
    ghanaCardNumber: 'GHA-72019482-1',
    amountSpent: 1420.0,
    amountInEscrow: 120.0,
    completedBookingsCount: 14,
    emergencyContact: 'Kofi Johnson (+233 20 882 1109)',
    avatarUrl: '',
    role: 'client',
  });

  // Active Filter State for Search
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    maxDistanceMiles: 15,
    minRating: 4.0,
    minJobsCompleted: 0,
    verifiedOnly: false,
    insuredOnly: false,
    maxHourlyRate: 120,
  });

  // Booking History State
  const [bookingHistory, setBookingHistory] = useState<BookingHistoryItem[]>([
    {
      id: 'BKG-9921',
      serviceTitle: 'Furniture assembly & TV Mount',
      category: 'Handyman',
      date: 'Oct 28, 2026',
      proName: 'Marcus Kim',
      proInitials: 'MK',
      proRating: 4.9,
      isGhanaCardVerified: true,
      price: 90.0,
      status: 'Completed',
      address: '123 Oak Street, Austin, TX 78701',
      paymentMethod: 'Visa ending in 4242',
    },
    {
      id: 'BKG-8812',
      serviceTitle: 'Kitchen sink pipe repair & faucet install',
      category: 'Plumbing',
      date: 'Oct 14, 2026',
      proName: 'Ava Patel',
      proInitials: 'AP',
      proRating: 4.8,
      isGhanaCardVerified: true,
      price: 120.0,
      status: 'Completed',
      address: '123 Oak Street, Austin, TX 78701',
      paymentMethod: 'Apple Pay',
    },
    {
      id: 'BKG-7740',
      serviceTitle: 'Main circuit breaker testing & load tune',
      category: 'Electric',
      date: 'Sep 29, 2026',
      proName: 'Jordan Diaz',
      proInitials: 'JD',
      proRating: 4.7,
      isGhanaCardVerified: true,
      price: 140.0,
      status: 'Completed',
      address: '123 Oak Street, Austin, TX 78701',
      paymentMethod: 'Visa ending in 4242',
    },
  ]);

  // Active current booking state
  const [booking, setBooking] = useState<BookingState>({
    serviceName: 'Handyman visit',
    proName: 'Marcus Kim',
    proInitials: 'MK',
    duration: '2 hours',
    address: '123 Oak Street, Austin, TX 78701',
    paymentMethod: 'Visa ending in 4242',
    total: 120.0,
    escrowAmount: 120.0,
    arrivalWindow: '10:30 AM – 11:30 AM',
    status: 'Confirmed',
    dateStr: 'Today • 10:30 AM',
    isGhanaCardVerified: true,
  });

  const handleSelectService = (serviceName: string, price: number) => {
    setBooking((prev) => ({
      ...prev,
      serviceName,
      total: price * 2,
      escrowAmount: price * 2,
    }));
    setCurrentScreen('pros');
  };

  const handleSelectCategory = (categoryName?: string) => {
    setBooking((prev) => ({
      ...prev,
      serviceName: categoryName ? `${categoryName} service` : 'Handyman service',
    }));
    setCurrentScreen('pros');
  };

  const handleSelectPro = (pro: ProItem) => {
    setBooking((prev) => ({
      ...prev,
      proName: pro.name,
      proInitials: pro.initials,
      total: pro.hourlyRate * 2,
      escrowAmount: pro.hourlyRate * 2,
      isGhanaCardVerified: pro.isGhanaCardVerified,
    }));
    setCurrentScreen('confirmation');
  };

  const handleRebook = (item: BookingHistoryItem) => {
    setBooking({
      serviceName: item.serviceTitle,
      proName: item.proName,
      proInitials: item.proInitials,
      duration: '2 hours',
      address: item.address,
      paymentMethod: item.paymentMethod,
      total: item.price,
      escrowAmount: item.price,
      arrivalWindow: 'Tomorrow • 10:00 AM – 11:00 AM',
      status: 'Confirmed',
      dateStr: 'Scheduled • Tomorrow',
      isGhanaCardVerified: item.isGhanaCardVerified,
    });
    setCurrentScreen('confirmation');
  };

  const handleTabChange = (tab: BottomTabId) => {
    if (userProfile.role === 'pro' && tab === 'account') {
      setCurrentScreen('pro_profile');
      return;
    }
    switch (tab) {
      case 'home':
        setCurrentScreen('home');
        break;
      case 'bookings':
        setCurrentScreen('confirmation');
        break;
      case 'wallet':
        setCurrentScreen('wallet');
        break;
      case 'account':
        setCurrentScreen('profile');
        break;
    }
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  const handleSwitchToPro = () => {
    if (userProfile.proProfile) {
      setUserProfile((prev) => ({ ...prev, role: 'pro' }));
      setCurrentScreen('pro_profile');
    } else {
      setProOnboardingOpen(true);
    }
  };

  const handleCompleteProOnboarding = (proDetails: ProProfileDetails) => {
    setUserProfile((prev) => ({
      ...prev,
      role: 'pro',
      proProfile: proDetails,
    }));
    setCurrentScreen('pro_profile');
  };

  const handleSwitchToClient = () => {
    setUserProfile((prev) => ({ ...prev, role: 'client' }));
    setCurrentScreen('profile');
  };

  return (
    <div className="min-h-screen bg-[#ECEEF2] text-slate-900 flex justify-center font-sans antialiased selection:bg-[#1E5BF0] selection:text-white">
      {/* Responsive App Container */}
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl min-h-screen bg-[#F4F5F8] flex flex-col shadow-xl sm:border-x sm:border-slate-200/80 relative">
        {currentScreen === 'home' && (
          <Screen1Home
            onNavigateToCategories={() => setCurrentScreen('categories')}
            onNavigateToPros={handleSelectCategory}
            onSelectService={handleSelectService}
            onOpenNotifications={() => setNotificationsOpen(true)}
            onOpenFilters={() => setFiltersOpen(true)}
            onOpenSos={() => setSosModalOpen(true)}
            onTabChange={handleTabChange}
          />
        )}

        {currentScreen === 'categories' && (
          <Screen2Categories
            onSelectCategory={handleSelectCategory}
            onOpenNotifications={() => setNotificationsOpen(true)}
            onTabChange={handleTabChange}
          />
        )}

        {currentScreen === 'pros' && (
          <Screen3Professionals
            onSelectPro={handleSelectPro}
            onOpenNotifications={() => setNotificationsOpen(true)}
            onTabChange={handleTabChange}
            filterState={filters}
          />
        )}

        {currentScreen === 'confirmation' && (
          <Screen4Confirmation
            booking={booking}
            onEditBooking={() => setCurrentScreen('pros')}
            onOpenNotifications={() => setNotificationsOpen(true)}
            onTabChange={handleTabChange}
          />
        )}

        {currentScreen === 'profile' && (
          <Screen5Profile
            profile={userProfile}
            onOpenNotifications={() => setNotificationsOpen(true)}
            onOpenProfileSettings={() => setProfileSettingsOpen(true)}
            onOpenBookingHistory={() => setBookingHistoryOpen(true)}
            onSwitchToPro={handleSwitchToPro}
            onTabChange={handleTabChange}
          />
        )}

        {currentScreen === 'pro_profile' && userProfile.proProfile && (
          <ProProfileScreen
            userProfile={userProfile}
            proProfile={userProfile.proProfile}
            onOpenNotifications={() => setNotificationsOpen(true)}
            onSwitchToClient={handleSwitchToClient}
            onTakeMoreSkillTests={() => setProOnboardingOpen(true)}
            onTabChange={handleTabChange}
          />
        )}

        {currentScreen === 'wallet' && (
          <Screen6Wallet
            onOpenNotifications={() => setNotificationsOpen(true)}
            onTabChange={handleTabChange}
          />
        )}
      </div>

      {/* DETAILED POPUP MODALS */}

      {/* 1. Notifications Slideover / Modal */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      {/* 2. Profile Settings & Mini Dashboard Modal */}
      <ProfileSettingsModal
        isOpen={profileSettingsOpen}
        onClose={() => setProfileSettingsOpen(false)}
        profile={userProfile}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* 3. Booking History Modal */}
      <BookingHistoryModal
        isOpen={bookingHistoryOpen}
        onClose={() => setBookingHistoryOpen(false)}
        bookings={bookingHistory}
        onRebook={handleRebook}
      />

      {/* 4. Search Filter Modal */}
      <SearchFilterModal
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onApplyFilters={(updated) => {
          setFilters(updated);
          setCurrentScreen('pros');
        }}
        onResetFilters={() =>
          setFilters({
            searchQuery: '',
            maxDistanceMiles: 15,
            minRating: 4.0,
            minJobsCompleted: 0,
            verifiedOnly: false,
            insuredOnly: false,
            maxHourlyRate: 120,
          })
        }
      />

      {/* 5. Pro Onboarding & Skill Assessment Modal */}
      <ProOnboardingModal
        isOpen={proOnboardingOpen}
        onClose={() => setProOnboardingOpen(false)}
        userProfile={userProfile}
        onCompleteOnboarding={handleCompleteProOnboarding}
      />

      {/* 6. Emergency 1-Tap SOS Modal */}
      <EmergencySosModal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
      />

      {/* 7. Dispute & Mediation Modal */}
      <DisputeModal
        isOpen={disputeModalOpen}
        onClose={() => setDisputeModalOpen(false)}
        jobId={disputeJobId}
      />
    </div>
  );
};
