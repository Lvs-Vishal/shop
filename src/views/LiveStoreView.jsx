import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { KpiCard, StatusIndicator, ViewSkeleton, useViewLoader } from '../components/Shared';
import { Users, LogIn, LogOut, Clock, Activity, ShieldCheck, IndianRupee, Users2, X } from 'lucide-react';

const HISTORY_LEN = 6;

// Zone name from x/y position
const getZone = (x, y) => {
  if (x < 15)  return 'Entrance';
  if (x > 82)  return 'Checkout';
  if (x < 32)  return 'Aisle 1 – Dairy';
  if (x < 52)  return 'Aisle 2 – Snacks';
  if (x < 72)  return 'Aisle 3 – Produce';
  return 'General Floor';
};

// Stable dwell time per shopper id (seeded so it doesn't flash)
const getDwell = (id) => [4, 7, 2, 11, 15, 3, 8][id % 7];

/* ─── Shopper popup ─────────────────────────────────────────────── */
const ShopperPopup = ({ shopper, onClose }) => (
  <div
    className="absolute z-30 pointer-events-auto"
    style={{
      left: `calc(${shopper.x}% + 10px)`,
      top:  `calc(${shopper.y}% - 20px)`,
    }}
  >
    <div
      className="bg-surface border border-border rounded-lg px-3 py-2 shadow-xl text-xs min-w-[140px]"
      style={{ animation: 'fade-in 0.12s ease-out' }}
    >
      <div className="flex justify-between items-center mb-1.5">
        <span className="font-semibold text-slate-200">ANON-{(shopper.id * 37 + 11).toString().padStart(3,'0')}</span>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300 ml-2">
          <X size={11} />
        </button>
      </div>
      <div className="flex flex-col gap-1 text-[11px] text-slate-400">
        <div className="flex justify-between gap-4">
          <span>Zone</span>
          <span className="text-slate-200 font-medium">{getZone(shopper.x, shopper.y)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Dwell</span>
          <span className="text-slate-200 font-mono">{getDwell(shopper.id)}m {Math.floor(Math.random() * 59)}s</span>
        </div>
      </div>
    </div>
  </div>
);

/* ─── Floor plan ─────────────────────────────────────────────────── */
const FloorPlan = ({ viewMode }) => {
  const { data } = useAppContext();
  const historyRef = useRef({});
  const [selectedShopper, setSelectedShopper] = useState(null);

  data.shoppers.forEach(s => {
    if (!historyRef.current[s.id]) historyRef.current[s.id] = [];
    const hist = historyRef.current[s.id];
    const last = hist[hist.length - 1];
    if (!last || last.x !== s.x || last.y !== s.y) {
      hist.push({ x: s.x, y: s.y });
      if (hist.length > HISTORY_LEN) hist.shift();
    }
  });

  const handleDotClick = (e, shopper) => {
    e.stopPropagation();
    setSelectedShopper(prev => prev?.id === shopper.id ? null : shopper);
  };

  return (
    <div
      className="relative w-full h-[400px] bg-background border border-border rounded-lg overflow-hidden mt-4"
      onClick={() => setSelectedShopper(null)}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#252B3B" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        <rect x="0" y="40" width="5" height="20" fill="#0F1117" stroke="#6366F1" strokeWidth="1" />
        <text x="7" y="51" fill="#64748B" fontSize="3" fontWeight="bold">Entrance</text>
        <rect x="20" y="20" width="10" height="60" fill="#1a2035" rx="1" />
        <rect x="40" y="20" width="10" height="60" fill="#1a2035" rx="1" />
        <rect x="60" y="20" width="10" height="60" fill="#1a2035" rx="1" />
        <rect x="85" y="10" width="10" height="80" fill="#1a2035" rx="1" />
        <text x="87" y="50" fill="#64748B" fontSize="3" fontWeight="bold" transform="rotate(90 87,50)">Checkout</text>
      </svg>

      {/* Trajectory trails */}
      {viewMode === 'trajectories' && data.shoppers.map(shopper => {
        const hist = historyRef.current[shopper.id] || [];
        return hist.slice(0, -1).map((pos, idx) => (
          <div
            key={`${shopper.id}-trail-${idx}`}
            className="absolute rounded-full bg-indigo-accent pointer-events-none transition-all duration-1000 ease-linear"
            style={{
              left: `${pos.x}%`, top: `${pos.y}%`,
              width: '5px', height: '5px',
              transform: 'translate(-50%,-50%)',
              opacity: (idx + 1) / hist.length * 0.4,
            }}
          />
        ));
      })}

      {/* Heatmap glows */}
      {viewMode === 'heatmap' && data.shoppers.map(shopper => (
        <div
          key={`glow-${shopper.id}`}
          className="absolute pointer-events-none transition-all duration-1000 ease-linear"
          style={{
            left: `${shopper.x}%`, top: `${shopper.y}%`,
            width: '72px', height: '72px',
            transform: 'translate(-50%,-50%)',
            background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, rgba(99,102,241,0.07) 50%, transparent 72%)',
            borderRadius: '50%',
          }}
        />
      ))}

      {/* Shopper dots — clickable */}
      {data.shoppers.map(shopper => (
        <div
          key={shopper.id}
          onClick={(e) => handleDotClick(e, shopper)}
          className="absolute w-2.5 h-2.5 bg-indigo-accent rounded-full transition-all duration-1000 ease-linear cursor-pointer hover:scale-150 hover:ring-2 hover:ring-indigo-accent/40"
          style={{ left: `${shopper.x}%`, top: `${shopper.y}%`, transform: 'translate(-50%,-50%)' }}
        />
      ))}

      {/* Popup */}
      {selectedShopper && (
        <ShopperPopup shopper={selectedShopper} onClose={() => setSelectedShopper(null)} />
      )}

      {/* Live label */}
      <div className="absolute top-2 left-2 text-[11px] text-slate-500 font-medium flex items-center gap-1.5 pointer-events-none">
        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
        Live Floorplan
      </div>
    </div>
  );
};

/* ─── Camera tile — animated bounding boxes ──────────────────────── */
const CameraTile = ({ id, name, status }) => {
  const [boxes, setBoxes] = useState([
    { left: 22, top: 18, w: 64, h: 88 },
    { left: 58, top: 44, w: 56, h: 72 },
  ]);
  const [fps,     setFps]     = useState(28);
  const [latency, setLatency] = useState(46);

  useEffect(() => {
    const t = setInterval(() => {
      setBoxes(prev => prev.map(b => ({
        left: Math.max(5,  Math.min(85, b.left + (Math.random() - 0.5) * 4)),
        top:  Math.max(5,  Math.min(65, b.top  + (Math.random() - 0.5) * 3)),
        w:    b.w,
        h:    b.h,
      })));
      setFps(Math.floor(Math.random() * 5) + 25);
      setLatency(Math.floor(Math.random() * 20) + 38);
    }, 1600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-background border border-border rounded-lg p-3 flex flex-col relative overflow-hidden h-40">
      <div className="flex justify-between items-start z-10">
        <span className="text-xs font-semibold text-slate-300 bg-surface/80 px-2 py-1 rounded">{name}</span>
        <div className="flex gap-2 items-center">
          <span className="text-[10px] text-indigo-400 bg-indigo-accent/10 px-1.5 py-0.5 rounded border border-indigo-accent/20 flex items-center gap-1">
            <ShieldCheck size={10} /> Blurred
          </span>
          <StatusIndicator status={status} />
        </div>
      </div>

      {/* Animated bounding boxes */}
      <div className="absolute inset-0 overflow-hidden" style={{ opacity: 0.18 }}>
        {boxes.map((b, i) => (
          <div
            key={i}
            className="absolute border-2 border-emerald-500 border-dashed rounded transition-all duration-[1600ms] ease-in-out"
            style={{ left: `${b.left}%`, top: `${b.top}%`, width: `${b.w}px`, height: `${b.h}px` }}
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] text-emerald-500 whitespace-nowrap bg-background px-1">
              ID: ANON-{(i === 0 ? 84 : 92)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto z-10 flex gap-3 text-[10px] text-slate-500 font-mono bg-surface/80 px-2 py-1 rounded self-start">
        <span>FPS: {fps}</span>
        <span>Lat: {latency}ms</span>
      </div>
    </div>
  );
};

/* ─── Main view ──────────────────────────────────────────────────── */
function cn(...classes) { return classes.filter(Boolean).join(' '); }

export const LiveStoreView = () => {
  const { data } = useAppContext();
  const { storeContext, edgeDevices } = data;
  const [viewMode, setViewMode] = useState('dots');
  const isLoaded = useViewLoader(350);

  if (!isLoaded) return <ViewSkeleton />;

  const viewModes = [
    { id: 'heatmap',      label: 'Heatmap' },
    { id: 'trajectories', label: 'Trajectories' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard title="People in Store"  value={storeContext.peopleInStore}  icon={Users}          trend={4.2}  highlight />
        <KpiCard title="Entries Today"    value={storeContext.entriesToday}   icon={LogIn}          trend={1.5}  />
        <KpiCard title="Exits Today"      value={storeContext.exitsToday}     icon={LogOut}                      />
        <KpiCard title="Avg Dwell Time"   value={storeContext.avgDwellTime}   suffix="min"          icon={Clock} trend={-2.1} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <KpiCard title="Revenue Recovered" value={`₹${storeContext.revenueRecovered.toLocaleString()}`} icon={IndianRupee} trend={3.8} />
        <KpiCard title="Longest Queue"     value={storeContext.longestQueue}  suffix="ppl"          icon={Users2} trend={-1.2} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 flex flex-col">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">Spatial Analytics</h2>
            <div className="flex gap-1.5">
              {viewModes.map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(prev => prev === mode.id ? 'dots' : mode.id)}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded border transition-colors",
                    viewMode === mode.id
                      ? "bg-indigo-accent/10 text-indigo-accent border-indigo-accent/40"
                      : "bg-surface border-border text-slate-400 hover:text-slate-200"
                  )}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
          <FloorPlan viewMode={viewMode} />
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest flex items-center justify-between">
            Edge Feeds
            <Activity size={14} className="text-emerald-400 animate-pulse" />
          </h2>
          <div className="flex flex-col gap-3">
            {edgeDevices.slice(0, 3).map(dev => (
              <CameraTile key={dev.id} id={dev.id} name={dev.name} status={dev.status} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
