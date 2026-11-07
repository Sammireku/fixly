import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  ShieldCheck,
  Check,
  Lock,
  CalendarCheck,
  MapPin,
  Phone,
  Mail,
  User,
  UploadCloud,
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Radio,
  FileText,
  Sparkles,
  Sun,
  Moon,
  Wrench,
  DollarSign,
} from 'lucide-react';
import { UserProfile } from './types';
import { GhanaCardBadge } from './GhanaCardBadge';
import { ProServiceManagerModal } from './ProServiceManagerModal';
import { formatCurrency } from '../../lib/currency';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  initialTab?: 'profile' | 'faq' | 'pro_services';
}

interface FaqItem {
  id: string;
  category: 'escrow' | 'guarantee' | 'safety' | 'offline' | 'general';
  question: string;
  answer: string;
  highlight?: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'escrow',
    question: 'How does Fixly protect my money using Escrow?',
    answer:
      'When you book a service or approve an artisan diagnostic quote, your funds are safely locked in a regulated Fixly Escrow account. The artisan never receives payment upfront. Money is only disbursed once the work is physically inspected and you sign off in the app or provide your confirmation OTP.',
    highlight: 'Zero upfront cash risk. 100% held in trust.',
  },
  {
    id: 'faq-2',
    category: 'escrow',
    question: 'When is payment released to the artisan?',
    answer:
      'Once the artisan marks the job as completed, you can immediately release funds after testing the repair. If you are away, Fixly provides a built-in 24-hour inspection window. Funds are automatically transferred to the artisan’s MTN MoMo or Telecel Cash wallet only after this window expires without disputes.',
    highlight: '24-hour buffer to test all taps, sockets, or installations.',
  },
  {
    id: 'faq-3',
    category: 'guarantee',
    question: 'What is the Fixly 24-Hour Service Guarantee and Rework Policy?',
    answer:
      'Every completed job on Fixly is backed by our strict 24-Hour Workmanship Guarantee. If a repaired tap leaks, a painted surface peels, or an AC unit malfunctions within 24 hours, Fixly will send an elite master technician to rework the job completely free of charge, or issue a 100% escrow refund.',
    highlight: 'Free rework or 100% refund guarantee.',
  },
  {
    id: 'faq-4',
    category: 'offline',
    question: 'How do artisans get notified if they have little or no internet access?',
    answer:
      'Many Ghanaian artisans conserve mobile data on job sites. Fixly solves this with a nationwide 2G GSM SMS Shortcode (1400) and lightweight WhatsApp dispatch gateway. Artisans receive instant SMS job alerts on basic feature phones and can accept or decline by texting "YES [ID]" or "NO [ID]" without needing internet.',
    highlight: 'Works via 2G SMS Shortcodes & WhatsApp direct links.',
  },
  {
    id: 'faq-5',
    category: 'safety',
    question: 'Why is Ghana Card (NIA) biometric verification mandatory?',
    answer:
      'Safety and trust are our highest priorities. All artisans and clients are authenticated against the National Identification Authority (NIA) database. In addition, artisans undergo police background checks, trade skill practicals, and must provide verified physical guarantors with signed deeds of guarantee.',
    highlight: 'Biometrically verified identities for full peace of mind.',
  },
  {
    id: 'faq-6',
    category: 'escrow',
    question: 'Which payment methods are supported on Fixly?',
    answer:
      'Fixly natively supports Ghanaian Mobile Money networks—MTN MoMo, Telecel Cash (Vodafone), and AT Money—as well as domestic and international bank cards (Visa, Mastercard, Gh-Link). You can add, edit, or set default payment methods in your Wallet screen.',
    highlight: 'MTN MoMo, Telecel Cash, AT Money, Visa, Mastercard, Gh-Link.',
  },
  {
    id: 'faq-7',
    category: 'safety',
    question: 'Can I pay the artisan in cash on site?',
    answer:
      'Strictly prohibited. All payments must go through Fixly Escrow via Mobile Money or Card. Off-platform cash payments void your 24-hour Fixly guarantee, cancel insurance coverage against accidental property damage, and forfeit our dispute resolution protection.',
    highlight: 'Zero cash on site protects you and your insurance coverage.',
  },
  {
    id: 'faq-8',
    category: 'guarantee',
    question: 'What happens if an artisan damages something or does poor work?',
    answer:
      'If you are dissatisfied, tap "Raise Dispute" on the booking screen. This immediately freezes all escrow funds. A Fixly Operations Specialist will review photo/video evidence within 2 hours. Our registered insurance policy covers accidental property damage up to GH₵5,000.',
    highlight: 'Immediate escrow freeze & up to GH₵5,000 damage coverage.',
  },
  {
    id: 'faq-9',
    category: 'general',
    question: 'How does the Fixly Referral Program work?',
    answer:
      'You can share your unique referral code with friends and family. When your invited friend registers, they receive a GH₵25 welcome credit on their first service. Once their first booking is completed, you receive GH₵25 credit deposited into your Fixly wallet.',
    highlight: 'Give GH₵25, Get GH₵25 in wallet credits.',
  },
  {
    id: 'faq-10',
    category: 'safety',
    question: 'What is the 1-Tap SOS Emergency Beacon?',
    answer:
      'For home visits, safety is paramount. Tapping the red SOS icon in the header broadcasts an urgent distress beacon with your real-time GhanaPost GPS coordinates to the Fixly 24/7 Operations Tower and your registered emergency contact, triggering rapid field assistance.',
    highlight: 'Real-time GPS distress dispatch to Ops & emergency contacts.',
  },
];

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  initialTab = 'profile',
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'faq' | 'pro_services'>(initialTab);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);
  const [emergencyContact, setEmergencyContact] = useState(profile.emergencyContact);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Theme Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        document.documentElement.classList.contains('dark') ||
        localStorage.getItem('theme') === 'dark'
      );
    }
    return false;
  });

  // Pro Service Manager modal state
  const [isProServiceManagerOpen, setIsProServiceManagerOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // FAQ state
  const [faqSearch, setFaqSearch] = useState('');
  const [faqCategory, setFaqCategory] = useState<string>('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      email,
      phone,
      address,
      emergencyContact,
      avatarUrl: avatarUrl || undefined,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCategory = faqCategory === 'all' || item.category === faqCategory;
    const matchesQuery =
      item.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      item.answer.toLowerCase().includes(faqSearch.toLowerCase()) ||
      (item.highlight && item.highlight.toLowerCase().includes(faqSearch.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in dark:bg-black/80">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-[#F8F9FB] dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EBF1FF] dark:bg-blue-950/80 text-[#1E5BF0] dark:text-blue-400 flex items-center justify-center">
              {activeTab === 'profile' ? (
                <User className="w-4 h-4 stroke-[2]" />
              ) : activeTab === 'faq' ? (
                <HelpCircle className="w-4 h-4 stroke-[2]" />
              ) : (
                <Wrench className="w-4 h-4 stroke-[2]" />
              )}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                {activeTab === 'profile'
                  ? 'Profile & Account Settings'
                  : activeTab === 'faq'
                  ? 'Platform & Escrow FAQ'
                  : 'Artisan Services & Rates'}
              </h3>
              <span className="text-[11px] text-slate-400 dark:text-slate-400 font-medium">
                {activeTab === 'profile'
                  ? 'Manage personal details, theme preference & financial summary'
                  : activeTab === 'faq'
                  ? 'Quick answers about Fixly escrow, guarantees & offline artisans'
                  : 'Assign custom GHS rates for subservices'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="px-2.5 py-1.5 rounded-full bg-slate-200/80 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-amber-300 flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700 fill-slate-700" />
                  <span>Dark</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-700/60 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selection Switcher */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-[#1E5BF0] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pro_services')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pro_services'
                ? 'bg-[#1E5BF0] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Trade Services & Rates</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black uppercase">
              17 Cats
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('faq')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'faq'
                ? 'bg-[#1E5BF0] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FAQ</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#1E5BF0] dark:text-blue-300 font-black">
              10
            </span>
          </button>
        </div>

        {/* Body Content */}
        {activeTab === 'profile' ? (
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Top Mini Dashboard: Escrow & Spending */}
            <div className="bg-gradient-to-br from-[#1E5BF0] to-[#1545C2] text-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-blue-100 uppercase tracking-wider">
                  Account Mini Dashboard
                </span>
                <GhanaCardBadge idNumber={profile.ghanaCardNumber} size="sm" />
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/10">
                  <span className="text-[10px] text-blue-100 block font-medium">Total Spent</span>
                  <span className="text-sm font-extrabold text-white mt-0.5 block">
                    {formatCurrency(profile.amountSpent)}
                  </span>
                </div>

                <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/10">
                  <div className="flex items-center gap-1 text-[10px] text-emerald-200 font-medium">
                    <Lock className="w-2.5 h-2.5 text-emerald-300" />
                    <span>In Escrow</span>
                  </div>
                  <span className="text-sm font-extrabold text-emerald-300 mt-0.5 block">
                    {formatCurrency(profile.amountInEscrow)}
                  </span>
                </div>

                <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/10">
                  <span className="text-[10px] text-blue-100 block font-medium">Bookings</span>
                  <span className="text-sm font-extrabold text-white mt-0.5 block">
                    {profile.completedBookingsCount} done
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-blue-200 block mt-2.5">
                Escrow funds are held secure and released only after you sign off on job completion.
              </span>
            </div>

            {/* Profile Photo Uploader */}
            <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl">
              <div className="relative group shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#1E5BF0] shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#EBF1FF] dark:bg-blue-950 text-[#1E5BF0] dark:text-blue-400 font-black text-xl flex items-center justify-center border-2 border-blue-200 dark:border-blue-800">
                    {name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Change Photo"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Profile Photo</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Upload your picture to establish trust with your assigned artisan.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    Upload New Photo
                  </button>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Appearance Theme Card */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                  {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">App Theme</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Currently: {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isDarkMode
                    ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                Toggle Mode
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Service Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="e.g. Samuel (+233 24 555 0192)"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Ghana Card / National ID
                  </label>
                  <div className="p-2 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-950 dark:text-emerald-300">
                      {profile.ghanaCardNumber}
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">
                      VERIFIED
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {savedSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Profile details updated successfully!</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#1E5BF0] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : activeTab === 'pro_services' ? (
          /* TAB: ARTISAN SERVICES & PRICING */
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            <div className="p-4 bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Ghana Handyman Menu Catalog
                </span>
                <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded-full font-extrabold">
                  17 Categories
                </span>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed">
                As a registered artisan on Fixly, you can choose which subservices you offer (from Plumbing to Solar & Fumigation) and override default base prices with your own custom GHS rates.
              </p>
              <button
                type="button"
                onClick={() => setIsProServiceManagerOpen(true)}
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-2 mt-2"
              >
                <Wrench className="w-4 h-4" />
                <span>Open Artisan Rate & Service Editor</span>
              </button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                How Custom Subservice Rates Work
              </h4>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-disc pl-4">
                <li>
                  Clients select specific subservices from your menu when booking.
                </li>
                <li>
                  Your custom GHS price is automatically calculated in the client's escrow contract.
                </li>
                <li>
                  Safety flags (such as Power Isolation or Height) automatically trigger safety checks before job start.
                </li>
              </ul>
            </div>
          </div>
        ) : (
          /* TAB 2: PLATFORM & ESCROW FAQ */
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Search FAQ (e.g., escrow, refund, guarantee, momo, offline)..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              {faqSearch && (
                <button
                  type="button"
                  onClick={() => setFaqSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all', label: 'All FAQs' },
                { id: 'escrow', label: 'Escrow & Money' },
                { id: 'guarantee', label: '24-Hr Guarantee' },
                { id: 'safety', label: 'Ghana Card & Safety' },
                { id: 'offline', label: 'Offline 2G Broadcast' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFaqCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    faqCategory === cat.id
                      ? 'bg-[#1E5BF0] text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Accordion FAQ List */}
            <div className="space-y-2 pt-1">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No matching questions found</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    Try searching for terms like "escrow", "momo", or "guarantee".
                  </p>
                </div>
              ) : (
                filteredFaqs.map((faq) => {
                  const isOpen = expandedFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="border border-slate-200/90 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-800/80 overflow-hidden transition-all shadow-2xs"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <span className="text-xs font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                          {faq.question}
                        </span>
                        <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0 text-slate-500 dark:text-slate-400">
                          {isOpen ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-3.5 pt-1 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-700 space-y-2 animate-fade-in">
                          <p className="leading-relaxed text-[12px]">{faq.answer}</p>
                          {faq.highlight && (
                            <div className="p-2 bg-blue-50/80 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800 rounded-xl text-[11px] font-semibold text-[#1E5BF0] dark:text-blue-300 flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#1E5BF0] dark:text-blue-400 shrink-0" />
                              <span>{faq.highlight}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Need More Assistance Banner */}
            <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl space-y-1 mt-3 border border-slate-700">
              <span className="text-xs font-bold block text-white">Have a specific question?</span>
              <p className="text-[11px] text-slate-300">
                Fixly Customer Care in Accra is on call 24/7. Reach us via phone at +233 30 200 4400 or email support@fixlygh.com.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Embedded Pro Service Manager Modal */}
      <ProServiceManagerModal
        isOpen={isProServiceManagerOpen}
        onClose={() => setIsProServiceManagerOpen(false)}
        proName={profile.name}
        onSaveProServices={(offeredIds, customPrices) => {
          console.log('Saved pro subservices:', offeredIds, customPrices);
        }}
      />
    </div>
  );
};
