import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  ShieldCheck,
  Check,
  DollarSign,
  Lock,
  CalendarCheck,
  MapPin,
  Phone,
  Mail,
  User,
  UploadCloud,
} from 'lucide-react';
import { UserProfile } from './types';
import { GhanaCardBadge } from './GhanaCardBadge';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
}) => {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);
  const [emergencyContact, setEmergencyContact] = useState(profile.emergencyContact);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#F8F9FB]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EBF1FF] text-[#1E5BF0] flex items-center justify-center">
              <User className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Profile & Account Settings
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                Manage your personal information & escrow dashboard
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
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
                <span className="text-[10px] text-blue-100 block font-medium">
                  Total Spent
                </span>
                <span className="text-sm font-extrabold text-white mt-0.5 block">
                  ${profile.amountSpent.toFixed(2)}
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/10">
                <div className="flex items-center gap-1 text-[10px] text-emerald-200 font-medium">
                  <Lock className="w-2.5 h-2.5 text-emerald-300" />
                  <span>In Escrow</span>
                </div>
                <span className="text-sm font-extrabold text-emerald-300 mt-0.5 block">
                  ${profile.amountInEscrow.toFixed(2)}
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/10">
                <span className="text-[10px] text-blue-100 block font-medium">
                  Bookings
                </span>
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
          <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <div className="relative group shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#1E5BF0] shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#EBF1FF] text-[#1E5BF0] font-black text-xl flex items-center justify-center border-2 border-blue-200">
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
              <h4 className="text-xs font-bold text-slate-900">Profile Photo</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Upload your picture to establish trust with your assigned artisan.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  Upload New Photo
                </button>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl('')}
                    className="text-[11px] text-rose-600 hover:underline cursor-pointer"
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

          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Service Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="e.g. Samuel (+233 24 555 0192)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Ghana Card / National ID
                </label>
                <div className="p-2 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-950">
                    {profile.ghanaCardNumber}
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    VERIFIED
                  </span>
                </div>
              </div>
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
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
      </div>
    </div>
  );
};
