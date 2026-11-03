import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useOffline } from '../context/OfflineContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { UserRole } from '../types';
import {
  ShieldCheck,
  Wifi,
  WifiOff,
  VolumeX,
  AlertTriangle,
  UserCheck,
  Globe,
  ChevronDown,
  Check,
  Award,
  Bell,
  LogIn,
  LogOut,
  Camera,
  User as UserIcon,
  Wrench,
  ShieldAlert,
  Smartphone,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  onOpenRoleModal: () => void;
  onOpenSosModal: () => void;
  onOpenAuthModal: () => void;
  onOpenReminderCenter: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRoleModal,
  onOpenSosModal,
  onOpenAuthModal,
  onOpenReminderCenter,
  activeTab,
  setActiveTab,
}) => {
  const { language, setLanguage, isSpeaking, stopAudio, supportedLanguages } = useLanguage();
  const { networkMode, setDrawerOpen, queuedMutations } = useOffline();
  const {
    currentUser,
    isAuthenticated,
    logout,
    updateUserAvatar,
    activeRole,
    setActiveRole,
    sosAlerts,
  } = useMarketplace();

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const langDropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeSosCount = sosAlerts.filter((a) => a.status === 'active').length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateUserAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const userAvatar = currentUser.avatarUrl || currentUser.proProfile?.avatarUrl;

  return (
    <header className="sticky top-0 z-40 bg-[#0B132B]/95 backdrop-blur-md border-b border-[#1E2B4D] text-slate-100 shadow-lg">
      {/* Promise & Assurance Micro-Strip */}
      <div className="bg-[#131D38] border-b border-[#1E2B4D] text-sky-200 text-[11px] font-medium py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
        <span className="truncate">
          Fixly Ghana: Handymen who show up, fixed pricing, funds locked in Escrow.
        </span>
      </div>

      {/* Main Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-6">
        {/* Zone 1: Official Fixly Brand & Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 group text-left cursor-pointer focus-visible:outline-none"
          >
            <img
              src="/assets/aistudio/fixly_logo_a30be9f2.jpeg"
              alt="Fixly Ghana"
              className="h-9 w-auto rounded-xl object-contain shadow-md shadow-sky-900/40 group-hover:scale-105 transition-transform"
            />
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black tracking-tight text-white drop-shadow-xs">
                Fixly
              </span>
              <span className="hidden sm:inline-block text-[9px] font-extrabold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40 uppercase tracking-wider">
                Accra
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Secondary/Clean) */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'bg-[#2B83D3] text-white font-bold'
                : 'text-slate-300 hover:text-white hover:bg-[#131D38]'
            }`}
          >
            {activeRole === 'pro' ? 'Job Radar' : activeRole === 'ops' ? 'Overview' : 'Services & Booking'}
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'jobs'
                ? 'bg-[#2B83D3] text-white font-bold'
                : 'text-slate-300 hover:text-white hover:bg-[#131D38]'
            }`}
          >
            {activeRole === 'pro' ? 'My Active Jobs' : activeRole === 'ops' ? 'Disputes Console' : 'My Active Repairs'}
          </button>

          <button
            onClick={() => setActiveTab('trust')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'trust'
                ? 'bg-[#2B83D3] text-white font-bold'
                : 'text-slate-300 hover:text-white hover:bg-[#131D38]'
            }`}
          >
            Trust & Escrow
          </button>
        </nav>

        {/* Zone 3: Actions Cluster (Online Toggle, Language, Sign Up / Profile Logo) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* 1. Online Toggle / Network Simulator */}
          <button
            onClick={() => setDrawerOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              networkMode === 'online'
                ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/70'
                : networkMode === 'patchy'
                ? 'bg-amber-950/70 text-amber-300 border-amber-500/40 hover:bg-amber-900/70'
                : 'bg-rose-950/70 text-rose-300 border-rose-500/40 hover:bg-rose-900/70'
            }`}
            title="Toggle Network Simulator (Online, 2G, Offline)"
          >
            {networkMode === 'offline' ? (
              <WifiOff className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span className="capitalize text-xs">
              {networkMode === 'patchy' ? '2G' : networkMode}
            </span>
            {queuedMutations.length > 0 && (
              <span className="bg-amber-500 text-slate-950 rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-black">
                {queuedMutations.length}
              </span>
            )}
          </button>

          {/* 2. Language Selector Icon */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#131D38] hover:bg-[#1E2B4D] text-slate-200 text-xs font-bold border border-[#1E2B4D] cursor-pointer transition-colors"
              title="Select Language Pack"
              aria-label="Language selection"
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span className="uppercase text-xs">{language}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-[#131D38] rounded-2xl shadow-2xl border border-[#1E2B4D] py-2 z-50 animate-fade-in text-slate-100">
                <div className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-[#1E2B4D] mb-1">
                  Select Language
                </div>
                {supportedLanguages.map((langItem) => {
                  const isSelected = language === langItem.code;
                  return (
                    <button
                      key={langItem.code}
                      onClick={() => {
                        setLanguage(langItem.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-[#1E2B4D] cursor-pointer transition-colors ${
                        isSelected ? 'font-black text-sky-400 bg-sky-500/10' : 'text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{langItem.flag}</span>
                        <div>
                          <span className="block leading-none">{langItem.name}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{langItem.nativeName}</span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Stop Audio Button if voice synthesis is playing */}
          {isSpeaking && (
            <button
              onClick={stopAudio}
              className="p-1.5 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer animate-pulse"
              title="Stop voice audio"
            >
              <VolumeX className="w-4 h-4" />
            </button>
          )}

          {/* 3. Auth Control: Sign Up / Login Button OR Profile Logo Container */}
          {!isAuthenticated ? (
            <button
              onClick={onOpenAuthModal}
              className="px-3.5 py-1.5 rounded-xl bg-[#2B83D3] hover:bg-sky-500 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md shadow-sky-900/30 transition-all shrink-0"
              title="Sign In or Register with OTP"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign Up or Login</span>
            </button>
          ) : (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 pr-2.5 rounded-2xl bg-[#131D38] hover:bg-[#1E2B4D] border border-[#1E2B4D] cursor-pointer transition-all focus:outline-none group"
                title="Open Account Profile & Role Settings"
              >
                {/* Profile Logo / Avatar */}
                <div className="w-8 h-8 rounded-xl bg-[#0B132B] border border-sky-500/40 overflow-hidden flex items-center justify-center font-black text-sky-400 text-xs shadow-sm">
                  {userAvatar ? (
                    <img src={userAvatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{currentUser.name.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>

                <div className="text-left hidden sm:block">
                  <span className="text-xs font-bold text-white block leading-tight truncate max-w-[100px]">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] font-extrabold text-sky-400 uppercase block tracking-wider">
                    {activeRole === 'client' ? 'Client' : activeRole === 'pro' ? 'Pro' : 'Ops Admin'}
                  </span>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
              </button>

              {/* Profile Container Popover */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#131D38] rounded-3xl shadow-2xl border border-[#1E2B4D] p-4 z-50 animate-fade-in text-slate-100 space-y-4">
                  {/* User Profile Info & Upload Photo */}
                  <div className="flex items-center gap-3 pb-3 border-b border-[#1E2B4D]">
                    <div className="relative group/avatar">
                      <div className="w-12 h-12 rounded-2xl bg-[#0B132B] border-2 border-sky-500/50 overflow-hidden flex items-center justify-center font-black text-sky-400 text-sm shadow-md">
                        {userAvatar ? (
                          <img src={userAvatar} alt={currentUser.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{currentUser.name.slice(0, 2).toUpperCase()}</span>
                        )}
                      </div>

                      {/* Photo Upload Overlay Button */}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white"
                        title="Upload Profile Picture"
                      >
                        <Camera className="w-5 h-5 text-sky-400" />
                      </button>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-white truncate">{currentUser.name}</h4>
                      <span className="text-[11px] text-slate-400 block font-mono truncate">{currentUser.phone}</span>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[10px] font-bold text-sky-400 hover:underline mt-0.5 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Camera className="w-3 h-3" />
                        <span>Upload Photo</span>
                      </button>
                    </div>
                  </div>

                  {/* EMBEDDED ROLE SELECTION CONTAINER */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                      Switch Active Role View
                    </span>

                    <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#0B132B] rounded-2xl border border-[#1E2B4D]">
                      <button
                        onClick={() => {
                          setActiveRole('client');
                          setProfileOpen(false);
                        }}
                        className={`py-2 px-1 rounded-xl text-[11px] font-extrabold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                          activeRole === 'client'
                            ? 'bg-[#2B83D3] text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <UserIcon className="w-3.5 h-3.5" />
                        <span>Client</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveRole('pro');
                          setProfileOpen(false);
                        }}
                        className={`py-2 px-1 rounded-xl text-[11px] font-extrabold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                          activeRole === 'pro'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Pro Artisan</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveRole('ops');
                          setProfileOpen(false);
                        }}
                        className={`py-2 px-1 rounded-xl text-[11px] font-extrabold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                          activeRole === 'ops'
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Dispute / Ops</span>
                      </button>
                    </div>
                  </div>

                  {/* Profile Actions & Quick Links */}
                  <div className="space-y-1.5 pt-2 border-t border-[#1E2B4D] text-xs font-semibold">

                    {activeRole === 'pro' && (
                      <>
                        <button
                          onClick={() => {
                            setActiveTab('wallet');
                            setProfileOpen(false);
                          }}
                          className="w-full p-2 rounded-xl text-left hover:bg-[#1E2B4D] text-slate-300 hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <span className="text-emerald-400 font-black">₵</span>
                          <span>Wallet & MoMo Payouts</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('badges');
                            setProfileOpen(false);
                          }}
                          className="w-full p-2 rounded-xl text-left hover:bg-[#1E2B4D] text-slate-300 hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <Award className="w-4 h-4 text-amber-400" />
                          <span>Verification Badges</span>
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => {
                        onOpenReminderCenter();
                        setProfileOpen(false);
                      }}
                      className="w-full p-2 rounded-xl text-left hover:bg-[#1E2B4D] text-slate-300 hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Bell className="w-4 h-4 text-amber-400" />
                      <span>1-Hour Appointment Reminders</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenSosModal();
                        setProfileOpen(false);
                      }}
                      className="w-full p-2 rounded-xl text-left hover:bg-rose-950/60 text-rose-300 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <span>Emergency SOS Tool</span>
                      </div>
                      {activeSosCount > 0 && (
                        <span className="bg-rose-600 text-white rounded-full text-[10px] px-1.5 py-0.2 font-black">
                          {activeSosCount}
                        </span>
                      )}
                    </button>

                    {/* Sign Out Action */}
                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                      className="w-full p-2.5 mt-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      <span>Sign Out / Switch Account</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


