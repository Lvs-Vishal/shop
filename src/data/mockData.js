// Initial mock state for the dashboard

export const initialMockData = {
  storeContext: {
    peopleInStore: 142,
    entriesToday: 1204,
    exitsToday: 1062,
    avgDwellTime: 24, // minutes
    longestQueue: 7,  // people
    revenueRecovered: 45200, // INR
  },
  
  shoppers: [
    { id: 1, x: 20, y: 30 },
    { id: 2, x: 50, y: 60 },
    { id: 3, x: 80, y: 20 },
    { id: 4, x: 10, y: 80 },
    { id: 5, x: 45, y: 45 },
    { id: 6, x: 70, y: 70 },
  ],

  footfallHistory: Array.from({ length: 12 }, (_, i) => ({
    time: `${i + 8}:00`,
    actual: Math.floor(Math.random() * 100) + 50,
    forecast: null
  })).concat(Array.from({ length: 6 }, (_, i) => ({
    time: `${i + 20}:00`,
    actual: null,
    forecast: Math.floor(Math.random() * 80) + 20
  }))),

  zoneDwellTime: [
    { zone: 'Produce',   time: 5,  revenueLost: 1200 },
    { zone: 'Dairy',     time: 3,  revenueLost: 500 },
    { zone: 'Bakery',    time: 4,  revenueLost: 300 },
    { zone: 'Meat',      time: 6,  revenueLost: 2100 },
    { zone: 'Snacks',    time: 8,  revenueLost: 4500 },
    { zone: 'Beverages', time: 2,  revenueLost: 100 },
    { zone: 'Checkout',  time: 10, revenueLost: 0 },
    { zone: 'Entrance',  time: 1,  revenueLost: 0 }
  ],

  funnel: {
    entered: 1204,
    visitedAisle: 950,
    dwelled: 620,
    pickedUp: 410,
    purchased: 380,
  },

  inventory: [
    { id: 'SKU-001', name: 'Almond Milk 1L',  shelf: 'Dairy A2',  fillPct: 10, planogramPct: 100, status: 'Low',      revenueAtRisk: 4500,  outSince: '45m' },
    { id: 'SKU-042', name: 'Organic Bananas', shelf: 'Produce B1', fillPct: 0,  planogramPct: 80,  status: 'Out',      revenueAtRisk: 12500, outSince: '2h 10m' },
    { id: 'SKU-108', name: 'Chips Multipack', shelf: 'Snacks C4',  fillPct: 85, planogramPct: 40,  status: 'Misplaced',revenueAtRisk: 800,   outSince: '-' },
    { id: 'SKU-205', name: 'Cola 2L',         shelf: 'Bev D1',     fillPct: 95, planogramPct: 100, status: 'Stocked',  revenueAtRisk: 0,     outSince: '-' },
  ],

  queues: [
    { id: 1, status: 'Open',   length: 5, waitTime: 4.5 },
    { id: 2, status: 'Open',   length: 2, waitTime: 1.2 },
    { id: 3, status: 'Closed', length: 0, waitTime: 0 },
    { id: 4, status: 'Open',   length: 7, waitTime: 8.5 },
  ],

  edgeDevices: [
    { id: 'NODE-1', name: 'Entrance Cam',        type: 'Qualcomm QCS6490',          temp: 62, npu: 45, fps: 30, uptime: '45d 12h',  status: 'Online',   lastSync: 'Now',    modelVersion: 'v2.3.1', isKirana: false },
    { id: 'NODE-2', name: 'Aisle 3 Cam',         type: 'Raspberry Pi 5',            temp: 75, npu: 92, fps: 15, uptime: '12d 4h',   status: 'Degraded', lastSync: '2m ago', modelVersion: 'v2.2.0', isKirana: false },
    { id: 'NODE-3', name: 'Checkout Cam',         type: 'Qualcomm QCS6490',          temp: 58, npu: 30, fps: 30, uptime: '145d 2h',  status: 'Online',   lastSync: 'Now',    modelVersion: 'v2.3.1', isKirana: false },
    { id: 'NODE-4', name: 'Kirana Phone (A54)',   type: 'Snapdragon 778G (Android)', temp: 44, npu: 38, fps: 24, uptime: '3d 7h',    status: 'Online',   lastSync: 'Now',    modelVersion: 'v2.3.1', isKirana: true  },
  ],

  bandwidthStats: {
    savedPct: 99.8,
    savedGB: 450,
    sentGB: 0.9,
    savedData: '450 GB/month',
    sentData: '0.9 GB/month'
  },

  otaRollout: {
    modelVersion: 'v2.3.1',
    nodesOnLatest: 3,
    totalNodes: 4,
    releaseDate: 'Sep 20, 2026',
  },

  privacyAudit: [
    { id: '1', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', event: 'Queue Count Updated',  time: '10:45:12', camera: 'Checkout Cam' },
    { id: '2', hash: '8b1a9953c4611296a827abf8c47804d7e6c49c6b12d7c57dbd7616223594191c', event: 'Stock Out Detected',   time: '10:43:05', camera: 'Aisle 3 Cam' },
    { id: '3', hash: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae', event: 'Dwell Time > 30s',    time: '10:41:22', camera: 'Entrance Cam' },
  ],

  chatHistory: [
    { sender: 'user',    message: 'Which shelf cost me the most this week?' },
    { sender: 'copilot', message: 'Based on edge analytics, **Produce B1 (Organic Bananas)** had the highest revenue at risk. It was out of stock for 14 hours total this week, resulting in an estimated ₹34,000 in lost revenue.' },
    { sender: 'user',    message: 'When should I schedule extra staff?' },
    { sender: 'copilot', message: 'Queue intelligence predicts a surge between 17:00 and 19:00 today. I recommend opening Counter 3 at 16:45 to prevent wait times from exceeding the 5-minute threshold.' },
  ],

  alerts: [
    { id: 'ALT-001', type: 'stockout', severity: 'critical', zone: 'Produce B1', message: 'Organic Bananas out of stock for 2h 10m — estimated ₹12,500 revenue at risk.', assignee: null,         timestamp: '10:43', resolved: false },
    { id: 'ALT-002', type: 'queue',    severity: 'critical', zone: 'Checkout',   message: 'Counter 4 wait time exceeded 8 min SLA threshold. Recommend opening Counter 3.', assignee: null,        timestamp: '10:50', resolved: false },
    { id: 'ALT-003', type: 'shelf',    severity: 'warning',  zone: 'Dairy A2',   message: 'Almond Milk 1L at 10% fill — planogram compliance at risk.',                      assignee: 'Ravi K.',  timestamp: '10:31', resolved: false },
    { id: 'ALT-004', type: 'assist',   severity: 'warning',  zone: 'Snacks C4',  message: 'Shopper dwell >90s without pickup detected. Possible assistance needed.',          assignee: null,        timestamp: '10:55', resolved: false },
    { id: 'ALT-005', type: 'device',   severity: 'warning',  zone: 'Aisle 3',    message: 'NODE-2 NPU utilisation at 92% — risk of dropped frames. Consider task offload.',  assignee: 'Suresh T.',timestamp: '09:15', resolved: false },
    { id: 'ALT-006', type: 'stockout', severity: 'ok',       zone: 'Beverages',  message: 'Cola 2L restocked successfully. Revenue impact neutralised.',                      assignee: 'Priya M.',  timestamp: '09:00', resolved: true },
    { id: 'ALT-007', type: 'anomaly',  severity: 'warning',  zone: 'Entrance',   message: 'Unusual footfall spike at 09:30 — 40% above baseline. Possible event nearby.',   assignee: null,        timestamp: '09:35', resolved: false },
    { id: 'ALT-008', type: 'device',   severity: 'critical', zone: 'Kirana Hub', message: 'NODE-4 battery at 8% — charging required within 30 min to avoid downtime.',       assignee: null,        timestamp: '10:58', resolved: false },
  ],

  stores: [
    { id: '042-BLR', name: 'Store 042', city: 'Bangalore', healthScore: 87, footfall: 1204, conversionPct: 31.6, stockOutHours: 2.2, avgWait: 4.5, rankChange: 1 },
    { id: '011-MUM', name: 'Store 011', city: 'Mumbai',    healthScore: 74, footfall: 980,  conversionPct: 28.4, stockOutHours: 4.8, avgWait: 6.1, rankChange: -1 },
    { id: '055-DEL', name: 'Store 055', city: 'Delhi',     healthScore: 91, footfall: 1450, conversionPct: 34.2, stockOutHours: 0.8, avgWait: 3.2, rankChange: 2 },
    { id: '078-HYD', name: 'Store 078', city: 'Hyderabad', healthScore: 65, footfall: 720,  conversionPct: 22.1, stockOutHours: 7.5, avgWait: 9.8, rankChange: -2 },
  ],
};
