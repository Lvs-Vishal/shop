import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ChartCard, StatusIndicator, ViewSkeleton, useViewLoader } from '../components/Shared';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { CheckCircle2, PlayCircle, PowerOff, Power } from 'lucide-react';

const STAFF = ['Ravi K.', 'Priya M.', 'Suresh T.'];

const sparklineData = Array.from({ length: 60 }, (_, i) => ({
  time: i,
  value: Math.floor(Math.random() * 5) + (i > 45 ? 4 : 1)
}));

const forecastData = Array.from({ length: 30 }, (_, i) => ({
  time: `+${i}m`,
  queue: 4 + Math.sin(i / 5) * 4 + i / 10
}));

export const QueueIntelligenceView = () => {
  const { data, toggleCounterStatus } = useAppContext();
  const { queues } = data;
  const isLoaded = useViewLoader(350);

  const [acknowledged, setAcknowledged] = useState(null); // null | { name, time }

  const handleAcknowledge = () => {
    const name = STAFF[Math.floor(Math.random() * STAFF.length)];
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setAcknowledged({ name, time });
  };

  if (!isLoaded) return <ViewSkeleton />;

  return (
    <div className="flex flex-col gap-6">

      {/* AI banner / acknowledged note */}
      {acknowledged ? (
        <div className="bg-indigo-accent/5 border border-indigo-accent/20 rounded-lg px-4 py-3 flex items-center gap-3">
          <CheckCircle2 size={16} className="text-indigo-accent shrink-0" />
          <span className="text-slate-300 text-sm">
            Acknowledged by{' '}
            <span className="font-semibold text-indigo-accent">{acknowledged.name}</span>
            {' '}at <span className="font-mono text-slate-200">{acknowledged.time}</span>
            {' '}— Counter 3 open action logged.
          </span>
        </div>
      ) : (
        <div className="bg-indigo-950/40 border border-indigo-accent/25 rounded-lg p-4 flex items-center justify-between">
          <div className="flex gap-3 items-center">
            <div className="p-2 bg-indigo-accent/15 text-indigo-accent rounded-lg">
              <PlayCircle size={20} />
            </div>
            <div>
              <h3 className="text-indigo-400 font-semibold text-xs tracking-widest uppercase">AI Queue Action Recommended</h3>
              <p className="text-slate-300 mt-1 text-sm">
                Open Counter 3 in 6 mins to prevent 9-min wait times. Estimated retention value:{' '}
                <span className="font-mono font-semibold text-indigo-400">₹1,200</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleAcknowledge}
            className="bg-indigo-500 text-white font-semibold px-4 py-2 rounded text-sm flex items-center gap-2 hover:bg-indigo-600 transition-colors shrink-0"
          >
            <CheckCircle2 size={15} /> Acknowledge
          </button>
        </div>
      )}

      {/* Counter cards */}
      <div className="grid grid-cols-4 gap-4">
        {queues.map(q => (
          <div
            key={q.id}
            className={`bg-surface border rounded-lg p-4 flex flex-col gap-4 transition-opacity ${
              q.status === 'Open' ? 'border-border' : 'border-border/40 opacity-55'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-300 text-sm">Counter {q.id}</span>
              <StatusIndicator status={q.status} />
            </div>

            <div className="flex items-baseline justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-500 uppercase tracking-wide">Queue Length</span>
                <span className="text-3xl font-bold font-mono text-slate-100 mt-0.5">
                  {q.length} <span className="text-sm text-slate-500 font-normal">ppl</span>
                </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[11px] text-slate-500 uppercase tracking-wide">Est Wait</span>
                <span className={`text-xl font-bold font-mono mt-0.5 ${q.waitTime > 5 ? 'text-amber-400' : 'text-slate-300'}`}>
                  {q.waitTime}<span className="text-xs font-normal ml-0.5">m</span>
                </span>
              </div>
            </div>

            <div className="h-8 opacity-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={q.status === 'Open' ? '#6366F1' : '#64748B'}
                    strokeWidth={1.5}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <button
              onClick={() => toggleCounterStatus(q.id)}
              className={`flex items-center justify-center gap-1.5 text-xs font-semibold py-1.5 rounded border transition-colors ${
                q.status === 'Open'
                  ? 'border-rose-500/30 text-rose-400 hover:bg-rose-500/8'
                  : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/8'
              }`}
            >
              {q.status === 'Open'
                ? <><PowerOff size={11} /> Close Counter</>
                : <><Power    size={11} /> Open Counter</>
              }
            </button>
          </div>
        ))}
      </div>

      {/* Forecast chart */}
      <ChartCard title="Congestion Forecast — Next 30 Mins">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData} margin={{ top: 16, right: 16, bottom: 0, left: -8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#252B3B" vertical={false} />
              <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#161B26', borderColor: '#252B3B', borderRadius: '6px', fontSize: '12px' }}
                itemStyle={{ color: '#6366F1', fontFamily: 'monospace' }}
              />
              <ReferenceLine
                y={6}
                label={{ position: 'top', value: 'SLA Breach (6 ppl)', fill: '#F43F5E', fontSize: 10 }}
                stroke="#F43F5E"
                strokeDasharray="3 3"
              />
              <Line type="monotone" dataKey="queue" name="Predicted Queue" stroke="#6366F1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
};
