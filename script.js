/**
- Ground Level Languages — Zero-Text Vocabulary Prototype
- script.js — AI pipeline audio & visuals with fallback resilience
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
   STORY PREVIEW ARCS (Animal-POV Sensory Reality Teasers)
   ============================================================ */
const STORY_ARCS = [
  {
    id: "story_cat_walk",
    startVocabIndex: 0,
    audio_url: "audio/cat.mp3",
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><rect width="240" height="240" rx="24" fill="%23EFECE2"/><circle cx="175" cy="58" r="24" fill="%23E09F3E"/><path d="M0 175 Q80 155 160 172 T240 168 L240 240 L0 240 Z" fill="%2352B788"/><circle cx="95" cy="135" r="28" fill="%232D6A4F"/><polygon points="73,115 66,92 89,110" fill="%23C86D51"/><polygon points="117,115 124,92 101,110" fill="%23C86D51"/><ellipse cx="86" cy="133" rx="3.5" ry="5" fill="%23EFECE2"/><ellipse cx="104" cy="133" rx="3.5" ry="5" fill="%23EFECE2"/></svg>`
  },
  {
    id: "story_dog_jump",
    startVocabIndex: 1,
    audio_url: "audio/dog.mp3",
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><rect width="240" height="240" rx="24" fill="%23EFECE2"/><path d="M0 185 Q120 165 240 185 L240 240 L0 240 Z" fill="%232D6A4F"/><circle cx="120" cy="112" r="32" fill="%23E09F3E"/><ellipse cx="88" cy="116" rx="10" ry="22" fill="%23C86D51" transform="rotate(15 88 116)"/><ellipse cx="152" cy="116" rx="10" ry="22" fill="%23C86D51" transform="rotate(-15 152 116)"/><ellipse cx="108" cy="108" rx="4" ry="5" fill="%23EFECE2"/><ellipse cx="132" cy="108" rx="4" ry="5" fill="%23EFECE2"/></svg>`
  },
  {
    id: "story_tree_bird",
    startVocabIndex: 4,
    audio_url: "audio/tree.mp3",
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><rect width="240" height="240" rx="24" fill="%23EFECE2"/><rect x="110" y="138" width="20" height="68" rx="4" fill="%23C86D51"/><circle cx="120" cy="96" r="46" fill="%232D6A4F"/><circle cx="94" cy="112" r="30" fill="%2352B788"/><circle cx="146" cy="112" r="30" fill="%2352B788"/><path d="M46 64 Q60 52 72 64 Q84 52 98 64" fill="none" stroke="%232A85A8" stroke-width="4" stroke-linecap="round"/></svg>`
  }
];

/* ============================================================
2. STATE
   ============================================================ */
let VOCAB          = FALLBACK_ITEMS;
let activeIndex    = 0;
let activeCategory = 'phoneme'; // 'phoneme' | 'syllable' | 'tone'
let currentAudio   = null;
let storyIndex     = 0;
let reviewIndex    = 0;

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

    img.onerror = function() {
      this.onerror = null;
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
  playAudio(VOCAB[activeIndex].full_audio_url);
}

/* ============================================================
10. INTERACTIVE EVENT HANDLERS
   ============================================================ */
carousel.addEventListener('click', (e) => {
  if (e.target.closest('.carousel-play-btn')) return;
  const card = e.target.closest('.carousel-card');
  if (!card) return;
  if (card.classList.contains('prev')) rotateTo(activeIndex - 1);
  if (card.classList.contains('next')) rotateTo(activeIndex + 1);
});

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

playBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  playBtn.classList.add('playing');
  playAudio(VOCAB[activeIndex].full_audio_url);
  setTimeout(() => playBtn.classList.remove('playing'), 900);
});

catBtns.forEach((btn) => {
  btn.addEventListener('click', () => setActiveCategory(btn.dataset.category));
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveCategory(btn.dataset.category);
    }
  });
});

function attachShapeListeners(panel) {
  const triggerShape = (item) => {
    if (!item || !item.dataset.audioUrl) return;
    playAudio(item.dataset.audioUrl);
    item.classList.remove('popping');
    void item.offsetWidth;
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
11. STAGE SWITCHER (Story Preview <-> Vocab Primer <-> Side-by-Side Review)
   ============================================================ */
const modeOrbs = Array.from(document.querySelectorAll('.mode-orb'));
const stages   = Array.from(document.querySelectorAll('.app-stage'));

function switchStage(stageId) {
  modeOrbs.forEach((orb) => {
    orb.classList.toggle('active', orb.dataset.stage === stageId);
  });
  stages.forEach((stage) => {
    stage.classList.toggle('active-stage', stage.id === stageId);
  });

  if (stageId === 'story-stage') renderStoryCarousel();
  if (stageId === 'review-stage') renderSideBySideReview();
}

modeOrbs.forEach((orb) => {
  orb.addEventListener('click', () => switchStage(orb.dataset.stage));
});


/* ============================================================
12. STORY PREVIEW CAROUSEL (Progressive Reveal)
   ============================================================ */
const storyCarousel = document.getElementById('story-carousel');
const storyCards    = Array.from(storyCarousel.querySelectorAll('.story-card'));
const storyPlayBtn  = storyCarousel.querySelector('.story-play-btn');
const storyEnterBtn = storyCarousel.querySelector('.story-enter-btn');
const arcDots       = Array.from(document.querySelectorAll('.arc-dot'));

function renderStoryCarousel() {
  const total   = STORY_ARCS.length;
  const prevIdx = (storyIndex - 1 + total) % total;
  const nextIdx = (storyIndex + 1) % total;

  const slots = [
    { el: storyCards[0], idx: prevIdx,    cls: 'prev veiled' },
    { el: storyCards[1], idx: storyIndex, cls: 'active'      },
    { el: storyCards[2], idx: nextIdx,    cls: 'next veiled' },
  ];

  slots.forEach(({ el, idx, cls }) => {
    el.className = `story-card ${cls}`;
    el.dataset.storyIndex = idx;
    const img = el.querySelector('.story-pic');
    img.src = STORY_ARCS[idx].svg;
  });

  arcDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === storyIndex);
  });
}

function rotateStoryTo(newIndex) {
  storyIndex = (newIndex + STORY_ARCS.length) % STORY_ARCS.length;
  renderStoryCarousel();
  playAudio(STORY_ARCS[storyIndex].audio_url);
}

storyCarousel.addEventListener('click', (e) => {
  if (e.target.closest('.story-play-btn') || e.target.closest('.story-enter-btn')) return;
  const card = e.target.closest('.story-card');
  if (!card) return;
  if (card.classList.contains('prev')) rotateStoryTo(storyIndex - 1);
  if (card.classList.contains('next')) rotateStoryTo(storyIndex + 1);
});

storyPlayBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  storyPlayBtn.classList.add('playing');
  playAudio(STORY_ARCS[storyIndex].audio_url);
  setTimeout(() => storyPlayBtn.classList.remove('playing'), 900);
});

// Transition from Story Preview directly into Level 0 Vocabulary Primer
storyEnterBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const targetVocab = STORY_ARCS[storyIndex].startVocabIndex || 0;
  switchStage('vocab-stage');
  rotateTo(targetVocab);
});


/* ============================================================
13. SIDE-BY-SIDE REVIEW LAYOUT (Sub-Word Divergence Localization)
   ============================================================ */
const reviewAnchorImg     = document.getElementById('review-anchor-img');
const learnerPhonemeList  = document.getElementById('learner-phoneme-list');
const targetPhonemeList   = document.getElementById('target-phoneme-list');
const reviewLearnerPlay   = document.getElementById('review-learner-play');
const reviewTargetPlay    = document.getElementById('review-target-play');
const reviewPrevBtn       = document.getElementById('review-prev-btn');
const reviewNextBtn       = document.getElementById('review-next-btn');

function renderSideBySideReview() {
  if (!VOCAB || VOCAB.length === 0) return;
  const word = VOCAB[reviewIndex];

  // Sensory picture anchor
  reviewAnchorImg.onerror = function() {
    this.onerror = null;
    this.src = getPlaceholderSVG(word.id);
  };
  reviewAnchorImg.src = word.visual_url || getPlaceholderSVG(word.id);

  // Pinpoint diverged phoneme index (supports lesson_data.json diverged_index or defaults to vowel)
  const phonemes = word.phonemes || [];
  let divergedIdx = typeof word.diverged_index === 'number'
    ? word.diverged_index
    : phonemes.findIndex((p) => p.kind === 'vowel');
  if (divergedIdx < 0) divergedIdx = 0;

  // Render Learner Attempt Timeline (Left)
  learnerPhonemeList.innerHTML = '';
  phonemes.forEach((ph, idx) => {
    const li = document.createElement('li');
    const isDiverged = idx === divergedIdx;
    li.className = `phoneme-item ${ph.kind}-item${isDiverged ? ' diverged' : ''}`;
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-label', 'Play learner phoneme');
    li.dataset.audioUrl = ph.learner_audio_url || ph.audio_url || word.full_audio_url;
    li.innerHTML = ph.kind === 'consonant' ? consonantSVG() : vowelSVG();
    learnerPhonemeList.appendChild(li);
  });

  // Render Native Target Timeline (Right)
  targetPhonemeList.innerHTML = '';
  phonemes.forEach((ph, idx) => {
    const li = document.createElement('li');
    const isTargetFocus = idx === divergedIdx;
    li.className = `phoneme-item ${ph.kind}-item${isTargetFocus ? ' target-highlight' : ''}`;
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-label', 'Play target phoneme');
    li.dataset.audioUrl = ph.audio_url || word.full_audio_url;
    li.innerHTML = ph.kind === 'consonant' ? consonantSVG() : vowelSVG();
    targetPhonemeList.appendChild(li);
  });
}

attachShapeListeners(learnerPhonemeList);
attachShapeListeners(targetPhonemeList);

reviewLearnerPlay.addEventListener('click', () => {
  const word = VOCAB[reviewIndex];
  playAudio(word.learner_audio_url || word.humming_audio_url || word.full_audio_url);
});

reviewTargetPlay.addEventListener('click', () => {
  const word = VOCAB[reviewIndex];
  playAudio(word.full_audio_url);
});

reviewPrevBtn.addEventListener('click', () => {
  reviewIndex = (reviewIndex - 1 + VOCAB.length) % VOCAB.length;
  renderSideBySideReview();
});

reviewNextBtn.addEventListener('click', () => {
  reviewIndex = (reviewIndex + 1) % VOCAB.length;
  renderSideBySideReview();
});


/* ============================================================
14. INITIALIZATION & DATA LOADING
   ============================================================ */
function init() {
  renderCarousel();
  renderBreakdown();
  setActiveCategory('phoneme');
  renderStoryCarousel();
  renderSideBySideReview();

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
        renderSideBySideReview();
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
