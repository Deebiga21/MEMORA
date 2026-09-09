import numpy as np
from typing import List, Tuple, Dict, Any
import uuid
import datetime
import math

class ExperimentEngine:
    def __init__(self, dim: int = 512, seed: int = 42):
        self.dim = dim
        self.seed = seed
        self.rng = np.random.default_rng(seed)
        
        # Word -> Vector registry for exact decode
        self.vocab_vectors: Dict[str, np.ndarray] = {}
        
        self.reset_experiment()

    def reset_experiment(self):
        """Hard reset of the entire experiment state."""
        self.experiment_id = f"EXP-{uuid.uuid4().hex[:6].upper()}"
        self.W = np.zeros((self.dim, self.dim), dtype=np.float32) # Slow weights
        self.S = np.zeros((self.dim, self.dim), dtype=np.float32) # Fast weights
        
        self.lambda_val = 0.5
        self.eta = 0.5
        
        self.base_memory: List[Dict[str, str]] = []
        self.test_memory: List[Dict[str, str]] = []
        
        self.action_log: List[Dict[str, Any]] = []
        self.experiment_steps = 0
        
        self.old_memory_accuracy = 100.0
        self.new_memory_accuracy = 0.0
        self.failure_threshold = 70.0
        
        self.log_action("SYSTEM", "Experiment Engine Initialized")

    def reset_fast(self):
        self.S = np.zeros((self.dim, self.dim), dtype=np.float32)
        self.test_memory = []
        self.experiment_steps += 1
        self.log_action('RESET_FAST', 'Reset Fast Weights')
        self._recalculate_metrics()

    def log_action(self, action_type: str, details: str):
        self.action_log.insert(0, {
            "step": self.experiment_steps,
            "timestamp": datetime.datetime.now().isoformat(),
            "action": action_type,
            "details": details
        })

    def _get_vector(self, word: str) -> np.ndarray:
        word = word.strip().upper()
        if word not in self.vocab_vectors:
            # Generate deterministic pseudo-orthogonal vector for new words
            hash_val = hash(word) % (2**31)
            rng = np.random.default_rng(hash_val + self.seed)
            vec = rng.standard_normal(self.dim).astype(np.float32)
            vec /= (np.linalg.norm(vec) + 1e-8)
            self.vocab_vectors[word] = vec
        return self.vocab_vectors[word]

    def _decode_vector(self, vec: np.ndarray, top_k: int = 5) -> List[Dict[str, Any]]:
        if np.linalg.norm(vec) < 1e-8:
            return []
        
        results = []
        for word, v in self.vocab_vectors.items():
            sim = float(np.dot(vec, v) / (np.linalg.norm(vec) * np.linalg.norm(v)))
            # ReLU-like gating to remove negative noise
            if sim > 0:
                results.append({"word": word, "confidence": sim})
        
        results.sort(key=lambda x: x["confidence"], reverse=True)
        return results[:top_k]

    def learn_base(self, cue: str, target: str):
        """Train the slow weights using Hebbian learning (outer product)."""
        cue = cue.strip().upper()
        target = target.strip().upper()
        
        k = self._get_vector(cue)
        v = self._get_vector(target)
        
        self.W += np.outer(v, k)
        
        # Avoid duplicate base tracking
        if not any(m["cue"] == cue and m["target"] == target for m in self.base_memory):
            self.base_memory.append({"cue": cue, "target": target})
            
        self.experiment_steps += 1
        self.log_action("LEARN_BASE", f"Base Association: [{cue}] -> [{target}]")
        self._recalculate_metrics()

    def update_fast(self, cue: str, target: str):
        """Update fast weights using error-driven learning at test time."""
        cue = cue.strip().upper()
        target = target.strip().upper()
        
        k = self._get_vector(cue)
        v_target = self._get_vector(target)
        
        # Forward pass
        v_pred = (self.W + self.lambda_val * self.S) @ k
        
        # Error delta
        error = v_target - v_pred
        
        # Fast weight update
        self.S += self.eta * np.outer(error, k)
        
        self.test_memory.append({"cue": cue, "target": target})
        self.experiment_steps += 1
        self.log_action("UPDATE_FAST", f"Test-Time Update: [{cue}] -> [{target}]")
        self._recalculate_metrics()

    def interfere(self, cue: str, target: str):
        """Alias for update_fast but explicitly logged as interference."""
        self.update_fast(cue, target)
        # Update the latest log to say INTERFERE
        self.action_log[0]["action"] = "INTERFERE"
        self.action_log[0]["details"] = f"Injected Conflict: [{cue}] -> [{target}]"

    def erase_memory(self, cue: str, target: str, is_base: bool = True):
        cue = cue.strip().upper()
        target = target.strip().upper()
        k = self._get_vector(cue)
        v = self._get_vector(target)
        
        if is_base:
            self.W -= np.outer(v, k)
            self.base_memory = [m for m in self.base_memory if not (m["cue"] == cue and m["target"] == target)]
            self.log_action("ERASE_BASE", f"Removed Base: [{cue}] -> [{target}]")
        else:
            self.S -= self.eta * np.outer(v, k) # Approximate reversal
            self.log_action("ERASE_FAST", f"Removed Fast: [{cue}] -> [{target}]")
            
        self.experiment_steps += 1
        self._recalculate_metrics()

    def query(self, cue: str) -> List[Dict[str, Any]]:
        cue = cue.strip().upper()
        k = self._get_vector(cue)
        
        v_slow = self.W @ k
        v_fast = self.S @ k
        v_pred = v_slow + self.lambda_val * v_fast
        
        results = self._decode_vector(v_pred)
        
        top_word = results[0]["word"] if results else "NONE"
        self.experiment_steps += 1
        self.log_action("QUERY", f"Queried [{cue}] -> Top Result: [{top_word}]")
        
        return results

    def query_internal(self, cue: str) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        """Returns raw vectors for visualization (slow, fast, combined)"""
        k = self._get_vector(cue.strip().upper())
        v_slow = self.W @ k
        v_fast = self.lambda_val * (self.S @ k)
        v_combined = v_slow + v_fast
        return v_slow, v_fast, v_combined

    def _recalculate_metrics(self):
        """Recalculate retention and acquisition across all tracked memories."""
        # 1. Old Memory Retention
        if not self.base_memory:
            self.old_memory_accuracy = 100.0
        else:
            correct = 0
            for m in self.base_memory:
                k = self._get_vector(m["cue"])
                v_pred = (self.W + self.lambda_val * self.S) @ k
                results = self._decode_vector(v_pred, top_k=1)
                if results and results[0]["word"] == m["target"]:
                    correct += 1
            self.old_memory_accuracy = (correct / len(self.base_memory)) * 100.0

        # 2. New Memory Acquisition
        if not self.test_memory:
            self.new_memory_accuracy = 0.0
        else:
            correct = 0
            # Only check unique most recent test updates
            latest_tests = {}
            for m in self.test_memory:
                latest_tests[m["cue"]] = m["target"]
                
            for cue, target in latest_tests.items():
                k = self._get_vector(cue)
                v_pred = (self.W + self.lambda_val * self.S) @ k
                results = self._decode_vector(v_pred, top_k=1)
                if results and results[0]["word"] == target:
                    correct += 1
            self.new_memory_accuracy = (correct / len(latest_tests)) * 100.0

    def set_parameters(self, lambda_val: float, eta: float):
        self.lambda_val = lambda_val
        self.eta = eta
        self.experiment_steps += 1
        self.log_action("UPDATE_PARAMS", f"Set lambda={lambda_val:.2f}, eta={eta:.2f}")
        self._recalculate_metrics()

    def get_state(self) -> Dict[str, Any]:
        return {
            "experiment_id": self.experiment_id,
            "lambda_val": self.lambda_val,
            "eta": self.eta,
            "base_memory": self.base_memory,
            "test_memory": self.test_memory,
            "experiment_steps": self.experiment_steps,
            "old_memory_accuracy": self.old_memory_accuracy,
            "new_memory_accuracy": self.new_memory_accuracy,
            "interference_rate": max(0.0, 100.0 - self.old_memory_accuracy),
            "action_log": self.action_log[:50] # Send last 50 actions to UI
        }

engine = ExperimentEngine()
