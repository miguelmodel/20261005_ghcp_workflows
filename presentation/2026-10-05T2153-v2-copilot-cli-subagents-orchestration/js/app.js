import { runTransition, cancelTransition, killSlideTweens, clearSlideInline } from './transitions.js';
import { initAdmin } from './admin.js';

/* ============================================================
   Presentation runtime
   ============================================================ */

const TOTAL_SLIDES = 49;
const CANVAS_W = 1920;
const CANVAS_H = 1080;
const DEFAULT_THEME = 'github-cosmos';
const THEMES = [
  { id: 'github-cosmos', label: 'GitHub Cosmos' },
  { id: 'warm', label: 'Warm' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'cyberpunk', label: 'Cyberpunk' }
];
const KEYS = {
  theme: 'pres-theme',
  notes: 'pres-notes',
  hidden: 'pres-hidden-slides',
  current: 'pres-current-slide',
  slideNumber: 'pres-show-slide-number',
  sectionLabel: 'pres-show-section-label'
};
const COOLDOWN_MS = 120;
const SWIPE_PX = 50;
const EDGE_PX = 140;

const store = {
  get(key) {
    try { return window.localStorage.getItem(key); } catch { return null; }
  },
  set(key, value) {
    try { window.localStorage.setItem(key, value); } catch { /* storage unavailable */ }
  }
};

function readBool(key, fallback) {
  const v = store.get(key);
  return v === null ? fallback : v === 'true';
}

function readHidden() {
  try {
    const parsed = JSON.parse(store.get(KEYS.hidden) || '[]');
    return new Set(
      (Array.isArray(parsed) ? parsed : [])
        .map(Number)
        .filter((n) => Number.isInteger(n) && n >= 1 && n <= TOTAL_SLIDES)
    );
  } catch {
    return new Set();
  }
}

const $ = (id) => document.getElementById(id);
const els = {
  stage: $('stage'),
  scaler: $('slide-scaler'),
  container: $('slide-container'),
  counter: $('slide-counter'),
  sectionLabel: $('section-label'),
  prevBtn: $('nav-prev'),
  nextBtn: $('nav-next'),
  notesToggle: $('notes-toggle'),
  adminToggle: $('admin-toggle'),
  notesOverlay: document.querySelector('.speaker-notes-overlay'),
  snBody: document.querySelector('.speaker-notes-overlay .sn-body'),
  snHeading: document.querySelector('.speaker-notes-overlay .sn-heading'),
  snClose: document.querySelector('.speaker-notes-overlay .sn-close'),
  sr: $('sr-status')
};

const state = {
  slides: [],
  current: 1,
  theme: DEFAULT_THEME,
  notes: false,
  hidden: new Set(),
  showSlideNumber: true,
  showSectionLabel: true,
  isTransitioning: false,
  ready: false,
  printing: false,
  scale: 1
};

let admin = null;
let navToken = 0;
let readyResolve;
const readyPromise = new Promise((resolve) => { readyResolve = resolve; });

const clampSlide = (n) => Math.min(TOTAL_SLIDES, Math.max(1, Math.round(Number(n)) || 1));
const nextFrames = (count = 1) => new Promise((resolve) => {
  const step = (left) => (left <= 0 ? resolve() : requestAnimationFrame(() => step(left - 1)));
  step(count);
});

/* ---------- Slide loading ---------- */
async function loadSlides() {
  const base = import.meta.env.BASE_URL;
  const urls = Array.from({ length: TOTAL_SLIDES }, (_, i) =>
    `${base}slides/slide-${String(i + 1).padStart(3, '0')}.html`);

  const texts = await Promise.all(urls.map(async (url) => {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`Could not load ${url} (HTTP ${res.status})`);
    return res.text();
  }));

  const frag = document.createDocumentFragment();
  const slides = texts.map((html, i) => {
    const tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    const article = tpl.content.querySelector('article.slide');
    if (!article) throw new Error(`slide-${String(i + 1).padStart(3, '0')}.html has no <article class="slide">`);
    article.id = `slide-${i + 1}`;
    article.setAttribute('aria-hidden', 'true');
    article.setAttribute('aria-roledescription', 'slide');
    frag.appendChild(article);
    return article;
  });

  els.container.replaceChildren(frag);
  const domCount = els.container.querySelectorAll('article.slide').length;
  if (domCount !== TOTAL_SLIDES) {
    console.error(`[presentation] Slide count mismatch: DOM ${domCount} vs TOTAL_SLIDES ${TOTAL_SLIDES}`);
  }
  return slides;
}

function slideTitle(n) {
  const slide = state.slides[n - 1];
  const h = slide && slide.querySelector('.slide-title');
  return h ? h.textContent.replace(/\s+/g, ' ').trim() : `Slide ${n}`;
}

/* ---------- Fit: fixed 1920×1080 canvas scaled into the stage ---------- */
let fitRaf = 0;

function fit() {
  fitRaf = 0;
  const rect = els.stage.getBoundingClientRect();
  const w = rect.width || window.innerWidth;
  const h = rect.height || window.innerHeight;
  const scale = Math.max(0.05, Math.min(w / CANVAS_W, h / CANVAS_H));
  const x = (w - CANVAS_W * scale) / 2;
  const y = (h - CANVAS_H * scale) / 2;
  els.scaler.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  state.scale = scale;
  document.body.classList.add('is-fitted');
}

function scheduleFit() {
  if (!fitRaf) fitRaf = requestAnimationFrame(fit);
}

/* ---------- Theme / toggles ---------- */
function setTheme(id, persist = true) {
  const valid = THEMES.some((t) => t.id === id) ? id : DEFAULT_THEME;
  state.theme = valid;
  document.documentElement.setAttribute('data-theme', valid);
  if (persist) store.set(KEYS.theme, valid);
  if (admin) admin.sync();
}

/** The single notes-state function used by N, the notes button and Settings. */
function setNotesVisible(visible, persist = true) {
  state.notes = Boolean(visible);
  els.notesOverlay.classList.toggle('visible', state.notes);
  els.notesOverlay.setAttribute('aria-hidden', String(!state.notes));
  document.body.classList.toggle('notes-visible', state.notes);
  els.notesToggle.setAttribute('aria-pressed', String(state.notes));
  els.notesToggle.setAttribute('aria-label', state.notes ? 'Hide speaker notes (N)' : 'Show speaker notes (N)');
  els.notesToggle.title = state.notes ? 'Hide speaker notes (N)' : 'Show speaker notes (N)';
  if (persist) store.set(KEYS.notes, String(state.notes));
  renderNotes();
  scheduleFit();
  if (admin) admin.sync();
}

function setShowSlideNumber(show, persist = true) {
  state.showSlideNumber = Boolean(show);
  document.body.classList.toggle('hide-slide-number', !state.showSlideNumber);
  if (persist) store.set(KEYS.slideNumber, String(state.showSlideNumber));
  if (admin) admin.sync();
}

function setShowSectionLabel(show, persist = true) {
  state.showSectionLabel = Boolean(show);
  document.body.classList.toggle('hide-section-label', !state.showSectionLabel);
  if (persist) store.set(KEYS.sectionLabel, String(state.showSectionLabel));
  if (admin) admin.sync();
}

function persistHidden() {
  store.set(KEYS.hidden, JSON.stringify([...state.hidden].sort((a, b) => a - b)));
}

function setHiddenSlides(list) {
  state.hidden = new Set(
    (Array.isArray(list) ? list : [])
      .map(Number)
      .filter((n) => Number.isInteger(n) && n >= 1 && n <= TOTAL_SLIDES)
  );
  persistHidden();
  updateChrome();
}

function setSlideHidden(n, hidden) {
  const num = clampSlide(n);
  if (hidden) state.hidden.add(num);
  else state.hidden.delete(num);
  persistHidden();
  updateChrome();
}

/* ---------- Chrome + notes ---------- */
function renderNotes() {
  const slide = state.slides[state.current - 1];
  if (!slide || !els.snBody) return;
  const src = slide.querySelector('.speaker-notes');
  els.snHeading.textContent = `Notes · Slide ${state.current}: ${slideTitle(state.current)}`;
  els.snBody.innerHTML = src && src.innerHTML.trim() ? src.innerHTML : '<p>No speaker notes for this slide.</p>';
  els.snBody.scrollTop = 0;
}

function findVisible(from, step) {
  for (let n = from + step; n >= 1 && n <= TOTAL_SLIDES; n += step) {
    if (!state.hidden.has(n)) return n;
  }
  return null;
}

function firstVisible() {
  for (let n = 1; n <= TOTAL_SLIDES; n += 1) if (!state.hidden.has(n)) return n;
  return 1;
}

function lastVisible() {
  for (let n = TOTAL_SLIDES; n >= 1; n -= 1) if (!state.hidden.has(n)) return n;
  return TOTAL_SLIDES;
}

function visibleSlides() {
  const list = [];
  for (let n = 1; n <= TOTAL_SLIDES; n += 1) if (!state.hidden.has(n)) list.push(n);
  return list;
}

/** Counter = position among visible slides / number of visible slides. */
function counterText() {
  const visible = visibleSlides();
  const total = visible.length || TOTAL_SLIDES;
  const idx = visible.indexOf(state.current);
  if (idx === -1) {
    // Current slide is hidden (reached via an explicit jump): no visible position.
    return { text: `– / ${total}`, position: null, total };
  }
  return { text: `${idx + 1} / ${total}`, position: idx + 1, total };
}

function updateChrome() {
  const slide = state.slides[state.current - 1];
  const counter = counterText();
  els.counter.textContent = counter.text;
  els.counter.title = counter.position === null
    ? `Source slide ${state.current} (hidden from the presentation)`
    : `Source slide ${state.current}`;
  const section = slide ? slide.dataset.section || '' : '';
  els.sectionLabel.textContent = section;
  els.sectionLabel.classList.toggle('is-appendix', section === 'Appendix');
  els.prevBtn.setAttribute('aria-disabled', String(findVisible(state.current, -1) === null));
  els.nextBtn.setAttribute('aria-disabled', String(findVisible(state.current, 1) === null));
  renderNotes();
  if (state.ready) {
    store.set(KEYS.current, String(state.current));
    const pos = counter.position === null ? 'hidden slide' : `Slide ${counter.position} of ${counter.total}`;
    els.sr.textContent = `${pos}: ${slideTitle(state.current)}`;
    try {
      history.replaceState(null, '', `#${state.current}`);
    } catch { /* ignore (e.g. sandboxed frames) */ }
  }
  if (admin) admin.sync();
}

/* ---------- Navigation (single code path) ---------- */
function showInstant(target) {
  navToken += 1;
  cancelTransition();
  const n = clampSlide(target);
  state.slides.forEach((s, i) => {
    killSlideTweens(s);
    clearSlideInline(s);
    const on = i === n - 1;
    s.classList.toggle('active', on);
    s.setAttribute('aria-hidden', String(!on));
  });
  state.current = n;
  state.isTransitioning = false;
  updateChrome();
}

async function goToSlide(n, { instant = false } = {}) {
  if (!state.ready || state.printing) return false;
  const target = clampSlide(n);
  if (instant) {
    showInstant(target);
    return true;
  }
  if (state.isTransitioning) return false;
  if (target === state.current) return false;

  const oldSlide = state.slides[state.current - 1];
  const newSlide = state.slides[target - 1];
  const direction = target > state.current ? 1 : -1;
  const token = ++navToken;

  state.isTransitioning = true;
  state.current = target;
  updateChrome();

  try {
    await runTransition(oldSlide, newSlide, direction);
  } finally {
    window.setTimeout(() => {
      if (token === navToken) state.isTransitioning = false;
    }, COOLDOWN_MS);
  }
  return true;
}

function next() {
  const n = findVisible(state.current, 1);
  if (n !== null) goToSlide(n);
}

function prev() {
  const n = findVisible(state.current, -1);
  if (n !== null) goToSlide(n);
}

function first() {
  goToSlide(firstVisible());
}

function last() {
  goToSlide(lastVisible());
}

/* ---------- Fullscreen ---------- */
function toggleFullscreen() {
  const doc = document;
  const root = doc.documentElement;
  const active = doc.fullscreenElement || doc.webkitFullscreenElement;
  try {
    if (active) {
      const exit = doc.exitFullscreen || doc.webkitExitFullscreen;
      if (exit) {
        const r = exit.call(doc);
        if (r && typeof r.catch === 'function') r.catch(() => {});
      }
    } else {
      const req = root.requestFullscreen || root.webkitRequestFullscreen;
      if (req) {
        const r = req.call(root);
        if (r && typeof r.catch === 'function') r.catch(() => {});
      }
    }
  } catch { /* fullscreen not permitted */ }
}

/* ---------- Print / PDF ---------- */
let printSnapshot = null;

function preparePrint() {
  if (printSnapshot) return;
  if (state.isTransitioning) showInstant(state.current);
  cancelTransition();
  state.printing = true;
  printSnapshot = state.slides.map((el) => ({ el, style: el.getAttribute('style') }));
  let lastPrintable = null;
  state.slides.forEach((el, i) => {
    killSlideTweens(el);
    el.style.removeProperty('opacity');
    el.style.removeProperty('visibility');
    el.style.removeProperty('transform');
    el.style.removeProperty('translate');
    el.style.removeProperty('scale');
    el.style.removeProperty('rotate');
    const hidden = state.hidden.has(i + 1);
    el.classList.toggle('print-hidden', hidden);
    el.classList.remove('print-last');
    if (!hidden) lastPrintable = el;
  });
  if (lastPrintable) lastPrintable.classList.add('print-last');
  document.body.classList.add('is-printing');
}

function restorePrint() {
  if (!printSnapshot) return;
  printSnapshot.forEach(({ el, style }) => {
    el.classList.remove('print-hidden', 'print-last');
    if (style === null) el.removeAttribute('style');
    else el.setAttribute('style', style);
  });
  printSnapshot = null;
  state.printing = false;
  document.body.classList.remove('is-printing');
  scheduleFit();
}

function exportPdf() {
  preparePrint();
  requestAnimationFrame(() => {
    window.print();
  });
}

/* ---------- Idle helpers ---------- */
function waitForIdle() {
  return readyPromise.then(() => new Promise((resolve) => {
    const check = () => {
      if (state.isTransitioning) {
        window.setTimeout(check, 30);
        return;
      }
      const fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
      fonts.then(() => nextFrames(2)).then(() => resolve(getState()));
    };
    check();
  }));
}

function getState() {
  const counter = counterText();
  return {
    ready: state.ready,
    current: state.current,
    total: TOTAL_SLIDES,
    visiblePosition: counter.position,
    visibleTotal: counter.total,
    counterText: counter.text,
    domSlides: els.container.querySelectorAll('article.slide').length,
    theme: state.theme,
    notes: state.notes,
    hidden: [...state.hidden].sort((a, b) => a - b),
    showSlideNumber: state.showSlideNumber,
    showSectionLabel: state.showSectionLabel,
    isTransitioning: state.isTransitioning,
    printing: state.printing,
    scale: state.scale
  };
}

function setState(partial = {}) {
  if ('theme' in partial) setTheme(partial.theme);
  if ('notes' in partial) setNotesVisible(partial.notes);
  if ('hidden' in partial) setHiddenSlides(partial.hidden);
  if ('showSlideNumber' in partial) setShowSlideNumber(partial.showSlideNumber);
  if ('showSectionLabel' in partial) setShowSectionLabel(partial.showSectionLabel);
  if ('current' in partial) showInstant(partial.current);
  return getState();
}

/* ---------- Test hook ---------- */
const testApi = {
  ready: false,
  totalSlides: TOTAL_SLIDES,
  themes: THEMES.map((t) => t.id),
  whenReady: () => readyPromise,
  async goToSlideInstant(n) {
    await readyPromise;
    showInstant(clampSlide(n));
    await nextFrames(2);
    return getState();
  },
  goToSlide: (n) => goToSlide(n),
  next: () => next(),
  prev: () => prev(),
  waitForIdle,
  getState,
  setState,
  setTheme: (id) => { setTheme(id); return getState(); },
  setNotes: (v) => { setNotesVisible(v); return getState(); },
  setNotesVisible: (v) => { setNotesVisible(v); return getState(); },
  setHiddenSlides: (list) => { setHiddenSlides(list); return getState(); },
  setSlideHidden: (n, hidden) => { setSlideHidden(n, hidden); return getState(); },
  setShowSlideNumber: (v) => { setShowSlideNumber(v); return getState(); },
  setShowSectionLabel: (v) => { setShowSectionLabel(v); return getState(); },
  preparePrint: () => { preparePrint(); return getState(); },
  restorePrint: () => { restorePrint(); return getState(); },
  fit: () => { fit(); return state.scale; }
};
window.__PRESENTATION_TEST__ = testApi;

/* ---------- Events ---------- */
function isTypingTarget(el) {
  if (!el || el === document.body) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA' || el.isContentEditable;
}

function isActivatable(el) {
  if (!el || el === document.body) return false;
  return el.closest('button, a[href], summary, [role="button"], label') !== null;
}

function onKeyDown(e) {
  if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
  const key = e.key;
  const target = e.target;

  if (admin && admin.isOpen()) {
    if (key === 'Escape') {
      e.preventDefault();
      admin.close();
    } else if ((key === 'a' || key === 'A') && !isTypingTarget(target)) {
      e.preventDefault();
      admin.close();
    }
    return;
  }
  if (isTypingTarget(target)) return;

  switch (key) {
    case 'ArrowRight':
    case 'ArrowDown':
    case 'PageDown':
      e.preventDefault();
      next();
      break;
    case ' ':
    case 'Spacebar':
      if (isActivatable(target)) return;
      e.preventDefault();
      next();
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
    case 'PageUp':
      e.preventDefault();
      prev();
      break;
    case 'Home':
      e.preventDefault();
      first();
      break;
    case 'End':
      e.preventDefault();
      last();
      break;
    case 'f':
    case 'F':
      e.preventDefault();
      toggleFullscreen();
      break;
    case 'n':
    case 'N':
      e.preventDefault();
      setNotesVisible(!state.notes);
      break;
    case 'a':
    case 'A':
      e.preventDefault();
      if (admin) admin.open();
      break;
    default:
      break;
  }
}

function wireEvents() {
  document.addEventListener('keydown', onKeyDown);

  els.prevBtn.addEventListener('click', prev);
  els.nextBtn.addEventListener('click', next);
  els.notesToggle.addEventListener('click', () => setNotesVisible(!state.notes));
  if (els.snClose) els.snClose.addEventListener('click', () => setNotesVisible(false));

  // Edge proximity reveals the matching arrow
  document.addEventListener('mousemove', (e) => {
    const w = window.innerWidth;
    document.body.classList.toggle('near-left', e.clientX <= EDGE_PX);
    document.body.classList.toggle('near-right', e.clientX >= w - EDGE_PX);
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => {
    document.body.classList.remove('near-left', 'near-right');
  });

  // Touch swipe
  let touchStart = null;
  els.stage.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) {
      touchStart = null;
      return;
    }
    touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });
  els.stage.addEventListener('touchend', (e) => {
    if (!touchStart || !e.changedTouches.length) return;
    const dx = e.changedTouches[0].clientX - touchStart.x;
    const dy = e.changedTouches[0].clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) >= SWIPE_PX && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next();
      else prev();
    }
  }, { passive: true });

  // Refit
  window.addEventListener('resize', scheduleFit);
  if (window.visualViewport) window.visualViewport.addEventListener('resize', scheduleFit);
  document.addEventListener('fullscreenchange', scheduleFit);
  document.addEventListener('webkitfullscreenchange', scheduleFit);
  if (typeof ResizeObserver === 'function') {
    new ResizeObserver(scheduleFit).observe(els.stage);
  }

  // Print lifecycle (afterprint also fires on cancel)
  window.addEventListener('beforeprint', preparePrint);
  window.addEventListener('afterprint', restorePrint);
  if (typeof window.matchMedia === 'function') {
    const mq = window.matchMedia('print');
    const onChange = (ev) => {
      if (ev.matches) preparePrint();
      else restorePrint();
    };
    if (typeof mq.addEventListener === 'function') mq.addEventListener('change', onChange);
    else if (typeof mq.addListener === 'function') mq.addListener(onChange);
  }

  window.addEventListener('hashchange', () => {
    const m = window.location.hash.match(/^#\/?(\d+)$/);
    if (m && state.ready) goToSlide(Number(m[1]));
  });
}

/* ---------- Boot ---------- */
async function init() {
  setTheme(store.get(KEYS.theme) || DEFAULT_THEME, false);
  setShowSlideNumber(readBool(KEYS.slideNumber, true), false);
  setShowSectionLabel(readBool(KEYS.sectionLabel, true), false);
  state.hidden = readHidden();
  wireEvents();
  fit();

  try {
    state.slides = await loadSlides();
  } catch (err) {
    console.error('[presentation]', err);
    const box = document.createElement('div');
    box.className = 'deck-error';
    box.textContent = `Slides failed to load: ${err.message}`;
    els.container.replaceChildren(box);
    return;
  }

  const api = {
    themes: THEMES,
    getState,
    getSlideMeta: () => state.slides.map((_, i) => ({ number: i + 1, title: slideTitle(i + 1) })),
    setTheme: (id) => setTheme(id),
    setNotesVisible: (v) => setNotesVisible(v),
    setShowSlideNumber: (v) => setShowSlideNumber(v),
    setShowSectionLabel: (v) => setShowSectionLabel(v),
    setSlideHidden: (n, h) => setSlideHidden(n, h),
    setHiddenSlides: (list) => setHiddenSlides(list),
    goToSlide: (n) => goToSlide(n),
    exportPdf
  };
  admin = initAdmin(api);

  const hashMatch = window.location.hash.match(/^#\/?(\d+)$/);
  let start = clampSlide(hashMatch ? hashMatch[1] : (store.get(KEYS.current) || 1));
  if (!hashMatch && state.hidden.has(start)) {
    start = findVisible(start, 1) ?? findVisible(start, -1) ?? start;
  }

  state.ready = true;
  showInstant(start);
  setNotesVisible(readBool(KEYS.notes, false), false);
  fit();

  testApi.ready = true;
  readyResolve(getState());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleFit);
}

init();
