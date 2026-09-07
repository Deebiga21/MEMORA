import React, { useState } from 'react';
import { useExperiment } from '../context/ExperimentContext';
import { Database, Zap, RefreshCw, ArrowDown, Plus } from 'lucide-react';

export const FastWeightLab: React.FC = () => {
  const { dataset, lambda, setLambda, eta, setEta, updateTestTime, resetState, predictions } = useExperiment();
  const [testConcept, setTestConcept] = useState(dataset.tests[0]?.x || '');
  const [testAssoc, setTestAssoc] = useState(dataset.tests[0]?.y || '');

  const handleUpdate = () => {
    if (testConcept && testAssoc) {
      updateTestTime(testConcept.toUpperCase(), testAssoc.toUpperCase());
    }
  };

  const currentQuery = dataset.query;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">FAST WEIGHT LAB</h1>
        <p className="text-muted-foreground">"Learning during inference without retraining the base model."</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Visualization */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            {/* Slow Weights */}
            <div className="flex-1 bg-card border border-border rounded-xl p-4 text-center relative overflow-hidden">
              <Database className="w-8 h-8 text-blue-500 mx-auto mb-2 opacity-50" />
              <h3 className="font-bold text-lg">SLOW WEIGHTS</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Pre-trained Knowledge</p>
              <div className="bg-background rounded p-2 text-sm font-mono text-blue-400">
                {dataset.base[0]?.x} → {dataset.base[0]?.y}
              </div>
            </div>

            <Plus className="w-8 h-8 text-muted-foreground shrink-0" />

            {/* Fast Weights */}
            <div className="flex-1 bg-card border border-border rounded-xl p-4 text-center relative overflow-hidden border-yellow-500/30">
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500/50" />
              <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2 opacity-50" />
              <h3 className="font-bold text-lg">FAST WEIGHTS</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Adaptive Knowledge</p>
              <div className="bg-background rounded p-2 text-sm font-mono text-yellow-400">
                {testConcept} → {testAssoc}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-6 h-6 text-muted-foreground" />
          </div>

          {/* Combined Score */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-lg text-center relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 py-1 border border-border rounded-full text-xs font-bold uppercase tracking-wider text-primary">
              Combined Score
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-left">
                <p className="text-xs text-muted-foreground uppercase">Query</p>
                <div className="text-xl font-bold bg-muted px-4 py-2 rounded mt-1">{currentQuery}</div>
              </div>
              <ArrowRightIcon className="w-6 h-6 text-muted-foreground" />
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase">Prediction</p>
                <div className="text-xl font-bold bg-primary/20 text-primary px-4 py-2 rounded mt-1 border border-primary/30">
                  {predictions.length > 0 ? predictions[0].word : "?"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Controls */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-lg space-y-8">
          
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="text-yellow-500" />
              Intervene (Test-Time Update)
            </h3>
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                value={testConcept}
                onChange={e => setTestConcept(e.target.value)}
                className="w-1/3 bg-background border border-border rounded px-3 py-2 text-sm"
                placeholder="Concept"
              />
              <input 
                type="text" 
                value={testAssoc}
                onChange={e => setTestAssoc(e.target.value)}
                className="w-1/3 bg-background border border-border rounded px-3 py-2 text-sm"
                placeholder="Association"
              />
              <button 
                onClick={handleUpdate}
                className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white rounded font-bold transition-colors"
              >
                UPDATE
              </button>
            </div>
            <button 
              onClick={resetState}
              className="w-full flex items-center justify-center gap-2 py-2 border border-border rounded hover:bg-muted transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              RESET FAST WEIGHTS
            </button>
          </div>

          <div className="space-y-6 pt-6 border-t border-border">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-sm">Fast Weight Influence (λ)</span>
                <span className="font-mono text-blue-400">{lambda.toFixed(2)}</span>
              </div>
              <input 
                type="range" min="0" max="2" step="0.1" 
                value={lambda} 
                onChange={(e)=>setLambda(parseFloat(e.target.value))} 
                className="w-full accent-blue-500" 
              />
              <p className="text-xs text-muted-foreground mt-2">
                "Changing λ changes how strongly fast weights influence retrieval."
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-sm">Test-Time Learning Rate (η)</span>
                <span className="font-mono text-yellow-400">{eta.toFixed(2)}</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.1" 
                value={eta} 
                onChange={(e)=>setEta(parseFloat(e.target.value))} 
                className="w-full accent-yellow-500" 
              />
              <p className="text-xs text-muted-foreground mt-2">
                "Changing η changes how strongly new information modifies fast weights."
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

const ArrowRightIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);
