import React, { useState, useEffect, useRef } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { usePreventScroll } from '../../hooks/usePreventScroll';
import { UserRole, User } from '../../types';
import {
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Lock,
  UserCheck,
  Wrench,
  X,
  ArrowRight,
  RefreshCw,
  Sparkles,
  AlertCircle,
  PhoneCall,
  Check,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultRole = 'client' }) => {
  const { allUsers, setActiveRole, login } = useMarketplace();
  usePreventScroll(isOpen);

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [role, setRole] = useState<UserRole>(defaultRole);

  // Form Steps: 'phone' -> 'otp' -> 'profile' (for signup) -> 'complete'
  const [step, setStep] = useState<'phone' | 'otp' | 'profile' | 'complete'>('phone');

  // Input states
  const [phone, setPhone] = useState('024 491 0029');
  const [countryCode, setCountryCode] = useState('+233');
  const [otpDigits, setOtpDigits] = useState(['7', '8', '2', '1', '9', '4']);
  const [timer, setTimer] = useState(30);
  const [otpSentNotification, setOtpSentNotification] = useState<string | null>(null);

  // Profile signup fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [area, setArea] = useState('East Legon');
  const [ghanaPostGps, setGhanaPostGps] = useState('GA-492-3841');
  const [trade, setTrade] = useState('plumbing');
  const [ghanaCardId, setGhanaCardId] = useState('GHA-78192048-1');

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: any;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  const handleSendOtp = () => {
    if (!phone || phone.length < 9) return;
    setStep('otp');
    setTimer(30);
    setOtpSentNotification(`Fixly SMS: Your 6-digit OTP code is 782194. Valid for 5 minutes.`);
  };

  const handleVerifyOtp = () => {
    const code = otpDigits.join('');
    if (code.length < 6) return;

    if (authMode === 'signup') {
      setStep('profile');
    } else {
      // Login user
      setActiveRole(role);
      login();
      setStep('complete');
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  const handleAutoFillDemoOtp = () => {
    setOtpDigits(['7', '8', '2', '1', '9', '4']);
  };

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    // Auto-advance focus
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCompleteRegistration = () => {
    setActiveRole(role);
    login();
    setStep('complete');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 overflow-hidden relative space-y-5">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-lg shadow-xs">
              F
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Fixly Ghana OTP Authentication</h3>
              <p className="text-[11px] text-slate-500">Secure Phone Sign In & Passwordless Login</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode & Role Switcher */}
        {step !== 'complete' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                onClick={() => {
                  setAuthMode('signin');
                  setStep('phone');
                }}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  authMode === 'signin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setStep('phone');
                }}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  authMode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setRole('client')}
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                  role === 'client'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <UserCheck className="w-4 h-4 text-amber-600" />
                <span>Homeowner / Client</span>
              </button>

              <button
                onClick={() => setRole('pro')}
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                  role === 'pro'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Wrench className="w-4 h-4 text-emerald-600" />
                <span>Pro Artisan</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: PHONE NUMBER ENTRY */}
        {step === 'phone' && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                Ghanaian Mobile Number
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
                >
                  <option value="+233">🇬🇭 +233 (Ghana)</option>
                  <option value="+234">🇳🇬 +234 (Nigeria)</option>
                  <option value="+254">🇰🇪 +254 (Kenya)</option>
                  <option value="+44">🇬🇧 +44 (UK)</option>
                  <option value="+1">🇺🇸 +1 (US)</option>
                </select>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="024 123 4567"
                  className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
              <span className="text-[10px] text-slate-400 block">
                Supports MTN Mobile Money, Telecel Cash & AT Money authentication lines
              </span>
            </div>

            <button
              onClick={handleSendOtp}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/20 transition-all"
            >
              <span>Send 6-Digit OTP Code via SMS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: 6-DIGIT OTP VERIFICATION */}
        {step === 'otp' && (
          <div className="space-y-4 animate-fade-in">
            {otpSentNotification && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2 animate-bounce-subtle">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-mono text-[11px] leading-tight">{otpSentNotification}</span>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                  Enter 6-Digit OTP Code:
                </label>
                <button
                  onClick={handleAutoFillDemoOtp}
                  className="text-[10px] font-bold text-amber-700 hover:underline cursor-pointer"
                >
                  Auto-Fill Demo Code (782194)
                </button>
              </div>

              {/* 6 Individual Digit Inputs */}
              <div className="grid grid-cols-6 gap-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputRefs.current[idx] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    className="w-full h-12 text-center font-mono text-xl font-black bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-amber-50/50"
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                Resend in: <strong className="font-mono text-amber-700">{timer}s</strong>
              </span>
              {timer === 0 && (
                <button
                  onClick={handleSendOtp}
                  className="font-bold text-amber-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resend OTP Code</span>
                </button>
              )}
            </div>

            <button
              onClick={handleVerifyOtp}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Verify & Continue</span>
            </button>
          </div>
        )}

        {/* STEP 3: SIGN UP PROFILE SETUP */}
        {step === 'profile' && authMode === 'signup' && (
          <div className="space-y-3 animate-fade-in">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Complete {role === 'pro' ? 'Pro Artisan' : 'Client'} Profile
            </h4>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kwame Mensah"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kwame@fixly.gh"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block">Area / Ghana Post GPS</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="East Legon"
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none"
                  />
                  <input
                    type="text"
                    value={ghanaPostGps}
                    onChange={(e) => setGhanaPostGps(e.target.value)}
                    placeholder="GA-492-3841"
                    className="w-28 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {role === 'pro' && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                  <span className="font-bold text-amber-900 block text-[11px]">Artisan Vetting Details:</span>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block">Primary Trade Craft</label>
                    <select
                      value={trade}
                      onChange={(e) => setTrade(e.target.value)}
                      className="w-full p-2 bg-white border border-amber-200 rounded-lg text-xs font-bold text-slate-800"
                    >
                      <option value="plumbing">Plumbing Services</option>
                      <option value="electrical">Electrical Wiring & Repairs</option>
                      <option value="pop_ceiling">POP Ceiling Design & Repair</option>
                      <option value="painting">Interior & Exterior Painting</option>
                      <option value="carpentry">Carpentry & Cabinetry</option>
                      <option value="ac_repair">Air Conditioning Repair</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block">Ghana Card ID Number</label>
                    <input
                      type="text"
                      value={ghanaCardId}
                      onChange={(e) => setGhanaCardId(e.target.value)}
                      placeholder="GHA-78192048-1"
                      className="w-full p-2 bg-white border border-amber-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleCompleteRegistration}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Complete Fixly Setup & Authenticate</span>
            </button>
          </div>
        )}

        {/* STEP 4: AUTH SUCCESS */}
        {step === 'complete' && (
          <div className="text-center py-6 space-y-3 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Authentication Successful!</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              You are now logged into Fixly Ghana as a <strong>{role === 'pro' ? 'Pro Artisan' : 'Client'}</strong>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
