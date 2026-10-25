/* FloralPro — the engine of the strobili (Block 7).

   There is no standard formula for a gymnosperm cone, so a strobilus is
   described by a character sheet and in words, both written from its model
   (see gymno.js for the fields). The words carry <dfn data-term> for the
   glossary, like the descriptions of flowers.

   CM.normalize(m)          defaults filled in
   CM.organs(m, stage)      the parts present, in the order of the legend
   CM.color(m, org)         natural colour of a part
   CM.describe(m, stage, lang) → [{ org, html }]
   CM.sheet(m, lang)        → [{ k, v }] rows of the character sheet
   stage: 'pol' (at pollination) or 'mat' (ripe), for the seed structures. */

const CM = (function () {
  const D = { phyl: 'spiral', shape: 'ovoid', L: 100, D: 50, n: 40, ov: 0, spor: 0, bract: null, apo: false, umbo: null, horns: false, facet: null, wing: false, fleshy: null, colors: {} };
  function normalize(src) {
    const m = Object.assign({}, D, src);
    m.colors = Object.assign({}, src.colors || {});
    return m;
  }
  const color = (m, org) => (m.colors && m.colors[org]) || (GYMNO.ORG[org] ? GYMNO.ORG[org].c : '#999999');
  const ex = m => GYMNO.exById(m.ex);
  /* peltate female units: fused bract-scales in cypresses, megasporophylls in cycads */
  const femaleOrg = m => m.struct === 'fused' ? 'bscale' : m.struct === 'compound' ? 'scale' : 'mgsp';

  function organs(m, stage) {
    m = normalize(m);
    const mat = stage === 'mat', out = [];
    const seedOrg = () => m.fleshy === 'sarc' ? 'sarc' : 'seed';
    if (m.sex === 'm') {
      if (m.kind === 'ginkgo') return ['ped', 'axis', 'misp', 'spor'];
      if (m.kind === 'ephedra') return ['axis', 'bract', 'env', 'anth', 'syn'];
      return ['axis', 'misp', 'spor'];
    }
    switch (m.kind) {
      case 'crown': return ['stem', 'mgsp', mat ? 'sarc' : 'ov'];
      case 'ginkgo': return ['ped', 'collar', mat ? 'sarc' : 'ov'];
      case 'taxus': return ['bract', mat ? 'seed' : 'ov', 'aril'];
      case 'podo': return ['ped', 'rec', 'epim', mat ? 'seed' : 'ov'];
      case 'ephedra': return ['axis', 'bract', 'env', 'tub', mat ? 'seed' : 'ov'];
    }
    out.push('axis');
    if (m.unit === 'bs') out.push('bract', 'scale');
    else if (m.unit === 'arau') out.push('bscale');
    else out.push(femaleOrg(m));
    out.push(mat ? seedOrg() : 'ov');
    if (mat && m.wing && m.fleshy !== 'galb') out.push('wing');
    return out;
  }

  /* ---------------- words ---------------- */
  const dfn = (t, s) => `<dfn data-term="${t}">${s}</dfn>`;
  const W = {
    struct: {
      simple: ['Estróbilo simple: un eje con esporofilos', 'Simple strobilus: an axis with sporophylls'],
      compound: ['Estróbilo compuesto: escamas ovulíferas en la axila de brácteas', 'Compound strobilus: ovuliferous scales in the axils of bracts'],
      fused: ['Cono de escamas con la bráctea y la escama ovulífera unidas', 'Cone of scales with the bract and the ovuliferous scale fused'],
      loose: ['Sin cono: megasporofilos sueltos alrededor del ápice del tallo', 'No cone: loose megasporophylls around the stem apex'],
      stalk: ['Sin cono: dos óvulos en la punta de un pedúnculo', 'No cone: two ovules at the tip of a peduncle'],
      terminal: ['Sin cono: un óvulo en la punta de un brote corto', 'No cone: one ovule at the tip of a short shoot'],
      podo: ['Cono muy reducido: receptáculo de brácteas con uno o dos óvulos', 'A much-reduced cone: a receptacle of bracts with one or two ovules'],
      ephedra: ['Estróbilo compuesto de pares de brácteas', 'Compound strobilus of pairs of bracts'],
    },
    phyl: {
      spiral: ['En espiral', 'Spiral'], decussate: ['Decusada: pares opuestos, en cruz', 'Decussate: opposite pairs, crosswise'],
      whorl3: ['En verticilos de tres', 'In whorls of three'], rows: ['En espiral, alineadas en hileras verticales', 'Spiral, lined up in vertical rows'],
    },
    bract: {
      small: ['Libre y pequeña, oculta bajo la escama', 'Free and small, hidden under the scale'],
      exserted: ['Libre y más larga que la escama; asoma entre las escamas', 'Free and longer than the scale; it sticks out between the scales'],
      fused: ['Unida a la escama ovulífera', 'Fused with the ovuliferous scale'],
    },
    fleshy: {
      sarc: ['Sarcotesta: la capa externa de la semilla', 'Sarcotesta: the outer layer of the seed'],
      aril: ['Arilo rojo que rodea la semilla', 'A red aril around the seed'],
      epim: ['Epimacio sobre la semilla y receptáculo carnoso', 'Epimatium over the seed and a fleshy receptacle'],
      galb: ['Todo el cono: escamas soldadas y carnosas (gálbulo)', 'The whole cone: fused, fleshy scales (galbulus)'],
      bracts: ['Brácteas carnosas y rojas alrededor de las semillas', 'Fleshy red bracts around the seeds'],
    },
    wing: { true: ['Con ala', 'Winged'], narrow: ['Con dos alas angostas', 'With two narrow wings'], false: ['Sin ala', 'Wingless'] },
    pollen: { sacs: ['Con dos sacos aéreos', 'With two air sacs'], plain: ['Sin sacos aéreos', 'Without air sacs'] },
    poll: { wind: ['Viento', 'Wind'], beetles: ['Escarabajos', 'Beetles'], insects: ['Insectos y viento', 'Insects and wind'] },
    fate: {
      opens: ['Se abre y suelta las semillas', 'Opens and releases the seeds'],
      disint: ['Se deshace: las escamas caen con las semillas', 'Falls apart: the scales drop with the seeds'],
      fleshy: ['Carnoso; lo comen y dispersan aves y otros animales', 'Fleshy; birds and other animals eat and disperse it'],
      serotinous: ['Queda cerrado en el árbol varios años (serótino)', 'Stays closed on the tree for years (serotinous)'],
      sheds: ['Las semillas maduras caen al suelo', 'The ripe seeds drop to the ground'],
    },
    sys: { mono: ['Monoica', 'Monoecious'], dio: ['Dioica', 'Dioecious'] },
  };
  const L = (pair, lang) => pair ? pair[lang === 'en' ? 1 : 0] : '—';
  const range = a => Array.isArray(a) ? (a[0] === a[1] ? String(a[0]) : a[0] + '–' + a[1]) : String(a);
  const cntTxt = (m, lang) => Array.isArray(m.cnt) ? L(m.cnt, lang) : String(m.n);
  function unitTxt(m, lang) {
    const es = lang !== 'en', ov = m.ov;
    const nOv = n => es ? (n > 4 ? 'varios' : ['', 'un', 'dos', 'tres', 'cuatro'][n] || n) : (n > 4 ? 'several' : ['', 'one', 'two', 'three', 'four'][n] || n);
    if (m.sex === 'm') {
      switch (m.kind === 'cone' ? m.unit : m.kind) {
        case 'misp': return es ? `Microsporofilo con ${nOv(m.spor)} microsporangios en la cara de abajo` : `Microsporophyll with ${nOv(m.spor)} microsporangia on its underside`;
        case 'cmisp': return es ? 'Microsporofilo en cuña, con muchos microsporangios en grupos en la cara de abajo' : 'Wedge-shaped microsporophyll with many microsporangia in groups on its underside';
        case 'pelt': return es ? `Microsporofilo peltado con ${m.spor > 6 ? 'muchos' : nOv(m.spor)} microsporangios bajo el escudo${m.horns ? ' y dos cuernos' : ''}` : `Peltate microsporophyll with ${m.spor > 6 ? 'many' : nOv(m.spor)} microsporangia under the shield${m.horns ? ' and two horns' : ''}`;
        case 'tmisp': return es ? 'Microsporofilo peltado, como una sombrilla, con los microsporangios colgando alrededor del pie' : 'Peltate, umbrella-like microsporophyll with the microsporangia hanging round the stalk';
        case 'amisp': return es ? 'Microsporofilo con muchos microsporangios largos que cuelgan bajo el escudo' : 'Microsporophyll with many long microsporangia hanging under the shield';
        case 'ginkgo': return es ? 'Microsporofilo con dos microsporangios colgantes' : 'Microsporophyll with two hanging microsporangia';
        case 'ephedra': return es ? `Unidad masculina: una envoltura y un anteróforo con ${m.sporTxt || m.spor} sinangios` : `Male unit: an envelope and an antherophore with ${m.sporTxt || m.spor} synangia`;
      }
    }
    switch (m.kind === 'cone' ? m.unit : m.kind) {
      case 'bs': return es ? `Escama ovulífera con ${nOv(ov)} óvulos invertidos en la cara de arriba` : `Ovuliferous scale with ${nOv(ov)} inverted ovules on its upper face`;
      case 'pelt':
        /* the scales of a galbulus are not peltate: they fuse into the fleshy cone */
        if (m.fleshy === 'galb') return es ? 'Escama carnosa que se suelda con las demás, con uno o dos óvulos erectos en la base' : 'Fleshy scale that fuses with the others, with one or two erect ovules at its base';
        return m.struct === 'fused'
        ? (ov === 1 ? (es ? 'Escama peltada con un óvulo erecto en la base' : 'Peltate scale with one erect ovule at its base') : (es ? `Escama peltada con ${nOv(ov)} óvulos erectos en la base` : `Peltate scale with ${nOv(ov)} erect ovules at its base`))
        : (es ? `Megasporofilo peltado con dos óvulos que cuelgan hacia el eje${m.horns ? ' y dos cuernos' : ''}` : `Peltate megasporophyll with two ovules hanging towards the axis${m.horns ? ' and two horns' : ''}`);
      case 'dioon': return es ? 'Megasporofilo aplanado y afelpado, con dos óvulos en la base' : 'Flattened, felted megasporophyll with two ovules at its base';
      case 'arau': return es ? 'Escama leñosa (bráctea y escama unidas) con un óvulo hundido y una punta curva' : 'Woody scale (bract and scale fused) with one sunken ovule and a curved tip';
      case 'crown': return es ? `Megasporofilo afelpado, con aspecto de hoja, con ${range(ov)} óvulos en los márgenes y la punta dividida en lóbulos` : `Felted, leaf-like megasporophyll with ${range(ov)} ovules on its margins and a lobed tip`;
      case 'ginkgo': return es ? 'Pedúnculo con dos óvulos, cada uno sobre un collar' : 'Peduncle with two ovules, each on a collar';
      case 'taxus': return es ? 'Un óvulo erecto con un arilo que crece desde su base' : 'One erect ovule with an aril growing from its base';
      case 'podo': return es ? 'Uno o dos óvulos invertidos, cada uno envuelto por el epimacio' : 'One or two inverted ovules, each wrapped in the epimatium';
      case 'ephedra': return es ? 'Óvulo dentro de una envoltura, con un tubo micropilar que asoma' : 'Ovule inside an envelope, with a protruding micropylar tube';
    }
    return '—';
  }
  function bractTxt(m, lang) {
    if (m.sex === 'm') return m.kind === 'ephedra' ? L(['Pares opuestos, decusados; cada una con una unidad masculina', 'Opposite, decussate pairs; each with one male unit'], lang) : null;
    if (m.kind === 'taxus') return L(['Escamas decusadas en el brote corto', 'Decussate scales on the short shoot'], lang);
    if (m.kind === 'podo') return L(['Unidas en el receptáculo carnoso', 'United in the fleshy receptacle'], lang);
    if (m.kind === 'ephedra') return L(['Pares opuestos, decusados', 'Opposite, decussate pairs'], lang);
    if (m.struct === 'fused') return L(W.bract.fused, lang);
    if (m.bract) return L(W.bract[m.bract], lang);
    return L(['No hay: los óvulos van en el esporofilo', 'None: the ovules are on the sporophyll'], lang);
  }
  const matTxt = (m, lang) => !m.mature ? '—' : m.mature.y ? (lang === 'en' ? `About ${m.mature.y} years` : `Unos ${m.mature.y} años`) : (lang === 'en' ? `About ${m.mature.m} months` : `Unos ${m.mature.m} meses`);
  const sizeTxt = m => { if (!m.size) return '—'; const s = m.size; return range(s.len) + (s.wid ? ' × ' + range(s.wid) : '') + ' cm'; };

  function sheet(src, lang) {
    const m = normalize(src), e = ex(m), rows = [];
    const add = (k, v) => { if (v != null) rows.push({ k: L(k, lang), v }); };
    add(['Planta', 'Plant'], e ? L(W.sys[e.sys], lang) : null);
    add(['Estructura', 'Structure'], L(W.struct[m.struct], lang));
    if (!['crown', 'ginkgo', 'taxus', 'podo'].includes(m.kind) || (m.kind === 'ginkgo' && m.sex === 'm')) add(['Disposición de las piezas', 'Arrangement of the members'], m.kind === 'ephedra' ? L(W.phyl.decussate, lang) : L(W.phyl[m.phyl], lang));
    add(['Número de piezas', 'Number of members'], cntTxt(m, lang));
    add(['Cada pieza', 'Each member'], unitTxt(m, lang));
    add(['Bráctea', 'Bract'], bractTxt(m, lang));
    if (m.sex === 'f') {
      add(['Parte carnosa', 'Fleshy part'], m.fleshy ? L(W.fleshy[m.fleshy], lang) : L(['No: cono seco', 'None: a dry cone'], lang));
      add(['Semilla', 'Seed'], m.fleshy && m.fleshy !== 'galb' && !m.wing ? L(['Sin ala; la dispersan animales', 'Wingless; animals disperse it'], lang) : m.fleshy === 'galb' ? L(['Sin ala, dentro del gálbulo', 'Wingless, inside the galbulus'], lang) : m.unit === 'arau' && m.wing ? L(['Soldada a la escama, que tiene dos alas laterales', 'Fused to the scale, which has two lateral wings'], lang) : L(W.wing[String(m.wing)], lang));
      add(['De la polinización a la semilla madura', 'From pollination to ripe seed'], matTxt(m, lang));
      add(['Al madurar', 'When ripe'], m.fate ? L(W.fate[m.fate], lang) : null);
    } else {
      add(['Polen', 'Pollen'], m.pollen ? L(W.pollen[m.pollen], lang) : null);
    }
    add([m.kind === 'crown' ? 'Largo de cada megasporofilo' : m.kind === 'ginkgo' && m.sex === 'f' ? 'Largo del pedúnculo' : 'Tamaño', m.kind === 'crown' ? 'Length of each megasporophyll' : m.kind === 'ginkgo' && m.sex === 'f' ? 'Length of the peduncle' : 'Size'], sizeTxt(m));
    add(['Polinización', 'Pollination'], m.poll ? L(W.poll[m.poll], lang) : null);
    return rows;
  }

  function describe(src, stage, lang) {
    const m = normalize(src), es = lang !== 'en', mat = stage === 'mat', out = [];
    const t = (a, b) => es ? a : b;
    const cnt = cntTxt(m, lang);
    const phyl = { spiral: t('en espiral', 'in a spiral'), decussate: t('en pares decusados', 'in decussate pairs'), whorl3: t('en verticilos de tres', 'in whorls of three'), rows: t('en espiral, alineados en hileras verticales', 'in a spiral, lined up in vertical rows') }[m.phyl];
    const strob = dfn('strobilus', t('estróbilo', 'strobilus'));
    if (m.sex === 'm') {
      const what = m.kind === 'ephedra'
        ? t(`Estróbilo masculino ${dfn('compound-strobilus', 'compuesto')}: ${cnt}; en la axila de cada ${dfn('bract', 'bráctea')} hay una unidad masculina con una ${dfn('envelope', 'envoltura')} y un ${dfn('antherophore', 'anteróforo')} con ${m.sporTxt || m.spor} ${dfn('synangium', 'sinangios')}.`,
          `Male ${dfn('compound-strobilus', 'compound strobilus')}: ${cnt}; in the axil of each ${dfn('bract', 'bract')} there is a male unit with an ${dfn('envelope', 'envelope')} and an ${dfn('antherophore', 'antherophore')} bearing ${m.sporTxt || m.spor} ${dfn('synangium', 'synangia')}.`)
        : m.kind === 'ginkgo'
          ? t(`Estróbilo masculino ${dfn('simple-strobilus', 'simple')} y colgante, como un amento: un eje con ${cnt} ${dfn('microsporophyll', 'microsporofilos')} sueltos.`, `A hanging, catkin-like ${dfn('simple-strobilus', 'simple')} male strobilus: an axis with ${cnt} loose ${dfn('microsporophyll', 'microsporophylls')}.`)
          : t(`Cono de polen: ${strob} ${dfn('simple-strobilus', 'simple')} con ${cnt} ${dfn('microsporophyll', 'microsporofilos')} ${phyl}.`, `Pollen cone: a ${dfn('simple-strobilus', 'simple')} ${strob} with ${cnt} ${dfn('microsporophyll', 'microsporophylls')} ${phyl}.`);
      out.push({ org: m.kind === 'ephedra' ? 'bract' : 'misp', html: what });
      if (m.kind !== 'ephedra') {
        const u = unitTxt(m, lang);
        out.push({ org: 'spor', html: t(`Cada uno: ${u.charAt(0).toLowerCase() + u.slice(1)}.`, `Each: ${u.charAt(0).toLowerCase() + u.slice(1)}.`).replace(/microsporangios|microsporangia/, s => dfn('microsporangium', s)) });
      }
      const pol = m.pollen === 'sacs' ? t(` El polen tiene ${dfn('saccate-pollen', 'dos sacos aéreos')} que lo ayudan a flotar.`, ` The pollen has ${dfn('saccate-pollen', 'two air sacs')} that help it float.`) : '';
      out.push({ org: 'spor', html: t(`${{ wind: 'Lo poliniza el viento', beetles: 'Lo polinizan escarabajos, que viven y se alimentan en los conos', insects: 'Lo polinizan insectos y el viento' }[m.poll]}.`, `Pollinated by ${{ wind: 'wind', beetles: 'beetles that live and feed in the cones', insects: 'insects and wind' }[m.poll]}.`) + pol });
      return out;
    }
    /* female */
    let what;
    switch (m.kind) {
      case 'crown': what = t(`No forma cono: ${cnt} ${dfn('megasporophyll', 'megasporofilos')} con aspecto de hoja rodean el ápice del tallo, que después vuelve a producir hojas. Es el caso más parecido a una hoja con óvulos.`, `No cone: ${cnt} leaf-like ${dfn('megasporophyll', 'megasporophylls')} surround the stem apex, which later produces leaves again. It is the closest thing to a leaf bearing ovules.`); break;
      case 'ginkgo': what = t(`No forma cono: un ${dfn('peduncle', 'pedúnculo')} lleva dos óvulos en la punta, cada uno sobre un ${dfn('collar', 'collar')}; casi siempre madura solo uno.`, `No cone: a ${dfn('peduncle', 'peduncle')} bears two ovules at its tip, each on a ${dfn('collar', 'collar')}; usually only one ripens.`); break;
      case 'taxus': what = t(`No forma cono: un solo óvulo erecto en la punta de un brote corto con escamas ${dfn('decussate', 'decusadas')}.`, `No cone: a single erect ovule at the tip of a short shoot with ${dfn('decussate', 'decussate')} scales.`); break;
      case 'podo': what = t(`El cono se reduce a un ${dfn('podo-receptacle', 'receptáculo')} de brácteas unidas que lleva uno o dos óvulos invertidos, cada uno envuelto por el ${dfn('epimatium', 'epimacio')}.`, `The cone is reduced to a ${dfn('podo-receptacle', 'receptacle')} of united bracts bearing one or two inverted ovules, each wrapped in the ${dfn('epimatium', 'epimatium')}.`); break;
      case 'ephedra': what = t(`Estróbilo femenino ${dfn('compound-strobilus', 'compuesto')} de ${cnt}; el par de arriba encierra ${m.ov === 2 ? 'uno o dos óvulos' : 'un óvulo'}, cada uno en una ${dfn('envelope', 'envoltura')}.`, `Female ${dfn('compound-strobilus', 'compound strobilus')} of ${cnt}; the top pair encloses ${m.ov === 2 ? 'one or two ovules' : 'one ovule'}, each in an ${dfn('envelope', 'envelope')}.`); break;
      default:
        if (m.unit === 'bs') what = t(`Cono de semillas: ${strob} ${dfn('compound-strobilus', 'compuesto')} con ${cnt} ${dfn('ovuliferous-scale', 'escamas ovulíferas')} ${phyl}, cada una en la axila de una ${dfn('bract', 'bráctea')} ${m.bract === 'exserted' ? 'más larga que ella, que asoma entre las escamas' : 'pequeña que queda oculta'}.`,
          `Seed cone: a ${dfn('compound-strobilus', 'compound')} ${strob} with ${cnt} ${dfn('ovuliferous-scale', 'ovuliferous scales')} ${phyl}, each in the axil of a ${m.bract === 'exserted' ? 'longer' : 'small, hidden'} ${dfn('bract', 'bract')}${m.bract === 'exserted' ? ' that sticks out between the scales' : ''}.`);
        else if (m.fleshy === 'galb') what = t(`Cono de semillas con ${cnt} escamas carnosas ${phyl}, que al madurar se sueldan entre sí; cada escama es la bráctea y la escama ovulífera unidas (${dfn('bract-scale', 'complejo bráctea–escama')}).`,
          `Seed cone with ${cnt} fleshy scales ${phyl}, which fuse together as it ripens; each scale is the bract and the ovuliferous scale fused (${dfn('bract-scale', 'bract–scale complex')}).`);
        else if (m.struct === 'fused') what = t(`Cono de semillas con ${cnt} escamas ${m.unit === 'pelt' ? dfn('peltate', 'peltadas') + ' ' : 'leñosas '}${phyl}; cada escama es la bráctea y la escama ovulífera unidas (${dfn('bract-scale', 'complejo bráctea–escama')}).`,
          `Seed cone with ${cnt} ${m.unit === 'pelt' ? dfn('peltate', 'peltate') : 'woody'} scales ${phyl}; each scale is the bract and the ovuliferous scale fused (${dfn('bract-scale', 'bract–scale complex')}).`);
        else what = t(`Cono de semillas: ${strob} ${dfn('simple-strobilus', 'simple')} con ${cnt} ${dfn('megasporophyll', 'megasporofilos')} ${m.unit === 'pelt' ? dfn('peltate', 'peltados') + ' ' : 'aplanados y afelpados '}${phyl}${m.horns ? ', cada uno con dos cuernos' : ''}.`,
          `Seed cone: a ${dfn('simple-strobilus', 'simple')} ${strob} with ${cnt} ${m.unit === 'pelt' ? dfn('peltate', 'peltate') : 'flattened, felted'} ${dfn('megasporophyll', 'megasporophylls')} ${phyl}${m.horns ? ', each with two horns' : ''}.`);
    }
    out.push({ org: { crown: 'mgsp', ginkgo: 'ped', taxus: 'bract', podo: 'rec', ephedra: 'bract' }[m.kind] || (m.unit === 'bs' ? 'scale' : m.unit === 'arau' ? 'bscale' : femaleOrg(m)), html: what });
    /* the ovules and the pollination drop */
    const pos = m.unit === 'bs' ? t('invertidos, con el micrópilo hacia el eje', 'inverted, with the micropyle facing the axis')
      : m.unit === 'pelt' && m.struct === 'fused' ? t('erectos, en la base de cada escama', 'erect, at the base of each scale')
        : m.unit === 'pelt' || m.unit === 'dioon' ? t('en la cara que mira al eje', 'on the face towards the axis') : '';
    /* how pollen reaches the ovule: nearly always a pollination drop, but not in firs,
       Douglas firs or araucarias */
    const mic = dfn('micropyle', t('micrópilo', 'micropyle')), drop = dfn('pollination-drop', t('gota de polinización', 'pollination drop'));
    const howPollen = {
      funnel: t(`El polen cae en el ${mic}, que tiene forma de embudo; no hay ${drop}, y el agua de lluvia o de rocío lo arrastra adentro. No hay ovario ni estigma.`, `Pollen lands in the funnel-shaped ${mic}; there is no ${drop}, and rain or dew carries it in. There is no ovary and no stigma.`),
      scale: t(`El polen germina sobre la escama y el tubo polínico crece hasta el óvulo; no hay ${drop}. No hay ovario ni estigma.`, `Pollen germinates on the cone scale and the pollen tube grows to the ovule; there is no ${drop}. There is no ovary and no stigma.`),
      none: t(`El polen queda atrapado en la boca del ${mic}; no hay ${drop}. No hay ovario ni estigma.`, `Pollen is caught at the mouth of the ${mic}; there is no ${drop}. There is no ovary and no stigma.`),
    }[m.drop] || t(`El polen llega directo al ${mic}, atrapado por la ${drop}: no hay ovario ni estigma.`, `Pollen goes straight to the ${mic}, caught by the ${drop}: there is no ovary and no stigma.`);
    if (m.kind === 'cone') out.push({ org: 'ov', html: `${unitTxt(m, lang)}${pos && m.unit !== 'bs' && m.unit !== 'pelt' ? ', ' + pos : ''}. ${howPollen}` });
    else if (m.kind === 'ephedra') out.push({ org: 'tub', html: t(`El integumento del óvulo se alarga en un ${dfn('micropylar-tube', 'tubo micropilar')} que asoma y secreta la ${dfn('pollination-drop', 'gota de polinización')}.`, `The integument of the ovule lengthens into a ${dfn('micropylar-tube', 'micropylar tube')} that sticks out and secretes the ${dfn('pollination-drop', 'pollination drop')}.`) });
    else out.push({ org: 'ov', html: t(`Los óvulos quedan al descubierto; el polen llega directo al ${dfn('micropyle', 'micrópilo')}, atrapado por la ${dfn('pollination-drop', 'gota de polinización')}.`, `The ovules are exposed; pollen goes straight to the ${dfn('micropyle', 'micropyle')}, caught by the ${dfn('pollination-drop', 'pollination drop')}.`) });
    /* ripening */
    const fl = m.fleshy ? {
      sarc: t(`la semilla tiene una ${dfn('sarcotesta', 'sarcotesta')} carnosa`, `the seed has a fleshy ${dfn('sarcotesta', 'sarcotesta')}`),
      aril: t(`un ${dfn('aril', 'arilo')} rojo y carnoso rodea la semilla, sin cubrirla del todo`, `a red, fleshy ${dfn('aril', 'aril')} surrounds the seed without covering it`),
      epim: t(`el receptáculo se vuelve carnoso y de color, y la semilla queda envuelta por el epimacio`, `the receptacle turns fleshy and coloured, and the seed stays wrapped in the epimatium`),
      galb: t(`las escamas se sueldan y se vuelven carnosas: el cono se convierte en un ${dfn('galbulus', 'gálbulo')}, que parece una baya pero no es un fruto`, `the scales fuse and turn fleshy: the cone becomes a ${dfn('galbulus', 'galbulus')}, which looks like a berry but is not a fruit`),
      bracts: t('las brácteas se vuelven carnosas y rojas', 'the bracts turn fleshy and red'),
    }[m.fleshy] : null;
    const wing = m.unit === 'arau' && m.wing ? t('la escama, con la semilla soldada, tiene dos alas laterales', 'the scale, with the seed fused to it, has two lateral wings')
      : m.wing === true ? t(`las semillas tienen un ${dfn('seed-wing', 'ala')}`, `the seeds have a ${dfn('seed-wing', 'wing')}`) : m.wing === 'narrow' ? t('las semillas tienen dos alas angostas', 'the seeds have two narrow wings') : null;
    const when = m.mature ? (m.mature.y ? t(`Madura en unos ${m.mature.y} años`, `It ripens in about ${m.mature.y} years`) : t(`Madura en unos ${m.mature.m} meses`, `It ripens in about ${m.mature.m} months`)) : t('Madura', 'It ripens');
    const fate = m.fate ? L(W.fate[m.fate], lang).toLowerCase() : '';
    out.push({ org: m.fleshy ? ({ sarc: 'sarc', aril: 'aril', epim: 'rec', galb: 'bscale', bracts: 'bract' }[m.fleshy]) : 'seed', html: `${when}${fl ? '; ' + fl : ''}${wing ? '; ' + wing : ''}${fate ? '. ' + fate.charAt(0).toUpperCase() + fate.slice(1) : ''}.` + (mat ? '' : t(' Lo que se ve ahora es el estróbilo en la polinización.', ' What is shown now is the strobilus at pollination.')) });
    return out;
  }

  return { normalize, organs, color, describe, sheet, W, femaleOrg };
})();
window.CM = CM;
