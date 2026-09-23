import React from 'react';
import { cn } from '../utils/cn';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';

export const Card = ({ children, className }) => (
  <div className={cn("bg-surface border border-border rounded-xl p-4 shadow-sm", className)}>
    {children}
  </div>
);

export const KpiCard = ({ title, value, icon: Icon, trend, prefix = "", suffix = "", className, highlight }) => (
  <Card className={cn("flex flex-col gap-2 relative overflow-hidden", className)}>
    <div className="flex items-center justify-between text-gray-400">
      <span className="text-xs uppercase tracking-wider font-semibold">{title}</span>
      {Icon && <Icon size={16} className={highlight ? "text-cyan-accent" : "text-gray-500"} />}
    </div>
    
    <div className="flex items-baseline gap-1 mt-1">
      {prefix && <span className="text-xl text-gray-400 tabular-nums">{prefix}</span>}
      <span className={cn("text-3xl font-bold tabular-nums", highlight ? "text-cyan-accent" : "text-white")}>
        {value}
      </span>
      {suffix && <span className="text-sm text-gray-400 font-medium ml-1 tabular-nums">{suffix}</span>}
    </div>

    {trend !== undefined && (
      <div className={cn("flex items-center gap-1 text-xs mt-2 font-medium", trend >= 0 ? "text-status-healthy" : "text-status-critical")}>
        {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <span>{Math.abs(trend)}% vs last hr</span>
      </div>
    )}
    
    {highlight && (
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-accent/80 to-transparent" />
    )}
  </Card>
);

export const ChartCard = ({ title, children, className, action }) => (
  <Card className={cn("flex flex-col gap-4 h-full", className)}>
    <div className="flex items-center justify-between">
      <h3 className="text-sm uppercase tracking-wider font-semibold text-gray-300">{title}</h3>
      {action}
    </div>
    <div className="flex-1 w-full min-h-0">
      {children}
    </div>
  </Card>
);

export const StatusIndicator = ({ status, text }) => {
  const getColors = (s) => {
    switch (s?.toLowerCase()) {
      case 'healthy':
      case 'online':
      case 'open':
      case 'stocked':
        return 'bg-status-healthy/10 text-status-healthy border-status-healthy/20';
      case 'warning':
      case 'degraded':
      case 'low':
      case 'misplaced':
        return 'bg-status-warning/10 text-status-warning border-status-warning/20';
      case 'critical':
      case 'offline':
      case 'closed':
      case 'out':
        return 'bg-status-critical/10 text-status-critical border-status-critical/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getDotColor = (s) => {
    switch (s?.toLowerCase()) {
      case 'healthy':
      case 'online':
      case 'open':
      case 'stocked':
        return 'bg-status-healthy';
      case 'warning':
      case 'degraded':
      case 'low':
      case 'misplaced':
        return 'bg-status-warning';
      case 'critical':
      case 'offline':
      case 'closed':
      case 'out':
        return 'bg-status-critical';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs font-medium", getColors(status))}>
      <div className={cn("w-1.5 h-1.5 rounded-full", getDotColor(status))} />
      {text || status}
    </div>
  );
};
