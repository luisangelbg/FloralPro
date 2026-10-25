/* FloralPro — a three-dimensional flower built from the model, whorl by whorl.

   A small painter's-algorithm renderer in plain SVG: every organ is a surface
   (petal, sepal, tepal), a line (filament, style) or a blob (anther, ovary,
   stigma) in 3D; the flower is rotated with the mouse, projected
   orthographically, shaded with one light and drawn back to front. The
   'explode' control lifts each whorl apart so that the four (or more) whorls —
   calyx, corolla, androecium, gynoecium — can be seen one above the other,
   which is the whole point of the app.

   World axes: x to the right, y towards the viewer (abaxial side of the
   flower, where the bract sits), z up along the floral axis. Angles of organs
   follow diagram.js: 0° = adaxial (back), clockwise seen from above.

   Flower3D.mount(el, model, opts) → controller { set(model), setExplode(v),
   setView(az, el), highlight(org), destroy() }. Organs carry data-org. */

const Flower3D = (function () {
  const rad = d => d * Math.PI / 180;
  const f1 = v => (Math.round(v * 10) / 10).toString();

  function hexRGB(hex) {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
    if (!m) return [150, 150, 150];
    const n = parseInt(m[1], 16);
    return [n >> 16, (n >> 8) & 255, n & 255];
  }
  function shadeRGB(rgb, k, lift) {
    const [r, g, b] = rgb;
    const L = lift || 0;
    const c = v => Math.max(0, Math.min(255, Math.round(v * k + (255 - v * k) * L)));
    return `rgb(${c(r)},${c(g)},${c(b)})`;
  }

  /* ---------------- geometry of one flower ---------------- */
  function build(src, opts) {
    const f = FM.normalize(src);
    const lay = Diagram.layout(f);
    const mode = opts.colors || 'natural';
    const col = k => hexRGB(k === 'G' && mode !== 'whorl' ? (f.colors.G || '#9cc76a') : FM.color(f, k, mode));
    const L = f.look || {};
    const prims = [];            /* {kind:'poly'|'line'|'ell', pts3, org, …} */
    const ex = opts.explode || 0;
    const resup = f.resup ? 180 : 0;

    /* vertical order of whorls when exploded (outside → inside, bottom → top) */
    const orgOrder = ['E', 'K', 'C', 'P', 'A', 'G'].filter(k => f[k]);
    const level = {}; orgOrder.forEach((k, i) => { level[k] = i; });
    const GAP = 26;
    const lift = () => 0;          /* whorls are lifted apart at the end, see "explode" */

    /* where the organs are inserted (height z of the rim) */
    const G = f.G, gt = G ? FM.gynoeciumType(f) : null;
    const nCarp = G ? FM.ctyp(FM.total(G, { visible: true })) : 0;
    const ovH = G ? (gt.type === 'apo' ? 8 : 15) : 0;
    let zIns = 0;                         /* insertion level of perianth and stamens */
    let zOv = 2;                          /* bottom of the ovary */
    const hyp = f.hyp && f.hyp !== 'none';
    const hypH = hyp ? (f.hyp === 'tube' ? 16 : 9) : 0;
    if (G && G.pos === 'inferior') { zOv = -ovH - 2; zIns = 0; }
    else if (G && G.pos === 'half') { zOv = -ovH * 0.5; zIns = 0; }
    if (hyp && (!G || G.pos === 'superior')) { zIns = hypH; zOv = 1; }

    /* ---------- pedicel, receptacle, hypanthium, inferior ovary wall ---------- */
    const recCol = hexRGB(mode === 'whorl' ? FM.WHORL_COLORS.hyp : '#7fa65a');
    const pedBottom = (G && G.pos === 'inferior') ? zOv - 14 : -16;
    const pedTop = (G && G.pos === 'inferior') ? zOv : 0;
    surfaceOfRevolution(prims, [[1.9, pedBottom], [2.2, pedTop - 1], [4.5, pedTop]], 10, { org: 'axis', rgb: recCol });
    if (G && (G.pos === 'inferior' || G.pos === 'half')) {
      /* the ovary is sunk in the receptacle: a green vase up to the insertion level */
      const R0 = 10.5;
      surfaceOfRevolution(prims, [[4.5, zOv], [R0 * 0.9, zOv + ovH * 0.25], [R0, zOv + ovH * 0.6], [R0 * 0.92, 0], [R0 * 0.8, 1]], 18,
        { org: 'G', rgb: col('G'), sub: 'wall', lift: lift('G') * 0 });
    } else if (hyp) {
      surfaceOfRevolution(prims, [[4.5, 0], [8, 1.5], [12, hypH * 0.6], [14.5, hypH]], 18, { org: 'hyp', rgb: recCol, open: true });
    } else {
      surfaceOfRevolution(prims, [[4.5, 0], [6.5, 1.5], [6, 2.4]], 12, { org: 'axis', rgb: recCol });
    }

    /* ---------- perianth ---------- */
    const rimR = hyp && (!G || G.pos === 'superior') ? 14 : (G && G.pos !== 'superior' ? 9 : 6.5);
    const perRings = lay.rings.filter(R => R.kind !== 'stamen');
    const nPer = perRings.length;
    perRings.forEach((R, ri) => {
      const org = R.orgObj, key = R.org;
      const rgb = col(key);
      const fused = R.w.connate === true || org.connate;
      const inner = ri === nPer - 1 || (ri < nPer - 1 && perRings[ri + 1].org !== key);
      const isK = key === 'K' || key === 'E';
      const petaloid = key === 'C' || key === 'P' && org.like !== 'K';
      /* size and posture */
      let len, wid, b0, b1, shape;
      const outerOfTwo = key === 'P' && org.w.length > 1 && R.wi === 0;
      if (key === 'E') { len = 16; wid = 5.5; b0 = 35; b1 = 15; shape = 'bract'; }
      else if (isK) {
        len = (f.C || f.P) ? 18 : 30; wid = f.C ? 6.5 : 9; b0 = 40; b1 = 22; shape = 'sepal';
        if (L.pappus) { len = 7; wid = 1.6; b0 = 70; b1 = 60; shape = 'scale'; }
        if (!f.C && !f.P) { b0 = 55; b1 = 25; }
        if (org.like === 'C') shape = 'petal';
      } else {
        len = key === 'P' ? 34 : 32; wid = key === 'P' ? 10.5 : 12; b0 = 58; b1 = 12; shape = 'petal';
        if (outerOfTwo) { wid *= 0.9; }
        if (R.spiral) { len = 30; wid = 7; }
      }
      /* the form of the corolla (or of the perigon when there is no corolla) shapes only that whorl */
      const showy = key === 'C' || (key === 'P' && !f.C);
      const form = showy ? (L.corolla || (key === 'P' ? L.perianth : null)) : null;
      let lb0 = null, lb1 = null, tubeDef = 0.3;
      switch (form) {
        case 'rotate': b0 = 30; b1 = 2; len = 26; tubeDef = 0.15; break;
        case 'campanulate': b0 = 72; b1 = 38; tubeDef = 0.45; break;
        case 'tubular': b0 = 84; b1 = 62; len = 22; wid = 5; tubeDef = 0.7; break;
        case 'funnelform': b0 = 70; b1 = 34; len = 42; tubeDef = 0.5; break;
        case 'salverform': b0 = 88; b1 = 88; len = 40; tubeDef = 0.6; lb0 = 8; lb1 = -6; break;
        case 'urceolate': b0 = 80; b1 = 80; len = 26; wid = 7; tubeDef = 0.8; lb0 = -25; lb1 = -40; break;
        case 'cruciform': wid = 10; b0 = 70; b1 = 8; shape = 'clawed'; break;
        case 'caryophyllaceous': wid = 10; b0 = 82; b1 = 4; shape = 'clawed'; break;
        case 'ligulate': tubeDef = 0.22; break;
        case 'personate': case 'bilabiate': tubeDef = 0.45; break;
      }
      if (isK && ['tubular', 'salverform', 'urceolate'].includes(L.corolla)) len = Math.min(len, 8);
      const tube = fused ? (L.tube != null ? L.tube : tubeDef) : 0;
      /* a fused whorl: a tube (surface of revolution) and free lobes on top */
      let base = { r: rimR + (isK ? (fused ? 1.3 : 0) : 0.5), z: zIns + (isK ? 0 : 0.8) + ri * 0.4 };
      const tubeLen = len * tube;
      if (fused && tube > 0) {
        const bb = rad(Math.max(b0, 60));
        const topR = base.r + Math.cos(bb) * tubeLen, topZ = base.z + Math.sin(bb) * tubeLen;
        const midR = form === 'urceolate' ? (base.r + topR) / 2 + 4 : (base.r + topR) / 2 + 0.3;
        surfaceOfRevolution(prims, [[base.r, base.z], [midR, (base.z + topZ) / 2], [topR, topZ]], 24,
          { org: key, rgb, open: true, lift: lift(key), sub: 'tube', w: R.wi });
        base = { r: topR, z: topZ };
        if (lb0 != null) { b0 = lb0; b1 = lb1; }
      }
      const lobeLen = len * (1 - tube);
      const dAb = x => Math.abs(((x % 360) + 540) % 360 - 180);
      const abxI = R.items.reduce((bi, x, j) => (dAb(x.a) < dAb(R.items[bi].a) ? j : bi), 0);
      R.items.forEach((it, i) => {
        if (it.state === 'lost') return;
        let a = it.a + resup;
        let L1 = lobeLen * (it.size || 1), W1 = wid * (it.size || 1), B0 = b0, B1 = b1;
        const ster = it.state === 'sterile';
        if (ster) { L1 *= 0.45; W1 *= 0.5; }
        /* zygomorphic corollas */
        const part = it.part;
        if (L.corolla === 'papilionaceous' && key === 'C') {
          if (part === 0) { B0 = 70; B1 = 100; L1 *= 1.05; W1 *= 1.25; }            /* standard, erect and reflexed */
          else if (part === 1) { B0 = 20; B1 = 8; L1 *= 0.85; W1 *= 0.75; }          /* wings forward */
          else { B0 = 10; B1 = 25; L1 *= 0.8; W1 *= 0.55; }                         /* keel */
        }
        if (L.corolla === 'bilabiate' && key === 'C') {
          if (part === 0) { B0 = 82; B1 = 95; L1 *= 1.1; W1 *= 0.9; }               /* upper lip: a hood */
          else { B0 = 20; B1 = -18; L1 *= 1.05; W1 *= (Math.abs(((it.a - 180) % 360 + 540) % 360 - 180) < 10 ? 1.4 : 0.85); }
        }
        if (L.corolla === 'orchid' && key === 'P' && R.wi === 1 && part === 0) { B0 = 15; B1 = -25; W1 *= 1.7; L1 *= 1.0; }
        /* personate: like a bilabiate corolla whose lower lip bulges up and closes the throat (palate) */
        if (L.corolla === 'personate' && showy) {
          if (part === 0 || (part < 0 && Math.abs(((it.a) % 360 + 540) % 360 - 180) > 110)) { B0 = 80; B1 = 100; L1 *= 1.0; }
          else { B0 = 48; B1 = 18; L1 *= 0.95; W1 *= 1.15; }
        }
        /* ligulate: the fused petals open into a single strap on the abaxial side (ray floret) */
        if (L.corolla === 'ligulate' && showy && fused) {
          if (i !== abxI) return;
          a = 180 + resup; B0 = 12; B1 = -4; L1 = len * 1.5; W1 = wid * 2.6;
        }
        const rOff = R.spiral ? (i % 3) * 1.2 : 0;
        const zOff = R.spiral ? (i / R.items.length) * 3 : 0;
        petalSurface(prims, {
          a, r0: base.r + rOff, z0: base.z + zOff + lift(key), len: L1, wid: W1, b0: B0, b1: B1,
          shape: ster ? 'sepal' : shape, rgb, org: key, w: R.wi, i, back: !petaloid,
        });
      });
    });

    /* ---------- androecium ---------- */
    const stamRings = lay.rings.filter(R => R.kind === 'stamen');
    const aRGB = col('A');
    const filRGB = mode === 'whorl' ? hexRGB('#d9b85a') : [238, 232, 205];
    const epi = FM.adnate(f, 'C', 'A') || FM.adnate(f, 'P', 'A');
    const gyno = FM.adnate(f, 'A', 'G');
    const monad = f.A && (f.A.connate || f.A.w.every(w => w.connate === true)) && !L.synanther;
    stamRings.forEach((R, ri) => {
      const n = R.items.length;
      const many = R.spiral;
      R.items.forEach((it, i) => {
        if (it.state === 'lost') return;
        const a = it.a + resup;
        let r0 = rimR * (epi ? 1.2 : 0.8) - ri * 1.2, z0 = zIns + 1.2 + (epi ? 5 : 0);
        let h = 20 - ri * 2 + (many ? (i % 4) * 2 : 0), rTop = r0 + (many ? 3 + (i % 3) : 3);
        if (L.dyn === 'didynamous' || L.dyn === 'tetradynamous') h *= (R.n === 4 || R.n === 2 && L.dyn === 'tetradynamous' && ri === 1) ? 1.15 : 0.8;
        if (L.corolla === 'bilabiate') { rTop = r0 + 2; h = 18; }
        if (gyno) { r0 = 1.2; z0 = zIns + 14; h = 6; rTop = 2.4; }
        if (monad) { r0 = 2.2; z0 = zIns + 4 + (i / n) * 12; h = 2.2; rTop = 4.2; }
        if (L.synanther) { r0 = 2.6; rTop = 2.6; h = 14; }
        const ster = it.state === 'sterile';
        const p0 = cyl(r0, a, z0 + lift('A')), p1 = cyl(rTop, a, z0 + h * (ster ? 0.6 : 1) + lift('A'));
        prims.push({ kind: 'line', pts: [p0, p1], w: 0.9, rgb: filRGB, org: 'A', wi: R.wi, i });
        if (!ster) prims.push({ kind: 'ell', c: p1, rx: many ? 1.5 : 2.1, ry: many ? 2.1 : 3.2, rgb: aRGB, org: 'A', wi: R.wi, i, dir: [p0, p1] });
        else prims.push({ kind: 'ell', c: p1, rx: 0.9, ry: 1.2, rgb: [200, 190, 160], org: 'A', wi: R.wi, i, dir: [p0, p1] });
      });
    });
    if (monad && f.A) {
      /* staminal column around the style */
      surfaceOfRevolution(prims, [[2.4, zIns + 1], [2.2, zIns + 17]], 14, { org: 'A', rgb: filRGB, lift: lift('A'), sub: 'column' });
    }
    if (L.synanther && f.A) {
      surfaceOfRevolution(prims, [[2.9, zIns + 12], [2.9, zIns + 16]], 14, { org: 'A', rgb: aRGB, lift: lift('A'), sub: 'anthertube' });
    }

    /* ---------- gynoecium ---------- */
    if (G && nCarp > 0 && !G.w.every(w => w.state === 'sterile')) {
      const gRGB = col('G');
      const zl = lift('G');
      const styleRGB = mode === 'whorl' ? hexRGB('#5aa0d0') : [200, 214, 150];
      if (gt.type === 'apo' || gt.type === 'semi') {
        const many = nCarp > 12;
        const elong = L.receptacle === 'elongate';
        const cnt = many ? Math.min(nCarp, 40) : nCarp;
        for (let i = 0; i < cnt; i++) {
          const a = many ? i * 137.5 : i * 360 / cnt;
          const rr = many ? (elong ? 2.4 : 1 + 4 * Math.sqrt((i + 0.5) / cnt)) : 4;
          const zz = zOv + (many && elong ? (i / cnt) * 16 : 0) + zl;
          const c = cyl(rr, a, zz + 3.5);
          prims.push({ kind: 'ell', c, rx: many ? 1.5 : 2.8, ry: many ? 2.4 : 4, rgb: gRGB, org: 'G', i, shade: true });
          const tip = cyl(rr + 0.6, a, zz + (many ? 6 : 10));
          prims.push({ kind: 'line', pts: [cyl(rr, a, zz + 5), tip], w: 0.8, rgb: styleRGB, org: 'G', i });
        }
      } else {
        const ovR = gt.type === 'mono' ? 3.4 : 5 + Math.min(3, nCarp * 0.4);
        const inf = G.pos === 'inferior';
        const cz = inf ? zIns + 1 : zOv + ovH / 2;
        if (!inf) prims.push({ kind: 'ell3', c: [0, 0, cz + zl], rx: ovR, rz: ovH / 2, rgb: gRGB, org: 'G', i: 0 });
        else prims.push({ kind: 'ell3', c: [0, 0, zIns + 0.8 + zl], rx: 3, rz: 1.2, rgb: gRGB, org: 'G', i: 0 });
        const sBase = inf ? zIns + 1.5 : cz + ovH / 2 - 0.5;
        const styleTop = sBase + (G.style === 'gynobasic' ? 22 : (L.corolla === 'tubular' ? 20 : 17));
        const s0 = G.style === 'gynobasic' ? [0, 0, zOv + 1 + zl] : [0, 0, sBase + zl];
        prims.push({ kind: 'line', pts: [s0, [0, 0, styleTop + zl]], w: 1.4, rgb: styleRGB, org: 'G', i: 1 });
        const lobes = L.stigma === 'bifid' ? 2 : L.stigma === 'capitate' || L.stigma === 'punctiform' ? 1 : Math.min(nCarp, 5);
        if (lobes === 1) prims.push({ kind: 'ell', c: [0, 0, styleTop + zl + 0.6], rx: 1.7, ry: 1.5, rgb: styleRGB, org: 'G', i: 2 });
        else for (let k = 0; k < lobes; k++) {
          const a = k * 360 / lobes + (lobes === 2 ? 90 : 0);
          prims.push({ kind: 'line', pts: [[0, 0, styleTop + zl], cyl(2.6, a, styleTop + 2.2 + zl)], w: 1.2, rgb: styleRGB, org: 'G', i: 2 + k });
        }
      }
    }
    /* explode: each whorl is lifted just above the top of the whorl outside it, so tall organs
       (lily tepals, the standard of a bean) never hide the whorls inside them */
    const zr = {};
    const each = (p, fn) => {
      if (p.pts) p.pts.forEach(fn);
      if (p.outline) p.outline.forEach(fn);
      if (p.c) fn(p.c);
    };
    for (const p of prims) {
      if (!(p.org in level)) continue;
      const r = zr[p.org] || (zr[p.org] = { min: Infinity, max: -Infinity, rad: 0 });
      each(p, q => { r.min = Math.min(r.min, q[2]); r.max = Math.max(r.max, q[2]); r.rad = Math.max(r.rad, Math.hypot(q[0], q[1])); });
    }
    const dz = {}, mid = {};
    let top = -Infinity, prevDz = 0, prevRad = 0;
    for (const k of orgOrder) {
      const r = zr[k];
      if (!r) { dz[k] = 0; continue; }
      /* seen from above, a wide whorl covers the one above it unless the gap grows with the widths */
      const need = top === -Infinity ? 0 : Math.max(0, top + 6 + 0.3 * (prevRad + r.rad) - r.min);
      dz[k] = need * ex;
      top = r.max + need; prevRad = r.rad;
      mid[k] = (r.min + r.max) / 2 + dz[k];
      prevDz = dz[k];
    }
    if (ex > 0) for (const p of prims) {
      const d = dz[p.org];
      if (!d) continue;
      const mv = q => [q[0], q[1], q[2] + d];
      if (p.pts) p.pts = p.pts.map(mv);
      if (p.outline) p.outline = p.outline.map(mv);
      if (p.c) p.c = mv(p.c);
      if (p.dir) p.dir = p.dir.map(mv);
    }
    return { prims, f, level, orgOrder, zIns, mid };
  }

  function cyl(r, aDeg, z) {
    const a = rad(aDeg);
    return [r * Math.sin(a), -r * Math.cos(a), z];
  }

  /* a surface of revolution split into facets, so that the front facets hide what is inside */
  function surfaceOfRevolution(prims, profile, nSeg, o) {
    const zl = o.lift || 0;
    for (let s = 0; s < nSeg; s++) {
      const a0 = s * 360 / nSeg, a1 = (s + 1) * 360 / nSeg;
      for (let k = 0; k < profile.length - 1; k++) {
        const [r0, z0] = profile[k], [r1, z1] = profile[k + 1];
        const pts = [cyl(r0, a0, z0 + zl), cyl(r0, a1, z0 + zl), cyl(r1, a1, z1 + zl), cyl(r1, a0, z1 + zl)];
        prims.push({ kind: 'poly', pts, rgb: o.rgb, org: o.org, wi: o.w, sub: o.sub, facet: true, edge: false });
      }
    }
  }

  /* one petal-like organ: a curved blade rising from (r0, z0) at angle a */
  function petalSurface(prims, o) {
    const NU = 14;
    const center = [], tang = cyl(1, o.a + 90, 0), rdir = cyl(1, o.a, 0);
    let rr = o.r0, zz = o.z0;
    const du = o.len / NU;
    for (let k = 0; k <= NU; k++) {
      const u = k / NU;
      center.push([rr, zz, u]);
      const b = rad(o.b0 + (o.b1 - o.b0) * u);
      rr += Math.cos(b) * du; zz += Math.sin(b) * du;
    }
    const widthAt = u => {
      switch (o.shape) {
        case 'sepal': return Math.pow(Math.sin(Math.PI * Math.min(1, u * 0.96 + 0.04)), 0.75) * (1 - 0.35 * u) + 0.12 * (1 - u);
        case 'bract': return Math.pow(Math.sin(Math.PI * u), 0.8);
        case 'scale': return 0.8 * Math.pow(Math.sin(Math.PI * (u * 0.9 + 0.05)), 0.5);
        case 'clawed': return u < 0.38 ? 0.18 : 0.18 + 0.82 * Math.pow(Math.sin(Math.PI * Math.min(1, (u - 0.38) / 0.62 * 0.55 + 0.45)), 0.6);
        default: return 0.18 + 0.82 * Math.pow(Math.sin(Math.PI * Math.min(1, u * 0.62 + 0.38)), 0.55) * Math.pow(Math.sin(Math.PI * (u * 0.5 + 0.02) + 0.001), 0.35);
      }
    };
    const left = [], right = [];
    for (const [r, z, u] of center) {
      const w = o.wid * widthAt(u) / 2;
      const cx = rdir[0] * r, cy = rdir[1] * r;
      const cup = 0.12 * w;       /* slight cupping: edges lean inwards */
      left.push([cx - tang[0] * w - rdir[0] * cup, cy - tang[1] * w - rdir[1] * cup, z + cup * 0.6]);
      right.push([cx + tang[0] * w - rdir[0] * cup, cy + tang[1] * w - rdir[1] * cup, z + cup * 0.6]);
    }
    /* split in two halves (base and tip) so that depth sorting works for long, curved petals */
    const mid = Math.floor(NU / 2);
    const half = (a, b) => left.slice(a, b + 1).concat(right.slice(a, b + 1).reverse());
    prims.push({ kind: 'poly', pts: half(0, mid), outline: left.slice(0, mid + 1).reverse().concat(right.slice(0, mid + 1)), rgb: o.rgb, org: o.org, wi: o.w, i: o.i, back: o.back });
    prims.push({ kind: 'poly', pts: half(mid, NU), outline: left.slice(mid).concat(right.slice(mid).reverse()), rgb: o.rgb, org: o.org, wi: o.w, i: o.i, back: o.back });
  }

  /* ---------------- projection and drawing ---------------- */
  function render(scene, view, opts) {
    const az = rad(view.az), elv = rad(view.el);
    const ca = Math.cos(az), sa = Math.sin(az), ce = Math.cos(elv), se = Math.sin(elv);
    const proj = ([x, y, z]) => {
      const xr = x * ca - y * sa, yr = x * sa + y * ca;
      return [xr, yr * se - z * ce, yr * ce + z * se];
    };
    const viewW = viewDir(az, elv);   /* direction to the viewer in world coordinates */
    const light = normalize([-0.45, 0.35, 0.82]);
    const items = [];
    for (const p of scene.prims) {
      if (p.kind === 'poly') {
        const P2 = p.pts.map(proj);
        const depth = P2.reduce((s, q) => s + q[2], 0) / P2.length;
        /* normal */
        const a = p.pts[0], b = p.pts[1], c = p.pts[Math.floor(p.pts.length / 2)];
        let n = normalize(cross(sub(b, a), sub(c, a)));
        const nv = dot(n, viewW);
        const facing = nv >= 0;
        if (!facing) n = n.map(v => -v);
        const lam = Math.max(0, dot(n, light));
        let k = 0.82 + 0.24 * lam;
        if (p.facet && !facing) k *= 0.78;           /* inside of a tube */
        items.push({ depth: depth + (p.facet ? (facing ? 0.4 : -0.4) : 0), svg: poly(P2, shadeRGB(p.rgb, k), p), org: p.org });
      } else if (p.kind === 'line') {
        const P2 = p.pts.map(proj);
        const depth = (P2[0][2] + P2[1][2]) / 2;
        items.push({ depth, org: p.org, svg: `<path class="p3" data-org="${p.org}" d="M${f1(P2[0][0])},${f1(P2[0][1])}L${f1(P2[1][0])},${f1(P2[1][1])}" stroke="${shadeRGB(p.rgb, 0.9)}" stroke-width="${p.w}" stroke-linecap="round"/>` });
      } else if (p.kind === 'ell') {
        const c = proj(p.c);
        let rot = 0;
        if (p.dir) { const d0 = proj(p.dir[0]), d1 = proj(p.dir[1]); rot = Math.atan2(d1[1] - d0[1], d1[0] - d0[0]) * 180 / Math.PI + 90; }
        items.push({ depth: c[2] + 0.2, org: p.org, svg: `<ellipse class="p3" data-org="${p.org}" cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${p.rx}" ry="${p.ry}" transform="rotate(${f1(rot)} ${f1(c[0])} ${f1(c[1])})" fill="${shadeRGB(p.rgb, 1)}" stroke="${shadeRGB(p.rgb, 0.6)}" stroke-width=".4"/>` });
      } else if (p.kind === 'ell3') {
        /* an ellipsoid with a vertical axis: its outline is an ellipse on screen */
        const c = proj(p.c);
        const ry = Math.sqrt(Math.pow(p.rz * ce, 2) + Math.pow(p.rx * se, 2));
        const id = 'g' + Math.random().toString(36).slice(2, 8);
        items.push({ depth: c[2], org: p.org, svg: `<radialGradient id="${id}" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="${shadeRGB(p.rgb, 1, 0.35)}"/><stop offset="1" stop-color="${shadeRGB(p.rgb, 0.68)}"/></radialGradient><ellipse class="p3" data-org="${p.org}" cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(p.rx)}" ry="${f1(ry)}" fill="url(#${id})" stroke="${shadeRGB(p.rgb, 0.55)}" stroke-width=".45"/>` });
      }
    }
    items.sort((a, b) => a.depth - b.depth);
    return items;

    /* a petal is drawn in two halves (for depth sorting); each half is filled with a stroke of its
       own colour, which hides the seam, and outlined only along the real edge of the organ */
    function poly(P2, fill, p) {
      const d = 'M' + P2.map(q => f1(q[0]) + ',' + f1(q[1])).join('L') + 'Z';
      if (p.facet) return `<path class="p3" data-org="${p.org}" d="${d}" fill="${fill}" stroke="${fill}" stroke-width=".35" stroke-linejoin="round"/>`;
      let s = `<path class="p3" data-org="${p.org}" d="${d}" fill="${fill}" stroke="${fill}" stroke-width=".3" stroke-linejoin="round"/>`;
      if (p.outline) {
        const O = p.outline.map(proj);
        s += `<path class="p3" data-org="${p.org}" d="M${O.map(q => f1(q[0]) + ',' + f1(q[1])).join('L')}" fill="none" stroke="rgba(0,0,0,.34)" stroke-width=".35" stroke-linejoin="round"/>`;
      }
      return s;
    }
  }
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const normalize = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };

  /* direction to the viewer in world coordinates for azimuth az and elevation el */
  function viewDir(az, el) {
    const ca = Math.cos(az), sa = Math.sin(az), ce = Math.cos(el), se = Math.sin(el);
    /* screen depth axis (0, ce, se) in rotated coordinates; rotated y = x·sa + y·ca */
    return [ce * sa, ce * ca, se];
  }

  const LABELS = {
    E: ['Epicáliz', 'Epicalyx'], K: ['Cáliz', 'Calyx'], C: ['Corola', 'Corolla'], P: ['Perigonio', 'Perigon'],
    A: ['Androceo', 'Androecium'], G: ['Gineceo', 'Gynoecium'],
  };

  /* extent of the projected flower over a full turn, so that rotating it never rescales the picture */
  function extent(scene, el, azList) {
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    const elv = rad(el), ce = Math.cos(elv), se = Math.sin(elv);
    for (const a of (azList || [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330])) {
      const az = rad(a), ca = Math.cos(az), sa = Math.sin(az);
      const pr = ([x, y, z], m) => {
        const xr = x * ca - y * sa, yr = x * sa + y * ca;
        const X = xr, Y = yr * se - z * ce;
        x0 = Math.min(x0, X - m); x1 = Math.max(x1, X + m); y0 = Math.min(y0, Y - m); y1 = Math.max(y1, Y + m);
      };
      for (const p of scene.prims) {
        if (p.kind === 'poly' || p.kind === 'line') p.pts.forEach(q => pr(q, 0.5));
        else if (p.kind === 'ell') pr(p.c, Math.max(p.rx, p.ry));
        else if (p.kind === 'ell3') pr(p.c, Math.max(p.rx, p.rz));
      }
    }
    return { x0, x1, y0, y1 };
  }

  /* ---------------- mount ---------------- */
  function mount(host, model, opts) {
    opts = Object.assign({ az: -18, el: 32, explode: 0, colors: 'natural', labels: true, drag: true, height: 330, autoRotate: false }, opts || {});
    const st = { model, az: opts.az, el: opts.el, explode: opts.explode, hl: null, raf: 0, spin: opts.autoRotate };
    const ratio = opts.height / 300;
    host.innerHTML = '';
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'f3d');
    svg.setAttribute('viewBox', `0 0 300 ${opts.height}`);
    svg.setAttribute('role', 'img');
    host.appendChild(svg);
    let scene = null, frame = null;
    function fit() {
      const e = extent(scene, st.el);
      const w = e.x1 - e.x0, h = e.y1 - e.y0;
      const fs = Math.max(w, h) * 0.05;
      const withLbl = opts.labels && st.explode > 0.15;
      const pad = Math.max(w, h) * 0.06;
      let vx = e.x0 - pad, vw = w + 2 * pad + (withLbl ? fs * 9.5 : 0);
      let vy = e.y0 - pad, vh = h + 2 * pad;
      if (vh / vw < ratio) { const nh = vw * ratio; vy -= (nh - vh) / 2; vh = nh; }
      else { const nw = vh / ratio; vx -= (nw - vw) / 2; vw = nw; }
      frame = { vx, vy, vw, vh, fs, right: e.x1 + pad * 0.6 };
      svg.setAttribute('viewBox', `${f1(vx)} ${f1(vy)} ${f1(vw)} ${f1(vh)}`);
    }
    function rebuild() { scene = build(st.model, { explode: st.explode, colors: opts.colors }); fit(); draw(); }
    function draw() {
      const items = render(scene, { az: st.az, el: st.el });
      let out = items.map(it => it.svg).join('');
      if (opts.labels && st.explode > 0.15) out += labels();
      svg.innerHTML = out;
      applyHL();
    }
    function labels() {
      /* one label per whorl, at the height where that whorl floats */
      const lang = (window.I18N && I18N.lang) || 'es';
      const elv = rad(st.el), ce = Math.cos(elv);
      let s = '';
      const alpha = Math.min(1, (st.explode - 0.15) / 0.35);
      const fs = frame.fs, x0 = frame.right;
      scene.orgOrder.forEach(k => {
        const z = scene.mid[k] != null ? scene.mid[k] : scene.zIns;
        const y = -z * ce;
        const name = LABELS[k][lang === 'en' ? 1 : 0];
        s += `<g class="p3 lbl-g" data-org="${k}" opacity="${f1(alpha)}"><path d="M${f1(x0 - fs * 2)},${f1(y)}L${f1(x0 + fs * 0.6)},${f1(y)}" stroke="currentColor" stroke-opacity=".35" stroke-width="${f1(fs * 0.08)}" stroke-dasharray="${f1(fs * 0.25)} ${f1(fs * 0.25)}"/>` +
          `<text class="lbl3" x="${f1(x0 + fs)}" y="${f1(y + fs * 0.35)}" style="font-size:${f1(fs)}px"><tspan class="k" fill="${FM.WHORL_COLORS[k]}">${k}</tspan> ${name}</text></g>`;
      });
      return s;
    }
    function applyHL() {
      svg.classList.toggle('has-hl', !!st.hl);
      svg.querySelectorAll('.p3').forEach(n => n.classList.toggle('hl', !!st.hl && n.getAttribute('data-org') === st.hl));
    }
    /* drag to rotate */
    let drag = null;
    if (opts.drag) {
      svg.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, az: st.az, el: st.el }; st.spin = false; svg.setPointerCapture(e.pointerId); });
      svg.addEventListener('pointermove', e => {
        if (drag) {
          st.az = drag.az - (e.clientX - drag.x) * 0.6;
          st.el = Math.max(-10, Math.min(88, drag.el + (e.clientY - drag.y) * 0.4));
          draw();
          return;
        }
        const t = e.target.closest && e.target.closest('[data-org]');
        const org = t ? t.getAttribute('data-org') : null;
        if (opts.onHover) opts.onHover(org && org !== 'axis' && org !== 'hyp' ? org : null);
      });
      svg.addEventListener('pointerup', () => { if (drag && drag.el !== st.el) { fit(); draw(); } drag = null; });
      svg.addEventListener('pointerleave', () => { if (opts.onHover) opts.onHover(null); });
    }
    function loop() {
      if (st.spin) { st.az += 0.35; draw(); }
      st.raf = requestAnimationFrame(loop);
    }
    if (opts.autoRotate) st.raf = requestAnimationFrame(loop);
    rebuild();
    const onLang = () => draw();
    document.addEventListener('langchange', onLang);
    return {
      set(m) { st.model = m; rebuild(); },
      setExplode(v) { st.explode = v; rebuild(); },
      setView(az, el) { if (az != null) st.az = az; if (el != null) { st.el = el; fit(); } draw(); },
      setColors(c) { opts.colors = c; rebuild(); },
      spin(on) { st.spin = on; if (on && !st.raf) st.raf = requestAnimationFrame(loop); },
      highlight(org) { st.hl = org; applyHL(); },
      get state() { return st; },
      svg,
      destroy() { cancelAnimationFrame(st.raf); document.removeEventListener('langchange', onLang); host.innerHTML = ''; },
    };
  }

  /* a still picture of the flower (atlas plates): no interaction, framed tightly */
  function staticSVG(model, o) {
    o = Object.assign({ az: -24, el: 30, explode: 0, colors: 'natural', ratio: 1, focus: null }, o || {});
    const scene = build(model, { explode: o.explode, colors: o.colors });
    const e = extent(scene, o.el, [o.az]);
    const w = e.x1 - e.x0, h = e.y1 - e.y0, pad = Math.max(w, h) * 0.06;
    let vx = e.x0 - pad, vy = e.y0 - pad, vw = w + 2 * pad, vh = h + 2 * pad;
    if (vh / vw < o.ratio) { const nh = vw * o.ratio; vy -= (nh - vh) / 2; vh = nh; } else { const nw = vh / o.ratio; vx -= (nw - vw) / 2; vw = nw; }
    const items = render(scene, { az: o.az, el: o.el });
    const foc = o.focus ? ` data-focus="${o.focus}"` : '';
    return `<svg class="f3d still" viewBox="${f1(vx)} ${f1(vy)} ${f1(vw)} ${f1(vh)}"${foc} xmlns="http://www.w3.org/2000/svg" role="img">${items.map(x => x.svg).join('')}</svg>`;
  }

  return { mount, build, render, staticSVG, extent };
})();
window.Flower3D = Flower3D;
