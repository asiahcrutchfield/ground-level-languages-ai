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
let ASSESSMENT_DATA = null;
let activeIndex    = 0;
let activeCategory = 'phoneme'; // 'phoneme' | 'syllable' | 'tone'
let currentAudio   = null;
let audioCtx       = null;

// User recorded bank: { [wordId]: { audioUrl, wavBlob, peaks } }
const userRecordings   = {};
// Cached target peak data: { [audioUrl]: peaks }
const targetWaveforms  = {};

/* ============================================================
   3. AUDIO PLAYBACK (Single audio bus, graceful error catch)
   ============================================================ */
function playAudio(url) {
  if (!url) return;

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentAudio = new Audio(url);
  currentAudio.play().catch((err) => {
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
const carousel               = document.getElementById('picture-carousel');
const cards                  = Array.from(carousel.querySelectorAll('.carousel-card'));
const playBtn                = carousel.querySelector('.carousel-play-btn');

const catBtns                = Array.from(document.querySelectorAll('.breakdown-category'));

const phonemePanel           = document.getElementById('phoneme-panel');
const syllablePanel          = document.getElementById('syllable-panel');
const tonePanel              = document.getElementById('tone-panel');

/* Pronunciation Test DOM */
const pronTarget             = document.getElementById('pronunciation-target');
const pronTargetSoundwave    = document.getElementById('pronunciation-target-soundwave');
const pronSymbolFrame        = document.getElementById('pronunciation-symbol-frame');

const pronPractice           = document.getElementById('pronunciation-practice');
const pronPracticeSoundwave  = document.getElementById('pronunciation-practice-soundwave');
const pronPracticeSymbolFrame= document.getElementById('pronunciation-practice-symbol-frame');

const recordBtn              = document.getElementById('pronunciation-record-btn');

/* Side-by-Side Review DOM */
const userReviewSoundwave    = document.getElementById('user-review-soundwave');
const userReviewIcon         = document.getElementById('user-review-icon-container');
const targetReviewSoundwave  = document.getElementById('target-review-soundwave');
const targetReviewIcon       = document.getElementById('target-review-icon-container');
const resultsBadge           = document.getElementById('results-badge');

/* Floating Stage Nav */
const stageNavDots           = Array.from(document.querySelectorAll('.stage-nav-dot'));
const listeningStage         = document.getElementById('listening-test');
const listeningPrompt        = listeningStage && listeningStage.querySelector('.listening-question');
const listeningChoices       = listeningStage ? Array.from(listeningStage.querySelectorAll('.listening-choice')) : [];
const hearingFill            = document.getElementById('hearing-progress-fill');
const pronFill               = document.getElementById('pronunciation-progress-fill');
const hearingSideFill        = document.querySelector('.hearing-side-fill');
const pronSideFill            = document.querySelector('.pronunciation-side-fill');
const hearingIndicator       = document.querySelector('#hearing-progress-container .progress-indicator');
const pronIndicator          = document.querySelector('#pronunciation-progress-container .progress-indicator');
const hearingResults         = [];
let hearingPromptStartedAt   = 0;
let hearingPromptSide        = 0;
let listeningOffer           = [];
let listeningOfferWordId     = null;
let listeningCorrectChoiceId = 'target';

function findLessonItem(itemId) {
  return VOCAB.find((item) => item.id === itemId) || null;
}

function getListeningAssessment(itemId) {
  return ASSESSMENT_DATA?.listening_assessment?.items?.find((item) => item.target_lesson_item_id === itemId) || null;
}

function getPronunciationAssessment(itemId) {
  return ASSESSMENT_DATA?.pronunciation_assessment?.items?.find((item) => item.target_lesson_item_id === itemId) || null;
}

function getTargetAudio(item) {
  return item?.full_audio_url || '';
}

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
  updateActiveWordPronunciation();
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
  pulseWaveform(pronTargetSoundwave);
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

/* ============================================================
   11. WAVEFORM RENDERING & WEB AUDIO PROCESSING
   ============================================================ */
const NUM_WAVE_BARS = 28;

function renderWaveformBars(container, peaks, barClass = 'target-bar') {
  if (!container) return;
  container.innerHTML = '';
  const count = (peaks && peaks.length) ? peaks.length : NUM_WAVE_BARS;
  for (let i = 0; i < count; i++) {
    const bar = document.createElement('div');
    bar.className = `wave-bar ${barClass}`;
    const heightPercent = peaks && peaks[i] !== undefined
      ? Math.max(14, Math.min(100, Math.round(peaks[i] * 100)))
      : 14;
    bar.style.height = `${heightPercent}%`;
    container.appendChild(bar);
  }
}

function pulseWaveform(container) {
  if (!container) return;
  container.classList.remove('playing');
  void container.offsetWidth; // force reflow
  container.classList.add('playing');
  setTimeout(() => container.classList.remove('playing'), 1400);
}

function extractPeaks(audioBuffer, numBars = NUM_WAVE_BARS) {
  const channelData = audioBuffer.getChannelData(0);
  const step = Math.floor(channelData.length / numBars);
  const rawPeaks = [];
  let maxPeak = 0;

  for (let i = 0; i < numBars; i++) {
    const start = i * step;
    const end = Math.min(start + step, channelData.length);
    let peak = 0;
    for (let j = start; j < end; j++) {
      const val = Math.abs(channelData[j]);
      if (val > peak) peak = val;
    }
    rawPeaks.push(peak);
    if (peak > maxPeak) maxPeak = peak;
  }

  const norm = maxPeak > 0 ? maxPeak : 1;
  return rawPeaks.map((p) => Math.max(0.14, p / norm));
}

function generateSyntheticPeaks(numBars = NUM_WAVE_BARS) {
  const peaks = [];
  for (let i = 0; i < numBars; i++) {
    const progress = i / (numBars - 1);
    const envelope = Math.sin(progress * Math.PI);
    const jitter = 0.65 + Math.sin(i * 1.4) * 0.35;
    peaks.push(Math.max(0.16, Math.min(1.0, envelope * jitter)));
  }
  return peaks;
}

async function loadTargetWaveform(audioUrl) {
  if (!audioUrl) return;
  if (targetWaveforms[audioUrl]) {
    const peaks = targetWaveforms[audioUrl];
    renderWaveformBars(pronTargetSoundwave, peaks, 'target-bar');
    renderWaveformBars(targetReviewSoundwave, peaks, 'target-bar');
    return;
  }

  try {
    const res = await fetch(audioUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();

    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') await audioCtx.resume();

    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    const peaks = extractPeaks(audioBuffer, NUM_WAVE_BARS);
    targetWaveforms[audioUrl] = peaks;

    renderWaveformBars(pronTargetSoundwave, peaks, 'target-bar');
    renderWaveformBars(targetReviewSoundwave, peaks, 'target-bar');
  } catch (err) {
    console.warn(`Target waveform decode note for "${audioUrl}":`, err.message || err);
    const synthetic = generateSyntheticPeaks(NUM_WAVE_BARS);
    targetWaveforms[audioUrl] = synthetic;
    renderWaveformBars(pronTargetSoundwave, synthetic, 'target-bar');
    renderWaveformBars(targetReviewSoundwave, synthetic, 'target-bar');
  }
}

async function loadWaveformPeaks(audioUrl) {
  if (!audioUrl) return null;
  if (targetWaveforms[audioUrl]) return targetWaveforms[audioUrl];
  try {
    const response = await fetch(audioUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const decoded = await audioCtx.decodeAudioData(await response.arrayBuffer());
    const peaks = extractPeaks(decoded, NUM_WAVE_BARS);
    targetWaveforms[audioUrl] = peaks;
    return peaks;
  } catch (err) {
    console.warn(`Assessment waveform unavailable for "${audioUrl}":`, err.message || err);
    return null;
  }
}

function compareWaveformPeaks(attempt, target) {
  if (!attempt || !target || attempt.length !== target.length) return null;
  const difference = attempt.reduce((total, peak, index) => total + Math.abs(peak - target[index]), 0) / attempt.length;
  return Math.max(0, 1 - difference);
}

function updateReviewBadge(matches) {
  if (!resultsBadge) return;
  resultsBadge.classList.toggle('needs-review', !matches);
  const svg = resultsBadge.querySelector('.results-match-svg');
  if (!svg) return;
  svg.innerHTML = matches
    ? '<circle cx="30" cy="30" r="24" fill="#52B788"/><polyline points="19,31 27,39 42,22" fill="none" stroke="#F7F4EB" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>'
    : '<circle cx="30" cy="30" r="24" fill="#E09F3E"/><circle cx="21" cy="30" r="3" fill="#F7F4EB"/><circle cx="30" cy="30" r="3" fill="#F7F4EB"/><circle cx="39" cy="30" r="3" fill="#F7F4EB"/>';
  resultsBadge.setAttribute('aria-label', matches ? 'Sounds align' : 'Sounds differ');
}

/* ── 16-bit Mono 16kHz PCM WAV Encoder ── */
function encodeWAV(samples, sampleRate = 16000) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  function writeString(offset, str) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  // RIFF container
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, 'WAVE');

  // fmt subchunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);             // PCM chunk size
  view.setUint16(20, 1, true);              // AudioFormat 1 = PCM
  view.setUint16(22, 1, true);              // Channels = 1 (mono)
  view.setUint32(24, sampleRate, true);     // SampleRate
  view.setUint32(28, sampleRate * 2, true); // ByteRate (sampleRate * channels * 16 / 8)
  view.setUint16(32, 2, true);              // BlockAlign (channels * 16 / 8)
  view.setUint16(34, 16, true);             // BitsPerSample

  // data subchunk
  writeString(36, 'data');
  view.setUint32(40, samples.length * 2, true);

  // PCM samples: clamp float32 [-1, 1] into int16
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return buffer;
}

/* ============================================================
   12. MICROPHONE CAPTURE & REAL-TIME ANIMATION
   ============================================================ */
let mediaRecorder   = null;
let recordedChunks  = [];
let recordStream    = null;
let recordTimeout   = null;
let liveAnalyser    = null;
let liveAnimId      = null;

async function startRecording() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.warn('getUserMedia not supported in this environment');
    return;
  }

  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') await audioCtx.resume();

  recordStream = await navigator.mediaDevices.getUserMedia({ audio: true });

  // Connect live AnalyserNode for terracotta practice waveform
  const source = audioCtx.createMediaStreamSource(recordStream);
  liveAnalyser = audioCtx.createAnalyser();
  liveAnalyser.fftSize = 64;
  source.connect(liveAnalyser);

  // Prepare practice bars
  renderWaveformBars(pronPracticeSoundwave, null, 'practice-bar');

  recordedChunks = [];
  let options = {};
  if (typeof MediaRecorder !== 'undefined') {
    if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
      options = { mimeType: 'audio/webm;codecs=opus' };
    } else if (MediaRecorder.isTypeSupported('audio/webm')) {
      options = { mimeType: 'audio/webm' };
    } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
      options = { mimeType: 'audio/ogg;codecs=opus' };
    }
  }

  mediaRecorder = new MediaRecorder(recordStream, options);

  mediaRecorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };

  mediaRecorder.onstop = async () => {
    if (recordTimeout) {
      clearTimeout(recordTimeout);
      recordTimeout = null;
    }
    if (liveAnimId) {
      cancelAnimationFrame(liveAnimId);
      liveAnimId = null;
    }
    if (recordStream) {
      recordStream.getTracks().forEach((track) => track.stop());
      recordStream = null;
    }
    if (recordBtn) {
      recordBtn.classList.remove('recording');
    }

    await finishRecordingProcessing();
  };

  mediaRecorder.start();
  if (recordBtn) recordBtn.classList.add('recording');

  // Real-time visualization loop
  visualizeLivePractice();

  // Automatic 3.5s maximum cutoff
  recordTimeout = setTimeout(() => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
  }, 3500);
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
  }
}

function visualizeLivePractice() {
  if (!liveAnalyser || !mediaRecorder || mediaRecorder.state !== 'recording') return;
  const dataArray = new Uint8Array(liveAnalyser.frequencyBinCount);
  liveAnalyser.getByteFrequencyData(dataArray);

  const bars = pronPracticeSoundwave.querySelectorAll('.wave-bar');
  if (bars.length > 0) {
    const step = Math.max(1, Math.floor(dataArray.length / bars.length));
    bars.forEach((bar, i) => {
      const val = dataArray[i * step] || 0;
      const heightPercent = Math.max(14, Math.round((val / 255) * 100));
      bar.style.height = `${heightPercent}%`;
    });
  }

  liveAnimId = requestAnimationFrame(visualizeLivePractice);
}

async function finishRecordingProcessing() {
  if (recordedChunks.length === 0) return;

  try {
    const rawBlob = new Blob(recordedChunks, { type: (mediaRecorder && mediaRecorder.mimeType) || 'audio/webm' });
    const arrayBuffer = await rawBlob.arrayBuffer();

    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') await audioCtx.resume();

    const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    // Resample via OfflineAudioContext to 16kHz mono
    const targetSampleRate = 16000;
    const targetLength = Math.max(1, Math.ceil(decodedBuffer.duration * targetSampleRate));
    const offlineCtx = new OfflineAudioContext(1, targetLength, targetSampleRate);

    const source = offlineCtx.createBufferSource();
    source.buffer = decodedBuffer;
    source.connect(offlineCtx.destination);
    source.start(0);

    const resampledBuffer = await offlineCtx.startRendering();
    const monoChannel = resampledBuffer.getChannelData(0);

    // Encode to 16-bit PCM WAV Blob
    const wavBuffer = encodeWAV(monoChannel, targetSampleRate);
    const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });
    const recordedAudioUrl = URL.createObjectURL(wavBlob);

    // Extract static peaks
    const peaks = extractPeaks(resampledBuffer, NUM_WAVE_BARS);

    const currentWord = VOCAB[activeIndex];
    userRecordings[currentWord.id] = {
      audioUrl: recordedAudioUrl,
      wavBlob: wavBlob,
      peaks: peaks
    };

    const targetPeaks = await loadWaveformPeaks(currentWord.full_audio_url);
    const match = compareWaveformPeaks(peaks, targetPeaks);
    if (match !== null) {
      // This is an acoustic-envelope similarity proxy, not phoneme recognition.
      setProgress(pronFill, pronIndicator, match);
      if (pronSideFill) pronSideFill.style.height = `${match * 100}%`;
      updateReviewBadge(match >= 0.82);
    }

    // Render static waveform bars
    renderWaveformBars(pronPracticeSoundwave, peaks, 'practice-bar');
    renderWaveformBars(userReviewSoundwave, peaks, 'practice-bar');

    // Immediate playback for instant auditory feedback
    playAudio(recordedAudioUrl);
    pulseWaveform(pronPracticeSoundwave);
    pulseWaveform(userReviewSoundwave);
  } catch (err) {
    console.warn('Error processing recording audio buffer:', err);
  }
}

/* ============================================================
   13. STAGE SYNCHRONIZATION & INTERACTIVE WIRING
   ============================================================ */
function updateActiveWordPronunciation() {
  if (!VOCAB || VOCAB.length === 0) return;
  const currentWord = VOCAB[activeIndex];
  const mockAttemptUrl = getPronunciationAssessment(currentWord.id)?.mock_attempt_audio_url;
  const recording = userRecordings[currentWord.id];

  (async () => {
    const targetPeaks = await loadWaveformPeaks(currentWord.full_audio_url);
    if (VOCAB[activeIndex]?.id !== currentWord.id) return;
    if (targetPeaks) {
      renderWaveformBars(pronTargetSoundwave, targetPeaks, 'target-bar');
      renderWaveformBars(targetReviewSoundwave, targetPeaks, 'target-bar');
    }

    let attemptPeaks = recording?.peaks || null;
    if (!attemptPeaks && mockAttemptUrl) {
      attemptPeaks = await loadWaveformPeaks(mockAttemptUrl);
      if (VOCAB[activeIndex]?.id !== currentWord.id) return;
    }
    renderWaveformBars(pronPracticeSoundwave, attemptPeaks, 'practice-bar');
    renderWaveformBars(userReviewSoundwave, attemptPeaks, 'practice-bar');

    const similarity = compareWaveformPeaks(attemptPeaks, targetPeaks);
    if (similarity !== null) {
      setProgress(pronFill, pronIndicator, similarity);
      if (pronSideFill) pronSideFill.style.height = `${similarity * 100}%`;
      updateReviewBadge(similarity >= 0.82);
    } else {
      updateReviewBadge(false);
    }
  })();
}

/* Low pressure binary listening contrast. Side 0 is the current word; side 1
   is the next concrete word. Latency and accuracy stay in the diagnostic UI. */
function setupListeningTest() {
  if (!listeningStage || !listeningPrompt || listeningChoices.length !== 2) return;
  const buildOffer = () => {
    const currentWord = VOCAB[activeIndex];
    const assessment = currentWord && getListeningAssessment(currentWord.id);
    const target = { id: 'target', isTarget: true, audioUrl: getTargetAudio(currentWord) };
    const distractorSpec = assessment?.choices?.find((choice) => choice.kind === 'distractor');
    const foil = distractorSpec
      ? { id: distractorSpec.id, isTarget: false, audioUrl: distractorSpec.audio_url }
      : { id: 'foil', isTarget: false, audioUrl: getTargetAudio(VOCAB[(activeIndex + 1) % VOCAB.length]) };
    listeningOffer = Math.random() < 0.5 ? [target, foil] : [foil, target];
    listeningOfferWordId = currentWord?.id || null;
    listeningCorrectChoiceId = assessment?.correct_choice_id || 'target';
  };
  const promptAudio = () => {
    if (!VOCAB[activeIndex]) return;
    buildOffer();
    hearingPromptSide = listeningOffer.findIndex((option) => option.isTarget);
    hearingPromptStartedAt = performance.now();
    playAudio(getTargetAudio(VOCAB[activeIndex]));
    listeningPrompt.classList.add('playing');
    pulseWaveform(listeningPrompt);
  };
  listeningPrompt.addEventListener('click', promptAudio);
  listeningPrompt.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); promptAudio(); }
  });
  listeningChoices.forEach((choice, side) => {
    const choose = () => {
      if (!listeningOffer.length || listeningOfferWordId !== VOCAB[activeIndex]?.id) buildOffer();
      const selectedChoice = listeningOffer[side];
      if (!selectedChoice) return;
      playAudio(selectedChoice.audioUrl);
      choice.classList.remove('correct', 'incorrect', 'selected');
      const isCorrect = selectedChoice.id === listeningCorrectChoiceId && side === hearingPromptSide;
      choice.classList.add(isCorrect ? 'correct' : 'incorrect', 'selected');
      const latency = hearingPromptStartedAt ? performance.now() - hearingPromptStartedAt : 0;
      if (hearingPromptStartedAt) hearingResults.push({ correct: isCorrect, latency });
      const accuracy = hearingResults.length ? hearingResults.filter((result) => result.correct).length / hearingResults.length : 0;
      setProgress(hearingFill, hearingIndicator, accuracy);
      if (hearingSideFill) hearingSideFill.style.height = `${accuracy * 100}%`;
      window.setTimeout(() => choice.classList.remove('correct', 'incorrect', 'selected'), 900);
      hearingPromptStartedAt = 0;
    };
    choice.addEventListener('click', choose);
    choice.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(); }
    });
  });
}

function setProgress(fill, indicator, score) {
  const percent = Math.max(0, Math.min(100, score * 100));
  if (fill) fill.style.height = `${percent}%`;
  if (indicator) indicator.style.bottom = `${percent}%`;
}

function attachPronunciationAndReviewListeners() {
  // Target native replay
  function playTargetAudio(e) {
    if (e) e.stopPropagation();
    const currentWord = VOCAB[activeIndex];
    playAudio(getTargetAudio(currentWord));
    pulseWaveform(pronTargetSoundwave);
    pulseWaveform(targetReviewSoundwave);
  }

  if (pronTarget) {
    pronTarget.addEventListener('click', playTargetAudio);
  }
  if (targetReviewIcon) {
    targetReviewIcon.addEventListener('click', playTargetAudio);
  }
  if (targetReviewSoundwave) {
    targetReviewSoundwave.addEventListener('click', playTargetAudio);
  }

  // Learner practice replay
  function playUserRecordedAudio(e) {
    if (e) e.stopPropagation();
    const currentWord = VOCAB[activeIndex];
    const rec = userRecordings[currentWord.id];
    if (rec && rec.audioUrl) {
      playAudio(rec.audioUrl);
      pulseWaveform(pronPracticeSoundwave);
      pulseWaveform(userReviewSoundwave);
    } else {
      const mockAttempt = getPronunciationAssessment(currentWord.id)?.mock_attempt_audio_url;
      if (mockAttempt) {
        playAudio(mockAttempt);
        pulseWaveform(pronPracticeSoundwave);
        pulseWaveform(userReviewSoundwave);
      } else {
        playTargetAudio();
      }
    }
  }

  if (pronPractice) {
    pronPractice.addEventListener('click', playUserRecordedAudio);
  }
  if (userReviewIcon) {
    userReviewIcon.addEventListener('click', playUserRecordedAudio);
  }
  if (userReviewSoundwave) {
    userReviewSoundwave.addEventListener('click', playUserRecordedAudio);
  }

  // Microphone toggle button
  if (recordBtn) {
    recordBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        stopRecording();
      } else {
        startRecording().catch((err) => {
          console.warn('Microphone start error:', err);
        });
      }
    });
  }
}

/* Floating Stage Navigator */
function setupStageNav() {
  stageNavDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetId = dot.dataset.target;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const sections = ['vocab-stage', 'listening-test', 'pronunciation-test', 'diagnostic-stage', 'test-review-wrapper']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
            stageNavDots.forEach((d) => {
              d.classList.toggle('active', d.dataset.target === entry.target.id);
            });
          }
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach((sec) => observer.observe(sec));
  }
}

/* ============================================================
   14. INITIALIZATION & DATA LOADING
   ============================================================ */
function init() {
  // 1. Immediately render fallback data so screen is never blank or broken
  renderCarousel();
  renderBreakdown();
  setActiveCategory('phoneme');
  updateActiveWordPronunciation();
  attachPronunciationAndReviewListeners();
  setupListeningTest();
  setupStageNav();

  fetch('./assessment_data.json')
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      ASSESSMENT_DATA = data;
      updateActiveWordPronunciation();
    })
    .catch((err) => console.warn('assessment_data.json unavailable; using lesson audio fallback:', err));

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
        updateActiveWordPronunciation();
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
