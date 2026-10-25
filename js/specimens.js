/* FloralPro — demonstration flowers used on the home page and by the tests.
   Each specimen: { id, sci, common:{es,en}, family, flowers:[{label, m}] } where m
   is a flower model (see model.js). Parts inside a whorl are listed from the
   adaxial (posterior) side to the abaxial (anterior) side unless the whorl says
   from:'abaxial'. The full catalogue of families and species comes in Block 4. */

const SPECIMENS = [
  {
    id: 'lilium', sci: 'Lilium longiflorum', common: { es: 'azucena', en: 'Easter lily' }, family: 'Liliaceae',
    note: { es: 'Monocotiledónea típica: trímera, con tépalos petaloides en dos verticilos y seis estambres.', en: 'A typical monocot: trimerous, with petaloid tepals in two whorls and six stamens.' },
    flowers: [{ m: {
      sym: 'actino', B: 1, Bt: 1,
      P: { w: [3, 3], like: 'C' }, A: { w: [3, 3] },
      G: { w: [{ n: 3, connate: true }], pos: 'superior', plac: 'axile', ov: '∞' },
      colors: { P: '#fbfaf2', A: '#e39a1b', G: '#bcd889' },
      look: { anther: 'versatile', stigma: 'lobed', perianth: 'funnelform' },
    } }],
  },
  {
    id: 'solanum', sci: 'Solanum lycopersicum', common: { es: 'jitomate', en: 'tomato' }, family: 'Solanaceae',
    note: { es: 'Corola rotácea y estambres soldados a ella (epipétalos); los dos carpelos quedan oblicuos al plano medio.', en: 'Rotate corolla with the stamens fused to it (epipetalous); the two carpels lie oblique to the median plane.' },
    flowers: [{ m: {
      sym: 'actino', B: 0, Bt: 0,
      K: { w: [{ n: 5, connate: true }], aest: 'valvate' },
      C: { w: [{ n: 5, connate: true }], aest: 'valvate' },
      A: { w: [5] },
      G: { w: [{ n: 2, connate: true }], pos: 'superior', plac: 'axile', ov: '∞', ang: 36 },
      adn: [['C', 'A']],
      colors: { K: '#5c9a3c', C: '#f4d21e', A: '#efc21a', G: '#a5cf6a' },
      look: { corolla: 'rotate', anther: 'basifixed', stigma: 'capitate', tube: 0.18 },
    } }],
  },
  {
    id: 'phaseolus', sci: 'Phaseolus vulgaris', common: { es: 'frijol', en: 'common bean' }, family: 'Fabaceae',
    note: { es: 'Corola papilionácea: estandarte, dos alas y dos pétalos unidos en la quilla; diez estambres diadelfos (9 + 1) y un solo carpelo.', en: 'Papilionaceous corolla: standard, two wings and two petals united in the keel; ten diadelphous stamens (9 + 1) and a single carpel.' },
    flowers: [{ m: {
      sym: 'zygo', B: 1, Bt: 2, oddK: 'abaxial',
      K: { w: [{ n: 5, connate: true }] },
      C: { w: [{ parts: [
        { n: 1, label: { es: 'estandarte', en: 'standard' }, size: 1.3 },
        { n: 2, label: { es: 'alas', en: 'wings' } },
        { n: 2, connate: true, label: { es: 'quilla', en: 'keel' } },
      ] }], aest: 'vexillary' },
      A: { w: [{ parts: [{ n: 9, connate: true }, { n: 1 }], from: 'abaxial', phase: 0 }] },
      G: { w: [1], pos: 'superior', plac: 'marginal' },
      colors: { K: '#6a9a45', C: '#c9a3e8', A: '#f0e6a8', G: '#a9cf7a' },
      look: { corolla: 'papilionaceous', anther: 'dorsifixed', keel: 'coiled' },
    } }],
  },
  {
    id: 'salvia', sci: 'Salvia hispanica', common: { es: 'chía', en: 'chia' }, family: 'Lamiaceae',
    note: { es: 'Cáliz y corola bilabiados; solo dos estambres fértiles; ovario de dos carpelos dividido en cuatro lóculos por falsos tabiques, con estilo ginobásico.', en: 'Bilabiate calyx and corolla; only two fertile stamens; two-carpellate ovary divided into four locules by false septa, with a gynobasic style.' },
    flowers: [{ m: {
      sym: 'zygo', B: 1, Bt: 0,
      K: { w: [{ connate: true, parts: [{ n: 3, label: { es: 'labio superior', en: 'upper lip' } }, { n: 2, label: { es: 'labio inferior', en: 'lower lip' } }] }] },
      C: { w: [{ connate: true, parts: [{ n: 2, label: { es: 'labio superior', en: 'upper lip' } }, { n: 3, label: { es: 'labio inferior', en: 'lower lip' }, size: 1.1 }] }], aest: 'imbricate' },
      A: { w: [{ parts: [{ n: 2 }, { n: 2, state: 'sterile' }, { n: 1, state: 'lost' }], from: 'abaxial' }] },
      G: { w: [{ n: 2, connate: true }], loc: 4, pos: 'superior', plac: 'axile', ov: 4, style: 'gynobasic', falseSepta: true },
      adn: [['C', 'A']], disc: 'intra',
      colors: { K: '#6b8f4e', C: '#6f5ccf', A: '#e7d9a0', G: '#9bc27a' },
      look: { corolla: 'bilabiate', stigma: 'bifid', tube: 0.45 },
    } }],
  },
  {
    id: 'cucurbita', sci: 'Cucurbita pepo', common: { es: 'calabaza', en: 'squash' }, family: 'Cucurbitaceae',
    note: { es: 'Planta monoica: flores estaminadas y pistiladas separadas en la misma planta. La pistilada tiene el ovario ínfero.', en: 'A monoecious plant: separate staminate and pistillate flowers on the same plant. The pistillate one has an inferior ovary.' },
    flowers: [
      { label: { es: 'Flor estaminada', en: 'Staminate flower' }, m: {
        sym: 'actino', sex: 'staminate', hyp: 'cup',
        K: { w: [{ n: 5, connate: true }] }, C: { w: [{ n: 5, connate: true }], aest: 'valvate' },
        A: { w: [{ n: 3, connate: true }] },
        colors: { K: '#5f9a40', C: '#f5a11c', A: '#f3c21c' },
        look: { corolla: 'campanulate', synanther: true, tube: 0.45 },
      } },
      { label: { es: 'Flor pistilada', en: 'Pistillate flower' }, m: {
        sym: 'actino', sex: 'pistillate',
        K: { w: [{ n: 5, connate: true }] }, C: { w: [{ n: 5, connate: true }], aest: 'valvate' },
        G: { w: [{ n: 3, connate: true }], pos: 'inferior', plac: 'parietal', ov: '∞' },
        colors: { K: '#5f9a40', C: '#f5a11c', G: '#8fbf4a' },
        look: { corolla: 'campanulate', stigma: 'lobed', tube: 0.45 },
      } },
    ],
  },
  {
    id: 'helianthus', sci: 'Helianthus annuus', common: { es: 'girasol', en: 'sunflower' }, family: 'Asteraceae',
    note: { es: 'Lo que parece una flor es una cabezuela (capítulo) con cientos de flores. Aquí se muestra una flor del disco: tubulosa, con vilano de dos escamas y anteras unidas.', en: 'What looks like one flower is a head (capitulum) of hundreds of flowers. This is a disc floret: tubular, with a pappus of two scales and united anthers.' },
    flowers: [{ label: { es: 'Flor del disco', en: 'Disc floret' }, m: {
      sym: 'actino',
      K: { w: [{ n: 2, label: { es: 'vilano de 2 escamas', en: 'pappus of 2 scales' } }] },
      C: { w: [{ n: 5, connate: true }], aest: 'valvate' },
      A: { w: [{ n: 5, connate: true }] },
      G: { w: [{ n: 2, connate: true }], pos: 'inferior', plac: 'basal', loc: 1, ov: 1 },
      adn: [['C', 'A']],
      colors: { K: '#c9b27a', C: '#e2a019', A: '#4a3322', G: '#d8cf9a' },
      look: { corolla: 'tubular', synanther: true, stigma: 'bifid', pappus: true, tube: 0.7 },
    } }],
  },
  {
    id: 'vanilla', sci: 'Vanilla planifolia', common: { es: 'vainilla', en: 'vanilla' }, family: 'Orchidaceae',
    note: { es: 'Orquídea mexicana: un pétalo transformado en labelo, un solo estambre fértil unido al estilo en la columna (ginostemio) y ovario ínfero que gira 180° (resupinación).', en: 'A Mexican orchid: one petal modified into a lip, a single fertile stamen united with the style in the column (gynostemium), and an inferior ovary that twists 180° (resupination).' },
    flowers: [{ m: {
      sym: 'zygo', B: 1, resup: true,
      P: { w: [3, { parts: [{ n: 1, label: { es: 'labelo', en: 'lip (labellum)' }, size: 1.2 }, { n: 2 }] }], like: 'C' },
      A: { w: [1] },
      G: { w: [{ n: 3, connate: true }], pos: 'inferior', plac: 'parietal', ov: '∞' },
      adn: [['A', 'G']],
      colors: { P: '#e3e39a', A: '#efe3a6', G: '#8fb86a' },
      look: { corolla: 'orchid' },
    } }],
  },
  {
    id: 'prunus', sci: 'Prunus persica', common: { es: 'durazno', en: 'peach' }, family: 'Rosaceae',
    note: { es: 'Flor perígina: sépalos, pétalos y estambres nacen del borde de un hipanto en forma de copa; el único carpelo queda libre en el fondo.', en: 'A perigynous flower: sepals, petals and stamens arise from the rim of a cup-shaped hypanthium; the single carpel sits free at its bottom.' },
    flowers: [{ m: {
      sym: 'actino', hyp: 'cup',
      K: { w: [5], aest: 'imbricate' }, C: { w: [5], aest: 'imbricate' },
      A: { w: [{ n: [20, 30] }] },
      G: { w: [1], pos: 'superior', plac: 'marginal', ov: 2 },
      colors: { K: '#8c4a52', C: '#f3a3bd', A: '#e0803a', G: '#a8c77a' },
      look: { corolla: 'rosaceous', anther: 'dorsifixed' },
    } }],
  },
  {
    id: 'brassica', sci: 'Brassica oleracea', common: { es: 'col, brócoli', en: 'cabbage, broccoli' }, family: 'Brassicaceae',
    note: { es: 'Corola cruciforme de cuatro pétalos en cruz; seis estambres tetradínamos (cuatro largos y dos cortos) y un ovario dividido por un falso tabique tendido sobre el réplum.', en: 'Cruciform corolla of four petals in a cross; six tetradynamous stamens (four long, two short) and an ovary divided by a false septum stretched across the replum.' },
    flowers: [{ m: {
      sym: 'disym',
      K: { w: [2, 2] }, C: { w: [4], aest: 'imbricate' },
      A: { w: [{ n: 2, ang: [90, 270] }, { n: 4, ang: [340, 20, 160, 200] }] },
      G: { w: [{ n: 2, connate: true }], pos: 'superior', plac: 'parietal', replum: true, ov: '∞', ang: 90 },
      colors: { K: '#9dbb5a', C: '#f7e14a', A: '#f0cd35', G: '#9ccf6a' },
      look: { corolla: 'cruciform', dyn: 'tetradynamous' },
    } }],
  },
  {
    id: 'magnolia', sci: 'Magnolia grandiflora', common: { es: 'magnolia', en: 'southern magnolia' }, family: 'Magnoliaceae',
    note: { es: 'Angiosperma basal: tépalos en verticilos de tres, pero estambres y carpelos numerosos y libres, dispuestos en espiral sobre un receptáculo alargado.', en: 'An early-diverging angiosperm: tepals in whorls of three, but numerous free stamens and carpels spirally arranged on an elongated receptacle.' },
    flowers: [{ m: {
      sym: 'actino',
      P: { w: [3, 3, 3] }, A: { w: [{ n: '∞' }] },
      G: { w: [{ n: '∞' }], pos: 'superior', plac: 'marginal', ov: 2 },
      colors: { P: '#fbf7ea', A: '#e3c68a', G: '#b9c98a' },
      look: { receptacle: 'elongate' },
    } }],
  },
  {
    id: 'opuntia', sci: 'Opuntia ficus-indica', common: { es: 'nopal', en: 'prickly pear' }, family: 'Cactaceae',
    note: { es: 'Tépalos y estambres numerosos en espiral; ovario ínfero hundido en el tallo (pericarpelo), de un lóculo con placentación parietal.', en: 'Numerous spirally arranged tepals and stamens; inferior ovary sunk in stem tissue (pericarpel), one-locular with parietal placentation.' },
    flowers: [{ m: {
      sym: 'actino',
      P: { w: [{ n: '∞' }] }, A: { w: [{ n: '∞' }] },
      G: { w: [{ n: [5, 10], connate: true }], pos: 'inferior', plac: 'parietal', loc: 1, ov: '∞' },
      colors: { P: '#f6c826', A: '#efe08a', G: '#88b04b' },
      look: { stigma: 'lobed' },
    } }],
  },
  {
    id: 'gossypium', sci: 'Gossypium hirsutum', common: { es: 'algodón', en: 'upland cotton' }, family: 'Malvaceae',
    note: { es: 'Epicáliz de tres brácteas, pétalos con prefloración contorta y numerosos estambres unidos en una columna (monadelfos) de anteras monotecas.', en: 'An epicalyx of three bracts, contort petals and numerous stamens united in a column (monadelphous) with monothecal anthers.' },
    flowers: [{ m: {
      sym: 'actino',
      E: { w: [3] }, K: { w: [{ n: 5, connate: true }] }, C: { w: [5], aest: 'contort' },
      A: { w: [{ n: '∞', connate: true }] },
      G: { w: [{ n: [3, 5], connate: true }], pos: 'superior', plac: 'axile', ov: '∞' },
      adn: [['C', 'A']],
      colors: { E: '#6f9a3a', K: '#7aa04a', C: '#f6ecb0', A: '#f3e2a0', G: '#a8c77a' },
      look: { thecae: 1, stigma: 'lobed' },
    } }],
  },
];
window.SPECIMENS = SPECIMENS;
