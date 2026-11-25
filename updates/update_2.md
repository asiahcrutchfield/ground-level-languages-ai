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
- Replaced previous phoneme extraction model (Wav2Vec2-eSpeak + MMS_FA) to Oxford IPA.

## What Worked
- **Forced Alignment and Reference Audio:** The Colab pipeline now uses Torchaudio MMS_FA with the canonical word-to-phoneme lexicon, while the phoneme bank was updated to isolated reference WAVs. Librosa/SciPy syllable segmentation and TorchCREPE humming/pitch processing remain part of the offline asset workflow. Generated assets and lesson data support the five current words.
- **Assessment Audio Bank:** Added `assessment_data.json` with listening and pronunciation entries for the five Level 0 words, plus five minimal-pair distractor WAVs and five mock-attempt WAVs under `audio/test_bank/`.
- **Listening Interaction:** Wired the target prompt and randomized target/distractor choices into the assessment. A learner can preview either choice, switch selection, and submit with a separate check control. The three-trial round records correctness and response latency in page memory.
- **Pronunciation and Review Prototype:** Added microphone capture with manual stop or a 3.5-second timeout, waveform comparison and replay controls, a visual result badge, and a two-word practice round that transitions into review.
- **Guided Stage Flow:** Implemented the five-stage path—Vocabulary, Listening, Pronunciation, Review, Diagnostic—with stage dots, visual progress indicators, and a restart control. Shared audio playback stops the prior clip before starting another.
- **Design Documentation:** Added the curriculum flow specification and expanded technical explanations to describe the browser runtime, offline notebook, and current assessment behavior.

## Needs Improvement
- **L1 and Phoneme-Level Diagnosis Remains a Goal:** The current browser does not infer a learner's L1 phonetic filters, localize a pronunciation error to a specific phoneme, or calculate Goodness of Pronunciation. Pronunciation scoring is a coarse 28-peak waveform-envelope similarity proxy. The proposed Wav2Vec2/MMS_FA comparison of learner recordings and sub-word error localization are not implemented in the browser or Colab pipeline.
- **Listening Telemetry Is Not Yet an Adaptive Diagnostic:** Correctness and response latency are held in memory only. Latency does not affect the displayed diagnostic, results are not persisted, and the app does not yet profile difficulty by phoneme or pitch contrast.
- **Review Coverage Is Limited:** The current review layout compares the active word's attempt and target rather than presenting a complete history of all listening answers and both pronunciation attempts. Mock attempts can preview a waveform and badge, but they do not replace live microphone recordings to complete the guided pronunciation round.
- **Story Curriculum Is Not Implemented Yet:** The Story Preview Carousel and audio-only animal-POV story arc remain planned. The current guided module is the five-word primer and its listening/pronunciation assessments.
- **Navigation Can Bypass the Guided Unlocks:** Stage dots navigate directly to stages, so the three-word vocabulary unlock and linear assessment sequence are not enforced when dots are used.
- **Current Merge Needs Integration:** As of 2026-11-24, the working tree contains unresolved conflicts in `index.html` and `style.css`, alongside staged changes to `script.js` and new listening/audio files. Resolve and verify these before treating those pending changes as part of the stable app.

## Task Divisions
### Moa
Moa will be out of the country until next Wednesday (11/25) so she can give feedback and suggest designs for the UI.

### Yuka
- Build the Story Preview Carousel and Side-by-Side Review layout in HTML/CSS.

### Aziz
- Build the 2-choice hearing test and review replay logic in `script.js`.
- Add the visual highlight pulse on diverged phoneme shapes (`●` / `▲`).

### Asiah
- Upgrade `gll_intro_to_ai.ipynb` to use `MMS_FA` forced alignment for cleaner phoneme audio slices.
- Set up sub-word pronunciation comparison (`Wav2Vec2`) in Colab and export updated `lesson_data.json` files.