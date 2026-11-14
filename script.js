/**
 * Ground Level Languages — Zero-Text Vocabulary Prototype
 * script.js — Driven by lesson_data.json (Allosaurus + CREPE pipeline output)
 *
 * Data shape (lesson_data.json):
 *   { items: [ { id, visual_url, full_audio_url, humming_audio_url,
 *               phonemes:  [ { id, kind: 'vowel'|'consonant', audio_url } ],
 *               syllables: [ { id, width_px, audio_url } ],
 *               tones:     [ { id, style: 'ring', audio_url } ] } ] }
 */

'use strict';

/* ============================================================
   1. STATE
   ============================================================ */
let VOCAB       = [];   // populated from lesson_data.json
let activeIndex = 0;
let activeCategory = 'phoneme'; // 'phoneme' | 'syllable' | 'tone'

/* ============================================================
   2. AUDIO — real files via HTMLAudioElement
   ============================================================ */

let currentAudio = null;

function playAudio(url) {
  if (!url) return;

  // Stop whatever is playing
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentAudio = new Audio(url);
  currentAudio.play().catch((err) => {
    console.warn(`Audio playback failed for "${url}":`, err);
  });
}

/* ============================================================
   3. DOM REFERENCES
   ============================================================ */
const carousel      = document.getElementById('picture-carousel');
const cards         = Array.from(carousel.querySelectorAll('.carousel-card'));
const playBtn       = carousel.querySelector('.carousel-play-btn');

const catBtns       = Array.from(document.querySelectorAll('.breakdown-category'));

const phonemePanel  = document.getElementById('phoneme-panel');
const syllablePanel = document.getElementById('syllable-panel');
const tonePanel     = document.getElementById('tone-panel');

/* ============================================================
   4. CAROUSEL RENDERING
   ============================================================ */
function renderCarousel() {
  const total   = VOCAB.length;
  const prevIdx = (activeIndex - 1 + total) % total;
  const nextIdx = (activeIndex + 1) % total;

  const slots = [
    { el: cards[0], dataIdx: prevIdx,     cls: 'prev'   },
    { el: cards[1], dataIdx: activeIndex, cls: 'active' },
    { el: cards[2], dataIdx: nextIdx,     cls: 'next'   },
  ];

  slots.forEach(({ el, dataIdx, cls }) => {
    el.className      = `carousel-card ${cls}`;
    el.dataset.index  = dataIdx;

    const word = VOCAB[dataIdx];
    const img  = el.querySelector('.carousel-pic');

    img.src = word.visual_url;
    img.alt = '';
    img.onerror = () => {
      // Graceful fallback: show a coloured placeholder block
      img.style.display = 'none';
      el.querySelector('.picture-frame').style.background = '#D3CEB6';
    };
    img.onload = () => { img.style.display = 'block'; };
  });
}

/* ============================================================
   5. BREAKDOWN PANELS
   ============================================================ */

/* SVG shapes — purely geometric, zero text */
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
  const word = VOCAB[activeIndex];

  /* — Phoneme panel — */
  phonemePanel.innerHTML = '';
  word.phonemes.forEach((ph) => {
    const li = document.createElement('li');
    li.className = `phoneme-item ${ph.kind}-item`;
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-label', `Play ${ph.kind} sound`);
    li.dataset.audioUrl = ph.audio_url;
    li.innerHTML = ph.kind === 'consonant' ? consonantSVG() : vowelSVG();
    phonemePanel.appendChild(li);
  });

  /* — Syllable panel — */
  syllablePanel.innerHTML = '';
  word.syllables.forEach((syl) => {
    const li = document.createElement('li');
    li.className = 'category-item syllable-item';
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-label', 'Play syllable');
    li.dataset.audioUrl = syl.audio_url;
    li.style.width = `${syl.width_px}px`;
    syllablePanel.appendChild(li);
  });

  /* — Tone panel — */
  tonePanel.innerHTML = '';
  word.tones.forEach((tone) => {
    const li = document.createElement('li');
    li.className = `category-item tone-item tone-${tone.style}`;
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-label', 'Play tone');
    li.dataset.audioUrl = tone.audio_url;
    tonePanel.appendChild(li);
  });
}

/* ============================================================
   6. CATEGORY SWITCHER
   ============================================================ */
function setActiveCategory(cat) {
  activeCategory = cat;

  catBtns.forEach((btn) => {
    const isActive = btn.dataset.category === cat;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive);
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
   7. CAROUSEL ROTATION
   ============================================================ */
function rotateTo(newIndex) {
  activeIndex = (newIndex + VOCAB.length) % VOCAB.length;
  renderCarousel();
  renderBreakdown();
  // Audio-first rule: play the word immediately on rotate
  playAudio(VOCAB[activeIndex].full_audio_url);
}

/* ============================================================
   8. EVENT LISTENERS
   ============================================================ */

/* Carousel card clicks */
carousel.addEventListener('click', (e) => {
  if (e.target.closest('.carousel-play-btn')) return; // handled separately
  const card = e.target.closest('.carousel-card');
  if (!card) return;
  if (card.classList.contains('prev')) rotateTo(activeIndex - 1);
  if (card.classList.contains('next')) rotateTo(activeIndex + 1);
});

/* Keyboard for carousel */
carousel.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest('.carousel-card');
  if (!card) return;
  if (card.classList.contains('prev')) rotateTo(activeIndex - 1);
  if (card.classList.contains('next')) rotateTo(activeIndex + 1);
});

/* Play button: replay current word */
playBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  playBtn.classList.add('playing');
  playAudio(VOCAB[activeIndex].full_audio_url);
  setTimeout(() => playBtn.classList.remove('playing'), 900);
});

/* Category switcher */
catBtns.forEach((btn) => {
  btn.addEventListener('click', () => setActiveCategory(btn.dataset.category));
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') setActiveCategory(btn.dataset.category);
  });
});

/* Individual shape clicks on breakdown timeline */
function attachShapeListeners(panel) {
  panel.addEventListener('click', (e) => {
    const item = e.target.closest('[data-audio-url]');
    if (!item) return;
    playAudio(item.dataset.audioUrl);
    popAnimate(item);
  });

  panel.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const item = e.target.closest('[data-audio-url]');
    if (!item) return;
    playAudio(item.dataset.audioUrl);
    popAnimate(item);
  });
}

function popAnimate(el) {
  el.classList.remove('popping');
  void el.offsetWidth; // force reflow to restart animation
  el.classList.add('popping');
  el.addEventListener('animationend', () => el.classList.remove('popping'), { once: true });
}

attachShapeListeners(phonemePanel);
attachShapeListeners(syllablePanel);
attachShapeListeners(tonePanel);

/* ============================================================
   9. LOAD lesson_data.json & INIT
   ============================================================ */
fetch('lesson_data.json')
  .then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then((data) => {
    if (!Array.isArray(data.items) || data.items.length === 0) {
      throw new Error('lesson_data.json has no items');
    }
    VOCAB       = data.items;
    activeIndex = 0;
    renderCarousel();
    renderBreakdown();
    setActiveCategory('phoneme');
  })
  .catch((err) => {
    console.error('Could not load lesson_data.json:', err);
    // Surface a visible (but text-free) error state: dim the stage
    document.getElementById('vocab-stage').style.opacity = '0.4';
  });
