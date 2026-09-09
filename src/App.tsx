import React, { useState } from 'react';
import { ExperimentProvider } from './context/ExperimentContext';
import { Layout } from './components/Layout';
import type { PageId } from './components/Sidebar';
import * as Pages from './pages';
import heroBg from './assets/hero-bg.jpg';
import { NeuralBackground } from './components/NeuralBackground';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('overview');
  const [resetKey, setResetKey] = useState(0);
  const [isLabActive, setIsLabActive] = useState(false);
  const [bgMode, setBgMode] = useState<'HERO' | 'PLAYGROUND' | 'FAST_WEIGHT' | 'INTERFERENCE' | 'RETENTION'>('HERO');

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

  const labContent = (
    <ExperimentProvider key={resetKey}>
      <Layout activePage={activePage} setActivePage={setActivePage} onReset={handleReset}>
        {renderPage()}
      </Layout>
    </ExperimentProvider>
  );

  return (
    <div className={`${isLabActive ? 'h-screen overflow-hidden' : 'min-h-screen overflow-x-hidden'} w-full relative text-foreground font-sans selection:bg-primary/30`}>
      
      {/* Global High-Fidelity Spaceship Nebula Image Background */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] ease-in-out"
        style={{ 
          backgroundImage: `url(${heroBg})`,
          transform: isLabActive ? 'scale(1.05)' : (bgMode === 'HERO' ? 'scale(1.02)' : 'scale(1.05)')
        }}
      />
      
      {/* Global Dark gradient overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-transparent via-[#05000a]/50 to-[#05000a]/90" />

      {/* Global Animated Overlay */}
      <NeuralBackground mode={isLabActive ? 'PLAYGROUND' : bgMode} />

      <div className={`relative z-10 w-full ${isLabActive ? 'h-full' : ''}`}>
        {!isLabActive ? (
          <Pages.LandingPage onLaunch={() => setIsLabActive(true)} setBgMode={setBgMode} />
        ) : (
          labContent
        )}
      </div>
    </div>
  );
}
