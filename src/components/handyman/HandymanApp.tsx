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
import { Job } from '../../types';
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
import { ReferralModal } from './ReferralModal';
import { StaffAuthModal } from '../auth/StaffAuthModal';
import { EmergencySosModal } from '../EmergencySosModal';
import { DisputeModal } from '../DisputeModal';
import { AccraCostEstimator } from '../common/AccraCostEstimator';
import { ArtisanMapView } from '../map/ArtisanMapView';
import { OpsConsole } from '../ops/OpsConsole';
import { VoiceToTextRecorder } from '../VoiceToTextRecorder';
import { JobChatModal } from '../chat/JobChatModal';
import { ProJobRequestModal } from '../common/ProJobRequestModal';
import { ProjectPlannerModal } from './ProjectPlannerModal';
import { INITIAL_PROS, INITIAL_SAMPLE_JOBS } from '../../data/catalog';
import { X, Mic } from 'lucide-react';

export const HandymanApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [broadcastCenterOpen, setBroadcastCenterOpen] = useState(false);
  const [profileSettingsOpen, setProfileSettingsOpen] = useState(false);
  const [bookingHistoryOpen, setBookingHistoryOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [proOnboardingOpen, setProOnboardingOpen] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeJobId, setDisputeJobId] = useState('BKG-9921');

  // Pro Job Customization Window state
  const [proJobModalOpen, setProJobModalOpen] = useState(false);
  const [selectedProForJob, setSelectedProForJob] = useState<ProItem | null>(null);

  // NEW Feature Modal States
  const [referralModalOpen, setReferralModalOpen] = useState(false);
  const [costEstimatorOpen, setCostEstimatorOpen] = useState(false);
  const [mapViewOpen, setMapViewOpen] = useState(false);
  const [staffAuthModalOpen, setStaffAuthModalOpen] = useState(false);
  const [voiceSearchOpen, setVoiceSearchOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [activeChatJob, setActiveChatJob] = useState<Job>(INITIAL_SAMPLE_JOBS[0]);
  const [projectPlannerOpen, setProjectPlannerOpen] = useState(false);

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
    setSelectedProForJob(pro);
    setProJobModalOpen(true);
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

  // AUTOMATIC REDIRECTION: If authenticated as admin@fixlygh.com (role: ops), display Operations Tower!
  if (userProfile.role === 'ops' || userProfile.email === 'admin@fixlygh.com') {
    return (
      <div className="min-h-screen bg-slate-950 p-3 sm:p-6 text-slate-100 font-sans antialiased selection:bg-purple-600 selection:text-white">
        <OpsConsole
          onLogoutAdmin={() => {
            setUserProfile({
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
            setCurrentScreen('home');
          }}
        />
      </div>
    );
  }

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
            onOpenVoiceSearch={() => setVoiceSearchOpen(true)}
            onOpenCostEstimator={() => setCostEstimatorOpen(true)}
            onOpenMapView={() => setMapViewOpen(true)}
            onOpenReferralModal={() => setReferralModalOpen(true)}
            onOpenProjectPlanner={() => setProjectPlannerOpen(true)}
            onTabChange={handleTabChange}
          />
        )}

        {currentScreen === 'categories' && (
          <Screen2Categories
            onSelectCategory={handleSelectCategory}
            onOpenNotifications={() => setNotificationsOpen(true)}
            onOpenProjectPlanner={() => setProjectPlannerOpen(true)}
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
            onOpenBroadcastCenter={() => setBroadcastCenterOpen(true)}
            onTabChange={handleTabChange}
          />
        )}

        {currentScreen === 'profile' && (
          <Screen5Profile
            profile={userProfile}
            onOpenNotifications={() => setNotificationsOpen(true)}
            onOpenProfileSettings={() => setProfileSettingsOpen(true)}
            onOpenBookingHistory={() => setBookingHistoryOpen(true)}
            onOpenReferralModal={() => setReferralModalOpen(true)}
            onOpenStaffLogin={() => setStaffAuthModalOpen(true)}
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
            onOpenReferralModal={() => setReferralModalOpen(true)}
            onTabChange={handleTabChange}
          />
        )}
      </div>

      {/* DETAILED POPUP MODALS */}

      {/* 1. Notifications Slideover / Modal */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onOpenBroadcastCenter={() => setBroadcastCenterOpen(true)}
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

      {/* 8. REFERRAL PROGRAM MODAL */}
      <ReferralModal
        isOpen={referralModalOpen}
        onClose={() => setReferralModalOpen(false)}
        userCode={`FIXLY-${userProfile.name.split(' ')[0].toUpperCase()}-8821`}
      />

      {/* 9. ACCRA COST ESTIMATOR MODAL */}
      {costEstimatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#F8F9FB]">
              <span className="text-sm font-extrabold text-slate-900">
                Accra Materials & Labor Cost Estimator
              </span>
              <button
                onClick={() => setCostEstimatorOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              <AccraCostEstimator
                initialAreaName="East Legon (American House)"
                onSelectAndBook={(service) => {
                  handleSelectService(service.title, service.basePrice);
                  setCostEstimatorOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 10. LIVE ARTISAN MAP VIEW MODAL */}
      {mapViewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#F8F9FB]">
              <span className="text-sm font-extrabold text-slate-900">
                Live GPS Artisan Radar (East Legon & Accra)
              </span>
              <button
                onClick={() => setMapViewOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <ArtisanMapView
                pros={INITIAL_PROS}
                currentAreaName="East Legon"
                onBookArtisan={(proId, suggestedService) => {
                  if (suggestedService) {
                    handleSelectService(suggestedService.title, suggestedService.basePrice);
                  } else {
                    handleSelectCategory('Handyman');
                  }
                  setMapViewOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 11. STAFF & OPS AUTHENTICATION MODAL */}
      <StaffAuthModal
        isOpen={staffAuthModalOpen}
        onClose={() => setStaffAuthModalOpen(false)}
        onSuccess={(adminProfile) => {
          setUserProfile(adminProfile);
        }}
      />

      {/* 12. VOICE SEARCH RECORDER MODAL */}
      {voiceSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#1E5BF0]">
                <Mic className="w-5 h-5 stroke-[2]" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Voice Search (English & Twi)
                </h3>
              </div>
              <button
                onClick={() => setVoiceSearchOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <VoiceToTextRecorder
              onTranscriptComplete={(transcript, nuances) => {
                setFilters((prev) => ({
                  ...prev,
                  searchQuery: transcript,
                }));
                setVoiceSearchOpen(false);
                setCurrentScreen('pros');
              }}
            />
          </div>
        </div>
      )}

      {/* 13. JOB CHAT MODAL */}
      <JobChatModal
        job={activeChatJob}
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
      />

      {/* 14. PRO JOB CUSTOMIZATION REQUEST WINDOW */}
      <ProJobRequestModal
        isOpen={proJobModalOpen}
        onClose={() => setProJobModalOpen(false)}
        pro={selectedProForJob}
        onSubmitRequest={(details) => {
          if (selectedProForJob) {
            setBooking({
              serviceName: details.primaryService,
              proName: selectedProForJob.name,
              proInitials: selectedProForJob.initials,
              duration: '2 hours',
              address: 'East Legon (GA-392-1049), Accra',
              paymentMethod: 'Fixly Escrow (MTN MoMo)',
              total: details.totalGhs,
              escrowAmount: details.totalGhs,
              arrivalWindow: details.arrivalWindow,
              status: 'Confirmed',
              dateStr: 'Scheduled • Today',
              isGhanaCardVerified: selectedProForJob.isGhanaCardVerified,
            });
            setCurrentScreen('confirmation');
          }
        }}
      />

      {/* 15. PLAN A PROJECT MODAL (STAGED 40/40/20 ESCROW) */}
      <ProjectPlannerModal
        isOpen={projectPlannerOpen}
        onClose={() => setProjectPlannerOpen(false)}
        onProjectCreated={(project) => {
          setBookingHistory((prev) => [
            {
              id: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
              serviceTitle: project.title,
              category: project.category,
              date: 'Scheduled (40/40/20)',
              proName: 'Joseph Boateng (Elite Master)',
              proInitials: 'JB',
              proRating: 4.95,
              isGhanaCardVerified: true,
              price: project.total,
              status: 'In Escrow',
              address: 'East Legon (GA-492-3841), Accra',
              paymentMethod: 'Fixly Escrow (MTN MoMo)',
            },
            ...prev,
          ]);
          setUserProfile((prev) => ({
            ...prev,
            amountInEscrow: prev.amountInEscrow + Math.round(project.total * 0.4),
          }));
        }}
      />
    </div>
  );
};
