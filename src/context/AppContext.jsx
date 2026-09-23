import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { initialMockData } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(initialMockData);
  const [isLiveDemo, setIsLiveDemo] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // Store selector
  const [selectedStore, setSelectedStore] = useState('042-BLR');

  // Alerts (lifted out so mutations don't re-render the full data tree)
  const [alerts, setAlerts] = useState(initialMockData.alerts);

  // Buffer for offline events
  const [bufferedEvents, setBufferedEvents] = useState(0);

  // ── Theme ─────────────────────────────────────────────────────
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rs-theme') || 'dark';
    }
    return 'dark';
  });

  const setTheme = (t) => {
    setThemeState(t);
    localStorage.setItem('rs-theme', t);
  };

  // ── Alert mutations ───────────────────────────────────────────
  const resolveAlert = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  };

  const assignAlert = (id, assignee) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, assignee } : a));
  };

  // ── Counter toggle ────────────────────────────────────────────
  const toggleCounterStatus = (counterId) => {
    setData(prev => ({
      ...prev,
      queues: prev.queues.map(q =>
        q.id === counterId
          ? {
              ...q,
              status: q.status === 'Open' ? 'Closed' : 'Open',
              length:   q.status === 'Open' ? 0 : q.length   || 1,
              waitTime: q.status === 'Open' ? 0 : q.waitTime  || 1,
            }
          : q
      )
    }));
  };

  // ── Live simulation ───────────────────────────────────────────
  useEffect(() => {
    if (!isLiveDemo) return;
    const intervalId = setInterval(() => {
      setData(prev => {
        if (isOffline) {
          setBufferedEvents(b => b + 1);
          return prev;
        }
        return {
          ...prev,
          shoppers: prev.shoppers.map(s => ({
            ...s,
            x: Math.max(0, Math.min(100, s.x + (Math.random() - 0.5) * 5)),
            y: Math.max(0, Math.min(100, s.y + (Math.random() - 0.5) * 5)),
          })),
          storeContext: {
            ...prev.storeContext,
            peopleInStore:    prev.storeContext.peopleInStore + Math.floor(Math.random() * 3) - 1,
            revenueRecovered: prev.storeContext.revenueRecovered + Math.floor(Math.random() * 50),
          },
          queues: prev.queues.map(q =>
            q.status === 'Open'
              ? { ...q, length: Math.max(0, q.length + Math.floor(Math.random() * 3) - 1) }
              : q
          ),
        };
      });
    }, 2000);
    return () => clearInterval(intervalId);
  }, [isLiveDemo, isOffline]);

  // ── Offline flush ─────────────────────────────────────────────
  useEffect(() => {
    if (!isOffline && bufferedEvents > 0) {
      setTimeout(() => setBufferedEvents(0), 1000);
    }
  }, [isOffline, bufferedEvents]);

  return (
    <AppContext.Provider value={{
      data,
      isLiveDemo, setIsLiveDemo,
      isOffline,  setIsOffline,
      bufferedEvents,
      selectedStore, setSelectedStore,
      alerts, resolveAlert, assignAlert,
      toggleCounterStatus,
      theme, setTheme,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
