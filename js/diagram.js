/* FloralPro — floral diagrams drawn from the flower model.

   A floral diagram is the ground plan of the flower seen from above, cut just
   above the ovary: the inflorescence axis at the top (adaxial side), the
   subtending bract at the bottom (abaxial side), and the whorls as concentric
   rings — sepals as crescents with a keel, petals as smooth crescents, stamens
   as anther cross-sections and the gynoecium as the ovary cross-section with
   its locules and ovules. Lines between neighbouring organs show connation;
   radial lines show adnation (e.g. stamens fused to the corolla). The drawing
   follows the conventions of Eichler (1875–1878) and Ronse De Craene (2010).

   Angles are in degrees, 0° = adaxial (top, towards the axis), clockwise.

   Diagram.svg(model, opts) → SVG string. Every organ is a <g class="dg-o"
   data-org="K|C|P|A|G|E" data-w="whorl" data-i="index">, so the page can
   highlight one whorl in all views at once.
   opts: { colors: 'whorl' | 'natural' | 'bw', axis: true, bract: true,
           plane: true, labels: false, size: null }                          */

const Diagram = (function () {
  const rad = d => d * Math.PI / 180;
  const P = (r, a) => [r * Math.sin(rad(a)), -r * Math.cos(rad(a))];
  const f2 = v => (Math.round(v * 100) / 100).toString();
  const pt = ([x, y]) => f2(x) + ',' + f2(y);
  const angDist = (a, b) => { const d = Math.abs(((a - b) % 360 + 540) % 360 - 180); return d; };
  const norm360 = a => ((a % 360) + 360) % 360;
  let HID = 'dgH0', uid = 0;          /* id of the hatch pattern, unique per drawing */

  /* ---------- colours ---------- */
  function palette(f, mode) {
    const WC = FM.WHORL_COLORS;
    if (mode === 'bw') {
      return { K: '#ffffff', C: '#ffffff', P: '#ffffff', E: '#ffffff', A: '#222222', G: '#ffffff', ovule: '#222222', stroke: '#1a1a1a',
        loc: '#ffffff', disc: '#d9d9d9', hyp: '#eeeeee', corona: '#555555', axis: '#222222', bract: '#ffffff', keel: '#1a1a1a' };
    }
    const c = k => FM.color(f, k, mode);
    return {
      K: c('K'), C: c('C'), P: c('P'), E: c('E'), A: c('A'), G: mode === 'whorl' ? WC.G : (f.colors.G || '#9cc76a'),
      ovule: mode === 'whorl' ? WC.ovule : '#3f6d2a', loc: '#fbfdf8', stroke: '#2b2b2b', disc: WC.disc, hyp: WC.hyp, corona: f.corona && f.corona.color || WC.corona,
      axis: '#5b5b5b', bract: '#9aa77c', keel: 'rgba(0,0,0,.55)',
    };
  }
  function shade(hex, k) {       /* k < 0 darker, k > 0 lighter */
    const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
    if (!m) return hex;
    const n = parseInt(m[1], 16);
    let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    if (k < 0) { r *= 1 + k; g *= 1 + k; b *= 1 + k; } else { r += (255 - r) * k; g += (255 - g) * k; b += (255 - b) * k; }
    const h = v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
    return '#' + h(r) + h(g) + h(b);
  }

  /* ---------- the rings of organs ---------- */
  function buildRings(f) {
    const rings = [];
    const add = (org, kind) => {
      if (!org) return;
      org.w.forEach((w, wi) => {
        const n = FM.ctyp(w.n);
        if (n <= 0) return;
        rings.push({ org: org.key, wi, w, n, kind, many: FM.isMany(w.n) || n > 16, orgObj: org });
      });
    };
    add(f.E, 'bractlet');
    add(f.K, 'sepal');
    add(f.C, 'petal');
    add(f.P, 'tepal');
    add(f.A, 'stamen');
    return rings;
  }

  /* phase of a ring so that it alternates with (or stands opposite to) the ring outside it */
  function choosePhase(n, prev, prev2, opp) {
    const step = 360 / n;
    let best = 0, bestScore = -Infinity;
    for (let phi = 0; phi < step - 1e-9; phi += 0.5) {
      const angs = []; for (let i = 0; i < n; i++) angs.push(phi + i * step);
      const near = (a, ring) => Math.min(...ring.map(b => angDist(a, b)));
      let score;
      if (opp) score = -Math.max(...angs.map(a => near(a, prev)));
      else {
        score = Math.min(...angs.map(a => near(a, prev))) * 1000;
        if (prev2 && prev2.length) score -= angs.reduce((s, a) => s + near(a, prev2), 0);
      }
      /* prefer arrangements symmetric about the median plane */
      const sym = angs.every(a => angs.some(b => angDist(norm360(-a), b) < 0.26));
      if (sym) score += 0.4;
      if (score > bestScore + 1e-9) { bestScore = score; best = phi; }
    }
    return best;
  }

  function spiralAngles(n, start) {
    const out = [];
    for (let i = 0; i < n; i++) out.push(norm360((start || 0) + i * 137.508));
    return out;
  }

  function layout(f) {
    const rings = buildRings(f);
    const spiral = f.sym === 'spiral';
    let prev = null, prev2 = null;
    for (const R of rings) {
      if (R.w.ang && R.w.ang.length) { R.angles = R.w.ang.slice(); }
      else if (R.w.phase != null) { R.angles = []; for (let i = 0; i < R.n; i++) R.angles.push(norm360(R.w.phase + i * 360 / R.n)); }
      else if (R.many || (spiral && R.kind !== 'bractlet')) {
        R.angles = spiralAngles(R.n, prev ? prev[0] + 68.75 : 0);
        R.spiral = true;
      } else if (!prev) {
        const odd = R.n % 2 === 1 && f.oddK === 'abaxial';
        const phase = odd ? 180 : 0;
        R.angles = []; for (let i = 0; i < R.n; i++) R.angles.push(norm360(phase + i * 360 / R.n));
      } else {
        const phase = choosePhase(R.n, prev, prev2, R.w.opp);
        R.angles = []; for (let i = 0; i < R.n; i++) R.angles.push(norm360(phase + i * 360 / R.n));
      }
      if (!R.spiral) { prev2 = prev; prev = R.angles; }
    }
    /* which part (':' group) and state each organ belongs to */
    for (const R of rings) {
      R.items = R.angles.map(a => ({ a, part: -1, state: R.w.state, connate: R.w.connate === true, size: 1 }));
      if (R.w.parts) {
        const order = R.items.map((it, i) => i).sort((i, j) => {
          const da = angDist(R.items[i].a, 0), db = angDist(R.items[j].a, 0);
          if (Math.abs(da - db) > 0.01) return R.w.from === 'abaxial' ? db - da : da - db;
          return norm360(R.items[i].a) - norm360(R.items[j].a);
        });
        let k = 0;
        R.w.parts.forEach((p, pi) => {
          const cnt = FM.ctyp(p.n);
          for (let c = 0; c < cnt && k < order.length; c++, k++) {
            const it = R.items[order[k]];
            it.part = pi; it.state = p.state; it.connate = !!p.connate || R.w.connate === true; it.size = p.size || 1;
          }
        });
      }
    }
    /* radii: from the outside in */
    const G = f.G;
    const gynR = !G || FM.cmax(FM.total(G)) === 0 ? 10 : (FM.gynoeciumType(f).type === 'apo' ? 26 : FM.cmax(FM.total(G)) === 1 ? 17 : 24);
    const need = rings.map(R => R.kind === 'bractlet' ? 9 : R.kind === 'stamen' ? (R.spiral ? 22 : 12) : R.spiral ? 20 : 12.5);
    const extra = (f.corona ? 6 : 0) + (f.disc === 'intra' ? 5 : 0) + (f.disc === 'extra' ? 5 : 0);
    const outer = 84;
    const avail = outer - gynR - 6 - extra;
    const sum = need.reduce((s, v) => s + v, 0);
    const k = sum > avail ? avail / sum : 1;
    let r = outer;
    rings.forEach((R, i) => {
      const sp = need[i] * k;
      R.r = r - sp / 2;
      R.t = Math.min(9, sp * 0.72);
      r -= sp;
      if (R.kind === 'petal' || (R.kind === 'tepal' && i === rings.length - 1)) { /* corona goes after the last perianth ring */ }
    });
    /* the corona and a disc outside the stamens take room just inside the perianth */
    const firstA = rings.findIndex(R => R.kind === 'stamen');
    const lay = { rings, gynR: Math.min(gynR, Math.max(12, r - 4 - (f.disc === 'intra' ? 5 : 0))), outer };
    if (firstA > 0) lay.coronaR = rings[firstA - 1].r - rings[firstA - 1].t / 2 - 3;
    else if (rings.length) lay.coronaR = rings[rings.length - 1].r - 8;
    if (f.corona || f.disc === 'extra') {
      /* shift the stamens and the gynoecium inwards by the room the corona or disc needs */
      const sh = extra - (f.disc === 'intra' ? 5 : 0);
      rings.forEach((R, i) => { if (i >= firstA && firstA >= 0) R.r -= sh; });
    }
    if (f.disc === 'intra') lay.discR = lay.gynR + 3;
    if (f.disc === 'extra' && firstA >= 0) lay.discR = rings[firstA].r + rings[firstA].t / 2 + 2.5;
    return lay;
  }

  /* ---------- aestivation: which organ is on top at each boundary ---------- */
  function boundaries(R, aest) {
    const n = R.items.length;
    const top = new Array(n).fill(0);      /* top[i] = +1 → organ i covers organ i+1; −1 → organ i+1 covers organ i */
    if (!aest || aest === 'valvate' || aest === 'open' || n < 2) return top;
    const idx = R.items.map((it, i) => i).sort((i, j) => norm360(R.items[i].a) - norm360(R.items[j].a));
    const pos = {}; idx.forEach((ii, k) => pos[ii] = k);  /* angular order */
    const setB = (k, cover) => { top[idx[k]] = cover; };
    if (aest === 'contort' || aest === 'contortL') {
      for (let k = 0; k < n; k++) setB(k, aest === 'contort' ? -1 : 1);
      return top;
    }
    if (aest === 'quincuncial' && n === 5) {
      /* spiral sequence 1..5 on positions 0,2,4,1,3 (2/5 phyllotaxis): two outside, two inside, one half */
      const startK = idx.findIndex(i => angDist(R.items[i].a, 0) < 1) >= 0 ? idx.findIndex(i => angDist(R.items[i].a, 0) < 1) : 0;
      const level = new Array(5);
      [0, 2, 4, 1, 3].forEach((p, s) => { level[(startK + p) % 5] = s; });   /* s = order of initiation */
      for (let k = 0; k < 5; k++) {
        const a = level[k], b = level[(k + 1) % 5];
        setB(k, a < b ? 1 : -1);     /* the earlier organ is outside */
      }
      return top;
    }
    /* imbricate: cascade from an outermost organ (the adaxial one for vexillary, the abaxial for carinal) */
    const target = aest === 'carinal' ? 180 : 0;
    let o = 0, bestD = 1e9;
    for (let k = 0; k < n; k++) { const d = angDist(R.items[idx[k]].a, target); if (d < bestD) { bestD = d; o = k; } }
    for (let k = 0; k < n; k++) {
      const k2 = (k + 1) % n;
      const d1 = Math.min((k - o + n) % n, (o - k + n) % n), d2 = Math.min((k2 - o + n) % n, (o - k2 + n) % n);
      setB(k, d1 <= d2 ? 1 : -1);
    }
    return top;
  }

  /* ---------- glyphs ---------- */
  function crescent(a, half, r, t, dL, dR, keel) {
    const N = 36, outer = [], inner = [];
    for (let i = 0; i <= N; i++) {
      const s = i / N;
      const ang = a - half + 2 * half * s;
      const d = dL * (1 - s) + dR * s;
      const th = t * (0.22 + 0.78 * Math.pow(Math.sin(Math.PI * s), 0.62));
      let ro = r + d + th / 2;
      if (keel) { const q = Math.abs(s - 0.5); if (q < 0.1) ro += keel * (1 - q / 0.1); }
      outer.push(P(ro, ang));
      inner.push(P(r + d - th / 2, ang));
    }
    return 'M' + outer.map(pt).join('L') + 'L' + inner.reverse().map(pt).join('L') + 'Z';
  }

  function antherGlyph(x, y, a, w, h, fill, stroke, opts) {
    /* local frame: u tangential, v radial inward; rotate so v points to the centre */
    const tr = `translate(${f2(x)},${f2(y)}) rotate(${f2(a)})`;
    const mono = opts.thecae === 1;
    const extr = opts.extrorse;
    let g = `<g transform="${tr}">`;
    if (opts.state === 'sterile') {
      g += `<rect x="${f2(-w * 0.28)}" y="${f2(-h * 0.35)}" width="${f2(w * 0.56)}" height="${f2(h * 0.7)}" rx="${f2(h * 0.3)}" fill="${fill}" fill-opacity=".45" stroke="${stroke}" stroke-width=".6" stroke-dasharray="1.4 1"/>`;
    } else if (opts.state === 'lost') {
      g += `<circle r="${f2(h * 0.32)}" fill="none" stroke="${stroke}" stroke-width=".7" stroke-dasharray="1 1.1" opacity=".75"/>`;
    } else if (mono) {
      g += `<ellipse rx="${f2(w * 0.3)}" ry="${f2(h * 0.46)}" fill="${fill}" stroke="${stroke}" stroke-width=".6"/>`;
      g += `<path d="M0,${f2(extr ? -h * 0.46 : h * 0.46)}L0,${f2(extr ? -h * 0.1 : h * 0.1)}" stroke="${stroke}" stroke-width=".6"/>`;
    } else {
      /* two thecae, each with two pollen sacs; the slit faces the centre (introrse) or the outside */
      const sx = w * 0.25, rr = h * 0.46;
      for (const sgn of [-1, 1]) {
        const cx = sgn * sx;
        g += `<path d="M${f2(cx - rr * 0.95)},0 a${f2(rr * 0.95)},${f2(rr)} 0 1,1 ${f2(rr * 1.9)},0 a${f2(rr * 0.95)},${f2(rr)} 0 1,1 ${f2(-rr * 1.9)},0Z" fill="${fill}" stroke="${stroke}" stroke-width=".55"/>`;
        const sy = extr ? -rr : rr;
        g += `<path d="M${f2(cx)},${f2(sy * 0.15)}L${f2(cx)},${f2(sy)}" stroke="${stroke}" stroke-width=".5" opacity=".8"/>`;
      }
      g += `<rect x="${f2(-w * 0.07)}" y="${f2(-h * 0.26)}" width="${f2(w * 0.14)}" height="${f2(h * 0.52)}" fill="${shade(fill, -0.18)}" stroke="none"/>`;
    }
    return g + '</g>';
  }

  /* ---------- the gynoecium ---------- */
  function gynoecium(f, lay, C) {
    const G = f.G;
    if (!G) return '';
    const Rg = lay.gynR;
    const nc = FM.ctyp(FM.total(G, { visible: true }));
    const gt = FM.gynoeciumType(f);
    const stroke = C.stroke;
    let s = '';
    const tag = (i, inner) => `<g class="dg-o" data-org="G" data-w="0" data-i="${i}">${inner}</g>`;
    const sterile = G.w.every(w => w.state === 'sterile');
    if (sterile || nc === 0) {
      /* pistillode */
      return tag(0, `<circle r="${f2(Math.max(4, Rg * 0.28))}" fill="${C.G}" fill-opacity=".5" stroke="${stroke}" stroke-width=".7" stroke-dasharray="1.5 1.2"/>`);
    }
    /* inferior or half-inferior ovary: receptacular tissue around it */
    const ovCount = G.ov != null ? FM.ctyp(G.ov) : null;
    const baseAng = G.ang != null ? G.ang : null;
    if (gt.type === 'apo' || (gt.type === 'semi')) {
      const many = nc > 12;
      const items = [];
      if (many) {
        const angs = spiralAngles(nc, 20);
        angs.forEach((a, i) => { const rr = Rg * 0.25 + Rg * 0.68 * Math.sqrt((i + 0.5) / nc); items.push({ a, r: rr, size: Math.max(2.4, Rg * 0.9 / Math.sqrt(nc)) }); });
      } else {
        const ph = baseAng != null ? baseAng : (lay.rings.length ? choosePhase(nc, lay.rings[lay.rings.length - 1].angles, null, false) : 0);
        const rr = nc === 2 ? Rg * 0.5 : Rg * 0.58;
        const sz = Math.min(Rg * 0.42, Math.PI * rr / nc * 0.86);
        for (let i = 0; i < nc; i++) items.push({ a: ph + i * 360 / nc, r: rr, size: sz });
      }
      items.forEach((it, i) => {
        const [x, y] = P(it.r, it.a);
        const sz = it.size;
        /* carpel: a teardrop whose ventral suture faces the centre; ovules along it */
        const inner = `<g transform="translate(${f2(x)},${f2(y)}) rotate(${f2(it.a)})">` +
          `<path d="M0,${f2(sz * 1.05)} C${f2(sz * 1.15)},${f2(sz * 0.7)} ${f2(sz * 0.95)},${f2(-sz * 1.05)} 0,${f2(-sz * 1.0)} C${f2(-sz * 0.95)},${f2(-sz * 1.05)} ${f2(-sz * 1.15)},${f2(sz * 0.7)} 0,${f2(sz * 1.05)}Z" fill="${C.G}" stroke="${stroke}" stroke-width=".7"/>` +
          `<ellipse cx="0" cy="${f2(sz * 0.05)}" rx="${f2(sz * 0.52)}" ry="${f2(sz * 0.62)}" fill="${C.loc}" stroke="${stroke}" stroke-width=".45"/>` +
          (sz > 3 ? `<ellipse cx="0" cy="${f2(sz * 0.42)}" rx="${f2(sz * 0.2)}" ry="${f2(sz * 0.16)}" fill="${C.ovule}"/>` : '') +
          `</g>`;
        s += tag(i, inner);
      });
      if (gt.type === 'semi') s += `<circle r="${f2(Rg * 0.18)}" fill="${C.G}" stroke="${stroke}" stroke-width=".6"/>`;
      return wrapPos(s);
    }
    if (gt.type === 'mono') {
      /* one carpel; the ventral suture (with the ovules) faces the axis */
      const a = baseAng != null ? baseAng : 0;
      const w = Rg * 0.62, h = Rg * 0.95;
      const nOv = Math.min(ovCount || 2, 8);
      let ov = '';
      if (G.plac === 'basal' || G.plac === 'apical' || nOv === 1) ov = `<ellipse cx="0" cy="${f2(-h * 0.25)}" rx="${f2(w * 0.28)}" ry="${f2(w * 0.24)}" fill="${C.ovule}"/>`;
      else for (let i = 0; i < Math.min(nOv, 2); i++) ov += `<ellipse cx="${f2((i ? 1 : -1) * w * 0.2)}" cy="${f2(-h * 0.42)}" rx="${f2(w * 0.17)}" ry="${f2(w * 0.14)}" fill="${C.ovule}"/>`;
      const inner = `<g transform="rotate(${f2(a)})">` +
        `<path d="M0,${f2(-h)} C${f2(w * 1.3)},${f2(-h * 0.9)} ${f2(w * 1.1)},${f2(h * 0.95)} 0,${f2(h)} C${f2(-w * 1.1)},${f2(h * 0.95)} ${f2(-w * 1.3)},${f2(-h * 0.9)} 0,${f2(-h)}Z" fill="${C.G}" stroke="${stroke}" stroke-width=".8"/>` +
        `<path d="M0,${f2(-h * 0.8)} C${f2(w * 0.85)},${f2(-h * 0.7)} ${f2(w * 0.7)},${f2(h * 0.65)} 0,${f2(h * 0.72)} C${f2(-w * 0.7)},${f2(h * 0.65)} ${f2(-w * 0.85)},${f2(-h * 0.7)} 0,${f2(-h * 0.8)}Z" fill="${C.loc}" stroke="${stroke}" stroke-width=".5"/>` +
        ov + `<path d="M0,${f2(-h)}L0,${f2(-h * 0.8)}" stroke="${stroke}" stroke-width=".8"/></g>`;
      return wrapPos(tag(0, inner));
    }
    /* syncarpous */
    const L = FM.ctyp(G.loc || 1);
    const last = lay.rings.filter(R => !R.spiral).slice(-1)[0];
    let ph;
    if (baseAng != null) ph = baseAng;
    else if (last && last.n === nc) ph = choosePhase(nc, last.angles, null, !!G.opp);
    else if (nc === 2) ph = 0;
    else ph = (nc % 2 === 1 && f.oddK === 'abaxial') ? 180 : 0;
    const carpelAngs = []; for (let i = 0; i < nc; i++) carpelAngs.push(norm360(ph + i * 360 / nc));
    const wall = Rg, locR = Rg * 0.8, col = Rg * 0.16;
    let body = `<circle r="${f2(wall)}" fill="${C.G}" stroke="${stroke}" stroke-width=".85"/>`;
    const nOvPer = ovCount != null ? ovCount / Math.max(1, (G.plac === 'axile' || G.plac === 'laminar') ? L : nc) : 2;
    const ovDraw = n => Math.max(1, Math.min(n === Infinity ? 3 : Math.round(n), 3));
    const ovule = (x, y, s2) => `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(s2)}" ry="${f2(s2 * 0.82)}" fill="${C.ovule}"/>`;
    const plac = G.plac;
    if ((plac === 'axile' || plac === 'laminar') && L >= 2) {
      const la = []; const perC = L / nc;
      for (let i = 0; i < L; i++) la.push(norm360(ph + (i - (perC - 1) / 2) * 360 / L));
      const half = 180 / L;
      la.forEach((a, i) => {
        const g2 = Math.min(6, 60 / L);
        const p1 = P(locR, a - half + g2 * 0.5), p2 = P(locR, a + half - g2 * 0.5);
        const q1 = P(col + 1.2, a - half + g2 * 1.4), q2 = P(col + 1.2, a + half - g2 * 1.4);
        body += `<path d="M${pt(q1)}L${pt(p1)}A${f2(locR)},${f2(locR)} 0 0,1 ${pt(p2)}L${pt(q2)}Z" fill="${C.loc}" stroke="${stroke}" stroke-width=".5" stroke-linejoin="round"/>`;
        const nD = ovDraw(nOvPer);
        const ovS = Math.min(2.6, Rg * 0.1 + 0.4);
        if (plac === 'laminar') {
          for (let k = 0; k < 3; k++) { const [x, y] = P(col + (locR - col) * (0.3 + 0.25 * k), a - half + g2 * 1.2 + 2); body += ovule(x, y, ovS * 0.8); }
        } else if (nD === 1) { const [x, y] = P(col + ovS * 1.6, a); body += ovule(x, y, ovS); }
        else for (let k = 0; k < nD; k++) {
          const off = (k - (nD - 1) / 2) * Math.min(half * 0.55, 14);
          const [x, y] = P(col + ovS * 1.7 + (k % 2) * ovS * 0.9, a + off);
          body += ovule(x, y, ovS);
        }
      });
      /* false septa (more locules than carpels): drawn thinner */
      if (L > nc) la.forEach((a, i) => {
        const b = a + 180 / L;
        if (Math.round((i + 1) % (L / nc)) !== 0) body += `<path d="M${pt(P(col, b))}L${pt(P(locR, b))}" stroke="${stroke}" stroke-width=".4" stroke-dasharray="1.2 .9"/>`;
      });
      body += `<circle r="${f2(col)}" fill="${shade(C.G, -0.08)}" stroke="none"/>`;
    } else if (plac === 'parietal') {
      body += `<circle r="${f2(locR)}" fill="${C.loc}" stroke="${stroke}" stroke-width=".5"/>`;
      /* each placenta is a ridge of the ovary wall at a commissure (where two carpels meet),
         projecting into the single locule; the ovules sit on its two flanks */
      const commis = carpelAngs.map(a => a + 180 / nc);
      const deep = G.replum ? 0.2 : Math.min(0.55, 0.3 + 0.05 * nc);
      const tipR = locR * (1 - deep), hw = Math.min(26, 90 / nc);
      const ovS = Math.min(2.2, Rg * 0.095);
      commis.forEach(a => {
        const b1 = P(locR + 0.4, a - hw * 0.45), b2 = P(locR + 0.4, a + hw * 0.45);
        const t1 = P(tipR, a - hw * 0.28), t2 = P(tipR, a + hw * 0.28), tip = P(tipR - 2.2, a);
        body += `<path d="M${pt(b1)}L${pt(t1)}Q${pt(tip)} ${pt(t2)}L${pt(b2)}Z" fill="${C.G}" stroke="${stroke}" stroke-width=".45" stroke-linejoin="round"/>`;
        const n = ovDraw(nOvPer);
        const rr = tipR + (locR - tipR) * 0.3;
        if (n === 1) { const [ox, oy] = P(tipR - ovS * 1.2, a); body += ovule(ox, oy, ovS); }
        else for (const sgn of [-1, 1]) {
          const [ox, oy] = P(rr, a + sgn * hw * 0.62);
          body += ovule(ox, oy, ovS);
          if (n >= 3 && !G.replum) { const [px, py] = P(tipR - 0.5, a + sgn * hw * 0.5); body += ovule(px, py, ovS * 0.9); }
        }
      });
      if (G.replum && nc === 2) {
        const [x1, y1] = P(locR, commis[0]), [x2, y2] = P(locR, commis[1]);
        body += `<path d="M${f2(x1)},${f2(y1)}L${f2(x2)},${f2(y2)}" stroke="${stroke}" stroke-width=".9"/>`;
      }
    } else if (plac === 'freecentral') {
      body += `<circle r="${f2(locR)}" fill="${C.loc}" stroke="${stroke}" stroke-width=".5"/>`;
      const cr = Rg * 0.32;
      body += `<circle r="${f2(cr)}" fill="${C.G}" stroke="${stroke}" stroke-width=".5"/>`;
      const n = 8;
      for (let i = 0; i < n; i++) { const [x, y] = P(cr + 2.2, i * 45 + 22.5); body += ovule(x, y, Math.min(2, Rg * 0.08)); }
    } else {
      /* basal, apical, or one locule with a single ovule */
      body += `<circle r="${f2(locR)}" fill="${C.loc}" stroke="${stroke}" stroke-width=".5"/>`;
      const s2 = Math.min(locR * 0.5, 7);
      body += `<ellipse rx="${f2(s2)}" ry="${f2(s2 * 0.82)}" fill="${C.ovule}" ${plac === 'apical' ? `stroke="${stroke}" stroke-dasharray="1.2 1" stroke-width=".6" fill-opacity=".75"` : ''}/>`;
    }
    /* septa lines between carpels are part of the locule drawing; mark the carpel midribs */
    carpelAngs.forEach(a => {
      const [x1, y1] = P(wall, a), [x2, y2] = P(wall - Math.min(3, Rg * 0.12), a);
      body += `<path d="M${f2(x1)},${f2(y1)}L${f2(x2)},${f2(y2)}" stroke="${stroke}" stroke-width=".7"/>`;
    });
    if (G.style === 'gynobasic') body += `<circle r="${f2(Math.max(1.6, col * 0.6))}" fill="${stroke}"/>`;
    s += tag(0, body);
    return wrapPos(s);

    function wrapPos(inner) {
      let ring = '';
      if (G.pos === 'inferior' || G.pos === 'half') {
        const R1 = Rg + (gt.type === 'apo' ? 2 : 1.2), R2 = R1 + 4.2;
        const dash = G.pos === 'half' ? ' stroke-dasharray="2.4 1.6"' : '';
        ring = `<g class="dg-o dg-rec" data-org="G" data-w="pos"><circle r="${f2((R1 + R2) / 2)}" fill="none" stroke="url(#${HID})" stroke-width="${f2(R2 - R1)}"/>` +
          `<circle r="${f2(R2)}" fill="none" stroke="${C.stroke}" stroke-width=".55"${dash}/></g>`;
      }
      return ring + inner;
    }
  }

  /* ---------- main ---------- */
  function svg(src, opts) {
    HID = 'dgH' + (++uid);
    opts = Object.assign({ colors: 'whorl', axis: true, bract: true, plane: true, labels: false, only: null, focus: null, allPlanes: false }, opts || {});
    /* only: draw just some organ categories (the atlas shows, e.g., the corolla ring alone
       for the aestivation or the ovary alone, enlarged, for the placentation) */
    let f = FM.normalize(src);
    if (opts.only) {
      const keep = {};
      for (const k in f) keep[k] = f[k];
      for (const k of FM.ORG) if (!opts.only.includes(k)) keep[k] = null;
      keep.adn = f.adn.filter(g => g.every(k => opts.only.includes(k)));
      keep.hyp = opts.only.includes('A') || opts.only.includes('K') ? f.hyp : 'none';
      keep.disc = opts.only.includes('A') ? f.disc : null;
      keep.corona = opts.only.includes('C') || opts.only.includes('A') ? f.corona : null;
      f = keep;
      opts.axis = opts.axis === true && opts.only.length > 2;
      opts.bract = opts.bract === true && opts.only.length > 2;
      opts.plane = opts.only.length > 2 && opts.plane;
    }
    const C = palette(f, opts.colors);
    const lay = layout(f);
    const stroke = C.stroke;
    const L = f.look || {};
    let out = '';
    /* defs */
    const hatchCol = opts.colors === 'bw' ? '#444' : C.hyp;
    out += `<defs><pattern id="${HID}" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="3" height="3" fill="${opts.colors === 'bw' ? '#fff' : shade(C.hyp, 0.55)}"/><path d="M0,0L0,3" stroke="${hatchCol}" stroke-width="1.1"/></pattern></defs>`;
    /* symmetry plane(s) */
    if (opts.plane) {
      const dash = 'stroke-dasharray="4 3"';
      const line = a => { const [x1, y1] = P(104, a), [x2, y2] = P(104, a + 180); return `<path class="dg-plane" d="M${pt([x1, y1])}L${pt([x2, y2])}" stroke="#7a7a7a" stroke-width=".7" ${dash} opacity=".75"/>`; };
      if (f.sym === 'zygo') out += line(0);
      if (f.sym === 'zygoT') out += line(90);
      if (f.sym === 'zygoO') out += line(L.plane != null ? L.plane : 36);
      if (f.sym === 'disym') out += line(0) + line(90);
      /* an actinomorphic flower has as many planes of symmetry as members per whorl */
      if (opts.allPlanes && f.sym === 'actino' && lay.rings.length && !lay.rings[0].spiral) {
        const R0 = lay.rings[0], n = R0.n, seen = new Set();
        const cand = R0.angles.map(a => norm360(a) % 180).concat(R0.angles.map(a => norm360(a + 180 / n) % 180));
        cand.forEach(a => { const key = Math.round(a * 10); if (seen.size < n && !seen.has(key)) { seen.add(key); out += line(a); } });
      }
    }
    /* axis, bract, bracteoles */
    if (opts.axis) out += `<g class="dg-o" data-org="axis"><circle cx="0" cy="-101" r="5" fill="none" stroke="${C.axis}" stroke-width="1.1"/><circle cx="0" cy="-101" r="1.4" fill="${C.axis}"/></g>`;
    if (opts.bract) {
      out += `<g class="dg-o" data-org="B"><path d="${crescent(180, 26, 97, 6.5, 0, 0, 3)}" fill="${C.bract}" stroke="${stroke}" stroke-width=".7" fill-opacity="${opts.colors === 'bw' ? 1 : 0.55}"/></g>`;
      if (f.Bt === 2) for (const a of [90, 270]) out += `<g class="dg-o" data-org="Bt"><path d="${crescent(a, 11, 95, 4.2, 0, 0, 2)}" fill="${C.bract}" stroke="${stroke}" stroke-width=".6" fill-opacity="${opts.colors === 'bw' ? 1 : 0.55}"/></g>`;
      if (f.Bt === 1) out += `<g class="dg-o" data-org="Bt"><path d="${crescent(0, 18, 92, 5, 0, 0, 2.4)}" fill="${C.bract}" stroke="${stroke}" stroke-width=".6" fill-opacity="${opts.colors === 'bw' ? 1 : 0.55}"/></g>`;
    }
    /* hypanthium (floral cup): a shaded ring behind the perianth and stamens */
    if (f.hyp && f.hyp !== 'none' && lay.rings.length) {
      const rA = lay.rings.filter(R => R.kind === 'stamen');
      const inner = rA.length ? rA[rA.length - 1].r - rA[rA.length - 1].t / 2 - 2 : lay.gynR + 4;
      const outerR = lay.rings[0].r;
      out += `<g class="dg-o" data-org="hyp"><circle r="${f2((inner + outerR) / 2)}" fill="none" stroke="${C.hyp}" stroke-opacity="${opts.colors === 'bw' ? 0.25 : 0.22}" stroke-width="${f2(outerR - inner)}"/></g>`;
    }
    /* disc */
    if (f.disc && lay.discR) {
      out += `<g class="dg-o" data-org="disc"><circle r="${f2(lay.discR)}" fill="none" stroke="${C.disc}" stroke-width="4.2" stroke-opacity=".9"/></g>`;
    }
    /* rings */
    const aestOf = R => (R.orgObj.aest) || (R.kind === 'stamen' || R.spiral ? null : R.w.connate ? 'valvate' : (R.kind === 'tepal' && R.n <= 3) ? 'open' : 'imbricate');
    const staminateLines = [];
    lay.rings.forEach((R, ri) => {
      const fill = C[R.org] || '#999';
      const n = R.items.length;
      let g = '';
      if (R.kind === 'stamen') {
        const w = R.spiral ? Math.max(5, Math.min(9, 150 / Math.sqrt(n) / 2)) : Math.min(13, 2 * Math.PI * R.r / n * 0.7);
        const h = w * 0.62;
        const pts = [];
        R.items.forEach((it, i) => {
          let r = R.r;
          if (R.spiral) { const band = 16; r = R.r + band / 2 - band * ((i + 0.5) / n); }
          const [x, y] = P(r, it.a);
          pts.push({ x, y, r, a: it.a, it });
          if (R.w.fasc) {
            /* a bundle (fascicle) of stamens: small anthers clustered on a common base */
            const k = Math.max(2, Math.min(6, FM.ctyp(R.w.fasc.per)));
            const spread = Math.min(360 / n * 0.7, 40);
            let b = `<path d="M${pt(P(r + 4, it.a - spread / 2))}A${f2(r + 4)},${f2(r + 4)} 0 0,1 ${pt(P(r + 4, it.a + spread / 2))}" fill="none" stroke="${stroke}" stroke-width="1"/>`;
            for (let j = 0; j < k; j++) {
              const aj = it.a - spread / 2 + spread * (j + 0.5) / k, rj = r - (j % 2) * 4;
              const [xj, yj] = P(rj, aj);
              b += antherGlyph(xj, yj, aj, w * 0.55, h * 0.55, fill, stroke, { state: it.state, thecae: L.thecae });
            }
            g += `<g class="dg-o" data-org="A" data-w="${R.wi}" data-i="${i}">${b}</g>`;
            return;
          }
          g += `<g class="dg-o" data-org="A" data-w="${R.wi}" data-i="${i}">` + antherGlyph(x, y, it.a, w, h, fill, stroke, { state: it.state, thecae: L.thecae, extrorse: L.extrorse }) + '</g>';
        });
        /* connation of filaments: an arc behind neighbours of the same group */
        if (!R.spiral && n > 1) {
          const sorted = pts.slice().sort((p, q) => norm360(p.a) - norm360(q.a));
          const allC = R.w.connate === true || R.orgObj.connate;
          for (let k = 0; k < n; k++) {
            const p = sorted[k], q = sorted[(k + 1) % n];
            const same = allC || (p.it.connate && q.it.connate && p.it.part === q.it.part);
            if (!same || p.it.state === 'lost' || q.it.state === 'lost') continue;
            const rr = R.r + h * 0.62;
            let a1 = p.a + 3, a2 = q.a - 3;
            if (a2 < a1) a2 += 360;
            if (a2 - a1 > 200) continue;
            g = `<path class="dg-fuse" d="M${pt(P(rr, a1))}A${f2(rr)},${f2(rr)} 0 0,1 ${pt(P(rr, a2))}" fill="none" stroke="${stroke}" stroke-width=".9"/>` + g;
          }
        } else if (R.spiral && (R.w.connate === true || R.orgObj.connate)) {
          g = `<circle r="${f2(R.r + 9)}" fill="none" stroke="${stroke}" stroke-width=".8"/>` + g;
        }
        staminateLines.push({ R, pts, h });
      } else {
        const aest = aestOf(R);
        /* whorls of two or three members (decussate sepals, monocot tepals) are not drawn wider than
           a quarter or a third of a turn */
        const nEff = n >= 4 ? n : n === 3 ? 3.3 : 4;
        const baseHalf = R.spiral ? Math.min(40, 360 / n * 1.6) : 180 / nEff * (aest === 'open' ? (n < 4 ? 0.86 : 0.74) : aest === 'valvate' ? 0.96 : n < 4 ? 0.98 : 1.08);
        const top = R.spiral ? null : boundaries(R, aest);
        const dlt = R.t * 0.42;
        const sortedIdx = R.items.map((it, i) => i).sort((i, j) => norm360(R.items[i].a) - norm360(R.items[j].a));
        const keel = R.kind === 'sepal' ? 2.6 : (R.kind === 'tepal' && ri === lay.rings.findIndex(x => x.org === R.org) && R.orgObj.w.length > 1) ? 1.6 : R.kind === 'bractlet' ? 1.8 : 0;
        const items = sortedIdx.map((i, k) => {
          const it = R.items[i];
          let dL = 0, dR = 0;
          if (top) {
            const prevI = sortedIdx[(k - 1 + n) % n];
            dR = top[i] === 1 ? dlt : top[i] === -1 ? -dlt : 0;
            dL = top[prevI] === 1 ? -dlt : top[prevI] === -1 ? dlt : 0;
          }
          let r = R.r, t = R.t;
          if (R.spiral) { const band = 14; r = R.r + band / 2 - band * ((i + 0.5) / n); t = R.t * 0.8; }
          const sz = it.size || 1;
          return { i, it, dL, dR, r, t: t * Math.min(1.25, sz), half: baseHalf * sz, ontop: (dL > 0) + (dR > 0) };
        });
        items.sort((p, q) => p.ontop - q.ontop);
        for (const o of items) {
          const it = o.it;
          if (it.state === 'lost') {
            const [x, y] = P(o.r, it.a);
            g += `<g class="dg-o" data-org="${R.org}" data-w="${R.wi}" data-i="${o.i}"><circle cx="${f2(x)}" cy="${f2(y)}" r="2.2" fill="none" stroke="${stroke}" stroke-dasharray="1 1" stroke-width=".6"/></g>`;
            continue;
          }
          const d = crescent(it.a, o.half, o.r, it.state === 'sterile' ? o.t * 0.55 : o.t, o.dL, o.dR, keel);
          const fo = it.state === 'sterile' ? ' fill-opacity=".45" stroke-dasharray="1.4 1"' : '';
          g += `<g class="dg-o" data-org="${R.org}" data-w="${R.wi}" data-i="${o.i}"><path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width=".7" stroke-linejoin="round"${fo}/></g>`;
        }
        /* connation: bridges between neighbours of the same connate group */
        if (!R.spiral && n > 1) {
          const allC = R.w.connate === true || R.orgObj.connate;
          let fz = '';
          for (let k = 0; k < n; k++) {
            const a = R.items[sortedIdx[k]], b = R.items[sortedIdx[(k + 1) % n]];
            const same = allC || (a.connate && b.connate && a.part === b.part && a.part >= 0);
            if (!same) continue;
            let a1 = a.a, a2 = b.a; if (a2 < a1) a2 += 360;
            const mid = (a1 + a2) / 2, span = Math.min(12, (a2 - a1) * 0.28);
            fz += `<path d="M${pt(P(R.r, mid - span))}A${f2(R.r)},${f2(R.r)} 0 0,1 ${pt(P(R.r, mid + span))}" fill="none" stroke="${stroke}" stroke-width="1.1"/>`;
          }
          g += `<g class="dg-fuse" data-org="${R.org}">${fz}</g>`;
        }
      }
      out += `<g class="dg-ring" data-org="${R.org}" data-w="${R.wi}">${g}</g>`;
    });
    /* corona */
    if (f.corona && lay.coronaR) {
      const n = FM.ctyp(f.corona.n || 40);
      let g = '';
      for (let i = 0; i < n; i++) { const a = i * 360 / n; g += `<path d="M${pt(P(lay.coronaR - 2.4, a))}L${pt(P(lay.coronaR + 2.4, a))}" stroke="${C.corona}" stroke-width="1.7" stroke-linecap="round"/>`; }
      out += `<g class="dg-o" data-org="corona">${g}</g>`;
    }
    /* adnation: radial lines from the stamens to the corolla / perigon they are fused to */
    const adnTo = FM.adnate(f, 'C', 'A') ? 'C' : FM.adnate(f, 'P', 'A') ? 'P' : null;
    if (adnTo) {
      const target = lay.rings.filter(R => R.org === adnTo).slice(-1)[0];
      if (target) {
        let g = '';
        for (const S of staminateLines) {
          if (S.R.spiral) continue;
          for (const p of S.pts) {
            if (p.it.state === 'lost') continue;
            const r1 = p.r + S.h * 0.55, r2 = target.r - target.t * 0.3;
            if (r2 <= r1) continue;
            g += `<path d="M${pt(P(r1, p.a))}L${pt(P(r2, p.a))}" stroke="${stroke}" stroke-width=".75"/>`;
          }
        }
        out += `<g class="dg-adn" data-org="A">${g}</g>`;
      }
    }
    /* gynoecium */
    out += `<g class="dg-gyn">${gynoecium(f, lay, C)}</g>`;
    if (FM.adnate(f, 'A', 'G') && f.G) {
      /* gynostemium: the stamen sits on the column */
      out += `<circle class="dg-adn" r="${f2(lay.gynR + 3.2)}" fill="none" stroke="${stroke}" stroke-width=".6" stroke-dasharray="2 1.4"/>`;
    }
    /* the ovary alone is shown enlarged */
    let vb = '-112 -114 224 226';
    if (opts.only && opts.only.length === 1 && opts.only[0] === 'G') { const R = lay.gynR + 8; vb = `${-R} ${-R} ${2 * R} ${2 * R}`; }
    else if (opts.only && !opts.axis) { const R = (lay.rings.length ? lay.outer + 6 : lay.gynR + 8); vb = `${-R} ${-R} ${2 * R} ${2 * R}`; }
    const sizeAttr = opts.size ? ` width="${opts.size}" height="${opts.size}"` : '';
    const title = opts.title ? `<title>${opts.title}</title>` : '';
    const foc = opts.focus ? ` data-focus="${opts.focus}"` : '';
    return `<svg class="fdiagram" viewBox="${vb}"${sizeAttr}${foc} xmlns="http://www.w3.org/2000/svg" role="img">${title}${out}</svg>`;
  }

  /* counts of drawn organs by category — used by the tests */
  function census(src) {
    const f = FM.normalize(src);
    const lay = layout(f);
    const c = {};
    lay.rings.forEach(R => { c[R.org] = (c[R.org] || 0) + R.items.length; });
    return { counts: c, rings: lay.rings.map(R => ({ org: R.org, wi: R.wi, n: R.n, angles: R.angles.map(a => Math.round(a * 10) / 10), parts: R.items.map(it => it.part), states: R.items.map(it => it.state) })) };
  }

  return { svg, census, layout, shade, P };
})();
window.Diagram = Diagram;
