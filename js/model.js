/* FloralPro — the flower model (FM).

   One flower is described once, whorl by whorl, and everything else is derived
   from that description: the floral formula in either convention (formula.js),
   the floral diagram (diagram.js), the three-dimensional flower (flower3d.js),
   the longitudinal section (section.js) and the description in words (below).
   Because the four views come from the same object they can never disagree,
   and the tests can check each of them against the model.

   A flower:
   {
     sym:  'actino' | 'zygo' (median plane) | 'zygoT' (transverse plane) | 'zygoO' (oblique)
           | 'disym' | 'asym' | 'spiral',
     sex:  'bisexual' | 'staminate' | 'pistillate',
     B: 0|1 (subtending bract), Bt: 0|1|2 (bracteoles), resup: true when resupinate,
     E, K, C, P, A: organ categories (epicalyx, calyx, corolla, perigon, androecium)
     G: gynoecium — an organ category plus ovary data (see below),
     adn: [['C','A'], …]   organ categories fused to each other (adnation),
     hyp:  'none' | 'cup' | 'tube'   hypanthium (floral cup) on which the perianth and stamens sit,
     disc: null | 'intra' | 'extra'  nectary disc inside or outside the stamens,
     corona: null | {n, color}       corona between corolla and stamens (Passiflora, Narcissus),
     oddK: 'adaxial' | 'abaxial'     where the odd member of the outer perianth whorl sits,
     colors: {K, C, P, A, G}         natural colours for the drawings,
     look:  drawing hints (corolla form, petal shape, tube length…)
   }
   An organ category:  { w: [whorl…], connate: bool (fused across whorls, e.g. P(3+3)),
                         like: 'C' when sepals are petaloid, aest: aestivation, sym: organ-level symmetry }
   A whorl:            { n: count, connate: bool, parts: [part…], state, opp, ang, fasc, label }
                         parts split one whorl into dissimilar groups written with ':' (e.g. C1:2:(2));
                         they are listed from the adaxial (posterior) side to the abaxial (anterior) side.
   A part:             { n: count, connate: bool, state: 'fertile' | 'sterile' | 'lost', label, size }
   A count:            5 | Infinity (many) | [min, max]  (max may be Infinity);  '∞' is read as Infinity.
   The gynoecium adds: pos: 'superior' | 'half' | 'inferior', loc: locules, plac: placentation
                       ('axile' | 'parietal' | 'freecentral' | 'basal' | 'apical' | 'marginal' | 'laminar'),
                       ov: ovules per ovary, style: 'terminal' | 'gynobasic' | 'lateral',
                       replum: true for a false septum between parietal placentas (crucifers),
                       ang: angle of the first carpel. */

const FM = (function () {
  const ORG = ['E', 'K', 'C', 'P', 'A', 'G'];
  const MANY_DRAW = 24;      /* how many organs to draw for "∞" */

  /* ---------------- counts ---------------- */
  function num(x) {
    if (x === '∞' || x === 'inf' || x === 'Infinity') return Infinity;
    return x;
  }
  function count(c) {
    if (c == null) return null;
    if (Array.isArray(c)) {
      const a = num(c[0]), b = num(c[1]);
      return a === b ? a : [a, b];
    }
    return num(c);
  }
  const cmin = c => Array.isArray(c) ? c[0] : c;
  const cmax = c => Array.isArray(c) ? c[1] : c;
  /* a number to draw */
  function ctyp(c) {
    if (Array.isArray(c)) {
      const [a, b] = c;
      if (isFinite(b)) return Math.round(b);
      if (isFinite(a) && a > 0) return Math.max(a, 12);
      return MANY_DRAW;
    }
    return isFinite(c) ? c : MANY_DRAW;
  }
  function cstr(c) {
    if (c == null) return '';
    const s = v => v === Infinity ? '∞' : String(v);
    if (Array.isArray(c)) return s(c[0]) + '–' + s(c[1]);
    return s(c);
  }
  function cadd(a, b) {
    if (a == null) return b;
    if (b == null) return a;
    const lo = cmin(a) + cmin(b), hi = cmax(a) + cmax(b);
    return lo === hi ? lo : [lo, hi];
  }
  const ceq = (a, b) => cmin(a) === cmin(b) && cmax(a) === cmax(b);
  const isMany = c => cmax(c) === Infinity || cmin(c) > 12;

  /* ---------------- normalisation ---------------- */
  function normWhorl(w) {
    if (typeof w === 'number' || typeof w === 'string' || Array.isArray(w)) w = { n: w };
    const o = Object.assign({ connate: false, state: 'fertile', opp: false, ang: null, fasc: null, label: null }, w);
    if (o.parts) {
      o.parts = o.parts.map(p => {
        if (typeof p !== 'object' || Array.isArray(p)) p = { n: p };
        return Object.assign({ connate: false, state: 'fertile', label: null, size: 1 }, p, { n: count(p.n) });
      });
      o.n = o.parts.reduce((s, p) => cadd(s, p.n), null);
    } else o.n = count(o.n);
    if (o.fasc) o.fasc = { g: count(o.fasc.g), per: count(o.fasc.per) };
    return o;
  }
  function normOrg(o, key) {
    if (o == null || o === 0) return null;
    if (typeof o === 'number' || typeof o === 'string' || Array.isArray(o)) o = { w: [o] };
    const r = Object.assign({ connate: false, like: null, aest: null, sym: null }, o);
    r.w = (o.w || []).map(normWhorl);
    r.key = key;
    return r;
  }
  function normalize(src) {
    const m = JSON.parse(JSON.stringify(src || {}, (k, v) => v === Infinity ? '∞' : v));
    const f = Object.assign({
      sym: 'actino', sex: 'bisexual', B: 0, Bt: 0, resup: false,
      adn: [], hyp: 'none', disc: null, corona: null, oddK: null,
      colors: {}, look: {}, notes: null,
    }, m);
    for (const k of ORG) f[k] = normOrg(m[k], k);
    if (f.G) {
      f.G = Object.assign({ pos: 'superior', loc: null, plac: null, ov: null, style: 'terminal', replum: false, ang: null, stig: null }, f.G);
      f.G.loc = count(f.G.loc); f.G.ov = count(f.G.ov);
      const nc = total(f.G), syn = gynSyncarpous(f.G);
      if (!f.G.plac) f.G.plac = (cmax(nc) === 1) ? 'marginal' : syn ? 'axile' : 'marginal';
      if (f.G.loc == null) f.G.loc = !syn ? nc : (['axile', 'laminar'].includes(f.G.plac) ? nc : (f.G.replum ? 2 : 1));
    }
    if (!f.oddK) {
      const first = f.K || f.P;
      f.oddK = first && ctyp(first.w[0].n) === 3 ? 'abaxial' : 'adaxial';
    }
    f.adn = mergeAdnation(f);
    return f;
  }

  /* Adnation groups as a formula can write them: groups that share an organ are one
     group (stamens fused to the tepals and to the gynoecium = {P A G}), and a group
     covers every organ between its first and last one, since brackets enclose a
     continuous stretch of the formula. */
  function mergeAdnation(f) {
    const present = ORG.filter(k => f[k]);
    let groups = (f.adn || []).map(g => new Set(g.filter(k => f[k] && ORG.includes(k)))).filter(s => s.size >= 2);
    const expand = s => {
      const idx = [...s].map(k => present.indexOf(k)).sort((a, b) => a - b);
      return new Set(present.slice(idx[0], idx[idx.length - 1] + 1));
    };
    let changed = true;
    while (changed) {
      changed = false;
      groups = groups.map(expand);
      for (let i = 0; i < groups.length && !changed; i++) for (let j = i + 1; j < groups.length && !changed; j++) {
        if ([...groups[i]].some(k => groups[j].has(k))) { groups[j].forEach(k => groups[i].add(k)); groups.splice(j, 1); changed = true; }
      }
    }
    return groups.map(s => ORG.filter(k => s.has(k)));
  }

  /* ---------------- totals and derived characters ---------------- */
  function cmul(a, b) {
    const lo = cmin(a) * cmin(b), hi = cmax(a) * cmax(b);
    return lo === hi ? lo : [lo, hi];
  }
  function total(org, opts) {
    if (!org) return 0;
    const fertileOnly = opts && opts.fertile, visible = opts && opts.visible, sterileOnly = opts && opts.sterile;
    let s = null;
    for (const w of org.w) {
      if (w.parts) {
        for (const p of w.parts) {
          if (fertileOnly && p.state !== 'fertile') continue;
          if (sterileOnly && p.state !== 'sterile') continue;
          if (visible && p.state === 'lost') continue;
          s = cadd(s, p.n);
        }
      } else {
        if (fertileOnly && w.state !== 'fertile') continue;
        if (sterileOnly && w.state !== 'sterile') continue;
        if (visible && w.state === 'lost') continue;
        /* a whorl of bundles counts its stamens, not its bundles: A5⁴⁻⁸ is 20–40 stamens */
        s = cadd(s, w.fasc && w.fasc.per != null ? cmul(w.n, w.fasc.per) : w.n);
      }
    }
    return s == null ? 0 : s;
  }
  const gynSyncarpous = g => g && g.w.length && g.w.every(w => w.connate === true) || (g && g.connate);
  function allConnate(org) { return org && (org.connate || org.w.every(w => w.connate === true)); }
  function anyConnate(org) { return org && (org.connate || org.w.some(w => w.connate || (w.parts && w.parts.some(p => p.connate)))); }
  function adnate(f, a, b) { return f.adn.some(g => g.includes(a) && g.includes(b)); }

  /* the corolla and the perigon weigh more than the calyx, which is often reduced
     (a pappus of two scales does not make a sunflower floret dimerous) */
  function merosity(f) {
    const tally = {};
    const add = (org, wt) => { if (org) for (const w of org.w) { const n = cmin(w.n); if (n === cmax(w.n) && isFinite(n) && n > 1 && !w.label) tally[n] = (tally[n] || 0) + wt; } };
    add(f.C, 3); add(f.P, 3); add(f.K, 1);
    if (!Object.keys(tally).length) add(f.A, 1);
    if (!Object.keys(tally).length) return null;
    return +Object.keys(tally).sort((a, b) => tally[b] - tally[a] || a - b)[0];
  }

  function perianthType(f) {
    if (f.K && f.C) return 'hetero';
    const P = f.P || f.K || f.C;
    if (!P) return 'none';
    const whorls = P.w.filter(w => cmax(w.n) > 0).length;
    return whorls >= 2 || isMany(total(P)) ? 'homo' : 'mono';
  }

  /* where the stamens sit relative to the corolla (or inner perigon) */
  function androeciumType(f) {
    const A = f.A;
    if (!A) return null;
    const ref = f.C ? f.C : (f.P ? { w: [f.P.w[f.P.w.length - 1]] } : null);
    const nPet = ref ? total(ref) : 0;
    const nA = total(A, { visible: true }), nW = A.w.length;
    const r = { total: nA, fertile: total(A, { fertile: true }), whorls: nW };
    if (isMany(nA)) r.rel = 'poly';
    else if (!nPet || !isFinite(cmax(nPet))) r.rel = null;
    else if (ceq(nA, nPet)) r.rel = A.w[0].opp ? 'antepet' : 'iso';
    else if (cmin(nA) === 2 * cmin(nPet) && cmax(nA) === 2 * cmax(nPet)) r.rel = A.w.filter(w => w.state !== 'lost').length === 1 && !A.w[0].parts ? 'dbl' : A.w[0].opp ? 'obdiplo' : 'diplo';
    else if (cmax(nA) < cmin(nPet)) r.rel = 'oligo';
    else if (cmin(nA) > 2 * cmax(nPet)) r.rel = 'poly';
    else r.rel = 'aniso';
    /* fusion of stamens to each other */
    /* units = whorls, or the ':' groups inside a whorl; one connate unit is one bundle */
    /* only fertile stamens count: fused staminodes (the lip of gingers) are not a bundle of stamens */
    const units = [];
    for (const w of A.w) {
      if (w.state !== 'fertile' && !w.parts) continue;
      if (w.parts) w.parts.forEach(p => { if (p.state === 'fertile') units.push(!!p.connate); });
      else units.push(!!w.connate);
    }
    const nConn = units.filter(Boolean).length;
    if (A.w.some(w => w.fasc)) r.fusion = 'poly';
    else if (A.connate || (units.length === 1 && nConn === 1)) r.fusion = 'mono';
    else if (nConn === 0) r.fusion = 'free';
    else if (units.length === 2) r.fusion = 'di';
    else r.fusion = nConn >= 3 ? 'poly' : 'di';
    if (f.look && f.look.synanther) r.fusion = f.look.filTube ? 'synmono' : 'syn';
    r.epi = adnate(f, 'C', 'A') ? 'petal' : adnate(f, 'P', 'A') ? 'tepal' : null;
    r.gyno = adnate(f, 'A', 'G');
    r.dyn = (f.look && f.look.dyn) || null;
    return r;
  }

  function gynoeciumType(f) {
    const G = f.G;
    if (!G) return null;
    const nc = total(G, { visible: true });
    const r = { carpels: nc, pos: G.pos, loc: G.loc, plac: G.plac, ov: G.ov, style: G.style };
    if (cmax(nc) === 1) r.type = 'mono';
    else if (gynSyncarpous(G)) r.type = 'syn';
    else if (G.w.some(w => w.connate === 'apical')) r.type = 'semi';
    else r.type = 'apo';
    r.insertion = G.pos === 'inferior' ? 'epi' : G.pos === 'half' ? 'hemi' : (f.hyp !== 'none' ? 'peri' : 'hypo');
    return r;
  }

  /* ---------------- description in words ----------------
     Returns a list of {org, html} lines. Technical terms are wrapped in
     <dfn data-term="…"> so the glossary (Block 3) can explain them. */
  const W = {
    num: {
      es: ['ningún', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce'],
      en: ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'],
    },
    mero: {
      es: { 2: 'dímera', 3: 'trímera', 4: 'tetrámera', 5: 'pentámera', 6: 'hexámera' },
      en: { 2: 'dimerous', 3: 'trimerous', 4: 'tetramerous', 5: 'pentamerous', 6: 'hexamerous' },
    },
    sym: {
      es: { actino: 'actinomorfa', zygo: 'zigomorfa', zygoT: 'zigomorfa (plano transversal)', zygoO: 'zigomorfa (plano oblicuo)', disym: 'disimétrica', asym: 'asimétrica', spiral: 'de disposición espiral (acíclica)' },
      en: { actino: 'actinomorphic', zygo: 'zygomorphic', zygoT: 'zygomorphic (transverse plane)', zygoO: 'zygomorphic (oblique plane)', disym: 'disymmetric', asym: 'asymmetric', spiral: 'spirally arranged (acyclic)' },
    },
    sex: {
      es: { bisexual: 'hermafrodita (perfecta)', staminate: 'unisexual estaminada (masculina)', pistillate: 'unisexual pistilada (femenina)' },
      en: { bisexual: 'bisexual (perfect)', staminate: 'unisexual, staminate (male)', pistillate: 'unisexual, pistillate (female)' },
    },
    plac: {
      es: { axile: 'axilar', parietal: 'parietal', freecentral: 'central libre', basal: 'basal', apical: 'apical', marginal: 'marginal', laminar: 'laminar' },
      en: { axile: 'axile', parietal: 'parietal', freecentral: 'free-central', basal: 'basal', apical: 'apical', marginal: 'marginal', laminar: 'laminar' },
    },
    pos: {
      es: { superior: 'súpero', half: 'semiínfero', inferior: 'ínfero' },
      en: { superior: 'superior', half: 'half-inferior', inferior: 'inferior' },
    },
    aest: {
      es: { valvate: 'valvar', imbricate: 'imbricada', quincuncial: 'quincuncial', contort: 'contorta', vexillary: 'vexilar (imbricada descendente)', carinal: 'carinal (imbricada ascendente)', cochlear: 'coclear', open: 'abierta' },
      en: { valvate: 'valvate', imbricate: 'imbricate', quincuncial: 'quincuncial', contort: 'contort', vexillary: 'vexillary (descending imbricate)', carinal: 'carinal (ascending imbricate)', cochlear: 'cochlear', open: 'open' },
    },
  };
  function nWord(c, lang, fem) {
    if (Array.isArray(c)) return cstr(c).replace('∞', lang === 'en' ? 'many' : 'numerosos');
    if (c === Infinity) return lang === 'en' ? 'many' : (fem ? 'numerosas' : 'numerosos');
    let w = (W.num[lang] || W.num.es)[c];
    if (w == null) return String(c);
    if (lang === 'es' && c === 1) w = fem ? 'una' : 'un';
    return w;
  }
  const dfn = (term, txt) => `<dfn data-term="${term}">${txt}</dfn>`;
  const plural = (c, one, many) => (c === 1 ? one : many);

  function describe(f, lang) {
    f = N(f);
    lang = lang === 'en' ? 'en' : 'es';
    const es = lang === 'es';
    const out = [];
    const mer = merosity(f);
    /* the flower as a whole */
    {
      const bits = [];
      bits.push(dfn('sym-' + f.sym, W.sym[lang][f.sym]));
      bits.push(dfn('sex-' + f.sex, W.sex[lang][f.sex]));
      if (mer && W.mero[lang][mer] && f.sym !== 'spiral') bits.push(dfn('merosity', W.mero[lang][mer]));
      const gt = gynoeciumType(f);
      if (gt) {
        const ins = {
          hypo: es ? dfn('hypogynous', 'hipógina') : dfn('hypogynous', 'hypogynous'),
          peri: es ? dfn('perigynous', 'perígina') + ' (con ' + dfn('hypanthium', 'hipanto') + ')' : dfn('perigynous', 'perigynous') + ' (with a ' + dfn('hypanthium', 'hypanthium') + ')',
          hemi: es ? dfn('hemiepigynous', 'hemiepígina') : dfn('hemiepigynous', 'half-epigynous'),
          epi: es ? dfn('epigynous', 'epígina') : dfn('epigynous', 'epigynous'),
        }[gt.insertion];
        bits.push(ins);
      }
      let s;
      if (es) s = 'Flor ' + joinList(bits, lang) + '.';
      else { const t = joinList(bits, lang); const i = t.indexOf('>') + 1; s = (t.startsWith('<') ? t.slice(0, i) + t.charAt(i).toUpperCase() + t.slice(i + 1) : t.charAt(0).toUpperCase() + t.slice(1)) + ' flower.'; }
      if (f.resup) s += es ? ' La flor es ' + dfn('resupinate', 'resupinada') + ': el pedicelo u ovario gira 180° y el labelo queda abajo.' : ' The flower is ' + dfn('resupinate', 'resupinate') + ': the pedicel or ovary twists 180° so the lip ends up below.';
      out.push({ org: 'flower', html: s });
    }
    /* bracts */
    if (f.E) {
      const n = total(f.E);
      out.push({ org: 'E', html: es
        ? `${dfn('epicalyx', 'Epicáliz')} (calículo) de ${nWord(n, lang, false)} ${plural(n, 'pieza', 'piezas')}${allConnate(f.E) ? ' unidas' : ''} por fuera del cáliz.`
        : `${dfn('epicalyx', 'Epicalyx')} of ${nWord(n, lang)} ${plural(n, 'bract', 'bracts')}${allConnate(f.E) ? ', connate' : ''} outside the calyx.` });
    }
    /* perianth */
    const pt = perianthType(f);
    const ptName = {
      hetero: es ? dfn('heterochlamydeous', 'heteroclamídeo') + ' (cáliz y corola distintos)' : dfn('heterochlamydeous', 'heterochlamydeous') + ' (distinct calyx and corolla)',
      homo: es ? dfn('homochlamydeous', 'homoclamídeo') + ' (' + dfn('tepal', 'tépalos') + ' semejantes: perigonio)' : dfn('homochlamydeous', 'homochlamydeous') + ' (similar ' + dfn('tepal', 'tepals') + ': a perigon)',
      mono: es ? dfn('monochlamydeous', 'monoclamídeo') + ' (un solo verticilo)' : dfn('monochlamydeous', 'monochlamydeous') + ' (a single whorl)',
      none: es ? 'ausente: flor ' + dfn('achlamydeous', 'aclamídea') + ' (desnuda)' : 'absent: the flower is ' + dfn('achlamydeous', 'achlamydeous') + ' (naked)',
    }[pt];
    out.push({ org: 'perianth', html: (es ? 'Perianto ' : 'Perianth ') + ptName + '.' });
    const lab = w => w.label ? ` (${T2(w.label, lang)})` : '';
    if (f.K) {
      const n = total(f.K, { visible: true });
      let s = es ? `${dfn('calyx', 'Cáliz')} de ${nWord(n, lang, false)} ${plural(n, 'sépalo', 'sépalos')}` : `${dfn('calyx', 'Calyx')} of ${nWord(n, lang)} ${plural(n, 'sepal', 'sepals')}`;
      if (cmax(n) === 0) s = es ? 'Cáliz ausente o reducido' : 'Calyx absent or reduced';
      else {
        if (f.K.w.length > 1) s += es ? ` en ${f.K.w.length} verticilos` : ` in ${f.K.w.length} whorls`;
        s += allConnate(f.K) ? (es ? ', unidos: ' + dfn('gamosepalous', 'gamosépalo') : ', connate: ' + dfn('gamosepalous', 'gamosepalous'))
          : anyConnate(f.K) ? (es ? ', parcialmente unidos' : ', partly connate')
          : (es ? ', libres: ' + dfn('polysepalous', 'dialisépalo') : ', free: ' + dfn('polysepalous', 'polysepalous'));
        if (f.K.like === 'C') s += es ? '; sépalos ' + dfn('petaloid', 'petaloides') : '; sepals ' + dfn('petaloid', 'petaloid');
        if (f.look && f.look.pappus) s += es ? '; transformado en ' + dfn('pappus', 'vilano') + ' (escamas, cerdas o pelos)' : '; modified into a ' + dfn('pappus', 'pappus') + ' (scales, bristles or hairs)';
        s += lab(f.K.w[0]);
        if (f.K.aest) s += es ? `; prefloración ${dfn('aest-' + f.K.aest, W.aest.es[f.K.aest])}` : `; ${dfn('aest-' + f.K.aest, W.aest.en[f.K.aest])} aestivation`;
      }
      out.push({ org: 'K', html: s + '.' });
    }
    if (f.C) {
      const n = total(f.C, { visible: true });
      let s;
      if (cmax(n) === 0) s = es ? 'Corola ausente' : 'Corolla absent';
      else {
        s = es ? `${dfn('corolla', 'Corola')} de ${nWord(n, lang, false)} ${plural(n, 'pétalo', 'pétalos')}` : `${dfn('corolla', 'Corolla')} of ${nWord(n, lang)} ${plural(n, 'petal', 'petals')}`;
        s += allConnate(f.C) ? (es ? ', unidos: ' + dfn('gamopetalous', 'gamopétala') : ', connate: ' + dfn('gamopetalous', 'sympetalous'))
          : anyConnate(f.C) ? (es ? ', algunos unidos entre sí' : ', some of them connate')
          : (es ? ', libres: ' + dfn('polypetalous', 'dialipétala') : ', free: ' + dfn('polypetalous', 'polypetalous'));
        const partsTxt = describeParts(f.C.w, lang);
        if (partsTxt) s += '; ' + partsTxt;
        if (f.look && f.look.corolla) s += es ? `; forma ${dfn('corolla-' + f.look.corolla, corollaName(f.look.corolla, lang))}` : `; ${dfn('corolla-' + f.look.corolla, corollaName(f.look.corolla, lang))} shape`;
        if (f.C.aest) s += es ? `; prefloración ${dfn('aest-' + f.C.aest, W.aest.es[f.C.aest])}` : `; ${dfn('aest-' + f.C.aest, W.aest.en[f.C.aest])} aestivation`;
      }
      out.push({ org: 'C', html: s + '.' });
    }
    if (f.P) {
      const n = total(f.P, { visible: true });
      let s = es ? `${dfn('perigon', 'Perigonio')} de ${nWord(n, lang, false)} ${plural(n, 'tépalo', 'tépalos')}` : `${dfn('perigon', 'Perigon')} of ${nWord(n, lang)} ${plural(n, 'tepal', 'tepals')}`;
      if (f.P.w.length > 1) s += es ? ` en ${nWord(f.P.w.length, lang)} verticilos (${f.P.w.map(w => cstr(w.n)).join(' + ')})` : ` in ${nWord(f.P.w.length, lang)} whorls (${f.P.w.map(w => cstr(w.n)).join(' + ')})`;
      s += allConnate(f.P) ? (es ? ', unidos en un tubo: ' + dfn('gamotepalous', 'gamotépalo') : ', united in a tube: ' + dfn('gamotepalous', 'syntepalous'))
        : anyConnate(f.P) ? (es ? ', parcialmente unidos' : ', partly connate')
        : (es ? ', libres: ' + dfn('polytepalous', 'dialitépalo') : ', free: ' + dfn('polytepalous', 'apotepalous'));
      const like = f.P.like === 'K' ? (es ? 'sepaloides' : 'sepaloid') : (es ? 'petaloides' : 'petaloid');
      s += es ? `; tépalos ${dfn(f.P.like === 'K' ? 'sepaloid' : 'petaloid', like)}` : `; ${dfn(f.P.like === 'K' ? 'sepaloid' : 'petaloid', like)} tepals`;
      const partsTxt = describeParts(f.P.w, lang);
      if (partsTxt) s += '; ' + partsTxt;
      out.push({ org: 'P', html: s + '.' });
    }
    if (f.corona) {
      const inner = !f.C && f.P;
      out.push({ org: 'corona', html: es ? `Entre ${inner ? 'los tépalos' : 'la corola'} y los estambres hay una ${dfn('corona', 'corona')}.` : `A ${dfn('corona', 'corona')} lies between the ${inner ? 'tepals' : 'corolla'} and the stamens.` });
    }
    /* androecium */
    if (f.A && cmax(total(f.A)) > 0) {
      const a = androeciumType(f);
      const nF = a.fertile, nT = a.total;
      let s;
      if (!cmax(nF)) {
        /* only staminodes, as in many pistillate flowers */
        s = es ? `${dfn('androecium', 'Androceo')} reducido a ${nWord(nT, lang)} ${plural(nT, dfn('staminode', 'estaminodio'), dfn('staminode', 'estaminodios'))} (estambres estériles)` : `${dfn('androecium', 'Androecium')} reduced to ${nWord(nT, lang)} ${plural(nT, dfn('staminode', 'staminode'), dfn('staminode', 'staminodes'))} (sterile stamens)`;
      } else {
        s = es ? `${dfn('androecium', 'Androceo')} de ${nWord(nF, lang, false)} ${plural(nF, 'estambre', 'estambres')}` : `${dfn('androecium', 'Androecium')} of ${nWord(nF, lang)} ${plural(nF, 'stamen', 'stamens')}`;
        /* staminodes are counted directly: "many stamens and ten staminodes" cannot come from ∞ − ∞ */
        const nS = cmax(total(f.A, { sterile: true })) ? total(f.A, { sterile: true }) : subCount(nT, nF);
        if (cmax(nS)) s += es ? ` y ${nWord(nS, lang)} ${plural(nS, dfn('staminode', 'estaminodio'), dfn('staminode', 'estaminodios'))}` : ` and ${nWord(nS, lang)} ${plural(nS, dfn('staminode', 'staminode'), dfn('staminode', 'staminodes'))}`;
      }
      if (a.whorls > 1) s += es ? ` en ${nWord(a.whorls, lang)} verticilos` : ` in ${nWord(a.whorls, lang)} whorls`;
      /* with a perigon the stamens are compared with the tepals of one whorl */
      const tep2 = !f.C && f.P && f.P.w.length > 1, tep1 = !f.C && f.P && !tep2;
      const tep = tep2;
      const pet = es ? (tep2 ? 'tépalos de un verticilo' : tep1 ? 'tépalos' : 'pétalos') : (tep2 ? 'tepals in one whorl' : tep1 ? 'tepals' : 'petals');
      const petS = es ? (tep2 ? 'tépalos internos' : tep1 ? 'tépalos' : 'pétalos') : (tep2 ? 'inner tepals' : tep1 ? 'tepals' : 'petals');
      const sepS = es ? (tep2 ? 'tépalos externos' : 'sépalos') : (tep2 ? 'outer tepals' : 'sepals');
      const rel = {
        /* with two whorls of tepals, "alternating with the inner whorl" is clearer as "opposite the outer tepals" (irises) */
        iso: tep ? (es ? dfn('isostemonous', 'isostémono') + ` (tantos como ${pet}; frente a los ${sepS})` : dfn('isostemonous', 'isostemonous') + ` (as many as the ${pet}; opposite the ${sepS})`)
          : es ? dfn('isostemonous', 'isostémono') + ` (tantos como ${pet}, alternos a ellos)` : dfn('isostemonous', 'isostemonous') + ` (as many as the ${pet}, alternating with them)`,
        antepet: es ? dfn('isostemonous', 'isostémono') + ', ' + dfn('antepetalous', 'antepétalo') + ` (opuestos a los ${petS})` : dfn('isostemonous', 'isostemonous') + ', ' + dfn('antepetalous', 'antepetalous') + ` (opposite the ${petS})`,
        diplo: es ? dfn('diplostemonous', 'diplostémono') + ` (el doble de ${pet}; el verticilo externo frente a los ${sepS})` : dfn('diplostemonous', 'diplostemonous') + ` (twice the ${pet}; outer whorl opposite the ${sepS})`,
        obdiplo: es ? dfn('obdiplostemonous', 'obdiplostémono') + ` (el doble de ${pet}; el verticilo externo frente a los ${petS})` : dfn('obdiplostemonous', 'obdiplostemonous') + ` (twice the ${pet}; outer whorl opposite the ${petS})`,
        poly: es ? dfn('polystemonous', 'polistémono') + ' (numerosos)' : dfn('polystemonous', 'polystemonous') + ' (numerous)',
        oligo: es ? dfn('oligostemonous', 'oligostémono') + ` (menos estambres que ${pet})` : dfn('oligostemonous', 'oligostemonous') + ` (fewer stamens than ${pet})`,
        aniso: es ? dfn('anisostemonous', 'anisostémono') : dfn('anisostemonous', 'anisostemonous'),
        /* twice as many stamens but in one whorl (paired, as in docks): not diplostemony */
        dbl: es ? `el doble que ${pet}, en un solo verticilo` : `twice as many as the ${pet}, in a single whorl`,
      }[a.rel];
      if (rel) s += ', ' + rel;
      const fus = {
        free: es ? 'filamentos libres entre sí' : 'filaments free from each other',
        mono: es ? dfn('monadelphous', 'monadelfo') + ' (filamentos unidos en un tubo)' : dfn('monadelphous', 'monadelphous') + ' (filaments united in a tube)',
        di: es ? dfn('diadelphous', 'diadelfo') + ' (dos grupos)' : dfn('diadelphous', 'diadelphous') + ' (two groups)',
        poly: es ? dfn('polyadelphous', 'poliadelfo') + ' (varios haces)' : dfn('polyadelphous', 'polyadelphous') + ' (several bundles)',
        syn: es ? dfn('synantherous', 'sinantéreo') + ' (anteras unidas en un tubo, filamentos libres)' : dfn('synantherous', 'syngenesious') + ' (anthers united in a tube, filaments free)',
        synmono: es ? dfn('synantherous', 'sinantéreo') + ' y ' + dfn('monadelphous', 'monadelfo') + ' (anteras y filamentos unidos en un tubo)' : dfn('synantherous', 'syngenesious') + ' and ' + dfn('monadelphous', 'monadelphous') + ' (anthers and filaments united in a tube)',
      }[a.fusion];
      /* stamens united with the style (gynostemium) have no free filaments to speak of */
      if (fus && !(a.gyno && a.fusion === 'free')) s += '; ' + fus;
      if (a.epi === 'petal') s += es ? '; soldados a la corola: ' + dfn('epipetalous', 'epipétalos') : '; fused to the corolla: ' + dfn('epipetalous', 'epipetalous');
      if (a.epi === 'tepal') s += es ? '; soldados a los tépalos: ' + dfn('epitepalous', 'epitépalos') : '; fused to the tepals: ' + dfn('epitepalous', 'epitepalous');
      if (a.gyno) s += es ? '; unidos al gineceo en un ' + dfn('gynostemium', 'ginostemio') + ' (columna)' : '; united with the gynoecium in a ' + dfn('gynostemium', 'gynostemium') + ' (column)';
      if (a.dyn === 'didynamous') s += es ? '; ' + dfn('didynamous', 'didínamo') + ' (dos largos y dos cortos)' : '; ' + dfn('didynamous', 'didynamous') + ' (two long, two short)';
      if (a.dyn === 'tetradynamous') s += es ? '; ' + dfn('tetradynamous', 'tetradínamo') + ' (cuatro largos y dos cortos)' : '; ' + dfn('tetradynamous', 'tetradynamous') + ' (four long, two short)';
      const L = f.look || {};
      if (L.anther) {
        const at = { basifixed: es ? 'basifijas' : 'basifixed', dorsifixed: es ? 'dorsifijas' : 'dorsifixed', versatile: es ? 'versátiles' : 'versatile' }[L.anther];
        if (at) s += es ? `; anteras ${dfn('anther-' + L.anther, at)}` : `; ${dfn('anther-' + L.anther, at)} anthers`;
      }
      if (L.dehisc && L.dehisc !== 'longitudinal') {
        const dh = { poricidal: es ? 'poricida (por poros)' : 'poricidal (by pores)', valvular: es ? 'valvar (por valvas)' : 'valvular (by flaps)', transverse: es ? 'transversal' : 'transverse' }[L.dehisc];
        s += es ? `; dehiscencia ${dfn('dehisc-' + L.dehisc, dh)}` : `; ${dfn('dehisc-' + L.dehisc, dh)} dehiscence`;
      }
      if (L.thecae === 1) s += es ? '; anteras ' + dfn('monothecal', 'monotecas') + ' (una sola teca)' : '; ' + dfn('monothecal', 'monothecal') + ' anthers (one theca)';
      if (L.pollinia) s += es ? '; polen en ' + dfn('pollinium', 'polinios') : '; pollen in ' + dfn('pollinium', 'pollinia');
      out.push({ org: 'A', html: s + '.' });
    } else if (f.A || f.sex === 'pistillate') {
      out.push({ org: 'A', html: es ? 'Sin estambres (flor pistilada).' : 'No stamens (pistillate flower).' });
    }
    /* gynoecium; a sterile one (pistillode) has no ovary to describe */
    const gSterile = f.G && cmax(total(f.G)) > 0 && !cmax(total(f.G, { fertile: true }));
    if (gSterile) {
      const nc = total(f.G);
      out.push({ org: 'G', html: es ? `${dfn('pistillode', 'Pistilodio')}: gineceo rudimentario y estéril${cmax(nc) > 1 ? ` (restos de ${nWord(nc, lang)} carpelos)` : ''}, sin óvulos funcionales.` : `${dfn('pistillode', 'Pistillode')}: a rudimentary, sterile gynoecium${cmax(nc) > 1 ? ` (remains of ${nWord(nc, lang)} carpels)` : ''}, without working ovules.` });
    } else if (f.G && cmax(total(f.G)) > 0) {
      const g = gynoeciumType(f);
      const nc = g.carpels;
      let s = es ? `${dfn('gynoecium', 'Gineceo')} ` : `${dfn('gynoecium', 'Gynoecium')} `;
      s += {
        mono: es ? dfn('monocarpellate', 'monocarpelar') + ' (un solo carpelo)' : dfn('monocarpellate', 'monocarpellate') + ' (a single carpel)',
        syn: es ? `${dfn('syncarpous', 'sincárpico')} de ${nWord(nc, lang)} ${plural(nc, 'carpelo', 'carpelos')} unidos` : `${dfn('syncarpous', 'syncarpous')} of ${nWord(nc, lang)} connate ${plural(nc, 'carpel', 'carpels')}`,
        apo: es ? `${dfn('apocarpous', 'apocárpico')} de ${nWord(nc, lang)} carpelos libres` : `${dfn('apocarpous', 'apocarpous')} of ${nWord(nc, lang)} free carpels`,
        semi: es ? `de ${nWord(nc, lang)} carpelos con ovarios libres y ${dfn('united-styles', 'estilos o estigmas unidos')}` : `of ${nWord(nc, lang)} carpels with free ovaries and ${dfn('united-styles', 'united styles or stigmas')}`,
      }[g.type];
      const posW = dfn('ovary-' + g.pos, W.pos[lang][g.pos]);
      if (g.type === 'apo' || g.type === 'semi') s += es ? `, ovarios ${g.pos === 'superior' ? 'súperos' : W.pos.es[g.pos] + 's'}` : `, ovaries ${posW}`;
      else s += es ? `; ovario ${posW}` : `; ovary ${posW}`;
      if (g.type !== 'apo' && g.type !== 'semi' && g.loc != null) {
        const lw = es ? { 1: 'unilocular', 2: 'bilocular', 3: 'trilocular', 4: 'tetralocular', 5: 'pentalocular' }[g.loc] : { 1: 'unilocular', 2: 'bilocular', 3: 'trilocular', 4: 'four-locular', 5: 'five-locular' }[g.loc];
        s += ', ' + (lw ? dfn('locule', lw) : (es ? `con ${cstr(g.loc)} lóculos` : `with ${cstr(g.loc)} locules`));
        if (f.G.falseSepta || (g.type === 'syn' && isFinite(cmax(nc)) && cmin(g.loc) > cmax(nc))) s += es ? ' (con ' + dfn('false-septum', 'falsos tabiques') + ')' : ' (with ' + dfn('false-septum', 'false septa') + ')';
        if (f.G.replum) s += es ? ' por un falso tabique tendido sobre el ' + dfn('replum', 'réplum') : ' by a false septum stretched across the ' + dfn('replum', 'replum');
      }
      s += es ? `; placentación ${dfn('plac-' + g.plac, W.plac.es[g.plac])}` : `; ${dfn('plac-' + g.plac, W.plac.en[g.plac])} placentation`;
      if (g.ov != null) {
        const ovn = g.ov;
        s += es ? `, ${nWord(ovn, lang, false)} ${plural(ovn, 'óvulo', 'óvulos')}` : `, ${nWord(ovn, lang)} ${plural(ovn, 'ovule', 'ovules')}`;
        s += g.type === 'apo' || g.type === 'semi' ? (es ? ' por carpelo' : ' per carpel') : (es ? ' por ovario' : ' per ovary');
      }
      if (g.style === 'gynobasic') s += es ? '; estilo ' + dfn('gynobasic', 'ginobásico') + ' (sale de la base, entre los lóbulos del ovario)' : '; ' + dfn('gynobasic', 'gynobasic') + ' style (arising from the base, between the ovary lobes)';
      if (g.style === 'lateral') s += es ? '; estilo ' + dfn('style-lateral', 'lateral') + ' (sale de un costado del ovario)' : '; ' + dfn('style-lateral', 'lateral') + ' style (arising from the side of the ovary)';
      if (f.look && f.look.stigma) s += es ? `; estigma ${dfn('stigma-' + f.look.stigma, stigmaName(f.look.stigma, 'es'))}` : `; ${dfn('stigma-' + f.look.stigma, stigmaName(f.look.stigma, 'en'))} stigma`;
      out.push({ org: 'G', html: s + '.' });
    } else if (f.G || f.sex === 'staminate') {
      out.push({ org: 'G', html: es ? 'Sin gineceo funcional (flor estaminada).' : 'No functional gynoecium (staminate flower).' });
    }
    if (f.disc) out.push({ org: 'disc', html: es ? `Hay un ${dfn('disc', 'disco nectarífero')} ${f.disc === 'extra' ? 'por fuera' : 'por dentro'} de los estambres.` : `A ${dfn('disc', 'nectary disc')} lies ${f.disc === 'extra' ? 'outside' : 'inside'} the stamens.` });
    return out;
  }
  function subCount(a, b) {
    if (Array.isArray(a) || Array.isArray(b) || !isFinite(a) || !isFinite(b)) return 0;
    return Math.max(0, a - b);
  }
  function describeParts(whorls, lang) {
    const es = lang === 'es';
    const bits = [];
    for (const w of whorls) if (w.parts) {
      const named = w.parts.filter(p => p.label);
      /* a group without a name is called by its state, or "the others" */
      const name = p => p.label ? T2(p.label, lang) : p.state === 'lost' ? (es ? 'ausente' : 'lost') : p.state === 'sterile' ? (es ? 'estériles' : 'sterile') : (es ? 'los demás' : 'the others');
      if (named.length) bits.push(w.parts.map(p => `${name(p)} (${cstr(p.n)}${p.connate ? (es ? ', unidos' : ', connate') : ''})`).join(', '));
    }
    return bits.length ? (es ? 'piezas desiguales: ' : 'unequal members: ') + bits.join('; ') : '';
  }
  function T2(x, lang) { return x && typeof x === 'object' ? (x[lang] || x.es) : x; }
  function joinList(arr, lang) {
    if (arr.length <= 1) return arr.join('');
    return arr.slice(0, -1).join(', ') + (lang === 'es' ? ' y ' : ' and ') + arr[arr.length - 1];
  }
  const COROLLA = {
    rotate: ['rotácea', 'rotate'], campanulate: ['campanulada', 'campanulate'], tubular: ['tubulosa', 'tubular'],
    funnelform: ['infundibuliforme', 'funnelform'], salverform: ['hipocrateriforme', 'salverform'], urceolate: ['urceolada', 'urceolate'],
    bilabiate: ['bilabiada', 'bilabiate'], personate: ['personada', 'personate'], ligulate: ['ligulada', 'ligulate'],
    papilionaceous: ['papilionácea', 'papilionaceous'], cruciform: ['cruciforme', 'cruciform'], rosaceous: ['rosácea', 'rosaceous'],
    caryophyllaceous: ['cariofilácea', 'caryophyllaceous'], spurred: ['espolonada', 'spurred'], orchid: ['orquidácea (con labelo)', 'orchidaceous (with a lip)'],
    cupulate: ['cupuliforme', 'cup-shaped'],
  };
  function corollaName(k, lang) { const c = COROLLA[k]; return c ? c[lang === 'en' ? 1 : 0] : k; }
  function stigmaName(k, lang) {
    const S = { capitate: ['capitado', 'capitate'], lobed: ['lobulado', 'lobed'], bifid: ['bífido', 'bifid'], plumose: ['plumoso', 'plumose'], petaloid: ['petaloide', 'petaloid'], discoid: ['discoide', 'discoid'], punctiform: ['puntiforme', 'punctiform'] };
    const c = S[k]; return c ? c[lang === 'en' ? 1 : 0] : k;
  }

  /* ---------------- default colours of the whorls (semantic) ---------------- */
  const WHORL_COLORS = {
    B: '#8a9a6a', E: '#7c8f3a', K: '#4f8f3a', C: '#d6457a', P: '#9a5cc6', A: '#e0a21b', G: '#2a7fb8',
    ovule: '#1d5a86', disc: '#9fb31c', hyp: '#b08a5a', corona: '#7a4fb0', axis: '#6d6d6d',
  };
  const NATURAL = { K: '#5a9a45', C: '#f2f0f5', P: '#f2f0f5', A: '#f0c21a', G: '#8fbf5a', E: '#6f9a3a' };
  function color(f, key, mode) {
    if (mode === 'whorl') return WHORL_COLORS[key] || '#888';
    return (f.colors && f.colors[key]) || NATURAL[key] || WHORL_COLORS[key] || '#888';
  }

  /* wrap normalize so that normalised objects are recognised */
  function N(src) {
    if (src && src.__n) return src;
    const f = normalize(src);
    Object.defineProperty(f, '__n', { value: true, enumerable: false });
    return f;
  }

  return {
    ORG, MANY_DRAW, WHORL_COLORS, count, cmin, cmax, ctyp, cstr, cadd, ceq, isMany,
    normalize: N, total, merosity, perianthType, androeciumType, gynoeciumType, gynSyncarpous,
    allConnate, anyConnate, adnate, describe, color, corollaName, W, COROLLA,
  };
})();
window.FM = FM;
