import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ViewSkeleton, useViewLoader } from '../components/Shared';
import { FileText, Download, Calendar, TrendingUp, TrendingDown, Users, ShoppingCart, Clock, AlertTriangle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const PAST_REPORTS = [
  { id: 'RPT-003', title: 'Weekly Summary — W37 2026', date: 'Sep 21, 2026', size: '1.2 MB' },
  { id: 'RPT-002', title: 'Weekly Summary — W36 2026', date: 'Sep 14, 2026', size: '1.0 MB' },
  { id: 'RPT-001', title: 'Weekly Summary — W35 2026', date: 'Sep 7, 2026',  size: '0.9 MB' },
];

const StatLine = ({ icon: Icon, label, value, up, note }) => (
  <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 bg-surface-light rounded-lg flex items-center justify-center shrink-0">
        <Icon size={14} className="text-indigo-400" />
      </div>
      <span className="text-sm text-slate-300">{label}</span>
    </div>
    <div className="flex items-center gap-3">
      <span className="font-bold font-mono text-slate-100 tabular-nums">{value}</span>
      {up !== undefined && (
        up
          ? <span className="chip-up"><TrendingUp size={10} /> vs last week</span>
          : <span className="chip-down"><TrendingDown size={10} /> vs last week</span>
      )}
      {note && <span className="text-[11px] text-slate-500">{note}</span>}
    </div>
  </div>
);

export const ReportsView = () => {
  const { data } = useAppContext();
  const { addToast } = useToast();
  const isLoaded = useViewLoader(400);

  const { storeContext, funnel } = data;
  const conversionRate = ((funnel.purchased / funnel.entered) * 100).toFixed(1);

  const handleExport = () => {
    addToast('Weekly report exported as PDF', 'success');
  };

  const handleDownloadPast = (report) => {
    addToast(`Downloading ${report.title}…`, 'info');
  };

  if (!isLoaded) return <ViewSkeleton />;

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-accent/15 text-indigo-400 rounded-lg">
            <FileText size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-widest">Auto-Generated Reports</h2>
            <p className="text-xs text-slate-500 mt-0.5">AI-compiled weekly performance summaries</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <Calendar size={12} />
          <span>Week 38, 2026 &nbsp;·&nbsp; Sep 15 – Sep 21</span>
        </div>
      </div>

      {/* Current week summary card */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-100 text-sm">Weekly Summary — W38 2026</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Store 042 · Bangalore · Auto-generated</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-indigo-accent/30 text-indigo-400 hover:bg-indigo-accent/8 transition-colors"
          >
            <Download size={13} /> Export PDF
          </button>
        </div>

        {/* KPI grid */}
        <div className="px-5 py-2">
          <StatLine icon={Users}         label="Total Footfall"          value={`${storeContext.entriesToday.toLocaleString()} visitors`} up={true}  />
          <StatLine icon={ShoppingCart}  label="Conversion Rate"         value={`${conversionRate}%`}                                     up={false} />
          <StatLine icon={AlertTriangle} label="Stock-out Revenue Lost"  value="₹17,800"                                                  up={false} note="2 SKUs" />
          <StatLine icon={Clock}         label="Avg Queue Wait Time"     value="4.5 min"                                                  up={true}  />
        </div>

        {/* Commentary */}
        <div className="px-5 py-4 border-t border-border">
          <h4 className="text-[11px] uppercase tracking-widest font-semibold text-slate-500 mb-3">AI Commentary</h4>
          <div className="flex flex-col gap-2.5 text-sm text-slate-300 leading-relaxed">
            <p>
              This week, Store 042 (Bangalore) recorded <span className="font-semibold text-slate-100">{storeContext.entriesToday.toLocaleString()} visitors</span>, a 2.1% increase from last week — driven primarily by a weekend footfall spike on Saturday between 15:00–18:00.
              Despite higher traffic, conversion dipped to <span className="font-semibold text-slate-100">{conversionRate}%</span> due to two out-of-stock incidents in high-traffic zones (Produce B1 and Dairy A2).
            </p>
            <p>
              The longest stock-out event was <span className="text-rose-400 font-semibold">Organic Bananas (Produce B1) — 14 hours total</span>, contributing an estimated ₹12,500 in lost revenue.
              Restocking was actioned at 10:43 on Monday after an automated alert was raised. Reorder lead-time can be reduced by 40% if a standing purchase order is pre-authorized with Reliance Fresh Supply.
            </p>
            <p>
              Queue performance improved week-over-week: Counter 3 was opened proactively during peak hours based on AI recommendations, reducing average wait from 6.1 min to 4.5 min.
              Recommend maintaining the same counter schedule next week given a predicted 5% footfall increase over the upcoming festival period.
            </p>
          </div>
        </div>
      </div>

      {/* Past reports */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Report Archive</h3>
        </div>
        <div className="divide-y divide-border/40">
          {PAST_REPORTS.map(report => (
            <div key={report.id} className="px-5 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-surface-light rounded-lg flex items-center justify-center">
                  <FileText size={15} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">{report.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{report.date} &nbsp;·&nbsp; {report.size}</p>
                </div>
              </div>
              <button
                onClick={() => handleDownloadPast(report)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-border text-slate-400 hover:text-slate-200 hover:border-slate-400 transition-colors"
              >
                <Download size={12} /> Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
