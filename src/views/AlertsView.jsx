import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { StatusIndicator, ViewSkeleton, useViewLoader } from '../components/Shared';
import { BellRing, CheckCircle2, Tag, User } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const STAFF = ['Ravi K.', 'Priya M.', 'Suresh T.', 'Ananya R.'];

const SEVERITY_ORDER = { critical: 0, warning: 1, ok: 2 };

const TYPE_LABELS = {
  stockout: 'Stockout',
  queue:    'Queue',
  shelf:    'Shelf',
  assist:   'Assist',
  device:   'Device',
  anomaly:  'Anomaly',
};

const TYPE_FILTERS = ['All', ...Object.keys(TYPE_LABELS).map(k => TYPE_LABELS[k])];

/* ─── Alert row ──────────────────────────────────────────────────── */
const AlertRow = ({ alert, onResolve, onAssign }) => (
  <div className={`bg-surface border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-4 transition-colors ${
    alert.resolved ? 'border-border opacity-50' : 'border-border hover:bg-white/[0.03]'
  }`}>
    {/* Severity + type */}
    <div className="flex items-center gap-2.5 min-w-[180px] shrink-0">
      <StatusIndicator status={alert.severity === 'ok' ? 'healthy' : alert.severity} />
      <span className="text-[11px] font-semibold text-slate-500 uppercase bg-surface-light px-2 py-0.5 rounded border border-border">
        {TYPE_LABELS[alert.type] ?? alert.type}
      </span>
    </div>

    {/* Message */}
    <div className="flex-1 min-w-0">
      <p className="text-slate-200 text-sm leading-snug">{alert.message}</p>
      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
        <span className="flex items-center gap-1"><Tag size={10} /> {alert.zone}</span>
        <span>{alert.timestamp}</span>
        {alert.resolved && <span className="text-emerald-400 font-medium">Resolved</span>}
      </div>
    </div>

    {/* Assignee */}
    <div className="flex items-center gap-2 shrink-0">
      <User size={12} className="text-slate-500" />
      <select
        value={alert.assignee ?? ''}
        onChange={(e) => onAssign(alert.id, e.target.value || null)}
        disabled={alert.resolved}
        className="bg-background text-slate-300 text-xs border border-border rounded-lg px-2 py-1.5 h-8 focus:outline-none focus:border-indigo-accent/50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <option value="">Unassigned</option>
        {STAFF.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>

    {/* Resolve */}
    <div className="shrink-0">
      {alert.resolved ? (
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium px-3 py-1.5 rounded border border-emerald-500/20 bg-emerald-500/8">
          <CheckCircle2 size={12} /> Resolved
        </div>
      ) : (
        <button
          onClick={() => onResolve(alert.id)}
          className="text-xs font-semibold px-3 py-1.5 rounded border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/8 transition-colors"
        >
          Resolve
        </button>
      )}
    </div>
  </div>
);

/* ─── Main view ──────────────────────────────────────────────────── */
export const AlertsView = () => {
  const { alerts, resolveAlert, assignAlert } = useAppContext();
  const { addToast } = useToast();
  const isLoaded = useViewLoader(300);

  const [typeFilter, setTypeFilter] = useState('All');

  const handleResolve = (id) => {
    const alert = alerts.find(a => a.id === id);
    resolveAlert(id);
    addToast(`Alert resolved: ${alert?.zone ?? id}`, 'success');
  };

  const sorted = [...alerts]
    .sort((a, b) => {
      const sev = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
      return sev !== 0 ? sev : b.timestamp.localeCompare(a.timestamp);
    });

  const filtered = typeFilter === 'All'
    ? sorted
    : sorted.filter(a => TYPE_LABELS[a.type] === typeFilter);

  const unresolvedCount = alerts.filter(a => !a.resolved).length;

  if (!isLoaded) return <ViewSkeleton />;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/12 text-rose-400 rounded-lg">
            <BellRing size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-widest">Alerts &amp; Actions</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {unresolvedCount > 0
                ? <span className="text-rose-400 font-medium">{unresolvedCount} unresolved alert{unresolvedCount !== 1 ? 's' : ''}</span>
                : <span className="text-emerald-400 font-medium">All clear — no unresolved alerts</span>
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" /> Critical: {alerts.filter(a => a.severity === 'critical' && !a.resolved).length}</span>
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" /> Warning: {alerts.filter(a => a.severity === 'warning' && !a.resolved).length}</span>
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Resolved: {alerts.filter(a => a.resolved).length}</span>
        </div>
      </div>

      {/* Type filter chips */}
      <div className="flex gap-1.5 flex-wrap">
        {TYPE_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setTypeFilter(f)}
            className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
              typeFilter === f
                ? 'bg-indigo-accent/10 text-indigo-accent border-indigo-accent/40'
                : 'bg-surface border-border text-slate-400 hover:text-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="text-center text-slate-500 py-12 text-sm">No alerts match the selected filter.</div>
        ) : (
          filtered.map(alert => (
            <AlertRow
              key={alert.id}
              alert={alert}
              onResolve={handleResolve}
              onAssign={assignAlert}
            />
          ))
        )}
      </div>
    </div>
  );
};
