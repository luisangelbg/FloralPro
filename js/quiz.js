/* FloralPro — the engine of the self-assessment (Block 6).

   Questions come from the app's own material: the flowers of the family
   catalogue (Block 4) for the floral-formula challenges and the plates of the
   atlas (Block 3) for the vocabulary. Everything is drawn from a seeded random
   generator, so an exam (types, number, level, convention and seed) produces
   the same questions, in the same order and with the same options, on every
   computer — and the teacher's copy of the app can grade a student's answers
   again from the code of the certificate.

   Kinds of question:
   fwrite  see a flower (3D, diagram, section) and write its formula; the text is
           read by the app's formula reader and compared piece by piece (partial credit)
   fpick   see a flower and pick its formula among four
   fdiag   read a formula and pick its diagram among four
   fread   read a formula and answer one question about it
   tname   see a figure of the atlas and pick its name
   tdef    read a term and pick its definition
   tfig    read a term and pick the figure that shows it
   Wrong options are made by changing the right answer in one visible way
   (a count, a fusion, the ovary position…), never at random. */

const QUIZ = (function () {
  const TYPES = [
    { id: 'fwrite', grp: 'f', es: 'Escribe la fórmula', en: 'Write the formula' },
    { id: 'fpick', grp: 'f', es: 'Elige la fórmula', en: 'Pick the formula' },
    { id: 'fdiag', grp: 'f', es: 'Elige el diagrama', en: 'Pick the diagram' },
    { id: 'fread', grp: 'f', es: 'Lee la fórmula', en: 'Read the formula' },
    { id: 'tname', grp: 't', es: '¿Cómo se llama?', en: 'What is it called?' },
    { id: 'tdef', grp: 't', es: '¿Qué significa?', en: 'What does it mean?' },
    { id: 'tfig', grp: 't', es: '¿Cuál lo muestra?', en: 'Which one shows it?' },
    { id: 'gname', grp: 'g', es: '¿Qué parte es?', en: 'Which part is it?' },
    { id: 'ggroup', grp: 'g', es: '¿De qué grupo es?', en: 'Which group is it?' },
    { id: 'gflor', grp: 'g', es: '¿Flor o estróbilo?', en: 'Flower or strobilus?' },
  ];
  const LEVELS = [
    { id: 'basic', es: 'Básico', en: 'Basic' },
    { id: 'mid', es: 'Intermedio', en: 'Intermediate' },
    { id: 'adv', es: 'Avanzado', en: 'Advanced' },
  ];
  const LV = { basic: 0, mid: 1, adv: 2 };

  /* ---------------- seeded randomness ---------------- */
  function rng(seed) {
    let a = seed >>> 0;
    return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
  function shuffle(r, arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const newSeed = () => Math.floor(Math.random() * 2147483647) + 1;

  /* ---------------- the flowers ---------------- */
  const copy = m => JSON.parse(JSON.stringify(FM.normalize(m), (k, v) => v === Infinity ? '∞' : (k === 'key' ? undefined : v)));
  /* how hard a flower is to write: unequal groups, bundles, labels → advanced;
     adnation, unisexual flowers, staminodes, epicalyx, corona, hypanthium → intermediate */
  function levelOf(src) {
    const f = FM.normalize(src);
    const ws = FM.ORG.flatMap(k => f[k] ? f[k].w : []);
    if (ws.some(w => w.parts || w.fasc || w.label || w.connate === 'apical' || w.state === 'lost')) return 'adv';
    if (f.adn.length || f.sex !== 'bisexual' || ws.some(w => w.state === 'sterile') || f.E || f.corona || (f.hyp && f.hyp !== 'none')) return 'mid';
    return 'basic';
  }
  let POOL = null;
  function flowers() {
    if (POOL) return POOL;
    POOL = [];
    const seen = new Set();
    FAMILIES.forEach(fam => Fam.allFlowers(fam).forEach(x => {
      if (!x.m) return;
      const key = Formula.text(x.m, 'prenner', { bracts: true, ovules: true });
      if (seen.has(key)) return;
      seen.add(key);
      POOL.push({ m: x.m, fam: fam.id, sci: x.sp ? x.sp.sci : null, label: x.label || null, kind: x.kind, lvl: levelOf(x.m) });
    }));
    return POOL;
  }
  const flowersFor = level => flowers().filter(x => LV[x.lvl] <= LV[level]);

  /* ---------------- wrong answers: one visible change ---------------- */
  const MUT = {
    conn(c, r) {
      const ks = ['K', 'C', 'P', 'A'].filter(k => c[k]);
      if (!ks.length) return false;
      const k = pick(r, ks), o = c[k];
      if (o.w.length > 1 || o.connate) o.connate = !o.connate;
      else o.w[0].connate = !o.w[0].connate;
      return true;
    },
    count(c, r) {
      const ks = ['K', 'C', 'P', 'A'].filter(k => c[k] && !c[k].w[0].parts && !c[k].w[0].fasc && !Array.isArray(c[k].w[0].n));
      if (!ks.length) return false;
      const w = c[pick(r, ks)].w[0];
      if (w.n === '∞') w.n = pick(r, [5, 10]);
      else w.n = Math.max(1, w.n + (w.n > 2 && r() < 0.5 ? -1 : 1));
      return true;
    },
    pos(c, r) {
      if (!c.G) return false;
      c.G.pos = pick(r, ['superior', 'half', 'inferior'].filter(p => p !== c.G.pos));
      return true;
    },
    carp(c, r) {
      if (!c.G || c.G.w[0].parts || Array.isArray(c.G.w[0].n) || c.G.w[0].n === '∞') return false;
      const n = c.G.w[0].n;
      c.G.w[0].n = n <= 1 ? 3 : n + (r() < 0.5 ? -1 : 1);
      if (c.G.w[0].n > 1 && c.G.w[0].connate !== true && c.G.w[0].connate !== 'apical') c.G.w[0].connate = true;
      c.G.loc = null; c.G.plac = c.G.w[0].n === 1 ? 'marginal' : c.G.plac;
      if (c.G.plac === 'marginal' && c.G.w[0].n > 1 && c.G.w[0].connate === true) c.G.plac = 'axile';
      return true;
    },
    gyn(c) {
      if (!c.G || c.G.w[0].parts || c.G.w[0].n === 1) return false;
      c.G.w[0].connate = c.G.w[0].connate === true ? false : true;
      c.G.plac = c.G.w[0].connate ? (c.G.plac === 'marginal' ? 'axile' : c.G.plac) : 'marginal';
      c.G.loc = null;
      return true;
    },
    sym(c) {
      c.sym = /^zygo/.test(c.sym) ? 'actino' : 'zygo';
      return true;
    },
    adn(c) {
      if (c.adn && c.adn.length) { c.adn = []; return true; }
      const p = c.C ? 'C' : c.P ? 'P' : null;
      if (!p || !c.A) return false;
      c.adn = [[p, 'A']];
      return true;
    },
    per(c) {
      if (c.P && !c.K && !c.C && c.P.w.length >= 2) { c.K = { w: [c.P.w[0]] }; c.C = { w: c.P.w.slice(1) }; delete c.P; c.adn = (c.adn || []).map(g => g.map(k => k === 'P' ? 'C' : k)); return true; }
      if (c.K && c.C && !c.P && !c.E) { c.P = { w: [c.K.w[0]].concat(c.C.w), like: 'C' }; delete c.K; delete c.C; c.adn = (c.adn || []).map(g => g.map(k => k === 'C' ? 'P' : k)).map(g => g.filter(k => k !== 'K')).filter(g => g.length > 1); return true; }
      return false;
    },
  };
  const txt = (m, conv) => Formula.text(m, conv, {});
  /* the diagram as a comparable string (each drawing numbers its hatch pattern) */
  const dsig = m => Diagram.svg(m, { colors: 'natural' }).replace(/dgH\d+/g, 'dgH');
  /* n models that differ from m in one visible way, and from each other
     (in the diagram too, when sigf draws it) */
  function mutants(m, n, r, kinds, conv, sigf) {
    const out = [], seen = new Set([txt(m, conv)]), seen2 = new Set(sigf ? [sigf(m)] : []);
    for (let tries = 0; out.length < n && tries < 80; tries++) {
      const c = copy(m);
      if (!MUT[pick(r, kinds)](c, r)) continue;
      let t, s;
      try { t = txt(c, conv); FM.normalize(c); s = sigf ? sigf(c) : null; } catch (e) { continue; }
      if (seen.has(t) || (sigf && seen2.has(s))) continue;
      seen.add(t);
      if (sigf) seen2.add(s);
      out.push(c);
    }
    return out;
  }

  /* ---------------- questions about a formula ---------------- */
  const W = () => FM.W;
  function readKinds(f) {
    const k = ['sym', 'per'];
    if (f.G && FM.cmax(FM.total(f.G, { fertile: true }))) k.push('pos', 'nG', 'gyn');
    if (f.A && FM.cmax(FM.total(f.A, { fertile: true }))) k.push('nA');
    if (f.C || f.P) k.push('conC');
    if (f.A && (f.C || f.P)) k.push('epi');
    return k;
  }
  const numOpts = (r, right, pool) => {
    const others = shuffle(r, pool.filter(v => v !== right)).slice(0, 3);
    return shuffle(r, [right].concat(others));
  };
  const countKey = c => Array.isArray(c) ? FM.cstr(c) : (c === Infinity ? '∞' : String(c));
  function readQuestion(m, r) {
    const f = FM.normalize(m);
    const kind = pick(r, readKinds(f));
    const at = f.A ? FM.androeciumType(f) : null, gt = f.G ? FM.gynoeciumType(f) : null;
    let q, opts, right;
    switch (kind) {
      case 'sym':
        q = ['¿Qué simetría tiene esta flor?', 'What symmetry does this flower have?'];
        opts = [['actino', 'actinomorfa (radial)', 'actinomorphic (radial)'], ['zygo', 'zigomorfa (bilateral)', 'zygomorphic (bilateral)'], ['asym', 'asimétrica', 'asymmetric']];
        right = f.sym === 'asym' ? 'asym' : /^zygo/.test(f.sym) ? 'zygo' : 'actino';
        break;
      case 'per':
        q = ['¿Cómo es su perianto?', 'What is its perianth like?'];
        opts = [['hetero', 'cáliz y corola distintos', 'distinct calyx and corolla'], ['homo', 'perigonio de tépalos', 'a perigon of tepals'], ['mono', 'un solo verticilo', 'a single whorl'], ['none', 'no tiene perianto', 'no perianth']];
        right = FM.perianthType(f);
        break;
      case 'pos':
        q = ['¿Cómo es el ovario?', 'What is the ovary like?'];
        opts = [['superior', 'súpero', 'superior'], ['half', 'semiínfero', 'half-inferior'], ['inferior', 'ínfero', 'inferior']];
        right = f.G.pos;
        break;
      case 'gyn':
        q = ['¿Cómo son sus carpelos?', 'What are its carpels like?'];
        opts = [['mono', 'uno solo', 'a single one'], ['syn', 'varios, unidos (sincárpico)', 'several, united (syncarpous)'], ['apo', 'varios, libres (apocárpico)', 'several, free (apocarpous)'], ['semi', 'libres, con los estilos unidos', 'free, with united styles']];
        right = gt.type;
        break;
      case 'nG': {
        q = ['¿Cuántos carpelos tiene?', 'How many carpels does it have?'];
        right = countKey(gt.carpels);
        opts = numOpts(r, right, ['1', '2', '3', '4', '5', '∞', '2–3', '3–5']).map(v => [v, v === '∞' ? 'muchos (∞)' : v, v === '∞' ? 'many (∞)' : v]);
        break;
      }
      case 'nA': {
        q = ['¿Cuántos estambres fértiles tiene?', 'How many fertile stamens does it have?'];
        right = countKey(FM.total(f.A, { fertile: true }));
        opts = numOpts(r, right, ['1', '2', '3', '4', '5', '6', '8', '10', '∞']).map(v => [v, v === '∞' ? 'muchos (∞)' : v, v === '∞' ? 'many (∞)' : v]);
        break;
      }
      case 'conC': {
        const showy = f.C || f.P;
        q = f.C ? ['¿Cómo son sus pétalos?', 'What are its petals like?'] : ['¿Cómo son sus tépalos?', 'What are its tepals like?'];
        opts = [['uni', 'unidos entre sí', 'united with each other'], ['lib', 'libres entre sí', 'free from each other']];
        right = FM.allConnate(showy) ? 'uni' : 'lib';
        break;
      }
      case 'epi':
        q = ['¿Los estambres están soldados a la corola o a los tépalos?', 'Are the stamens fused to the corolla or tepals?'];
        opts = [['si', 'sí', 'yes'], ['no', 'no', 'no']];
        right = at.epi ? 'si' : 'no';
        break;
    }
    if (kind === 'sym' || kind === 'per' || kind === 'pos' || kind === 'gyn' || kind === 'conC' || kind === 'epi') opts = shuffle(r, opts);
    return { q, opts: opts.map(o => ({ key: o[0], es: o[1], en: o[2] })), correct: opts.findIndex(o => o[0] === right), kind };
  }

  /* ---------------- the atlas ---------------- */
  const figsOf = p => (Array.isArray(p.fig) ? p.fig : [p.fig]).filter(Boolean);
  /* figures that do not write the answer in them (drawings with labels are left out) */
  const cleanFig = p => (p.qfig != null ? figsOf(p)[p.qfig] : null) || figsOf(p).find(f => f.t !== 'art') || null;
  /* a wrong option must not be right too: the flower of one plate may also show what
     another names (the bean of «marginal» is also «monocarpellate», the bean of
     «papilionaceous» is also «zygomorphic»), and two plates may share the same drawing */
  const TERMS = new Map(), FSIG = new Map();
  function termsOf(p) {
    if (!TERMS.has(p)) {
      const s = new Set();
      try { FM.describe(B3.resolve(p.m), 'es').forEach(x => x.html.replace(/data-term="([^"]+)"/g, (a, k) => s.add(k))); } catch (e) { /* plates without a model */ }
      TERMS.set(p, s);
    }
    return TERMS.get(p);
  }
  function shows(fp, cp) {
    if (cp.need) return termsOf(fp).has(cp.need);
    if (cp.check) { try { return !!cp.check(FM.normalize(B3.resolve(fp.m))); } catch (e) { return false; } }
    return false;
  }
  const clash = (a, b) => shows(a, b) || shows(b, a);
  function figSig(p) {
    if (!FSIG.has(p)) { const f = cleanFig(p); let s = null; try { s = f ? B3.figSVG(p, f).replace(/dgH\d+/g, 'H') : null; } catch (e) { s = null; } FSIG.set(p, s); }
    return FSIG.get(p);
  }
  function plateOptions(r, p, pool, level) {
    const fine = x => x !== p && !clash(x, p) && (!figSig(p) || figSig(x) !== figSig(p));
    const same = pool.filter(x => fine(x) && x.sec === p.sec), other = pool.filter(x => fine(x) && x.sec !== p.sec);
    let src = level === 'adv' ? same : level === 'basic' ? other : pool.filter(fine);
    if (src.length < 3) src = pool.filter(fine);
    const out = shuffle(r, src).filter((x, i, a) => a.findIndex(y => y.t[0] === x.t[0]) === i).slice(0, 3);
    return shuffle(r, [p].concat(out));
  }

  /* ---------------- gymnosperms (Block 7) ---------------- */
  /* the strobili a level uses: ripe seed structures first; then young ones and the
     pollen cones of conifers; at the advanced level every pollen structure */
  function strobiliFor(level) {
    const out = [];
    GYMNO.STROBILI.forEach(s => {
      if (s.sex === 'f') { out.push({ s, stage: 'mat' }); if (LV[level] >= 1) out.push({ s, stage: 'pol' }); }
      else if (LV[level] >= 2 || (LV[level] >= 1 && s.unit === 'misp')) out.push({ s, stage: 'mat' });
    });
    return out;
  }
  /* parts whose names overlap: never offered as the wrong answer for one another */
  const CONFUSE = { bscale: ['bract', 'scale'], bract: ['bscale'], scale: ['bscale'], ov: ['seed', 'sarc'], seed: ['ov', 'sarc'], sarc: ['ov', 'seed'], spor: ['syn'], syn: ['spor'], axis: ['ped', 'stem'], ped: ['axis', 'stem'], stem: ['axis', 'ped'], epim: ['rec'], rec: ['epim'] };
  const BASIC_ORG = ['axis', 'bract', 'scale', 'bscale', 'mgsp', 'ov', 'seed', 'wing', 'misp', 'spor', 'sarc', 'aril'];
  function gymQuestion(type, r, level) {
    const pool = strobiliFor(level);
    if (type === 'gname') {
      for (let k = 0; k < 30; k++) {
        const x = pick(r, pool);
        const svg = ConeFig.section(x.s, { stage: x.stage, labels: false });
        const present = CM.organs(x.s, x.stage).filter(o => svg.includes(`data-org="${o}"`) && (LV[level] >= 1 || BASIC_ORG.includes(o)));
        if (!present.length) continue;
        const org = pick(r, present), bad = new Set([org].concat(CONFUSE[org] || []));
        const near = shuffle(r, present.filter(o => !bad.has(o)));
        const far = shuffle(r, Object.keys(GYMNO.ORG).filter(o => o !== 'leaf' && !bad.has(o) && !present.includes(o)));
        const opts = shuffle(r, [org].concat(near.concat(far).slice(0, 3)));
        return { strob: x.s.id, stage: x.stage, org, opts: opts.map(o => ({ org: o })), correct: opts.indexOf(org) };
      }
    }
    if (type === 'ggroup') {
      const x = pick(r, pool), g = GYMNO.exById(x.s.ex).grp, lin = GYMNO.grpById(g).lin;
      let others = shuffle(r, GYMNO.GROUPS.map(G => G.id).filter(id => id !== g));
      /* at the advanced level the wrong answers come from the same lineage first */
      if (LV[level] >= 2) others = others.filter(id => GYMNO.grpById(id).lin === lin).concat(others.filter(id => GYMNO.grpById(id).lin !== lin));
      const opts = shuffle(r, [g].concat(others.slice(0, 3)));
      return { strob: x.s.id, stage: x.stage, grp: g, opts: opts.map(id => ({ grp: id })), correct: opts.indexOf(g) };
    }
    /* gflor: a picture (a flower or a gymnosperm structure) or a statement */
    if (r() < 0.5) {
      const T = GYMNO.TRAITS, i = Math.floor(r() * T.length);
      const keys = ['ang', 'gym', 'both'];
      return { kind: 'stmt', trait: i, opts: keys.map(k => ({ key: k })), correct: keys.indexOf(T[i].who) };
    }
    const keys = ['flower', 'strob'];
    if (r() < 0.5) {
      const x = pick(r, flowers());
      return { kind: 'img', flower: x, opts: keys.map(k => ({ key: k })), correct: 0 };
    }
    const x = pick(r, strobiliFor('adv'));
    return { kind: 'img', strob: x.s.id, stage: x.stage, opts: keys.map(k => ({ key: k })), correct: 1 };
  }

  /* ---------------- building a set of questions ---------------- */
  function generate(cfg) {
    const r = rng(cfg.seed);
    const types = cfg.types.filter(t => TYPES.some(x => x.id === t));
    const order = [];
    while (order.length < cfg.n) shuffle(r, types).forEach(t => { if (order.length < cfg.n) order.push(t); });
    const fl = shuffle(r, flowersFor(cfg.level));
    const plates = ATLAS.PLATES;
    const withFig = shuffle(r, plates.filter(cleanFig));
    const anyPlate = shuffle(r, plates.slice());
    let fi = 0, pi = 0, ai = 0;
    const nextFlower = () => fl[fi++ % fl.length];
    return order.map((type, i) => {
      const q = { i, type };
      if (TYPES.find(t => t.id === type).grp === 'f') {
        let x = nextFlower(), wrong = null;
        if (type === 'fpick' || type === 'fdiag') {
          /* the three wrong answers must look different (in the diagram too); flowers
             that do not allow it (a few ♂ flowers) give their turn to the next one */
          const kinds = type === 'fdiag' ? ['conn', 'count', 'pos', 'carp', 'per', 'gyn'] : ['conn', 'count', 'pos', 'carp', 'per', 'gyn', 'sym', 'adn'];
          for (let k = 0; k < 30; k++) {
            wrong = mutants(x.m, 3, r, kinds, cfg.conv, type === 'fdiag' ? dsig : null);
            if (wrong.length === 3) break;
            x = nextFlower();
          }
        }
        q.flower = x;
        if (type === 'fwrite') q.target = x.m;
        if (type === 'fpick' || type === 'fdiag') {
          const opts = shuffle(r, [{ m: x.m, ok: true }].concat(wrong.map(m => ({ m }))));
          q.opts = opts.map(o => ({ m: o.m }));
          q.correct = opts.findIndex(o => o.ok);
        }
        if (type === 'fread') Object.assign(q, readQuestion(x.m, r));
      } else if (TYPES.find(t => t.id === type).grp === 'g') {
        Object.assign(q, gymQuestion(type, r, cfg.level));
      } else {
        const p = type === 'tdef' ? anyPlate[ai++ % anyPlate.length] : withFig[pi++ % withFig.length];
        q.plate = p;
        const pool = type === 'tdef' ? plates : plates.filter(cleanFig);
        const opts = plateOptions(r, p, pool, cfg.level);
        q.opts = opts.map(o => ({ plate: o }));
        q.correct = opts.indexOf(p);
      }
      return q;
    });
  }

  /* ---------------- grading ---------------- */
  const N = x => FM.normalize(x);
  const org = (f, k) => f[k];
  const names = {
    E: ['Epicáliz', 'Epicalyx'], K: ['Cáliz', 'Calyx'], C: ['Corola', 'Corolla'], P: ['Perigonio', 'Perigon'], A: ['Androceo', 'Androecium'], G: ['Gineceo', 'Gynoecium'],
  };
  const whorlsOf = o => o.w.filter(w => w.state !== 'lost').map(w => FM.cstr(w.n)).join('+');
  const partsOf = o => o.w.map(w => w.parts ? w.parts.map(p => FM.cstr(p.n) + (p.connate ? 'u' : '') + (p.state !== 'fertile' ? p.state[0] : '')).join(':') : FM.cstr(w.n) + (w.state !== 'fertile' ? w.state[0] : '')).join('+');
  const adnSig = f => f.adn.map(g => g.join('')).sort().join(',') || '—';
  const symOf = s => s === 'asym' ? 'asym' : /^zygo/.test(s) ? 'zygo' : 'actino';
  /* compares the flower written by the student with the right one, piece by piece */
  function compare(tsrc, asrc, level) {
    const t = N(tsrc), a = N(asrc), L = LV[level];
    const out = [];
    const W = FM.W;
    const add = (ok, what, right, yours) => out.push({ ok: !!ok, what, right, yours });
    add(symOf(t.sym) === symOf(a.sym), ['Simetría', 'Symmetry'], [W.sym.es[symOf(t.sym)], W.sym.en[symOf(t.sym)]], [W.sym.es[symOf(a.sym)], W.sym.en[symOf(a.sym)]]);
    if (L >= 1 && (t.sex !== 'bisexual' || a.sex !== 'bisexual')) add(t.sex === a.sex, ['Sexo de la flor', 'Sex of the flower'], [W.sex.es[t.sex], W.sex.en[t.sex]], [W.sex.es[a.sex], W.sex.en[a.sex]]);
    for (const k of FM.ORG) {
      const to = org(t, k), ao = org(a, k);
      if (!to && !ao) continue;
      const nm = names[k];
      if (!to) { add(false, nm, ['no hay', 'none'], ['lo escribiste', 'you wrote one']); continue; }
      if (!ao) {
        add(false, [nm[0] + ': número', nm[1] + ': number'], [FM.cstr(FM.total(to, { visible: true })), FM.cstr(FM.total(to, { visible: true }))], ['falta', 'missing']);
        if (k !== 'G') add(false, [nm[0] + ': fusión', nm[1] + ': fusion'], FM.allConnate(to) ? ['unidos', 'united'] : ['libres', 'free'], ['falta', 'missing']);
        continue;
      }
      const tn = FM.total(to, { visible: true }), an = FM.total(ao, { visible: true });
      add(FM.ceq(tn, an), [nm[0] + ': número de piezas', nm[1] + ': number of members'], [FM.cstr(tn), FM.cstr(tn)], [FM.cstr(an), FM.cstr(an)]);
      if (k !== 'G') {
        const tc = FM.allConnate(to), ac = FM.allConnate(ao);
        add(tc === ac, [nm[0] + ': fusión', nm[1] + ': fusion'], tc ? ['unidas entre sí', 'united'] : ['libres entre sí', 'free'], ac ? ['unidas entre sí', 'united'] : ['libres entre sí', 'free']);
      }
      if (L >= 1 && k !== 'G') add(whorlsOf(to) === whorlsOf(ao), [nm[0] + ': verticilos', nm[1] + ': whorls'], [whorlsOf(to), whorlsOf(to)], [whorlsOf(ao), whorlsOf(ao)]);
      if (L >= 1 && k === 'A') {
        const tf = FM.total(to, { fertile: true }), af = FM.total(ao, { fertile: true });
        if (!FM.ceq(tf, tn) || !FM.ceq(af, an)) add(FM.ceq(tf, af), ['Estambres fértiles (sin estaminodios)', 'Fertile stamens (without staminodes)'], [FM.cstr(tf), FM.cstr(tf)], [FM.cstr(af), FM.cstr(af)]);
      }
      if (L >= 2 && k !== 'G' && partsOf(to) !== whorlsOf(to).replace(/\+/g, '+')) add(partsOf(to) === partsOf(ao), [nm[0] + ': piezas desiguales', nm[1] + ': unequal members'], [partsOf(to), partsOf(to)], [partsOf(ao), partsOf(ao)]);
    }
    if (t.G && a.G) {
      const tg = FM.gynoeciumType(t), ag = FM.gynoeciumType(a);
      const GY = { mono: ['un carpelo', 'one carpel'], syn: ['carpelos unidos', 'united carpels'], apo: ['carpelos libres', 'free carpels'], semi: ['ovarios libres, estilos unidos', 'free ovaries, united styles'] };
      add(tg.type === ag.type, ['Gineceo: carpelos libres o unidos', 'Gynoecium: free or united carpels'], GY[tg.type], GY[ag.type]);
      add(t.G.pos === a.G.pos, ['Posición del ovario', 'Ovary position'], [W.pos.es[t.G.pos], W.pos.en[t.G.pos]], [W.pos.es[a.G.pos], W.pos.en[a.G.pos]]);
    }
    if (L >= 1) add(adnSig(t) === adnSig(a), ['Piezas soldadas entre verticilos (adnación)', 'Members fused across whorls (adnation)'], [adnSig(t), adnSig(t)], [adnSig(a), adnSig(a)]);
    const score = out.length ? out.filter(x => x.ok).length / out.length : 0;
    return { checks: out, score };
  }
  /* the right flower as the chosen convention can write it: the classic formula has
     no way to say "one petal larger" or "a banner and two wings", so what it cannot
     write is not asked for (it is exactly the formula shown as correct) */
  const EXP = { classic: new WeakMap(), prenner: new WeakMap() };
  function expected(m, conv) {
    if (!EXP[conv]) return m;
    if (!EXP[conv].has(m)) {
      let e = m;
      try { e = Formula.parse(Formula.text(m, conv, {})).model; } catch (err) { e = m; }
      EXP[conv].set(m, e);
    }
    return EXP[conv].get(m);
  }
  /* the score of one answer (0 to 1) and what it means */
  function grade(q, ans, cfg) {
    if (ans == null || ans === '') return { score: 0, empty: true };
    if (q.type === 'fwrite') {
      let parsed;
      try { parsed = Formula.parse(String(ans)); } catch (e) { return { score: 0, error: e.message }; }
      const c = compare(expected(q.target, cfg.conv), parsed.model, cfg.level);
      return { score: c.score, checks: c.checks, warnings: parsed.warnings, model: parsed.model };
    }
    return { score: +ans === q.correct ? 1 : 0 };
  }
  const total = (qs, answers, cfg) => qs.reduce((s, q, i) => s + grade(q, answers[i], cfg).score, 0);

  /* ---------------- codes: the exam and the certificate ---------------- */
  function b64(s) {
    const bytes = new TextEncoder().encode(s);
    let bin = ''; bytes.forEach(b => { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function unb64(s) {
    const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4));
    return new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0)));
  }
  function fnv(s) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(16).padStart(8, '0'); }
  /* what the questions depend on: the way they are drawn (GEN, to be raised whenever the
     generator or the grader change), the catalogue and the atlas; old exams are flagged */
  const GEN = 1;
  const dataVersion = () => `g${GEN}.${FAMILIES.length}.${flowers().length}.${ATLAS.PLATES.length}.${window.GYMNO ? GYMNO.STROBILI.length + "." + GYMNO.TRAITS.length : 0}`;
  const cfgKeys = c => ({ title: c.title || '', types: c.types, n: c.n, level: c.level, conv: c.conv, time: c.time || 0, reveal: c.reveal || 'full', seed: c.seed, dv: c.dv || dataVersion() });
  const examId = cfg => fnv(JSON.stringify(cfgKeys(cfg))).slice(0, 6).toUpperCase();
  function examCode(cfg) { const p = b64(JSON.stringify(cfgKeys(cfg))); return 'FPX.' + p + '.' + fnv('x' + p); }
  function readExam(code) {
    const m = /FPX\.([A-Za-z0-9_-]+)\.([0-9a-f]{8})/.exec(String(code || ''));
    if (!m || fnv('x' + m[1]) !== m[2]) return null;
    try { return JSON.parse(unb64(m[1])); } catch (e) { return null; }
  }
  function resultCode(res) {
    const p = b64(JSON.stringify(res));
    return 'FP6.' + p + '.' + fnv('r' + p);
  }
  /* reads a certificate code and grades it again from its answers */
  function verify(code) {
    const m = /FP6\.([A-Za-z0-9_-]+)\.([0-9a-f]{8})/.exec(String(code || ''));
    if (!m) return { ok: false, why: 'format' };
    let res;
    try { res = JSON.parse(unb64(m[1])); } catch (e) { return { ok: false, why: 'format' }; }
    const intact = fnv('r' + m[1]) === m[2];
    const qs = generate(res.cfg);
    const pts = total(qs, res.ans || [], res.cfg);
    const pct = Math.round(1000 * pts / qs.length) / 10;
    return { ok: intact && Math.abs(pct - res.pct) < 0.11 && res.cfg.dv === dataVersion(), intact, res, pct, claimed: res.pct, sameData: res.cfg.dv === dataVersion(), id: examId(res.cfg), code: m[0] };
  }

  return { TYPES, LEVELS, rng, shuffle, newSeed, flowers, flowersFor, levelOf, mutants, readQuestion, generate, compare, grade, total, examId, examCode, readExam, resultCode, verify, dataVersion, cleanFig, clash, figSig };
})();
window.QUIZ = QUIZ;
