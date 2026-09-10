# MEMORA: AI Memory Lab

**A DataForge 2026: Pathway Track Submission**

Memora is an interactive educational sandbox designed to demystify how frontier AI architectures adapt to new information at test time without retraining their base parameters.

---

## 1. The Central Claim

A fast-weight associative memory system can rapidly adapt to new information by updating its state at test time rather than retraining its full model, but retrieval accuracy degrades predictably due to catastrophic forgetting when conflicting associations compete for the same memory resources.

---

## 2. Target Audience & Prerequisites

**Intended Learner:** 
Undergraduate computer science students, junior AI researchers, and data scientists looking to understand modern in-context learning mechanisms beyond standard Transformers.

**Prerequisites:**
* Basic understanding of neural networks (weights vs. activations).
* Foundational linear algebra (vectors, matrices, dot products, outer products).
* Familiarity with the concept of "Test-Time Adaptation" or "In-Context Learning".

---

## 3. Learning Objectives

After completing the interactive modules in the MEMORA lab, learners will be able to:
1. Explain how outer products store associative memories in a matrix (Fast Weights).
2. Demonstrate test-time adaptation by updating memory state without running slow backpropagation on base model parameters.
3. Measure and visualize catastrophic forgetting by inducing interference between conflicting concepts.
4. Relate these toy mechanisms directly to state-of-the-art recurrent architectures like Pathway's BDH (Brain-Inspired Dynamic Hatchling) and BDH-CQ.

---

## 4. Artifact Architecture & Component Roles

The MEMORA lab is built as a decoupled modern web application using React (Vite) and Python (FastAPI). To comply with track requirements, the role and nature of each major component are explicitly classified below:

* **React Frontend (UI & Orchestration) `[ANIMATED / VISUALIZATION]`**: Built with Tailwind CSS, Recharts, and react-force-graph-2d. Responsible for rendering the interactive visual representations of the neural state and managing the user's learning journey across the modules.
* **WebGL Backgrounds `[ANIMATED / SYNTHETIC]`**: Purely visual, synthetic representations of "neural activity" to engage the learner visually. They do not reflect the actual underlying matrix math.
* **Python / FastAPI Backend `[LIVE COMPUTATION]`**: Serves the API endpoints and processes the mathematical logic for the memory states.
* **Fast-Weight Memory Engine `[LIVE COMPUTATION]`**: The mathematical core of the lab. Executes real NumPy (backend) or TypeScript (frontend) outer-product updates, delta-rule learning, and softmax attention retrievals in real-time.
* **Word-to-Vector Encoder `[SYNTHETIC]`**: Instead of using a massive, slow LLM embedding model, we use a deterministic, synthetic one-hot / orthogonal vector projection for vocabulary terms to isolate and cleanly demonstrate the math of associative memory.
* **BDH-CQ Comparison Explanations `[PRECOMPUTED]`**: Static educational content connecting the live interactive sandbox to published academic architectures, utilizing documented evaluations from the original research.

---

## 5. Setup & Reproduction Instructions

To reproduce the environment and run the lab locally, ensure you have **Node.js (v20+)** and **Python (v3.10+)** installed.

**1. Clone the repository:**
```bash
git clone https://github.com/Deebiga21/MEMORA.git
cd MEMORA
```

**2. Install Frontend Dependencies & Build:**
```bash
npm install
npm run build
```

**3. Install Backend Dependencies:**
```bash
pip install -r requirements.txt
```

**4. Run the Full Stack Server:**
```bash
uvicorn main:app --reload --port 8000
```

**5. Access the Lab:**
Open `http://localhost:8000/` in your web browser.

---

## 6. Academic Citations

The technical claims demonstrated in this artifact are supported by recent state-of-the-art research.

* **Test-Time Adaptation via Fast Weights:** Our live test-time adaptation sandbox (Fast Weight Lab) relies on the premise that closed-form outer product updates allow forward-only test-time learning *(Zhang et al., 2026. "FAAST: Forward-Only Associative Learning via Closed-Form Fast Weights for Test-Time Supervised Adaptation." arXiv:2605.04651)*.
* **Interference and Catastrophic Forgetting:** The Interference Lab modules demonstrate that bounded fast-weights suffer from capacity limits and catastrophic forgetting without mechanisms like surprise-gating *(Behrouz et al., 2025. "Titans: Learning to Memorize at Test Time." arXiv:2501.00663)*.
* **Connection to Recurrent Architectures:** The theoretical connection section of the lab explains how associative memory forms the core of modern recurrent alternatives to Transformers, specifically noting how inference-time examples update recurrent memory *(Pathway Research, 2026. "BDH-CQ: In-Context Learning with Recurrent Latent Reasoning." arXiv:2608.09888)*.

---

## 7. Provenance, Licenses, and Disclosures

### Asset Record

* **Codebase:** Original React/Vite/FastAPI implementation by the Deebiga21/MEMORA team.
* **Icons:** lucide-react (ISC License).
* **Charts/Graphs:** recharts (MIT License) and react-force-graph-2d (MIT License).
* **Styling:** Tailwind CSS v4 (MIT License).
* **Fonts:** System defaults + standard web fonts.
* **Graphics:** `hero-bg.jpg` and `hero-graphic.png` are synthetic/AI-generated assets created specifically for this educational project.

### AI Disclosure

* **Code Generation & Review:** Agentic AI coding assistants were heavily utilized for structural boilerplate generation, UI design layout (Tailwind CSS generation), and React component orchestration.
* **Math Verification:** AI tools were used to verify the pure TypeScript/NumPy implementations of the Delta Rule and Softmax Attention mechanisms.
* **Copywriting:** AI was used to draft educational summaries and distill complex research papers into accessible learning modules. All generated text was reviewed, verified against primary sources, and refined by human team members.

### Fork Disclosure

This is an original project created specifically for the DataForge 2026 Pathway track. It does not fork or directly reuse existing upstream repositories, though it implements standard mathematical mechanisms widely published in machine learning literature.