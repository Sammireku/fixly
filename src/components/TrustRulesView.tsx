import React from 'react';
import { ShieldCheck, Award, Lock, FileCheck, CheckCircle2, RefreshCw, AlertTriangle } from 'lucide-react';

export const TrustRulesView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-5 h-5" />
          <span>The Fixly Promise</span>
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">
          "The handyman who shows up, at an agreed price, with your money protected."
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
          Trust is built in six layers, each covering a different point of failure. If one layer fails, the next catches it. Raw opinion star-ratings are de-emphasized in favor of verified facts.
        </p>
      </div>

      {/* Six Layer Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-amber-600 uppercase block mb-1">Layer 1: Identity</span>
          <h4 className="text-sm font-bold text-slate-900">Ghana Card & MoMo Match</h4>
          <p className="text-xs text-slate-500 mt-1">
            Every artisan must undergo a Ghana Card liveness match and Mobile Money wallet identity check before taking jobs.
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-600 uppercase block mb-1">Layer 2: Competence</span>
          <h4 className="text-sm font-bold text-slate-900">Association Trade Proof</h4>
          <p className="text-xs text-slate-500 mt-1">
            Master craftsman references, trade association certificates, and supervised trial jobs benchmark workmanship.
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-sky-600 uppercase block mb-1">Layer 3: Conduct</span>
          <h4 className="text-sm font-bold text-slate-900">GPS Arrival & Price Lock</h4>
          <p className="text-xs text-slate-500 mt-1">
            GPS-verified check-in at your compound gate, masked phone contact, and in-app price approval before tools touch the work.
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-purple-600 uppercase block mb-1">Layer 4: Money</span>
          <h4 className="text-sm font-bold text-slate-900">100% Escrow Protection</h4>
          <p className="text-xs text-slate-500 mt-1">
            Funds are held safely in escrow. Payments release only after client sign-off followed by a 24 to 48-hour warranty hold.
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-rose-600 uppercase block mb-1">Layer 5: Recourse</span>
          <h4 className="text-sm font-bold text-slate-900">5-Stage Claims Waterfall</h4>
          <p className="text-xs text-slate-500 mt-1">
            If work is defective: 1. Escrow hold, 2. Pro wallet, 3. Guarantor (Project Tier), 4. Insurance pool, 5. Licensed insurer.
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-indigo-600 uppercase block mb-1">Layer 6: Reputation</span>
          <h4 className="text-sm font-bold text-slate-900">Objective Quality Score</h4>
          <p className="text-xs text-slate-500 mt-1">
            35% Problem Solved rate + 25% Workmanship + 20% Claim-free rate + 10% On-time GPS arrival + 10% Conduct.
          </p>
        </div>
      </div>

      {/* Tier & Claim Limit Table from Section 8 */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-base font-bold text-slate-900">
          Artisan Tiers & Insurance Claim Limits
        </h3>
        <p className="text-xs text-slate-500">
          The claim limit is the maximum amount Fixly and its insurer stand behind for each artisan.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="p-2.5 font-bold">Tier</th>
                <th className="p-2.5 font-bold">Unlock Criteria</th>
                <th className="p-2.5 font-bold">Claim Limit (GH₵)</th>
                <th className="p-2.5 font-bold">Guarantor</th>
                <th className="p-2.5 font-bold">Commission</th>
                <th className="p-2.5 font-bold">Pool Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="p-2.5 font-bold text-slate-900">Starter</td>
                <td className="p-2.5">Ghana Card, Trial Job</td>
                <td className="p-2.5 font-mono font-bold text-emerald-700">GH₵ 1,000</td>
                <td className="p-2.5">No</td>
                <td className="p-2.5 font-mono">18%</td>
                <td className="p-2.5 font-mono">3.0%</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-900">Growth</td>
                <td className="p-2.5">10+ Jobs, Score 60+, 0 Claims</td>
                <td className="p-2.5 font-mono font-bold text-emerald-700">GH₵ 1,000–3,000</td>
                <td className="p-2.5">No</td>
                <td className="p-2.5 font-mono">15%</td>
                <td className="p-2.5 font-mono">2.5%</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-900">Pro</td>
                <td className="p-2.5">40+ Jobs, Score 75+, 6m Active</td>
                <td className="p-2.5 font-mono font-bold text-emerald-700">GH₵ 3,000–8,000</td>
                <td className="p-2.5 text-emerald-700 font-bold">Yes (Project)</td>
                <td className="p-2.5 font-mono">12%</td>
                <td className="p-2.5 font-mono">2.0%</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-900">Elite</td>
                <td className="p-2.5">100+ Jobs, Score 85+, 12m Active</td>
                <td className="p-2.5 font-mono font-bold text-emerald-700">GH₵ 8,000–20,000</td>
                <td className="p-2.5 text-emerald-700 font-bold">Yes</td>
                <td className="p-2.5 font-mono">10%</td>
                <td className="p-2.5 font-mono">1.5%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
