import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import {
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Info,
  Clock,
  CheckCircle2,
  Download,
  Filter,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

interface DailyData {
  day: string;
  fullDate: string;
  earnings: number;
  jobsCount: number;
  payoutStatus: 'Completed' | 'Pending Escrow' | 'Scheduled';
}

interface WeeklyData {
  week: string;
  range: string;
  earnings: number;
  jobsCount: number;
  commission: number;
}

const DAILY_STATS: DailyData[] = [
  { day: 'Mon', fullDate: 'Oct 27', earnings: 380, jobsCount: 3, payoutStatus: 'Completed' },
  { day: 'Tue', fullDate: 'Oct 28', earnings: 520, jobsCount: 4, payoutStatus: 'Completed' },
  { day: 'Wed', fullDate: 'Oct 29', earnings: 290, jobsCount: 2, payoutStatus: 'Completed' },
  { day: 'Thu', fullDate: 'Oct 30', earnings: 640, jobsCount: 5, payoutStatus: 'Completed' },
  { day: 'Fri', fullDate: 'Oct 31', earnings: 810, jobsCount: 6, payoutStatus: 'Completed' },
  { day: 'Sat', fullDate: 'Nov 01', earnings: 450, jobsCount: 3, payoutStatus: 'Completed' },
  { day: 'Sun', fullDate: 'Nov 02 (Today)', earnings: 320, jobsCount: 2, payoutStatus: 'Pending Escrow' },
];

const WEEKLY_STATS: WeeklyData[] = [
  { week: 'Week 1', range: 'Oct 06 - Oct 12', earnings: 2450, jobsCount: 18, commission: 367.5 },
  { week: 'Week 2', range: 'Oct 13 - Oct 19', earnings: 3120, jobsCount: 22, commission: 468.0 },
  { week: 'Week 3', range: 'Oct 20 - Oct 26', earnings: 2890, jobsCount: 20, commission: 433.5 },
  { week: 'Week 4', range: 'Oct 27 - Nov 02', earnings: 3410, jobsCount: 25, commission: 511.5 },
];

export const ProFinancialInsights: React.FC = () => {
  const { currentUser } = useMarketplace();
  const pro = currentUser.proProfile;

  const [timeframe, setTimeframe] = useState<'daily' | 'weekly'>('daily');
  const [selectedBar, setSelectedBar] = useState<DailyData | WeeklyData | null>(DAILY_STATS[6]);
  const [weeklyGoal, setWeeklyGoal] = useState<number>(4000);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Render D3.js Chart
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Clear previous elements
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const containerWidth = containerRef.current.clientWidth || 600;
    const height = 260;
    const margin = { top: 25, right: 20, bottom: 45, left: 55 };
    const width = containerWidth - margin.left - margin.right;

    const g = svg
      .attr('width', containerWidth)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    if (timeframe === 'daily') {
      const x = d3
        .scaleBand()
        .range([0, width])
        .domain(DAILY_STATS.map((d) => d.day))
        .padding(0.35);

      const maxEarnings = d3.max(DAILY_STATS, (d) => d.earnings) || 1000;
      const y = d3
        .scaleLinear()
        .range([height - margin.top - margin.bottom, 0])
        .domain([0, Math.ceil(maxEarnings / 100) * 100]);

      // Gridlines
      g.append('g')
        .attr('class', 'grid')
        .call(
          d3
            .axisLeft(y)
            .ticks(5)
            .tickSize(-width)
            .tickFormat(() => '')
        )
        .selectAll('line')
        .attr('stroke', '#f1f5f9')
        .attr('stroke-dasharray', '3,3');

      // X Axis
      g.append('g')
        .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('font-weight', '700')
        .attr('font-size', '11px')
        .attr('fill', '#475569');

      // Y Axis
      g.append('g')
        .call(
          d3.axisLeft(y).ticks(5).tickFormat((d) => `GH₵${d}`)
        )
        .selectAll('text')
        .attr('font-weight', '700')
        .attr('font-size', '10px')
        .attr('fill', '#64748b');

      // Remove default domain lines for clean look
      g.selectAll('.domain').attr('stroke', '#cbd5e1');
      g.selectAll('.tick line').attr('stroke', '#e2e8f0');

      // Bars
      g.selectAll('.bar')
        .data(DAILY_STATS)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (d) => x(d.day) || 0)
        .attr('width', x.bandwidth())
        .attr('y', height - margin.top - margin.bottom)
        .attr('height', 0)
        .attr('rx', 6)
        .attr('fill', (d) =>
          d.payoutStatus === 'Pending Escrow'
            ? '#f59e0b'
            : d.day === 'Sun'
            ? '#3b82f6'
            : '#10b981'
        )
        .attr('cursor', 'pointer')
        .on('click', (_, d) => setSelectedBar(d))
        .on('mouseover', function () {
          d3.select(this).attr('opacity', 0.82);
        })
        .on('mouseout', function () {
          d3.select(this).attr('opacity', 1.0);
        })
        .transition()
        .duration(700)
        .attr('y', (d) => y(d.earnings))
        .attr('height', (d) => height - margin.top - margin.bottom - y(d.earnings));

      // Value labels above bars
      g.selectAll('.label')
        .data(DAILY_STATS)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', (d) => (x(d.day) || 0) + x.bandwidth() / 2)
        .attr('y', (d) => y(d.earnings) - 6)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('font-weight', '800')
        .attr('fill', '#1e293b')
        .text((d) => `GH₵${d.earnings}`);

    } else {
      // Weekly View
      const x = d3
        .scaleBand()
        .range([0, width])
        .domain(WEEKLY_STATS.map((d) => d.week))
        .padding(0.4);

      const maxEarnings = d3.max(WEEKLY_STATS, (d) => d.earnings) || 4000;
      const y = d3
        .scaleLinear()
        .range([height - margin.top - margin.bottom, 0])
        .domain([0, Math.ceil(maxEarnings / 500) * 500]);

      // Gridlines
      g.append('g')
        .attr('class', 'grid')
        .call(
          d3
            .axisLeft(y)
            .ticks(5)
            .tickSize(-width)
            .tickFormat(() => '')
        )
        .selectAll('line')
        .attr('stroke', '#f1f5f9')
        .attr('stroke-dasharray', '3,3');

      // X Axis
      g.append('g')
        .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('font-weight', '700')
        .attr('font-size', '11px')
        .attr('fill', '#475569');

      // Y Axis
      g.append('g')
        .call(
          d3.axisLeft(y).ticks(5).tickFormat((d) => `GH₵${d}`)
        )
        .selectAll('text')
        .attr('font-weight', '700')
        .attr('font-size', '10px')
        .attr('fill', '#64748b');

      g.selectAll('.domain').attr('stroke', '#cbd5e1');

      // Bars
      g.selectAll('.bar')
        .data(WEEKLY_STATS)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (d) => x(d.week) || 0)
        .attr('width', x.bandwidth())
        .attr('y', height - margin.top - margin.bottom)
        .attr('height', 0)
        .attr('rx', 6)
        .attr('fill', '#0f172a')
        .attr('cursor', 'pointer')
        .on('click', (_, d) => setSelectedBar(d))
        .on('mouseover', function () {
          d3.select(this).attr('fill', '#f59e0b');
        })
        .on('mouseout', function () {
          d3.select(this).attr('fill', '#0f172a');
        })
        .transition()
        .duration(700)
        .attr('y', (d) => y(d.earnings))
        .attr('height', (d) => height - margin.top - margin.bottom - y(d.earnings));

      // Value labels above bars
      g.selectAll('.label')
        .data(WEEKLY_STATS)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', (d) => (x(d.week) || 0) + x.bandwidth() / 2)
        .attr('y', (d) => y(d.earnings) - 6)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('font-weight', '800')
        .attr('fill', '#1e293b')
        .text((d) => `GH₵${d.earnings}`);
    }
  }, [timeframe]);

  const totalThisWeek = DAILY_STATS.reduce((acc, curr) => acc + curr.earnings, 0);
  const totalJobsThisWeek = DAILY_STATS.reduce((acc, curr) => acc + curr.jobsCount, 0);
  const progressPercent = Math.min(100, Math.round((totalThisWeek / weeklyGoal) * 100));

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Overview Metric Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            This Week's Net Revenue
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-mono text-2xl font-black text-slate-900">
              GH₵ {totalThisWeek.toLocaleString()}.00
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              +18.4%
            </span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {totalJobsThisWeek} jobs completed in Accra
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Escrow Protection Release
          </span>
          <span className="font-mono text-2xl font-black text-amber-600 block mt-1">
            GH₵ 320.00
          </span>
          <span className="text-[10px] text-slate-500 mt-1 block flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            Unlocks in 14 hours
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Weekly Goal Target
          </span>
          <span className="font-mono text-2xl font-black text-slate-900 block mt-1">
            {progressPercent}%
          </span>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
              Instant MoMo Payouts
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="font-mono text-xl font-bold text-emerald-400 block">
              GH₵ {pro?.walletAvailable || 500}.00 Ready
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              0% Fee for Next-Day Transfer
            </span>
          </div>
        </div>
      </div>

      {/* D3.js Visual Earnings Chart Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-extrabold text-slate-900">
                Interactive D3.js Earnings & Volume Visualization
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any bar to inspect daily job count, escrow holds, and net payout schedule.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setTimeframe('daily')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeframe === 'daily'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daily View (Mon-Sun)
            </button>
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeframe === 'weekly'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Weeks (W1-W4)
            </button>
          </div>
        </div>

        {/* D3 SVG Canvas Container */}
        <div ref={containerRef} className="w-full bg-slate-50/60 p-3 rounded-xl border border-slate-200 overflow-x-auto">
          <svg ref={svgRef} className="w-full overflow-visible"></svg>
        </div>

        {/* Selected Bar Details Drawer */}
        {selectedBar && (
          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white font-extrabold flex items-center justify-center font-mono text-sm">
                {'day' in selectedBar ? selectedBar.day : selectedBar.week}
              </div>
              <div>
                <span className="font-extrabold text-slate-900 block">
                  {'fullDate' in selectedBar ? selectedBar.fullDate : selectedBar.range}
                </span>
                <span className="text-slate-600 text-[11px]">
                  {selectedBar.jobsCount} completed repair jobs · Net Payout:{' '}
                  <strong className="text-emerald-700">
                    GH₵ {Math.round(selectedBar.earnings * 0.825)}.00
                  </strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-500">Gross:</span>
              <span className="font-extrabold text-slate-900">GH₵ {selectedBar.earnings}.00</span>
              <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-sans font-bold text-[10px]">
                {'payoutStatus' in selectedBar ? selectedBar.payoutStatus : 'Settled'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Payout Schedule Timeline & MoMo Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Payout Schedule Timeline */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>Upcoming Payout Schedule</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Accra Escrow Rule</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block">Friday Oct 31 Batch</span>
                  <span className="text-[10px] text-slate-500">Auto-sent to MTN MoMo (+233 24 981 0023)</span>
                </div>
              </div>
              <span className="font-mono font-bold text-slate-900">GH₵ 810.00</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block">Saturday Nov 01 Batch</span>
                  <span className="text-[10px] text-slate-500">Auto-sent to Telecel Cash</span>
                </div>
              </div>
              <span className="font-mono font-bold text-slate-900">GH₵ 450.00</span>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-spin" />
                <div>
                  <span className="font-bold text-amber-950 block">Sunday Nov 02 (In Escrow Hold)</span>
                  <span className="text-[10px] text-amber-800">Releases tomorrow 08:00 AM</span>
                </div>
              </div>
              <span className="font-mono font-bold text-amber-900">GH₵ 320.00</span>
            </div>
          </div>
        </div>

        {/* Fee & Insurance Deduction breakdown */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-600" />
              <span>Revenue Deductions & Pool</span>
            </h3>
            <button className="text-[11px] font-bold text-amber-600 hover:underline flex items-center gap-1 cursor-pointer">
              <Download className="w-3 h-3" />
              <span>Tax Statement</span>
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 text-slate-700">
              <span>Gross Artisan Revenue (This Week)</span>
              <span className="font-mono font-bold text-slate-900">
                GH₵ {totalThisWeek}.00
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100 text-slate-600">
              <span>Fixly Platform Commission (15%)</span>
              <span className="font-mono font-bold text-rose-600">
                - GH₵ {Math.round(totalThisWeek * 0.15)}.00
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100 text-slate-600">
              <span>Workmanship Guarantee Pool (2.5%)</span>
              <span className="font-mono font-bold text-amber-700">
                - GH₵ {Math.round(totalThisWeek * 0.025)}.00
              </span>
            </div>

            <div className="flex items-center justify-between py-2.5 text-slate-900 font-extrabold">
              <span>Net Take-Home (MoMo Wallet)</span>
              <span className="font-mono text-sm text-emerald-600">
                GH₵ {Math.round(totalThisWeek * 0.825)}.00
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
