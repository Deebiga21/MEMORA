import React, { useState } from 'react';
import { ExperimentProvider } from './context/ExperimentContext';
import { Layout } from './components/Layout';
import type { PageId } from './components/Sidebar';
import * as Pages from './pages';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('overview');
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey(k => k + 1);
    setActivePage('overview');
  };

  React.useEffect(() => {
    const handleNav = (e: Event) => {
      const customEvent = e as CustomEvent<PageId>;
      if (customEvent.detail) {
        setActivePage(customEvent.detail);
      }
    };
    window.addEventListener('navigate', handleNav);
    return () => window.removeEventListener('navigate', handleNav);
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case 'overview': return <Pages.Overview />;
      case 'playground': return <Pages.MemoryPlayground />;
      case 'fast_weights': return <Pages.FastWeightLab />;
      case 'interference': return <Pages.InterferenceLab />;
      case 'surgery': return <Pages.MemorySurgery />;
      case 'retention': return <Pages.RetentionVsLearning />;
      case 'predict': return <Pages.PredictFailure />;
      case 'memory_map': return <Pages.InternalMemoryMap />;
      case 'bdh_cq': return <Pages.BdhCqConnection />;
      case 'report': return <Pages.ExperimentReport />;
      case 'history': return <Pages.ExperimentHistory />;
      case 'summary': return <Pages.LearningSummary />;
      default: return <Pages.Overview />;
    }
  };

  return (
    <ExperimentProvider key={resetKey}>
      <Layout activePage={activePage} setActivePage={setActivePage} onReset={handleReset}>
        {renderPage()}
      </Layout>
    </ExperimentProvider>
  );
}
