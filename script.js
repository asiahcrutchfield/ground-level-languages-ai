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
