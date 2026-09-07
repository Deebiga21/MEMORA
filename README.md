# 🧠 MEMORA

**An Interactive Laboratory for Fast-Weight Associative Memory and Test-Time Adaptation**

*DataForge 2026: Pathway Track*

---

## One-Sentence Claim

> A fast-weight associative memory can adapt to new associations at test time without
> retraining, but retrieval accuracy degrades predictably when conflicting memories
> compete for the same synaptic resources.

---

## Selected Topics

1. **Associative Memory and Fast Weights**
2. **Test-Time Adaptation**

Combined into one central claim and one coherent learning journey, as required by
the Pathway Track (PDF page 2: "A team may combine two closely related topics only
when the final artifact still has one central claim and one coherent learning journey").

---

## Intended Learner

- **Audience:** 2nd–3rd year CS/AI students, data scientists curious about memory architectures
- **Prerequisites:** Basic linear algebra (matrices, vectors, dot product), basic Python
- **Learning Objectives:**

1. Understand how associative memory stores and retrieves via fast weights
2. Distinguish parameter updates from state updates from fast-weight updates
3. Observe interference as a real, measurable failure mode
4. Connect toy mechanisms to BDH-CQ's recurrent state adaptation

---

## What This Artifact Does

MEMORA is a browser-based interactive lab where learners:

1. **Store** associations (e.g., CAT → ANIMAL) in a fast-weight matrix
2. **Query** the memory and see content-addressed retrieval via softmax attention
3. **Update** associations at test time and observe immediate changes
4. **Conflict** multiple associations for the same cue and measure interference
5. **Connect** the toy mechanism to BDH-CQ's published architecture

The artifact follows the PDF's design standards (page 9):

- One claim, one substrate, visible state
- Truth beside estimate (ground truth shown next to retrieval)
- Catchy preset (Animals preset loads immediately)
- Fast feedback (<1 second for all operations)
- Few controls (each maps to one real variable)
- Guide, then sandbox (learning journey stages)

---

## Architecture

```javascript
User
↓
Streamlit UI (text input, sliders, buttons, tabs)
↓
Text Encoder (deterministic hash → unit vector) [SYNTHETIC]
↓
FastWeightMemory (NumPy: store/retrieve/update) [LIVE COMPUTATION]
↓
Retrieval Engine (softmax attention over keys) [LIVE COMPUTATION]
↓
Metrics Calculator (accuracy, interference, condition number) [LIVE COMPUTATION]
↓
Plotly Visualizations (heatmap, bar charts, scatter) [VISUALIZATION]
↓
BDH-CQ Comparison Module (static explanation + equations) [PRECOMPUTED CONTENT]
```

**Labeling:**

- **LIVE COMPUTATION:** Real NumPy matrix operations happening at runtime
- **SYNTHETIC:** Deterministic text-to-vector encoding (not learned embeddings)
- **VISUALIZATION:** Plotly charts rendering computed data
- **PRECOMPUTED CONTENT:** Static text, equations, and diagrams from published papers

---

## Running Locally

```bash
pip install -r requirements.txt
streamlit run app.py
```

Then open `http://localhost:8501` in your browser.

---

## Deployment

### Streamlit Cloud (Recommended)

1. Push this repo to GitHub
2. Go to [share.streamlit.io](https://share.streamlit.io)
3. Connect your repo
4. App deploys automatically

---

## Repository Structure

```javascript
memora/
├── app.py                    # Main Streamlit application
├── memory.py                 # FastWeightMemory class + encoder
├── requirements.txt          # Dependencies
├── README.md                 # This file
├── docs/
│   ├── CONCEPT_SUMMARY.md    # One-page concept summary (500–950 words)
│   ├── CITATIONS.bib         # BibTeX for all papers
│   ├── AI_DISCLOSURE.md      # AI assistance disclosure
│   └── JUDGE_PREP.md         # Q&A for defense
└── tests/
    └── test_memory.py        # Unit tests
```

---

## Recent Primary Papers (2022–2026)

1. **FAAST** — Zhang et al., 2026. Forward-Only Associative Learning via Closed-Form
Fast Weights for Test-Time Supervised Adaptation. arXiv:2605.04651.
2. **Titans** — Behrouz et al., 2025. Titans: Learning to Memorize at Test Time.
arXiv:2501.00663.
3. **Test-Time Regression** — Wang et al., 2025. Test-time Regression: A Unifying
Framework for Designing Sequence Models with Associative Memory. arXiv:2501.12352.
4. **BDH-CQ** — Pathway Research, 2026. BDH-CQ: In-Context Learning with Recurrent
Latent Reasoning. arXiv:2608.09888.
5. **Modern Hopfield Attention** — Masumura & Taki, 2025. On the Role of Hidden States
of Modern Hopfield Network in Transformer. NeurIPS 2025. arXiv:2511.20698.
6. **BDH (Dragon Hatchling)** — Kosowski et al., 2025. The Dragon Hatchling: The
Missing Link between the Transformer and Models of the Brain. arXiv:2509.26507.

---

## AI Assistance Disclosure

AI tools (ChatGPT/Claude) were used for:

- Research synthesis and paper discovery
- Code structure suggestions and documentation drafting
- Mathematical formulation verification

All implementation decisions, experiment design, parameter tuning, and final
verification were performed by the human team. Every team member can explain every
line of code. See `docs/AI_DISCLOSURE.md` for full details.

---

## License

MIT License. See LICENSE file.

All paper citations belong to their respective authors.
BDH and BDH-CQ are trademarks of Pathway.