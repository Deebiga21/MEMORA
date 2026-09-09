import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { ExperimentEngine } from '../lib/ExperimentEngine';
import type { ExperimentState } from '../lib/ExperimentEngine';

interface Prediction {
  word: string;
  confidence: number;
}

interface ExperimentContextType {
  state: ExperimentState | null;
  predictions: Prediction[];
  queryModel: (word: string) => Promise<void>;
  updateTestTime: (cue: string, target: string) => Promise<void>;
  interfere: (cue: string, target: string) => Promise<void>;
  trainBase: (cue: string, target: string) => Promise<void>;
  eraseMemory: (cue: string, target: string) => Promise<void>;
  setParams: (lambda_val: number, eta: number) => Promise<void>;
  resetExperiment: () => Promise<void>;
  resetFast: () => Promise<void>;
  refreshState: () => Promise<void>;
}

const ExperimentContext = createContext<ExperimentContextType | undefined>(undefined);

export const ExperimentProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const engineRef = useRef(new ExperimentEngine());
  const [state, setState] = useState<ExperimentState | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  const refreshState = useCallback(async () => {
    setState(engineRef.current.getState());
  }, []);

  useEffect(() => {
    refreshState();
  }, [refreshState]);

  const queryModel = async (word: string) => {
    const results = engineRef.current.query(word);
    setPredictions(results);
    setState(engineRef.current.getState());
  };

  const updateTestTime = async (cue: string, target: string) => {
    engineRef.current.updateFast(cue, target);
    setState(engineRef.current.getState());
    await queryModel(cue);
  };

  const interfere = async (cue: string, target: string) => {
    engineRef.current.interfere(cue, target);
    setState(engineRef.current.getState());
    await queryModel(cue);
  };

  const trainBase = async (cue: string, target: string) => {
    engineRef.current.learnBase(cue, target);
    setState(engineRef.current.getState());
  };

  const eraseMemory = async (cue: string, target: string) => {
    // Determine if it's in base or test
    const st = engineRef.current.getState();
    const isBase = st.base_memory.some(m => m.cue === cue.toUpperCase() && m.target === target.toUpperCase());
    engineRef.current.eraseMemory(cue, target, isBase);
    setState(engineRef.current.getState());
  };

  const setParams = async (lambda_val: number, eta: number) => {
    engineRef.current.setParameters(lambda_val, eta);
    setState(engineRef.current.getState());
  };

  const resetExperiment = async () => {
    engineRef.current.resetExperiment();
    setState(engineRef.current.getState());
    setPredictions([]);
    await trainBase("CAT", "ANIMAL");
  };

  const resetFast = async () => {
    engineRef.current.resetFast();
    setState(engineRef.current.getState());
    setPredictions([]);
  };

  return (
    <ExperimentContext.Provider value={{
      state, predictions, queryModel, updateTestTime, interfere, trainBase, eraseMemory, setParams, resetExperiment, resetFast, refreshState
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

