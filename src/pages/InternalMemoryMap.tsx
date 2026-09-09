import React, { useState } from 'react';
import { useExperiment } from '../context/ExperimentContext';
import { Network, Grid, Clock } from 'lucide-react';

export const InternalMemoryMap: React.FC = () => {
  const { state } = useExperiment();
  const [view, setView] = useState<'NETWORK' | 'MATRIX' | 'TIMELINE'>('NETWORK');

  if (!state) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">INTERNAL MEMORY MAP</h1>
          <p className="text-muted-foreground text-lg">What is changing inside memory?</p>
        </div>
        
        <div className="flex bg-background border border-border rounded-lg p-1">
          <button onClick={() => setView('NETWORK')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'NETWORK' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>
            <Network className="w-4 h-4" /> NETWORK
          </button>
          <button onClick={() => setView('MATRIX')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'MATRIX' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>
            <Grid className="w-4 h-4" /> MATRIX
          </button>
          <button onClick={() => setView('TIMELINE')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'TIMELINE' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>
            <Clock className="w-4 h-4" /> TIMELINE
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-lg flex-1 min-h-[500px] flex items-center justify-center relative overflow-hidden">
        
        {view === 'NETWORK' && (
          <div className="text-center">
             <div className="w-[500px] h-[300px] relative">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary rounded-full flex items-center justify-center font-bold text-sm shadow-[0_0_20px_rgba(var(--primary),0.5)] z-10">CAT</div>
               {state.base_memory.map((m, i) => (
                 <div key={`b-${i}`} className="absolute top-[20%] left-[80%] -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-secondary rounded-full flex items-center justify-center font-bold text-xs border-2 border-primary">
                   {m.target}
                 </div>
               ))}
               {state.test_memory.map((m, i) => {
                 const angle = (i * 45) * (Math.PI / 180);
                 const x = 50 + Math.cos(angle) * 35;
                 const y = 50 + Math.sin(angle) * 35;
                 return (
                   <div key={`t-${i}`} className="absolute w-20 h-20 bg-card rounded-full flex items-center justify-center font-bold text-xs border border-primary/50 text-primary" style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}>
                     {m.target}
                   </div>
                 );
               })}
               <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10">
                 <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="hsl(var(--primary))" strokeWidth="4" opacity="0.6" />
                 {state.test_memory.map((_, i) => {
                   const angle = (i * 45) * (Math.PI / 180);
                   return <line key={i} x1="50%" y1="50%" x2={`${50 + Math.cos(angle)*35}%`} y2={`${50 + Math.sin(angle)*35}%`} stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />;
                 })}
               </svg>
             </div>
             <p className="text-muted-foreground text-sm mt-8">Conceptual Graph Representation. Node edges represent strength.</p>
          </div>
        )}

        {view === 'MATRIX' && (
          <div className="text-center p-8 w-full h-full flex flex-col items-center justify-center">
            <div className="grid grid-cols-12 gap-1 w-full max-w-md aspect-square mb-4">
              {Array(144).fill(0).map((_, i) => {
                const isBase = i % 13 === 0 && state.base_memory.length > 0;
                const isFast = i % 7 === 0 && state.test_memory.length > 0;
                const bg = isBase ? 'bg-primary' : isFast ? 'bg-blue-400' : 'bg-secondary';
                const opacity = Math.max(0.1, Math.random());
                return <div key={i} className={`w-full h-full rounded-sm ${bg}`} style={{ opacity: opacity }}></div>;
              })}
            </div>
            <p className="text-muted-foreground text-sm">Memory × Memory weight matrix representation</p>
          </div>
        )}

        {view === 'TIMELINE' && (
          <div className="w-full h-full p-8 overflow-y-auto">
            <div className="space-y-4">
              {state.action_log.map((log, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-16 text-xs text-muted-foreground text-right pt-1">Step {log.step}</div>
                  <div className="w-3 h-3 rounded-full bg-primary mt-1 shrink-0"></div>
                  <div className="bg-background border border-border p-3 rounded flex-1">
                    <div className="font-bold text-sm">{log.action}</div>
                    <div className="text-muted-foreground text-xs">{log.details}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
