/**
 * Ground Level Languages — Zero-Text Vocabulary Prototype
 * script.js — Interactive carousel, breakdown switcher, Web Audio feedback
 */

'use strict';

/* ============================================================
   1.  VOCABULARY DATASET
   ============================================================
   Each word contains:
   - label        : internal reference only (never displayed)
   - imgSrc       : path to image; falls back to inlineSVG if missing/broken
   - inlineSVG    : data-URI SVG illustration (always clean, no text)
   - phonemes     : array of { type: 'consonant'|'vowel', freq }
   - syllables    : array of { width: px (pill width), freq }
   - tones        : array of { level: 'high'|'mid'|'low'|'neutral', freq }
   - audioFreqs   : array of frequencies played together as the word sound
   ============================================================ */

const VOCAB = [
  {
    label: 'Cat',
    imgSrc: 'images/vocab_images/cat.jpg',
    inlineSVG: makeCatSVG(),
    phonemes: [
      { type: 'consonant', freq: 220  },   // /k/
      { type: 'vowel',     freq: 440  },   // /æ/
      { type: 'consonant', freq: 330  },   // /t/
    ],
    syllables: [
      { width: 80, freq: 350 },            // "cat" — single syllable, medium width
    ],
    tones: [
      { level: 'neutral', freq: 390 },     // English: level/neutral tone
    ],
    audioFreqs: [220, 440, 330],
  },
  {
    label: 'Box',
    imgSrc: '',  // no image — will use inline SVG
    inlineSVG: makeBoxSVG(),
    phonemes: [
      { type: 'consonant', freq: 180  },   // /b/
      { type: 'vowel',     freq: 500  },   // /ɒ/
      { type: 'consonant', freq: 280  },   // /k/
      { type: 'consonant', freq: 320  },   // /s/
    ],
    syllables: [
      { width: 90, freq: 400 },
    ],
    tones: [
      { level: 'neutral', freq: 420 },
    ],
    audioFreqs: [180, 500, 280, 320],
  },
  {
    label: 'Jump',
    imgSrc: '',
    inlineSVG: makeJumpSVG(),
    phonemes: [
      { type: 'consonant', freq: 200  },   // /dʒ/
      { type: 'vowel',     freq: 420  },   // /ʌ/
      { type: 'consonant', freq: 260  },   // /m/
      { type: 'consonant', freq: 310  },   // /p/
    ],
    syllables: [
      { width: 85, freq: 380 },
    ],
    tones: [
      { level: 'high', freq: 480 },
    ],
    audioFreqs: [200, 420, 260, 310],
  },
];

/* ============================================================
   2.  SVG ILLUSTRATION GENERATORS
       — pure geometric shapes, absolutely no text
   ============================================================ */

function makeCatSVG () {
  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
    <rect width='200' height='200' rx='20' fill='%23EFECE2'/>
    <!-- body -->
    <ellipse cx='100' cy='140' rx='55' ry='45' fill='%23D3CEB6'/>
    <!-- head -->
    <circle cx='100' cy='85' r='40' fill='%23D3CEB6'/>
    <!-- ears -->
    <polygon points='70,55 60,25 90,50' fill='%23C86D51'/>
    <polygon points='130,55 140,25 110,50' fill='%23C86D51'/>
    <!-- inner ears -->
    <polygon points='73,52 67,34 87,50' fill='%23F7F4EB' opacity='0.6'/>
    <polygon points='127,52 133,34 113,50' fill='%23F7F4EB' opacity='0.6'/>
    <!-- eyes -->
    <ellipse cx='85' cy='82' rx='7' ry='9' fill='%232D6A4F'/>
    <ellipse cx='115' cy='82' rx='7' ry='9' fill='%232D6A4F'/>
    <ellipse cx='85' cy='83' rx='3' ry='6' fill='%23111'/>
    <ellipse cx='115' cy='83' rx='3' ry='6' fill='%23111'/>
    <!-- nose -->
    <polygon points='100,96 95,103 105,103' fill='%23C86D51'/>
    <!-- whiskers -->
    <line x1='105' y1='100' x2='140' y2='95'  stroke='%23888' stroke-width='1.5'/>
    <line x1='105' y1='102' x2='140' y2='105' stroke='%23888' stroke-width='1.5'/>
    <line x1='95'  y1='100' x2='60'  y2='95'  stroke='%23888' stroke-width='1.5'/>
    <line x1='95'  y1='102' x2='60'  y2='105' stroke='%23888' stroke-width='1.5'/>
    <!-- tail -->
    <path d='M155 165 Q180 130 160 110' stroke='%23D3CEB6' stroke-width='10' fill='none' stroke-linecap='round'/>
  </svg>`;
}

function makeBoxSVG () {
  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
    <rect width='200' height='200' rx='20' fill='%23EFECE2'/>
    <!-- box body -->
    <rect x='40' y='100' width='120' height='80' rx='4' fill='%23E09F3E'/>
    <!-- box top left flap -->
    <polygon points='40,100 100,100 95,60 35,60' fill='%23C86D51'/>
    <!-- box top right flap -->
    <polygon points='160,100 100,100 105,60 165,60' fill='%23C86D51'/>
    <!-- box face stripe -->
    <rect x='40' y='100' width='120' height='8' fill='%23C86D51' opacity='0.5'/>
    <!-- tape strip -->
    <rect x='88' y='58' width='24' height='44' rx='3' fill='%23F7F4EB' opacity='0.7'/>
  </svg>`;
}

function makeJumpSVG () {
  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
    <rect width='200' height='200' rx='20' fill='%23EFECE2'/>
    <!-- figure body -->
    <circle cx='100' cy='55' r='20' fill='%232D6A4F'/>
    <!-- torso -->
    <rect x='88' y='75' width='24' height='45' rx='8' fill='%232D6A4F'/>
    <!-- left arm — raised -->
    <line x1='88' y1='85' x2='55' y2='55' stroke='%232D6A4F' stroke-width='10' stroke-linecap='round'/>
    <!-- right arm — raised -->
    <line x1='112' y1='85' x2='145' y2='55' stroke='%232D6A4F' stroke-width='10' stroke-linecap='round'/>
    <!-- left leg — bent outward -->
    <line x1='92' y1='120' x2='65' y2='160' stroke='%232D6A4F' stroke-width='10' stroke-linecap='round'/>
    <!-- right leg — bent outward -->
    <line x1='108' y1='120' x2='135' y2='160' stroke='%232D6A4F' stroke-width='10' stroke-linecap='round'/>
    <!-- motion lines -->
    <line x1='50' y1='175' x2='80' y2='175'  stroke='%2352B788' stroke-width='3' stroke-linecap='round'/>
    <line x1='120' y1='175' x2='150' y2='175' stroke='%2352B788' stroke-width='3' stroke-linecap='round'/>
    <line x1='85' y1='185' x2='115' y2='185'  stroke='%2352B788' stroke-width='4' stroke-linecap='round'/>
  </svg>`;
}

/* ============================================================
   3.  WEB AUDIO API  — synthesized tones
   ============================================================ */

let audioCtx = null;

function getAudioCtx () {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a synthesized tone at `freq` Hz for `duration` seconds.
 * Uses a soft sine wave with quick attack/release to avoid clicks.
 */
function playTone (freq, duration = 0.4, startTime = 0) {
  const ctx  = getAudioCtx();
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type      = 'sine';
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

  gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
  gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + startTime + 0.04);
  gain.gain.linearRampToValueAtTime(0,   ctx.currentTime + startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + startTime);
  osc.stop(ctx.currentTime + startTime + duration + 0.05);
}

/**
 * Play all phoneme frequencies of a word in a quick melodic sequence.
 */
function playWord (wordData) {
  const stepMs = 0.22;
  wordData.audioFreqs.forEach((freq, i) => {
    playTone(freq, 0.35, i * stepMs);
  });
}

/* ============================================================
   4.  STATE
   ============================================================ */

let activeIndex    = 0;              // index into VOCAB[]
let activeCategory = 'phoneme';      // 'phoneme' | 'syllable' | 'tone'

/* ============================================================
   5.  DOM REFERENCES
   ============================================================ */

const carousel      = document.getElementById('picture-carousel');
const cards         = Array.from(carousel.querySelectorAll('.carousel-card'));
const playBtn       = carousel.querySelector('.carousel-play-btn');

const catBtns       = Array.from(document.querySelectorAll('.breakdown-category'));

const phonemePanel  = document.getElementById('phoneme-panel');
const syllablePanel = document.getElementById('syllable-panel');
const tonePanel     = document.getElementById('tone-panel');

/* ============================================================
   6.  CAROUSEL RENDERING
   ============================================================ */

/**
 * Given the current `activeIndex`, assign prev/active/next classes
 * and update each card's image source from VOCAB[].
 */
function renderCarousel () {
  const total = VOCAB.length;
  const prevIdx = (activeIndex - 1 + total) % total;
  const nextIdx = (activeIndex + 1) % total;

  const order = [
    { el: cards[0], dataIdx: prevIdx,        cls: 'prev'   },
    { el: cards[1], dataIdx: activeIndex,    cls: 'active' },
    { el: cards[2], dataIdx: nextIdx,        cls: 'next'   },
  ];

  order.forEach(({ el, dataIdx, cls }) => {
    // Reset classes
    el.className = `carousel-card ${cls}`;
    el.dataset.index = dataIdx;

    const word  = VOCAB[dataIdx];
    const img   = el.querySelector('.carousel-pic');

    if (word.imgSrc) {
      img.src = word.imgSrc;
      img.alt = '';
      img.onerror = () => { img.src = word.inlineSVG; };
    } else {
      img.src = word.inlineSVG;
      img.alt = '';
    }
  });
}

/* ============================================================
   7.  BREAKDOWN PANELS RENDERING
   ============================================================ */

function buildConsonantSVG () {
  return `<svg viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="17" cy="17" r="15" fill="#C86D51"/>
    <circle cx="17" cy="17" r="7"  fill="rgba(255,255,255,0.3)"/>
  </svg>`;
}

function buildVowelSVG () {
  return `<svg viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <polygon points="17,2 32,32 2,32" fill="#52B788"/>
    <polygon points="17,12 26,30 8,30" fill="rgba(255,255,255,0.3)"/>
  </svg>`;
}

function renderBreakdown () {
  const word = VOCAB[activeIndex];

  /* — Phoneme panel — */
  phonemePanel.innerHTML = '';
  word.phonemes.forEach((ph) => {
    const li = document.createElement('li');
    li.className = `phoneme-item ${ph.type}-item`;
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-label', `Play ${ph.type} sound`);
    li.dataset.freq = ph.freq;
    li.innerHTML = ph.type === 'consonant' ? buildConsonantSVG() : buildVowelSVG();
    phonemePanel.appendChild(li);
  });

  /* — Syllable panel — */
  syllablePanel.innerHTML = '';
  word.syllables.forEach((syl) => {
    const li = document.createElement('li');
    li.className = 'category-item syllable-item';
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-label', 'Play syllable sound');
    li.dataset.freq = syl.freq;
    li.style.width  = `${syl.width}px`;
    syllablePanel.appendChild(li);
  });

  /* — Tone panel — */
  tonePanel.innerHTML = '';
  word.tones.forEach((tone) => {
    const li = document.createElement('li');
    li.className = `category-item tone-item tone-${tone.level}`;
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-label', `Play ${tone.level} tone`);
    li.dataset.freq = tone.freq;
    tonePanel.appendChild(li);
  });
}

/* ============================================================
   8.  CATEGORY SWITCHER
   ============================================================ */

function setActiveCategory (cat) {
  activeCategory = cat;

  /* Toggle button active state */
  catBtns.forEach(btn => {
    const isActive = btn.dataset.category === cat;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive);
  });

  /* Toggle panel visibility */
  [phonemePanel, syllablePanel, tonePanel].forEach(p => p.classList.remove('active'));

  const panelMap = {
    phoneme:  phonemePanel,
    syllable: syllablePanel,
    tone:     tonePanel,
  };
  if (panelMap[cat]) {
    panelMap[cat].classList.add('active');
  }
}

/* ============================================================
   9.  CAROUSEL ROTATION
   ============================================================ */

function rotateTo (newIndex) {
  activeIndex = (newIndex + VOCAB.length) % VOCAB.length;
  renderCarousel();
  renderBreakdown();
  // Audio-first: play the new word immediately
  playWord(VOCAB[activeIndex]);
}

/* ============================================================
   10. EVENT LISTENERS
   ============================================================ */

/* ── Carousel card clicks ── */
carousel.addEventListener('click', (e) => {
  const card = e.target.closest('.carousel-card');
  if (!card) return;

  // If the play button was clicked, handle separately
  if (e.target.closest('.carousel-play-btn')) return;

  if (card.classList.contains('prev')) {
    rotateTo(activeIndex - 1);
  } else if (card.classList.contains('next')) {
    rotateTo(activeIndex + 1);
  }
  // Clicking active card itself does nothing (use play button)
});

/* ── Keyboard support for carousel cards ── */
carousel.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest('.carousel-card');
  if (!card) return;
  if (card.classList.contains('prev')) rotateTo(activeIndex - 1);
  if (card.classList.contains('next')) rotateTo(activeIndex + 1);
});

/* ── Play button: replay word without rotating ── */
playBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  playBtn.classList.add('playing');
  playWord(VOCAB[activeIndex]);
  setTimeout(() => playBtn.classList.remove('playing'), 900);
});

/* ── Category switcher ── */
catBtns.forEach(btn => {
  btn.addEventListener('click', () => setActiveCategory(btn.dataset.category));
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') setActiveCategory(btn.dataset.category);
  });
});

/* ── Individual shape clicks on breakdown timeline ── */
function attachShapeListeners (panel) {
  panel.addEventListener('click', (e) => {
    const item = e.target.closest('[data-freq]');
    if (!item) return;

    const freq = parseFloat(item.dataset.freq);
    if (freq) playTone(freq, 0.5);

    // Pop animation
    item.classList.remove('popping');
    // Force reflow to restart animation
    void item.offsetWidth;
    item.classList.add('popping');
    item.addEventListener('animationend', () => item.classList.remove('popping'), { once: true });
  });

  panel.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const item = e.target.closest('[data-freq]');
    if (!item) return;
    const freq = parseFloat(item.dataset.freq);
    if (freq) playTone(freq, 0.5);
  });
}

attachShapeListeners(phonemePanel);
attachShapeListeners(syllablePanel);
attachShapeListeners(tonePanel);

/* ============================================================
   11.  INIT
   ============================================================ */

function init () {
  renderCarousel();
  renderBreakdown();
  setActiveCategory('phoneme');
}

// Defer init until DOM is ready (script has defer attr, but be safe)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
