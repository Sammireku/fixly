import React, { useState, useEffect } from 'react';
import { 
  Wrench, Zap, Shield, MapPin, Search, Clock, Camera, Mic, 
  Phone, MessageSquare, Share2, CheckCircle2, AlertTriangle, 
  ChevronRight, ArrowLeft, Star, FileText, Plus, Check, 
  Navigation, User, ShieldCheck, CreditCard, DollarSign, 
  Lock, RefreshCw, AlertCircle, Info, ExternalLink, Sliders,
  Calendar, Layers, Filter, Send, Play, Radio
} from 'lucide-react';

// Main Application Container
export default function FixlyMobileEcosystem() {
  const [activeTab, setActiveTab] = useState('on-demand'); // 'on-demand', 'project', 'pro', 'trust'
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  const [viewMode, setViewMode] = useState('phone'); // 'phone' or 'grid'
  
  // Reset screen index when switching primary flows
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setActiveScreenIndex(0);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800 my-4">
      {/* Top Header / Brand Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            {/* Fixly Logo Icon */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <div className="relative">
                <Wrench className="w-5 h-5 text-white transform -rotate-45" />
                <Zap className="w-3 h-3 text-amber-300 absolute -bottom-1 -right-1 fill-amber-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl tracking-tight text-white">Fixly</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  UX Interactive Wireframe
                </span>
              </div>
              <p className="text-xs text-slate-400">Emergency & Planned Home Repair Ecosystem</p>
            </div>
          </div>

          {/* Flow Selector Navigation */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-sm overflow-x-auto max-w-full">
            <button
              onClick={() => handleTabChange('on-demand')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'on-demand' 
                  ? 'bg-sky-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>1. On-Demand Booking</span>
            </button>
            <button
              onClick={() => handleTabChange('project')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'project' 
                  ? 'bg-sky-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>2. Project Booking</span>
            </button>
            <button
              onClick={() => handleTabChange('pro')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'pro' 
                  ? 'bg-sky-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>3. Pro App</span>
            </button>
            <button
              onClick={() => handleTabChange('trust')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'trust' 
                  ? 'bg-sky-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>4. Trust & Safety</span>
            </button>
          </div>

          {/* Device / View Controls */}
          <div className="flex items-center space-x-2 border-l border-slate-800 pl-4 hidden md:flex">
            <button
              onClick={() => setViewMode('phone')}
              className={`p-2 rounded-lg transition cursor-pointer ${
                viewMode === 'phone' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Interactive Phone Simulator View"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition cursor-pointer ${
                viewMode === 'grid' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Side-by-Side Wireframe Grid"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Interactive Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col items-center justify-center">
        {/* Flow Description Subheader */}
        <div className="w-full mb-6 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              {activeTab === 'on-demand' && 'Client: On-Demand Booking (3 Screens)'}
              {activeTab === 'project' && 'Client: Project Booking & Staged Escrow (3 Screens)'}
              {activeTab === 'pro' && 'Pro App: Instant Job Accept, Quote & Earnings (3 Screens)'}
              {activeTab === 'trust' && 'Trust & Safety Ecosystem (3 Screens)'}
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {activeTab === 'on-demand' && 'Instant dispatch flow for urgent emergencies from problem detection to live GPS tracking.'}
              {activeTab === 'project' && 'Planning larger renovations, receiving itemized pro quotes, and releasing 40-40-20 escrow milestone payments.'}
              {activeTab === 'pro' && 'Technician portal to toggle online status, submit on-site job quotes in GH₵, and cash out earnings to Mobile Money.'}
              {activeTab === 'trust' && 'Guarantor verification badges, instant payment freezing on dispute, and one-tap Silent SOS response system.'}
            </p>
          </div>

          {/* Screen Stepper Controls (for single-phone mode) */}
          {viewMode === 'phone' && (
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 self-start md:self-auto">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveScreenIndex(idx)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    activeScreenIndex === idx 
                      ? 'bg-sky-600 text-white shadow' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Screen {idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Display Area */}
        {viewMode === 'phone' ? (
          <div className="flex flex-col items-center">
            {/* Phone Frame Wrapper */}
            <div className="relative w-[375px] h-[780px] bg-slate-950 rounded-[48px] p-4 shadow-2xl shadow-sky-950/50 border-[6px] border-slate-800 flex flex-col overflow-hidden">
              {/* iPhone Notch / Speaker Bar */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-6 w-36 bg-slate-800 rounded-b-2xl z-50 flex items-center justify-center">
                <div className="w-12 h-1 bg-slate-700 rounded-full"></div>
              </div>

              {/* Mobile Screen Outer Frame */}
              <div className="w-full h-full bg-slate-900 text-slate-100 rounded-[36px] overflow-hidden flex flex-col pt-4 relative border border-slate-800">
                
                {/* Active Screen Renderer */}
                <div className="flex-1 overflow-y-auto no-scrollbar pb-16">
                  {activeTab === 'on-demand' && (
                    <>
                      {activeScreenIndex === 0 && <OnDemandHome onNext={() => setActiveScreenIndex(1)} />}
                      {activeScreenIndex === 1 && <OnDemandMap onNext={() => setActiveScreenIndex(2)} onBack={() => setActiveScreenIndex(0)} />}
                      {activeScreenIndex === 2 && <OnDemandTracking onBack={() => setActiveScreenIndex(1)} />}
                    </>
                  )}

                  {activeTab === 'project' && (
                    <>
                      {activeScreenIndex === 0 && <ProjectBrief onNext={() => setActiveScreenIndex(1)} />}
                      {activeScreenIndex === 1 && <ProjectQuotes onNext={() => setActiveScreenIndex(2)} onBack={() => setActiveScreenIndex(0)} />}
                      {activeScreenIndex === 2 && <ProjectMilestones onBack={() => setActiveScreenIndex(1)} />}
                    </>
                  )}

                  {activeTab === 'pro' && (
                    <>
                      {activeScreenIndex === 0 && <ProJobInbox onNext={() => setActiveScreenIndex(1)} />}
                      {activeScreenIndex === 1 && <ProQuoteBuilder onNext={() => setActiveScreenIndex(2)} onBack={() => setActiveScreenIndex(0)} />}
                      {activeScreenIndex === 2 && <ProWallet onBack={() => setActiveScreenIndex(1)} />}
                    </>
                  )}

                  {activeTab === 'trust' && (
                    <>
                      {activeScreenIndex === 0 && <TrustProfile onNext={() => setActiveScreenIndex(1)} />}
                      {activeScreenIndex === 1 && <ReportProblem onNext={() => setActiveScreenIndex(2)} onBack={() => setActiveScreenIndex(0)} />}
                      {activeScreenIndex === 2 && <SafetySOS onBack={() => setActiveScreenIndex(1)} />}
                    </>
                  )}
                </div>

                {/* Bottom Navigation Indicator Bar */}
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-slate-600/50 rounded-full"></div>
              </div>
            </div>

            {/* Pagination Controls below phone */}
            <div className="flex items-center space-x-4 mt-6">
              <button
                disabled={activeScreenIndex === 0}
                onClick={() => setActiveScreenIndex(prev => Math.max(0, prev - 1))}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 rounded-xl text-sm font-medium transition flex items-center space-x-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Screen</span>
              </button>
              <span className="text-xs text-slate-400">
                Screen {activeScreenIndex + 1} of 3
              </span>
              <button
                disabled={activeScreenIndex === 2}
                onClick={() => setActiveScreenIndex(prev => Math.min(2, prev + 1))}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:hover:bg-sky-600 rounded-xl text-sm font-medium transition flex items-center space-x-1 text-white cursor-pointer"
              >
                <span>Next Screen</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Grid View Mode: Shows 3 screens side-by-side */
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
            {activeTab === 'on-demand' && (
              <>
                <WireframeCard title="1. Client Home" step="1/3">
                  <OnDemandHome onNext={() => {}} />
                </WireframeCard>
                <WireframeCard title="2. Request on Map" step="2/3">
                  <OnDemandMap onNext={() => {}} onBack={() => {}} />
                </WireframeCard>
                <WireframeCard title="3. Live GPS Tracking" step="3/3">
                  <OnDemandTracking onBack={() => {}} />
                </WireframeCard>
              </>
            )}

            {activeTab === 'project' && (
              <>
                <WireframeCard title="1. Project Brief" step="1/3">
                  <ProjectBrief onNext={() => {}} />
                </WireframeCard>
                <WireframeCard title="2. Compare Quotes" step="2/3">
                  <ProjectQuotes onNext={() => {}} onBack={() => {}} />
                </WireframeCard>
                <WireframeCard title="3. Staged Milestones" step="3/3">
                  <ProjectMilestones onBack={() => {}} />
                </WireframeCard>
              </>
            )}

            {activeTab === 'pro' && (
              <>
                <WireframeCard title="1. Pro Job Inbox" step="1/3">
                  <ProJobInbox onNext={() => {}} />
                </WireframeCard>
                <WireframeCard title="2. Quote Builder" step="2/3">
                  <ProQuoteBuilder onNext={() => {}} onBack={() => {}} />
                </WireframeCard>
                <WireframeCard title="3. Wallet & MoMo Cashout" step="3/3">
                  <ProWallet onBack={() => {}} />
                </WireframeCard>
              </>
            )}

            {activeTab === 'trust' && (
              <>
                <WireframeCard title="1. Pro Trust Profile" step="1/3">
                  <TrustProfile onNext={() => {}} />
                </WireframeCard>
                <WireframeCard title="2. Report a Problem" step="2/3">
                  <ReportProblem onNext={() => {}} onBack={() => {}} />
                </WireframeCard>
                <WireframeCard title="3. SOS & Safety Check-in" step="3/3">
                  <SafetySOS onBack={() => {}} />
                </WireframeCard>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// Wrapper component for the Grid Wireframe view
function WireframeCard({ title, step, children }: { title: string; step: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden flex flex-col h-[700px] shadow-xl">
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <span className="font-semibold text-sm text-sky-400">{title}</span>
        <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{step}</span>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-3">
        {children}
      </div>
    </div>
  );
}

// ==========================================
// 1. CLIENT: ON-DEMAND BOOKING FLOW (3 SCREENS)
// ==========================================

function OnDemandHome({ onNext }: { onNext: () => void }) {
  const [bookingMode, setBookingMode] = useState('now');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-4 space-y-4">
      <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center space-x-2 overflow-hidden">
          <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="truncate">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Your Location</div>
            <div className="text-xs font-semibold text-white truncate">Airport Residential Area, Accra (GPS: GA-112-409)</div>
          </div>
        </div>
        <button className="text-xs text-sky-400 font-semibold px-2 py-1 bg-sky-500/10 rounded-lg shrink-0 hover:bg-sky-500/20 cursor-pointer">
          Change
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
        <input 
          type="text" 
          placeholder="What do you need? (e.g. leaking tap)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl pl-9 pr-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
        <button 
          onClick={() => setBookingMode('now')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
            bookingMode === 'now' 
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Need someone now</span>
        </button>
        <button 
          onClick={() => setBookingMode('project')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
            bookingMode === 'project' 
              ? 'bg-sky-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Plan a project</span>
        </button>
      </div>

      <div>
        <div className="text-xs font-semibold text-slate-400 mb-2">Popular Emergency Categories</div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Plumbing', icon: Wrench, color: 'text-sky-400', bg: 'bg-sky-500/10' },
            { label: 'Electrical', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { label: 'Garden', icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
          ].map((cat, i) => (
            <button 
              key={i} 
              onClick={onNext}
              className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 p-3 rounded-2xl flex flex-col items-center justify-center gap-2 group transition cursor-pointer"
            >
              <div className={`p-2.5 rounded-xl ${cat.bg} ${cat.color} group-hover:scale-110 transition`}>
                <cat.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-slate-200">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300">Favorites & Rebook</span>
          <span className="text-[10px] text-sky-400 cursor-pointer">View all (3)</span>
        </div>
        <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-sky-400 border border-sky-500/30">
              KW
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Kwame Mensah</div>
              <div className="text-[10px] text-slate-400">Master Plumber • 4.9 ★ (84 jobs)</div>
            </div>
          </div>
          <button onClick={onNext} className="text-xs font-semibold px-2.5 py-1 bg-sky-600 text-white rounded-lg hover:bg-sky-500 transition cursor-pointer">
            Rebook
          </button>
        </div>
      </div>

      <div 
        onClick={onNext} 
        className="bg-gradient-to-r from-sky-900/60 to-blue-900/60 border border-sky-500/40 rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:border-sky-400 transition shadow-lg shadow-sky-950/40"
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <div className="w-3 h-3 rounded-full bg-sky-400"></div>
          </div>
          <div>
            <div className="text-xs font-bold text-white">Active Job: Leaking tap</div>
            <div className="text-[10px] text-sky-200">Kwame M. is on the way (ETA 12 mins)</div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-sky-400" />
      </div>
    </div>
  );
}

function OnDemandMap({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [landmarkNote, setLandmarkNote] = useState('Yellow gate near the pharmacy');
  const [hasPhoto, setHasPhoto] = useState(true);
  const [hasVoiceNote, setHasVoiceNote] = useState(true);

  return (
    <div className="flex flex-col h-full relative">
      <div className="h-64 w-full bg-slate-950 relative overflow-hidden flex items-center justify-center border-b border-slate-800">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-semibold text-slate-300 border border-slate-700">
          Pros nearby, with ETA
        </div>

        <div className="absolute top-12 left-16 flex items-center space-x-1 bg-slate-900/90 px-2 py-0.5 rounded-full border border-sky-500/50 shadow">
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          <span className="text-[9px] font-bold text-slate-200">K. Mensah (8m)</span>
        </div>

        <div className="absolute bottom-16 right-12 flex items-center space-x-1 bg-slate-900/90 px-2 py-0.5 rounded-full border border-slate-700">
          <div className="w-2 h-2 rounded-full bg-amber-400"></div>
          <span className="text-[9px] font-bold text-slate-300">Yaw B. (15m)</span>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="bg-sky-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg mb-1 animate-bounce">
            Drag pin, GPS code: GA-112-409
          </div>
          <div className="w-8 h-8 rounded-full bg-sky-500/30 flex items-center justify-center animate-pulse">
            <div className="w-4 h-4 bg-sky-500 rounded-full border-2 border-white shadow-xl"></div>
          </div>
        </div>

        <button 
          onClick={onBack}
          className="absolute top-3 right-3 p-2 bg-slate-900/80 rounded-full text-slate-300 border border-slate-700 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-3 bg-slate-900 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Leaking tap repair</h3>
            <p className="text-[11px] text-slate-400">Fixed call-out & diagnostics shown first</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Est. Total</span>
            <span className="text-base font-extrabold text-sky-400">GH₵ 120 - 180</span>
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Landmark Note</label>
          <input 
            type="text" 
            value={landmarkNote}
            onChange={(e) => setLandmarkNote(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => setHasPhoto(!hasPhoto)}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition cursor-pointer ${
              hasPhoto 
                ? 'bg-sky-500/10 border-sky-500/40 text-sky-300' 
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{hasPhoto ? 'Photo Added ✓' : 'Add Photo'}</span>
          </button>
          
          <button 
            onClick={() => setHasVoiceNote(!hasVoiceNote)}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition cursor-pointer ${
              hasVoiceNote 
                ? 'bg-sky-500/10 border-sky-500/40 text-sky-300' 
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{hasVoiceNote ? 'Voice Note (0:14) ✓' : 'Add Voice Note'}</span>
          </button>
        </div>

        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 flex items-center space-x-2">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-[10px] text-slate-400">
            Payment held in secure escrow until you confirm completion.
          </span>
        </div>

        <button 
          onClick={onNext}
          className="w-full py-3 bg-sky-600 hover:bg-sky-500 active:scale-[0.99] text-white font-bold rounded-2xl shadow-lg shadow-sky-600/30 transition text-sm flex items-center justify-center space-x-2 cursor-pointer"
        >
          <span>Request Pro Now</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function OnDemandTracking({ onBack }: { onBack: () => void }) {
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <div className="h-56 w-full bg-slate-950 relative overflow-hidden flex items-center justify-center border-b border-slate-800">
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <svg className="absolute inset-0 w-full h-full">
          <path 
            d="M 60 140 Q 180 40 310 120" 
            fill="none" 
            stroke="#0284c7" 
            strokeWidth="4" 
            strokeDasharray="6 6"
            className="animate-pulse"
          />
        </svg>

        <div className="absolute top-10 right-14 flex flex-col items-center">
          <div className="w-7 h-7 rounded-full bg-sky-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-lg">
            K
          </div>
          <span className="text-[9px] bg-slate-900/90 text-sky-400 px-1.5 py-0.5 rounded mt-1 border border-sky-500/40">
            Pro Moving
          </span>
        </div>

        <div className="absolute bottom-12 left-12 flex flex-col items-center">
          <div className="w-7 h-7 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-lg">
            <MapPin className="w-4 h-4" />
          </div>
          <span className="text-[9px] bg-slate-900/90 text-emerald-400 px-1.5 py-0.5 rounded mt-1 border border-emerald-500/40">
            Destination
          </span>
        </div>

        <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full border border-slate-700 text-[10px] font-bold text-white flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Pro on the way, ETA 12 mins</span>
        </div>
      </div>

      <div className="p-4 space-y-3 bg-slate-900 flex-1">
        <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-600 to-blue-500 flex items-center justify-center text-white font-bold text-base border-2 border-sky-400">
              KM
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-white">Kwame Mensah</span>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                  Gold Tier
                </span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center space-x-2 mt-0.5">
                <span className="flex items-center text-amber-400"><Star className="w-3 h-3 fill-amber-400 mr-0.5" /> 4.9</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">ID & Police Verified</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button className="py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer">
            <Phone className="w-3.5 h-3.5 text-sky-400" />
            <span>Call</span>
          </button>
          <button className="py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>Chat</span>
          </button>
          <button className="py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer">
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Share</span>
          </button>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-[11px] text-emerald-200">
            Arrival is GPS-verified automatically upon pro entering your radius.
          </span>
        </div>

        <div className="space-y-2">
          <button 
            onClick={() => setShowQuoteModal(!showQuoteModal)}
            className="w-full py-2.5 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 font-semibold border border-sky-500/40 rounded-xl text-xs flex items-center justify-center space-x-2 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Review the Quote on Arrival</span>
          </button>

          <button 
            onClick={onBack}
            className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30 rounded-xl text-xs flex items-center justify-center space-x-2 cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>SOS and Safety Tools</span>
          </button>
        </div>

        {showQuoteModal && (
          <div className="bg-slate-950 p-3 rounded-2xl border border-sky-500/50 space-y-2 mt-2">
            <div className="flex justify-between items-center text-xs font-bold text-white border-b border-slate-800 pb-1">
              <span>Diagnostic Quote #892</span>
              <span className="text-sky-400">GH₵ 150.00</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Includes: 1hr Labor (GH₵ 100) + Tap Washer Replacement Set (GH₵ 50).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 2. CLIENT: PROJECT BOOKING FLOW (3 SCREENS)
// ==========================================

function ProjectBrief({ onNext }: { onNext: () => void }) {
  const [activeProjectType, setActiveProjectType] = useState('POP Ceiling');
  const [roomSize, setRoomSize] = useState('3 Rooms (approx 45 sq meters)');
  const [budget, setBudget] = useState(3500);

  return (
    <div className="p-4 space-y-3">
      <div className="text-xs font-bold text-white">Plan a Project Brief</div>

      <div className="flex space-x-2 overflow-x-auto">
        {['POP Ceiling', 'Painting', 'Tiling', 'Roofing'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveProjectType(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
              activeProjectType === cat 
                ? 'bg-sky-600 text-white border border-sky-500' 
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Rooms and Size</label>
          <input 
            type="text" 
            value={roomSize} 
            onChange={(e) => setRoomSize(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Photos & Measurements</label>
          <div className="border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/60 rounded-xl p-3 text-center cursor-pointer transition">
            <Camera className="w-5 h-5 text-slate-500 mx-auto mb-1" />
            <span className="text-[11px] text-slate-400 block font-medium">Upload floorplan or room images</span>
            <span className="text-[9px] text-slate-500">2 photos attached (ceiling_damage.jpg)</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[10px] uppercase font-bold text-slate-400">Budget Range (GH₵)</label>
            <span className="text-xs font-extrabold text-sky-400">GH₵ {budget.toLocaleString()}</span>
          </div>
          <input 
            type="range" 
            min="1000" 
            max="10000" 
            step="500" 
            value={budget} 
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-sky-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-2 pt-1">
        <button 
          onClick={onNext}
          className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-sky-600/30 transition flex items-center justify-center space-x-2 cursor-pointer"
        >
          <span>Send to 3 Matched Pros</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        <button 
          onClick={onNext}
          className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold border border-slate-800 rounded-xl text-xs transition cursor-pointer"
        >
          Browse Catalogs & Shortlist
        </button>
      </div>

      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-[10px] text-slate-400 flex items-center space-x-2">
        <Info className="w-4 h-4 text-sky-400 shrink-0" />
        <span>Optional paid site visit (GH₵ 100), credited directly back to the job if hired.</span>
      </div>
    </div>
  );
}

function ProjectQuotes({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [selectedQuote, setSelectedQuote] = useState(1);

  const quotes = [
    {
      id: 1,
      pro: "Apex Ceiling Craft",
      tier: "Top Rated • Verified",
      labor: "GH₵ 1,800",
      materials: "GH₵ 1,400",
      total: "GH₵ 3,200",
      timeline: "3 Days",
      warranty: "1 Year Written Guarantee"
    },
    {
      id: 2,
      pro: "Kofi & Sons Renovations",
      tier: "Master Contractor",
      labor: "GH₵ 2,100",
      materials: "GH₵ 1,350",
      total: "GH₵ 3,450",
      timeline: "2 Days",
      warranty: "6 Months Warranty"
    }
  ];

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button onClick={onBack} className="text-slate-400 hover:text-white cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-white">Compare Quotes (2 Received)</span>
        </div>
        <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
          Escrow Protected
        </span>
      </div>

      <div className="space-y-2.5">
        {quotes.map((q) => (
          <div
            key={q.id}
            onClick={() => setSelectedQuote(q.id)}
            className={`p-3 rounded-2xl border transition cursor-pointer ${
              selectedQuote === q.id 
                ? 'bg-sky-950/40 border-sky-500 shadow-lg shadow-sky-950/50' 
                : 'bg-slate-950 border-slate-800 opacity-80 hover:opacity-100'
            }`}
          >
            <div className="flex justify-between items-start mb-1.5">
              <div>
                <h4 className="text-xs font-bold text-white">{q.pro}</h4>
                <span className="text-[9px] text-sky-400 font-semibold">{q.tier}</span>
              </div>
              <span className="text-sm font-extrabold text-sky-400">{q.total}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-900/60 p-2 rounded-xl border border-slate-800/60 my-2">
              <div><span className="text-slate-500">Labor:</span> <span className="text-slate-300 font-medium">{q.labor}</span></div>
              <div><span className="text-slate-500">Materials:</span> <span className="text-slate-300 font-medium">{q.materials}</span></div>
              <div><span className="text-slate-500">Timeline:</span> <span className="text-slate-300 font-medium">{q.timeline}</span></div>
              <div><span className="text-slate-500">Warranty:</span> <span className="text-slate-300 font-medium">{q.warranty}</span></div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center text-emerald-400"><ShieldCheck className="w-3 h-3 mr-1" /> Verified Trust Summary</span>
              {selectedQuote === q.id && <span className="text-sky-400 font-bold">Selected ✓</span>}
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={onNext}
        className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-2xl text-xs shadow-lg shadow-sky-600/30 transition flex items-center justify-center space-x-2 mt-4 cursor-pointer"
      >
        <span>Accept & Fund Escrow Deposit</span>
        <ChevronRight className="w-4 h-4" />
      </button>

      <p className="text-[9px] text-center text-slate-500">
        Funds released in 3 milestone stages upon your explicit approval.
      </p>
    </div>
  );
}

function ProjectMilestones({ onBack }: { onBack: () => void }) {
  const [currentStep, setCurrentStep] = useState(2);
  const [approved, setApproved] = useState(false);

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button onClick={onBack} className="text-slate-400 hover:text-white cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-white">POP Ceiling Project</span>
        </div>
        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
          Job #4092
        </span>
      </div>

      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex justify-between text-[10px] font-bold">
          <span className={currentStep >= 1 ? 'text-sky-400' : 'text-slate-500'}>Deposit 40%</span>
          <span className={currentStep >= 2 ? 'text-sky-400' : 'text-slate-500'}>Midway 40%</span>
          <span className={currentStep >= 3 ? 'text-sky-400' : 'text-slate-500'}>Sign-off 20%</span>
        </div>
        <div className="flex h-2 bg-slate-900 rounded-full overflow-hidden space-x-1 p-0.5 border border-slate-800">
          <div className="w-[40%] bg-sky-500 rounded-full"></div>
          <div className={`w-[40%] ${currentStep >= 2 ? 'bg-sky-500' : 'bg-slate-800'} rounded-full transition-all`}></div>
          <div className={`w-[20%] ${currentStep >= 3 ? 'bg-sky-500' : 'bg-slate-800'} rounded-full transition-all`}></div>
        </div>
      </div>

      <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-bold text-white">Milestone 2 Sign-off (Midway Framework)</h4>
          <span className="text-[10px] text-sky-400 font-bold">GH₵ 1,280.00</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 text-center">
            <div className="h-20 bg-slate-800 rounded-lg mb-1 flex items-center justify-center text-[10px] text-slate-400 border border-slate-700/50">
              [ Before Photo ]
            </div>
            <span className="text-[9px] text-slate-400 block font-medium">Damaged Drywall</span>
          </div>
          <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 text-center">
            <div className="h-20 bg-emerald-950/40 rounded-lg mb-1 flex items-center justify-center text-[10px] text-emerald-400 border border-emerald-500/30 font-bold">
              [ After Photo ]
            </div>
            <span className="text-[9px] text-emerald-400 block font-medium">Framework Complete</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 flex items-center space-x-1.5 bg-slate-900 p-2 rounded-xl border border-slate-800">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>GPS check-in verified on site by Pro at 10:14 AM</span>
        </div>
      </div>

      <div className="space-y-2 pt-1">
        <button 
          onClick={() => {
            setApproved(true);
            setCurrentStep(3);
          }}
          className={`w-full py-3 font-bold rounded-2xl text-xs transition flex items-center justify-center space-x-2 cursor-pointer ${
            approved 
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' 
              : 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/30'
          }`}
        >
          <Check className="w-4 h-4" />
          <span>{approved ? 'Milestone Approved & Released ✓' : 'Approve & Release Milestone 2'}</span>
        </button>

        <button className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-xl text-xs font-semibold transition cursor-pointer">
          Report a Problem with this stage
        </button>
      </div>

      <p className="text-[9px] text-center text-slate-500">
        Funds held securely in escrow until explicit client approval.
      </p>
    </div>
  );
}

// ==========================================
// 3. PRO APP FLOW (3 SCREENS)
// ==========================================

function ProJobInbox({ onNext }: { onNext: () => void }) {
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState('Now');
  const [timerSeconds, setTimerSeconds] = useState(45);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds(prev => (prev > 0 ? prev - 1 : 45));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 space-y-3">
      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Earnings Today</div>
          <div className="text-base font-extrabold text-emerald-400">GH₵ 450.00</div>
        </div>

        <button 
          onClick={() => setIsOnline(!isOnline)}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border transition cursor-pointer ${
            isOnline 
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' 
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}
        >
          <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></div>
          <span className="text-xs font-bold">{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
        </button>
      </div>

      <div className="flex space-x-1 border-b border-slate-800 pb-2">
        {['Now', 'Scheduled', 'Projects', 'Done'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === tab 
                ? 'bg-sky-600 text-white' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-slate-950 p-3.5 rounded-2xl border border-sky-500/60 shadow-xl shadow-sky-950/40 space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-sky-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">
          Emergency Dispatch
        </div>

        <div className="flex justify-between items-start pt-1">
          <div>
            <h4 className="text-sm font-bold text-white">Leaking Tap Repair</h4>
            <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
              <span>2.4 km away</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">Call-out: GH₵ 60</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Client: <span className="text-slate-200 font-medium">Abena S. ★ 4.8</span>
            </div>
          </div>

          <div className="w-11 h-11 rounded-full bg-slate-900 border-2 border-sky-500 flex items-center justify-center font-extrabold text-sky-400 text-xs shadow-inner">
            {timerSeconds}s
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 text-[10px] text-slate-300 flex items-center space-x-1.5">
            <Camera className="w-3.5 h-3.5 text-sky-400" />
            <span>Tap_Leak.png</span>
          </div>
          <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 text-[10px] text-slate-300 flex items-center space-x-1.5">
            <Mic className="w-3.5 h-3.5 text-amber-400" />
            <span>Voice note (0:14)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button className="py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl border border-slate-800 text-xs transition cursor-pointer">
            Decline
          </button>
          <button 
            onClick={onNext}
            className="py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-sky-600/30 transition flex items-center justify-center space-x-1 cursor-pointer"
          >
            <span>Accept Job</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-[9px] text-center text-slate-500">
        Alerts also sent via instant SMS & WhatsApp push notifications.
      </p>
    </div>
  );
}

function ProQuoteBuilder({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [labor, setLabor] = useState(100);
  const [materials, setMaterials] = useState(50);

  const total = Number(labor) + Number(materials);

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center space-x-2">
        <button onClick={onBack} className="text-slate-400 hover:text-white cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-bold text-white">Build Diagnostic Quote</span>
      </div>

      <div className="border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-950 p-3 rounded-2xl text-center cursor-pointer">
        <Camera className="w-5 h-5 text-sky-400 mx-auto mb-1" />
        <span className="text-[11px] font-semibold text-slate-300 block">Add On-Site Assessment Photo</span>
        <span className="text-[9px] text-slate-500">Snap broken pipe or faulty wiring prior to repair</span>
      </div>

      <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-3">
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Labor Cost (GH₵)</label>
          <input 
            type="number" 
            value={labor} 
            onChange={(e) => setLabor(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-semibold"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Materials (Itemized GH₵)</label>
          <input 
            type="number" 
            value={materials} 
            onChange={(e) => setMaterials(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-semibold"
          />
        </div>

        <div className="border-t border-slate-800 pt-2 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-300">Total Quote Amount</span>
          <span className="text-base font-extrabold text-sky-400">GH₵ {total.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
        <div className="text-[10px] uppercase font-bold text-slate-400">Staged Milestones (Projects Only)</div>
        <div className="flex justify-between text-[10px] font-semibold bg-slate-900 p-2 rounded-xl border border-slate-800 text-slate-300">
          <span>Deposit: 40%</span>
          <span>Midway: 40%</span>
          <span>Sign-off: 20%</span>
        </div>
        <p className="text-[9px] text-slate-500">Client approves each phase before funds release.</p>
      </div>

      <button 
        onClick={onNext}
        className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-2xl text-xs shadow-lg shadow-sky-600/30 transition flex items-center justify-center space-x-2 cursor-pointer"
      >
        <Send className="w-4 h-4" />
        <span>Send Quote to Client</span>
      </button>
    </div>
  );
}

function ProWallet({ onBack }: { onBack: () => void }) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button onClick={onBack} className="text-slate-400 hover:text-white cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-white">Earnings & Wallet</span>
        </div>
        <span className="text-[10px] text-sky-400 font-semibold">MTN MoMo Linked</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-center">
          <span className="text-[9px] text-slate-400 block font-medium">Pending</span>
          <span className="text-xs font-bold text-amber-400">GH₵ 320</span>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-center">
          <span className="text-[9px] text-slate-400 block font-medium">Available</span>
          <span className="text-xs font-bold text-emerald-400">GH₵ 1,150</span>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-center">
          <span className="text-[9px] text-slate-400 block font-medium">Paid Out</span>
          <span className="text-xs font-bold text-slate-300">GH₵ 4,800</span>
        </div>
      </div>

      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1.5 text-[11px]">
        <div className="text-xs font-bold text-white border-b border-slate-800 pb-1">
          Recent Job Breakdown (#892)
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Job Price Gross</span>
          <span className="text-slate-200">GH₵ 150.00</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Fixly Commission (10%)</span>
          <span className="text-rose-400">- GH₵ 15.00</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Guarantee Pool Contrib. (2%)</span>
          <span className="text-rose-400">- GH₵ 3.00</span>
        </div>
        <div className="flex justify-between font-bold border-t border-slate-800 pt-1.5 text-white">
          <span>Net Payout</span>
          <span className="text-emerald-400">GH₵ 132.00</span>
        </div>
      </div>

      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-white">Next Tier: Platinum Master Pro</span>
          <span className="text-[10px] text-sky-400 font-bold">85%</span>
        </div>
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 h-full rounded-full w-[85%]"></div>
        </div>
        <p className="text-[9px] text-slate-400">
          5 more completed jobs with 4.8+ rating needed to unlock higher claim limit (GH₵ 10,000).
        </p>
      </div>

      <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs shadow-lg shadow-emerald-600/30 transition flex items-center justify-center space-x-2 cursor-pointer">
        <DollarSign className="w-4 h-4" />
        <span>Cash Out to Mobile Money (MoMo)</span>
      </button>

      <p className="text-[9px] text-center text-slate-500">
        Instant transfer or free next-day automated payout.
      </p>
    </div>
  );
}

// ==========================================
// 4. TRUST AND SAFETY FLOW (3 SCREENS)
// ==========================================

function TrustProfile({ onNext }: { onNext: () => void }) {
  return (
    <div className="p-4 space-y-3">
      <div className="bg-slate-950 p-4 rounded-3xl border border-slate-800 text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-600 to-blue-500 mx-auto flex items-center justify-center text-white font-bold text-xl border-4 border-slate-900 shadow-xl mb-2">
          KM
        </div>
        <h3 className="text-sm font-bold text-white">Kwame Mensah</h3>
        <div className="inline-block bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[9px] font-bold px-2 py-0.5 rounded-full mt-0.5">
          Gold Certified Artisan
        </div>

        <div className="grid grid-cols-3 gap-1.5 mt-3">
          <div className="bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-[9px] font-semibold text-emerald-400">
            ✓ ID Verified
          </div>
          <div className="bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-[9px] font-semibold text-amber-400">
            ✓ Guarantor
          </div>
          <div className="bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-[9px] font-semibold text-sky-400">
            ✓ Insured
          </div>
        </div>
      </div>

      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1.5 text-[11px]">
        <div className="flex justify-between text-slate-400">
          <span>Jobs on Fixly app</span>
          <span className="text-slate-200 font-bold">142 jobs</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>On-time arrival rate</span>
          <span className="text-emerald-400 font-bold">98.5%</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Claims in last 12 months</span>
          <span className="text-slate-200 font-bold">0 claims</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Problem Resolution Rate</span>
          <span className="text-emerald-400 font-bold">100% Solved</span>
        </div>
      </div>

      <div>
        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">Verified Job Proof</div>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((img) => (
            <div key={img} className="h-16 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center text-[9px] text-slate-500">
              [ Photo #{img} ]
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={onNext}
        className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-2xl text-xs shadow-lg shadow-sky-600/30 transition flex items-center justify-center space-x-2 cursor-pointer"
      >
        <span>Rebook Kwame Mensah</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function ReportProblem({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [reason, setReason] = useState('Poor workmanship');
  const [desiredOutcome, setDesiredOutcome] = useState('Part refund');

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center space-x-2">
        <button onClick={onBack} className="text-slate-400 hover:text-white cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-bold text-white">Report a Problem</span>
      </div>

      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Select Issue Category</label>
        {[
          'Not completed', 
          'Poor workmanship', 
          'Damage to property', 
          'Overcharge', 
          'No-show', 
          'Safety concern'
        ].map((item) => (
          <label 
            key={item}
            onClick={() => setReason(item)}
            className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800/80 cursor-pointer text-xs text-slate-200"
          >
            <span>{item}</span>
            <input 
              type="radio" 
              name="reason" 
              checked={reason === item} 
              onChange={() => {}}
              className="accent-sky-500"
            />
          </label>
        ))}
      </div>

      <div>
        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Evidence (Photos or Video)</label>
        <div className="border-2 border-dashed border-slate-800 bg-slate-950 p-2.5 rounded-xl text-center text-slate-400 text-xs cursor-pointer">
          <Camera className="w-4 h-4 mx-auto mb-1 text-slate-500" />
          <span>Upload photo proof of damage or work</span>
        </div>
      </div>

      <div>
        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Desired Outcome</label>
        <div className="grid grid-cols-3 gap-1.5">
          {['Redo work', 'Part refund', 'Full refund'].map((outcome) => (
            <button
              key={outcome}
              onClick={() => setDesiredOutcome(outcome)}
              className={`py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                desiredOutcome === outcome 
                  ? 'bg-sky-600 text-white border border-sky-500' 
                  : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              {outcome}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-[10px] text-amber-200 flex items-center space-x-2">
        <Lock className="w-4 h-4 shrink-0 text-amber-400" />
        <span>Payment is frozen immediately during dispute review. Pro must reply within 24 hours.</span>
      </div>

      <button 
        onClick={onNext}
        className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-2xl text-xs shadow-lg shadow-sky-600/30 transition flex items-center justify-center space-x-2 cursor-pointer"
      >
        <span>Submit Dispute Report</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function SafetySOS({ onBack }: { onBack: () => void }) {
  const [sosActivated, setSosActivated] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<string | null>(null);

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button onClick={onBack} className="text-slate-400 hover:text-white cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-white">Job in Progress Safety</span>
        </div>
        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
          Live Monitored
        </span>
      </div>

      <button className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-200 font-semibold border border-slate-800 rounded-2xl text-xs flex items-center justify-center space-x-2 cursor-pointer">
        <Share2 className="w-3.5 h-3.5 text-sky-400" />
        <span>Share Live Job Status with Trusted Contact</span>
      </button>

      <div className="bg-slate-950 p-5 rounded-3xl border border-rose-500/40 text-center space-y-3 shadow-xl shadow-rose-950/30">
        <button 
          onClick={() => setSosActivated(!sosActivated)}
          className={`w-28 h-28 rounded-full mx-auto flex flex-col items-center justify-center font-black text-xl text-white shadow-2xl transition transform active:scale-95 cursor-pointer ${
            sosActivated 
              ? 'bg-rose-600 border-4 border-rose-300 animate-ping' 
              : 'bg-gradient-to-tr from-rose-600 to-red-500 border-4 border-rose-400/50 hover:scale-105'
          }`}
        >
          <span>SOS</span>
          <span className="text-[8px] font-normal tracking-widest uppercase mt-0.5">EMERGENCY</span>
        </button>

        <p className="text-[10px] text-slate-400 max-w-[220px] mx-auto">
          {sosActivated 
            ? '🚨 DISPATCH ALERT SENT! Ops center & local responders alerted with your live GPS location.' 
            : 'Instantly alerts safety operations team and shares your live GPS location.'}
        </p>

        <button className="text-[11px] text-slate-400 hover:text-slate-200 font-semibold underline block mx-auto cursor-pointer">
          Silent SOS (Discreet dispatch without sound)
        </button>
      </div>

      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
        <div className="text-[11px] font-bold text-white text-center">
          Automated Check-in Prompt: "Are you okay?"
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => setCheckInStatus('ok')}
            className={`py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
              checkInStatus === 'ok' 
                ? 'bg-emerald-600 text-white border-emerald-500' 
                : 'bg-slate-900 border-slate-800 text-emerald-400 hover:bg-slate-800'
            }`}
          >
            I am OK ✓
          </button>
          
          <button 
            onClick={() => setCheckInStatus('help')}
            className={`py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
              checkInStatus === 'help' 
                ? 'bg-rose-600 text-white border-rose-500' 
                : 'bg-slate-900 border-slate-800 text-rose-400 hover:bg-slate-800'
            }`}
          >
            Need Help
          </button>
        </div>
      </div>
    </div>
  );
}
