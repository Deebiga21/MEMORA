import React, { useState } from 'react';
import { Settings, CheckCircle2, Info } from 'lucide-react';

export const BdhCqConnection: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<'ACTIVITY' | 'STATE' | 'SYNAPSES' | 'MEMORY'>('MEMORY');

  const explanations = {
    ACTIVITY: "In BDH, neural activity directly drives changes in memory. In our toy model, this is the forward pass vector 'y_pred'.",
    STATE: "The recurrent memory state holds context. BDH uses complex state vectors; we use a simple linear matrix.",
    SYNAPSES: "BDH modifies actual connection weights dynamically. We simulate this via the Fast Weight matrix (S) updated via delta rule.",
    MEMORY: "The final memory retrieval behavior is altered seamlessly without slow backpropagation, achieving fast learning."
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3">
          <Settings className="w-8 h-8" /> BDH-CQ CONNECTION
        </h1>
        <p className="text-muted-foreground mt-2">"From fast associative updates to brain-inspired synaptic plasticity."</p>
      </div>

      <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-xl flex items-start gap-3">
        <Info className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
        <p className="text-sm text-destructive-foreground">
          <strong>Important Note:</strong> MEMORA-X is an educational experimental substrate. The linear associative memory and delta rule used here are toy models. They demonstrate the <em>concept</em> of inference-time learning, but they are NOT the exact, complex architecture of actual BDH / BDH-CQ models.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Comparison Table */}
        <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
          <div className="bg-muted p-4 border-b border-border">
            <h3 className="font-bold">Mechanism Comparison</h3>
          </div>
          <div className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-background/50 text-muted-foreground uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Property</th>
                  <th className="px-4 py-3 border-l border-border text-primary">MEMORA-X TOY</th>
                  <th className="px-4 py-3 border-l border-border text-accent">BDH-CQ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3 font-medium">Memory mechanism</td>
                  <td className="px-4 py-3 border-l border-border">Linear Outer Product</td>
                  <td className="px-4 py-3 border-l border-border">Modern Hopfield / Transformer KV</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Update mechanism</td>
                  <td className="px-4 py-3 border-l border-border">Standard Delta Rule</td>
                  <td className="px-4 py-3 border-l border-border">Continuous Q-Learning / Hebbian</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Inference-time adaptation</td>
                  <td className="px-4 py-3 border-l border-border">Yes (Fast Matrix S)</td>
                  <td className="px-4 py-3 border-l border-border">Yes (Dynamic Synaptic State)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">State representation</td>
                  <td className="px-4 py-3 border-l border-border">Static 1-hot vectors</td>
                  <td className="px-4 py-3 border-l border-border">Dense continuous embeddings</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Synaptic plasticity</td>
                  <td className="px-4 py-3 border-l border-border">Simulated Matrix Add</td>
                  <td className="px-4 py-3 border-l border-border">Parameterized plasticity rules</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive Diagram */}
        <div className="bg-card border border-border rounded-xl shadow-lg p-6 flex flex-col">
          <h3 className="font-bold mb-6 text-center">What changes during test-time?</h3>
          
          <div className="flex-1 flex flex-col justify-center items-center gap-4">
            
            {['ACTIVITY', 'STATE', 'SYNAPSES', 'MEMORY'].map((item, index) => (
              <React.Fragment key={item}>
                <button
                  onClick={() => setActiveComponent(item as any)}
                  className={`w-full max-w-xs py-3 rounded-lg border font-bold tracking-wider transition-all ${
                    activeComponent === item 
                      ? 'bg-primary text-primary-foreground border-primary scale-105 shadow-[0_0_15px_rgba(var(--primary),0.5)]' 
                      : 'bg-background border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {item}
                </button>
                {index < 3 && <div className="h-4 w-px bg-border"></div>}
              </React.Fragment>
            ))}

          </div>

          <div className="mt-8 bg-background border border-border rounded-lg p-4 min-h-[100px] flex items-center justify-center text-center">
            <p className="text-muted-foreground text-sm">
              {explanations[activeComponent]}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
