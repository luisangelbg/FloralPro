/* FloralPro — Block 3: the whorl atlas and the glossary.

   Every plate is drawn by the same engine as the rest of the app (diagram,
   3D flower, section) from a small model that shows the variant, with the
   whorl in question highlighted; what the engine cannot draw (anther
   attachment, stigmas, inflorescences, pseudanthia…) comes from art.js.
   Figures are drawn only when they scroll into view. A plate with a model
   opens full size with the linked views, or in the flower builder.

   The glossary gathers the plates and the basic terms. Any underlined term
   (<dfn data-term>) anywhere in the app shows its definition in a small
   pop-up with a link to its plate. */

const B3 = (function () {
  const S = { built: false, views: null, obs: null, dlgPlate: null };
  const T2 = x => Array.isArray(x) ? (I18N.lang === 'en' ? x[1] : x[0]) : (x && typeof x === 'object' ? (I18N.lang === 'en' ? (x.en || x.es) : x.es) : x);
  const L = pair => L2(pair[0], pair[1]);
  const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  function resolve(m) {
    if (typeof m === 'string' && m.startsWith('sp:')) {
      const [, id, i] = m.split(':');
      const sp = SPECIMENS.find(x => x.id === id);
      return sp ? sp.flowers[+(i || 0)].m : null;
    }
    return m || null;
  }
  const plateById = id => ATLAS.PLATES.find(p => p.id === id);

  /* ---------------- glossary lookup ---------------- */
  /* a general definition (GLOSS) wins over a plate that only uses the term */
  function lookup(key) {
    if (!key) return null;
    const g = ATLAS.GLOSS[key];
    const byId = plateById(key);
    const byNeed = ATLAS.PLATES.find(p => p.need === key && p.id !== key);
    const byTerm = ATLAS.PLATES.find(p => (p.terms || []).includes(key));
    const plate = byId || byTerm || byNeed || null;
    if (g) return { key, t: [g[0][0], g[1][0]], d: [g[0][1], g[1][1]], plate };
    if (plate) return { key, t: plate.t, d: plate.d, plate };
    return null;
  }
  function glossaryEntries() {
    const out = [], seen = new Set();
    ATLAS.PLATES.forEach(p => { out.push({ key: p.id, t: p.t, d: p.d, plate: p }); seen.add(p.id); });
    Object.keys(ATLAS.GLOSS).forEach(k => { if (!seen.has(k)) { const g = ATLAS.GLOSS[k]; out.push({ key: k, t: [g[0][0], g[1][0]], d: [g[0][1], g[1][1]], plate: lookup(k).plate }); } });
    return out;
  }

  /* ---------------- figures ---------------- */
  function figSVG(p, fig, big) {
    const m = resolve(p.m);
    switch (fig.t) {
      case 'diagram': return Diagram.svg(m, { colors: fig.colors || 'whorl', only: fig.only || null, focus: fig.focus || null, allPlanes: !!fig.allPlanes });
      case '3d': return Flower3D.staticSVG(m, { colors: fig.colors || 'natural', focus: fig.focus || null, explode: fig.explode || 0, ratio: big ? 0.9 : 0.78 });
      case 'section': return Section.svg(m, { colors: fig.colors || 'natural', labels: big ? true : !!fig.labels, focus: fig.focus || null });
      case 'art': return Art.get(fig.id);
    }
    return '';
  }
  const figClass = fig => fig.t === 'diagram' || fig.t === 'section' ? 'paper' : fig.t === '3d' ? 'soft' : 'plain';
  function drawFig(box) {
    const p = plateById(box.closest('.at-card').dataset.id);
    const figs = Array.isArray(p.fig) ? p.fig : [p.fig];
    box.innerHTML = figs.map(f => `<div class="at-f1 ${figClass(f)}">${figSVG(p, f)}</div>`).join('');
    box.dataset.done = '1';
  }
  function formulaFor(p) {
    const m = resolve(p.m);
    if (!m || !p.show) return '';
    if (p.show === 'full') return Formula.html(m, state.conv).replace('class="ff ', 'class="ff ff-color ');
    const seg = Formula.segments(m, state.conv, {}).segs.find(s => s.org === p.show);
    return seg ? `<span class="ff ff-${state.conv} ff-color"><span class="ff-o" data-org="${p.show}">${seg.html}</span></span>` : '';
  }

  /* ---------------- page ---------------- */
  function cardHTML(p) {
    const m = resolve(p.m);
    return `<article class="at-card" id="pl-${p.id}" data-id="${p.id}">
      <div class="at-fig${Array.isArray(p.fig) ? ' two' : ''}"></div>
      <div class="at-body">
        <h4>${L(p.t)}</h4>
        <div class="at-form">${formulaFor(p)}</div>
        <p class="at-d">${L(p.d)}</p>
        ${p.x ? `<p class="at-x"><b>${L2('Ejemplos', 'Examples')}:</b> ${L(p.x)}</p>` : ''}
        <div class="at-act">
          <button class="btn btn-ghost btn-xs" data-act="big">${L2('Ver en grande', 'Enlarge')}</button>
          ${m ? `<button class="btn btn-ghost btn-xs" data-act="build">${L2('Abrir en el constructor', 'Open in the builder')}</button>` : ''}
        </div>
      </div>
    </article>`;
  }
  function build() {
    const root = el('b3Main');
    if (!root) return;
    const secs = ATLAS.SECTIONS.map(s => {
      const plates = ATLAS.PLATES.filter(p => p.sec === s.id);
      return `<section class="at-sec" id="at-${s.id}" data-sec="${s.id}"><h3>${L(s.t)} <span class="at-n">${plates.length}</span></h3><p class="section-sub">${L(s.d)}</p><div class="at-grid">${plates.map(cardHTML).join('')}</div></section>`;
    }).join('');
    root.innerHTML = secs + `<section class="at-sec" id="at-glossary"><h3>${L2('Glosario', 'Glossary')} <span class="at-n" id="glCount"></span></h3>
      <p class="section-sub">${L2('Todos los términos de las láminas y los básicos de la flor. En cualquier parte de la app, los términos subrayados muestran su definición al pasar el cursor.', 'Every term of the plates and the basic ones of the flower. Anywhere in the app, underlined terms show their definition when the pointer rests on them.')}</p>
      <div class="gl-letters" id="glLetters"></div><dl class="gl-list" id="glList"></dl></section>`;
    el('b3Nav').innerHTML = ATLAS.SECTIONS.map(s => `<a href="#" data-sec="${s.id}">${L(s.t)}</a>`).join('') + `<a href="#" data-sec="glossary">${L2('Glosario', 'Glossary')}</a>`;
    glossary();
    observe();
    S.built = true;
  }
  function observe() {
    if (S.obs) S.obs.disconnect();
    const boxes = els('#b3Main .at-fig');
    if (!('IntersectionObserver' in window)) { boxes.forEach(drawFig); return; }
    S.obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting && !e.target.dataset.done) { drawFig(e.target); S.obs.unobserve(e.target); } }), { rootMargin: '400px 0px' });
    boxes.forEach(b => { if (!b.dataset.done) S.obs.observe(b); });
  }
  function glossary() {
    const lang = I18N.lang === 'en' ? 1 : 0;
    const q = norm(el('b3Search') ? el('b3Search').value : '');
    const list = glossaryEntries()
      .filter(e => !q || norm(e.t.join(' ') + ' ' + e.d.join(' ')).includes(q))
      .sort((a, b) => norm(a.t[lang]).localeCompare(norm(b.t[lang])));
    const letters = [...new Set(list.map(e => norm(e.t[lang])[0].toUpperCase()))];
    el('glLetters').innerHTML = letters.map(l => `<a href="#" data-l="${l}">${l}</a>`).join('');
    el('glCount').textContent = list.length;
    let cur = '';
    el('glList').innerHTML = list.map(e => {
      const l = norm(e.t[lang])[0].toUpperCase();
      const head = l !== cur ? `<div class="gl-letter" id="gl-${l}">${l}</div>` : '';
      cur = l;
      return head + `<div class="gl-item" id="gl-${e.key}"><dt>${esc(e.t[lang])}</dt><dd>${esc(e.d[lang])}${e.plate ? ` <a href="#" class="gl-go" data-plate="${e.plate.id}">${L2('ver lámina', 'see plate')} →</a>` : ''}</dd></div>`;
    }).join('');
  }
  function search() {
    const q = norm(el('b3Search').value);
    els('#b3Main .at-card').forEach(c => {
      const p = plateById(c.dataset.id);
      const txt = norm([p.t.join(' '), p.d.join(' '), (p.x || []).join(' ')].join(' '));
      c.style.display = !q || txt.includes(q) ? '' : 'none';
    });
    els('#b3Main .at-sec[data-sec]').forEach(s => {
      const vis = els('.at-card', s).filter(c => c.style.display !== 'none').length;
      s.style.display = vis ? '' : 'none';
    });
    glossary();
    el('b3Empty').style.display = q && !els('#b3Main .at-card').some(c => c.style.display !== 'none') && !el('glList').children.length ? '' : 'none';
    observe();
  }
  function goPlate(id) {
    goStep(3);
    if (!S.built) build();
    const c = el('pl-' + id);
    if (!c) return;
    if (el('b3Search').value) { el('b3Search').value = ''; search(); }
    setTimeout(() => {
      c.scrollIntoView({ behavior: 'smooth', block: 'center' });
      c.classList.remove('flash'); void c.offsetWidth; c.classList.add('flash');
    }, 60);
  }

  /* ---------------- plate full size ---------------- */
  function openPlate(id) {
    const p = plateById(id);
    const dlg = el('b3Dlg');
    const m = resolve(p.m);
    S.dlgPlate = p;
    el('b3DlgTitle').innerHTML = L(p.t);
    el('b3DlgText').innerHTML = `<p>${L(p.d)}</p>${p.x ? `<p class="at-x"><b>${L2('Ejemplos', 'Examples')}:</b> ${L(p.x)}</p>` : ''}${window.Photos ? PhotoView.strip(Photos.forPlate(p.id), L2('Mis fotos', 'My photos')) : ''}`;
    el('b3DlgBuild').style.display = m ? '' : 'none';
    const vbox = el('b3DlgViews'), abox = el('b3DlgArt');
    if (m) {
      abox.style.display = 'none'; vbox.style.display = '';
      if (!S.views) S.views = Views.create(vbox, { model: m, name: 'floralpro', fileName: () => T2(S.dlgPlate.t) });
      else S.views.set(m);
    } else {
      vbox.style.display = 'none'; abox.style.display = '';
      const figs = Array.isArray(p.fig) ? p.fig : [p.fig];
      abox.innerHTML = figs.map(f => `<div class="at-f1 ${figClass(f)}">${figSVG(p, f, true)}</div>`).join('');
    }
    if (dlg.showModal) { if (!dlg.open) dlg.showModal(); } else dlg.setAttribute('open', '');
  }
  function toBuilder(id) {
    const p = plateById(id);
    const m = resolve(p.m);
    if (!m) return;
    const d = el('b3Dlg'); if (d.open) d.close();
    B2.load(m, T2(p.t));
    goStep(2);
  }

  /* ---------------- definitions of underlined terms, everywhere ---------------- */
  const Pop = { box: null, timer: 0, hideT: 0, target: null };
  function popShow(d, pinned) {
    const e = lookup(d.dataset.term);
    if (!e) return;
    if (!Pop.box) {
      Pop.box = mk('div', { class: 'gl-pop', role: 'tooltip' });
      document.body.appendChild(Pop.box);
      Pop.box.addEventListener('mouseenter', () => clearTimeout(Pop.hideT));
      Pop.box.addEventListener('mouseleave', () => popHide(200));
      Pop.box.addEventListener('click', ev => {
        const a = ev.target.closest('[data-plate]');
        if (a) { ev.preventDefault(); popHide(0); goPlate(a.dataset.plate); return; }
        const g = ev.target.closest('[data-g7term]');
        if (g) { ev.preventDefault(); popHide(0); B7.showTerm(g.dataset.g7term); }
      });
    }
    Pop.target = d;
    const g7 = !e.plate && window.B7 && B7.termLink(e.key) && !d.closest('#panel-7');
    Pop.box.innerHTML = `<b>${esc(T2(e.t))}</b><p>${esc(T2(e.d))}</p>${e.plate && !(el('panel-3').classList.contains('active') && d.closest('#pl-' + e.plate.id)) ? `<a href="#" data-plate="${e.plate.id}">${L2('Ver en el atlas', 'See in the atlas')} →</a>` : ''}${g7 ? `<a href="#" data-g7term="${esc(e.key)}">${L2('Ver en Gimnospermas', 'See in Gymnosperms')} →</a>` : ''}`;
    Pop.box.classList.add('on');
    const r = d.getBoundingClientRect(), bw = Math.min(300, window.innerWidth - 20);
    Pop.box.style.width = bw + 'px';
    let x = r.left + r.width / 2 - bw / 2;
    x = Math.max(10, Math.min(window.innerWidth - bw - 10, x));
    const bh = Pop.box.offsetHeight;
    let y = r.bottom + 8;
    if (y + bh > window.innerHeight - 8) y = Math.max(8, r.top - bh - 8);
    Pop.box.style.left = x + 'px'; Pop.box.style.top = y + 'px';
    Pop.box.dataset.pinned = pinned ? '1' : '';
  }
  function popHide(delay) {
    clearTimeout(Pop.hideT);
    Pop.hideT = setTimeout(() => { if (Pop.box) Pop.box.classList.remove('on'); Pop.target = null; }, delay == null ? 250 : delay);
  }
  document.addEventListener('mouseover', e => {
    const d = e.target.closest && e.target.closest('dfn[data-term]');
    if (!d) return;
    clearTimeout(Pop.hideT); clearTimeout(Pop.timer);
    Pop.timer = setTimeout(() => popShow(d), 180);
  });
  document.addEventListener('mouseout', e => {
    const d = e.target.closest && e.target.closest('dfn[data-term]');
    if (!d) return;
    clearTimeout(Pop.timer);
    if (!(Pop.box && Pop.box.dataset.pinned)) popHide();
  });
  document.addEventListener('click', e => {
    const d = e.target.closest && e.target.closest('dfn[data-term]');
    if (d) { popShow(d, true); return; }
    if (Pop.box && !e.target.closest('.gl-pop')) popHide(0);
  });
  window.addEventListener('scroll', () => { if (Pop.box && Pop.box.classList.contains('on')) popHide(0); }, { passive: true });

  /* ---------------- wiring ---------------- */
  function init() {
    if (!el('panel-3')) return;
    const main = el('b3Main');
    const onStep = e => { if (e.detail.step === 3 && !S.built) build(); };
    document.addEventListener('stepchange', onStep);
    if (el('panel-3').classList.contains('active')) {
      build();
      /* a link can open one plate (#b3&p=plac-parietal) or one section (#b3&s=aest) */
      const hp = /[#&]p=([\w-]+)/.exec(location.hash || ''), hs = /[#&]s=([\w-]+)/.exec(location.hash || '');
      const big = /[#&]big=1/.test(location.hash || '');
      if (hp && plateById(hp[1])) setTimeout(() => { goPlate(hp[1]); if (big) openPlate(hp[1]); }, 120);
      else if (hs && el('at-' + hs[1])) setTimeout(() => el('at-' + hs[1]).scrollIntoView({ block: 'start' }), 120);
    }
    main.addEventListener('click', e => {
      const b = e.target.closest('[data-act]');
      if (b) { const id = b.closest('.at-card').dataset.id; if (b.dataset.act === 'big') openPlate(id); else toBuilder(id); return; }
      const fig = e.target.closest('.at-fig');
      if (fig && !e.target.closest('dfn')) openPlate(fig.closest('.at-card').dataset.id);
      const go = e.target.closest('.gl-go');
      if (go) { e.preventDefault(); goPlate(go.dataset.plate); }
      const lt = e.target.closest('#glLetters a');
      if (lt) { e.preventDefault(); const t = el('gl-' + lt.dataset.l); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
    el('b3Nav').addEventListener('click', e => {
      const a = e.target.closest('a[data-sec]');
      if (!a) return;
      e.preventDefault();
      const t = el('at-' + a.dataset.sec);
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    el('b3Search').addEventListener('input', () => { if (!S.built) build(); search(); });
    el('b3DlgClose').addEventListener('click', () => el('b3Dlg').close());
    el('b3Dlg').addEventListener('click', e => { if (e.target === el('b3Dlg')) el('b3Dlg').close(); });
    el('b3DlgBuild').addEventListener('click', () => { if (S.dlgPlate) toBuilder(S.dlgPlate.id); });
    document.addEventListener('langchange', () => {
      if (!S.built) return;
      /* figures with words (art, labelled sections) are drawn again */
      els('#b3Main .at-fig').forEach(b => { delete b.dataset.done; b.innerHTML = ''; });
      glossary(); observe();
    });
    document.addEventListener('convchange', () => {
      if (!S.built) return;
      els('#b3Main .at-card').forEach(c => { const f = c.querySelector('.at-form'); if (f) f.innerHTML = formulaFor(plateById(c.dataset.id)); });
    });
  }
  document.addEventListener('DOMContentLoaded', init);

  return { lookup, glossaryEntries, resolve, figSVG, openPlate, goPlate, build, S };
})();
window.B3 = B3;
