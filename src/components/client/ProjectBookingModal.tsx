import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useLanguage } from '../../context/LanguageContext';
import { usePreventScroll } from '../../hooks/usePreventScroll';
import { ACCRA_AREAS, INITIAL_PROS } from '../../data/catalog';
import { TradeType, ProjectMilestone } from '../../types';
import {
  X,
  Sparkles,
  Paintbrush,
  Grid3X3,
  Armchair,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  MapPin,
  Calendar,
} from 'lucide-react';

interface ProjectBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTrade?: TradeType;
  onJobCreated: (jobId: string) => void;
}

export const ProjectBookingModal: React.FC<ProjectBookingModalProps> = ({
  isOpen,
  onClose,
  defaultTrade = 'pop_ceilings',
  onJobCreated,
}) => {
  const { createJob } = useMarketplace();
  const { t } = useLanguage();
  usePreventScroll(isOpen);

  const [trade, setTrade] = useState<TradeType>(defaultTrade);
  const [roomType, setRoomType] = useState('Living & Dining Room');
  const [approxSqm, setApproxSqm] = useState(55);
  const [selectedArea, setSelectedArea] = useState(ACCRA_AREAS[0]);
  const [finishGrade, setFinishGrade] = useState<'Standard' | 'Luxury Silk' | 'Architectural'>('Luxury Silk');
  const [selectedProId, setSelectedProId] = useState(INITIAL_PROS[2].id); // Joseph Boateng (POP Elite)

  if (!isOpen) return null;

  const getEstimatedBase = () => {
    switch (trade) {
      case 'pop_ceilings':
        return approxSqm * 65; // ~GH₵3,575
      case 'painting':
        return approxSqm * 38; // ~GH₵2,090
      case 'tiling':
        return approxSqm * 55; // ~GH₵3,025
      case 'upholstery':
        return 1950;
      default:
        return approxSqm * 50;
    }
  };

  const estimatedBase = getEstimatedBase();
  const protectionFee = Math.round(estimatedBase * 0.03); // 3% protection fee for project tier
  const totalAmount = estimatedBase + protectionFee;

  const milestones: ProjectMilestone[] = [
    {
      id: 'ms-1',
      title: 'Milestone 1: Surface Prep & Metal Framing (40%)',
      percentage: 40,
      amount: Math.round(estimatedBase * 0.4),
      status: 'pending',
    },
    {
      id: 'ms-2',
      title: 'Milestone 2: Main Board Fixing & Joint Plaster (40%)',
      percentage: 40,
      amount: Math.round(estimatedBase * 0.4),
      status: 'pending',
    },
    {
      id: 'ms-3',
      title: 'Milestone 3: Final Finish, Cornice & Lighting Cutout (20%)',
      percentage: 20,
      amount: Math.round(estimatedBase * 0.2),
      status: 'pending',
    },
  ];

  const handleCreateProject = async () => {
    const tradeLabels: Record<string, string> = {
      pop_ceilings: 'POP False Ceiling & Cove Lighting',
      painting: 'Full Interior Apartment Painting',
      tiling: 'Porcelain Floor & Bathroom Tiling',
      upholstery: 'Living Room Sofa Reupholstery',
    };

    const newJob = await createJob({
      trade,
      type: 'project',
      title: `${tradeLabels[trade] || 'Project'} (${approxSqm} sqm)`,
      description: `${finishGrade} finish in ${roomType}. Includes labor, materials staged into 3 photo-verified milestones.`,
      urgency: 'scheduled',
      scheduledTime: '2026-11-08',
      basePrice: estimatedBase,
      protectionFee,
      totalAmount,
      milestones,
      location: {
        lat: selectedArea.lat,
        lng: selectedArea.lng,
        address: `${selectedArea.name}, Accra`,
        ghanaPostGps: selectedArea.gpsPrefix,
        landmark: selectedArea.defaultLandmark,
        area: selectedArea.name,
      },
    });

    onJobCreated(newJob.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Plan a Project Service</h2>
            <span className="text-[11px] text-slate-500">
              Milestone Escrow (40/40/20) · Photo Sign-Offs
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Trade Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider mb-2">
              Select Project Trade:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTrade('pop_ceilings')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  trade === 'pop_ceilings'
                    ? 'border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">POP Ceilings</span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">Cove lighting & designs</span>
              </button>

              <button
                onClick={() => setTrade('painting')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  trade === 'painting'
                    ? 'border-purple-600 bg-purple-50 ring-1 ring-purple-600'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Paintbrush className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-bold text-slate-900">Full Painting</span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">Screeding & emulsion</span>
              </button>

              <button
                onClick={() => setTrade('tiling')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  trade === 'tiling'
                    ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-900">Floor & Wall Tiling</span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">Porcelain & granite</span>
              </button>

              <button
                onClick={() => setTrade('upholstery')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  trade === 'upholstery'
                    ? 'border-rose-600 bg-rose-50 ring-1 ring-rose-600'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Armchair className="w-4 h-4 text-rose-600" />
                  <span className="text-xs font-bold text-slate-900">Sofa Upholstery</span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">Foam & fabric refresh</span>
              </button>
            </div>
          </div>

          {/* Measurements */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Room / Area Target</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
              >
                <option value="Living & Dining Room">Living & Dining Room</option>
                <option value="Master Bedroom Suite">Master Bedroom Suite</option>
                <option value="Full 3-Bedroom Apartment">Full 3-Bedroom Apartment</option>
                <option value="Commercial Office Space">Commercial Office Space</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Estimated Size (Sqm)</label>
              <input
                type="number"
                value={approxSqm}
                onChange={(e) => setApproxSqm(Math.max(10, parseInt(e.target.value) || 10))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Service Location in Accra with Word Wrap */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 overflow-hidden">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Project Location:</span>
              </span>
              <span className="font-mono text-[11px] text-slate-500 break-all">
                {selectedArea.gpsPrefix}
              </span>
            </div>
            <select
              value={selectedArea.name}
              onChange={(e) => {
                const found = ACCRA_AREAS.find((a) => a.name === e.target.value);
                if (found) setSelectedArea(found);
              }}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none break-words"
            >
              {ACCRA_AREAS.map((a) => (
                <option key={a.name} value={a.name}>
                  {a.name} ({a.gpsPrefix})
                </option>
              ))}
            </select>
          </div>

          {/* Staged Milestone Escrow Schedule Preview */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">
                Staged Milestone Schedule
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                Escrow Protected
              </span>
            </div>

            <div className="space-y-1.5">
              {milestones.map((ms, idx) => (
                <div
                  key={ms.id}
                  className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-slate-800">{ms.title}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    GH₵ {ms.amount}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-500 pt-1">
              Funds for each milestone stay in escrow until the artisan uploads proof photos and you tap approve.
            </p>
          </div>

          {/* Vetted Artisan Profile Match */}
          <div>
            <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider mb-1.5">
              Matched Lead Project Artisan:
            </label>
            <div className="p-3.5 rounded-xl border border-emerald-500 bg-emerald-50/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                  JB
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900">Joseph Boateng</h4>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                      Elite Tier
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span>Ghana Card Verified</span>
                    <span>·</span>
                    <span>GH₵15,000 Claim Limit</span>
                    <span>·</span>
                    <span>112 Projects</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">Total Project Escrow:</span>
            <span className="font-mono text-base font-extrabold text-slate-900">
              GH₵ {totalAmount}.00
            </span>
            <span className="text-[10px] text-emerald-700 font-bold block">
              Includes GH₵ {protectionFee}.00 Escrow & Guarantor Cover
            </span>
          </div>

          <button
            onClick={handleCreateProject}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Fund First Milestone & Start</span>
          </button>
        </div>
      </div>
    </div>
  );
};
