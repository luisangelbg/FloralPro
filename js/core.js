/* FloralPro — global state, navigation and shared utilities.
   No ES modules: everything hangs from window so the app also works when
   index.html is opened with a double click (file://). */

const state = {
  conv: null,          /* floral-formula convention: 'classic' | 'prenner' */
  colors: null,        /* colours of the drawings: 'natural' | 'whorl' | 'bw' */
};
window.state = state;

/* the eight blocks of the app, in navigation order */
const STEPS = [
  { n: 1, es: 'Inicio', en: 'Home', ready: true },
  { n: 2, es: 'Arma una flor', en: 'Build a flower', ready: true },
  { n: 3, es: 'Atlas de verticilos', en: 'Whorl atlas', ready: true },
  { n: 4, es: 'Familias y especies', en: 'Families and species', ready: true },
  { n: 5, es: 'Clave interactiva', en: 'Interactive key', ready: true },
  { n: 6, es: 'Autoevaluación', en: 'Self-assessment', ready: true },
  { n: 7, es: 'Gimnospermas', en: 'Gymnosperms', ready: true },
  { n: 8, es: 'Modo clase', en: 'Classroom', ready: true },
];

/* ---------------- DOM ---------------- */
function el(id) { return document.getElementById(id); }
function els(sel, root) { return [...(root || document).querySelectorAll(sel)]; }
function mk(tag, attrs, html) {
  const n = document.createElement(tag);
  if (attrs) for (const k in attrs) {
    if (k === 'class') n.className = attrs[k];
    else if (k === 'style') n.setAttribute('style', attrs[k]);
    else if (k.startsWith('on') && typeof attrs[k] === 'function') n.addEventListener(k.slice(2), attrs[k]);
    else if (attrs[k] != null) n.setAttribute(k, attrs[k]);
  }
  if (html != null) n.innerHTML = html;
  return n;
}
function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
/* bilingual inline HTML: both spans are written, CSS shows the active one */
function L2(es, en) { return `<span data-l="es">${es}</span><span data-l="en">${en}</span>`; }
function download(content, filename, mime) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = mk('a', { href: url, download: filename });
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function slug(s) {
  return String(s || 'floralpro').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^\w-]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '').toLowerCase().slice(0, 70) || 'floralpro';
}

/* Persisted preferences */
const Prefs = {
  get(k, d) { try { const v = localStorage.getItem('floralpro:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('floralpro:' + k, JSON.stringify(v)); } catch (e) { /* ignore */ } },
};
state.conv = Prefs.get('conv', 'classic');
state.colors = Prefs.get('colors', 'natural');
function setConv(c) {
  if (c !== 'classic' && c !== 'prenner') return;
  state.conv = c; Prefs.set('conv', c);
  els('.conv-seg button').forEach(b => b.classList.toggle('on', b.dataset.conv === c));
  document.dispatchEvent(new CustomEvent('convchange', { detail: { conv: c } }));
}

/* ---------------- block navigation ----------------
   The address bar keeps the block (#b4), so a teacher can share a link that
   opens the app directly on one block. */
function goStep(n, opts) {
  n = String(n);
  if (!el('panel-' + n)) n = '1';
  els('.step-panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + n));
  els('.step-btn').forEach(b => b.classList.toggle('active', b.dataset.step === n));
  document.body.classList.toggle('on-home', n === '1');
  if (!(opts && opts.keepScroll)) window.scrollTo({ top: 0, behavior: 'smooth' });
  const btn = document.querySelector('.step-btn[data-step="' + n + '"]');
  if (btn && btn.scrollIntoView) btn.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  if (!(opts && opts.fromHash)) { try { history.replaceState(null, '', '#b' + n); } catch (e) { /* file:// in some browsers */ } }
  /* common suite bar: active block (aria-current), read aloud except on the
     first paint. Guarded: the tests load core.js without labg-core.js */
  if (window.LABG) {
    LABG.setCurrentStep(n);
    if (!(opts && opts.initial)) LABG.announce(stepText('Bloque: ', 'Block: ') + stepLabel(n));
  }
  refreshStepFooters();
  document.dispatchEvent(new CustomEvent('stepchange', { detail: { step: Number(n) } }));
}
function buildStepper() {
  const nav = el('stepper');
  if (!nav) return;
  nav.innerHTML = STEPS.map(s => `<button type="button" class="step-btn" data-step="${s.n}"><span class="step-num">${s.n}</span>${L2(s.es, s.en)}${s.ready ? '' : ` <span class="soon">${L2('pronto', 'soon')}</span>`}</button>`).join('');
  els('.step-btn', nav).forEach(b => b.addEventListener('click', () => goStep(b.dataset.step)));
}
/* ---------------- common suite navigation ----------------
   Every block of FloralPro is open from the start (it is a teaching app, not
   a pipeline), so no block is ever marked «finished»: there is no order of
   work to complete. The footer of each block only offers Previous / Next. */
/* T() lives in i18n.js; without it the Spanish text is used */
const stepText = (es, en) => (typeof T === 'function' ? T(es, en) : es);
function stepLabel(n) {
  const s = STEPS.find(x => String(x.n) === String(n));
  return s ? s.n + ' · ' + stepText(s.es, s.en) : '';
}
function refreshStepFooters() {
  const bar = el('stepper');
  if (bar) bar.setAttribute('aria-label', stepText('Bloques', 'Blocks'));
  const order = STEPS.map(s => s.n);
  els('.step-panel').forEach(p => {
    const n = Number(p.id.replace('panel-', ''));
    const i = order.indexOf(n);
    if (i < 0) return;
    let f = p.querySelector(':scope > .step-footer');
    if (!f) {
      f = mk('nav', { class: 'step-footer no-print' });
      f.innerHTML = '<button type="button" class="btn btn-secondary prev"></button><button type="button" class="btn btn-primary next"></button>';
      /* data-target, not data-go: [data-go] is bound on load and also used
         inside the blocks (families, key, exam dots) */
      f.addEventListener('click', e => { const b = e.target.closest('button[data-target]'); if (b && !b.disabled) goStep(b.dataset.target); });
      p.appendChild(f);
    }
    f.setAttribute('aria-label', stepText('Bloques', 'Blocks'));
    const prev = order[i - 1], next = order[i + 1];
    const bp = f.querySelector('.prev'), bn = f.querySelector('.next');
    bp.hidden = !prev;
    if (prev) { bp.dataset.target = prev; bp.innerHTML = `← <span><small>${stepText('Anterior', 'Previous')}</small>${esc(stepLabel(prev))}</span>`; }
    bn.hidden = !next;
    if (next) { bn.dataset.target = next; bn.innerHTML = `<span><small>${stepText('Siguiente', 'Next')}</small>${esc(stepLabel(next))}</span> →`; }
  });
}

function stepFromHash() {
  const m = /^#b(\d)/.exec(location.hash || '');
  return m ? m[1] : '1';
}

/* ---------------- whorl highlighting across views ----------------
   Any element with data-org inside a container marked [data-linked] lights up
   together with the elements of the same whorl in the other views. */
const Link = {
  groups: new Map(),
  register(name, fn) { if (!Link.groups.has(name)) Link.groups.set(name, new Set()); Link.groups.get(name).add(fn); },
  set(name, org) { const g = Link.groups.get(name); if (g) g.forEach(fn => fn(org)); },
};
function highlightIn(root, org) {
  if (!root) return;
  els('.ff-o', root).forEach(n => n.classList.toggle('hl', !!org && (n.dataset.org === org || (org === 'G' && n.dataset.org === 'V'))));
  els('svg.fdiagram', root).forEach(svg => {
    svg.classList.toggle('has-hl', !!org);
    els('[data-org]', svg).forEach(n => n.classList.toggle('hl', !!org && n.getAttribute('data-org') === org));
  });
  els('svg.fsection', root).forEach(svg => {
    svg.classList.toggle('has-hl', !!org);
    els('.sc-o', svg).forEach(n => n.classList.toggle('hl', !!org && n.getAttribute('data-org') === org));
  });
  els('.desc-box p[data-org]', root).forEach(n => n.classList.toggle('hl', !!org && n.dataset.org === org));
  els('.wl[data-org]', root).forEach(n => n.classList.toggle('hl', !!org && n.dataset.org === org));
}

/* the names of the whorls */
const WHORL_NAMES = {
  E: { es: 'Epicáliz', en: 'Epicalyx' }, K: { es: 'Cáliz', en: 'Calyx' }, C: { es: 'Corola', en: 'Corolla' },
  P: { es: 'Perigonio', en: 'Perigon' }, A: { es: 'Androceo', en: 'Androecium' }, G: { es: 'Gineceo', en: 'Gynoecium' },
};

document.addEventListener('DOMContentLoaded', () => {
  buildStepper();
  const brand = el('brand');
  if (brand) brand.addEventListener('click', () => goStep(1));
  els('.conv-seg button').forEach(b => {
    b.classList.toggle('on', b.dataset.conv === state.conv);
    b.addEventListener('click', () => setConv(b.dataset.conv));
  });
  els('[data-go]').forEach(b => b.addEventListener('click', () => goStep(b.dataset.go)));
  /* common suite bar. Language and theme stay with I18N and Theme (i18n.js) */
  if (window.LABG) {
    const hb = el('helpBtn');
    if (hb) hb.addEventListener('click', () => LABG.showShortcuts());
    LABG.shortcuts([]);
    /* while a classroom presentation is on screen, Alt + arrows belong to it
       (it moves between slides): the block bar ignores them */
    window.addEventListener('keydown', e => {
      if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight') && document.body.classList.contains('playing')) e.preventDefault();
    }, true);
    LABG.bindStepKeys(n => goStep(n));
    /* nothing is lost on closing: the flower being built, saved flowers,
       presentations and exam answers are all kept in the browser, so there
       is no warning before leaving (LABG.guardUnload is not used) */
    const paintTheme = () => {
      const tb = el('themeBtn');
      if (tb && window.Theme) tb.setAttribute('aria-pressed', Theme.current() === 'dark' ? 'true' : 'false');
    };
    paintTheme();
    document.addEventListener('themechange', paintTheme);
    document.addEventListener('langchange', () => refreshStepFooters());
  }
  /* skip link: focus the content without touching the address bar (#b4 keeps the block) */
  const skip = document.querySelector('.skip-link');
  if (skip) skip.addEventListener('click', e => { e.preventDefault(); const m = el('main'); if (m) m.focus(); });
  goStep(stepFromHash(), { fromHash: true, keepScroll: true, initial: true });
  window.addEventListener('hashchange', () => goStep(stepFromHash(), { fromHash: true }));
});

Object.assign(window, { STEPS, el, els, mk, esc, L2, download, slug, Prefs, setConv, goStep, Link, highlightIn, WHORL_NAMES });
