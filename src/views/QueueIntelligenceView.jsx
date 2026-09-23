import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ChartCard, StatusIndicator } from '../components/Shared';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Clock, CheckCircle2, AlertTriangle, PlayCircle, PowerOff, Power } from 'lucide-react';

const sparklineData = Array.from({ length: 60 }, (_, i) => ({
  time: i,
  value: Math.floor(Math.random() * 5) + (i > 45 ? 4 : 1) // Simulate recent spike
}));

const forecastData = Array.from({ length: 30 }, (_, i) => ({
  time: `+${i}m`,
  queue: 4 + Math.sin(i / 5) * 4 + i / 10
}));

export const QueueIntelligenceView = () => {
  const { data, toggleCounterStatus } = useAppContext();
  const { queues } = data;
  const [isAcknowledged, setIsAcknowledged] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      
      {/* AI Recommendation Banner / Acknowledged Note */}
      {isAcknowledged ? (
        <div className="bg-cyan-accent/5 border border-cyan-accent/20 rounded-xl px-5 py-3 flex items-center gap-3">
          <CheckCircle2 size={18} className="text-cyan-accent shrink-0" />
          <span className="text-cyan-accent/80 text-sm font-medium">
            Acknowledged by <span className="font-bold text-cyan-accent">Store Manager</span> — Counter 3 open action logged.
          </span>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-cyan-900/40 to-surface border border-cyan-accent/30 rounded-xl p-4 flex items-center justify-between shadow-[0_0_15px_rgba(34,211,238,0.1)]">
          <div className="flex gap-4 items-center">
            <div className="p-2 bg-cyan-accent/20 text-cyan-accent rounded-full animate-pulse">
              <PlayCircle size={24} />
            </div>
            <div>
              <h3 className="text-cyan-accent font-bold text-sm tracking-wide uppercase">AI Queue Action Recommended</h3>
              <p className="text-gray-200 mt-1">Open Counter 3 in 6 mins to prevent 9-min wait times. Estimated retention value: <span className="font-mono font-bold text-cyan-accent">₹1,200</span></p>
            </div>
          </div>
          <button
            onClick={() => setIsAcknowledged(true)}
            className="bg-cyan-accent text-[#0B0F14] font-bold px-4 py-2 rounded flex items-center gap-2 hover:bg-cyan-400 transition-colors"
          >
            <CheckCircle2 size={16} /> Acknowledge
          </button>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {queues.map(q => (
          <div key={q.id} className={`bg-surface border rounded-xl p-4 flex flex-col gap-4 ${q.status === 'Open' ? 'border-border' : 'border-border/50 opacity-60'}`}>
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-300">Counter {q.id}</span>
              <StatusIndicator status={q.status} />
            </div>
            
            <div className="flex items-baseline justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase tracking-wide">Queue Length</span>
                <span className="text-3xl font-bold font-mono text-white mt-1">{q.length} <span className="text-sm text-gray-500">ppl</span></span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs text-gray-500 uppercase tracking-wide">Est Wait</span>
                <span className={`text-xl font-bold font-mono mt-1 ${q.waitTime > 5 ? 'text-status-warning' : 'text-gray-300'}`}>
                  {q.waitTime} <span className="text-xs">m</span>
                </span>
              </div>
            </div>

            <div className="h-10 mt-2 opacity-50">
               <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line type="monotone" dataKey="value" stroke={q.status === 'Open' ? '#22D3EE' : '#4B5563'} strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Open / Close toggle */}
            <button
              onClick={() => toggleCounterStatus(q.id)}
              className={`flex items-center justify-center gap-2 text-xs font-bold py-1.5 rounded border transition-colors ${
                q.status === 'Open'
                  ? 'border-status-critical/40 text-status-critical hover:bg-status-critical/10'
                  : 'border-status-healthy/40 text-status-healthy hover:bg-status-healthy/10'
              }`}
            >
              {q.status === 'Open'
                ? <><PowerOff size={12} /> Close Counter</>
                : <><Power size={12} /> Open Counter</>
              }
            </button>
          </div>
        ))}
      </div>

      <ChartCard title="Congestion Forecast (Next 30 Mins)">
        <div className="h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2933" vertical={false} />
              <XAxis dataKey="time" stroke="#4B5563" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#4B5563" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#141A21', borderColor: '#1F2933', borderRadius: '4px' }}
                itemStyle={{ color: '#22D3EE', fontFamily: 'monospace' }}
              />
              <ReferenceLine y={6} label={{ position: 'top', value: 'SLA Breach Threshold (6 ppl)', fill: '#F43F5E', fontSize: 10 }} stroke="#F43F5E" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="queue" name="Predicted Queue" stroke="#22D3EE" strokeWidth={3} dot={false} fill="url(#colorQueue)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

    </div>
  );
};
