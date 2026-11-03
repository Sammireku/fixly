import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useLanguage } from '../../context/LanguageContext';
import { VERIFICATION_BADGES } from '../../data/catalog';
import { VerificationBadge } from '../../types';
import {
  ShieldCheck,
  Award,
  FileCheck,
  Lock,
  Sparkles,
  Clock,
  CheckCircle2,
  UploadCloud,
  ChevronRight,
  Info,
  Check,
} from 'lucide-react';

export const ProBadgesCenter: React.FC = () => {
  const { currentUser, uploadProCertificate } = useMarketplace();
  const { t } = useLanguage();

  const proBadges = currentUser.proProfile?.badges || VERIFICATION_BADGES;
  const tradeCerts = currentUser.proProfile?.tradeCertificates || [];
  const [selectedBadge, setSelectedBadge] = useState<VerificationBadge>(proBadges[0]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadedDocName, setUploadedDocName] = useState('');
  const [docCategory, setDocCategory] = useState('Master Craftsman Association Certificate');
  const [issuingOrg, setIssuingOrg] = useState('National Vocational Training Institute (NVTI Ghana)');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'Award':
        return <Award className="w-5 h-5 text-amber-500" />;
      case 'FileCheck':
        return <FileCheck className="w-5 h-5 text-sky-600" />;
      case 'Lock':
        return <Lock className="w-5 h-5 text-purple-600" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-600" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-indigo-600" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-slate-600" />;
    }
  };

  const handleSimulateUpload = async () => {
    if (!uploadedDocName) return;
    const certType = docCategory.includes('NVTI')
      ? 'nvti'
      : docCategory.includes('Master Craftsman')
      ? 'master_artisan_letter'
      : docCategory.includes('Garages')
      ? 'union_membership'
      : 'other';

    await uploadProCertificate({
      title: docCategory,
      certType,
      issuingBody: issuingOrg,
      issueYear: String(new Date().getFullYear()),
      documentName: uploadedDocName,
    });
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setUploadModalOpen(false);
      setUploadedDocName('');
    }, 1800);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header Overview Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Artisan Trust & Verification Passport</span>
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 mt-1">
            Visual Trust Badges ({proBadges.filter((b) => b.status === 'verified').length} Active)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
            Verified badges appear directly on your artisan card in client search results and on-demand dispatches, making you 3.4x more likely to be selected.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-colors shrink-0"
        >
          <UploadCloud className="w-4 h-4 text-amber-400" />
          <span>Submit New Proof / Certificate</span>
        </button>
      </div>

      {/* Trade Certificates & Evidence of Trade */}
      {tradeCerts.length > 0 && (
        <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-extrabold text-emerald-950">
                Verified Trade Certificates ({tradeCerts.length})
              </h3>
            </div>
            <span className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-full tracking-wider flex items-center gap-1 shadow-xs">
              <Check className="w-3 h-3" />
              Verified Pro
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tradeCerts.map((cert) => (
              <div
                key={cert.id}
                className="p-3.5 bg-white rounded-xl border border-emerald-200 shadow-xs flex items-start justify-between gap-3"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                    {cert.issuingBody} · {cert.issueYear}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-0.5">{cert.title}</h4>
                  <p className="text-[11px] text-slate-500 font-mono mt-1">Ref: {cert.documentName}</p>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Verified
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Badges Grid & Live Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left Column: Badges List */}
        <div className="md:col-span-2 space-y-3">
          <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
            Your Earned & Available Badges:
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {proBadges.map((badge) => {
              const isSelected = selectedBadge.id === badge.id;
              const isVerified = badge.status === 'verified';
              return (
                <div
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 shadow-2xs">
                        {getBadgeIcon(badge.icon)}
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          isVerified
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {badge.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 mt-2.5 leading-snug">
                      {badge.label}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {badge.tooltip}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="capitalize">{badge.category} verification</span>
                    <span className="text-amber-600 font-bold flex items-center gap-0.5">
                      Details <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Client Search Card Preview */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
            Client Search View Preview:
          </label>

          <div className="bg-white rounded-2xl p-4 border-2 border-amber-500/40 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                How Clients See You in Accra
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                TOP RATED
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shrink-0">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-xs font-extrabold text-slate-900 truncate">
                    {currentUser.name}
                  </h4>
                  <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded shrink-0">
                    {currentUser.proProfile?.tier}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block truncate">
                  {currentUser.location?.area} · {currentUser.proProfile?.jobsCompleted} Jobs Done
                </span>
              </div>
            </div>

            {/* Visual Badges Pill Strip */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {proBadges
                .filter((b) => b.status === 'verified')
                .slice(0, 4)
                .map((b) => (
                  <span
                    key={b.id}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700"
                    title={b.tooltip}
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{b.shortLabel}</span>
                  </span>
                ))}
            </div>

            <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
              <div className="flex items-center justify-between">
                <span>Problem Solved Rate:</span>
                <strong className="font-mono">{currentUser.proProfile?.problemSolvedRate}%</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Insured Claim Limit:</span>
                <strong className="font-mono text-emerald-700">GH₵ {currentUser.proProfile?.claimLimit}</strong>
              </div>
            </div>
          </div>

          {/* Selected Badge Inspector */}
          {selectedBadge && (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Badge Details:
              </span>
              <h4 className="font-bold text-slate-900">{selectedBadge.label}</h4>
              <p className="text-slate-600 text-[11px] leading-relaxed">{selectedBadge.tooltip}</p>

              <div className="pt-2 border-t border-slate-200 space-y-1 text-[11px] text-slate-500">
                <div className="flex items-center justify-between">
                  <span>Issued By:</span>
                  <strong className="text-slate-800">{selectedBadge.issuedBy}</strong>
                </div>
                {selectedBadge.proofDocName && (
                  <div className="flex items-center justify-between">
                    <span>Document:</span>
                    <strong className="font-mono text-slate-800">{selectedBadge.proofDocName}</strong>
                  </div>
                )}
                {selectedBadge.verifiedAt && (
                  <div className="flex items-center justify-between">
                    <span>Verified On:</span>
                    <span className="font-mono text-slate-600">{selectedBadge.verifiedAt}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Document Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Upload Verification Credential
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Submit trade certificates, master craftsman registration, or guarantor letters.
              </p>
            </div>

            {!uploadSuccess ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Document Type
                  </label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    <option value="Master Craftsman Association Certificate">Master Craftsman Association Certificate</option>
                    <option value="NVTI National Vocational Trade Certificate">NVTI National Vocational Trade Certificate</option>
                    <option value="Ghana National Association of Garages Certificate">Ghana National Association of Garages Certificate</option>
                    <option value="Property Owner Guarantor Letter (Accra)">Property Owner Guarantor Letter (Accra)</option>
                    <option value="Commercial Liability Insurance Policy">Commercial Liability Insurance Policy</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Issuing Authority / Association
                  </label>
                  <input
                    type="text"
                    value={issuingOrg}
                    onChange={(e) => setIssuingOrg(e.target.value)}
                    placeholder="e.g. National Vocational Training Institute (NVTI)"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Document Reference / Name
                  </label>
                  <input
                    type="text"
                    value={uploadedDocName}
                    onChange={(e) => setUploadedDocName(e.target.value)}
                    placeholder="e.g. Master Plumber Cert #MP-2026-99"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center text-xs text-slate-500 bg-slate-50">
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                  <span className="font-bold text-slate-700 block">Tap to browse photo of document</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">JPG, PNG or PDF up to 10MB</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setUploadModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSimulateUpload}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Submit for Ops Review
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center space-y-2 animate-fade-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900">Document Submitted</h4>
                <p className="text-xs text-slate-500">
                  Fixly Ops will review and activate your verification badge within 24 hours.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
