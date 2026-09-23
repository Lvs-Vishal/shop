import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { StatusIndicator, Modal, ViewSkeleton, useViewLoader } from '../components/Shared';
import { PackageX, AlertCircle, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const SUPPLIERS = ['Reliance Fresh Supply', 'Metro Cash & Carry', 'BigBasket B2B'];
const FILTER_OPTIONS = ['All', 'Out', 'Low', 'Misplaced', 'Stocked'];

/* ─── PO Modal ──────────────────────────────────────────────────── */
const POModal = ({ item, isOpen, onClose, onSubmit }) => {
  const [quantity, setQuantity]       = useState(50);
  const [supplier, setSupplier]       = useState(SUPPLIERS[0]);
  const [deliveryDate, setDeliveryDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ itemId: item.id, itemName: item.name, quantity, supplier, deliveryDate });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Create Purchase Order — ${item?.name}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* SKU (read-only) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold">SKU</label>
          <input
            readOnly
            value={item?.id ?? ''}
            className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-slate-400 cursor-not-allowed"
          />
        </div>

        {/* Quantity */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold">Quantity (units)</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
            className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-accent/50"
          />
        </div>

        {/* Supplier */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold">Supplier</label>
          <select
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-accent/50"
          >
            {SUPPLIERS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Expected delivery */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold">Expected Delivery</label>
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            required
            className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-accent/50"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-border text-slate-400 text-sm font-medium hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2 rounded-lg bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart size={14} /> Submit PO
          </button>
        </div>
      </form>
    </Modal>
  );
};

/* ─── Inventory card ─────────────────────────────────────────────── */
const InventoryCard = ({ item, poStatusMap, onOpenPOModal }) => {
  const poStatus = poStatusMap[item.id]; // undefined | 'pending'

  const displayStatus = poStatus === 'pending' ? 'PO Pending' : item.status;

  return (
    <div className={`bg-surface border rounded-lg p-4 flex flex-col gap-3 transition-colors hover:bg-white/[0.03] ${item.revenueAtRisk > 0 ? 'border-rose-500/25' : 'border-border'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-slate-200 text-sm">{item.name}</h4>
          <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">{item.id} &bull; {item.shelf}</span>
        </div>
        <StatusIndicator status={displayStatus} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] text-slate-500 uppercase tracking-wide font-semibold">Fill Level</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tabular-nums text-slate-100">{item.fillPct}%</span>
            <div className="flex-1 bg-surface-light h-1 rounded-full overflow-hidden border border-border">
              <div
                className={`h-full ${item.fillPct < 20 ? 'bg-rose-500' : item.fillPct < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${item.fillPct}%` }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] text-slate-500 uppercase tracking-wide font-semibold">Planogram</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tabular-nums text-slate-100">{item.planogramPct}%</span>
            <div className="flex-1 bg-surface-light h-1 rounded-full overflow-hidden border border-border">
              <div
                className={`h-full ${item.planogramPct < 100 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${item.planogramPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {item.revenueAtRisk > 0 && (
        <div className="pt-3 border-t border-border flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[11px] text-rose-400 uppercase font-semibold">Revenue at Risk</span>
            <span className="text-base font-bold text-rose-400 font-mono">₹{item.revenueAtRisk.toLocaleString()}</span>
          </div>

          {poStatus === 'pending' ? (
            <button
              disabled
              className="bg-amber-500/10 text-amber-400 text-xs font-semibold px-3 py-1.5 rounded border border-amber-500/25 cursor-not-allowed flex items-center gap-1.5"
            >
              PO Pending…
            </button>
          ) : (
            <button
              onClick={() => onOpenPOModal(item)}
              className="bg-rose-500 text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 hover:bg-rose-600 transition-colors"
            >
              <ShoppingCart size={13} /> Create PO
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/* ─── Main view ──────────────────────────────────────────────────── */
export const ShelfHealthView = () => {
  const { data } = useAppContext();
  const { inventory } = data;
  const { addToast } = useToast();
  const isLoaded = useViewLoader(350);

  const [statusFilter, setStatusFilter] = useState('All');
  const [poStatusMap,  setPoStatusMap]  = useState({});   // id -> 'pending'
  const [modalItem,    setModalItem]    = useState(null);

  const handleOpenPOModal  = (item) => setModalItem(item);
  const handleClosePOModal = ()     => setModalItem(null);

  const handleSubmitPO = ({ itemId, itemName }) => {
    setPoStatusMap(prev => ({ ...prev, [itemId]: 'pending' }));
    setModalItem(null);
    addToast(`Purchase order sent for ${itemName}`, 'success');
  };

  const sortedInventory = [...inventory].sort((a, b) => b.revenueAtRisk - a.revenueAtRisk);
  const filtered = statusFilter === 'All' ? sortedInventory : sortedInventory.filter(i => i.status === statusFilter);
  const totalRisk  = sortedInventory.reduce((acc, cur) => acc + cur.revenueAtRisk, 0);
  const stockOuts  = sortedInventory.filter(i => i.status === 'Out' || i.status === 'Low').length;

  if (!isLoaded) return <ViewSkeleton />;

  return (
    <div className="flex flex-col gap-6">
      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-rose-500/8 border border-rose-500/20 rounded-lg p-5 flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="p-2.5 bg-rose-500/15 text-rose-400 rounded-lg">
              <AlertCircle size={20} />
            </div>
            <div>
              <h3 className="text-rose-400 font-semibold text-sm">Inventory Action Required</h3>
              <p className="text-slate-400 text-xs mt-1">{stockOuts} SKUs require immediate attention.</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-500 uppercase font-semibold block mb-1">Total Revenue at Risk</span>
            <span className="text-2xl font-bold font-mono text-rose-400">₹{totalRisk.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-lg p-5 flex items-center gap-4">
          <div className="p-2.5 bg-surface-light text-slate-400 rounded-lg">
            <PackageX size={20} />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block mb-1">Avg Out-of-Stock Time</span>
            <span className="text-2xl font-bold text-slate-100 tabular-nums">42m</span>
          </div>
        </div>
      </div>

      {/* Filter chips + grid */}
      <div>
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <div className="flex gap-1.5 flex-wrap">
            {FILTER_OPTIONS.map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                  statusFilter === f
                    ? 'bg-indigo-accent/10 text-indigo-accent border-indigo-accent/40'
                    : 'bg-surface border-border text-slate-400 hover:text-slate-200'
                }`}
              >
                {f}
                {f !== 'All' && (
                  <span className="ml-1.5 text-[10px] text-slate-500 tabular-nums">
                    ({sortedInventory.filter(i => i.status === f).length})
                  </span>
                )}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {filtered.length} of {sortedInventory.length} SKUs &nbsp;·&nbsp; Sorted by Revenue at Risk
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => (
            <InventoryCard
              key={item.id}
              item={item}
              poStatusMap={poStatusMap}
              onOpenPOModal={handleOpenPOModal}
            />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center text-slate-500 py-12 text-sm">
              No items match the selected filter.
            </div>
          )}
        </div>
      </div>

      {/* PO Modal */}
      {modalItem && (
        <POModal
          item={modalItem}
          isOpen={true}
          onClose={handleClosePOModal}
          onSubmit={handleSubmitPO}
        />
      )}
    </div>
  );
};
