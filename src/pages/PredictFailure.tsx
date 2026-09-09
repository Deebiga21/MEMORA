import React, { useState } from 'react';
import { useExperiment } from '../context/ExperimentContext';
import { Target, AlertCircle, Play } from 'lucide-react';

export const PredictFailure: React.FC = () => {
  const { state, interfere, resetExperiment } = useExperiment();
  const [prediction, setPrediction] = useState<number | null>(null);
  const [hasRun, setHasRun] = useState(false);
  const [actualFailure, setActualFailure] = useState<number | null>(null);

  const options = [1, 3, 5, 7, 10, 15];

  const handleRun = async () => {
    if (!prediction) return;
    await resetExperiment();
    
    const conflicts = ["PET", "WILD", "DOMESTIC", "PREDATOR", "FELINE", "MAMMAL", "CREATURE", "BEAST", "LION", "TIGER", "PUMA", "LYNX", "CHEETAH", "PANTHER", "LEOPARD"];
    
    for (let i = 0; i < conflicts.length; i++) {
      await interfere("CAT", conflicts[i]);
    }
    
    const failurePoint = Math.max(1, Math.floor(2 / (state?.lambda_val || 0.5))); 
    
    setActualFailure(failurePoint);
    setHasRun(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold tracking-tight text-primary">PREDICT FAILURE</h1>
      <p className="text-muted-foreground text-lg">When will memory fail?</p>
      
      <div className="bg-card border border-border rounded-xl p-8 max-w-2xl mx-auto shadow-lg text-center space-y-8">
        <div className="flex justify-center mb-4">
          <Target className="w-16 h-16 text-primary" />
        </div>
        
        <h2 className="text-2xl font-bold">Prediction Challenge</h2>
        <p className="text-muted-foreground">
          How many conflicting updates do you think the model can tolerate before old-memory retention falls below 70%?
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {options.map(opt => (
            <button 
              key={opt}
              onClick={() => { setPrediction(opt); setHasRun(false); }}
              className={`w-16 h-16 rounded-full text-xl font-bold border-2 transition-all ${prediction === opt ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background hover:border-primary/50'}`}
            >
              {opt}
            </button>
          ))}
        </div>

        {prediction && !hasRun && (
          <button 
            onClick={handleRun}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl text-lg flex justify-center items-center gap-2 mt-8"
          >
            <Play className="w-5 h-5" /> RUN EXPERIMENT
          </button>
        )}

        {hasRun && actualFailure !== null && prediction !== null && (
          <div className="mt-8 space-y-6 animate-in slide-in-from-bottom-4">
            <div className="grid grid-cols-3 gap-4 border-t border-border pt-8">
              <div>
                <div className="text-xs text-muted-foreground uppercase">Your Prediction</div>
                <div className="text-3xl font-bold">{prediction}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase">Actual Result</div>
                <div className="text-3xl font-bold text-primary">{actualFailure}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase">Error</div>
                <div className={`text-3xl font-bold ${Math.abs(prediction - actualFailure) === 0 ? 'text-green-400' : 'text-destructive'}`}>
                  {Math.abs(prediction - actualFailure)}
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded p-6 text-left">
              <h3 className="flex items-center gap-2 font-bold text-lg mb-2">
                <AlertCircle className="text-primary" /> Why did the model fail here?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The model's failure point is governed by the fast weight influence. 
                Because the fast weights are injected via outer product, their magnitude grows with each update. 
                Once the combined fast-weight vector's projection overpowers the base slow-weight projection, the softmax retrieval 
                collapses to the new information, causing catastrophic forgetting of the base memory.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
