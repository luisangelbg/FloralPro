/* FloralPro — Block 5: the interactive key.

   Two tabs over the same character matrix (key.js):
   · multi-access key: tick what you see, in any order; the families that
     remain are listed with their diagram, the most useful next character is
     suggested, and when few remain the characters that tell them apart are
     shown. A tolerance lets one or two observation mistakes pass;
   · dichotomous key: generated from the matrix, walked couplet by couplet or
     read (and printed) whole. It can be limited to one large clade or to the
     characters of the flower alone.
   A flower from the builder can be identified directly, and every family
   sheet (Block 4) shows the path that leads to it in the dichotomous key. */

const B5 = (function () {
  const S = { built: false, tab: 'multi', sel: {}, tol: 0, floral: false, scope: 'all', dScope: 'all', dFloral: false, tree: null, walk: [], dView: 'walk', obs: null };
  const T2 = x => Array.isArray(x) ? (I18N.lang === 'en' ? x[1] : x[0]) : (x && typeof x === 'object' ? (I18N.lang === 'en' ? (x.en || x.es) : x.es) : x);
  const Lo = o => L2(o.es, o.en);
  const stL = (c, s) => { const x = KEY.CH(c).st.find(y => y[0] === s); return x ? L2(esc(x[1]), esc(x[2])) : s; };
  const qL = c => { const ch = KEY.CH(c); return L2(esc(ch.q[0]), esc(ch.q[1])); };
  const dfnQ = c => { const ch = KEY.CH(c); return ch.term ? `<dfn data-term="${ch.term}">${qL(c)}</dfn>` : qL(c); };

  /* ---------------- scopes ---------------- */
  const SCOPES = () => [{ id: 'all', es: 'Todas las familias', en: 'All families' }].concat(B4.GROUPS);
  const inScope = id => id === 'all' ? FAMILIES.slice() : FAMILIES.filter(f => B4.groupOf(f) === id);

  /* ---------------- multi-access key ---------------- */
  /* each state shows how many families would remain if it were chosen */
  function charRow(c, fams) {
    const ch = KEY.CH(c);
    const on = S.sel[c];
    const others = Object.assign({}, S.sel); delete others[c];
    const n = KEY.ifChosen(c, others, S.tol, fams);
    return `<div class="k-char${on ? ' set' : ''}" id="kc-${c}" data-c="${c}">
      <div class="k-q">${dfnQ(c)}${on ? ` <button class="btn btn-ghost btn-xs k-clear" data-clear="${c}">${L2('no sé', 'not sure')}</button>` : ''}</div>
      <div class="k-sts">${ch.st.map(([s]) => `<button class="chip k-st${on === s ? ' on' : ''}${!n[s] && on !== s ? ' zero' : ''}" data-c="${c}" data-s="${s}">${stL(c, s)} <span class="n">${n[s]}</span></button>`).join('')}</div>
    </div>`;
  }
  function renderMulti() {
    const fams = inScope(S.scope);
    const left = KEY.remaining(S.sel, S.tol, fams);
    const leftF = left.map(x => x.fam);
    /* characters, grouped; counts are over the families still in play */
    el('k5Chars').innerHTML = KEYGROUPS.filter(g => !S.floral || KEY.FLORAL.has(g.id)).map(g =>
      `<section class="k-grp"><h4>${Lo(g)}</h4>${KEYCHARS.filter(c => c.grp === g.id && c.multi !== false).map(c => charRow(c.id, fams)).join('')}</section>`).join('');
    const nSel = Object.keys(S.sel).length;
    el('k5Left').innerHTML = leftF.length === 1
      ? L2('Queda <b>una</b> familia', '<b>One</b> family remains')
      : L2(`Quedan <b>${leftF.length}</b> de ${fams.length} familias`, `<b>${leftF.length}</b> of ${fams.length} families remain`);
    el('k5Reset').style.display = nSel ? '' : 'none';
    /* what to look at next */
    const sug = leftF.length > 1 ? KEY.suggest(S.sel, fams, 3, S.floral, S.tol) : [];
    el('k5Sug').innerHTML = sug.length ? `<span class="k-sug-l">${L2('Conviene observar ahora', 'Worth looking at next')}:</span> ${sug.map(s => `<button class="chip k-go" data-go="${s.c}">${qL(s.c)} <span class="n">≈${s.exp.toFixed(1)}</span></button>`).join('')}` : '';
    /* the families left */
    el('k5Res').innerHTML = left.slice(0, 60).map(x => famCard(x)).join('') + (left.length > 60 ? `<p class="hint">${L2(`… y ${left.length - 60} más.`, `… and ${left.length - 60} more.`)}</p>` : '');
    el('k5Empty').style.display = leftF.length ? 'none' : '';
    /* what tells apart the last few */
    const dif = leftF.length >= 2 && leftF.length <= 6 ? KEY.differences(leftF, S.floral) : [];
    el('k5Diff').innerHTML = dif.length ? `<h4>${L2('Lo que las distingue', 'What tells them apart')}</h4><table class="k-dtab"><thead><tr><th></th>${leftF.map(f => `<th>${esc(f.name)}</th>`).join('')}</tr></thead><tbody>${dif.slice(0, 10).map(d => `<tr><th>${qL(d.c)}</th>${d.per.map(s => `<td>${[...s].map(x => stL(d.c, x)).join('; ')}</td>`).join('')}</tr>`).join('')}</tbody></table>` : '';
    I18N.apply(el('panel-5'));
    observe();
  }
  function famCard(x) {
    const f = x.fam, m = Fam.resolve(f, Fam.typicalList(f)[0].m);
    return `<article class="k-fam" data-f="${f.id}" tabindex="0">
      <div class="k-fig" data-f="${f.id}"></div>
      <div class="k-fb"><div class="fm-ord">${esc(f.order)}</div><b>${esc(f.name)}</b><div class="fm-vern">${L2(esc(f.es), esc(f.en))}</div>
      ${x.miss.length ? `<div class="k-miss">${L2('No coincide en', 'Differs in')}: ${x.miss.map(c => qL(c)).join(', ')}</div>` : ''}</div>
    </article>`;
  }
  function observe() {
    if (S.obs) S.obs.disconnect();
    const boxes = els('#panel-5 .k-fig').filter(b => !b.dataset.done);
    const draw = b => { const f = Fam.byId(b.dataset.f); b.innerHTML = Diagram.svg(Fam.resolve(f, Fam.typicalList(f)[0].m), { colors: 'natural' }); b.dataset.done = '1'; };
    if (!('IntersectionObserver' in window)) { boxes.forEach(draw); return; }
    S.obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { draw(e.target); S.obs.unobserve(e.target); } }), { rootMargin: '300px 0px' });
    boxes.forEach(b => S.obs.observe(b));
  }
  function setState(c, s) {
    if (S.sel[c] === s) delete S.sel[c]; else S.sel[c] = s;
    renderMulti();
  }
  /* identify a flower model (from the builder): its floral states become the observation */
  function identify(m, name) {
    if (!S.built) build();
    S.sel = KEY.fromModel(m);
    S.tol = 0; S.floral = false; S.scope = 'all';
    syncControls();
    goStep(5);
    showTab('multi');
    el('k5From').innerHTML = name ? `${L2('Caracteres tomados de la flor', 'Characters taken from the flower')} <b>${esc(name)}</b>. ${L2('Agrega los de la planta, la inflorescencia o el fruto para afinar.', 'Add those of the plant, inflorescence or fruit to narrow it down.')}` : '';
    el('k5From').style.display = name ? '' : 'none';
    renderMulti();
  }

  /* ---------------- dichotomous key ---------------- */
  function tree() {
    if (!S.tree) S.tree = KEY.build(inScope(S.dScope), { floralOnly: S.dFloral });
    return S.tree;
  }
  const lead = (cp, side) => esc(KEY.leadText(cp.c, side === 'left' ? cp.a : cp.b, I18N.lang));
  const target = x => x.leaf ? x.leaf.map(id => `<a href="#" class="k-fl" data-f="${id}">${esc(Fam.byId(id).name)}</a>`).join(' · ') : null;
  function renderDic() {
    const t = tree();
    const multi = t.leaves.filter(l => l.leaf.length > 1);
    el('k5DStat').innerHTML = L2(`${t.couplets.length} parejas de opciones para ${inScope(S.dScope).length} familias.`, `${t.couplets.length} couplets for ${inScope(S.dScope).length} families.`) +
      (multi.length ? ' ' + L2(`${multi.length} finales reúnen varias familias que estos caracteres no separan.`, `${multi.length} endings gather several families that these characters do not separate.`) : '');
    el('k5Walk').style.display = S.dView === 'walk' ? '' : 'none';
    el('k5Full').style.display = S.dView === 'full' ? '' : 'none';
    els('#k5DView button').forEach(b => b.classList.toggle('on', b.dataset.v === S.dView));
    if (S.dView === 'walk') renderWalk(); else renderFull();
    I18N.apply(el('panel-5'));
  }
  function renderWalk() {
    const t = tree();
    let x = t.root;
    S.walk.forEach(side => { if (!x.leaf) x = x[side]; });
    const crumbs = [];
    let y = t.root;
    S.walk.forEach((side, i) => { crumbs.push(`<button class="k-crumb" data-back="${i}">${y.n}${side === 'left' ? 'a' : 'b'}. ${lead(y, side)}</button>`); y = y[side]; });
    let body;
    if (x.leaf) {
      body = `<div class="k-end"><div class="k-end-l">${L2('Llegaste a', 'You reached')}</div>${x.leaf.map(id => famCard({ fam: Fam.byId(id), miss: [] })).join('')}
        ${x.leaf.length > 1 ? `<p class="hint">${L2('Estas familias no se separan con los caracteres elegidos; revisa sus fichas.', 'These families are not separated by the chosen characters; see their sheets.')}</p>` : ''}</div>`;
    } else {
      /* each lead says how many families lie beyond it and names a few of them */
      const side = s => {
        const ids = x[s].leaf ? x[s].leaf : x[s].fams, n = ids.length;
        /* the best-known families as examples: those with more species in the catalogue */
        const known = ids.slice().sort((p, q) => Fam.byId(q).species.length - Fam.byId(p).species.length);
        const ex = known.slice(0, 3).map(id => esc(Fam.byId(id).name)).join(', ') + (n > 3 ? '…' : '');
        return `<button class="k-lead" data-side="${s}"><span class="k-ln">${x.n}${s === 'left' ? 'a' : 'b'}</span><span class="k-lt">${lead(x, s)}</span><span class="k-lc">${x[s].leaf ? target(x[s]) : `${L2(`${n} familias`, `${n} families`)}<br><span class="k-ex">${L2('p. ej.', 'e.g.')} ${ex}</span>`}</span></button>`;
      };
      body = `<div class="k-cp"><div class="k-cp-h">${L2('Pareja', 'Couplet')} ${x.n} · ${dfnQ(x.c)}</div>${side('left')}${side('right')}</div>`;
    }
    el('k5Walk').innerHTML = `<div class="k-crumbs">${S.walk.length ? `<button class="btn btn-ghost btn-xs" data-restart="1">↺ ${L2('Empezar de nuevo', 'Start again')}</button>` : ''}${crumbs.join('')}</div>${body}`;
    observe();
  }
  function renderFull() {
    const t = tree();
    const to = x => x.leaf ? `<span class="k-to">${target(x)}</span>` : `<a href="#" class="k-to k-jump" data-n="${x.n}">${x.n}</a>`;
    el('k5Full').innerHTML = `<ol class="k-full">${t.couplets.map(cp => `<li id="kcp-${cp.n}" value="${cp.n}">
      <div class="k-row"><span class="k-ln">${cp.n}a.</span><span class="k-lt">${lead(cp, 'left')}</span><span class="k-dots"></span>${to(cp.left)}</div>
      <div class="k-row"><span class="k-ln">${cp.n}b.</span><span class="k-lt">${lead(cp, 'right')}</span><span class="k-dots"></span>${to(cp.right)}</div></li>`).join('')}</ol>`;
  }
  /* the path to a family, as text, for the family sheets */
  let fullTree = null;
  function pathHTML(famId) {
    const t = fullTree || (fullTree = KEY.build(FAMILIES, {}));
    const p = KEY.pathTo(t, famId);
    if (!p.length) return '';
    return `<ol class="k-path">${p.map(s => `<li><span class="k-ln">${s.cp.n}${s.side === 'left' ? 'a' : 'b'}</span> ${esc(KEY.leadText(s.cp.c, s.side === 'left' ? s.cp.a : s.cp.b, I18N.lang))}</li>`).join('')}</ol>`;
  }
  function goToFamily(famId) {
    if (!S.built) build();
    S.dScope = 'all'; S.dFloral = false; S.tree = null; S.dView = 'walk';
    const p = KEY.pathTo(tree(), famId);
    S.walk = p.map(s => s.side);
    syncControls();
    goStep(5);
    showTab('dic');
  }

  /* ---------------- building and wiring ---------------- */
  function syncControls() {
    const opts = sel => SCOPES().map(g => `<option value="${g.id}"${g.id === sel ? ' selected' : ''}>${esc(T2(g))}</option>`).join('');
    el('k5Scope').innerHTML = opts(S.scope);
    el('k5DScope').innerHTML = opts(S.dScope);
    el('k5Tol').value = String(S.tol);
    el('k5Floral').checked = S.floral;
    el('k5DFloral').checked = S.dFloral;
  }
  function showTab(t) {
    S.tab = t;
    els('#k5Tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === t));
    el('k5Multi').style.display = t === 'multi' ? '' : 'none';
    el('k5Dic').style.display = t === 'dic' ? '' : 'none';
    try { history.replaceState(null, '', '#b5' + (t === 'dic' ? '&k=dic' : '')); } catch (e) { /* file:// */ }
    if (t === 'multi') renderMulti(); else renderDic();
  }
  function build() {
    if (S.built) return;
    S.built = true;
    syncControls();
  }
  function init() {
    if (!el('panel-5')) return;
    document.addEventListener('stepchange', e => {
      if (e.detail.step !== 5) return;
      if (!S.built) { build(); showTab(/[#&]k=dic/.test(location.hash) ? 'dic' : 'multi'); }
    });
    if (el('panel-5').classList.contains('active')) { build(); showTab(/[#&]k=dic/.test(location.hash) ? 'dic' : 'multi'); }
    el('k5Tabs').addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (b) showTab(b.dataset.tab); });
    el('k5Multi').addEventListener('click', e => {
      if (e.target.closest('dfn')) return;
      const st = e.target.closest('.k-st');
      if (st) { setState(st.dataset.c, st.dataset.s); return; }
      const cl = e.target.closest('[data-clear]');
      if (cl) { delete S.sel[cl.dataset.clear]; renderMulti(); return; }
      const go = e.target.closest('[data-go]');
      if (go) { const r = el('kc-' + go.dataset.go); if (r) { r.scrollIntoView({ behavior: 'smooth', block: 'center' }); r.classList.remove('flash'); void r.offsetWidth; r.classList.add('flash'); } return; }
      const f = e.target.closest('.k-fam');
      if (f) B4.openFamily(f.dataset.f);
    });
    el('k5Multi').addEventListener('keydown', e => { const f = e.target.closest('.k-fam'); if (f && e.key === 'Enter') B4.openFamily(f.dataset.f); });
    el('k5Reset').addEventListener('click', () => { S.sel = {}; el('k5From').style.display = 'none'; renderMulti(); });
    el('k5Tol').addEventListener('change', e => { S.tol = +e.target.value; renderMulti(); });
    el('k5Floral').addEventListener('change', e => {
      S.floral = e.target.checked;
      if (S.floral) Object.keys(S.sel).forEach(c => { if (!KEY.FLORAL.has(KEY.CH(c).grp)) delete S.sel[c]; });
      renderMulti();
    });
    el('k5Scope').addEventListener('change', e => { S.scope = e.target.value; renderMulti(); });
    el('k5Dic').addEventListener('click', e => {
      if (e.target.closest('dfn')) return;
      const ld = e.target.closest('.k-lead');
      if (ld) { S.walk.push(ld.dataset.side); renderWalk(); I18N.apply(el('k5Walk')); return; }
      const bk = e.target.closest('[data-back]');
      if (bk) { S.walk = S.walk.slice(0, +bk.dataset.back); renderWalk(); return; }
      if (e.target.closest('[data-restart]')) { S.walk = []; renderWalk(); return; }
      const v = e.target.closest('#k5DView [data-v]');
      if (v) { S.dView = v.dataset.v; renderDic(); return; }
      const j = e.target.closest('.k-jump');
      if (j) { e.preventDefault(); const t = el('kcp-' + j.dataset.n); if (t) { t.scrollIntoView({ behavior: 'smooth', block: 'center' }); t.classList.remove('flash'); void t.offsetWidth; t.classList.add('flash'); } return; }
      const fl = e.target.closest('.k-fl, .k-fam');
      if (fl) { e.preventDefault(); B4.openFamily(fl.dataset.f); }
    });
    el('k5DScope').addEventListener('change', e => { S.dScope = e.target.value; S.tree = null; S.walk = []; renderDic(); });
    el('k5DFloral').addEventListener('change', e => { S.dFloral = e.target.checked; S.tree = null; S.walk = []; renderDic(); });
    el('k5Print').addEventListener('click', () => { S.dView = 'full'; renderDic(); setTimeout(() => window.print(), 50); });
    document.addEventListener('langchange', () => { if (!S.built) return; syncControls(); if (S.tab === 'multi') renderMulti(); else renderDic(); });
  }
  document.addEventListener('DOMContentLoaded', init);

  return { S, identify, pathHTML, goToFamily, tree, renderMulti, renderDic, showTab, setState };
})();
window.B5 = B5;
