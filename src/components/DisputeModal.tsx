import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useLanguage } from '../context/LanguageContext';
import { usePreventScroll } from '../hooks/usePreventScroll';
import { DisputeRecord } from '../types';
import { X, ShieldAlert, Camera, Mic, CheckCircle2 } from 'lucide-react';

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({ isOpen, onClose, jobId }) => {
  const { reportDispute, jobs } = useMarketplace();
  const { t } = useLanguage();
  usePreventScroll(isOpen);

  const [category, setCategory] = useState<DisputeRecord['category']>('poor_workmanship');
  const [description, setDescription] = useState('');
  const [desiredOutcome, setDesiredOutcome] = useState<DisputeRecord['desiredOutcome']>('redo');
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const job = jobs.find((j) => j.id === jobId);

  if (!isOpen) return null;

  const handleSimulatePhoto = () => {
    setPhotos((prev) => [
      ...prev,
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    ]);
  };

  const handleSubmit = async () => {
    await reportDispute(jobId, {
      category,
      description,
      desiredOutcome,
      evidencePhotos: photos,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 overflow-hidden relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-rose-600">
            <ShieldAlert className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-900">
              Report Problem & Freeze Escrow
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!submitted ? (
          <div className="mt-4 space-y-4">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
              <strong>Immediate Escrow Freeze:</strong> Submitting this report halts payment release to the artisan. Both parties have 24 hours to respond before Ops mediation executes the claims waterfall.
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider mb-1">
                What went wrong with {job?.title}?
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
              >
                <option value="poor_workmanship">Poor Workmanship / Defective Fix</option>
                <option value="not_completed">Work Not Completed as Agreed</option>
                <option value="damage">Property Damage Occurred</option>
                <option value="overcharge">Price Changed Mid-Job / Overcharge</option>
                <option value="no_show">Artisan No-Show</option>
                <option value="safety">Safety / Conduct Concern</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider mb-1">
                Explain the problem in detail:
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what happened, what was promised, and what failed..."
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider mb-1.5">
                Attach Photo Evidence:
              </label>
              <div className="flex items-center gap-2">
                {photos.map((p, idx) => (
                  <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                    <img src={p} alt="evidence" className="w-full h-full object-cover" />
                  </div>
                ))}
                <button
                  onClick={handleSimulatePhoto}
                  className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-300 hover:border-amber-400 bg-slate-50 flex flex-col items-center justify-center text-slate-500 hover:text-amber-600 cursor-pointer text-xs"
                >
                  <Camera className="w-4 h-4 mb-0.5" />
                  <span className="text-[10px] font-bold">+Photo</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider mb-1">
                Desired Resolution:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'redo', label: 'Pro Redo' },
                  { id: 'partial_refund', label: 'Partial Refund' },
                  { id: 'full_refund', label: 'Full Refund' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setDesiredOutcome(item.id as any)}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                      desiredOutcome === item.id
                        ? 'border-rose-500 bg-rose-50 text-rose-900 ring-1 ring-rose-500'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors"
              >
                Submit Dispute & Freeze Escrow
              </button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-2 animate-fade-in">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900">Escrow Frozen & Dispute Filed</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Funds are secured. The artisan was notified to respond within 24 hours. Ops mediation ticket opened.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
