import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AssociativeMemory, Vocabulary } from './lib/AssociativeMemory';
import { Brain, Database, Zap, RefreshCw, Activity, AlertTriangle, Map, Download, Sliders, Info, Beaker } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MemoryMapVisualizer } from './components/MemoryMapVisualizer';
import { ForceGraphVisualizer } from './components/ForceGraphVisualizer';

const DATASETS = {
  animals: {
    name: "Linguistics (Animals)",
    words: ["CAT", "ANIMAL", "PET", "WILD", "DOG", "BIRD"],
    base: [{ x: "CAT", y: "ANIMAL" }, { x: "DOG", y: "ANIMAL" }, { x: "BIRD", y: "WILD" }],
    tests: [{ x: "CAT", y: "PET" }, { x: "CAT", y: "WILD" }],
    query: "CAT"
  },
  math: {
    name: "Logic (Math)",
    words: ["2+2", "4", "5", "MATH", "ERROR", "3"],
    base: [{ x: "2+2", y: "4" }, { x: "MATH", y: "4" }],
    tests: [{ x: "2+2", y: "5" }, { x: "2+2", y: "ERROR" }],
    query: "2+2"
  },
  medical: {
    name: "Medical (Symptoms)",
    words: ["COUGH", "COLD", "COVID", "FLU", "FEVER", "HEALTHY"],
    base: [{ x: "COUGH", y: "COLD" }, { x: "FEVER", y: "FLU" }],
    tests: [{ x: "COUGH", y: "COVID" }, { x: "COUGH", y: "HEALTHY" }],
    query: "COUGH"
  }
};

type DatasetKey = keyof typeof DATASETS;

export default function App() {
  const [datasetKey, setDatasetKey] = useState<DatasetKey>('animals');
  const dataset = DATASETS[datasetKey];

  const vocab = useMemo(() => new Vocabulary(dataset.words), [datasetKey]);
  const engineRef = useRef<AssociativeMemory>(new AssociativeMemory(vocab.size, 0.5, 0.8));
  const engine = engineRef.current;

  const [step, setStep] = useState(1);
  const [predictions, setPredictions] = useState<{word: string, confidence: number}[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [, setTick] = useState(0);
  const forceUpdate = () => setTick(t => t + 1);

  // Sliders State
  const [lambda, setLambda] = useState(0.8);
  const [eta, setEta] = useState(0.5);
  
  // UI Toggles
  const [showMath, setShowMath] = useState(false);
  const [viewMode, setViewMode] = useState<'matrix' | 'graph'>('graph');

  // Initialization
  useEffect(() => {
    const newEngine = new AssociativeMemory(vocab.size, eta, lambda);
    dataset.base.forEach(pair => {
      newEngine.trainBase([{ x: vocab.toVector(pair.x), y: vocab.toVector(pair.y) }]);
    });
    engineRef.current = newEngine;
    setHistory([`[SYSTEM] Loaded Dataset: ${dataset.name}`]);
    setPredictions([]);
    setStep(1);
    forceUpdate();
  }, [datasetKey, vocab]);

  // Update engine params when sliders change
  useEffect(() => {
    engine.lambda = lambda;
    engine.eta = eta;
    if (predictions.length > 0 && step > 1) {
      queryModel(dataset.query, true); // Re-query silently to update chart
    }
    forceUpdate();
  }, [lambda, eta]);

  const queryModel = (word: string, silent = false) => {
    const vec = vocab.toVector(word);
    const result = engine.forward(vec);
    setPredictions(vocab.toWord(result));
    if (!silent) {
      setHistory(prev => [...prev, `Queried [${word}] -> Top: ${vocab.toWord(result)[0].word}`]);
    }
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

  const exportReport = () => {
    const report = `
MEMORA-X LAB REPORT
===================
Dataset: ${dataset.name}
Lambda (Fast Weight Influence): ${lambda}
Eta (Learning Rate): ${eta}

HISTORY LOG:
${history.map((h, i) => `${i+1}. ${h}`).join('\n')}

FINAL PREDICTIONS FOR [${dataset.query}]:
${predictions.map(p => `- ${p.word}: ${p.confidence.toFixed(2)}`).join('\n')}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `memora-x-report-${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Left Column: Flow & Controls */}
        <div className="col-span-1 lg:col-span-2 space-y-6 md:space-y-8">
          <header className="border-b border-neutral-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3 text-blue-400">
                <Brain className="w-8 h-8" />
                MEMORA-X <span className="text-sm font-normal text-neutral-500 uppercase tracking-widest mt-1 hidden sm:inline">AI Memory Lab</span>
              </h1>
              <p className="text-neutral-400 mt-2">
                Associative Memory, Fast Weights & BDH-CQ.
              </p>
            </div>
            
            <div className="flex items-center gap-4 bg-neutral-900 p-2 border border-neutral-800 rounded-lg">
              <Beaker className="w-5 h-5 text-neutral-400" />
              <select 
                value={datasetKey} 
                onChange={(e) => setDatasetKey(e.target.value as DatasetKey)}
                className="bg-neutral-800 text-sm border border-neutral-700 text-white rounded p-1 outline-none"
              >
                {Object.entries(DATASETS).map(([key, data]) => (
                  <option key={key} value={key}>{data.name}</option>
                ))}
              </select>
            </div>
          </header>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 md:p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Activity className="text-green-400" />
                Experiment Flow
              </h2>
              <button onClick={exportReport} className="text-xs flex items-center gap-1 text-neutral-400 hover:text-white transition-colors">
                <Download className="w-4 h-4"/> Export Report
              </button>
            </div>

            <div className={`p-4 rounded-lg mb-4 border transition-all duration-300 ${step === 1 ? 'bg-neutral-800 border-neutral-700' : 'bg-transparent border-transparent opacity-50'}`}>
              <h3 className="font-bold text-lg mb-2 text-white">1. Learn Memory & Test (Base Model)</h3>
              <p className="text-sm text-neutral-400 mb-4">The slow weights were pre-trained with <code>{dataset.base[0].x} → {dataset.base[0].y}</code>. Let's query it.</p>
              <button onClick={() => { queryModel(dataset.query); setStep(2); }} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-medium flex items-center gap-2">
                <Database className="w-4 h-4"/> Query "{dataset.query}"
              </button>
            </div>

            <div className={`p-4 rounded-lg mb-4 border transition-all duration-300 ${step === 2 ? 'bg-neutral-800 border-neutral-700' : step < 2 ? 'hidden' : 'bg-transparent border-transparent opacity-50'}`}>
              <h3 className="font-bold text-lg mb-2 text-white">2. Observe Internal State</h3>
              <p className="text-sm text-neutral-400 mb-4">Look at the graph on the right. You can clearly see the base associations.</p>
              <button onClick={() => setStep(3)} className="bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded font-medium flex items-center gap-2">
                <Map className="w-4 h-4"/> Next: Interference Lab
              </button>
            </div>

            <div className={`p-4 rounded-lg mb-4 border transition-all duration-300 ${step === 3 ? 'bg-neutral-800 border-neutral-700' : step < 3 ? 'hidden' : 'bg-transparent border-transparent opacity-50'}`}>
              <h3 className="font-bold text-lg mb-2 text-white">3. Interference Lab (Test-Time Update)</h3>
              <p className="text-sm text-neutral-400 mb-4">Introduce conflicting information during inference to adapt the Fast Weights without retraining.</p>
              <div className="flex flex-wrap gap-4">
                {dataset.tests.map((test, i) => (
                  <button key={i} onClick={() => { updateTestTime(test.x, test.y); setStep(4); }} className={`${i===0 ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-red-600 hover:bg-red-500'} px-4 py-2 rounded font-medium flex items-center gap-2`}>
                    <Zap className="w-4 h-4"/> Update: {test.x} → {test.y}
                  </button>
                ))}
              </div>
            </div>

            <div className={`p-4 rounded-lg mb-4 border transition-all duration-300 ${step === 4 ? 'bg-neutral-800 border-neutral-700' : step < 4 ? 'hidden' : 'bg-transparent border-transparent opacity-50'}`}>
              <h3 className="font-bold text-lg mb-2 text-white">4. Catastrophic Forgetting Lab</h3>
              <p className="text-sm text-neutral-400 mb-4">Adjust the sliders to see how the model breaks if the fast weights completely overpower the base weights.</p>
              
              <div className="space-y-4 mb-4 bg-neutral-950 p-4 rounded border border-neutral-800">
                <div>
                  <div className="flex justify-between text-xs text-neutral-400 mb-1">
                    <span>Fast Weight Influence (λ)</span>
                    <span className="font-mono text-blue-400">{lambda.toFixed(2)}</span>
                  </div>
                  <input type="range" min="0" max="2" step="0.1" value={lambda} onChange={(e)=>setLambda(parseFloat(e.target.value))} className="w-full accent-blue-500" />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-neutral-400 mb-1">
                    <span>Test-Time Learning Rate (η)</span>
                    <span className="font-mono text-yellow-400">{eta.toFixed(2)}</span>
                  </div>
                  <input type="range" min="0" max="1" step="0.1" value={eta} onChange={(e)=>setEta(parseFloat(e.target.value))} className="w-full accent-yellow-500" />
                </div>
              </div>

              <button onClick={() => setStep(5)} className="bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded font-medium flex items-center gap-2">
                Next: The BDH Connection
              </button>
            </div>

            <div className={`p-4 rounded-lg border transition-all duration-300 ${step === 5 ? 'bg-neutral-800 border-neutral-700' : step < 5 ? 'hidden' : 'bg-transparent border-transparent opacity-50'}`}>
              <h3 className="font-bold text-lg mb-2 text-white">5. BDH Lab & Final Insight</h3>
              <p className="text-sm text-neutral-400 mb-4">
                Clearing the test-time state restores the base model. This demonstrates <strong>BDH-CQ</strong>: inference-time examples update recurrent memory dynamically, rather than requiring expensive per-task parameter retraining.
              </p>
              <button onClick={() => { resetState(); setStep(1); }} className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded font-medium flex items-center gap-2">
                <RefreshCw className="w-4 h-4"/> Reset Fast Weights
              </button>
            </div>

          </div>
        </div>

        {/* Right Column: Visualizer & Stats */}
        <div className="col-span-1 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 md:p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4 border-b border-neutral-800 pb-2">
              <h2 className="text-lg font-semibold">Retrieval Probabilities</h2>
              <button onClick={()=>setShowMath(!showMath)} className="text-xs text-blue-400 flex items-center gap-1 hover:text-blue-300"><Info className="w-3 h-3"/> Math</button>
            </div>
            
            {showMath && (
              <div className="bg-neutral-950 p-3 rounded mb-4 text-xs font-mono text-neutral-400 border border-neutral-800">
                <div className="text-white mb-1">Inference:</div>
                <div className="mb-2 text-blue-300">y = (W + λS)x</div>
                <div className="text-white mb-1">Delta Rule Update:</div>
                <div className="text-yellow-300">S = S + η(y_tgt - y_pred)x^T</div>
              </div>
            )}

            {predictions.length === 0 ? (
              <p className="text-neutral-500 text-sm italic">Waiting for query...</p>
            ) : (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={predictions.slice(0, 4)} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <XAxis type="number" domain={[0, 'dataMax']} hide />
                    <YAxis dataKey="word" type="category" width={60} stroke="#888" fontSize={10} />
                    <Tooltip cursor={{fill: '#2a2a2a'}} contentStyle={{backgroundColor: '#111', border: '1px solid #333'}} />
                    <Bar dataKey="confidence" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 md:p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4 border-b border-neutral-800 pb-2">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Map className="w-4 h-4" /> Internal State
              </h2>
              <div className="flex bg-neutral-950 rounded border border-neutral-800 overflow-hidden">
                <button onClick={()=>setViewMode('graph')} className={`px-3 py-1 text-xs ${viewMode==='graph'?'bg-neutral-800 text-white':'text-neutral-500'}`}>Graph</button>
                <button onClick={()=>setViewMode('matrix')} className={`px-3 py-1 text-xs ${viewMode==='matrix'?'bg-neutral-800 text-white':'text-neutral-500'}`}>Matrix</button>
              </div>
            </div>
            
            <div className="h-64 rounded bg-neutral-950 border border-neutral-800 flex items-center justify-center">
              {viewMode === 'graph' ? (
                <ForceGraphVisualizer size={vocab.size} W={engine.W} S={engine.S} words={dataset.words} />
              ) : (
                <MemoryMapVisualizer size={vocab.size} W={engine.W} S={engine.S} words={dataset.words} />
              )}
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 md:p-6 shadow-xl flex flex-col h-48">
            <h2 className="text-lg font-semibold mb-2 border-b border-neutral-800 pb-2">Action Log</h2>
            <div className="flex-1 overflow-y-auto space-y-2 text-xs font-mono text-neutral-400 pr-2 custom-scrollbar">
              {history.length === 0 && <span className="opacity-50">No actions yet.</span>}
              {[...history].reverse().map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-neutral-600 shrink-0">{(history.length - i).toString().padStart(2, '0')}</span>
                  <span className={log.includes("SYSTEM") ? "text-purple-300" : log.includes("Queried") ? "text-blue-300" : log.includes("Update") ? "text-yellow-300" : "text-green-300"}>
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
