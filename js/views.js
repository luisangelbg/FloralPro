/* FloralPro — the linked views of one flower.

   Views.create(root, opts) fills `root` with the 3D flower, the floral diagram,
   the longitudinal section, the floral formula (in the convention chosen at the
   top of the page), a legend of the whorls and the description in words. The
   same whorl lights up in every view when the pointer is over it anywhere, and
   a click pins it (useful on touch screens and when projecting).

   The home page (Block 1), the flower builder (Block 2) and the family sheets
   (Block 4) all use it. Each figure can be downloaded as SVG or PNG.

   Controller: { set(model, {newFlower}), highlight(org), refresh(), model, f3d } */

const Views = (function () {
  const ORGS = ['E', 'K', 'C', 'P', 'A', 'G'];
  const T2 = x => x && typeof x === 'object' ? (I18N.lang === 'en' ? (x.en || x.es) : x.es) : x;
  let seq = 0;

  function create(root, opts) {
    opts = Object.assign({ height: 330, formula: true, desc: true, formulaFirst: false, name: 'flor' }, opts || {});
    const id = 'v' + (++seq);
    const st = { m: opts.model, hover: null, lock: null, f3d: null, colors: state.colors || 'natural', labels: true, extHover: null };
    root.classList.add('views');
    root.setAttribute('data-linked', '');
    const dlBtn = what => `<span class="dl-wrap"><button class="icon-btn sm v-dl" data-what="${what}" data-es-title="Descargar la figura" data-en-title="Download the figure" title="Descargar la figura">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10l5 5 5-5M5 19h14"/></svg></button>
      <span class="dl-menu"><button data-fmt="svg">SVG</button><button data-fmt="png">PNG</button></span></span>`;
    const formulaHTML = `<div class="formula-box"><div class="v-formula"></div><div class="ff-text v-ftext"></div><div class="formula-legend v-legend"></div></div>`;
    root.innerHTML = (opts.formulaFirst && opts.formula ? formulaHTML : '') + `
      <div class="trio-grid">
        <div class="pane">
          <div class="pane-h">
            <span class="pane-t">${L2('Flor en 3D', '3D flower')}</span>
            <label class="range">${L2('Separar', 'Pull apart')}<input type="range" class="v-ex" min="0" max="1" step="0.01" value="0"></label>
            <label class="tgl"><input type="checkbox" class="v-spin"> ${L2('Girar', 'Spin')}</label>
            ${dlBtn('3d')}
          </div>
          <div class="pane-b"><div class="v-3d"></div></div>
        </div>
        <div class="pane">
          <div class="pane-h">
            <span class="pane-t">${L2('Diagrama floral', 'Floral diagram')}</span>
            <select class="sel v-col" data-es-title="Colores del diagrama" data-en-title="Colours of the diagram">
              <option value="natural" data-es="Colores naturales" data-en="Natural colours">Colores naturales</option>
              <option value="whorl" data-es="Un color por verticilo" data-en="One colour per whorl">Un color por verticilo</option>
              <option value="bw" data-es="Blanco y negro" data-en="Black and white">Blanco y negro</option>
            </select>
            ${dlBtn('diagram')}
          </div>
          <div class="pane-b paper"><div class="v-diagram"></div></div>
        </div>
        <div class="pane">
          <div class="pane-h">
            <span class="pane-t">${L2('Corte longitudinal', 'Longitudinal section')}</span>
            <label class="tgl"><input type="checkbox" class="v-lbl" checked> ${L2('Nombres', 'Labels')}</label>
            ${dlBtn('section')}
          </div>
          <div class="pane-b paper"><div class="v-section"></div></div>
        </div>
      </div>` + (!opts.formulaFirst && opts.formula ? formulaHTML : '') + (opts.desc ? `<div class="desc-box v-desc"></div>` : '');
    I18N.apply(root);
    const q = s => root.querySelector(s);
    q('.v-col').value = st.colors;

    function render(newFlower) {
      const m = st.m;
      if (!m) return;
      if (!st.f3d) st.f3d = Flower3D.mount(q('.v-3d'), m, { height: opts.height, colors: st.colors === 'bw' ? 'whorl' : st.colors, onHover: org => { st.hover = org; apply(); } });
      else if (newFlower) st.f3d.set(m);
      q('.v-diagram').innerHTML = Diagram.svg(m, { colors: st.colors });
      q('.v-section').innerHTML = Section.svg(m, { colors: st.colors, labels: st.labels });
      renderFormula();
      if (opts.desc) q('.v-desc').innerHTML = FM.describe(m, I18N.lang).map(d => `<p data-org="${d.org}">${d.html}</p>`).join('');
      apply();
    }
    function renderFormula() {
      if (!opts.formula || !st.m) return;
      const o = { bracts: true, ovules: true };
      q('.v-formula').innerHTML = Formula.html(st.m, state.conv, o).replace('class="ff ', 'class="ff ff-color ');
      q('.v-ftext').innerHTML = `${L2('Texto para copiar', 'Text to copy')}: <span class="v-ftxt">${esc(Formula.text(st.m, state.conv, o))}</span> <button class="btn btn-ghost btn-xs v-copy">${L2('Copiar', 'Copy')}</button>`;
      const f = FM.normalize(st.m);
      q('.v-legend').innerHTML = ORGS.filter(k => f[k]).map(k =>
        `<span class="wl" data-org="${k}"><span class="sw" style="background:${FM.WHORL_COLORS[k]}"></span><b>${k}</b> ${esc(T2(WHORL_NAMES[k]))}</span>`).join('') +
        `<span class="wl muted" style="cursor:default">${L2('Clic en un verticilo para fijarlo', 'Click a whorl to pin it')}</span>`;
    }
    function apply() {
      const org = st.lock || st.hover || st.extHover || null;
      highlightIn(root, org);
      if (st.f3d) st.f3d.highlight(org);
    }
    const pick = e => {
      const t = e.target.closest('[data-org]');
      if (!t || !root.contains(t)) return null;
      const o = t.getAttribute('data-org');
      if (o === 'V') return 'G';
      return ORGS.includes(o) ? o : null;
    };
    root.addEventListener('mouseover', e => { if (e.target.closest('.v-3d')) return; const o = pick(e); if (o !== st.hover) { st.hover = o; apply(); } });
    root.addEventListener('mouseleave', () => { st.hover = null; apply(); });
    root.addEventListener('click', e => {
      const dl = e.target.closest('.v-dl');
      if (dl) { const w = dl.closest('.dl-wrap'); root.querySelectorAll('.dl-wrap.open').forEach(x => { if (x !== w) x.classList.remove('open'); }); w.classList.toggle('open'); return; }
      const fmt = e.target.closest('.dl-menu button');
      if (fmt) { const w = fmt.closest('.dl-wrap'); w.classList.remove('open'); download3(w.querySelector('.v-dl').dataset.what, fmt.dataset.fmt); return; }
      if (e.target.closest('.v-copy')) { copyText(q('.v-ftxt').textContent, e.target.closest('.v-copy')); return; }
      if (e.target.closest('select, input, button, .chip')) return;
      const o = pick(e);
      if (!o) return;
      st.lock = st.lock === o ? null : o;
      apply();
    });
    q('.v-ex').addEventListener('input', e => st.f3d.setExplode(+e.target.value));
    q('.v-spin').addEventListener('change', e => st.f3d.spin(e.target.checked));
    q('.v-lbl').addEventListener('change', e => { st.labels = e.target.checked; render(false); });
    q('.v-col').addEventListener('change', e => {
      st.colors = e.target.value; state.colors = st.colors; Prefs.set('colors', st.colors);
      st.f3d.setColors(st.colors === 'bw' ? 'whorl' : st.colors);
      render(false);
    });

    function download3(what, fmt) {
      const name = slug(opts.name + '-' + (typeof opts.fileName === 'function' ? opts.fileName() : '') + '-' + ({ '3d': 'flor3d', diagram: 'diagrama', section: 'corte' }[what]));
      const svg = what === '3d' ? st.f3d.svg : what === 'diagram' ? q('.v-diagram svg') : q('.v-section svg');
      if (!svg) return;
      if (fmt === 'svg') Export.svg(svg, name + '.svg');
      else Export.png(svg, name + '.png', what === '3d' ? '#ffffff' : '#ffffff');
    }

    const onConv = () => { renderFormula(); apply(); };
    const onLang = () => { render(false); I18N.apply(root); };
    document.addEventListener('convchange', onConv);
    document.addEventListener('langchange', onLang);
    document.addEventListener('click', e => { if (!e.target.closest('.dl-wrap')) root.querySelectorAll('.dl-wrap.open').forEach(x => x.classList.remove('open')); });
    if (st.m) render(true);

    return {
      id,
      set(m, o) { st.m = m; st.lock = (o && o.keepLock) ? st.lock : null; render(!o || o.newFlower !== false); },
      highlight(org) { st.extHover = org; apply(); },
      refresh() { render(false); },
      get model() { return st.m; },
      get f3d() { return st.f3d; },
      root,
    };
  }

  function copyText(text, btn) {
    const done = ok => { if (btn) { const old = btn.innerHTML; btn.innerHTML = ok ? L2('¡Copiado!', 'Copied!') : L2('Selecciónalo y copia', 'Select and copy'); setTimeout(() => { btn.innerHTML = old; }, 1400); } };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(() => done(true), () => fallback());
    else fallback();
    function fallback() {
      const ta = mk('textarea', { style: 'position:fixed;left:-9999px' }); ta.value = text; document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta); done(ok);
    }
  }

  return { create, copyText };
})();

/* ---------------- figure export ----------------
   SVG: the drawing with its styles written in (the page stylesheet does not
   travel with the file). PNG: the same SVG painted on a canvas at 3× its size. */
const Export = (function () {
  const STYLE = `.sc-lbl{font:500 5.4px system-ui,sans-serif;fill:#6f5f69}.lbl3{font-family:system-ui,sans-serif;font-weight:600;fill:#6f5f69}.lbl3 tspan.k{font-weight:800}`;
  function serialize(svgEl) {
    const c = svgEl.cloneNode(true);
    c.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    c.querySelectorAll('.hl').forEach(n => n.classList.remove('hl'));
    c.classList && c.classList.remove('has-hl');
    c.querySelectorAll('[stroke="currentColor"]').forEach(n => n.setAttribute('stroke', '#6f5f69'));
    const vb = (c.getAttribute('viewBox') || '0 0 300 300').split(/\s+/).map(Number);
    const w = 900, h = Math.round(900 * vb[3] / vb[2]);
    c.setAttribute('width', w); c.setAttribute('height', h);
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = STYLE;
    c.insertBefore(style, c.firstChild);
    return { text: '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(c), w, h };
  }
  function svg(svgEl, filename) {
    const s = serialize(svgEl);
    download(s.text, filename, 'image/svg+xml;charset=utf-8');
  }
  function png(svgEl, filename, bg) {
    const s = serialize(svgEl);
    const img = new Image();
    const scale = 2;
    img.onload = () => {
      const cv = document.createElement('canvas');
      cv.width = s.w * scale; cv.height = s.h * scale;
      const ctx = cv.getContext('2d');
      if (bg) { ctx.fillStyle = bg; ctx.fillRect(0, 0, cv.width, cv.height); }
      ctx.drawImage(img, 0, 0, cv.width, cv.height);
      cv.toBlob(b => { if (b) download(b, filename); }, 'image/png');
    };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s.text);
  }
  return { svg, png, serialize };
})();
window.Views = Views;
window.Export = Export;
