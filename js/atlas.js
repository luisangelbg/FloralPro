/* FloralPro — Block 3 data: the plates of the whorl atlas and the glossary.

   A plate: { id, sec, t: [es, en] title, d: [es, en] definition, x: [es, en] examples,
              m: flower model or 'sp:<specimen id>[:<flower>]',
              fig: { t: 'diagram' | '3d' | 'section' | 'art', only, focus, id, … } (or a list of two),
              show: organ letter or 'full' (formula shown on the plate),
              need: glossary key that the description of the model must contain (validated
                    by the tests: the plate really shows the variant it names),
              terms: other glossary keys explained by the plate,
              qfig: index of the figure used in the self-assessment (Block 6) }
   Examples favour Mexican species and crops. */

const ATLAS = (function () {
  /* ---------------- illustrative models ---------------- */
  const base5 = (o) => Object.assign({ sym: 'actino', B: 1, Bt: 2, K: { w: [5] }, C: { w: [5] }, A: { w: [5] }, G: { w: [{ n: 3, connate: true }], plac: 'axile', ov: '∞' } }, o || {});
  const Mo = {
    canna: { sym: 'asym', B: 1, K: { w: [3] }, C: { w: [{ n: 3, connate: true }] }, A: { w: [{ n: 3, state: 'sterile' }, { parts: [{ n: 1 }, { n: 2, state: 'sterile' }] }] }, G: { w: [{ n: 3, connate: true }], pos: 'inferior', plac: 'axile', ov: '∞' }, adn: [['C', 'A']], colors: { K: '#c9563c', C: '#d9483b', A: '#f07a3a', G: '#8fb86a' } },
    spiral: { sym: 'spiral', P: { w: [{ n: [9, 15] }] }, A: { w: [{ n: '∞' }] }, G: { w: [{ n: '∞' }], plac: 'marginal', ov: 2 }, colors: { P: '#fbf6e6', A: '#e6c98a', G: '#b9c98a' } },
    tetra: { sym: 'actino', hyp: 'tube', K: { w: [4] }, C: { w: [4] }, A: { w: [4, 4] }, G: { w: [{ n: 4, connate: true }], pos: 'inferior', plac: 'axile', ov: '∞' }, colors: { K: '#7aa04a', C: '#f2d33a', A: '#f0e08a' } },
    passiflora: { sym: 'actino', hyp: 'cup', K: { w: [5], like: 'C' }, C: { w: [5] }, corona: { n: 60, color: '#6a3d9a' }, A: { w: [5] }, G: { w: [{ n: 3, connate: true }], plac: 'parietal', ov: '∞' }, look: { anther: 'dorsifixed', stigma: 'capitate' }, colors: { K: '#e8eef0', C: '#f4f4f6', A: '#e3d36a', G: '#9cc76a' } },
    epazote: { sym: 'actino', P: { w: [5], like: 'K' }, A: { w: [5] }, G: { w: [{ n: 2, connate: true }], plac: 'basal', loc: 1, ov: 1 }, colors: { P: '#8fb86a', A: '#e3d36a' } },
    piper: { sym: 'actino', B: 1, A: { w: [3] }, G: { w: [{ n: 3, connate: true }], plac: 'basal', loc: 1, ov: 1 }, look: { stigma: 'lobed' } },
    fuchsia: { sym: 'actino', hyp: 'tube', K: { w: [4], like: 'C' }, C: { w: [4] }, A: { w: [4, 4] }, G: { w: [{ n: 4, connate: true }], pos: 'inferior', plac: 'axile', ov: '∞' }, look: { stigma: 'capitate' }, colors: { K: '#d81b60', C: '#6a1b9a', A: '#f8bbd0', G: '#8fb86a' } },
    funnel: { sym: 'actino', K: { w: [{ n: 5, connate: true }], aest: 'quincuncial' }, C: { w: [{ n: 5, connate: true }] }, A: { w: [5] }, G: { w: [{ n: 2, connate: true }], plac: 'axile', ov: 4 }, adn: [['C', 'A']], look: { corolla: 'funnelform', stigma: 'capitate' }, colors: { K: '#6a9a45', C: '#7e57c2', A: '#f4f0e0', G: '#9cc76a' } },
    salver: { sym: 'actino', K: { w: [{ n: 5, connate: true }] }, C: { w: [{ n: 5, connate: true }], aest: 'contort' }, A: { w: [5] }, G: { w: [{ n: 2, connate: 'apical' }], plac: 'marginal', ov: '∞' }, adn: [['C', 'A']], disc: 'intra', look: { corolla: 'salverform' }, colors: { K: '#6a9a45', C: '#e84a8a', A: '#f0e08a', G: '#9cc76a' } },
    urceolate: { sym: 'actino', K: { w: [{ n: 5, connate: true }] }, C: { w: [{ n: 5, connate: true }] }, A: { w: [5, 5] }, G: { w: [{ n: 5, connate: true }], plac: 'axile', ov: '∞' }, disc: 'intra', look: { corolla: 'urceolate', dehisc: 'poricidal', stigma: 'capitate' }, colors: { K: '#8a9a5a', C: '#f5efe6', A: '#b8742a', G: '#9cc76a' } },
    personate: { sym: 'zygo', K: { w: [{ n: 5, connate: true }] }, C: { w: [{ connate: true, parts: [{ n: 2, label: { es: 'labio superior', en: 'upper lip' } }, { n: 3, label: { es: 'labio inferior (paladar)', en: 'lower lip (palate)' } }] }] }, A: { w: [{ parts: [{ n: 4 }, { n: 1, state: 'lost' }], from: 'abaxial' }] }, G: { w: [{ n: 2, connate: true }], plac: 'axile', ov: '∞' }, adn: [['C', 'A']], look: { corolla: 'personate', dyn: 'didynamous' }, colors: { K: '#6a9a45', C: '#e04e7e', A: '#f4ecc0', G: '#9cc76a' } },
    ligulate: { sym: 'zygo', K: { w: [{ n: '∞' }] }, C: { w: [{ n: 5, connate: true }] }, A: { w: [{ n: 5, connate: true }] }, G: { w: [{ n: 2, connate: true }], pos: 'inferior', plac: 'basal', loc: 1, ov: 1 }, adn: [['C', 'A']], look: { corolla: 'ligulate', synanther: true, pappus: true, stigma: 'bifid' }, colors: { K: '#f2f2f2', C: '#f2c12e', A: '#d9a21a', G: '#c9b27a' } },
    dianthus: { sym: 'actino', K: { w: [{ n: 5, connate: true }] }, C: { w: [5] }, A: { w: [{ n: 5, opp: true }, 5] }, G: { w: [{ n: 2, connate: true }], plac: 'freecentral', loc: 1, ov: '∞' }, look: { corolla: 'caryophyllaceous' }, colors: { K: '#7aa04a', C: '#e84a6a', A: '#f4ecd0', G: '#9cc76a' } },
    carinal: { sym: 'zygo', oddK: 'abaxial', K: { w: [5] }, C: { w: [{ parts: [{ n: 1, label: { es: 'pétalo superior', en: 'upper petal' } }, { n: 4 }] }], aest: 'carinal' }, A: { w: [5, 5] }, G: { w: [1], plac: 'marginal', ov: '∞' }, colors: { K: '#8aa05a', C: '#f2c12e', A: '#e8d6a0', G: '#9cc76a' } },
    obdiplo: { sym: 'actino', K: { w: [5] }, C: { w: [5], aest: 'contort' }, A: { w: [{ n: 5, opp: true }, 5] }, G: { w: [{ n: 5, connate: true }], plac: 'axile' } },
    antepet: { sym: 'actino', K: { w: [{ n: 5, connate: true }] }, C: { w: [5] }, A: { w: [{ n: 5, opp: true }] }, G: { w: [{ n: 2, connate: true }], plac: 'axile' }, disc: 'intra' },
    hypericum: { sym: 'actino', K: { w: [5] }, C: { w: [5], aest: 'contort' }, A: { w: [{ n: 3, fasc: { g: 3, per: '∞' } }] }, G: { w: [{ n: 3, connate: true }], plac: 'axile', ov: '∞' }, colors: { C: '#f2c12e', A: '#e8b820' } },
    penstemon: { sym: 'zygo', K: { w: [{ n: 5, connate: true }] }, C: { w: [{ connate: true, parts: [{ n: 2 }, { n: 3 }] }] }, A: { w: [{ parts: [{ n: 4 }, { n: 1, state: 'sterile' }], from: 'abaxial' }] }, G: { w: [{ n: 2, connate: true }], plac: 'axile', ov: '∞' }, adn: [['C', 'A']], look: { corolla: 'bilabiate', dyn: 'didynamous' }, colors: { C: '#c2185b' } },
    persea: { sym: 'actino', P: { w: [3, 3], like: 'K' }, A: { w: [3, 3, 3, { n: 3, state: 'sterile' }] }, G: { w: [1], plac: 'apical', ov: 1 }, look: { dehisc: 'valvular' }, colors: { P: '#c9d88a', A: '#e3c35a', G: '#9cc76a' } },
    nymphaea: { sym: 'actino', K: { w: [4] }, C: { w: [{ n: '∞' }] }, A: { w: [{ n: '∞' }] }, G: { w: [{ n: [10, 20], connate: true }], pos: 'half', plac: 'laminar', ov: '∞' }, colors: { K: '#6a9a45', C: '#f4f0fa', A: '#f2c12e', G: '#c9d88a' } },
    apocarp: { sym: 'actino', K: { w: [5] }, C: { w: [5] }, A: { w: [{ n: '∞' }] }, G: { w: [{ n: 8 }], plac: 'marginal', ov: 2 } },
    sympet: { sym: 'actino', K: { w: [{ n: 5, connate: true }] }, C: { w: [{ n: 5, connate: true }] }, A: { w: [5] }, G: { w: [{ n: 2, connate: true }], plac: 'axile', ov: '∞' }, adn: [['C', 'A']], look: { corolla: 'campanulate' }, colors: { C: '#7e9be8' } },
    campan: { sym: 'actino', K: { w: [{ n: 5, connate: true }] }, C: { w: [{ n: 5, connate: true }] }, A: { w: [5] }, G: { w: [{ n: 3, connate: true }], pos: 'inferior', plac: 'axile', ov: '∞' }, look: { corolla: 'campanulate', stigma: 'lobed' }, colors: { C: '#8e7cc3' } },
    open: { sym: 'actino', K: { w: [5], aest: 'open' }, C: { w: [5], aest: 'imbricate' }, A: { w: [5] }, G: { w: [{ n: 2, connate: true }], pos: 'inferior', plac: 'apical', ov: 2 } },
  };
  const aest = a => base5({ C: { w: [{ n: 5, connate: a === 'valvate' }], aest: a } });

  /* ---------------- sections ---------------- */
  const SECTIONS = [
    { id: 'flower', t: ['La flor en conjunto', 'The flower as a whole'], d: ['Simetría, sexo de la flor y de la planta, y número de piezas por verticilo.', 'Symmetry, sex of the flower and of the plant, and number of members per whorl.'] },
    { id: 'position', t: ['Posición del ovario', 'Ovary position'], d: ['Dónde nacen las piezas respecto al ovario; el corte longitudinal lo muestra mejor que nada.', 'Where the members arise relative to the ovary; the longitudinal section shows it best.'] },
    { id: 'perianth', t: ['Perianto', 'Perianth'], d: ['Las piezas estériles que rodean a los órganos sexuales.', 'The sterile members around the sexual organs.'] },
    { id: 'calyx', t: ['Cáliz', 'Calyx'], d: ['El verticilo más externo, formado por los sépalos (K).', 'The outermost whorl, made of sepals (K).'] },
    { id: 'corolla', t: ['Corola', 'Corolla'], d: ['Los pétalos (C), libres o unidos, y las formas que toman.', 'The petals (C), free or united, and the shapes they take.'] },
    { id: 'aest', t: ['Prefloración', 'Aestivation'], d: ['Cómo se acomodan las piezas del perianto en el botón; se ve en el diagrama floral.', 'How the perianth members are arranged in the bud; it shows in the floral diagram.'] },
    { id: 'andro', t: ['Androceo', 'Androecium'], d: ['El conjunto de los estambres (A): número, posición, unión y longitud.', 'The stamens (A): number, position, union and length.'] },
    { id: 'anther', t: ['Antera', 'Anther'], d: ['Cómo se une la antera al filamento y cómo se abre para liberar el polen.', 'How the anther joins the filament and how it opens to release pollen.'] },
    { id: 'gyn', t: ['Gineceo', 'Gynoecium'], d: ['Los carpelos (G): uno, varios libres o varios unidos.', 'The carpels (G): one, several free or several united.'] },
    { id: 'plac', t: ['Placentación', 'Placentation'], d: ['Dónde se insertan los óvulos dentro del ovario; se ve en el corte transversal del ovario.', 'Where the ovules are attached inside the ovary; it shows in the ovary cross-section.'] },
    { id: 'style', t: ['Estilo y estigma', 'Style and stigma'], d: ['De dónde sale el estilo y qué forma tiene el estigma, que recibe el polen.', 'Where the style arises and the shape of the stigma, which receives the pollen.'] },
    { id: 'infl', t: ['Inflorescencias y pseudantos', 'Inflorescences and pseudanthia'], d: ['Cómo se agrupan las flores, y los grupos de flores que parecen una sola flor.', 'How flowers are grouped, and groups of flowers that look like a single flower.'] },
  ];

  /* ---------------- plates ---------------- */
  const P = [];
  const add = o => P.push(o);
  const dg = (o) => Object.assign({ t: 'diagram' }, o || {});
  const d3 = (o) => Object.assign({ t: '3d' }, o || {});
  const sc = (o) => Object.assign({ t: 'section' }, o || {});
  const art = id => ({ t: 'art', id });

  /* --- the flower as a whole --- */
  add({ id: 'sym-actino', sec: 'flower', need: 'sym-actino', m: 'sp:solanum', fig: dg({ allPlanes: true, colors: 'whorl' }), show: 'full',
    t: ['Actinomorfa', 'Actinomorphic'], d: ['Tiene varios planos de simetría: se puede dividir en mitades iguales de varias maneras (simetría radial).', 'It has several planes of symmetry: it can be split into equal halves in several ways (radial symmetry).'],
    x: ['jitomate, durazno, azucena, nopal', 'tomato, peach, lily, prickly pear'] });
  add({ id: 'sym-zygo', sec: 'flower', need: 'sym-zygo', m: 'sp:phaseolus', fig: dg({ colors: 'whorl' }), show: 'full',
    t: ['Zigomorfa', 'Zygomorphic'], d: ['Tiene un solo plano de simetría, casi siempre el medio (del eje a la bráctea): los lados derecho e izquierdo son iguales, pero arriba y abajo no. Si el plano es transversal, como en Corydalis, se habla de zigomorfía transversal.', 'It has a single plane of symmetry, almost always the median one (from the axis to the bract): left and right sides match, top and bottom do not. When the plane is transverse, as in Corydalis, it is called transverse zygomorphy.'],
    x: ['frijol, chía, orquídeas, jacaranda', 'common bean, chia, orchids, jacaranda'], terms: ['sym-zygoT', 'sym-zygoO'] });
  add({ id: 'sym-disym', sec: 'flower', need: 'sym-disym', m: 'sp:brassica', fig: dg({ colors: 'whorl' }), show: 'full',
    t: ['Disimétrica', 'Disymmetric'], d: ['Tiene dos planos de simetría perpendiculares entre sí.', 'It has two planes of symmetry at right angles to each other.'],
    x: ['col, rábano y demás crucíferas; corazón sangrante (Dicentra)', 'cabbage, radish and other crucifers; bleeding heart (Dicentra)'] });
  add({ id: 'sym-asym', sec: 'flower', need: 'sym-asym', m: Mo.canna, fig: dg({ colors: 'whorl' }), show: 'full',
    t: ['Asimétrica', 'Asymmetric'], d: ['Ningún plano la divide en mitades iguales. En el platanillo solo hay un estambre fértil, con media antera, y los demás son estaminodios petaloides (esquema simplificado).', 'No plane splits it into equal halves. Canna has a single fertile stamen with half an anther, the others being petaloid staminodes (simplified scheme).'],
    x: ['platanillo o caña de Indias (Canna indica)', 'Indian shot (Canna indica)'] });
  add({ id: 'sym-spiral', sec: 'flower', need: 'sym-spiral', m: Mo.spiral, fig: dg({ colors: 'whorl' }), show: 'full',
    t: ['Espiral (acíclica)', 'Spiral (acyclic)'], d: ['Las piezas nacen una tras otra en espiral y no en verticilos, como en muchas angiospermas de divergencia temprana. Si solo los estambres y los carpelos van en espiral y el perianto en verticilos, la flor es hemicíclica, como la magnolia.', 'Members arise one after another in a spiral, not in whorls, as in many early-diverging angiosperms. If only stamens and carpels are spiral and the perianth is whorled, the flower is hemicyclic, like a magnolia.'],
    x: ['magnolia (hemicíclica), guanábana (Annona), Calycanthus', 'magnolia (hemicyclic), soursop (Annona), Calycanthus'], terms: ['hemicyclic'] });
  add({ id: 'sex-bisexual', sec: 'flower', need: 'sex-bisexual', m: base5(), fig: d3({ explode: 0.35 }), show: 'full',
    t: ['Hermafrodita (perfecta)', 'Bisexual (perfect)'], d: ['Tiene estambres y carpelos funcionales en la misma flor.', 'It has functional stamens and carpels in the same flower.'],
    x: ['la mayoría de las flores: jitomate, frijol, azucena', 'most flowers: tomato, bean, lily'] });
  add({ id: 'sex-staminate', sec: 'flower', need: 'sex-staminate', m: 'sp:cucurbita:0', fig: d3({ focus: 'A' }), show: 'full',
    t: ['Estaminada (masculina)', 'Staminate (male)'], d: ['Solo tiene estambres funcionales; a veces conserva un gineceo estéril (pistilodio).', 'Only its stamens work; sometimes it keeps a sterile gynoecium (pistillode).'],
    x: ['flores masculinas de la calabaza; espiga (panoja) del maíz', 'male flowers of squash; tassel of maize'], terms: ['pistillode'] });
  add({ id: 'sex-pistillate', sec: 'flower', need: 'sex-pistillate', m: 'sp:cucurbita:1', fig: d3({ focus: 'G' }), show: 'full',
    t: ['Pistilada (femenina)', 'Pistillate (female)'], d: ['Solo tiene gineceo funcional; a veces conserva estaminodios.', 'Only its gynoecium works; sometimes it keeps staminodes.'],
    x: ['flores femeninas de la calabaza; mazorca del maíz', 'female flowers of squash; ear of maize'] });
  add({ id: 'monoecious', sec: 'flower', fig: art('monoecious'),
    t: ['Planta monoica', 'Monoecious plant'], d: ['Flores estaminadas y pistiladas separadas, pero en la misma planta.', 'Separate staminate and pistillate flowers on the same plant.'],
    x: ['maíz, calabaza, encinos (Quercus), higuerilla', 'maize, squash, oaks (Quercus), castor bean'] });
  add({ id: 'dioecious', sec: 'flower', fig: art('dioecious'),
    t: ['Planta dioica', 'Dioecious plant'], d: ['Unas plantas solo tienen flores estaminadas y otras solo pistiladas.', 'Some plants bear only staminate flowers and others only pistillate ones.'],
    x: ['espinaca, palma datilera, sauces (Salix)', 'spinach, date palm, willows (Salix)'] });
  add({ id: 'polygamous', sec: 'flower', fig: art('polygamous'),
    t: ['Planta polígama', 'Polygamous plant'], d: ['Flores hermafroditas y unisexuales en la misma planta.', 'Bisexual and unisexual flowers on the same plant.'],
    x: ['mango (flores hermafroditas y masculinas)', 'mango (bisexual and male flowers)'] });
  add({ id: 'mero-3', sec: 'flower', need: 'merosity', check: f => FM.merosity(f) === 3, m: { sym: 'actino', P: { w: [3, 3], like: 'C' }, A: { w: [3, 3] }, G: { w: [{ n: 3, connate: true }], plac: 'axile', ov: '∞' } }, fig: dg({ colors: 'whorl' }), show: 'full',
    t: ['Trímera', 'Trimerous'], d: ['Tres piezas por verticilo (o múltiplos de tres). Es lo típico de las monocotiledóneas y de muchas magnólidas.', 'Three members per whorl (or multiples of three). Typical of monocots and many magnoliids.'],
    x: ['azucena, maguey (Agave), cebolla, aguacate', 'lily, agave, onion, avocado'] });
  add({ id: 'mero-4', sec: 'flower', need: 'merosity', check: f => FM.merosity(f) === 4, m: Mo.tetra, fig: dg({ colors: 'whorl' }), show: 'full',
    t: ['Tetrámera', 'Tetramerous'], d: ['Cuatro piezas por verticilo.', 'Four members per whorl.'],
    x: ['aretillo (Fuchsia) y onagra (Oenothera), crucíferas', 'fuchsia and evening primrose (Oenothera), crucifers'] });
  add({ id: 'mero-5', sec: 'flower', need: 'merosity', check: f => FM.merosity(f) === 5, m: base5({ A: { w: [5, 5] }, G: { w: [{ n: 5, connate: true }], plac: 'axile', ov: '∞' } }), fig: dg({ colors: 'whorl' }), show: 'full',
    t: ['Pentámera', 'Pentamerous'], d: ['Cinco piezas por verticilo, lo más común entre las eudicotiledóneas.', 'Five members per whorl, the commonest condition in eudicots.'],
    x: ['jitomate, frijol, rosa, algodón', 'tomato, bean, rose, cotton'], terms: ['merosity'] });

  /* --- ovary position --- */
  add({ id: 'hypogynous', sec: 'position', need: 'hypogynous', m: base5({ K: { w: [{ n: 5, connate: true }] } }), fig: sc({ labels: true }), show: 'G',
    t: ['Hipógina: ovario súpero', 'Hypogynous: superior ovary'], d: ['Sépalos, pétalos y estambres nacen por debajo del ovario, que queda por encima de ellos.', 'Sepals, petals and stamens arise below the ovary, which sits above them.'],
    x: ['jitomate, frijol, azucena, col', 'tomato, bean, lily, cabbage'], terms: ['ovary-superior'] });
  add({ id: 'perigynous', sec: 'position', need: 'perigynous', m: 'sp:prunus', fig: sc({ labels: true, focus: 'hyp' }), show: 'full',
    t: ['Perígina: con hipanto', 'Perigynous: with a hypanthium'], d: ['Las piezas nacen del borde de una copa (hipanto) que rodea al ovario sin soldarse a él; el ovario sigue siendo súpero.', 'The members arise from the rim of a cup (hypanthium) that surrounds the ovary without fusing to it; the ovary is still superior.'],
    x: ['durazno, ciruela, capulín, rosa', 'peach, plum, capulin cherry, rose'], terms: ['hypanthium'] });
  add({ id: 'hemiepigynous', sec: 'position', need: 'hemiepigynous', m: base5({ G: { w: [{ n: 3, connate: true }], pos: 'half', plac: 'axile', ov: '∞' } }), fig: sc({ labels: true }), show: 'G',
    t: ['Hemiepígina: ovario semiínfero', 'Half-epigynous: half-inferior ovary'], d: ['El ovario queda hundido en el receptáculo solo hasta la mitad.', 'The ovary is sunk in the receptacle only halfway.'],
    x: ['saxífragas, hortensia (Hydrangea)', 'saxifrages, hydrangea'], terms: ['ovary-half'] });
  add({ id: 'epigynous', sec: 'position', need: 'epigynous', m: 'sp:cucurbita:1', fig: sc({ labels: true }), show: 'G',
    t: ['Epígina: ovario ínfero', 'Epigynous: inferior ovary'], d: ['El ovario queda hundido y soldado al receptáculo o al hipanto; las demás piezas nacen encima de él.', 'The ovary is sunk in and fused with the receptacle or hypanthium; the other members arise on top of it.'],
    x: ['calabaza, girasol, orquídeas, guayaba, manzana', 'squash, sunflower, orchids, guava, apple'], terms: ['ovary-inferior'] });
  add({ id: 'disc', sec: 'position', need: 'disc', m: base5({ disc: 'intra', C: { w: [5], aest: 'imbricate' } }), fig: dg({ colors: 'whorl', focus: 'disc' }),
    t: ['Disco nectarífero', 'Nectary disc'], d: ['Anillo o cojinete glandular que produce néctar, por dentro o por fuera de los estambres.', 'A glandular ring or cushion that secretes nectar, inside or outside the stamens.'],
    x: ['naranjo y limón, chía, vid, mango', 'orange and lemon, chia, grapevine, mango'] });
  add({ id: 'corona', sec: 'position', need: 'corona', m: Mo.passiflora, fig: dg({ colors: 'whorl', focus: 'corona' }),
    t: ['Corona', 'Corona'], d: ['Anillo de filamentos, o una copa, entre la corola y los estambres.', 'A ring of filaments, or a cup, between the corolla and the stamens.'],
    x: ['maracuyá y granadilla (Passiflora), narciso', 'passion fruit (Passiflora), daffodil'] });

  /* --- perianth --- */
  add({ id: 'heterochlamydeous', sec: 'perianth', need: 'heterochlamydeous', m: base5({ C: { w: [5] }, colors: { C: '#f2a3c0' } }), fig: d3({ focus: 'K C' }), show: 'full',
    t: ['Heteroclamídeo', 'Heterochlamydeous'], d: ['Perianto con cáliz y corola distintos.', 'A perianth with distinct calyx and corolla.'],
    x: ['jitomate, rosa, frijol', 'tomato, rose, bean'] });
  add({ id: 'homochlamydeous', sec: 'perianth', need: 'homochlamydeous', m: 'sp:lilium', fig: d3({ focus: 'P' }), show: 'P',
    t: ['Homoclamídeo (perigonio)', 'Homochlamydeous (perigon)'], d: ['Piezas del perianto semejantes (tépalos), en dos o más verticilos.', 'Similar perianth members (tepals), in two or more whorls.'],
    x: ['azucena, tulipán, maguey, cebolla', 'lily, tulip, agave, onion'], terms: ['perigon', 'tepal'] });
  add({ id: 'monochlamydeous', sec: 'perianth', need: 'monochlamydeous', m: Mo.epazote, fig: dg({ colors: 'whorl', focus: 'P' }), show: 'full',
    t: ['Monoclamídeo', 'Monochlamydeous'], d: ['Un solo verticilo de perianto, generalmente sepaloide.', 'A single perianth whorl, usually sepaloid.'],
    x: ['epazote y amaranto o alegría (Amaranthaceae), olmo, ortiga', 'epazote and amaranth (Amaranthaceae), elm, nettle'], terms: ['sepaloid'] });
  add({ id: 'achlamydeous', sec: 'perianth', need: 'achlamydeous', m: Mo.piper, fig: dg({ colors: 'whorl' }), show: 'full',
    t: ['Aclamídeo (flor desnuda)', 'Achlamydeous (naked flower)'], d: ['Sin perianto: solo estambres, carpelos o ambos.', 'No perianth: only stamens, carpels or both.'],
    x: ['hoja santa (Piper auritum) y pimienta, sauces', 'hoja santa (Piper auritum) and pepper, willows'] });

  /* --- calyx --- */
  add({ id: 'polysepalous', sec: 'calyx', need: 'polysepalous', m: base5(), fig: dg({ colors: 'whorl', focus: 'K' }), show: 'K',
    t: ['Dialisépalo', 'Polysepalous'], d: ['Sépalos libres entre sí.', 'Sepals free from each other.'], x: ['col, rosa, fresa', 'cabbage, rose, strawberry'] });
  add({ id: 'gamosepalous', sec: 'calyx', need: 'gamosepalous', m: base5({ K: { w: [{ n: 5, connate: true }] } }), fig: dg({ colors: 'whorl', focus: 'K' }), show: 'K',
    t: ['Gamosépalo', 'Gamosepalous'], d: ['Sépalos unidos, al menos en la base, en un tubo o una copa; los extremos libres son los dientes o lóbulos.', 'Sepals united, at least at the base, into a tube or cup; the free tips are the teeth or lobes.'],
    x: ['jitomate, chía, clavel, frijol', 'tomato, chia, carnation, bean'] });
  add({ id: 'epicalyx', sec: 'calyx', need: 'epicalyx', m: 'sp:gossypium', fig: dg({ colors: 'whorl', focus: 'E' }), show: 'E',
    t: ['Epicáliz (calículo)', 'Epicalyx (calyculus)'], d: ['Verticilo de brácteas por fuera del cáliz que parece un segundo cáliz.', 'A whorl of bracts outside the calyx that looks like a second calyx.'],
    x: ['algodón, tulipán y jamaica (Hibiscus), fresa', 'cotton, hibiscus and roselle, strawberry'] });
  add({ id: 'pappus', sec: 'calyx', need: 'pappus', m: 'sp:helianthus', fig: d3({ focus: 'K' }), show: 'K',
    t: ['Vilano', 'Pappus'], d: ['Cáliz transformado en escamas, cerdas o pelos; en el fruto suele ayudar a la dispersión por el viento.', 'A calyx modified into scales, bristles or hairs; on the fruit it often aids wind dispersal.'],
    x: ['diente de león, girasol (dos escamas), cardos', 'dandelion, sunflower (two scales), thistles'] });
  add({ id: 'calyx-petaloid', sec: 'calyx', need: 'petaloid', m: Mo.fuchsia, fig: d3({ focus: 'K' }), show: 'K',
    t: ['Cáliz petaloide', 'Petaloid calyx'], d: ['Sépalos coloreados que parecen pétalos. En la fórmula ampliada se marca con una C en superíndice.', 'Coloured sepals that look like petals. The expanded formula marks it with a superscript C.'],
    x: ['aretillo (Fuchsia), espuela de caballero (Delphinium)', 'fuchsia, larkspur (Delphinium)'] });
  add({ id: 'calyx-bilabiate', sec: 'calyx', check: f => f.K && f.K.w[0].parts && f.K.w[0].parts.length === 2 && FM.allConnate(f.K), m: 'sp:salvia', fig: dg({ colors: 'whorl', focus: 'K' }), show: 'K',
    t: ['Cáliz bilabiado', 'Bilabiate calyx'], d: ['Sépalos unidos que forman dos labios desiguales.', 'United sepals forming two unequal lips.'], x: ['chía y salvias, tomillo', 'chia and sages, thyme'] });
  add({ id: 'accrescent', sec: 'calyx', fig: art('accrescent'),
    t: ['Cáliz persistente y acrescente', 'Persistent, accrescent calyx'], d: ['Persiste en el fruto y sigue creciendo hasta envolverlo.', 'It persists on the fruit and keeps growing until it wraps it.'],
    x: ['tomate de cáscara o tomatillo (Physalis philadelphica); en el jitomate es persistente, pero no crece', 'tomatillo (Physalis philadelphica); in tomato it persists but does not grow'], terms: ['persistent'] });
  add({ id: 'spur', sec: 'calyx', fig: art('spur'),
    t: ['Espolón', 'Spur'], d: ['Prolongación hueca en forma de cuerno, del cáliz o de la corola, que suele guardar néctar.', 'A hollow horn-shaped extension of the calyx or corolla that usually holds nectar.'],
    x: ['mastuerzo (Tropaeolum, en el cáliz), espuela de caballero, violeta', 'nasturtium (Tropaeolum, on the calyx), larkspur, violet'] });

  /* --- corolla --- */
  add({ id: 'polypetalous', sec: 'corolla', need: 'polypetalous', m: base5({ colors: { C: '#f2a3c0' } }), fig: d3({ focus: 'C' }), show: 'C',
    t: ['Dialipétala', 'Polypetalous'], d: ['Pétalos libres entre sí.', 'Petals free from each other.'], x: ['rosa, col, frijol, durazno', 'rose, cabbage, bean, peach'] });
  add({ id: 'gamopetalous', sec: 'corolla', need: 'gamopetalous', m: Mo.sympet, fig: d3({ focus: 'C' }), show: 'C',
    t: ['Gamopétala (simpétala)', 'Sympetalous (gamopetalous)'], d: ['Pétalos unidos en un tubo, con lóbulos libres en el extremo.', 'Petals united into a tube, with free lobes at the tip.'], x: ['jitomate, campanilla, girasol, café', 'tomato, morning glory, sunflower, coffee'] });
  const corolla = (id, m, es, en, ex, exEn, fig) => add({ id: 'corolla-' + id, sec: 'corolla', need: 'corolla-' + id, m, fig: fig || d3({ focus: 'C' }), show: 'C', t: [es[0], en[0]], d: [es[1], en[1]], x: [ex, exEn] });
  corolla('rotate', 'sp:solanum', ['Rotácea', 'Tubo muy corto y lóbulos extendidos en un plano, como una rueda.'], ['Rotate', 'A very short tube with lobes spread flat, like a wheel.'], 'jitomate, papa, chile', 'tomato, potato, chili pepper');
  corolla('campanulate', Mo.campan, ['Campanulada', 'En forma de campana.'], ['Campanulate', 'Bell-shaped.'], 'calabaza, campánulas', 'squash, bellflowers');
  corolla('tubular', 'sp:helianthus', ['Tubulosa', 'Tubo largo y estrecho, con lóbulos cortos.'], ['Tubular', 'A long narrow tube with short lobes.'], 'flores del disco del girasol y del cempasúchil', 'disc florets of sunflower and Mexican marigold');
  corolla('funnelform', Mo.funnel, ['Infundibuliforme', 'El tubo se ensancha poco a poco, como un embudo.'], ['Funnelform', 'The tube widens gradually, like a funnel.'], 'campanilla o manto (Ipomoea), camote, toloache', 'morning glory (Ipomoea), sweet potato, jimsonweed');
  corolla('salverform', Mo.salver, ['Hipocrateriforme', 'Tubo largo y angosto que se abre de golpe en un limbo plano.'], ['Salverform', 'A long narrow tube that opens abruptly into a flat limb.'], 'vicaria o teresita (Catharanthus), cacaloxóchitl (Plumeria)', 'Madagascar periwinkle (Catharanthus), frangipani (Plumeria)');
  corolla('urceolate', Mo.urceolate, ['Urceolada', 'En forma de urna o cántaro: ensanchada y estrecha en la boca.'], ['Urceolate', 'Urn- or pitcher-shaped: swollen, narrow at the mouth.'], 'madroño (Arbutus), pingüica (Arctostaphylos), arándano', 'madrone (Arbutus), manzanita (Arctostaphylos), blueberry');
  corolla('bilabiate', 'sp:salvia', ['Bilabiada', 'Los pétalos unidos forman dos labios, uno superior y otro inferior.'], ['Bilabiate', 'The united petals form two lips, an upper and a lower one.'], 'chía, salvias, albahaca, menta', 'chia, sages, basil, mint');
  corolla('personate', Mo.personate, ['Personada', 'Bilabiada, con el labio inferior abultado (paladar) que cierra la garganta.'], ['Personate', 'Bilabiate, with a bulging lower lip (palate) that closes the throat.'], 'perrito o boca de dragón (Antirrhinum), Linaria', 'snapdragon (Antirrhinum), toadflax (Linaria)');
  corolla('ligulate', Mo.ligulate, ['Ligulada', 'Tubo corto que se abre hacia un lado en una lígula o lengüeta.'], ['Ligulate', 'A short tube that opens to one side into a strap (ligule).'], 'diente de león (todas sus flores); flores del radio del girasol', 'dandelion (all its florets); ray florets of sunflower');
  corolla('papilionaceous', 'sp:phaseolus', ['Papilionácea', 'Cinco pétalos libres y desiguales: un estandarte arriba, dos alas a los lados y dos pétalos inferiores unidos en la quilla.'], ['Papilionaceous', 'Five free, unequal petals: a standard above, two wings at the sides and two lower petals united in the keel.'], 'frijol, chícharo, garbanzo, colorín (Erythrina)', 'bean, pea, chickpea, coral tree (Erythrina)');
  corolla('cruciform', 'sp:brassica', ['Cruciforme', 'Cuatro pétalos libres, a menudo con uña, dispuestos en cruz.'], ['Cruciform', 'Four free petals, often clawed, arranged in a cross.'], 'col, rábano, mostaza, colza', 'cabbage, radish, mustard, rapeseed');
  corolla('caryophyllaceous', Mo.dianthus, ['Cariofilácea', 'Cinco pétalos con una uña larga, escondida en el cáliz tubular, y un limbo extendido.'], ['Caryophyllaceous', 'Five petals with a long claw hidden in the tubular calyx and a spreading blade.'], 'clavel y clavelina (Dianthus)', 'carnation and pinks (Dianthus)');
  corolla('rosaceous', 'sp:prunus', ['Rosácea', 'Cinco pétalos libres, anchos y sin uña, extendidos.'], ['Rosaceous', 'Five free, broad, unclawed spreading petals.'], 'rosa silvestre, durazno, fresa, tejocote', 'wild rose, peach, strawberry, tejocote');
  add({ id: 'corolla-orchid', sec: 'corolla', check: f => f.P && f.P.w[1] && f.P.w[1].parts && f.P.w[1].parts.some(p => p.label), m: 'sp:vanilla', fig: d3({ focus: 'P' }), show: 'P',
    t: ['Perianto orquidáceo (labelo)', 'Orchid perianth (lip)'], d: ['Seis tépalos en dos verticilos; uno de los internos, el labelo, es distinto de los demás y suele servir de pista de aterrizaje al polinizador.', 'Six tepals in two whorls; one of the inner ones, the lip, differs from the rest and often serves as a landing platform for the pollinator.'],
    x: ['vainilla y demás orquídeas', 'vanilla and other orchids'], terms: ['labellum'] });
  add({ id: 'corolla-spurred', sec: 'corolla', fig: art('corolla-spurred'),
    t: ['Espolonada', 'Spurred'], d: ['Uno o más pétalos se prolongan en un espolón con néctar.', 'One or more petals extend into a nectar spur.'], x: ['violeta y pensamiento (Viola), Linaria, aguileña', 'violet and pansy (Viola), toadflax, columbine'] });

  /* --- aestivation --- */
  const aestPlate = (id, es, en, ex, exEn, m) => add({ id: 'aest-' + id, sec: 'aest', need: 'aest-' + id, m: m || aest(id), fig: dg({ only: ['C'], colors: 'whorl' }), t: [es[0], en[0]], d: [es[1], en[1]], x: [ex, exEn] });
  aestPlate('valvate', ['Valvar', 'Las piezas se tocan por los bordes, sin encimarse.'], ['Valvate', 'The members meet edge to edge without overlapping.'], 'corola del jitomate y de las compuestas; cáliz de las malváceas', 'corolla of tomato and composites; calyx of mallows');
  aestPlate('imbricate', ['Imbricada', 'Las piezas se enciman: al menos una queda totalmente por fuera y otra totalmente por dentro.'], ['Imbricate', 'The members overlap: at least one is wholly outside and another wholly inside.'], 'la más frecuente entre las eudicotiledóneas', 'the commonest in eudicots');
  aestPlate('quincuncial', ['Quincuncial', 'Imbricada de cinco piezas: dos por fuera, dos por dentro y una a medias.'], ['Quincuncial', 'Imbricate with five members: two outside, two inside and one half and half.'], 'cáliz de las convolvuláceas (camote) y de la rosa', 'calyx of the morning-glory family (sweet potato) and of the rose');
  aestPlate('contort', ['Contorta (retorcida)', 'Cada pieza cubre a la siguiente por un borde y es cubierta por la anterior por el otro, como las aspas de un rehilete.'], ['Contort (convolute)', 'Each member overlaps the next by one edge and is overlapped by the previous one by the other, like the blades of a pinwheel.'], 'algodón y tulipán (Malvaceae), vicaria (Apocynaceae), lino', 'cotton and hibiscus (Malvaceae), periwinkle (Apocynaceae), flax');
  aestPlate('vexillary', ['Vexilar (imbricada descendente)', 'El estandarte, arriba, cubre a las alas y estas a la quilla.'], ['Vexillary (descending imbricate)', 'The standard, above, covers the wings, which cover the keel.'], 'frijol y demás papilionoideas', 'bean and other papilionoids', 'sp:phaseolus');
  aestPlate('carinal', ['Carinal (imbricada ascendente)', 'El pétalo superior queda por dentro, cubierto por los laterales.'], ['Carinal (ascending imbricate)', 'The upper petal is innermost, covered by the lateral ones.'], 'tamarindo, pata de vaca (Bauhinia) y otras leguminosas no papilionoideas', 'tamarind, orchid tree (Bauhinia) and other non-papilionoid legumes', Mo.carinal);
  aestPlate('open', ['Abierta', 'Las piezas no llegan a tocarse en el botón.'], ['Open', 'The members do not touch each other in the bud.'], 'cáliz diminuto de muchas umbelíferas (Apiaceae)', 'tiny calyx of many umbellifers (Apiaceae)');
  /* the open aestivation plate shows the calyx, where it occurs */
  P[P.length - 1].m = Mo.open; P[P.length - 1].fig = dg({ only: ['K'], colors: 'whorl' }); P[P.length - 1].need = 'aest-open';

  /* --- androecium --- */
  const andro = (id, need, m, es, en, ex, exEn, fig) => add({ id, sec: 'andro', need, m, fig: fig || dg({ colors: 'whorl', focus: 'A' }), show: 'A', t: [es[0], en[0]], d: [es[1], en[1]], x: [ex, exEn] });
  andro('isostemonous', 'isostemonous', 'sp:solanum', ['Isostémono', 'Tantos estambres como pétalos, alternos a ellos.'], ['Isostemonous', 'As many stamens as petals, alternating with them.'], 'jitomate, borraja, zanahoria', 'tomato, borage, carrot');
  andro('oligostemonous', 'oligostemonous', 'sp:salvia', ['Oligostémono', 'Menos estambres que pétalos.'], ['Oligostemonous', 'Fewer stamens than petals.'], 'chía y salvias (2), jazmín (2)', 'chia and sages (2), jasmine (2)');
  andro('diplostemonous', 'diplostemonous', base5({ A: { w: [5, 5] } }), ['Diplostémono', 'El doble de estambres que de pétalos, en dos verticilos; el externo queda frente a los sépalos.'], ['Diplostemonous', 'Twice as many stamens as petals, in two whorls; the outer one opposite the sepals.'], 'azucena y maguey (3 + 3), madroño', 'lily and agave (3 + 3), madrone');
  andro('obdiplostemonous', 'obdiplostemonous', Mo.obdiplo, ['Obdiplostémono', 'Dos verticilos de estambres, pero el externo queda frente a los pétalos.'], ['Obdiplostemonous', 'Two whorls of stamens, but the outer one opposite the petals.'], 'geranio (Geraniaceae), agritos (Oxalis), clavel', 'geranium (Geraniaceae), wood sorrel (Oxalis), carnation');
  andro('polystemonous', 'polystemonous', 'sp:prunus', ['Polistémono', 'Estambres numerosos, más del doble que los pétalos.'], ['Polystemonous', 'Numerous stamens, more than twice the petals.'], 'durazno, guayaba, nopal, algodón', 'peach, guava, prickly pear, cotton');
  andro('antepetalous', 'antepetalous', Mo.antepet, ['Antepétalo', 'Un solo verticilo de estambres frente a los pétalos, en vez de alternar con ellos.'], ['Antepetalous', 'A single whorl of stamens opposite the petals instead of alternating with them.'], 'vid (Vitis), primavera y Anagallis (Primulaceae)', 'grapevine (Vitis), primrose and pimpernel (Primulaceae)');
  andro('monadelphous', 'monadelphous', 'sp:gossypium', ['Monadelfo', 'Filamentos unidos en un solo tubo.'], ['Monadelphous', 'Filaments united in a single tube.'], 'algodón, tulipán y jamaica (Malvaceae); caoba y cedro rojo (Meliaceae)', 'cotton, hibiscus and roselle (Malvaceae); mahogany and Spanish cedar (Meliaceae)');
  andro('diadelphous', 'diadelphous', 'sp:phaseolus', ['Diadelfo', 'Estambres en dos grupos; en las leguminosas papilionoideas, nueve unidos y uno libre.'], ['Diadelphous', 'Stamens in two groups; in papilionoid legumes, nine united and one free.'], 'frijol, chícharo, haba', 'bean, pea, broad bean');
  andro('polyadelphous', 'polyadelphous', Mo.hypericum, ['Poliadelfo', 'Estambres reunidos en varios haces.'], ['Polyadelphous', 'Stamens gathered in several bundles.'], 'hierba de San Juan (Hypericum), naranjo y limón', 'St John’s wort (Hypericum), orange and lemon');
  andro('synantherous', 'synantherous', 'sp:helianthus', ['Sinantéreo (singenésico)', 'Anteras unidas en un tubo alrededor del estilo, con los filamentos libres.'], ['Syngenesious (synantherous)', 'Anthers united in a tube around the style, with free filaments.'], 'girasol, cempasúchil, dalia (Asteraceae)', 'sunflower, Mexican marigold, dahlia (Asteraceae)');
  andro('epipetalous', 'epipetalous', 'sp:solanum', ['Epipétalo', 'Estambres soldados a la corola, de modo que parecen nacer de ella.'], ['Epipetalous', 'Stamens fused to the corolla, so that they seem to arise from it.'], 'jitomate, chía, café, campanilla', 'tomato, chia, coffee, morning glory', sc({ labels: true, focus: 'A' }));
  andro('gynostemium', 'gynostemium', 'sp:vanilla', ['Ginostemio (columna)', 'Estambres y estilo unidos en una sola estructura.'], ['Gynostemium (column)', 'Stamens and style united in a single structure.'], 'orquídeas (vainilla); algo parecido, el ginostegio, en el algodoncillo (Asclepias)', 'orchids (vanilla); something similar, the gynostegium, in milkweed (Asclepias)', sc({ labels: true, focus: 'A' }));
  andro('didynamous', 'didynamous', Mo.penstemon, ['Didínamo', 'Cuatro estambres fértiles, dos largos y dos cortos.'], ['Didynamous', 'Four fertile stamens, two long and two short.'], 'albahaca, orégano, jacaranda, perrito', 'basil, oregano, jacaranda, snapdragon', sc({ labels: true, focus: 'A' }));
  andro('tetradynamous', 'tetradynamous', 'sp:brassica', ['Tetradínamo', 'Seis estambres, cuatro largos y dos cortos.'], ['Tetradynamous', 'Six stamens, four long and two short.'], 'col, rábano, mostaza', 'cabbage, radish, mustard');
  andro('staminode', 'staminode', Mo.penstemon, ['Estaminodio', 'Estambre estéril, sin antera funcional; a veces es petaloide o produce néctar.'], ['Staminode', 'A sterile stamen without a working anther; sometimes petaloid or nectar-producing.'], 'Penstemon y jacaranda (uno largo), platanillo (petaloides)', 'Penstemon and jacaranda (a long one), Canna (petaloid)');

  /* --- anther --- */
  const anth = (id, need, m, es, en, ex, exEn) => add({ id, sec: 'anther', need, m, fig: art(id), t: [es[0], en[0]], d: [es[1], en[1]], x: [ex, exEn] });
  anth('anther-basifixed', null, null, ['Basifija', 'El filamento se une a la base de la antera.'], ['Basifixed', 'The filament joins the base of the anther.'], 'jitomate, tulipán', 'tomato, tulip');
  anth('anther-dorsifixed', null, null, ['Dorsifija', 'El filamento se une al dorso de la antera.'], ['Dorsifixed', 'The filament joins the back of the anther.'], 'frijol y muchas eudicotiledóneas', 'bean and many eudicots');
  anth('anther-versatile', 'anther-versatile', 'sp:lilium', ['Versátil', 'Dorsifija y unida por un punto tan fino que la antera oscila.'], ['Versatile', 'Dorsifixed and joined at such a fine point that the anther swings.'], 'azucena, maíz, trigo y demás pastos', 'lily, maize, wheat and other grasses');
  anth('dehisc-longitudinal', null, null, ['Dehiscencia longitudinal', 'La antera se abre por dos hendiduras a lo largo de las tecas.'], ['Longitudinal dehiscence', 'The anther opens by two slits along the thecae.'], 'la gran mayoría de las flores', 'the great majority of flowers');
  anth('dehisc-poricidal', 'dehisc-poricidal', Mo.urceolate, ['Dehiscencia poricida', 'Se abre por poros en el ápice; el polen sale cuando la abeja hace vibrar la antera (polinización por zumbido).'], ['Poricidal dehiscence', 'It opens by pores at the tip; the pollen comes out when a bee vibrates the anther (buzz pollination).'], 'berenjena y papa (Solanum), arándano y madroño (Ericaceae)', 'eggplant and potato (Solanum), blueberry and madrone (Ericaceae)');
  anth('dehisc-valvular', 'dehisc-valvular', Mo.persea, ['Dehiscencia valvar', 'Se abre por pequeñas tapas o valvas que se levantan.'], ['Valvular dehiscence', 'It opens by small lids or flaps that lift up.'], 'aguacate y laurel (Lauraceae), agracejo (Berberis)', 'avocado and bay laurel (Lauraceae), barberry (Berberis)');
  anth('dehisc-transverse', null, null, ['Dehiscencia transversal', 'Se abre por una hendidura atravesada.'], ['Transverse dehiscence', 'It opens by a crosswise slit.'], 'algunas malváceas, como Fremontodendron de Baja California', 'some mallows, such as Fremontodendron of Baja California');
  anth('monothecal', 'monothecal', 'sp:gossypium', ['Antera monoteca', 'Antera de una sola teca, con dos sacos polínicos en vez de cuatro.'], ['Monothecal anther', 'An anther with a single theca, two pollen sacs instead of four.'], 'algodón, jamaica, malva (Malvaceae)', 'cotton, roselle, mallow (Malvaceae)');
  anth('pollinium', null, null, ['Polinios', 'Todo el polen de una teca o antera forma una masa compacta que el polinizador se lleva entera.'], ['Pollinia', 'All the pollen of a theca or anther forms a compact mass that the pollinator carries away whole.'], 'la mayoría de las orquídeas (no la vainilla) y el algodoncillo (Asclepias)', 'most orchids (not vanilla) and milkweed (Asclepias)');

  /* --- gynoecium --- */
  const gyn = (id, need, m, es, en, ex, exEn, fig, show) => add({ id, sec: 'gyn', need, m, fig: fig || dg({ only: ['G'], colors: 'whorl' }), show: show || 'G', t: [es[0], en[0]], d: [es[1], en[1]], x: [ex, exEn] });
  gyn('monocarpellate', 'monocarpellate', 'sp:phaseolus', ['Monocarpelar', 'Un solo carpelo.'], ['Monocarpellate', 'A single carpel.'], 'frijol, durazno, aguacate', 'bean, peach, avocado');
  gyn('apocarpous', 'apocarpous', Mo.apocarp, ['Apocárpico', 'Varios carpelos libres entre sí.'], ['Apocarpous', 'Several carpels free from each other.'], 'fresa, magnolia, ranúnculo, guanábana', 'strawberry, magnolia, buttercup, soursop');
  gyn('syncarpous', 'syncarpous', 'sp:lilium', ['Sincárpico', 'Carpelos unidos en un solo ovario (pistilo compuesto).'], ['Syncarpous', 'Carpels united in a single ovary (compound pistil).'], 'jitomate, naranja, azucena', 'tomato, orange, lily');
  gyn('united-styles', 'united-styles', Mo.salver, ['Ovarios libres, estilos unidos', 'Los ovarios de los carpelos quedan libres, pero los estilos o los estigmas se unen en la punta. En la fórmula ampliada se escribe G2^.'], ['Free ovaries, united styles', 'The ovaries of the carpels stay free, but the styles or stigmas join at the tip. The expanded formula writes G2^.'], 'vicaria, adelfa y algodoncillo (Apocynaceae)', 'periwinkle, oleander and milkweed (Apocynaceae)');

  /* --- placentation: the ovary cross-section and the longitudinal section --- */
  const plac = (id, m, es, en, ex, exEn) => add({ id: 'plac-' + id, sec: 'plac', need: 'plac-' + id, m, fig: [dg({ only: ['G'], colors: 'whorl' }), sc({ labels: false, focus: 'G' })], show: 'G', t: [es[0], en[0]], d: [es[1], en[1]], x: [ex, exEn] });
  plac('marginal', 'sp:phaseolus', ['Marginal', 'Los óvulos nacen a lo largo del borde soldado (sutura ventral) de un carpelo.'], ['Marginal', 'The ovules arise along the fused margin (ventral suture) of a carpel.'], 'frijol, chícharo, magnolia', 'bean, pea, magnolia');
  plac('axile', 'sp:lilium', ['Axilar', 'En un ovario sincárpico dividido en lóculos, los óvulos nacen en el eje central, donde se juntan los tabiques.'], ['Axile', 'In a syncarpous ovary divided into locules, the ovules arise on the central axis, where the septa meet.'], 'jitomate, naranja, azucena', 'tomato, orange, lily');
  plac('parietal', 'sp:cucurbita:1', ['Parietal', 'Ovario de un solo lóculo; los óvulos nacen en la pared, donde se unen los carpelos.'], ['Parietal', 'A single-chambered ovary; the ovules arise on the wall, where the carpels join.'], 'calabaza, papaya, maracuyá, orquídeas', 'squash, papaya, passion fruit, orchids');
  plac('freecentral', Mo.dianthus, ['Central libre', 'Ovario de un lóculo con una columna central, sin tabiques, que lleva los óvulos.'], ['Free-central', 'A single-chambered ovary with a central column, free of septa, bearing the ovules.'], 'clavel (Caryophyllaceae), primavera y Anagallis (Primulaceae)', 'carnation (Caryophyllaceae), primrose and pimpernel (Primulaceae)');
  plac('basal', 'sp:helianthus', ['Basal', 'Un lóculo con uno o pocos óvulos que nacen en el fondo.'], ['Basal', 'One locule with one or a few ovules arising at the bottom.'], 'girasol y demás compuestas, epazote, amaranto', 'sunflower and other composites, epazote, amaranth');
  P[P.length - 1].qfig = 1;   /* seen from above, basal and apical look alike: quizzes use the section */
  plac('apical', Mo.persea, ['Apical', 'Uno o pocos óvulos cuelgan del techo del lóculo.'], ['Apical', 'One or a few ovules hang from the roof of the locule.'], 'aguacate (Lauraceae), zanahoria y cilantro (Apiaceae)', 'avocado (Lauraceae), carrot and coriander (Apiaceae)');
  P[P.length - 1].qfig = 1;
  plac('laminar', Mo.nymphaea, ['Laminar', 'Los óvulos nacen sobre las caras de los tabiques, no solo en sus bordes.'], ['Laminar', 'The ovules arise over the faces of the septa, not only at their edges.'], 'nenúfares (Nymphaea)', 'water lilies (Nymphaea)');
  add({ id: 'false-septum', sec: 'plac', need: 'false-septum', m: 'sp:salvia', fig: dg({ only: ['G'], colors: 'whorl' }), show: 'G',
    t: ['Falsos tabiques', 'False septa'], d: ['Tabiques que no corresponden a los bordes de los carpelos y dividen el ovario en más lóculos que carpelos.', 'Septa that do not match the margins of the carpels and divide the ovary into more locules than carpels.'],
    x: ['chía y demás labiadas (2 carpelos, 4 lóculos), borraja', 'chia and other mints (2 carpels, 4 locules), borage'] });
  add({ id: 'replum', sec: 'plac', need: 'replum', m: 'sp:brassica', fig: dg({ only: ['G'], colors: 'whorl' }), show: 'G',
    t: ['Réplum', 'Replum'], d: ['Marco formado por las dos placentas parietales; sobre él se tiende un falso tabique (septo) que divide el ovario en dos. Réplum y tabique quedan en el fruto cuando caen las valvas (silicua).', 'The frame formed by the two parietal placentas; a false septum stretched across it splits the ovary in two. Replum and septum remain in the fruit when the valves fall (silique).'],
    x: ['col, rábano, mostaza', 'cabbage, radish, mustard'] });

  /* --- style and stigma --- */
  const sty = (id, need, m, es, en, ex, exEn) => add({ id, sec: 'style', need, m, fig: art(id), t: [es[0], en[0]], d: [es[1], en[1]], x: [ex, exEn] });
  sty('style-terminal', null, null, ['Estilo terminal', 'El estilo sale del ápice del ovario.'], ['Terminal style', 'The style arises from the apex of the ovary.'], 'la gran mayoría de las flores', 'the great majority of flowers');
  sty('gynobasic', 'gynobasic', 'sp:salvia', ['Estilo ginobásico', 'El estilo nace en la base del ovario, entre sus lóbulos.'], ['Gynobasic style', 'The style arises at the base of the ovary, between its lobes.'], 'chía y albahaca (Lamiaceae), borraja y heliotropo (Boraginaceae)', 'chia and basil (Lamiaceae), borage and heliotrope (Boraginaceae)');
  P[P.length - 1].fig = art('style-gynobasic');
  sty('style-lateral', 'style-lateral', { sym: 'actino', K: { w: [5] }, C: { w: [5] }, A: { w: [{ n: '∞' }] }, G: { w: [{ n: '∞' }], style: 'lateral', plac: 'basal', ov: 1 }, hyp: 'cup' }, ['Estilo lateral', 'El estilo sale de un costado del ovario.'], ['Lateral style', 'The style arises from one side of the ovary.'], 'fresa (Fragaria) y otras rosáceas', 'strawberry (Fragaria) and other roses');
  const stig = (id, es, en, ex, exEn) => sty('stigma-' + id, 'stigma-' + id, base5({ look: { stigma: id } }), es, en, ex, exEn);
  stig('capitate', ['Estigma capitado', 'En forma de cabezuela.'], ['Capitate stigma', 'Head-shaped.'], 'jitomate, primavera', 'tomato, primrose');
  stig('lobed', ['Estigma lobulado', 'Dividido en lóbulos, a menudo tantos como carpelos.'], ['Lobed stigma', 'Divided into lobes, often as many as the carpels.'], 'azucena (3), calabaza', 'lily (3), squash');
  stig('bifid', ['Estigma bífido', 'Dividido en dos ramas.'], ['Bifid stigma', 'Split into two branches.'], 'girasol y demás compuestas, chía', 'sunflower and other composites, chia');
  stig('plumose', ['Estigma plumoso', 'Ramificado como una pluma; atrapa el polen que lleva el viento.'], ['Plumose stigma', 'Branched like a feather; it catches wind-borne pollen.'], 'maíz (los «pelos» del elote son estilos cubiertos de tejido estigmático), trigo y demás pastos', 'maize (corn silks are styles covered with stigmatic tissue), wheat and other grasses');
  stig('petaloid', ['Ramas del estilo petaloides', 'Ramas del estilo anchas y coloreadas como pétalos, con el estigma en la cara inferior.'], ['Petaloid style branches', 'Broad style branches coloured like petals, with the stigma on the lower face.'], 'lirios (Iris)', 'irises (Iris)');
  stig('discoid', ['Estigma discoide', 'Aplanado en forma de disco.'], ['Discoid stigma', 'Flattened like a disc.'], 'amapola (Papaver), en el que los radios del disco son los estigmas', 'poppy (Papaver), whose disc rays are the stigmas');

  /* --- inflorescences and pseudanthia --- */
  const inf = (id, es, en, ex, exEn) => add({ id, sec: 'infl', fig: art(id), t: [es[0], en[0]], d: [es[1], en[1]], x: [ex, exEn] });
  inf('raceme', ['Racimo', 'Eje con flores pediceladas que abren de la base hacia el ápice.'], ['Raceme', 'An axis with stalked flowers that open from the base upwards.'], 'col, mostaza, lupino', 'cabbage, mustard, lupin');
  inf('spike', ['Espiga', 'Como el racimo, pero con flores sésiles (sin pedicelo).'], ['Spike', 'Like a raceme, but with sessile (stalkless) flowers.'], 'llantén (Plantago), gladiola, verbena', 'plantain (Plantago), gladiolus, vervain');
  inf('spadix', ['Espádice y espata', 'Espiga de eje carnoso con flores diminutas, protegida por una gran bráctea (espata).'], ['Spadix and spathe', 'A spike with a fleshy axis and tiny flowers, sheltered by a large bract (spathe).'], 'alcatraz, costilla de Adán (Monstera), anturio', 'calla lily, Swiss cheese plant (Monstera), anthurium');
  inf('umbel', ['Umbela', 'Pedicelos que parten de un mismo punto, como las varillas de un paraguas.'], ['Umbel', 'Pedicels arising from one point, like the ribs of an umbrella.'], 'cilantro, zanahoria, hinojo (umbelas compuestas), cebolla', 'coriander, carrot, fennel (compound umbels), onion');
  inf('corymb', ['Corimbo', 'Racimo cuyos pedicelos inferiores son más largos, de modo que las flores quedan a una misma altura.'], ['Corymb', 'A raceme whose lower pedicels are longer, so the flowers end up level.'], 'tejocote (Crataegus), piracanto', 'tejocote (Crataegus), firethorn');
  inf('headInfl', ['Cabezuela (capítulo)', 'Flores sésiles apretadas sobre un receptáculo ensanchado, rodeadas por un involucro de brácteas.'], ['Head (capitulum)', 'Sessile flowers crowded on a broad receptacle, surrounded by an involucre of bracts.'], 'girasol, cempasúchil, dalia, trébol', 'sunflower, Mexican marigold, dahlia, clover');
  inf('cyme', ['Cima (dicasio)', 'El eje termina en una flor, que abre primero; las siguientes nacen en ramas laterales, más abajo.'], ['Cyme (dichasium)', 'The axis ends in a flower, which opens first; the next ones arise on side branches below.'], 'clavel, hierba de San Juan', 'carnation, St John’s wort');
  inf('panicle', ['Panícula', 'Racimo ramificado: un racimo de racimos.'], ['Panicle', 'A branched raceme: a raceme of racemes.'], 'avena, arroz, maguey, mango', 'oat, rice, agave, mango');
  inf('syconium', ['Sicono', 'Receptáculo hueco con las flores por dentro, abierto por un poro pequeño (ostiolo).'], ['Syconium', 'A hollow receptacle with the flowers inside, open through a small pore (ostiole).'], 'higo, amates e higueras (Ficus)', 'fig, amate and other Ficus');
  inf('capitulum', ['Capítulo: un pseudanto', 'Lo que parece una flor es una inflorescencia: flores del radio liguladas en el borde y flores del disco tubulosas en el centro.'], ['Capitulum: a pseudanthium', 'What looks like one flower is an inflorescence: ligulate ray florets at the edge and tubular disc florets in the centre.'], 'girasol, margarita, cempasúchil', 'sunflower, daisy, Mexican marigold');
  inf('cyathium', ['Ciatio', 'El pseudanto de las euforbias: un involucro en copa con glándulas, muchas flores masculinas reducidas a un estambre y una flor femenina central, sin perianto.'], ['Cyathium', 'The pseudanthium of spurges: a cup-shaped involucre with glands, many male flowers reduced to one stamen and a central female flower without a perianth.'], 'nochebuena (Euphorbia pulcherrima), corona de Cristo, golondrina', 'poinsettia (Euphorbia pulcherrima), crown of thorns, spotted spurge');
  inf('spikelet', ['Espiguilla', 'La unidad de la inflorescencia de los pastos: dos glumas en la base y uno o más flósculos.'], ['Spikelet', 'The unit of the grass inflorescence: two glumes at the base and one or more florets.'], 'maíz, trigo, arroz, pastos', 'maize, wheat, rice, grasses');
  inf('floret', ['Flósculo de gramínea', 'Flor de los pastos, entre la lema y la pálea: dos lodículas (restos del perianto), tres estambres y un ovario con dos estigmas plumosos.'], ['Grass floret', 'The flower of grasses, between the lemma and the palea: two lodicules (perianth remnants), three stamens and an ovary with two plumose stigmas.'], 'maíz, trigo, arroz, avena', 'maize, wheat, rice, oat');

  /* ---------------- glossary: terms that are not plates of their own ---------------- */
  const GLOSS = {
    calyx: [['Cáliz', 'Verticilo externo del perianto, formado por los sépalos (K).'], ['Calyx', 'The outer perianth whorl, made of sepals (K).']],
    corolla: [['Corola', 'Verticilo interno del perianto, formado por los pétalos (C).'], ['Corolla', 'The inner perianth whorl, made of petals (C).']],
    perigon: [['Perigonio', 'Perianto de tépalos semejantes entre sí (P).'], ['Perigon', 'A perianth of similar tepals (P).']],
    tepal: [['Tépalo', 'Pieza del perianto cuando no se distinguen sépalos y pétalos.'], ['Tepal', 'A perianth member when sepals and petals cannot be told apart.']],
    androecium: [['Androceo', 'Conjunto de los estambres (A); cada estambre tiene un filamento y una antera con el polen.'], ['Androecium', 'All the stamens (A); each stamen has a filament and a pollen-bearing anther.']],
    gynoecium: [['Gineceo', 'Conjunto de los carpelos (G), que encierran los óvulos; ovario, estilo y estigma.'], ['Gynoecium', 'All the carpels (G), which enclose the ovules; ovary, style and stigma.']],
    petaloid: [['Petaloide', 'Con aspecto de pétalo: delgado y coloreado.'], ['Petaloid', 'Petal-like: thin and coloured.']],
    sepaloid: [['Sepaloide', 'Con aspecto de sépalo: verde y más firme.'], ['Sepaloid', 'Sepal-like: green and firmer.']],
    gamotepalous: [['Gamotépalo', 'Con los tépalos unidos en un tubo.'], ['Syntepalous', 'With the tepals united in a tube.']],
    polytepalous: [['Dialitépalo', 'Con los tépalos libres.'], ['Apotepalous', 'With free tepals.']],
    anisostemonous: [['Anisostémono', 'Con un número de estambres distinto del de pétalos, sin ser el doble ni menor.'], ['Anisostemonous', 'With a number of stamens different from that of the petals, neither double nor fewer.']],
    epitepalous: [['Epitépalo', 'Estambres soldados a los tépalos.'], ['Epitepalous', 'Stamens fused to the tepals.']],
    locule: [['Lóculo', 'Cada cavidad del ovario donde se alojan los óvulos.'], ['Locule', 'Each cavity of the ovary that houses the ovules.']],
    merosity: [['Merosidad', 'Número básico de piezas por verticilo: trímera, tetrámera, pentámera…'], ['Merism', 'The basic number of members per whorl: trimerous, tetramerous, pentamerous…']],
    resupinate: [['Resupinada', 'Flor que gira 180° al abrir, de modo que lo que era la parte de arriba queda abajo; así el labelo de las orquídeas queda abajo.'], ['Resupinate', 'A flower that twists 180° as it opens, so the upper side ends up below; this is how the orchid lip comes to lie at the bottom.']],
    hemicyclic: [['Hemicíclica', 'Flor con unas piezas en verticilos y otras en espiral.'], ['Hemicyclic', 'A flower with some members in whorls and others in a spiral.']],
    pistillode: [['Pistilodio', 'Gineceo estéril, reducido, de una flor estaminada.'], ['Pistillode', 'A sterile, reduced gynoecium of a staminate flower.']],
    persistent: [['Persistente', 'Que no se cae y queda en el fruto.'], ['Persistent', 'Remaining on the fruit instead of falling.']],
    labellum: [['Labelo', 'Tépalo interno de las orquídeas, distinto de los demás.'], ['Lip (labellum)', 'The inner tepal of orchids that differs from the rest.']],
    'sym-zygoT': [['Zigomorfa transversal', 'Con un único plano de simetría perpendicular al plano medio.'], ['Transversely zygomorphic', 'With a single plane of symmetry at right angles to the median plane.']],
    'sym-zygoO': [['Zigomorfa oblicua', 'Con un único plano de simetría oblicuo respecto al plano medio.'], ['Obliquely zygomorphic', 'With a single plane of symmetry oblique to the median plane.']],
    'aest-cochlear': [['Prefloración coclear', 'Imbricada con una pieza totalmente por dentro y las demás cubriéndose en cascada.'], ['Cochlear aestivation', 'Imbricate with one member wholly inside and the others overlapping in a cascade.']],
    'corolla-cupulate': [['Cupuliforme', 'En forma de copa baja.'], ['Cup-shaped', 'Shaped like a shallow cup.']],
    'stigma-punctiform': [['Estigma puntiforme', 'Diminuto, como un punto en el ápice del estilo.'], ['Punctiform stigma', 'Minute, like a dot at the tip of the style.']],
    stamen: [['Estambre', 'Órgano masculino de la flor: filamento y antera.'], ['Stamen', 'The male organ of the flower: filament and anther.']],
    carpel: [['Carpelo', 'Hoja modificada que encierra los óvulos; uno o varios forman el gineceo.'], ['Carpel', 'A modified leaf that encloses the ovules; one or several form the gynoecium.']],
    pistil: [['Pistilo', 'Cada unidad del gineceo formada por ovario, estilo y estigma: un carpelo libre o varios unidos.'], ['Pistil', 'Each unit of the gynoecium made of ovary, style and stigma: one free carpel or several united ones.']],
    whorl: [['Verticilo', 'Conjunto de piezas florales insertas a la misma altura del receptáculo, en círculo.'], ['Whorl', 'A set of floral members inserted at the same level of the receptacle, in a circle.']],
    aestivation: [['Prefloración', 'Disposición de las piezas del perianto en el botón floral.'], ['Aestivation', 'The arrangement of the perianth members in the flower bud.']],
    connation: [['Connación', 'Unión de piezas del mismo verticilo; en la fórmula se indica con paréntesis.'], ['Connation', 'Union of members of the same whorl; the formula shows it with parentheses.']],
    adnation: [['Adnación', 'Unión de piezas de verticilos distintos, como los estambres a la corola; en la fórmula se indica con un arco o con corchetes.'], ['Adnation', 'Union of members of different whorls, such as stamens to the corolla; the formula shows it with an arc or brackets.']],
    adaxial: [['Adaxial', 'Del lado del eje de la inflorescencia (posterior); arriba en el diagrama floral.'], ['Adaxial', 'On the side of the inflorescence axis (posterior); at the top of the floral diagram.']],
    abaxial: [['Abaxial', 'Del lado de la bráctea, lejos del eje (anterior); abajo en el diagrama floral.'], ['Abaxial', 'On the side of the bract, away from the axis (anterior); at the bottom of the floral diagram.']],
    receptacle: [['Receptáculo', 'Extremo ensanchado del pedicelo donde se insertan las piezas florales.'], ['Receptacle', 'The swollen tip of the pedicel where the floral members are inserted.']],
    bract: [['Bráctea', 'Hoja modificada en cuya axila nace la flor o la inflorescencia.'], ['Bract', 'A modified leaf in whose axil the flower or inflorescence arises.']],
    bracteole: [['Bractéola (profilo)', 'Pequeña bráctea sobre el pedicelo; dos laterales en las eudicotiledóneas y una en las monocotiledóneas.'], ['Bracteole (prophyll)', 'A small bract on the pedicel; two lateral ones in eudicots and one in monocots.']],
    ovule: [['Óvulo', 'Estructura que, tras la fecundación, se convierte en semilla.'], ['Ovule', 'The structure that becomes a seed after fertilisation.']],
    placenta: [['Placenta', 'Tejido del ovario donde se insertan los óvulos.'], ['Placenta', 'The ovary tissue to which the ovules are attached.']],
    theca: [['Teca', 'Cada mitad de la antera; normalmente con dos sacos polínicos.'], ['Theca', 'Each half of the anther; normally with two pollen sacs.']],
  };

  return { SECTIONS, PLATES: P, GLOSS, MODELS: Mo };
})();
window.ATLAS = ATLAS;
