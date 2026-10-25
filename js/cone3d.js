/* FloralPro — gymnosperm strobili in 3D (Block 7).

   The same painter's-algorithm renderer as the 3D flower (Flower3D.render):
   this file only builds the scene — the axis, the scales or sporophylls placed
   by their phyllotaxis (spiral by the golden angle, decussate pairs, whorls,
   vertical rows), the ovules, seeds, wings and pollen sacs — and mounts it
   with the pointer to rotate it. The 'open' control spreads the scales, as a
   ripe cone does when it dries, so what is inside can be seen.

   World axes as in flower3d.js: z up along the cone axis; a member at angle θ
   points along (sin θ, −cos θ). Each member is drawn in a local frame: u along
   the member, v across it, w on its upper (adaxial) side.

   Cone3D.build(model, { stage: 'pol' | 'mat', open: 0–1 }) → scene
   Cone3D.mount(el, model, opts) → { set(model, stage), setOpen(v), setView, spin, highlight, destroy, svg }
   Cone3D.staticSVG(model, opts) → SVG text (catalogue cards, self-assessment) */

const Cone3D = (function () {
  const rad = d => d * Math.PI / 180;
  const f1 = v => (Math.round(v * 10) / 10).toString();
  function hexRGB(hex) {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
    if (!m) return [150, 150, 150];
    const n = parseInt(m[1], 16);
    return [n >> 16, (n >> 8) & 255, n & 255];
  }
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const norm = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  const crossV = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const darker = (rgb, k) => rgb.map(c => Math.round(c * k));

  /* the young (pollination) colours of the parts that change as the cone ripens */
  const YOUNG = { scale: '#9aa262', bscale: '#86a67c', misp: null, mgsp: null, bract: '#a9b56c', rec: '#9cc76a', epim: '#8fb56e', sarc: '#c9c48a', seed: '#d8cfa0' };
  function colorOf(m, org, stage) {
    if (stage === 'pol') {
      const k = org + 'Pol';
      if (m.colors && m.colors[k]) return hexRGB(m.colors[k]);
      if (YOUNG[org] && !(m.colors && m.colors[org] && (org === 'mgsp' || org === 'misp'))) {
        if (org === 'scale' && m.colors && m.colors.scale && m.bract === 'exserted') return hexRGB(m.colors.scale);
        return hexRGB(YOUNG[org]);
      }
    }
    return hexRGB(CM.color(m, org));
  }

  /* a local frame at `base`: d along the member (angle th, elevation be), t across, n above */
  function frame(base, th, be) {
    const r = [Math.sin(rad(th)), -Math.cos(rad(th)), 0];
    const t = [Math.cos(rad(th)), Math.sin(rad(th)), 0];
    const cb = Math.cos(rad(be)), sb = Math.sin(rad(be));
    const d = [r[0] * cb, r[1] * cb, sb];
    const n = [-r[0] * sb, -r[1] * sb, cb];
    const P = (u, v, w) => [base[0] + u * d[0] + v * t[0] + w * n[0], base[1] + u * d[1] + v * t[1] + w * n[1], base[2] + u * d[2] + v * t[2] + w * n[2]];
    return { r, t, d, n, P, base };
  }
  /* a frame whose member direction is any vector (for tilted axes: catkins, peduncles) */
  function frameDir(base, dir, up) {
    const d = norm(dir);
    let t = crossV(up || [0, 0, 1], d);
    if (Math.hypot(t[0], t[1], t[2]) < 1e-6) t = [1, 0, 0];
    t = norm(t);
    const n = crossV(d, t);
    const P = (u, v, w) => [base[0] + u * d[0] + v * t[0] + w * n[0], base[1] + u * d[1] + v * t[1] + w * n[1], base[2] + u * d[2] + v * t[2] + w * n[2]];
    return { d, t, n, P, base };
  }

  /* a blade along a centreline bent in the (d, n) plane: width wid(s), bend(s) in degrees
     (positive = upwards), starting at x0 along d and w0 above; drawn in two halves */
  function lamina(prims, F, o) {
    const NU = o.NU || 12;
    let x = o.x0 || 0, y = o.w0 || 0;
    const pts = [];
    const ds = o.len / NU;
    for (let k = 0; k <= NU; k++) {
      const s = k / NU;
      pts.push([x, y, s]);
      const phi = rad(o.bend ? o.bend(s) : 0);
      x += Math.cos(phi) * ds; y += Math.sin(phi) * ds;
    }
    const v0 = o.v0 || 0, left = [], right = [];
    pts.forEach(([px, py, s]) => { const w = Math.max(0.05, o.wid(s)) / 2; left.push(F.P(px, v0 - w, py)); right.push(F.P(px, v0 + w, py)); });
    const mid = Math.floor(NU / 2);
    const half = (a, b) => left.slice(a, b + 1).concat(right.slice(a, b + 1).reverse());
    prims.push({ kind: 'poly', pts: half(0, mid), outline: left.slice(0, mid + 1).reverse().concat(right.slice(0, mid + 1)), rgb: o.rgb, org: o.org });
    prims.push({ kind: 'poly', pts: half(mid, NU), outline: left.slice(mid).concat(right.slice(mid).reverse()), rgb: o.rgb, org: o.org });
    return { end: F.P(pts[NU][0], v0, pts[NU][1]), at: s => { const k = Math.round(s * NU); return F.P(pts[k][0], v0, pts[k][1]); } };
  }
  const ell = (prims, c, rx, ry, dir, rgb, org) => prims.push({ kind: 'ell', c, rx, ry, dir, rgb, org });
  const line = (prims, a, b, w, rgb, org) => prims.push({ kind: 'line', pts: [a, b], w, rgb, org });
  /* a surface of revolution about a vertical axis through (cx, cy) */
  function revolve(prims, profile, nSeg, o) {
    const cx = o.cx || 0, cy = o.cy || 0;
    const at = (r, a, z) => [cx + r * Math.sin(rad(a)), cy - r * Math.cos(rad(a)), z];
    for (let s = 0; s < nSeg; s++) {
      const a0 = s * 360 / nSeg, a1 = (s + 1) * 360 / nSeg;
      for (let k = 0; k < profile.length - 1; k++) {
        const [r0, z0] = profile[k], [r1, z1] = profile[k + 1];
        prims.push({ kind: 'poly', pts: [at(r0, a0, z0), at(r0, a1, z0), at(r1, a1, z1), at(r1, a0, z1)], rgb: o.rgb, org: o.org, facet: true });
      }
    }
  }
  /* a flat polygon (shield) in the plane of t and n at distance u along d, with thickness */
  function shield(prims, F, u, th, outline, rgb, org) {
    const front = outline.map(([a, b]) => F.P(u + th, a, b)), back = outline.map(([a, b]) => F.P(u, a, b));
    prims.push({ kind: 'poly', pts: back, rgb: darker(rgb, 0.8), org, facet: true });
    for (let i = 0; i < outline.length; i++) {
      const j = (i + 1) % outline.length;
      prims.push({ kind: 'poly', pts: [back[i], back[j], front[j], front[i]], rgb: darker(rgb, 0.88), org, facet: true });
    }
    prims.push({ kind: 'poly', pts: front, outline: front.concat([front[0]]), rgb, org });
  }
  const ellipseOutline = (W, H, k, sq) => Array.from({ length: k }, (_, i) => { const a = i * 2 * Math.PI / k, c = Math.cos(a), s = Math.sin(a); const p = sq || 1; return [W / 2 * Math.sign(c) * Math.pow(Math.abs(c), p), H / 2 * Math.sign(s) * Math.pow(Math.abs(s), p)]; });
  const hexOutline = (W, H) => [[W / 2, 0], [W / 4, H / 2], [-W / 4, H / 2], [-W / 2, 0], [-W / 4, -H / 2], [W / 4, -H / 2]];

  /* ---------------- the members of a cone ---------------- */
  function unitBS(prims, F, m, u) {
    const { L, W, stage } = u, mat = stage === 'mat', W0 = 0.3 * W;
    const cS = colorOf(m, 'scale', stage), cB = colorOf(m, 'bract', stage);
    if (m.bract === 'exserted') lamina(prims, F, { len: 1.12 * L, w0: -0.03 * L, wid: s => 0.24 * W * (s < 0.72 ? 1 : Math.max(0.08, (1 - s) / 0.28)), bend: s => s > 0.8 ? -62 : 0, rgb: cB, org: 'bract' });
    else lamina(prims, F, { len: 0.32 * L, w0: -0.025 * L, wid: s => 0.36 * W * (1 - 0.55 * s), rgb: cB, org: 'bract' });
    const apo = m.apo && mat, tipU = apo ? 0.84 : 1;
    const wid = s => (W0 + (W - W0) * Math.min(1, s / 0.72)) * (!apo && s > 0.82 ? Math.sqrt(Math.max(0.05, 1 - Math.pow((s - 0.82) / 0.18, 2) * 0.8)) : 1);
    lamina(prims, F, { len: L * tipU, wid, rgb: cS, org: 'scale', bend: s => (mat || s < 0.8) ? 0 : 12 });
    if (apo) {
      const terminal = m.umbo === 'terminal';
      const h = (terminal ? 0.32 : 0.55) * W, T = add(F.P(L * tipU, 0, 0), mul(F.r, 0.06 * L)), Z = [0, 0, 1], t = F.t;
      const top = add(T, mul(Z, 0.18 * h)), bot = add(T, mul(Z, -0.82 * h));
      const lf = add(add(T, mul(t, -W / 2)), mul(Z, -0.28 * h)), rt = add(add(T, mul(t, W / 2)), mul(Z, -0.28 * h));
      const eL = F.P(L * tipU, -W / 2, 0), eR = F.P(L * tipU, W / 2, 0);
      prims.push({ kind: 'poly', pts: [eL, eR, rt, top, lf], rgb: darker(cS, 0.92), org: 'scale' });
      prims.push({ kind: 'poly', pts: [top, rt, bot, lf], outline: [top, rt, bot, lf, top], rgb: darker(cS, 1.08).map(c => Math.min(255, c)), org: 'scale' });
      const uc = terminal ? add(top, mul(Z, -0.1 * h)) : add(T, mul(Z, -0.3 * h));
      ell(prims, add(uc, mul(F.r, 0.02 * L)), 0.07 * W, 0.07 * W, null, darker(cS, 0.62), 'scale');
    }
    for (const sg of [-1, 1]) {
      const v = sg * 0.15 * W, w = 0.035 * L;
      const dir = [F.P(0.28 * L, v, w), F.P(0.06 * L, v, w)];
      if (!mat) ell(prims, F.P(0.17 * L, v, w), 0.065 * W, 0.075 * L, dir, colorOf(m, 'ov', stage), 'ov');
      else {
        if (m.wing) lamina(prims, F, { x0: 0.2 * L, len: 0.42 * L, v0: v, w0: w * 1.2, wid: s => 0.25 * W * Math.pow(Math.sin(Math.PI * (0.12 + 0.8 * s)), 0.6), rgb: colorOf(m, 'wing', stage), org: 'wing' });
        const big = !m.wing;
        ell(prims, F.P(0.17 * L, v, w * 1.5), (big ? 0.1 : 0.06) * W, (big ? 0.1 : 0.07) * L, dir, colorOf(m, 'seed', stage), 'seed');
      }
    }
  }
  function unitMISP(prims, F, m, u) {
    const { L, W } = u;
    lamina(prims, F, { len: L, wid: s => W * (0.35 + 0.65 * Math.min(1, s / 0.55)) * (s > 0.78 ? 0.3 + 0.7 * (1 - s) / 0.22 : 1), bend: s => s > 0.7 ? 72 : 0, rgb: colorOf(m, 'misp'), org: 'misp' });
    const c = colorOf(m, 'spor');
    for (const sg of [-1, 1]) ell(prims, F.P(0.42 * L, sg * 0.2 * W, -0.07 * L), 0.15 * W, 0.24 * L, [F.P(0.15 * L, sg * 0.2 * W, -0.07 * L), F.P(0.7 * L, sg * 0.2 * W, -0.07 * L)], c, 'spor');
  }
  function unitCMISP(prims, F, m, u) {
    const { L, W } = u;
    const e = lamina(prims, F, { len: L, wid: s => W * (0.22 + 0.78 * Math.pow(s, 0.65)) * (s > 0.86 ? Math.max(0.15, (1 - s) / 0.14) : 1), bend: s => s > 0.78 ? 48 : 0, rgb: colorOf(m, 'misp'), org: 'misp' });
    if (m.tip === 'spine') line(prims, e.end, add(e.end, add(mul(F.n, 0.16 * L), mul(F.d, 0.05 * L))), 0.05 * W, darker(colorOf(m, 'misp'), 0.7), 'misp');
    const c = colorOf(m, 'spor'), rows = 4, per = Math.max(2, Math.round((m.spor || 12) / rows));
    for (let a = 0; a < rows; a++) for (let b = 0; b < per; b++) {
      const s = 0.3 + 0.42 * a / (rows - 1), half = W * (0.22 + 0.78 * Math.pow(s, 0.65)) / 2 * 0.75;
      const v = per === 1 ? 0 : -half + 2 * half * b / (per - 1);
      ell(prims, F.P(s * L, v, -0.045 * L), 0.075 * W, 0.055 * L, null, c, 'spor');
    }
  }
  function unitPELT(prims, F, m, u) {
    const { L, W, Hs, stage } = u, mat = stage === 'mat', male = m.sex === 'm';
    const org = male ? 'misp' : CM.femaleOrg(m), cS = colorOf(m, org, stage);
    const th = 0.12 * L * (m.fleshy === 'galb' && mat ? 1.8 : 1);
    /* the scales of a juniper cone are not peltate: a broad wedge instead of a stalk */
    const galb = m.fleshy === 'galb';
    lamina(prims, F, { len: L, wid: galb ? s => Math.min(W, Hs) * (0.3 + 0.55 * s) : () => 0.2 * Math.min(W, Hs), rgb: darker(cS, 0.9), org, NU: 4 });
    const out = m.facet === 'hex' ? hexOutline(W, Hs) : galb ? ellipseOutline(W * 0.92, Hs * 0.92, 16, 1) : ellipseOutline(W, Hs, 12, male ? 0.85 : 0.6);
    shield(prims, F, L, th, out, cS, org);
    const front = F.P(L + th, 0, 0);
    if (m.umbo === 'mucro') {
      ell(prims, add(front, mul(F.d, 0.005 * L)), 0.1 * Math.min(W, Hs), 0.1 * Math.min(W, Hs), null, darker(cS, 0.7), org);
      line(prims, front, add(front, add(mul(F.d, 0.14 * L), mul(F.n, 0.04 * L))), 0.04 * W, darker(cS, 0.65), org);
    }
    if (m.horns) for (const sg of [-1, 1]) line(prims, F.P(L + th, sg * 0.18 * W, 0.12 * Hs), F.P(L + th + 0.3 * L, sg * 0.3 * W, 0.3 * Hs), 0.07 * W, darker(cS, 0.7), org);
    if (male) {
      const c = colorOf(m, 'spor');
      if (m.struct === 'simple' && m.spor > 6) {
        for (let a = 0; a < 5; a++) for (const sg of [-1, 1]) ell(prims, F.P((0.45 + 0.1 * a) * L, sg * 0.18 * W, -0.12 * Hs), 0.09 * W, 0.06 * L, null, c, 'spor');
      } else {
        const k = m.spor || 4;
        for (let i = 0; i < k; i++) { const v = (k === 1 ? 0 : -0.3 + 0.6 * i / (k - 1)) * W; ell(prims, F.P(0.74 * L, v, -0.28 * Hs), 0.1 * W, 0.16 * L, [F.P(0.9 * L, v, -0.28 * Hs), F.P(0.5 * L, v, -0.28 * Hs)], c, 'spor'); }
      }
      return;
    }
    if (m.fleshy === 'galb' && mat) return;           /* the seeds of a galbulus stay inside */
    if (m.struct === 'fused') {
      const k = m.ov || 2, per = Math.min(k, 5), rows = Math.ceil(k / per);
      for (let i = 0; i < k; i++) {
        const row = Math.floor(i / per), col = i % per, nn = Math.min(per, k - row * per);
        const v = (nn === 1 ? 0 : -0.3 + 0.6 * col / (nn - 1)) * W, uu = (0.2 + 0.12 * row) * L, w = 0.06 * L;
        const cc = colorOf(m, mat ? 'seed' : 'ov', stage);
        if (mat && m.wing === 'narrow') ell(prims, F.P(uu, v, w + 0.02 * L), 0.09 * W, 0.08 * L, [F.P(uu, v, w), F.P(uu, v, w + 0.2 * L)], colorOf(m, 'wing', stage), 'wing');
        ell(prims, F.P(uu, v, w + 0.04 * L), (mat ? 0.055 : 0.045) * W, (mat ? 0.07 : 0.06) * L, [F.P(uu, v, w), F.P(uu, v, w + 0.2 * L)], cc, mat ? 'seed' : 'ov');
      }
      void rows;
    } else {
      const cc = colorOf(m, mat ? 'sarc' : 'ov', stage);
      for (const sg of [-1, 1]) ell(prims, F.P(0.7 * L, sg * 0.27 * W, 0), (mat ? 0.19 : 0.15) * W, (mat ? 0.26 : 0.2) * L, [F.P(0.95 * L, sg * 0.27 * W, 0), F.P(0.45 * L, sg * 0.27 * W, 0)], cc, mat ? 'sarc' : 'ov');
    }
  }
  function unitTMISP(prims, F, m, u) {
    const { L, W } = u, c = colorOf(m, 'misp');
    lamina(prims, F, { len: L, wid: () => 0.12 * W, rgb: c, org: 'misp', NU: 4 });
    shield(prims, F, L, 0.08 * L, ellipseOutline(W * 0.8, W * 0.8, 10, 0.9), c, 'misp');
    const k = m.spor || 6, cs = colorOf(m, 'spor');
    for (let i = 0; i < k; i++) { const a = i * 2 * Math.PI / k, v = Math.cos(a) * 0.26 * W, w = Math.sin(a) * 0.26 * W; ell(prims, F.P(0.76 * L, v, w), 0.1 * W, 0.17 * L, [F.P(0.95 * L, v, w), F.P(0.55 * L, v, w)], cs, 'spor'); }
  }
  function unitAMISP(prims, F, m, u) {
    const { L, W } = u, c = colorOf(m, 'misp');
    lamina(prims, F, { len: L, wid: s => W * (0.25 + 0.75 * Math.min(1, s / 0.5)) * (s > 0.82 ? Math.max(0.15, (1 - s) / 0.18) : 1), bend: s => s > 0.75 ? 55 : 0, rgb: c, org: 'misp' });
    const cs = colorOf(m, 'spor'), k = m.spor || 9;
    for (let i = 0; i < k; i++) { const v = (-0.32 + 0.64 * (i % 3) / 2) * W, w = -(0.08 + 0.08 * Math.floor(i / 3)) * L; ell(prims, F.P(0.5 * L, v, w), 0.08 * W, 0.26 * L, [F.P(0.2 * L, v, w), F.P(0.8 * L, v, w)], cs, 'spor'); }
  }
  function unitDIOON(prims, F, m, u) {
    const { L, W, stage } = u, mat = stage === 'mat', c = colorOf(m, 'mgsp', stage);
    lamina(prims, F, { len: L, wid: s => W * (0.3 + 0.7 * Math.sin(Math.PI * Math.min(1, 0.12 + 0.8 * s))) * (s > 0.9 ? Math.max(0.2, (1 - s) / 0.1) : 1), bend: s => s > 0.66 ? 38 : 0, rgb: c, org: 'mgsp' });
    const cc = colorOf(m, mat ? 'sarc' : 'ov', stage);
    for (const sg of [-1, 1]) { const v = sg * 0.2 * W, w = 0.06 * L; ell(prims, F.P(0.2 * L, v, w), (mat ? 0.16 : 0.12) * W, (mat ? 0.15 : 0.12) * L, [F.P(0.32 * L, v, w), F.P(0.08 * L, v, w)], cc, mat ? 'sarc' : 'ov'); }
  }
  function unitARAU(prims, F, m, u) {
    const { L, W, stage } = u, mat = stage === 'mat', c = colorOf(m, 'bscale', stage);
    if (mat && m.wing) lamina(prims, F, { x0: 0.25 * L, len: 0.55 * L, w0: 0.012 * L, wid: s => W * 0.92 * Math.sin(Math.PI * (0.1 + 0.8 * s)), rgb: colorOf(m, 'wing', stage), org: 'wing' });
    const e = lamina(prims, F, { len: L, w0: 0.02 * L, wid: s => W * (0.22 + 0.5 * Math.pow(s, 0.6)) * (s > 0.9 ? Math.max(0.3, (1 - s) / 0.1) : 1), rgb: c, org: 'bscale' });
    line(prims, e.end, add(e.end, add(mul(F.d, 0.12 * L), mul(F.n, 0.16 * L))), 0.05 * W, darker(c, 0.65), 'bscale');
    const cc = colorOf(m, mat ? 'seed' : 'ov', stage);
    ell(prims, F.P(0.5 * L, 0, 0.05 * L), (mat ? 0.15 : 0.1) * W, (mat ? 0.2 : 0.13) * L, [F.P(0.7 * L, 0, 0.05 * L), F.P(0.3 * L, 0, 0.05 * L)], cc, mat ? 'seed' : 'ov');
  }
  const UNIT = { bs: unitBS, misp: unitMISP, cmisp: unitCMISP, pelt: unitPELT, tmisp: unitTMISP, amisp: unitAMISP, dioon: unitDIOON, arau: unitARAU };

  /* ---------------- a whole cone ---------------- */
  const PROFILE = {
    ovoid: t => Math.max(0.28, Math.pow(Math.sin(Math.PI * Math.pow(t, 0.78)), 0.72)),
    cyl: t => Math.max(0.35, Math.min(1, 1.12 * Math.pow(Math.sin(Math.PI * t), 0.35))),
    glob: t => Math.max(0.3, Math.pow(Math.sin(Math.PI * t), 0.55)),
    conic: t => Math.max(0.2, Math.pow(Math.sin(Math.PI * Math.pow(t, 0.6)), 0.8)),
  };
  /* elevation of the members, closed and fully open (degrees above the horizontal) */
  const BETA = { bs: [56, 8], misp: [42, 4], cmisp: [40, 8], dioon: [48, 12], amisp: [34, 6], arau: [24, 4], pelt: [0, 0], tmisp: [0, 0] };
  function place(m) {
    const n = m.n, out = [];
    if (m.phyl === 'decussate' || m.phyl === 'whorl3') {
      const k = m.phyl === 'decussate' ? 2 : 3, tiers = Math.ceil(n / k);
      for (let i = 0; i < n; i++) { const p = Math.floor(i / k), j = i % k; out.push({ th: (p % 2 ? 180 / k : 0) + j * 360 / k, t: (p + 0.5) / tiers, p, tiers }); }
    } else if (m.phyl === 'rows') {
      const r = m.rows || 8, tiers = Math.ceil(n / r);
      for (let i = 0; i < n; i++) { const p = Math.floor(i / r), j = i % r; out.push({ th: j * 360 / r + (p % 2 ? 180 / r : 0), t: (p + 0.5) / tiers, p, tiers }); }
    } else for (let i = 0; i < n; i++) out.push({ th: i * 137.508, t: (i + 0.5) / n });
    return out;
  }
  function buildCone(prims, m, o) {
    const stage = o.stage, open = o.open || 0;
    const H = m.L, R = m.D / 2, unit = m.unit;
    const radial = m.shape === 'glob' && (unit === 'pelt' || unit === 'tmisp' || unit === 'arau');
    const ra = R * (unit === 'bs' ? 0.13 : unit === 'misp' || unit === 'amisp' ? 0.2 : radial ? 0.14 : 0.16);
    const cAx = colorOf(m, 'axis', stage);
    /* the axis and a short peduncle */
    const top = radial ? H * 0.72 : H * 0.98;
    revolve(prims, [[ra * 0.7, -0.06 * H], [ra * 0.75, 0], [ra, 0.02 * H], [ra, top - ra], [ra * 0.6, top], [0, top + ra * 0.2]], 10, { rgb: cAx, org: 'axis' });
    const fn = UNIT[unit];
    const pos = place(m);
    const beta = BETA[unit] || [40, 5];
    const prof = PROFILE[m.shape] || PROFILE.ovoid;
    if (radial && m.fleshy === 'galb') {
      /* a juniper cone: a small ball of scales that fuse into a smooth fleshy galbulus; only their tips show */
      const zc = H * 0.5, Rg = R * (stage === 'mat' ? 0.92 : 0.72), cG = colorOf(m, 'bscale', stage), prof = [];
      for (let k = 0; k <= 12; k++) { const a = -90 + 180 * k / 12; prof.push([Rg * Math.cos(rad(a)), zc + Rg * Math.sin(rad(a))]); }
      revolve(prims, prof, 18, { rgb: cG, org: 'bscale' });
      pos.forEach(p => {
        const lat = p.tiers ? -50 + 100 * (p.p + 0.5) / p.tiers : 0;
        const F = frame([0, 0, zc], p.th, lat);
        ell(prims, F.P(Rg * 1.01, 0, 0), 0.07 * R, 0.07 * R, null, darker(cG, 0.72), 'bscale');
      });
      return;
    }
    if (radial) {
      /* members radiate from the centre, like a ball */
      const zc = H * 0.5, k = pos.length;
      pos.forEach((p, i) => {
        let lat;
        if (p.tiers) lat = -62 + 124 * (p.p + 0.5) / p.tiers;
        else lat = Math.asin(-0.84 + 1.68 * (i + 0.5) / k) * 180 / Math.PI;
        const latO = lat + Math.sign(lat || 1) * open * 18;
        const area = 4 * Math.PI * R * R / k;
        const s = Math.sqrt(area) * (p.tiers ? 1.02 : 0.98) * (1 - 0.25 * open);
        const Wd = p.tiers && m.phyl === 'decussate' ? Math.min(R * 1.5, s * 1.25) : s, Hd = p.tiers && m.phyl === 'decussate' ? s * 0.85 : s;
        const Lu = R * (0.8 + 0.3 * open) - (unit === 'arau' ? 0 : 0.12 * R);
        const F = frame([0, 0, zc], p.th, latO);
        fn(prims, F, m, { L: Lu, W: unit === 'arau' ? s * 1.5 : Wd, Hs: Hd, stage, t: p.t });
      });
      return;
    }
    pos.forEach(p => {
      const t = p.t, r = prof(t) * R;
      const z = H * (0.03 + 0.93 * t);
      let be = beta[0] + (beta[1] - beta[0]) * open;
      if (unit === 'pelt') be = (t - 0.5) * 2 * open * 30;
      const Lu = Math.max(0.12 * R, (r - ra) / Math.cos(rad(beta[0])));
      let W;
      if (m.phyl === 'rows') W = 2 * Math.PI * r / (m.rows || 8) * 0.97;
      else if (m.phyl === 'decussate') W = Math.PI * r * 0.8;
      else W = 2 * Math.PI * (ra + Lu * Math.cos(rad(beta[0]))) / (unit === 'bs' ? 7.2 : unit === 'misp' ? 8.5 : 8) * 1.05;
      const Hs = p.tiers ? H / p.tiers * (m.phyl === 'decussate' || m.phyl === 'whorl3' ? 1.75 : 0.94) : W * 0.8;
      const F = frame([0, 0, z], p.th, be);
      fn(prims, F, m, { L: unit === 'pelt' ? Math.max(0.1 * R, r - ra - 0.12 * Lu) : Lu, W: unit === 'pelt' ? W * (1 - 0.2 * open) : W, Hs: Hs * (1 - 0.2 * open), stage, t });
    });
  }

  /* ---------------- structures that are not cones ---------------- */
  function buildCrown(prims, m, o) {
    const stage = o.stage, mat = stage === 'mat', open = o.open || 0, Rs = 14, n = m.n || 16;
    revolve(prims, [[Rs, -34], [Rs * 1.02, -4], [Rs * 0.8, 4], [Rs * 0.4, 8], [0, 9]], 14, { rgb: colorOf(m, 'stem', stage), org: 'stem' });
    const c = colorOf(m, 'mgsp', stage), L = 62, cc = colorOf(m, mat ? 'sarc' : 'ov', stage);
    for (let i = 0; i < n; i++) {
      const th = i * 137.508, f = i / n;
      const be = 76 - 38 * f - 25 * open;
      const F = frame([Math.sin(rad(th)) * Rs * 0.55, -Math.cos(rad(th)) * Rs * 0.55, 2 + 5 * (1 - f)], th, be);
      const stalkW = 3.2;
      lamina(prims, F, { len: L, NU: 30, wid: s => s < 0.55 ? stalkW : stalkW * 2.2 + (Math.sin(s * Math.PI * 22) > 0 ? 7 * Math.sin(Math.PI * (s - 0.5) / 0.55) : 0), bend: s => s > 0.5 ? -(s - 0.5) * 90 : 0, rgb: c, org: 'mgsp' });
      for (const sg of [-1, 1]) for (let k = 0; k < 3; k++) {
        const uu = (0.16 + 0.12 * k) * L, v = sg * (stalkW / 2 + (mat ? 2.6 : 1.8));
        ell(prims, F.P(uu, v, 0.3), mat ? 2.8 : 1.8, mat ? 3.4 : 2.2, [F.P(uu - 3, v, 0.3), F.P(uu + 3, v, 0.3)], cc, mat ? 'sarc' : 'ov');
      }
    }
  }
  function fanLeaf(prims, base, dir, len, rgb) {
    const F = frameDir(base, dir);
    line(prims, base, F.P(len * 0.55, 0, 0), 0.7, darker(rgb, 0.8), 'leaf');
    const c = F.P(len * 0.55, 0, 0), pts = [c];
    for (let k = 0; k <= 12; k++) { const a = rad(-55 + 110 * k / 12); const rr = len * 0.45 * (k === 6 ? 0.82 : 1); pts.push(add(c, add(mul(F.d, Math.cos(a) * rr), mul(F.t, Math.sin(a) * rr)))); }
    prims.push({ kind: 'poly', pts, outline: pts.concat([c]), rgb, org: 'leaf' });
  }
  function buildGinkgo(prims, m, o) {
    const stage = o.stage, mat = stage === 'mat';
    revolve(prims, [[3.2, -16], [3.4, 0], [3.0, 14], [2.2, 18], [0, 19]], 10, { rgb: colorOf(m, 'ped', stage).map(c => Math.round(c * 0.85)), org: 'ped' });
    const leafC = colorOf(m, 'leaf', stage);
    [[0, 30], [140, 20], [250, 38]].forEach(([a, e]) => fanLeaf(prims, [0, 0, 16], [Math.sin(rad(a)) * Math.cos(rad(e)), -Math.cos(rad(a)) * Math.cos(rad(e)), Math.sin(rad(e))], 46, leafC));
    if (m.sex === 'm') {
      /* a hanging catkin: a thin axis with loose microsporophylls */
      const base = [2, 1, 17], dir = norm([0.55, -0.35, -0.55]), len = 42;
      const A = frameDir(base, dir);
      line(prims, base, A.P(len, 0, 0), 1.1, colorOf(m, 'axis', stage), 'axis');
      const n = m.n || 34;
      for (let i = 0; i < n; i++) {
        const s = 4 + (len - 6) * i / n, a = rad(i * 137.508);
        const p0 = A.P(s, 0, 0), out = norm(add(mul(A.t, Math.cos(a)), mul(A.n, Math.sin(a))));
        const tip = add(add(p0, mul(out, 4.2)), mul(A.d, 1.2));
        line(prims, p0, tip, 0.45, colorOf(m, 'misp', stage), 'misp');
        for (const sg of [-1, 1]) { const side = norm(crossV(out, A.d)); const c = add(add(tip, mul(side, sg * 0.9)), mul(A.d, 1.2)); ell(prims, c, 0.9, 1.6, [add(c, mul(A.d, -1)), add(c, mul(A.d, 1))], colorOf(m, 'spor', stage), 'spor'); }
      }
      return;
    }
    [[35, 58], [215, 64]].forEach(([a, e], j) => {
      const dir = [Math.sin(rad(a)) * Math.cos(rad(e)), -Math.cos(rad(a)) * Math.cos(rad(e)), Math.sin(rad(e))];
      const base = [0, 0, 18], P = frameDir(base, dir);
      const tip = P.P(34, 0, 0);
      line(prims, base, tip, 1.2, colorOf(m, 'ped', stage), 'ped');
      for (const sg of [-1, 1]) {
        const bdir = norm(add(P.d, mul(P.t, sg * 0.75)));
        const cBase = add(tip, mul(bdir, 3.5));
        line(prims, tip, cBase, 0.9, colorOf(m, 'ped', stage), 'ped');
        const ripe = mat && sg === 1 && j === 0;
        ell(prims, cBase, ripe ? 4.2 : 2.6, 1.1, [add(cBase, mul(bdir, -1)), add(cBase, mul(bdir, 1))].reverse(), colorOf(m, 'collar', stage), 'collar');
        const r1 = ripe ? 9 : mat ? 1.8 : 2.4, r2 = ripe ? 10.5 : mat ? 2.2 : 3.2;
        const oc = add(cBase, mul(bdir, r2 + 0.6));
        ell(prims, oc, r1, r2, [add(oc, mul(bdir, -1)), add(oc, mul(bdir, 1))], ripe ? colorOf(m, 'sarc', stage) : mat ? [150, 120, 80] : colorOf(m, 'ov', stage), ripe ? 'sarc' : 'ov');
      }
    });
  }
  function buildTaxus(prims, m, o) {
    const stage = o.stage, mat = stage === 'mat';
    revolve(prims, [[1.3, -6], [1.3, 0], [1.1, 8], [0.9, 9.2]], 8, { rgb: [120, 110, 70], org: 'bract' });
    const cB = colorOf(m, 'bract', stage);
    for (let p = 0; p < 4; p++) for (const j of [0, 1]) {
      const F = frame([0, 0, 0.6 + p * 2.1], (p % 2 ? 90 : 0) + j * 180, 72 - p * 4);
      lamina(prims, F, { len: 4.6 - p * 0.35, w0: 0.2, wid: s => 3.6 * Math.pow(Math.sin(Math.PI * (0.1 + 0.85 * s)), 0.7), rgb: cB, org: 'bract', NU: 8 });
    }
    const cA = colorOf(m, 'aril', stage);
    if (mat) {
      revolve(prims, [[1.2, 8.4], [3.4, 9.2], [4.1, 11.5], [3.6, 13.6], [2.8, 14.2]], 16, { rgb: cA, org: 'aril' });
      prims.push({ kind: 'ell3', c: [0, 0, 12.4], rx: 2.5, rz: 3.8, rgb: colorOf(m, 'seed', stage), org: 'seed' });
    } else {
      revolve(prims, [[1.1, 8.6], [1.9, 9.0], [2.0, 9.6]], 12, { rgb: [150, 170, 110], org: 'aril' });
      prims.push({ kind: 'ell3', c: [0, 0, 11.2], rx: 1.7, rz: 2.5, rgb: colorOf(m, 'ov', stage), org: 'ov' });
    }
  }
  function buildPodo(prims, m, o) {
    const stage = o.stage, mat = stage === 'mat';
    line(prims, [0, 0, -16], [0, 0, 0.5], 1.5, colorOf(m, 'ped', stage), 'ped');
    const k = mat ? 1.35 : 0.8, cR = colorOf(m, 'rec', stage);
    revolve(prims, [[0.8, 0], [3.2 * k, 1.4 * k], [4 * k, 4 * k], [3.6 * k, 6.5 * k], [2.2 * k, 7.6 * k], [0, 7.9 * k]], 14, { rgb: cR, org: 'rec' });
    for (const sg of [-1, 1]) {
      const F = frame([sg * 2.2 * k, 0, 6.8 * k], sg > 0 ? 90 : 270, 55);
      lamina(prims, F, { len: 2.4 * k, wid: s => 1.6 * k * (1 - s), rgb: darker(cR, 0.92), org: 'rec', NU: 4 });
    }
    const zS = 7.6 * k + (mat ? 4.6 : 2.8);
    prims.push({ kind: 'ell3', c: [0.8, 0, zS], rx: mat ? 4.2 : 2.4, rz: mat ? 5 : 3.1, rgb: colorOf(m, 'epim', stage), org: 'epim' });
  }
  function buildEphedra(prims, m, o) {
    const stage = o.stage, mat = stage === 'mat', male = m.sex === 'm', n = m.n || 3;
    const topZ = 1.5 + n * 2.9;
    revolve(prims, [[1.1, -8], [1.1, 0], [1, topZ], [0.6, topZ + 0.6]], 8, { rgb: [120, 150, 80], org: 'axis' });
    const cB = colorOf(m, 'bract', stage);
    const fleshyB = !male && mat && m.fleshy === 'bracts';
    for (let p = 0; p < n; p++) for (const j of [0, 1]) {
      const th = (p % 2 ? 90 : 0) + j * 180, z = 1.2 + p * 2.9;
      const F = frame([0, 0, z], th, male ? 58 : 66);
      lamina(prims, F, { len: male ? 3.4 : 4.4 - p * 0.3, w0: 0.1, wid: s => (male ? 3.4 : 4.2) * Math.pow(Math.sin(Math.PI * (0.08 + 0.87 * s)), 0.6), rgb: fleshyB ? hexRGB('#d23b2f') : cB, org: 'bract', NU: 8 });
      if (male) {
        const Fu = frame([0, 0, z + 0.9], th, 72);
        ell(prims, Fu.P(1.6, 0, 0.5), 0.8, 1.3, [Fu.P(0.6, 0, 0.5), Fu.P(2.6, 0, 0.5)], colorOf(m, 'env', stage), 'env');
        const a = Fu.P(1.8, 0, 0.6), b = Fu.P(6.2, 0, 1.2);
        line(prims, a, b, 0.4, colorOf(m, 'anth', stage), 'anth');
        const k = m.spor || 5;
        for (let q = 0; q < k; q++) { const ang = q * 2 * Math.PI / k; ell(prims, add(b, add(mul(Fu.t, Math.cos(ang) * 0.75), mul(Fu.n, Math.sin(ang) * 0.75))), 0.55, 0.55, null, colorOf(m, 'syn', stage), 'syn'); }
      }
    }
    if (!male) {
      const k = m.ov || 1;
      for (let q = 0; q < k; q++) {
        const x = k === 1 ? 0 : (q ? 1.3 : -1.3), z = topZ + 1.4;
        prims.push({ kind: 'ell3', c: [x, 0, z], rx: 1.4, rz: 2.6, rgb: mat ? colorOf(m, 'seed', stage) : colorOf(m, 'env', stage), org: mat ? 'seed' : 'env' });
        line(prims, [x, 0, z + 2.3], [x * 1.25, 0, z + 5.2], 0.45, colorOf(m, 'tub', stage), 'tub');
      }
    }
  }

  function build(src, o) {
    o = Object.assign({ stage: 'mat', open: 0 }, o || {});
    const m = CM.normalize(src);
    if (m.sex === 'm') o.stage = 'mat';
    const prims = [];
    switch (m.kind) {
      case 'crown': buildCrown(prims, m, o); break;
      case 'ginkgo': buildGinkgo(prims, m, o); break;
      case 'taxus': buildTaxus(prims, m, o); break;
      case 'podo': buildPodo(prims, m, o); break;
      case 'ephedra': buildEphedra(prims, m, o); break;
      default: buildCone(prims, m, o);
    }
    return { prims, m, stage: o.stage };
  }
  const opensUp = m => (m.kind === 'cone' && m.fleshy !== 'galb') || m.kind === 'crown';
  const VIEW = { cone: [-22, 12], crown: [-20, 28], ginkgo: [-30, 16], taxus: [-24, 14], podo: [-24, 10], ephedra: [-24, 14] };

  /* ---------------- mount ---------------- */
  function mount(host, model, opts) {
    const v0 = VIEW[model.kind] || VIEW.cone;
    opts = Object.assign({ az: v0[0], el: v0[1], open: 0, stage: 'mat', height: 330, drag: true }, opts || {});
    const st = { model, stage: opts.stage, open: opts.open, az: opts.az, el: opts.el, hl: null, spin: false, raf: 0 };
    const ratio = opts.height / 300;
    host.innerHTML = '';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'f3d c3d');
    svg.setAttribute('role', 'img');
    host.appendChild(svg);
    let scene = null;
    function fit() {
      const e = Flower3D.extent(scene, st.el);
      const w = e.x1 - e.x0, h = e.y1 - e.y0, pad = Math.max(w, h) * 0.06;
      let vx = e.x0 - pad, vw = w + 2 * pad, vy = e.y0 - pad, vh = h + 2 * pad;
      if (vh / vw < ratio) { const nh = vw * ratio; vy -= (nh - vh) / 2; vh = nh; } else { const nw = vh / ratio; vx -= (nw - vw) / 2; vw = nw; }
      svg.setAttribute('viewBox', `${f1(vx)} ${f1(vy)} ${f1(vw)} ${f1(vh)}`);
    }
    function rebuild(refit) { scene = build(st.model, { stage: st.stage, open: st.open }); if (refit !== false) fit(); draw(); }
    function draw() { svg.innerHTML = Flower3D.render(scene, { az: st.az, el: st.el }).map(x => x.svg).join(''); applyHL(); }
    function applyHL() {
      svg.classList.toggle('has-hl', !!st.hl);
      svg.querySelectorAll('.p3').forEach(nd => nd.classList.toggle('hl', !!st.hl && nd.getAttribute('data-org') === st.hl));
    }
    let drag = null;
    if (opts.drag) {
      svg.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, az: st.az, el: st.el }; st.spin = false; svg.setPointerCapture(e.pointerId); });
      svg.addEventListener('pointermove', e => {
        if (drag) { st.az = drag.az - (e.clientX - drag.x) * 0.6; st.el = Math.max(-40, Math.min(88, drag.el + (e.clientY - drag.y) * 0.4)); draw(); return; }
        const t = e.target.closest && e.target.closest('[data-org]');
        if (opts.onHover) opts.onHover(t ? t.getAttribute('data-org') : null);
      });
      svg.addEventListener('pointerup', () => { if (drag && drag.el !== st.el) fit(); drag = null; draw(); });
      svg.addEventListener('pointerleave', () => { if (opts.onHover) opts.onHover(null); });
    }
    function loop() { if (st.spin) { st.az += 0.35; draw(); } st.raf = requestAnimationFrame(loop); }
    rebuild();
    return {
      set(m, stage) { st.model = m; if (stage) st.stage = stage; const v = VIEW[m.kind] || VIEW.cone; st.az = v[0]; st.el = v[1]; rebuild(); },
      setStage(s) { st.stage = s; rebuild(); },
      setOpen(v) { st.open = v; rebuild(false); },
      refit() { fit(); draw(); },
      setView(az, el) { if (az != null) st.az = az; if (el != null) st.el = el; fit(); draw(); },
      spin(on) { st.spin = on; if (on && !st.raf) st.raf = requestAnimationFrame(loop); },
      highlight(org) { st.hl = org; applyHL(); },
      get state() { return st; },
      svg,
      destroy() { cancelAnimationFrame(st.raf); host.innerHTML = ''; },
    };
  }

  /* a still picture: no interaction, framed tightly; focus dims all but one part */
  function staticSVG(model, o) {
    const v = VIEW[model.kind] || VIEW.cone;
    o = Object.assign({ az: v[0], el: v[1], open: 0, stage: 'mat', ratio: 1, focus: null }, o || {});
    const scene = build(model, { stage: o.stage, open: o.open });
    const e = Flower3D.extent(scene, o.el, [o.az]);
    const w = e.x1 - e.x0, h = e.y1 - e.y0, pad = Math.max(w, h) * 0.06;
    let vx = e.x0 - pad, vy = e.y0 - pad, vw = w + 2 * pad, vh = h + 2 * pad;
    if (vh / vw < o.ratio) { const nh = vw * o.ratio; vy -= (nh - vh) / 2; vh = nh; } else { const nw = vh / o.ratio; vx -= (nw - vw) / 2; vw = nw; }
    let items = Flower3D.render(scene, { az: o.az, el: o.el }).map(x => x.svg).join('');
    if (o.focus) items = items.replace(new RegExp(`class="p3" data-org="${o.focus}"`, 'g'), `class="p3 hl" data-org="${o.focus}"`);
    return `<svg class="f3d c3d still${o.focus ? ' has-hl' : ''}" viewBox="${f1(vx)} ${f1(vy)} ${f1(vw)} ${f1(vh)}" xmlns="http://www.w3.org/2000/svg" role="img">${items}</svg>`;
  }

  const colorHex = (m, org, stage) => { const c = colorOf(CM.normalize(m), org, stage); return `rgb(${c[0]},${c[1]},${c[2]})`; };
  return { build, mount, staticSVG, opensUp, frame, place, colorHex, PROFILE, BETA };
})();
window.Cone3D = Cone3D;
