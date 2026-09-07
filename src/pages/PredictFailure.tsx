import React, { useState } from 'react';
import { useExperiment } from '../context/ExperimentContext';
import { Target, Play, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export const PredictFailure: React.FC = () => {
  const { dataset } = useExperiment();
  
  const [prediction, setPrediction] = useState<number | null>(null);
  const [experimentState, setExperimentState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [actualFailure, setActualFailure] = useState<number | null>(null);
  const [chartData, setChartData] = useState<{update: number, retention: number}[]>([]);

  const choices = [1, 3, 5, 7, 10, 15];

  const runExperiment = () => {
    if (!prediction) return;
    setExperimentState('running');
    setChartData([]);
    
    // Simulate the experiment over time
    let currentUpdate = 0;
    const maxUpdates = 15;
    let failureFound: number | null = null;
    const data: {update: number, retention: number}[] = [];

    const interval = setInterval(() => {
      const retention = currentUpdate === 0 ? 100 : Math.max(0, 100 - (currentUpdate * currentUpdate * 1.5));
      data.push({ update: currentUpdate, retention });
      
      setChartData([...data]);

      if (retention < 70 && failureFound === null) {
        failureFound = currentUpdate;
        setActualFailure(currentUpdate);
      }

      currentUpdate++;

      if (currentUpdate > maxUpdates) {
        clearInterval(interval);
        setExperimentState('completed');
      }
    }, 200);
  };

  const resetExperiment = () => {
    setPrediction(null);
    setExperimentState('idle');
    setActualFailure(null);
    setChartData([]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3">
          <Target className="w-8 h-8" /> PREDICT THE FAILURE
        </h1>
        <p className="text-muted-foreground mt-2">"Can you predict when the model will start forgetting?"</p>
      </div>

      {experimentState === 'idle' ? (
        <div className="bg-card border border-border p-8 rounded-xl shadow-lg max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-2">
            <p className="text-muted-foreground">Starting Memory</p>
            <div className="bg-background border border-border inline-block px-6 py-2 rounded text-xl font-mono">
              {dataset.base[0]?.x} → {dataset.base[0]?.y}
            </div>
          </div>

          <h3 className="text-xl font-bold">How many conflicting updates do you think the model can tolerate before old-memory retention falls below 70%?</h3>

          <div className="flex flex-wrap justify-center gap-3">
            {choices.map(num => (
              <button
                key={num}
                onClick={() => setPrediction(num)}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold transition-all ${
                  prediction === num 
                    ? 'bg-primary text-primary-foreground scale-110 shadow-[0_0_15px_rgba(var(--primary),0.5)]' 
                    : 'bg-background border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <button
            onClick={runExperiment}
            disabled={!prediction}
            className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded-full font-bold transition-colors flex items-center justify-center gap-2 mx-auto w-full max-w-xs"
          >
            <Play className="w-5 h-5" /> RUN EXPERIMENT
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border p-6 rounded-xl shadow-lg flex flex-col items-center justify-center space-y-6 text-center">
            
            <div className="grid grid-cols-2 gap-8 w-full">
              <div>
                <p className="text-sm text-muted-foreground uppercase mb-2">Your Prediction</p>
                <div className="text-5xl font-black text-primary">{prediction}</div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground uppercase mb-2">Actual Failure Point</p>
                <div className="text-5xl font-black text-destructive">
                  {actualFailure !== null ? actualFailure : '?'}
                </div>
              </div>
            </div>

            {experimentState === 'completed' && actualFailure !== null && prediction !== null && (
              <div className="w-full bg-background border border-border p-4 rounded-lg">
                <p className="text-sm text-muted-foreground uppercase">Prediction Error</p>
                <div className="text-2xl font-bold mt-1">
                  {Math.abs(prediction - actualFailure)} {Math.abs(prediction - actualFailure) === 1 ? 'update' : 'updates'}
                </div>
              </div>
            )}

            {experimentState === 'completed' && (
              <button onClick={resetExperiment} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
            )}
          </div>

          <div className="bg-card border border-border p-6 rounded-xl shadow-lg h-80 flex flex-col">
            <h3 className="text-sm font-bold text-muted-foreground uppercase mb-4">Retention Curve</h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                  <XAxis dataKey="update" stroke="#888" />
                  <YAxis stroke="#888" domain={[0, 100]} />
                  <Tooltip contentStyle={{backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--card-foreground))'}} />
                  {actualFailure && (
                    <ReferenceLine x={actualFailure} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label={{ position: 'top', value: 'Failed', fill: 'hsl(var(--destructive))', fontSize: 12 }} />
                  )}
                  <ReferenceLine y={70} stroke="#555" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="retention" stroke="#22c55e" strokeWidth={3} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {experimentState === 'completed' && (
            <div className="col-span-1 lg:col-span-2 bg-primary/10 border border-primary/20 p-6 rounded-xl mt-4">
              <h4 className="font-bold text-lg mb-2 text-primary">Why was your prediction {prediction === actualFailure ? 'correct' : 'wrong'}?</h4>
              <p className="text-muted-foreground">
                The network's capacity to hold the base memory drops exponentially as conflicting test-time updates increase. The fast weights ($\lambda$) begin to dominate the slow weights, causing interference. With a high learning rate ($\eta$), the delta rule rapidly overwrites the representations, leading to catastrophic forgetting at exactly {actualFailure} updates.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
