import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Layers,
  Paintbrush,
  Grid,
  Hammer,
  Droplets,
  Zap,
  ShieldCheck,
  ShieldAlert,
  Maximize2,
  Calendar,
  Clock,
  MapPin,
  Camera,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Coins,
  ChevronRight,
  ChevronDown,
  Info,
  Check,
  ArrowRight,
  ArrowLeft,
  Building2,
  FileText,
} from 'lucide-react';
import { ACCRA_AREAS } from '../../data/catalog';
import { useMarketplace } from '../../context/MarketplaceContext';
import { triggerEscrowUpdatePush, triggerArtisanAcceptedPush } from '../../lib/fcmNotifications';
import { formatCurrency } from '../../lib/currency';

interface ProjectPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: (projectDetails: {
    title: string;
    category: string;
    total: number;
    milestones: any[];
  }) => void;
}

interface ProjectCategoryOption {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  baseRatePerSqm: number;
  materialsPercent: number;
  laborPercent: number;
  color: string;
  bgLight: string;
}

const PROJECT_CATEGORIES: ProjectCategoryOption[] = [
  {
    id: 'pop_ceilings',
    name: 'POP Ceilings & Partitions',
    description: 'Drywall, suspended ceilings, cove lighting niches',
    icon: Sparkles,
    baseRatePerSqm: 68,
    materialsPercent: 55,
    laborPercent: 45,
    color: 'text-indigo-600',
    bgLight: 'bg-indigo-50 border-indigo-200',
  },
  {
    id: 'painting_screeding',
    name: 'Painting & Screeding',
    description: 'Interior & exterior emulsion, texture & damp proofing',
    icon: Paintbrush,
    baseRatePerSqm: 38,
    materialsPercent: 60,
    laborPercent: 40,
    color: 'text-purple-600',
    bgLight: 'bg-purple-50 border-purple-200',
  },
  {
    id: 'tiling_masonry',
    name: 'Tiling & Masonry',
    description: 'Porcelain floor/wall tiles, terrazzo, interlock paving',
    icon: Grid,
    baseRatePerSqm: 56,
    materialsPercent: 65,
    laborPercent: 35,
    color: 'text-blue-600',
    bgLight: 'bg-blue-50 border-blue-200',
  },
  {
    id: 'cabinets_carpentry',
    name: 'Cabinets & Wardrobes',
    description: 'Kitchen joinery, walk-in closets, acoustic panels',
    icon: Hammer,
    baseRatePerSqm: 82,
    materialsPercent: 60,
    laborPercent: 40,
    color: 'text-amber-600',
    bgLight: 'bg-amber-50 border-amber-200',
  },
  {
    id: 'plumbing_fitout',
    name: 'Bathroom Fit-Out & Tanks',
    description: 'Overhead polytanks, booster pumps & sanitary ware',
    icon: Droplets,
    baseRatePerSqm: 64,
    materialsPercent: 70,
    laborPercent: 30,
    color: 'text-teal-600',
    bgLight: 'bg-teal-50 border-teal-200',
  },
  {
    id: 'solar_electrical',
    name: 'Solar & Full Rewiring',
    description: 'Distribution boards, hybrid inverters & battery banks',
    icon: Zap,
    baseRatePerSqm: 95,
    materialsPercent: 75,
    laborPercent: 25,
    color: 'text-yellow-600',
    bgLight: 'bg-yellow-50 border-yellow-200',
  },
  {
    id: 'welding_security',
    name: 'Welding & Automated Gates',
    description: 'Burglar proofing, balustrades & sliding gate motors',
    icon: ShieldAlert,
    baseRatePerSqm: 72,
    materialsPercent: 65,
    laborPercent: 35,
    color: 'text-red-600',
    bgLight: 'bg-red-50 border-red-200',
  },
  {
    id: 'aluminium_glazing',
    name: 'Aluminium & Glass',
    description: 'Sliding windows, frameless shower cubicles, shopfronts',
    icon: Maximize2,
    baseRatePerSqm: 78,
    materialsPercent: 70,
    laborPercent: 30,
    color: 'text-cyan-600',
    bgLight: 'bg-cyan-50 border-cyan-200',
  },
];

export const ProjectPlannerModal: React.FC<ProjectPlannerModalProps> = ({
  isOpen,
  onClose,
  onProjectCreated,
}) => {
  const { createJob } = useMarketplace();

  // Wizard Steps: 1 = Scope & Sizing, 2 = Diagnostic Visit & Photos, 3 = Itemized Quote & Milestones
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [selectedCatId, setSelectedCatId] = useState<string>('pop_ceilings');
  const [spaceType, setSpaceType] = useState('Living & Dining Hall');
  const [approxSqm, setApproxSqm] = useState(48);
  const [finishGrade, setFinishGrade] = useState<'Standard' | 'Executive Silk' | 'Architectural'>('Executive Silk');
  const [inspectionDate, setInspectionDate] = useState('2026-11-08');
  const [inspectionTimeSlot, setInspectionTimeSlot] = useState('Morning (09:00 AM – 12:00 PM)');
  const [selectedArea, setSelectedArea] = useState(ACCRA_AREAS[0]);
  const [landmarkNotes, setLandmarkNotes] = useState('Near American House, blue gate with paved compound');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80',
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedProject, setSubmittedProject] = useState<any | null>(null);

  // Selected Category Info
  const activeCategory = PROJECT_CATEGORIES.find((c) => c.id === selectedCatId) || PROJECT_CATEGORIES[0];

  // Pricing Calculations
  const gradeMultiplier = finishGrade === 'Architectural' ? 1.35 : finishGrade === 'Executive Silk' ? 1.15 : 1.0;
  const rawLaborAndMaterials = Math.round(approxSqm * activeCategory.baseRatePerSqm * gradeMultiplier);
  const materialsCost = Math.round(rawLaborAndMaterials * (activeCategory.materialsPercent / 100));
  const laborCost = Math.round(rawLaborAndMaterials * (activeCategory.laborPercent / 100));
  const escrowProtectionFee = Math.round(rawLaborAndMaterials * 0.03); // 3% escrow protection fee
  const totalProjectCost = rawLaborAndMaterials + escrowProtectionFee;

  // Staged 40/40/20 Milestones
  const milestone1Amount = Math.round(rawLaborAndMaterials * 0.4);
  const milestone2Amount = Math.round(rawLaborAndMaterials * 0.4);
  const milestone3Amount = totalProjectCost - milestone1Amount - milestone2Amount;

  const milestonesList = [
    {
      id: 'm1',
      number: 1,
      title: 'Milestone 1: Mobilization & Surface Prep (40%)',
      description: 'Framing, delivery of certified materials to site, baseline laser levels check.',
      percentage: 40,
      amount: milestone1Amount,
      status: 'pending_funding',
    },
    {
      id: 'm2',
      number: 2,
      title: 'Milestone 2: Core Fixing & Joint Screeding (40%)',
      description: 'Main board fixing, acoustic insulation, joint mesh tapes & preliminary finish.',
      percentage: 40,
      amount: milestone2Amount,
      status: 'upcoming',
    },
    {
      id: 'm3',
      number: 3,
      title: 'Milestone 3: Architectural Finish & Sign-Off (20%)',
      description: 'Final coats, cornice molds, spotlight cutouts, site clean-up and warranty sign-off.',
      percentage: 20,
      amount: milestone3Amount,
      status: 'upcoming',
    },
  ];

  if (!isOpen) return null;

  const handleLaunchProject = async () => {
    setIsSubmitting(true);

    try {
      // 1. Create Job in Marketplace Context
      const newJob = await createJob({
        trade: selectedCatId as any,
        type: 'project',
        title: `${activeCategory.name} - ${spaceType}`,
        description: `${finishGrade} finish for ${approxSqm} sqm in ${selectedArea.name}. Diagnostic visit on ${inspectionDate} (${inspectionTimeSlot}). Staged 40/40/20 escrow milestones.`,
        urgency: 'scheduled',
        scheduledTime: `${inspectionDate} • ${inspectionTimeSlot.split(' ')[0]}`,
        basePrice: rawLaborAndMaterials,
        protectionFee: escrowProtectionFee,
        totalAmount: totalProjectCost,
        location: {
          lat: selectedArea.lat,
          lng: selectedArea.lng,
          address: `${selectedArea.name}, Accra`,
          ghanaPostGps: selectedArea.gpsPrefix,
          landmark: landmarkNotes,
          area: selectedArea.name,
        },
      });

      // 2. Trigger Escrow Funded Push Notification
      await triggerEscrowUpdatePush(
        'escrow_funded',
        milestone1Amount,
        'Milestone 1: Mobilization (40%)',
        newJob.id,
        `${activeCategory.name} (${spaceType})`
      );

      // 3. Schedule simulated artisan acceptance alert in 4 seconds
      setTimeout(() => {
        triggerArtisanAcceptedPush(
          newJob.id,
          `${activeCategory.name} (${spaceType})`,
          'Joseph Boateng (Elite POP Master)',
          `${selectedArea.name} (${selectedArea.gpsPrefix})`
        );
      }, 4000);

      if (onProjectCreated) {
        onProjectCreated({
          title: `${activeCategory.name} - ${spaceType}`,
          category: activeCategory.name,
          total: totalProjectCost,
          milestones: milestonesList,
        });
      }

      setSubmittedProject({
        id: newJob.id,
        title: `${activeCategory.name} - ${spaceType}`,
        area: selectedArea.name,
        gps: selectedArea.gpsPrefix,
        total: totalProjectCost,
        m1: milestone1Amount,
      });
    } catch (err) {
      console.error('Error launching project:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setStep(1);
    setSubmittedProject(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative max-h-[92vh] flex flex-col my-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Layers className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Plan a Project
                </h3>
                <span className="text-[9px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                  PR Flow • Quoted
                </span>
              </div>
              <span className="text-[11px] text-slate-500 block">
                Itemized quotes, Ghana Card masters & 40/40/20 milestone escrow
              </span>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        {!submittedProject && (
          <div className="py-2.5 border-b border-slate-100 shrink-0">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1.5">
              <span className={step >= 1 ? 'text-purple-600' : 'text-slate-400'}>
                1. Trade & Scope
              </span>
              <span className={step >= 2 ? 'text-purple-600' : 'text-slate-400'}>
                2. Diagnostic Visit
              </span>
              <span className={step >= 3 ? 'text-purple-600' : 'text-slate-400'}>
                3. Quote & Escrow
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
              <div
                className="bg-purple-600 h-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
          {submittedProject ? (
            /* Success Confirmation Screen */
            <div className="text-center py-6 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Project Contract Initiated!
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Your project for <span className="font-bold text-slate-800">{submittedProject.title}</span> has been dispatched to Ghana Card verified master artisans.
                </p>
              </div>

              {/* Escrow Deposit Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left max-w-md mx-auto space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-700">Project Contract ID:</span>
                  <span className="font-mono text-xs font-extrabold text-purple-700">
                    {submittedProject.id.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Site Location:</span>
                  <span className="font-medium text-slate-900">
                    {submittedProject.area} ({submittedProject.gps})
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Total Project Value:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatCurrency(submittedProject.total)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    Milestone 1 Funded in Escrow:
                  </span>
                  <span className="font-mono font-extrabold text-emerald-800 text-sm">
                    {formatCurrency(submittedProject.m1)}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-left max-w-md mx-auto flex items-start gap-2.5">
                <Coins className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-blue-900 leading-snug">
                  <strong>40/40/20 Escrow Safety:</strong> Your funds will only be disbursed when you inspect the artisan’s photo proofs at each milestone and tap approve.
                </p>
              </div>

              <button
                onClick={handleResetAndClose}
                className="w-full max-w-md py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
              >
                Done & View Active Projects
              </button>
            </div>
          ) : step === 1 ? (
            /* STEP 1: Trade Category & Sizing */
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider mb-2">
                  Select Project Trade:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PROJECT_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = selectedCatId === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCatId(cat.id)}
                        className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'border-purple-600 bg-purple-50 ring-1 ring-purple-600 shadow-2xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${cat.color}`} />
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {cat.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-1 line-clamp-1 leading-tight">
                          {cat.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Space Target & Sqm */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Room / Space Target:
                  </label>
                  <select
                    value={spaceType}
                    onChange={(e) => setSpaceType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    <option value="Living & Dining Hall">Living & Dining Hall</option>
                    <option value="Master Bedroom Suite">Master Bedroom Suite</option>
                    <option value="Full 3-Bed Apartment">Full 3-Bed Apartment</option>
                    <option value="Commercial Shopfront / Office">Commercial Shopfront / Office</option>
                    <option value="Perimeter Wall & Compound">Perimeter Wall & Compound</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Approx. Size:
                    </label>
                    <span className="font-mono text-xs font-extrabold text-purple-700">
                      {approxSqm} sqm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="250"
                    step="5"
                    value={approxSqm}
                    onChange={(e) => setApproxSqm(parseInt(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer mt-2"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-0.5">
                    <span>15 sqm</span>
                    <span>120 sqm</span>
                    <span>250 sqm</span>
                  </div>
                </div>
              </div>

              {/* Finish Grade Quality */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Finish Grade & Material Spec:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { grade: 'Standard' as const, label: 'Standard Utility', desc: 'Certified local materials' },
                    { grade: 'Executive Silk' as const, label: 'Executive Silk', desc: 'Smooth skim & premium finish' },
                    { grade: 'Architectural' as const, label: 'Architectural', desc: 'Luxury bespoke import grade' },
                  ].map((g) => (
                    <button
                      key={g.grade}
                      type="button"
                      onClick={() => setFinishGrade(g.grade)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        finishGrade === g.grade
                          ? 'border-purple-600 bg-purple-50 ring-1 ring-purple-600'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-900 block truncate">
                        {g.label}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5 leading-tight">
                        {g.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Cost Estimate Preview */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                    Estimated Budget Bracket
                  </span>
                  <span className="text-base font-extrabold text-slate-900 font-mono">
                    {formatCurrency(totalProjectCost * 0.95)} – {formatCurrency(totalProjectCost * 1.08)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-purple-700 font-bold block bg-purple-100 px-2 py-0.5 rounded-full">
                    40/40/20 Staged Escrow
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Includes 3% Fixly Protection
                  </span>
                </div>
              </div>
            </div>
          ) : step === 2 ? (
            /* STEP 2: Diagnostic Site Inspection & Photos */
            <div className="space-y-4">
              {/* Site Location Selector */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Accra Service Area & GhanaPost GPS:</span>
                  </span>
                  <span className="font-mono text-[11px] text-purple-700 font-bold">
                    {selectedArea.gpsPrefix}
                  </span>
                </div>
                <select
                  value={selectedArea.name}
                  onChange={(e) => {
                    const found = ACCRA_AREAS.find((a) => a.name === e.target.value);
                    if (found) setSelectedArea(found);
                  }}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                >
                  {ACCRA_AREAS.map((a) => (
                    <option key={a.name} value={a.name}>
                      {a.name} ({a.gpsPrefix})
                    </option>
                  ))}
                </select>

                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">
                    Landmark / Access Directions:
                  </label>
                  <input
                    type="text"
                    value={landmarkNotes}
                    onChange={(e) => setLandmarkNotes(e.target.value)}
                    placeholder="e.g. Opposite shell filling station, green gate"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Inspection Date & Slot */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Preferred Visit Date:
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={inspectionDate}
                      onChange={(e) => setInspectionDate(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Visit Time Slot:
                  </label>
                  <select
                    value={inspectionTimeSlot}
                    onChange={(e) => setInspectionTimeSlot(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    <option value="Morning (09:00 AM – 12:00 PM)">Morning (09:00 AM – 12:00 PM)</option>
                    <option value="Afternoon (01:00 PM – 04:00 PM)">Afternoon (01:00 PM – 04:00 PM)</option>
                    <option value="Weekend (Saturday Morning)">Weekend (Saturday Morning)</option>
                  </select>
                </div>
              </div>

              {/* Site Photos & Floorplans Upload */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Room Photos or Architectural Floorplans (Optional):
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {uploadedPhotos.map((img, idx) => (
                    <div
                      key={idx}
                      className="h-20 rounded-xl overflow-hidden border border-slate-200 relative group"
                    >
                      <img src={img} alt="Site" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setUploadedPhotos((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <div
                    onClick={() => {
                      setUploadedPhotos((prev) => [
                        ...prev,
                        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
                      ]);
                    }}
                    className="h-20 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-purple-400 hover:text-purple-600 cursor-pointer transition-colors"
                  >
                    <UploadCloud className="w-5 h-5 mb-0.5" />
                    <span className="text-[10px] font-bold">Add Photo</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">
                  Uploading site photos allows artisans to provide accurate initial material quotes before visiting.
                </span>
              </div>
            </div>
          ) : (
            /* STEP 3: Itemized Quote & 40/40/20 Staged Escrow Contract */
            <div className="space-y-4">
              {/* Itemized Cost Breakdown Card */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-extrabold text-slate-900">
                    Transparent Itemized Quote
                  </span>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                    {approxSqm} sqm • {finishGrade}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      Materials Staging ({activeCategory.materialsPercent}%)
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {formatCurrency(materialsCost)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Verified Master Artisan Labor ({activeCategory.laborPercent}%)
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {formatCurrency(laborCost)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Fixly Escrow Protection & Guarantor Fee (3%)
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {formatCurrency(escrowProtectionFee)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-sm font-extrabold text-slate-900">
                    <span>Total Project Escrow:</span>
                    <span className="font-mono text-purple-700">
                      {formatCurrency(totalProjectCost)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 40/40/20 Staged Milestone Schedule */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Ghana 40/40/20 Milestone Escrow Schedule:
                  </label>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Zero Risk Escrow
                  </span>
                </div>

                <div className="space-y-2">
                  {milestonesList.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 bg-white border border-slate-200 rounded-2xl flex items-start justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {m.number}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{m.title}</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                            {m.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono text-xs font-extrabold text-slate-900 block">
                          {formatCurrency(m.amount)}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 block mt-0.5">
                          {m.percentage}% of project
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Matched Lead Artisan Profile Card */}
              <div className="p-3.5 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
                    JB
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900">Joseph Boateng</h4>
                      <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                        Ghana Card Verified
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Elite Master • 112 Projects in East Legon & Cantonments • ⭐4.95
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Controls */}
        {!submittedProject && (
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                Cancel
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev + 1) as any)}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleLaunchProject}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isSubmitting ? 'Funding Escrow...' : `Fund Milestone 1 (${formatCurrency(milestone1Amount)}) & Start`}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
