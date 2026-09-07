"""
Fast-Weight Associative Memory — Educational Implementation
for DataForge 2026: Pathway Track

This is a TOY MODEL for educational purposes.
It is NOT an official BDH or BDH-CQ implementation.
"""

import numpy as np
from typing import List, Tuple, Optional


class FastWeightMemory:
    """
    A fast-weight associative memory that stores key-value associations
    in a matrix W updated via local learning rules.

    Mathematical formulation:
    - Storage: W_t = W_{t-1} + η * (v_t - W_{t-1} @ k_t) ⊗ k_t
      (gradient descent on associative loss L = ½||v - Wk||²)
    - Retrieval: v̂ = W @ softmax(β * K^T @ q)
      (content-addressed via softmax attention over stored keys)

    This is an explicit fast-weight model. BDH uses synaptic state σ 
    (fast weights on edges). BDH-CQ uses recurrent state S_t.
    All three achieve test-time adaptation without parameter updates.
    """

    def __init__(self, dim: int, eta: float = 0.3, beta: float = 15.0, 
                 seed: int = 42):
        """
        Args:
            dim: Dimensionality of key and value vectors.
            eta: Learning rate for fast-weight updates (0 < η ≤ 1).
            beta: Inverse temperature for softmax retrieval sharpness.
            seed: Random seed for reproducible initializations.
        """
        self.dim = dim
        self.eta = eta
        self.beta = beta
        self.rng = np.random.default_rng(seed)

        # Fast-weight matrix: the memory itself
        self.W = np.zeros((dim, dim), dtype=np.float32)

        # Stored keys and values for visualization and exact retrieval
        self.keys: List[np.ndarray] = []
        self.values: List[np.ndarray] = []
        self.update_history: List[dict] = []

    def _encode(self, text: str) -> np.ndarray:
        """
        Deterministic text-to-vector encoder.
        Uses a hash-based random projection for reproducibility.
        In a real system, this would be a pretrained embedding model.
        """
        # Hash the text to get a seed, then generate a random unit vector
        hash_val = hash(text) % (2**31)
        rng = np.random.default_rng(hash_val + 42)
        vec = rng.standard_normal(self.dim).astype(np.float32)
        vec /= (np.linalg.norm(vec) + 1e-8)
        return vec

    def store(self, cue: str, target: str) -> dict:
        """
        Test-time associative update.

        Computes prediction error and performs a rank-1 update to W.
        This is the core "test-time adaptation" mechanism.

        Args:
            cue: The key/cue string (e.g., "CAT").
            target: The value/target string (e.g., "ANIMAL").

        Returns:
            dict with update metadata for visualization.
        """
        k = self._encode(cue)
        v = self._encode(target)

        # Prediction before update
        pred = self.W @ k
        error = v - pred

        # Fast-weight update: gradient descent on ½||v - Wk||²
        # ∇_W L = -(v - Wk) ⊗ k = -error ⊗ k
        # W_new = W - η * ∇_W L = W + η * error ⊗ k
        delta_W = self.eta * np.outer(error, k)
        self.W += delta_W

        # Store for exact retrieval and visualization
        self.keys.append(k)
        self.values.append(v)

        meta = {
            "cue": cue,
            "target": target,
            "error_norm": float(np.linalg.norm(error)),
            "delta_norm": float(np.linalg.norm(delta_W)),
            "pred_cosine": float(cosine_sim(pred, v)),
        }
        self.update_history.append(meta)
        return meta

    def retrieve(self, query: str, return_details: bool = False):
        """
        Content-addressed retrieval via softmax attention over stored keys.

        If no keys are stored, returns zero vector.

        Args:
            query: The query string.
            return_details: If True, return attention weights and scores.

        Returns:
            Retrieved vector, or (vector, details_dict) if return_details.
        """
        q = self._encode(query)

        if len(self.keys) == 0:
            return (np.zeros(self.dim), {"attention": [], "scores": []}) if return_details else np.zeros(self.dim)

        K = np.stack(self.keys)      # (N, d)
        V = np.stack(self.values)    # (N, d)

        # Compute similarity scores
        scores = K @ q  # (N,)

        # Softmax attention with temperature β
        # Higher β → sharper attention (more selective)
        # Lower β → smoother attention (more blended)
        exp_scores = np.exp(self.beta * (scores - np.max(scores)))
        attn = exp_scores / (exp_scores.sum() + 1e-10)

        # Weighted combination of values
        retrieved = attn @ V  # (d,)

        if return_details:
            return retrieved, {
                "attention": attn.tolist(),
                "scores": scores.tolist(),
                "keys_text": [h["cue"] for h in self.update_history],
                "values_text": [h["target"] for h in self.update_history],
            }
        return retrieved

    def retrieve_text(self, query: str, top_k: int = 3) -> List[Tuple[str, float]]:
        """
        Retrieve and decode back to text by finding nearest stored values.

        Returns:
            List of (candidate_text, confidence) tuples.
        """
        retrieved, details = self.retrieve(query, return_details=True)

        if len(details["attention"]) == 0:
            return []

        # Rank stored values by attention weight
        ranked = sorted(
            zip(details["keys_text"], details["values_text"], details["attention"]),
            key=lambda x: x[2],
            reverse=True,
        )

        # Return unique target texts with highest attention
        seen = set()
        results = []
        for cue, target, weight in ranked:
            if target not in seen:
                seen.add(target)
                results.append((target, float(weight)))
            if len(results) >= top_k:
                break
        return results

    def interference_score(self, cue: str, expected_target: str) -> float:
        """
        Measure retrieval interference for a specific cue.

        Returns 1 - cosine_similarity(retrieved, expected).
        0 = perfect retrieval, 1 = completely wrong.
        """
        retrieved = self.retrieve(cue)
        expected = self._encode(expected_target)
        return 1.0 - cosine_sim(retrieved, expected)

    def memory_load(self) -> int:
        """Number of stored associations."""
        return len(self.keys)

    def capacity_ratio(self) -> float:
        """Ratio of stored associations to vector dimension."""
        return len(self.keys) / self.dim

    def reset(self):
        """Clear all memory."""
        self.W = np.zeros((dim, dim), dtype=np.float32)
        self.keys = []
        self.values = []
        self.update_history = []


def cosine_sim(a: np.ndarray, b: np.ndarray) -> float:
    """Cosine similarity between two vectors."""
    a_norm = np.linalg.norm(a)
    b_norm = np.linalg.norm(b)
    if a_norm == 0 or b_norm == 0:
        return 0.0
    return float(np.dot(a, b) / (a_norm * b_norm))


def make_orthogonal_vocab(words: List[str], dim: int) -> dict:
    """
    Create an orthonormal embedding for a vocabulary.
    This ensures perfect retrieval when memory load < dim.
    """
    rng = np.random.default_rng(42)
    basis = rng.standard_normal((len(words), dim))
    # Gram-Schmidt orthonormalization
    Q = np.zeros_like(basis)
    for i in range(len(words)):
        q = basis[i]
        for j in range(i):
            q -= np.dot(q, Q[j]) * Q[j]
        norm = np.linalg.norm(q)
        if norm > 1e-10:
            q /= norm
        Q[i] = q
    return {word: Q[i].astype(np.float32) for i, word in enumerate(words)}
