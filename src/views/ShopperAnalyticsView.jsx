import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ChartCard, StatusIndicator } from '../components/Shared';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { IndianRupee, TrendingDown, ArrowRight } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-border p-3 rounded shadow-lg text-sm">
        <p className="font-bold text-gray-200 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-400">{entry.name}:</span>
            <span className="font-mono text-white">{entry.value}</span>
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
      <div className="grid grid-cols-3 gap-6">
        
        {/* Footfall Chart */}
        <div className="col-span-2">
          <ChartCard title="Footfall Forecast (Today)">
            <div className="h-72 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={footfallHistory} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2933" vertical={false} />
                  <XAxis dataKey="time" stroke="#4B5563" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4B5563" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#22D3EE', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="actual" name="Actual Footfall" stroke="#22D3EE" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="forecast" name="Forecast" stroke="#4B5563" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Funnel */}
        <div>
          <ChartCard title="Conversion Funnel">
            <div className="flex flex-col h-full justify-center gap-2 mt-4">
              {[
                { label: 'Entered Store', value: funnel.entered, color: 'bg-cyan-accent', pct: 100 },
                { label: 'Visited Aisle', value: funnel.visitedAisle, color: 'bg-cyan-600', pct: Math.round(funnel.visitedAisle/funnel.entered*100) },
                { label: 'Dwelled 10s+', value: funnel.dwelled, color: 'bg-cyan-700', pct: Math.round(funnel.dwelled/funnel.entered*100) },
                { label: 'Picked Up Item', value: funnel.pickedUp, color: 'bg-cyan-800', pct: Math.round(funnel.pickedUp/funnel.entered*100) },
                { label: 'Purchased', value: funnel.purchased, color: 'bg-cyan-900', pct: Math.round(funnel.purchased/funnel.entered*100) },
              ].map((step, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{step.label}</span>
                    <span className="font-mono text-white">{step.value} <span className="text-gray-500">({step.pct}%)</span></span>
                  </div>
                  <div className="w-full bg-surface-light rounded-full h-2 overflow-hidden border border-border">
                    <div className={`h-full ${step.color}`} style={{ width: `${step.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Zone Dwell Time */}
        <ChartCard title="Avg Dwell Time by Zone (mins)">
          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneDwellTime} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2933" horizontal={false} />
                <XAxis type="number" stroke="#4B5563" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="zone" type="category" stroke="#4B5563" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1F2933' }} />
                <Bar dataKey="time" name="Avg Dwell (min)" fill="#22D3EE" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Missed Opportunity Panel */}
        <div className="bg-surface border border-status-critical/30 rounded-xl p-4 flex flex-col h-full shadow-[0_0_20px_rgba(244,63,94,0.05)]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm uppercase tracking-wider font-semibold text-status-critical flex items-center gap-2">
              <TrendingDown size={16} /> Missed Opportunities
            </h3>
          </div>
          
          <div className="flex-1 overflow-auto pr-2">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase border-b border-border/50 sticky top-0 bg-surface">
                <tr>
                  <th className="py-2 font-medium">Zone</th>
                  <th className="py-2 font-medium">Dwell</th>
                  <th className="py-2 font-medium text-right">Est. Revenue Lost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {zoneDwellTime.filter(z => z.revenueLost > 0).sort((a,b) => b.revenueLost - a.revenueLost).map(zone => (
                  <tr key={zone.zone} className="group hover:bg-white/5 transition-colors">
                    <td className="py-3 text-gray-300">{zone.zone}</td>
                    <td className="py-3 text-gray-400 tabular-nums">{zone.time}m</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className={`font-mono font-bold ${zone.revenueLost === maxRevenueLost ? 'text-status-critical' : 'text-gray-300'}`}>
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
