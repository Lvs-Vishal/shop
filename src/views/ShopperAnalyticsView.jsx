import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ChartCard, StatusIndicator } from '../components/Shared';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingDown } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-border p-3 rounded-lg text-xs shadow-lg">
        <p className="font-semibold text-slate-200 mb-1.5">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-400">{entry.name}:</span>
            <span className="font-mono text-slate-100">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const ShopperAnalyticsView = () => {
  const { data } = useAppContext();
  const { footfallHistory, zoneDwellTime, funnel } = data;

  const maxRevenueLost = Math.max(...zoneDwellTime.map(z => z.revenueLost));

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">

        {/* Footfall Chart */}
        <div className="col-span-2">
          <ChartCard title="Footfall Forecast — Today">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={footfallHistory} margin={{ top: 8, right: 16, bottom: 0, left: -8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#252B3B" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366F1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line type="monotone" dataKey="actual"   name="Actual Footfall" stroke="#6366F1" strokeWidth={2}   dot={false} activeDot={{ r: 4, fill: '#6366F1' }} />
                  <Line type="monotone" dataKey="forecast" name="Forecast"         stroke="#475569" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Funnel */}
        <ChartCard title="Conversion Funnel">
          <div className="flex flex-col gap-3">
            {[
              { label: 'Entered Store',  value: funnel.entered,      color: 'bg-indigo-500',  pct: 100 },
              { label: 'Visited Aisle',  value: funnel.visitedAisle, color: 'bg-indigo-500/80', pct: Math.round(funnel.visitedAisle / funnel.entered * 100) },
              { label: 'Dwelled 10s+',  value: funnel.dwelled,      color: 'bg-indigo-500/60', pct: Math.round(funnel.dwelled    / funnel.entered * 100) },
              { label: 'Picked Up Item', value: funnel.pickedUp,     color: 'bg-indigo-500/40', pct: Math.round(funnel.pickedUp   / funnel.entered * 100) },
              { label: 'Purchased',      value: funnel.purchased,    color: 'bg-indigo-500/25', pct: Math.round(funnel.purchased  / funnel.entered * 100) },
            ].map((step, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>{step.label}</span>
                  <span className="font-mono text-slate-200">{step.value} <span className="text-slate-500">({step.pct}%)</span></span>
                </div>
                <div className="w-full bg-surface-light rounded-full h-1 overflow-hidden border border-border">
                  <div className={`h-full ${step.color}`} style={{ width: `${step.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Zone Dwell Time */}
        <ChartCard title="Avg Dwell Time by Zone (mins)">
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneDwellTime} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252B3B" horizontal={false} />
                <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="zone" type="category" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} width={72} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#252B3B' }} />
                <Bar dataKey="time" name="Avg Dwell (min)" fill="#6366F1" radius={[0, 3, 3, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Missed Opportunity table */}
        <div className="bg-surface border border-rose-500/20 rounded-lg flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <TrendingDown size={14} className="text-rose-400" />
            <h3 className="text-[11px] uppercase tracking-widest font-semibold text-rose-400">
              Missed Opportunities
            </h3>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[11px] text-slate-500 uppercase sticky top-0 bg-surface border-b border-border">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Zone</th>
                  <th className="px-4 py-2.5 font-semibold">Dwell</th>
                  <th className="px-4 py-2.5 font-semibold text-right">Est. Revenue Lost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {zoneDwellTime
                  .filter(z => z.revenueLost > 0)
                  .sort((a, b) => b.revenueLost - a.revenueLost)
                  .map(zone => (
                    <tr key={zone.zone} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-4 py-3 text-slate-300">{zone.zone}</td>
                      <td className="px-4 py-3 text-slate-400 tabular-nums">{zone.time}m</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`font-mono font-semibold ${zone.revenueLost === maxRevenueLost ? 'text-rose-400' : 'text-slate-300'}`}>
                            ₹{zone.revenueLost.toLocaleString()}
                          </span>
                          {zone.revenueLost === maxRevenueLost && <StatusIndicator status="critical" text="High Priority" />}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
