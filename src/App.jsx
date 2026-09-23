import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Copilot } from './components/Copilot';

import { LiveStoreView } from './views/LiveStoreView';
import { ShopperAnalyticsView } from './views/ShopperAnalyticsView';
import { ShelfHealthView } from './views/ShelfHealthView';
import { QueueIntelligenceView } from './views/QueueIntelligenceView';
import { EdgeNodesView } from './views/EdgeNodesView';
import { PrivacyCenterView } from './views/PrivacyCenterView';

const AppContent = () => {
  const [currentView, setCurrentView] = useState('live');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'live':
        return <LiveStoreView />;
      case 'shoppers':
        return <ShopperAnalyticsView />;
      case 'inventory':
        return <ShelfHealthView />;
      case 'queue':
        return <QueueIntelligenceView />;
      case 'edge':
        return <EdgeNodesView />;
      case 'privacy':
        return <PrivacyCenterView />;
      default:
        return <LiveStoreView />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      setCurrentView={setCurrentView}
      isCopilotOpen={isCopilotOpen}
      setIsCopilotOpen={setIsCopilotOpen}
    >
      {renderView()}
      <Copilot isOpen={isCopilotOpen} onClose={() => setIsCopilotOpen(false)} />
    </Layout>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
