# Update 1 — Acoustic Pipeline & Zero-Text MVP
***start date:** 2026-11-10*  
***end date:** 2026-11-17*

## Core Objectives

## What Was Built
- **Automated AI Acoustic Pipeline (`gll_intro_to_ai.ipynb`):**
  - Integrated **Allosaurus** to parse raw `.mp3` audio of 5 concrete Level 0 vocabulary anchors (*cat, dog, walk, jump, tree*) into timestamped phone sequences, mapping them strictly on the backend to broad acoustic categories (`consonant` vs. `vowel`) with zero IPA text exposed to the UI[cite: 6].
  - Implemented **Librosa & SciPy** RMS energy peak segmentation to slice words into syllable segments and compute proportional visual duration widths (`width_px`).
  - Integrated **TorchCREPE** to extract fundamental frequency ($F_0$) contours and synthesize stripped vocal humming tracks (`_hum.wav`) gated by voicing periodicity and speech energy[cite: 6].
  - Automated packaging of `lesson_data.json` and sliced audio assets into `gll_update1_assets.zip`.
- **Zero-Text, Audio-First Frontend (`index.html`, `style.css`, `script.js`):**
  - Built a 3-card interactive sensory carousel pairing concrete visuals (`images/visuals/`) with immediate audio-first playback triggers (`full_audio_url`), eliminating L1 translations and written scripts[cite: 6].
  - Built a descriptive acoustic breakdown timeline using abstract botanical symbols: terracotta circles (`●`) for consonants, moss-green triangles (`▲`) for vowels, width-scaled bars for syllable cadence, and neutral tone badges linked to stripped humming audio[cite: 6].

## What Worked
- **End-to-End JSON & Web Audio Pipeline:** Exporting `lesson_data.json` directly from Colab into the frontend dynamically populates the carousel cards, shape counts, syllable widths, and per-segment Web Audio playback.
- **Zero-Text Ear Training UX:** Stripping graphemes, IPA labels, and directional pitch arrows keeps learner focus on pure auditory discrimination and concrete visual anchoring[cite: 6].

## Needs Improvement
- **Isolated Stop Consonant Clipping:** Slicing raw waveforms on short single-syllable words (e.g., `/k/` and `/t/` in *cat*) cuts into coarticulation transitions, while external IPA recordings (Wikimedia Commons) use intervocalic chanting (*"ga-a-ga"*) and lack target-language oral posture.
- **Cross-Linguistic & Diagnostic Scope:** Current baseline covers 5 isolated English words; needs forced alignment (`MMS_FA` / MFA), cross-linguistic tonal data (Mandarin/Taiwanese Hokkien), and interactive perception/production diagnostics[cite: 6].