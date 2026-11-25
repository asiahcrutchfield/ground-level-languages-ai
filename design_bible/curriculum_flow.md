# Curriculum Flow

This file explains the order of screens in Ground Level Languages (`index.html`, `style.css`, and `script.js`). For theory, see [`academic_proposal.md`](academic_proposal.md). For visual rules, see [`design_philosophy.md`](design_philosophy.md).

## Level 0 Lesson Flow

```text
┌─────────────────────────┐
│ 1. Story Preview        │  #story-primer
└────────────┬────────────┘
             │ tap through 3 obscured cards
             ▼
┌─────────────────────────┐
│ 2. Vocabulary           │  #vocab-stage
└────────────┬────────────┘
             │ explore 3 words
             ▼
┌─────────────────────────┐
│ 3. Story Player         │  #story-stage
└────────────┬────────────┘
             │ tap through story scenes
             ▼
┌─────────────────────────┐
│ 4. Listening Test       │  #listening-test
└────────────┬────────────┘
             │ finish 3 trials
             ▼
┌─────────────────────────┐
│ 5. Pronunciation Test   │  #pronunciation-test
└────────────┬────────────┘
             │ finish 2 recordings
             ▼
┌─────────────────────────┐
│ 6. Review               │  #test-review-wrapper
└────────────┬────────────┘
             │ continue
             ▼
┌─────────────────────────┐     restart lesson
│ 7. Diagnostic           │ ─────────────────────▶ Story Preview
└─────────────────────────┘  #diagnostic-stage
```

The lesson follows this 7-step order: **Story Preview → Vocabulary → Story Player → Listening Test → Pronunciation Test → Review → Diagnostic**.

* **Stage dots:** The floating dots on the right let the team jump directly to any screen during testing. They skip the normal unlock rules.
* **Main Menu (`#main-menu`):** A language menu is planned to organize modules. Update #3 only includes English.

---

## What Happens on Each Screen

| Step & Screen ID | What the user does | How to move to the next step | Data saved in browser memory |
| :--- | :--- | :--- | :--- |
| **1. Story Preview**<br>`#story-primer` | Taps through the story carousel just like Vocabulary, but the cards are covered by a translucent pond veil so the user gets curious about the story. | View at least **3 preview cards** to unlock the forward button to `#vocab-stage`. | Tracks which preview cards were viewed (`previewedScenes`). No score is kept. |
| **2. Vocabulary**<br>`#vocab-stage` | Listens to 5 words (*cat, dog, walk, jump, tree*) and taps their phoneme, syllable, and humming shapes. | Explore at least **3 words** to unlock the forward button to `#story-stage`. | Saves explored word IDs (`exploredWords`) and the current word index. |
| **3. Story Player**<br>`#story-stage` | Taps through the clear, uncovered story picture cards and listens to the short story sentences in context. | View through the story cards to unlock the forward button to `#listening-test`. | Tracks the current scene index (`storyIndex`). |
| **4. Listening Test**<br>`#listening-test` | Hears a target word, taps the left or right shape to preview the two choices, and presses the check button to answer. | Complete **3 trials** to move automatically to `#pronunciation-test`. | Saves right/wrong answers and reaction time in milliseconds (`hearingResults`). |
| **5. Pronunciation Test**<br>`#pronunciation-test` | Listens to the target word and records their voice (stops when pressed again or after 3.5 seconds). | Complete **2 recordings** to move automatically to `#test-review-wrapper`. | Saves audio recordings, waveform bars, and match scores (`userRecordings`, `pronunciationScores`). |
| **6. Review**<br>`#test-review-wrapper` | Replays their recording next to the native target sound and sees a match badge in the middle. | Tap the forward button to open `#diagnostic-stage`. | Uses the active word's recording (or a mock audio sample if no mic recording exists). |
| **7. Diagnostic**<br>`#diagnostic-stage` | Looks at the listening bar (left) and pronunciation bar (right) next to the center mountain icon. | Tap the restart button to go back to `#story-primer`. | Shows averages from the current session. Nothing is saved after closing the page. |

---

## How Data & Scoring Work

* **No Live Server:** Everything in the web app runs in the browser using `lesson_data.json`, `assessment_data.json`, and `story_data.json` (plus built-in fallback data in `script.js`). No recordings or scores are sent to a server.
* **Offline Audio Prep (`gll_intro_to_ai.ipynb`):** Our Colab notebook prepares the audio clips ahead of time (`MMS_FA` for phoneme slices, `Librosa`/`SciPy` for syllables, and `TorchCREPE` for humming tracks). It is not called live by the website.
* **Listening Score:** `correct_trials / 3`. Reaction speed is saved in memory, but it does not change the visual bar height.
* **Pronunciation Match:** The browser turns the user's mic audio into 28 volume bars and compares them to the target audio's 28 bars. A match score of **0.82 or higher** shows the green checkmark badge in Review.

---

## Zero-Text Design Rules

1. **No Text on Screen:** Never show written target words, translations, IPA symbols, or score numbers to the learner.
2. **Shapes & Audio First:** Use pictures, colors, shapes (circle = consonant, triangle = vowel), and sound waves instead of text instructions.
3. **Calm Feedback:** Use gentle colors and shapes instead of harsh red `X` marks or point counters.