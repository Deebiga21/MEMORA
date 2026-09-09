import React, { useState } from 'react';
import { useExperiment } from '../context/ExperimentContext';
import { AlertTriangle, Play } from 'lucide-react';

export const InterferenceLab: React.FC = () => {
  const { state, interfere, resetExperiment } = useExperiment();
  const [conflictTarget, setConflictTarget] = useState('');

  const handleAddConflict = () => {
    if (conflictTarget) {
      interfere("CAT", conflictTarget.toUpperCase());
      setConflictTarget('');
    }
  };

  const runAuto = async () => {
    await resetExperiment();
    const conflicts = ["PET", "WILD", "DOMESTIC", "PREDATOR", "FELINE", "MAMMAL"];
    for (const c of conflicts) {
      await interfere("CAT", c);
      await new Promise(r => setTimeout(r, 500)); // Animate delay
    }
  };

  if (!state) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold tracking-tight text-primary">INTERFERENCE LAB</h1>
      <p className="text-muted-foreground text-lg">What happens when memories conflict?</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-lg space-y-6">
          <div className="flex items-center gap-2 border-b border-border pb-4">
            <AlertTriangle className="text-yellow-400" />
            <h2 className="text-xl font-semibold">Inject Conflict</h2>
          </div>

          <div className="p-4 bg-background border border-border rounded">
            <h3 className="text-xs text-muted-foreground uppercase mb-2">Base Memory</h3>
            <div className="text-lg font-bold">CAT → ANIMAL</div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground uppercase">Conflicting Target</label>
              <input 
                type="text" 
                value={conflictTarget}
                onChange={e => setConflictTarget(e.target.value)}
                placeholder="e.g. WILD"
                className="w-full bg-background border border-border rounded-md px-3 py-2 mt-1 focus:outline-none focus:border-primary"
              />
            </div>
            <button 
              onClick={handleAddConflict}
              className="w-full bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-500 font-medium py-2 rounded-md transition-colors"
            >
              ADD CONFLICT
            </button>

            <button 
              onClick={runAuto}
              className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 font-medium py-2 rounded-md transition-colors mt-4"
            >
              <Play className="w-4 h-4" /> RUN EXPERIMENT AUTOMATICALLY
            </button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-lg flex flex-col gap-6">
          <h2 className="text-xl font-semibold border-b border-border pb-4">Current Impact</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-background border border-border rounded text-center">
              <div className="text-xs text-muted-foreground uppercase">Old Retention</div>
              <div className="text-3xl font-bold text-green-400">{state.old_memory_accuracy.toFixed(0)}%</div>
            </div>
            <div className="p-4 bg-background border border-border rounded text-center">
              <div className="text-xs text-muted-foreground uppercase">Interference</div>
              <div className="text-3xl font-bold text-yellow-400">{state.interference_rate.toFixed(0)}%</div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-primary/10 border border-primary/30 rounded text-sm text-foreground">
            {state.old_memory_accuracy < 70 ? 
              "Catastrophic forgetting observed. The fast weights have entirely overwritten the base representation for CAT." :
              "Base memory is currently stable against interference."}
          </div>
        </div>
      </div>
    </div>
  );
};
