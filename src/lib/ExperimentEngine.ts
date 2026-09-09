import { v4 as uuidv4 } from "uuid";

export interface MemoryPair {
  cue: string;
  target: string;
}

export interface ActionLog {
  step: number;
  timestamp: string;
  action: string;
  details: string;
}

export interface ExperimentState {
  experiment_id: string;
  lambda_val: number;
  eta: number;
  base_memory: MemoryPair[];
  test_memory: MemoryPair[];
  experiment_steps: number;
  old_memory_accuracy: number;
  new_memory_accuracy: number;
  interference_rate: number;
  action_log: ActionLog[];
}

export interface QueryResult {
  word: string;
  confidence: number;
}

// Simple seeded PRNG
function mulberry32(a: number) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

function stringHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0; 
    }
    return Math.abs(hash);
}

export class ExperimentEngine {
  private experiment_id: string;
  private dim: number;
  private seed: number;
  private vocab_vectors: Map<string, number[]>;
  
  private W: number[][]; // Slow weights
  private S: number[][]; // Fast weights
  
  private lambda_val: number;
  private eta: number;
  
  private base_memory: MemoryPair[];
  private test_memory: MemoryPair[];
  
  private action_log: ActionLog[];
  private experiment_steps: number;
  
  private old_memory_accuracy: number;
  private new_memory_accuracy: number;

  constructor() {
    this.experiment_id = uuidv4();
    this.dim = 64; // Smaller for JS performance, still enough for orthogonality
    this.seed = 42;
    this.vocab_vectors = new Map();
    
    this.W = Array(this.dim).fill(0).map(() => Array(this.dim).fill(0));
    this.S = Array(this.dim).fill(0).map(() => Array(this.dim).fill(0));
    
    this.lambda_val = 0.5;
    this.eta = 0.5;
    
    this.base_memory = [];
    this.test_memory = [];
    this.action_log = [];
    this.experiment_steps = 0;
    
    this.old_memory_accuracy = 100.0;
    this.new_memory_accuracy = 0.0;
    
    this.logAction("SYSTEM", "TypeScript Engine Initialized");
  }

  public resetFast() {
    this.S = Array(this.dim).fill(0).map(() => Array(this.dim).fill(0));
    this.test_memory = [];
    this.experiment_steps += 1;
    this.logAction("RESET_FAST", "Reset Fast Weights");
    this._recalculateMetrics();
  }

  public resetExperiment() {
    this.W = Array(this.dim).fill(0).map(() => Array(this.dim).fill(0));
    this.S = Array(this.dim).fill(0).map(() => Array(this.dim).fill(0));
    this.base_memory = [];
    this.test_memory = [];
    this.action_log = [];
    this.experiment_steps = 0;
    this.old_memory_accuracy = 100.0;
    this.new_memory_accuracy = 0.0;
    this.logAction("SYSTEM", "Experiment Engine Reset");
  }

  private logAction(action_type: string, details: string) {
    this.action_log.unshift({
      step: this.experiment_steps,
      timestamp: new Date().toISOString(),
      action: action_type,
      details: details
    });
  }

  private getVector(word: string): number[] {
    word = word.trim().toUpperCase();
    if (!this.vocab_vectors.has(word)) {
      const hash_val = stringHash(word);
      const prng = mulberry32(hash_val + this.seed);
      let vec = [];
      let normSq = 0;
      for (let i = 0; i < this.dim; i++) {
        // approximate standard normal
        let u = 0, v = 0;
        while(u === 0) u = prng(); 
        while(v === 0) v = prng();
        let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        vec.push(num);
        normSq += num * num;
      }
      const norm = Math.sqrt(normSq) + 1e-8;
      vec = vec.map(val => val / norm);
      this.vocab_vectors.set(word, vec);
    }
    return this.vocab_vectors.get(word)!;
  }

  private decodeVector(vec: number[], top_k: number = 5): QueryResult[] {
    let normSq = 0;
    for(let i=0; i<this.dim; i++) normSq += vec[i]*vec[i];
    const vecNorm = Math.sqrt(normSq);
    if (vecNorm < 1e-8) return [];

    let results: QueryResult[] = [];
    this.vocab_vectors.forEach((v, word) => {
      let dot = 0;
      let vNormSq = 0;
      for(let i=0; i<this.dim; i++) {
        dot += vec[i]*v[i];
        vNormSq += v[i]*v[i];
      }
      const sim = dot / (vecNorm * Math.sqrt(vNormSq));
      if (sim > 0) {
        results.push({ word, confidence: sim });
      }
    });

    results.sort((a, b) => b.confidence - a.confidence);
    return results.slice(0, top_k);
  }

  public learnBase(cue: string, target: string) {
    cue = cue.trim().toUpperCase();
    target = target.trim().toUpperCase();
    const k = this.getVector(cue);
    const v = this.getVector(target);

    for (let r = 0; r < this.dim; r++) {
      for (let c = 0; c < this.dim; c++) {
        this.W[r][c] += v[r] * k[c];
      }
    }

    if (!this.base_memory.some(m => m.cue === cue && m.target === target)) {
      this.base_memory.push({ cue, target });
    }

    this.experiment_steps += 1;
    this.logAction("LEARN_BASE", `Base Association: [${cue}] -> [${target}]`);
    this._recalculateMetrics();
  }

  public updateFast(cue: string, target: string) {
    cue = cue.trim().toUpperCase();
    target = target.trim().toUpperCase();
    const k = this.getVector(cue);
    const v_target = this.getVector(target);

    // Forward pass
    const v_pred = Array(this.dim).fill(0);
    for (let r = 0; r < this.dim; r++) {
      for (let c = 0; c < this.dim; c++) {
        v_pred[r] += (this.W[r][c] + this.lambda_val * this.S[r][c]) * k[c];
      }
    }

    // Error delta & Fast weight update
    for (let r = 0; r < this.dim; r++) {
      const error = v_target[r] - v_pred[r];
      for (let c = 0; c < this.dim; c++) {
        this.S[r][c] += this.eta * error * k[c];
      }
    }

    this.test_memory.push({ cue, target });
    this.experiment_steps += 1;
    this.logAction("UPDATE_FAST", `Test-Time Update: [${cue}] -> [${target}]`);
    this._recalculateMetrics();
  }

  public interfere(cue: string, target: string) {
    this.updateFast(cue, target);
    this.action_log[0].action = "INTERFERE";
    this.action_log[0].details = `Injected Conflict: [${cue}] -> [${target}]`;
  }

  public eraseMemory(cue: string, target: string, is_base: boolean = true) {
    cue = cue.trim().toUpperCase();
    target = target.trim().toUpperCase();
    const k = this.getVector(cue);
    const v = this.getVector(target);

    if (is_base) {
      for (let r = 0; r < this.dim; r++) {
        for (let c = 0; c < this.dim; c++) {
          this.W[r][c] -= v[r] * k[c];
        }
      }
      this.base_memory = this.base_memory.filter(m => !(m.cue === cue && m.target === target));
      this.logAction("ERASE_BASE", `Removed Base: [${cue}] -> [${target}]`);
    } else {
      for (let r = 0; r < this.dim; r++) {
        for (let c = 0; c < this.dim; c++) {
          this.S[r][c] -= this.eta * v[r] * k[c];
        }
      }
      this.logAction("ERASE_FAST", `Removed Fast: [${cue}] -> [${target}]`);
    }

    this.experiment_steps += 1;
    this._recalculateMetrics();
  }

  public query(cue: string): QueryResult[] {
    cue = cue.trim().toUpperCase();
    const k = this.getVector(cue);
    
    const v_pred = Array(this.dim).fill(0);
    for (let r = 0; r < this.dim; r++) {
      for (let c = 0; c < this.dim; c++) {
        v_pred[r] += (this.W[r][c] + this.lambda_val * this.S[r][c]) * k[c];
      }
    }

    const results = this.decodeVector(v_pred);
    const top_word = results.length > 0 ? results[0].word : "NONE";
    
    this.experiment_steps += 1;
    this.logAction("QUERY", `Queried [${cue}] -> Top Result: [${top_word}]`);
    
    return results;
  }

  private _recalculateMetrics() {
    if (this.base_memory.length === 0) {
      this.old_memory_accuracy = 100.0;
    } else {
      let correct = 0;
      for (const m of this.base_memory) {
        const k = this.getVector(m.cue);
        const v_pred = Array(this.dim).fill(0);
        for (let r = 0; r < this.dim; r++) {
          for (let c = 0; c < this.dim; c++) {
            v_pred[r] += (this.W[r][c] + this.lambda_val * this.S[r][c]) * k[c];
          }
        }
        const results = this.decodeVector(v_pred, 1);
        if (results.length > 0 && results[0].word === m.target) correct++;
      }
      this.old_memory_accuracy = (correct / this.base_memory.length) * 100.0;
    }

    if (this.test_memory.length === 0) {
      this.new_memory_accuracy = 0.0;
    } else {
      let correct = 0;
      const latest_tests = new Map<string, string>();
      for (const m of this.test_memory) {
        latest_tests.set(m.cue, m.target);
      }
      
      latest_tests.forEach((target, cue) => {
        const k = this.getVector(cue);
        const v_pred = Array(this.dim).fill(0);
        for (let r = 0; r < this.dim; r++) {
          for (let c = 0; c < this.dim; c++) {
            v_pred[r] += (this.W[r][c] + this.lambda_val * this.S[r][c]) * k[c];
          }
        }
        const results = this.decodeVector(v_pred, 1);
        if (results.length > 0 && results[0].word === target) correct++;
      });
      this.new_memory_accuracy = (correct / latest_tests.size) * 100.0;
    }
  }

  public setParameters(lambda_val: number, eta: number) {
    this.lambda_val = lambda_val;
    this.eta = eta;
    this.experiment_steps += 1;
    this.logAction("UPDATE_PARAMS", `Set lambda=${lambda_val.toFixed(2)}, eta=${eta.toFixed(2)}`);
    this._recalculateMetrics();
  }

  public getState(): ExperimentState {
    return {
      experiment_id: this.experiment_id,
      lambda_val: this.lambda_val,
      eta: this.eta,
      base_memory: [...this.base_memory],
      test_memory: [...this.test_memory],
      experiment_steps: this.experiment_steps,
      old_memory_accuracy: this.old_memory_accuracy,
      new_memory_accuracy: this.new_memory_accuracy,
      interference_rate: Math.max(0.0, 100.0 - this.old_memory_accuracy),
      action_log: this.action_log.slice(0, 50)
    };
  }
}
