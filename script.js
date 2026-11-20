/**
 * Ground Level Languages — Zero-Text Vocabulary Prototype
 * script.js — AI pipeline audio & visuals with fallback resilience
 */

'use strict';

/* ============================================================
   1. BUILT-IN FALLBACK DATASET (5 words)
   Guarantees the UI is immediately fully interactive even if
   lesson_data.json is being generated, empty, or inaccessible.
   ============================================================ */
const FALLBACK_ITEMS = [
  {
    id: "cat",
    visual_url: "images/visuals/cat.jpg",
    full_audio_url: "audio/cat.mp3",
    humming_audio_url: "audio/slices/cat_hum.wav",
    phonemes: [
      { id: "cat_p1", kind: "consonant", audio_url: "audio/phonemes/k.wav" },
      { id: "cat_p2", kind: "vowel",     audio_url: "audio/phonemes/ae.wav" },
      { id: "cat_p3", kind: "consonant", audio_url: "audio/phonemes/t.wav" }
    ],
    syllables: [
      { id: "cat_s1", width_px: 100, audio_url: "audio/slices/cat_s1.wav" }
    ],
    tones: [
      { id: "cat_t1", style: "ring", audio_url: "audio/slices/cat_hum.wav" }
    ]
  },
  {
    id: "dog",
    visual_url: "images/visuals/dog.jpg",
    full_audio_url: "audio/dog.mp3",
    humming_audio_url: "audio/slices/dog_hum.wav",
    phonemes: [
      { id: "dog_p1", kind: "consonant", audio_url: "audio/phonemes/d.wav" },
      { id: "dog_p2", kind: "vowel",     audio_url: "audio/phonemes/ao.wav" },
      { id: "dog_p3", kind: "consonant", audio_url: "audio/phonemes/g.wav" }
    ],
    syllables: [
      { id: "dog_s1", width_px: 115, audio_url: "audio/slices/dog_s1.wav" }
    ],
    tones: [
      { id: "dog_t1", style: "dot", audio_url: "audio/slices/dog_hum.wav" }
    ]
  },
  {
    id: "walk",
    visual_url: "images/visuals/walk.gif",
    full_audio_url: "audio/walk.mp3",
    humming_audio_url: "audio/slices/walk_hum.wav",
    phonemes: [
      { id: "walk_p1", kind: "consonant", audio_url: "audio/phonemes/w.wav" },
      { id: "walk_p2", kind: "vowel",     audio_url: "audio/phonemes/ao.wav" },
      { id: "walk_p3", kind: "consonant", audio_url: "audio/phonemes/k.wav" }
    ],
    syllables: [
      { id: "walk_s1", width_px: 127, audio_url: "audio/slices/walk_s1.wav" }
    ],
    tones: [
      { id: "walk_t1", style: "ring", audio_url: "audio/slices/walk_hum.wav" }
    ]
  },
  {
    id: "jump",
    visual_url: "images/visuals/jump.gif",
    full_audio_url: "audio/jump.mp3",
    humming_audio_url: "audio/slices/jump_hum.wav",
    phonemes: [
      { id: "jump_p1", kind: "consonant", audio_url: "audio/phonemes/dz.wav" },
      { id: "jump_p2", kind: "vowel",     audio_url: "audio/phonemes/ah.wav" },
      { id: "jump_p3", kind: "consonant", audio_url: "audio/phonemes/m.wav" },
      { id: "jump_p4", kind: "consonant", audio_url: "audio/phonemes/p.wav" }
    ],
    syllables: [
      { id: "jump_s1", width_px: 140, audio_url: "audio/slices/jump_s1.wav" }
    ],
    tones: [
      { id: "jump_t1", style: "solid", audio_url: "audio/slices/jump_hum.wav" }
    ]
  },
  {
    id: "tree",
    visual_url: "images/visuals/tree.jpg",
    full_audio_url: "audio/tree.mp3",
    humming_audio_url: "audio/slices/tree_hum.wav",
    phonemes: [
      { id: "tree_p1", kind: "consonant", audio_url: "audio/phonemes/t.wav" },
      { id: "tree_p2", kind: "consonant", audio_url: "audio/phonemes/r.wav" },
      { id: "tree_p3", kind: "vowel",     audio_url: "audio/phonemes/iy.wav" }
    ],
    syllables: [
      { id: "tree_s1", width_px: 105, audio_url: "audio/slices/tree_s1.wav" }
    ],
    tones: [
      { id: "tree_t1", style: "dot", audio_url: "audio/slices/tree_hum.wav" }
    ]
  }
];

/* ============================================================
   2. STATE
   ============================================================ */
let VOCAB          = FALLBACK_ITEMS;
let activeIndex    = 0;
let activeCategory = 'phoneme'; // 'phoneme' | 'syllable' | 'tone'
let currentAudio   = null;

/* ============================================================
   3. AUDIO PLAYBACK (Single audio bus, graceful error catch)
   ============================================================ */
function playAudio(url) {
  if (!url) return;

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  const audio = new Audio(url);
  currentAudio = audio;
  return audio.play().then(() => audio).catch((err) => {
    // Autoplay restrictions or missing clip logged without breaking UI
    console.warn(`Audio playback for "${url}":`, err.message || err);
  });
}

/* ============================================================
   4. INLINE SVG PLACEHOLDERS (Zero-Text Graceful Fallbacks)
   ============================================================ */
function getPlaceholderSVG(id) {
  const bg = '%23EFECE2';
  const green = '%232D6A4F';
  const terracotta = '%23C86D51';
  const moss = '%2352B788';
  const ochre = '%23E09F3E';

  if (id === 'cat') {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" rx="24" fill="${bg}"/><circle cx="100" cy="90" r="42" fill="${green}"/><polygon points="68,60 58,28 92,52" fill="${terracotta}"/><polygon points="132,60 142,28 108,52" fill="${terracotta}"/><ellipse cx="86" cy="88" rx="5" ry="7" fill="${bg}"/><ellipse cx="114" cy="88" rx="5" ry="7" fill="${bg}"/><polygon points="100,102 94,110 106,110" fill="${terracotta}"/><ellipse cx="100" cy="148" rx="56" ry="38" fill="${green}"/></svg>`;
  }
  if (id === 'dog') {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" rx="24" fill="${bg}"/><ellipse cx="100" cy="142" rx="58" ry="40" fill="${ochre}"/><circle cx="100" cy="86" r="40" fill="${ochre}"/><ellipse cx="62" cy="90" rx="12" ry="26" fill="${terracotta}" transform="rotate(15 62 90)"/><ellipse cx="138" cy="90" rx="12" ry="26" fill="${terracotta}" transform="rotate(-15 138 90)"/><ellipse cx="86" cy="82" rx="5" ry="6" fill="${bg}"/><ellipse cx="114" cy="82" rx="5" ry="6" fill="${bg}"/><ellipse cx="100" cy="98" rx="8" ry="6" fill="${green}"/></svg>`;
  }
  if (id === 'walk') {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" rx="24" fill="${bg}"/><circle cx="100" cy="52" r="20" fill="${green}"/><line x1="100" y1="72" x2="95" y2="120" stroke="${green}" stroke-width="12" stroke-linecap="round"/><line x1="95" y1="120" x2="72" y2="162" stroke="${green}" stroke-width="11" stroke-linecap="round"/><line x1="95" y1="120" x2="124" y2="158" stroke="${green}" stroke-width="11" stroke-linecap="round"/><line x1="98" y1="85" x2="74" y2="116" stroke="${green}" stroke-width="9" stroke-linecap="round"/><line x1="98" y1="85" x2="126" y2="108" stroke="${green}" stroke-width="9" stroke-linecap="round"/></svg>`;
  }
  if (id === 'jump') {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" rx="24" fill="${bg}"/><circle cx="100" cy="48" r="20" fill="${moss}"/><rect x="88" y="70" width="24" height="44" rx="8" fill="${moss}"/><line x1="88" y1="80" x2="56" y2="52" stroke="${moss}" stroke-width="10" stroke-linecap="round"/><line x1="112" y1="80" x2="144" y2="52" stroke="${moss}" stroke-width="10" stroke-linecap="round"/><line x1="92" y1="114" x2="66" y2="155" stroke="${moss}" stroke-width="10" stroke-linecap="round"/><line x1="108" y1="114" x2="134" y2="155" stroke="${moss}" stroke-width="10" stroke-linecap="round"/></svg>`;
  }
  if (id === 'tree') {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" rx="24" fill="${bg}"/><rect x="90" y="118" width="20" height="52" rx="4" fill="${terracotta}"/><circle cx="100" cy="80" r="42" fill="${green}"/><circle cx="78" cy="94" r="28" fill="${moss}"/><circle cx="122" cy="94" r="28" fill="${moss}"/></svg>`;
  }
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" rx="24" fill="${bg}"/><circle cx="100" cy="100" r="36" fill="${green}" opacity="0.3"/></svg>`;
}

/* ============================================================
   5. DOM REFERENCES
   ============================================================ */
const carousel      = document.getElementById('picture-carousel');
const cards         = Array.from(carousel.querySelectorAll('.carousel-card'));
const playBtn       = carousel.querySelector('.carousel-play-btn');

const catBtns       = Array.from(document.querySelectorAll('.breakdown-category'));

const phonemePanel  = document.getElementById('phoneme-panel');
const syllablePanel = document.getElementById('syllable-panel');
const tonePanel     = document.getElementById('tone-panel');

/* ============================================================
   6. CAROUSEL RENDERING
   ============================================================ */
function renderCarousel() {
  if (!VOCAB || VOCAB.length === 0) return;
  const total   = VOCAB.length;
  const prevIdx = (activeIndex - 1 + total) % total;
  const nextIdx = (activeIndex + 1) % total;

  const slots = [
    { el: cards[0], dataIdx: prevIdx,     cls: 'prev'   },
    { el: cards[1], dataIdx: activeIndex, cls: 'active' },
    { el: cards[2], dataIdx: nextIdx,     cls: 'next'   },
  ];

  slots.forEach(({ el, dataIdx, cls }) => {
    el.className     = `carousel-card ${cls}`;
    el.dataset.index = dataIdx;

    const word = VOCAB[dataIdx];
    const img  = el.querySelector('.carousel-pic');

    // Attach graceful fallback before assigning src
    img.onerror = function() {
      this.onerror = null; // prevent infinite loops
      this.src = getPlaceholderSVG(word.id);
    };

    if (word.visual_url) {
      img.src = word.visual_url;
    } else {
      img.src = getPlaceholderSVG(word.id);
    }
  });
}

/* ============================================================
   7. BREAKDOWN PANELS
   ============================================================ */
function consonantSVG() {
  return `<svg viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="17" cy="17" r="15" fill="#C86D51"/>
    <circle cx="17" cy="17" r="7"  fill="rgba(255,255,255,0.30)"/>
  </svg>`;
}

function vowelSVG() {
  return `<svg viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <polygon points="17,2 32,32 2,32" fill="#52B788"/>
    <polygon points="17,12 26,30 8,30" fill="rgba(255,255,255,0.30)"/>
  </svg>`;
}

function renderBreakdown() {
  if (!VOCAB || VOCAB.length === 0) return;
  const word = VOCAB[activeIndex];

  /* — Phoneme panel (consonant terracotta circles, vowel moss-green triangles) — */
  phonemePanel.innerHTML = '';
  (word.phonemes || []).forEach((ph) => {
    const li = document.createElement('li');
    li.className = `phoneme-item ${ph.kind}-item`;
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-label', `Play sound`);
    li.dataset.audioUrl = ph.audio_url || word.full_audio_url;
    li.innerHTML = ph.kind === 'consonant' ? consonantSVG() : vowelSVG();
    phonemePanel.appendChild(li);
  });

  /* — Syllable panel (ochre amber pill bars proportional to duration) — */
  syllablePanel.innerHTML = '';
  (word.syllables || []).forEach((syl) => {
    const li = document.createElement('li');
    li.className = 'category-item syllable-item';
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-label', 'Play syllable');
    li.dataset.audioUrl = syl.audio_url || word.full_audio_url;
    li.style.width = `${syl.width_px || 100}px`;
    syllablePanel.appendChild(li);
  });

  /* — Tone panel (river-teal badges: solid, ring, dot) — */
  tonePanel.innerHTML = '';
  (word.tones || []).forEach((tone) => {
    const li = document.createElement('li');
    const styleName = tone.style || 'ring';
    li.className = `category-item tone-item tone-${styleName}`;
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-label', 'Play tone');
    li.dataset.audioUrl = tone.audio_url || word.humming_audio_url || word.full_audio_url;
    tonePanel.appendChild(li);
  });
}

/* ============================================================
   8. CATEGORY SWITCHER
   ============================================================ */
function setActiveCategory(cat) {
  activeCategory = cat;

  catBtns.forEach((btn) => {
    const isActive = btn.dataset.category === cat;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  [phonemePanel, syllablePanel, tonePanel].forEach((p) =>
    p.classList.remove('active')
  );

  const panelMap = {
    phoneme:  phonemePanel,
    syllable: syllablePanel,
    tone:     tonePanel,
  };
  if (panelMap[cat]) panelMap[cat].classList.add('active');
}

/* ============================================================
   9. CAROUSEL ROTATION & AUDIO-FIRST FEEDBACK
   ============================================================ */
function rotateTo(newIndex) {
  activeIndex = (newIndex + VOCAB.length) % VOCAB.length;
  renderCarousel();
  renderBreakdown();
  // Audio-first rule: immediately trigger word audio on rotation
  playAudio(VOCAB[activeIndex].full_audio_url);
}

/* ============================================================
   10. INTERACTIVE EVENT HANDLERS
   ============================================================ */

/* Click prev/next card in carousel to rotate */
carousel.addEventListener('click', (e) => {
  if (e.target.closest('.carousel-play-btn')) return;
  const card = e.target.closest('.carousel-card');
  if (!card) return;
  if (card.classList.contains('prev')) rotateTo(activeIndex - 1);
  if (card.classList.contains('next')) rotateTo(activeIndex + 1);
});

/* Keyboard arrow / enter navigation on carousel */
carousel.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') rotateTo(activeIndex - 1);
  if (e.key === 'ArrowRight') rotateTo(activeIndex + 1);
  if (e.key === 'Enter' || e.key === ' ') {
    const card = e.target.closest('.carousel-card');
    if (!card) return;
    if (card.classList.contains('prev')) rotateTo(activeIndex - 1);
    if (card.classList.contains('next')) rotateTo(activeIndex + 1);
  }
});

/* Play button: replay active word without rotating */
playBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  playBtn.classList.add('playing');
  playAudio(VOCAB[activeIndex].full_audio_url);
  setTimeout(() => playBtn.classList.remove('playing'), 900);
});

/* Category buttons */
catBtns.forEach((btn) => {
  btn.addEventListener('click', () => setActiveCategory(btn.dataset.category));
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveCategory(btn.dataset.category);
    }
  });
});

/* Shape click listener & tactile bounce animation */
function attachShapeListeners(panel) {
  const triggerShape = (item) => {
    if (!item || !item.dataset.audioUrl) return;
    playAudio(item.dataset.audioUrl);
    item.classList.remove('popping');
    void item.offsetWidth; // force reflow
    item.classList.add('popping');
    item.addEventListener('animationend', () => item.classList.remove('popping'), { once: true });
  };

  panel.addEventListener('click', (e) => {
    const item = e.target.closest('[data-audio-url]');
    triggerShape(item);
  });

  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const item = e.target.closest('[data-audio-url]');
      triggerShape(item);
    }
  });
}

attachShapeListeners(phonemePanel);
attachShapeListeners(syllablePanel);
attachShapeListeners(tonePanel);

/* Listening assessment */
const listeningPairs = [
  ['cat', 'cut', 'vowel'],
  ['dog', 'dug', 'vowel'],
  ['tree', 'three', 'consonant', ['audio/listening/tree.wav', 'audio/listening/three.wav']],
  ['walk', 'work', 'vowel'],
  ['jump', 'dump', 'consonant', ['audio/listening/jump.wav', 'audio/listening/dump.wav']],
];
const vocabStage = document.getElementById('vocab-stage');
const assessmentStage = document.getElementById('assessment-stage');
const listeningTest = document.getElementById('listening-test');
const listeningPicture = document.getElementById('listening-picture');
const listeningPlay = document.getElementById('listening-play');
const listeningNext = document.getElementById('listening-next');
const listeningChoices = [...listeningTest.querySelectorAll('.listening-choice')];
const listeningReview = document.getElementById('test-review-wrapper');
const startListening = makeListeningButton('◉', 'Start listening test', beginListeningTest);
startListening.id = 'listening-start';
vocabStage.appendChild(startListening);

let listeningQueue = [];
let listeningIndex = 0;
let listeningTrial;
let listeningAnswers;
let listeningSessionId;

function makeListeningButton(symbol, label, action) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'listening-next';
  button.textContent = symbol;
  button.setAttribute('aria-label', label);
  button.addEventListener('click', action);
  return button;
}

function beginListeningTest() {
  currentAudio?.pause();
  listeningQueue = listeningPairs.map(([targetId, distractorId, contrast, [targetUrl, distractorUrl] = []]) => {
    const word = VOCAB.find((item) => item.id === targetId) || FALLBACK_ITEMS.find((item) => item.id === targetId);
    return {
      target: { ...word, full_audio_url: targetUrl || word.full_audio_url },
      distractor: { id: distractorId, full_audio_url: distractorUrl || `audio/${distractorId}.mp3` },
      contrast,
      attempt: 1,
    };
  });
  listeningIndex = 0;
  listeningAnswers = [];
  listeningSessionId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  vocabStage.hidden = true;
  assessmentStage.hidden = false;
  listeningReview.hidden = true;
  listeningTest.hidden = false;
  showListeningTrial();
}

function showListeningTrial() {
  const trial = listeningQueue[listeningIndex];
  if (!trial) return showListeningReview();
  const options = Math.random() < 0.5
    ? [trial.target, trial.distractor]
    : [trial.distractor, trial.target];
  listeningTrial = { ...trial, options, readyAt: null, answered: false };
  listeningPicture.onerror = () => {
    listeningPicture.onerror = null;
    listeningPicture.src = getPlaceholderSVG(trial.target.id);
  };
  listeningPicture.src = trial.target.visual_url || getPlaceholderSVG(trial.target.id);
  listeningNext.disabled = true;
  listeningChoices.forEach((choice) => {
    choice.disabled = true;
    choice.classList.remove('listening-correct', 'listening-incorrect');
    choice.removeAttribute('data-feedback');
    choice.setAttribute('aria-label', choice.dataset.side === 'left' ? 'Choose triangle' : 'Choose star');
  });
  listeningPlay.focus();
}

listeningPlay.addEventListener('click', async () => {
  const trial = listeningTrial;
  listeningPlay.disabled = true;
  listeningNext.disabled = true;
  listeningChoices.forEach((choice) => { choice.disabled = true; });
  try {
    for (const [index, option] of trial.options.entries()) {
      const choice = listeningChoices[index];
      choice.classList.add('listening-playing');
      try {
        const audio = await playAudio(option.full_audio_url);
        if (!audio) return;
        const finished = audio.ended || await new Promise((resolve) => {
          const listeners = new AbortController();
          const complete = (event) => {
            listeners.abort();
            resolve(event.type === 'ended' || audio.ended);
          };
          for (const event of ['ended', 'error', 'pause']) {
            audio.addEventListener(event, complete, { signal: listeners.signal });
          }
        });
        if (!finished || listeningTrial !== trial) return;
      } finally {
        choice.classList.remove('listening-playing');
      }
    }
    trial.readyAt ??= performance.now();
  } finally {
    listeningPlay.disabled = false;
    listeningNext.disabled = !trial.answered;
    if (listeningTrial === trial && trial.readyAt !== null && !trial.answered) {
      listeningChoices.forEach((choice) => { choice.disabled = false; });
    }
  }
});

listeningChoices.forEach((choice, index) => choice.addEventListener('click', () => {
  const trial = listeningTrial;
  if (choice.disabled || trial.answered || trial.readyAt === null) return;
  const selected = trial.options[index];
  const correct = selected.id === trial.target.id;
  const correctIndex = trial.options.indexOf(trial.target);
  const correctChoice = listeningChoices[correctIndex];
  trial.answered = true;
  listeningChoices.forEach((option) => { option.disabled = true; });
  correctChoice.classList.add('listening-correct');
  correctChoice.dataset.feedback = '✓';
  correctChoice.setAttribute('aria-label', 'Correct choice');
  if (!correct) {
    choice.classList.add('listening-incorrect');
    choice.dataset.feedback = '×';
    choice.setAttribute('aria-label', 'Incorrect choice');
  }
  listeningNext.disabled = false;

  const answer = {
    targetId: trial.target.id,
    targetAudioUrl: trial.target.full_audio_url,
    selectedId: selected.id,
    selectedAudioUrl: selected.full_audio_url,
    contrast: trial.contrast,
    correct,
    correctSide: correctChoice.dataset.side,
    selectedSide: choice.dataset.side,
    attempt: trial.attempt,
    latencyMs: Math.round(performance.now() - trial.readyAt),
    answeredAt: new Date().toISOString(),
  };
  listeningAnswers.push(answer);
  if (!correct && trial.attempt === 1) {
    listeningQueue.push({ target: trial.target, distractor: trial.distractor, contrast: trial.contrast, attempt: 2 });
  }
  try {
    localStorage.setItem(`gll.hearing-test.${listeningSessionId}`, JSON.stringify({
      sessionId: listeningSessionId,
      answers: listeningAnswers,
    }));
  } catch (error) {
    console.warn('Could not save listening answers:', error);
  }
  listeningNext.focus();
}));

listeningNext.addEventListener('click', () => {
  if (!listeningTrial?.answered || listeningPlay.disabled) return;
  listeningIndex += 1;
  if (listeningIndex === listeningPairs.length) return showListeningReview();
  showListeningTrial();
});

function showListeningReview() {
  listeningTest.hidden = true;
  const firstAnswers = listeningAnswers.filter((answer) => answer.attempt === 1);
  const correctCount = firstAnswers.filter((answer) => answer.correct).length;
  const score = document.getElementById('listening-score');
  score.textContent = `✓ ${correctCount} / ${firstAnswers.length}`;
  score.setAttribute('aria-label', `${correctCount} out of ${firstAnswers.length} correct on the first try`);
  listeningReview.hidden = false;
  const selectedList = document.getElementById('user-review-list');
  const resultList = document.getElementById('results-review-list');
  const targetList = document.getElementById('target-review-list');
  [selectedList, resultList, targetList].forEach((list) => list.replaceChildren());
  firstAnswers.forEach((answer, index) => {
    const selected = document.createElement('li');
    const chosenReplay = makeListeningButton('▶', `Replay your ${answer.correct ? 'correct' : 'incorrect'} choice for question ${index + 1}`, () => playAudio(answer.selectedAudioUrl));
    chosenReplay.dataset.feedback = answer.correct ? '✓' : '×';
    selected.append(chosenReplay);
    const result = document.createElement('li');
    const word = listeningQueue.find((trial) => trial.target.id === answer.targetId).target;
    const picture = document.createElement('img');
    picture.alt = '';
    picture.src = word.visual_url || getPlaceholderSVG(word.id);
    result.append(picture);
    const target = document.createElement('li');
    const targetReplay = makeListeningButton('▶', `Replay correct answer for question ${index + 1}`, () => playAudio(answer.targetAudioUrl));
    targetReplay.dataset.feedback = '✓';
    target.append(targetReplay);
    selectedList.append(selected);
    resultList.append(result);
    targetList.append(target);
  });
  const actions = document.getElementById('listening-review-actions');
  const back = makeListeningButton('←', 'Return to vocabulary', () => {
    currentAudio?.pause();
    listeningReview.hidden = true;
    assessmentStage.hidden = true;
    vocabStage.hidden = false;
    startListening.focus();
  });
  actions.replaceChildren(back);
  if (listeningIndex < listeningQueue.length) {
    actions.append(makeListeningButton('↻', 'Practice missed questions', () => {
      currentAudio?.pause();
      listeningReview.hidden = true;
      listeningTest.hidden = false;
      showListeningTrial();
    }));
  }
  score.tabIndex = -1;
  score.focus();
}

/* Pronunciation recording and local replay */
const pronunciationTest = document.getElementById('pronunciation-test');
const pronunciationPicture = document.getElementById('pronunciation-picture');
const nativePlay = document.getElementById('pronunciation-native-play');
const learnerPlay = document.getElementById('pronunciation-user-play');
const pronunciationReplay = document.getElementById('pronunciation-replay');
const recordButton = document.getElementById('pronunciation-record-btn');
const recordAgain = document.getElementById('pronunciation-retry');
const pronunciationBack = document.getElementById('pronunciation-back');
const pronunciationStatus = document.getElementById('pronunciation-status');
const micLevel = document.getElementById('pronunciation-mic-level');
const startPronunciation = makeListeningButton('🎙', 'Practice pronunciation', openPronunciation);
startPronunciation.id = 'pronunciation-start';
vocabStage.appendChild(startPronunciation);

let pronunciationWord;
let heardReference = false;
let recordingAttempt = null;
let recordedAudioUrl = null;

function openPronunciation() {
  pronunciationWord = VOCAB[activeIndex];
  heardReference = false;
  currentAudio?.pause();
  pronunciationPicture.onerror = () => {
    pronunciationPicture.onerror = null;
    pronunciationPicture.src = getPlaceholderSVG(pronunciationWord.id);
  };
  pronunciationPicture.src = pronunciationWord.visual_url || getPlaceholderSVG(pronunciationWord.id);
  pronunciationStatus.hidden = true;
  vocabStage.hidden = true;
  listeningTest.hidden = true;
  listeningReview.hidden = true;
  assessmentStage.hidden = false;
  pronunciationTest.hidden = false;
  updateRecordingControls();
  nativePlay.focus();
}

function updateRecordingControls() {
  const canStop = recordingAttempt?.recorder?.state === 'recording';
  recordButton.disabled = !heardReference || (Boolean(recordingAttempt) && !canStop);
  recordButton.hidden = Boolean(recordedAudioUrl) && !recordingAttempt;
  pronunciationReplay.hidden = !recordedAudioUrl || Boolean(recordingAttempt);
  recordButton.textContent = canStop ? '■' : '●';
  recordButton.setAttribute('aria-label', canStop ? 'Stop recording' : 'Start recording');
  nativePlay.disabled = Boolean(recordingAttempt);
  learnerPlay.disabled = Boolean(recordingAttempt) || !recordedAudioUrl;
  recordAgain.disabled = learnerPlay.disabled;
}

function showRecordingError(message) {
  pronunciationStatus.hidden = false;
  pronunciationStatus.textContent = '⚠';
  pronunciationStatus.setAttribute('aria-label', message);
  pronunciationStatus.title = message;
}

function monitorMicrophone(attempt) {
  const context = attempt.context;
  if (!context) return;
  const input = context.createMediaStreamSource(attempt.stream);
  const analyser = context.createAnalyser();
  input.connect(analyser);
  const samples = new Float32Array(analyser.fftSize);
  micLevel.value = 0;
  micLevel.hidden = false;
  const update = () => {
    if (recordingAttempt !== attempt || attempt.recorder.state !== 'recording') return;
    if (context.state === 'running') {
      analyser.getFloatTimeDomainData(samples);
      const rms = Math.sqrt(samples.reduce((sum, sample) => sum + sample * sample, 0) / samples.length);
      attempt.peakLevel = Math.max(attempt.peakLevel ?? 0, rms);
      micLevel.value = Math.min(rms * 8, 1);
    }
    attempt.levelFrame = requestAnimationFrame(update);
  };
  update();
}

function releaseRecording(attempt) {
  clearTimeout(attempt.timer);
  cancelAnimationFrame(attempt.levelFrame);
  if (attempt.context && attempt.context.state !== 'closed') {
    attempt.context.close().catch(() => {});
  }
  attempt.stream?.getTracks().forEach((track) => track.stop());
  if (recordingAttempt === attempt) {
    recordingAttempt = null;
    micLevel.hidden = true;
    updateRecordingControls();
  }
}

function clearLearnerAudio() {
  currentAudio?.pause();
  if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
  recordedAudioUrl = null;
}

async function startRecording() {
  if (recordingAttempt || !heardReference) return;
  pronunciationStatus.hidden = true;
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
    showRecordingError('Microphone recording is unavailable in this browser.');
    return;
  }
  currentAudio?.pause();
  const attempt = { chunks: [] };
  recordingAttempt = attempt;
  updateRecordingControls();
  if (typeof AudioContext !== 'undefined') {
    try {
      attempt.context = new AudioContext();
      attempt.context.resume().catch(() => {});
    } catch (error) {
      console.warn('Microphone level display unavailable:', error);
    }
  }
  try {
    attempt.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (recordingAttempt !== attempt) {
      releaseRecording(attempt);
      return;
    }
    const mimeType = ['audio/webm;codecs=opus', 'audio/mp4']
      .find((type) => MediaRecorder.isTypeSupported(type) && new Audio().canPlayType(type));
    const recorder = new MediaRecorder(attempt.stream, mimeType ? { mimeType } : undefined);
    attempt.recorder = recorder;
    recorder.addEventListener('dataavailable', (event) => {
      if (event.data.size) attempt.chunks.push(event.data);
    });
    recorder.addEventListener('stop', () => {
      if (recordingAttempt !== attempt) return;
      if (attempt.chunks.length) {
        const clip = new Blob(attempt.chunks, { type: recorder.mimeType || attempt.chunks[0].type });
        clearLearnerAudio();
        recordedAudioUrl = URL.createObjectURL(clip);
        if (attempt.peakLevel !== undefined && attempt.peakLevel < 0.003) {
          showRecordingError('Very little sound was picked up. Check Chrome’s microphone input and record again.');
        }
      } else {
        showRecordingError('No audio was captured. Try recording again.');
      }
      releaseRecording(attempt);
      if (recordedAudioUrl) learnerPlay.focus();
    }, { once: true });
    recorder.addEventListener('error', () => {
      if (recordingAttempt !== attempt) return;
      releaseRecording(attempt);
      showRecordingError('Recording stopped because of a microphone problem.');
    }, { once: true });

    recorder.start();
    try {
      monitorMicrophone(attempt);
    } catch (error) {
      console.warn('Microphone level display unavailable:', error);
    }
    attempt.timer = setTimeout(stopRecording, 30000);
    updateRecordingControls();
    recordButton.focus();
  } catch (error) {
    if (recordingAttempt !== attempt) return;
    releaseRecording(attempt);
    showRecordingError(error.name === 'NotAllowedError'
      ? 'Microphone access was denied. Allow it in Chrome and try again.'
      : 'Could not start the microphone. Check your input device and try again.');
    recordButton.focus();
  }
}

function stopRecording() {
  const recorder = recordingAttempt?.recorder;
  if (recorder?.state !== 'recording') return;
  recorder.stop();
  updateRecordingControls();
}

function closePronunciation() {
  const attempt = recordingAttempt;
  if (attempt) releaseRecording(attempt);
  clearLearnerAudio();
  updateRecordingControls();
  pronunciationTest.hidden = true;
  assessmentStage.hidden = true;
  vocabStage.hidden = false;
  startPronunciation.focus();
}

nativePlay.addEventListener('click', async () => {
  const audio = await playAudio(pronunciationWord.full_audio_url);
  if (!audio || heardReference || pronunciationTest.hidden || currentAudio !== audio) return;
  const enableRecording = () => {
    if (pronunciationTest.hidden || currentAudio !== audio) return;
    heardReference = true;
    updateRecordingControls();
  };
  if (audio.ended) enableRecording();
  else audio.addEventListener('ended', enableRecording, { once: true });
});
learnerPlay.addEventListener('click', async () => {
  const url = recordedAudioUrl;
  if (!url) return;
  const audio = await playAudio(url);
  const playbackError = () => {
    if (recordedAudioUrl === url && !pronunciationTest.hidden) {
      showRecordingError('Chrome could not play this recording. Try recording again.');
    }
  };
  if (!audio || audio.error) playbackError();
  else audio.addEventListener('error', playbackError, { once: true });
});
recordButton.addEventListener('click', () => {
  if (recordingAttempt?.recorder?.state === 'recording') stopRecording();
  else startRecording();
});
recordAgain.addEventListener('click', startRecording);
pronunciationBack.addEventListener('click', closePronunciation);
window.addEventListener('pagehide', () => {
  if (!pronunciationTest.hidden) closePronunciation();
});

// Pronunciation comparison supplies the word ID and its zero-based phoneme index.
window.pulseDivergedPhoneme = (wordId, phonemeIndex) => {
  const wordIndex = VOCAB.findIndex((word) => word.id === wordId);
  const word = VOCAB[wordIndex];
  const index = phonemeIndex ?? word?.diverged_phoneme_index;
  if (vocabStage.hidden || !Number.isInteger(index) || !word?.phonemes?.[index]) return false;
  activeIndex = wordIndex;
  renderCarousel();
  renderBreakdown();
  setActiveCategory('phoneme');
  phonemePanel.children[index].animate(
    [{ scale: 1 }, { scale: 1.25 }, { scale: 1 }],
    { duration: 650, iterations: 2 }
  );
  return true;
};

/* ============================================================
   11. INITIALIZATION & DATA LOADING
   ============================================================ */
function init() {
  // 1. Immediately render fallback data so screen is never blank or broken
  renderCarousel();
  renderBreakdown();
  setActiveCategory('phoneme');

  // 2. Fetch lesson_data.json asynchronously
  fetch('./lesson_data.json')
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      if (data && Array.isArray(data.items) && data.items.length > 0) {
        VOCAB = data.items;
        renderCarousel();
        renderBreakdown();
      } else {
        console.warn('lesson_data.json had no items; keeping verified fallback bank.');
      }
    })
    .catch((err) => {
      console.warn('lesson_data.json load error (running on verified fallback bank):', err);
    });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
