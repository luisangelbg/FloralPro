/* FloralPro — the engine of the interactive key (Block 5).

   The matrix has one row per kind of flower of each family: its typical
   flowers, its variants and the flowers of its species (identical rows are
   merged). Floral characters are read from that flower model, so the states
   of one flower stay together (Buddleja is actinomorphic AND tetramerous; the
   rest of its family is zygomorphic AND pentamerous). The plant, inflorescence
   and fruit come from KEYVEG for the whole family (KEYROW when a kind of flower
   of the family differs), and KEYFIX adds
   floral states known in a family but not modelled.

   Multi-access key: a family stays while one of its rows agrees with what was
   ticked; an unticked character excludes nothing, and a row without data for a
   character is not excluded by it. A tolerance lets one or two mismatches pass.
   The most useful next character is the one whose answer leaves, on average,
   the fewest families.

   Dichotomous key: built from the rows by choosing at each step the character
   and the grouping of its states that split them most evenly, preferring easy
   characters; a row with states on both sides goes down both, and a family
   with several kinds of flower may key out in more than one place, as in
   printed keys. */

const KEY = (function () {
  const CH = id => KEYCHARS.find(c => c.id === id);
  const FLORAL = new Set(['flor', 'per', 'and', 'gin']);

  /* ---------------- floral states of one flower ---------------- */
  function flowerStates(src) {
    const f = FM.normalize(src);
    const out = {};
    const put = (c, s) => { (out[c] = out[c] || new Set()).add(s); };
    const range = (v, classes, c) => { const lo = FM.cmin(v), hi = FM.cmax(v); classes.forEach(([s, a, b]) => { if (lo <= b && hi >= a) put(c, s); }); };
    put('sym', f.sym === 'asym' ? 'asi' : /^zygo/.test(f.sym) ? 'zyg' : 'act');
    put('sex', f.sex === 'bisexual' ? 'bis' : 'uni');
    const mer = FM.merosity(f);
    if (mer) put('mer', [3, 4, 5].includes(mer) ? String(mer) : 'x');
    put('per', { hetero: 'cc', homo: 'tep', mono: 'uno', none: 'no' }[FM.perianthType(f)]);
    const showy = f.C || f.P;
    if (showy) put('conC', FM.allConnate(showy) ? 'uni' : 'lib');
    if (f.K && f.C && !f.K.w.some(w => w.label)) put('conK', FM.allConnate(f.K) ? 'uni' : 'lib');
    /* androecium, from flowers with working stamens */
    const nF = f.A ? FM.total(f.A, { fertile: true }) : 0;
    if (f.A && FM.cmax(nF) > 0) {
      range(nF, [['a', 1, 2], ['b', 3, 4], ['c', 5, 5], ['d', 6, 10], ['e', 11, Infinity]], 'nA');
      const at = FM.androeciumType(f);
      const rel = { iso: 'igual', antepet: 'ant', diplo: 'doble', obdiplo: 'doble', dbl: 'doble', poly: 'mas', oligo: 'menos' }[at.rel];
      if (rel) put('relA', rel);
      else if (at.rel === 'aniso') {
        const ref = f.C ? f.C : f.P ? { w: [f.P.w[f.P.w.length - 1]] } : null;
        const nP = ref ? FM.total(ref) : 0;
        if (nP && isFinite(FM.cmax(nP))) put('relA', FM.cmin(at.total) > FM.cmax(nP) ? (FM.cmin(at.total) > 2 * FM.cmax(nP) ? 'mas' : 'doble') : 'menos');
      }
      if (f.C || f.P) put('epi', at.epi ? 'si' : 'no');
      if (at.fusion === 'free') put('fus', 'lib');
      else if (at.fusion === 'syn') put('fus', 'ant');
      else if (at.fusion === 'synmono') { put('fus', 'ant'); put('fus', 'fil'); }
      else put('fus', 'fil');
    }
    /* gynoecium, from flowers with a working one */
    if (f.G && FM.cmax(FM.total(f.G, { fertile: true })) > 0) {
      const gt = FM.gynoeciumType(f);
      put('carp', gt.type === 'mono' ? 'uno' : gt.type === 'syn' ? 'uni' : 'lib');
      range(gt.carpels, [['1', 1, 1], ['2', 2, 2], ['3', 3, 3], ['45', 4, 5], ['m', 6, Infinity]], 'nG');
      put('pos', { superior: 'sup', half: 'semi', inferior: 'inf' }[f.G.pos]);
      put('plac', { axile: 'axi', parietal: 'par', freecentral: 'cen', basal: 'bas', apical: 'api', marginal: 'mar', laminar: 'lam' }[f.G.plac]);
      if (f.G.ov != null) range(f.G.ov, [['1', 1, 1], ['p', 2, 10], ['m', 11, Infinity]], 'ovn');
      put('sty', { terminal: 'ter', gynobasic: 'gin', lateral: 'lat' }[f.G.style] || 'ter');
    }
    const sp = [];
    if (f.corona) sp.push('cor');
    if (f.E) sp.push('epi');
    if (f.hyp && f.hyp !== 'none') sp.push('hip');
    (sp.length ? sp : ['nin']).forEach(s => put('esp', s));
    if (f.disc) put('dis', f.disc === 'extra' ? 'ext' : 'int');
    return out;
  }

  /* ---------------- rows and families ---------------- */
  const split = v => new Set(String(v).split(/\s+/).filter(Boolean));
  function plantStates(fam) {
    const o = Object.assign({}, KEYVEG_DEFAULT, KEYVEG[fam.id] || {});
    const st = {};
    for (const c in o) st[c] = split(o[c]);
    return st;
  }
  let ROWS = null, FAMST = null;
  function rows() {
    if (ROWS) return ROWS;
    ROWS = [];
    FAMILIES.forEach(fam => {
      const plant = plantStates(fam), fix = KEYFIX[fam.id] || {}, rowFix = KEYROW[fam.id] || {};
      const seen = new Set();
      const perFlower = Fam.allFlowers(fam).filter(x => x.m).map(x => {
        const st = Object.assign({}, plant);
        /* plant characters of this kind of flower, when they differ within the family */
        const base = x.kind === 'species' && x.sp.m && typeof x.sp.m === 'object' && x.sp.m.base ? (x.sp.m.base.includes(':') ? x.sp.m.base : x.sp.m.base + ':0') : null;
        const own = rowFix[x.kind === 'species' ? 'sp:' + x.sp.sci : x.kind + ':' + x.i] || (base && rowFix[base]) || {};
        for (const c in own) st[c] = split(own[c]);
        const fl = flowerStates(x.m);
        for (const c in fl) st[c] = fl[c];
        for (const c in fix) st[c] = new Set([...(st[c] || []), ...split(fix[c])]);
        return { x, st, uni: FM.normalize(x.m).sex !== 'bisexual', group: x.kind === 'species' ? 'sp' + x.si : x.kind };
      });
      /* the staminate and pistillate flowers of one plant (the typical ones, the variants,
         or one species) make one row: the stamens come from one and the ovary from the
         other, as a student sees them on the same plant */
      const rowsHere = [];
      perFlower.forEach(p => {
        const mate = p.uni && rowsHere.find(r => r.uni && r.group === p.group);
        if (!mate) { rowsHere.push({ x: p.x, st: p.st, uni: p.uni, group: p.group }); return; }
        for (const c in p.st) mate.st[c] = new Set([...(mate.st[c] || []), ...p.st[c]]);
      });
      rowsHere.forEach(p => {
        const sig = Object.keys(p.st).sort().map(c => c + ':' + [...p.st[c]].sort().join(',')).join('|');
        if (seen.has(sig)) return;
        seen.add(sig);
        ROWS.push({ id: fam.id + '#' + seen.size, fam, flower: p.x, st: p.st });
      });
    });
    return ROWS;
  }
  let BYFAM = null;
  function rowsOf(famId) {
    if (!BYFAM) { BYFAM = new Map(); rows().forEach(r => { if (!BYFAM.has(r.fam.id)) BYFAM.set(r.fam.id, []); BYFAM.get(r.fam.id).push(r); }); }
    return BYFAM.get(famId) || [];
  }
  /* all the states a family shows (the union of its rows) */
  function familyStates(fam) {
    if (!FAMST) FAMST = new Map();
    if (!FAMST.has(fam.id)) {
      const st = {};
      rowsOf(fam.id).forEach(r => { for (const c in r.st) { st[c] = st[c] || new Set(); r.st[c].forEach(s => st[c].add(s)); } });
      FAMST.set(fam.id, st);
    }
    return FAMST.get(fam.id);
  }
  function matrix() { const m = new Map(); FAMILIES.forEach(f => m.set(f.id, familyStates(f))); return m; }
  const statesOf = (famId, c) => familyStates(Fam.byId(famId))[c] || null;

  /* ---------------- multi-access key ---------------- */
  const rowMiss = (r, sel) => Object.keys(sel).filter(c => r.st[c] && r.st[c].size && !r.st[c].has(sel[c]));
  /* sel: {charId: state}; every family with the mismatches of its best row, best first */
  function score(sel, fams) {
    return (fams || FAMILIES).map(f => {
      let best = null;
      rowsOf(f.id).forEach(r => { const m = rowMiss(r, sel); if (!best || m.length < best.length) best = m; });
      return { fam: f, miss: best || [] };
    }).sort((a, b) => a.miss.length - b.miss.length || FAMILIES.indexOf(a.fam) - FAMILIES.indexOf(b.fam));
  }
  const remaining = (sel, tol, fams) => score(sel, fams).filter(x => x.miss.length <= (tol || 0));
  /* how many of the families could show each state of a character */
  function counts(c, fams) {
    const out = {};
    CH(c).st.forEach(([s]) => { out[s] = 0; });
    let unknown = 0;
    fams.forEach(f => { const s = familyStates(f)[c]; if (!s || !s.size) unknown++; else s.forEach(x => { if (x in out) out[x]++; }); });
    return { by: out, unknown };
  }
  /* how many families would remain if each state of c were chosen (on top of what is ticked) */
  function ifChosen(c, sel, tol, fams) {
    const out = {};
    CH(c).st.forEach(([s]) => { out[s] = remaining(Object.assign({}, sel, { [c]: s }), tol, fams).length; });
    return out;
  }
  /* expected number of families left after answering c (lower is better), weighted by how easy c is */
  function usefulness(c, sel, tol, fams) {
    const n = remaining(sel, tol, fams).length;
    if (n < 2) return null;
    const vals = Object.values(ifChosen(c, sel, tol, fams)).filter(v => v > 0);
    if (vals.length < 2) return null;
    const tot = vals.reduce((a, b) => a + b, 0);
    const exp = vals.reduce((a, v) => a + v * v, 0) / tot;
    if (exp >= n - 1e-9) return null;
    return { c, exp, score: exp * (1 + 0.15 * (CH(c).ease - 1)) };
  }
  function suggest(sel, fams, k, floralOnly, tol) {
    return KEYCHARS.filter(c => !(c.id in sel) && c.multi !== false && (!floralOnly || FLORAL.has(c.grp)))
      .map(c => usefulness(c.id, sel, tol || 0, fams)).filter(Boolean)
      .sort((a, b) => a.score - b.score).slice(0, k || 3);
  }
  /* the characters that tell apart a small set of families */
  function differences(fams, floralOnly) {
    return KEYCHARS.filter(c => !floralOnly || FLORAL.has(c.grp)).map(c => {
      const per = fams.map(f => familyStates(f)[c.id] || new Set());
      if (per.some(s => !s.size)) return null;
      const all = new Set(); per.forEach(s => s.forEach(x => all.add(x)));
      if (all.size < 2) return null;
      const sep = per.some((a, i) => per.some((b, j) => j > i && ![...a].some(x => b.has(x))));
      return sep ? { c: c.id, per } : null;
    }).filter(Boolean);
  }
  /* the observation that a flower model gives, for "identify this flower" */
  function fromModel(m) {
    const st = flowerStates(m), sel = {};
    for (const c in st) if (st[c].size === 1) sel[c] = [...st[c]][0];
    return sel;
  }

  /* ---------------- dichotomous key ---------------- */
  function subsets(arr) {
    /* every split of the states into two groups (each split once) */
    const out = [], n = arr.length;
    for (let mask = 1; mask < (1 << (n - 1)); mask++) {
      const a = [], b = [];
      arr.forEach((s, i) => ((mask >> i) & 1 ? a : b).push(s));
      out.push([a, b]);
    }
    return out;
  }
  const famsOf = set => [...new Set(set.map(r => r.fam.id))];
  function build(fams, opts) {
    opts = Object.assign({ floralOnly: false }, opts || {});
    const ids = new Set(fams.map(f => f.id));
    const chars = KEYCHARS.filter(c => !opts.floralOnly || FLORAL.has(c.grp));
    function node(set, depth) {
      const fs = famsOf(set);
      if (fs.length <= 1 || depth > 40) return { leaf: fs, rows: set };
      let best = null;
      for (const c of chars) {
        const per = set.map(r => r.st[c.id]);
        if (per.some(s => !s || !s.size)) continue;            /* a row without data cannot be placed */
        const present = c.st.map(x => x[0]).filter(s => per.some(p => p.has(s)));
        if (present.length < 2 || present.length > 9) continue;
        for (const [A, B] of subsets(present)) {
          const L = set.filter((r, i) => A.some(s => per[i].has(s)));
          const R = set.filter((r, i) => B.some(s => per[i].has(s)));
          if (!L.length || !R.length || L.length === set.length || R.length === set.length) continue;
          const fl = famsOf(L).length, fr = famsOf(R).length;
          const dup = fl + fr - fs.length;
          const sc = Math.max(fl, fr) + 1.6 * dup + 0.6 * (c.ease - 1) + 0.05 * (A.length + B.length);
          if (!best || sc < best.sc) best = { sc, c: c.id, A, B, L, R };
        }
      }
      if (!best) return { leaf: fs, rows: set };
      const cp = { n: 0, c: best.c, a: best.A, b: best.B, fams: fs };
      cp.left = node(best.L, depth + 1);
      cp.right = node(best.R, depth + 1);
      return cp;
    }
    const root = node(rows().filter(r => ids.has(r.fam.id)), 0);
    /* number the couplets in the order a reader meets them (depth first, lead a first) */
    let k = 0;
    const order = [];
    (function num(x) { if (x.leaf) return; x.n = ++k; order.push(x); num(x.left); num(x.right); })(root);
    const leaves = root.leaf ? [root] : order.flatMap(c => [c.left, c.right]).filter(x => x.leaf);
    return { root, couplets: order, leaves };
  }
  /* the leads a reader takes to reach a family (the shortest path) */
  function pathTo(tree, famId) {
    let best = null;
    const path = [];
    (function walk(x) {
      if (x.leaf) { if (x.leaf.includes(famId) && (!best || path.length < best.length)) best = path.slice(); return; }
      for (const side of ['left', 'right']) { path.push({ cp: x, side }); walk(x[side]); path.pop(); }
    })(tree.root);
    return best || [];
  }
  /* walk the key with some states: at each couplet go where they fit (lead a first) */
  function follow(tree, states) {
    let x = tree.root;
    const seen = [];
    while (!x.leaf) {
      const s = states[x.c];
      const inA = s && x.a.some(v => s.has(v)), inB = s && x.b.some(v => s.has(v));
      seen.push(x);
      x = inA ? x.left : inB ? x.right : null;
      if (!x) return { leaf: null, seen };
    }
    return { leaf: x.leaf, seen };
  }
  /* every leaf a row can reach (a row with states on both sides goes down both) */
  function reach(tree, states) {
    const out = new Set();
    (function walk(x) {
      if (x.leaf) { x.leaf.forEach(f => out.add(f)); return; }
      const s = states[x.c];
      if (!s || x.a.some(v => s.has(v))) walk(x.left);
      if (!s || x.b.some(v => s.has(v))) walk(x.right);
    })(tree.root);
    return out;
  }
  /* text of one lead: "Posición del ovario: ínfero" */
  function leadText(c, states, lang) {
    const ch = CH(c), li = lang === 'en' ? 2 : 1;
    /* long explanations in brackets are left out of the key; short technical terms stay: "radial (actinomorfa)" */
    const words = states.map(s => ch.st.find(x => x[0] === s)[li].replace(/\s*\(([^)]{19,})\)$/, ''));
    const or = lang === 'en' ? ' or ' : ' o ';
    return `${ch.q[lang === 'en' ? 1 : 0].replace(/\s*\(.*\)$/, '')}: ${words.length > 1 ? words.slice(0, -1).join(', ') + or + words[words.length - 1] : words[0]}`;
  }

  return { CH, FLORAL, flowerStates, plantStates, rows, rowsOf, familyStates, matrix, statesOf, score, remaining, counts, ifChosen, usefulness, suggest, differences, fromModel, build, pathTo, follow, reach, leadText, reset() { ROWS = null; FAMST = null; BYFAM = null; } };
})();
window.KEY = KEY;
