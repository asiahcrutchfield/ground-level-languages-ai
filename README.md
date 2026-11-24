# Ground Level Languages (GLL)

Acoustic-first, zero-literacy AI prototype for adult second language acquisition using Allosaurus, MFA, and CREPE pitch tracking.

Ground Level Languages is a research prototype built on one idea: adult learners struggle mostly because their first language (L1) filters what they hear, not because they can't read the new language. GLL trains listening first, with no written text in the interface at all.

## Core principles

- **Zero text, zero graphemes, zero IPA.** No written words, translations, romanization, target scripts or phonetic symbols anywhere in the UI.
- **Descriptive, not prescriptive.** The interface reflects how native speakers actually talk (slurring, dropped syllables, tone sandhi) and uses abstract visual categories instead of tone marks, arrows or scores.
- **Perception before production.** Listening and binary sound discrimination come before any speaking.
- **Radical simplicity.** Only a few interactive elements per screen, and every visible element makes a sound when tapped.

The full reasoning is in [`design_bible/design_philosophy.md`](design_bible/design_philosophy.md) and [`design_bible/academic_proposal.md`](design_bible/academic_proposal.md).

## What's in the prototype

A zero-text vocabulary demo. A picture carousel shows a word, and the learner can listen to it at three levels:

- **Phonemes:** the individual sounds of the word.
- **Syllables:** the word cut into audio slices.
- **Tones:** a hummed version that keeps only the pitch contour.

There is also a **listening test**: the learner hears a sound pair (e.g. tree / three, jump / dump) and picks the matching picture, with a review at the end. This is the binary sound discrimination the design philosophy calls for.

## Planned speech-analysis stack

| Tool | Purpose |
| --- | --- |
| [Allosaurus](https://github.com/xinjli/allosaurus) | Universal phoneme recognition |
| [MFA (Montreal Forced Aligner)](https://montreal-forced-aligner.readthedocs.io/) | Aligning audio to phonemes and syllables |
| [CREPE](https://github.com/marl/crepe) | Pitch (F0) tracking for tones |

The analysis pipeline is explored in [`gll_intro_to_ai.ipynb`](gll_intro_to_ai.ipynb). The web front end does not call these tools yet.

## Running it

It's a static site with no build step. Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

If `lesson_data.json` is empty or can't be loaded, `script.js` falls back to built-in sample data (cat, dog, tree, walk, jump, work, cut, dug).

## Repository layout

```
index.html            Page markup (vocab stage, carousel, category switcher)
style.css             Styles (earthy botanical palette)
script.js             Carousel and audio logic, with fallback lesson data
lesson_data.json      Lesson content (currently empty)
audio/                Full-word mp3s; phonemes/, slices/ and listening/ subfolders
images/               symbols/ and visuals/
gll_intro_to_ai.ipynb Notebook for the AI/speech-analysis side
design_bible/         Design philosophy and academic proposal
updates/              Team progress reports (update_1 ... update_6)
```

## Status

Early prototype. The front-end demo works; the AI speech-analysis integration is still in progress.

## Team

Asiah Crutchfield (researcher), Moa, Yuka, Aziz.
