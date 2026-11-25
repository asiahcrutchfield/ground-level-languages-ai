# Technical Explanations

## Audio & AI Pipeline (`gll_intro_to_ai.ipynb` -> `lesson_data.json`)
- **Forced Phoneme Alignment (`Torchaudio MMS_FA` + `WORD_PHONEME_LEXICON`):** Aligns each word's native audio to its target phoneme sequence (`WORD_PHONEME_LEXICON`) with millisecond precision to create time-aligned phoneme slices (`_p1.wav`, `_p2.wav`, etc.) without showing any written text or IPA symbols on screen.
- **Reference Phoneme Clips (Oxford IPA Audio Collection):** Downloads clean, isolated phoneme audio files (`audio/phonemes/*.wav` from the Oxford phoneme audio collection) and pairs each sound in the word with its corresponding visual shape (`consonant` = terracotta circle `●`, `vowel` = moss-green triangle `▲`).
- **Syllable Timing (`Librosa` & `SciPy`):** Uses audio trimming and energy-peak detection to find where each syllable starts and ends so the app can play single syllables (`_s1.wav`) and size the syllable bars (`width_px`) to match how long they sound.
- **Tone & Humming (`TorchCREPE`):** Estimates voice pitch (fundamental frequency, $F_0$) and voicing confidence to create a simplified humming-only audio track (`_hum.wav`) and classify tone movement (`solid`, `ring`, `dot`) so users can hear the melody of a word without consonants or vowels getting in the way.

---

## Assessments

### Listening Assessment (`#listening-test`)

#### Purpose & Goal
- **Purpose:** Checks if a user can accurately hear the difference between sounds, words, phrases, or tones without reading any text.
- **Goal:** Shows one audio-only question (`.listening-question`) and two audio-only choices (`.listening-choice`, `.choice-1`, `.choice-2`) loaded from `assessment_data.json`. For this prototype, questions use target words paired with minimal-pair distractors (`audio/test_bank/distractors/`). On the backend, the system records two hidden scores (never shown as numbers on screen):
  - **Accuracy:** Whether the user picked the choice that matches the target audio.
  - **Reaction Speed (`ms`):** How fast the user answered after hearing the prompt, which helps show if they are processing sounds naturally in real time.
- **Example:** The question plays the *ae* sound from *cat* (or the target word *cat*). The two choices play *cat* and *cot*. If the user picks *cat*, the backend marks it as accurate and tracks which sounds the user still struggles to hear.

### Pronunciation Assessment (`#pronunciation-test`)

#### Purpose & Goal
- **Purpose:** Checks if a user can accurately say a sound, word, or phrase out loud.
- **Goal:** Takes the user's voice recording (`.wav`)—or a pre-recorded sample from `audio/test_bank/mock_attempts/` when testing without a microphone—and compares it against the native target audio (`#pronunciation-target`) using `MMS_FA` phoneme alignment and `TorchCREPE` pitch contours. Only words or sounds from the current vocabulary or story section are used. The AI outputs hidden backend scores that:
  - Measure how closely the user's speech and pitch match the target.
  - **Pinpoint exact sound errors:** Find *which specific sound* inside the word was off (for example, the middle vowel) so the app can highlight that shape later without using text or IPA.
- **Example:** The target sound is *cat*, but the user says *cot*. The AI detects that the first and last sounds match, while the middle vowel sound diverged.

---

### Review Section (`#test-review-wrapper`)

#### Purpose & Goal
- **Purpose:** After finishing the listening and pronunciation tests, users see a 3-column screen to compare their answers against the target sounds:
  - **Column 1 (`#user-review-column`):** A list of all the user's recorded answers or chosen sounds (`#user-review-item`).
  - **Column 2 (`#results-review-column`):** A visual status badge (`#results-badge`) for each row—such as a green check (`✔️`) when the sound matches, or a gentle colored ring pulse when a sound needs practice (avoiding harsh red `❌` marks to keep stress low, per `design_philosophy.md`). Future updates may replace this with a smooth match meter instead of a simple yes/no badge.
  - **Column 3 (`#target-review-column`):** A list of all the native target sounds, words, or phrases (`#target-review-item`) the user was measured against.
  - Each row lines up **1 user answer**, **1 result badge**, and **1 target sound**.
- **Goal:** Lets the user tap and replay their own recording right next to the native target so they can hear where to improve.
- **Example:** A row shows the user's recorded waveform (`#user-review-item`) on the left, the native target waveform (`#target-review-item`) on the right, and a results badge (`#results-badge`) in the middle showing whether they matched.

---

### Diagnostic Section (`#diagnostic-stage`)

#### Purpose & Goal
- **Purpose:** Gives users a simple visual picture of their current language ability compared to a native speaker (represented by the center mountain/triangle symbol). Right now, the left bar (`#hearing-progress-fill`) shows **listening ability** and the right bar (`#pronunciation-progress-fill`) shows **pronunciation ability**.
- **Goal:** Helps users see at a glance whether they need more ear training (listening) or more speaking practice (pronunciation) without showing text or percentage numbers.
- **Example:** If the left hearing bar is filled high (around 80%) and the right pronunciation bar is lower (around 40%), the user can immediately tell that their ears hear the sounds well, so they should focus on speaking practice.

---

## Current Implementation Notes: Runtime and Scoring

The preceding sections describe the project's technical goals. This section records what currently runs in the browser so the design intent is not mistaken for an implemented backend feature.

### Browser Runtime vs. Offline Preparation

The frontend is plain HTML, CSS, and JavaScript. On startup, `script.js` renders embedded fallback vocabulary, then asynchronously fetches `lesson_data.json` and `assessment_data.json`. It plays local audio, captures microphone input, decodes audio with Web Audio, and calculates assessment values in JavaScript.

There is **no live backend server, model API, learner account, or persistent score store** in the current app. Results, response times, recordings, and derived peaks stay in page memory. Recordings are not sent to a server.

[`gll_intro_to_ai.ipynb`](../gll_intro_to_ai.ipynb) is a separate offline Colab pipeline that prepares static lesson assets; the website does not call its models at runtime, and they do not score learner recordings:

- **Torchaudio MMS_FA** aligns native lesson-word audio to the canonical `WORD_PHONEME_LEXICON`. The notebook writes word-specific phoneme slices when alignment succeeds, with a proportional-duration fallback. Where a lexicon entry defines `ref_audio`, the generated lesson manifest points to that reference clip for playback instead of the in-word slice.
- **Isolated phoneme clips:** The notebook labels its source as an Oxford phoneme collection and downloads audio from the GitHub-hosted `xiaozhah/phoneme_audio` repository, converting it to 16 kHz mono WAV under `audio/phonemes/`.
- **Librosa and SciPy** trim and analyze word audio. RMS energy and SciPy `find_peaks` estimate syllable boundaries; these are signal-processing tools, not separate recognition models.
- **TorchCREPE** estimates fundamental frequency (`F₀`) and voicing periodicity on lesson audio. The notebook uses these to synthesize humming tracks and classify simplified pitch movement. It does not analyze learner audio in the browser.
- **SoundFile, NumPy, and PyTorch** support WAV I/O, numerical operations, and model execution in the notebook.

### Stage Navigation & Flow Control (`.stage-nav`)

The floating vertical navigation bar (`.stage-nav` in `index.html`) renders zero-text botanical dots (`.stage-nav-dot`) mapped via `data-target` attributes to individual stage IDs (`vocab-stage`, `listening-test`, `pronunciation-test`, `test-review-wrapper`, `diagnostic-stage`, plus `story-primer` and `story-stage` in Update #3).

- **Direct-Jump Testing Override:** In `script.js`, `setupStageNav()` attaches click listeners to every `.stage-nav-dot` that call `goToStage(dot.dataset.target)` directly. Clicking a dot bypasses the guided lesson sequence and its unlock conditions (such as viewing 3 story preview cards or exploring 3 vocabulary words before advancing).
- **Purpose:** Direct dot navigation is retained intentionally as a demo and QA affordance so presenters and developers can inspect any stage immediately without completing prior steps.
- **State Fallbacks When Bypassing Stages:** If a user jumps directly to an assessment stage before exploring vocabulary items, `startListeningRound()` and `startPronunciationRound()` fall back to the default `VOCAB` array order (first 3 words for listening, first 2 for pronunciation) instead of `exploredWords`. Jumping directly to `#test-review-wrapper` without a live recording falls back to `mock_attempt_audio_url` from `assessment_data.json`, and `#diagnostic-stage` renders `0%` bars if `hearingResults` or `pronunciationScores` are empty.

### Listening Score and Response Time

For each trial, the target option uses the lesson item's `full_audio_url`; the foil uses the distractor path from `assessment_data.json`. The choices are randomly placed left/right. A tap previews and selects an option; the separate check control submits it.

```text
listening_accuracy = correct_trials / number_of_submitted_trials
```

The guided round has 3 trials, so its completed score is `correct_trials / 3`. A choice is correct when its ID and side both match the target. JavaScript stores correctness and response latency in milliseconds in `hearingResults`. Latency runs from the current prompt start to submission; replaying the prompt resets its start time. Latency does not change the diagnostic bar height. If the assessment manifest has not loaded or a word has no assessment entry, the code can fall back to another lesson word as the foil.

### Pronunciation Similarity

The current frontend uses a waveform-envelope proxy. It does **not** run forced alignment, phoneme recognition, or pitch scoring on learner recordings.

1. On recording stop, Web Audio decodes the microphone audio, resamples it to **16 kHz mono**, and JavaScript encodes a 16-bit PCM WAV Blob.
2. It extracts **28 normalized waveform-envelope peaks** from the user recording and target audio. Each peak is the maximum absolute sample amplitude in one temporal chunk, normalized by the largest peak; values have a `0.14` minimum floor for display and comparison.
3. It computes mean absolute difference and converts that to similarity:

   ```text
   difference = (1 / 28) × Σ |user_peak[i] − target_peak[i]|
   similarity = max(0, 1 − difference)
   ```

4. Similarity **≥ 0.82** triggers the positive Review badge. The Diagnostic pronunciation bar displays the mean similarity across the two recorded attempts in the round.

This compares coarse timing and amplitude envelopes. It cannot verify that the right phonemes were spoken, localize a substitution, or accurately evaluate pitch. A high value should not be interpreted as validated pronunciation accuracy.

### Mock Attempts, Aggregation, and Persistence

Pronunciation entries in `assessment_data.json` reference prerecorded samples in `audio/test_bank/mock_attempts/`. If no live recording exists for the active word, JavaScript can use the mock audio to populate the practice/review waveform and preview badge, and can play it from the practice replay control. Mock similarities are **not** appended to `pronunciationScores`, so they do not contribute to the completed recorded-pronunciation average.

The Diagnostic hearing bar uses the fraction of correct entries in `hearingResults`; its pronunciation bar uses the arithmetic mean of `pronunciationScores`. Values are rendered as visual fills, without numeric text. Both arrays are in-memory only and reset when rounds are initialized or the lesson is restarted.

Sub-word error localization and learner-specific pitch analysis remain future capabilities. They would require separately implemented and validated server-side processing; they are not provided by the current app.