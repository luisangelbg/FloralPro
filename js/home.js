/* FloralPro — Block 1: home page.
   Hero (a flower that assembles and comes apart whorl by whorl), the "three
   languages" demo (3D flower, floral diagram and section, floral formula and
   description, all linked), the whorl cards, the table of symbols of both
   conventions, the blocks, a short theory and the references. */

(function () {
  const H = {};

  /* every flower of the demonstration specimens, flattened */
  const FLOWERS = [];
  SPECIMENS.forEach((sp, si) => sp.flowers.forEach((fl, fi) => FLOWERS.push({ sp, fl, key: sp.id + (sp.flowers.length > 1 ? '-' + fi : '') })));

  /* ---------------- hero ---------------- */
  function hero() {
    const host = el('heroFlower');
    if (!host) return;
    const order = ['prunus', 'lilium', 'solanum', 'gossypium', 'phaseolus', 'opuntia'];
    const seq = order.map(id => FLOWERS.find(x => x.sp.id === id)).filter(Boolean);
    let k = 0;
    const ctl = Flower3D.mount(host, seq[0].fl.m, { autoRotate: true, height: 360, el: 28, colors: 'natural' });
    H.hero = ctl;
    const cap = el('heroCaption');
    let t0 = performance.now(), paused = false, last = -1;
    const T = { still: 2600, open: 1500, hold: 3200, close: 1500 };
    const cycle = T.still + T.open + T.hold + T.close;
    const ease = x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    const setCap = (phase) => {
      const x = seq[k];
      cap.innerHTML = `<i>${esc(x.sp.sci)}</i> · ${esc(T2(x.sp.common))} — ${phase === 'open' ? L2('separada en verticilos', 'pulled apart into whorls') : L2('arrástrala para girarla', 'drag it to rotate')}`;
    };
    setCap('still');
    host.addEventListener('pointerenter', () => { paused = true; });
    host.addEventListener('pointerleave', () => { paused = false; t0 = performance.now() - (last >= 0 ? last : 0); });
    function tick(now) {
      if (!paused && document.body.classList.contains('on-home')) {
        const t = (now - t0) % cycle;
        last = t;
        let ex;
        if (t < T.still) ex = 0;
        else if (t < T.still + T.open) ex = ease((t - T.still) / T.open);
        else if (t < T.still + T.open + T.hold) ex = 1;
        else ex = 1 - ease((t - T.still - T.open - T.hold) / T.close);
        if (Math.abs(ex - (H.heroEx || 0)) > 0.004 || (ex === 0 && H.heroEx !== 0) || (ex === 1 && H.heroEx !== 1)) { ctl.setExplode(ex); H.heroEx = ex; }
        const phase = ex > 0.5 ? 'open' : 'still';
        if (phase !== H.heroPhase) { H.heroPhase = phase; setCap(phase); }
        /* next species at the end of each cycle */
        const n = Math.floor((now - t0) / cycle);
        if (n !== H.heroN) {
          if (H.heroN != null) { k = (k + 1) % seq.length; ctl.set(seq[k].fl.m); setCap('still'); }
          H.heroN = n;
        }
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    document.addEventListener('langchange', () => setCap(H.heroPhase || 'still'));
  }
  function T2(x) { return x && typeof x === 'object' ? (I18N.lang === 'en' ? (x.en || x.es) : x.es) : x; }

  /* ---------------- the three languages ---------------- */
  const trio = { idx: 0, views: null };
  function chips() {
    const box = el('spChips');
    box.innerHTML = FLOWERS.map((x, i) => {
      const sex = x.fl.m.sex === 'staminate' ? ' ♂' : x.fl.m.sex === 'pistillate' ? ' ♀' : '';
      return `<button class="chip${i === trio.idx ? ' on' : ''}" data-i="${i}">${esc(T2(x.sp.common))}${sex} <i>${esc(x.sp.sci.split(' ')[0])}</i></button>`;
    }).join('');
    els('.chip', box).forEach(b => b.addEventListener('click', () => { trio.idx = +b.dataset.i; renderTrio(); chips(); }));
  }
  function renderTrio() {
    const x = FLOWERS[trio.idx];
    el('spNote').innerHTML = `<b><i>${esc(x.sp.sci)}</i></b> (${esc(x.sp.family)}) · ${esc(T2(x.sp.common))}${x.fl.label ? ' · ' + esc(T2(x.fl.label)) : ''} — ${esc(T2(x.sp.note))}`;
    if (!trio.views) trio.views = Views.create(el('trioViews'), { model: x.fl.m, name: 'floralpro', fileName: () => FLOWERS[trio.idx].sp.sci });
    else trio.views.set(x.fl.m);
  }
  H.trio = trio;

  /* ---------------- whorl cards ---------------- */
  const ART = {
    K: `<svg viewBox="0 0 120 100"><path d="M60,92 C30,70 34,30 60,8 C86,30 90,70 60,92Z" fill="var(--wK)" opacity=".9"/><path d="M60,90 L60,14" stroke="#fff" stroke-opacity=".55" stroke-width="2"/><path d="M60,60 L46,48 M60,45 L48,35 M60,60 L74,48 M60,45 L72,35" stroke="#fff" stroke-opacity=".4" stroke-width="1.4"/></svg>`,
    C: `<svg viewBox="0 0 120 100"><path d="M60,94 C56,80 57,70 56,62 C30,56 24,22 44,10 C52,5 68,5 76,10 C96,22 90,56 64,62 C63,70 64,80 60,94Z" fill="var(--wC)" opacity=".9"/><path d="M60,90 L60,18" stroke="#fff" stroke-opacity=".45" stroke-width="1.6"/></svg>`,
    P: `<svg viewBox="0 0 120 100"><path d="M46,94 C24,66 26,30 40,6 C58,30 60,66 46,94Z" fill="var(--wP)" opacity=".65"/><path d="M74,94 C96,66 94,30 80,6 C62,30 60,66 74,94Z" fill="var(--wP)" opacity=".95"/></svg>`,
    A: `<svg viewBox="0 0 120 100"><path d="M60,96 C58,70 62,50 60,34" stroke="var(--wA)" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="53" cy="22" rx="7" ry="15" fill="var(--wA)"/><ellipse cx="67" cy="22" rx="7" ry="15" fill="var(--wA)" opacity=".85"/><path d="M60,8 L60,36" stroke="#000" stroke-opacity=".25"/></svg>`,
    G: `<svg viewBox="0 0 120 100"><ellipse cx="60" cy="74" rx="20" ry="20" fill="var(--wG)" opacity=".9"/><ellipse cx="60" cy="74" rx="11" ry="12" fill="#fff" opacity=".85"/><circle cx="55" cy="72" r="3" fill="var(--wG)"/><circle cx="65" cy="78" r="3" fill="var(--wG)"/><path d="M60,54 L60,16" stroke="var(--wG)" stroke-width="3"/><path d="M60,16 l-9,-8 M60,16 l9,-8 M60,16 l0,-11" stroke="var(--wG)" stroke-width="3" stroke-linecap="round"/></svg>`,
    E: `<svg viewBox="0 0 120 100"><path d="M26,90 C22,60 30,34 40,16 C48,40 44,66 26,90Z" fill="var(--wE)" opacity=".75"/><path d="M94,90 C98,60 90,34 80,16 C72,40 76,66 94,90Z" fill="var(--wE)" opacity=".75"/><path d="M60,94 C44,70 46,40 60,20 C74,40 76,70 60,94Z" fill="var(--wK)" opacity=".85"/></svg>`,
  };
  const CARDS = [
    { k: 'K', es: ['Cáliz', 'El verticilo más externo, formado por los sépalos; casi siempre verde y protector del botón.'], en: ['Calyx', 'The outermost whorl, made of sepals; usually green, it protects the bud.'],
      t: { es: ['dialisépalo', 'gamosépalo', 'vilano', 'persistente', 'petaloide', 'espolón'], en: ['polysepalous', 'gamosepalous', 'pappus', 'persistent', 'petaloid', 'spur'] } },
    { k: 'C', es: ['Corola', 'Los pétalos, casi siempre vistosos; atraen a los polinizadores y guían su visita.'], en: ['Corolla', 'The petals, usually showy; they attract pollinators and guide their visit.'],
      t: { es: ['dialipétala', 'gamopétala', 'rotácea', 'bilabiada', 'papilionácea', 'prefloración'], en: ['polypetalous', 'sympetalous', 'rotate', 'bilabiate', 'papilionaceous', 'aestivation'] } },
    { k: 'P', es: ['Perigonio', 'Tépalos semejantes entre sí cuando no hay cáliz y corola distintos, como en muchas monocotiledóneas.'], en: ['Perigon', 'Similar tepals when calyx and corolla are not distinct, as in many monocots.'],
      t: { es: ['homoclamídea', 'tépalo', 'petaloide', 'sepaloide', 'labelo'], en: ['homochlamydeous', 'tepal', 'petaloid', 'sepaloid', 'lip'] } },
    { k: 'A', es: ['Androceo', 'Los estambres: filamento y antera con el polen. Pueden unirse entre sí o a la corola.'], en: ['Androecium', 'The stamens: filament and pollen-bearing anther. They may unite with each other or with the corolla.'],
      t: { es: ['isostémono', 'diplostémono', 'monadelfo', 'didínamo', 'epipétalo', 'estaminodio'], en: ['isostemonous', 'diplostemonous', 'monadelphous', 'didynamous', 'epipetalous', 'staminode'] } },
    { k: 'G', es: ['Gineceo', 'Los carpelos, libres o unidos en un pistilo: ovario con óvulos, estilo y estigma.'], en: ['Gynoecium', 'The carpels, free or united in a pistil: ovary with ovules, style and stigma.'],
      t: { es: ['apocárpico', 'sincárpico', 'súpero', 'ínfero', 'placentación', 'ginobásico'], en: ['apocarpous', 'syncarpous', 'superior', 'inferior', 'placentation', 'gynobasic'] } },
    { k: 'E', es: ['Brácteas y epicáliz', 'Hojas modificadas por fuera de la flor: la bráctea que la sostiene, las bractéolas y, a veces, un segundo cáliz.'], en: ['Bracts and epicalyx', 'Modified leaves outside the flower: the subtending bract, the bracteoles and sometimes a second calyx.'],
      t: { es: ['bráctea', 'bractéola', 'epicáliz', 'involucro', 'espata'], en: ['bract', 'bracteole', 'epicalyx', 'involucre', 'spathe'] } },
  ];
  function whorlCards() {
    el('whorlGrid').innerHTML = CARDS.map(c => `<div class="whorl-card" style="--wc: var(--w${c.k}); --wct: var(--w${c.k}-text)">
      <div class="wc-art">${ART[c.k]}</div>
      <h3><span class="let">${c.k === 'E' ? 'B · E' : c.k}</span> ${L2(c.es[0], c.en[0])}</h3>
      <p>${L2(c.es[1], c.en[1])}</p>
      <div class="wc-terms">${L2(c.t.es.map(x => `<span>${x}</span>`).join(''), c.t.en.map(x => `<span>${x}</span>`).join(''))}</div>
    </div>`).join('');
  }

  /* ---------------- table of symbols ---------------- */
  const cl = h => `<span class="ff ff-classic" style="font-size:1.1rem;line-height:1.4">${h}</span>`;
  const pr = h => `<span class="ff ff-prenner" style="font-size:1.1rem;line-height:1.4">${h}</span>`;
  const SYMROWS = [
    ['Flor actinomorfa (varios planos de simetría)', 'Actinomorphic flower (several planes of symmetry)', cl('✱'), pr('*')],
    ['Flor zigomorfa (un plano de simetría)', 'Zygomorphic flower (one plane of symmetry)', cl('↑'), pr('↓ &nbsp;plano medio · → transversal · Ø oblicuo')],
    ['Flor disimétrica (dos planos)', 'Disymmetric flower (two planes)', cl('✱'), pr('┼')],
    ['Flor asimétrica', 'Asymmetric flower', cl('↯'), pr('∂')],
    ['Flor espiral (acíclica)', 'Spiral (acyclic) flower', cl('✱'), pr('↺ ¹')],
    ['Flor hermafrodita', 'Bisexual flower', cl('⚥'), pr('—')],
    ['Flor estaminada / pistilada', 'Staminate / pistillate flower', cl('♂ ♀'), pr('♂ ♀')],
    ['Bráctea y bractéolas', 'Bract and bracteoles', cl('—'), pr('B Bt2')],
    ['Epicáliz', 'Epicalyx', cl('E<sub>3</sub>'), pr('E3 ¹')],
    ['Cáliz, corola, perigonio, androceo, gineceo', 'Calyx, corolla, perigon, androecium, gynoecium', cl('K C P A G'), pr('K C P A G')],
    ['Número de piezas', 'Number of members', cl('K<sub>5</sub>'), pr('K5')],
    ['Muchas piezas (más de 10–12)', 'Many members (more than 10–12)', cl('A<sub>∞</sub>'), pr('A∞')],
    ['Número variable', 'Variable number', cl('C<sub>4–5</sub>'), pr('C4–5')],
    ['Dos verticilos del mismo órgano', 'Two whorls of the same organ', cl('A<sub>5+5</sub>'), pr('A5+5')],
    ['Piezas desiguales en un verticilo (de la posición adaxial a la abaxial)', 'Unequal members of one whorl (from adaxial to abaxial)', cl('C<sub>1+2+(2)</sub>'), pr('C1:2:(2)')],
    ['Piezas unidas entre sí (connación)', 'Members united with each other (connation)', cl('K<sub>(5)</sub>'), pr('K(5)')],
    ['Verticilos distintos unidos (adnación)', 'Different whorls united (adnation)', cl('<span class="ff-adn">C<sub>(5)</sub> A<sub>5</sub></span>'), pr('[C(5) A5] &nbsp;· tres: {…}')],
    ['Estaminodio o pieza reducida', 'Staminode or reduced member', cl('A<sub>2°+2</sub>'), pr('A2<sup>r</sup>')],
    ['Pieza perdida (posición vacía)', 'Lost member (empty position)', cl('no se escribe'), pr('A1<sup>0</sup>')],
    ['Sépalos petaloides', 'Petaloid sepals', cl('—'), pr('K5<sup>C</sup>')],
    ['Ovario súpero', 'Superior ovary', cl('G<sub class="ff-pos ff-low">(2)</sub>'), pr('<span class="ff-u">G</span>(2)')],
    ['Ovario ínfero', 'Inferior ovary', cl('G<sub class="ff-pos ff-over">(2)</sub>'), pr('Ğ(2)')],
    ['Ovario semiínfero', 'Half-inferior ovary', cl('G<sub class="ff-pos ff-mid">(2)</sub>'), pr('-G-(2)')],
    ['Óvulos y placentación', 'Ovules and placentation', cl('—'), pr('Vx∞ · a apical, x axilar, b basal, c central libre, p parietal, m marginal, l laminar')],
  ];
  function symTable() {
    const on = state.conv;
    const rows = SYMROWS.map(r => `<tr><td>${L2(r[0], r[1])}</td><td class="s"${on === 'classic' ? ' style="background:var(--primary-soft)"' : ''}>${r[2]}</td><td class="s"${on === 'prenner' ? ' style="background:var(--primary-soft)"' : ''}>${r[3]}</td></tr>`).join('');
    el('symTable').innerHTML = `<thead><tr><th>${L2('Qué se indica', 'What it shows')}</th><th>${L2('Clásica', 'Classic')}</th><th>Prenner et al. (2010)</th></tr></thead><tbody>${rows}</tbody>` +
      `<tfoot><tr><td colspan="3" class="hint">${L2('¹ Símbolos de Ronse De Craene (2010) y Ronse De Craene et al. (2014), que Prenner et al. no incluyen. En la convención clásica también se usan ⊕ o * (actinomorfa) y % o · | · (zigomorfa).',
        '¹ Symbols of Ronse De Craene (2010) and Ronse De Craene et al. (2014), not covered by Prenner et al. The classic convention also uses ⊕ or * (actinomorphic) and % or · | · (zygomorphic).')}</td></tr></tfoot>`;
  }

  /* ---------------- blocks ---------------- */
  const BLOCKS = [
    { n: 1, es: ['Inicio', 'Los tres lenguajes de la flor y cómo se lee una fórmula.'], en: ['Home', 'The three languages of the flower and how to read a formula.'] },
    { n: 2, es: ['Arma una flor', 'Elige verticilo por verticilo el número de piezas, la fusión, la simetría y la posición del ovario; la fórmula y el diagrama se escriben solos.'], en: ['Build a flower', 'Choose, whorl by whorl, the number of members, fusion, symmetry and ovary position; the formula and the diagram write themselves.'] },
    { n: 3, es: ['Atlas de verticilos', 'Todas las variantes ilustradas: tipos de corola, prefloración, androceo, placentación, posición del ovario, pseudantos y glosario.'], en: ['Whorl atlas', 'Every variant illustrated: corolla types, aestivation, androecium, placentation, ovary position, pseudanthia and glossary.'] },
    { n: 4, es: ['Familias y especies', '82 familias APG IV con casi 280 especies de México y cultivos, sus caracteres distintivos, filtros por carácter y un comparador lado a lado.'], en: ['Families and species', '82 APG IV families with nearly 280 Mexican species and crops, their distinctive characters, filters by character and a side-by-side comparer.'] },
    { n: 5, es: ['Clave interactiva', 'Marca lo que ves en la flor, la planta y el fruto y mira qué familias quedan, o recorre una clave dicotómica pareja por pareja.'], en: ['Interactive key', 'Tick what you see in the flower, the plant and the fruit and watch which families remain, or walk a dichotomous key couplet by couplet.'] },
    { n: 6, es: ['Autoevaluación', 'Retos con puntaje de fórmula floral y términos del atlas; práctica con corrección inmediata y exámenes con comprobante verificable.'], en: ['Self-assessment', 'Scored floral-formula and atlas-term challenges; practice with instant correction and exams with a verifiable certificate.'] },
    { n: 7, es: ['Gimnospermas', 'Cícadas, Ginkgo, coníferas y Ephedra frente a la flor: estróbilos en 3D, en corte y pieza por pieza, ficha de caracteres y especies de México.'], en: ['Gymnosperms', 'Cycads, Ginkgo, conifers and Ephedra compared with the flower: strobili in 3D, in section and member by member, character sheets and species of Mexico.'] },
    { n: 8, es: ['Modo clase', 'Presentaciones para proyectar que preguntan al grupo antes de revelar, fichas y hojas de trabajo para imprimir, y tus propias fotos.'], en: ['Classroom', 'Presentations to project that ask the group before revealing, printable sheets and worksheets, and your own photos.'] },
  ];
  function blockArt(n) {
    const lil = FLOWERS.find(x => x.sp.id === 'lilium').fl.m;
    const sol = FLOWERS.find(x => x.sp.id === 'solanum').fl.m;
    switch (n) {
      case 1: return `<svg viewBox="0 0 200 110"><g transform="translate(55,56) scale(.42)">${Diagram.svg(sol, { colors: 'whorl', bract: false, axis: false }).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g><text x="112" y="62" font-family="serif" font-size="20" fill="var(--text)">✱ K(5)…</text></svg>`;
      case 2: return `<svg viewBox="0 0 200 110"><g transform="translate(100,55) scale(.44)">${Diagram.svg(lil, { colors: 'whorl', bract: false, axis: false }).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g></svg>`;
      case 3: return `<svg viewBox="0 0 200 110"><g fill="var(--wC)" opacity=".85"><path d="M30,90 C20,60 22,30 34,20 C46,30 48,60 38,90Z"/><path d="M70,92 L64,40 C64,25 92,25 92,40 L86,92Z"/><path d="M118,92 C112,70 104,40 110,24 L140,24 C146,40 138,70 132,92Z"/><path d="M160,92 C150,60 158,30 176,24 C182,40 176,70 168,92Z"/></g></svg>`;
      case 4: return `<svg viewBox="0 0 200 110"><g stroke="var(--text-muted)" stroke-width="2" fill="none"><path d="M100,100 L100,70 M100,70 L50,40 M100,70 L150,40 M50,40 L30,15 M50,40 L70,15 M150,40 L130,15 M150,40 L170,15"/></g><g fill="var(--wC)"><circle cx="30" cy="12" r="7"/><circle cx="70" cy="12" r="7" fill="var(--wP)"/><circle cx="130" cy="12" r="7" fill="var(--wA)"/><circle cx="170" cy="12" r="7" fill="var(--wG)"/></g></svg>`;
      case 5: return `<svg viewBox="0 0 200 110"><g font-family="system-ui" font-size="11" fill="var(--text)"><rect x="18" y="16" width="14" height="14" rx="3" fill="var(--wG)"/><text x="40" y="27">ovario ínfero</text><rect x="18" y="42" width="14" height="14" rx="3" fill="none" stroke="var(--text-muted)"/><text x="40" y="53">didínamo</text><rect x="18" y="68" width="14" height="14" rx="3" fill="var(--wA)"/><text x="40" y="79">A∞</text></g><text x="150" y="62" font-size="30" text-anchor="middle" fill="var(--primary)" font-weight="800">7</text><text x="150" y="80" font-size="10" text-anchor="middle" fill="var(--text-muted)">familias</text></svg>`;
      case 6: return `<svg viewBox="0 0 200 110"><circle cx="100" cy="55" r="36" fill="none" stroke="var(--border-strong)" stroke-width="8"/><circle cx="100" cy="55" r="36" fill="none" stroke="var(--success)" stroke-width="8" stroke-dasharray="170 230" transform="rotate(-90 100 55)"/><path d="M84,56 l10,10 l20,-22" stroke="var(--success)" stroke-width="6" fill="none" stroke-linecap="round"/></svg>`;
      case 7: return `<svg viewBox="0 0 200 110"><g fill="#8a6a4a">${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${100 - 26 + i * 2},${22 + i * 12} q26,-8 52,0 q-26,14 -52,0Z" opacity="${0.6 + i * 0.07}"/>`).join('')}</g><path d="M100,14 L100,100" stroke="#6b4e33" stroke-width="3"/></svg>`;
      case 8: return `<svg viewBox="0 0 200 110"><rect x="40" y="14" width="120" height="70" rx="6" fill="var(--card-bg)" stroke="var(--border-strong)" stroke-width="3"/><path d="M100,84 L100,98 M76,100 L124,100" stroke="var(--border-strong)" stroke-width="4" stroke-linecap="round"/><text x="100" y="56" text-anchor="middle" font-family="serif" font-size="18" fill="var(--primary)">✱ P3+3</text></svg>`;
    }
    return '';
  }
  function features() {
    el('featureGrid').innerHTML = BLOCKS.map(b => {
      const s = STEPS.find(x => x.n === b.n);
      return `<div class="feature" data-go="${b.n}"><span class="f-num">${b.n}</span><div class="f-art">${blockArt(b.n)}</div>
        <h3>${L2(b.es[0], b.en[0])}${s && !s.ready ? `<span class="f-soon">${L2('pronto', 'soon')}</span>` : ''}</h3><p>${L2(b.es[1], b.en[1])}</p></div>`;
    }).join('');
    els('.feature', el('featureGrid')).forEach(f => f.addEventListener('click', () => goStep(f.dataset.go)));
    /* placeholders of the blocks still to be built */
    BLOCKS.slice(1).forEach(b => {
      const p = el('panel-' + b.n);
      if (p && p.querySelector('.coming')) p.querySelector('.coming').innerHTML = `<div class="f-art" style="height:130px;max-width:260px;margin:0 auto 10px">${blockArt(b.n)}</div>
        <h2>${L2(b.es[0], b.en[0])}</h2><p>${L2(b.es[1], b.en[1])}</p>
        <p class="hint">${L2('Este bloque se construye en las siguientes etapas.', 'This block is built in the next stages.')}</p>
        <button class="btn btn-secondary" data-go="1">${L2('← Volver al inicio', '← Back to home')}</button>`;
    });
    els('.coming [data-go]').forEach(b => b.addEventListener('click', () => goStep(b.dataset.go)));
  }

  /* ---------------- theory ---------------- */
  const THEORY = [
    ['¿Qué es una flor?', 'What is a flower?',
      'Una flor es un brote de crecimiento limitado cuyas hojas se han transformado para la reproducción sexual. Sobre el receptáculo, el extremo ensanchado del pedicelo, se insertan de afuera hacia adentro las piezas estériles del perianto (sépalos y pétalos, o tépalos) y las fértiles: los estambres, que producen el polen, y los carpelos, que encierran los óvulos. Que los óvulos queden encerrados en el carpelo es lo que distingue a las angiospermas de las gimnospermas.',
      'A flower is a shoot of limited growth whose leaves are modified for sexual reproduction. On the receptacle, the swollen tip of the pedicel, the sterile parts of the perianth (sepals and petals, or tepals) and the fertile parts are inserted from the outside in: the stamens, which produce pollen, and the carpels, which enclose the ovules. Ovules enclosed in a carpel are what set angiosperms apart from gymnosperms.'],
    ['¿Qué es un verticilo?', 'What is a whorl?',
      'Un verticilo es un conjunto de piezas florales insertas al mismo nivel del receptáculo, dispuestas en círculo. En la mayoría de las flores hay cuatro tipos de verticilos: cáliz (K), corola (C), androceo (A) y gineceo (G); un mismo órgano puede formar dos o más verticilos (por ejemplo, dos verticilos de tres tépalos en el lirio). Las piezas de verticilos sucesivos suelen alternar entre sí. Cuando las piezas nacen en espiral, como los estambres de la magnolia, la flor o esa parte de ella es acíclica.',
      'A whorl is a set of floral members inserted at the same level of the receptacle and arranged in a circle. Most flowers have four kinds of whorls: calyx (K), corolla (C), androecium (A) and gynoecium (G); one organ may form two or more whorls (for example, two whorls of three tepals in a lily). Members of successive whorls usually alternate. When members arise in a spiral, like the stamens of a magnolia, the flower or that part of it is acyclic.'],
    ['Fórmula y diagrama: dos formas de decir lo mismo', 'Formula and diagram: two ways of saying the same thing',
      'La fórmula floral resume en una línea el número de piezas de cada verticilo, cuáles están unidas, la simetría y la posición del ovario. El diagrama floral es el plano de la flor visto desde arriba: muestra además dónde está cada pieza respecto a las demás, la prefloración, la placentación y la orientación de la flor frente al eje de la inflorescencia (arriba) y la bráctea (abajo). Se complementan: la fórmula es rápida de escribir y comparar; el diagrama muestra lo que la fórmula no puede.',
      'The floral formula summarises in one line the number of members in each whorl, which are united, the symmetry and the ovary position. The floral diagram is the ground plan of the flower seen from above: it also shows where each member sits relative to the others, the aestivation, the placentation and the orientation of the flower towards the inflorescence axis (top) and the bract (bottom). They complement each other: the formula is quick to write and compare; the diagram shows what a formula cannot.'],
    ['Simetría y merosidad', 'Symmetry and merism',
      'Una flor es actinomorfa si tiene varios planos de simetría (se puede dividir en mitades iguales de varias formas), zigomorfa si solo tiene uno, disimétrica si tiene dos y asimétrica si no tiene ninguno. La merosidad es el número básico de piezas por verticilo: las monocotiledóneas suelen ser trímeras y la mayoría de las eudicotiledóneas, tetrámeras o pentámeras.',
      'A flower is actinomorphic if it has several planes of symmetry (it can be split into equal halves in several ways), zygomorphic if it has only one, disymmetric if it has two and asymmetric if it has none. Merism is the basic number of members per whorl: monocots are usually trimerous and most eudicots tetramerous or pentamerous.'],
    ['La posición del ovario', 'Ovary position',
      'Si el ovario queda por encima del punto donde nacen las demás piezas, es súpero y la flor es hipógina. Si las piezas nacen del borde de una copa (hipanto) que rodea al ovario sin soldarse a él, el ovario sigue siendo súpero y la flor es perígina, como en el durazno. Si el ovario queda hundido y soldado al receptáculo o al hipanto, con las demás piezas encima, es ínfero y la flor es epígina, como en la calabaza, el girasol o las orquídeas. El corte longitudinal de la portada lo muestra en cada especie.',
      'If the ovary sits above the point where the other members arise, it is superior and the flower is hypogynous. If the members arise from the rim of a cup (hypanthium) that surrounds the ovary without fusing to it, the ovary is still superior and the flower is perigynous, as in the peach. If the ovary is sunk in and fused with the receptacle or hypanthium, with the other members on top, it is inferior and the flower is epigynous, as in squash, sunflower or orchids. The longitudinal section on this page shows it for each species.'],
    ['Las angiospermas según APG IV', 'Angiosperms according to APG IV',
      'El Angiosperm Phylogeny Group ordena las familias según su parentesco, inferido sobre todo de secuencias de ADN. En su cuarta versión (APG IV, 2016) reconoce 64 órdenes y 416 familias en varios grandes grupos: las angiospermas de divergencia temprana (como Nymphaeaceae), las magnólidas (Magnoliaceae, Lauraceae), las monocotiledóneas (Orchidaceae, Poaceae, Asparagaceae) y las eudicotiledóneas, que incluyen a las rósidas (Fabaceae, Rosaceae, Brassicaceae) y a las astéridas (Solanaceae, Lamiaceae, Asteraceae). FloralPro sigue esa clasificación.',
      'The Angiosperm Phylogeny Group arranges families by relationship, inferred mainly from DNA sequences. Its fourth version (APG IV, 2016) recognises 64 orders and 416 families in several large groups: the early-diverging angiosperms (such as Nymphaeaceae), the magnoliids (Magnoliaceae, Lauraceae), the monocots (Orchidaceae, Poaceae, Asparagaceae) and the eudicots, which include the rosids (Fabaceae, Rosaceae, Brassicaceae) and the asterids (Solanaceae, Lamiaceae, Asteraceae). FloralPro follows that classification.'],
    ['Cómo usar FloralPro en clase', 'Using FloralPro in class',
      'Proyecta la portada y separa los verticilos de una flor mientras la describes; pide a los alumnos que escriban la fórmula antes de mostrarla. Cambia entre la convención clásica y la de Prenner para comparar. Usa el modo blanco y negro de los diagramas para imprimir. Todo funciona sin internet: basta con abrir index.html con doble clic.',
      'Project the home page and pull the whorls of a flower apart as you describe it; ask students to write the formula before you show it. Switch between the classic and Prenner conventions to compare them. Use the black-and-white diagrams for printing. Everything works offline: just double-click index.html.'],
  ];
  function theory() {
    el('theory').innerHTML = THEORY.map((t, i) => `<details class="acc"${i === 0 ? ' open' : ''}><summary>${L2(t[0], t[1])}</summary><div class="acc-b"><p>${L2(t[2], t[3])}</p></div></details>`).join('');
  }
  const REFS = [
    'APG IV (Angiosperm Phylogeny Group) (2016). An update of the Angiosperm Phylogeny Group classification for the orders and families of flowering plants: APG IV. <i>Botanical Journal of the Linnean Society</i> 181: 1–20.',
    'Eichler, A. W. (1875–1878). <i>Blüthendiagramme</i>, 2 vols. Leipzig: W. Engelmann.',
    'Endress, P. K. (1994). <i>Diversity and Evolutionary Biology of Tropical Flowers</i>. Cambridge: Cambridge University Press.',
    'Judd, W. S., Campbell, C. S., Kellogg, E. A., Stevens, P. F. & Donoghue, M. J. (2016). <i>Plant Systematics: A Phylogenetic Approach</i>, 4th ed. Sunderland: Sinauer.',
    'Prenner, G., Bateman, R. M. & Rudall, P. J. (2010). Floral formulae updated for routine inclusion in formal taxonomic descriptions. <i>Taxon</i> 59: 241–250.',
    'Ronse De Craene, L. P. (2010). <i>Floral Diagrams: An Aid to Understanding Flower Morphology and Evolution</i>. Cambridge: Cambridge University Press.',
    'Ronse De Craene, L. P., Iwamoto, A., Bull-Hereñu, K., Dos Santos, P., Luna, J. A. & Farrar, J. (2014). Understanding the structure of flowers — The wonderful tool of floral formulae: a response to Prenner & al. <i>Taxon</i> 63: 1103–1111.',
    'Simpson, M. G. (2019). <i>Plant Systematics</i>, 3rd ed. London: Academic Press.',
    'Stevens, P. F. (2001 onwards). <i>Angiosperm Phylogeny Website</i>, version 14.',
    'Weberling, F. (1989). <i>Morphology of Flowers and Inflorescences</i>. Cambridge: Cambridge University Press.',
  ];
  function refs() { el('refs').innerHTML = REFS.map(r => `<li>${r}</li>`).join(''); }

  /* ---------------- wiring ---------------- */
  document.addEventListener('DOMContentLoaded', () => {
    hero();
    chips();
    renderTrio();
    whorlCards();
    symTable();
    features();
    theory();
    refs();
    el('goTrio').addEventListener('click', () => el('trio').scrollIntoView({ behavior: 'smooth' }));
    el('goSymbols').addEventListener('click', () => el('symbols').scrollIntoView({ behavior: 'smooth' }));
  });
  document.addEventListener('langchange', () => { chips(); renderTrio(); I18N.apply(el('panel-1')); });
  document.addEventListener('convchange', () => { symTable(); });
  window.Home = H;
})();
