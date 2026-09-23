import React, { useEffect, useState } from 'react';
import { cn } from '../utils/cn';
import { TrendingUp, TrendingDown } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────
   Skeleton — pulsing placeholder for loading states.
   Usage: <Skeleton className="h-8 w-32" />
          <ViewSkeleton /> — full-view placeholder
───────────────────────────────────────────────────────────────── */
export const Skeleton = ({ className }) => (
  <div className={cn("skeleton", className)} />
);

export const ViewSkeleton = () => (
  <div className="flex flex-col gap-6 animate-pulse" aria-busy="true" aria-label="Loading…">
    {/* KPI row */}
    <div className="grid grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-surface border border-border rounded-lg p-4 flex flex-col gap-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
    {/* Chart area */}
    <div className="bg-surface border border-border rounded-lg p-4 flex flex-col gap-3">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-64 w-full" />
    </div>
    {/* Table area */}
    <div className="bg-surface border border-border rounded-lg p-4 flex flex-col gap-2">
      <Skeleton className="h-4 w-32 mb-2" />
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   useViewLoader — returns isLoaded = true after `delay` ms.
   Use in every view to show <ViewSkeleton /> on first mount.
───────────────────────────────────────────────────────────────── */
export const useViewLoader = (delay = 400) => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return isLoaded;
};

/* ─────────────────────────────────────────────────────────────────
   Card
───────────────────────────────────────────────────────────────── */
export const Card = ({ children, className }) => (
  <div className={cn("bg-surface border border-border rounded-lg p-4", className)}>
    {children}
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   KpiCard
───────────────────────────────────────────────────────────────── */
export const KpiCard = ({ title, value, icon: Icon, trend, prefix = "", suffix = "", className, highlight }) => (
  <Card className={cn("flex flex-col gap-3 relative overflow-hidden", className)}>
    {highlight && (
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-indigo-accent rounded-t-lg" />
    )}
    <div className="flex items-center justify-between">
      <span className="text-[11px] uppercase tracking-widest font-semibold text-slate-500">
        {title}
      </span>
      {Icon && (
        <Icon size={15} className={highlight ? "text-indigo-accent" : "text-slate-500"} />
      )}
    </div>
    <div className="flex items-baseline gap-1">
      {prefix && <span className="text-lg text-slate-400 tabular-nums">{prefix}</span>}
      <span className={cn("text-3xl font-bold tabular-nums leading-none", highlight ? "text-indigo-accent" : "text-slate-100")}>
        {value}
      </span>
      {suffix && <span className="text-sm text-slate-500 font-medium ml-1">{suffix}</span>}
    </div>
    {trend !== undefined && (
      <div className={trend >= 0 ? "chip-up" : "chip-down"} style={{ width: 'fit-content' }}>
        {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
        {Math.abs(trend)}% vs last hr
      </div>
    )}
  </Card>
);

/* ─────────────────────────────────────────────────────────────────
   ChartCard
───────────────────────────────────────────────────────────────── */
export const ChartCard = ({ title, children, className, action }) => (
  <Card className={cn("flex flex-col h-full p-0 overflow-hidden", className)}>
    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
      <h3 className="text-[11px] uppercase tracking-widest font-semibold text-slate-400">
        {title}
      </h3>
      {action}
    </div>
    <div className="flex-1 w-full min-h-0 p-4">
      {children}
    </div>
  </Card>
);

/* ─────────────────────────────────────────────────────────────────
   StatusIndicator
───────────────────────────────────────────────────────────────── */
export const StatusIndicator = ({ status, text }) => {
  const getColors = (s) => {
    switch (s?.toLowerCase().replace(/\s+/g, '_')) {
      case 'healthy':
      case 'online':
      case 'open':
      case 'stocked':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'warning':
      case 'degraded':
      case 'low':
      case 'misplaced':
      case 'po_pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'critical':
      case 'offline':
      case 'closed':
      case 'out':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getDotColor = (s) => {
    switch (s?.toLowerCase().replace(/\s+/g, '_')) {
      case 'healthy':
      case 'online':
      case 'open':
      case 'stocked':
        return 'bg-emerald-400';
      case 'warning':
      case 'degraded':
      case 'low':
      case 'misplaced':
      case 'po_pending':
        return 'bg-amber-400';
      case 'critical':
      case 'offline':
      case 'closed':
      case 'out':
        return 'bg-rose-400';
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[11px] font-semibold whitespace-nowrap",
      getColors(status)
    )}>
      <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", getDotColor(status))} />
      {text || status}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   Modal — simple centered overlay
───────────────────────────────────────────────────────────────── */
export const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" />
      {/* Panel */}
      <div
        className="relative bg-surface border border-border rounded-lg w-full max-w-md flex flex-col shadow-2xl"
        style={{ animation: 'fade-in 0.15s ease-out' }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-slate-100 text-sm">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors text-lg leading-none"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          {children}
        </div>
      </div>
    </div>
  );
};
