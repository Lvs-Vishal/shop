import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Package,
  Clock,
  Cpu,
  ShieldCheck,
  MessageSquare,
  Bell,
  BellRing,
  Wifi,
  WifiOff,
  Activity,
  Menu,
  Search,
  ChevronDown,
  Store,
  FileText,
  Sun,
  Moon,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useAppContext } from '../context/AppContext';

const NAV_ITEMS = [
  { id: 'live',      label: 'Live Store',        icon: LayoutDashboard },
  { id: 'shoppers',  label: 'Shopper Analytics', icon: Users },
  { id: 'inventory', label: 'Shelf Health',       icon: Package },
  { id: 'queue',     label: 'Queue Intel',        icon: Clock },
  { id: 'edge',      label: 'Edge Nodes',         icon: Cpu },
  { id: 'privacy',   label: 'Privacy Center',     icon: ShieldCheck },
  { id: 'stores',    label: 'Multi-Store',        icon: Store },
  { id: 'reports',   label: 'Reports',            icon: FileText },
  { id: 'alerts',    label: 'Alerts',             icon: BellRing },
];

const STORE_OPTIONS = [
  { value: '042-BLR', label: 'Store 042 – Bangalore' },
  { value: '011-MUM', label: 'Store 011 – Mumbai' },
  { value: '055-DEL', label: 'Store 055 – Delhi' },
  { value: '078-HYD', label: 'Store 078 – Hyderabad' },
];

/* ─── Nav item ─────────────────────────────────────────────────── */
const NavItem = ({ item, isActive, isSidebarOpen, onClick, badge }) => {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-left w-full transition-colors relative group",
        isActive
          ? "bg-indigo-accent/10 text-indigo-accent"
          : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
      )}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-indigo-accent rounded-r-full" />
      )}
      <Icon size={17} className="shrink-0 ml-[1px]" />
      {isSidebarOpen && (
        <span className="font-medium text-sm truncate flex-1">{item.label}</span>
      )}
      {badge > 0 && (
        <span className={cn(
          "text-[10px] font-bold rounded-full bg-rose-500 text-white tabular-nums leading-none flex items-center justify-center",
          isSidebarOpen ? "min-w-[18px] h-[18px] px-1" : "absolute -top-1 -right-1 w-4 h-4"
        )}>
          {badge}
        </span>
      )}
    </button>
  );
};

/* ─── Layout shell ─────────────────────────────────────────────── */
export const Layout = ({ children, currentView, setCurrentView, isCopilotOpen, setIsCopilotOpen }) => {
  const {
    isLiveDemo, setIsLiveDemo,
    isOffline,  setIsOffline,
    bufferedEvents,
    selectedStore, setSelectedStore,
    alerts,
    theme, setTheme,
  } = useAppContext();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const unresolvedCount = alerts.filter(a => !a.resolved).length;
  const isDark = theme === 'dark';

  return (
    <div
      data-theme={theme}
      className="min-h-screen bg-background flex overflow-hidden text-sm font-sans"
    >
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside className={cn(
        "bg-surface border-r border-border flex flex-col shrink-0 transition-all duration-200",
        isSidebarOpen ? "w-56" : "w-[52px]"
      )}>
        {/* Logo */}
        <div className={cn(
          "h-14 flex items-center border-b border-border shrink-0",
          isSidebarOpen ? "px-4 gap-3 justify-between" : "justify-center"
        )}>
          {isSidebarOpen && (
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded bg-indigo-accent flex items-center justify-center shrink-0">
                <Activity size={13} className="text-white" />
              </div>
              <span className="font-semibold text-slate-100 text-sm truncate">RetailSense</span>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded"
          >
            <Menu size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 flex flex-col gap-0.5 px-2 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <NavItem
              key={item.id}
              item={item}
              isActive={currentView === item.id}
              isSidebarOpen={isSidebarOpen}
              onClick={() => setCurrentView(item.id)}
              badge={item.id === 'alerts' ? unresolvedCount : 0}
            />
          ))}
        </nav>

        {/* Connection status */}
        {isSidebarOpen && (
          <div className="px-3 py-3 border-t border-border shrink-0">
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <div className={cn(
                "w-1.5 h-1.5 rounded-full shrink-0",
                isOffline ? "bg-amber-400" : "bg-emerald-400 animate-pulse"
              )} />
              {isOffline ? "Offline — buffering" : "Edge connected"}
            </div>
          </div>
        )}
      </aside>

      {/* ── Main area ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ── Top bar ───────────────────────────────────────────── */}
        <header className="h-14 bg-surface border-b border-border flex items-center gap-4 px-5 shrink-0">

          {/* Store selector */}
          <div className="relative flex items-center shrink-0">
            <select
              id="store-selector"
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="appearance-none bg-background text-slate-200 font-medium pl-3 pr-7 py-1.5 rounded-lg border border-border cursor-pointer focus:outline-none focus:border-indigo-accent/50 text-sm h-8"
            >
              {STORE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2 text-slate-500 pointer-events-none" />
          </div>

          {/* Global search */}
          <div className="flex-1 max-w-xs relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              type="search"
              placeholder="Search SKUs, zones, counters…"
              className="w-full h-8 bg-background border border-border rounded-lg pl-8 pr-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-accent/50 transition-colors"
            />
          </div>

          <div className="flex-1" />

          {/* Right cluster */}
          <div className="flex items-center gap-3">

            {/* Demo toggles */}
            <div className="flex items-center gap-3 bg-background border border-border rounded-lg px-3 h-8 text-[11px] text-slate-400">
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200 transition-colors">
                <input
                  type="checkbox"
                  checked={isLiveDemo}
                  onChange={(e) => setIsLiveDemo(e.target.checked)}
                  className="accent-indigo-accent w-3 h-3"
                />
                <Activity size={12} className={isLiveDemo ? "text-indigo-accent" : ""} />
                Live
              </label>
              <div className="w-px h-3.5 bg-border" />
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200 transition-colors">
                <input
                  type="checkbox"
                  checked={isOffline}
                  onChange={(e) => setIsOffline(e.target.checked)}
                  className="accent-amber-400 w-3 h-3"
                />
                {isOffline
                  ? <WifiOff size={12} className="text-amber-400" />
                  : <Wifi    size={12} className="text-emerald-400" />
                }
                Offline
              </label>
            </div>

            {/* Theme toggle */}
            <button
              id="theme-toggle"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-colors border border-border"
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Bell */}
            <button
              id="bell-icon"
              onClick={() => setCurrentView('alerts')}
              className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-colors"
              aria-label={`${unresolvedCount} unresolved alerts`}
            >
              <Bell size={17} />
              {unresolvedCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center bg-rose-500 text-white text-[9px] font-bold rounded-full px-0.5 tabular-nums">
                  {unresolvedCount}
                </span>
              )}
            </button>

            <div className="w-px h-5 bg-border" />

            {/* Copilot */}
            <button
              onClick={() => setIsCopilotOpen(!isCopilotOpen)}
              className={cn(
                "flex items-center gap-2 px-3 h-8 rounded-lg border text-sm font-medium transition-colors",
                isCopilotOpen
                  ? "bg-indigo-accent/10 border-indigo-accent/40 text-indigo-accent"
                  : "border-border text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
              )}
            >
              <MessageSquare size={15} />
              Copilot
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-indigo-accent/20 border border-indigo-accent/30 flex items-center justify-center shrink-0 cursor-pointer hover:bg-indigo-accent/30 transition-colors">
              <span className="text-[11px] font-bold text-indigo-accent leading-none">LV</span>
            </div>
          </div>
        </header>

        {/* ── Offline banner ────────────────────────────────────── */}
        {isOffline && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-5 py-2 flex items-center justify-between text-amber-400 text-xs font-medium shrink-0">
            <div className="flex items-center gap-2">
              <WifiOff size={13} />
              <span>Offline Resilience Mode — local Edge processing continues normally.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="animate-pulse">Buffering</span>
              <span className="bg-amber-400/20 border border-amber-400/30 text-amber-300 px-2 py-0.5 rounded font-bold tabular-nums">
                {bufferedEvents} events
              </span>
            </div>
          </div>
        )}

        {/* ── View content ──────────────────────────────────────── */}
        <main className="flex-1 overflow-auto p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
};
