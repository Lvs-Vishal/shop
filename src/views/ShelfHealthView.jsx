import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { StatusIndicator } from '../components/Shared';
import { PackageX, AlertCircle, ShoppingCart, CheckCircle2 } from 'lucide-react';

const InventoryCard = ({ item, poSentIds, onCreatePO }) => {
  const poSent = poSentIds.has(item.id);

  return (
    <div className={`bg-surface border rounded-xl p-4 flex flex-col gap-3 transition-colors hover:bg-white/5 ${item.revenueAtRisk > 0 ? 'border-status-critical/30' : 'border-border'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-gray-200">{item.name}</h4>
          <span className="text-xs text-gray-500 font-mono mt-1 block">{item.id} &bull; {item.shelf}</span>
        </div>
        <StatusIndicator status={item.status} />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 uppercase font-semibold">Fill Level</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tabular-nums text-white">{item.fillPct}%</span>
            <div className="flex-1 bg-surface-light h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full ${item.fillPct < 20 ? 'bg-status-critical' : item.fillPct < 50 ? 'bg-status-warning' : 'bg-status-healthy'}`} 
                style={{ width: `${item.fillPct}%` }} 
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 uppercase font-semibold">Planogram</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tabular-nums text-white">{item.planogramPct}%</span>
            <div className="flex-1 bg-surface-light h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full ${item.planogramPct < 100 ? 'bg-status-warning' : 'bg-status-healthy'}`} 
                style={{ width: `${item.planogramPct}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      {item.revenueAtRisk > 0 && (
        <div className="mt-2 pt-3 border-t border-border flex justify-between items-center bg-status-critical/5 -mx-4 -mb-4 px-4 py-3 rounded-b-xl">
          <div className="flex flex-col">
            <span className="text-xs text-status-critical uppercase font-semibold">Revenue at Risk</span>
            <span className="text-lg font-bold text-status-critical font-mono">₹{item.revenueAtRisk.toLocaleString()}</span>
          </div>
          {poSent ? (
            <button
              disabled
              className="bg-status-healthy/20 text-status-healthy text-xs font-bold px-3 py-1.5 rounded flex items-center gap-2 border border-status-healthy/30 cursor-not-allowed opacity-80"
            >
              <CheckCircle2 size={14} /> PO Sent ✓
            </button>
          ) : (
            <button
              onClick={() => onCreatePO(item.id)}
              className="bg-status-critical text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-2 hover:bg-status-critical/80 transition-colors"
            >
              <ShoppingCart size={14} /> Create PO
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const ShelfHealthView = () => {
  const { data } = useAppContext();
  const { inventory } = data;
  const [poSentIds, setPoSentIds] = useState(new Set());

  const handleCreatePO = (itemId) => {
    setPoSentIds(prev => new Set([...prev, itemId]));
  };

  const sortedInventory = [...inventory].sort((a, b) => b.revenueAtRisk - a.revenueAtRisk);
  const totalRisk = sortedInventory.reduce((acc, curr) => acc + curr.revenueAtRisk, 0);
  const stockOuts = sortedInventory.filter(i => i.status === 'Out' || i.status === 'Low').length;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Summary */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-status-critical/10 border border-status-critical/30 rounded-xl p-5 flex items-center justify-between col-span-2">
          <div className="flex gap-4 items-center">
            <div className="p-3 bg-status-critical/20 text-status-critical rounded-lg">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="text-status-critical font-bold text-lg">Inventory Action Required</h3>
              <p className="text-gray-400 text-sm mt-1">{stockOuts} SKUs require immediate attention to prevent further revenue loss.</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Total Revenue at Risk</span>
            <span className="text-3xl font-bold font-mono text-status-critical">₹{totalRisk.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="bg-surface border border-border rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-white/5 text-gray-300 rounded-lg">
            <PackageX size={24} />
          </div>
          <div>
            <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Avg Out-of-Stock Time</span>
            <span className="text-2xl font-bold text-white tabular-nums">42m</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white uppercase tracking-wide">Shelf Grid &amp; Alerts</h2>
          <span className="text-xs text-gray-500 font-medium">Sorted by Revenue at Risk (₹)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedInventory.map(item => (
            <InventoryCard
              key={item.id}
              item={item}
              poSentIds={poSentIds}
              onCreatePO={handleCreatePO}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
