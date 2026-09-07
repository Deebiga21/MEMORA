import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { AssociativeMemory, Vocabulary } from '../lib/AssociativeMemory';

export type DatasetKey = 'animals' | 'math' | 'medical';

export const DATASETS = {
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

export interface Prediction {
  word: string;
  confidence: number;
}

export interface ExperimentHistoryEntry {
  id: string;
  dataset: string;
  conflictingUpdates: number;
  oldRetention: number;
  newAcquisition: number;
  lambda: number;
  eta: number;
}

interface ExperimentContextProps {
  datasetKey: DatasetKey;
  setDatasetKey: (key: DatasetKey) => void;
  dataset: typeof DATASETS[DatasetKey];
  vocab: Vocabulary;
  engine: AssociativeMemory;
  
  lambda: number;
  setLambda: (v: number) => void;
  eta: number;
  setEta: (v: number) => void;

  predictions: Prediction[];
  historyLog: string[];
  
  queryModel: (word: string, silent?: boolean) => void;
  updateTestTime: (x: string, y: string) => void;
  trainBase: (x: string, y: string) => void;
  eraseMemory: (x: string, y: string) => void;
  resetState: () => void;
  fullReset: () => void;
  
  // Metrics tracking
  oldMemoryRetention: number;
  newMemoryAcquisition: number;
  interferenceRate: number;
  conflictingUpdateCount: number;

  savedExperiments: ExperimentHistoryEntry[];
  saveExperiment: () => void;
  deleteExperiment: (id: string) => void;
}

const ExperimentContext = createContext<ExperimentContextProps | undefined>(undefined);

export const ExperimentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [datasetKey, setDatasetKey] = useState<DatasetKey>('animals');
  const dataset = DATASETS[datasetKey];

  const vocab = useMemo(() => new Vocabulary(dataset.words), [datasetKey]);
  const engineRef = useRef<AssociativeMemory>(new AssociativeMemory(vocab.size, 0.5, 0.8));
  const engine = engineRef.current;

  const [lambda, setLambda] = useState(0.8);
  const [eta, setEta] = useState(0.5);

  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [historyLog, setHistoryLog] = useState<string[]>([]);
  
  // Track metrics
  const [conflictingUpdateCount, setConflictingUpdateCount] = useState(0);
  const [oldMemoryRetention, setOldMemoryRetention] = useState(100);
  const [newMemoryAcquisition, setNewMemoryAcquisition] = useState(0);

  const [savedExperiments, setSavedExperiments] = useState<ExperimentHistoryEntry[]>([]);
  
  const [, setTick] = useState(0);
  const forceUpdate = () => setTick(t => t + 1);

  // Initialize
  useEffect(() => {
    fullReset();
  }, [datasetKey, vocab]);

  // Handle parameter changes
  useEffect(() => {
    engine.lambda = lambda;
    engine.eta = eta;
    if (predictions.length > 0) {
      queryModel(dataset.query, true);
    }
    forceUpdate();
  }, [lambda, eta]);

  const calculateMetrics = () => {
    const baseItem = dataset.base[0];
    const basePred = engine.forward(vocab.toVector(baseItem.x));
    const baseWords = vocab.toWord(basePred);
    const baseTargetConfidence = baseWords.find(w => w.word === baseItem.y)?.confidence || 0;
    
    const retention = Math.max(0, Math.min(100, (baseTargetConfidence / 1.0) * 100));
    setOldMemoryRetention(retention);

    if (conflictingUpdateCount > 0) {
      const testItem = dataset.tests[(conflictingUpdateCount - 1) % dataset.tests.length];
      const testPred = engine.forward(vocab.toVector(testItem.x));
      const testWords = vocab.toWord(testPred);
      const testTargetConfidence = testWords.find(w => w.word === testItem.y)?.confidence || 0;
      
      const acquisition = Math.max(0, Math.min(100, (testTargetConfidence / 1.0) * 100));
      setNewMemoryAcquisition(acquisition);
    } else {
      setNewMemoryAcquisition(0);
    }
  };

  const queryModel = (word: string, silent = false) => {
    const vec = vocab.toVector(word);
    const result = engine.forward(vec);
    const topWords = vocab.toWord(result);
    setPredictions(topWords);
    if (!silent) {
      setHistoryLog(prev => [...prev, `Queried [${word}] -> Top: ${topWords[0].word}`]);
    }
    calculateMetrics();
    forceUpdate();
  };

  const updateTestTime = (x: string, y: string) => {
    engine.updateState(vocab.toVector(x), vocab.toVector(y));
    setConflictingUpdateCount(c => c + 1);
    setHistoryLog(prev => [...prev, `Test-Time Update: [${x}] -> [${y}]`]);
    calculateMetrics();
    forceUpdate();
    queryModel(x, true);
  };

  const trainBase = (x: string, y: string) => {
    engine.trainBase([{ x: vocab.toVector(x), y: vocab.toVector(y) }]);
    setHistoryLog(prev => [...prev, `Trained Base: [${x}] -> [${y}]`]);
    calculateMetrics();
    forceUpdate();
  };

  const eraseMemory = (x: string, y: string) => {
    const vX = vocab.toVector(x);
    const vY = vocab.toVector(y);
    for (let r = 0; r < engine.size; r++) {
      for (let c = 0; c < engine.size; c++) {
        engine.W[r][c] -= vY[r] * vX[c];
      }
    }
    setHistoryLog(prev => [...prev, `Erased Base Memory: [${x}] -> [${y}]`]);
    calculateMetrics();
    forceUpdate();
  };

  const resetState = () => {
    engine.resetState();
    setConflictingUpdateCount(0);
    setOldMemoryRetention(100);
    setNewMemoryAcquisition(0);
    setHistoryLog(prev => [...prev, `Reset Fast Weights (State Cleared)`]);
    calculateMetrics();
    forceUpdate();
    setPredictions([]);
  };

  const fullReset = () => {
    const newEngine = new AssociativeMemory(vocab.size, eta, lambda);
    dataset.base.forEach(pair => {
      newEngine.trainBase([{ x: vocab.toVector(pair.x), y: vocab.toVector(pair.y) }]);
    });
    engineRef.current = newEngine;
    setHistoryLog([`[SYSTEM] Loaded Dataset: ${dataset.name}`]);
    setPredictions([]);
    setConflictingUpdateCount(0);
    setOldMemoryRetention(100);
    setNewMemoryAcquisition(0);
    forceUpdate();
  };

  const saveExperiment = () => {
    const newExp: ExperimentHistoryEntry = {
      id: `EXP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      dataset: dataset.name,
      conflictingUpdates: conflictingUpdateCount,
      oldRetention: oldMemoryRetention,
      newAcquisition: newMemoryAcquisition,
      lambda,
      eta
    };
    setSavedExperiments(prev => [newExp, ...prev]);
  };

  const deleteExperiment = (id: string) => {
    setSavedExperiments(prev => prev.filter(e => e.id !== id));
  };

  const interferenceRate = Math.max(0, 100 - oldMemoryRetention);

  return (
    <ExperimentContext.Provider value={{
      datasetKey, setDatasetKey, dataset, vocab, engine,
      lambda, setLambda, eta, setEta,
      predictions, historyLog,
      queryModel, updateTestTime, trainBase, eraseMemory, resetState, fullReset,
      oldMemoryRetention, newMemoryAcquisition, interferenceRate, conflictingUpdateCount,
      savedExperiments, saveExperiment, deleteExperiment
    }}>
      {children}
    </ExperimentContext.Provider>
  );
};

export const useExperiment = () => {
  const context = useContext(ExperimentContext);
  if (context === undefined) {
    throw new Error('useExperiment must be used within an ExperimentProvider');
  }
  return context;
};
