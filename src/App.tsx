import React, { useState, useEffect } from 'react';
import { AssociativeMemory, Vocabulary } from './lib/AssociativeMemory';
import { Brain, Database, Zap, RefreshCw, Activity, AlertTriangle, Map } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MemoryMapVisualizer } from './components/MemoryMapVisualizer';

const WORDS = ["CAT", "ANIMAL", "PET", "WILD", "DOG", "BIRD"];
const vocab = new Vocabulary(WORDS);
const engine = new AssociativeMemory(vocab.size, 0.5, 0.8);

export default function App() {
  const [step, setStep] = useState(1);
  const [predictions, setPredictions] = useState<{word: string, confidence: number}[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [, setTick] = useState(0);
  const forceUpdate = () => setTick(t => t + 1);

  useEffect(() => {
    engine.trainBase([
      { x: vocab.toVector("CAT"), y: vocab.toVector("ANIMAL") },
      { x: vocab.toVector("DOG"), y: vocab.toVector("ANIMAL") },
      { x: vocab.toVector("BIRD"), y: vocab.toVector("WILD") },
    ]);
    forceUpdate();
  }, []);

  const queryModel = (word: string) => {
    const vec = vocab.toVector(word);
    const result = engine.forward(vec);
    setPredictions(vocab.toWord(result));
    setHistory(prev => [...prev, `Queried [${word}] -> Top: ${vocab.toWord(result)[0].word}`]);
  };

  const updateTestTime = (x: string, y: string) => {
    engine.updateState(vocab.toVector(x), vocab.toVector(y));
    setHistory(prev => [...prev, `Test-Time Update: [${x}] -> [${y}]`]);
    forceUpdate();
    queryModel(x); 
  };

  const resetState = () => {
    engine.resetState();
    setHistory(prev => [...prev, `Reset Fast Weights (State Cleared)`]);
    forceUpdate();
    setPredictions([]);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Flow & Controls */}
        <div className="col-span-1 lg:col-span-2 space-y-8">
          <header className="border-b border-neutral-800 pb-4">
            <h1 className="text-3xl font-bold flex items-center gap-3 text-blue-400">
              <Brain className="w-8 h-8" />
              MEMORA-X <span className="text-sm font-normal text-neutral-500 uppercase tracking-widest mt-1">AI Memory Lab</span>
            </h1>
            <p className="text-neutral-400 mt-2">
              Interactive experiment for Associative Memory, Test-Time Adaptation, and Inference-time updates (BDH-CQ).
            </p>
          </header>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Activity className="text-green-400" />
              Experiment Flow
            </h2>

            <div className={`p-4 rounded-lg mb-4 border transition-all duration-300 ${step === 1 ? 'bg-neutral-800 border-neutral-700' : 'bg-transparent border-transparent opacity-50'}`}>
              <h3 className="font-bold text-lg mb-2 text-white">1. Learn Memory & Test (Base Model)</h3>
              <p className="text-sm text-neutral-400 mb-4">The model's slow weights were pre-trained with <code>CAT → ANIMAL</code> and <code>DOG → ANIMAL</code>. Let's query it.</p>
              <button onClick={() => { queryModel("CAT"); setStep(2); }} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-medium flex items-center gap-2">
                <Database className="w-4 h-4"/> Query "CAT"
              </button>
            </div>

            <div className={`p-4 rounded-lg mb-4 border transition-all duration-300 ${step === 2 ? 'bg-neutral-800 border-neutral-700' : step < 2 ? 'opacity-30 pointer-events-none border-transparent' : 'bg-transparent border-transparent opacity-50'}`}>
              <h3 className="font-bold text-lg mb-2 text-white">2. Memory Map (Internal State)</h3>
              <p className="text-sm text-neutral-400 mb-4">Observe the internal associative weight matrix. The intensity shows the strength of the association between input and output concepts.</p>
              <button onClick={() => setStep(3)} className="bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded font-medium flex items-center gap-2">
                <Map className="w-4 h-4"/> Next: Interference Lab
              </button>
            </div>

            <div className={`p-4 rounded-lg mb-4 border transition-all duration-300 ${step === 3 ? 'bg-neutral-800 border-neutral-700' : step < 3 ? 'opacity-30 pointer-events-none border-transparent' : 'bg-transparent border-transparent opacity-50'}`}>
              <h3 className="font-bold text-lg mb-2 text-white">3. Interference Lab (Test-Time Update)</h3>
              <p className="text-sm text-neutral-400 mb-4">Without retraining, introduce conflicting information during inference. This simulates rapid adaptation via Fast Weights.</p>
              <div className="flex gap-4">
                <button onClick={() => { updateTestTime("CAT", "PET"); setStep(4); }} className="bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4"/> Update: CAT → PET
                </button>
                <button onClick={() => { updateTestTime("CAT", "WILD"); setStep(4); }} className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4"/> Update: CAT → WILD
                </button>
              </div>
            </div>

            <div className={`p-4 rounded-lg mb-4 border transition-all duration-300 ${step === 4 ? 'bg-neutral-800 border-neutral-700' : step < 4 ? 'opacity-30 pointer-events-none border-transparent' : 'bg-transparent border-transparent opacity-50'}`}>
              <h3 className="font-bold text-lg mb-2 text-white">4. Measure & Find Failure</h3>
              <p className="text-sm text-neutral-400 mb-4">Look at the probabilities. Notice how the new association competes with the old one. If you add too much interference, catastrophic forgetting occurs in the fast weights.</p>
              <button onClick={() => setStep(5)} className="bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded font-medium flex items-center gap-2">
                Next: Reset & BDH Connection
              </button>
            </div>

            <div className={`p-4 rounded-lg border transition-all duration-300 ${step === 5 ? 'bg-neutral-800 border-neutral-700' : step < 5 ? 'opacity-30 pointer-events-none border-transparent' : 'bg-transparent border-transparent opacity-50'}`}>
              <h3 className="font-bold text-lg mb-2 text-white">5. BDH Lab & Final Insight</h3>
              <p className="text-sm text-neutral-400 mb-4">
                By clearing the test-time state, we immediately restore the original base model. This demonstrates the core idea behind <strong>BDH-CQ</strong>: inference-time examples update recurrent memory for latent iterative computation, rather than requiring per-task parameter retraining.
              </p>
              <button onClick={() => { resetState(); setStep(1); }} className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded font-medium flex items-center gap-2">
                <RefreshCw className="w-4 h-4"/> Reset Experiment
              </button>
            </div>

          </div>
        </div>

        {/* Right Column: Visualizer & Stats */}
        <div className="col-span-1 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-4 border-b border-neutral-800 pb-2">Retrieval Probabilities</h2>
            {predictions.length === 0 ? (
              <p className="text-neutral-500 text-sm italic">Waiting for query...</p>
            ) : (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={predictions.slice(0, 4)} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <XAxis type="number" domain={[0, 1.5]} hide />
                    <YAxis dataKey="word" type="category" width={60} stroke="#888" fontSize={12} />
                    <Tooltip cursor={{fill: '#2a2a2a'}} contentStyle={{backgroundColor: '#111', border: '1px solid #333'}} />
                    <Bar dataKey="confidence" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-xl overflow-x-auto">
            <h2 className="text-lg font-semibold mb-4 border-b border-neutral-800 pb-2 flex items-center gap-2">
              <Map className="w-4 h-4" /> Internal State Map
            </h2>
            <MemoryMapVisualizer size={vocab.size} W={engine.W} S={engine.S} words={WORDS} />
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-xl flex flex-col h-48">
            <h2 className="text-lg font-semibold mb-2 border-b border-neutral-800 pb-2">Action Log</h2>
            <div className="flex-1 overflow-y-auto space-y-2 text-sm font-mono text-neutral-400">
              {history.length === 0 && <span className="opacity-50">No actions yet.</span>}
              {[...history].reverse().map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-neutral-600">{(history.length - i).toString().padStart(2, '0')}</span>
                  <span className={log.includes("Queried") ? "text-blue-300" : log.includes("Update") ? "text-yellow-300" : "text-green-300"}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
