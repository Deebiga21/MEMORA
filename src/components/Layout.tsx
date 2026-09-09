import React, { useState } from 'react';
import { Sidebar, type PageId } from './Sidebar';
import { useExperiment } from '../context/ExperimentContext';
import { Activity, Clock, RefreshCw } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  onReset: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activePage, setActivePage, onReset }) => {
  const { state, resetExperiment } = useExperiment();
  const [logOpen, setLogOpen] = useState(false);

  const handleReset = async () => {
    await resetExperiment();
    onReset();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8 lg:p-12 z-20">
      <div className="w-full h-full max-w-[1600px] bg-[#05000a]/70 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_0_80px_rgba(168,85,247,0.15)] overflow-hidden flex relative">
        <Sidebar activePage={activePage} setActivePage={setActivePage} onReset={handleReset} />
        
        <main className="flex-1 flex flex-col relative overflow-hidden h-full">
          {state && (
            <div className="h-16 border-b border-white/10 bg-black/20 flex items-center justify-between px-6 shrink-0 z-20">
              <div className="flex gap-6 items-center text-sm font-medium">
                <div className="flex flex-col"><span className="text-white/50 text-xs">MEMORIES</span><span className="text-primary">{state.base_memory.length + state.test_memory.length}</span></div>
                <div className="flex flex-col"><span className="text-white/50 text-xs">UPDATES</span><span className="text-white">{state.experiment_steps}</span></div>
                <div className="flex flex-col"><span className="text-white/50 text-xs">OLD RETENTION</span><span className={state.old_memory_accuracy < 70 ? 'text-red-400' : 'text-green-400'}>{state.old_memory_accuracy.toFixed(1)}%</span></div>
                <div className="flex flex-col"><span className="text-white/50 text-xs">NEW ACQUISITION</span><span className="text-blue-400">{state.new_memory_accuracy.toFixed(1)}%</span></div>
                <div className="flex flex-col"><span className="text-white/50 text-xs">INTERFERENCE</span><span className="text-yellow-400">{state.interference_rate.toFixed(1)}%</span></div>
                <div className="flex flex-col"><span className="text-white/50 text-xs">LAMBDA / ETA</span><span className="text-white">{state.lambda_val.toFixed(2)} / {state.eta.toFixed(2)}</span></div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setLogOpen(!logOpen)} className="flex items-center gap-2 text-xs bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-lg transition-colors">
                  <Activity className="w-4 h-4" /> ACTION LOG
                </button>
                <button onClick={handleReset} className="flex items-center gap-2 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2 rounded-lg transition-colors">
                  <RefreshCw className="w-4 h-4" /> RESET EXPERIMENT
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-8 relative flex">
            <div className={`w-full mx-auto relative z-10 flex-1 transition-all duration-300 ${logOpen ? 'mr-80' : ''}`}>
              {children}
            </div>

            <div className={`absolute right-0 top-0 bottom-0 w-80 bg-[#05000a]/90 backdrop-blur-3xl border-l border-white/10 transform transition-transform duration-300 z-30 flex flex-col ${logOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="p-4 border-b border-white/10 font-bold flex items-center gap-2 text-white">
                <Clock className="w-4 h-4" /> EXPERIMENT LOG
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {state?.action_log.map((log, i) => (
                  <div key={i} className="text-xs border-l-2 border-primary pl-3 py-1">
                    <div className="flex justify-between text-white/50 mb-1">
                      <span>Step {log.step}</span>
                      <span className="opacity-50">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="font-semibold text-primary">{log.action}</div>
                    <div className="text-white/90 mt-0.5">{log.details}</div>
                  </div>
                ))}
                {!state?.action_log.length && (
                  <div className="text-white/50 text-sm italic text-center mt-10">No actions recorded yet.</div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
