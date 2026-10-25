/* FloralPro — Block 7 data: gymnosperms, as a contrast with the flower.

   GROUPS    the families (cycads, Ginkgo, conifers, Gnetales) with their
             distinctive characters and their place in Mexico.
   EXAMPLES  one species per kind of strobilus, each with its pollen (m) and
             seed (f) structures; the 3D, the diagrams and the character sheet
             are drawn from these models (cone.js, cone3d.js, conefig.js).
   SPECIES   gymnosperms of Mexico and a few cultivated ones, with their status
             (the codes of Block 4) and, where it applies, their category in the
             Mexican list of protected species (NOM-059-SEMARNAT-2010).
   CONTRAST  flower versus strobilus, row by row; TRAITS feeds the challenges of
             Block 6; GLOSS joins the glossary of the atlas.

   A strobilus model:
     { id, ex, sex: 'm' | 'f',
       kind: 'cone' | 'crown' | 'ginkgo' | 'taxus' | 'podo' | 'ephedra',
       struct: 'simple' | 'compound' | 'fused' | 'loose' | 'stalk' | 'terminal' | 'podo' | 'ephedra',
       unit (cones): 'misp' microsporophyll with two sacs · 'cmisp' cycad microsporophyll
             · 'pelt' peltate (shield on a stalk) · 'tmisp' umbrella-like microsporophyll
             · 'amisp' microsporophyll with many hanging sacs · 'bs' bract and ovuliferous
             scale · 'dioon' flat megasporophyll · 'arau' fused bract-scale with one seed,
       phyl: 'spiral' | 'decussate' | 'whorl3' | 'rows', rows, n (pieces drawn),
       cnt: real number of pieces, shape: 'ovoid' | 'cyl' | 'glob' | 'conic',
       L, D (proportions of the closed cone), ov, spor, bract: 'small' | 'exserted' | 'fused',
       apo (apophysis with umbo), umbo: 'dorsal' | 'terminal', horns, facet: 'hex',
       wing: true | false | 'narrow', fleshy: null | 'sarc' | 'aril' | 'epim' | 'galb' | 'bracts',
       size: { len, wid } in cm, mature: { y } or { m }, pollen: 'sacs' | 'plain',
       poll: 'wind' | 'beetles' | 'insects', fate: 'opens' | 'disint' | 'fleshy' | 'serotinous' | 'sheds',
       colors }  */

const GYMNO = (function () {
  /* ---------------- organs (the parts that light up in every view) ---------------- */
  const ORG = {
    axis: { es: 'Eje del estróbilo', en: 'Cone axis', c: '#9b7b56', term: 'strobilus' },
    ped: { es: 'Pedúnculo', en: 'Peduncle', c: '#8f8a52', term: 'peduncle' },
    stem: { es: 'Ápice del tallo', en: 'Stem apex', c: '#8c7a5a', term: null },
    bract: { es: 'Bráctea', en: 'Bract', c: '#c9a86a', term: 'bract' },
    scale: { es: 'Escama ovulífera', en: 'Ovuliferous scale', c: '#9a6a3c', term: 'ovuliferous-scale' },
    bscale: { es: 'Escama (bráctea y escama ovulífera unidas)', en: 'Cone scale (bract and ovuliferous scale fused)', c: '#8a6a44', term: 'bract-scale' },
    mgsp: { es: 'Megasporofilo', en: 'Megasporophyll', c: '#b88c52', term: 'megasporophyll' },
    ov: { es: 'Óvulo', en: 'Ovule', c: '#eadba8', term: 'ovule' },
    seed: { es: 'Semilla', en: 'Seed', c: '#6b4a2e', term: 'seed' },
    wing: { es: 'Ala de la semilla', en: 'Seed wing', c: '#d2ad75', term: 'seed-wing' },
    misp: { es: 'Microsporofilo', en: 'Microsporophyll', c: '#c99a4a', term: 'microsporophyll' },
    spor: { es: 'Microsporangio (saco polínico)', en: 'Microsporangium (pollen sac)', c: '#f0cf55', term: 'microsporangium' },
    sarc: { es: 'Sarcotesta', en: 'Sarcotesta', c: '#e0782e', term: 'sarcotesta' },
    aril: { es: 'Arilo', en: 'Aril', c: '#d8342c', term: 'aril' },
    epim: { es: 'Epimacio', en: 'Epimatium', c: '#6f9e6a', term: 'epimatium' },
    rec: { es: 'Receptáculo carnoso', en: 'Fleshy receptacle', c: '#8e2a55', term: 'podo-receptacle' },
    collar: { es: 'Collar', en: 'Collar', c: '#c9b27a', term: 'collar' },
    env: { es: 'Envoltura (bractéolas unidas)', en: 'Envelope (united bracteoles)', c: '#a8b86c', term: 'envelope' },
    tub: { es: 'Tubo micropilar', en: 'Micropylar tube', c: '#d9c27a', term: 'micropylar-tube' },
    anth: { es: 'Anteróforo (microsporangióforo)', en: 'Antherophore (microsporangiophore)', c: '#cfae55', term: 'antherophore' },
    syn: { es: 'Sinangio', en: 'Synangium', c: '#f0cf55', term: 'synangium' },
    leaf: { es: 'Hoja', en: 'Leaf', c: '#6f9a4e', term: null },
  };

  /* ---------------- families ---------------- */
  const LINEAGE = [
    { id: 'cycads', es: 'Cícadas', en: 'Cycads' },
    { id: 'ginkgo', es: 'Ginkgo', en: 'Ginkgo' },
    { id: 'conifers', es: 'Coníferas', en: 'Conifers' },
    { id: 'gnetales', es: 'Gnetales', en: 'Gnetales' },
  ];
  const GROUPS = [
    { id: 'cycadaceae', name: 'Cycadaceae', order: 'Cycadales', lin: 'cycads', es: 'cicadáceas', en: 'cycad family',
      chars: { es: ['Plantas dioicas con tallo grueso y una corona de hojas pinnadas.', 'La única cícada sin cono femenino: los megasporofilos, con aspecto de hoja, rodean el ápice del tallo, que sigue creciendo.', 'Óvulos grandes en los márgenes del megasporofilo; semillas con sarcotesta de color.', 'El tubo polínico libera espermatozoides con flagelos.'],
        en: ['Dioecious plants with a thick stem and a crown of pinnate leaves.', 'The only cycad without a female cone: the leaf-like megasporophylls surround the stem apex, which keeps growing.', 'Large ovules on the margins of the megasporophyll; seeds with a coloured sarcotesta.', 'The pollen tube releases flagellate sperm.'] },
      mx: { es: 'Sin especies nativas; Cycas revoluta es muy común en jardines.', en: 'No native species; Cycas revoluta is very common in gardens.' } },
    { id: 'zamiaceae', name: 'Zamiaceae', order: 'Cycadales', lin: 'cycads', es: 'zamiáceas', en: 'zamia family',
      chars: { es: ['Plantas dioicas, de aspecto de palma o helecho, con hojas pinnadas.', 'Conos masculinos y femeninos en plantas distintas; esporofilos en espiral o en hileras verticales.', 'Cada megasporofilo lleva dos óvulos; las semillas tienen sarcotesta carnosa.', 'Las polinizan sobre todo escarabajos, no el viento.'],
        en: ['Dioecious plants that look like palms or ferns, with pinnate leaves.', 'Male and female cones on different plants; sporophylls in a spiral or in vertical rows.', 'Each megasporophyll bears two ovules; the seeds have a fleshy sarcotesta.', 'Pollinated mostly by beetles, not by wind.'] },
      mx: { es: 'México es el segundo país con más cícadas, después de Australia: unas 70 especies de Ceratozamia, Dioon y Zamia, casi todas endémicas y protegidas.', en: 'Mexico is second only to Australia in cycads: about 70 species of Ceratozamia, Dioon and Zamia, nearly all endemic and protected.' } },
    { id: 'ginkgoaceae', name: 'Ginkgoaceae', order: 'Ginkgoales', lin: 'ginkgo', es: 'ginkgoáceas', en: 'ginkgo family',
      chars: { es: ['Una sola especie viva, árbol dioico de hojas en abanico.', 'Estróbilos masculinos colgantes, como amentos; los óvulos van de dos en dos en la punta de un pedúnculo, cada uno sobre un collar.', 'La semilla tiene una capa externa carnosa (sarcotesta) de olor rancio y una interna dura.', 'Espermatozoides con flagelos, como en las cícadas.'],
        en: ['A single living species, a dioecious tree with fan-shaped leaves.', 'Male strobili hang like catkins; the ovules come in pairs at the tip of a peduncle, each on a collar.', 'The seed has a fleshy, rancid-smelling outer layer (sarcotesta) and a hard inner one.', 'Flagellate sperm, as in cycads.'] },
      mx: { es: 'Árbol de ornato originario de China, plantado en calles y parques.', en: 'An ornamental tree from China, planted in streets and parks.' } },
    { id: 'pinaceae', name: 'Pinaceae', order: 'Pinales', lin: 'conifers', es: 'pináceas', en: 'pine family',
      chars: { es: ['Árboles monoicos con hojas en forma de aguja.', 'Cono de semillas compuesto: cada escama ovulífera, con dos óvulos invertidos, nace en la axila de una bráctea libre.', 'Polen casi siempre con dos sacos aéreos (no en Larix ni Pseudotsuga).', 'Semillas casi siempre aladas.'],
        en: ['Monoecious trees with needle-like leaves.', 'Compound seed cone: each ovuliferous scale, with two inverted ovules, arises in the axil of a free bract.', 'Pollen usually with two air sacs (not in Larix or Pseudotsuga).', 'Seeds usually winged.'] },
      mx: { es: 'México es el país con más especies de pino del mundo (unas 49); además oyameles (Abies), pinabetes (Pseudotsuga) y tres piceas relictas.', en: 'Mexico has more pine species than any other country (about 49); also firs (Abies), Douglas firs (Pseudotsuga) and three relict spruces.' } },
    { id: 'cupressaceae', name: 'Cupressaceae', order: 'Cupressales', lin: 'conifers', es: 'cupresáceas', en: 'cypress family',
      chars: { es: ['Hojas en escama o en aguja, a menudo opuestas o en verticilos de tres.', 'Escamas del cono formadas por la bráctea y la escama ovulífera unidas, muchas veces peltadas.', 'De uno a muchos óvulos erectos por escama.', 'En Juniperus el cono se vuelve carnoso (gálbulo) y lo dispersan las aves.'],
        en: ['Scale or needle leaves, often opposite or in whorls of three.', 'Cone scales made of the bract and the ovuliferous scale fused, often peltate.', 'One to many erect ovules per scale.', 'In Juniperus the cone becomes fleshy (a galbulus) and birds disperse it.'] },
      mx: { es: 'Ahuehuete (árbol nacional), cedro blanco, táscates y enebros; unas 29 especies nativas (20 de ellas, enebros).', en: 'Montezuma cypress (the national tree), Mexican cypress, junipers; about 29 native species (20 of them junipers).' } },
    { id: 'podocarpaceae', name: 'Podocarpaceae', order: 'Araucariales', lin: 'conifers', es: 'podocarpáceas', en: 'podocarp family',
      chars: { es: ['Árboles casi siempre dioicos, de hojas planas.', 'El cono femenino se reduce a un receptáculo carnoso (brácteas unidas) con uno o dos óvulos.', 'Cada óvulo, invertido, queda envuelto por el epimacio (la escama ovulífera).', 'Polen con dos (a veces tres) sacos aéreos.'],
        en: ['Usually dioecious trees with flat leaves.', 'The female cone is reduced to a fleshy receptacle (united bracts) with one or two ovules.', 'Each inverted ovule is wrapped in the epimatium (the ovuliferous scale).', 'Pollen with two (sometimes three) air sacs.'] },
      mx: { es: 'Unas tres especies de Podocarpus en bosques mesófilos y selvas de montaña.', en: 'About three species of Podocarpus in cloud forests and montane rain forests.' } },
    { id: 'taxaceae', name: 'Taxaceae', order: 'Cupressales', lin: 'conifers', es: 'taxáceas', en: 'yew family',
      chars: { es: ['Árboles o arbustos casi siempre dioicos, de hojas planas.', 'Sin cono femenino: un solo óvulo erecto en la punta de un brote corto con escamas.', 'La semilla queda rodeada por un arilo carnoso, casi siempre rojo, que comen las aves.', 'Conos masculinos pequeños; en Taxus, con microsporofilos peltados en forma de sombrilla.'],
        en: ['Usually dioecious trees or shrubs with flat leaves.', 'No female cone: a single erect ovule at the tip of a short scaly shoot.', 'The seed is surrounded by a fleshy aril, usually red, eaten by birds.', 'Small male cones; in Taxus with peltate, umbrella-like microsporophylls.'] },
      mx: { es: 'Taxus globosa, el tejo mexicano, en cañadas húmedas de montaña; protegido.', en: 'Taxus globosa, the Mexican yew, in moist mountain ravines; protected.' } },
    { id: 'araucariaceae', name: 'Araucariaceae', order: 'Araucariales', lin: 'conifers', es: 'araucariáceas', en: 'araucaria family',
      chars: { es: ['Árboles grandes, de ramas en pisos.', 'Conos femeninos grandes, casi esféricos, que se desintegran al madurar.', 'Bráctea y escama unidas; un solo óvulo por escama, hundido en ella.', 'Conos masculinos grandes, con muchos sacos polínicos colgantes por microsporofilo.'],
        en: ['Large trees with branches in tiers.', 'Large, nearly spherical female cones that fall apart when ripe.', 'Bract and scale fused; a single ovule per scale, sunk in it.', 'Large male cones, with many hanging pollen sacs per microsporophyll.'] },
      mx: { es: 'Sin especies nativas; la araucaria o pino de Norfolk se planta como ornamental.', en: 'No native species; the Norfolk Island pine is planted as an ornamental.' } },
    { id: 'ephedraceae', name: 'Ephedraceae', order: 'Ephedrales', lin: 'gnetales', es: 'efedráceas', en: 'ephedra family',
      chars: { es: ['Arbustos de tallos verdes articulados, con hojas diminutas.', 'Estróbilos compuestos de pares de brácteas; los masculinos tienen unidades con una envoltura y un anteróforo con sinangios.', 'Cada óvulo queda en una envoltura y su integumento forma un tubo micropilar que sobresale.', 'Hay una segunda fecundación (también en Gnetum), pero forma otro embrión, no un endospermo; tienen vasos en el xilema.'],
        en: ['Shrubs with green, jointed stems and minute leaves.', 'Compound strobili of pairs of bracts; the male ones bear units with an envelope and an antherophore with synangia.', 'Each ovule sits in an envelope and its integument forms a protruding micropylar tube.', 'A second fertilisation occurs (also in Gnetum) but forms another embryo, not endosperm; the xylem has vessels.'] },
      mx: { es: 'Unas ocho especies de Ephedra en zonas áridas; se les llama popotillo o canutillo.', en: 'About eight species of Ephedra in arid regions, called popotillo or canutillo.' } },
  ];

  /* ---------------- the strobili ---------------- */
  const STROBILI = [
    /* Cycas: male cone and a loose crown of megasporophylls */
    { id: 'cycas-m', ex: 'cycas', sex: 'm', kind: 'cone', struct: 'simple', unit: 'cmisp', phyl: 'spiral', n: 90, cnt: ['cientos', 'hundreds'], shape: 'cyl', L: 100, D: 30, spor: 12, tip: 'spine',
      size: { len: [30, 60], wid: [8, 15] }, pollen: 'plain', poll: 'insects', colors: { misp: '#c7a060' } },
    { id: 'cycas-f', ex: 'cycas', sex: 'f', kind: 'crown', struct: 'loose', n: 16, cnt: ['decenas', 'dozens'], ov: [4, 6], fleshy: 'sarc',
      size: { len: [14, 22] }, mature: { m: 5 }, poll: 'insects', fate: 'sheds', colors: { mgsp: '#c89a58', sarc: '#e0742a' } },
    /* Zamiaceae */
    { id: 'dioon-m', ex: 'dioon', sex: 'm', kind: 'cone', struct: 'simple', unit: 'cmisp', phyl: 'spiral', n: 90, cnt: ['cientos', 'hundreds'], shape: 'cyl', L: 100, D: 26, spor: 10,
      size: { len: [20, 40], wid: [6, 10] }, pollen: 'plain', poll: 'beetles', colors: { misp: '#d8cbb0' } },
    { id: 'dioon-f', ex: 'dioon', sex: 'f', kind: 'cone', struct: 'simple', unit: 'dioon', phyl: 'spiral', n: 55, cnt: ['50–150', '50–150'], shape: 'ovoid', L: 100, D: 72, ov: 2, fleshy: 'sarc',
      size: { len: [20, 30], wid: [15, 20] }, mature: { m: 12 }, poll: 'beetles', fate: 'disint', colors: { mgsp: '#d9ccb0', sarc: '#efe2bd' } },
    { id: 'cerato-m', ex: 'cerato', sex: 'm', kind: 'cone', struct: 'simple', unit: 'pelt', phyl: 'rows', rows: 9, n: 90, cnt: ['cientos', 'hundreds'], shape: 'cyl', L: 100, D: 24, spor: 10, horns: true,
      size: { len: [15, 30], wid: [4, 6] }, pollen: 'plain', poll: 'beetles', colors: { misp: '#9a8a5c' } },
    { id: 'cerato-f', ex: 'cerato', sex: 'f', kind: 'cone', struct: 'simple', unit: 'pelt', phyl: 'rows', rows: 8, n: 72, cnt: ['60–120', '60–120'], shape: 'cyl', L: 100, D: 44, ov: 2, horns: true, fleshy: 'sarc',
      size: { len: [23, 40], wid: [8, 15] }, mature: { m: 12 }, poll: 'beetles', fate: 'disint', colors: { mgsp: '#7e8656', sarc: '#e8dcb5' } },
    { id: 'zamia-m', ex: 'zamia', sex: 'm', kind: 'cone', struct: 'simple', unit: 'pelt', phyl: 'rows', rows: 8, n: 80, cnt: ['cientos', 'hundreds'], shape: 'cyl', L: 100, D: 26, spor: 10, facet: 'hex',
      size: { len: [8, 15], wid: [2, 3] }, pollen: 'plain', poll: 'beetles', colors: { misp: '#8f6a48' } },
    { id: 'zamia-f', ex: 'zamia', sex: 'f', kind: 'cone', struct: 'simple', unit: 'pelt', phyl: 'rows', rows: 8, n: 64, cnt: ['40–100', '40–100'], shape: 'ovoid', L: 100, D: 52, ov: 2, facet: 'hex', fleshy: 'sarc',
      size: { len: [10, 20], wid: [6, 8] }, mature: { m: 10 }, poll: 'beetles', fate: 'disint', colors: { mgsp: '#8f6a48', sarc: '#d9442e' } },
    /* Ginkgo */
    { id: 'ginkgo-m', ex: 'ginkgo', sex: 'm', kind: 'ginkgo', struct: 'simple', n: 34, cnt: ['numerosos', 'many'], spor: 2,
      size: { len: [1.2, 2.2] }, pollen: 'plain', poll: 'wind' },
    { id: 'ginkgo-f', ex: 'ginkgo', sex: 'f', kind: 'ginkgo', struct: 'stalk', ov: 2, fleshy: 'sarc',
      size: { len: [3, 5] }, mature: { m: 5 }, poll: 'wind', fate: 'sheds', colors: { sarc: '#e3c14a' } },
    /* Pinaceae */
    { id: 'pinus-m', ex: 'pinus', sex: 'm', kind: 'cone', struct: 'simple', unit: 'misp', phyl: 'spiral', n: 64, cnt: ['40–80', '40–80'], shape: 'cyl', L: 100, D: 36, spor: 2,
      size: { len: [2, 3.5], wid: [0.5, 0.7] }, pollen: 'sacs', poll: 'wind', colors: { misp: '#c9a24e' } },
    { id: 'pinus-f', ex: 'pinus', sex: 'f', kind: 'cone', struct: 'compound', unit: 'bs', phyl: 'spiral', n: 96, cnt: ['140–190', '140–190'], shape: 'ovoid', L: 100, D: 62, ov: 2, bract: 'small', apo: true, umbo: 'dorsal', wing: true,
      size: { len: [8, 15], wid: [5, 8] }, mature: { y: 2 }, poll: 'wind', fate: 'opens', colors: { scale: '#8a5a2e' } },
    { id: 'abies-m', ex: 'abies', sex: 'm', kind: 'cone', struct: 'simple', unit: 'misp', phyl: 'spiral', n: 56, cnt: ['40–80', '40–80'], shape: 'cyl', L: 100, D: 34, spor: 2,
      size: { len: [1, 2], wid: [0.4, 0.6] }, pollen: 'sacs', poll: 'wind', colors: { misp: '#b8544a' } },
    { id: 'abies-f', ex: 'abies', sex: 'f', kind: 'cone', struct: 'compound', unit: 'bs', phyl: 'spiral', n: 90, cnt: ['100–200', '100–200'], shape: 'cyl', L: 100, D: 42, ov: 2, bract: 'exserted', wing: true, drop: 'funnel',
      size: { len: [8, 16], wid: [4, 6] }, mature: { m: 6 }, poll: 'wind', fate: 'disint', erect: true, colors: { scale: '#5f4a78', bract: '#b39a6a' } },
    /* Cupressaceae */
    { id: 'cupressus-m', ex: 'cupressus', sex: 'm', kind: 'cone', struct: 'simple', unit: 'pelt', phyl: 'decussate', n: 16, cnt: ['12–20', '12–20'], shape: 'cyl', L: 100, D: 46, spor: 4,
      size: { len: [0.3, 0.5] }, pollen: 'plain', poll: 'wind', colors: { misp: '#c8a256' } },
    { id: 'cupressus-f', ex: 'cupressus', sex: 'f', kind: 'cone', struct: 'fused', unit: 'pelt', phyl: 'decussate', n: 8, cnt: ['6–10', '6–10'], shape: 'glob', L: 100, D: 100, ov: 10, umbo: 'mucro', wing: 'narrow',
      size: { len: [1, 1.5], wid: [1, 1.5] }, mature: { y: 2 }, poll: 'wind', fate: 'opens', colors: { bscale: '#7a6a5a' } },
    { id: 'taxodium-m', ex: 'taxodium', sex: 'm', kind: 'cone', struct: 'simple', unit: 'pelt', phyl: 'spiral', n: 18, cnt: ['10–20', '10–20'], shape: 'glob', L: 100, D: 80, spor: 5,
      size: { len: [0.2, 0.3] }, pollen: 'plain', poll: 'wind', colors: { misp: '#b69a58' } },
    { id: 'taxodium-f', ex: 'taxodium', sex: 'f', kind: 'cone', struct: 'fused', unit: 'pelt', phyl: 'spiral', n: 10, cnt: ['5–10', '5–10'], shape: 'glob', L: 100, D: 92, ov: 2, umbo: 'mucro', wing: false,
      size: { len: [1.5, 2.5], wid: [1.5, 2.5] }, mature: { m: 8 }, poll: 'wind', fate: 'disint', colors: { bscale: '#8a8a52' } },
    { id: 'juniperus-m', ex: 'juniperus', sex: 'm', kind: 'cone', struct: 'simple', unit: 'pelt', phyl: 'decussate', n: 12, cnt: ['6–12', '6–12'], shape: 'cyl', L: 100, D: 50, spor: 4,
      size: { len: [0.3, 0.4] }, pollen: 'plain', poll: 'wind', colors: { misp: '#c0a060' } },
    { id: 'juniperus-f', ex: 'juniperus', sex: 'f', kind: 'cone', struct: 'fused', unit: 'pelt', phyl: 'decussate', n: 6, cnt: ['4–6', '4–6'], shape: 'glob', L: 100, D: 100, ov: 1, fleshy: 'galb',
      size: { len: [0.8, 1.5], wid: [0.8, 1.5] }, mature: { y: 2 }, poll: 'wind', fate: 'fleshy', colors: { bscale: '#8a6f78' } },
    /* Podocarpaceae */
    { id: 'podo-m', ex: 'podo', sex: 'm', kind: 'cone', struct: 'simple', unit: 'misp', phyl: 'spiral', n: 60, cnt: ['numerosos', 'many'], shape: 'cyl', L: 100, D: 22, spor: 2,
      size: { len: [2.8, 6.2], wid: [0.26, 0.37] }, pollen: 'sacs', poll: 'wind', colors: { misp: '#d0b060' } },
    { id: 'podo-f', ex: 'podo', sex: 'f', kind: 'podo', struct: 'podo', ov: 1, fleshy: 'epim',
      size: { len: [1, 1.5] }, mature: { m: 8 }, poll: 'wind', fate: 'fleshy' },
    /* Taxaceae */
    { id: 'taxus-m', ex: 'taxus', sex: 'm', kind: 'cone', struct: 'simple', unit: 'tmisp', phyl: 'spiral', n: 12, cnt: ['6–14', '6–14'], shape: 'glob', L: 100, D: 90, spor: 6,
      size: { len: [0.2, 0.4] }, pollen: 'plain', poll: 'wind', colors: { misp: '#d8c27a' } },
    { id: 'taxus-f', ex: 'taxus', sex: 'f', kind: 'taxus', struct: 'terminal', ov: 1, fleshy: 'aril',
      size: { len: [0.5, 0.7] }, mature: { m: 6 }, poll: 'wind', fate: 'fleshy' },
    /* Araucariaceae */
    { id: 'arau-m', ex: 'arau', sex: 'm', kind: 'cone', struct: 'simple', unit: 'amisp', phyl: 'spiral', n: 70, cnt: ['cientos', 'hundreds'], shape: 'cyl', L: 100, D: 30, spor: 9,
      size: { len: [3, 5], wid: [1, 1.5] }, pollen: 'plain', poll: 'wind', colors: { misp: '#b88a4e' } },
    { id: 'arau-f', ex: 'arau', sex: 'f', kind: 'cone', struct: 'fused', unit: 'arau', phyl: 'spiral', n: 80, cnt: ['cientos', 'hundreds'], shape: 'glob', L: 100, D: 108, ov: 1, wing: true, drop: 'scale',
      size: { len: [10, 15], wid: [12, 15] }, mature: { m: 18 }, poll: 'wind', fate: 'disint', colors: { bscale: '#9c8a5a' } },
    /* Ephedra */
    { id: 'ephedra-m', ex: 'ephedra', sex: 'm', kind: 'ephedra', struct: 'ephedra', n: 5, cnt: ['4–8 pares de brácteas', '4–8 pairs of bracts'], spor: 5, sporTxt: '2–8',
      size: { len: [0.4, 0.8] }, pollen: 'plain', poll: 'wind' },
    { id: 'ephedra-f', ex: 'ephedra', sex: 'f', kind: 'ephedra', struct: 'ephedra', n: 4, cnt: ['3–5 pares de brácteas', '3–5 pairs of bracts'], ov: 2, fleshy: 'bracts',
      size: { len: [0.4, 0.8] }, mature: { m: 3 }, poll: 'wind', fate: 'fleshy' },
  ];

  /* ---------------- one example per kind of strobilus ---------------- */
  const EXAMPLES = [
    { id: 'cycas', sci: 'Cycas revoluta', grp: 'cycadaceae', es: 'cícada, palma de sagú', en: 'sago palm', sys: 'dio', st: 'cult',
      note: { es: 'Del sur de Japón. Los megasporofilos no forman un cono: rodean el ápice del tallo, que luego vuelve a producir hojas.', en: 'From southern Japan. The megasporophylls do not form a cone: they surround the stem apex, which later produces leaves again.' } },
    { id: 'dioon', sci: 'Dioon edule', grp: 'zamiaceae', es: 'chamal, palma de la virgen', en: 'chestnut dioon', sys: 'dio', st: 'end',
      note: { es: 'Endémica del oriente de México. Sus semillas se han comido molidas como harina, tras quitarles la toxina.', en: 'Endemic to eastern Mexico. Its seeds have been eaten ground into flour once the toxin is removed.' } },
    { id: 'cerato', sci: 'Ceratozamia mexicana', grp: 'zamiaceae', es: 'ceratozamia', en: 'Mexican horncone', sys: 'dio', st: 'end',
      note: { es: 'Endémica de Veracruz. Cada esporofilo lleva dos cuernos, de ahí el nombre del género (keras, cuerno).', en: 'Endemic to Veracruz. Each sporophyll bears two horns, hence the name of the genus (keras, horn).' } },
    { id: 'zamia', sci: 'Zamia furfuracea', grp: 'zamiaceae', es: 'palmita, cícada de cartón', en: 'cardboard palm', sys: 'dio', st: 'end',
      note: { es: 'Endémica de las dunas de Veracruz; muy cultivada como ornamental. Esporofilos peltados, en hileras verticales.', en: 'Endemic to the coastal dunes of Veracruz; widely grown as an ornamental. Peltate sporophylls in vertical rows.' } },
    { id: 'ginkgo', sci: 'Ginkgo biloba', grp: 'ginkgoaceae', es: 'ginkgo', en: 'maidenhair tree', sys: 'dio', st: 'cult',
      note: { es: 'Única especie viva de un linaje de más de 200 millones de años. Se plantan sobre todo árboles masculinos, porque las semillas huelen mal.', en: 'The only living species of a lineage over 200 million years old. Mostly male trees are planted, because the seeds smell bad.' } },
    { id: 'pinus', sci: 'Pinus pseudostrobus', grp: 'pinaceae', es: 'pino liso', en: 'smooth-bark Mexican pine', sys: 'mono', st: 'nat',
      note: { es: 'Del Eje Neovolcánico y las sierras del sur; su madera es de las más aprovechadas.', en: 'From the Trans-Mexican Volcanic Belt and the southern ranges; one of the most used timber pines.' } },
    { id: 'abies', sci: 'Abies religiosa', grp: 'pinaceae', es: 'oyamel', en: 'sacred fir', sys: 'mono', st: 'nat',
      note: { es: 'Bosques de alta montaña; en ellos pasa el invierno la mariposa monarca. Los conos quedan erguidos y se deshacen en la rama.', en: 'High-mountain forests, where the monarch butterfly overwinters. The cones stand upright and fall apart on the branch.' } },
    { id: 'cupressus', sci: 'Hesperocyparis lusitanica', grp: 'cupressaceae', es: 'cedro blanco', en: 'Mexican cypress', sys: 'mono', st: 'nat',
      note: { es: 'Antes Cupressus lusitanica. Conos globosos con escamas peltadas opuestas, cada una con muchos óvulos.', en: 'Formerly Cupressus lusitanica. Globose cones with opposite peltate scales, each with many ovules.' } },
    { id: 'taxodium', sci: 'Taxodium mucronatum', grp: 'cupressaceae', es: 'ahuehuete, sabino', en: 'Montezuma cypress', sys: 'mono', st: 'nat',
      note: { es: 'Árbol nacional de México, a la orilla de ríos; el Árbol del Tule, en Oaxaca, es uno de ellos. Los conos de polen cuelgan en racimos largos.', en: 'The national tree of Mexico, along rivers; the Tule tree in Oaxaca is one. The pollen cones hang in long clusters.' } },
    { id: 'juniperus', sci: 'Juniperus deppeana', grp: 'cupressaceae', es: 'táscate', en: 'alligator juniper', sys: 'dio', st: 'nat',
      note: { es: 'Corteza en cuadros, como piel de lagarto. Las escamas del cono femenino se sueldan y se vuelven carnosas (gálbulo).', en: 'Bark in squares, like alligator skin. The scales of the female cone fuse and turn fleshy (a galbulus).' } },
    { id: 'podo', sci: 'Podocarpus matudae', grp: 'podocarpaceae', es: 'podocarpo', en: 'Matuda podocarp', sys: 'dio', st: 'nat',
      note: { es: 'Bosque mesófilo del oriente y el sur de México. La semilla, envuelta en el epimacio, se asienta sobre un receptáculo carnoso.', en: 'Cloud forests of eastern and southern Mexico. The seed, wrapped in the epimatium, sits on a fleshy receptacle.' } },
    { id: 'taxus', sci: 'Taxus globosa', grp: 'taxaceae', es: 'tejo mexicano', en: 'Mexican yew', sys: 'dio', st: 'nat',
      note: { es: 'Un solo óvulo en la punta de un brote corto; la semilla queda en un arilo rojo. Todo, salvo el arilo, es tóxico.', en: 'A single ovule at the tip of a short shoot; the seed sits in a red aril. Everything but the aril is poisonous.' } },
    { id: 'arau', sci: 'Araucaria heterophylla', grp: 'araucariaceae', es: 'araucaria, pino de Norfolk', en: 'Norfolk Island pine', sys: 'mono', st: 'cult',
      note: { es: 'De la isla Norfolk, en el Pacífico. Conos casi esféricos que se deshacen al madurar; una semilla por escama.', en: 'From Norfolk Island in the Pacific. Nearly spherical cones that fall apart when ripe; one seed per scale.' } },
    { id: 'ephedra', sci: 'Ephedra compacta', grp: 'ephedraceae', es: 'popotillo, canutillo', en: 'Mexican joint-fir', sys: 'dio', st: 'end',
      note: { es: 'Arbusto de zonas áridas, del norte de México hasta Puebla y Oaxaca; la única Ephedra endémica del país. Los óvulos sacan un tubo micropilar que atrapa el polen con una gota.', en: 'A shrub of arid regions, from northern Mexico south to Puebla and Oaxaca; the only Ephedra endemic to the country. The ovules push out a micropylar tube that catches pollen with a drop.' } },
  ];

  /* ---------------- species (Mexico first; st = codes of Block 4; nom = NOM-059) ---------------- */
  const SPECIES = [
    { sci: 'Pinus pseudostrobus', grp: 'pinaceae', ex: 'pinus', es: 'pino liso', en: 'smooth-bark Mexican pine', st: 'nat',
      note: { es: 'Árbol de 20–40 m, acículas en fascículos de cinco, largas y colgantes. Conos ovoides de 8–15 cm.', en: 'A 20–40 m tree, needles in bundles of five, long and drooping. Ovoid cones 8–15 cm long.' } },
    { sci: 'Pinus montezumae', grp: 'pinaceae', ex: 'pinus', es: 'ocote, pino de Moctezuma', en: 'Montezuma pine', st: 'nat',
      note: { es: 'Del centro y sur de México y Guatemala. Acículas de cinco, gruesas; conos de 10–20 cm.', en: 'From central and southern Mexico and Guatemala. Needles in fives, stout; cones 10–20 cm.' } },
    { sci: 'Pinus hartwegii', grp: 'pinaceae', ex: 'pinus', es: 'pino de las alturas', en: 'Hartweg pine', st: 'nat',
      note: { es: 'Forma el límite superior del bosque en los volcanes, hasta unos 4300 m. Conos oscuros, casi negros.', en: 'Forms the upper treeline on the volcanoes, up to about 4,300 m. Dark, almost black cones.' }, f: { size: { len: [8, 12], wid: [4, 6] }, colors: { scale: '#4a3a34' } } },
    { sci: 'Pinus cembroides', grp: 'pinaceae', ex: 'pinus', es: 'pino piñonero', en: 'Mexican pinyon', st: 'nat',
      note: { es: 'Árbol pequeño de zonas semiáridas. Conos globosos de 3–5 cm con pocas escamas y semillas grandes sin ala: los piñones.', en: 'A small tree of semi-arid regions. Globose cones 3–5 cm with few scales and large wingless seeds: pine nuts.' },
      f: { n: 34, cnt: ['20–40', '20–40'], shape: 'glob', D: 96, wing: false, size: { len: [3, 5], wid: [3, 5] }, colors: { scale: '#9a6a3a' } } },
    { sci: 'Pinus ayacahuite', grp: 'pinaceae', ex: 'pinus', es: 'ayacahuite', en: 'Mexican white pine', st: 'nat',
      note: { es: 'Pino blanco de montaña. Conos cilíndricos y colgantes de 15–45 cm, con escamas delgadas y el umbo en la punta.', en: 'A mountain white pine. Cylindrical, hanging cones 15–45 cm long, with thin scales and the umbo at the tip.' },
      f: { n: 110, shape: 'cyl', D: 26, umbo: 'terminal', size: { len: [15, 45], wid: [7, 15] }, colors: { scale: '#9a6a3c' } } },
    { sci: 'Pinus patula', grp: 'pinaceae', ex: 'pinus', es: 'pino patula, ocote colorado', en: 'Mexican weeping pine', st: 'end',
      note: { es: 'Acículas de tres (a veces cuatro o cinco), largas y colgantes. Conos asimétricos que permanecen cerrados en el árbol varios años (serótinos). Se planta en muchos países.', en: 'Needles in threes (sometimes four or five), long and drooping. Asymmetric cones that stay closed on the tree for years (serotinous). Planted in many countries.' },
      f: { fate: 'serotinous', size: { len: [5, 10], wid: [3, 5] } } },
    { sci: 'Pinus maximartinezii', grp: 'pinaceae', ex: 'pinus', es: 'pino azul', en: 'Martínez pinyon', st: 'end', nom: 'P',
      note: { es: 'Solo en dos localidades: la Sierra de Morones (Zacatecas) y el sur de Durango. Conos enormes y pesados, con los piñones más grandes de todos los pinos.', en: 'Only two localities: the Sierra de Morones (Zacatecas) and southern Durango. Huge, heavy cones with the largest seeds of any pine.' },
      f: { n: 60, shape: 'ovoid', D: 70, wing: false, size: { len: [15, 27], wid: [10, 15] } } },
    { sci: 'Abies religiosa', grp: 'pinaceae', ex: 'abies', es: 'oyamel', en: 'sacred fir', st: 'nat',
      note: { es: 'Bosques húmedos de alta montaña del centro de México; refugio invernal de la mariposa monarca. Sus ramas adornan los templos.', en: 'Moist high-mountain forests of central Mexico; the winter refuge of the monarch butterfly. Its branches decorate churches.' } },
    { sci: 'Pseudotsuga menziesii', grp: 'pinaceae', ex: 'abies', es: 'pinabete', en: 'Douglas fir', st: 'nat', nom: 'Pr',
      note: { es: 'Poblaciones aisladas en las sierras del norte, centro y sur (hasta Oaxaca); en México se reconoce la var. glauca, que es la que protege la NOM-059. Conos colgantes con brácteas trífidas que salen entre las escamas y no se deshacen.', en: 'Isolated stands in the northern, central and southern ranges (south to Oaxaca); in Mexico it is var. glauca, the one protected by NOM-059. Hanging cones with three-pointed bracts sticking out between the scales; they do not fall apart.' },
      m: { pollen: 'plain' },
      f: { erect: false, fate: 'opens', drop: 'none', n: 70, size: { len: [4, 8], wid: [2.5, 3.5] }, colors: { scale: '#8a6a44' } } },
    { sci: 'Picea chihuahuana', grp: 'pinaceae', ex: 'abies', es: 'pinabete espinoso', en: 'Chihuahua spruce', st: 'end', nom: 'P',
      note: { es: 'Relicto glacial en cañadas de la Sierra Madre Occidental; muy escaso. Conos colgantes con brácteas ocultas.', en: 'A glacial relict in canyons of the Sierra Madre Occidental; very rare. Hanging cones with hidden bracts.' },
      f: { erect: false, fate: 'opens', bract: 'small', drop: null, n: 80, size: { len: [7, 12], wid: [3, 4] }, colors: { scale: '#9a7040' } } },
    { sci: 'Taxodium mucronatum', grp: 'cupressaceae', ex: 'taxodium', es: 'ahuehuete, sabino', en: 'Montezuma cypress', st: 'nat',
      note: { es: 'Árbol nacional. Vive junto al agua y llega a ser enorme: el Árbol del Tule mide 42 m de perímetro (unos 14 m de diámetro contando sus contrafuertes).', en: 'The national tree. It grows by water and can become huge: the Tule tree is 42 m around (about 14 m across including its buttresses).' } },
    { sci: 'Hesperocyparis lusitanica', grp: 'cupressaceae', ex: 'cupressus', es: 'cedro blanco', en: 'Mexican cypress', st: 'nat', nom: 'Pr',
      note: { es: 'Bosques de montaña; muy plantado en parques y como cortina rompevientos.', en: 'Mountain forests; widely planted in parks and as windbreaks.' } },
    { sci: 'Juniperus deppeana', grp: 'cupressaceae', ex: 'juniperus', es: 'táscate', en: 'alligator juniper', st: 'nat',
      note: { es: 'Bosques secos de pino y encino del norte y centro. Gálbulos rojizos con bloom blanquecino, maduran en dos años.', en: 'Dry pine–oak forests of the north and centre. Reddish galbuli with a whitish bloom, ripening in two years.' } },
    { sci: 'Juniperus flaccida', grp: 'cupressaceae', ex: 'juniperus', es: 'enebro, cedro llorón', en: 'weeping juniper', st: 'nat',
      note: { es: 'Ramillas colgantes. Gálbulos grandes, pardo rojizos, con varias semillas.', en: 'Drooping branchlets. Large reddish-brown galbuli with several seeds.' } },
    { sci: 'Podocarpus matudae', grp: 'podocarpaceae', ex: 'podo', es: 'podocarpo', en: 'Matuda podocarp', st: 'nat', nom: 'Pr',
      note: { es: 'Árbol del bosque mesófilo, de hojas planas y lanceoladas. Semilla verde que se torna violeta, sobre un receptáculo que madura morado.', en: 'A cloud-forest tree with flat, lanceolate leaves. A green seed turning violet, on a receptacle that ripens purple.' } },
    { sci: 'Taxus globosa', grp: 'taxaceae', ex: 'taxus', es: 'tejo mexicano, romerillo', en: 'Mexican yew', st: 'nat', nom: 'Pr',
      note: { es: 'Pequeño árbol de cañadas húmedas de la Sierra Madre Oriental y el sur. Contiene taxanos; amenazado por la tala.', en: 'A small tree of moist ravines in the Sierra Madre Oriental and the south. It contains taxanes; threatened by logging.' } },
    { sci: 'Dioon edule', grp: 'zamiaceae', ex: 'dioon', es: 'chamal, palma de la virgen', en: 'chestnut dioon', st: 'end', nom: 'P',
      note: { es: 'Matorrales y selvas bajas del noreste y oriente. Sus hojas se usan en adornos religiosos; crece muy despacio.', en: 'Scrub and dry forests of the north-east and east. Its leaves are used in religious decorations; it grows very slowly.' } },
    { sci: 'Dioon spinulosum', grp: 'zamiaceae', ex: 'dioon', es: 'chicalite, palma de Dolores', en: 'giant dioon', st: 'end', nom: 'P',
      note: { es: 'Una de las cícadas más altas del mundo: suele medir 3–6 m y llega a 16 m; selvas de Oaxaca y Veracruz. Conos femeninos enormes (50–80 cm, hasta 15 kg) y colgantes.', en: 'One of the tallest cycads in the world: usually 3–6 m, up to 16 m; forests of Oaxaca and Veracruz. Huge hanging female cones (50–80 cm, up to 15 kg).' },
      f: { size: { len: [50, 80], wid: [20, 30] } } },
    { sci: 'Ceratozamia mexicana', grp: 'zamiaceae', ex: 'cerato', es: 'ceratozamia', en: 'Mexican horncone', st: 'end', nom: 'A',
      note: { es: 'Bosque mesófilo y selvas de Veracruz. Conos erguidos con esporofilos de dos cuernos.', en: 'Cloud forests and rain forests of Veracruz. Upright cones with two-horned sporophylls.' } },
    { sci: 'Zamia furfuracea', grp: 'zamiaceae', ex: 'zamia', es: 'palmita, palma bola, cícada de cartón', en: 'cardboard palm', st: 'end', nom: 'P',
      note: { es: 'Dunas costeras del centro y sur de Veracruz. Hojas rígidas y escamosas; semillas rojas.', en: 'Coastal dunes of central and southern Veracruz. Stiff, scurfy leaves; red seeds.' } },
    { sci: 'Ephedra compacta', grp: 'ephedraceae', ex: 'ephedra', es: 'popotillo, canutillo', en: 'Mexican joint-fir', st: 'end',
      note: { es: 'Matorral xerófilo, pastizal y bosque de encino y pino, de Chihuahua y Coahuila a Puebla y Oaxaca (1600–2800 m). Tallos verdes articulados que hacen la fotosíntesis.', en: 'Desert scrub, grassland and oak–pine forest, from Chihuahua and Coahuila to Puebla and Oaxaca (1,600–2,800 m). Green jointed stems that carry out photosynthesis.' } },
    { sci: 'Cycas revoluta', grp: 'cycadaceae', ex: 'cycas', es: 'cícada, palma de sagú', en: 'sago palm', st: 'cult',
      note: { es: 'Del sur de Japón; una de las plantas de ornato más comunes en jardines de México.', en: 'From southern Japan; one of the most common garden ornamentals in Mexico.' } },
    { sci: 'Ginkgo biloba', grp: 'ginkgoaceae', ex: 'ginkgo', es: 'ginkgo', en: 'maidenhair tree', st: 'cult',
      note: { es: 'De China. Hojas en abanico que se vuelven amarillas en otoño; resistente a la contaminación urbana.', en: 'From China. Fan-shaped leaves that turn yellow in autumn; tolerant of urban pollution.' } },
    { sci: 'Araucaria heterophylla', grp: 'araucariaceae', ex: 'arau', es: 'araucaria, pino de Norfolk', en: 'Norfolk Island pine', st: 'cult',
      note: { es: 'De la isla Norfolk. Ramas en pisos regulares; se vende como árbol de Navidad en maceta.', en: 'From Norfolk Island. Branches in regular tiers; sold as a potted Christmas tree.' } },
  ];

  /* ---------------- flower versus strobilus ---------------- */
  const CONTRAST = [
    { k: ['Estructura reproductora', 'Reproductive structure'],
      a: ['Flor: brote corto con perianto, estambres y carpelos; por lo general bisexual.', 'Flower: a short shoot with perianth, stamens and carpels; usually bisexual.'],
      g: ['Estróbilo (cono) o esporofilos sueltos; unisexual y sin perianto (las envolturas de Gnetales son la excepción).', 'Strobilus (cone) or loose sporophylls; unisexual and without a perianth (the envelopes of Gnetales are the exception).'], org: 'axis' },
    { k: ['Óvulos', 'Ovules'],
      a: ['Encerrados en el ovario, formado por los carpelos.', 'Enclosed in the ovary, made of the carpels.'],
      g: ['Desnudos: expuestos sobre una escama, un esporofilo o un pedúnculo. «Gimnosperma» quiere decir semilla desnuda.', 'Naked: exposed on a scale, a sporophyll or a peduncle. "Gymnosperm" means naked seed.'], org: 'ov' },
    { k: ['Adónde llega el polen', 'Where pollen lands'],
      a: ['Al estigma, lejos del óvulo; el tubo polínico crece por el estilo.', 'On the stigma, away from the ovule; the pollen tube grows down the style.'],
      g: ['Casi siempre directamente al micrópilo del óvulo, atrapado por la gota de polinización.', 'Nearly always straight at the micropyle of the ovule, caught by the pollination drop.'], org: 'ov' },
    { k: ['Gametos masculinos', 'Male gametes'],
      a: ['Dos células espermáticas sin flagelos, llevadas por el tubo polínico.', 'Two sperm cells without flagella, carried by the pollen tube.'],
      g: ['En cícadas y Ginkgo, espermatozoides con flagelos; en coníferas y Gnetales, núcleos sin flagelos.', 'In cycads and Ginkgo, flagellate sperm; in conifers and Gnetales, nuclei without flagella.'], org: 'spor' },
    { k: ['Fecundación', 'Fertilisation'],
      a: ['Doble: una célula espermática forma el cigoto y otra, con los dos núcleos polares, el endospermo.', 'Double: one sperm cell forms the zygote and another, with two polar nuclei, the endosperm.'],
      g: ['Simple. En Ephedra y Gnetum hay una segunda fecundación, pero forma otro embrión y no endospermo.', 'Single. Ephedra and Gnetum have a second fertilisation, but it forms another embryo, not endosperm.'], org: 'ov' },
    { k: ['Tejido nutritivo de la semilla', 'Nutritive tissue of the seed'],
      a: ['Endospermo, por lo general triploide (3n), formado después de la fecundación.', 'Endosperm, usually triploid (3n), formed after fertilisation.'],
      g: ['Gametófito femenino haploide (n), formado antes de la fecundación.', 'Haploid female gametophyte (n), formed before fertilisation.'], org: 'seed' },
    { k: ['Fruto', 'Fruit'],
      a: ['El ovario madura en un fruto que encierra las semillas.', 'The ovary ripens into a fruit that encloses the seeds.'],
      g: ['No hay fruto: la semilla queda expuesta. Lo carnoso (arilo, epimacio, sarcotesta, gálbulo) tiene otro origen.', 'No fruit: the seed stays exposed. What is fleshy (aril, epimatium, sarcotesta, galbulus) has another origin.'], org: 'seed' },
    { k: ['De la polinización a la semilla', 'From pollination to seed'],
      a: ['Semanas o meses; la fecundación suele ocurrir horas o días después de la polinización (en los encinos rojos, un año después).', 'Weeks or months; fertilisation usually follows pollination within hours or days (a year later in red oaks).'],
      g: ['Meses o años: en los pinos la fecundación ocurre más de un año después de la polinización y el cono madura en dos años.', 'Months or years: in pines fertilisation takes place over a year after pollination and the cone ripens in two years.'], org: 'scale' },
    { k: ['Polinización', 'Pollination'],
      a: ['Sobre todo por animales (insectos, aves, murciélagos); también por viento.', 'Mostly by animals (insects, birds, bats); also by wind.'],
      g: ['Sobre todo por viento; las cícadas, sobre todo por escarabajos; algunas Gnetales, por insectos.', 'Mostly by wind; cycads mostly by beetles; some Gnetales by insects.'], org: 'spor' },
    { k: ['Xilema', 'Xylem'],
      a: ['Casi siempre con vasos, además de traqueidas (Amborella no los tiene).', 'Nearly always with vessels as well as tracheids (not in Amborella).'],
      g: ['Solo traqueidas; Gnetales es la excepción, con vasos.', 'Tracheids only; Gnetales is the exception, with vessels.'], org: null },
    { k: ['Especies', 'Species'],
      a: ['Unas 300 000.', 'About 300,000.'],
      g: ['Poco más de 1 000; México tiene unas 150, más de la mitad endémicas.', 'Just over 1,000; Mexico has about 150, more than half of them endemic.'], org: null },
  ];
  /* what corresponds to what (the flower of Magnolia against the cones) */
  const HOMOLOGY = [
    { a: ['Estambre', 'Stamen'], g: ['Microsporofilo', 'Microsporophyll'], org: 'misp',
      t: ['Los dos son hojas fértiles que producen polen en sacos: el estambre en su antera, el microsporofilo en la cara de abajo.', 'Both are fertile leaves that produce pollen in sacs: the stamen in its anther, the microsporophyll on its underside.'] },
    { a: ['Saco polínico de la antera', 'Pollen sac of the anther'], g: ['Microsporangio', 'Microsporangium'], org: 'spor',
      t: ['El mismo órgano con otro nombre: donde se forma el polen.', 'The same organ under another name: where pollen is made.'] },
    { a: ['Carpelo', 'Carpel'], g: ['Megasporofilo de las cícadas', 'Cycad megasporophyll'], org: 'mgsp',
      t: ['Comparación clásica (en Cycas; su homología real se discute): una hoja fértil con óvulos, pero abierta; los óvulos quedan en sus márgenes, sin cerrarse en un ovario.', 'A classic comparison (in Cycas; the true homology is debated): a fertile leaf with ovules, but open; the ovules sit on its margins and are never closed into an ovary.'] },
    { a: ['(no tiene equivalente)', '(no counterpart)'], g: ['Escama ovulífera de las coníferas', 'Conifer ovuliferous scale'], org: 'scale',
      t: ['No es una hoja sino una rama cortísima, en la axila de una bráctea, que se aplanó en escama; por eso el cono de semillas se parece más a una inflorescencia que a una flor.', 'Not a leaf but a tiny shoot in the axil of a bract, flattened into a scale; that is why the seed cone is more like an inflorescence than a flower.'] },
    { a: ['Óvulo', 'Ovule'], g: ['Óvulo', 'Ovule'], org: 'ov',
      t: ['El mismo órgano; en las angiospermas suele tener dos integumentos y en las gimnospermas uno.', 'The same organ; angiosperms usually have two integuments, gymnosperms one.'] },
    { a: ['Fruto', 'Fruit'], g: ['(no hay fruto)', '(no fruit)'], org: 'seed',
      t: ['Sin ovario no hay fruto; el arilo, la sarcotesta, el receptáculo de Podocarpus o el gálbulo, carnosos, imitan su función de atraer aves.', 'Without an ovary there is no fruit; the fleshy aril, sarcotesta, Podocarpus receptacle or galbulus take over its job of attracting birds.'] },
  ];

  /* statements for the «flower or strobilus?» challenge of Block 6 */
  const TRAITS = [
    { es: 'Los óvulos quedan encerrados en un ovario.', en: 'The ovules are enclosed in an ovary.', who: 'ang' },
    { es: 'Los óvulos quedan expuestos sobre una escama o un esporofilo.', en: 'The ovules are exposed on a scale or a sporophyll.', who: 'gym' },
    { es: 'El polen germina sobre un estigma.', en: 'Pollen germinates on a stigma.', who: 'ang' },
    { es: 'El polen suele llegar directo al micrópilo, atrapado por una gota.', en: 'Pollen usually reaches the micropyle directly, caught by a drop.', who: 'gym' },
    { es: 'La semilla se nutre de un endospermo triploide.', en: 'The seed is fed by a triploid endosperm.', who: 'ang' },
    { es: 'La semilla se nutre del gametófito femenino haploide.', en: 'The seed is fed by the haploid female gametophyte.', who: 'gym' },
    { es: 'Hay doble fecundación que forma el endospermo.', en: 'Double fertilisation forms the endosperm.', who: 'ang' },
    { es: 'Las semillas maduran dentro de un fruto.', en: 'The seeds ripen inside a fruit.', who: 'ang' },
    { es: 'No forman frutos; lo carnoso es un arilo, la cubierta de la semilla, escamas o brácteas.', en: 'They form no fruits; what is fleshy is an aril, the seed coat, scales or bracts.', who: 'gym' },
    { es: 'Tienen perianto: sépalos y pétalos, o tépalos.', en: 'They have a perianth: sepals and petals, or tepals.', who: 'ang' },
    { es: 'Algunas tienen espermatozoides con flagelos.', en: 'Some have flagellate sperm.', who: 'gym' },
    { es: 'En los pinos, la fecundación ocurre más de un año después de la polinización.', en: 'In pines, fertilisation takes place over a year after pollination.', who: 'gym' },
    { es: 'Producen semillas.', en: 'They produce seeds.', who: 'both' },
    { es: 'Sus óvulos tienen integumento y micrópilo.', en: 'Their ovules have an integument and a micropyle.', who: 'both' },
    { es: 'El polen forma un tubo polínico.', en: 'Pollen forms a pollen tube.', who: 'both' },
    { es: 'Tienen plantas monoicas y plantas dioicas.', en: 'They include monoecious and dioecious plants.', who: 'both' },
    { es: 'Tienen estambres con antera y filamento.', en: 'They have stamens with an anther and a filament.', who: 'ang' },
    { es: 'Tienen microsporofilos agrupados en conos de polen.', en: 'They have microsporophylls grouped in pollen cones.', who: 'gym' },
  ];

  /* ---------------- glossary (joins the glossary of the atlas) ---------------- */
  const GLOSS = {
    gymnosperm: [['Gimnosperma', 'Planta con semillas cuyos óvulos quedan desnudos, sin ovario: cícadas, Ginkgo, coníferas y Gnetales.'], ['Gymnosperm', 'A seed plant whose ovules are naked, without an ovary: cycads, Ginkgo, conifers and Gnetales.']],
    strobilus: [['Estróbilo (cono)', 'Eje corto con esporofilos o escamas fértiles apretados; en las gimnospermas es masculino (de polen) o femenino (de semillas).'], ['Strobilus (cone)', 'A short axis with crowded sporophylls or fertile scales; in gymnosperms it is male (pollen) or female (seed).']],
    sporophyll: [['Esporofilo', 'Hoja fértil que lleva esporangios: microsporofilo si produce polen, megasporofilo si lleva óvulos.'], ['Sporophyll', 'A fertile leaf that bears sporangia: a microsporophyll if it makes pollen, a megasporophyll if it bears ovules.']],
    microsporophyll: [['Microsporofilo', 'Hoja fértil del cono de polen; lleva los microsporangios (sacos polínicos) en su cara de abajo.'], ['Microsporophyll', 'A fertile leaf of the pollen cone; it bears the microsporangia (pollen sacs) on its underside.']],
    microsporangium: [['Microsporangio', 'Saco donde se forma el polen; equivale al saco polínico de la antera.'], ['Microsporangium', 'The sac where pollen is made; the counterpart of the pollen sac of the anther.']],
    megasporophyll: [['Megasporofilo', 'Hoja fértil que lleva óvulos en sus márgenes o en su cara interna; en las cícadas.'], ['Megasporophyll', 'A fertile leaf bearing ovules on its margins or inner face; in cycads.']],
    'ovuliferous-scale': [['Escama ovulífera', 'Escama del cono de semillas de las coníferas que lleva los óvulos; nace en la axila de una bráctea y es una rama muy reducida.'], ['Ovuliferous scale', 'The scale of the conifer seed cone that bears the ovules; it arises in the axil of a bract and is a very reduced shoot.']],
    'bract-scale': [['Complejo bráctea–escama', 'Unidad del cono de semillas de las coníferas: una bráctea y, en su axila, la escama ovulífera; en las cupresáceas y araucarias están unidas.'], ['Bract–scale complex', 'The unit of the conifer seed cone: a bract with the ovuliferous scale in its axil; fused in cypresses and araucarias.']],
    'compound-strobilus': [['Estróbilo compuesto', 'Cono cuyas piezas fértiles son ramas cortas en la axila de brácteas, como el cono de semillas de las coníferas.'], ['Compound strobilus', 'A cone whose fertile units are short shoots in the axils of bracts, like the conifer seed cone.']],
    'simple-strobilus': [['Estróbilo simple', 'Cono formado por un eje con esporofilos, como el cono de polen de las coníferas y los conos de las cícadas.'], ['Simple strobilus', 'A cone made of an axis with sporophylls, like the conifer pollen cone and cycad cones.']],
    apophysis: [['Apófisis', 'Parte expuesta y engrosada de la escama del cono cerrado del pino.'], ['Apophysis', 'The exposed, thickened part of the scale of a closed pine cone.']],
    umbo: [['Umbo', 'Protuberancia de la apófisis; en la punta (terminal) o en el centro (dorsal).'], ['Umbo', 'The boss on the apophysis; at the tip (terminal) or in the middle (dorsal).']],
    'pollination-drop': [['Gota de polinización', 'Gota que sale del micrópilo del óvulo, atrapa el polen y, al reabsorberse, lo lleva adentro.'], ['Pollination drop', 'A droplet from the micropyle of the ovule that catches pollen and, when withdrawn, draws it in.']],
    micropyle: [['Micrópilo', 'Abertura del integumento del óvulo, por donde entra el polen o el tubo polínico.'], ['Micropyle', 'The opening in the integument of the ovule through which pollen or the pollen tube enters.']],
    integument: [['Integumento', 'Cubierta del óvulo que se convierte en la testa de la semilla.'], ['Integument', 'The coat of the ovule that becomes the seed coat.']],
    'female-gametophyte': [['Gametófito femenino', 'Tejido haploide dentro del óvulo; en las gimnospermas es el alimento de la semilla.'], ['Female gametophyte', 'The haploid tissue inside the ovule; in gymnosperms it feeds the seed.']],
    sarcotesta: [['Sarcotesta', 'Capa externa carnosa de la cubierta de la semilla, en cícadas y Ginkgo.'], ['Sarcotesta', 'The fleshy outer layer of the seed coat, in cycads and Ginkgo.']],
    aril: [['Arilo', 'Crecimiento carnoso que rodea la semilla sin ser parte de su cubierta, como en Taxus.'], ['Aril', 'A fleshy outgrowth around the seed that is not part of its coat, as in Taxus.']],
    epimatium: [['Epimacio', 'Escama ovulífera de Podocarpus, que envuelve al óvulo invertido.'], ['Epimatium', 'The ovuliferous scale of Podocarpus, wrapping the inverted ovule.']],
    'podo-receptacle': [['Receptáculo carnoso', 'Base del cono femenino de Podocarpus, de brácteas unidas, que se vuelve carnosa y de color.'], ['Fleshy receptacle', 'The base of the female cone of Podocarpus, of united bracts, which turns fleshy and coloured.']],
    galbulus: [['Gálbulo', 'Cono carnoso de Juniperus, con las escamas soldadas; parece una baya pero no es un fruto.'], ['Galbulus', 'The fleshy cone of Juniperus, with fused scales; it looks like a berry but is not a fruit.']],
    collar: [['Collar', 'Reborde en la base de cada óvulo de Ginkgo.'], ['Collar', 'The rim at the base of each Ginkgo ovule.']],
    envelope: [['Envoltura', 'En Gnetales, par de bractéolas unidas que rodea al óvulo o a la unidad masculina.'], ['Envelope', 'In Gnetales, a pair of united bracteoles around the ovule or the male unit.']],
    'micropylar-tube': [['Tubo micropilar', 'Prolongación del integumento de los óvulos de Gnetales, que asoma y secreta la gota de polinización.'], ['Micropylar tube', 'The extension of the integument of Gnetales ovules, which sticks out and secretes the pollination drop.']],
    antherophore: [['Anteróforo (microsporangióforo)', 'En Ephedra, el pie de la unidad masculina que lleva los sinangios en la punta.'], ['Antherophore (microsporangiophore)', 'In Ephedra, the stalk of the male unit bearing the synangia at its tip.']],
    synangium: [['Sinangio', 'Grupo de esporangios unidos entre sí.'], ['Synangium', 'A group of sporangia fused together.']],
    'saccate-pollen': [['Polen con sacos aéreos', 'Grano de polen con dos sacos llenos de aire que lo ayudan a flotar; en pinos y Podocarpus.'], ['Saccate pollen', 'A pollen grain with two air-filled sacs that help it float; in pines and Podocarpus.']],
    'seed-wing': [['Ala de la semilla', 'Lámina delgada que ayuda al viento a llevar la semilla; en las pináceas se desprende de la escama ovulífera, en las cupresáceas sale de la cubierta de la semilla.'], ['Seed wing', 'A thin blade that helps the wind carry the seed; in the pine family it peels off the ovuliferous scale, in the cypress family it grows from the seed coat.']],
    peduncle: [['Pedúnculo', 'Pie que sostiene un cono o un grupo de óvulos.'], ['Peduncle', 'The stalk that carries a cone or a group of ovules.']],
    peltate: [['Peltada', 'Pieza en forma de escudo sostenida por un pie en su centro.'], ['Peltate', 'A shield-shaped member held on a stalk at its centre.']],
    decussate: [['Decusada', 'Piezas en pares opuestos, cada par en cruz con el anterior.'], ['Decussate', 'Members in opposite pairs, each pair at right angles to the one before.']],
    phyllotaxis: [['Filotaxis', 'Disposición de las hojas o de las piezas sobre el eje: espiral, opuesta, decusada o verticilada.'], ['Phyllotaxis', 'The arrangement of leaves or members on the axis: spiral, opposite, decussate or whorled.']],
    serotinous: [['Serótino', 'Cono que permanece cerrado en el árbol años después de madurar y se abre con el calor, por ejemplo tras un incendio.'], ['Serotinous', 'A cone that stays closed on the tree for years after ripening and opens with heat, for example after a fire.']],
    monoecious: [['Monoica', 'Planta con órganos masculinos y femeninos separados en el mismo individuo.'], ['Monoecious', 'A plant with separate male and female organs on the same individual.']],
    dioecious: [['Dioica', 'Especie con individuos masculinos e individuos femeninos.'], ['Dioecious', 'A species with male individuals and female individuals.']],
    seed: [['Semilla', 'Óvulo fecundado y maduro: embrión, tejido nutritivo y cubierta.'], ['Seed', 'A ripe, fertilised ovule: embryo, nutritive tissue and coat.']],
  };

  const byId = id => STROBILI.find(s => s.id === id) || null;
  const exById = id => EXAMPLES.find(e => e.id === id) || null;
  const grpById = id => GROUPS.find(g => g.id === id) || null;
  /* the model of a species: its example, with what differs */
  function speciesModel(sp, sex) {
    const ex = exById(sp.ex);
    const base = byId(ex.id + '-' + sex);
    if (!base) return null;
    const o = sp[sex];
    if (!o) return base;
    const m = Object.assign({}, base, o, { id: base.id + ':' + sp.sci.replace(/\W+/g, '-').toLowerCase() });
    if (o.colors) m.colors = Object.assign({}, base.colors || {}, o.colors);
    return m;
  }

  return { ORG, LINEAGE, GROUPS, STROBILI, EXAMPLES, SPECIES, CONTRAST, HOMOLOGY, TRAITS, GLOSS, byId, exById, grpById, speciesModel };
})();
window.GYMNO = GYMNO;
/* the gymnosperm terms join the glossary of the atlas (Block 3), without replacing any */
if (window.ATLAS) Object.keys(GYMNO.GLOSS).forEach(k => { if (!ATLAS.GLOSS[k] && !ATLAS.PLATES.some(p => p.id === k)) ATLAS.GLOSS[k] = GYMNO.GLOSS[k]; });
