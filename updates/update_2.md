# Update 2 — L1-Aware Diagnostic Engine, Forced Alignment & Story Flow
***start date:** 2026-11-17*  
***end date:** 2026-11-24*

## Core Objectives
- **L1-Aware Diagnostic Test (Hearing vs. Pronunciation):**
  - **Sub-Word Pronunciation Localization (Professor's Suggestion):** Detect when a learner's spoken pronunciation diverges from the target audio (e.g., saying *"cot"* instead of *"cat"*) and pinpoint the exact diverged phoneme or tone contour on the timeline (highlighting the specific shape on the UI without displaying written text or IPA).
  - **2-Choice Auditory Discrimination Test:** Evaluate whether errors stem from auditory perception (L1 phonetic filtering) vs. motor pronunciation by testing learners with low-pressure 2-choice binary sound comparisons before or alongside speaking attempts.
  - **Sound-Level Strength & Struggle Profiling:** Track accuracy and response latency across individual phonemes and pitch contours to identify which sounds a learner struggles with vs. masters, dynamically prioritizing weak contrasts in review.
  - **Native Language (L1) Filter Detection:** Infer the learner's native language phonetic blind spots through an initial zero-text minimal-pair screening rather than text questionnaires.
  - **Review Section:** At the end, users can see what they got wrong next to the target sound.
- **Improve Phoneme Parsing & Alignment:**
  - Upgrade phoneme segmentation from loose frame-level slicing to millisecond neural forced alignment (`MMS_FA` / MFA) paired with native-posture reference audio and Goodness of Pronunciation (GOP) scoring so every phoneme shape plays a crystal-clear, unclipped sound.
- **Create Story Section (Preview → Primer → Audio Story):**
  - Implement the progressive-reveal **Story Preview Carousel** (veiled teaser cards to spark curiosity) leading into the **Level 0 Vocabulary Primer** and full audio-only, animal-POV narrative arc.
- **Improve UI (Zero-Text Botanical Design System):**
  - Refine the frontend layout (`index.html`, `style.css`, `script.js`) from the `Update #2` Figma frames, ensuring 100% zero-text compliance (abstract icons for category switchers, smooth audio-visual transitions, and pulsing botanical highlights for diagnostic feedback).

## What Was Built


## What Worked


## Needs Improvement


## Task Divisions
### Moa


### Yuka


### Aziz


### Asiah