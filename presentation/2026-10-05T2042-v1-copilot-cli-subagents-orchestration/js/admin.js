/**
 * Settings panel: theme, notes, slide-number / section-label toggles,
 * go-to-slide, PDF export and the show/hide slide checklist.
 * All state changes go through the app API so keyboard, buttons and
 * this panel share one code path.
 */

const MAX_TITLE = 46;

function truncate(text, max = MAX_TITLE) {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}

export function initAdmin(api) {
  const panel = document.getElementById('admin-panel');
  const overlay = document.getElementById('admin-overlay');
  const gear = document.getElementById('admin-toggle');
  const closeBtn = document.getElementById('admin-close');
  const themeSelect = document.getElementById('admin-theme');
  const notesCheck = document.getElementById('admin-notes');
  const numberCheck = document.getElementById('admin-slide-number');
  const sectionCheck = document.getElementById('admin-section-label');
  const gotoInput = document.getElementById('admin-goto-input');
  const gotoBtn = document.getElementById('admin-goto-btn');
  const pdfBtn = document.getElementById('admin-pdf');
  const showAllBtn = document.getElementById('admin-show-all');
  const checklist = document.getElementById('admin-checklist');

  let open = false;
  let lastFocus = null;

  // ---- Theme options ----
  themeSelect.innerHTML = '';
  api.themes.forEach(({ id, label }) => {
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = label;
    themeSelect.appendChild(opt);
  });

  // ---- Checklist rows ----
  function buildChecklist() {
    checklist.innerHTML = '';
    api.getSlideMeta().forEach(({ number, title }) => {
      const li = document.createElement('li');
      li.className = 'checklist-row';
      li.dataset.number = String(number);

      const box = document.createElement('input');
      box.type = 'checkbox';
      box.className = 'admin-check';
      box.id = `admin-show-${number}`;
      box.setAttribute('aria-label', `Show slide ${number} in the presentation`);
      box.addEventListener('change', () => api.setSlideHidden(number, !box.checked));

      const label = document.createElement('label');
      label.className = 'checklist-label';
      label.htmlFor = box.id;
      const full = `Slide ${number}: ${title}`;
      label.textContent = truncate(full);
      label.title = full;

      const go = document.createElement('button');
      go.type = 'button';
      go.className = 'checklist-go';
      go.textContent = '▶';
      go.setAttribute('aria-label', `Go to slide ${number}`);
      go.addEventListener('click', () => api.goToSlide(number));

      li.append(box, label, go);
      checklist.appendChild(li);
    });
  }

  function sync() {
    const s = api.getState();
    themeSelect.value = s.theme;
    notesCheck.checked = s.notes;
    numberCheck.checked = s.showSlideNumber;
    sectionCheck.checked = s.showSectionLabel;
    gotoInput.max = String(s.total);
    const hidden = new Set(s.hidden);
    checklist.querySelectorAll('.checklist-row').forEach((row) => {
      const n = Number(row.dataset.number);
      const box = row.querySelector('input');
      const isHidden = hidden.has(n);
      box.checked = !isHidden;
      row.classList.toggle('is-hidden', isHidden);
      row.classList.toggle('is-current', n === s.current);
      if (n === s.current) row.setAttribute('aria-current', 'true');
      else row.removeAttribute('aria-current');
    });
  }

  function focusables() {
    return Array.from(panel.querySelectorAll(
      'button, select, input, [tabindex]:not([tabindex="-1"])'
    )).filter((el) => !el.disabled && el.offsetParent !== null);
  }

  function openPanel() {
    if (open) return;
    open = true;
    lastFocus = document.activeElement;
    document.body.classList.add('admin-open');
    panel.setAttribute('aria-hidden', 'false');
    panel.removeAttribute('inert');
    gear.setAttribute('aria-expanded', 'true');
    sync();
    const current = checklist.querySelector('.checklist-row.is-current');
    if (current) current.scrollIntoView({ block: 'nearest' });
    requestAnimationFrame(() => themeSelect.focus());
  }

  function closePanel() {
    if (!open) return;
    open = false;
    document.body.classList.remove('admin-open');
    panel.setAttribute('aria-hidden', 'true');
    panel.setAttribute('inert', '');
    gear.setAttribute('aria-expanded', 'false');
    const target = lastFocus && document.contains(lastFocus) ? lastFocus : gear;
    target.focus({ preventScroll: true });
  }

  function toggle() {
    if (open) closePanel();
    else openPanel();
  }

  // ---- Wiring ----
  gear.addEventListener('click', toggle);
  closeBtn.addEventListener('click', closePanel);
  overlay.addEventListener('click', closePanel);

  themeSelect.addEventListener('change', () => api.setTheme(themeSelect.value));
  notesCheck.addEventListener('change', () => api.setNotesVisible(notesCheck.checked));
  numberCheck.addEventListener('change', () => api.setShowSlideNumber(numberCheck.checked));
  sectionCheck.addEventListener('change', () => api.setShowSectionLabel(sectionCheck.checked));

  const doGoto = () => {
    const n = parseInt(gotoInput.value, 10);
    if (Number.isFinite(n)) api.goToSlide(n);
  };
  gotoBtn.addEventListener('click', doGoto);
  gotoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      doGoto();
    }
  });

  pdfBtn.addEventListener('click', () => {
    closePanel();
    api.exportPdf();
  });

  showAllBtn.addEventListener('click', () => api.setHiddenSlides([]));

  // Focus trap while open
  panel.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const items = focusables();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  panel.setAttribute('aria-hidden', 'true');
  panel.setAttribute('inert', '');
  buildChecklist();
  sync();

  return {
    open: openPanel,
    close: closePanel,
    toggle,
    isOpen: () => open,
    sync,
    rebuild() {
      buildChecklist();
      sync();
    }
  };
}
