import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  CreditCard,
  Smartphone,
  ChevronRight,
  Check,
  Plus,
  Trash2,
  Edit2,
  ShieldCheck,
  X,
  Lock,
  Building2,
  AlertCircle,
  Star,
  Camera,
  Coins,
  Sparkles,
} from 'lucide-react';
import { BottomNavBar } from './BottomNavBar';
import { BottomTabId } from './types';
import { triggerEscrowUpdatePush } from '../../lib/fcmNotifications';
import { formatCurrency } from '../../lib/currency';
import { CurrencyConverter } from '../common/CurrencyConverter';

export interface WalletPaymentMethod {
  id: string;
  type: 'momo' | 'card';
  provider: 'MTN MoMo' | 'Telecel Cash' | 'AT Money' | 'Visa' | 'Mastercard' | 'Gh-Link';
  label: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
  expiry?: string;
}

interface Screen6WalletProps {
  onOpenNotifications?: () => void;
  onOpenReferralModal?: () => void;
  onTabChange: (tab: BottomTabId) => void;
}

export const Screen6Wallet: React.FC<Screen6WalletProps> = ({
  onOpenNotifications,
  onOpenReferralModal,
  onTabChange,
}) => {
  const [balance, setBalance] = useState(250.0);
  const [selectedFund, setSelectedFund] = useState<number | null>(null);
  const [justAddedAmount, setJustAddedAmount] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [milestone1Released, setMilestone1Released] = useState(false);
  const [showFxConverterModal, setShowFxConverterModal] = useState(false);

  const handleReleaseMilestone = async () => {
    setMilestone1Released(true);
    showToast(`Milestone 1 (${formatCurrency(1430)}) released to artisan MoMo!`);
    await triggerEscrowUpdatePush(
      'escrow_milestone_released',
      1430,
      'Milestone 1: Surface Prep & Framing (40%)',
      'PRJ-302',
      'POP False Ceiling Renovation'
    );
  };

  // Saved Payment Methods State
  const [paymentMethods, setPaymentMethods] = useState<WalletPaymentMethod[]>([
    {
      id: 'pm-1',
      type: 'momo',
      provider: 'MTN MoMo',
      label: 'MTN Mobile Money',
      accountNumber: '+233 24 412 8891',
      accountName: 'Maya Johnson',
      isDefault: true,
    },
    {
      id: 'pm-2',
      type: 'momo',
      provider: 'Telecel Cash',
      label: 'Telecel Cash (Vodafone)',
      accountNumber: '+233 20 882 1109',
      accountName: 'Maya Johnson',
      isDefault: false,
    },
    {
      id: 'pm-3',
      type: 'card',
      provider: 'Visa',
      label: 'Visa Debit Card',
      accountNumber: '•••• 4242',
      accountName: 'Maya Johnson',
      expiry: '09/28',
      isDefault: false,
    },
  ]);

  // Modal State for Add / Edit
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<WalletPaymentMethod | null>(null);

  // Form Fields
  const [formType, setFormType] = useState<'momo' | 'card'>('momo');
  const [formProvider, setFormProvider] = useState<WalletPaymentMethod['provider']>('MTN MoMo');
  const [formNumber, setFormNumber] = useState('');
  const [formAccountName, setFormAccountName] = useState('');
  const [formExpiry, setFormExpiry] = useState('');
  const [formCvv, setFormCvv] = useState('');
  const [formSetDefault, setFormSetDefault] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fundOptions = [50.0, 100.0, 200.0, 500.0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddFund = (amt: number) => {
    setSelectedFund(amt);
    setBalance((prev) => prev + amt);
    setJustAddedAmount(amt);
    showToast(`Added ${formatCurrency(amt)} to Fixly Wallet via Default Payment Method`);
    setTimeout(() => {
      setJustAddedAmount(null);
    }, 2200);
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => ({
        ...pm,
        isDefault: pm.id === id,
      }))
    );
    showToast('Default payment method updated.');
  };

  const handleOpenAddModal = () => {
    setEditingMethod(null);
    setFormType('momo');
    setFormProvider('MTN MoMo');
    setFormNumber('');
    setFormAccountName('Maya Johnson');
    setFormExpiry('');
    setFormCvv('');
    setFormSetDefault(false);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (pm: WalletPaymentMethod) => {
    setEditingMethod(pm);
    setFormType(pm.type);
    setFormProvider(pm.provider);
    setFormNumber(pm.accountNumber);
    setFormAccountName(pm.accountName);
    setFormExpiry(pm.expiry || '');
    setFormCvv('');
    setFormSetDefault(pm.isDefault);
    setIsAddEditModalOpen(true);
  };

  const handleDeleteMethod = (id: string) => {
    if (paymentMethods.length <= 1) {
      showToast('You must keep at least one active payment method.');
      setDeleteConfirmId(null);
      return;
    }
    const toDelete = paymentMethods.find((p) => p.id === id);
    setPaymentMethods((prev) => {
      const filtered = prev.filter((pm) => pm.id !== id);
      if (toDelete?.isDefault && filtered.length > 0) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
    setDeleteConfirmId(null);
    showToast('Payment method removed.');
  };

  const handleSavePaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNumber.trim()) {
      showToast('Please enter an account number or phone number.');
      return;
    }

    if (editingMethod) {
      // Edit existing
      setPaymentMethods((prev) =>
        prev.map((pm) => {
          if (pm.id === editingMethod.id) {
            return {
              ...pm,
              provider: formProvider,
              type: formType,
              accountNumber: formNumber,
              accountName: formAccountName,
              expiry: formType === 'card' ? formExpiry : undefined,
              isDefault: formSetDefault ? true : pm.isDefault,
            };
          }
          return formSetDefault ? { ...pm, isDefault: false } : pm;
        })
      );
      showToast('Payment method details updated.');
    } else {
      // Create new
      const newId = `pm-${Date.now()}`;
      const newMethod: WalletPaymentMethod = {
        id: newId,
        type: formType,
        provider: formProvider,
        label:
          formType === 'momo'
            ? formProvider
            : `${formProvider} Card`,
        accountNumber:
          formType === 'card' && !formNumber.startsWith('••••')
            ? `•••• ${formNumber.slice(-4)}`
            : formNumber,
        accountName: formAccountName || 'Maya Johnson',
        expiry: formType === 'card' ? formExpiry || '12/28' : undefined,
        isDefault: formSetDefault || paymentMethods.length === 0,
      };

      setPaymentMethods((prev) => {
        let list = formSetDefault ? prev.map((p) => ({ ...p, isDefault: false })) : [...prev];
        return [...list, newMethod];
      });
      showToast(`${formProvider} added to your payment methods.`);
    }

    setIsAddEditModalOpen(false);
  };

  const getProviderIcon = (provider: WalletPaymentMethod['provider']) => {
    switch (provider) {
      case 'MTN MoMo':
        return (
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-900 font-black text-[11px] flex items-center justify-center shadow-2xs shrink-0">
            MTN
          </div>
        );
      case 'Telecel Cash':
        return (
          <div className="w-9 h-9 rounded-xl bg-red-600 text-white font-black text-[10px] flex items-center justify-center shadow-2xs shrink-0">
            TC
          </div>
        );
      case 'AT Money':
        return (
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-[10px] flex items-center justify-center shadow-2xs shrink-0">
            AT
          </div>
        );
      case 'Visa':
      case 'Mastercard':
      case 'Gh-Link':
      default:
        return (
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-2xs shrink-0">
            <CreditCard className="w-4 h-4 stroke-[2]" />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F4F5F8] text-slate-900 select-none">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-7 pb-5 space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-normal text-slate-400 block tracking-tight">
              Wallet & Escrow Balance
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Payment & MoMo Methods
            </h1>
          </div>
          <button
            onClick={onOpenNotifications}
            className="w-10 h-10 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-700 stroke-[1.8]" />
          </button>
        </div>

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="p-3 bg-slate-900 text-white text-xs font-bold rounded-2xl flex items-center justify-between shadow-lg animate-slide-down">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">SECURE</span>
          </div>
        )}

        {/* Royal Blue Balance Card */}
        <div className="bg-[#1E5BF0] text-white rounded-2xl p-4.5 shadow-sm space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-100 font-medium tracking-tight">
              Available Escrow Wallet
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowFxConverterModal(true)}
                className="bg-white/20 hover:bg-white/30 text-white font-bold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>USD ↔ GHS FX Calculator</span>
              </button>
            </div>
          </div>

          <div className="pt-1">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              {formatCurrency(balance)}
            </h2>
            <p className="text-[11px] text-blue-100 font-normal mt-1 tracking-tight">
              Instant authorization for artisan visits & quote approvals
            </p>
          </div>

          {justAddedAmount && (
            <div className="absolute right-4 bottom-3 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full animate-fade-in flex items-center gap-1 shadow-sm">
              <Check className="w-3 h-3" />
              <span>+{formatCurrency(justAddedAmount)} Added!</span>
            </div>
          )}
        </div>

        {/* SECTION: ACTIVE PROJECT ESCROW LOCKS & MILESTONES */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-600" />
                Active Project Escrow Locks (40/40/20)
              </h3>
              <span className="text-[11px] text-slate-400">
                Staged funds held safely until your inspection & photo approval
              </span>
            </div>
            <span className="text-[10px] font-mono font-extrabold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
              {formatCurrency(1430)} Locked
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-purple-200/90 p-4 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full inline-block mb-1">
                  Project #PRJ-302 • POP False Ceiling
                </span>
                <h4 className="text-xs font-bold text-slate-900">
                  Living & Dining Hall (48 sqm)
                </h4>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Artisan: Joseph Boateng (⭐4.95 Elite Master • Ghana Card Verified)
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 block">Milestone 1 of 3</span>
                <span className="font-mono text-xs font-extrabold text-slate-900">{formatCurrency(1430)}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Stage 1: Surface Prep & Metal Framing</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  milestone1Released
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {milestone1Released ? 'Approved & Released' : 'Inspection Photos Ready'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                <span className="flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-purple-600" />
                  2 verified site photos uploaded
                </span>
                <span className="font-mono text-purple-700 font-bold">40% Payout</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              {milestone1Released ? (
                <div className="w-full py-2 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl text-center border border-emerald-200 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Disbursed to Artisan MoMo (+233 24 551 8840)</span>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleReleaseMilestone}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Approve & Release Milestone 1 ({formatCurrency(1430)})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Revision requested. Artisan notified via SMS.')}
                    className="px-3 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
                  >
                    Request Snag Fix
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* SECTION: MANAGE PAYMENT METHODS */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 tracking-tight">
                Manage Payment Methods
              </h3>
              <span className="text-[11px] text-slate-400">
                Ghanaian Mobile Money (MTN, Telecel) & Bank Cards
              </span>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="px-3 py-1.5 bg-[#1E5BF0] hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Method</span>
            </button>
          </div>

          {/* Interactive Methods List */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {paymentMethods.map((pm) => (
              <div
                key={pm.id}
                className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {getProviderIcon(pm.provider)}

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 tracking-tight truncate">
                        {pm.provider}
                      </span>
                      {pm.isDefault ? (
                        <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full uppercase tracking-wider border border-emerald-200">
                          DEFAULT
                        </span>
                      ) : null}
                    </div>

                    <span className="text-[11px] font-mono text-slate-600 block mt-0.5">
                      {pm.accountNumber}
                    </span>

                    <span className="text-[10px] text-slate-400 block">
                      {pm.accountName} {pm.expiry ? `• Exp ${pm.expiry}` : '• Verified Ghana MoMo'}
                    </span>
                  </div>
                </div>

                {/* Method Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {!pm.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(pm.id)}
                      className="px-2 py-1 text-[11px] font-semibold text-slate-600 hover:text-[#1E5BF0] hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                      title="Set as Default"
                    >
                      Set Default
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(pm)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                    title="Edit method"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(pm.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                    title="Remove method"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Add funds */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">
              Pre-fund Escrow Wallet
            </h3>
            <span className="text-[11px] text-slate-400">Direct debit from default method</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {fundOptions.map((amt) => {
              const isSelected = selectedFund === amt;
              return (
                <div
                  key={amt}
                  onClick={() => handleAddFund(amt)}
                  className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors group"
                >
                  <span className="text-xs font-semibold text-slate-800 tracking-tight">
                    {formatCurrency(amt)}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'text-[#1E5BF0]'
                        : 'text-slate-300 group-hover:text-slate-400'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[2]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Escrow Guarantee Trust Banner */}
        <div className="p-3 bg-emerald-50/70 border border-emerald-200/70 rounded-2xl flex items-center gap-3 text-xs text-emerald-950">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <strong className="block font-bold">Safe Payment Guarantee</strong>
            <span className="text-[11px] text-emerald-800">
              Payments are never transferred to artisans until physical inspection & sign-off.
            </span>
          </div>
        </div>

        {/* Royal Blue Banner: Invite friends */}
        <div
          onClick={() => (onOpenReferralModal ? onOpenReferralModal() : null)}
          className="bg-[#1E5BF0] text-white rounded-2xl p-4.5 cursor-pointer hover:opacity-98 transition-all shadow-sm relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Invite friends & get {formatCurrency(25)}
            </h3>
            <span className="bg-white/20 text-white font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
              INVITE CODE
            </span>
          </div>

          <p className="text-xs text-blue-100 font-medium mt-1 leading-snug">
            Give {formatCurrency(25)}, Get {formatCurrency(25)} wallet credit
          </p>

          <p className="text-[10px] text-blue-200/90 font-normal mt-3 tracking-tight">
            Verified pros • fast booking • clear pricing
          </p>
        </div>
      </div>

      {/* FX CURRENCY CONVERTER MODAL */}
      {showFxConverterModal && (
        <CurrencyConverter
          isOpen={showFxConverterModal}
          onClose={() => setShowFxConverterModal(false)}
          initialAmountUsd={50}
          onSelectGhsAmount={(ghsAmt) => {
            handleAddFund(Math.round(ghsAmt));
            setShowFxConverterModal(false);
          }}
        />
      )}

      {/* MODAL: ADD / EDIT PAYMENT METHOD */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
                </h3>
                <span className="text-[11px] text-slate-500">
                  Secure Ghanaian MoMo & Card Gateway
                </span>
              </div>
              <button
                onClick={() => setIsAddEditModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Method Type Selector (MoMo vs Card) */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setFormType('momo');
                  setFormProvider('MTN MoMo');
                }}
                className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  formType === 'momo'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile Money</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormType('card');
                  setFormProvider('Visa');
                }}
                className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  formType === 'card'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Debit / Credit Card</span>
              </button>
            </div>

            <form onSubmit={handleSavePaymentMethod} className="space-y-3.5">
              {formType === 'momo' ? (
                /* MOMO FORM */
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Mobile Money Network
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'MTN MoMo', label: 'MTN MoMo' },
                        { id: 'Telecel Cash', label: 'Telecel Cash' },
                        { id: 'AT Money', label: 'AT Money' },
                      ].map((net) => (
                        <button
                          key={net.id}
                          type="button"
                          onClick={() => setFormProvider(net.id as any)}
                          className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                            formProvider === net.id
                              ? 'border-[#1E5BF0] bg-blue-50 text-[#1E5BF0] ring-1 ring-blue-500'
                              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {net.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Phone Number (Ghana +233)
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +233 24 412 8891 or 0244128891"
                      value={formNumber}
                      onChange={(e) => setFormNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Registered Name on Account
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maya Johnson"
                      value={formAccountName}
                      onChange={(e) => setFormAccountName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </>
              ) : (
                /* CARD FORM */
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Card Network
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Visa', 'Mastercard', 'Gh-Link'].map((net) => (
                        <button
                          key={net}
                          type="button"
                          onClick={() => setFormProvider(net as any)}
                          className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                            formProvider === net
                              ? 'border-[#1E5BF0] bg-blue-50 text-[#1E5BF0] ring-1 ring-blue-500'
                              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {net}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="4242 4242 4242 4242"
                      value={formNumber}
                      onChange={(e) => setFormNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        placeholder="08/28"
                        value={formExpiry}
                        onChange={(e) => setFormExpiry(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="123"
                        value={formCvv}
                        onChange={(e) => setFormCvv(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maya Johnson"
                      value={formAccountName}
                      onChange={(e) => setFormAccountName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </>
              )}

              {/* Set as Default Checkbox */}
              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formSetDefault}
                  onChange={(e) => setFormSetDefault(e.target.checked)}
                  className="rounded text-[#1E5BF0] focus:ring-blue-500 w-4 h-4"
                />
                <span className="text-xs text-slate-700 font-medium">
                  Set as default payment method for all bookings
                </span>
              </label>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1E5BF0] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
                >
                  {editingMethod ? 'Save Changes' : 'Add Payment Method'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
              <AlertCircle className="w-5 h-5" />
              <span>Remove Payment Method?</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to remove this payment method from your Fixly wallet?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Keep Method
              </button>
              <button
                type="button"
                onClick={() => handleDeleteMethod(deleteConfirmId)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavBar activeTab="wallet" onTabChange={onTabChange} />
    </div>
  );
};

