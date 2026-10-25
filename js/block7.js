/* FloralPro — Block 7: gymnosperms, as a contrast with the flower.

   Three views inside the block:
   · flower and strobilus: an angiosperm flower (the magnolia by default, whose
     spiral parts make it look like a cone) next to a gymnosperm strobilus, the
     table of differences and what corresponds to what;
   · strobili: one example per kind — cycads, Ginkgo, conifers, Ephedra — with
     its pollen and seed structures in linked views (3D, longitudinal section,
     seen from above, one member), the character sheet and the description;
   · species of Mexico: a catalogue with status and protection category, each
     species with its own strobili.
   There is no standard formula for a cone, so the app gives a character sheet
   instead of inventing one. The address keeps what is open
   (#b7&t=str&x=pinus&s=f&e=pol, #b7&sp=taxus-globosa). */

const B7 = (function () {
  const S = { built: false, tab: 'cmp', ex: 'pinus', sex: 'f', stage: 'mat', views: null, cmp: { fl: 'magnolia', st: 'pinus-f', stage: 'mat' }, f3dA: null, c3dB: null, sp: null, spSex: 'f', spStage: 'mat', spViews: null, filters: new Set(), obs: null };
  const T2 = x => Array.isArray(x) ? (I18N.lang === 'en' ? x[1] : x[0]) : (x && typeof x === 'object' ? (I18N.lang === 'en' ? (x.en || x.es) : x.es) : x);
  const Lo = o => L2(o.es, o.en);
  const Lp = p => L2(p[0], p[1]);
  const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const spSlug = sp => sp.sci.toLowerCase().replace(/[^a-z]+/g, '-');
  const NOM = { P: ['En peligro de extinción', 'Endangered'], A: ['Amenazada', 'Threatened'], Pr: ['Sujeta a protección especial', 'Subject to special protection'], E: ['Probablemente extinta en el medio silvestre', 'Probably extinct in the wild'] };
  const ST_SHORT = { end: ['endémica', 'endemic'], nat: ['nativa', 'native'], dom: ['domesticada', 'domesticated'], cult: ['cultivada', 'cultivated'], intro: ['introducida', 'introduced'] };
  const stBadge = st => `<span class="st-badge st-${st}" data-es-title="${Fam.ST[st].es}" data-en-title="${Fam.ST[st].en}" title="${esc(T2(Fam.ST[st]))}">${Lp(ST_SHORT[st])}</span>`;
  const nomBadge = c => c ? `<span class="nom-badge" data-es-title="NOM-059-SEMARNAT-2010: ${NOM[c][0]}" data-en-title="NOM-059-SEMARNAT-2010: ${NOM[c][1]}" title="NOM-059: ${esc(T2(NOM[c]))}">NOM-059 · ${c}</span>` : '';
  const sexName = (m, sex) => sex === 'm'
    ? L2('Estróbilo masculino (de polen)', 'Male strobilus (pollen)')
    : (m && m.kind !== 'cone' ? L2('Estructura femenina (de semillas)', 'Female structure (seeds)') : L2('Cono femenino (de semillas)', 'Female cone (seeds)'));
  const bothLang = fn => { const a = fn('es'), b = fn('en'); return a.map((x, i) => ({ es: x, en: b[i] })); };

  /* ---------------- linked views of one strobilus ---------------- */
  function ConeViews(root, o) {
    const st = { m: o.model, stage: o.stage || 'mat', hover: null, lock: null, ext: null, labels: true, c3d: null };
    root.classList.add('cviews');
    const dl = what => `<span class="dl-wrap"><button class="icon-btn sm v-dl" data-what="${what}" data-es-title="Descargar la figura" data-en-title="Download the figure" title="Descargar la figura">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10l5 5 5-5M5 19h14"/></svg></button>
      <span class="dl-menu"><button data-fmt="svg">SVG</button><button data-fmt="png">PNG</button></span></span>`;
    root.innerHTML = `
      <div class="quad-grid">
        <div class="pane"><div class="pane-h"><span class="pane-t">${L2('En 3D', 'In 3D')}</span>
          <label class="range cv-openl">${L2('Abrir', 'Open')}<input type="range" class="cv-open" min="0" max="1" step="0.01" value="0"></label>
          <label class="tgl"><input type="checkbox" class="cv-spin"> ${L2('Girar', 'Spin')}</label>${dl('3d')}</div>
          <div class="pane-b"><div class="cv-3d"></div></div></div>
        <div class="pane"><div class="pane-h"><span class="pane-t">${L2('Corte longitudinal', 'Longitudinal section')}</span>
          <label class="tgl"><input type="checkbox" class="cv-lbl" checked> ${L2('Nombres', 'Labels')}</label>${dl('section')}</div>
          <div class="pane-b paper"><div class="cv-sec"></div></div></div>
        <div class="pane"><div class="pane-h"><span class="pane-t">${L2('Vista desde arriba', 'Seen from above')}</span>${dl('diagram')}</div>
          <div class="pane-b paper cv-col"><div class="cv-dia"></div><p class="cv-cap"></p></div></div>
        <div class="pane"><div class="pane-h"><span class="pane-t">${L2('Una pieza', 'One member')}</span></div>
          <div class="pane-b paper"><div class="cv-unit"></div></div></div>
      </div>
      <div class="formula-legend cv-legend"></div>`;
    I18N.apply(root);
    const q = s => root.querySelector(s);
    function figures() {
      q('.cv-sec').innerHTML = ConeFig.section(st.m, { stage: st.stage, labels: st.labels });
      q('.cv-dia').innerHTML = ConeFig.diagram(st.m, { stage: st.stage });
      q('.cv-cap').textContent = ConeFig.caption(st.m);
      q('.cv-unit').innerHTML = ConeFig.unit(st.m, { stage: st.stage });
      q('.cv-legend').innerHTML = CM.organs(st.m, st.stage).map(org => `<span class="wl" data-org="${org}"><span class="sw" style="background:${Cone3D.colorHex(st.m, org, st.stage)}"></span>${Lo(GYMNO.ORG[org])}</span>`).join('') +
        `<span class="wl muted" style="cursor:default">${L2('Clic en una parte para fijarla', 'Click a part to pin it')}</span>`;
      q('.cv-openl').style.display = Cone3D.opensUp(st.m) ? '' : 'none';
      apply();
    }
    function render(newModel) {
      if (!st.c3d) st.c3d = Cone3D.mount(q('.cv-3d'), st.m, { stage: st.stage, height: 330, onHover: org => { st.hover = org; apply(); } });
      else if (newModel) { st.c3d.set(st.m, st.stage); q('.cv-open').value = 0; st.c3d.setOpen(0); }
      else st.c3d.setStage(st.stage);
      figures();
    }
    function apply() {
      const org = st.lock || st.hover || st.ext || null;
      root.querySelectorAll('svg.cfig').forEach(svg => {
        svg.classList.toggle('has-hl', !!org);
        svg.querySelectorAll('.c-o').forEach(n => n.classList.toggle('hl', !!org && n.getAttribute('data-org') === org));
      });
      if (st.c3d) st.c3d.highlight(org);
      root.querySelectorAll('.wl[data-org]').forEach(n => n.classList.toggle('hl', !!org && n.dataset.org === org));
      if (o.onHL) o.onHL(org);
    }
    const pick = e => { const t = e.target.closest('[data-org]'); return t && root.contains(t) && !t.closest('.cv-3d') ? t.getAttribute('data-org') : null; };
    root.addEventListener('mouseover', e => { if (e.target.closest('.cv-3d')) return; const org = pick(e); if (org !== st.hover) { st.hover = org; apply(); } });
    root.addEventListener('mouseleave', () => { st.hover = null; apply(); });
    root.addEventListener('click', e => {
      const b = e.target.closest('.v-dl');
      if (b) { const w = b.closest('.dl-wrap'); root.querySelectorAll('.dl-wrap.open').forEach(x => { if (x !== w) x.classList.remove('open'); }); w.classList.toggle('open'); return; }
      const f = e.target.closest('.dl-menu button');
      if (f) { const w = f.closest('.dl-wrap'); w.classList.remove('open'); download(w.querySelector('.v-dl').dataset.what, f.dataset.fmt); return; }
      if (e.target.closest('select, input, button, label')) return;
      const org = pick(e) || (e.target.closest('.cv-3d') && e.target.closest('[data-org]') ? e.target.closest('[data-org]').getAttribute('data-org') : null);
      if (!org) return;
      st.lock = st.lock === org ? null : org;
      apply();
    });
    q('.cv-open').addEventListener('input', e => st.c3d.setOpen(+e.target.value));
    q('.cv-spin').addEventListener('change', e => st.c3d.spin(e.target.checked));
    q('.cv-lbl').addEventListener('change', e => { st.labels = e.target.checked; figures(); });
    function download(what, fmt) {
      const name = slug('floralpro-' + (o.fileName ? o.fileName() : 'estrobilo') + '-' + ({ '3d': '3d', section: 'corte', diagram: 'desde-arriba' }[what]));
      const svg = what === '3d' ? st.c3d.svg : what === 'section' ? q('.cv-sec svg') : q('.cv-dia svg');
      if (!svg) return;
      if (fmt === 'svg') Export.svg(svg, name + '.svg'); else Export.png(svg, name + '.png', '#ffffff');
    }
    document.addEventListener('click', e => { if (!e.target.closest('.dl-wrap')) root.querySelectorAll('.dl-wrap.open').forEach(x => x.classList.remove('open')); });
    document.addEventListener('langchange', () => { if (root.isConnected) figures(); });
    render(true);
    return {
      set(m, stage) { st.m = m; if (stage) st.stage = stage; st.lock = null; render(true); },
      setStage(s) { st.stage = s; render(false); },
      highlight(org) { st.ext = org; apply(); },
      refresh() { figures(); },
      get model() { return st.m; },
      get stage() { return st.stage; },
      get c3d() { return st.c3d; },
      root,
    };
  }

  /* the character sheet and the description, in both languages */
  function sheetHTML(m) {
    const rows = bothLang(l => CM.sheet(m, l));
    return `<table class="g-sheet">${rows.map(r => `<tr><th>${L2(esc(r.es.k), esc(r.en.k))}</th><td>${L2(esc(r.es.v), esc(r.en.v))}</td></tr>`).join('')}</table>`;
  }
  function descHTML(m, stage) {
    const d = bothLang(l => CM.describe(m, stage, l));
    return d.map(p => `<p data-org="${p.es.org}">${L2(p.es.html, p.en.html)}</p>`).join('');
  }
  function stageSeg(m, sex, stage, attr) {
    return `<div class="seg g-seg" ${attr}="sex"><button data-v="f"${sex === 'f' ? ' class="on"' : ''}>${sexName(m.f, 'f')}</button><button data-v="m"${sex === 'm' ? ' class="on"' : ''}>${sexName(m.m, 'm')}</button></div>` +
      (sex === 'f' ? `<div class="seg g-seg" ${attr}="stage"><button data-v="pol"${stage === 'pol' ? ' class="on"' : ''}>${L2('En la polinización', 'At pollination')}</button><button data-v="mat"${stage === 'mat' ? ' class="on"' : ''}>${L2('Madura', 'Ripe')}</button></div>` : '');
  }
  function setHash(h) { try { history.replaceState(null, '', '#b7' + (h ? '&' + h : '')); } catch (e) { /* file:// in some browsers */ } }

  /* ---------------- tabs ---------------- */
  function showTab(t, noHash) {
    if (!S.built) build();
    S.tab = t;
    els('#g7Tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === t));
    el('g7Cmp').style.display = t === 'cmp' ? '' : 'none';
    el('g7Str').style.display = t === 'str' ? '' : 'none';
    el('g7Sp').style.display = t === 'sp' ? '' : 'none';
    if (t === 'cmp') renderCmp();
    if (t === 'str') renderStr();
    if (t === 'sp') { if (S.sp) openSpecies(S.sp, true); else renderSpList(); }
    if (!noHash) setHash(t === 'cmp' ? '' : t === 'str' ? `t=str&x=${S.ex}&s=${S.sex}&e=${S.stage}` : S.sp ? 'sp=' + spSlug(S.sp) : 't=sp');
  }

  /* ---------------- flower and strobilus ---------------- */
  const flowerOf = id => { const s = SPECIMENS.find(x => x.id === id); return s ? s.flowers[0].m : null; };
  function hlOrg(m, stage, org) {
    if (!org) return null;
    const have = CM.organs(m, stage);
    const alt = { ov: ['ov', 'seed', 'sarc'], seed: ['seed', 'sarc', 'ov'], scale: ['scale', 'bscale', 'mgsp'], spor: ['spor', 'syn'], misp: ['misp'], mgsp: ['mgsp', 'scale', 'bscale'], axis: ['axis', 'ped', 'stem'] }[org] || [org];
    return alt.find(x => have.includes(x)) || null;
  }
  function renderCmp() {
    const box = el('g7Cmp');
    const flOpts = SPECIMENS.map(s => `<option value="${s.id}"${s.id === S.cmp.fl ? ' selected' : ''}>${esc(s.sci)} — ${esc(T2(s.common))}</option>`).join('');
    const stOpts = GYMNO.EXAMPLES.map(e => ['f', 'm'].map(sex => { const id = e.id + '-' + sex; return `<option value="${id}"${id === S.cmp.st ? ' selected' : ''}>${esc(e.sci)} · ${esc(T2(sex === 'f' ? ['femenino', 'female'] : ['masculino', 'male']))}</option>`; }).join('')).join('');
    const gm = GYMNO.byId(S.cmp.st);
    box.innerHTML = `
      <p class="hint g-intro">${L2('Las gimnospermas (cícadas, Ginkgo, coníferas y Gnetales) también producen semillas, pero sus óvulos quedan desnudos sobre escamas o esporofilos: no hay carpelo que los encierre, ni flor, ni fruto. A la izquierda, una flor; a la derecha, un estróbilo. La magnolia se eligió porque sus piezas en espiral sobre un receptáculo alargado la hacen parecer un cono.',
        'Gymnosperms (cycads, Ginkgo, conifers and Gnetales) also produce seeds, but their ovules are naked on scales or sporophylls: no carpel encloses them, and there is no flower and no fruit. On the left, a flower; on the right, a strobilus. The magnolia was chosen because its spiral parts on an elongated receptacle make it look like a cone.')}</p>
      <div class="g-pair">
        <section class="card g-side">
          <div class="g-side-h"><h3>${L2('Flor de angiosperma', 'Angiosperm flower')}</h3><select class="sel" id="g7Fl" aria-label="${T('Flor de angiosperma', 'Angiosperm flower')}" data-es-title="Flor de angiosperma" data-en-title="Angiosperm flower">${flOpts}</select></div>
          <div class="g-3d" id="g7FlV"></div>
          <label class="range">${L2('Separar verticilos', 'Pull whorls apart')}<input type="range" id="g7FlEx" min="0" max="1" step="0.01" value="0"></label>
        </section>
        <section class="card g-side">
          <div class="g-side-h"><h3>${L2('Estróbilo de gimnosperma', 'Gymnosperm strobilus')}</h3><select class="sel" id="g7St" aria-label="${T('Estróbilo de gimnosperma', 'Gymnosperm strobilus')}" data-es-title="Estróbilo de gimnosperma" data-en-title="Gymnosperm strobilus">${stOpts}</select></div>
          <div class="g-3d" id="g7StV"></div>
          <div class="g-side-f">
            ${gm.sex === 'f' ? `<div class="seg g-seg" id="g7StStage"><button data-v="pol"${S.cmp.stage === 'pol' ? ' class="on"' : ''}>${L2('En la polinización', 'At pollination')}</button><button data-v="mat"${S.cmp.stage === 'mat' ? ' class="on"' : ''}>${L2('Madura', 'Ripe')}</button></div>` : ''}
            <label class="range" id="g7StOpenL">${L2('Abrir', 'Open')}<input type="range" id="g7StOpen" min="0" max="1" step="0.01" value="0"></label>
            <button class="btn btn-ghost btn-sm" data-go7="${gm.ex}" data-sex="${gm.sex}">${L2('Ver en detalle', 'See in detail')} →</button>
          </div>
        </section>
      </div>
      <section class="card">
        <h3>${L2('Flor frente a estróbilo', 'Flower versus strobilus')}</h3>
        <p class="hint">${L2('Pasa el cursor por una fila para señalar la parte en el estróbilo.', 'Hover over a row to point at the part in the strobilus.')}</p>
        <div class="g-tablewrap"><table class="g-ctab"><thead><tr><th></th><th>${L2('Angiospermas', 'Angiosperms')}</th><th>${L2('Gimnospermas', 'Gymnosperms')}</th></tr></thead>
        <tbody>${GYMNO.CONTRAST.map(r => `<tr data-org="${r.org || ''}"><th>${Lp(r.k)}</th><td>${Lp(r.a)}</td><td>${Lp(r.g)}</td></tr>`).join('')}</tbody></table></div>
      </section>
      <section class="card">
        <h3>${L2('¿Qué corresponde a qué?', 'What corresponds to what?')}</h3>
        <div class="g-homs">${GYMNO.HOMOLOGY.map((h, i) => `<div class="g-hom" data-org="${h.org}" data-i="${i}">
          <div class="g-hom-row"><span class="g-hom-a">${Lp(h.a)}</span><span class="g-hom-x">↔</span><span class="g-hom-g">${Lp(h.g)}</span></div>
          <div class="g-hom-fig"></div>
          <p>${Lp(h.t)}</p></div>`).join('')}</div>
      </section>`;
    I18N.apply(box);
    S.cmpRow = null;
    if (S.f3dA) { try { S.f3dA.destroy(); } catch (e) { /* gone */ } }
    if (S.c3dB) { try { S.c3dB.destroy(); } catch (e) { /* gone */ } }
    S.f3dA = Flower3D.mount(el('g7FlV'), flowerOf(S.cmp.fl), { height: 300 });
    S.c3dB = Cone3D.mount(el('g7StV'), gm, { stage: gm.sex === 'm' ? 'mat' : S.cmp.stage, height: 300 });
    el('g7StOpenL').style.display = Cone3D.opensUp(gm) ? '' : 'none';
    /* the small figures of the homologies: the part of the strobilus, lit */
    /* (the parts hidden inside a closed cone are shown in section) */
    const HF = { misp: ['pinus-m', 'mat', '3d'], spor: ['pinus-m', 'mat', '3d'], mgsp: ['cycas-f', 'pol', '3d'], scale: ['pinus-f', 'pol', 'sec'], ov: ['pinus-f', 'pol', 'sec'], seed: ['pinus-f', 'mat', 'sec'] };
    els('#g7Cmp .g-hom').forEach(d => {
      const f = HF[d.dataset.org], org = d.dataset.org;
      if (!f) return;
      const m = GYMNO.byId(f[0]);
      d.querySelector('.g-hom-fig').innerHTML = f[2] === '3d' ? Cone3D.staticSVG(m, { stage: f[1], open: 0.5, focus: org, ratio: 0.8 }) : ConeFig.section(m, { stage: f[1], labels: false, focus: org });
    });
  }

  /* ---------------- strobili ---------------- */
  function navHTML() {
    return GYMNO.LINEAGE.map(L => {
      const exs = GYMNO.EXAMPLES.filter(e => GYMNO.grpById(e.grp).lin === L.id);
      return `<div class="g-nav-g"><div class="g-nav-t">${Lo(L)}</div>${exs.map(e => `<a href="#" class="g-nav-x${e.id === S.ex ? ' on' : ''}" data-x="${e.id}"><i>${esc(e.sci)}</i><span>${esc(GYMNO.grpById(e.grp).name)}</span></a>`).join('')}</div>`;
    }).join('');
  }
  function renderStr() {
    const box = el('g7Str');
    if (!box.dataset.done) {
      box.innerHTML = `<div class="g-layout"><nav class="g-nav card" id="g7Nav"></nav><div class="g-main"><div id="g7Head"></div><div id="g7Views"></div><div id="g7Body"></div></div></div>`;
      box.dataset.done = '1';
    }
    el('g7Nav').innerHTML = navHTML();
    const ex = GYMNO.exById(S.ex), grp = GYMNO.grpById(ex.grp);
    const models = { f: GYMNO.byId(ex.id + '-f'), m: GYMNO.byId(ex.id + '-m') };
    const m = models[S.sex];
    const stage = S.sex === 'm' ? 'mat' : S.stage;
    el('g7Head').innerHTML = `
      <header class="g-head">
        <div><h2><i>${esc(ex.sci)}</i></h2><div class="fs-vern">${L2(esc(ex.es), esc(ex.en))} · <span class="muted">${esc(grp.name)} · ${esc(grp.order)}</span> ${stBadge(ex.st)}</div>
        <p class="g-note">${Lo(ex.note)}</p></div>
      </header>
      <div class="g-segs" id="g7Segs">${stageSeg(models, S.sex, stage, 'data-seg7')}</div>`;
    if (!S.views) S.views = ConeViews(el('g7Views'), { model: m, stage, fileName: () => GYMNO.exById(S.ex).sci + '-' + S.sex, onHL: org => { els('#g7Body .desc-box p[data-org]').forEach(p => p.classList.toggle('hl', !!org && p.dataset.org === org)); } });
    else S.views.set(m, stage);
    const spp = GYMNO.SPECIES.filter(s => s.grp === grp.id);
    el('g7Body').innerHTML = `
      <div class="g-cols">
        <section class="card"><h3>${L2('Ficha de caracteres', 'Character sheet')}</h3>
          <p class="hint">${L2('Los estróbilos no tienen una fórmula como la de la flor; estos son los caracteres con que se describen.', 'Strobili have no formula like that of the flower; these are the characters used to describe them.')}</p>
          ${sheetHTML(m)}</section>
        <section class="card"><h3>${L2('Descripción', 'Description')}</h3><div class="desc-box">${descHTML(m, stage)}</div></section>
      </div>
      <section class="card fs-ph" id="g7Ph" style="display:none"></section>
      <section class="card g-grp">
        <h3>${esc(grp.name)} <span class="muted">· ${L2(esc(grp.es), esc(grp.en))}</span></h3>
        <ul>${grp.chars.es.map((c, i) => `<li>${L2(esc(c), esc(grp.chars.en[i]))}</li>`).join('')}</ul>
        <h4>${L2('En México', 'In Mexico')}</h4><p>${Lo(grp.mx)}</p>
        ${spp.length ? `<h4>${L2('Especies en el catálogo', 'Species in the catalogue')}</h4><div class="chips">${spp.map(s => `<button class="chip sp" data-sp="${spSlug(s)}"><i>${esc(s.sci)}</i></button>`).join('')}</div>` : ''}
      </section>`;
    I18N.apply(el('g7Str'));
    fillPhotos('g7Ph', p => p.gym === ex.id || (p.sp && spp.some(s => s.sci === p.sp)));
  }
  function goExample(id, sex, stage) {
    if (!GYMNO.exById(id)) return;
    S.ex = id;
    if (sex) S.sex = sex;
    if (stage) S.stage = stage;
    if (!el('panel-7').classList.contains('active')) goStep(7, { keepScroll: true });
    showTab('str');
  }

  /* ---------------- species of Mexico ---------------- */
  function renderSpList() {
    S.sp = null;
    const box = el('g7Sp');
    const fams = GYMNO.GROUPS.filter(g => GYMNO.SPECIES.some(s => s.grp === g.id));
    const sts = ['end', 'nat', 'cult'].filter(s => GYMNO.SPECIES.some(x => x.st === s));
    box.innerHTML = `
      <div class="g-filters card">
        <input class="at-search" id="g7Search" aria-label="${esc(T('Buscar especie o nombre común', 'Search species or common name'))}" data-es-title="Buscar especie o nombre común" data-en-title="Search species or common name" placeholder="${esc(T2(['Buscar especie o nombre común…', 'Search species or common name…']))}" data-es-ph="Buscar especie o nombre común…" data-en-ph="Search species or common name…">
        <div class="fm-frow"><span class="fm-flab">${L2('Familia', 'Family')}</span>${fams.map(g => `<button class="chip" data-flt="g:${g.id}">${esc(g.name)} <span class="n">${GYMNO.SPECIES.filter(s => s.grp === g.id).length}</span></button>`).join('')}</div>
        <div class="fm-frow"><span class="fm-flab">${L2('Estatus', 'Status')}</span>${sts.map(s => `<button class="chip st-chip st-${s}" data-flt="st:${s}">${Lp(ST_SHORT[s])} <span class="n">${GYMNO.SPECIES.filter(x => x.st === s).length}</span></button>`).join('')}
          <button class="chip" data-flt="nom:1">${L2('Protegidas (NOM-059)', 'Protected (NOM-059)')} <span class="n">${GYMNO.SPECIES.filter(x => x.nom).length}</span></button></div>
        <div class="g-count" id="g7Count"></div>
      </div>
      <div class="fm-grid g-grid" id="g7Grid">${GYMNO.SPECIES.map((s, i) => {
        const g = GYMNO.grpById(s.grp);
        return `<article class="fm-card g-card" data-i="${i}" tabindex="0">
          <div class="fm-fig g-fig"></div>
          <div class="fm-body"><div class="fm-ord">${esc(g.name)}</div><h4><i>${esc(s.sci)}</i></h4><div class="fm-vern">${L2(esc(s.es), esc(s.en))}</div>
          <div class="fm-st">${stBadge(s.st)}${nomBadge(s.nom)}</div></div></article>`;
      }).join('')}</div>`;
    I18N.apply(box);
    applySpFilters();
  }
  function drawCard(fig) {
    const sp = GYMNO.SPECIES[+fig.closest('.g-card').dataset.i];
    const m = GYMNO.speciesModel(sp, 'f') || GYMNO.speciesModel(sp, 'm');
    fig.innerHTML = Cone3D.staticSVG(m, { stage: 'mat', ratio: 0.9 });
    fig.dataset.done = '1';
  }
  function observe() {
    if (S.obs) S.obs.disconnect();
    const figs = els('#g7Grid .g-fig').filter(f => !f.dataset.done && f.closest('.g-card').style.display !== 'none');
    if (!('IntersectionObserver' in window)) { figs.forEach(drawCard); return; }
    S.obs = new IntersectionObserver(en => en.forEach(e => { if (e.isIntersecting && !e.target.dataset.done) { drawCard(e.target); S.obs.unobserve(e.target); } }), { rootMargin: '300px 0px' });
    figs.forEach(f => S.obs.observe(f));
  }
  function applySpFilters() {
    const q = norm((el('g7Search') || {}).value || '');
    const byKind = {};
    S.filters.forEach(k => { const [a, b] = k.split(':'); (byKind[a] = byKind[a] || []).push(b); });
    let n = 0;
    els('#g7Grid .g-card').forEach(c => {
      const s = GYMNO.SPECIES[+c.dataset.i];
      const ok = (!q || norm([s.sci, s.es, s.en, GYMNO.grpById(s.grp).name].join(' ')).includes(q)) &&
        (!byKind.g || byKind.g.includes(s.grp)) && (!byKind.st || byKind.st.includes(s.st)) && (!byKind.nom || !!s.nom);
      c.style.display = ok ? '' : 'none';
      if (ok) n++;
    });
    els('#g7Sp [data-flt]').forEach(b => b.classList.toggle('on', S.filters.has(b.dataset.flt)));
    el('g7Count').innerHTML = L2(`${n} de ${GYMNO.SPECIES.length} especies`, `${n} of ${GYMNO.SPECIES.length} species`);
    observe();
  }
  function openSpecies(sp, keepSex) {
    if (typeof sp === 'string') sp = GYMNO.SPECIES.find(s => spSlug(s) === sp);
    if (!sp) return;
    if (!S.built) build();
    S.sp = sp;
    if (!keepSex) { S.spSex = GYMNO.speciesModel(sp, 'f') ? 'f' : 'm'; S.spStage = 'mat'; }
    const box = el('g7Sp'), g = GYMNO.grpById(sp.grp), i = GYMNO.SPECIES.indexOf(sp);
    const prev = GYMNO.SPECIES[(i - 1 + GYMNO.SPECIES.length) % GYMNO.SPECIES.length], next = GYMNO.SPECIES[(i + 1) % GYMNO.SPECIES.length];
    const models = { f: GYMNO.speciesModel(sp, 'f'), m: GYMNO.speciesModel(sp, 'm') };
    const stage = S.spSex === 'm' ? 'mat' : S.spStage;
    const m = models[S.spSex];
    box.innerHTML = `
      <div class="fs-top">
        <button class="btn btn-ghost btn-sm" data-act7="list">← ${L2('Todas las especies', 'All species')}</button>
        <span class="fs-pn"><button class="btn btn-ghost btn-sm" data-sp="${spSlug(prev)}">‹ <i>${esc(prev.sci)}</i></button><button class="btn btn-ghost btn-sm" data-sp="${spSlug(next)}"><i>${esc(next.sci)}</i> ›</button></span>
      </div>
      <header class="g-head"><div>
        <h2><i>${esc(sp.sci)}</i></h2>
        <div class="fs-vern">${L2(esc(sp.es), esc(sp.en))} · <span class="muted">${esc(g.name)} · ${esc(g.order)}</span> ${stBadge(sp.st)} ${nomBadge(sp.nom)}</div>
        <p class="g-note">${Lo(sp.note)}</p>
        ${sp.nom ? `<p class="hint">${L2(`En la NOM-059-SEMARNAT-2010: ${NOM[sp.nom][0].toLowerCase()} (${sp.nom}).`, `In NOM-059-SEMARNAT-2010: ${NOM[sp.nom][1].toLowerCase()} (${sp.nom}).`)}</p>` : ''}
      </div></header>
      <div class="g-segs" id="g7SpSegs">${stageSeg(models, S.spSex, stage, 'data-segsp')}</div>
      <div id="g7SpViews"></div>
      <section class="card fs-ph" id="g7SpPh" style="display:none"></section>
      <div class="g-cols">
        <section class="card"><h3>${L2('Ficha de caracteres', 'Character sheet')}</h3>${sheetHTML(m)}</section>
        <section class="card"><h3>${L2('Descripción', 'Description')}</h3><div class="desc-box">${descHTML(m, stage)}</div>
          <button class="btn btn-ghost btn-sm" data-go7="${sp.ex}" data-sex="${S.spSex}">${L2('Comparar con el ejemplo del grupo', 'Compare with the example of the group')} →</button></section>
      </div>`;
    I18N.apply(box);
    S.spViews = ConeViews(el('g7SpViews'), { model: m, stage, fileName: () => S.sp.sci + '-' + S.spSex, onHL: org => { els('#g7Sp .desc-box p[data-org]').forEach(p => p.classList.toggle('hl', !!org && p.dataset.org === org)); } });
    fillPhotos('g7SpPh', p => p.sp === sp.sci);
    setHash('sp=' + spSlug(sp));
    window.scrollTo({ top: 0 });
  }

  /* the teacher's own photos (Block 8) */
  function fillPhotos(id, test) {
    if (!window.Photos) return;
    Photos.ready.then(() => {
      const box = el(id);
      if (!box) return;
      const list = Photos.list().filter(test);
      box.style.display = list.length ? '' : 'none';
      box.innerHTML = list.length ? PhotoView.strip(list, L2('Mis fotos', 'My photos')) : '';
    });
  }

  /* ---------------- terms of the glossary that can be seen here ---------------- */
  function termLink(key) {
    const org = Object.keys(GYMNO.ORG).find(k => GYMNO.ORG[k].term === key);
    if (!org) return null;
    for (const stg of ['mat', 'pol']) {
      const s = GYMNO.STROBILI.find(x => CM.organs(x, stg).includes(org));
      if (s) return { ex: s.ex, sex: s.sex, stage: stg, org };
    }
    return null;
  }
  function showTerm(key) {
    const t = termLink(key);
    if (!t) return;
    goExample(t.ex, t.sex, t.stage);
    setTimeout(() => { if (S.views) S.views.highlight(t.org); }, 60);
  }

  /* ---------------- wiring ---------------- */
  function build() {
    if (S.built) return;
    S.built = true;
    el('g7Tabs').addEventListener('click', e => { const b = e.target.closest('button[data-tab]'); if (b) showTab(b.dataset.tab); });
    const panel = el('panel-7');
    panel.addEventListener('click', e => {
      const go = e.target.closest('[data-go7]');
      if (go) { e.preventDefault(); goExample(go.dataset.go7, go.dataset.sex); return; }
      const nx = e.target.closest('.g-nav-x');
      if (nx) { e.preventDefault(); S.ex = nx.dataset.x; renderStr(); setHash(`t=str&x=${S.ex}&s=${S.sex}&e=${S.stage}`); return; }
      const sg = e.target.closest('[data-seg7] button');
      if (sg) {
        const kind = sg.parentElement.dataset.seg7;
        if (kind === 'sex') S.sex = sg.dataset.v; else S.stage = sg.dataset.v;
        renderStr(); setHash(`t=str&x=${S.ex}&s=${S.sex}&e=${S.stage}`); return;
      }
      const ss = e.target.closest('[data-segsp] button');
      if (ss) { if (ss.parentElement.dataset.segsp === 'sex') S.spSex = ss.dataset.v; else S.spStage = ss.dataset.v; const y = window.scrollY; openSpecies(S.sp, true); window.scrollTo({ top: y }); return; }
      const sp = e.target.closest('[data-sp]');
      if (sp) { e.preventDefault(); if (S.tab !== 'sp') { S.sp = GYMNO.SPECIES.find(s => spSlug(s) === sp.dataset.sp); showTab('sp'); } else openSpecies(sp.dataset.sp); return; }
      if (e.target.closest('[data-act7="list"]')) { renderSpList(); setHash('t=sp'); return; }
      const flt = e.target.closest('[data-flt]');
      if (flt && e.target.closest('#g7Sp')) { const k = flt.dataset.flt; if (S.filters.has(k)) S.filters.delete(k); else S.filters.add(k); applySpFilters(); return; }
      const card = e.target.closest('.g-card');
      if (card) { openSpecies(GYMNO.SPECIES[+card.dataset.i]); return; }
      const stg = e.target.closest('#g7StStage button');
      if (stg) { S.cmp.stage = stg.dataset.v; els('#g7StStage button').forEach(b => b.classList.toggle('on', b === stg)); S.c3dB.setStage(S.cmp.stage); }
    });
    panel.addEventListener('keydown', e => { const c = e.target.closest('.g-card'); if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openSpecies(GYMNO.SPECIES[+c.dataset.i]); } });
    panel.addEventListener('input', e => {
      if (e.target.id === 'g7Search') applySpFilters();
      if (e.target.id === 'g7FlEx') S.f3dA.setExplode(+e.target.value);
      if (e.target.id === 'g7StOpen') S.c3dB.setOpen(+e.target.value);
    });
    panel.addEventListener('change', e => {
      if (e.target.id === 'g7Fl') { S.cmp.fl = e.target.value; S.f3dA.set(flowerOf(S.cmp.fl)); el('g7FlEx').value = 0; }
      if (e.target.id === 'g7St') { S.cmp.st = e.target.value; renderCmp(); }
    });
    /* the table and the homologies point at the part in the strobilus */
    panel.addEventListener('mouseover', e => {
      if (!S.c3dB || S.tab !== 'cmp') return;
      const r = e.target.closest('#g7Cmp .g-ctab tr[data-org], #g7Cmp .g-hom');
      if (r === S.cmpRow) return;
      S.cmpRow = r;
      const gm = GYMNO.byId(S.cmp.st);
      S.c3dB.highlight(r ? hlOrg(gm, gm.sex === 'm' ? 'mat' : S.cmp.stage, r.dataset.org) : null);
      els('#g7Cmp .g-ctab tr, #g7Cmp .g-hom').forEach(x => x.classList.toggle('hl', x === r));
    });
    document.addEventListener('langchange', () => {
      if (!el('panel-7').classList.contains('active')) { S.stale = true; return; }
      refreshLang();
    });
  }
  function refreshLang() {
    S.stale = false;
    if (S.tab === 'cmp') renderCmp();
    if (S.tab === 'str') renderStr();
    if (S.tab === 'sp') { if (S.sp) openSpecies(S.sp, true); else { renderSpList(); } }
  }
  function fromHash() {
    const h = location.hash || '';
    const g = k => { const m = new RegExp('[#&]' + k + '=([\\w-]+)').exec(h); return m ? m[1] : null; };
    if (g('sp')) { const sp = GYMNO.SPECIES.find(s => spSlug(s) === g('sp')); if (sp) { S.sp = sp; showTab('sp', true); return; } }
    const t = g('t');
    if (t === 'str') { if (g('x') && GYMNO.exById(g('x'))) S.ex = g('x'); if (g('s') === 'm' || g('s') === 'f') S.sex = g('s'); if (g('e') === 'pol' || g('e') === 'mat') S.stage = g('e'); showTab('str', true); return; }
    showTab(t === 'sp' ? 'sp' : S.tab || 'cmp', true);
  }
  function init() {
    if (!el('panel-7')) return;
    document.addEventListener('stepchange', e => {
      if (e.detail.step !== 7) return;
      if (!S.built) fromHash();
      else if (S.stale) refreshLang();
    });
    if (el('panel-7').classList.contains('active')) fromHash();
    /* a link pasted while the app is open (#b7&sp=…) is followed too */
    window.addEventListener('hashchange', () => { if (/^#b7&/.test(location.hash || '')) fromHash(); });
  }
  document.addEventListener('DOMContentLoaded', init);

  return { S, showTab, goExample, openSpecies, termLink, showTerm, ConeViews, spSlug, renderCmp };
})();
window.B7 = B7;
