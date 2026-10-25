/* FloralPro — hand-drawn plates for the atlas (Block 3): the things the flower
   engine does not draw — sexual systems of the plant, accrescent calyx, spur,
   anther attachment and dehiscence, pollinia, stigmas, style position,
   inflorescences and pseudanthia. Each function returns an SVG string on a
   160 × 120 canvas. Colours use the whorl tokens of the stylesheet, so a stamen
   is always the androecium colour and a carpel the gynoecium colour. */

const Art = (function () {
  const V = (body, vb) => `<svg class="art" viewBox="${vb || '0 0 160 120'}" xmlns="http://www.w3.org/2000/svg" role="img">${body}</svg>`;
  const K = 'var(--wK)', C = 'var(--wC)', A = 'var(--wA)', G = 'var(--wG)', P = 'var(--wP)', E = 'var(--wE)';
  const ST = 'var(--text-muted)', INK = 'var(--text)';
  const stem = '#6f9a4e';
  const lbl = (x, y, t, anchor) => `<text x="${x}" y="${y}" font-size="8.5" fill="${ST}" font-family="system-ui,sans-serif" text-anchor="${anchor || 'middle'}">${t}</text>`;
  const T = (es, en) => (window.I18N && I18N.lang === 'en') ? en : es;

  /* small flowers used in several plates */
  const flowerM = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s || 1})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-5" rx="3" ry="4.6" fill="${C}" opacity=".85" transform="rotate(${a})"/>`).join('')}${[36, 108, 180, 252, 324].map(a => `<path d="M0,0 L${(5.2 * Math.sin(a * Math.PI / 180)).toFixed(1)},${(-5.2 * Math.cos(a * Math.PI / 180)).toFixed(1)}" stroke="${A}" stroke-width="1"/><circle cx="${(6 * Math.sin(a * Math.PI / 180)).toFixed(1)}" cy="${(-6 * Math.cos(a * Math.PI / 180)).toFixed(1)}" r="1.3" fill="${A}"/>`).join('')}</g>`;
  const flowerF = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s || 1})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-5" rx="3" ry="4.6" fill="${C}" opacity=".85" transform="rotate(${a})"/>`).join('')}<circle r="3" fill="${G}"/><path d="M0,-3 L0,-7 M-1.6,-8 L0,-7 L1.6,-8" stroke="${G}" stroke-width="1"/></g>`;
  const flowerB = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s || 1})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-5" rx="3" ry="4.6" fill="${C}" opacity=".85" transform="rotate(${a})"/>`).join('')}${[36, 108, 180, 252, 324].map(a => `<circle cx="${(4.6 * Math.sin(a * Math.PI / 180)).toFixed(1)}" cy="${(-4.6 * Math.cos(a * Math.PI / 180)).toFixed(1)}" r="1.2" fill="${A}"/>`).join('')}<circle r="2.2" fill="${G}"/></g>`;
  const plant = (x, flowers) => `<path d="M${x},112 L${x},30" stroke="${stem}" stroke-width="2.4"/>` +
    flowers.map((f, i) => { const y = 40 + i * 22, side = i % 2 ? 1 : -1; return `<path d="M${x},${y + 8} q${side * 8},-4 ${side * 14},-8" stroke="${stem}" stroke-width="1.5" fill="none"/>` + f(x + side * 17, y - 2, 1); }).join('');

  const A_ = {};

  /* ---------- sexual systems ---------- */
  A_.monoecious = () => V(plant(80, [flowerM, flowerF, flowerM, flowerF]) + lbl(80, 118, T('una planta: ♂ y ♀', 'one plant: ♂ and ♀')));
  A_.dioecious = () => V(plant(45, [flowerM, flowerM, flowerM]) + plant(115, [flowerF, flowerF, flowerF]) + lbl(45, 118, T('planta ♂', '♂ plant')) + lbl(115, 118, T('planta ♀', '♀ plant')));
  A_.polygamous = () => V(plant(80, [flowerB, flowerM, flowerB, flowerM]) + lbl(80, 118, T('⚥ y ♂ en la misma planta', '⚥ and ♂ on one plant')));

  /* ---------- calyx ---------- */
  A_.accrescent = () => V(
    `<path d="M80,14 L80,26" stroke="${stem}" stroke-width="2"/>` +
    `<path d="M80,26 C52,32 42,64 60,92 C68,103 76,108 80,110 C84,108 92,103 100,92 C118,64 108,32 80,26Z" fill="${K}" opacity=".35" stroke="${K}" stroke-width="1.4"/>` +
    [-24, -12, 0, 12, 24].map(dx => `<path d="M80,26 Q${80 + dx * 1.3},66 80,110" stroke="${K}" stroke-width=".9" fill="none" opacity=".85"/>`).join('') +
    `<circle cx="80" cy="74" r="17" fill="#d8b43a" stroke="#9b7d1d" stroke-width="1"/><ellipse cx="74" cy="68" rx="5" ry="3.5" fill="#fff" opacity=".35"/>` +
    lbl(132, 50, T('cáliz', 'calyx')) + lbl(132, 60, T('acrescente', 'accrescent')) + lbl(28, 80, T('fruto', 'fruit')) + `<path d="M36,78 L62,74" stroke="${ST}" stroke-width=".5"/><path d="M122,54 L104,58" stroke="${ST}" stroke-width=".5"/>`);
  A_.spur = () => V(
    `<path d="M40,60 C44,40 70,34 84,42 C92,30 112,28 118,40 C126,54 110,70 96,70 C90,82 70,86 58,78 C46,78 38,72 40,60Z" fill="${C}" opacity=".85" stroke="${C}"/>` +
    `<path d="M92,58 C110,62 128,74 146,98 C132,84 112,76 94,70Z" fill="${K}" stroke="${K}" opacity=".9"/>` +
    `<circle cx="78" cy="58" r="4" fill="${A}"/>` + lbl(138, 112, T('espolón', 'spur')) + `<path d="M138,104 L138,96" stroke="${ST}" stroke-width=".5"/>`);

  /* ---------- anthers ---------- */
  const anther = (cx, cy, rot, body) => `<g transform="translate(${cx},${cy}) rotate(${rot})">${body}</g>`;
  const antherBody = `<ellipse cx="-4.2" cy="0" rx="4.4" ry="15" fill="${A}"/><ellipse cx="4.2" cy="0" rx="4.4" ry="15" fill="${A}" opacity=".85"/><path d="M0,-14 L0,14" stroke="#000" stroke-opacity=".25" stroke-width="1"/>`;
  A_['anther-basifixed'] = () => V(`<path d="M80,112 L80,62" stroke="${A}" stroke-width="2.2" opacity=".6"/>` + anther(80, 46, 0, antherBody) + `<circle cx="80" cy="62" r="2" fill="${INK}"/>` + lbl(118, 64, T('unión en la base', 'joined at the base')));
  A_['anther-dorsifixed'] = () => V(`<path d="M80,112 C80,80 86,60 86,50" stroke="${A}" stroke-width="2.2" opacity=".6"/>` + anther(80, 46, 0, antherBody) + `<circle cx="85.5" cy="50" r="2" fill="${INK}"/>` + lbl(122, 50, T('unión en el dorso', 'joined at the back')));
  A_['anther-versatile'] = () => V(`<path d="M80,112 C80,80 84,62 84,54" stroke="${A}" stroke-width="2.2" opacity=".6"/>` + anther(84, 52, 62, antherBody) + `<circle cx="84" cy="53" r="1.6" fill="${INK}"/>` +
    `<path d="M60,30 A30,30 0 0,1 108,30" fill="none" stroke="${ST}" stroke-width=".8" marker-end="url(#arr)"/><defs><marker id="arr" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L6,3 L0,6Z" fill="${ST}"/></marker></defs>` + lbl(84, 20, T('oscila sobre un punto', 'pivots on a point')));
  const bigAnther = extra => `<path d="M80,116 L80,96" stroke="${A}" stroke-width="2.4" opacity=".6"/><ellipse cx="68" cy="56" rx="12" ry="40" fill="${A}"/><ellipse cx="92" cy="56" rx="12" ry="40" fill="${A}" opacity=".85"/>${extra}`;
  A_['dehisc-longitudinal'] = () => V(bigAnther(`<path d="M68,22 L68,90 M92,22 L92,90" stroke="#5a3a00" stroke-width="1.6"/>`) + lbl(124, 112, T('por hendiduras', 'by slits')));
  A_['dehisc-poricidal'] = () => V(bigAnther(`<ellipse cx="68" cy="20" rx="3.2" ry="2.2" fill="#5a3a00"/><ellipse cx="92" cy="20" rx="3.2" ry="2.2" fill="#5a3a00"/>`) + lbl(124, 112, T('por poros', 'by pores')));
  A_['dehisc-valvular'] = () => V(bigAnther(`<path d="M60,36 L76,36 L76,56 L60,56Z" fill="#b87d0a"/><path d="M60,36 L50,22 L66,22 L76,36Z" fill="${A}" stroke="#7a5200" stroke-width=".8"/><path d="M84,62 L100,62 L100,82 L84,82Z" fill="#b87d0a"/><path d="M100,62 L110,48 L94,48 L84,62Z" fill="${A}" stroke="#7a5200" stroke-width=".8"/>`) + lbl(124, 112, T('por valvas', 'by flaps')));
  A_['dehisc-transverse'] = () => V(bigAnther(`<path d="M56,56 L104,56" stroke="#5a3a00" stroke-width="1.8"/>`) + lbl(124, 112, T('transversal', 'transverse')));
  A_.monothecal = () => V(
    `<g transform="translate(46,60)"><ellipse cx="-9" cy="0" rx="11" ry="15" fill="${A}"/><ellipse cx="9" cy="0" rx="11" ry="15" fill="${A}" opacity=".85"/>${[[-13, -6], [-13, 6], [13, -6], [13, 6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#fff" opacity=".7"/>`).join('')}<rect x="-3" y="-8" width="6" height="16" fill="#b87d0a"/></g>` +
    `<g transform="translate(118,60)"><ellipse cx="0" cy="0" rx="12" ry="15" fill="${A}"/>${[[-5, 0], [5, 0]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#fff" opacity=".7"/>`).join('')}</g>` +
    lbl(46, 96, T('ditecas: 4 sacos', 'dithecal: 4 sacs')) + lbl(118, 96, T('monotecas: 2 sacos', 'monothecal: 2 sacs')) + lbl(80, 112, T('(anteras en corte transversal)', '(anthers in cross-section)')));
  A_.pollinium = () => V(
    `<path d="M80,98 L64,54 M80,98 L96,54" stroke="#b8a060" stroke-width="2"/>` +
    `<ellipse cx="62" cy="40" rx="10" ry="16" fill="${A}" stroke="#8a6500" transform="rotate(-12 62 40)"/><ellipse cx="98" cy="40" rx="10" ry="16" fill="${A}" stroke="#8a6500" transform="rotate(12 98 40)"/>` +
    `<ellipse cx="80" cy="102" rx="8" ry="4.5" fill="#8a5a3a"/>` +
    lbl(34, 22, T('polinios', 'pollinia')) + lbl(124, 82, T('caudícula', 'caudicle'), 'start') + lbl(100, 114, T('viscidio', 'viscidium'), 'start') + `<path d="M122,80 L91,70" stroke="${ST}" stroke-width=".5"/>`);

  /* ---------- stigmas and styles ---------- */
  const pistil = (top, style) => `<ellipse cx="80" cy="96" rx="15" ry="16" fill="${G}" opacity=".9"/>${style === undefined ? `<path d="M80,80 L80,${top}" stroke="${G}" stroke-width="3"/>` : style}`;
  A_['stigma-capitate'] = () => V(pistil(30) + `<circle cx="80" cy="26" r="8" fill="${G}"/>`);
  A_['stigma-lobed'] = () => V(pistil(34) + [-40, 0, 40].map(a => `<ellipse cx="80" cy="24" rx="4.5" ry="10" fill="${G}" transform="rotate(${a} 80 34)"/>`).join(''));
  A_['stigma-bifid'] = () => V(pistil(36) + `<path d="M80,36 C74,26 68,20 62,18 M80,36 C86,26 92,20 98,18" stroke="${G}" stroke-width="3" fill="none" stroke-linecap="round"/>`);
  A_['stigma-plumose'] = () => V(pistil(46) + [-1, 1].map(s => `<path d="M80,46 L${80 + s * 28},8" stroke="${G}" stroke-width="1.6"/>` + Array.from({ length: 8 }, (_, k) => { const t = (k + 1) / 9, x = 80 + s * 28 * t, y = 46 - 38 * t; return `<path d="M${x.toFixed(1)},${y.toFixed(1)} l${s * 7},3 M${x.toFixed(1)},${y.toFixed(1)} l${s * -3},-6" stroke="${G}" stroke-width=".8"/>`; }).join('')).join(''));
  A_['stigma-petaloid'] = () => V(`<ellipse cx="80" cy="104" rx="10" ry="12" fill="${G}" opacity=".9"/>` + [-50, 0, 50].map(a => `<path d="M80,92 C70,70 70,40 80,22 C90,40 90,70 80,92Z" fill="${P}" opacity=".75" stroke="${P}" transform="rotate(${a} 80 92)"/>`).join('') + lbl(128, 20, T('ramas del estilo', 'petaloid style'), 'middle') + lbl(128, 30, T('petaloides (lirio)', 'branches (iris)'), 'middle'));
  A_['stigma-discoid'] = () => V(pistil(30) + `<ellipse cx="80" cy="28" rx="18" ry="5" fill="${G}"/>`);
  A_['style-terminal'] = () => V(`<ellipse cx="80" cy="92" rx="22" ry="20" fill="${G}" opacity=".9"/><path d="M80,72 L80,22" stroke="${G}" stroke-width="3"/><circle cx="80" cy="20" r="4" fill="${G}"/>` + lbl(128, 40, T('en el ápice', 'at the apex')));
  A_['style-gynobasic'] = () => V([[-14, -8], [14, -8], [-14, 12], [14, 12]].map(([dx, dy]) => `<ellipse cx="${80 + dx}" cy="${92 + dy}" rx="11" ry="11" fill="${G}" opacity=".9"/>`).join('') + `<path d="M80,104 L80,20" stroke="${G}" stroke-width="3"/><circle cx="80" cy="18" r="4" fill="${G}"/>` + lbl(128, 50, T('desde la base,', 'from the base,')) + lbl(128, 60, T('entre los lóbulos', 'between the lobes')));
  A_['style-lateral'] = () => V(`<ellipse cx="74" cy="84" rx="22" ry="26" fill="${G}" opacity=".9"/><path d="M95,76 C108,66 110,44 104,24" stroke="${G}" stroke-width="3" fill="none"/><circle cx="104" cy="22" r="4" fill="${G}"/>` + lbl(40, 30, T('desde un costado', 'from one side'), 'middle'));

  /* ---------- corolla forms without a 3D drawing ---------- */
  A_['corolla-spurred'] = () => V(
    `<path d="M50,56 C48,34 70,26 78,40 C84,24 108,26 106,48 C122,52 120,76 102,78 C98,94 70,96 64,80 C44,82 36,62 50,56Z" fill="${C}" opacity=".85"/>` +
    `<path d="M92,70 C112,74 130,86 150,106 C132,96 114,90 96,80Z" fill="${C}" stroke="${C}"/>` + `<circle cx="80" cy="60" r="4.5" fill="${A}"/>` + lbl(146, 118, T('espolón', 'spur'), 'end'));

  /* ---------- inflorescences (schematic, the axis grows upwards) ---------- */
  const fl = (x, y, r, o) => `<circle cx="${x}" cy="${y}" r="${r || 4}" fill="${C}" opacity="${o || 0.9}"/>`;
  const ax = d => `<path d="${d}" stroke="${stem}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  A_.raceme = () => V(ax('M80,108 L80,14') + [24, 40, 56, 72, 88].map((y, i) => { const s = i % 2 ? 1 : -1; return ax(`M80,${y + 8} L${80 + s * 14},${y}`) + fl(80 + s * 16, y - 1); }).join('') + fl(80, 12, 3.4) + lbl(80, 118, T('flores con pedicelo', 'pedicellate flowers')));
  A_.spike = () => V(ax('M80,108 L80,14') + [22, 34, 46, 58, 70, 82].map((y, i) => fl(80 + (i % 2 ? 6 : -6), y, 4.4)).join('') + lbl(80, 118, T('flores sésiles', 'sessile flowers')));
  A_.spadix = () => V(`<path d="M80,112 C42,100 36,40 70,8 C62,40 70,80 84,108Z" fill="#f4f1e6" stroke="#a9a28a"/>` + `<rect x="78" y="30" width="12" height="70" rx="6" fill="#e6c34a"/>` + Array.from({ length: 30 }, (_, k) => `<circle cx="${80 + (k % 3) * 4}" cy="${34 + Math.floor(k / 3) * 6.5}" r="1.3" fill="#b8901a"/>`).join('') + lbl(118, 40, T('espádice', 'spadix'), 'start') + lbl(22, 110, T('espata', 'spathe'), 'start'));
  A_.umbel = () => V(ax('M80,108 L80,70') + [-60, -36, -12, 12, 36, 60].map(a => { const x = 80 + 44 * Math.sin(a * Math.PI / 180), y = 70 - 44 * Math.cos(a * Math.PI / 180); return ax(`M80,70 L${x.toFixed(1)},${y.toFixed(1)}`) + fl(x, y - 2); }).join('') + lbl(80, 118, T('pedicelos de un punto', 'pedicels from one point')));
  A_.corymb = () => V(ax('M80,108 L80,40') + [[58, 70], [100, 62], [66, 54], [94, 46]].map(([yy, xx], i) => { const s = i % 2 ? 1 : -1; const bx = 80, by = [96, 84, 70, 56][i]; const ex = 80 + s * [48, 38, 26, 14][i]; return ax(`M${bx},${by} Q${ex},${by - 6} ${ex},${28}`) + fl(ex, 26); }).join('') + fl(80, 26) + lbl(80, 118, T('flores a una altura', 'flowers level at top')));
  A_.headInfl = () => V(ax('M80,108 L80,66') + `<path d="M50,66 Q80,54 110,66" fill="#9fbf6a" stroke="${stem}"/>` + Array.from({ length: 11 }, (_, k) => fl(54 + k * 5.2, 56 - Math.sin(k / 10 * Math.PI) * 6, 3.2)).join('') + Array.from({ length: 9 }, (_, k) => fl(58 + k * 5.4, 48 - Math.sin(k / 8 * Math.PI) * 6, 3.2, 0.7)).join('') + lbl(80, 118, T('flores sésiles sobre un receptáculo', 'sessile flowers on a receptacle')));
  A_.cyme = () => V(ax('M80,108 L80,50') + fl(80, 46, 5) + ax('M80,74 Q62,70 56,56') + ax('M80,74 Q98,70 104,56') + fl(56, 52, 4.2) + fl(104, 52, 4.2) + ax('M58,62 Q46,58 42,48') + ax('M58,62 Q66,56 68,44') + ax('M102,62 Q94,56 92,44') + ax('M102,62 Q114,58 118,48') + fl(42, 45, 3.4) + fl(68, 41, 3.4) + fl(92, 41, 3.4) + fl(118, 45, 3.4) + lbl(80, 30, T('1', '1')) + lbl(80, 118, T('la flor central abre primero', 'the central flower opens first')));
  A_.panicle = () => V(ax('M80,108 L80,12') + [30, 52, 74, 94].map((y, i) => { const s = i % 2 ? 1 : -1, len = 14 + i * 6; return ax(`M80,${y} L${80 + s * len},${y - 12}`) + fl(80 + s * len, y - 14, 3.2) + ax(`M${80 + s * len * 0.5},${y - 6} L${80 + s * len * 0.5},${y - 18}`) + fl(80 + s * len * 0.5, y - 20, 3); }).join('') + fl(80, 10, 3.2) + lbl(80, 118, T('racimo de racimos', 'a raceme of racemes')));
  A_.syconium = () => V(`<path d="M80,14 C120,20 132,60 124,86 C116,110 44,110 36,86 C28,60 40,20 80,14Z" fill="#7a4f7a" opacity=".85"/><path d="M80,24 C112,30 120,60 114,82 C108,100 52,100 46,82 C40,60 48,30 80,24Z" fill="#f2e3d0"/>` + Array.from({ length: 26 }, (_, k) => { const a = (k / 26) * Math.PI * 2; const x = 80 + 30 * Math.cos(a), y = 62 + 30 * Math.sin(a) * 0.9; return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.4" fill="${C}"/>`; }).join('') + `<circle cx="80" cy="16" r="3" fill="#3a2a3a"/>` + lbl(80, 8, T('ostiolo', 'ostiole')) + lbl(80, 66, T('flores dentro', 'flowers inside')));

  /* ---------- pseudanthia ---------- */
  A_.capitulum = () => V(
    Array.from({ length: 14 }, (_, k) => { const a = k * 360 / 14; return `<path d="M80,60 m0,-30 c6,-2 8,-20 0,-28 c-8,8 -6,26 0,28Z" fill="#f2c12e" stroke="#c89d10" stroke-width=".5" transform="rotate(${a} 80 60)"/>`; }).join('') +
    `<circle cx="80" cy="60" r="28" fill="#7a4a1e"/>` + Array.from({ length: 60 }, (_, k) => { const r = 26 * Math.sqrt((k + 0.5) / 60), a = k * 137.5 * Math.PI / 180; return `<circle cx="${(80 + r * Math.cos(a)).toFixed(1)}" cy="${(60 + r * Math.sin(a)).toFixed(1)}" r="1.5" fill="#caa050"/>`; }).join('') +
    lbl(146, 16, T('flores del radio', 'ray florets'), 'end') + lbl(146, 116, T('flores del disco', 'disc florets'), 'end') + `<path d="M130,108 L98,76" stroke="${ST}" stroke-width=".5"/><path d="M130,20 L110,30" stroke="${ST}" stroke-width=".5"/>`);
  A_.cyathium = () => V(
    `<path d="M50,52 C50,86 62,100 80,100 C98,100 110,86 110,52Z" fill="#8fbf5a" stroke="#5f8f3a"/>` +
    `<ellipse cx="54" cy="52" rx="10" ry="5" fill="#f2c12e" stroke="#c89d10"/><ellipse cx="106" cy="52" rx="10" ry="5" fill="#f2c12e" stroke="#c89d10"/>` +
    [58, 66, 94, 102].map(x => `<path d="M${x},92 L${x},48" stroke="#cfc28a" stroke-width="1.4"/><ellipse cx="${x}" cy="45" rx="2.6" ry="3.6" fill="${A}"/>`).join('') +
    `<path d="M80,96 C80,70 82,40 84,24" stroke="#7fae4f" stroke-width="2.2" fill="none"/><ellipse cx="84" cy="18" rx="8" ry="7" fill="${G}"/><path d="M78,12 l-5,-6 M84,11 l0,-8 M90,12 l5,-6" stroke="${G}" stroke-width="1.6"/>` +
    lbl(22, 40, T('glándula', 'gland'), 'start') + lbl(128, 26, T('flor ♀', '♀ flower'), 'start') + lbl(156, 114, T('flores ♂ (1 estambre)', '♂ flowers (1 stamen)'), 'end') + lbl(22, 100, T('involucro', 'involucre'), 'start'));
  A_.spikelet = () => V(
    ax('M80,116 L80,20') +
    `<path d="M80,104 C62,98 56,80 60,66 C68,74 76,88 80,104Z" fill="#b9c98a" stroke="#7a8a4a"/><path d="M80,98 C98,92 104,74 100,60 C92,68 84,82 80,98Z" fill="#b9c98a" stroke="#7a8a4a"/>` +
    [0, 1, 2].map(i => { const y = 76 - i * 22, s = i % 2 ? 1 : -1; return `<path d="M80,${y + 6} C${80 + s * 20},${y} ${80 + s * 20},${y - 16} ${80 + s * 8},${y - 24} C${80 + s * 6},${y - 10} ${80 + s * 2},${y} 80,${y + 6}Z" fill="#d6e2a8" stroke="#8a9a5a"/><path d="M${80 + s * 8},${y - 24} L${80 + s * 16},${y - 40}" stroke="#8a9a5a"/><circle cx="${80 + s * 7}" cy="${y - 8}" r="2" fill="${A}"/>`; }).join('') +
    lbl(28, 92, T('glumas', 'glumes'), 'start') + lbl(118, 62, T('lema', 'lemma'), 'start') + lbl(118, 72, T('(con arista)', '(awned)'), 'start') + lbl(22, 50, T('flósculos', 'florets'), 'start'));
  A_.floret = () => V(
    `<path d="M70,112 C44,90 44,50 70,18 C66,50 68,88 76,112Z" fill="#b9c98a" stroke="#7a8a4a"/><path d="M90,112 C112,92 112,56 92,26 C94,58 92,90 86,112Z" fill="#d6e2a8" stroke="#8a9a5a"/>` +
    `<ellipse cx="74" cy="100" rx="4" ry="6" fill="#e8d6a0"/><ellipse cx="86" cy="100" rx="4" ry="6" fill="#e8d6a0"/>` +
    [66, 80, 94].map(x => `<path d="M${x},96 L${x},54" stroke="#cfc28a" stroke-width="1.2"/><rect x="${x - 3}" y="40" width="6" height="16" rx="3" fill="${A}"/>`).join('') +
    `<ellipse cx="80" cy="84" rx="6" ry="8" fill="${G}"/>` + [-1, 1].map(s => `<path d="M80,78 L${80 + s * 14},62" stroke="${G}" stroke-width="1.2"/>` + [0, 1, 2, 3].map(k => `<path d="M${80 + s * (3 + k * 3)},${75 - k * 3.4} l${s * 4},1 M${80 + s * (3 + k * 3)},${75 - k * 3.4} l${s * -1},-4" stroke="${G}" stroke-width=".6"/>`).join('')).join('') +
    lbl(24, 30, T('lema', 'lemma'), 'start') + lbl(136, 30, T('pálea', 'palea'), 'end') + lbl(80, 118, T('lodículas', 'lodicules')));

  function get(id) { return A_[id] ? A_[id]() : ''; }
  return { get, has: id => !!A_[id], ids: () => Object.keys(A_) };
})();
window.Art = Art;
