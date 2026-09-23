import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext(null);
let nextId = 0;

const ICONS = {
  success: <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />,
  error:   <AlertCircle  size={15} className="text-rose-400 shrink-0" />,
  info:    <Info         size={15} className="text-indigo-400 shrink-0" />,
};

/* ─── Toast item ──────────────────────────────────────────────── */
const Toast = ({ toast, onRemove }) => {
  useEffect(() => {
    const t = setTimeout(() => onRemove(toast.id), 3200);
    return () => clearTimeout(t);
  }, [toast.id, onRemove]);

  return (
    <div
      style={{ animation: 'toast-in 0.2s ease-out' }}
      className="flex items-start gap-3 bg-surface border border-border rounded-lg px-4 py-3 shadow-xl min-w-[260px] max-w-[360px] pointer-events-auto"
    >
      {ICONS[toast.type] ?? ICONS.info}
      <span className="text-sm text-slate-200 flex-1 leading-snug">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-slate-500 hover:text-slate-300 transition-colors mt-0.5 shrink-0"
      >
        <X size={13} />
      </button>
    </div>
  );
};

/* ─── Provider ────────────────────────────────────────────────── */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = ++nextId;
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast stack — bottom-right, above everything */}
      <div className="fixed bottom-5 right-5 flex flex-col gap-2 z-[9999] pointer-events-none">
        {toasts.map(t => (
          <Toast key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
};
