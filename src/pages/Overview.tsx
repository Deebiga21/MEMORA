import React from 'react';
import { ArrowRight, BrainCircuit, Zap, Layers, Beaker } from 'lucide-react';
// @ts-ignore
import RippleGrid from '../components/RippleGrid';

export const Overview: React.FC = () => {
  // We don't have setActivePage in context, so we'll need a quick workaround or just ask user to use sidebar
  // Wait, the prompt asks for a "Start Experiment" button. 
  // Let's just dispatch a custom event or we can ignore it and tell them to use the sidebar. 
  // Better yet, I'll add `navigate` to the ExperimentContext, or pass it via props.
  // Actually, I can just dispatch a custom DOM event `navigate-page` and listen to it in App.tsx.

  const startExperiment = () => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: 'playground' }));
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 relative">
      {/* Hero */}
      <div className="text-center space-y-6 py-12">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
          <BrainCircuit className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight">MEMORA-X</h1>
        <h2 className="text-2xl text-primary font-light">AI Memory Lab</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          "Experiment with how AI learns, updates, remembers, and forgets."
        </p>
        <button 
          onClick={startExperiment}
          className="mt-8 inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-[0_0_20px_rgba(var(--primary),0.4)]"
        >
          <Beaker className="w-5 h-5" />
          Start Experiment
        </button>
      </div>

      {/* 3 Concepts */}
      <div className="relative p-6 -mx-6 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-40 pointer-events-none">
          <RippleGrid gridColor="#818cf8" glowIntensity={0.5} rippleIntensity={0.08} mouseInteraction={true} />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card/60 backdrop-blur-md p-6 rounded-xl border border-border shadow-lg">
            <Layers className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-lg font-bold mb-2">ASSOCIATIVE MEMORY</h3>
            <p className="text-muted-foreground text-sm">Learn relationships between concepts using a fundamental recurrent neural architecture.</p>
          </div>
          <div className="bg-card/60 backdrop-blur-md p-6 rounded-xl border border-border shadow-lg">
            <Zap className="w-8 h-8 text-yellow-400 mb-4" />
            <h3 className="text-lg font-bold mb-2">FAST WEIGHTS</h3>
            <p className="text-muted-foreground text-sm">Adapt memory during inference dynamically without retraining the base model parameters.</p>
          </div>
          <div className="bg-card/60 backdrop-blur-md p-6 rounded-xl border border-border shadow-lg">
            <BrainCircuit className="w-8 h-8 text-accent mb-4" />
            <h3 className="text-lg font-bold mb-2">BDH-CQ</h3>
            <p className="text-muted-foreground text-sm">Understand how inference-time learning connects to brain-inspired synaptic plasticity.</p>
          </div>
        </div>
      </div>

      {/* Pipeline */}
      <div className="bg-card/50 p-8 rounded-xl border border-border text-center">
        <h3 className="text-xl font-bold mb-8">Experiment Pipeline</h3>
        <div className="flex flex-wrap justify-center items-center gap-4 text-sm font-medium text-muted-foreground">
          <div className="bg-background px-4 py-2 rounded-lg border border-border">BASE MEMORY</div>
          <ArrowRight className="w-4 h-4 text-primary" />
          <div className="bg-background px-4 py-2 rounded-lg border border-border">QUERY</div>
          <ArrowRight className="w-4 h-4 text-primary" />
          <div className="bg-background px-4 py-2 rounded-lg border border-border">TEST-TIME UPDATE</div>
          <ArrowRight className="w-4 h-4 text-primary" />
          <div className="bg-background px-4 py-2 rounded-lg border border-border">INTERFERENCE</div>
          <ArrowRight className="w-4 h-4 text-primary" />
          <div className="bg-background px-4 py-2 rounded-lg border border-border">RETRIEVAL</div>
          <ArrowRight className="w-4 h-4 text-primary" />
          <div className="bg-background px-4 py-2 rounded-lg border border-border">MEASURE RETENTION</div>
          <ArrowRight className="w-4 h-4 text-primary" />
          <div className="bg-background px-4 py-2 rounded-lg border border-border">ANALYZE FAILURE</div>
        </div>
      </div>

      {/* What will you discover? */}
      <div className="bg-card p-8 rounded-xl border border-border">
        <h3 className="text-xl font-bold mb-6 text-primary">What will you discover?</h3>
        <ul className="space-y-4 text-muted-foreground">
          <li className="flex items-start gap-3">
            <div className="mt-1 w-2 h-2 rounded-full bg-primary" />
            <span>Can new memories be learned without damaging old ones?</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1 w-2 h-2 rounded-full bg-primary" />
            <span>How does interference affect retrieval?</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1 w-2 h-2 rounded-full bg-primary" />
            <span>What happens when fast weights dominate slow weights?</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1 w-2 h-2 rounded-full bg-primary" />
            <span>Where does catastrophic forgetting begin?</span>
          </li>
        </ul>
      </div>

    </div>
  );
};
