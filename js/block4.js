/* FloralPro — Block 4: families and species.

   Three views inside the block:
   · the catalogue: every family as a card (diagram and formula of its typical
     flower), grouped by the large clades of APG IV, with a search box that also
     finds species, and filters by flower characters and by the status of the
     species in Mexico;
   · the family sheet: the typical flower, its variants and the flowers of its
     species in the linked views (3D, diagram, section, formula, description),
     the distinctive characters, the fruit, its importance in Mexico and the
     species with their status;
   · the comparer: two families (or two flowers) side by side, character by
     character, with the differences marked.
   The address keeps what is open (#b4&f=fabaceae, #b4&cmp=liliaceae,amaryllidaceae)
   so a teacher can share a link to one sheet. */

const B4 = (function () {
  const S = { built: false, mode: 'list', fam: null, fi: 0, flowers: [], views: null, obs: null, filters: new Set(), cmp: [null, null], cmpFi: [0, 0] };
  const T2 = x => Array.isArray(x) ? (I18N.lang === 'en' ? x[1] : x[0]) : (x && typeof x === 'object' ? (I18N.lang === 'en' ? (x.en || x.es) : x.es) : x);
  const Lo = o => L2(o.es, o.en);
  const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  /* ---------------- groups of the catalogue ---------------- */
  const GROUPS = [
    { id: 'ana', es: 'Angiospermas de divergencia temprana', en: 'Early-diverging angiosperms' },
    { id: 'magnoliids', es: 'Magnólidas', en: 'Magnoliids' },
    { id: 'monocots', es: 'Monocotiledóneas', en: 'Monocots' },
    { id: 'eudicots', es: 'Eudicotiledóneas tempranas', en: 'Early-diverging eudicots' },
    { id: 'superrosids', es: 'Superrósidas: Saxifragales y rósidas', en: 'Superrosids: Saxifragales and rosids' },
    { id: 'superasterids', es: 'Superastéridas: Caryophyllales', en: 'Superasterids: Caryophyllales' },
    { id: 'asterids', es: 'Astéridas', en: 'Asterids' },
  ];
  function groupOf(f) {
    const ids = Fam.cladePath(f).map(c => c.id);
    let g = null;
    GROUPS.forEach(G => { if (ids.includes(G.id)) g = G.id; });
    return g;
  }

  /* ---------------- characters used by the filters and the comparer ---------------- */
  const TRAITS = [
    { id: 'trimer', es: 'Flor trímera', en: 'Trimerous flower', test: f => FM.merosity(f) === 3 },
    { id: 'zygo', es: 'Zigomorfa', en: 'Zygomorphic', test: f => f.sym.startsWith('zygo') || f.sym === 'asym' },
    { id: 'unisex', es: 'Flores unisexuales', en: 'Unisexual flowers', test: f => f.sex !== 'bisexual' },
    { id: 'noper', es: 'Sin perianto', en: 'No perianth', test: f => !f.K && !f.C && !f.P },
    { id: 'sympet', es: 'Pétalos o tépalos unidos', en: 'United petals or tepals', test: f => !!((f.C && FM.allConnate(f.C)) || (!f.C && f.P && FM.allConnate(f.P))) },
    { id: 'manyA', es: 'Estambres numerosos', en: 'Numerous stamens', test: f => !!(f.A && FM.isMany(FM.total(f.A, { visible: true }))) },
    { id: 'apo', es: 'Carpelos libres', en: 'Free carpels', test: f => !!(f.G && ['apo', 'semi'].includes(FM.gynoeciumType(f).type)) },
    { id: 'inferior', es: 'Ovario ínfero', en: 'Inferior ovary', test: f => !!(f.G && f.G.pos === 'inferior') },
  ];
  const typicalN = fam => Fam.typicalList(fam).map(x => FM.normalize(Fam.resolve(fam, x.m)));
  const hasTrait = (fam, t) => typicalN(fam).some(t.test);
  const stCount = fam => { const c = {}; fam.species.forEach(s => { c[s.st] = (c[s.st] || 0) + 1; }); return c; };
  const ST_ORDER = ['end', 'nat', 'dom', 'cult', 'intro'];
  const ST_SHORT = { end: ['endémica', 'endemic'], nat: ['nativa', 'native'], dom: ['domesticada', 'domesticated'], cult: ['cultivada', 'cultivated'], intro: ['introducida', 'introduced'] };
  const stBadge = (st, n) => `<span class="st-badge st-${st}" data-es-title="${Fam.ST[st].es}" data-en-title="${Fam.ST[st].en}" title="${esc(T2(Fam.ST[st]))}">${n != null ? `<b>${n}</b> ` : ''}${L2(ST_SHORT[st][0], ST_SHORT[st][1])}</span>`;

  /* ---------------- catalogue ---------------- */
  function formulaOf(m, opts) { return Formula.html(m, state.conv, opts || {}).replace('class="ff ', 'class="ff ff-color '); }
  function cardHTML(fam) {
    const tl = Fam.typicalList(fam);
    const c = stCount(fam);
    return `<article class="fm-card" id="fc-${fam.id}" data-id="${fam.id}" tabindex="0">
      <div class="fm-fig${tl.length > 1 ? ' two' : ''}"></div>
      <div class="fm-body">
        <div class="fm-ord">${esc(fam.order)}</div>
        <h4>${esc(fam.name)}</h4>
        <div class="fm-vern">${L2(esc(fam.es), esc(fam.en))}</div>
        <div class="fm-form">${tl.map(x => `<div>${formulaOf(Fam.resolve(fam, x.m))}</div>`).join('')}</div>
        <div class="fm-match"></div>
        <div class="fm-st"><span class="fm-nsp">${fam.species.length} ${L2('especies', 'species')}</span>${ST_ORDER.filter(s => c[s]).map(s => stBadge(s, c[s])).join('')}</div>
      </div>
    </article>`;
  }
  function drawCard(box) {
    const fam = Fam.byId(box.closest('.fm-card').dataset.id);
    box.innerHTML = Fam.typicalList(fam).map(x => `<div class="fm-f1">${Diagram.svg(Fam.resolve(fam, x.m), { colors: 'natural' })}</div>`).join('');
    box.dataset.done = '1';
  }
  function observe() {
    if (S.obs) S.obs.disconnect();
    const boxes = els('#b4Grid .fm-fig').filter(b => !b.dataset.done);
    if (!('IntersectionObserver' in window)) { boxes.forEach(drawCard); return; }
    S.obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting && !e.target.dataset.done) { drawCard(e.target); S.obs.unobserve(e.target); } }), { rootMargin: '400px 0px' });
    boxes.forEach(b => S.obs.observe(b));
  }
  function buildList() {
    el('b4Grid').innerHTML = GROUPS.map(G => {
      const fams = FAMILIES.filter(f => groupOf(f) === G.id);
      return `<section class="fm-sec" id="fg-${G.id}" data-g="${G.id}"><h3>${Lo(G)} <span class="at-n">${fams.length}</span></h3><div class="fm-grid">${fams.map(cardHTML).join('')}</div></section>`;
    }).join('');
    buildFilters();
    buildTree();
    observe();
  }
  function buildFilters() {
    const st = ST_ORDER.map(s => {
      const n = FAMILIES.filter(f => f.species.some(x => x.st === s)).length;
      return `<button class="chip st-chip st-${s}" data-flt="st:${s}" data-es-title="Familias con especies ${Fam.ST[s].es}s" data-en-title="Families with species ${Fam.ST[s].en}">${L2(ST_SHORT[s][0], ST_SHORT[s][1])} <span class="n">${n}</span></button>`;
    }).join('');
    const tr = TRAITS.map(t => `<button class="chip" data-flt="tr:${t.id}">${Lo(t)} <span class="n">${FAMILIES.filter(f => hasTrait(f, t)).length}</span></button>`).join('');
    el('b4Filters').innerHTML = `<div class="fm-frow"><span class="fm-flab">${L2('Flor típica', 'Typical flower')}</span>${tr}</div>
      <div class="fm-frow"><span class="fm-flab">${L2('Con especies', 'With species')}</span>${st}<button class="btn btn-ghost btn-xs" id="b4Clear" style="display:none">${L2('Quitar filtros', 'Clear filters')}</button></div>`;
  }
  function buildTree() {
    el('b4Tree').innerHTML = GROUPS.map(G => {
      const fams = FAMILIES.filter(f => groupOf(f) === G.id);
      const orders = [...new Set(fams.map(f => f.order))];
      return `<details class="tr-g" open><summary>${Lo(G)}</summary>${orders.map(o => `<div class="tr-o">${esc(o)}</div>${fams.filter(f => f.order === o).map(f => `<a href="#" class="tr-f" data-f="${f.id}">${esc(f.name)}</a>`).join('')}`).join('')}</details>`;
    }).join('');
  }
  function matches(fam, q) {
    if (!q) return { ok: true, sp: [] };
    const famTxt = norm([fam.name, fam.es, fam.en, fam.order, Fam.cladePath(fam).map(c => c.es + ' ' + c.en).join(' ')].join(' '));
    const sp = fam.species.filter(s => norm([s.sci, s.es, s.en].join(' ')).includes(q));
    return { ok: famTxt.includes(q) || sp.length > 0, sp };
  }
  function applyFilters() {
    const q = norm(el('b4Search').value.trim());
    const flt = [...S.filters];
    let shown = 0;
    els('#b4Grid .fm-card').forEach(c => {
      const fam = Fam.byId(c.dataset.id);
      const m = matches(fam, q);
      const ok = m.ok && flt.every(k => {
        const [kind, id] = k.split(':');
        if (kind === 'st') return fam.species.some(s => s.st === id);
        return hasTrait(fam, TRAITS.find(t => t.id === id));
      });
      c.style.display = ok ? '' : 'none';
      if (ok) shown++;
      c.querySelector('.fm-match').innerHTML = ok && q && m.sp.length ? `${L2('Especies', 'Species')}: ${m.sp.map(s => `<i>${esc(s.sci)}</i> (${L2(esc(s.es), esc(s.en))})`).join(', ')}` : '';
    });
    els('#b4Grid .fm-sec').forEach(s => { s.style.display = els('.fm-card', s).some(c => c.style.display !== 'none') ? '' : 'none'; });
    els('#b4Tree .tr-f').forEach(a => { const c = el('fc-' + a.dataset.f); a.classList.toggle('dim', !!c && c.style.display === 'none'); });
    el('b4Count').innerHTML = shown === FAMILIES.length ? L2(`${shown} familias`, `${shown} families`) : L2(`${shown} de ${FAMILIES.length} familias`, `${shown} of ${FAMILIES.length} families`);
    el('b4Empty').style.display = shown ? 'none' : '';
    els('#b4Filters [data-flt]').forEach(b => b.classList.toggle('on', S.filters.has(b.dataset.flt)));
    const clr = el('b4Clear'); if (clr) clr.style.display = S.filters.size || q ? '' : 'none';
    observe();
  }

  /* ---------------- which view is open ---------------- */
  function show(mode) {
    S.mode = mode;
    el('b4List').style.display = mode === 'list' ? '' : 'none';
    el('b4Sheet').style.display = mode === 'sheet' ? '' : 'none';
    el('b4Cmp').style.display = mode === 'cmp' ? '' : 'none';
    el('panel-4').dataset.mode = mode;
  }
  function setHash(h) { try { history.replaceState(null, '', '#b4' + (h ? '&' + h : '')); } catch (e) { /* file:// in some browsers */ } }
  function toList(focusId) {
    show('list'); setHash('');
    const c = focusId && el('fc-' + focusId);
    if (c) setTimeout(() => { c.scrollIntoView({ block: 'center' }); c.classList.remove('flash'); void c.offsetWidth; c.classList.add('flash'); }, 30);
    else window.scrollTo({ top: 0 });
  }

  /* ---------------- family sheet ---------------- */
  function flowerLabel(x) {
    if (x.kind === 'typical') return x.label ? `${L2('Típica', 'Typical')}: ${Lo(x.label)}` : L2('Flor típica', 'Typical flower');
    if (x.kind === 'variant') return Lo(x.label);
    return `<i>${esc(x.sp.sci)}</i>${x.label ? ' · ' + Lo(x.label) : ''}`;
  }
  function openFamily(id, fi) {
    const fam = Fam.byId(id);
    if (!fam) return;
    if (!S.built) build();
    goStepQuiet();
    S.fam = fam;
    S.flowers = Fam.allFlowers(fam);
    S.fi = Math.max(0, Math.min(S.flowers.length - 1, fi || 0));
    show('sheet');
    setHash('f=' + fam.id);
    const i = FAMILIES.indexOf(fam);
    const prev = FAMILIES[(i - 1 + FAMILIES.length) % FAMILIES.length], next = FAMILIES[(i + 1) % FAMILIES.length];
    const path = Fam.cladePath(fam).map(c => Lo(c)).concat([esc(fam.order)]).join(' <span class="sep">›</span> ');
    const c = stCount(fam);
    /* the linked views stay in place (#b4Views); only the parts around them are rewritten */
    el('b4SheetHead').innerHTML = `
      <div class="fs-top">
        <button class="btn btn-ghost btn-sm" data-act="list">← ${L2('Todas las familias', 'All families')}</button>
        <nav class="fs-crumbs">${path}</nav>
        <span class="fs-pn">
          <button class="btn btn-ghost btn-sm" data-go="${prev.id}" data-es-title="Familia anterior (tecla ←)" data-en-title="Previous family (← key)">‹ ${esc(prev.name)}</button>
          <button class="btn btn-ghost btn-sm" data-go="${next.id}" data-es-title="Familia siguiente (tecla →)" data-en-title="Next family (→ key)">${esc(next.name)} ›</button>
        </span>
      </div>
      <header class="fs-head">
        <div><h2>${esc(fam.name)}</h2><div class="fs-vern">${L2(esc(fam.es), esc(fam.en))} · <span class="muted">${L2('orden', 'order')} ${esc(fam.order)}</span></div></div>
        <div class="fs-act">
          <select class="sel" id="b4CmpWith" aria-label="${esc(T('Comparar con otra familia', 'Compare with another family'))}"><option value="">${T2(['Comparar con…', 'Compare with…'])}</option>${FAMILIES.filter(f => f !== fam).map(f => `<option value="${f.id}">${esc(f.name)}</option>`).join('')}</select>
          <button class="btn btn-secondary btn-sm" data-act="build">${L2('Abrir esta flor en el constructor', 'Open this flower in the builder')}</button>
        </div>
      </header>
      <div class="fs-flowers chips" id="b4Fl">${S.flowers.map((x, k) => `<button class="chip${x.kind === 'species' ? ' sp' : ''}" data-fi="${k}">${flowerLabel(x)}</button>`).join('')}</div>
      <p class="sp-note fs-flnote" id="b4FlNote"></p>`;
    el('b4SheetBody').innerHTML = `
      <div class="fs-cols">
        <section class="card fs-chars">
          <h3>${L2('Caracteres distintivos', 'Distinctive characters')}</h3>
          <ul>${fam.chars.es.map((s, k) => `<li>${L2(esc(s), esc(fam.chars.en[k]))}</li>`).join('')}</ul>
          <h4>${L2('Fruto', 'Fruit')}</h4><p>${L2(esc(fam.fruit.es), esc(fam.fruit.en))}</p>
          <h4>${L2('En México', 'In Mexico')}</h4><p>${L2(esc(fam.mx.es), esc(fam.mx.en))}</p>
        </section>
        <section class="card fs-sp">
          <h3>${L2('Especies', 'Species')} <span class="at-n">${fam.species.length}</span></h3>
          <div class="fs-stl">${ST_ORDER.filter(s => c[s]).map(s => stBadge(s, c[s])).join('')}</div>
          <div class="sp-list">${fam.species.map((s, si) => spRow(fam, s, si)).join('')}</div>
        </section>
      </div>
      <section class="card fs-ph" id="b4Ph" style="display:none"></section>
      ${window.B5 ? `<section class="card fs-key">
        <h3>${L2('Cómo se llega a ella en la clave dicotómica', 'How the dichotomous key leads to it')}</h3>
        ${B5.pathHTML(fam.id)}
        <button class="btn btn-secondary btn-sm" data-act="key">${L2('Recorrer este camino en la clave', 'Walk this path in the key')}</button>
      </section>` : ''}`;
    I18N.apply(el('b4SheetHead')); I18N.apply(el('b4SheetBody'));
    fillPhotos(fam);
    if (!S.views) S.views = Views.create(el('b4Views'), { model: S.flowers[S.fi].m, name: 'floralpro', fileName: () => S.fam.name + '-' + flowerName(S.flowers[S.fi]) });
    else S.views.set(S.flowers[S.fi].m);
    selectFlower(S.fi, true);
    window.scrollTo({ top: 0 });
  }
  /* the teacher's own photos of the family and its species (Block 8) */
  function fillPhotos(fam) {
    if (!window.Photos) return;
    Photos.ready.then(() => {
      const box = el('b4Ph');
      if (!box || !S.fam || S.fam.id !== fam.id) return;
      const sci = new Set(fam.species.map(s => s.sci));
      const list = Photos.list().filter(p => p.fam === fam.id || (p.sp && sci.has(p.sp)));
      box.style.display = list.length ? '' : 'none';
      box.innerHTML = list.length ? PhotoView.strip(list, L2('Mis fotos', 'My photos')) : '';
    });
  }
  document.addEventListener('photoschange', () => { if (S.fam && S.mode === 'sheet') fillPhotos(S.fam); });
  function spRow(fam, s, si) {
    const k = S.flowers.findIndex(x => x.kind === 'species' && x.si === si);
    return `<div class="sp-row" data-si="${si}">
      <div class="sp-h"><i class="sp-sci">${esc(s.sci)}</i> <span class="sp-cn">${L2(esc(s.es), esc(s.en))}</span> ${stBadge(s.st)}</div>
      <div class="sp-t">${L2(esc(s.note.es), esc(s.note.en))}</div>
      ${k >= 0 ? `<div class="sp-a"><button class="btn btn-ghost btn-xs" data-fi="${k}">${L2('Ver su flor', 'See its flower')}</button></div>` : `<div class="sp-a muted">${L2('Se muestra con la flor típica de la familia.', 'Shown with the typical flower of the family.')}</div>`}
    </div>`;
  }
  const flowerName = x => x.kind === 'species' ? x.sp.sci + (x.label ? ' ' + T2(x.label) : '') : x.label ? T2(x.label) : T2(['tipica', 'typical']);
  function selectFlower(k, first) {
    S.fi = k;
    const x = S.flowers[k];
    els('#b4Fl .chip').forEach(c => c.classList.toggle('on', +c.dataset.fi === k));
    els('#b4Sheet .sp-row').forEach(r => r.classList.toggle('on', x.kind === 'species' && +r.dataset.si === x.si));
    let note = '';
    if (x.kind === 'species') note = `<b><i>${esc(x.sp.sci)}</i></b> — ${L2(esc(x.sp.note.es), esc(x.sp.note.en))}`;
    else if (x.kind === 'variant') note = `<b>${Lo(x.label)}</b>`;
    else note = L2('La flor que resume a la familia. Elige una variante o una especie para ver sus diferencias.', 'The flower that sums up the family. Pick a variant or a species to see how it differs.');
    el('b4FlNote').innerHTML = note;
    if (!first) S.views.set(x.m);
  }
  function toBuilder() {
    const x = S.flowers[S.fi];
    B2.load(x.m, S.fam.name + ' — ' + flowerName(x));
    goStep(2);
  }

  /* ---------------- comparer ---------------- */
  const REL = { iso: ['isostémono', 'isostemonous'], antepet: ['antepétalo (frente a los pétalos)', 'antepetalous (opposite the petals)'], diplo: ['diplostémono', 'diplostemonous'], obdiplo: ['obdiplostémono', 'obdiplostemonous'], poly: ['polistémono (numerosos)', 'polystemonous (numerous)'], oligo: ['oligostémono (menos que los pétalos)', 'oligostemonous (fewer than the petals)'], aniso: ['anisostémono', 'anisostemonous'], dbl: ['el doble, en un solo verticilo', 'twice as many, in one whorl'] };
  const FUS = { free: ['libres', 'free'], mono: ['monadelfos', 'monadelphous'], di: ['diadelfos', 'diadelphous'], poly: ['poliadelfos', 'polyadelphous'], syn: ['anteras unidas (singenesia)', 'united anthers (syngenesious)'], synmono: ['anteras y filamentos unidos', 'anthers and filaments united'] };
  const GYN = { mono: ['un carpelo', 'one carpel'], syn: ['sincárpico (carpelos unidos)', 'syncarpous (united carpels)'], apo: ['apocárpico (carpelos libres)', 'apocarpous (free carpels)'], semi: ['carpelos libres con estilos unidos', 'free carpels with united styles'] };
  const PER = { hetero: ['cáliz y corola', 'calyx and corolla'], homo: ['perigonio de tépalos', 'perigon of tepals'], mono: ['un solo verticilo', 'a single whorl'], none: ['sin perianto', 'no perianth'] };
  function rows(fam, m) {
    const f = FM.normalize(m), lang = I18N.lang === 'en' ? 'en' : 'es', li = lang === 'en' ? 1 : 0;
    const W = FM.W;
    const seg = Formula.segments(f, state.conv, {}).segs;
    const sg = k => { const s = seg.find(x => x.org === k); return s ? `<span class="ff ff-${state.conv} ff-color"><span class="ff-o" data-org="${k}">${s.html}</span></span>` : '—'; };
    const st = k => { const s = seg.find(x => x.org === k); return s ? s.text + ' ' : ''; };
    /* a sterile gynoecium (pistillode of a staminate flower) has no ovary to compare */
    const pistillode = !!f.G && !FM.cmax(FM.total(f.G, { fertile: true }));
    const at = FM.androeciumType(f), gt = pistillode ? null : FM.gynoeciumType(f), mer = FM.merosity(f);
    const andro = at ? [at.rel ? REL[at.rel][li] : null, FUS[at.fusion] ? FUS[at.fusion][li] : null, at.epi ? (at.epi === 'petal' ? ['soldados a la corola', 'fused to the corolla'] : ['soldados al perigonio', 'fused to the perigon'])[li] : null].filter(Boolean).join('; ') : '—';
    return [
      { k: ['Orden', 'Order'], v: esc(fam.order), t: fam.order },
      { k: ['Simetría', 'Symmetry'], v: W.sym[lang][f.sym], t: f.sym },
      { k: ['Sexo de la flor', 'Sex of the flower'], v: W.sex[lang][f.sex], t: f.sex },
      { k: ['Merosidad', 'Merosity'], v: mer && W.mero[lang][mer] ? W.mero[lang][mer] : '—', t: String(mer) },
      { k: ['Perianto', 'Perianth'], v: PER[FM.perianthType(f)][li], t: FM.perianthType(f) },
      { k: ['Cáliz o epicáliz', 'Calyx or epicalyx'], v: [f.E ? sg('E') : '', f.K ? sg('K') : ''].filter(Boolean).join(' ') || '—', t: st('E') + st('K') },
      { k: ['Corola o perigonio', 'Corolla or perigon'], v: [f.C ? sg('C') : '', f.P ? sg('P') : ''].filter(Boolean).join(' ') || '—', t: st('C') + st('P') },
      { k: ['Androceo', 'Androecium'], v: (f.A ? sg('A') + ' · ' : '') + andro, t: st('A') + andro },
      { k: ['Gineceo', 'Gynoecium'], v: gt ? sg('G') + ' · ' + GYN[gt.type][li] : pistillode ? sg('G') + ' · ' + ['pistilodio (estéril)', 'pistillode (sterile)'][li] : '—', t: gt ? st('G') + gt.type : pistillode ? 'pistillode' : '' },
      { k: ['Ovario', 'Ovary'], v: gt ? W.pos[lang][f.G.pos] : '—', t: gt ? f.G.pos : '' },
      { k: ['Placentación', 'Placentation'], v: gt ? W.plac[lang][f.G.plac] : '—', t: gt ? f.G.plac : '' },
      { k: ['Fruto', 'Fruit'], v: esc(T2(fam.fruit)), t: fam.fruit.es, long: true },
    ];
  }
  function cmpSide(side) {
    const fam = S.cmp[side];
    const fl = Fam.allFlowers(fam);
    const k = Math.min(S.cmpFi[side], fl.length - 1);
    return { fam, fl, x: fl[k], k };
  }
  function openCmp(a, b) {
    if (!S.built) build();
    goStepQuiet();
    S.cmp = [Fam.byId(a) || FAMILIES[0], Fam.byId(b) || FAMILIES[1]];
    S.cmpFi = [0, 0];
    show('cmp');
    renderCmp();
    window.scrollTo({ top: 0 });
  }
  function renderCmp() {
    setHash('cmp=' + S.cmp[0].id + ',' + S.cmp[1].id);
    const sides = [cmpSide(0), cmpSide(1)];
    const famOpts = sel => FAMILIES.map(f => `<option value="${f.id}"${f === sel ? ' selected' : ''}>${esc(f.name)} — ${esc(T2({ es: f.es, en: f.en }))}</option>`).join('');
    const col = (s, i) => `<div class="cmp-col" data-side="${i}">
      <select class="sel cmp-fam" data-side="${i}" aria-label="${esc(T(`Familia ${i + 1}`, `Family ${i + 1}`))}">${famOpts(s.fam)}</select>
      <select class="sel cmp-fl" data-side="${i}" aria-label="${esc(T(`Flor de la familia ${i + 1}`, `Flower of family ${i + 1}`))}">${s.fl.map((x, k) => `<option value="${k}"${k === s.k ? ' selected' : ''}>${esc(x.kind === 'species' ? x.sp.sci + (x.label ? ' · ' + T2(x.label) : '') : x.label ? T2(x.label) : T2(['Flor típica', 'Typical flower']))}</option>`).join('')}</select>
      <div class="cmp-figs"><div class="cmp-f paper">${Diagram.svg(s.x.m, { colors: 'natural' })}</div><div class="cmp-f soft">${Flower3D.staticSVG(s.x.m, { colors: 'natural', ratio: 0.8 })}</div></div>
      <div class="cmp-form">${formulaOf(s.x.m, { bracts: true, ovules: true })}</div>
      <button class="btn btn-ghost btn-xs" data-open="${s.fam.id}">${L2('Abrir su ficha', 'Open its sheet')} →</button>
    </div>`;
    const r0 = rows(sides[0].fam, sides[0].x.m), r1 = rows(sides[1].fam, sides[1].x.m);
    const ndiff = r0.filter((r, i) => !r.long && r.t !== r1[i].t).length;
    el('b4Cmp').innerHTML = `
      <div class="fs-top"><button class="btn btn-ghost btn-sm" data-act="list">← ${L2('Todas las familias', 'All families')}</button>
        <h2 class="cmp-title">${L2('Comparar dos familias', 'Compare two families')}</h2>
        <button class="btn btn-ghost btn-sm" data-act="swap" data-es-title="Intercambiar lados" data-en-title="Swap sides">⇄</button></div>
      <div class="cmp-grid">${col(sides[0], 0)}${col(sides[1], 1)}</div>
      <p class="hint cmp-n">${L2(`Las filas marcadas son las que difieren (${ndiff}).`, `The marked rows are the ones that differ (${ndiff}).`)}</p>
      <table class="cmp-table"><thead><tr><th></th><th>${esc(sides[0].fam.name)}</th><th>${esc(sides[1].fam.name)}</th></tr></thead><tbody>
      ${r0.map((r, i) => `<tr class="${!r.long && r.t !== r1[i].t ? 'diff' : ''}"><th>${L2(r.k[0], r.k[1])}</th><td>${r.v}</td><td>${r1[i].v}</td></tr>`).join('')}
      </tbody></table>
      <div class="cmp-grid cmp-chars">${sides.map(s => `<section class="card"><h4>${esc(s.fam.name)}: ${L2('caracteres distintivos', 'distinctive characters')}</h4><ul>${s.fam.chars.es.map((c, k) => `<li>${L2(esc(c), esc(s.fam.chars.en[k]))}</li>`).join('')}</ul></section>`).join('')}</div>`;
    I18N.apply(el('b4Cmp'));
  }

  /* ---------------- building and wiring ---------------- */
  function goStepQuiet() { if (!el('panel-4').classList.contains('active')) goStep(4, { keepScroll: true }); }
  function build() {
    if (S.built) return;
    S.built = true;
    buildList();
    applyFilters();
  }
  function fromHash() {
    const h = location.hash || '';
    const f = /[#&]f=([\w-]+)/.exec(h), c = /[#&]cmp=([\w-]+),([\w-]+)/.exec(h);
    if (f && Fam.byId(f[1])) openFamily(f[1]);
    else if (c) openCmp(c[1], c[2]);
  }
  function init() {
    if (!el('panel-4')) return;
    document.addEventListener('stepchange', e => {
      if (e.detail.step !== 4) return;
      if (!S.built) { build(); show('list'); }
      /* coming back to the block keeps what was open, and the address says so
         (unless the address itself asks for a sheet or a comparison: a link wins) */
      else if (/[#&](f|cmp)=/.test(location.hash)) return;
      else if (S.mode === 'sheet' && S.fam) setHash('f=' + S.fam.id);
      else if (S.mode === 'cmp') setHash('cmp=' + S.cmp[0].id + ',' + S.cmp[1].id);
    });
    window.addEventListener('hashchange', () => { if (el('panel-4').classList.contains('active')) fromHash(); });
    if (el('panel-4').classList.contains('active')) { build(); show('list'); fromHash(); }
    el('b4Search').addEventListener('input', () => { if (S.mode !== 'list') { show('list'); setHash(''); } applyFilters(); });
    el('b4Filters').addEventListener('click', e => {
      if (e.target.closest('#b4Clear')) { S.filters.clear(); el('b4Search').value = ''; applyFilters(); return; }
      const b = e.target.closest('[data-flt]');
      if (!b) return;
      const k = b.dataset.flt;
      if (S.filters.has(k)) S.filters.delete(k); else S.filters.add(k);
      applyFilters();
    });
    el('b4Grid').addEventListener('click', e => {
      if (e.target.closest('dfn')) return;
      const c = e.target.closest('.fm-card');
      if (c) openFamily(c.dataset.id);
    });
    el('b4Grid').addEventListener('keydown', e => { const c = e.target.closest('.fm-card'); if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openFamily(c.dataset.id); } });
    el('b4Tree').addEventListener('click', e => { const a = e.target.closest('[data-f]'); if (a) { e.preventDefault(); openFamily(a.dataset.f); } });
    el('b4CmpBtn').addEventListener('click', () => openCmp(S.fam ? S.fam.id : 'liliaceae', S.fam ? (FAMILIES[(FAMILIES.indexOf(S.fam) + 1) % FAMILIES.length].id) : 'amaryllidaceae'));
    el('b4Sheet').addEventListener('click', e => {
      const b = e.target.closest('[data-act], [data-go], [data-fi]');
      if (!b) return;
      if (b.dataset.act === 'list') toList(S.fam && S.fam.id);
      else if (b.dataset.act === 'build') toBuilder();
      else if (b.dataset.act === 'key') B5.goToFamily(S.fam.id);
      else if (b.dataset.go) openFamily(b.dataset.go);
      else if (b.dataset.fi != null) { selectFlower(+b.dataset.fi); if (b.closest('.sp-row')) el('b4Views').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
    el('b4Sheet').addEventListener('change', e => { if (e.target.id === 'b4CmpWith' && e.target.value) openCmp(S.fam.id, e.target.value); });
    el('b4Cmp').addEventListener('click', e => {
      const b = e.target.closest('[data-act], [data-open]');
      if (!b) return;
      if (b.dataset.open) openFamily(b.dataset.open);
      else if (b.dataset.act === 'list') toList();
      else if (b.dataset.act === 'swap') { S.cmp.reverse(); S.cmpFi.reverse(); renderCmp(); }
    });
    el('b4Cmp').addEventListener('change', e => {
      const t = e.target, side = +t.dataset.side;
      if (t.classList.contains('cmp-fam')) { S.cmp[side] = Fam.byId(t.value); S.cmpFi[side] = 0; renderCmp(); }
      if (t.classList.contains('cmp-fl')) { S.cmpFi[side] = +t.value; renderCmp(); }
    });
    /* ← → move between families while a sheet is open (handy when projecting) */
    document.addEventListener('keydown', e => {
      if (S.mode !== 'sheet' || !el('panel-4').classList.contains('active')) return;
      if (e.target.closest && e.target.closest('input, select, textarea, [contenteditable]')) return;
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const i = FAMILIES.indexOf(S.fam);
      openFamily(FAMILIES[(i + (e.key === 'ArrowRight' ? 1 : -1) + FAMILIES.length) % FAMILIES.length].id);
    });
    document.addEventListener('langchange', () => {
      if (!S.built) return;
      buildTree(); buildFilters(); applyFilters();
      if (S.mode === 'sheet') { const sel = el('b4CmpWith'); if (sel) sel.options[0].textContent = T2(['Comparar con…', 'Compare with…']); }
      if (S.mode === 'cmp') renderCmp();
    });
    document.addEventListener('convchange', () => {
      if (!S.built) return;
      els('#b4Grid .fm-card').forEach(c => { const fam = Fam.byId(c.dataset.id); c.querySelector('.fm-form').innerHTML = Fam.typicalList(fam).map(x => `<div>${formulaOf(Fam.resolve(fam, x.m))}</div>`).join(''); });
      if (S.mode === 'cmp') renderCmp();
    });
  }
  document.addEventListener('DOMContentLoaded', init);

  return { S, GROUPS, TRAITS, groupOf, hasTrait, build, openFamily, openCmp, toList, selectFlower, applyFilters, rows };
})();
window.B4 = B4;
