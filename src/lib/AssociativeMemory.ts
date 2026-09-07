export class AssociativeMemory {
  public size: number;
  public W: number[][]; // Base/Slow weights
  public S: number[][]; // Fast/Working weights
  
  public eta: number; // Learning rate for fast weights
  public lambda: number; // Influence of fast weights

  constructor(size: number, eta = 0.5, lambda = 0.5) {
    this.size = size;
    this.eta = eta;
    this.lambda = lambda;
    
    // Initialize matrices to 0
    this.W = Array(size).fill(0).map(() => Array(size).fill(0));
    this.S = Array(size).fill(0).map(() => Array(size).fill(0));
  }

  // Reset just the test-time state
  public resetState() {
    this.S = Array(this.size).fill(0).map(() => Array(this.size).fill(0));
  }

  // Train the base model on a set of pairs using outer product
  public trainBase(pairs: { x: number[], y: number[] }[]) {
    for (const { x, y } of pairs) {
      for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
          this.W[r][c] += y[r] * x[c];
        }
      }
    }
  }

  // Forward pass to retrieve information
  public forward(x: number[]): number[] {
    const y = Array(this.size).fill(0);
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        // Effective weight is base + (lambda * fast state)
        const weight = this.W[r][c] + this.lambda * this.S[r][c];
        y[r] += weight * x[c];
      }
    }
    return y;
  }

  // Update fast weights at test-time
  public updateState(x: number[], target: number[]) {
    const yPred = this.forward(x);
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const error = target[r] - yPred[r];
        // Delta rule applied to the fast weights
        this.S[r][c] += this.eta * error * x[c];
      }
    }
  }
}

export class Vocabulary {
  private wordToIndex: Map<string, number> = new Map();
  private indexToWord: Map<number, string> = new Map();
  public size: number = 0;

  constructor(words: string[]) {
    words.forEach((word, i) => {
      this.wordToIndex.set(word, i);
      this.indexToWord.set(i, word);
    });
    this.size = words.length;
  }

  public toVector(word: string): number[] {
    const vec = Array(this.size).fill(0);
    const index = this.wordToIndex.get(word);
    if (index !== undefined) {
      vec[index] = 1;
    }
    return vec;
  }

  public toWord(vec: number[]): { word: string, confidence: number }[] {
    // Returns sorted words by activation/confidence
    return vec
      .map((val, i) => ({ word: this.indexToWord.get(i)!, confidence: val }))
      .sort((a, b) => b.confidence - a.confidence);
  }
}
