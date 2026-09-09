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
    <div className="min-h-screen bg-background text-foreground flex font-sans selection:bg-primary/30">
      <Sidebar activePage={activePage} setActivePage={setActivePage} onReset={handleReset} />
      
      <main className="flex-1 ml-64 flex flex-col relative overflow-hidden h-screen">
        {state && (
          <div className="h-16 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-20">
            <div className="flex gap-6 items-center text-sm font-medium">
              <div className="flex flex-col"><span className="text-muted-foreground text-xs">MEMORIES</span><span className="text-primary">{state.base_memory.length + state.test_memory.length}</span></div>
              <div className="flex flex-col"><span className="text-muted-foreground text-xs">UPDATES</span><span>{state.experiment_steps}</span></div>
              <div className="flex flex-col"><span className="text-muted-foreground text-xs">OLD RETENTION</span><span className={state.old_memory_accuracy < 70 ? 'text-destructive' : 'text-green-400'}>{state.old_memory_accuracy.toFixed(1)}%</span></div>
              <div className="flex flex-col"><span className="text-muted-foreground text-xs">NEW ACQUISITION</span><span className="text-blue-400">{state.new_memory_accuracy.toFixed(1)}%</span></div>
              <div className="flex flex-col"><span className="text-muted-foreground text-xs">INTERFERENCE</span><span className="text-yellow-400">{state.interference_rate.toFixed(1)}%</span></div>
              <div className="flex flex-col"><span className="text-muted-foreground text-xs">LAMBDA / ETA</span><span>{state.lambda_val.toFixed(2)} / {state.eta.toFixed(2)}</span></div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setLogOpen(!logOpen)} className="flex items-center gap-2 text-xs bg-secondary/50 hover:bg-secondary px-3 py-1.5 rounded transition-colors">
                <Activity className="w-4 h-4" /> ACTION LOG
              </button>
              <button onClick={handleReset} className="flex items-center gap-2 text-xs bg-destructive/20 hover:bg-destructive/40 text-destructive px-3 py-1.5 rounded transition-colors">
                <RefreshCw className="w-4 h-4" /> RESET EXPERIMENT
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-8 relative flex">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className={`max-w-6xl mx-auto relative z-10 flex-1 transition-all duration-300 ${logOpen ? 'mr-80' : ''}`}>
            {children}
          </div>

          <div className={`fixed right-0 top-16 bottom-0 w-80 bg-card border-l border-border transform transition-transform duration-300 z-30 flex flex-col ${logOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-4 border-b border-border font-bold flex items-center gap-2">
              <Clock className="w-4 h-4" /> EXPERIMENT LOG
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {state?.action_log.map((log, i) => (
                <div key={i} className="text-xs border-l-2 border-primary pl-3 py-1">
                  <div className="flex justify-between text-muted-foreground mb-1">
                    <span>Step {log.step}</span>
                    <span className="opacity-50">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="font-semibold text-primary">{log.action}</div>
                  <div className="text-foreground mt-0.5">{log.details}</div>
                </div>
              ))}
              {!state?.action_log.length && (
                <div className="text-muted-foreground text-sm italic text-center mt-10">No actions recorded yet.</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
