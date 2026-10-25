/* FloralPro — longitudinal section of the flower, drawn from the model.

   The flower is cut along its median plane: the adaxial side is on the left,
   the abaxial side on the right. The section is the clearest way to show the
   position of the ovary (hypogynous, perigynous, epigynous), the hypanthium,
   stamens inserted on the corolla (epipetaly), the style (terminal or
   gynobasic) and the placentation seen from the side.

   Section.svg(model, opts) → SVG string; opts: { colors, labels: true }.
   Every part carries data-org so it can be highlighted with the other views. */

const Section = (function () {
  const f1 = v => (Math.round(v * 10) / 10).toString();
  const LBL = {
    K: ['Sépalo', 'Sepal'], C: ['Pétalo', 'Petal'], P: ['Tépalo', 'Tepal'], E: ['Epicáliz', 'Epicalyx'],
    A: ['Estambre', 'Stamen'], anther: ['Antera', 'Anther'], fil: ['Filamento', 'Filament'],
    G: ['Ovario', 'Ovary'], style: ['Estilo', 'Style'], stig: ['Estigma', 'Stigma'], ovule: ['Óvulo', 'Ovule'],
    rec: ['Receptáculo', 'Receptacle'], hyp: ['Hipanto', 'Hypanthium'], ped: ['Pedicelo', 'Pedicel'], disc: ['Disco', 'Disc'],
  };

  function svg(src, opts) {
    const f = FM.normalize(src);
    opts = Object.assign({ colors: 'natural', labels: true }, opts || {});
    const mode = opts.colors;
    const col = k => mode === 'bw' ? (k === 'A' ? '#333' : '#fff') : (k === 'G' && mode !== 'whorl' ? (f.colors.G || '#9cc76a') : FM.color(f, k, mode));
    const stroke = '#2b2b2b';
    const recC = mode === 'bw' ? '#eee' : mode === 'whorl' ? FM.WHORL_COLORS.hyp : '#8db466';
    const locC = '#fbfdf8';
    const ovC = mode === 'whorl' ? FM.WHORL_COLORS.ovule : '#3f6d2a';
    const lang = (window.I18N && I18N.lang) === 'en' ? 1 : 0;
    const L = f.look || {};
    const G = f.G, gt = G ? FM.gynoeciumType(f) : null;
    const pos = G ? G.pos : 'superior';
    const hyp = f.hyp && f.hyp !== 'none' && pos === 'superior';
    let s = '';
    const labels = [];     /* {x, y, key, org} leader targets */
    const g = (org, inner) => `<g class="sc-o" data-org="${org}">${inner}</g>`;
    const path = (d, fill, extra) => `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width=".6" stroke-linejoin="round" ${extra || ''}/>`;

    /* ---------- receptacle / hypanthium / inferior ovary ---------- */
    let ins = { x: 7, y: 0 };      /* insertion point of the perianth (right side; mirrored on the left) */
    let ov = null;                 /* ovary box: cx, cy, rx, ry */
    s += g('axis', path(`M-2.3,26L-2.3,6L2.3,6L2.3,26Z`, recC));
    labels.push({ x: 2.3, y: 20, key: 'ped', org: 'axis' });
    if (pos === 'inferior' || pos === 'half') {
      const top = pos === 'inferior' ? 0 : -9;
      const depth = pos === 'inferior' ? 24 : 14;
      ov = { cx: 0, cy: top + depth * 0.55 - (pos === 'half' ? 3 : 0), rx: 8.5, ry: pos === 'inferior' ? 10 : 11 };
      const wall = `M-3,8 C-11,${f1(top + depth)} -14,${f1(top + depth * 0.35)} -11,${f1(top)} L11,${f1(top)} C14,${f1(top + depth * 0.35)} 11,${f1(top + depth)} 3,8 Z`;
      if (pos === 'inferior') {
        s += g('G', path(`M-3,8 C-12,6 -15,${f1(top + depth * 0.4)} -12,${f1(top - 1)} L12,${f1(top - 1)} C15,${f1(top + depth * 0.4)} 12,6 3,8Z`, recC));
        ins = { x: 11.5, y: top - 1 };
        labels.push({ x: 13, y: top + 8, key: 'rec', org: 'hyp' });
      } else {
        s += g('G', path(`M-3,8 C-12,6 -14,-2 -12.5,${f1(top + 4)} L12.5,${f1(top + 4)} C14,-2 12,6 3,8Z`, recC));
        ins = { x: 12.5, y: top + 4 };
      }
    } else if (hyp) {
      /* floral cup */
      const rimY = f.hyp === 'tube' ? -18 : -11, rimX = f.hyp === 'tube' ? 13 : 19;
      s += g('hyp', path(`M-3,7 C-9,6 ${f1(-rimX + 1)},${f1(rimY + 9)} ${f1(-rimX)},${f1(rimY)} L${f1(-rimX + 2.6)},${f1(rimY + 0.4)} C${f1(-rimX + 3.5)},${f1(rimY + 8)} -7,2.5 0,2.5 C7,2.5 ${f1(rimX - 3.5)},${f1(rimY + 8)} ${f1(rimX - 2.6)},${f1(rimY + 0.4)} L${f1(rimX)},${f1(rimY)} C${f1(rimX - 1)},${f1(rimY + 9)} 9,6 3,7Z`, recC));
      ins = { x: rimX - 1, y: rimY };
      labels.push({ x: rimX - 3, y: rimY + 8, key: 'hyp', org: 'hyp' });
      ov = { cx: 0, cy: -5, rx: 6, ry: 7.5 };
    } else {
      s += g('axis', path(`M-2.6,7 C-6,6 -8,3 -7.5,0 L7.5,0 C8,3 6,6 2.6,7Z`, recC));
      ins = { x: 7, y: 0 };
      ov = G ? { cx: 0, cy: -10.5, rx: 8.5, ry: 11 } : null;
      labels.push({ x: 7.3, y: 3, key: 'rec', org: 'axis' });
    }

    /* ---------- perianth: sepals outside, petals inside ---------- */
    const blade = (x0, y0, len, ang, wid, fill, org, side, curl) => {
      /* a curved leaf-like blade in the section plane, starting at (x0, y0) */
      const a = ang * Math.PI / 180, c = (curl || 0) * Math.PI / 180;
      const x1 = x0 + side * Math.cos(a) * len * 0.5, y1 = y0 - Math.sin(a) * len * 0.5;
      const x2 = x1 + side * Math.cos(a + c) * len * 0.5, y2 = y1 - Math.sin(a + c) * len * 0.5;
      const nx = -Math.sin(a) * side, ny = -Math.cos(a);
      const w = wid;
      return g(org, path(`M${f1(x0)},${f1(y0)} Q${f1(x1 - nx * w)},${f1(y1 - ny * w)} ${f1(x2)},${f1(y2)} Q${f1(x1 + nx * w * 0.35)},${f1(y1 + ny * w * 0.35)} ${f1(x0 + side * 0.8)},${f1(y0 + 0.3)}Z`, fill));
    };
    const per = [];
    if (f.E) per.push({ k: 'E', len: 16, ang: 20, wid: 2.2 });
    if (f.K) per.push({ k: 'K', len: L.pappus ? 6 : (f.C || f.P ? 20 : 30), ang: L.pappus ? 70 : 38, wid: L.pappus ? 0.6 : 2.8, fused: FM.allConnate(f.K) });
    if (f.P) f.P.w.forEach((w, i) => per.push({ k: 'P', len: 38 - i * 2, ang: 58 - i * 6, wid: 4, fused: FM.allConnate(f.P) }));
    if (f.C) per.push({ k: 'C', len: 34, ang: 55, wid: 4.5, fused: FM.allConnate(f.C) });
    const tubeH = L.tube != null ? L.tube * 34 : 10;
    let tubeTop = null;
    per.forEach((p, i) => {
      const fill = col(p.k);
      const off = i * 1.2;
      const x0 = ins.x - off * 0.8, y0 = ins.y - off * 0.5;
      if (FM.cmax(FM.total(f[p.k])) === 0) return;
      for (const side of [-1, 1]) {
        let ang = p.ang, curl = -10, len = p.len;
        if (L.corolla === 'rotate' && p.k === 'C') { ang = 18; curl = -8; }
        if (L.corolla === 'campanulate' && p.k === 'C') { ang = 72; curl = -25; }
        if (L.corolla === 'tubular' && p.k === 'C') { ang = 84; curl = -20; len = 26; }
        if (L.corolla === 'bilabiate' && p.k === 'C') { if (side < 0) { ang = 80; curl = 55; } else { ang = 30; curl = -35; } }
        if (L.corolla === 'papilionaceous' && p.k === 'C') { if (side < 0) { ang = 80; curl = 40; len = 36; } else { ang = 25; curl = 10; len = 22; } }
        if (L.perianth === 'funnelform' && p.k === 'P') { ang = 72; curl = -22; len = 44; }
        if (p.fused && (p.k === 'C' || p.k === 'P') && tubeH > 3) {
          /* tube wall, then the free lobe */
          const tx = x0 + side * Math.cos((ang + 20) * Math.PI / 180) * tubeH * 0.25 * (side > 0 ? 1 : -1) * side;
          const topX = side * (Math.abs(x0) + tubeH * Math.cos(Math.min(ang, 82) * Math.PI / 180)), topY = y0 - tubeH * Math.sin(Math.min(ang + 10, 86) * Math.PI / 180);
          s += g(p.k, `<path d="M${f1(side * Math.abs(x0))},${f1(y0)} L${f1(topX)},${f1(topY)}" stroke="${fill}" stroke-width="2.4" stroke-linecap="round"/><path d="M${f1(side * Math.abs(x0))},${f1(y0)} L${f1(topX)},${f1(topY)}" stroke="${stroke}" stroke-width=".5" fill="none" stroke-dasharray="0"/>`);
          s += blade(topX, topY, len - tubeH, Math.max(ang - 25, 5), p.wid, fill, p.k, side, curl);
          if (side > 0) tubeTop = { x: topX, y: topY };
        } else if (p.fused && p.k === 'K') {
          const tH = Math.min(8, len * 0.35);
          const topX = side * (Math.abs(x0) + 2), topY = y0 - tH;
          s += g(p.k, `<path d="M${f1(side * Math.abs(x0))},${f1(y0)} L${f1(topX)},${f1(topY)}" stroke="${fill}" stroke-width="2.2" stroke-linecap="round"/>`);
          s += blade(topX, topY, len - tH, ang, p.wid, fill, p.k, side, curl);
        } else {
          s += blade(side * Math.abs(x0), y0, len, ang, p.wid, fill, p.k, side, curl);
        }
      }
      labels.push({ x: ins.x + 14 + i * 4, y: ins.y - 8 - i * 6, key: p.k, org: p.k });
    });

    /* ---------- androecium ---------- */
    const epi = FM.adnate(f, 'C', 'A') || FM.adnate(f, 'P', 'A');
    const gyno = FM.adnate(f, 'A', 'G');
    if (f.A && FM.cmax(FM.total(f.A, { fertile: true })) > 0) {
      const aC = col('A');
      const many = FM.isMany(FM.total(f.A));
      const per_side = many ? 3 : 1;
      for (const side of [-1, 1]) for (let k = 0; k < per_side; k++) {
        let bx = side * (Math.abs(ins.x) - 2.2 - k * 1.2), by = ins.y - 0.6 - k * 0.3;
        if (epi && tubeTop) { bx = side * (Math.abs(ins.x) + (Math.abs(tubeTop.x) - Math.abs(ins.x)) * 0.5 - 0.6); by = (ins.y + tubeTop.y) / 2; }
        let tx = side * (6 + k * 3), ty = (ov ? Math.min(ov.cy - ov.ry, ins.y) : ins.y) - 18 - k * 3;
        if (L.dyn === 'didynamous' && side < 0) ty += 5;
        if (gyno && ov) { bx = side * 1.5; by = ov.cy - ov.ry - 10; tx = side * 1.5; ty = by - 6; }
        if (f.A.connate || (f.A.w.length === 1 && f.A.w[0].connate === true && !L.synanther)) { /* monadelphous tube */
          bx = side * 3; tx = side * 3.6;
        }
        s += g('A', `<path d="M${f1(bx)},${f1(by)} Q${f1(bx + side * 1.5)},${f1((by + ty) / 2)} ${f1(tx)},${f1(ty)}" stroke="${mode === 'bw' ? '#555' : '#d9cfa0'}" stroke-width="1.1" fill="none" stroke-linecap="round"/>` +
          `<ellipse cx="${f1(tx)}" cy="${f1(ty - 2.4)}" rx="1.9" ry="3" fill="${aC}" stroke="${stroke}" stroke-width=".5"/>`);
        if (side > 0 && k === 0) { labels.push({ x: tx + 2, y: ty - 3, key: 'anther', org: 'A' }); labels.push({ x: (bx + tx) / 2 + 1, y: (by + ty) / 2, key: 'fil', org: 'A' }); }
      }
      if (f.A.connate || (f.A.w.length === 1 && f.A.w[0].connate === true && !L.synanther && many)) {
        s += g('A', path(`M-3.4,${f1(ins.y - 1)} L-3.2,${f1(ins.y - 14)} L3.2,${f1(ins.y - 14)} L3.4,${f1(ins.y - 1)}Z`, mode === 'bw' ? '#ddd' : '#e8dfb0', 'opacity=".85"'));
      }
    }

    /* ---------- gynoecium ---------- */
    if (G && ov && FM.cmax(FM.total(G, { visible: true })) > 0 && !G.w.every(w => w.state === 'sterile')) {
      const gC = col('G');
      const { cx, cy, rx, ry } = ov;
      const inf = pos !== 'superior';
      let top = cy - ry;
      if (gt.type === 'apo') {
        /* two or three free carpels side by side */
        const n = Math.min(3, FM.ctyp(FM.total(G)));
        for (let i = 0; i < n; i++) {
          const x = (i - (n - 1) / 2) * 6.5;
          s += g('G', path(`M${f1(x)},${f1(cy + ry * 0.7)} C${f1(x - 4)},${f1(cy + ry * 0.5)} ${f1(x - 3.4)},${f1(cy - ry * 0.6)} ${f1(x)},${f1(cy - ry * 0.95)} C${f1(x + 3.4)},${f1(cy - ry * 0.6)} ${f1(x + 4)},${f1(cy + ry * 0.5)} ${f1(x)},${f1(cy + ry * 0.7)}Z`, gC) +
            `<ellipse cx="${f1(x + 0.6)}" cy="${f1(cy)}" rx="1.4" ry="1.7" fill="${ovC}"/>` +
            `<path d="M${f1(x)},${f1(cy - ry * 0.95)} L${f1(x + 0.5)},${f1(cy - ry - 7)}" stroke="${gC}" stroke-width="1.1"/>`);
        }
        top = cy - ry - 7;
      } else {
        if (!inf) s += g('G', `<ellipse cx="${cx}" cy="${f1(cy)}" rx="${rx}" ry="${ry}" fill="${gC}" stroke="${stroke}" stroke-width=".6"/>`);
        /* locule and ovules */
        const lrx = rx * 0.68, lry = ry * 0.72;
        let loc = `<ellipse cx="${cx}" cy="${f1(cy)}" rx="${f1(lrx)}" ry="${f1(lry)}" fill="${locC}" stroke="${stroke}" stroke-width=".45"/>`;
        const ovule = (x, y, r) => `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r)}" ry="${f1(r * 0.8)}" fill="${ovC}"/>`;
        const plac = G.plac;
        const nOv = G.ov != null ? FM.ctyp(G.ov) : 4;
        if (plac === 'axile' || plac === 'laminar') {
          loc += `<path d="M${cx},${f1(cy - lry)} L${cx},${f1(cy + lry)}" stroke="${stroke}" stroke-width="1.2"/>`;
          const k = Math.min(nOv >= 8 ? 4 : Math.max(1, Math.ceil(nOv / 2)), 4);
          for (let i = 0; i < k; i++) { const y = cy - lry * 0.6 + (i + 0.5) * (lry * 1.2 / k); loc += ovule(cx - 2.1, y, 1.3) + ovule(cx + 2.1, y, 1.3); }
        } else if (plac === 'parietal') {
          const k = Math.min(4, Math.max(1, Math.ceil(nOv / 2)));
          for (let i = 0; i < k; i++) { const y = cy - lry * 0.6 + (i + 0.5) * (lry * 1.2 / k); loc += ovule(cx - lrx + 1.6, y, 1.2) + ovule(cx + lrx - 1.6, y, 1.2); }
          if (G.replum) loc += `<path d="M${cx},${f1(cy - lry)} L${cx},${f1(cy + lry)}" stroke="${stroke}" stroke-width=".5" stroke-dasharray="1.2 .8"/>`;
        } else if (plac === 'freecentral') {
          loc += `<path d="M${cx},${f1(cy + lry)} L${cx},${f1(cy - lry * 0.3)}" stroke="${gC}" stroke-width="2.6"/>`;
          for (let i = 0; i < 3; i++) { const y = cy + lry * 0.6 - i * lry * 0.35; loc += ovule(cx - 2.4, y, 1.1) + ovule(cx + 2.4, y, 1.1); }
        } else if (plac === 'basal') {
          loc += ovule(cx, cy + lry * 0.35, 2.6);
        } else if (plac === 'apical') {
          loc += ovule(cx, cy - lry * 0.35, 2.6);
        } else {   /* marginal: along the ventral suture (adaxial side, left) */
          const k = Math.min(nOv || 3, 4);
          for (let i = 0; i < k; i++) loc += ovule(cx - lrx + 1.5, cy - lry * 0.6 + (i + 0.5) * (lry * 1.2 / k), 1.2);
        }
        s += g('G', loc);
        labels.push({ x: cx + lrx * 0.3, y: cy + lry * 0.3, key: 'ovule', org: 'G' });
        if (!inf || true) labels.push({ x: cx + rx, y: cy, key: 'G', org: 'G' });
      }
      /* style and stigma */
      const sTop = Math.min(top, ins.y) - (L.corolla === 'tubular' ? 34 : 24);
      const sBase = G.style === 'gynobasic' ? cy + ry * 0.6 : (inf ? ins.y - 1 : top);
      const styleC = mode === 'bw' ? '#555' : (mode === 'whorl' ? '#5aa0d0' : '#b9cf88');
      if (gt.type !== 'apo') {
        if (G.style === 'gynobasic') {
          /* the ovary is four-lobed; the style rises from between the lobes */
          s += g('G', `<path d="M${cx},${f1(cy - ry * 0.2)} L${cx},${f1(cy + ry * 0.75)}" stroke="${locC}" stroke-width="2.4"/>`);
        }
        if (G.style === 'lateral' && !inf) {
          /* a lateral style leaves the ovary from its side, below the top */
          const sx = cx + rx * 0.92, sy = cy - ry * 0.25;
          s += g('G', `<path d="M${f1(sx)},${f1(sy)} Q${f1(sx + 5)},${f1(sy - 8)} ${f1(cx + 3)},${f1(sTop)}" stroke="${styleC}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`);
        } else s += g('G', `<path d="M${cx},${f1(sBase)} L${cx},${f1(sTop)}" stroke="${styleC}" stroke-width="1.5" stroke-linecap="round"/>`);
        const scx = G.style === 'lateral' && !inf ? cx + 3 : cx;
        if (L.stigma === 'plumose') {
          /* two feathery branches */
          let fe = '';
          for (const sgn of [-1, 1]) {
            fe += `<path d="M${scx},${f1(sTop)} l${sgn * 5},-7" stroke="${styleC}" stroke-width="1.1"/>`;
            for (let k = 1; k <= 5; k++) { const bx = scx + sgn * k, by = sTop - k * 1.4; fe += `<path d="M${f1(bx)},${f1(by)} l${sgn * 1.8},0.6 M${f1(bx)},${f1(by)} l${sgn * -0.4},-1.8" stroke="${styleC}" stroke-width=".5"/>`; }
          }
          s += g('G', fe);
        } else if (L.stigma === 'petaloid') {
          s += g('G', `<path d="M${scx},${f1(sTop)} q-7,-2 -9,-9 q5,1 9,7 M${scx},${f1(sTop)} q7,-2 9,-9 q-5,1 -9,7" fill="${styleC}" stroke="${stroke}" stroke-width=".4"/>`);
        } else {
          const lob = L.stigma === 'bifid' ? 2 : (L.stigma === 'capitate' || L.stigma === 'punctiform' || L.stigma === 'discoid') ? 0 : 3;
          if (lob === 0) s += g('G', L.stigma === 'discoid' ? `<ellipse cx="${scx}" cy="${f1(sTop - 1)}" rx="3.4" ry="1.3" fill="${styleC}" stroke="${stroke}" stroke-width=".4"/>` : `<circle cx="${scx}" cy="${f1(sTop - 1.2)}" r="${L.stigma === 'punctiform' ? 0.9 : 1.9}" fill="${styleC}" stroke="${stroke}" stroke-width=".4"/>`);
          else s += g('G', `<path d="M${scx},${f1(sTop)} l-3,-3 M${scx},${f1(sTop)} l3,-3${lob === 3 ? ` M${scx},${f1(sTop)} l0,-3.6` : ''}" stroke="${styleC}" stroke-width="1.3" stroke-linecap="round" fill="none"/>`);
        }
        labels.push({ x: cx + 0.8, y: (sBase + sTop) / 2 - 4, key: 'style', org: 'G' });
        labels.push({ x: cx + 2.5, y: sTop - 2, key: 'stig', org: 'G' });
      }
    }
    if (f.disc && ov) s += g('disc', `<path d="M${f1(-ov.rx - 1)},${f1(ov.cy + ov.ry - 1)} q${f1(ov.rx + 1)},4 ${f1(2 * ov.rx + 2)},0" stroke="${FM.WHORL_COLORS.disc}" stroke-width="2.4" fill="none"/>`);

    /* ---------- labels, on the right with leader lines ---------- */
    let lab = '';
    if (opts.labels) {
      const seen = new Set();
      const L2 = labels.filter(l => { const k = l.key; if (seen.has(k)) return false; seen.add(k); return true; }).sort((a, b) => a.y - b.y);
      const x0 = 52;
      let lastY = -1e9;
      L2.forEach(l => {
        let y = Math.max(l.y, lastY + 6.2);
        lastY = y;
        lab += `<g class="sc-o" data-org="${l.org}"><path d="M${f1(l.x)},${f1(l.y)} L${f1(x0 - 3)},${f1(y)}" stroke="#8a8a8a" stroke-width=".35" fill="none"/><circle cx="${f1(l.x)}" cy="${f1(l.y)}" r=".7" fill="#8a8a8a"/><text class="sc-lbl" x="${x0}" y="${f1(y + 1.8)}">${LBL[l.key][lang]}</text></g>`;
      });
    }
    const vb = opts.labels ? '-56 -80 142 110' : '-56 -80 112 110';
    const foc = opts.focus ? ` data-focus="${opts.focus}"` : '';
    return `<svg class="fsection" viewBox="${vb}"${foc} xmlns="http://www.w3.org/2000/svg" role="img">${s}${lab}</svg>`;
  }

  return { svg };
})();
window.Section = Section;
