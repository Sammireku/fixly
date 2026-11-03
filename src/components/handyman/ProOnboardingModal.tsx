import React, { useState } from 'react';
import {
  X,
  Wrench,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Check,
  Smartphone,
  UploadCloud,
  FileCheck,
  RotateCcw,
  Sparkles,
  Zap,
  Droplets,
  Lightbulb,
  Fan,
  Paintbrush,
  Tv,
  Hammer,
  Grid,
  Home,
  Shield,
  Maximize2,
  Armchair,
  Flower2,
  Shirt,
  Camera,
  Truck,
  Car,
} from 'lucide-react';
import { SkillTestQuestion, UserProfile, ProProfileDetails } from './types';
import { GhanaCardBadge } from './GhanaCardBadge';

interface ProOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onCompleteOnboarding: (proDetails: ProProfileDetails) => void;
}

const FIELD_SERVICES: Record<string, { label: string; icon: any; services: string[] }> = {
  Plumbing: {
    label: 'Plumbing & Water',
    icon: Droplets,
    services: [
      'Leaks & Pipe Repairs',
      'Faucet & Valve Replacement',
      'Water Heater Service',
      'Drain & Toilet Unclogging',
      'Polytank & Pump Setup',
    ],
  },
  Electrical: {
    label: 'Electrical Services',
    icon: Lightbulb,
    services: [
      'Circuit Breakers & Load Test',
      'Generator Changeover Switch',
      'Ceiling Fans & Lighting Fit',
      'Solar Panel & Inverter Setup',
    ],
  },
  Appliance: {
    label: 'Appliance & Equipment',
    icon: Tv,
    services: [
      'Split Unit AC Service',
      'Refrigerator & Freezer Repair',
      'Washing Machine Fix',
      'TV Mounting & Decoders',
    ],
  },
  Carpentry: {
    label: 'Carpentry & Woodwork',
    icon: Hammer,
    services: [
      'Door Locks & Hinges',
      'Kitchen Cabinet Making',
      'Wardrobes & Shelving',
      'Flat-Pack Assembly',
    ],
  },
  CeilingsWalls: {
    label: 'Ceilings & Walls',
    icon: Paintbrush,
    services: [
      'POP False Ceiling',
      'Interior Room Painting',
      'Drywall Partitions',
      'Damp & Crack Repair',
    ],
  },
  TilingMasonry: {
    label: 'Tiling & Masonry',
    icon: Grid,
    services: [
      'Porcelain Floor Tiling',
      'Wall Tile Regrouting',
      'Compound Interlock Paving',
      'Block & Brick Work',
    ],
  },
  Roofing: {
    label: 'Roofing Services',
    icon: Home,
    services: [
      'Roof Leak Flashing Repair',
      'Roofing Sheet Swap',
      'Rain Gutters & Downpipes',
      'Fascia Board Work',
    ],
  },
  Welding: {
    label: 'Welding & Metalwork',
    icon: Shield,
    services: [
      'Burglar-Proof Window Guards',
      'Security Gates & Doors',
      'Carport Frames',
      'Steel Tank Stands',
    ],
  },
  AluminiumGlass: {
    label: 'Aluminium & Glass',
    icon: Maximize2,
    services: [
      'Aluminium Sliding Doors',
      'Glass Replacement',
      'Shower Enclosures',
      'Mosquito Netting',
    ],
  },
  Upholstery: {
    label: 'Upholstery & Furniture',
    icon: Armchair,
    services: [
      'Sofa Reupholstery',
      'Dining Chair Cushion Recover',
      'Curtains & Soft Drapes',
      'Furniture Polishing',
    ],
  },
  Gardening: {
    label: 'Gardening & Outdoor',
    icon: Flower2,
    services: [
      'Lawn Mowing & Edging',
      'Hedge & Shrub Trimming',
      'Tree Pruning',
      'Artificial Turf Laying',
    ],
  },
  Cleaning: {
    label: 'Cleaning & Fumigation',
    icon: Sparkles,
    services: [
      'House Deep Clean',
      'Sofa & Carpet Wash',
      'Post-Construction Cleanup',
      'Pest Fumigation',
    ],
  },
  Laundry: {
    label: 'Laundry & Garment Care',
    icon: Shirt,
    services: [
      'Doorstep Wash & Fold',
      'Steam Press & Ironing',
      'Dry Cleaning Services',
      'Clothing Alterations',
    ],
  },
  Security: {
    label: 'Security & Smart Home',
    icon: Camera,
    services: [
      '4-Camera CCTV Setup',
      'Electric Fence Installation',
      'Smart Lock Fitting',
      'Intercom & Doorbell',
    ],
  },
  Moving: {
    label: 'Moving & Heavy Work',
    icon: Truck,
    services: [
      'Home & Office Moving',
      'Junk & Waste Haulage',
      'Furniture Lifting',
      'Material Offloading',
    ],
  },
  Handyman: {
    label: 'General Handyman',
    icon: Wrench,
    services: [
      'Picture & Mirror Hanging',
      'Curtain Rail Fitting',
      'Minor Home Repairs',
      'Hourly Odd Jobs',
    ],
  },
  Vehicle: {
    label: 'Vehicle-Adjacent Care',
    icon: Car,
    services: [
      'Doorstep Car Detail Wash',
      'Mobile Battery Jumpstart',
      'Roadside Tyre Swap',
      'Mobile Mechanic Call-out',
    ],
  },
};

const SAMPLE_QUESTION_BANK: Record<string, SkillTestQuestion[]> = {
  Plumbing: [
    {
      id: 'plumb-q1',
      field: 'Plumbing',
      serviceName: 'Leaks & Pipe Repairs',
      question:
        'When assembling threaded brass water fittings, what sealant material should be wrapped clockwise around male threads to prevent high-pressure leaks?',
      options: [
        'A) Standard electrical tape',
        'B) PTFE (Teflon) Thread Seal Tape',
        'C) Masking paper tape',
        'D) Liquid silicone paste only',
      ],
      correctIndex: 1,
      explanation:
        'PTFE Thread Seal tape lubricates and fills thread gaps to prevent leaks under municipal water pressure.',
    },
    {
      id: 'plumb-q2',
      field: 'Plumbing',
      serviceName: 'Drain Unclogging',
      question:
        'What is the standard minimum slope ratio per foot required for horizontal drain piping to maintain self-cleansing wastewater flow?',
      options: [
        'A) 1/16 inch per foot',
        'B) 1/4 inch per foot (2%)',
        'C) 1 inch per foot',
        'D) 3 inches per foot',
      ],
      correctIndex: 1,
      explanation:
        'A 1/4 inch per foot slope allows water and solids to flow together without leaving sediment behind.',
    },
    {
      id: 'plumb-q3',
      field: 'Plumbing',
      serviceName: 'Water Heater Service',
      question:
        'Where must the Temperature and Pressure Relief (TPR) valve safety discharge pipe terminate?',
      options: [
        'A) Plugged securely with a cap',
        'B) Pointed downward within 6 inches of floor/drain without threads at the end',
        'C) Connected directly into drinking water supply',
        'D) Routed upwards to ceiling',
      ],
      correctIndex: 1,
      explanation:
        'TPR relief lines must discharge safely to floor level without restriction to prevent scalding or tank explosion.',
    },
  ],
  Electrical: [
    {
      id: 'elec-q1',
      field: 'Electrical',
      serviceName: 'Circuit Breakers & Wiring',
      question:
        'A client reports a 20A circuit breaker tripping repeatedly when an AC and water heater run simultaneously. What is the immediate correct diagnostic action?',
      options: [
        'A) Replace the breaker with a 50A breaker immediately',
        'B) Measure line current draw with a clamp meter and verify circuit ampacity against conductor gauge',
        'C) Bypass the breaker switch with copper wire',
        'D) Wrap the breaker in thermal tape',
      ],
      correctIndex: 1,
      explanation:
        'Never oversize a breaker without verifying wire gauge. Clamp meter testing confirms total load versus conductor thermal limits.',
    },
    {
      id: 'elec-q2',
      field: 'Electrical',
      serviceName: 'Earthing & Safety',
      question:
        'Under standard IEC / Ghanaian electrical installation regulations (230V single phase), what is the mandatory insulation color for Protective Earth (PE) grounding conductors?',
      options: [
        'A) Red',
        'B) Black',
        'C) Green / Yellow bi-color striped',
        'D) Solid Blue',
      ],
      correctIndex: 2,
      explanation:
        'Green/Yellow striped wire is internationally reserved exclusively for Protective Earth grounding.',
    },
    {
      id: 'elec-q3',
      field: 'Electrical',
      serviceName: 'Generator Changeover Switch',
      question:
        'What safety mechanism must be present in a manual generator changeover switch before connecting to mains power?',
      options: [
        'A) Mechanical interlock preventing simultaneous closure of mains and generator supplies',
        'B) Exposed copper jumper bars',
        'C) High voltage transformer coil',
        'D) Fuse bypass wire',
      ],
      correctIndex: 0,
      explanation:
        'Mechanical interlocks prevent dangerous backfeeding from the generator into utility ECG lines.',
    },
  ],
  Handyman: [
    {
      id: 'handy-q1',
      field: 'Handyman',
      serviceName: 'TV Wall Mounts',
      question:
        'When mounting a 65-inch heavy TV onto hollow plasterboard/drywall without direct stud access, which fastener provides maximum pull-out strength?',
      options: [
        'A) Standard small plastic conical wall plug',
        'B) Toggle bolt / Snaptoggle heavy-duty anchor',
        'C) Wood screw with washer',
        'D) Double-sided foam mounting tape',
      ],
      correctIndex: 1,
      explanation:
        'Toggle bolts expand behind hollow drywall boards to spread the load over a wider surface area.',
    },
    {
      id: 'handy-q2',
      field: 'Handyman',
      serviceName: 'Door Locks & Hinges',
      question:
        'When mortising a wooden door frame for a new tubular latch bolt, what tool ensures a flush mortise plate finish?',
      options: [
        'A) Sharp wood chisel and hammer',
        'B) Coarse rasp file',
        'C) Pliers',
        'D) Wire cutter',
      ],
      correctIndex: 0,
      explanation:
        'A sharp wood chisel cuts clean, precise perimeter depth lines for flush faceplate seating.',
    },
  ],
};

export const ProOnboardingModal: React.FC<ProOnboardingModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onCompleteOnboarding,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [selectedField, setSelectedField] = useState<string>('Plumbing');
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Leaks & Pipe Repairs',
    'Faucet & Valve Replacement',
  ]);
  const [hourlyRate, setHourlyRate] = useState<number>(55);
  const [experienceYears, setExperienceYears] = useState<number>(8);

  // Test State
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [testSubmitted, setTestSubmitted] = useState<boolean>(false);
  const [testScore, setTestScore] = useState<number>(0);

  // Verification & Payout State
  const [ghanaCardNum, setGhanaCardNum] = useState<string>(
    userProfile.ghanaCardNumber || 'GHA-72019482-1'
  );
  const [momoNumber, setMomoNumber] = useState<string>(
    userProfile.phone || '+233 24 412 8891'
  );
  const [momoNetwork, setMomoNetwork] = useState<string>('MTN Mobile Money');
  const [certDocName, setCertDocName] = useState<string>(
    'Master_Artisan_NVTI_Certificate.pdf'
  );

  if (!isOpen) return null;

  const currentQuestions =
    SAMPLE_QUESTION_BANK[selectedField] || SAMPLE_QUESTION_BANK['Handyman'];

  const toggleService = (srv: string) => {
    if (selectedServices.includes(srv)) {
      setSelectedServices(selectedServices.filter((s) => s !== srv));
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const handleSelectAnswer = (qIdx: number, oIdx: number) => {
    setUserAnswers({
      ...userAnswers,
      [qIdx]: oIdx,
    });
  };

  const handleSubmitTest = () => {
    let score = 0;
    currentQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        score += 1;
      }
    });
    const percentage = Math.round((score / currentQuestions.length) * 100);
    setTestScore(percentage);
    setTestSubmitted(true);
  };

  const handleFinish = () => {
    const proDetails: ProProfileDetails = {
      primaryTrade: selectedField,
      secondaryTrades: ['Handyman'],
      hourlyRate,
      experienceYears,
      rating: 4.9,
      jobsCompleted: 12,
      onTimeRate: 98.5,
      problemSolvedRate: 100,
      isOnline: true,
      walletAvailable: 340.0,
      walletPending: 120.0,
      walletPaidOut: 1850.0,
      momoNumber,
      momoNetwork,
      testScore: testScore || 100,
      testedServices: selectedServices,
      certifications: [
        'National ID Biometric Verified',
        `${selectedField} Level 2 Field Assessment Passed`,
      ],
    };

    onCompleteOnboarding(proDetails);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#F8F9FB]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1E5BF0] text-white flex items-center justify-center">
              <Wrench className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Artisan Pro Onboarding
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                Step {step} of 4: {step === 1 ? 'Trade Field' : step === 2 ? 'Skill Testing' : step === 3 ? 'Identity Verification' : 'Payout Setup'}
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

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 flex">
          <div
            className="bg-[#1E5BF0] h-1.5 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Scrollable Step Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* STEP 1: FIELD & SERVICES SELECTION */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">
                  Select Primary Field of Expertise (17 Categories)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose your trade. You will take a field technical assessment test for verification.
                </p>
              </div>

              {/* Trade Fields Grid (Scrollable grid of 17 categories) */}
              <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1 bg-slate-50 border border-slate-200 rounded-2xl">
                {Object.entries(FIELD_SERVICES).map(([key, data]) => {
                  const Icon = data.icon;
                  const isSelected = selectedField === key;
                  return (
                    <div
                      key={key}
                      onClick={() => {
                        setSelectedField(key);
                        setSelectedServices(data.services.slice(0, 2));
                      }}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-blue-50/90 border-[#1E5BF0] ring-2 ring-blue-500/20 shadow-2xs'
                          : 'bg-white hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#EBF1FF] text-[#1E5BF0] flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 stroke-[2]" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-slate-900 block truncate">
                          {data.label}
                        </span>
                        <span className="text-[9px] text-slate-400 block font-medium">
                          {data.services.length} services
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Specific Services Offered */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-800 block">
                  Specific {FIELD_SERVICES[selectedField]?.label || selectedField} Services You Offer:
                </label>
                <div className="space-y-1.5">
                  {FIELD_SERVICES[selectedField]?.services.map((srv) => {
                    const checked = selectedServices.includes(srv);
                    return (
                      <div
                        key={srv}
                        onClick={() => toggleService(srv)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                          checked
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>{srv}</span>
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border ${
                            checked
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {checked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hourly Rate & Experience */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Hourly Rate (GH₵/hr)
                  </label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    min={30}
                    max={500}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    min={1}
                    max={35}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: FIELD TECHNICAL SKILL TEST */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#1E5BF0] uppercase tracking-wider block">
                    Skill Testing System
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {FIELD_SERVICES[selectedField]?.label || selectedField} Technical Assessment
                  </h4>
                </div>

                <span className="px-2.5 py-1 bg-blue-50 text-[#1E5BF0] border border-blue-200 rounded-full text-[10px] font-bold">
                  {currentQuestions.length} Questions
                </span>
              </div>

              {!testSubmitted ? (
                <div className="space-y-4">
                  {currentQuestions.map((q, qIdx) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#1E5BF0] text-white text-[11px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                          {qIdx + 1}
                        </span>
                        <p className="text-xs font-bold text-slate-900 leading-snug">
                          {q.question}
                        </p>
                      </div>

                      <div className="space-y-1.5 pl-7">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = userAnswers[qIdx] === oIdx;
                          return (
                            <div
                              key={oIdx}
                              onClick={() => handleSelectAnswer(qIdx, oIdx)}
                              className={`p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-[#1E5BF0] text-white border-[#1E5BF0] font-bold shadow-2xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {opt}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleSubmitTest}
                    disabled={Object.keys(userAnswers).length < currentQuestions.length}
                    className="w-full py-3 bg-[#1E5BF0] hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs transition-colors"
                  >
                    Submit Skill Assessment Test
                  </button>
                </div>
              ) : (
                /* Test Results View */
                <div className="space-y-4 py-2 animate-fade-in">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                      <Sparkles className="w-6 h-6 text-emerald-400" />
                    </div>
                    <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider block">
                      Assessment Result
                    </span>
                    <h3 className="text-2xl font-black text-white">
                      Score: {testScore}% ({testScore >= 66 ? 'PASSED' : 'RETAKE SUGGESTED'})
                    </h3>
                    <p className="text-xs text-slate-300 max-w-sm mx-auto">
                      {testScore >= 66
                        ? `Congratulations! You passed the ${selectedField} field assessment test and earned your Verified Artisan Skill Badge.`
                        : 'Review the technical explanations below and try again to unlock Level 2 Verified status.'}
                    </p>
                  </div>

                  {/* Answer Explanations */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">
                      Question Explanations:
                    </span>
                    {currentQuestions.map((q, idx) => (
                      <div
                        key={q.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                      >
                        <span className="font-bold text-slate-900 block">
                          Q{idx + 1}: {q.question}
                        </span>
                        <span className="text-emerald-700 font-bold block">
                          Correct Answer: {q.options[q.correctIndex]}
                        </span>
                        <p className="text-[11px] text-slate-500 italic leading-snug">
                          → {q.explanation}
                        </p>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setTestSubmitted(false)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Retake Skill Assessment
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: IDENTITY & GHANA CARD VERIFICATION */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">
                  National ID (Ghana Card) Biometric Match
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify your identity to receive the green Ghana Card Verified Badge on your pro card.
                </p>
              </div>

              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950">
                    Ghana Card Biometric Liveness
                  </span>
                  <GhanaCardBadge idNumber={ghanaCardNum} size="sm" />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-emerald-900 block mb-1">
                    Ghana Card Number (NIA)
                  </label>
                  <input
                    type="text"
                    value={ghanaCardNum}
                    onChange={(e) => setGhanaCardNum(e.target.value)}
                    placeholder="GHA-72019482-1"
                    className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Upload Certificate / Guarantor Proof */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">
                  Trade Certificate or Association Letter
                </label>

                <div className="p-4 border-2 border-dashed border-slate-200 bg-slate-50 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <FileCheck className="w-6 h-6 text-[#1E5BF0]" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        {certDocName}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        NVTI / Master Craftsman Endorsed
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Change File
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PAYOUT & MOBILE MONEY SETUP */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">
                  Automated Mobile Money Payout Setup
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Escrow payouts are transferred directly to your MoMo wallet upon client job sign-off.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Mobile Money Wallet Network
                  </label>
                  <select
                    value={momoNetwork}
                    onChange={(e) => setMomoNetwork(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    <option value="MTN Mobile Money">MTN Mobile Money (MoMo)</option>
                    <option value="Telecel Cash">Telecel Cash</option>
                    <option value="AT Money">AT Money</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Mobile Money Phone Number
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={momoNumber}
                      onChange={(e) => setMomoNumber(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Onboarding Summary Box */}
              <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-2 text-xs text-blue-950">
                <span className="font-bold text-xs block text-[#1E5BF0]">
                  Ready to activate your Pro Profile!
                </span>
                <p className="text-[11px] leading-relaxed text-blue-900">
                  You are registered for <strong>{selectedField}</strong> at <strong>GH₵{hourlyRate}/hr</strong>. Your Ghana Card badge and test score ({testScore || 100}%) will appear on your pro profile card.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-[#F8F9FB] flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Cancel
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((step + 1) as any)}
              className="px-5 py-2.5 bg-[#1E5BF0] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Activate Pro Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
