/* FloralPro — Block 2: build a flower.

   An editor of the flower model, whorl by whorl, with the five linked views
   updating as the student changes anything. The flower can also be built from
   a typed formula (with a keyboard for the symbols), started from a template or
   from one of the example species, saved in the browser ("my flowers"),
   exported and imported as a file, and shared as a link that opens the app on
   this block with the same flower. Coherence checks explain, in words, what
   does not fit (for instance a parietal placentation in an apocarpous
   gynoecium).

   The model edited here is the plain object of model.js (the same format as
   the example species), so anything built here can be used anywhere else. */

const B2 = (function () {
  const S = { m: null, name: '', hist: [], fut: [], views: null, lastSaved: null };
  const ORGS = ['E', 'K', 'C', 'P', 'A', 'G'];
  const T2 = x => x && typeof x === 'object' ? (I18N.lang === 'en' ? (x.en || x.es) : x.es) : x;
  const KEY_SAVED = 'myflowers';

  /* ---------------- templates ---------------- */
  const TEMPLATES = [
    { id: 't-eudicot', es: 'Eudicotiledónea pentámera básica', en: 'Basic pentamerous eudicot',
      m: { sym: 'actino', B: 1, Bt: 2, K: { w: [5] }, C: { w: [5] }, A: { w: [5, 5] }, G: { w: [{ n: 5, connate: true }], plac: 'axile', ov: '∞' } } },
    { id: 't-tetra', es: 'Eudicotiledónea tetrámera', en: 'Tetramerous eudicot',
      m: { sym: 'actino', K: { w: [4] }, C: { w: [4] }, A: { w: [4] }, G: { w: [{ n: 2, connate: true }], plac: 'axile' } } },
    { id: 't-monocot', es: 'Monocotiledónea trímera básica', en: 'Basic trimerous monocot',
      m: { sym: 'actino', B: 1, Bt: 1, P: { w: [3, 3], like: 'C' }, A: { w: [3, 3] }, G: { w: [{ n: 3, connate: true }], plac: 'axile', ov: '∞' } } },
    { id: 't-sympet', es: 'Corola gamopétala con estambres epipétalos', en: 'Sympetalous corolla with epipetalous stamens',
      m: { sym: 'actino', K: { w: [{ n: 5, connate: true }] }, C: { w: [{ n: 5, connate: true }] }, A: { w: [5] }, G: { w: [{ n: 2, connate: true }], plac: 'axile' }, adn: [['C', 'A']], look: { corolla: 'campanulate' } } },
    { id: 't-zygo', es: 'Flor zigomorfa bilabiada', en: 'Zygomorphic bilabiate flower',
      m: { sym: 'zygo', K: { w: [{ n: 5, connate: true }] }, C: { w: [{ connate: true, parts: [{ n: 2 }, { n: 3 }] }] }, A: { w: [{ parts: [{ n: 1, state: 'lost' }, { n: 4 }] }] }, G: { w: [{ n: 2, connate: true }], plac: 'axile' }, adn: [['C', 'A']], look: { corolla: 'bilabiate', dyn: 'didynamous' } } },
    { id: 't-apo', es: 'Gineceo apocárpico con muchos estambres', en: 'Apocarpous gynoecium with many stamens',
      m: { sym: 'actino', K: { w: [5] }, C: { w: [5] }, A: { w: [{ n: '∞' }] }, G: { w: [{ n: 8 }], plac: 'marginal' } } },
    { id: 't-naked', es: 'Flor desnuda (aclamídea)', en: 'Naked (achlamydeous) flower',
      m: { sym: 'actino', B: 1, A: { w: [2] }, G: { w: [{ n: 2, connate: true }], plac: 'basal', loc: 1, ov: 1 } } },
    { id: 't-epi', es: 'Flor epígina (ovario ínfero)', en: 'Epigynous flower (inferior ovary)',
      m: { sym: 'actino', K: { w: [{ n: 5, connate: true }] }, C: { w: [{ n: 5, connate: true }] }, A: { w: [5] }, G: { w: [{ n: 3, connate: true }], pos: 'inferior', plac: 'axile', ov: '∞' } } },
  ];

  /* ---------------- helpers ---------------- */
  function toEditable(src) {
    const m = JSON.parse(JSON.stringify(src || {}, (k, v) => v === Infinity ? '∞' : v));
    for (const k of ORGS) {
      if (m[k] == null || m[k] === 0) { delete m[k]; continue; }
      if (typeof m[k] !== 'object' || Array.isArray(m[k])) m[k] = { w: [m[k]] };
      m[k].w = (m[k].w || []).map(w => (w && typeof w === 'object' && !Array.isArray(w)) ? w : { n: w });
    }
    m.adn = m.adn || []; m.colors = m.colors || {}; m.look = m.look || {};
    if (!m.sym) m.sym = 'actino';
    if (!m.sex) m.sex = 'bisexual';
    return m;
  }
  const clone = o => JSON.parse(JSON.stringify(o));
  function getP(o, p) { return p.split('.').reduce((a, k) => a == null ? undefined : a[k], o); }
  function setP(o, p, v) {
    const ks = p.split('.');
    let a = o;
    for (let i = 0; i < ks.length - 1; i++) {
      const k = ks[i];
      if (a[k] == null) a[k] = /^\d+$/.test(ks[i + 1]) ? [] : {};
      a = a[k];
    }
    const last = ks[ks.length - 1];
    if (v === undefined) delete a[last]; else a[last] = v;
  }
  function parseCount(s) {
    s = String(s == null ? '' : s).trim().toLowerCase().replace(/\s+/g, '');
    if (!s) return null;
    if (/^(∞|inf|muchos|many|n)$/.test(s)) return '∞';
    let r = /^(\d{1,3})$/.exec(s);
    if (r) return +r[1];
    r = /^(\d{1,3})[-–](\d{1,3}|∞)$/.exec(s);
    if (r) {
      const a = +r[1], b = r[2] === '∞' ? '∞' : +r[2];
      if (b !== '∞' && b < a) return null;
      return a === b ? a : [a, b];
    }
    return null;
  }
  const countStr = c => Array.isArray(c) ? c[0] + '–' + c[1] : c == null ? '' : String(c);
  function sumParts(w) { return w.parts.reduce((s, p) => FM.cadd(s, FM.count(p.n)), null); }
  function merosityOf(m) { return FM.merosity(FM.normalize(m)) || 5; }

  /* ---------------- history ---------------- */
  function commit(prev) {
    S.hist.push(prev);
    if (S.hist.length > 150) S.hist.shift();
    S.fut = [];
    updateUndo();
  }
  function change(fn, opts) {
    const prev = JSON.stringify(S.m);
    fn(S.m);
    if (JSON.stringify(S.m) === prev) return;
    /* a slider or a number being typed is one step of the history, not one per movement */
    const key = opts && opts.key, now = Date.now();
    if (!(key && key === S.lastKey && now - S.lastT < 1500)) commit(prev);
    S.lastKey = key || null; S.lastT = now;
    afterChange(opts);
  }
  function undo() { if (!S.hist.length) return; S.fut.push(JSON.stringify(S.m)); S.m = JSON.parse(S.hist.pop()); afterChange({ editor: true }); updateUndo(); }
  function redo() { if (!S.fut.length) return; S.hist.push(JSON.stringify(S.m)); S.m = JSON.parse(S.fut.pop()); afterChange({ editor: true }); updateUndo(); }
  function updateUndo() {
    const u = el('b2Undo'), r = el('b2Redo');
    if (u) u.disabled = !S.hist.length;
    if (r) r.disabled = !S.fut.length;
  }
  function load(m, name, opts) {
    const prev = S.m ? JSON.stringify(S.m) : null;
    S.m = toEditable(m);
    if (name != null) { S.name = name; const ni = el('b2Name'); if (ni) ni.value = name; }
    if (prev && !(opts && opts.noHistory)) commit(prev);
    afterChange({ editor: true, newFlower: true });
  }
  function afterChange(opts) {
    opts = opts || {};
    if (opts.editor) renderEditor();
    else refreshEditorBits();
    if (S.views) S.views.set(S.m, { newFlower: true, keepLock: true });
    renderChecks();
    persistDraft();
  }
  function persistDraft() { Prefs.set('draft', { m: S.m, name: S.name }); }

  /* ---------------- small controls ---------------- */
  const chk = (p, on, label, extra) => `<label class="b2-chk"${extra || ''}><input type="checkbox" data-p="${p}" data-t="bool"${on ? ' checked' : ''}> ${label}</label>`;
  function sel(p, val, options, t, lab) {
    return `<select class="sel" data-p="${p}" data-t="${t || 'str'}"${lab ? aria(lab) : ''}>${options.map(o => `<option value="${o[0]}"${String(val ?? '') === String(o[0]) ? ' selected' : ''}>${I18N.lang === 'en' ? o[2] : o[1]}</option>`).join('')}</select>`;
  }
  function segBtns(act, cur, options, extra) {
    return `<div class="b2-seg">${options.map(o => `<button data-act="${act}" data-v="${o[0]}" class="${String(cur) === String(o[0]) ? 'on' : ''}"${o[3] ? ` title="${esc(I18N.lang === 'en' ? o[3][1] : o[3][0])}"` : ''}>${o[1]}</button>`).join('')}</div>${extra || ''}`;
  }
  const countCtl = (p, v, lab) => `<span class="cnt"><button data-act="dec" data-p="${p}" aria-label="−">−</button><input data-p="${p}" data-t="count" value="${esc(countStr(v))}" inputmode="numeric" size="4"${lab ? aria(lab) : ''}><button data-act="inc" data-p="${p}" aria-label="+">+</button><button data-act="inf" data-p="${p}" data-es-title="Muchos (∞)" data-en-title="Many (∞)" title="Muchos (∞)">∞</button></span>`;
  const colorCtl = (k, m) => `<label class="b2-col">${L2('Color', 'Colour')} <input type="color" data-p="colors.${k}" data-t="str" value="${esc(m.colors[k] || FM.color(FM.normalize(m), k, 'natural'))}"></label>`;
  /* accessible names: the text of a bilingual label in the active language,
     given to a control that has no <label> of its own */
  const plain = h => { const m = new RegExp('<span data-l="' + (I18N.lang === 'en' ? 'en' : 'es') + '">([^<]*)</span>').exec(h); return String(m ? m[1] : h).replace(/<[^>]+>/g, '').trim(); };
  const aria = h => ` aria-label="${esc(plain(h))}"`;
  /* the row's label also names its first control when that control is a
     select, a number box or a counter (checkboxes and colours carry their own) */
  const nameFirst = (ctl, label) => {
    const m = /^(<span class="cnt"><button[^>]*>[^<]*<\/button>)?<(select|input)\b(?![^>]*aria-label)/.exec(ctl);
    return m && label ? ctl.slice(0, m[0].length) + aria(label) + ctl.slice(m[0].length) : ctl;
  };
  const row = (label, ctl) => `<div class="b2-row"><span class="b2-l">${label}</span><span class="b2-c">${nameFirst(ctl, label)}</span></div>`;
  const hint = (es, en) => `<p class="b2-hint">${L2(es, en)}</p>`;

  const O = {
    state: [['fertile', 'fértiles', 'fertile'], ['sterile', 'estériles (°, ʳ)', 'sterile (°, ʳ)'], ['lost', 'perdidas (⁰)', 'lost (⁰)']],
    aest: [['', 'automática', 'automatic'], ['valvate', 'valvar', 'valvate'], ['imbricate', 'imbricada', 'imbricate'], ['quincuncial', 'quincuncial', 'quincuncial'], ['contort', 'contorta', 'contort'], ['vexillary', 'vexilar', 'vexillary'], ['carinal', 'carinal', 'carinal'], ['open', 'abierta', 'open']],
    corolla: [['', 'sin forma especial', 'no special form'], ['rotate', 'rotácea', 'rotate'], ['campanulate', 'campanulada', 'campanulate'], ['tubular', 'tubulosa', 'tubular'], ['funnelform', 'infundibuliforme', 'funnelform'], ['salverform', 'hipocrateriforme', 'salverform'], ['urceolate', 'urceolada', 'urceolate'], ['bilabiate', 'bilabiada', 'bilabiate'], ['personate', 'personada', 'personate'], ['ligulate', 'ligulada', 'ligulate'], ['papilionaceous', 'papilionácea', 'papilionaceous'], ['cruciform', 'cruciforme', 'cruciform'], ['caryophyllaceous', 'cariofilácea', 'caryophyllaceous'], ['rosaceous', 'rosácea', 'rosaceous'], ['orchid', 'orquidácea (con labelo)', 'orchidaceous (with a lip)']],
    anther: [['', '—', '—'], ['basifixed', 'basifijas', 'basifixed'], ['dorsifixed', 'dorsifijas', 'dorsifixed'], ['versatile', 'versátiles', 'versatile']],
    dehisc: [['', 'longitudinal', 'longitudinal'], ['poricidal', 'poricida (por poros)', 'poricidal (pores)'], ['valvular', 'valvar (por valvas)', 'valvular (flaps)'], ['transverse', 'transversal', 'transverse']],
    thecae: [['', 'dos (ditecas)', 'two (dithecal)'], ['1', 'una (monotecas)', 'one (monothecal)']],
    dyn: [['', '—', '—'], ['didynamous', 'didínamo (2 largos + 2 cortos)', 'didynamous (2 long + 2 short)'], ['tetradynamous', 'tetradínamo (4 largos + 2 cortos)', 'tetradynamous (4 long + 2 short)']],
    pos: [['superior', 'súpero (flor hipógina o perígina)', 'superior (hypogynous or perigynous flower)'], ['half', 'semiínfero', 'half-inferior'], ['inferior', 'ínfero (flor epígina)', 'inferior (epigynous flower)']],
    plac: [['axile', 'axilar', 'axile'], ['parietal', 'parietal', 'parietal'], ['freecentral', 'central libre', 'free-central'], ['basal', 'basal', 'basal'], ['apical', 'apical', 'apical'], ['marginal', 'marginal', 'marginal'], ['laminar', 'laminar', 'laminar']],
    union: [['syn', 'sincárpico: carpelos unidos', 'syncarpous: carpels united'], ['apo', 'apocárpico: carpelos libres', 'apocarpous: carpels free'], ['semi', 'ovarios libres, estilos unidos', 'free ovaries, united styles']],
    style: [['terminal', 'terminal', 'terminal'], ['gynobasic', 'ginobásico', 'gynobasic']],
    stigma: [['', '—', '—'], ['capitate', 'capitado', 'capitate'], ['lobed', 'lobulado', 'lobed'], ['bifid', 'bífido', 'bifid'], ['plumose', 'plumoso', 'plumose'], ['discoid', 'discoide', 'discoid'], ['punctiform', 'puntiforme', 'punctiform']],
    hyp: [['none', 'sin hipanto', 'no hypanthium'], ['cup', 'en copa', 'cup-shaped'], ['tube', 'en tubo', 'tubular']],
    disc: [['', 'sin disco', 'no disc'], ['intra', 'por dentro de los estambres', 'inside the stamens'], ['extra', 'por fuera de los estambres', 'outside the stamens']],
    plane: [['zygo', 'medio (adaxial–abaxial)', 'median (adaxial–abaxial)'], ['zygoT', 'transversal', 'transverse'], ['zygoO', 'oblicuo', 'oblique']],
  };

  /* ---------------- editor ---------------- */
  function whorlRow(k, wi, w, opt) {
    const p = `${k}.w.${wi}`;
    const hasParts = Array.isArray(w.parts);
    const nW = S.m[k].w.length;
    let h = `<div class="wrow" data-org="${k}"><div class="wrow-h"><span class="wlab">${L2('Verticilo', 'Whorl')} ${wi + 1}</span>`;
    h += hasParts ? `<span class="wsum">${esc(countStr(sumParts(w)))} ${L2('en total', 'in all')}</span>` : countCtl(p + '.n', w.n, L2(`Piezas del verticilo ${wi + 1}`, `Members of whorl ${wi + 1}`));
    h += chk(p + '.connate', w.connate === true, L2('unidas entre sí', 'united'));
    if (!hasParts && opt.state) h += sel(p + '.state', w.state || 'fertile', O.state, null, L2(`Estado del verticilo ${wi + 1}`, `State of whorl ${wi + 1}`));
    if (wi > 0 || opt.opp) h += chk(p + '.opp', !!w.opp, L2('frente al verticilo anterior', 'opposite the previous whorl'), ` title="${I18N.lang === 'en' ? 'Opposite the members of the previous whorl instead of alternating with them' : 'Frente a las piezas del verticilo anterior en vez de alternar con ellas'}"`);
    h += `<span class="wrow-act">`;
    h += hasParts ? `<button class="btn btn-ghost btn-xs" data-act="unsplit" data-k="${k}" data-w="${wi}">${L2('Piezas iguales', 'Equal members')}</button>`
      : `<button class="btn btn-ghost btn-xs" data-act="split" data-k="${k}" data-w="${wi}" title="${I18N.lang === 'en' ? 'Split the whorl into unequal groups, written with “:” (Prenner) or “+” (classic)' : 'Dividir el verticilo en grupos desiguales, que se escriben con «:» (Prenner) o «+» (clásica)'}">${L2('Piezas desiguales', 'Unequal members')}</button>`;
    if (nW > 1) h += `<button class="icon-btn sm" data-act="delw" data-k="${k}" data-w="${wi}" title="${I18N.lang === 'en' ? 'Remove this whorl' : 'Quitar este verticilo'}">×</button>`;
    h += `</span></div>`;
    if (hasParts) {
      h += `<div class="parts"><div class="parts-h">${L2('Grupos, desde el lado', 'Groups, starting on the')} ${chk(p + '.from', w.from === 'abaxial', L2('abaxial (anterior, junto a la bráctea)', 'abaxial side (anterior, next to the bract)'))} ${w.from === 'abaxial' ? '' : L2('— si no, desde el adaxial (junto al eje)', '— otherwise from the adaxial side (next to the axis)')}</div>`;
      w.parts.forEach((pt, pi) => {
        const pp = `${p}.parts.${pi}`;
        h += `<div class="prow"><span class="pn">${pi + 1}</span>${countCtl(pp + '.n', pt.n, L2(`Piezas del grupo ${pi + 1}`, `Members of group ${pi + 1}`))}${chk(pp + '.connate', !!pt.connate, L2('unidas', 'united'))}${sel(pp + '.state', pt.state || 'fertile', O.state, null, L2(`Estado del grupo ${pi + 1}`, `State of group ${pi + 1}`))}` +
          `<input class="b2-txt" data-p="${pp}.label.${I18N.lang === 'en' ? 'en' : 'es'}" data-t="str"${aria(L2(`Nombre del grupo ${pi + 1}`, `Name of group ${pi + 1}`))} value="${esc(pt.label ? T2(pt.label) : '')}" placeholder="${I18N.lang === 'en' ? 'name (e.g. keel)' : 'nombre (p. ej. quilla)'}" size="11">` +
          `<label class="b2-size" title="${I18N.lang === 'en' ? 'Relative size in the drawings' : 'Tamaño relativo en los dibujos'}">${L2('tamaño', 'size')} <input type="range" min="0.6" max="1.6" step="0.05" data-p="${pp}.size" data-t="num" value="${pt.size || 1}"></label>` +
          (w.parts.length > 2 ? `<button class="icon-btn sm" data-act="delpart" data-k="${k}" data-w="${wi}" data-i="${pi}">×</button>` : '') + `</div>`;
      });
      h += `<button class="btn btn-ghost btn-xs" data-act="addpart" data-k="${k}" data-w="${wi}">+ ${L2('grupo', 'group')}</button></div>`;
    }
    return h + '</div>';
  }
  function organBox(k, title, body, opts) {
    const f = FM.normalize(S.m);
    const mini = f[k] ? Formula.segments({ [k]: S.m[k], sym: S.m.sym, adn: [] }, state.conv, {}).segs.find(s => s.org === k) : null;
    return `<div class="obox" data-org="${k}" style="--wc: var(--w${k}); --wct: var(--w${k}-text)"><div class="obox-h"><span class="let">${k}</span> <b>${title}</b>${mini ? ` <span class="ff ff-${state.conv} obox-f">${mini.html}</span>` : ''}${opts && opts.remove ? `<button class="icon-btn sm" data-act="${opts.remove}" title="${I18N.lang === 'en' ? 'Remove' : 'Quitar'}">×</button>` : ''}</div>${body}</div>`;
  }
  function whorls(k, opt) {
    const org = S.m[k];
    let h = org.w.map((w, wi) => whorlRow(k, wi, w, opt || {})).join('');
    h += `<button class="btn btn-ghost btn-xs" data-act="addw" data-k="${k}">+ ${L2('verticilo', 'whorl')}</button>`;
    if (org.w.length > 1) h += ' ' + chk(`${k}.connate`, !!org.connate, L2('todos los verticilos unidos en un tubo', 'all whorls united in a tube'));
    return h;
  }

  function secFlower() {
    const m = S.m;
    const sym = m.sym;
    const symBase = sym.startsWith('zygo') ? 'zygo' : sym;
    let h = row(L2('Simetría', 'Symmetry'), segBtns('sym', symBase, [
      ['actino', '✱ ' + L2('Actinomorfa', 'Actinomorphic'), '', ['Varios planos de simetría', 'Several planes of symmetry']],
      ['zygo', '↑ ' + L2('Zigomorfa', 'Zygomorphic'), '', ['Un solo plano de simetría', 'A single plane of symmetry']],
      ['disym', '┼ ' + L2('Disimétrica', 'Disymmetric'), '', ['Dos planos de simetría', 'Two planes of symmetry']],
      ['asym', '↯ ' + L2('Asimétrica', 'Asymmetric'), '', ['Ningún plano de simetría', 'No plane of symmetry']],
      ['spiral', '↺ ' + L2('Espiral', 'Spiral'), '', ['Piezas en espiral, no en verticilos', 'Members in a spiral, not in whorls']],
    ]));
    if (symBase === 'zygo') h += row(L2('Plano de simetría', 'Plane of symmetry'), sel('sym', sym, O.plane));
    h += row(L2('Sexo', 'Sex'), segBtns('sex', m.sex, [
      ['bisexual', '⚥ ' + L2('Hermafrodita', 'Bisexual')], ['staminate', '♂ ' + L2('Estaminada', 'Staminate')], ['pistillate', '♀ ' + L2('Pistilada', 'Pistillate')],
    ]));
    const mer = merosityOf(m);
    h += row(L2('Merosidad', 'Merism'), segBtns('mero', mer, [[2, '2'], [3, '3'], [4, '4'], [5, '5'], [6, '6']]) +
      `<span class="b2-note">${L2('cambia a la vez todos los verticilos con ese número', 'changes every whorl with that number at once')}</span>`);
    h += row(L2('Brácteas', 'Bracts'), chk('B', !!m.B, L2('bráctea madre', 'subtending bract')) + ` <span class="b2-l2">${L2('bractéolas', 'bracteoles')}</span> ` + segBtns('bt', m.Bt || 0, [[0, '0'], [1, '1'], [2, '2']]));
    h += row(L2('Hipanto', 'Hypanthium'), sel('hyp', m.hyp || 'none', O.hyp));
    h += row(L2('Disco nectarífero', 'Nectary disc'), sel('disc', m.disc || '', O.disc, 'strnull'));
    h += row(L2('Otros', 'Other'), chk('corona', !!m.corona, L2('corona', 'corona')) + chk('resup', !!m.resup, L2('resupinada (gira 180°)', 'resupinate (turned 180°)')) +
      `<span class="b2-l2">${L2('pieza impar externa', 'odd outer member')}</span> ` + sel('oddK', m.oddK || '', [['', 'automática', 'automatic'], ['adaxial', 'adaxial (junto al eje)', 'adaxial (next to the axis)'], ['abaxial', 'abaxial (junto a la bráctea)', 'abaxial (next to the bract)']], 'strnull', L2('Pieza impar externa', 'Odd outer member')));
    return `<details class="b2-sec" open data-sec="flower"><summary>${L2('1 · La flor completa', '1 · The whole flower')}</summary><div class="b2-body">${h}</div></details>`;
  }

  function perianthType() {
    const m = S.m;
    if (m.K && m.C) return 'hetero';
    if (m.P && m.P.w.length >= 2) return 'homo';
    if (m.P || m.K || m.C) return 'mono';
    return 'none';
  }
  function secPerianth() {
    const m = S.m;
    const pt = perianthType();
    let h = row(L2('Tipo de perianto', 'Kind of perianth'), segBtns('ptype', pt, [
      ['hetero', L2('Cáliz y corola', 'Calyx and corolla'), '', ['Heteroclamídeo: sépalos y pétalos distintos', 'Heterochlamydeous: distinct sepals and petals']],
      ['homo', L2('Perigonio de tépalos', 'Perigon of tepals'), '', ['Homoclamídeo: piezas semejantes en dos o más verticilos', 'Homochlamydeous: similar members in two or more whorls']],
      ['mono', L2('Un solo verticilo', 'A single whorl'), '', ['Monoclamídeo', 'Monochlamydeous']],
      ['none', L2('Sin perianto', 'No perianth'), '', ['Aclamídeo: flor desnuda', 'Achlamydeous: naked flower']],
    ]));
    h += row(L2('Epicáliz', 'Epicalyx'), chk('_E', !!m.E, L2('brácteas por fuera del cáliz (calículo)', 'bracts outside the calyx (calyculus)')));
    if (m.E) h += organBox('E', L2('Epicáliz', 'Epicalyx'), whorls('E'));
    if (m.K) {
      let b = whorls('K', { state: true });
      b += `<div class="b2-opts">${row(L2('Prefloración', 'Aestivation'), sel('K.aest', m.K.aest || '', O.aest, 'strnull'))}` +
        row(L2('Aspecto', 'Look'), chk('K.like', m.K.like === 'C', L2('sépalos petaloides', 'petaloid sepals')) + chk('look.pappus', !!m.look.pappus, L2('vilano (escamas o pelos)', 'pappus (scales or bristles)'))) +
        row('', colorCtl('K', m)) + `</div>`;
      h += organBox('K', L2('Cáliz', 'Calyx'), b);
    }
    if (m.C) {
      let b = whorls('C', { state: true });
      b += `<div class="b2-opts">${row(L2('Prefloración', 'Aestivation'), sel('C.aest', m.C.aest || '', O.aest, 'strnull'))}` +
        row(L2('Forma de la corola', 'Corolla form'), sel('look.corolla', m.look.corolla || '', O.corolla, 'strnull')) +
        (FM.allConnate(FM.normalize(m).C) ? row(L2('Largo del tubo', 'Tube length'), `<input type="range" min="0.05" max="0.9" step="0.05" data-p="look.tube" data-t="num" value="${m.look.tube != null ? m.look.tube : 0.3}">`) : '') +
        row('', colorCtl('C', m)) + `</div>`;
      h += organBox('C', L2('Corola', 'Corolla'), b);
    }
    if (m.P) {
      let b = whorls('P', { state: true });
      b += `<div class="b2-opts">${row(L2('Prefloración', 'Aestivation'), sel('P.aest', m.P.aest || '', O.aest, 'strnull'))}` +
        row(L2('Aspecto', 'Look'), sel('P.like', m.P.like || 'C', [['C', 'tépalos petaloides', 'petaloid tepals'], ['K', 'tépalos sepaloides', 'sepaloid tepals']])) +
        (!m.C ? row(L2('Forma', 'Form'), sel('look.corolla', m.look.corolla || '', O.corolla, 'strnull')) : '') +
        row('', colorCtl('P', m)) + `</div>`;
      h += organBox('P', L2('Perigonio', 'Perigon'), b);
    }
    return `<details class="b2-sec" open data-sec="perianth"><summary>${L2('2 · Perianto', '2 · Perianth')}</summary><div class="b2-body">${h}</div></details>`;
  }

  function secAndro() {
    const m = S.m;
    let h = row(L2('Estambres', 'Stamens'), segBtns('hasA', m.A ? 1 : 0, [[1, L2('Con androceo', 'With androecium')], [0, L2('Sin androceo', 'No androecium')]]));
    if (m.A) {
      const hasPer = m.C || m.P;
      let b = whorls('A', { state: true, opp: true });
      b += `<div class="b2-opts">` +
        row(L2('Unión', 'Union'), chk('_epi', FM.adnate(FM.normalize(m), m.C ? 'C' : 'P', 'A'), m.C ? L2('soldados a la corola (epipétalos)', 'fused to the corolla (epipetalous)') : L2('soldados a los tépalos (epitépalos)', 'fused to the tepals (epitepalous)'), hasPer ? '' : ' style="display:none"') +
          chk('look.synanther', !!m.look.synanther, L2('anteras unidas en tubo (sinantéreo)', 'anthers united in a tube (syngenesious)')) +
          chk('_gyno', FM.adnate(FM.normalize(m), 'A', 'G'), L2('unidos al gineceo (ginostemio)', 'united with the gynoecium (gynostemium)'))) +
        row(L2('Longitud', 'Length'), sel('look.dyn', m.look.dyn || '', O.dyn, 'strnull')) +
        row(L2('Anteras', 'Anthers'), sel('look.anther', m.look.anther || '', O.anther, 'strnull') + ' ' + sel('look.thecae', m.look.thecae || '', O.thecae, 'numnull', L2('Tecas', 'Thecae')) +
          chk('look.extrorse', !!m.look.extrorse, L2('extrorsas', 'extrorse')) + chk('look.pollinia', !!m.look.pollinia, L2('polinios', 'pollinia'))) +
        row(L2('Dehiscencia', 'Dehiscence'), sel('look.dehisc', m.look.dehisc || '', O.dehisc, 'strnull')) +
        row('', colorCtl('A', m)) + `</div>`;
      h += organBox('A', L2('Androceo', 'Androecium'), b);
    }
    return `<details class="b2-sec" open data-sec="andro"><summary>${L2('3 · Androceo', '3 · Androecium')}</summary><div class="b2-body">${h}</div></details>`;
  }

  function secGyn() {
    const m = S.m;
    const G = m.G;
    const mode = !G ? 0 : G.w[0].state === 'sterile' ? 2 : 1;
    let h = row(L2('Carpelos', 'Carpels'), segBtns('hasG', mode, [[1, L2('Con gineceo', 'With gynoecium')], [2, L2('Pistilodio (estéril)', 'Pistillode (sterile)')], [0, L2('Sin gineceo', 'No gynoecium')]]));
    if (G) {
      const w = G.w[0];
      const union = w.connate === true ? 'syn' : w.connate === 'apical' ? 'semi' : 'apo';
      let b = row(L2('Número de carpelos', 'Number of carpels'), countCtl('G.w.0.n', w.n));
      b += row(L2('Unión', 'Union'), sel('_union', union, O.union));
      b += row(L2('Posición del ovario', 'Ovary position'), sel('G.pos', G.pos || 'superior', O.pos));
      b += row(L2('Placentación', 'Placentation'), sel('G.plac', G.plac || '', [['', 'automática', 'automatic']].concat(O.plac), 'strnull'));
      b += row(L2('Lóculos', 'Locules'), countCtl('G.loc', G.loc != null ? G.loc : '') + ` <span class="b2-note">${L2('vacío = automático', 'empty = automatic')}</span>`);
      b += row(L2('Óvulos por ovario', 'Ovules per ovary'), countCtl('G.ov', G.ov != null ? G.ov : ''));
      b += row(L2('Estilo y estigma', 'Style and stigma'), sel('G.style', G.style || 'terminal', O.style) + ' ' + sel('look.stigma', m.look.stigma || '', O.stigma, 'strnull', L2('Estigma', 'Stigma')));
      b += row(L2('Tabiques', 'Septa'), chk('G.replum', !!G.replum, L2('réplum con falso tabique entre las placentas', 'replum with a false septum between the placentas')) + chk('G.falseSepta', !!G.falseSepta, L2('falsos tabiques', 'false septa')));
      b += row(L2('Orientación', 'Orientation'), `<input class="b2-num" type="number" min="0" max="359" step="1" data-p="G.ang" data-t="numnull" value="${G.ang != null ? G.ang : ''}" placeholder="auto"> ° ${L2('del primer carpelo (0 = adaxial)', 'of the first carpel (0 = adaxial)')}`);
      b += row('', colorCtl('G', m));
      h += organBox('G', L2('Gineceo', 'Gynoecium'), b);
    }
    return `<details class="b2-sec" open data-sec="gyn"><summary>${L2('4 · Gineceo', '4 · Gynoecium')}</summary><div class="b2-body">${h}</div></details>`;
  }

  function renderEditor() {
    const box = el('b2Editor');
    if (!box) return;
    const open = {};
    els('details.b2-sec', box).forEach(d => { open[d.dataset.sec] = d.open; });
    box.innerHTML = secFlower() + secPerianth() + secAndro() + secGyn();
    els('details.b2-sec', box).forEach(d => { if (open[d.dataset.sec] === false) d.open = false; });
    I18N.apply(box);
  }
  /* after a small edit only the mini formulae of the organ boxes change */
  function refreshEditorBits() {
    els('.obox', el('b2Editor')).forEach(b => {
      const k = b.dataset.org, f = b.querySelector('.obox-f');
      if (!f || !S.m[k]) return;
      const seg = Formula.segments({ [k]: S.m[k], sym: S.m.sym, adn: [] }, state.conv, {}).segs.find(s => s.org === k);
      if (seg) f.innerHTML = seg.html;
    });
  }

  /* ---------------- actions ---------------- */
  function defaultWhorl(k) {
    const mer = merosityOf(S.m);
    if (k === 'A') return { n: mer };
    if (k === 'G') return { n: 3, connate: true };
    return { n: mer };
  }
  function act(a, d) {
    const k = d.k, wi = d.w != null ? +d.w : null;
    switch (a) {
      case 'sym': return change(m => { m.sym = d.v; if (d.v === 'spiral') { /* nothing else */ } });
      case 'sex': return change(m => {
        m.sex = d.v;
        if (d.v === 'staminate' && m.G) m.G.w[0].state = 'sterile';
        if (d.v === 'pistillate' && m.A) m.A.w.forEach(w => { if (!w.parts) w.state = 'sterile'; });
        if (d.v === 'bisexual') { if (m.G) m.G.w[0].state = 'fertile'; if (m.A) m.A.w.forEach(w => { if (!w.parts && w.state === 'sterile') w.state = 'fertile'; }); }
      }, { editor: true });
      case 'mero': return change(m => {
        const old = merosityOf(m), nw = +d.v;
        for (const key of ORGS) if (m[key]) m[key].w.forEach(w => {
          if (!w.parts && FM.count(w.n) === old) w.n = nw;
          delete w.ang;
        });
        if (m.G && FM.count(m.G.w[0].n) === old) m.G.w[0].n = nw;
      }, { editor: true });
      case 'bt': return change(m => { m.Bt = +d.v; });
      case 'ptype': return change(m => {
        const mer = merosityOf(m);
        const keepK = m.K, keepC = m.C, keepP = m.P;
        delete m.K; delete m.C; delete m.P;
        if (d.v === 'hetero') { m.K = keepK || { w: [{ n: mer }] }; m.C = keepC || { w: [{ n: mer }] }; }
        if (d.v === 'homo') { m.P = keepP && keepP.w.length >= 2 ? keepP : { w: [{ n: mer }, { n: mer }], like: 'C' }; }
        if (d.v === 'mono') { m.P = keepP ? Object.assign(keepP, { w: [keepP.w[0]] }) : { w: [{ n: mer }], like: 'K' }; }
        m.adn = (m.adn || []).map(g => g.map(x => (x === 'C' || x === 'P') ? (m.C ? 'C' : 'P') : x));
      }, { editor: true });
      case 'hasA': return change(m => { if (+d.v) m.A = m.A || { w: [{ n: merosityOf(m) }] }; else { delete m.A; m.adn = (m.adn || []).filter(g => !g.includes('A')); } }, { editor: true });
      case 'hasG': return change(m => {
        if (+d.v === 0) { delete m.G; m.adn = (m.adn || []).filter(g => !g.includes('G')); return; }
        m.G = m.G || { w: [{ n: 3, connate: true }], pos: 'superior' };
        m.G.w[0].state = +d.v === 2 ? 'sterile' : 'fertile';
      }, { editor: true });
      case 'addw': return change(m => { m[k].w.push(defaultWhorl(k)); }, { editor: true });
      case 'delw': return change(m => { m[k].w.splice(wi, 1); if (m[k].w.length < 2) delete m[k].connate; }, { editor: true });
      case 'split': return change(m => {
        const w = m[k].w[wi];
        const n = FM.ctyp(FM.count(w.n));
        const a1 = Math.max(1, Math.floor(n / 2)), a2 = Math.max(1, n - a1);
        m[k].w[wi] = { connate: w.connate, opp: w.opp, parts: [{ n: a1, state: w.state || 'fertile' }, { n: a2, state: w.state || 'fertile' }] };
      }, { editor: true });
      case 'unsplit': return change(m => {
        const w = m[k].w[wi];
        const tot = sumParts(w);
        m[k].w[wi] = { n: Array.isArray(tot) ? tot.map(x => x === Infinity ? '∞' : x) : (tot === Infinity ? '∞' : tot), connate: w.connate, opp: w.opp };
      }, { editor: true });
      case 'addpart': return change(m => { m[k].w[wi].parts.push({ n: 1 }); }, { editor: true });
      case 'delpart': return change(m => { m[k].w[wi].parts.splice(+d.i, 1); }, { editor: true });
      case 'inc': case 'dec': case 'inf': return change(m => {
        const cur = FM.count(getP(m, d.p));
        let v;
        if (a === 'inf') v = cur === Infinity ? 12 : '∞';
        else {
          const base = cur == null ? 0 : Array.isArray(cur) ? (a === 'inc' ? cur[1] : cur[0]) : cur;
          if (base === Infinity) v = a === 'dec' ? 12 : '∞';
          else v = Math.max(d.p.endsWith('.n') ? 0 : 1, base + (a === 'inc' ? 1 : -1));
          if (v > 99) v = 99;
        }
        setP(m, d.p, v);
        if (/\.w\.\d+\.n$/.test(d.p)) { const w = getP(m, d.p.replace(/\.n$/, '')); if (w) delete w.ang; }
      }, { editor: true });
    }
  }

  /* inputs bound to a path of the model */
  function bindInput(t, live) {
    const p = t.dataset.p, type = t.dataset.t;
    let v;
    if (type === 'bool') v = p === 'B' ? (t.checked ? 1 : undefined) : t.checked;
    else if (type === 'count') {
      v = parseCount(t.value);
      if (v == null) {
        if (t.value.trim() === '' && (p === 'G.loc' || p === 'G.ov')) v = undefined;
        else { t.classList.add('bad'); return; }
      }
      t.classList.remove('bad');
    } else if (type === 'num') v = +t.value;
    else if (type === 'numnull') v = t.value === '' ? undefined : +t.value;
    else if (type === 'strnull') v = t.value === '' ? undefined : t.value;
    else v = t.value;
    const special = { _E: 1, _epi: 1, _gyno: 1, _union: 1 };
    if (special[p]) {
      return change(m => {
        if (p === '_E') { if (v) m.E = m.E || { w: [{ n: 3 }] }; else delete m.E; }
        if (p === '_epi') { const per = m.C ? 'C' : 'P'; m.adn = (m.adn || []).filter(g => !(g.includes('A') && (g.includes('C') || g.includes('P')))); if (v) m.adn.push([per, 'A']); }
        if (p === '_gyno') { m.adn = (m.adn || []).filter(g => !(g.includes('A') && g.includes('G'))); if (v) m.adn.push(['A', 'G']); }
        if (p === '_union') { m.G.w[0].connate = v === 'syn' ? true : v === 'semi' ? 'apical' : false; delete m.G.loc; }
      }, { editor: true });
    }
    if (p === 'corona') return change(m => { if (v) m.corona = { n: 40 }; else delete m.corona; });
    const structural = /\.connate$|\.state$|\.from$|^G\.plac$|^sym$|^look\.corolla$|\.like$/.test(p);
    change(m => {
      if (type === 'bool' && !v && /^(look\.|G\.replum|G\.falseSepta|resup|B$)/.test(p)) setP(m, p, undefined);
      else if (p.endsWith('.label.es') || p.endsWith('.label.en')) {
        const base = p.replace(/\.(es|en)$/, '');
        const lab = getP(m, base);
        if (!v) setP(m, base, undefined);
        else { const lo = lab && typeof lab === 'object' ? lab : {}; lo[p.slice(-2)] = v; if (!lo.es) lo.es = v; if (!lo.en) lo.en = v; setP(m, base, lo); }
      } else setP(m, p, v);
      if (/\.w\.\d+\.n$/.test(p)) { const w = getP(m, p.replace(/\.n$/, '')); if (w) delete w.ang; }
    }, { editor: structural && !live, key: live ? p : null });
  }

  /* ---------------- coherence checks ---------------- */
  function checks(src) {
    const f = FM.normalize(src);
    const out = [];
    const w = (es, en, lvl) => out.push({ lvl: lvl || 'warn', es, en });
    const nFertA = f.A ? FM.cmax(FM.total(f.A, { fertile: true })) : 0;
    const gFert = f.G && !f.G.w.every(x => x.state === 'sterile') && FM.cmax(FM.total(f.G)) > 0;
    if (f.sex === 'staminate' && gFert) w('La flor es estaminada pero tiene un gineceo funcional. Quítalo o márcalo como pistilodio.', 'The flower is staminate but has a functional gynoecium. Remove it or mark it as a pistillode.');
    if (f.sex === 'pistillate' && nFertA > 0) w('La flor es pistilada pero tiene estambres fértiles. Quítalos o márcalos como estaminodios.', 'The flower is pistillate but has fertile stamens. Remove them or mark them as staminodes.');
    if (f.sex === 'bisexual' && (!nFertA || !gFert)) w(`Sin ${!nFertA ? 'estambres fértiles' : 'gineceo funcional'} la flor no es hermafrodita: cambia el sexo a ${!nFertA ? 'pistilada' : 'estaminada'}.`, `Without ${!nFertA ? 'fertile stamens' : 'a functional gynoecium'} the flower is not bisexual: set the sex to ${!nFertA ? 'pistillate' : 'staminate'}.`);
    const unequal = ['K', 'C', 'P', 'A'].some(k => f[k] && f[k].w.some(x => x.parts));
    /* a ligulate corolla is zygomorphic by itself: its tube splits on one side */
    /* a naked flower (no perianth) owes its symmetry to its position, not to unequal members */
    if (f.sym === 'zygo' && !unequal && (f.look || {}).corolla !== 'ligulate' && (f.K || f.C || f.P)) w('Es zigomorfa, pero todas las piezas son iguales. Usa «Piezas desiguales» en la corola (o en otro verticilo) para mostrar el plano de simetría; por ejemplo estandarte, alas y quilla.', 'It is zygomorphic but every member is equal. Use "Unequal members" in the corolla (or another whorl) to show the plane of symmetry; for example standard, wings and keel.', 'info');
    /* only groups that differ inside one whorl hint at zygomorphy; a whorl of small petals does not */
    if (f.sym === 'actino' && ['K', 'C', 'P'].some(k => f[k] && f[k].w.some(x => x.parts && x.parts.length > 1 && x.parts.some(p => p.size !== 1 || p.label)))) w('Hay piezas desiguales en el perianto de una flor actinomorfa: ¿no será zigomorfa?', 'There are unequal perianth members in an actinomorphic flower: is it not zygomorphic?', 'info');
    if (f.G && gFert) {
      const g = FM.gynoeciumType(f), pl = f.G.plac, nc = FM.cmax(g.carpels);
      if ((pl === 'parietal' || pl === 'freecentral') && g.type !== 'syn') w(`La placentación ${pl === 'parietal' ? 'parietal' : 'central libre'} solo existe en un ovario sincárpico (carpelos unidos).`, `${pl === 'parietal' ? 'Parietal' : 'Free-central'} placentation only occurs in a syncarpous ovary (united carpels).`);
      if (pl === 'axile' && (g.type !== 'syn' || FM.cmax(f.G.loc) < 2)) w('La placentación axilar necesita un ovario sincárpico con dos o más lóculos.', 'Axile placentation needs a syncarpous ovary with two or more locules.');
      if (pl === 'marginal' && g.type === 'syn' && nc > 1) w('La placentación marginal es propia de un carpelo solo o de carpelos libres; en carpelos unidos suele ser axilar o parietal.', 'Marginal placentation belongs to a single carpel or free carpels; united carpels usually have axile or parietal placentation.');
      if (f.G.replum && !(pl === 'parietal' && nc === 2)) w('El réplum, con su falso tabique, se forma entre dos placentas parietales: requiere dos carpelos y placentación parietal.', 'The replum, with its false septum, forms between two parietal placentas: it needs two carpels and parietal placentation.');
      if (g.type === 'syn' && FM.cmin(f.G.loc) > nc && !f.G.falseSepta) w('Hay más lóculos que carpelos: marca «falsos tabiques» (como en las labiadas y borragináceas).', 'There are more locules than carpels: tick "false septa" (as in mints and borages).', 'info');
      if (f.G.style === 'gynobasic' && g.type !== 'syn') w('El estilo ginobásico nace entre los lóbulos de un ovario sincárpico.', 'A gynobasic style arises between the lobes of a syncarpous ovary.', 'info');
      if (f.G.pos !== 'superior' && g.type === 'apo') w('Un gineceo de carpelos libres rara vez queda ínfero; revisa la posición del ovario.', 'A gynoecium of free carpels is rarely inferior; check the ovary position.', 'info');
    }
    if ((FM.adnate(f, 'C', 'A') && !f.C) || (FM.adnate(f, 'P', 'A') && !f.P)) w('Los estambres están soldados a un perianto que no existe.', 'The stamens are fused to a perianth that does not exist.');
    const L = f.look || {};
    if (L.dyn === 'didynamous' && nFertA !== 4) w('Un androceo didínamo tiene cuatro estambres fértiles (dos largos y dos cortos).', 'A didynamous androecium has four fertile stamens (two long, two short).');
    if (L.dyn === 'tetradynamous' && nFertA !== 6) w('Un androceo tetradínamo tiene seis estambres (cuatro largos y dos cortos).', 'A tetradynamous androecium has six stamens (four long, two short).');
    if (f.resup && !f.sym.startsWith('zygo')) w('La resupinación solo se nota en flores zigomorfas, como las orquídeas.', 'Resupination only shows in zygomorphic flowers, such as orchids.', 'info');
    if (L.corolla === 'papilionaceous' && !(f.C && f.C.w[0].parts && f.C.w[0].parts.length === 3)) w('Una corola papilionácea tiene tres grupos: estandarte (1), alas (2) y quilla (2, unidos).', 'A papilionaceous corolla has three groups: standard (1), wings (2) and keel (2, united).', 'info');
    if (L.corolla === 'bilabiate' && !(f.C && f.C.w[0].parts)) w('En una corola bilabiada los pétalos forman dos labios: divide la corola en piezas desiguales (2 + 3 o 4 + 1).', 'In a bilabiate corolla the petals form two lips: split the corolla into unequal members (2 + 3 or 4 + 1).', 'info');
    if (L.corolla && ['rotate', 'campanulate', 'tubular', 'funnelform', 'salverform', 'urceolate', 'bilabiate', 'personate', 'ligulate'].includes(L.corolla) && f.C && !FM.allConnate(f.C)) w('Esa forma de corola es de una corola gamopétala: marca los pétalos como unidos.', 'That corolla form belongs to a sympetalous corolla: mark the petals as united.', 'info');
    if (['cruciform', 'caryophyllaceous', 'rosaceous', 'papilionaceous'].includes(L.corolla) && f.C && FM.allConnate(f.C)) w('Esa forma de corola es de pétalos libres (dialipétala).', 'That corolla form has free petals (polypetalous).', 'info');
    return out;
  }
  function renderChecks() {
    const box = el('b2Checks');
    if (!box) return;
    const c = checks(S.m);
    box.innerHTML = c.length ? `<b>${L2('Revisa', 'Check')}</b><ul>${c.map(x => `<li class="${x.lvl}">${L2(esc(x.es), esc(x.en))}</li>`).join('')}</ul>`
      : `<span class="ok">✓ ${L2('Sin incoherencias: la flor es botánicamente consistente.', 'No inconsistencies: the flower is botanically consistent.')}</span>`;
    box.className = 'b2-checks' + (c.some(x => x.lvl === 'warn') ? ' has-warn' : c.length ? ' has-info' : '');
  }

  /* ---------------- formula entry ---------------- */
  const KEYS = ['✱', '↑', '┼', '↯', '⚥', '♂', '♀', 'K', 'C', 'P', 'A', 'G', 'E', '(', ')', '[', ']', '+', ':', '∞', '–', '°', 'ʳ', '⁰', 'G̲', 'Ğ', '-G-'];
  function buildFromText() {
    const inp = el('b2FInput');
    const r = Formula.parse(inp.value);
    const msg = el('b2FMsg');
    const f = r.model;
    if (!f.K && !f.C && !f.P && !f.A && !f.G) { msg.innerHTML = `<span class="bad">${L2('No encontré ningún verticilo. Escribe, por ejemplo: ✱ K(5) [C(5) A5] G(2)', 'No whorl found. Type, for example: ✱ K(5) [C(5) A5] G(2)')}</span>`; return; }
    /* keep the colours of the current flower */
    f.colors = Object.assign({}, S.m.colors);
    load(f, S.name);
    const notes = r.warnings.map(w => `<li>${esc(w)}</li>`).join('');
    msg.innerHTML = `<span class="ok">✓ ${L2('Flor construida a partir de la fórmula.', 'Flower built from the formula.')}</span>` +
      (r.posGuessed && f.G ? ` <span class="muted">${L2('No indicaste la posición del ovario: se tomó como súpero.', 'No ovary position was given: it was taken as superior.')}</span>` : '') +
      (notes ? `<ul class="bad">${notes}</ul>` : '');
  }

  /* ---------------- saved flowers, files and links ---------------- */
  const saved = () => Prefs.get(KEY_SAVED, []);
  function save() {
    const name = (el('b2Name').value || '').trim() || (I18N.lang === 'en' ? 'My flower' : 'Mi flor');
    S.name = name;
    const list = saved().filter(x => x.name !== name);
    list.unshift({ name, m: S.m, t: Date.now() });
    Prefs.set(KEY_SAVED, list.slice(0, 60));
    renderSaved();
    flash(el('b2Save'), L2('¡Guardada!', 'Saved!'));
  }
  function renderSaved() {
    const box = el('b2SavedList');
    if (!box) return;
    const list = saved();
    box.innerHTML = list.length ? list.map((x, i) => `<div class="sv-row"><button class="sv-load" data-i="${i}" title="${esc(Formula.text(x.m, state.conv))}">${esc(x.name)}</button><span class="sv-f ff ff-${state.conv}">${Formula.html(x.m, state.conv).replace(/^<span class="ff[^"]*">|<\/span>$/g, '')}</span><button class="icon-btn sm sv-del" data-i="${i}" title="${I18N.lang === 'en' ? 'Delete' : 'Borrar'}">×</button></div>`).join('')
      : `<p class="b2-hint">${L2('Todavía no has guardado ninguna flor. Escribe un nombre arriba y pulsa «Guardar».', 'You have not saved any flower yet. Type a name above and press "Save".')}</p>`;
  }
  function exportFile() {
    const data = { app: 'FloralPro', kind: 'flower', version: 1, name: S.name || '', model: S.m };
    download(JSON.stringify(data, null, 2), slug(S.name || 'flor') + '.flor.json', 'application/json');
  }
  function importFile(file) {
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const d = JSON.parse(rd.result);
        const m = d.model || d.m || d;
        if (!m || typeof m !== 'object' || !(m.K || m.C || m.P || m.A || m.G)) throw new Error('bad');
        load(m, d.name || file.name.replace(/\.flor\.json$|\.json$/i, ''));
      } catch (e) {
        el('b2FMsg').innerHTML = `<span class="bad">${L2('El archivo no contiene una flor de FloralPro.', 'The file does not contain a FloralPro flower.')}</span>`;
      }
    };
    rd.readAsText(file);
  }
  /* the link carries the flower in the address: #b2&f=<base64url of the JSON> */
  function encodeModel(m) {
    const json = JSON.stringify({ n: S.name || '', m });
    const b = btoa(unescape(encodeURIComponent(json)));
    return b.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function decodeModel(s) {
    const b = s.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(escape(atob(b + '==='.slice((b.length + 3) % 4))));
    return JSON.parse(json);
  }
  function shareLink() {
    const url = location.href.split('#')[0] + '#b2&f=' + encodeModel(S.m);
    const box = el('b2Link');
    box.style.display = 'flex';
    el('b2LinkTxt').value = url;
    Views.copyText(url, el('b2LinkCopy'));
  }
  function flash(btn, html) { if (!btn) return; const old = btn.innerHTML; btn.innerHTML = html; setTimeout(() => { btn.innerHTML = old; }, 1300); }

  /* ---------------- page ---------------- */
  function templatesSelect() {
    const opts = [`<option value="">${I18N.lang === 'en' ? 'Start from…' : 'Empezar desde…'}</option>`,
      `<optgroup label="${I18N.lang === 'en' ? 'General models' : 'Modelos generales'}">` + TEMPLATES.map(t => `<option value="${t.id}">${esc(I18N.lang === 'en' ? t.en : t.es)}</option>`).join('') + '</optgroup>',
      `<optgroup label="${I18N.lang === 'en' ? 'Example species' : 'Especies de ejemplo'}">` + SPECIMENS.map(sp => sp.flowers.map((fl, i) => `<option value="sp:${sp.id}:${i}">${esc(T2(sp.common))}${fl.label ? ' — ' + esc(T2(fl.label)) : ''} (${esc(sp.sci)})</option>`).join('')).join('') + '</optgroup>'];
    el('b2Tpl').innerHTML = opts.join('');
  }
  function keyboard() {
    el('b2Keys').innerHTML = KEYS.map(k => `<button class="kb" data-k="${esc(k)}">${esc(k)}</button>`).join('') +
      `<button class="kb kb-wide" data-k="⌫">⌫</button>`;
  }

  function init() {
    const panel = el('panel-2');
    if (!panel) return;
    templatesSelect();
    keyboard();
    /* start: shared link > draft > template */
    let startM = null, startName = '';
    const mh = /[#&]f=([A-Za-z0-9_-]+)/.exec(location.hash || '');
    if (mh) { try { const d = decodeModel(mh[1]); startM = d.m; startName = d.n || ''; } catch (e) { startM = null; } }
    if (!startM) { const dr = Prefs.get('draft', null); if (dr && dr.m) { startM = dr.m; startName = dr.name || ''; } }
    if (!startM) { startM = TEMPLATES[0].m; startName = ''; }
    S.m = toEditable(startM); S.name = startName;
    el('b2Name').value = S.name;
    renderEditor();
    S.views = Views.create(el('b2Views'), { model: S.m, formulaFirst: true, name: 'floralpro', fileName: () => S.name || 'flor' });
    renderChecks();
    renderSaved();
    updateUndo();

    const ed = el('b2Editor');
    ed.addEventListener('click', e => {
      const b = e.target.closest('[data-act]');
      if (!b || !ed.contains(b)) return;
      e.preventDefault();
      act(b.dataset.act, b.dataset);
    });
    ed.addEventListener('input', e => {
      const t = e.target;
      if (!t.dataset.p) return;
      if (t.type === 'range' || t.dataset.t === 'count' || t.type === 'color' || t.classList.contains('b2-txt') || t.classList.contains('b2-num')) bindInput(t, true);
    });
    ed.addEventListener('change', e => {
      const t = e.target;
      if (!t.dataset.p) return;
      if (t.dataset.t === 'count' || t.type === 'range' || t.type === 'color' || t.classList.contains('b2-txt') || t.classList.contains('b2-num')) { renderEditor(); return; }
      bindInput(t, false);
    });
    /* hovering an organ box lights the whorl up in the views */
    ed.addEventListener('mouseover', e => { const b = e.target.closest('[data-org]'); S.views.highlight(b ? b.dataset.org : null); });
    ed.addEventListener('mouseleave', () => S.views.highlight(null));

    el('b2Tpl').addEventListener('change', e => {
      const v = e.target.value;
      if (!v) return;
      if (v.startsWith('sp:')) {
        const [, id, i] = v.split(':');
        const sp = SPECIMENS.find(x => x.id === id);
        load(sp.flowers[+i].m, T2(sp.common) + (sp.flowers[+i].label ? ' — ' + T2(sp.flowers[+i].label) : ''));
      } else {
        const t = TEMPLATES.find(x => x.id === v);
        load(t.m, I18N.lang === 'en' ? t.en : t.es);
      }
      e.target.value = '';
    });
    el('b2Undo').addEventListener('click', undo);
    el('b2Redo').addEventListener('click', redo);
    document.addEventListener('keydown', e => {
      if (!panel.classList.contains('active')) return;
      if (e.target.closest('input, textarea, select')) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); }
    });
    el('b2Name').addEventListener('input', e => { S.name = e.target.value; persistDraft(); });
    el('b2Save').addEventListener('click', save);
    el('b2SavedList').addEventListener('click', e => {
      const l = e.target.closest('.sv-load'), d = e.target.closest('.sv-del');
      const list = saved();
      if (l) { const x = list[+l.dataset.i]; if (x) load(x.m, x.name); }
      if (d) { list.splice(+d.dataset.i, 1); Prefs.set(KEY_SAVED, list); renderSaved(); }
    });
    el('b2Export').addEventListener('click', exportFile);
    el('b2Import').addEventListener('change', e => { if (e.target.files[0]) importFile(e.target.files[0]); e.target.value = ''; });
    el('b2Share').addEventListener('click', shareLink);
    /* the floral characters of this flower become the observation of the key (Block 5) */
    if (el('b2Key')) el('b2Key').addEventListener('click', () => { if (window.B5) B5.identify(S.m, S.name || T('la flor del constructor', 'the builder flower')); });
    el('b2LinkCopy').addEventListener('click', () => Views.copyText(el('b2LinkTxt').value, el('b2LinkCopy')));
    el('b2Build').addEventListener('click', buildFromText);
    el('b2FInput').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); buildFromText(); } });
    el('b2FromCurrent').addEventListener('click', () => { el('b2FInput').value = Formula.text(S.m, state.conv, { bracts: false, ovules: false }); el('b2FInput').focus(); });
    el('b2Keys').addEventListener('click', e => {
      const b = e.target.closest('.kb');
      if (!b) return;
      const inp = el('b2FInput');
      const k = b.dataset.k;
      const s = inp.selectionStart ?? inp.value.length, en = inp.selectionEnd ?? inp.value.length;
      if (k === '⌫') {
        if (s === en && s > 0) { inp.value = inp.value.slice(0, s - 1) + inp.value.slice(en); inp.setSelectionRange(s - 1, s - 1); }
        else { inp.value = inp.value.slice(0, s) + inp.value.slice(en); inp.setSelectionRange(s, s); }
      } else {
        const ins = /^[KCPAGE]$/.test(k) && s > 0 && inp.value[s - 1] !== ' ' && inp.value[s - 1] !== '[' ? ' ' + k : k;
        inp.value = inp.value.slice(0, s) + ins + inp.value.slice(en);
        inp.setSelectionRange(s + ins.length, s + ins.length);
      }
      inp.focus();
    });
    document.addEventListener('langchange', () => { templatesSelect(); keyboard(); renderEditor(); renderChecks(); renderSaved(); });
    document.addEventListener('convchange', () => { refreshEditorBits(); renderSaved(); });
  }
  document.addEventListener('DOMContentLoaded', init);

  return { S, load, checks, toEditable, parseCount, encodeModel, decodeModel, TEMPLATES, act, bindInput, undo, redo };
})();
window.B2 = B2;
