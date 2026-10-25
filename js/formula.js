/* FloralPro — floral formulae in two conventions, and a reader for typed formulae.

   'classic'  The textbook formula: ✱ / ↑ for symmetry, ⚥ ♂ ♀ for sex, K C P A G
              with the numbers as subscripts, parentheses for connation, an arc
              (tie) over organ categories fused to each other, and the number of
              carpels underlined (superior ovary), overlined (inferior) or struck
              through (half-inferior). Unequal members of one whorl are added
              with '+', staminodes carry '°' and lost organs are not written.
   'prenner'  The expanded formula of Prenner, Bateman & Rudall (2010, Taxon 59:
              241–250): * ↓ → Ø ┼ ∂ for symmetry, ♂ ♀ only for unisexual flowers,
              optional B and Bt (bract, bracteoles), '+' between whorls and ':'
              between unequal members of one whorl, ( ) connation, [ ] and { }
              adnation of two or three organ categories, superscript r for a
              reduced organ and superscript 0 for a lost one, superscript C for a
              petaloid calyx, G̲ / Ğ / -G- for a superior, inferior or
              half-inferior ovary, and V + placentation + number of ovules.
              Two symbols come from Ronse De Craene (2010) and Ronse De Craene
              et al. (2014, Taxon 63: 1103–1111): E for the epicalyx and ↺ for a
              spiral flower, which Prenner et al. do not cover.

   Formula.html(model, conv, opts) → HTML with one <span data-org="K|C|…"> per
   organ category, so the page can highlight a whorl in every view at once.
   Formula.text(model, conv, opts) → the same in plain Unicode (for copying).
   Formula.parse(text) → { model, warnings } from a formula typed in either style. */

const Formula = (function () {
  const SYM = {
    classic: { actino: '✱', zygo: '↑', zygoT: '↑', zygoO: '↑', disym: '✱', asym: '↯', spiral: '✱' },
    prenner: { actino: '*', zygo: '↓', zygoT: '→', zygoO: 'Ø', disym: '┼', asym: '∂', spiral: '↺' },
  };
  const SEX = { bisexual: '⚥', staminate: '♂', pistillate: '♀' };
  const PLAC = { apical: 'a', axile: 'x', basal: 'b', freecentral: 'c', parietal: 'p', marginal: 'm', laminar: 'l' };
  const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', r: 'ʳ', C: 'ᶜ', '–': '⁻', '∞': '^∞' };
  const LOW = '̲', OVER = '̅', STRIKE = '̶';
  const escH = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /* ---------- atoms: strings, or {sup:'…'} for superscripts ---------- */
  function partAtoms(p, conv) {
    const n = FM.cstr(p.n);
    const a = p.connate ? ['(' + n + ')'] : [n];
    if (conv === 'prenner') {
      if (p.state === 'sterile') a.push({ sup: 'r' });
      if (p.state === 'lost') a.push({ sup: '0' });
    } else if (p.state === 'sterile') a.push('°');
    return a;
  }
  function whorlAtoms(w, conv) {
    if (w.fasc) {
      const g = FM.cstr(w.fasc.g), per = FM.cstr(w.fasc.per);
      if (conv === 'prenner') return [g, { sup: per }];
      const gn = w.fasc.g;
      if (typeof gn === 'number' && isFinite(gn) && gn <= 5) return [Array(gn).fill('(' + per + ')').join('+')];
      return [g + '×(' + per + ')'];
    }
    /* connate: true = the members are united; 'apical' = free ovaries with united styles or
       stigmas (written with ^ in the expanded formula, after Ronse De Craene et al. 2014) */
    const conn = w.connate === true;
    const tail = a => { if (w.connate === 'apical' && conv === 'prenner') a.push('^'); return a; };
    if (w.parts) {
      if (conv === 'prenner') {
        /* the expanded formula always reads from the adaxial side, even when the model
           lists the groups from the abaxial side (Salvia: A1⁰:2ʳ:2, not A2:2ʳ:1⁰) */
        const a = [], parts = w.from === 'abaxial' ? [...w.parts].reverse() : w.parts;
        parts.forEach((p, i) => { if (i) a.push(':'); a.push(...partAtoms(p, conv)); });
        return tail(conn ? ['(', ...a, ')'] : a);
      }
      const vis = w.parts.filter(p => p.state !== 'lost');
      if (!vis.length) return [];
      if (conn) return ['(' + FM.cstr(vis.reduce((s, p) => FM.cadd(s, p.n), null)) + ')'];
      const differ = vis.some(p => !!p.connate !== !!vis[0].connate || p.state !== vis[0].state);
      if (!differ) return [FM.cstr(vis.reduce((s, p) => FM.cadd(s, p.n), null))].map(x => vis[0].connate ? '(' + x + ')' : x).concat(vis[0].state === 'sterile' ? ['°'] : []);
      const a = [];
      vis.forEach((p, i) => { if (i) a.push('+'); a.push(...partAtoms(p, conv)); });
      return a;
    }
    const n = FM.cstr(w.n);
    if (w.state === 'lost') return conv === 'prenner' ? [n, { sup: '0' }] : [];
    const a = [conn ? '(' + n + ')' : n];
    if (w.state === 'sterile') a.push(conv === 'prenner' ? { sup: 'r' } : '°');
    return tail(a);
  }
  function organAtoms(org, conv) {
    const ws = org.w.map(w => whorlAtoms(w, conv)).filter(a => a.length);
    if (!ws.length) return ['0'];
    const a = [];
    ws.forEach((w, i) => { if (i) a.push('+'); a.push(...w); });
    if (org.connate && ws.length > 1) return ['(', ...a, ')'];
    return a;
  }
  const atomsHTML = atoms => atoms.map(x => typeof x === 'string' ? escH(x) : `<sup>${escH(x.sup)}</sup>`).join('');
  const atomsText = atoms => atoms.map(x => typeof x === 'string' ? x : [...x.sup].map(c => SUP[c] || '^' + c).join('')).join('');
  const markEach = (s, mark) => [...s].map(c => c + mark).join('');

  /* ---------- segments ---------- */
  function segments(src, conv, opts) {
    const f = FM.normalize(src);
    conv = conv === 'prenner' ? 'prenner' : 'classic';
    opts = Object.assign({ sex: conv === 'classic', bracts: false, ovules: false }, opts || {});
    const segs = [];
    const sym = SYM[conv][f.sym] || SYM[conv].actino;
    segs.push({ org: 'sym', html: escH(sym), text: sym });
    if (conv === 'classic' ? opts.sex : f.sex !== 'bisexual') segs.push({ org: 'sex', html: SEX[f.sex], text: SEX[f.sex] });
    if (conv === 'prenner' && opts.bracts) {
      if (f.B) segs.push({ org: 'B', html: 'B', text: 'B' });
      /* the number of bracteoles is always written: "Bt" alone is read as a pair */
      if (f.Bt) segs.push({ org: 'Bt', html: `Bt<span class="ff-n">${f.Bt}</span>`, text: 'Bt' + f.Bt });
    }
    for (const k of FM.ORG) {
      const org = f[k];
      if (!org) continue;
      const atoms = organAtoms(org, conv);
      if (conv === 'prenner' && k === 'K' && org.like === 'C') atoms.push({ sup: 'C' });
      if (conv === 'prenner' && org.sym) atoms.push(SYM.prenner[org.sym] || '');
      let html, text;
      if (conv === 'classic') {
        let inner = atomsHTML(atoms), itext = atomsText(atoms);
        if (k === 'G') {
          const cls = { superior: 'ff-low', inferior: 'ff-over', half: 'ff-mid' }[f.G.pos] || 'ff-low';
          html = `G<sub class="ff-pos ${cls}">${inner}</sub>`;
          text = 'G' + markEach(itext, { superior: LOW, inferior: OVER, half: STRIKE }[f.G.pos] || LOW);
        } else {
          html = `${k}<sub>${inner}</sub>`;
          text = k + itext;
        }
      } else {
        const inner = `<span class="ff-n">${atomsHTML(atoms)}</span>`, itext = atomsText(atoms);
        if (k === 'G') {
          if (f.G.pos === 'inferior') { html = 'Ğ' + inner; text = 'Ğ' + itext; }
          else if (f.G.pos === 'half') { html = '-G-' + inner; text = '-G-' + itext; }
          else { html = '<span class="ff-u">G</span>' + inner; text = 'G' + LOW + itext; }
        } else { html = k + inner; text = k + itext; }
      }
      segs.push({ org: k, html, text });
      if (k === 'G' && conv === 'prenner' && opts.ovules && f.G.ov != null) {
        const v = 'V' + (PLAC[f.G.plac] || '') + FM.cstr(f.G.ov);
        segs.push({ org: 'V', html: `V<span class="ff-n">${escH((PLAC[f.G.plac] || '') + FM.cstr(f.G.ov))}</span>`, text: v });
      }
    }
    /* adnation: contiguous organ categories wrapped together */
    const order = segs.map(s => s.org);
    const groups = [];
    for (const g of f.adn) {
      const idx = g.map(k => order.indexOf(k)).filter(i => i >= 0).sort((a, b) => a - b);
      if (idx.length < 2) continue;
      groups.push({ from: idx[0], to: idx[idx.length - 1], n: idx.length });
    }
    return { segs, groups, conv, f };
  }

  function html(src, conv, opts) {
    const { segs, groups } = segments(src, conv, opts);
    conv = conv === 'prenner' ? 'prenner' : 'classic';
    const parts = segs.map(s => `<span class="ff-o" data-org="${s.org}">${s.html}</span>`);
    /* wrap from the innermost group outwards */
    groups.sort((a, b) => (a.to - a.from) - (b.to - b.from));
    const open = {}, close = {};
    for (const g of groups) {
      const [o, c] = conv === 'classic' ? ['<span class="ff-adn">', '</span>'] : (g.n >= 3 ? ['<span class="ff-br">{</span>', '<span class="ff-br">}</span>'] : ['<span class="ff-br">[</span>', '<span class="ff-br">]</span>']);
      (open[g.from] = open[g.from] || []).push(o);
      (close[g.to] = close[g.to] || []).unshift(c);
    }
    const out = parts.map((p, i) => (open[i] ? open[i].slice().reverse().join('') : '') + p + (close[i] ? close[i].join('') : ''));
    return `<span class="ff ff-${conv}">${out.join(' ')}</span>`;
  }

  function text(src, conv, opts) {
    const { segs, groups } = segments(src, conv, opts);
    const out = segs.map(s => s.text);
    for (const g of groups) {
      const [o, c] = g.n >= 3 && conv === 'prenner' ? ['{', '}'] : ['[', ']'];
      out[g.from] = o + out[g.from];
      out[g.to] = out[g.to] + c;
    }
    return out.join(' ');
  }

  /* ---------------- reader ----------------
     Accepts either convention, with or without spaces, subscripts or
     superscripts. Examples:  "* K5 [C(5) A5] G(2)",  "↑ K(5) C1:2:(2) A(9):1 G1",
     "✱ P3+3 A3+3 G(3)",  "* P3+3 [A1 Ğ(3)]",  "* K(5) C(5) A5 G(2) inf". */
  function parse(str) {
    const warnings = [];
    const m = { sym: null, sex: 'bisexual', adn: [] };
    let s = String(str || '').normalize('NFC')
      .replace(/[₀-₉]/g, d => String(d.charCodeAt(0) - 0x2080)).replace(/₍/g, '(').replace(/₎/g, ')')
      .replace(/[⁽]/g, '(').replace(/[⁾]/g, ')');
    let i = 0;
    const stack = [];
    let halfOpen = false;
    const isDigit = c => c >= '0' && c <= '9';
    const COMB = new Set([LOW, OVER, STRIKE, '̆', '̂', '̄']);
    const SUPD = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
    let marks = null;           /* combining marks met inside a G count */
    let orgSym = null;          /* a symmetry arrow met inside the numbers of an organ */

    function skipComb() { while (i < s.length && COMB.has(s[i])) { (marks = marks || []).push(s[i]); i++; } }
    function readNum() {
      skipComb();
      let a = '';
      if (s[i] === '∞') { i++; skipComb(); return Infinity; }
      while (i < s.length && isDigit(s[i])) { a += s[i++]; skipComb(); }
      if (!a) return null;
      let v = +a;
      /* a range "4–5"; the dash may carry an ovary-position mark like the digits */
      let j = i + 1;
      while (j < s.length && COMB.has(s[j])) j++;
      if ((s[i] === '-' || s[i] === '–') && (isDigit(s[j] || '') || s[j] === '∞')) {
        i++; skipComb();
        let b = '';
        if (s[i] === '∞') { i++; skipComb(); return [v, Infinity]; }
        while (i < s.length && isDigit(s[i])) { b += s[i++]; skipComb(); }
        return [v, +b];
      }
      return v;
    }
    /* marks written after a number: ° ʳ ^r → sterile, ⁰ ^0 → lost, superscript number → fascicles */
    function readPost(target) {
      for (;;) {
        skipComb();
        const c = s[i];
        if (c === '°') { target.state = 'sterile'; i++; continue; }
        if (c === 'ʳ') { target.state = 'sterile'; i++; continue; }
        if (c === '^' && s[i + 1] === 'r') { target.state = 'sterile'; i += 2; continue; }
        if (c === '^' && s[i + 1] === '0' && !isDigit(s[i + 2] || '')) { target.state = 'lost'; i += 2; continue; }
        if (c === '⁰' && !SUPD[s[i + 1]]) { target.state = 'lost'; i++; continue; }
        /* classic bundles written as groups × (stamens per group), e.g. A5–10×(∞) */
        if (c === '×' && s[i + 1] === '(') {
          i += 2; const per = readNum();
          if (s[i] === ')') i++;
          target.fasc = { per }; continue;
        }
        if (c === '^' && (isDigit(s[i + 1] || '') || s[i + 1] === '∞')) {
          i++; const per = readNum(); target.fasc = { per }; continue;
        }
        if (SUPD[c]) {
          const sup = () => { let d = ''; while (SUPD[s[i]]) d += SUPD[s[i++]]; return +d; };
          const a = sup();
          /* a superscript range, e.g. A5⁴⁻⁸ (five bundles of four to eight stamens) */
          if (s[i] === '⁻' && (SUPD[s[i + 1]] || (s[i + 1] === '^' && s[i + 2] === '∞'))) {
            i++;
            if (s[i] === '^') { i += 2; target.fasc = { per: [a, Infinity] }; continue; }
            target.fasc = { per: [a, sup()] }; continue;
          }
          target.fasc = { per: a }; continue;
        }
        /* a lone ^: free ovaries with united styles or stigmas (e.g. G2^) */
        if (c === '^' && !/[0-9r∞C]/.test(s[i + 1] || '')) { target.apical = true; i++; continue; }
        /* symmetry of one whorl written after its numbers, e.g. A(3):2ʳ↓+4ʳ:1⁰ */
        if (c === '↓' || c === '↑') { orgSym = 'zygo'; i++; continue; }
        if (c === '→') { orgSym = 'zygoT'; i++; continue; }
        break;
      }
    }
    function readPart() {
      skipComb();
      const p = {};
      if (s[i] === '(') {
        const save = i; i++;
        const n = readNum();
        skipComb();
        if (n != null && s[i] === ')') { i++; p.n = n; p.connate = true; readPost(p); return p; }
        i = save; return null;
      }
      const n = readNum();
      if (n == null) return null;
      p.n = n; readPost(p);
      return p;
    }
    function readPartList() {
      const parts = [];
      const first = readPart();
      if (!first) return null;
      parts.push(first);
      while (s[i] === ':') { i++; const p = readPart(); if (!p) { warnings.push(T('Falta un número después de «:».', 'A number is missing after ":".')); break; } parts.push(p); }
      return parts;
    }
    function toWhorl(parts, connate) {
      if (parts.length === 1) {
        const p = parts[0], w = { n: p.n, connate: p.apical ? 'apical' : !!(connate || p.connate) };
        if (p.state) w.state = p.state;
        if (p.fasc) w.fasc = { g: p.n, per: p.fasc.per };
        return w;
      }
      return { connate: !!connate, parts: parts.map(p => Object.assign({ n: p.n }, p.connate ? { connate: true } : {}, p.state ? { state: p.state } : {})) };
    }
    function readWhorl() {
      skipComb();
      if (s[i] === '(') {
        /* "(3:2)" is one connate whorl; "(5)" is handled by readPart */
        const save = i; i++;
        const parts = readPartList();
        skipComb();
        if (parts && parts.length > 1 && s[i] === ')') { i++; const w = toWhorl(parts, true); readPost(w); return w; }
        i = save;
      }
      const parts = readPartList();
      return parts ? toWhorl(parts, false) : null;
    }
    function readWhorlList() {
      const ws = [];
      const w = readWhorl();
      if (!w) return null;
      ws.push(w);
      while (s[i] === '+' && (isDigit(s[i + 1] || '') || s[i + 1] === '(' || s[i + 1] === '∞')) { i++; const x = readWhorl(); if (!x) break; ws.push(x); }
      return ws;
    }
    function readCounts() {
      while (s[i] === ' ' && (isDigit(s[i + 1] || '') || s[i + 1] === '(')) i++;
      skipComb();
      /* "(3+3)": all whorls connate together */
      if (s[i] === '(') {
        let depth = 0, j = i, plus = false;
        for (; j < s.length; j++) {
          if (s[j] === '(') depth++;
          else if (s[j] === ')') { depth--; if (depth === 0) break; }
          else if (s[j] === '+' && depth === 1) plus = true;
        }
        if (plus && depth === 0) {
          i++;
          const ws = readWhorlList();
          skipComb();
          if (s[i] === ')') i++;
          return { w: ws || [], connate: true };
        }
      }
      const ws = readWhorlList();
      return ws ? { w: ws, connate: false } : null;
    }
    function readOrganTail(org) {
      for (;;) {
        skipComb();
        const c = s[i];
        if (c === 'ᶜ') { org.like = 'C'; i++; continue; }
        if (c === '^' && s[i + 1] === 'C') { org.like = 'C'; i += 2; continue; }
        if (c === '↓' || c === '↑') { org.sym = 'zygo'; i++; continue; }
        if (c === '→') { org.sym = 'zygoT'; i++; continue; }
        break;
      }
    }

    while (i < s.length) {
      const c = s[i];
      if (/\s|,|;/.test(c)) { i++; continue; }
      if ('*✱✶⊕✳'.includes(c)) { m.sym = 'actino'; i++; continue; }
      if (s.startsWith('·|·', i)) { m.sym = 'zygo'; i += 3; continue; }
      if ('↑↓%'.includes(c)) { m.sym = 'zygo'; i++; continue; }
      if (c === '→' || c === '÷') { m.sym = 'zygoT'; i++; continue; }
      if (c === 'Ø') { m.sym = 'zygoO'; i++; continue; }
      if ('┼↔⤧'.includes(c)) { m.sym = 'disym'; i++; continue; }
      if ('∂↯$'.includes(c)) { m.sym = 'asym'; i++; continue; }
      if (c === '↺') { m.sym = 'spiral'; i++; continue; }
      if (c === '⚥' || c === '☿') { m.sex = 'bisexual'; i++; continue; }
      if (c === '♂') { m.sex = 'staminate'; i++; continue; }
      if (c === '♀') { m.sex = 'pistillate'; i++; continue; }
      if (c === '[' || c === '{') { stack.push([]); i++; continue; }
      if (c === ']' || c === '}') {
        const g = stack.pop();
        if (g && g.length >= 2) m.adn.push(g);
        else if (!g) warnings.push(T('Hay un corchete de cierre sin apertura.', 'There is a closing bracket without an opening one.'));
        i++; continue;
      }
      if (c === '-' && /[GĞĜḠ]/.test(s[i + 1] || '')) { halfOpen = true; i++; continue; }
      /* organ letters */
      let key = null, pos = null;
      if (s.startsWith('Bt', i)) { key = 'Bt'; i += 2; }
      else if (c === 'B' || c === 'Br'[0] && s[i + 1] === 'r') { key = 'B'; i += (s[i + 1] === 'r' ? 2 : 1); }
      else if (c === 'E' || c === 'k') { key = 'E'; i++; }
      else if ('KCPA'.includes(c)) { key = c; i++; }
      else if (c === 'G') { key = 'G'; i++; }
      else if ('ĞĜḠ'.includes(c)) { key = 'G'; pos = 'inferior'; i++; }
      else if (c === 'V' || (c === 'o' && s[i + 1] === 'v')) {
        i += c === 'V' ? 1 : 2;
        const L = { a: 'apical', x: 'axile', b: 'basal', c: 'freecentral', p: 'parietal', m: 'marginal', l: 'laminar' };
        if (L[s[i]]) { m._plac = L[s[i]]; i++; }
        const n = readNum();
        if (n != null) m._ov = n;
        continue;
      }
      if (!key) {
        const rest = s.slice(i).toLowerCase();
        const word = (rest.match(/^[a-záéíóúñ-]+/) || [''])[0];
        if (m.G && /^(sup|súp)/.test(word)) { m.G.pos = 'superior'; i += word.length; continue; }
        if (m.G && /^(semi|half|medio)/.test(word)) { m.G.pos = 'half'; i += word.length; continue; }
        if (m.G && /^(inf|ínf)/.test(word)) { m.G.pos = 'inferior'; i += word.length; continue; }
        warnings.push(T(`No reconozco «${c}» (posición ${i + 1}); lo ignoré.`, `"${c}" is not recognised (position ${i + 1}); ignored.`));
        i++; continue;
      }
      /* marks right after G */
      marks = null;
      skipComb();
      if (key === 'G' && marks) {
        if (marks.includes(LOW)) pos = 'superior';
        if (marks.some(x => x === OVER || x === '̆' || x === '̂' || x === '̄')) pos = 'inferior';
        marks = null;
      }
      if (key === 'K' && s[i] === 'c' && /[\d(∞]/.test(s[i + 1] || '')) { i++; m._Kc = true; }
      const org = {};
      if (key === 'B' || key === 'Bt') {
        const n = readNum();
        m[key] = n == null ? (key === 'Bt' ? 2 : 1) : n;
        if (s[i] === 'ᶜ' || (s[i] === '^' && s[i + 1] === 'C')) i += s[i] === '^' ? 2 : 1;
        if (stack.length) stack[stack.length - 1].push(key);
        continue;
      }
      marks = null; orgSym = null;
      if (key === 'G' && halfOpen && s[i] === '-') i++;          /* "-G-(2)" */
      const cnt = readCounts();
      if (!cnt) {
        warnings.push(T(`Falta el número de piezas después de «${key}».`, `The number of members is missing after "${key}".`));
        org.w = [{ n: 0 }];
      } else { org.w = cnt.w; if (cnt.connate) org.connate = true; }
      if (orgSym) org.sym = orgSym;
      readOrganTail(org);
      if (key === 'K' && m._Kc) { org.like = 'C'; delete m._Kc; }
      if (key === 'G') {
        if (halfOpen) { pos = 'half'; halfOpen = false; if (s[i] === '-') i++; }
        if (marks) {
          if (marks.includes(STRIKE)) pos = pos || 'half';
          else if (marks.includes(OVER) || marks.includes('̄')) pos = pos || 'inferior';
          else if (marks.includes(LOW)) pos = pos || 'superior';
        }
        org.pos = pos || 'superior';
        if (!pos) m._posGuess = true;
      }
      marks = null;
      if (m[key]) warnings.push(T(`«${key}» aparece dos veces; se usa la última.`, `"${key}" appears twice; the last one is used.`));
      m[key] = org;
      if (stack.length) stack[stack.length - 1].push(key);
    }
    if (stack.length) warnings.push(T('Falta cerrar un corchete.', 'A bracket is not closed.'));
    if (!m.sym) m.sym = 'actino';
    if (m.G) {
      if (m._plac) m.G.plac = m._plac;
      if (m._ov != null) m.G.ov = m._ov;
      const syn = m.G.w.every(w => w.connate);
      if (m.G.w.length === 1 && !m.G.w[0].parts && syn) { /* keep */ }
    }
    delete m._plac; delete m._ov;
    const guessed = !!m._posGuess; delete m._posGuess;
    if (!m.K && !m.C && !m.P && !m.A && !m.G) warnings.push(T('No encontré ningún verticilo (K, C, P, A o G).', 'No whorl was found (K, C, P, A or G).'));
    return { model: m, warnings, posGuessed: guessed };
  }

  return { html, text, parse, segments, SYM, SEX, PLAC };
})();
window.Formula = Formula;
