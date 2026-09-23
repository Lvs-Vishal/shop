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
  ChevronDown
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useAppContext } from '../context/AppContext';

const NAV_ITEMS = [
  { id: 'live',      label: 'Live Store',         icon: LayoutDashboard },
  { id: 'shoppers',  label: 'Shopper Analytics',  icon: Users },
  { id: 'inventory', label: 'Shelf Health',        icon: Package },
  { id: 'queue',     label: 'Queue Intel',         icon: Clock },
  { id: 'edge',      label: 'Edge Nodes',          icon: Cpu },
  { id: 'privacy',   label: 'Privacy Center',      icon: ShieldCheck },
  { id: 'alerts',    label: 'Alerts',              icon: BellRing },
];

const STORE_OPTIONS = [
  { value: '042-BLR', label: 'Store 042 – Bangalore' },
  { value: '011-MUM', label: 'Store 011 – Mumbai' },
  { value: '055-DEL', label: 'Store 055 – Delhi' },
  { value: '078-HYD', label: 'Store 078 – Hyderabad' },
];

export const Layout = ({ children, currentView, setCurrentView, isCopilotOpen, setIsCopilotOpen }) => {
  const { isLiveDemo, setIsLiveDemo, isOffline, setIsOffline, bufferedEvents, selectedStore, setSelectedStore, alerts } = useAppContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const unresolvedCount = alerts.filter(a => !a.resolved).length;

  return (
    <div className="min-h-screen bg-background flex overflow-hidden text-sm">
      {/* Sidebar */}
      <aside className={cn(
        "bg-surface border-r border-border transition-all duration-300 flex flex-col",
        isSidebarOpen ? "w-64" : "w-16"
      )}>
        <div className="h-14 flex items-center px-4 border-b border-border justify-between">
          {isSidebarOpen && <span className="font-bold text-cyan-accent tracking-wide uppercase flex items-center gap-2"><Activity size={16}/> RetailSense Edge</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white">
            <Menu size={20} />
          </button>
        </div>
        
        <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full text-left relative",
                  isActive ? "bg-cyan-accent/10 text-cyan-accent" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                )}
              >
                <Icon size={18} />
                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                {/* Badge on alerts nav item */}
                {item.id === 'alerts' && unresolvedCount > 0 && (
                  <span className={cn(
                    "ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-status-critical text-white tabular-nums",
                    !isSidebarOpen && "absolute -top-1 -right-1 ml-0"
                  )}>
                    {unresolvedCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TopBar */}
        <header className="h-14 bg-surface border-b border-border flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            {/* Store Selector — real native select */}
            <div className="relative flex items-center">
              <select
                id="store-selector"
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="appearance-none bg-background text-gray-200 font-medium pl-3 pr-8 py-1.5 rounded border border-border cursor-pointer focus:outline-none focus:border-cyan-accent/50 text-sm"
              >
                {STORE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Hackathon Demo Toggles */}
            <div className="flex items-center gap-4 bg-background px-4 py-1.5 rounded-full border border-border">
              <span className="text-xs uppercase tracking-wider text-gray-500 font-bold mr-2">Demo Toggles</span>
              
              <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white">
                <input 
                  type="checkbox" 
                  checked={isLiveDemo} 
                  onChange={(e) => setIsLiveDemo(e.target.checked)}
                  className="accent-cyan-accent"
                />
                <Activity size={14} className={isLiveDemo ? "text-cyan-accent" : ""} />
                Live Anim
              </label>

              <div className="w-px h-4 bg-border"></div>

              <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white">
                <input 
                  type="checkbox" 
                  checked={isOffline} 
                  onChange={(e) => setIsOffline(e.target.checked)}
                  className="accent-status-warning"
                />
                {isOffline ? <WifiOff size={14} className="text-status-warning" /> : <Wifi size={14} className="text-status-healthy" />}
                Offline Resilience
              </label>
            </div>

            {/* Bell icon with unresolved alert count badge */}
            <button
              id="bell-icon"
              onClick={() => setCurrentView('alerts')}
              className="relative text-gray-400 hover:text-white transition-colors"
              aria-label={`Alerts — ${unresolvedCount} unresolved`}
            >
              <Bell size={20} />
              {unresolvedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-status-critical text-white text-[10px] font-bold rounded-full px-1 tabular-nums animate-pulse">
                  {unresolvedCount}
                </span>
              )}
            </button>
            
            <button 
              onClick={() => setIsCopilotOpen(!isCopilotOpen)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors",
                isCopilotOpen ? "bg-cyan-accent/20 border-cyan-accent text-cyan-accent" : "border-border text-gray-300 hover:bg-white/5"
              )}
            >
              <MessageSquare size={16} />
              <span className="font-medium">Retail Copilot</span>
            </button>
          </div>
        </header>

        {/* Offline Banner */}
        {isOffline && (
          <div className="bg-status-warning/20 border-b border-status-warning/40 px-6 py-2 flex items-center justify-between text-status-warning text-xs font-medium shrink-0">
            <div className="flex items-center gap-2">
              <WifiOff size={14} />
              <span>Connection Lost. Operating in Offline Resilience Mode. Local Edge processing continues.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="animate-pulse">Buffering...</span>
              <span className="bg-status-warning text-background px-2 py-0.5 rounded-full font-bold tabular-nums">
                {bufferedEvents} events
              </span>
            </div>
          </div>
        )}

        {/* View Content */}
        <main className="flex-1 overflow-auto p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
};
