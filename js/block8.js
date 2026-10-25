/* FloralPro — Block 8: the classroom.

   Three tabs:
   · Presentation: the teacher builds a sequence of slides — flowers of the
     catalogue or of "My flowers", atlas plates, gymnosperm strobili, two
     flowers side by side, own photos, text — and projects it full screen with
     large figures. A slide can ask the group before showing the answer (the
     family, the formula, the diagram, the term): the first press of → or the
     space bar reveals, the next one goes on. Presentations are kept in the
     browser and travel as a file or a link.
   · Printable sheets: family sheets, worksheets with an answer key, strobilus
     sheets and study cards to cut out, in letter or A4, for the printer or a PDF.
   · My photos: the teacher's own photos (photos.js) with their tags, a package
     to share them or to publish them with the app. */

const B8 = (function () {
  const S = { built: false, tab: 'class', talks: [], cur: 0, kind: 'flower', play: null, work: { seed: 1 }, phSel: null, phFilter: 'all' };
  const T2 = x => Array.isArray(x) ? (I18N.lang === 'en' ? x[1] : x[0]) : (x && typeof x === 'object' ? (I18N.lang === 'en' ? (x.en || x.es) : x.es) : x);
  const Lo = o => L2(o.es, o.en);
  const Lp = p => L2(p[0], p[1]);
  const tx = (es, en) => I18N.lang === 'en' ? en : es;

  /* ---------------- things a slide can show ---------------- */
  const famFlowers = id => { const f = Fam.byId(id); return f ? Fam.allFlowers(f) : []; };
  function flowerName(x) {
    if (x.kind === 'typical') return x.label ? `${L2('Típica', 'Typical')}: ${Lo(x.label)}` : L2('Flor típica', 'Typical flower');
    if (x.kind === 'variant') return Lo(x.label);
    return `<i>${esc(x.sp.sci)}</i>${x.label ? ' · ' + Lo(x.label) : ''}`;
  }
  /* a flower reference: { fam, fi } from the catalogue, or { m, name } saved in the builder */
  function flowerOf(ref) {
    if (ref.m) return { m: ref.m, name: esc(ref.name || tx('Mi flor', 'My flower')), fam: null };
    const f = Fam.byId(ref.fam), x = famFlowers(ref.fam)[ref.fi || 0];
    if (!f || !x) return null;
    return { m: x.m, fam: f, x, name: `${esc(f.name)} <span class="muted">· ${flowerName(x)}</span>` };
  }
  const MODES = {
    flower: [['show', 'Mostrar todo', 'Show everything'], ['fam', 'Preguntar la familia', 'Ask for the family'], ['formula', 'Preguntar la fórmula', 'Ask for the formula'], ['diagram', 'Preguntar el diagrama', 'Ask for the diagram']],
    plate: [['show', 'Mostrar todo', 'Show everything'], ['term', 'Preguntar el término', 'Ask for the term']],
    strob: [['show', 'Mostrar todo', 'Show everything'], ['group', 'Preguntar el grupo', 'Ask for the group']],
    photo: [['show', 'Mostrar todo', 'Show everything'], ['fam', 'Preguntar qué es', 'Ask what it is']],
    cmp: [['show', 'Mostrar todo', 'Show everything']],
    text: [['show', 'Mostrar todo', 'Show everything']],
  };
  const KINDS = [['flower', 'Flor', 'Flower'], ['plate', 'Lámina del atlas', 'Atlas plate'], ['strob', 'Gimnosperma', 'Gymnosperm'], ['cmp', 'Comparar dos flores', 'Compare two flowers'], ['photo', 'Foto', 'Photo'], ['text', 'Texto', 'Text']];
  const plateById = id => ATLAS.PLATES.find(p => p.id === id) || null;
  const strobName = s => { const m = GYMNO.byId(s.id), e = m && GYMNO.exById(m.ex); return e ? `<i>${esc(e.sci)}</i> <span class="muted">· ${esc(GYMNO.grpById(e.grp).name)} · ${m.sex === 'm' ? L2('masculino', 'male') : (s.stage === 'pol' ? L2('femenino, en la polinización', 'female, at pollination') : L2('femenino, maduro', 'female, ripe'))}</span>` : '?'; };
  function slideName(s) {
    switch (s.k) {
      case 'flower': { const f = flowerOf(s.ref); return f ? f.name : '?'; }
      case 'plate': { const p = plateById(s.id); return p ? Lp(p.t) : '?'; }
      case 'strob': return strobName(s);
      case 'cmp': { const a = flowerOf(s.a), b = flowerOf(s.b); return `${a ? a.name : '?'} <span class="muted">↔</span> ${b ? b.name : '?'}`; }
      case 'photo': { const p = Photos.byId(s.id); return p ? esc(Photos.label(p)) + (p.cap ? ` <span class="muted">· ${esc(p.cap)}</span>` : '') : L2('(foto que no está en este navegador)', '(photo not in this browser)'); }
      case 'text': return esc(s.title || tx('Texto', 'Text'));
    }
    return '?';
  }
  const kindName = k => Lp(KINDS.find(x => x[0] === k).slice(1));

  /* ---------------- presentations kept in the browser ---------------- */
  const load = () => { const t = Prefs.get('talks', []); return Array.isArray(t) ? t : []; };
  const save = () => Prefs.set('talks', S.talks.slice(0, 40));
  const cur = () => S.talks[S.cur];
  function newTalk(title) { S.talks.unshift({ title: title || tx('Nueva presentación', 'New presentation'), slides: [], t: Date.now() }); S.cur = 0; save(); }
  function b64u(s) { const b = new TextEncoder().encode(s); let bin = ''; b.forEach(c => { bin += String.fromCharCode(c); }); return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function unb64u(s) { const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)); return new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0))); }
  function validTalk(o) { return o && typeof o.title === 'string' && Array.isArray(o.slides) && o.slides.every(s => s && MODES[s.k]); }
  function addTalk(o) { S.talks.unshift({ title: o.title, slides: o.slides, t: Date.now() }); S.cur = 0; save(); }

  function renderClass() {
    const box = el('p8Class');
    if (!S.talks.length) newTalk(tx('Mi primera presentación', 'My first presentation'));
    const t = cur();
    box.innerHTML = `
      <div class="p8-bar card">
        <select class="sel" id="p8Talk" aria-label="${T('Presentación', 'Presentation')}" data-es-title="Presentación" data-en-title="Presentation">${S.talks.map((x, i) => `<option value="${i}"${i === S.cur ? ' selected' : ''}>${esc(x.title)} (${x.slides.length})</option>`).join('')}</select>
        <button class="btn btn-ghost btn-sm" data-p8="new">+ ${L2('Nueva', 'New')}</button>
        <input class="at-search p8-title" id="p8Title" value="${esc(t.title)}" aria-label="${T('Título de la presentación', 'Title of the presentation')}" data-es-title="Título de la presentación" data-en-title="Title of the presentation" data-es-ph="Título de la presentación" data-en-ph="Title of the presentation">
        <button class="btn btn-primary" data-p8="play"${t.slides.length ? '' : ' disabled'}>▶ ${L2('Presentar', 'Present')}</button>
        <span class="p8-bar-r">
          <button class="btn btn-ghost btn-sm" data-p8="export">${L2('Guardar como archivo', 'Save as a file')}</button>
          <label class="btn btn-ghost btn-sm p8-file">${L2('Abrir archivo', 'Open a file')}<input type="file" id="p8File" accept=".json,application/json"></label>
          <button class="btn btn-ghost btn-sm" data-p8="link">${L2('Copiar enlace', 'Copy link')}</button>
          <button class="btn btn-ghost btn-sm" data-p8="del">${L2('Borrar', 'Delete')}</button>
        </span>
        <span class="q-msg" id="p8Msg"></span>
      </div>
      <div class="p8-cols">
        <section class="card p8-slides">
          <h3>${L2('Diapositivas', 'Slides')} <span class="at-n">${t.slides.length}</span></h3>
          ${t.slides.length ? `<ol class="p8-list" id="p8List">${t.slides.map((s, i) => slideRow(s, i, t.slides.length)).join('')}</ol>` : `<p class="hint">${L2('Todavía no hay diapositivas: añádelas con el panel de la derecha o genera una ronda de preguntas.', 'No slides yet: add them with the panel on the right or generate a round of questions.')}</p>`}
          <p class="hint">${L2('Al presentar: → o la barra espaciadora revelan la respuesta y luego avanzan; ← regresa; B oscurece la pantalla; F pantalla completa; Esc sale.', 'While presenting: → or the space bar reveal the answer and then move on; ← goes back; B blanks the screen; F full screen; Esc leaves.')}</p>
        </section>
        <section class="card p8-add">
          <h3>${L2('Añadir', 'Add')}</h3>
          <div class="seg p8-kinds" id="p8Kinds">${KINDS.map(k => `<button data-k="${k[0]}"${k[0] === S.kind ? ' class="on"' : ''}>${L2(k[1], k[2])}</button>`).join('')}</div>
          <div id="p8Form" class="p8-form">${formHTML(S.kind)}</div>
          <h4>${L2('Ronda de preguntas al grupo', 'A round of questions for the group')}</h4>
          <div class="p8-gen">
            <label>${L2('Flores al azar', 'Random flowers')} <select class="sel" id="p8GenN">${[5, 8, 10, 15].map(n => `<option${n === 8 ? ' selected' : ''}>${n}</option>`).join('')}</select></label>
            <label>${L2('Nivel', 'Level')} <select class="sel" id="p8GenL">${QUIZ.LEVELS.map(l => `<option value="${l.id}">${esc(T2(l))}</option>`).join('')}</select></label>
            <label>${L2('Preguntar', 'Ask for')} <select class="sel" id="p8GenM">${MODES.flower.slice(1).map(o => `<option value="${o[0]}">${esc(tx(o[1], o[2]))}</option>`).join('')}</select></label>
            <button class="btn btn-secondary btn-sm" data-p8="gen">${L2('Añadir la ronda', 'Add the round')}</button>
          </div>
        </section>
      </div>`;
    I18N.apply(box);
    fillForm();
  }
  function slideRow(s, i, n) {
    const modes = MODES[s.k];
    return `<li data-i="${i}"><span class="p8-kind">${kindName(s.k)}</span><span class="p8-name">${slideName(s)}</span>
      ${modes.length > 1 ? `<select class="sel sel-sm p8-mode" data-i="${i}">${modes.map(o => `<option value="${o[0]}"${o[0] === (s.mode || 'show') ? ' selected' : ''}>${esc(tx(o[1], o[2]))}</option>`).join('')}</select>` : '<span></span>'}
      <span class="p8-acts"><button class="icon-btn sm" data-mv="-1" data-i="${i}"${i === 0 ? ' disabled' : ''} title="↑">↑</button><button class="icon-btn sm" data-mv="1" data-i="${i}"${i === n - 1 ? ' disabled' : ''} title="↓">↓</button>
      <button class="icon-btn sm" data-from="${i}" data-es-title="Presentar desde aquí" data-en-title="Present from here" title="Presentar desde aquí">▶</button><button class="icon-btn sm" data-rm="${i}" data-es-title="Quitar" data-en-title="Remove" title="Quitar">✕</button></span></li>`;
  }
  const famOptions = sel => FAMILIES.map(f => `<option value="${f.id}"${f.id === sel ? ' selected' : ''}>${esc(f.name)} — ${esc(T2({ es: f.es, en: f.en }))}</option>`).join('');
  const modeSelect = (k, id) => `<label>${L2('Modo', 'Mode')} <select class="sel" id="${id}">${MODES[k].map(o => `<option value="${o[0]}">${esc(tx(o[1], o[2]))}</option>`).join('')}</select></label>`;
  function formHTML(k) {
    const my = Prefs.get('myflowers', []);
    switch (k) {
      case 'flower': return `
        <label>${L2('Familia', 'Family')} <select class="sel" id="p8Fam">${famOptions(FAMILIES[0].id)}</select></label>
        <label>${L2('Flor', 'Flower')} <select class="sel" id="p8Fl"></select></label>
        ${my.length ? `<label>${L2('o una de «Mis flores»', 'or one of "My flowers"')} <select class="sel" id="p8My"><option value="">—</option>${my.map((x, i) => `<option value="${i}">${esc(x.name)}</option>`).join('')}</select></label>` : ''}
        ${modeSelect('flower', 'p8Mode')}
        <button class="btn btn-primary btn-sm" data-p8="add">${L2('Añadir', 'Add')}</button>`;
      case 'plate': return `
        <label>${L2('Sección', 'Section')} <select class="sel" id="p8Sec">${ATLAS.SECTIONS.map(s => `<option value="${s.id}">${esc(T2(s.t))}</option>`).join('')}</select></label>
        <label>${L2('Lámina', 'Plate')} <select class="sel" id="p8Pl"></select></label>
        ${modeSelect('plate', 'p8Mode')}
        <button class="btn btn-primary btn-sm" data-p8="add">${L2('Añadir', 'Add')}</button> <button class="btn btn-ghost btn-sm" data-p8="addsec">${L2('Añadir toda la sección', 'Add the whole section')}</button>`;
      case 'strob': return `
        <label>${L2('Ejemplo', 'Example')} <select class="sel" id="p8Ex">${GYMNO.EXAMPLES.map(e => `<option value="${e.id}">${esc(e.sci)} — ${esc(GYMNO.grpById(e.grp).name)}</option>`).join('')}</select></label>
        <label>${L2('Estructura', 'Structure')} <select class="sel" id="p8Sx"><option value="f:mat">${esc(tx('Femenina, madura', 'Female, ripe'))}</option><option value="f:pol">${esc(tx('Femenina, en la polinización', 'Female, at pollination'))}</option><option value="m:mat">${esc(tx('Masculina', 'Male'))}</option></select></label>
        ${modeSelect('strob', 'p8Mode')}
        <button class="btn btn-primary btn-sm" data-p8="add">${L2('Añadir', 'Add')}</button>`;
      case 'cmp': return `
        <label>${L2('Familia A', 'Family A')} <select class="sel" id="p8FamA">${famOptions('liliaceae')}</select></label>
        <label>${L2('Familia B', 'Family B')} <select class="sel" id="p8FamB">${famOptions('amaryllidaceae')}</select></label>
        <p class="hint">${L2('Se comparan las flores típicas de las dos familias.', 'The typical flowers of both families are compared.')}</p>
        <button class="btn btn-primary btn-sm" data-p8="add">${L2('Añadir', 'Add')}</button>`;
      case 'photo': {
        const ph = Photos.list();
        if (!ph.length) return `<p class="hint">${L2('Aún no hay fotos. Agrégalas en la pestaña «Mis fotos».', 'No photos yet. Add them in the "My photos" tab.')}</p>`;
        return `<div class="p8-phpick">${ph.map(p => `<button class="ph-th" data-pick="${p.id}" title="${esc(Photos.label(p))}"><img src="${p.th || p.src}" alt=""></button>`).join('')}</div>
          ${modeSelect('photo', 'p8Mode')}
          <button class="btn btn-primary btn-sm" data-p8="add">${L2('Añadir la foto elegida', 'Add the chosen photo')}</button>`;
      }
      case 'text': return `
        <label>${L2('Título', 'Title')} <input class="at-search" id="p8TxT"></label>
        <label>${L2('Texto (una línea por párrafo)', 'Text (one line per paragraph)')} <textarea class="at-search p8-ta" id="p8TxB" rows="4"></textarea></label>
        <button class="btn btn-primary btn-sm" data-p8="add">${L2('Añadir', 'Add')}</button>`;
    }
    return '';
  }
  function fillForm() {
    if (el('p8Fam')) { const fl = famFlowers(el('p8Fam').value); el('p8Fl').innerHTML = fl.map((x, i) => `<option value="${i}">${esc(stripTags(flowerNameText(x)))}</option>`).join(''); }
    if (el('p8Sec')) { const ps = ATLAS.PLATES.filter(p => p.sec === el('p8Sec').value); el('p8Pl').innerHTML = ps.map(p => `<option value="${p.id}">${esc(T2(p.t))}</option>`).join(''); }
  }
  const stripTags = s => String(s).replace(/<[^>]+>/g, '');
  function flowerNameText(x) {
    if (x.kind === 'typical') return x.label ? tx('Típica', 'Typical') + ': ' + T2(x.label) : tx('Flor típica', 'Typical flower');
    if (x.kind === 'variant') return T2(x.label);
    return x.sp.sci + (x.label ? ' · ' + T2(x.label) : '');
  }
  function readSlide() {
    const mode = el('p8Mode') ? el('p8Mode').value : 'show';
    switch (S.kind) {
      case 'flower': {
        const my = el('p8My') && el('p8My').value !== '' ? Prefs.get('myflowers', [])[+el('p8My').value] : null;
        if (my) return { k: 'flower', ref: { m: my.m, name: my.name }, mode };
        return { k: 'flower', ref: { fam: el('p8Fam').value, fi: +el('p8Fl').value }, mode };
      }
      case 'plate': return { k: 'plate', id: el('p8Pl').value, mode };
      case 'strob': { const [sx, st] = el('p8Sx').value.split(':'); return { k: 'strob', id: el('p8Ex').value + '-' + sx, stage: st, mode }; }
      case 'cmp': return { k: 'cmp', a: { fam: el('p8FamA').value, fi: 0 }, b: { fam: el('p8FamB').value, fi: 0 }, mode: 'show' };
      case 'photo': { const p = el('p8Form').querySelector('.ph-th.on'); return p ? { k: 'photo', id: p.dataset.pick, mode } : null; }
      case 'text': { const t = el('p8TxT').value.trim(), b = el('p8TxB').value.trim(); return t || b ? { k: 'text', title: t, body: b, mode: 'show' } : null; }
    }
    return null;
  }
  function msg(h) { const m = el('p8Msg'); if (m) { m.innerHTML = h; clearTimeout(msg.t); msg.t = setTimeout(() => { if (m.isConnected) m.innerHTML = ''; }, 3500); } }
  /* a round of "which family?" questions, drawn with the self-assessment levels */
  function genRound(n, level, mode) {
    const pool = QUIZ.flowersFor(level), r = QUIZ.rng(QUIZ.newSeed());
    const out = [], used = new Set();
    for (const x of QUIZ.shuffle(r, pool)) {
      if (out.length >= n) break;
      if (used.has(x.fam)) continue;
      const fl = famFlowers(x.fam), fi = fl.findIndex(y => y.m === x.m);
      if (fi < 0) continue;
      used.add(x.fam);
      out.push({ k: 'flower', ref: { fam: x.fam, fi }, mode });
    }
    return out;
  }

  /* ---------------- the player ---------------- */
  function play(from) {
    const t = cur();
    if (!t || !t.slides.length) return;
    closePlayer();
    const P = mk('div', { class: 'pl', id: 'p8Player', tabindex: '-1' });
    P.innerHTML = `<div class="pl-top"><span class="pl-t"></span><span class="pl-n"></span></div><div class="pl-stage"></div>
      <div class="pl-bot"><button class="pl-b" data-pl="prev">←</button><button class="pl-b pl-rev" data-pl="rev">${L2('Revelar', 'Reveal')}</button><button class="pl-b" data-pl="next">→</button>
      <button class="pl-b" data-pl="fs">${L2('Pantalla completa', 'Full screen')}</button><button class="pl-b" data-pl="dark">${L2('Fondo', 'Background')}</button><button class="pl-b" data-pl="exit">${L2('Salir', 'Leave')}</button></div><div class="pl-blank"></div>`;
    document.body.appendChild(P);
    I18N.apply(P);
    S.play = { t, i: Math.max(0, Math.min(t.slides.length - 1, from || 0)), rev: false, el: P, f3d: null, blank: false, dark: Prefs.get('plDark', false) };
    P.classList.toggle('dark', S.play.dark);
    document.body.classList.add('playing');
    P.addEventListener('click', e => {
      const b = e.target.closest('[data-pl]');
      if (!b) return;
      const a = b.dataset.pl;
      if (a === 'prev') go(-1); else if (a === 'next') step(); else if (a === 'rev') reveal();
      else if (a === 'fs') toggleFS(); else if (a === 'exit') closePlayer();
      else if (a === 'dark') { S.play.dark = !S.play.dark; P.classList.toggle('dark', S.play.dark); Prefs.set('plDark', S.play.dark); }
    });
    document.addEventListener('keydown', onKey);
    showSlide();
    P.focus();
    try { if (P.requestFullscreen && !document.fullscreenElement) P.requestFullscreen().catch(() => { /* not allowed: stays as an overlay */ }); } catch (e) { /* overlay only */ }
  }
  function onKey(e) {
    if (!S.play) return;
    if (e.target.closest && e.target.closest('input, textarea, select')) return;
    const k = e.key;
    if (k === 'ArrowRight' || k === 'PageDown' || k === ' ' || k === 'Enter') { e.preventDefault(); step(); }
    else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); go(-1); }
    else if (k === 'r' || k === 'R') reveal();
    else if (k === 'b' || k === 'B' || k === '.') { S.play.blank = !S.play.blank; S.play.el.classList.toggle('blank', S.play.blank); }
    else if (k === 'f' || k === 'F') toggleFS();
    else if (k === 'Home') { S.play.i = 0; S.play.rev = false; showSlide(); }
    else if (k === 'End') { S.play.i = S.play.t.slides.length - 1; S.play.rev = false; showSlide(); }
    else if (k === 'Escape' && !document.fullscreenElement) closePlayer();
  }
  function toggleFS() {
    const P = S.play && S.play.el;
    if (!P) return;
    try { if (document.fullscreenElement) document.exitFullscreen(); else if (P.requestFullscreen) P.requestFullscreen().catch(() => {}); } catch (e) { /* not available */ }
  }
  function closePlayer() {
    if (!S.play) return;
    if (S.play.f3d) S.play.f3d.forEach(c => { try { c.destroy(); } catch (e) { /* gone */ } });
    try { if (document.fullscreenElement) document.exitFullscreen(); } catch (e) { /* ignore */ }
    S.play.el.remove();
    S.play = null;
    document.body.classList.remove('playing');
    document.removeEventListener('keydown', onKey);
  }
  const asks = s => (s.mode || 'show') !== 'show';
  function step() { if (asks(cur2()) && !S.play.rev) reveal(); else go(1); }
  const cur2 = () => S.play.t.slides[S.play.i];
  function go(d) {
    const n = S.play.t.slides.length, j = S.play.i + d;
    if (j < 0 || j >= n) return;
    S.play.i = j; S.play.rev = false; showSlide();
  }
  function reveal() { if (!S.play || S.play.rev) return; S.play.rev = true; S.play.el.querySelectorAll('.pl-hide').forEach(n => n.classList.add('shown')); S.play.el.querySelector('.pl-t').innerHTML = titleOf(cur2(), true); S.play.el.querySelector('.pl-rev').disabled = true; }
  function titleOf(s, rev) {
    const q = !rev && asks(s);
    switch (s.k) {
      case 'flower': return q ? { fam: L2('¿De qué familia es esta flor?', 'Which family is this flower from?'), formula: L2('Escriban la fórmula floral', 'Write the floral formula'), diagram: L2('Dibujen el diagrama floral de esta fórmula', 'Draw the floral diagram of this formula') }[s.mode] : slideName(s);
      case 'plate': return q ? L2('¿Cómo se llama lo que muestra la figura?', 'What is shown in the figure called?') : slideName(s);
      case 'strob': return q ? L2('¿De qué grupo de gimnospermas es?', 'Which gymnosperm group is it from?') : slideName(s);
      case 'photo': return q ? L2('¿Qué es? ¿De qué familia?', 'What is it? Which family?') : slideName(s);
      default: return slideName(s);
    }
  }
  const hide = (on, html, cls) => on ? `<div class="pl-hide ${cls || ''}"><div class="pl-q">?</div><div class="pl-a">${html}</div></div>` : html;
  function showSlide() {
    const P = S.play.el, s = cur2(), n = S.play.t.slides.length;
    if (S.play.f3d) S.play.f3d.forEach(c => { try { c.destroy(); } catch (e) { /* gone */ } });
    S.play.f3d = [];
    P.querySelector('.pl-t').innerHTML = titleOf(s, false);
    P.querySelector('.pl-n').innerHTML = `${S.play.i + 1} / ${n}`;
    P.querySelector('.pl-rev').disabled = !asks(s);
    const st = P.querySelector('.pl-stage');
    st.className = 'pl-stage pl-k-' + s.k;
    const q = asks(s);
    switch (s.k) {
      case 'flower': {
        const f = flowerOf(s.ref);
        if (!f) { st.innerHTML = '?'; break; }
        const fig = `<div class="pl-figs"><div class="pl-3d"></div><div class="pl-col"><div class="pl-paper">${Diagram.svg(f.m, { colors: 'natural' })}</div><div class="pl-paper">${Section.svg(f.m, { colors: 'natural', labels: true })}</div></div></div>`;
        const form = `<div class="pl-formula">${Formula.html(f.m, state.conv, { bracts: true, ovules: true }).replace('class="ff ', 'class="ff ff-color ')}</div>`;
        st.innerHTML = (q && s.mode === 'diagram' ? form + hide(true, fig, 'pl-hfig') : fig + hide(q && s.mode === 'formula', form));
        mount3D(st.querySelector('.pl-3d'), () => Flower3D.mount(st.querySelector('.pl-3d'), f.m, { height: 440, colors: 'natural' }), q && s.mode === 'diagram');
        break;
      }
      case 'plate': {
        const p = plateById(s.id);
        if (!p) { st.innerHTML = '?'; break; }
        const figs = (Array.isArray(p.fig) ? p.fig : [p.fig]).filter(Boolean);
        /* when asking, figures that write the answer in them are left out */
        const show = q ? figs.filter(f => f.t !== 'art') : figs;
        st.innerHTML = `<div class="pl-plate">${(show.length ? show : figs.slice(0, 1)).map(f => `<div class="pl-paper">${B3.figSVG(p, f, true)}</div>`).join('')}</div>` +
          hide(q, `<div class="pl-def"><b>${Lp(p.t)}</b>: ${Lp(p.d)}${p.x ? `<div class="muted">${L2(esc(p.x[0]), esc(p.x[1]))}</div>` : ''}</div>`);
        break;
      }
      case 'strob': {
        const m = GYMNO.byId(s.id);
        if (!m) { st.innerHTML = '?'; break; }
        st.innerHTML = `<div class="pl-figs"><div class="pl-3d"></div><div class="pl-col"><div class="pl-paper">${ConeFig.section(m, { stage: s.stage, labels: true })}</div><div class="pl-paper">${ConeFig.diagram(m, { stage: s.stage })}</div></div></div>`;
        mount3D(st.querySelector('.pl-3d'), () => Cone3D.mount(st.querySelector('.pl-3d'), m, { stage: s.stage, height: 440 }));
        break;
      }
      case 'cmp': {
        const a = flowerOf(s.a), b = flowerOf(s.b);
        st.innerHTML = [a, b].map((f, j) => f ? `<div class="pl-side"><h3>${f.name}</h3><div class="pl-3d" data-j="${j}"></div><div class="pl-paper">${Diagram.svg(f.m, { colors: 'natural' })}</div><div class="pl-formula">${Formula.html(f.m, state.conv, {}).replace('class="ff ', 'class="ff ff-color ')}</div></div>` : '<div>?</div>').join('');
        [a, b].forEach((f, j) => { if (f) mount3D(st.querySelector(`.pl-3d[data-j="${j}"]`), () => Flower3D.mount(st.querySelector(`.pl-3d[data-j="${j}"]`), f.m, { height: 260, colors: 'natural' })); });
        break;
      }
      case 'photo': {
        const p = Photos.byId(s.id);
        st.innerHTML = p ? `<figure class="pl-photo"><img src="${p.src}" alt="">${hide(q, `<figcaption><b>${esc(Photos.label(p))}</b>${p.cap ? ' — ' + esc(p.cap) : ''}</figcaption>`)}${Photos.credit(p) ? `<div class="pl-cr">${esc(Photos.credit(p))}</div>` : ''}</figure>` : `<p>${L2('Esta foto no está guardada en este navegador.', 'This photo is not stored in this browser.')}</p>`;
        break;
      }
      case 'text':
        st.innerHTML = `<div class="pl-text"><h2>${esc(s.title || '')}</h2>${String(s.body || '').split(/\n+/).filter(Boolean).map(l => `<p>${esc(l)}</p>`).join('')}</div>`;
        P.querySelector('.pl-t').innerHTML = '';
        break;
    }
    I18N.apply(P);
  }
  function mount3D(host, make, later) {
    if (!host) return;
    const c = make();
    if (c) S.play.f3d.push(c);
    if (later) host.dataset.later = '1';
  }

  /* ---------------- printable sheets ---------------- */
  const PK = [['fam', 'Ficha de familia', 'Family sheet'], ['work', 'Hoja de trabajo', 'Worksheet'], ['strob', 'Ficha de estróbilo', 'Strobilus sheet'], ['cards', 'Tarjetas de estudio', 'Study cards']];
  function renderPrint() {
    const box = el('p8Print');
    const pk = S.pk || 'fam';
    const groups = B4.GROUPS.map(G => ({ G, fams: FAMILIES.filter(f => B4.groupOf(f) === G.id) }));
    const famChecks = `<div class="p8-checks">${groups.map(g => `<fieldset class="q-grp"><legend><label class="tgl"><input type="checkbox" data-grp="${g.G.id}"> ${Lo(g.G)}</label></legend>${g.fams.map(f => `<label class="tgl"><input type="checkbox" name="p8pf" value="${f.id}"> ${esc(f.name)}</label>`).join('')}</fieldset>`).join('')}</div>`;
    const exChecks = `<div class="p8-checks one">${GYMNO.EXAMPLES.map(e => `<label class="tgl"><input type="checkbox" name="p8px" value="${e.id}" checked> <i>${esc(e.sci)}</i> <span class="muted">${esc(GYMNO.grpById(e.grp).name)}</span></label>`).join('')}</div>`;
    const opts = {
      fam: `<p class="hint">${L2('Una hoja por familia: flor típica en 3D, diagrama, corte con nombres, fórmula, descripción, caracteres, fruto y especies. Marca las familias:', 'One sheet per family: typical flower in 3D, diagram, labelled section, formula, description, characters, fruit and species. Tick the families:')}</p>
        <div class="p8-quick"><button class="btn btn-ghost btn-xs" data-pall="p8pf">${L2('Todas', 'All')}</button><button class="btn btn-ghost btn-xs" data-pnone="p8pf">${L2('Ninguna', 'None')}</button></div>${famChecks}
        <label class="tgl"><input type="checkbox" id="p8BothConv"> ${L2('Fórmula en las dos convenciones', 'Formula in both conventions')}</label>
        <label class="tgl"><input type="checkbox" id="p8BW"> ${L2('Diagramas en blanco y negro', 'Black-and-white diagrams')}</label>
        <label class="tgl"><input type="checkbox" id="p8Ph" checked> ${L2('Incluir mis fotos', 'Include my photos')}</label>`,
      work: `<p class="hint">${L2('Ejercicios con flores del catálogo, elegidas al azar por nivel; la clave de respuestas va en hojas aparte. «Otra variante» cambia las flores.', 'Exercises with catalogue flowers, drawn at random by level; the answer key comes on separate sheets. "Another variant" changes the flowers.')}</p>
        <label>${L2('Título', 'Title')} <input class="at-search" id="p8WT" value="${esc(tx('Práctica: la flor verticilo por verticilo', 'Practice: the flower whorl by whorl'))}"></label>
        <fieldset class="q-grp"><legend>${L2('Ejercicios', 'Exercises')}</legend>
          <label class="tgl"><input type="checkbox" name="p8wx" value="formula" checked> ${L2('Escribe la fórmula (con su diagrama y la flor en 3D)', 'Write the formula (with its diagram and the 3D flower)')}</label>
          <label class="tgl"><input type="checkbox" name="p8wx" value="diagram" checked> ${L2('Dibuja el diagrama en la plantilla (con su fórmula)', 'Draw the diagram on the template (with its formula)')}</label>
          <label class="tgl"><input type="checkbox" name="p8wx" value="parts" checked> ${L2('Nombra las partes del corte de la flor', 'Name the parts of the flower section')}</label>
          <label class="tgl"><input type="checkbox" name="p8wx" value="cone"> ${L2('Nombra las partes del estróbilo', 'Name the parts of the strobilus')}</label></fieldset>
        <div class="q-row"><span class="q-lab">${L2('Ejercicios', 'Exercises')}</span><select class="sel" id="p8WN">${[4, 6, 8, 10, 12].map(n => `<option${n === 6 ? ' selected' : ''}>${n}</option>`).join('')}</select>
          <span class="q-lab">${L2('Nivel', 'Level')}</span><select class="sel" id="p8WL">${QUIZ.LEVELS.map(l => `<option value="${l.id}">${esc(T2(l))}</option>`).join('')}</select>
          <button class="btn btn-ghost btn-xs" data-p8="reseed">${L2('Otra variante', 'Another variant')}</button> <span class="muted">#${S.work.seed}</span></div>
        <label class="tgl"><input type="checkbox" id="p8WKey" checked> ${L2('Incluir la clave de respuestas', 'Include the answer key')}</label>`,
      strob: `<p class="hint">${L2('Una hoja por ejemplo: estructura femenina y masculina en 3D y en corte, vista desde arriba y ficha de caracteres.', 'One sheet per example: female and male structures in 3D and in section, seen from above, and the character sheet.')}</p>
        <div class="p8-quick"><button class="btn btn-ghost btn-xs" data-pall="p8px">${L2('Todos', 'All')}</button><button class="btn btn-ghost btn-xs" data-pnone="p8px">${L2('Ninguno', 'None')}</button></div>${exChecks}`,
      cards: `<p class="hint">${L2('Ocho tarjetas por hoja: figura al frente y respuesta al reverso. Imprime a dos caras, volteando por el lado largo, y recorta por las líneas.', 'Eight cards per sheet: figure on the front and answer on the back. Print on both sides, flipping on the long edge, and cut along the lines.')}</p>
        <fieldset class="q-grp"><legend>${L2('Tarjetas de', 'Cards of')}</legend>
          <label class="tgl"><input type="checkbox" name="p8cs" value="fam" checked> ${L2('Familias (diagrama → familia y fórmula)', 'Families (diagram → family and formula)')}</label>
          <label class="tgl"><input type="checkbox" name="p8cs" value="plate"> ${L2('Términos del atlas (figura → término y definición)', 'Atlas terms (figure → term and definition)')}</label>
          <label class="tgl"><input type="checkbox" name="p8cs" value="strob"> ${L2('Gimnospermas (estróbilo → grupo y caracteres)', 'Gymnosperms (strobilus → group and characters)')}</label></fieldset>
        <label>${L2('Sección del atlas', 'Atlas section')} <select class="sel" id="p8CSec"><option value="">${esc(tx('Todas', 'All'))}</option>${ATLAS.SECTIONS.map(s => `<option value="${s.id}">${esc(T2(s.t))}</option>`).join('')}</select></label>
        <label class="tgl"><input type="checkbox" id="p8CPh" checked> ${L2('Usar mis fotos al frente cuando existan', 'Use my photos on the front when there are any')}</label>`,
    };
    box.innerHTML = `
      <div class="p8-pcols">
        <section class="card p8-popt">
          <div class="seg" id="p8PK">${PK.map(k => `<button data-pk="${k[0]}"${k[0] === pk ? ' class="on"' : ''}>${L2(k[1], k[2])}</button>`).join('')}</div>
          <div class="p8-pform">${opts[pk]}</div>
          <div class="q-row"><span class="q-lab">${L2('Papel', 'Paper')}</span><div class="seg" id="p8Paper"><button data-v="letter"${(S.paper || 'letter') === 'letter' ? ' class="on"' : ''}>${L2('Carta', 'Letter')}</button><button data-v="a4"${S.paper === 'a4' ? ' class="on"' : ''}>A4</button></div></div>
          <div class="q-nav"><button class="btn btn-secondary" data-p8="preview">${L2('Vista previa', 'Preview')}</button><button class="btn btn-primary" data-p8="print">${L2('Imprimir o guardar en PDF', 'Print or save as PDF')}</button></div>
          <p class="hint" id="p8PMsg"></p>
        </section>
        <section class="p8-prev" id="p8Pages"></section>
      </div>`;
    I18N.apply(box);
    if (pk === 'fam') { const prev = S.pfams || ['liliaceae', 'fabaceae', 'solanaceae']; els('#p8Print input[name="p8pf"]').forEach(i => { i.checked = prev.includes(i.value); }); }
  }
  const checked = name => els(`#p8Print input[name="${name}"]:checked`).map(i => i.value);
  const PAGE = { letter: [216, 279], a4: [210, 297] };
  function pages(list) { return list.map(h => `<div class="pp-page pp-${S.paper || 'letter'}">${h}<div class="pp-foot">FloralPro · ${esc(tx('la flor, verticilo por verticilo', 'the flower, whorl by whorl'))}</div></div>`).join(''); }
  function famSheet(f, o) {
    const x = Fam.allFlowers(f)[0], m = x.m;
    const conv = state.conv, other = conv === 'classic' ? 'prenner' : 'classic';
    const path = Fam.cladePath(f).map(c => T2(c)).concat([f.order]).join(' › ');
    const ph = o.photos ? Photos.forFamily(f.id).concat(Photos.list().filter(p => p.sp && f.species.some(s => s.sci === p.sp) && p.fam !== f.id)).slice(0, 3) : [];
    const colors = o.bw ? 'bw' : 'natural';
    const dense = f.species.length > 6 || ph.length > 0;
    return `<div class="${dense ? 'pp-dense' : ''}"><header class="pp-h"><h1>${esc(f.name)}</h1><div class="pp-sub">${L2(esc(f.es), esc(f.en))} · ${esc(path)}</div></header>
      <div class="pp-figs3"><div class="pp-fig">${Flower3D.staticSVG(m, { colors: o.bw ? 'whorl' : 'natural', ratio: 0.9 })}</div><div class="pp-fig">${Diagram.svg(m, { colors })}</div><div class="pp-fig">${Section.svg(m, { colors, labels: true })}</div></div>
      <div class="pp-formula">${Formula.html(m, conv, { bracts: true, ovules: true })}${o.both ? `<div class="pp-f2">${Formula.html(m, other, { bracts: true, ovules: true })}</div>` : ''}</div>
      <div class="pp-cols">
        <div><h3>${L2('Descripción de la flor típica', 'Description of the typical flower')}</h3>${FM.describe(m, I18N.lang).map(d => `<p>${d.html}</p>`).join('')}</div>
        <div><h3>${L2('Caracteres distintivos', 'Distinctive characters')}</h3><ul>${f.chars.es.map((c, i) => `<li>${L2(esc(c), esc(f.chars.en[i]))}</li>`).join('')}</ul>
          <h3>${L2('Fruto', 'Fruit')}</h3><p>${L2(esc(f.fruit.es), esc(f.fruit.en))}</p>
          <h3>${L2('En México', 'In Mexico')}</h3><p>${L2(esc(f.mx.es), esc(f.mx.en))}</p></div>
      </div>
      <table class="pp-tab"><tr><th>${L2('Especie', 'Species')}</th><th>${L2('Nombre común', 'Common name')}</th><th>${L2('Estatus', 'Status')}</th></tr>${f.species.map(s => `<tr><td><i>${esc(s.sci)}</i></td><td>${L2(esc(s.es), esc(s.en))}</td><td>${L2(esc(Fam.ST[s.st].es), esc(Fam.ST[s.st].en))}</td></tr>`).join('')}</table>
      ${ph.length ? `<div class="pp-photos">${ph.map(p => `<figure><img src="${p.src}" alt=""><figcaption>${esc(Photos.label(p))}${p.cap ? ' — ' + esc(p.cap) : ''}${Photos.credit(p) ? ' · ' + esc(Photos.credit(p)) : ''}</figcaption></figure>`).join('')}</div>` : ''}</div>`;
  }
  function strobSheet(e) {
    const g = GYMNO.grpById(e.grp), f = GYMNO.byId(e.id + '-f'), m = GYMNO.byId(e.id + '-m');
    const sheet = x => `<table class="pp-tab pp-kv">${CM.sheet(x, I18N.lang).map(r => `<tr><th>${esc(r.k)}</th><td>${esc(r.v)}</td></tr>`).join('')}</table>`;
    return `<div class="pp-strob"><header class="pp-h"><h1><i>${esc(e.sci)}</i></h1><div class="pp-sub">${L2(esc(e.es), esc(e.en))} · ${esc(g.name)} · ${esc(g.order)}</div></header>
      <p class="pp-note">${Lo(e.note)}</p>
      <div class="pp-figs3"><div class="pp-fig">${Cone3D.staticSVG(f, { stage: 'mat', ratio: 0.9 })}</div><div class="pp-fig">${ConeFig.section(f, { stage: 'mat', labels: true })}</div><div class="pp-fig">${ConeFig.diagram(f, { stage: 'mat' })}</div></div>
      <div class="pp-figs3"><div class="pp-fig">${Cone3D.staticSVG(m, { ratio: 0.9 })}</div><div class="pp-fig">${ConeFig.section(m, { labels: true })}</div><div class="pp-fig">${ConeFig.section(f, { stage: 'pol', labels: true })}<div class="pp-cap">${L2('Femenino, en la polinización', 'Female, at pollination')}</div></div></div>
      <div class="pp-cols"><div><h3>${L2('Estructura femenina', 'Female structure')}</h3>${sheet(f)}</div><div><h3>${L2('Estructura masculina', 'Male structure')}</h3>${sheet(m)}<h3>${esc(g.name)}</h3><ul>${g.chars.es.map((c, i) => `<li>${L2(esc(c), esc(g.chars.en[i]))}</li>`).join('')}</ul></div></div></div>`;
  }
  /* the labels of a section, turned into numbers for the student to fill in */
  function numbered(svg) {
    const names = [];
    const out = svg.replace(/(<text class="sc-lbl"[^>]*>)([^<]*)(<\/text>)/g, (a, o, t, c) => { names.push(t); return `${o}${names.length}. ______________${c}`; });
    return { svg: out, names };
  }
  const blankDiagram = () => `<svg class="pp-blank" viewBox="-60 -60 120 120" xmlns="http://www.w3.org/2000/svg">${[16, 28, 40, 52].map(r => `<circle r="${r}" fill="none" stroke="#bbb" stroke-width=".5" stroke-dasharray="2 2"/>`).join('')}<circle cy="-57" r="2.4" fill="none" stroke="#555" stroke-width=".8"/><path d="M-10,57 Q0,53 10,57" fill="none" stroke="#555" stroke-width="1"/><line x1="0" y1="-60" x2="0" y2="60" stroke="#ddd" stroke-width=".4"/></svg>`;
  function worksheet(o) {
    const r = QUIZ.rng(S.work.seed * 7919 + o.n);
    const pool = QUIZ.shuffle(r, QUIZ.flowersFor(o.level));
    const kinds = o.kinds.length ? o.kinds : ['formula'];
    const ex = [], keys = [];
    const cones = QUIZ.shuffle(r, GYMNO.STROBILI.filter(s => s.sex === 'f' || s.unit === 'misp'));
    let fi = 0, ci = 0;
    for (let k = 0; k < o.n; k++) {
      const kind = kinds[k % kinds.length], num = k + 1;
      const label = x => x.sci ? `<i>${esc(x.sci)}</i> (${esc(Fam.byId(x.fam).name)})` : esc(Fam.byId(x.fam).name);
      if (kind === 'cone') {
        const s = cones[ci++ % cones.length], st = s.sex === 'f' ? 'mat' : 'mat';
        const n = numbered(ConeFig.section(s, { stage: st, labels: true }));
        ex.push(`<div class="pp-ex"><div class="pp-exh">${num}. ${L2('Escribe el nombre de cada parte señalada en el corte del estróbilo.', 'Write the name of each part marked on the section of the strobilus.')}</div><div class="pp-fig tall">${n.svg}</div></div>`);
        keys.push(`<li><b>${num}.</b> <i>${esc(GYMNO.exById(s.ex).sci)}</i>: ${n.names.map((t, i) => `${i + 1}. ${esc(t)}`).join('; ')}</li>`);
        continue;
      }
      const x = pool[fi++ % pool.length];
      if (kind === 'formula') {
        ex.push(`<div class="pp-ex"><div class="pp-exh">${num}. ${L2(`Escribe la fórmula floral (convención ${state.conv === 'prenner' ? 'de Prenner' : 'clásica'}).`, `Write the floral formula (${state.conv === 'prenner' ? 'Prenner' : 'classic'} convention).`)}</div>
          <div class="pp-two"><div class="pp-fig">${Flower3D.staticSVG(x.m, { ratio: 0.9 })}</div><div class="pp-fig">${Diagram.svg(x.m, { colors: 'natural' })}</div></div><div class="pp-line"></div></div>`);
        keys.push(`<li><b>${num}.</b> ${label(x)}: <span class="pp-ktxt">${Formula.html(x.m, state.conv, {})}</span></li>`);
      } else if (kind === 'diagram') {
        ex.push(`<div class="pp-ex"><div class="pp-exh">${num}. ${L2('Dibuja el diagrama floral de esta fórmula (el eje va arriba y la bráctea abajo).', 'Draw the floral diagram of this formula (the axis goes at the top and the bract at the bottom).')}</div>
          <div class="pp-formula sm">${Formula.html(x.m, state.conv, {})}</div><div class="pp-fig">${blankDiagram()}</div></div>`);
        keys.push(`<li class="pp-kfig"><b>${num}.</b> ${label(x)}<div class="pp-fig sm">${Diagram.svg(x.m, { colors: 'bw' })}</div></li>`);
      } else {
        const n = numbered(Section.svg(x.m, { colors: 'natural', labels: true }));
        ex.push(`<div class="pp-ex"><div class="pp-exh">${num}. ${L2('Escribe el nombre de cada parte señalada en el corte de la flor.', 'Write the name of each part marked on the flower section.')}</div><div class="pp-fig tall">${n.svg}</div></div>`);
        keys.push(`<li><b>${num}.</b> ${label(x)}: ${n.names.map((t, i) => `${i + 1}. ${esc(t)}`).join('; ')}</li>`);
      }
    }
    const head = `<header class="pp-h pp-wh"><h1>${esc(o.title)}</h1><div class="pp-fields"><span>${L2('Nombre', 'Name')}: ____________________________</span><span>${L2('Grupo', 'Group')}: ________</span><span>${L2('Fecha', 'Date')}: ____________</span></div></header>`;
    const out = [];
    for (let k = 0; k < ex.length; k += 4) out.push((k === 0 ? head : '') + `<div class="pp-exgrid">${ex.slice(k, k + 4).join('')}</div>`);
    if (o.key) out.push(`<header class="pp-h"><h1>${L2('Clave de respuestas', 'Answer key')}</h1><div class="pp-sub">${esc(o.title)} · ${L2('variante', 'variant')} ${S.work.seed}</div></header><ol class="pp-key">${keys.join('')}</ol>`);
    return out;
  }
  function cards(o) {
    const items = [];
    if (o.src.includes('fam')) FAMILIES.forEach(f => {
      const m = Fam.allFlowers(f)[0].m, ph = o.photos ? Photos.forFamily(f.id)[0] : null;
      items.push({ front: ph ? `<img class="pp-cimg" src="${ph.src}" alt="">` : Diagram.svg(m, { colors: 'natural' }), back: `<b>${esc(f.name)}</b><span>${L2(esc(f.es), esc(f.en))}</span><div class="pp-ktxt">${Formula.html(m, state.conv, {})}</div>` });
    });
    if (o.src.includes('plate')) ATLAS.PLATES.filter(p => !o.sec || p.sec === o.sec).forEach(p => {
      const f = QUIZ.cleanFig(p);
      if (!f) return;
      items.push({ front: B3.figSVG(p, f), back: `<b>${Lp(p.t)}</b><span class="pp-def">${Lp(p.d)}</span>` });
    });
    if (o.src.includes('strob')) GYMNO.EXAMPLES.forEach(e => {
      const f = GYMNO.byId(e.id + '-f'), g = GYMNO.grpById(e.grp), ph = o.photos ? Photos.forGym(e.id)[0] : null;
      items.push({ front: ph ? `<img class="pp-cimg" src="${ph.src}" alt="">` : Cone3D.staticSVG(f, { ratio: 0.8 }), back: `<b><i>${esc(e.sci)}</i></b><span>${esc(g.name)} · ${L2(esc(g.es), esc(g.en))}</span><span class="pp-def">${L2(esc(g.chars.es[1]), esc(g.chars.en[1]))}</span>` });
    });
    const out = [];
    for (let k = 0; k < items.length; k += 8) {
      const chunk = items.slice(k, k + 8);
      while (chunk.length < 8) chunk.push(null);
      out.push(`<div class="pp-cards">${chunk.map(c => `<div class="pp-card">${c ? `<div class="pp-cfront">${c.front}</div>` : ''}</div>`).join('')}</div>`);
      /* backs, mirrored left to right so that each lands behind its front when flipped on the long edge */
      const back = [];
      for (let row = 0; row < 4; row++) back.push(chunk[row * 2 + 1], chunk[row * 2]);
      out.push(`<div class="pp-cards back">${back.map(c => `<div class="pp-card">${c ? `<div class="pp-cback">${c.back}</div>` : ''}</div>`).join('')}</div>`);
    }
    return out;
  }
  function buildPages() {
    const pk = S.pk || 'fam';
    let list = [];
    if (pk === 'fam') {
      const ids = checked('p8pf'); S.pfams = ids;
      const o = { both: el('p8BothConv').checked, bw: el('p8BW').checked, photos: el('p8Ph').checked };
      list = ids.map(id => famSheet(Fam.byId(id), o));
    } else if (pk === 'work') {
      list = worksheet({ title: el('p8WT').value.trim() || tx('Práctica', 'Practice'), kinds: checked('p8wx'), n: +el('p8WN').value, level: el('p8WL').value, key: el('p8WKey').checked });
    } else if (pk === 'strob') {
      list = checked('p8px').map(id => strobSheet(GYMNO.exById(id)));
    } else {
      list = cards({ src: checked('p8cs'), sec: el('p8CSec').value, photos: el('p8CPh').checked });
    }
    return list;
  }
  function preview() {
    const list = buildPages();
    el('p8Pages').innerHTML = list.length ? pages(list) : `<p class="hint">${L2('No hay nada que imprimir: marca al menos un elemento.', 'Nothing to print: tick at least one item.')}</p>`;
    el('p8PMsg').innerHTML = list.length ? L2(`${list.length} hojas.`, `${list.length} sheets.`) : '';
    I18N.apply(el('p8Pages'));
    return list.length;
  }
  function doPrint() {
    const done = preparePrint();
    if (!done) return;
    window.addEventListener('afterprint', done);
    setTimeout(() => { try { window.print(); } catch (e) { done(); } }, 60);
  }
  /* the pages go to #printArea, outside the app, and the page size to @page;
     returns the function that undoes it after printing */
  function preparePrint() {
    if (!preview()) return null;
    let area = el('printArea');
    if (!area) { area = mk('div', { id: 'printArea' }); document.body.appendChild(area); }
    area.innerHTML = el('p8Pages').innerHTML;
    const [w, h] = PAGE[S.paper || 'letter'];
    let st = el('p8PageStyle');
    if (!st) { st = mk('style', { id: 'p8PageStyle' }); document.head.appendChild(st); }
    st.textContent = `@page { size: ${w}mm ${h}mm; margin: 0; }`;
    document.body.classList.add('printing');
    const done = () => { document.body.classList.remove('printing'); area.innerHTML = ''; window.removeEventListener('afterprint', done); };
    return done;
  }

  /* ---------------- my photos ---------------- */
  function famSelect(p) {
    const gy = GYMNO.EXAMPLES.map(e => `<option value="g:${e.id}"${p.gym === e.id ? ' selected' : ''}>${esc(e.sci)} (${esc(GYMNO.grpById(e.grp).name)})</option>`).join('');
    return `<select class="sel" id="p8PhFam"><option value="">— ${esc(tx('sin familia', 'no family'))} —</option><optgroup label="${esc(tx('Angiospermas', 'Angiosperms'))}">${FAMILIES.map(f => `<option value="${f.id}"${p.fam === f.id ? ' selected' : ''}>${esc(f.name)}</option>`).join('')}</optgroup><optgroup label="${esc(tx('Gimnospermas', 'Gymnosperms'))}">${gy}</optgroup></select>`;
  }
  function spOptions(p) {
    let list = [];
    if (p.fam && Fam.byId(p.fam)) list = Fam.byId(p.fam).species.map(s => s.sci);
    else if (p.gym && GYMNO.exById(p.gym)) list = GYMNO.SPECIES.filter(s => s.grp === GYMNO.exById(p.gym).grp).map(s => s.sci);
    return `<option value="">—</option>` + list.map(s => `<option${p.sp === s ? ' selected' : ''}>${esc(s)}</option>`).join('');
  }
  function renderPhotos() {
    const box = el('p8Photos');
    const all = Photos.list();
    const f = S.phFilter;
    const shown = all.filter(p => f === 'all' || (f === 'none' ? !p.fam && !p.gym && !p.sp && !p.plate : f === 'app' ? p.b : (p.fam === f || 'g:' + p.gym === f)));
    const famsUsed = [...new Set(all.map(p => p.fam ? p.fam : p.gym ? 'g:' + p.gym : '').filter(Boolean))];
    box.innerHTML = `
      <div class="p8-phbar card">
        <label class="btn btn-primary p8-file">${L2('Agregar fotos', 'Add photos')}<input type="file" id="p8PhFiles" accept="image/*" multiple></label>
        <span class="p8-drop" id="p8Drop">${L2('…o arrástralas aquí', '…or drop them here')}</span>
        <select class="sel" id="p8PhF" aria-label="${esc(tx('Mostrar fotos', 'Show photos'))}"><option value="all">${esc(tx('Todas', 'All'))} (${all.length})</option><option value="none"${f === 'none' ? ' selected' : ''}>${esc(tx('Sin etiquetar', 'Untagged'))}</option>${all.some(p => p.b) ? `<option value="app"${f === 'app' ? ' selected' : ''}>${esc(tx('Incluidas en la app', 'Included in the app'))}</option>` : ''}${famsUsed.map(k => { const name = k.startsWith('g:') ? GYMNO.exById(k.slice(2)).sci : Fam.byId(k).name; return `<option value="${k}"${f === k ? ' selected' : ''}>${esc(name)}</option>`; }).join('')}</select>
        <span class="p8-bar-r">
          <button class="btn btn-ghost btn-sm" data-p8="phexp"${all.length ? '' : ' disabled'}>${L2('Exportar paquete', 'Export package')}</button>
          <label class="btn btn-ghost btn-sm p8-file">${L2('Importar paquete', 'Import package')}<input type="file" id="p8PhPkg" accept=".js,.json"></label>
        </span>
        <span class="q-msg" id="p8PhMsg"></span>
      </div>
      ${Photos.S.mem ? `<p class="q-warn">${L2('Este navegador no deja guardar fotos: se perderán al cerrar la página. Exporta el paquete para no perderlas.', 'This browser does not allow storing photos: they will be lost when the page is closed. Export the package to keep them.')}</p>` : ''}
      ${Photos.S.ls ? `<p class="hint">${L2('Abriste FloralPro como archivo y este navegador guarda las fotos en un espacio pequeño (caben unas decenas, a 1000 píxeles). Para guardar más y con más resolución, ábrela con «Open FloralPro.bat», o exporta el paquete de vez en cuando.', 'You opened FloralPro as a file, and this browser stores photos in a small space (a few dozen fit, at 1000 pixels). To keep more and at a higher resolution, open it with "Open FloralPro.bat", or export the package now and then.')}</p>` : ''}
      <div class="p8-phcols">
        <div class="p8-phgrid" id="p8PhGrid">${shown.length ? shown.map(p => `<button class="p8-ph${p.id === S.phSel ? ' on' : ''}" data-ph="${p.id}"><img src="${p.th || p.src}" alt=""><span>${esc(Photos.label(p))}${p.b ? ` <em class="p8-app">${esc(tx('de la app', 'app'))}</em>` : ''}</span></button>`).join('') : `<p class="hint">${all.length ? L2('Ninguna foto con este filtro.', 'No photo with this filter.') : L2('Todavía no hay fotos. Agrega las tuyas: se reducen a 1600 píxeles y se guardan solo en este navegador.', 'No photos yet. Add yours: they are reduced to 1600 pixels and stored only in this browser.')}</p>`}</div>
        <aside class="card p8-phedit" id="p8PhEdit">${editHTML()}</aside>
      </div>
      <details class="card p8-help"><summary>${L2('Cómo compartir las fotos o publicarlas con la app', 'How to share the photos or publish them with the app')}</summary>
        <ol><li>${L2('«Exportar paquete» descarga un archivo <code>floralpro-fotos.js</code> con las fotos y sus datos.', '"Export package" downloads a file <code>floralpro-fotos.js</code> with the photos and their data.')}</li>
        <li>${L2('Otro profesor lo abre con «Importar paquete».', 'Another teacher opens it with "Import package".')}</li>
        <li>${L2('Para que viajen con la app, cópialo en la carpeta <code>fotos</code> de FloralPro con el nombre <code>fotos.js</code> (reemplaza el que viene vacío). Al abrir la app aparecen como «de la app».', 'To make them travel with the app, copy it into the <code>fotos</code> folder of FloralPro as <code>fotos.js</code> (replacing the empty one). When the app opens they appear as "app" photos.')}</li>
        <li>${L2('Publica solo fotos tuyas o con una licencia que lo permita, y anota autor y licencia.', 'Publish only your own photos or ones whose licence allows it, and record the author and licence.')}</li></ol>
        <p class="hint" id="p8PhUse"></p></details>`;
    I18N.apply(box);
    Photos.usage().then(u => { const n = el('p8PhUse'); if (n) n.innerHTML = L2(`Espacio usado en este navegador: ${(u / 1048576).toFixed(1)} MB.`, `Space used in this browser: ${(u / 1048576).toFixed(1)} MB.`); });
  }
  function editHTML() {
    const p = S.phSel && Photos.byId(S.phSel);
    if (!p) return `<p class="hint">${L2('Elige una foto para ponerle familia, especie, pie, autor y licencia.', 'Pick a photo to give it a family, species, caption, author and licence.')}</p>`;
    const ro = p.b ? ' disabled' : '';
    const plates = ATLAS.SECTIONS.map(s => `<optgroup label="${esc(T2(s.t))}">${ATLAS.PLATES.filter(x => x.sec === s.id).map(x => `<option value="${x.id}"${p.plate === x.id ? ' selected' : ''}>${esc(T2(x.t))}</option>`).join('')}</optgroup>`).join('');
    return `<button class="p8-phbig" data-phview="${p.id}"><img src="${p.th || p.src}" alt=""></button>
      ${p.b ? `<p class="hint">${L2('Esta foto viene con la app (fotos/fotos.js) y no se puede editar aquí.', 'This photo comes with the app (fotos/fotos.js) and cannot be edited here.')}</p>` : ''}
      <label>${L2('Familia o gimnosperma', 'Family or gymnosperm')} ${famSelect(p).replace('<select', `<select${ro}`)}</label>
      <label>${L2('Especie', 'Species')} <select class="sel" id="p8PhSp"${ro}>${spOptions(p)}</select></label>
      <label>${L2('Parte', 'Part')} <select class="sel" id="p8PhPart"${ro}><option value="">—</option>${Photos.PARTS.map(x => `<option value="${x[0]}"${p.part === x[0] ? ' selected' : ''}>${esc(tx(x[1], x[2]))}</option>`).join('')}</select></label>
      <label>${L2('Lámina del atlas que ilustra (opcional)', 'Atlas plate it illustrates (optional)')} <select class="sel" id="p8PhPlate"${ro}><option value="">—</option>${plates}</select></label>
      <label>${L2('Pie de foto', 'Caption')} <input class="at-search" id="p8PhCap" value="${esc(p.cap || '')}"${ro}></label>
      <label>${L2('Autor', 'Author')} <input class="at-search" id="p8PhAut" value="${esc(p.author || '')}"${ro}></label>
      <label>${L2('Licencia', 'Licence')} <select class="sel" id="p8PhLic"${ro}><option value="">—</option>${Photos.LICENSES.map(l => `<option${p.lic === l ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select></label>
      <div class="q-row"><label>${L2('Fecha', 'Date')} <input class="at-search" id="p8PhDate" type="date" value="${esc(p.date || '')}"${ro}></label><label>${L2('Lugar', 'Place')} <input class="at-search" id="p8PhPlace" value="${esc(p.place || '')}"${ro}></label></div>
      ${p.b ? '' : `<div class="q-nav"><button class="btn btn-primary btn-sm" data-p8="phsave">${L2('Guardar', 'Save')}</button><button class="btn btn-ghost btn-sm" data-p8="phdel">${L2('Quitar la foto', 'Remove the photo')}</button></div>`}`;
  }
  async function addFiles(files) {
    if (!files || !files.length) return;
    const tags = S.phFilter && S.phFilter !== 'all' && S.phFilter !== 'none' && S.phFilter !== 'app' ? (S.phFilter.startsWith('g:') ? { gym: S.phFilter.slice(2) } : { fam: S.phFilter }) : {};
    const r = await Photos.add([...files], tags);
    if (r.added.length) S.phSel = r.added[0].id;
    renderPhotos();
    el('p8PhMsg').innerHTML = L2(`${r.added.length} fotos agregadas.`, `${r.added.length} photos added.`) + (r.full ? ' ' + L2('Ya no cabe más en este navegador: exporta el paquete o abre FloralPro con «Open FloralPro.bat».', 'Nothing more fits in this browser: export the package or open FloralPro with "Open FloralPro.bat".') : r.bad.length ? ' ' + L2(`No se pudieron leer: ${esc(r.bad.join(', '))}.`, `Could not be read: ${esc(r.bad.join(', '))}.`) : '');
  }

  /* ---------------- wiring ---------------- */
  function showTab(t) {
    if (!S.built) build();
    S.tab = t;
    els('#p8Tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === t));
    ['class', 'print', 'photos'].forEach(k => { el({ class: 'p8Class', print: 'p8Print', photos: 'p8Photos' }[k]).style.display = k === t ? '' : 'none'; });
    if (t === 'class') renderClass(); else if (t === 'print') renderPrint(); else renderPhotos();
  }
  function build() {
    if (S.built) return;
    S.built = true;
    S.talks = load();
    el('p8Tabs').addEventListener('click', e => { const b = e.target.closest('button[data-tab]'); if (b) showTab(b.dataset.tab); });
    const panel = el('panel-8');
    panel.addEventListener('click', e => {
      const kb = e.target.closest('#p8Kinds button');
      if (kb) { S.kind = kb.dataset.k; els('#p8Kinds button').forEach(b => b.classList.toggle('on', b === kb)); el('p8Form').innerHTML = formHTML(S.kind); I18N.apply(el('p8Form')); fillForm(); return; }
      const pick = e.target.closest('[data-pick]');
      if (pick) { els('#p8Form .ph-th').forEach(b => b.classList.toggle('on', b === pick)); return; }
      const mv = e.target.closest('[data-mv]');
      if (mv) { const i = +mv.dataset.i, j = i + +mv.dataset.mv, s = cur().slides; [s[i], s[j]] = [s[j], s[i]]; save(); renderClass(); return; }
      const rm = e.target.closest('[data-rm]');
      if (rm) { cur().slides.splice(+rm.dataset.rm, 1); save(); renderClass(); return; }
      const fr = e.target.closest('[data-from]');
      if (fr) { play(+fr.dataset.from); return; }
      const pkb = e.target.closest('#p8PK button');
      if (pkb) { S.pk = pkb.dataset.pk; renderPrint(); return; }
      const pap = e.target.closest('#p8Paper button');
      if (pap) { S.paper = pap.dataset.v; els('#p8Paper button').forEach(b => b.classList.toggle('on', b === pap)); if (el('p8Pages').innerHTML) preview(); return; }
      const all = e.target.closest('[data-pall]'), none = e.target.closest('[data-pnone]');
      if (all || none) { els(`#p8Print input[name="${(all || none).dataset[all ? 'pall' : 'pnone']}"]`).forEach(i => { i.checked = !!all; }); return; }
      const ph = e.target.closest('[data-ph]');
      if (ph && e.target.closest('#p8PhGrid')) { S.phSel = ph.dataset.ph; els('#p8PhGrid .p8-ph').forEach(b => b.classList.toggle('on', b === ph)); el('p8PhEdit').innerHTML = editHTML(); I18N.apply(el('p8PhEdit')); return; }
      const pv = e.target.closest('[data-phview]');
      if (pv) { PhotoView.open([Photos.byId(pv.dataset.phview)]); return; }
      const b = e.target.closest('[data-p8]');
      if (!b) return;
      act(b.dataset.p8, b);
    });
    panel.addEventListener('change', async e => {
      const t = e.target;
      if (t.id === 'p8Talk') { S.cur = +t.value; renderClass(); }
      else if (t.id === 'p8Fam' || t.id === 'p8Sec') fillForm();
      else if (t.classList.contains('p8-mode')) { cur().slides[+t.dataset.i].mode = t.value; save(); }
      else if (t.id === 'p8File') { const f = t.files[0]; if (f) { try { const o = JSON.parse(await f.text()); if (!validTalk(o)) throw new Error('x'); addTalk(o); renderClass(); msg(L2('Presentación abierta.', 'Presentation opened.')); } catch (err) { msg(L2('Ese archivo no es una presentación de FloralPro.', 'That file is not a FloralPro presentation.')); } } }
      else if (t.dataset.grp) els(`#p8Print fieldset input[name="p8pf"]`).filter(i => B4.groupOf(Fam.byId(i.value)) === t.dataset.grp).forEach(i => { i.checked = t.checked; });
      else if (t.id === 'p8PhFiles') { await addFiles(t.files); }
      else if (t.id === 'p8PhPkg') { const f = t.files[0]; if (f) { try { const r = await Photos.importText(await f.text()); renderPhotos(); el('p8PhMsg').innerHTML = L2(`${r.added} fotos importadas${r.dup ? `, ${r.dup} ya estaban` : ''}.`, `${r.added} photos imported${r.dup ? `, ${r.dup} were already here` : ''}.`); } catch (err) { el('p8PhMsg').innerHTML = L2('Ese archivo no es un paquete de fotos de FloralPro.', 'That file is not a FloralPro photo package.'); } } }
      else if (t.id === 'p8PhF') { S.phFilter = t.value; renderPhotos(); }
      else if (t.id === 'p8PhFam') { const v = t.value, p = { fam: v.startsWith('g:') ? '' : v, gym: v.startsWith('g:') ? v.slice(2) : '', sp: '' }; el('p8PhSp').innerHTML = spOptions(p); }
    });
    panel.addEventListener('input', e => { if (e.target.id === 'p8Title') { cur().title = e.target.value; save(); const o = el('p8Talk').options[S.cur]; if (o) o.textContent = `${e.target.value} (${cur().slides.length})`; } });
    panel.addEventListener('dragover', e => { if (e.target.closest('#p8Photos')) { e.preventDefault(); const d = el('p8Drop'); if (d) d.classList.add('on'); } });
    panel.addEventListener('dragleave', () => { const d = el('p8Drop'); if (d) d.classList.remove('on'); });
    panel.addEventListener('drop', e => { if (!e.target.closest('#p8Photos')) return; e.preventDefault(); addFiles(e.dataTransfer.files); });
    document.addEventListener('langchange', () => { if (el('panel-8').classList.contains('active')) showTab(S.tab); });
    document.addEventListener('photoschange', () => { if (S.built && S.tab === 'photos' && el('panel-8').classList.contains('active')) { /* re-rendered by the actions */ } });
  }
  async function act(a, b) {
    const t = cur();
    switch (a) {
      case 'new': newTalk(); renderClass(); el('p8Title').focus(); el('p8Title').select(); break;
      case 'play': play(0); break;
      case 'add': { const s = readSlide(); if (!s) { msg(L2('Falta elegir qué añadir.', 'Choose what to add first.')); break; } t.slides.push(s); save(); renderClass(); msg(L2('Añadida.', 'Added.')); break; }
      case 'addsec': { const sec = el('p8Sec').value, mode = el('p8Mode').value; ATLAS.PLATES.filter(p => p.sec === sec).forEach(p => t.slides.push({ k: 'plate', id: p.id, mode })); save(); renderClass(); break; }
      case 'gen': { t.slides.push(...genRound(+el('p8GenN').value, el('p8GenL').value, el('p8GenM').value)); save(); renderClass(); break; }
      case 'export': download(JSON.stringify({ app: 'FloralPro', title: t.title, slides: t.slides }, null, 1), slug(t.title) + '.clase.json', 'application/json'); break;
      case 'link': {
        const link = location.href.split('#')[0] + '#b8&p=' + b64u(JSON.stringify({ title: t.title, slides: t.slides }));
        Views.copyText(link, b);
        if (t.slides.some(s => s.k === 'photo')) msg(L2('Las fotos no viajan en el enlace: comparte también el paquete de fotos.', 'Photos do not travel in the link: share the photo package too.'));
        break;
      }
      case 'del': if (confirm(tx(`¿Borrar la presentación «${t.title}»?`, `Delete the presentation "${t.title}"?`))) { S.talks.splice(S.cur, 1); S.cur = 0; save(); renderClass(); } break;
      case 'preview': preview(); break;
      case 'print': doPrint(); break;
      case 'reseed': S.work.seed = Math.floor(Math.random() * 9000) + 1; { const y = window.scrollY; const keep = { WT: el('p8WT').value, WN: el('p8WN').value, WL: el('p8WL').value, x: checked('p8wx'), key: el('p8WKey').checked }; renderPrint(); el('p8WT').value = keep.WT; el('p8WN').value = keep.WN; el('p8WL').value = keep.WL; els('#p8Print input[name="p8wx"]').forEach(i => { i.checked = keep.x.includes(i.value); }); el('p8WKey').checked = keep.key; preview(); window.scrollTo({ top: y }); } break;
      case 'phexp': { const f = S.phFilter; const ids = f === 'all' ? null : els('#p8PhGrid [data-ph]').map(x => x.dataset.ph); download(Photos.packageText(ids), 'floralpro-fotos.js', 'text/javascript;charset=utf-8'); break; }
      case 'phsave': {
        const v = el('p8PhFam').value;
        await Photos.update(S.phSel, { fam: v.startsWith('g:') ? '' : v, gym: v.startsWith('g:') ? v.slice(2) : '', sp: el('p8PhSp').value, part: el('p8PhPart').value, plate: el('p8PhPlate').value, cap: el('p8PhCap').value.trim(), author: el('p8PhAut').value.trim(), lic: el('p8PhLic').value, date: el('p8PhDate').value, place: el('p8PhPlace').value.trim() });
        renderPhotos(); el('p8PhMsg').innerHTML = L2('Guardado.', 'Saved.'); break;
      }
      case 'phdel': if (confirm(tx('¿Quitar esta foto de este navegador?', 'Remove this photo from this browser?'))) { await Photos.remove(S.phSel); S.phSel = null; renderPhotos(); } break;
    }
  }
  /* a presentation received in a link (#b8&p=…) is added to the list */
  function fromHash() {
    const m = /[#&]p=([\w-]+)/.exec(location.hash || '');
    if (!m) return false;
    try {
      const o = JSON.parse(unb64u(m[1]));
      if (!validTalk(o)) return false;
      if (!S.built) build();
      if (!(S.talks[0] && S.talks[0].title === o.title && JSON.stringify(S.talks[0].slides) === JSON.stringify(o.slides))) addTalk(o);
      try { history.replaceState(null, '', '#b8'); } catch (e) { /* file:// */ }
      showTab('class');
      msg(L2('Presentación recibida por enlace.', 'Presentation received by link.'));
      return true;
    } catch (e) { return false; }
  }
  /* the "About" dialog, opened from the footer */
  function about() {
    const d = el('aboutDlg');
    if (!d) return;
    el('aboutBtn').addEventListener('click', e => { e.preventDefault(); try { d.showModal(); } catch (err) { d.setAttribute('open', ''); } });
    el('aboutClose').addEventListener('click', () => d.close());
    d.addEventListener('click', e => { if (e.target === d) d.close(); });
    el('aboutCopy').addEventListener('click', e => Views.copyText(el('aboutCite').textContent.replace(/\s+/g, ' ').replace('versiónversion', I18N.lang === 'en' ? 'version' : 'versión'), e.currentTarget));
  }
  function init() {
    about();
    if (!el('panel-8')) return;
    document.addEventListener('stepchange', e => { if (e.detail.step === 8) { if (!fromHash() && !S.built) showTab('class'); } });
    window.addEventListener('hashchange', () => { if (/^#b8&p=/.test(location.hash || '')) fromHash(); });
    if (el('panel-8').classList.contains('active') && !fromHash()) showTab('class');
  }
  document.addEventListener('DOMContentLoaded', init);

  return { S, showTab, play, closePlayer, step, reveal, go, buildPages, preview, preparePrint, worksheet, cards, famSheet, strobSheet, genRound, b64u, unb64u, addTalk, validTalk, act, renderPhotos, fromHash };
})();
window.B8 = B8;
