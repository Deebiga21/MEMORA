import React, { useState } from 'react';
import { Activity } from 'lucide-react';

export const BdhCqConnection: React.FC = () => {
  const [activeConcept, setActiveConcept] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold tracking-tight text-primary">BDH-CQ CONNECTION</h1>
      <p className="text-muted-foreground text-lg">How does this relate to brain-inspired inference-time learning?</p>
      
      <div className="bg-destructive/10 border border-destructive/30 rounded p-4 text-sm text-foreground flex gap-4 items-start">
        <Activity className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
        <div>
          <strong>Educational Substrate Notice:</strong> MEMORA-X is an educational experimental substrate. 
          It uses explicit fast-weight matrices for clarity. It is NOT the official BDH or BDH-CQ architecture, 
          which use local synaptic states and recurrent dynamics to achieve test-time adaptation.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold border-b border-border pb-4 mb-6">MEMORA-X vs BDH-CQ</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm font-bold text-muted-foreground uppercase border-b border-border pb-2">
              <div>Feature</div>
              <div>MEMORA-X</div>
              <div>BDH-CQ</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm border-b border-border/30 pb-2">
              <div className="font-semibold">Memory Mechanism</div>
              <div>Explicit dual matrices (W, S)</div>
              <div>Recurrent state & localized synaptic traces</div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm border-b border-border/30 pb-2">
              <div className="font-semibold">Update Mechanism</div>
              <div>Global matrix outer product</div>
              <div>Local Hebbian / Delta rule at synapse</div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm border-b border-border/30 pb-2">
              <div className="font-semibold">Inference-time adaptation</div>
              <div>Yes</div>
              <div>Yes (via test-time gradients)</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm pb-2">
              <div className="font-semibold">State</div>
              <div>Global</div>
              <div>Distributed</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-bold border-b border-border pb-4 mb-6 w-full text-left">Conceptual Pathway</h2>
          
          <div className="flex flex-col items-center gap-2 w-full max-w-xs">
            <button onMouseEnter={() => setActiveConcept('INPUT')} onMouseLeave={() => setActiveConcept(null)} className={`w-full py-3 rounded border font-bold transition-all ${activeConcept === 'INPUT' ? 'bg-primary text-primary-foreground border-primary scale-105' : 'bg-background border-border hover:border-primary/50'}`}>INPUT</button>
            <div className="h-4 w-0.5 bg-border"></div>
            <button onMouseEnter={() => setActiveConcept('STATE')} onMouseLeave={() => setActiveConcept(null)} className={`w-full py-3 rounded border font-bold transition-all ${activeConcept === 'STATE' ? 'bg-primary text-primary-foreground border-primary scale-105' : 'bg-background border-border hover:border-primary/50'}`}>INTERNAL STATE</button>
            <div className="h-4 w-0.5 bg-border"></div>
            <button onMouseEnter={() => setActiveConcept('LOCAL')} onMouseLeave={() => setActiveConcept(null)} className={`w-full py-3 rounded border font-bold transition-all ${activeConcept === 'LOCAL' ? 'bg-primary text-primary-foreground border-primary scale-105' : 'bg-background border-border hover:border-primary/50'}`}>LOCAL UPDATE</button>
            <div className="h-4 w-0.5 bg-border"></div>
            <button onMouseEnter={() => setActiveConcept('SYNAPSE')} onMouseLeave={() => setActiveConcept(null)} className={`w-full py-3 rounded border font-bold transition-all ${activeConcept === 'SYNAPSE' ? 'bg-primary text-primary-foreground border-primary scale-105' : 'bg-background border-border hover:border-primary/50'}`}>SYNAPTIC CHANGE</button>
            <div className="h-4 w-0.5 bg-border"></div>
            <button onMouseEnter={() => setActiveConcept('BEHAVIOR')} onMouseLeave={() => setActiveConcept(null)} className={`w-full py-3 rounded border font-bold transition-all ${activeConcept === 'BEHAVIOR' ? 'bg-primary text-primary-foreground border-primary scale-105' : 'bg-background border-border hover:border-primary/50'}`}>CHANGED BEHAVIOR</button>
          </div>
        </div>
      </div>
    </div>
  );
};
