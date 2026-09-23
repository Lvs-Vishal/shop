import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ChartCard, StatusIndicator, ViewSkeleton, useViewLoader } from '../components/Shared';
import { Cpu, Server, Activity, Thermometer, WifiOff, Smartphone, RefreshCw } from 'lucide-react';

export const EdgeNodesView = () => {
  const { data, isOffline, bufferedEvents } = useAppContext();
  const { edgeDevices, bandwidthStats, otaRollout } = data;
  const isLoaded = useViewLoader(350);

  const activeNodes   = edgeDevices.filter(d => d.status === 'Online').length;
  const degradedNodes = edgeDevices.filter(d => d.status === 'Degraded').length;
  const otaPct        = Math.round((otaRollout.nodesOnLatest / otaRollout.totalNodes) * 100);

  if (!isLoaded) return <ViewSkeleton />;

  return (
    <div className="flex flex-col gap-6">

      {/* Overview cards */}
      <div className="grid grid-cols-4 gap-4">
        {/* Fleet status */}
        <div className="bg-surface border border-border rounded-lg p-5 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-slate-500">Fleet Status</span>
            <Server size={15} className="text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-slate-100">{edgeDevices.length}</span>
            <span className="text-sm text-slate-500">Total Nodes</span>
          </div>
          <div className="flex gap-4">
            <span className="text-xs flex items-center gap-1.5 text-emerald-400"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {activeNodes} Online</span>
            <span className="text-xs flex items-center gap-1.5 text-amber-400"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> {degradedNodes} Degraded</span>
          </div>
        </div>

        {/* Bandwidth savings */}
        <div className="bg-surface border border-border rounded-lg p-5 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-slate-500">Bandwidth Saved</span>
            <Activity size={15} className="text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-indigo-400">{bandwidthStats.savedPct}%</span>
          </div>
          <div className="flex flex-col gap-1 text-[11px]">
            <div className="flex justify-between text-slate-500">
              <span>Video avoided:</span>
              <span className="font-mono font-semibold text-slate-300">{bandwidthStats.savedGB} GB/mo</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Metadata sent:</span>
              <span className="font-mono font-semibold text-slate-300">{bandwidthStats.sentGB} GB/mo</span>
            </div>
          </div>
        </div>

        {/* OTA Rollout */}
        <div className="bg-surface border border-border rounded-lg p-5 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-slate-500">OTA Rollout</span>
            <RefreshCw size={15} className="text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-slate-100">{otaRollout.nodesOnLatest}</span>
            <span className="text-sm text-slate-500">of {otaRollout.totalNodes} nodes</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="w-full bg-surface-light h-1.5 rounded-full overflow-hidden border border-border">
              <div className="h-full bg-indigo-400 transition-all" style={{ width: `${otaPct}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Model {otaRollout.modelVersion}</span>
              <span>{otaPct}% up to date</span>
            </div>
          </div>
        </div>

        {/* Connection state */}
        <div className={`bg-surface border rounded-lg p-5 flex flex-col gap-3 transition-colors ${isOffline ? 'border-amber-500/30' : 'border-border'}`}>
          <div className="flex justify-between items-center">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-slate-500">Connection State</span>
            {isOffline ? <WifiOff size={15} className="text-amber-400" /> : <Activity size={15} className="text-emerald-400" />}
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-lg font-semibold ${isOffline ? 'text-amber-400' : 'text-emerald-400'}`}>
              {isOffline ? 'Offline — Buffering' : 'Connected & Syncing'}
            </span>
          </div>
          {isOffline ? (
            <div className="flex items-center gap-2 text-[11px] bg-amber-500/10 text-amber-400 px-2 py-1.5 rounded border border-amber-500/20">
              <span className="animate-pulse">Buffering locally:</span>
              <span className="font-mono font-semibold">{bufferedEvents} events</span>
            </div>
          ) : (
            <p className="text-[11px] text-slate-500">All edge telemetry synced.</p>
          )}
        </div>
      </div>

      {/* Fleet table */}
      <div className="bg-surface border border-border rounded-lg flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex justify-between items-center">
          <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Cpu size={13} className="text-indigo-400" /> Edge Compute Fleet
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] text-slate-500 uppercase bg-white/[0.02] sticky top-0 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-semibold">Device Name</th>
                <th className="px-4 py-3 font-semibold">Hardware / Chip</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">CPU Temp</th>
                <th className="px-4 py-3 font-semibold">NPU Util</th>
                <th className="px-4 py-3 font-semibold">FPS</th>
                <th className="px-4 py-3 font-semibold">Model</th>
                <th className="px-4 py-3 font-semibold">Uptime</th>
                <th className="px-4 py-3 font-semibold">Last Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {edgeDevices.map(dev => (
                <tr key={dev.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-200">
                    <div className="flex items-center gap-2">
                      {dev.isKirana && (
                        <Smartphone size={13} className="text-indigo-400 shrink-0" />
                      )}
                      <div>
                        {dev.name}
                        <span className="block text-[10px] text-slate-500 font-mono mt-0.5">{dev.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-indigo-400/80 font-mono">{dev.type}</td>
                  <td className="px-4 py-3"><StatusIndicator status={dev.status} /></td>
                  <td className="px-4 py-3 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Thermometer size={12} className={dev.temp > 70 ? "text-amber-400" : "text-slate-500"} />
                      <span className={dev.temp > 70 ? "text-amber-400" : "text-slate-300"}>{dev.temp}°C</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <div className="w-16 bg-surface-light rounded-full h-1 overflow-hidden border border-border">
                        <div className={`h-full ${dev.npu > 80 ? 'bg-amber-500' : 'bg-indigo-400'}`} style={{ width: `${dev.npu}%` }} />
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{dev.npu}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-300">{dev.fps}</td>
                  <td className="px-4 py-3 font-mono">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${dev.modelVersion === otaRollout.modelVersion ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/8' : 'text-amber-400 border-amber-500/20 bg-amber-500/8'}`}>
                      {dev.modelVersion}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-500">{dev.uptime}</td>
                  <td className="px-4 py-3 font-mono text-slate-500">{dev.lastSync}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Kirana mode caption */}
        <div className="px-4 py-3 border-t border-border flex items-center gap-2 bg-white/[0.01]">
          <Smartphone size={13} className="text-indigo-400 shrink-0" />
          <p className="text-[11px] text-slate-500">
            <span className="text-indigo-400 font-semibold">Kirana Mode</span>
            {' '}— Zero-hardware-cost deployment on existing Android hardware.
            Run RetailSense Edge on any Android 10+ phone with a camera for instant coverage without dedicated compute nodes.
          </p>
        </div>
      </div>
    </div>
  );
};
