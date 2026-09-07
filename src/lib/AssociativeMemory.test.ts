import { describe, it, expect, beforeEach } from 'vitest';
import { AssociativeMemory, Vocabulary } from './AssociativeMemory';

describe('AssociativeMemory Engine', () => {
  let vocab: Vocabulary;
  let engine: AssociativeMemory;
  const words = ["CAT", "ANIMAL", "PET", "WILD"];

  beforeEach(() => {
    vocab = new Vocabulary(words);
    // Initialize with standard parameters
    engine = new AssociativeMemory(vocab.size, 0.5, 0.8);
  });

  it('should initialize with empty weights', () => {
    expect(engine.W[0][0]).toBe(0);
    expect(engine.S[0][0]).toBe(0);
  });

  it('should learn base knowledge (Slow Weights)', () => {
    // Train CAT -> ANIMAL
    engine.trainBase([{ x: vocab.toVector("CAT"), y: vocab.toVector("ANIMAL") }]);
    
    const result = engine.forward(vocab.toVector("CAT"));
    const predictions = vocab.toWord(result);
    
    expect(predictions[0].word).toBe("ANIMAL");
    expect(predictions[0].confidence).toBeGreaterThan(0);
  });

  it('should update state via fast weights at test-time (Interference)', () => {
    // Train base CAT -> ANIMAL
    engine.trainBase([{ x: vocab.toVector("CAT"), y: vocab.toVector("ANIMAL") }]);
    
    // Test-time update CAT -> PET
    engine.updateState(vocab.toVector("CAT"), vocab.toVector("PET"));
    
    const result = engine.forward(vocab.toVector("CAT"));
    const predictions = vocab.toWord(result);
    
    // The top prediction should now be PET or at least PET should have high confidence
    const petConfidence = predictions.find(p => p.word === "PET")?.confidence || 0;
    
    expect(petConfidence).toBeGreaterThan(0);
    // With lambda=0.8 and eta=0.5, pet confidence should rise significantly
  });

  it('should reset state (BDH-CQ capability)', () => {
    // Train base
    engine.trainBase([{ x: vocab.toVector("CAT"), y: vocab.toVector("ANIMAL") }]);
    
    // Add interference
    engine.updateState(vocab.toVector("CAT"), vocab.toVector("PET"));
    
    // Clear state
    engine.resetState();
    
    const result = engine.forward(vocab.toVector("CAT"));
    const predictions = vocab.toWord(result);
    
    // Should perfectly revert to base knowledge
    expect(predictions[0].word).toBe("ANIMAL");
    const petConfidence = predictions.find(p => p.word === "PET")?.confidence || 0;
    expect(petConfidence).toBe(0);
  });

  it('should exhibit catastrophic forgetting if lambda is too high', () => {
    engine.lambda = 2.0; // Very high fast-weight influence
    engine.eta = 1.0;    // Aggressive learning
    
    engine.trainBase([{ x: vocab.toVector("CAT"), y: vocab.toVector("ANIMAL") }]);
    
    // Hit it with interference once
    engine.updateState(vocab.toVector("CAT"), vocab.toVector("PET"));
    
    const result = engine.forward(vocab.toVector("CAT"));
    const predictions = vocab.toWord(result);
    
    expect(predictions[0].word).toBe("PET");
    const animalConfidence = predictions.find(p => p.word === "ANIMAL")?.confidence || 0;
    // The original association should be severely depressed
    expect(predictions[0].confidence).toBeGreaterThan(animalConfidence);
  });
});
