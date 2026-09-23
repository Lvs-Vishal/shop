import React from 'react';
import { useAppContext } from '../context/AppContext';
import { StatusIndicator } from '../components/Shared';
import { BellRing, CheckCircle2, Tag, User } from 'lucide-react';

const STAFF = ['Ravi K.', 'Priya M.', 'Suresh T.', 'Ananya R.'];

const SEVERITY_ORDER = { critical: 0, warning: 1, ok: 2 };

const TYPE_LABELS = {
  stockout: 'Stockout',
  queue:    'Queue',
  shelf:    'Shelf',
  assist:   'Assist',
  device:   'Device',
};

const AlertRow = ({ alert, onResolve, onAssign }) => (
  <div className={`bg-surface border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 transition-colors ${alert.resolved ? 'border-border opacity-60' : 'border-border hover:bg-white/5'}`}>
    {/* Severity + type badge */}
    <div className="flex items-center gap-3 min-w-[160px]">
      <StatusIndicator status={alert.severity === 'ok' ? 'healthy' : alert.severity} />
      <span className="text-xs font-semibold text-gray-500 uppercase bg-white/5 px-2 py-0.5 rounded border border-border">
        {TYPE_LABELS[alert.type] ?? alert.type}
      </span>
    </div>

    {/* Message */}
    <div className="flex-1 min-w-0">
      <p className="text-gray-200 text-sm leading-snug">{alert.message}</p>
      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
        <span className="flex items-center gap-1"><Tag size={11} /> {alert.zone}</span>
        <span>{alert.timestamp}</span>
        {alert.resolved && <span className="text-status-healthy font-medium">Resolved</span>}
      </div>
    </div>

    {/* Assignee dropdown */}
    <div className="flex items-center gap-2 shrink-0">
      <User size={13} className="text-gray-500" />
      <select
        value={alert.assignee ?? ''}
        onChange={(e) => onAssign(alert.id, e.target.value || null)}
        disabled={alert.resolved}
        className="bg-background text-gray-300 text-xs border border-border rounded px-2 py-1 focus:outline-none focus:border-cyan-accent/50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">Unassigned</option>
        {STAFF.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>

    {/* Resolve button */}
    <div className="shrink-0">
      {alert.resolved ? (
        <div className="flex items-center gap-1.5 text-xs text-status-healthy font-medium px-3 py-1.5 rounded border border-status-healthy/20 bg-status-healthy/5">
          <CheckCircle2 size={13} /> Resolved
        </div>
      ) : (
        <button
          onClick={() => onResolve(alert.id)}
          className="text-xs font-bold px-3 py-1.5 rounded border border-status-healthy/30 text-status-healthy hover:bg-status-healthy/10 transition-colors"
        >
          Resolve
        </button>
      )}
    </div>
  </div>
);

export const AlertsView = () => {
  const { alerts, resolveAlert, assignAlert } = useAppContext();

  const sorted = [...alerts].sort((a, b) => {
    const sev = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
    if (sev !== 0) return sev;
    return b.timestamp.localeCompare(a.timestamp);
  });

  const unresolvedCount = alerts.filter(a => !a.resolved).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-status-critical/20 text-status-critical rounded-lg">
            <BellRing size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wide">Alerts &amp; Actions</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {unresolvedCount > 0
                ? <span className="text-status-critical font-medium">{unresolvedCount} unresolved alert{unresolvedCount !== 1 ? 's' : ''} require attention</span>
                : <span className="text-status-healthy font-medium">All clear — no unresolved alerts</span>
              }
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-status-critical inline-block" /> Critical: {alerts.filter(a => a.severity === 'critical' && !a.resolved).length}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-status-warning inline-block" /> Warning: {alerts.filter(a => a.severity === 'warning' && !a.resolved).length}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-status-healthy inline-block" /> Resolved: {alerts.filter(a => a.resolved).length}
          </span>
        </div>
      </div>

      {/* Alert list */}
      <div className="flex flex-col gap-3">
        {sorted.map(alert => (
          <AlertRow
            key={alert.id}
            alert={alert}
            onResolve={resolveAlert}
            onAssign={assignAlert}
          />
        ))}
      </div>
    </div>
  );
};
