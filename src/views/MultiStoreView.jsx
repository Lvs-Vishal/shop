import React from 'react';
import { useAppContext } from '../context/AppContext';
import { KpiCard, StatusIndicator, ViewSkeleton, useViewLoader } from '../components/Shared';
import { TrendingUp, TrendingDown, Minus, Store } from 'lucide-react';

const healthColor = (score) => {
  if (score >= 85) return 'text-emerald-400';
  if (score >= 70) return 'text-amber-400';
  return 'text-rose-400';
};

const healthStatus = (score) => {
  if (score >= 85) return 'healthy';
  if (score >= 70) return 'warning';
  return 'critical';
};

const RankChange = ({ change }) => {
  if (change > 0) return (
    <span className="flex items-center gap-0.5 text-emerald-400 text-xs font-semibold">
      <TrendingUp size={12} /> +{change}
    </span>
  );
  if (change < 0) return (
    <span className="flex items-center gap-0.5 text-rose-400 text-xs font-semibold">
      <TrendingDown size={12} /> {change}
    </span>
  );
  return <span className="text-slate-500 text-xs"><Minus size={12} /></span>;
};

export const MultiStoreView = () => {
  const { data } = useAppContext();
  const { stores } = data;
  const isLoaded = useViewLoader(400);

  // Chain-level aggregates
  const totalFootfall  = stores.reduce((s, x) => s + x.footfall, 0);
  const avgHealth      = Math.round(stores.reduce((s, x) => s + x.healthScore, 0) / stores.length);
  const avgConversion  = (stores.reduce((s, x) => s + x.conversionPct, 0) / stores.length).toFixed(1);
  const avgWait        = (stores.reduce((s, x) => s + x.avgWait, 0) / stores.length).toFixed(1);

  // Sort by health score descending (= rank)
  const ranked = [...stores].sort((a, b) => b.healthScore - a.healthScore);

  if (!isLoaded) return <ViewSkeleton />;

  return (
    <div className="flex flex-col gap-6">

      {/* Chain KPI strip */}
      <div>
        <h2 className="text-[11px] uppercase tracking-widest font-semibold text-slate-500 mb-3">Chain Overview — All Stores</h2>
        <div className="grid grid-cols-4 gap-4">
          <KpiCard title="Total Footfall"    value={totalFootfall.toLocaleString()} icon={Store}   trend={2.1}  highlight />
          <KpiCard title="Avg Health Score"  value={avgHealth}    suffix="/100"                    trend={1.4}  />
          <KpiCard title="Avg Conversion"    value={avgConversion} suffix="%"                      trend={-0.8} />
          <KpiCard title="Avg Queue Wait"    value={avgWait}      suffix="min"                     trend={-1.5} />
        </div>
      </div>

      {/* Ranked table */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Store Rankings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-slate-500 uppercase bg-white/[0.02] sticky top-0 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-semibold w-12">#</th>
                <th className="px-4 py-3 font-semibold">Store</th>
                <th className="px-4 py-3 font-semibold">Health Score</th>
                <th className="px-4 py-3 font-semibold">Footfall</th>
                <th className="px-4 py-3 font-semibold">Conversion</th>
                <th className="px-4 py-3 font-semibold">Stock-out Hours</th>
                <th className="px-4 py-3 font-semibold">Avg Wait</th>
                <th className="px-4 py-3 font-semibold">Rank Δ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {ranked.map((store, idx) => (
                <tr key={store.id} className="hover:bg-white/[0.03] transition-colors">
                  {/* Rank */}
                  <td className="px-4 py-4">
                    <span className={`text-xl font-bold font-mono tabular-nums ${idx === 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                      {idx + 1}
                    </span>
                  </td>

                  {/* Store name */}
                  <td className="px-4 py-4">
                    <div className="font-semibold text-slate-100">{store.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{store.city}</div>
                  </td>

                  {/* Health score */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-1 w-24">
                        <div className="w-full bg-surface-light h-1 rounded-full overflow-hidden border border-border">
                          <div
                            className={`h-full ${store.healthScore >= 85 ? 'bg-emerald-500' : store.healthScore >= 70 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            style={{ width: `${store.healthScore}%` }}
                          />
                        </div>
                      </div>
                      <span className={`text-sm font-bold tabular-nums ${healthColor(store.healthScore)}`}>
                        {store.healthScore}
                      </span>
                      <StatusIndicator status={healthStatus(store.healthScore)} text="" />
                    </div>
                  </td>

                  {/* Footfall */}
                  <td className="px-4 py-4 font-mono font-semibold text-slate-200 tabular-nums">
                    {store.footfall.toLocaleString()}
                  </td>

                  {/* Conversion */}
                  <td className="px-4 py-4 font-mono tabular-nums">
                    <span className={store.conversionPct >= 30 ? 'text-emerald-400 font-semibold' : 'text-slate-300'}>
                      {store.conversionPct}%
                    </span>
                  </td>

                  {/* Stock-out hours */}
                  <td className="px-4 py-4 font-mono tabular-nums">
                    <span className={store.stockOutHours > 4 ? 'text-rose-400 font-semibold' : store.stockOutHours > 1 ? 'text-amber-400' : 'text-emerald-400'}>
                      {store.stockOutHours}h
                    </span>
                  </td>

                  {/* Avg wait */}
                  <td className="px-4 py-4 font-mono tabular-nums">
                    <span className={store.avgWait > 6 ? 'text-rose-400 font-semibold' : 'text-slate-300'}>
                      {store.avgWait}m
                    </span>
                  </td>

                  {/* Rank change */}
                  <td className="px-4 py-4">
                    <RankChange change={store.rankChange} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
