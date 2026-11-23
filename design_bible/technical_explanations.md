# Technical Explanations

## Audio & AI Pipeline (`gll_intro_to_ai.ipynb` -> `lesson_data.json`)
- **Phone Detection (`Allosaurus`):** Listens to native audio and breaks words down into individual speech sounds without showing any written text or IPA symbols on screen. Each sound is grouped into a simple shape category (`consonant` = terracotta circle `●`, `vowel` = moss-green triangle `▲`) and paired with a clear reference sound.
- **Syllable Timing (`MMS_FA` / Energy Peaks):** Finds where each syllable starts and ends so the app can play single syllables and size the syllable bars (`width_px`) to match how long they sound.
- **Tone & Humming (`TorchCREPE`):** Tracks voice pitch ($F_0$) and creates a humming-only audio track (`_hum.wav`) so users can hear the melody of a word without consonants or vowels getting in the way.

---

## Assessments

### Listening Assessment (`#listening-test`)

#### Purpose & Goal
- **Purpose:** Checks if a user can accurately hear the difference between sounds, words, phrases or tones without reading any text.
- **Goal:** Shows one audio-only question (`.listening-question`) and two audio-only choices (`.listening-choice`, `.choice-1`, `.choice-2`). For this prototype, questions use minimal pairs or words from the current vocabulary/story section. On the backend, the AI records two hidden scores (never shown as numbers on screen):
  - **Accuracy:** Whether the user picked the choice that matches the question audio.
  - **Reaction Speed (`ms`):** How fast the user answered after hearing the prompt, which helps show if they are processing sounds naturally in real time.
- **Example:** The question plays the *ae* sound from *cat*. The two choices play *cat* and *cot*. If the user picks *cat*, the backend marks it as accurate and tracks which sounds the user still struggles to hear.

### Pronunciation Assessment (`#pronunciation-test`)

#### Purpose & Goal
- **Purpose:** Checks if a user can accurately say a sound, word, or phrase out loud.
- **Goal:** Takes the user's voice recording (`.wav`) and compares it against the native target audio (`#pronunciation-target`) using an AI model (`Wav2Vec2-XLSR-53` / `TorchCREPE`). Only words or sounds from the current vocabulary or story section are used. The AI outputs hidden backend scores that:
  - Measure how closely the user's speech and pitch match the target.
  - **Pinpoint exact sound errors:** Find *which specific sound* inside the word was off (for example, the middle vowel) so the app can highlight that shape later without using text or IPA.
- **Example:** The target sound is *cat*, but the user says *cot*. The AI detects that the first and last sounds match, while the middle vowel sound diverged.

---

### Review Section (`#test-review-wrapper`)

#### Purpose & Goal
- **Purpose:** After finishing the listening and pronunciation tests, users see a 3-column screen to compare their answers against the target sounds:
  - **Column 1 (`#user-review-column`):** A list of all the user's recorded answers or chosen sounds (`#user-review-item`).
  - **Column 2 (`#results-review-column`):** A visual status badge (`#results-badge`) for each row—such as a green check (`✔️`) when the sound matches, or a gentle colored ring pulse when a sound needs practice (avoiding harsh red `❌` marks to keep stress low, per `design_philosophy.md`). Future updates may replace this with a smooth match meter instead of a simple binary yes/no badge.
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