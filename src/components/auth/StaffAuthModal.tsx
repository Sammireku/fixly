import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { UserProfile } from '../handyman/types';

interface StaffAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (adminProfile: UserProfile) => void;
}

export const StaffAuthModal: React.FC<StaffAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('admin@fixlygh.com');
  const [password, setPassword] = useState('Passw0rd.');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Validate staff credentials
      if (cleanEmail === 'admin@fixlygh.com' && cleanPass === 'Passw0rd.') {
        const adminProfile: UserProfile = {
          name: 'Fixly Ops Supervisor',
          email: 'admin@fixlygh.com',
          role: 'ops',
          phone: '+233 30 200 4400',
          address: 'Fixly Trust & Safety HQ, Airport Residential, Accra',
          isGhanaCardVerified: true,
          ghanaCardNumber: 'GHA-00000001-0',
          amountSpent: 0,
          amountInEscrow: 8674.0,
          completedBookingsCount: 428,
          emergencyContact: 'HQ Security Desk (+233 30 200 4499)',
          avatarUrl: '',
        };
        onSuccess(adminProfile);
        onClose();
      } else {
        setError('Invalid staff credentials. Hint: use admin@fixlygh.com with password Passw0rd.');
      }
    }, 450);
  };

  const handleQuickFill = () => {
    setEmail('admin@fixlygh.com');
    setPassword('Passw0rd.');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">Fixly Staff & Operations Portal</h3>
              <p className="text-[11px] text-slate-400">Restricted to verified Trust & Ops personnel</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 flex items-center justify-between gap-2 text-xs text-purple-900">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Sign in with supervisor credentials to access the Operations Tower.</span>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[10px] font-extrabold text-purple-700 bg-white px-2 py-1 rounded-lg border border-purple-300 hover:bg-purple-100 transition-colors cursor-pointer shrink-0"
            >
              Autofill
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Email input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
              Staff Work Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@fixlygh.com"
                required
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white transition-all font-mono"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[10px] font-bold text-purple-600 hover:underline cursor-pointer"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Passw0rd."
                required
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white transition-all font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-400 pt-0.5">
              Authorized personnel only. Sessions are logged with IP & timestamp.
            </p>
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
            >
              {loading ? (
                <span>Authenticating with Trust & Ops Gateway...</span>
              ) : (
                <>
                  <span>Authenticate & Enter Operations Tower</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
