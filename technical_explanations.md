# Technical Explanations

## Assessments

### Listening Assessment (#listening-test)

#### Purpose & Goal
- Purpose: This section assesses a user's ability to accurately perceive a sound, word, or phrase auditorily. 
- Goal: This section contains a single audio-only question (.listening-question) and 2 audio-only choices (.listening-choice .choice-1 .choice-2). For this current prototype, questions can be minimal pair questions. The output should be a score (backend only) that will be used in assessing how good the user's listening ability is in their target language using an AI model. Only sounds, words, or phrases from the current story or vocabulary section should be used as questions.
- Example: Question is *ae* as in the sound that appears in *cat*. Choices can be *cat* or *cot*. The AI model will score accordingly depending on whether the user chose the answer that contained the question audio.

### Pronunciation Assessment (#pronunciation-test)

#### Purpose & Goal
- Purpose: This section assesses a user's ability to accurately reproduce a sound, word, or phrase verbally. 
- Goal: This section should take the voice recording of the user as input and test it against the audio of the pronunciation target (#pronunciation-target). It should output a score (backend only) that will be used in assessing how good the user's pronunciation ability is in their target language using an AI model. Only sounds, words, or phrases from the current story or vocabulary section should be used as questions.
- Example: Target sound is *cat* but user says *cot*. The AI model would score this accordingly.


### Review Section (#test-review-wrapper)

#### Purpose & Goal
- Purpose: After both listening and pronunciation sections are done, users will be taken to a screen to review their answers. It consists of 3 columns. Column 1 (#user-review-column) is a list of all the answers given by the user. Column 2 (#results-review-column) is a list of either a *check* (✔️) (or equivalent) or *x* (❌) (or equivalent) emoji or symbol to represent whether the answer was right or wrong. Column 3 (#target-review-column) is a list of all the questions/targets the user was being measured against. Future updates may change the result column into a range instead of a simple binary.

Each row should be 1 user answer, 1 result, and 1 question/target. The answer and the target on a given row should be related.
- Goal: This section is to allow the user to listen to their recordings and get itemized feedback in order to see where they can improve.
- Example: A user can see a row with their answer audio (#user-review-item) on the left and a the correct answer (#target-review-item) on the right. The middle contains a results badge (#results-badge) that indicates whether their answer matched the target.

### Diagnostic Section (#diagnostic-stage)

#### Purpose & Goal
- Purpose: This section gives users a visual representation of their current language ability in comparison to a native speaker in their target language (as represented by a triangle, mountain or another visual symbol). For now, it represents listening and pronunciation ability.
- Goal: To give users a quick overview of their current progress in various aspects of their L2 language ability.
- Example: A user can see at a glance a pronunciation bar that is 80% and a pronunciation bar that's at 40% so they can understand where they most likely should put their focus.