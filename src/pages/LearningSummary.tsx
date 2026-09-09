import React from 'react';
import { useExperiment } from '../context/ExperimentContext';
import { Lightbulb } from 'lucide-react';

export const LearningSummary: React.FC = () => {
  const { state } = useExperiment();
  if (!state) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-primary">WHAT DID YOU DISCOVER?</h1>
      <p className="text-muted-foreground text-lg">A personalized summary based on your actual experiment.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Educational Breakdown</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-primary uppercase mb-1">Associative Memory</h3>
                <p className="text-sm text-muted-foreground">You observed that the model can perfectly recall {state.base_memory.length} base associations without retraining when no interference is present.</p>
              </div>
              
              <div>
                <h3 className="text-sm font-bold text-primary uppercase mb-1">Fast Weights</h3>
                <p className="text-sm text-muted-foreground">By utilizing the test-time state, the model instantly retrieved new concepts without modifying the base neural weights.</p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-primary uppercase mb-1">Test-Time Learning</h3>
                <p className="text-sm text-muted-foreground">You performed {state.test_memory.length} test-time updates. The system successfully mapped these new inputs at inference time.</p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-primary uppercase mb-1">Interference & Catastrophic Forgetting</h3>
                <p className="text-sm text-muted-foreground">
                  With {state.test_memory.length} conflicting updates, the base memory retention fell to {state.old_memory_accuracy.toFixed(1)}%. 
                  {state.old_memory_accuracy < 70 ? " You successfully triggered catastrophic forgetting!" : " The base memory is still largely intact."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 shadow-lg">
            <Lightbulb className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-lg font-bold mb-2">KEY INSIGHT</h2>
            <p className="text-sm">
              The stability-plasticity dilemma is unavoidable in simple outer-product networks. 
              Higher lambda means you learn faster ({state.new_memory_accuracy.toFixed(0)}% acquisition), but you forget faster ({state.old_memory_accuracy.toFixed(0)}% retention).
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
            <h2 className="text-sm font-bold text-muted-foreground uppercase mb-4">Your Run</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Lambda</span><span className="font-mono text-primary">{state.lambda_val.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Eta</span><span className="font-mono text-primary">{state.eta.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Updates</span><span className="font-mono text-primary">{state.experiment_steps}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
