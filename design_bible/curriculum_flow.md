# Curriculum Flow

This document describes the learner-facing sequence currently implemented in `index.html`, `style.css`, and `script.js`. It is the operational companion to the learning rationale in [`academic_proposal.md`](academic_proposal.md) and the visual and interaction rules in [`design_philosophy.md`](design_philosophy.md).

## Level 0 Guided Path

```text
┌─────────────────────┐
│ 1. Vocabulary       │
└──────────┬──────────┘
           │ explore 3 words
           ▼
┌─────────────────────┐
│ 2. Listening Test   │
└──────────┬──────────┘
           │ finish 3 trials
           ▼
┌─────────────────────┐
│ 3. Pronunciation    │
└──────────┬──────────┘
           │ finish 2 recordings
           ▼
┌─────────────────────┐
│ 4. Review           │
└──────────┬──────────┘
           │ continue
           ▼
┌─────────────────────┐     restart lesson
│ 5. Diagnostic       │ ─────────────────────▶ Vocabulary
└─────────────────────┘
```

The intended guided sequence is **Vocabulary → Listening Test → Pronunciation Test → Review → Diagnostic**. The floating stage dots also allow direct navigation to any stage; they do not enforce the guided sequence or its unlock conditions.

## Stage-by-Stage Behavior

| Stage / DOM ID | Learner action | Unlock or transition trigger | Telemetry or state held in memory |
| --- | --- | --- | --- |
| **1. Vocabulary Primer** `#vocab-stage` | Hear a concrete word, rotate through the word set, and play its phoneme, syllable, or humming breakdown. | Exploring at least 3 distinct words unlocks the forward button. It advances to `#listening-test`. | Explored word IDs (`exploredWords`) and current vocabulary index. No score is calculated here. |
| **2. Listening Assessment** `#listening-test` | Hear the target prompt. Tap a shape to preview its audio; choose either shape and press the check control to submit. Choices can be changed before submission. | The round has 3 trials. After the third answer, the app advances to `#pronunciation-test`. | Per-trial correctness and response latency in milliseconds (`hearingResults`). |
| **3. Pronunciation Assessment** `#pronunciation-test` | Hear the native target, record the word, and stop manually or let the recording reach its 3.5-second limit. | The round uses 2 words. After 2 recordings are processed, the app advances to `#test-review-wrapper`. | In-memory recordings, waveform data, and similarity values (`userRecordings`, `pronunciationScores`). |
| **4. Side-by-Side Review** `#test-review-wrapper` | Replay the target and attempt audio and view the central visual badge. | The forward arrow advances to `#diagnostic-stage`. | Active word and its available target/attempt waveform comparison. A mock attempt supplies a preview if no live recording exists for that word. |
| **5. Diagnostic Summary** `#diagnostic-stage` | View the visual listening and pronunciation progress indicators around the mountain benchmark. | The restart control returns to `#vocab-stage`. | Summary values are derived from the current in-memory assessment results; no results are saved between sessions. |

## Assessment Population

The lesson manifest, [`lesson_data.json`](../lesson_data.json), defines the five Level 0 words and their audio, visual, phoneme, syllable, and tone entries. An embedded fallback word bank in `script.js` allows the interface to render if that manifest cannot be fetched.

The assessment manifest, [`assessment_data.json`](../assessment_data.json), maps each listening target to one target-word recording and one minimal-pair distractor from `audio/test_bank/distractors/`. The browser shuffles their left/right positions per trial. Pronunciation entries map a word to its target phoneme IDs and a mock attempt from `audio/test_bank/mock_attempts/`.

For the listening round, the current implementation uses the first 3 explored word IDs when at least 3 have been explored; otherwise it uses the first 3 lesson words. For pronunciation, it uses the first 2 explored IDs when available; otherwise it uses the first 2 lesson words. These selections follow the order in which IDs enter the explored-word set, rather than being random samples. The prompt plays automatically at the start of each listening trial and can be replayed. The response timer starts at trial setup and resets when the prompt is replayed.

## Zero-Text Interaction Rules

- Use audio, abstract shapes, waveform bars, color, and spatial placement to carry the interaction; do not show written target words, translations, IPA, or numeric scores in the learner interface.
- Consonant and vowel shapes are categorical anchors, not written pronunciations. Syllable bars reflect duration; tone badges and humming provide an additional acoustic view.
- Listening answers use two previews followed by a separate check action, so learners can hear either choice before committing.
- Review and diagnostic outcomes remain visual and low-pressure, consistent with [`design_philosophy.md`](design_philosophy.md).

## Session Boundary

This is a Level 0 vocabulary and sound-discrimination module. It runs as a client-side web app and does not currently connect the stages to a persistent learner account or a server-side assessment service. The browser’s score calculations and the separate Colab asset-preparation pipeline are described in [`technical_explanations.md`](technical_explanations.md).

## Extending the Curriculum

The academic proposal describes extending this primer into animal-perspective graded story modules. A future story sequence can add a **Story Preview → Vocabulary Primer → Audio Story → Listening/Pronunciation Checks → Review → Diagnostic** arc. Each module can introduce a small set of concrete vocabulary anchors, reinforce earlier sounds, and use controlled repetition within an audio-first narrative. See the story framework and modular progression in [`academic_proposal.md`](academic_proposal.md).
