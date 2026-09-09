import React from 'react';
import { ArrowRight, BrainCircuit, Zap, Layers, Beaker } from 'lucide-react';
// @ts-ignore
import RippleGrid from '../components/RippleGrid';
import { useExperiment } from '../context/ExperimentContext';

export const Overview: React.FC = () => {
  const { state } = useExperiment();

  return (
    <div className="space-y-12 animate-in fade-in duration-500 relative">
      <div className="text-center space-y-6 py-12">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
          <Beaker className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight">MEMORA-X <span className="text-primary">AI Memory Lab</span></h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Experiment with how AI learns, updates, remembers and forgets.
        </p>
      </div>

      <div className="bg-card/40 border border-border rounded-xl p-8 max-w-3xl mx-auto backdrop-blur-sm">
        <h2 className="text-xl font-bold mb-6 text-center tracking-widest text-primary">CENTRAL EXPERIMENT LOOP</h2>
        <div className="flex justify-between items-center text-sm font-semibold text-muted-foreground">
          <span>LEARN</span>
          <ArrowRight className="w-4 h-4 opacity-50" />
          <span>QUERY</span>
          <ArrowRight className="w-4 h-4 opacity-50" />
          <span>UPDATE</span>
          <ArrowRight className="w-4 h-4 opacity-50" />
          <span>INTERFERE</span>
          <ArrowRight className="w-4 h-4 opacity-50" />
          <span>OBSERVE</span>
          <ArrowRight className="w-4 h-4 opacity-50" />
          <span>MEASURE</span>
          <ArrowRight className="w-4 h-4 opacity-50" />
          <span>PREDICT</span>
          <ArrowRight className="w-4 h-4 opacity-50" />
          <span className="text-primary">BDH-CQ</span>
        </div>
      </div>

      {state && (
        <div className="grid md:grid-cols-4 gap-4 text-center max-w-4xl mx-auto">
           <div className="bg-card p-4 rounded-lg border border-border">
              <div className="text-2xl font-bold text-primary">{state.base_memory.length + state.test_memory.length}</div>
              <div className="text-xs text-muted-foreground uppercase">Memories</div>
           </div>
           <div className="bg-card p-4 rounded-lg border border-border">
              <div className="text-2xl font-bold text-primary">{state.experiment_steps}</div>
              <div className="text-xs text-muted-foreground uppercase">Updates</div>
           </div>
           <div className="bg-card p-4 rounded-lg border border-border">
              <div className="text-2xl font-bold text-primary">{state.old_memory_accuracy.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground uppercase">Retention</div>
           </div>
           <div className="bg-card p-4 rounded-lg border border-border">
              <div className="text-2xl font-bold text-primary">{state.new_memory_accuracy.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground uppercase">Acquisition</div>
           </div>
        </div>
      )}

      <div className="relative p-6 -mx-6 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-40 pointer-events-none">
          <RippleGrid gridColor="#818cf8" glowIntensity={0.5} rippleIntensity={0.08} mouseInteraction={true} />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card/80 backdrop-blur-md p-6 rounded-xl border border-border shadow-lg">
            <Layers className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-lg font-bold mb-2">ASSOCIATIVE MEMORY</h3>
            <p className="text-muted-foreground text-sm">Learn relationships between concepts using a fundamental recurrent neural architecture.</p>
          </div>
          <div className="bg-card/80 backdrop-blur-md p-6 rounded-xl border border-border shadow-lg">
            <Zap className="w-8 h-8 text-yellow-400 mb-4" />
            <h3 className="text-lg font-bold mb-2">FAST WEIGHTS</h3>
            <p className="text-muted-foreground text-sm">Adapt memory during inference dynamically without retraining the base model parameters.</p>
          </div>
          <div className="bg-card/80 backdrop-blur-md p-6 rounded-xl border border-border shadow-lg">
            <BrainCircuit className="w-8 h-8 text-accent mb-4" />
            <h3 className="text-lg font-bold mb-2">BDH-CQ</h3>
            <p className="text-muted-foreground text-sm">Understand how inference-time learning connects to brain-inspired synaptic plasticity.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
