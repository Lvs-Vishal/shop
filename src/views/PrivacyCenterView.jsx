import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ShieldCheck, Lock, EyeOff, CheckCircle2, History, Download, SlidersHorizontal } from 'lucide-react';
import { ViewSkeleton, useViewLoader } from '../components/Shared';
import { useToast } from '../context/ToastContext';

const DPDP_CHECKLIST = [
  { id: 1, label: 'DPDP Act 2023 Compliant',                          done: true },
  { id: 2, label: 'Zero PII Transmitted to Cloud',                    done: true },
  { id: 3, label: 'Faces Blurred at Hardware Level (NPU)',            done: true },
  { id: 4, label: 'Local MAC Address Randomization Enabled',          done: true },
  { id: 5, label: 'Data Residency: India-only storage confirmed',     done: true },
];

const RETENTION_OPTIONS = [7, 90, 180];

export const PrivacyCenterView = () => {
  const { data } = useAppContext();
  const { privacyAudit, edgeDevices } = data;
  const { addToast } = useToast();
  const isLoaded = useViewLoader(350);

  const [retentionDays, setRetentionDays] = useState(7);

  const handleExport = () => {
    addToast('Compliance report exported (DPDP Act 2023)', 'success');
  };

  if (!isLoaded) return <ViewSkeleton />;

  return (
    <div className="flex flex-col gap-6">

      {/* Overview */}
      <div className="grid grid-cols-3 gap-4">

        {/* Hero panel */}
        <div className="col-span-2 bg-surface border border-emerald-500/20 rounded-lg p-6 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-5">
            <div className="p-3 bg-emerald-500/12 text-emerald-400 rounded-lg">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">Privacy by Design</h2>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed max-w-md">
                100% of video frames are processed locally at the edge and immediately discarded. Only anonymous metadata is transmitted to the cloud.
              </p>
            </div>
          </div>

          {/* DPDP Checklist */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold mb-1">DPDP Act 2023 Compliance</span>
            {DPDP_CHECKLIST.map(item => (
              <div key={item.id} className="bg-background border border-border rounded-lg px-3 py-2.5 flex items-center gap-2.5">
                <CheckCircle2 size={14} className={item.done ? "text-emerald-400 shrink-0" : "text-slate-500 shrink-0"} />
                <span className="text-xs text-slate-300 font-medium">{item.label}</span>
                {item.done && (
                  <span className="ml-auto text-[10px] text-emerald-400 font-semibold">✓ Verified</span>
                )}
              </div>
            ))}
          </div>

          {/* Data retention slider */}
          <div className="mt-5 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <SlidersHorizontal size={12} /> Data Retention Period
              </span>
              <span className="text-sm font-bold font-mono text-slate-100">
                {retentionDays} days
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={2}
              step={1}
              value={RETENTION_OPTIONS.indexOf(retentionDays)}
              onChange={(e) => setRetentionDays(RETENTION_OPTIONS[Number(e.target.value)])}
              className="w-full accent-indigo-accent"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              {RETENTION_OPTIONS.map(d => (
                <span key={d} className={retentionDays === d ? "text-indigo-400 font-semibold" : ""}>{d}d</span>
              ))}
            </div>
          </div>
        </div>

        {/* Hardware Privacy Toggles */}
        <div className="bg-surface border border-border rounded-lg p-5 flex flex-col">
          <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
            <Lock size={13} /> Hardware Privacy
          </h3>
          <div className="flex flex-col gap-2 flex-1 overflow-auto">
            {edgeDevices.map(dev => (
              <div key={dev.id} className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
                <div>
                  <span className="text-xs font-medium text-slate-200 block">{dev.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{dev.id}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20 text-[11px] font-semibold">
                  <EyeOff size={12} /> Private
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Privacy Ledger */}
      <div className="bg-surface border border-border rounded-lg flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <History size={13} className="text-indigo-400" /> Privacy Ledger
            </h2>
            <p className="text-[11px] text-slate-500 mt-1">
              Append-only hashed audit log proving no video frames were retained.
            </p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-indigo-accent/30 text-indigo-400 hover:bg-indigo-accent/8 transition-colors"
          >
            <Download size={13} /> Export Compliance Report
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] text-slate-500 uppercase bg-white/[0.02] sticky top-0 border-b border-border">
              <tr>
                <th className="px-5 py-3 font-semibold">Timestamp</th>
                <th className="px-5 py-3 font-semibold">Source Node</th>
                <th className="px-5 py-3 font-semibold">Metadata Event</th>
                <th className="px-5 py-3 font-semibold">SHA-256 Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {privacyAudit.map(entry => (
                <tr key={entry.id} className="hover:bg-white/[0.03] transition-colors font-mono">
                  <td className="px-5 py-3.5 text-slate-500">{entry.time}</td>
                  <td className="px-5 py-3.5 text-indigo-400/80">{entry.camera}</td>
                  <td className="px-5 py-3.5 text-slate-300">{entry.event}</td>
                  <td className="px-5 py-3.5">
                    <span className="bg-background px-2 py-1 rounded border border-border text-slate-500 select-all text-[10px]">
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
