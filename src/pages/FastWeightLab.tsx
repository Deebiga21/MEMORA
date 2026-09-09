import React, { useState } from 'react';
import { useExperiment } from '../context/ExperimentContext';
import { Settings2, RefreshCw } from 'lucide-react';

export const FastWeightLab: React.FC = () => {
  const { state, setParams, queryModel } = useExperiment();
  const [localLambda, setLocalLambda] = useState(state?.lambda_val || 0.5);
  const [localEta, setLocalEta] = useState(state?.eta || 0.5);

  const handleApplyParams = () => {
    setParams(localLambda, localEta);
  };

  const handleResetFast = async () => {
    try {
      await fetch('http://localhost:8000/api/experiment/reset_fast', { method: 'POST' });
      await queryModel("CAT");
    } catch (e) {
      console.error(e);
    }
  };

  if (!state) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold tracking-tight text-primary">FAST WEIGHT LAB</h1>
      <p className="text-muted-foreground text-lg">How can memory change during inference?</p>
      <p className="text-sm">Control the mathematical influence of test-time updates vs. base parameters.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-card border border-border rounded-xl p-6 shadow-lg flex flex-col gap-6">
          <div className="flex items-center gap-2 border-b border-border pb-4">
            <Settings2 className="text-yellow-400" />
            <h2 className="text-xl font-semibold">Memory Parameters</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-muted-foreground uppercase tracking-wider font-bold">Fast Weight Influence (Lambda)</label>
                <span className="text-primary font-mono bg-background px-2 py-0.5 rounded">{localLambda.toFixed(2)}</span>
              </div>
              <input 
                type="range" 
                min="0" max="1" step="0.05"
                value={localLambda}
                onChange={e => setLocalLambda(parseFloat(e.target.value))}
                onMouseUp={handleApplyParams}
                className="w-full accent-primary"
              />
              <p className="text-xs text-muted-foreground mt-2">Controls how strongly the fast weights override base memory during retrieval.</p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-muted-foreground uppercase tracking-wider font-bold">Test-Time Learning Rate (Eta)</label>
                <span className="text-primary font-mono bg-background px-2 py-0.5 rounded">{localEta.toFixed(2)}</span>
              </div>
              <input 
                type="range" 
                min="0" max="1" step="0.05"
                value={localEta}
                onChange={e => setLocalEta(parseFloat(e.target.value))}
                onMouseUp={handleApplyParams}
                className="w-full accent-primary"
              />
              <p className="text-xs text-muted-foreground mt-2">Controls how strongly new information modifies the fast weights.</p>
            </div>

            <div className="pt-4 border-t border-border">
              <button 
                onClick={handleResetFast}
                className="w-full flex items-center justify-center gap-2 bg-destructive/20 hover:bg-destructive/40 text-destructive font-medium py-2 rounded-md transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> RESET FAST WEIGHTS
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-lg flex flex-col gap-6">
          <h2 className="text-xl font-semibold border-b border-border pb-4">Internal Memory State</h2>
          
          <div className="space-y-4">
            <div className="bg-background border border-border rounded p-4">
              <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">SLOW MEMORY (W)</h3>
              {state.base_memory.length === 0 ? (
                <div className="text-xs italic text-muted-foreground">Empty</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {state.base_memory.map((m, i) => (
                    <span key={i} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                      {m.cue} → {m.target}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-background border border-border rounded p-4">
              <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">FAST MEMORY (S)</h3>
              {state.test_memory.length === 0 ? (
                <div className="text-xs italic text-muted-foreground">Empty</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {state.test_memory.map((m, i) => (
                    <span key={i} className="bg-primary/20 text-primary text-xs px-2 py-1 rounded border border-primary/30">
                      {m.cue} → {m.target}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
