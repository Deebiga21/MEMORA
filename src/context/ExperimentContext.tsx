import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Global Experiment State Type
export interface ExperimentState {
  experiment_id: string;
  lambda_val: number;
  eta: number;
  base_memory: {cue: string, target: string}[];
  test_memory: {cue: string, target: string}[];
  experiment_steps: number;
  old_memory_accuracy: number;
  new_memory_accuracy: number;
  interference_rate: number;
  action_log: {step: number, timestamp: string, action: string, details: string}[];
}

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
  refreshState: () => Promise<void>;
}

const ExperimentContext = createContext<ExperimentContextType | undefined>(undefined);

export const ExperimentProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [state, setState] = useState<ExperimentState | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  const refreshState = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:8000/api/experiment/state');
      const data = await res.json();
      setState(data);
    } catch (e) {
      console.error('Error fetching state', e);
    }
  }, []);

  useEffect(() => {
    refreshState();
  }, [refreshState]);

  const queryModel = async (word: string) => {
    try {
      const res = await fetch('http://localhost:8000/api/experiment/query', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cue: word })
      });
      const data = await res.json();
      setPredictions(data.results || []);
      setState(data.state);
    } catch (e) {
      console.error('Error querying model', e);
    }
  };

  const updateTestTime = async (cue: string, target: string) => {
    try {
      const res = await fetch('http://localhost:8000/api/experiment/update', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cue, target })
      });
      setState(await res.json());
      await queryModel(cue);
    } catch (e) { console.error('Error updating', e); }
  };

  const interfere = async (cue: string, target: string) => {
    try {
      const res = await fetch('http://localhost:8000/api/experiment/interfere', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cue, target })
      });
      setState(await res.json());
      await queryModel(cue);
    } catch (e) { console.error('Error interfering', e); }
  };

  const trainBase = async (cue: string, target: string) => {
    try {
      const res = await fetch('http://localhost:8000/api/experiment/learn', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cue, target })
      });
      setState(await res.json());
    } catch (e) { console.error('Error training base', e); }
  };

  const eraseMemory = async (cue: string, target: string) => {
    try {
      const res = await fetch('http://localhost:8000/api/experiment/erase', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cue, target })
      });
      setState(await res.json());
    } catch (e) { console.error('Error erasing', e); }
  };

  const setParams = async (lambda_val: number, eta: number) => {
    try {
      const res = await fetch('http://localhost:8000/api/experiment/params', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lambda_val, eta })
      });
      setState(await res.json());
    } catch (e) { console.error('Error setting params', e); }
  };

  const resetExperiment = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/experiment/reset', { method: 'POST' });
      setState(await res.json());
      setPredictions([]);
      
      await trainBase("CAT", "ANIMAL");
    } catch (e) { console.error('Error resetting', e); }
  };

  return (
    <ExperimentContext.Provider value={{
      state, predictions, queryModel, updateTestTime, interfere, trainBase, eraseMemory, setParams, resetExperiment, refreshState
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
