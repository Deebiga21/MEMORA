import React from 'react';
import { useExperiment } from '../context/ExperimentContext';
import { Archive } from 'lucide-react';

export const ExperimentHistory: React.FC = () => {
  const { state } = useExperiment();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold tracking-tight text-primary">EXPERIMENT HISTORY</h1>
      <p className="text-muted-foreground text-lg">How do different experiments compare?</p>

      <div className="bg-card border border-border rounded-xl p-6 shadow-lg text-center py-20">
        <Archive className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h2 className="text-xl font-semibold mb-2">History Archive</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Currently running Experiment: <span className="font-mono text-primary">{state?.experiment_id}</span>
        </p>
        <p className="text-sm mt-4 text-muted-foreground">
          Historical comparisons across multiple independent sessions will be available in future backend iterations.
        </p>
      </div>
    </div>
  );
};
