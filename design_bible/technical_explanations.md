# Technical Explanations

This document distinguishes the current browser implementation from the separate offline audio-preparation notebook and from future server-side analysis ideas. The learner-facing sequence is documented in [`curriculum_flow.md`](curriculum_flow.md).

## Runtime Architecture: Browser and Offline Pipeline

### Browser Runtime

The frontend is plain HTML, CSS, and JavaScript. On startup, `script.js` renders its embedded fallback vocabulary, then asynchronously fetches `lesson_data.json` and `assessment_data.json`. It plays local audio assets, captures microphone audio with the browser's media APIs, decodes audio with Web Audio, and calculates the assessment values in JavaScript.

There is **no live backend server, model API, learner account, or persistent score store** in the current app. Assessment results, response times, recordings, and derived peaks are held in page memory. Recordings are not sent to a server by this implementation.

### Offline Colab Asset Preparation

[`gll_intro_to_ai.ipynb`](../gll_intro_to_ai.ipynb) is a separate Python pipeline for preparing lesson assets. It processes the native word recordings and writes a static `lesson_data.json` plus derived audio files. The website does not invoke these models at runtime, and they do not score learner microphone recordings.

- **Torchaudio MMS_FA:** The notebook loads the MMS_FA forced-alignment bundle and aligns the word recording against the canonical `WORD_PHONEME_LEXICON`. It writes word-specific phoneme slices when alignment succeeds, with a proportional-duration fallback if alignment fails. The manifest output prefers a lexicon entry's `ref_audio` path when one is defined, so the frontend can play isolated reference phonemes instead of the generated in-word slice for those entries.
- **Oxford-labelled isolated phoneme collection:** The notebook downloads isolated phoneme audio from the GitHub-hosted `xiaozhah/phoneme_audio` repository, converts the clips to 16 kHz mono WAV, and stores them under `audio/phonemes/`. The notebook labels this set as Oxford phoneme audio.
- **Librosa and SciPy:** Librosa loads/resamples and trims word audio, computes RMS energy, and supports syllable-duration slicing. SciPy's `find_peaks` detects energy peaks used to estimate syllable boundaries. These are signal-processing steps, not separate trained recognition models.
- **TorchCREPE:** Estimates fundamental frequency (`F₀`) and voicing periodicity on the lesson audio. The notebook uses these signals to synthesize a humming track and classify simplified pitch movement. It does not analyze learner audio in the current browser app.
- **SoundFile / NumPy / PyTorch:** Support WAV I/O, numeric signal operations, and model tensor execution in the notebook.

## Listening Assessment Scoring

For each trial, JavaScript finds the assessment entry for the selected lesson word. The target option uses that lesson item's `full_audio_url`; the foil option uses the distractor `audio_url` in `assessment_data.json`. The two options are randomly placed on the left and right. The target prompt is played at trial start. Tapping a choice previews it and selects it; the separate check control submits the selected answer.

Let `correct_trials` be the number of submitted choices whose ID and side both match the target. The diagnostic hearing bar is:

```text
listening_accuracy = correct_trials / number_of_submitted_trials
```

The intended round has 3 trials, so once it is complete this is `correct_trials / 3`. The app stores each trial's correctness and response latency in milliseconds in the in-memory `hearingResults` array. Latency is measured from the current prompt start to submission; replaying the prompt resets the start time. Response latency is not used to change the diagnostic bar height.

If the assessment manifest has not loaded or an entry cannot be found, the listening code can fall back to another lesson word as the foil. The normal target/distractor mapping depends on `assessment_data.json` and its local audio assets being available.

## Pronunciation Similarity Scoring

The current frontend uses an acoustic waveform-envelope proxy; it does **not** run forced alignment, phoneme recognition, or pitch scoring on the learner's recording.

1. The browser records microphone input. When recording stops, Web Audio decodes it, resamples it to **16 kHz mono**, and JavaScript encodes a 16-bit PCM WAV Blob.
2. The browser divides the user recording and target word audio into **28 temporal chunks**. For each chunk it finds the maximum absolute sample amplitude. Each 28-value envelope is normalized by its maximum peak, with a minimum display value of `0.14` per bar.
3. It compares the two normalized arrays by mean absolute difference:

   ```text
   difference = (1 / 28) × Σ |user_peak[i] − target_peak[i]|
   similarity = max(0, 1 − difference)
   ```

4. A per-recording similarity of **0.82 or higher** produces the positive Review badge. The Diagnostic pronunciation bar uses the mean of the similarity scores for the **two recorded attempts** in the pronunciation round.

This proxy compares coarse timing and amplitude envelopes. It does not establish that the learner used the correct phonemes, distinguish a specific substitution (such as one vowel from another), or evaluate pitch accurately. A high similarity must not be interpreted as validated pronunciation accuracy.

### Mock Attempt Behavior

Each pronunciation entry in `assessment_data.json` points to a prerecorded sample in `audio/test_bank/mock_attempts/`. When no live recording exists for the active word, the app can load that sample's peaks to populate the practice/review waveform and update the preview badge. It can also play the mock clip when the learner activates the practice replay control. Mock similarities are not appended to `pronunciationScores` and therefore do not contribute to the completed round's recorded-pronunciation average.

## Diagnostic Aggregation and Persistence

The final diagnostic calculates listening accuracy from the `correct` flags in `hearingResults`. It calculates pronunciation similarity as the arithmetic mean of values in `pronunciationScores`. These values are rendered as visual bar fills and indicators; numeric scores are not printed in the UI. Both arrays exist only in page memory and are reset when the lesson flow is restarted or a new assessment round is initialized.

## Future Server-Side Analysis

Sub-word error localization and learner-specific pitch analysis are future capabilities, not current features. A later backend could process uploaded or consented learner recordings with forced alignment and pitch tracking, associate detected differences with the relevant phoneme IDs, and return visual feedback without exposing IPA or numeric scores in the learner interface. Such a service would require a separately implemented and validated recording-upload, privacy, and scoring workflow.
