import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ChartCard, StatusIndicator } from '../components/Shared';
import { Cpu, Server, Activity, Thermometer, WifiOff } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const EdgeNodesView = () => {
  const { data, isOffline, bufferedEvents } = useAppContext();
  const { edgeDevices, bandwidthStats } = data;

  const activeNodes = edgeDevices.filter(d => d.status === 'Online').length;
  const degradedNodes = edgeDevices.filter(d => d.status === 'Degraded').length;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-2">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs uppercase font-bold tracking-wide">Fleet Status</span>
            <Server size={16} />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-bold font-mono text-white">{edgeDevices.length}</span>
            <span className="text-sm text-gray-500">Total Nodes</span>
          </div>
          <div className="flex gap-4 mt-2">
            <span className="text-xs flex items-center gap-1 text-status-healthy"><div className="w-2 h-2 rounded-full bg-status-healthy"/> {activeNodes} Online</span>
            <span className="text-xs flex items-center gap-1 text-status-warning"><div className="w-2 h-2 rounded-full bg-status-warning"/> {degradedNodes} Degraded</span>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-2">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs uppercase font-bold tracking-wide">Cloud Bandwidth Saved</span>
            <Activity size={16} className="text-cyan-accent" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-bold font-mono text-cyan-accent">{bandwidthStats.savedPct}%</span>
          </div>
          <div className="flex flex-col gap-1 mt-2 text-xs">
            <div className="flex justify-between text-gray-400"><span>Video data avoided:</span> <span className="font-mono text-white">{bandwidthStats.savedData}</span></div>
            <div className="flex justify-between text-gray-400"><span>Metadata sent:</span> <span className="font-mono text-white">{bandwidthStats.sentData}</span></div>
          </div>
        </div>

        <div className={`bg-surface border rounded-xl p-5 flex flex-col gap-2 transition-colors ${isOffline ? 'border-status-warning/50' : 'border-border'}`}>
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs uppercase font-bold tracking-wide">Connection State</span>
            {isOffline ? <WifiOff size={16} className="text-status-warning" /> : <Activity size={16} className="text-status-healthy" />}
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-2xl font-bold ${isOffline ? 'text-status-warning' : 'text-status-healthy'}`}>
              {isOffline ? 'Offline - Buffering' : 'Connected & Syncing'}
            </span>
          </div>
          {isOffline && (
            <div className="mt-2 flex items-center gap-2 text-xs bg-status-warning/10 text-status-warning px-2 py-1 rounded">
              <span className="animate-pulse">Buffering locally:</span> 
              <span className="font-mono font-bold">{bufferedEvents} events</span>
            </div>
          )}
          {!isOffline && (
            <div className="mt-2 text-xs text-gray-500">
              Edge inference continuing normally. All telemetry synced.
            </div>
          )}
        </div>
      </div>

      {/* Fleet Table */}
      <div className="bg-surface border border-border rounded-xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
            <Cpu size={16} className="text-cyan-accent" /> Edge Compute Fleet
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-white/5">
              <tr>
                <th className="px-4 py-3 font-medium">Device Name</th>
                <th className="px-4 py-3 font-medium">Hardware / Chip</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">CPU Temp</th>
                <th className="px-4 py-3 font-medium">NPU Util</th>
                <th className="px-4 py-3 font-medium">FPS</th>
                <th className="px-4 py-3 font-medium">Uptime</th>
                <th className="px-4 py-3 font-medium">Last Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {edgeDevices.map(dev => (
                <tr key={dev.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-200">
                    {dev.name}
                    <span className="block text-[10px] text-gray-500 font-mono mt-0.5">{dev.id}</span>
                  </td>
                  <td className="px-4 py-3 text-cyan-accent/80 font-mono text-xs">{dev.type}</td>
                  <td className="px-4 py-3">
                    <StatusIndicator status={dev.status} />
                  </td>
                  <td className="px-4 py-3 font-mono">
                    <div className="flex items-center gap-1">
                      <Thermometer size={14} className={dev.temp > 70 ? "text-status-warning" : "text-gray-400"} />
                      <span className={dev.temp > 70 ? "text-status-warning" : "text-gray-300"}>{dev.temp}°C</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono">
                    <div className="w-16 bg-surface-light rounded-full h-1.5 overflow-hidden border border-border">
                      <div className={`h-full ${dev.npu > 80 ? 'bg-status-warning' : 'bg-cyan-accent'}`} style={{ width: `${dev.npu}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1 block">{dev.npu}%</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-300">{dev.fps}</td>
                  <td className="px-4 py-3 font-mono text-gray-400 text-xs">{dev.uptime}</td>
                  <td className="px-4 py-3 font-mono text-gray-400 text-xs">{dev.lastSync}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
