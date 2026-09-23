import React from 'react';
import { useAppContext } from '../context/AppContext';
import { KpiCard, StatusIndicator } from '../components/Shared';
import { Users, LogIn, LogOut, Clock, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

const FloorPlan = () => {
  const { data } = useAppContext();
  
  return (
    <div className="relative w-full h-[400px] bg-surface border border-border rounded-xl overflow-hidden mt-6">
      {/* Floor Plan SVG representation */}
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1F2933" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        
        {/* Entrance */}
        <rect x="0" y="40" width="5" height="20" fill="#141A21" stroke="#22D3EE" strokeWidth="1" />
        <text x="7" y="51" fill="#4B5563" fontSize="3" className="uppercase font-bold">Entrance</text>
        
        {/* Aisles */}
        <rect x="20" y="20" width="10" height="60" fill="#1F2933" rx="1" />
        <rect x="40" y="20" width="10" height="60" fill="#1F2933" rx="1" />
        <rect x="60" y="20" width="10" height="60" fill="#1F2933" rx="1" />
        
        {/* Checkout */}
        <rect x="85" y="10" width="10" height="80" fill="#1F2933" rx="1" />
        <text x="87" y="50" fill="#4B5563" fontSize="3" className="uppercase font-bold" transform="rotate(90 87,50)">Checkout</text>
      </svg>

      {/* Shopper Dots */}
      {data.shoppers.map(shopper => (
        <div 
          key={shopper.id}
          className="absolute w-2 h-2 bg-cyan-accent rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all duration-1000 ease-linear"
          style={{ 
            left: `${shopper.x}%`, 
            top: `${shopper.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}

      {/* Camera Zones */}
      <div className="absolute top-2 left-2 text-xs text-gray-500 font-medium flex items-center gap-2">
        <div className="w-2 h-2 bg-status-healthy rounded-full animate-pulse" />
        Live Floorplan
      </div>
    </div>
  );
};

const CameraTile = ({ id, name, status }) => (
  <div className="bg-[#0a0d11] border border-border rounded-lg p-2 flex flex-col relative overflow-hidden h-40">
    <div className="flex justify-between items-start z-10">
      <span className="text-xs font-semibold text-gray-300 bg-background/80 px-2 py-1 rounded">{name}</span>
      <div className="flex gap-2">
        <span className="text-[10px] text-cyan-accent bg-cyan-accent/10 px-1.5 py-0.5 rounded border border-cyan-accent/20 flex items-center gap-1">
          <ShieldCheck size={10} /> Blurred at Edge
        </span>
        <StatusIndicator status={status} />
      </div>
    </div>
    
    {/* Mock Video Feed Placeholder */}
    <div className="absolute inset-0 flex items-center justify-center opacity-20">
      <div className="w-16 h-24 border-2 border-emerald-500 border-dashed rounded relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] text-emerald-500 whitespace-nowrap bg-[#0a0d11] px-1">ID: ANON-84</div>
      </div>
      <div className="w-14 h-20 border-2 border-emerald-500 border-dashed rounded relative ml-8 mt-10">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] text-emerald-500 whitespace-nowrap bg-[#0a0d11] px-1">ID: ANON-92</div>
      </div>
    </div>

    <div className="mt-auto z-10 flex gap-4 text-[10px] text-gray-400 font-mono bg-background/80 px-2 py-1 rounded self-start">
      <span>FPS: {Math.floor(Math.random() * 5) + 25}</span>
      <span>Lat: {Math.floor(Math.random() * 20) + 40}ms</span>
    </div>
  </div>
);

export const LiveStoreView = () => {
  const { data } = useAppContext();
  const { storeContext, edgeDevices } = data;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-4 gap-4">
        <KpiCard title="People in Store" value={storeContext.peopleInStore} icon={Users} trend={4.2} highlight />
        <KpiCard title="Entries Today" value={storeContext.entriesToday} icon={LogIn} trend={1.5} />
        <KpiCard title="Exits Today" value={storeContext.exitsToday} icon={LogOut} />
        <KpiCard title="Avg Dwell Time" value={storeContext.avgDwellTime} suffix="min" icon={Clock} trend={-2.1} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 flex flex-col">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white uppercase tracking-wide">Spatial Analytics</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-cyan-accent/20 text-cyan-accent border border-cyan-accent text-xs rounded font-medium">Heatmap</button>
              <button className="px-3 py-1 bg-surface border border-border text-gray-400 text-xs rounded hover:text-white">Trajectories</button>
            </div>
          </div>
          <FloorPlan />
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center justify-between">
            Edge Feeds
            <Activity size={16} className="text-status-healthy animate-pulse" />
          </h2>
          <div className="flex flex-col gap-4">
            {edgeDevices.slice(0, 3).map(dev => (
              <CameraTile key={dev.id} id={dev.id} name={dev.name} status={dev.status} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
