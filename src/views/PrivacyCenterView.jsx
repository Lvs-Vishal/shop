import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ShieldCheck, Lock, EyeOff, CheckCircle2, History } from 'lucide-react';

export const PrivacyCenterView = () => {
  const { data } = useAppContext();
  const { privacyAudit, edgeDevices } = data;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Overview */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-gradient-to-br from-emerald-900/20 to-surface border border-emerald-500/30 rounded-xl p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-500/20 text-emerald-500 rounded-xl">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-wide">Privacy by Design</h2>
              <p className="text-gray-400 text-sm mt-1">100% of video frames are processed locally at the edge and immediately discarded. Only anonymous metadata is transmitted to the cloud.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-background/50 border border-border p-3 rounded flex items-center gap-3">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span className="text-sm text-gray-300 font-medium">DPDP Act 2023 Compliant</span>
            </div>
            <div className="bg-background/50 border border-border p-3 rounded flex items-center gap-3">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span className="text-sm text-gray-300 font-medium">Zero PII Transmitted</span>
            </div>
            <div className="bg-background/50 border border-border p-3 rounded flex items-center gap-3">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span className="text-sm text-gray-300 font-medium">Faces Blurred on Hardware</span>
            </div>
            <div className="bg-background/50 border border-border p-3 rounded flex items-center gap-3">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span className="text-sm text-gray-300 font-medium">Local MAC Randomization</span>
            </div>
          </div>
        </div>

        {/* Physical Privacy Controls */}
        <div className="bg-surface border border-border rounded-xl p-5 flex flex-col">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wide flex items-center gap-2 mb-4">
            <Lock size={16} /> Hardware Privacy Toggles
          </h3>
          <div className="flex flex-col gap-3 flex-1 overflow-auto">
            {edgeDevices.map(dev => (
              <div key={dev.id} className="flex items-center justify-between p-3 bg-background border border-border rounded">
                <div>
                  <span className="text-sm font-medium text-gray-200 block">{dev.name}</span>
                  <span className="text-[10px] text-gray-500 font-mono">{dev.id}</span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded text-xs font-bold border border-emerald-500/20">
                  <EyeOff size={14} /> Private
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The Privacy Ledger */}
      <div className="bg-surface border border-border rounded-xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center bg-background/50">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
              <History size={16} className="text-cyan-accent" /> The Privacy Ledger
            </h2>
            <p className="text-xs text-gray-500 mt-1">An append-only log of hashed audit entries proving no video frames were retained.</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-surface border-b border-border">
              <tr>
                <th className="px-6 py-3 font-medium">Timestamp</th>
                <th className="px-6 py-3 font-medium">Source Node</th>
                <th className="px-6 py-3 font-medium">Metadata Event</th>
                <th className="px-6 py-3 font-medium">Cryptographic Hash (SHA-256)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {privacyAudit.map(entry => (
                <tr key={entry.id} className="hover:bg-white/5 transition-colors font-mono text-xs">
                  <td className="px-6 py-4 text-gray-400">{entry.time}</td>
                  <td className="px-6 py-4 text-cyan-accent/80">{entry.camera}</td>
                  <td className="px-6 py-4 text-gray-300">{entry.event}</td>
                  <td className="px-6 py-4">
                    <span className="bg-background px-2 py-1 rounded border border-border text-gray-500 select-all">
                      {entry.hash}
                    </span>
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
