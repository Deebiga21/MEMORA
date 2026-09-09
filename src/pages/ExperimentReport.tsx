import React from 'react';
import { useExperiment } from '../context/ExperimentContext';
import { FileText, Download, Copy } from 'lucide-react';

export const ExperimentReport: React.FC = () => {
  const { state } = useExperiment();
  if (!state) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">EXPERIMENT REPORT</h1>
          <p className="text-muted-foreground text-lg">What did my experiment prove?</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 px-4 py-2 rounded text-sm transition-colors">
            <Copy className="w-4 h-4" /> COPY RESULTS
          </button>
          <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded text-sm transition-colors">
            <Download className="w-4 h-4" /> EXPORT PDF
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
        <div className="border-b border-border pb-6 mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold font-serif">MEMORA-X Laboratory Report</h2>
            <div className="text-muted-foreground text-sm mt-1">Generated dynamically from unified experiment engine</div>
          </div>
          <div className="text-right text-sm">
            <div><span className="text-muted-foreground">ID:</span> <span className="font-mono text-primary">{state.experiment_id}</span></div>
            <div><span className="text-muted-foreground">Date:</span> {new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-bold uppercase tracking-wider text-xs text-muted-foreground mb-4">Parameters</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-border/50 pb-1">
                <span>Fast Weight Influence (Lambda)</span><span className="font-mono">{state.lambda_val.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-1">
                <span>Test-Time Learning Rate (Eta)</span><span className="font-mono">{state.eta.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-1">
                <span>Total Actions Performed</span><span className="font-mono">{state.experiment_steps}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-1">
                <span>Base Associations (W)</span><span className="font-mono">{state.base_memory.length}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-1">
                <span>Test Associations (S)</span><span className="font-mono">{state.test_memory.length}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold uppercase tracking-wider text-xs text-muted-foreground mb-4">Final Metrics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-border/50 pb-1">
                <span>Old Memory Retention</span><span className={state.old_memory_accuracy < 70 ? 'text-destructive font-bold' : 'text-green-400 font-bold'}>{state.old_memory_accuracy.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-1">
                <span>New Memory Acquisition</span><span className="text-blue-400 font-bold">{state.new_memory_accuracy.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-1">
                <span>Interference Rate</span><span className="text-yellow-400 font-bold">{state.interference_rate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background border border-border p-6 rounded-lg">
          <h3 className="font-bold uppercase tracking-wider text-xs text-primary mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" /> EXPERIMENTAL FINDING
          </h3>
          <p className="text-lg leading-relaxed">
            Under a fast-weight influence of <strong className="text-primary">Lambda = {state.lambda_val.toFixed(2)}</strong> and learning rate of <strong className="text-primary">Eta = {state.eta.toFixed(2)}</strong>, the model acquired <strong>{state.new_memory_accuracy.toFixed(0)}%</strong> of new associations while retaining <strong>{state.old_memory_accuracy.toFixed(0)}%</strong> of old associations after <strong>{state.experiment_steps}</strong> experiment steps.
          </p>
          <p className="text-muted-foreground mt-4 text-sm">
            {state.old_memory_accuracy < 70 
              ? "Conclusion: The current parameters heavily favor plasticity, leading to catastrophic interference of base memories."
              : "Conclusion: The memory matrix remained relatively stable, successfully resisting complete test-time interference."}
          </p>
        </div>
      </div>
    </div>
  );
};
