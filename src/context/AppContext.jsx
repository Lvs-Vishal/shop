import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { initialMockData } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(initialMockData);
  const [isLiveDemo, setIsLiveDemo] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  
  // Store selector
  const [selectedStore, setSelectedStore] = useState('042-BLR');

  // Alerts state (lifted out of data so mutations don't trigger full data re-render)
  const [alerts, setAlerts] = useState(initialMockData.alerts);

  // Buffer for offline events
  const [bufferedEvents, setBufferedEvents] = useState(0);

  // Resolve an alert by id
  const resolveAlert = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  };

  // Assign a staff member to an alert
  const assignAlert = (id, assignee) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, assignee } : a));
  };

  // Toggle a counter's open/closed status
  const toggleCounterStatus = (counterId) => {
    setData(prev => ({
      ...prev,
      queues: prev.queues.map(q =>
        q.id === counterId
          ? { ...q, status: q.status === 'Open' ? 'Closed' : 'Open', length: q.status === 'Open' ? 0 : q.length || 1, waitTime: q.status === 'Open' ? 0 : q.waitTime || 1 }
          : q
      )
    }));
  };

  // Simulation effect
  useEffect(() => {
    if (!isLiveDemo) return;

    const intervalId = setInterval(() => {
      setData((prev) => {
        // If offline, we buffer events and don't update main metrics heavily,
        // just increase buffer count. In a real app, Edge device caches locally.
        if (isOffline) {
          setBufferedEvents(b => b + 1);
          return prev; // Keep data frozen to simulate offline UI
        }
        
        // Mutate shoppers slightly to simulate movement
        const newShoppers = prev.shoppers.map(s => ({
          ...s,
          x: Math.max(0, Math.min(100, s.x + (Math.random() - 0.5) * 5)),
          y: Math.max(0, Math.min(100, s.y + (Math.random() - 0.5) * 5))
        }));

        // Mutate counters slightly
        return {
          ...prev,
          shoppers: newShoppers,
          storeContext: {
            ...prev.storeContext,
            peopleInStore: prev.storeContext.peopleInStore + Math.floor(Math.random() * 3) - 1,
            revenueRecovered: prev.storeContext.revenueRecovered + Math.floor(Math.random() * 50)
          },
          queues: prev.queues.map(q => 
            q.status === 'Open' ? { ...q, length: Math.max(0, q.length + Math.floor(Math.random() * 3) - 1) } : q
          )
        };
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, [isLiveDemo, isOffline]);

  // When coming back online, flush buffer
  useEffect(() => {
    if (!isOffline && bufferedEvents > 0) {
      // Flush animation simulation
      setTimeout(() => {
        setBufferedEvents(0);
      }, 1000);
    }
  }, [isOffline, bufferedEvents]);

  return (
    <AppContext.Provider value={{ 
      data, 
      isLiveDemo, 
      setIsLiveDemo, 
      isOffline, 
      setIsOffline,
      bufferedEvents,
      selectedStore,
      setSelectedStore,
      alerts,
      resolveAlert,
      assignAlert,
      toggleCounterStatus,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
