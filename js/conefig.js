/* FloralPro — flat figures of the strobili (Block 7).

   ConeFig.diagram(m, o)  the members seen from above, numbered in the order in
                          which they arise (for a spiral, one turn: each member
                          about 137.5° from the one before); what lies underneath
                          is drawn with a dashed line.
   ConeFig.section(m, o)  longitudinal section through the axis, with the names
                          of the parts on the right (o.labels).
   ConeFig.unit(m, o)     one member, enlarged: in profile and from above; for
                          the structures that are not cones, young and ripe side
                          by side.
   All figures mark their parts with data-org so they light up together with the
   3D view. o.stage: 'pol' | 'mat'; o.focus: dims all but one part. */

const ConeFig = (function () {
  const f1 = v => (Math.round(v * 10) / 10).toString();
  const rad = d => d * Math.PI / 180;
  const INK = '#4b3b32';
  const lang = () => (window.I18N && I18N.lang === 'en') ? 'en' : 'es';
  const col = (m, org, st) => Cone3D.colorHex(m, org, st);
  /* short names for the labels of the figures */
  const SHORT = { bscale: ['Escama (bráctea y escama unidas)', 'Scale (bract and scale fused)'], spor: ['Microsporangio', 'Microsporangium'], env: ['Envoltura', 'Envelope'], mic: ['Micrópilo', 'Micropyle'], gam: ['Gametófito femenino', 'Female gametophyte'], scl: ['Esclerotesta (capa dura)', 'Sclerotesta (hard layer)'], emb: ['Embrión', 'Embryo'], nuc: ['Nucela', 'Nucellus'] };
  const name = org => SHORT[org] ? SHORT[org][lang() === 'en' ? 1 : 0] : GYMNO.ORG[org] ? GYMNO.ORG[org][lang()] : org;
  const labelOrg = { mic: 'ov', gam: 'seed', scl: 'seed', emb: 'seed', nuc: 'ov' };

  /* ---------------- a pen that keeps the bounds and the label anchors ---------------- */
  function Pen(sw) {
    sw = sw || 1;
    const P = { s: '', x0: 1e9, x1: -1e9, y0: 1e9, y1: -1e9, anchors: [] };
    const ext = (x, y) => { P.x0 = Math.min(P.x0, x); P.x1 = Math.max(P.x1, x); P.y0 = Math.min(P.y0, y); P.y1 = Math.max(P.y1, y); };
    P.poly = (pts, fill, org, o) => {
      o = o || {};
      pts.forEach(p => ext(p[0], p[1]));
      const d = 'M' + pts.map(p => f1(p[0]) + ',' + f1(p[1])).join('L') + (o.open ? '' : 'Z');
      P.s += `<path class="c-o" data-org="${org}" d="${d}" fill="${o.open ? 'none' : fill}" stroke="${o.stroke || INK}" stroke-width="${f1(2 * (o.w || 0.4) * sw) / 2}"${o.dash ? ` stroke-dasharray="${f1(1.6 * sw)} ${f1(1.1 * sw)}"` : ''}${o.op ? ` fill-opacity="${o.op}"` : ''} stroke-linejoin="round"/>`;
    };
    P.ell = (cx, cy, rx, ry, rot, fill, org, o) => {
      o = o || {};
      ext(cx - Math.max(rx, ry), cy - Math.max(rx, ry)); ext(cx + Math.max(rx, ry), cy + Math.max(rx, ry));
      P.s += `<ellipse class="c-o" data-org="${org}" cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" transform="rotate(${f1(rot || 0)} ${f1(cx)} ${f1(cy)})" fill="${o.none ? 'none' : fill}" stroke="${o.stroke || INK}" stroke-width="${f1(2 * (o.w || 0.4) * sw) / 2}"${o.dash ? ` stroke-dasharray="${f1(1.4 * sw)} ${f1(sw)}"` : ''}/>`;
    };
    P.line = (pts, stroke, w, org, o) => {
      o = o || {};
      pts.forEach(p => ext(p[0], p[1]));
      P.s += `<path class="c-o" data-org="${org}" d="M${pts.map(p => f1(p[0]) + ',' + f1(p[1])).join('L')}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round"${o.dash ? ' stroke-dasharray="1.4 1"' : ''}/>`;
    };
    P.text = (x, y, t, o) => { o = o || {}; P.s += `<text x="${f1(x)}" y="${f1(y)}" class="${o.cls || 'cf-num'}"${o.anchor ? ` text-anchor="${o.anchor}"` : ''}${o.size ? ` style="font-size:${f1(o.size)}px"` : ''}>${t}</text>`; };
    P.anchor = (x, y, key) => { if (!P.anchors.some(a => a.key === key)) P.anchors.push({ x, y, key }); };
    P.raw = s => { P.s += s; };
    return P;
  }
  /* local (u along the member, w above it) → page, for a member leaving (ox, oy) at elevation be on side sd */
  const Tf = (ox, oy, be, sd) => (u, w) => [ox + sd * (u * Math.cos(rad(be)) - w * Math.sin(rad(be))), oy - (u * Math.sin(rad(be)) + w * Math.cos(rad(be)))];
  const mapP = (T, L, pts) => pts.map(([u, w]) => T(u * L, w * L));
  const rotOf = (be, sd) => sd > 0 ? -be : be;

  /* ---------------- members in profile (u along, w above) ---------------- */
  const SIDE = {
    bs(P, m, T, L, st, a, be, sd) {
      const mat = st === 'mat', apo = m.apo && mat;
      const br = m.bract === 'exserted' ? [[0, -0.01], [0.82, -0.015], [1.0, -0.09], [1.08, -0.27], [1.03, -0.27], [0.95, -0.11], [0.8, -0.05], [0, -0.05]] : [[0, -0.012], [0.3, -0.03], [0.34, -0.05], [0.3, -0.07], [0, -0.06]];
      P.poly(mapP(T, L, br), col(m, 'bract', st), 'bract');
      const sc = apo ? [[0, 0], [0.76, 0], [0.9, -0.07], [1.0, -0.03], [1.01, 0.1], [0.9, 0.13], [0.76, 0.08], [0, 0.035]] : [[0, 0], [0.9, 0.005], [1.0, 0.03], [0.98, 0.055], [0.9, 0.06], [0, 0.03]];
      P.poly(mapP(T, L, sc), col(m, 'scale', st), 'scale');
      if (apo) { const [x, y] = T(1.0 * L, m.umbo === 'terminal' ? 0.1 * L : 0.035 * L); P.ell(x, y, 0.03 * L, 0.03 * L, 0, INK, 'scale'); }
      const rot = rotOf(be, sd);
      if (!mat) {
        const [x, y] = T(0.17 * L, 0.075 * L); P.ell(x, y, 0.085 * L, 0.038 * L, rot, col(m, 'ov', st), 'ov');
        const [mx, my] = T(0.082 * L, 0.075 * L); P.ell(mx, my, 0.012 * L, 0.012 * L, 0, INK, 'ov');
        if (a) { P.anchor(x, y, 'ov'); P.anchor(mx, my, 'mic'); }
      } else {
        if (m.wing) P.poly(mapP(T, L, [[0.2, 0.06], [0.62, 0.068], [0.6, 0.1], [0.22, 0.1]]), col(m, 'wing', st), 'wing');
        const [x, y] = T(0.15 * L, 0.075 * L); P.ell(x, y, (m.wing ? 0.065 : 0.1) * L, (m.wing ? 0.035 : 0.05) * L, rot, col(m, 'seed', st), 'seed');
        if (a) { P.anchor(x, y, 'seed'); if (m.wing) { const [wx, wy] = T(0.45 * L, 0.085 * L); P.anchor(wx, wy, 'wing'); } }
      }
      if (a) { const [bx, by] = T((m.bract === 'exserted' ? 0.95 : 0.22) * L, -0.05 * L); P.anchor(bx, by, 'bract'); const [sx, sy] = T(0.6 * L, 0.02 * L); P.anchor(sx, sy, 'scale'); }
    },
    misp(P, m, T, L, st, a, be, sd) {
      P.poly(mapP(T, L, [[0, -0.02], [0.68, -0.02], [0.78, 0.02], [0.86, 0.2], [0.8, 0.22], [0.7, 0.07], [0, 0.03]]), col(m, 'misp', st), 'misp');
      const [x, y] = T(0.4 * L, -0.075 * L); P.ell(x, y, 0.22 * L, 0.055 * L, rotOf(be, sd), col(m, 'spor', st), 'spor');
      if (a) { P.anchor(x, y, 'spor'); const [sx, sy] = T(0.8 * L, 0.12 * L); P.anchor(sx, sy, 'misp'); }
    },
    cmisp(P, m, T, L, st, a, be, sd) {
      P.poly(mapP(T, L, [[0, -0.02], [0.75, -0.04], [0.9, 0.05], [1.0, 0.25], [0.95, 0.26], [0.82, 0.1], [0.6, 0.06], [0, 0.03]]), col(m, 'misp', st), 'misp');
      for (let k = 0; k < 4; k++) { const [x, y] = T((0.3 + 0.14 * k) * L, -0.07 * L); P.ell(x, y, 0.045 * L, 0.03 * L, rotOf(be, sd), col(m, 'spor', st), 'spor'); if (a && k === 2) P.anchor(x, y, 'spor'); }
      if (a) { const [sx, sy] = T(0.9 * L, 0.12 * L); P.anchor(sx, sy, 'misp'); }
    },
    pelt(P, m, T, L, st, a, be, sd, hs) {
      const mat = st === 'mat', male = m.sex === 'm', org = male ? 'misp' : CM.femaleOrg(m), h = (hs || 0.3 * L) / L;
      if (m.fleshy === 'galb') P.poly(mapP(T, L, [[0, -0.05], [0.88, -h * 0.85], [0.88, h * 0.85], [0, 0.05]]), col(m, org, st), org);
      else P.poly(mapP(T, L, [[0, -0.035], [0.88, -0.035], [0.88, 0.035], [0, 0.035]]), col(m, org, st), org);
      P.poly(mapP(T, L, [[0.86, -h], [1.0, -h * 0.9], [1.0, h * 0.9], [0.86, h]]), col(m, org, st), org);
      if (m.umbo === 'mucro') P.poly(mapP(T, L, [[1.0, -0.04], [1.12, 0.01], [1.0, 0.05]]), col(m, org, st), org);
      if (m.horns) P.line(mapP(T, L, [[1.0, 0.06], [1.2, 0.2]]), INK, 0.035 * L, org);
      if (a) { const [x, y] = T(0.95 * L, h * 0.5 * L); P.anchor(x, y, org); }
      if (male) {
        const k = m.struct === 'simple' && m.spor > 6 ? 3 : 1;
        for (let i = 0; i < k; i++) { const [x, y] = T((k === 1 ? 0.72 : 0.5 + 0.14 * i) * L, -0.1 * L); P.ell(x, y, (k === 1 ? 0.12 : 0.06) * L, 0.05 * L, rotOf(be, sd), col(m, 'spor', st), 'spor'); if (a && i === 0) P.anchor(x, y, 'spor'); }
        return;
      }
      if (m.struct === 'fused') {
        const k = Math.min(3, m.ov || 1);
        for (let i = 0; i < k; i++) {
          const [x, y] = T((0.16 + 0.08 * i) * L, 0.1 * L);
          if (mat && m.wing === 'narrow') P.ell(x, y, 0.045 * L, 0.075 * L, rotOf(be, sd), col(m, 'wing', st), 'wing');
          P.ell(x, y, 0.025 * L, 0.06 * L, rotOf(be, sd), col(m, mat ? 'seed' : 'ov', st), mat ? 'seed' : 'ov');
          if (a && i === 0) { P.anchor(x, y, mat ? 'seed' : 'ov'); if (!mat) { const [mx, my] = T(0.16 * L, 0.16 * L); P.ell(mx, my, 0.01 * L, 0.01 * L, 0, INK, 'ov'); P.anchor(mx, my, 'mic'); } }
        }
      } else {
        const [x, y] = T(0.64 * L, 0.13 * L);
        P.ell(x, y, (mat ? 0.22 : 0.18) * L, (mat ? 0.11 : 0.08) * L, rotOf(be, sd), col(m, mat ? 'sarc' : 'ov', st), mat ? 'sarc' : 'ov');
        if (a) P.anchor(x, y, mat ? 'sarc' : 'ov');
        if (a && !mat) { const [mx, my] = T(0.47 * L, 0.13 * L); P.ell(mx, my, 0.012 * L, 0.012 * L, 0, INK, 'ov'); P.anchor(mx, my, 'mic'); }
      }
    },
    tmisp(P, m, T, L, st, a, be, sd) {
      P.poly(mapP(T, L, [[0, -0.03], [0.86, -0.03], [0.86, 0.03], [0, 0.03]]), col(m, 'misp', st), 'misp');
      P.poly(mapP(T, L, [[0.84, -0.3], [0.96, -0.3], [0.96, 0.3], [0.84, 0.3]]), col(m, 'misp', st), 'misp');
      for (const w of [-0.14, 0.14]) { const [x, y] = T(0.7 * L, w * L); P.ell(x, y, 0.13 * L, 0.065 * L, rotOf(be, sd), col(m, 'spor', st), 'spor'); if (a && w < 0) P.anchor(x, y, 'spor'); }
      if (a) { const [x, y] = T(0.92 * L, 0.25 * L); P.anchor(x, y, 'misp'); }
    },
    amisp(P, m, T, L, st, a, be, sd) {
      P.poly(mapP(T, L, [[0, -0.02], [0.7, -0.03], [0.85, 0.05], [0.95, 0.22], [0.88, 0.24], [0.75, 0.08], [0, 0.03]]), col(m, 'misp', st), 'misp');
      for (const w of [-0.07, -0.14]) { const [x, y] = T(0.46 * L, w * L); P.ell(x, y, 0.26 * L, 0.035 * L, rotOf(be, sd), col(m, 'spor', st), 'spor'); if (a && w < -0.1) P.anchor(x, y, 'spor'); }
      if (a) { const [x, y] = T(0.88 * L, 0.15 * L); P.anchor(x, y, 'misp'); }
    },
    dioon(P, m, T, L, st, a, be, sd) {
      const mat = st === 'mat';
      P.poly(mapP(T, L, [[0, 0], [0.62, 0], [0.85, 0.1], [1.0, 0.3], [0.94, 0.34], [0.8, 0.2], [0.6, 0.09], [0, 0.07]]), col(m, 'mgsp', st), 'mgsp');
      const [x, y] = T(0.2 * L, (mat ? 0.14 : 0.12) * L); P.ell(x, y, (mat ? 0.13 : 0.1) * L, (mat ? 0.07 : 0.05) * L, rotOf(be, sd), col(m, mat ? 'sarc' : 'ov', st), mat ? 'sarc' : 'ov');
      if (a) { P.anchor(x, y, mat ? 'sarc' : 'ov'); const [sx, sy] = T(0.85 * L, 0.18 * L); P.anchor(sx, sy, 'mgsp'); if (!mat) { const [mx, my] = T(0.09 * L, 0.12 * L); P.ell(mx, my, 0.012 * L, 0.012 * L, 0, INK, 'ov'); P.anchor(mx, my, 'mic'); } }
    },
    arau(P, m, T, L, st, a, be, sd) {
      const mat = st === 'mat';
      P.poly(mapP(T, L, [[0, -0.02], [0.9, -0.08], [1.0, -0.02], [1.04, 0.1], [0.95, 0.1], [0.9, 0.09], [0, 0.04]]), col(m, 'bscale', st), 'bscale');
      P.line(mapP(T, L, [[1.0, 0.08], [1.08, 0.18], [1.12, 0.3]]), INK, 0.03 * L, 'bscale');
      const [x, y] = T(0.5 * L, 0.02 * L); P.ell(x, y, (mat ? 0.15 : 0.11) * L, (mat ? 0.045 : 0.035) * L, rotOf(be, sd), col(m, mat ? 'seed' : 'ov', st), mat ? 'seed' : 'ov');
      if (a) { P.anchor(x, y, mat ? 'seed' : 'ov'); const [sx, sy] = T(0.85 * L, 0.0), [bx, by] = [sx, sy]; P.anchor(bx, by, 'bscale'); }
    },
  };

  /* ---------------- members from above (x out from the axis, y across) ---------------- */
  const Rot2 = (cx, cy, th) => (x, y) => { const c = Math.cos(rad(th)), s = Math.sin(rad(th)); return [cx + x * s + y * c, cy - x * c + y * s]; };
  const mapR = (R, pts) => pts.map(([x, y]) => R(x, y));
  function outlineW(L, hw, n) { const l = [], r = []; for (let k = 0; k <= (n || 14); k++) { const x = L * k / (n || 14), w = hw(x / L); l.push([x, -w]); r.push([x, w]); } return l.concat(r.reverse()); }
  const TOP = {
    bs(P, m, R, L, W, st) {
      const mat = st === 'mat', W0 = 0.3 * W;
      if (m.bract === 'exserted') {
        P.poly(mapR(R, outlineW(L, s => 0.12 * W)), col(m, 'bract', st), 'bract', { dash: true, op: 0.35 });
        P.poly(mapR(R, [[L * 0.98, -0.11 * W], [L * 1.14, 0], [L * 0.98, 0.11 * W]]), col(m, 'bract', st), 'bract');
      } else P.poly(mapR(R, outlineW(0.32 * L, s => 0.18 * W * (1 - 0.55 * s))), col(m, 'bract', st), 'bract', { dash: true, op: 0.35 });
      const apo = m.apo && mat;
      P.poly(mapR(R, outlineW(L, s => (W0 + (W - W0) * Math.min(1, s / 0.72)) / 2 * (s > 0.84 && !apo ? Math.sqrt(Math.max(0.05, 1 - Math.pow((s - 0.84) / 0.16, 2))) : 1))), col(m, 'scale', st), 'scale');
      if (apo) { P.poly(mapR(R, [[0.86 * L, -W / 2], [L, -W / 2], [L, W / 2], [0.86 * L, W / 2]]), Cone3D.colorHex(m, 'scale', st), 'scale', { op: 1 }); P.ell(...R(0.93 * L, 0), 0.06 * W, 0.06 * W, 0, INK, 'scale'); }
      for (const sg of [-1, 1]) {
        if (!mat) { P.ell(...R(0.17 * L, sg * 0.15 * W), 0.07 * W, 0.085 * L, 0, col(m, 'ov', st), 'ov'); P.ell(...R(0.09 * L, sg * 0.15 * W), 0.018 * W, 0.018 * W, 0, INK, 'ov'); }
        else {
          if (m.wing) P.poly(mapR(R, outlineW(0.42 * L, s => 0.12 * W * Math.pow(Math.sin(Math.PI * (0.12 + 0.8 * s)), 0.6)).map(([x, y]) => [x + 0.2 * L, y + sg * 0.15 * W])), col(m, 'wing', st), 'wing');
          P.ell(...R(0.16 * L, sg * 0.15 * W), (m.wing ? 0.06 : 0.1) * W, (m.wing ? 0.07 : 0.1) * L, 0, col(m, 'seed', st), 'seed');
        }
      }
    },
    misp(P, m, R, L, W, st) {
      for (const sg of [-1, 1]) P.ell(...R(0.42 * L, sg * 0.2 * W), 0.15 * W, 0.24 * L, 0, col(m, 'spor', st), 'spor', { dash: true });
      P.poly(mapR(R, outlineW(L, s => W / 2 * (0.35 + 0.65 * Math.min(1, s / 0.55)) * (s > 0.78 ? 0.3 + 0.7 * (1 - s) / 0.22 : 1))), col(m, 'misp', st), 'misp', { op: 0.85 });
    },
    cmisp(P, m, R, L, W, st) {
      P.poly(mapR(R, outlineW(L, s => W / 2 * (0.22 + 0.78 * Math.pow(s, 0.65)) * (s > 0.86 ? Math.max(0.15, (1 - s) / 0.14) : 1))), col(m, 'misp', st), 'misp');
      for (let a = 0; a < 4; a++) for (let b = -1; b <= 1; b++) P.ell(...R((0.3 + 0.14 * a) * L, b * 0.2 * W * (0.4 + a * 0.2)), 0.04 * W, 0.04 * W, 0, col(m, 'spor', st), 'spor', { dash: true, none: true });
    },
    pelt(P, m, R, L, W, st) {
      const male = m.sex === 'm', mat = st === 'mat', org = male ? 'misp' : CM.femaleOrg(m);
      if (male) for (let i = 0; i < Math.min(5, m.spor || 4); i++) P.ell(...R(0.74 * L, (-0.3 + 0.6 * i / Math.max(1, Math.min(5, m.spor || 4) - 1)) * W), 0.08 * W, 0.14 * L, 0, col(m, 'spor', st), 'spor', { dash: true });
      if (m.fleshy === 'galb') P.poly(mapR(R, [[0, -0.12 * W], [0.88 * L, -0.46 * W], [0.88 * L, 0.46 * W], [0, 0.12 * W]]), col(m, org, st), org);
      else P.poly(mapR(R, [[0, -0.07 * W], [0.88 * L, -0.07 * W], [0.88 * L, 0.07 * W], [0, 0.07 * W]]), col(m, org, st), org);
      P.poly(mapR(R, [[0.86 * L, -W / 2], [L, -W / 2 * 0.92], [L, W / 2 * 0.92], [0.86 * L, W / 2]]), col(m, org, st), org);
      if (m.umbo === 'mucro') P.poly(mapR(R, [[L, -0.05 * W], [1.12 * L, 0], [L, 0.05 * W]]), col(m, org, st), org);
      if (m.horns) for (const sg of [-1, 1]) P.line(mapR(R, [[L, sg * 0.18 * W], [1.22 * L, sg * 0.28 * W]]), INK, 0.05 * W, org);
      if (male) return;
      if (m.struct === 'fused') {
        const k = Math.min(m.ov || 1, 6);
        for (let i = 0; i < k; i++) P.ell(...R((0.2 + (i % 2) * 0.1) * L, (k === 1 ? 0 : -0.3 + 0.6 * i / (k - 1)) * W), 0.045 * W, 0.045 * W, 0, col(m, mat ? 'seed' : 'ov', st), mat ? 'seed' : 'ov');
      } else for (const sg of [-1, 1]) P.ell(...R(0.66 * L, sg * 0.27 * W), (mat ? 0.17 : 0.13) * W, (mat ? 0.24 : 0.2) * L, 0, col(m, mat ? 'sarc' : 'ov', st), mat ? 'sarc' : 'ov');
    },
    tmisp(P, m, R, L, W, st) {
      for (let i = 0; i < (m.spor || 6); i++) { const a = i * 2 * Math.PI / (m.spor || 6); P.ell(...R(0.74 * L, Math.cos(a) * 0.28 * W), 0.08 * W, 0.12 * L, 0, col(m, 'spor', st), 'spor', { dash: Math.sin(a) < 0 }); }
      P.poly(mapR(R, [[0, -0.05 * W], [0.86 * L, -0.05 * W], [0.86 * L, 0.05 * W], [0, 0.05 * W]]), col(m, 'misp', st), 'misp');
      P.poly(mapR(R, [[0.84 * L, -0.4 * W], [0.96 * L, -0.4 * W], [0.96 * L, 0.4 * W], [0.84 * L, 0.4 * W]]), col(m, 'misp', st), 'misp');
    },
    amisp(P, m, R, L, W, st) {
      P.poly(mapR(R, outlineW(L, s => W / 2 * (0.25 + 0.75 * Math.min(1, s / 0.5)) * (s > 0.82 ? Math.max(0.15, (1 - s) / 0.18) : 1))), col(m, 'misp', st), 'misp');
      for (let i = -1; i <= 1; i++) P.ell(...R(0.5 * L, i * 0.3 * W), 0.07 * W, 0.26 * L, 0, col(m, 'spor', st), 'spor', { dash: true, none: true });
    },
    dioon(P, m, R, L, W, st) {
      const mat = st === 'mat';
      P.poly(mapR(R, outlineW(L, s => W / 2 * (0.3 + 0.7 * Math.sin(Math.PI * Math.min(1, 0.12 + 0.8 * s))) * (s > 0.9 ? Math.max(0.2, (1 - s) / 0.1) : 1))), col(m, 'mgsp', st), 'mgsp');
      for (const sg of [-1, 1]) P.ell(...R(0.2 * L, sg * 0.2 * W), (mat ? 0.15 : 0.11) * W, (mat ? 0.14 : 0.11) * L, 0, col(m, mat ? 'sarc' : 'ov', st), mat ? 'sarc' : 'ov');
    },
    arau(P, m, R, L, W, st) {
      const mat = st === 'mat';
      if (mat && m.wing) P.poly(mapR(R, outlineW(0.55 * L, s => W * 0.46 * Math.sin(Math.PI * (0.1 + 0.8 * s))).map(([x, y]) => [x + 0.25 * L, y])), col(m, 'wing', st), 'wing');
      P.poly(mapR(R, outlineW(L, s => W / 2 * (0.22 + 0.5 * Math.pow(s, 0.6)) * (s > 0.9 ? Math.max(0.3, (1 - s) / 0.1) : 1))), col(m, 'bscale', st), 'bscale');
      P.line(mapR(R, [[L, 0], [1.14 * L, 0]]), INK, 0.05 * W, 'bscale');
      P.ell(...R(0.5 * L, 0), (mat ? 0.13 : 0.1) * W, (mat ? 0.2 : 0.13) * L, 0, col(m, mat ? 'seed' : 'ov', st), mat ? 'seed' : 'ov');
    },
  };

  /* ---------------- helpers shared by the figures ---------------- */
  const radialOf = m => m.shape === 'glob' && (m.unit === 'pelt' || m.unit === 'tmisp' || m.unit === 'arau');
  const raOf = (m, R) => R * (m.unit === 'bs' ? 0.13 : m.unit === 'misp' || m.unit === 'amisp' ? 0.2 : radialOf(m) ? 0.14 : 0.16);
  /* the frame of the figure and its labels, both in proportion to the size of the drawing */
  function finish(P, o) {
    let lab = '';
    const S = Math.max(P.x1 - P.x0, P.y1 - P.y0, 1);
    const fs = (o.fsK || 0.05) * S, gap = fs * 1.3, x0r = P.x1 + fs * 1.2;
    if (o.labels && P.anchors.length) {
      /* labels in a column on the right, in the order of their parts from top to bottom,
         spread over the height of the drawing so the leader lines do not cross */
      const L = P.anchors.slice().sort((a, b) => a.y - b.y);
      const n = L.length, span = Math.max(P.y1 - P.y0, n * gap);
      const top = (P.y0 + P.y1) / 2 - span / 2;
      let lastY = -1e9, maxW = 0;
      L.forEach((l, i) => {
        const ideal = n === 1 ? l.y : top + span * i / (n - 1);
        const y = Math.max(lastY + gap, (ideal + l.y) / 2);
        lastY = y;
        const org = labelOrg[l.key] || l.key, txt = name(l.key);
        maxW = Math.max(maxW, txt.length * fs * 0.52);
        lab += `<g class="c-o" data-org="${org}"><path d="M${f1(l.x)},${f1(l.y)} L${f1(x0r - fs * 0.4)},${f1(y)}" stroke="#8a8a8a" stroke-width="${f1(fs * 0.07)}" fill="none"/><circle cx="${f1(l.x)}" cy="${f1(l.y)}" r="${f1(fs * 0.13)}" fill="#8a8a8a"/><text class="sc-lbl" x="${f1(x0r)}" y="${f1(y + fs * 0.35)}" style="font-size:${f1(fs)}px">${esc(txt)}</text></g>`;
        P.y1 = Math.max(P.y1, y + fs * 0.6); P.y0 = Math.min(P.y0, y - fs);
      });
      P.x1 = x0r + maxW + fs;
    }
    const pad = 0.04 * S;
    const vb = `${f1(P.x0 - pad)} ${f1(P.y0 - pad)} ${f1(P.x1 - P.x0 + 2 * pad)} ${f1(P.y1 - P.y0 + 2 * pad)}`;
    const foc = o.focus ? ' has-hl' : '';
    let body = P.s + lab;
    if (o.focus) body = body.replace(new RegExp(`class="c-o" data-org="${o.focus}"`, 'g'), `class="c-o hl" data-org="${o.focus}"`);
    return `<svg class="cfig${foc}" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" role="img">${body}</svg>`;
  }
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

  /* ---------------- longitudinal section ---------------- */
  function sectionCone(P, m, st) {
    const H = m.L, R = m.D / 2, unit = m.unit, radial = radialOf(m), ra = raOf(m, R);
    const top = radial ? H * 0.56 : H * 0.98;
    const mat = st === 'mat';
    if (radial && m.fleshy === 'galb' && mat) {
      const zc = -H * 0.5, Rg = R * 0.92;
      P.poly([[-ra * 0.7, 0], [ra * 0.7, 0], [ra * 0.7, zc + Rg * 0.8], [-ra * 0.7, zc + Rg * 0.8]], col(m, 'axis', st), 'axis');
      P.ell(0, zc, Rg, Rg, 0, col(m, 'bscale', st), 'bscale');
      P.anchor(Rg * 0.7, zc - Rg * 0.5, 'bscale');
      /* the seeds stand at the base of the fused scales, pointing up */
      [[-0.3, 0.12, -22], [0, 0.18, 0], [0.3, 0.12, 22]].forEach(([x, y, r], i) => { P.ell(x * Rg, zc + y * Rg, 0.11 * Rg, 0.3 * Rg, r, col(m, 'seed', st), 'seed'); if (i === 2) P.anchor(x * Rg, zc + y * Rg, 'seed'); });
      return;
    }
    P.poly([[-ra * 0.7, H * 0.06], [ra * 0.7, H * 0.06], [ra, 0], [ra, -top + ra], [0, -top], [-ra, -top + ra], [-ra, 0]], col(m, 'axis', st), 'axis');
    P.anchor(-ra * 0.2, -H * 0.12, 'axis');
    const pos = Cone3D.place(m), beta = Cone3D.BETA[unit] || [40, 5], prof = Cone3D.PROFILE[m.shape] || Cone3D.PROFILE.ovoid;
    /* the members cut by the plane; opposite pairs and whorls are drawn on both sides at
       every level (a schematic section), and so are the few scales of globose cones */
    let inPlane;
    if (m.phyl === 'decussate' || m.phyl === 'whorl3') {
      const tiers = new Map();
      pos.forEach((p, i) => { if (!tiers.has(p.p)) tiers.set(p.p, { p, i }); });
      inPlane = [];
      tiers.forEach(q => { inPlane.push({ p: q.p, i: q.i, sn: 1 }, { p: q.p, i: q.i, sn: -1 }); });
    } else {
      const thr = radial ? 0.7 : m.phyl === 'rows' ? 0.9 : 0.93;
      inPlane = pos.map((p, i) => ({ p, i, sn: Math.sin(rad(p.th)) })).filter(q => Math.abs(q.sn) > thr);
    }
    const right = inPlane.filter(q => q.sn > 0);
    const star = right.length ? right.reduce((b, q) => Math.abs(q.p.t - 0.55) < Math.abs(b.p.t - 0.55) ? q : b, right[0]) : null;
    const k = pos.length;
    inPlane.forEach(q => {
      const p = q.p, sd = q.sn > 0 ? 1 : -1;
      let ox, oy, be, L, hs;
      if (radial) {
        const lat = p.tiers ? -62 + 124 * (p.p + 0.5) / p.tiers : Math.asin(-0.84 + 1.68 * (q.i + 0.5) / k) * 180 / Math.PI;
        ox = 0; oy = -H * 0.5; be = lat; L = R * 0.8 - (unit === 'arau' ? 0 : 0.12 * R);
        hs = p.tiers ? L * rad(124 / p.tiers) / 2 * 0.92 : Math.sqrt(4 * Math.PI * R * R / k) / 2 * 0.7;
      } else {
        const r = prof(p.t) * R;
        be = unit === 'pelt' ? 0 : beta[0];
        L = unit === 'pelt' ? Math.max(0.1 * R, r - ra) : Math.max(0.12 * R, (r - ra) / Math.cos(rad(beta[0])));
        ox = sd * ra; oy = -H * (0.03 + 0.93 * p.t);
        hs = p.tiers ? H / p.tiers * 0.47 : L * 0.3;
      }
      SIDE[unit](P, m, Tf(ox, oy, be, sd), L, st, q === star, be, sd, hs);
    });
  }
  function sectionCrown(P, m, st) {
    const mat = st === 'mat', Rs = 14;
    P.poly([[-Rs, 20], [Rs, 20], [Rs, 2], [Rs * 0.5, -6], [0, -8], [-Rs * 0.5, -6], [-Rs, 2]], col(m, 'stem', st), 'stem');
    P.anchor(-Rs * 0.6, 10, 'stem');
    for (const sd of [-1, 1]) {
      const T = Tf(sd * Rs * 0.5, -4, 62, sd), L = 62;
      const pts = [];
      for (let k = 0; k <= 30; k++) { const s = k / 30; pts.push([s, 0.03 + (s > 0.55 ? 0.05 + (Math.sin(s * Math.PI * 20) > 0 ? 0.07 : 0) : 0)]); }
      const low = pts.map(([u, w]) => [u, -w]).reverse();
      P.poly(mapP(T, L, pts.concat(low)).map(([x, y], i, arr) => [x, y]), col(m, 'mgsp', st), 'mgsp');
      for (let k = 0; k < 3; k++) for (const w of [-1, 1]) { const [x, y] = T((0.16 + 0.12 * k) * L, w * (mat ? 0.08 : 0.06) * L); P.ell(x, y, (mat ? 0.055 : 0.035) * L, (mat ? 0.045 : 0.03) * L, 0, col(m, mat ? 'sarc' : 'ov', st), mat ? 'sarc' : 'ov'); if (sd > 0 && k === 1 && w > 0) P.anchor(x, y, mat ? 'sarc' : 'ov'); }
      if (sd > 0) { const [x, y] = T(0.8 * L, 0.05 * L); P.anchor(x, y, 'mgsp'); }
    }
  }
  function seedLayers(P, m, cx, cy, r, st, anchors) {
    /* a seed in section: fleshy outer layer, hard layer, gametophyte and embryo */
    P.ell(cx, cy, r, r * 1.12, 0, col(m, m.fleshy === 'sarc' ? 'sarc' : 'seed', st), m.fleshy === 'sarc' ? 'sarc' : 'seed');
    P.ell(cx, cy, r * 0.68, r * 0.8, 0, '#f1ead8', 'seed');
    P.ell(cx, cy, r * 0.55, r * 0.66, 0, '#dfe6b0', 'seed');
    P.ell(cx, cy - r * 0.18, r * 0.12, r * 0.3, 0, '#9fbf5a', 'seed');
    if (anchors) { if (m.fleshy === 'sarc') P.anchor(cx + r * 0.9, cy - r * 0.2, 'sarc'); P.anchor(cx + r * 0.62, cy + r * 0.3, 'scl'); P.anchor(cx + r * 0.3, cy + r * 0.3, 'gam'); P.anchor(cx, cy - r * 0.3, 'emb'); }
  }
  function sectionGinkgo(P, m, st) {
    const mat = st === 'mat';
    P.poly([[-3.2, 16], [3.2, 16], [3, 0], [2, -4], [-2, -4], [-3, 0]], col(m, 'ped', st), 'ped');
    if (m.sex === 'm') {
      P.line([[0, -4], [0, -46]], col(m, 'axis', st), 1.2, 'axis');
      P.anchor(0, -40, 'axis');
      for (let k = 0; k < 8; k++) for (const sd of [-1, 1]) {
        const z = -8 - k * 4.8 - (sd > 0 ? 2.4 : 0), T = Tf(0, z, 20, sd);
        P.line(mapP(T, 1, [[0, 0], [4.5, 0]]), col(m, 'misp', st), 0.6, 'misp');
        const [x, y] = T(5.2, -1.3); P.ell(x, y, 0.9, 1.7, 0, col(m, 'spor', st), 'spor');
        if (sd > 0 && k === 4) { P.anchor(...T(3, 0), 'misp'); P.anchor(x, y, 'spor'); }
      }
      return;
    }
    P.line([[0, -4], [0, -36]], col(m, 'ped', st), 1.4, 'ped');
    P.anchor(0, -20, 'ped');
    for (const sd of [-1, 1]) {
      P.line([[0, -36], [sd * 5, -41]], col(m, 'ped', st), 1, 'ped');
      const ripe = mat && sd > 0;
      const cx = sd * (ripe ? 11 : 6.5), cy = ripe ? -52 : -45;
      P.ell(sd * 5.2, -41.6, 2.6, 1, sd * -40, col(m, 'collar', st), 'collar');
      if (sd > 0) P.anchor(sd * 5.2, -41.6, 'collar');
      if (ripe) seedLayers(P, m, cx, cy, 9, st, true);
      else if (mat) P.ell(sd * 6.4, -44, 1.6, 2, 0, '#9a7850', 'ov');
      else { P.ell(cx, cy, 2.6, 3.4, 0, col(m, 'ov', st), 'ov'); P.ell(cx, cy - 3.3, 0.5, 0.5, 0, INK, 'ov'); if (sd > 0) { P.anchor(cx, cy, 'ov'); P.anchor(cx, cy - 3.3, 'mic'); } }
    }
  }
  function sectionTaxus(P, m, st) {
    const mat = st === 'mat';
    P.poly([[-1.4, 8], [1.4, 8], [1.2, -9], [-1.2, -9]], '#8a7a4c', 'bract');
    for (let p = 0; p < 4; p++) for (const sd of [-1, 1]) { const T = Tf(sd * 1.2, -0.6 - p * 2.1, 72 - p * 4, sd); P.poly(mapP(T, 4.6 - p * 0.35, [[0, 0], [0.6, 0.1], [1, 0.05], [0.9, 0.2], [0.4, 0.22], [0, 0.15]]), col(m, 'bract', st), 'bract'); if (sd > 0 && p === 1) P.anchor(...T(2.5, 0.1), 'bract'); }
    if (mat) {
      P.poly([[-1.2, -8.4], [-3.4, -9.2], [-4.1, -11.5], [-3.6, -13.6], [-2.8, -14.2], [-2.3, -13.2], [-2.8, -11.4], [-2, -9.6], [2, -9.6], [2.8, -11.4], [2.3, -13.2], [2.8, -14.2], [3.6, -13.6], [4.1, -11.5], [3.4, -9.2], [1.2, -8.4]], col(m, 'aril', st), 'aril');
      P.anchor(3.8, -12, 'aril');
      P.ell(0, -12.6, 2.2, 3.6, 0, col(m, 'seed', st), 'seed'); P.ell(0, -12.2, 1.4, 2.4, 0, '#dfe6b0', 'seed');
      P.anchor(0, -15, 'seed'); P.anchor(0, -12.2, 'gam');
    } else {
      P.poly([[-1.1, -8.6], [-1.9, -9], [-2, -9.6], [-1.5, -9.5], [1.5, -9.5], [2, -9.6], [1.9, -9], [1.1, -8.6]], '#96aa6e', 'aril');
      P.anchor(2, -9.3, 'aril');
      P.ell(0, -11.2, 1.7, 2.5, 0, col(m, 'ov', st), 'ov'); P.ell(0, -11, 1, 1.6, 0, '#e8e2c2', 'ov'); P.ell(0, -13.6, 0.35, 0.35, 0, INK, 'ov');
      P.anchor(1.5, -11.2, 'ov'); P.anchor(0, -13.6, 'mic');
    }
  }
  function sectionPodo(P, m, st) {
    const mat = st === 'mat', k = mat ? 1.35 : 0.8;
    P.line([[0, 16], [0, -0.5]], col(m, 'ped', st), 1.5, 'ped'); P.anchor(0, 8, 'ped');
    P.poly([[-0.8, 0], [-3.2 * k, -1.4 * k], [-4 * k, -4 * k], [-3.6 * k, -6.5 * k], [-2.2 * k, -7.6 * k], [2.2 * k, -7.6 * k], [3.6 * k, -6.5 * k], [4 * k, -4 * k], [3.2 * k, -1.4 * k], [0.8, 0]], col(m, 'rec', st), 'rec');
    P.anchor(3.2 * k, -3.5 * k, 'rec');
    const zS = -(7.6 * k + (mat ? 4.6 : 2.8)), rx = mat ? 4.2 : 2.4, rz = mat ? 5 : 3.1;
    P.ell(0.8, zS, rx, rz, 0, col(m, 'epim', st), 'epim'); P.anchor(0.8 + rx * 0.9, zS - rz * 0.3, 'epim');
    P.ell(0.8, zS - rz * 0.1, rx * 0.62, rz * 0.66, 0, mat ? '#dfe6b0' : col(m, 'ov', st), mat ? 'seed' : 'ov');
    P.ell(0.8, zS + rz * 0.6, 0.4, 0.4, 0, INK, 'ov');
    P.anchor(0.8, zS - rz * 0.1, mat ? 'seed' : 'ov'); if (!mat) P.anchor(0.8, zS + rz * 0.6, 'mic');
  }
  function sectionEphedra(P, m, st) {
    const mat = st === 'mat', male = m.sex === 'm', n = m.n || 3, topZ = 1.5 + n * 2.9;
    P.poly([[-1.1, 8], [1.1, 8], [1, -topZ], [0, -topZ - 0.6], [-1, -topZ]], '#789650', 'axis');
    const fleshy = !male && mat && m.fleshy === 'bracts';
    for (let p = 0; p < n; p++) for (const sd of [-1, 1]) {
      if ((p % 2) === 1) continue;             /* the pairs across the plane are cut edge-on */
      const z = -(1.2 + p * 2.9), T = Tf(sd * 1, z, male ? 58 : 66, sd), L = male ? 3.4 : 4.4 - p * 0.3;
      P.poly(mapP(T, L, [[0, 0], [0.6, 0.05], [1, 0.1], [0.85, 0.3], [0.4, 0.3], [0, 0.18]]), fleshy ? '#d23b2f' : col(m, 'bract', st), 'bract');
      if (sd > 0 && p === 0) P.anchor(...T(L * 0.6, 0.1), 'bract');
      if (male) {
        const U = Tf(sd * 1, z - 0.9, 72, sd);
        P.ell(...U(1.6, 0.5), 0.8, 1.3, rotOf(72, sd), col(m, 'env', st), 'env');
        P.line([U(1.8, 0.6), U(6.2, 1.2)], col(m, 'anth', st), 0.4, 'anth');
        const [bx, by] = U(6.4, 1.2); P.ell(bx, by, 0.7, 0.7, 0, col(m, 'syn', st), 'syn');
        if (sd > 0 && p === 0) { P.anchor(...U(1.6, 0.5), 'env'); P.anchor(...U(4, 0.9), 'anth'); P.anchor(bx, by, 'syn'); }
      }
    }
    if (!male) {
      const k = m.ov || 1;
      for (let q = 0; q < k; q++) {
        const x = k === 1 ? 0 : (q ? 1.4 : -1.4), z = -(topZ + 1.4);
        P.ell(x, z, 1.4, 2.6, 0, mat ? col(m, 'seed', st) : col(m, 'env', st), mat ? 'seed' : 'env');
        P.ell(x, z + 0.1, 0.85, 1.7, 0, mat ? '#dfe6b0' : col(m, 'ov', st), mat ? 'seed' : 'ov');
        P.line([[x, z - 1.8], [x * 1.25, z - 5.2]], col(m, 'tub', st), 0.5, 'tub');
        if (q === k - 1) { P.anchor(x + 1.2, z + 1, mat ? 'seed' : 'env'); if (!mat) P.anchor(x, z + 0.4, 'ov'); P.anchor(x * 1.2, z - 4.2, 'tub'); }
      }
    }
  }
  /* line widths in proportion to the size of each drawing */
  const SW = { taxus: 0.22, ephedra: 0.24, podo: 0.32, ginkgo: 0.5 }, SWD = { taxus: 0.45, ephedra: 0.45, podo: 0.4, ginkgo: 0.7 };
  function section(src, o) {
    o = Object.assign({ stage: 'mat', labels: true }, o || {});
    const m = CM.normalize(src), st = m.sex === 'm' ? 'mat' : o.stage, P = Pen(SW[m.kind] || 1);
    ({ crown: sectionCrown, ginkgo: sectionGinkgo, taxus: sectionTaxus, podo: sectionPodo, ephedra: sectionEphedra }[m.kind] || sectionCone)(P, m, st);
    return finish(P, o);
  }

  /* ---------------- seen from above ---------------- */
  function diagramCone(P, m, st) {
    const R = 50, ra = Math.max(4, raOf(m, m.D / 2) / (m.D / 2) * R * 0.5);
    P.ell(0, 0, ra, ra, 0, col(m, 'axis', st), 'axis');
    let items = [];
    if (m.phyl === 'decussate') items = [0, 1, 2, 3].map(i => ({ th: (Math.floor(i / 2) % 2 ? 90 : 0) + (i % 2) * 180, num: Math.floor(i / 2) + 1, L: R * (i < 2 ? 1 : 0.8) }));
    else if (m.phyl === 'whorl3') items = [0, 1, 2, 3, 4, 5].map(i => ({ th: (Math.floor(i / 3) % 2 ? 60 : 0) + (i % 3) * 120, num: Math.floor(i / 3) + 1, L: R * (i < 3 ? 1 : 0.8) }));
    else if (m.phyl === 'rows') { const r = m.rows || 8; items = Array.from({ length: r }, (_, j) => ({ th: j * 360 / r, num: '', L: R })); }
    else { const k = Math.min(m.n, 13); items = Array.from({ length: k }, (_, i) => ({ th: i * 137.508, num: i + 1, L: R * (1 - 0.3 * i / Math.max(1, k - 1)) })); }
    const k = items.length;
    /* the genetic spiral joining the members in the order in which they arise */
    if (m.phyl === 'spiral') {
      const pts = [];
      for (let i = 0; i < k - 1; i++) for (let s = 0; s <= 8; s++) { const th = (i + s / 8) * 137.508, L = R * (1 - 0.3 * (i + s / 8) / Math.max(1, k - 1)); const rr = ra + 0.62 * L; pts.push([rr * Math.sin(rad(th)), -rr * Math.cos(rad(th))]); }
      P.raw(`<path d="M${pts.map(p => f1(p[0]) + ',' + f1(p[1])).join('L')}" fill="none" stroke="#b07aa1" stroke-width=".5" stroke-dasharray="1.2 1.2" opacity=".8"/>`);
    }
    items.slice().reverse().forEach(it => {
      const L = it.L, W = m.phyl === 'rows' ? 2 * Math.PI * (ra + L) / k * 0.85 : m.phyl === 'decussate' ? Math.min(0.9 * L, Math.PI * (ra + 0.6 * L) * 0.6) : Math.min(0.56 * L, 2 * Math.PI * (ra + 0.6 * L) / k * 0.95);
      const Rm = (x, y) => Rot2(0, 0, it.th)(x + ra, y);
      TOP[m.unit](P, m, Rm, L, W, st);
      if (it.num !== '') { const [x, y] = Rot2(0, 0, it.th)(ra + L + 5, 0); P.text(x, y + 1.6, it.num, { anchor: 'middle' }); P.x1 = Math.max(P.x1, x + 3); P.x0 = Math.min(P.x0, x - 3); P.y0 = Math.min(P.y0, y - 3); P.y1 = Math.max(P.y1, y + 3); }
    });
  }
  function diagramSpecial(P, m, st) {
    const mat = st === 'mat';
    if (m.kind === 'crown') {
      P.ell(0, 0, 14, 14, 0, col(m, 'stem', st), 'stem');
      for (let i = 0; i < 8; i++) {
        const th = i * 137.508, L = 44 * (1 - 0.25 * i / 7), Rm = (x, y) => Rot2(0, 0, th)(x + 8, y);
        const pts = [];
        for (let k = 0; k <= 24; k++) { const s = k / 24; pts.push([s * L, (s < 0.55 ? 1.6 : 2.6 + (Math.sin(s * Math.PI * 18) > 0 ? 3.4 : 0))]); }
        P.poly(mapR(Rm, pts.concat(pts.map(([x, y]) => [x, -y]).reverse())), col(m, 'mgsp', st), 'mgsp');
        for (let k = 0; k < 3; k++) for (const sg of [-1, 1]) P.ell(...Rm((0.16 + 0.12 * k) * L, sg * (mat ? 4 : 3)), mat ? 2.4 : 1.6, mat ? 2.4 : 1.6, 0, col(m, mat ? 'sarc' : 'ov', st), mat ? 'sarc' : 'ov');
        const [x, y] = Rot2(0, 0, th)(8 + L + 5, 0); P.text(x, y + 1.6, i + 1, { anchor: 'middle' });
      }
    } else if (m.kind === 'ginkgo') {
      P.ell(0, 0, 6, 6, 0, col(m, 'ped', st), 'ped');
      if (m.sex === 'm') {
        for (let i = 0; i < 10; i++) { const th = i * 137.508, Rm = (x, y) => Rot2(0, 0, th)(x + 6, y); P.line(mapR(Rm, [[0, 0], [10, 0]]), col(m, 'misp', st), 0.9, 'misp'); for (const sg of [-1, 1]) P.ell(...Rm(12, sg * 1.8), 1.6, 2.6, th, col(m, 'spor', st), 'spor'); }
      } else {
        [35, 215].forEach((th, j) => {
          const Rm = (x, y) => Rot2(0, 0, th)(x + 6, y);
          P.line(mapR(Rm, [[0, 0], [26, 0]]), col(m, 'ped', st), 1.4, 'ped');
          for (const sg of [-1, 1]) {
            const ripe = mat && sg > 0 && j === 0;
            P.line(mapR(Rm, [[26, 0], [29, sg * 4]]), col(m, 'ped', st), 1, 'ped');
            P.ell(...Rm(29.5, sg * 4.6), 2.8, 2.8, 0, col(m, 'collar', st), 'collar');
            P.ell(...Rm(ripe ? 36 : 31, sg * (ripe ? 9 : 5.4)), ripe ? 9 : mat ? 1.6 : 2.4, ripe ? 9 : mat ? 1.6 : 2.4, 0, ripe ? col(m, 'sarc', st) : mat ? '#9a7850' : col(m, 'ov', st), ripe ? 'sarc' : 'ov');
          }
        });
      }
    } else if (m.kind === 'taxus') {
      for (let p = 3; p >= 0; p--) for (const j of [0, 1]) { const th = (p % 2 ? 90 : 0) + j * 180, r = 6 + p * 3.2; const Rm = Rot2(0, 0, th); P.poly(mapR(Rm, [[r - 3.5, -5], [r + 1.2, -3.6], [r + 2, 0], [r + 1.2, 3.6], [r - 3.5, 5]]), col(m, 'bract', st), 'bract'); }
      if (mat) { P.ell(0, 0, 10, 10, 0, col(m, 'aril', st), 'aril'); P.ell(0, 0, 5.6, 5.6, 0, col(m, 'seed', st), 'seed'); }
      else { P.ell(0, 0, 5.2, 5.2, 0, '#96aa6e', 'aril'); P.ell(0, 0, 4, 4, 0, col(m, 'ov', st), 'ov'); P.ell(0, 0, 0.7, 0.7, 0, INK, 'ov'); }
    } else if (m.kind === 'podo') {
      const k = mat ? 1.4 : 1;
      for (const sg of [-1, 1]) P.ell(sg * 5 * k, 0, 6 * k, 8 * k, 0, col(m, 'rec', st), 'rec');
      P.ell(2, -1, mat ? 8 : 5, mat ? 8 : 5, 0, col(m, 'epim', st), 'epim');
      P.ell(2, 2, mat ? 4 : 2.6, mat ? 4 : 2.6, 0, mat ? '#dfe6b0' : col(m, 'ov', st), mat ? 'seed' : 'ov', { dash: true });
    } else if (m.kind === 'ephedra') {
      const male = m.sex === 'm', n = male ? 3 : m.n || 3, fleshy = !male && mat && m.fleshy === 'bracts';
      for (let p = n - 1; p >= 0; p--) for (const j of [0, 1]) {
        const th = (p % 2 ? 90 : 0) + j * 180, r = 7 + p * 5, Rm = Rot2(0, 0, th);
        P.poly(mapR(Rm, [[r - 3, -8 - p], [r + 1.8, -6], [r + 3, 0], [r + 1.8, 6], [r - 3, 8 + p]]), fleshy ? '#d23b2f' : col(m, 'bract', st), 'bract');
        if (male) { P.ell(...Rm(r - 4.5, 0), 2, 2, 0, col(m, 'env', st), 'env'); P.ell(...Rm(r - 4.5, 0), 0.9, 0.9, 0, col(m, 'syn', st), 'syn'); }
      }
      if (!male) for (let q = 0; q < (m.ov || 1); q++) { const x = (m.ov || 1) === 1 ? 0 : (q ? 3 : -3); P.ell(x, 0, 2.8, 2.8, 0, mat ? col(m, 'seed', st) : col(m, 'env', st), mat ? 'seed' : 'env'); P.ell(x, 0, 0.8, 0.8, 0, col(m, 'tub', st), 'tub'); }
    }
  }
  function diagram(src, o) {
    o = Object.assign({ stage: 'mat' }, o || {});
    const m = CM.normalize(src), st = m.sex === 'm' ? 'mat' : o.stage, P = Pen(SWD[m.kind] || 1);
    if (m.kind === 'cone') diagramCone(P, m, st); else diagramSpecial(P, m, st);
    return finish(P, Object.assign({}, o, { labels: false }));
  }
  function caption(src) {
    const m = CM.normalize(src), es = lang() === 'es';
    const under = es ? ' En línea discontinua, lo que queda debajo.' : ' Dashed lines show what lies underneath.';
    if (m.kind !== 'cone') return es ? 'Vista desde arriba.' + (m.kind === 'podo' ? under : '') : 'Seen from above.' + (m.kind === 'podo' ? under : '');
    if (m.phyl === 'spiral') return (es ? `Vista desde arriba de ${Math.min(m.n, 13)} piezas, numeradas en el orden en que nacen: cada una a unos 137.5° de la anterior (la línea punteada es la espiral genética).` : `Seen from above: ${Math.min(m.n, 13)} members numbered in the order they arise, each about 137.5° from the one before (the dotted line is the genetic spiral).`) + under;
    if (m.phyl === 'decussate') return (es ? 'Vista desde arriba de dos pares decusados: el par 2 queda en cruz con el par 1.' : 'Seen from above: two decussate pairs; pair 2 lies crosswise to pair 1.') + under;
    if (m.phyl === 'rows') return (es ? `Vista desde arriba de una vuelta de ${m.rows} piezas; la siguiente vuelta alterna con esta y así se forman las hileras verticales.` : `Seen from above: one turn of ${m.rows} members; the next turn alternates with it, which lines them up in vertical rows.`) + under;
    return es ? 'Vista desde arriba.' : 'Seen from above.';
  }

  /* ---------------- one member, enlarged ---------------- */
  function unit(src, o) {
    o = Object.assign({ stage: 'mat', labels: true }, o || {});
    const m = CM.normalize(src), st = m.sex === 'm' ? 'mat' : o.stage;
    const es = lang() === 'es';
    if (m.kind !== 'cone') {
      /* young and ripe side by side */
      if (m.sex === 'm') return section(m, o);
      const a = section(m, Object.assign({}, o, { stage: 'pol', labels: true })), b = section(m, Object.assign({}, o, { stage: 'mat', labels: true }));
      return `<div class="cf-stack"><figure>${a}<figcaption>${es ? 'En la polinización' : 'At pollination'}</figcaption></figure><figure>${b}<figcaption>${es ? 'Madura, en corte' : 'Ripe, in section'}</figcaption></figure></div>`;
    }
    const L = 60, P = Pen();
    const unitHs = m.unit === 'pelt' ? (m.phyl === 'decussate' ? 0.4 * L : 0.3 * L) : 0.3 * L;
    P.poly([[-5, 12], [0, 12], [0, -22], [-5, -22]], col(m, 'axis', st), 'axis');
    P.anchor(-2.5, 8, 'axis');
    SIDE[m.unit](P, m, Tf(0, 0, m.unit === 'pelt' || m.unit === 'tmisp' ? 0 : 22, 1), L, st, true, m.unit === 'pelt' || m.unit === 'tmisp' ? 0 : 22, 1, unitHs);
    const left = finish(P, Object.assign({}, o, { fsK: 0.066 }));
    const Q = Pen(), W = m.unit === 'pelt' ? 0.8 * L : m.unit === 'dioon' ? 0.75 * L : 0.6 * L;
    Q.poly([[-4, -W / 2 - 4], [0, -W / 2 - 4], [0, W / 2 + 4], [-4, W / 2 + 4]], col(m, 'axis', st), 'axis');
    TOP[m.unit](Q, m, (x, y) => [x, y], L, W, st);
    const right = finish(Q, Object.assign({}, o, { labels: false }));
    const cap2 = m.sex === 'm' ? (es ? 'Desde arriba; los microsporangios quedan debajo' : 'From above; the microsporangia lie underneath') : (es ? 'Desde arriba (cara adaxial)' : 'From above (adaxial face)');
    return `<div class="cf-stack"><figure>${left}<figcaption>${es ? 'De perfil, unida al eje' : 'In profile, on the axis'}</figcaption></figure><figure class="cf-top">${right}<figcaption>${cap2}</figcaption></figure></div>`;
  }

  return { diagram, section, unit, caption, name };
})();
window.ConeFig = ConeFig;
