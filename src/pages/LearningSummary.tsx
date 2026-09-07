import React from 'react';
import { useExperiment } from '../context/ExperimentContext';
import { BarChart2, CheckCircle2, ArrowRight } from 'lucide-react';

export const LearningSummary: React.FC = () => {
  const { dataset, oldMemoryRetention, newMemoryAcquisition, interferenceRate, conflictingUpdateCount, fullReset } = useExperiment();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
          <BarChart2 className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">WHAT DID YOU DISCOVER?</h1>
        <p className="text-muted-foreground mt-2 text-lg">"Synthesizing your experimental results with memory theory."</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Concepts */}
        <div className="space-y-6">
          <div className="bg-card border border-border p-6 rounded-xl shadow-lg">
            <h3 className="font-bold text-primary mb-3 flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> 1. Associative Memory</h3>
            <p className="text-sm text-muted-foreground">You observed that a simple recurrent matrix can learn connections between concepts using outer products, retrieving them perfectly under normal conditions.</p>
          </div>
          
          <div className="bg-card border border-border p-6 rounded-xl shadow-lg">
            <h3 className="font-bold text-primary mb-3 flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> 2. Test-Time Learning</h3>
            <p className="text-sm text-muted-foreground">Instead of retraining the base parameters, we injected information during the forward pass, successfully modifying the network's output on the fly.</p>
          </div>

          <div className="bg-card border border-border p-6 rounded-xl shadow-lg">
            <h3 className="font-bold text-primary mb-3 flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> 3. Fast Weights vs Slow Weights</h3>
            <p className="text-sm text-muted-foreground">By maintaining two matrices—one permanent (slow) and one temporary (fast)—we achieved a balance between long-term knowledge and short-term adaptation.</p>
          </div>

          <div className="bg-card border border-border p-6 rounded-xl shadow-lg">
            <h3 className="font-bold text-primary mb-3 flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> 4. Interference</h3>
            <p className="text-sm text-muted-foreground">As you added more fast-weight updates, the temporary matrix began to distort the base matrix, leading to mixed retrieval signals.</p>
          </div>

          <div className="bg-card border border-border p-6 rounded-xl shadow-lg">
            <h3 className="font-bold text-primary mb-3 flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> 5. Catastrophic Forgetting</h3>
            <p className="text-sm text-muted-foreground">When the interference rate crosses a threshold, the network entirely forgets its original training. This is the fundamental challenge of continual learning in AI.</p>
          </div>
        </div>

        {/* User Results */}
        <div className="space-y-6">
          <div className="bg-card border border-border p-6 rounded-xl shadow-lg h-full border-t-4 border-t-primary">
            <h2 className="text-2xl font-bold mb-6">Your Experiment</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Dataset</span>
                <span className="font-medium text-right">{dataset.name}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Test-Time Interventions</span>
                <span className="font-bold">{conflictingUpdateCount}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Base Memory Retained</span>
                <span className={`font-bold ${oldMemoryRetention > 70 ? 'text-green-500' : 'text-destructive'}`}>{oldMemoryRetention.toFixed(0)}%</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">New Memory Acquired</span>
                <span className="font-bold text-blue-500">{newMemoryAcquisition.toFixed(0)}%</span>
              </div>
            </div>

            <div className="bg-background border border-border p-4 rounded text-sm text-muted-foreground mb-8">
              <strong>Conclusion:</strong> In your specific run, after {conflictingUpdateCount} interventions, the interference rate was {interferenceRate.toFixed(0)}%. 
              {interferenceRate > 30 ? " This clearly demonstrated the phenomenon of catastrophic forgetting." : " You successfully balanced learning and retention, keeping interference low."}
            </div>

            <div className="space-y-3">
              <button onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'report' }))} className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground py-3 rounded-lg font-bold transition-colors">
                VIEW FULL REPORT
              </button>
              <button onClick={() => { fullReset(); window.dispatchEvent(new CustomEvent('navigate', { detail: 'overview' })); }} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-bold transition-colors flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                RUN NEW EXPERIMENT <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
