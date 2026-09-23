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
  Calendar,
  Wifi,
  WifiOff,
  Activity,
  Menu,
  ChevronDown
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useAppContext } from '../context/AppContext';

const NAV_ITEMS = [
  { id: 'live', label: 'Live Store', icon: LayoutDashboard },
  { id: 'shoppers', label: 'Shopper Analytics', icon: Users },
  { id: 'inventory', label: 'Shelf Health', icon: Package },
  { id: 'queue', label: 'Queue Intel', icon: Clock },
  { id: 'edge', label: 'Edge Nodes', icon: Cpu },
  { id: 'privacy', label: 'Privacy Center', icon: ShieldCheck },
];

export const Layout = ({ children, currentView, setCurrentView, isCopilotOpen, setIsCopilotOpen }) => {
  const { isLiveDemo, setIsLiveDemo, isOffline, setIsOffline, bufferedEvents } = useAppContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full text-left",
                  isActive ? "bg-cyan-accent/10 text-cyan-accent" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                )}
              >
                <Icon size={18} />
                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
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
            <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded border border-border cursor-pointer">
              <span className="font-medium text-gray-200">Store 042 - Bangalore</span>
              <ChevronDown size={14} className="text-gray-500"/>
            </div>
            <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded border border-border cursor-pointer text-gray-300">
              <Calendar size={14} />
              <span>Today</span>
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

            <div className="relative cursor-pointer text-gray-400 hover:text-white">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-status-critical rounded-full animate-pulse"></span>
            </div>
            
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
