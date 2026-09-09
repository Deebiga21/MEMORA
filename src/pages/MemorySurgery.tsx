import React, { useState } from 'react';
import { useExperiment } from '../context/ExperimentContext';
import { Scissors, Edit3, Trash2, PlusCircle, AlertTriangle } from 'lucide-react';

export const MemorySurgery: React.FC = () => {
  const { state, trainBase, updateTestTime, eraseMemory, interfere } = useExperiment();
  
  const [cue, setCue] = useState('');
  const [target, setTarget] = useState('');
  
  if (!state) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold tracking-tight text-primary">MEMORY SURGERY</h1>
      <p className="text-muted-foreground text-lg">"What happens if I directly manipulate memory?"</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-card border border-border rounded-xl p-6 shadow-lg space-y-4">
             <div className="flex items-center gap-2 border-b border-border pb-4">
              <Scissors className="text-red-400" />
              <h2 className="text-xl font-semibold">Operations</h2>
            </div>
            
            <input 
                type="text" value={cue} onChange={e => setCue(e.target.value.toUpperCase())}
                placeholder="CUE (e.g. CAT)" className="w-full bg-background border border-border rounded-md px-3 py-2"
            />
            <input 
                type="text" value={target} onChange={e => setTarget(e.target.value.toUpperCase())}
                placeholder="TARGET (e.g. WILD)" className="w-full bg-background border border-border rounded-md px-3 py-2"
            />

            <div className="grid grid-cols-1 gap-2 pt-4">
              <button onClick={() => trainBase(cue, target)} className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 px-4 py-2 rounded text-sm transition-colors">
                <PlusCircle className="w-4 h-4"/> WRITE (Base)
              </button>
              <button onClick={() => updateTestTime(cue, target)} className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/40 text-green-400 px-4 py-2 rounded text-sm transition-colors">
                <Edit3 className="w-4 h-4"/> UPDATE (Fast)
              </button>
              <button onClick={() => eraseMemory(cue, target)} className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 px-4 py-2 rounded text-sm transition-colors">
                <Trash2 className="w-4 h-4"/> ERASE
              </button>
              <button onClick={() => interfere(cue, target)} className="flex items-center gap-2 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-400 px-4 py-2 rounded text-sm transition-colors">
                <AlertTriangle className="w-4 h-4"/> INTERFERE
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold border-b border-border pb-4 mb-4">Patient State (Base Memory)</h2>
            <div className="flex flex-wrap gap-2">
              {state.base_memory.map((m, i) => (
                <div key={i} className="px-3 py-2 bg-secondary rounded flex gap-4 items-center">
                  <span className="font-bold">{m.cue}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="text-primary">{m.target}</span>
                </div>
              ))}
              {state.base_memory.length === 0 && <span className="text-muted-foreground italic">No base memories.</span>}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold border-b border-border pb-4 mb-4">Test-Time State (Fast Memory)</h2>
            <div className="flex flex-wrap gap-2">
              {state.test_memory.map((m, i) => (
                <div key={i} className="px-3 py-2 bg-primary/20 border border-primary/30 rounded flex gap-4 items-center">
                  <span className="font-bold">{m.cue}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="text-primary">{m.target}</span>
                </div>
              ))}
              {state.test_memory.length === 0 && <span className="text-muted-foreground italic">No fast memory updates.</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
