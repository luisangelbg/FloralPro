/* FloralPro — families 23–46: early eudicots, Caryophyllales, Saxifragales, Vitales and fabids. */
FAMILIES_ADD([
  /* ------------------------------------------------------------------ */
  { id: 'papaveraceae', name: 'Papaveraceae', es: 'papaveráceas', en: 'poppy family', order: 'Ranunculales',
    typical: { sym: 'actino', K: { w: [2] }, C: { w: [2, 2] }, A: { w: [{ n: '∞' }] }, G: { w: [{ n: [2, '∞'], connate: true }], plac: 'parietal', ov: '∞' }, look: { stigma: 'discoid' }, colors: { K: '#8aa04a', C: '#e8412f', A: '#3a2a2a', G: '#9cb86a' } },
    chars: { es: ['Hierbas con látex de color (blanco, amarillo o anaranjado).', 'Dos o tres sépalos que caen al abrir la flor (caducos).', 'Cuatro o seis pétalos, arrugados en el botón.', 'Estambres numerosos; ovario súpero de dos a muchos carpelos unidos, con placentación parietal.', 'En sentido amplio (APG IV) incluye a las fumarias, de flores zigomorfas.'],
      en: ['Herbs with coloured latex (white, yellow or orange).', 'Two or three sepals that fall as the flower opens (caducous).', 'Four or six petals, crumpled in the bud.', 'Numerous stamens; superior ovary of two to many united carpels, with parietal placentation.', 'In the broad sense (APG IV) it includes the fumitories, with zygomorphic flowers.'] },
    fruit: { es: 'Cápsula que abre por poros bajo el disco estigmático (amapola) o por valvas.', en: 'Capsule opening by pores below the stigmatic disc (poppy) or by valves.' },
    mx: { es: 'El chicalote (Argemone) es maleza común y medicinal; la amapola del opio (Papaver somniferum) es de cultivo ilegal.', en: 'Mexican prickly poppy (Argemone) is a common, medicinal weed; opium poppy (Papaver somniferum) is grown illegally.' },
    species: [
      { sci: 'Argemone mexicana', es: 'chicalote', en: 'Mexican prickly poppy', st: 'nat', note: { es: 'Tres sépalos con cuernitos, seis pétalos amarillos; látex amarillo; planta espinosa.', en: 'Three horned sepals, six yellow petals; yellow latex; a spiny plant.' }, m: { base: 'typical', K: { w: [3] }, C: { w: [3, 3] }, G: { w: [{ n: [3, 6], connate: true }], plac: 'parietal', ov: '∞' }, colors: { C: '#f6d937', A: '#f0b53a', G: '#8fb86a' }, look: { stigma: 'lobed' } } },
      { sci: 'Hunnemannia fumariifolia', es: 'amapola amarilla, tulipán mexicano', en: 'Mexican tulip poppy', st: 'end', note: { es: 'Cuatro pétalos amarillos; hojas muy divididas.', en: 'Four yellow petals; finely divided leaves.' }, m: { base: 'typical', G: { w: [{ n: 2, connate: true }], plac: 'parietal', ov: '∞' }, colors: { C: '#f6d937', A: '#e8a02a' }, look: { stigma: 'lobed' } } },
      { sci: 'Eschscholzia californica', es: 'amapola de California', en: 'California poppy', st: 'nat', note: { es: 'Los dos sépalos forman un capuchón que se desprende entero; receptáculo en copa.', en: 'The two sepals form a cap that is shed whole; cup-shaped receptacle.' }, m: { base: 'typical', hyp: 'cup', K: { w: [{ n: 2, connate: true }] }, G: { w: [{ n: 2, connate: true }], plac: 'parietal', ov: '∞' }, colors: { C: '#f39a1e', A: '#e8a02a' }, look: { stigma: 'lobed' } } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'ranunculaceae', name: 'Ranunculaceae', es: 'ranunculáceas', en: 'buttercup family', order: 'Ranunculales',
    typical: { sym: 'actino', K: { w: [5] }, C: { w: [5] }, A: { w: [{ n: '∞' }] }, G: { w: [{ n: '∞' }], plac: 'basal', ov: 1 }, colors: { K: '#8aa04a', C: '#f6d937', A: '#e8b83a', G: '#9cc76a' } },
    variants: [
      { label: { es: 'Espuela de caballero (Delphinium): flor zigomorfa', en: 'Larkspur (Delphinium): zygomorphic flower' }, m: { sym: 'zygo', B: 1, Bt: 2, K: { w: [{ parts: [{ n: 1, label: { es: 'sépalo con espolón', en: 'spurred sepal' }, size: 1.3 }, { n: 4 }] }], like: 'C' }, C: { w: [{ parts: [{ n: 2, label: { es: 'pétalos con espolón', en: 'spurred petals' } }, { n: 2 }, { n: 1, state: 'lost' }] }] }, A: { w: [{ n: '∞' }] }, G: { w: [3], plac: 'marginal', ov: '∞' }, colors: { K: '#4a5fd1', C: '#6a7fe0', A: '#e8e0c0', G: '#9cc76a' } } },
      { label: { es: 'Clematis: sépalos petaloides, sin pétalos', en: 'Clematis: petaloid sepals, no petals' }, m: { sym: 'actino', K: { w: [4], like: 'C', aest: 'valvate' }, A: { w: [{ n: '∞' }] }, G: { w: [{ n: '∞' }], plac: 'apical', ov: 1 }, colors: { K: '#f4f1e6', A: '#e8e0a8', G: '#b9cf88' } } },
    ],
    chars: { es: ['Hierbas (a veces trepadoras leñosas), con hojas a menudo divididas y base de la hoja envainadora.', 'Partes florales libres, a menudo en número indefinido y en espiral.', 'Sépalos con frecuencia petaloides; pétalos a menudo transformados en nectarios (con espolones en Aquilegia y Delphinium).', 'Estambres numerosos; carpelos libres (gineceo apocárpico), de uno a muchos.', 'Muchas son tóxicas (alcaloides, protoanemonina).'],
      en: ['Herbs (sometimes woody climbers), with often divided leaves and sheathing leaf bases.', 'Free floral parts, often indefinite in number and spirally arranged.', 'Sepals often petaloid; petals often modified into nectaries (spurred in Aquilegia and Delphinium).', 'Numerous stamens; free carpels (apocarpous gynoecium), one to many.', 'Many are poisonous (alkaloids, protoanemonin).'] },
    fruit: { es: 'Agregado de aquenios (Ranunculus, Clematis, con estilos plumosos) o de folículos (Aquilegia, Delphinium).', en: 'Aggregate of achenes (Ranunculus; Clematis, with plumose styles) or of follicles (Aquilegia, Delphinium).' },
    mx: { es: 'Varias especies nativas de montaña (Ranunculus, Aquilegia, Clematis, Thalictrum); espuelas y anémonas se venden como flor de corte.', en: 'Several native mountain species (Ranunculus, Aquilegia, Clematis, Thalictrum); larkspurs and anemones are sold as cut flowers.' },
    species: [
      { sci: 'Ranunculus petiolaris', es: 'botón de oro', en: 'Mexican buttercup', st: 'nat', note: { es: 'Pétalos amarillos brillantes, con una escama nectarífera en la base.', en: 'Glossy yellow petals, each with a nectar scale at the base.' }, m: { base: 'typical' } },
      { sci: 'Aquilegia skinneri', es: 'aguileña', en: 'Skinner\'s columbine', st: 'nat', note: { es: 'Sépalos y pétalos rojo-verdosos; pétalos con espolones largos; estaminodios internos.', en: 'Reddish-green sepals and petals; long-spurred petals; inner staminodes.' }, m: { sym: 'actino', K: { w: [5], like: 'C' }, C: { w: [5] }, A: { w: [{ n: '∞' }, { n: 10, state: 'sterile' }] }, G: { w: [5], plac: 'marginal', ov: '∞' }, colors: { K: '#d9483b', C: '#e8c63a', A: '#f0e08a', G: '#9cc76a' } } },
      { sci: 'Clematis dioica', es: 'barba de viejo, cabellos de ángel', en: 'Clematis', st: 'nat', note: { es: 'Trepadora dioica: flores estaminadas y pistiladas en plantas distintas; aquenios con cola plumosa.', en: 'A dioecious climber: staminate and pistillate flowers on separate plants; achenes with a plumose tail.' } },
      { sci: 'Delphinium elatum', es: 'espuela de caballero', en: 'larkspur', st: 'cult', note: { es: 'El sépalo posterior forma un espolón que aloja los espolones de dos pétalos.', en: 'The posterior sepal forms a spur that holds the spurs of two petals.' }, m: { base: 'variant:0' } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'cactaceae', name: 'Cactaceae', es: 'cactáceas', en: 'cactus family', order: 'Caryophyllales',
    typical: 'sp:opuntia',
    chars: { es: ['Plantas suculentas de tallo verde (fotosintético), con metabolismo CAM.', 'Aréolas: yemas cortas de las que salen espinas (hojas modificadas), pelos, flores y ramas.', 'Hojas ausentes o pequeñas y caedizas (como en los nopales jóvenes); solo Pereskia y Pereskiopsis tienen hojas persistentes.', 'Flores solitarias con tépalos y estambres numerosos en espiral, que pasan de brácteas a sépalos y a pétalos.', 'Ovario ínfero hundido en tejido del tallo (pericarpelo), con aréolas; un lóculo con placentación parietal.'],
      en: ['Succulent plants with green (photosynthetic) stems and CAM metabolism.', 'Areoles: short shoots producing spines (modified leaves), hairs, flowers and branches.', 'Leaves absent, or small and soon shed (as on young prickly-pear pads); only Pereskia and Pereskiopsis keep their leaves.', 'Solitary flowers with numerous spirally arranged tepals and stamens, grading from bracts to sepals to petals.', 'Inferior ovary sunk in stem tissue (pericarpel), bearing areoles; one locule with parietal placentation.'] },
    fruit: { es: 'Baya (tuna, pitaya, xoconostle), a menudo con aréolas o espinas.', en: 'Berry (prickly pear, pitaya, xoconostle), often with areoles or spines.' },
    mx: { es: 'México es el centro de diversidad de los cactos, con unas 670 especies, la mayoría endémicas; nopal y tuna son alimentos básicos.', en: 'Mexico is the centre of cactus diversity, with some 670 species, most of them endemic; nopal pads and prickly pears are staple foods.' },
    species: [
      { sci: 'Opuntia ficus-indica', es: 'nopal, tuna', en: 'prickly pear', st: 'dom', note: { es: 'Domesticado en el centro de México; se comen los cladodios y el fruto.', en: 'Domesticated in central Mexico; the pads and the fruit are eaten.' }, m: 'sp:opuntia' },
      { sci: 'Carnegiea gigantea', es: 'saguaro', en: 'saguaro', st: 'nat', note: { es: 'Columnar gigante de Sonora; flores blancas nocturnas visitadas por murciélagos.', en: 'Giant columnar cactus of Sonora; white nocturnal flowers visited by bats.' }, m: { base: 'typical', colors: { P: '#f7f5ea', A: '#f0e08a' } } },
      { sci: 'Selenicereus undatus', es: 'pitahaya', en: 'dragon fruit', st: 'nat', note: { es: 'Trepadora; flores enormes, blancas, que abren una sola noche; se cultiva en Yucatán.', en: 'A climber; huge white flowers that open for a single night; grown in Yucatán.' }, m: { base: 'typical', colors: { P: '#f7f5ea', A: '#f0e08a', G: '#8fbf4a' } } },
      { sci: 'Echinocactus platyacanthus', es: 'biznaga dulce', en: 'giant barrel cactus', st: 'end', note: { es: 'Su tallo se usaba para el acitrón; hoy está protegida.', en: 'Its stem was used for acitrón candy; it is now protected.' }, m: { base: 'typical', colors: { P: '#f2c12e' } } },
      { sci: 'Stenocereus queretaroensis', es: 'pitayo de Querétaro', en: 'Queretaro pitaya', st: 'end', note: { es: 'Columnar cultivado en Jalisco por sus pitayas.', en: 'A columnar cactus grown in Jalisco for its pitayas.' } },
      { sci: 'Mammillaria magnimamma', es: 'biznaga de chilitos', en: 'Mexican pincushion', st: 'end', note: { es: 'Las flores nacen entre los tubérculos (axilas), no en las aréolas espinosas.', en: 'Flowers arise between the tubercles (axils), not from the spiny areoles.' }, m: { base: 'typical', colors: { P: '#e27bb0' } } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'amaranthaceae', name: 'Amaranthaceae', es: 'amarantáceas (incluye quenopodiáceas)', en: 'amaranth family (including goosefoots)', order: 'Caryophyllales',
    typical: { sym: 'actino', B: 1, Bt: 2, P: { w: [5], like: 'K' }, A: { w: [{ n: 5, opp: true }] }, G: { w: [{ n: [2, 3], connate: true }], plac: 'basal', loc: 1, ov: 1 }, look: { stigma: 'bifid' }, colors: { P: '#a8b86a', A: '#e8d67a', G: '#9cc76a' } },
    chars: { es: ['Hierbas, a menudo con pigmentos rojos (betalaínas).', 'Flores pequeñas, verdosas o secas y escariosas, apretadas en espigas o glomérulos, con brácteas.', 'Perianto sencillo de tres a cinco tépalos sepaloides.', 'Estambres tantos como los tépalos y frente a ellos.', 'Ovario súpero de un lóculo con un solo óvulo basal; semilla con embrión curvo.'],
      en: ['Herbs, often with red pigments (betalains).', 'Small, greenish or dry and scarious flowers crowded in spikes or glomerules, with bracts.', 'A simple perianth of three to five sepaloid tepals.', 'As many stamens as tepals, opposite them.', 'Superior ovary with one locule and a single basal ovule; seed with a curved embryo.'] },
    fruit: { es: 'Utrículo o aquenio; en el amaranto abre por una tapa (circuncísil).', en: 'Utricle or achene; in amaranth it opens by a lid (circumscissile).' },
    mx: { es: 'El huauhtli (amaranto) fue cultivo sagrado de los mexicas; el epazote es condimento y el huauzontle, quelite de la cocina tradicional.', en: 'Huauhtli (amaranth) was a sacred Aztec crop; epazote is a condiment and huauzontle a traditional leafy green.' },
    species: [
      { sci: 'Amaranthus hypochondriacus', es: 'amaranto, huauhtli', en: 'prince\'s feather amaranth', st: 'dom', note: { es: 'Monoico: flores estaminadas y pistiladas en la misma panícula; de la semilla se hace la alegría.', en: 'Monoecious: staminate and pistillate flowers in the same panicle; the seed is made into alegría candy.' },
        flowers: [
          { label: { es: 'Flor estaminada', en: 'Staminate flower' }, m: { base: 'typical', sex: 'staminate', G: null, colors: { P: '#b0476a' } } },
          { label: { es: 'Flor pistilada', en: 'Pistillate flower' }, m: { base: 'typical', sex: 'pistillate', A: null, G: { w: [{ n: 3, connate: true }], plac: 'basal', loc: 1, ov: 1 }, colors: { P: '#b0476a' }, look: { stigma: 'lobed' } } },
        ] },
      { sci: 'Dysphania ambrosioides', es: 'epazote', en: 'epazote', st: 'nat', note: { es: 'Muy aromático; flores diminutas en glomérulos, sin bractéolas y con los tépalos unidos en la base.', en: 'Strongly aromatic; minute flowers in glomerules, without bracteoles and with the tepals joined at the base.' }, m: { base: 'typical', Bt: 0, P: { w: [{ n: 5, connate: true }], like: 'K' } } },
      { sci: 'Chenopodium berlandieri subsp. nuttalliae', es: 'huauzontle', en: 'huauzontle', st: 'dom', note: { es: 'Se comen las inflorescencias tiernas, capeadas; como en todas las quenopodioideas, las flores no tienen bractéolas.', en: 'The tender inflorescences are eaten, battered; as in all Chenopodioideae, the flowers have no bracteoles.' }, m: { base: 'typical', Bt: 0, P: { w: [{ n: 5, connate: true }], like: 'K' } } },
      { sci: 'Spinacia oleracea', es: 'espinaca', en: 'spinach', st: 'cult', note: { es: 'Dioica; las flores pistiladas no tienen perianto, sino dos bractéolas.', en: 'Dioecious; pistillate flowers lack a perianth and have two bracteoles instead.' } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'caryophyllaceae', name: 'Caryophyllaceae', es: 'cariofiláceas', en: 'pink family', order: 'Caryophyllales',
    typical: { sym: 'actino', K: { w: [{ n: 5, connate: true }] }, C: { w: [5] }, A: { w: [{ n: 5, opp: true }, 5] }, G: { w: [{ n: [2, 5], connate: true }], plac: 'freecentral', ov: '∞' }, look: { corolla: 'caryophyllaceous' }, colors: { K: '#8aa04a', C: '#e8638a', A: '#f0e0e8', G: '#9cc76a' } },
    chars: { es: ['Hierbas con nudos engrosados y hojas opuestas, a menudo unidas en la base.', 'Pétalos a menudo con uña larga y lámina dentada o bífida.', 'Diez estambres en dos verticilos (con frecuencia obdiplostémonos).', 'Ovario súpero de un lóculo con placentación central libre; varios estilos libres.', 'A diferencia de casi todo su orden, tienen antocianinas y no betalaínas.'],
      en: ['Herbs with swollen nodes and opposite leaves, often joined at the base.', 'Petals often with a long claw and a toothed or bifid blade.', 'Ten stamens in two whorls (often obdiplostemonous).', 'Superior ovary with one locule and free-central placentation; several free styles.', 'Unlike most of their order, they have anthocyanins, not betalains.'] },
    fruit: { es: 'Cápsula que abre por dientes en el ápice.', en: 'Capsule opening by apical teeth.' },
    mx: { es: 'El clavel es una de las principales flores de corte del Estado de México; la gisófila acompaña los ramos.', en: 'Carnation is one of the main cut flowers of the State of Mexico; baby\'s breath goes into bouquets.' },
    species: [
      { sci: 'Dianthus caryophyllus', es: 'clavel', en: 'carnation', st: 'cult', note: { es: 'Cáliz tubular con escamas (epicáliz) en la base; dos estilos.', en: 'Tubular calyx with scales (epicalyx) at its base; two styles.' }, m: { base: 'typical', E: { w: [4] }, G: { w: [{ n: 2, connate: true }], plac: 'freecentral', ov: '∞' }, colors: { E: '#8aa04a', C: '#d9363f' } } },
      { sci: 'Gypsophila paniculata', es: 'nube, gisófila', en: 'baby\'s breath', st: 'cult', note: { es: 'Flores diminutas, blancas, en panículas muy ramificadas.', en: 'Tiny white flowers in much-branched panicles.' }, m: { base: 'typical', G: { w: [{ n: 2, connate: true }], plac: 'freecentral', ov: '∞' }, colors: { C: '#faf8f4' } } },
      { sci: 'Stellaria media', es: 'pamplina, hierba gallinera', en: 'chickweed', st: 'intro', note: { es: 'Sépalos libres; pétalos blancos partidos casi hasta la base; de tres a cinco estambres.', en: 'Free sepals; white petals split almost to the base; three to five stamens.' }, m: { sym: 'actino', K: { w: [5] }, C: { w: [{ n: 5, label: { es: 'bífidos', en: 'bifid' } }] }, A: { w: [{ n: [3, 5] }] }, G: { w: [{ n: 3, connate: true }], plac: 'freecentral', ov: '∞' }, look: { corolla: 'caryophyllaceous', stigma: 'lobed' }, colors: { K: '#8aa04a', C: '#faf8f4', A: '#c05a6a', G: '#9cc76a' } } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'nyctaginaceae', name: 'Nyctaginaceae', es: 'nictagináceas', en: 'four-o\'clock family', order: 'Caryophyllales',
    typical: { sym: 'actino', B: 1, P: { w: [{ n: 5, connate: true }], like: 'C' }, A: { w: [5] }, G: { w: [1], plac: 'basal', ov: 1 }, look: { perianth: 'funnelform', stigma: 'capitate' }, colors: { P: '#d9368a', A: '#f0e0e8', G: '#9cc76a' } },
    chars: { es: ['Hierbas, arbustos o trepadoras; hojas opuestas.', 'Sin pétalos: el perianto es un tubo petaloide (a menudo tomado por una corola).', 'Brácteas que parecen cáliz (Mirabilis) o brácteas grandes y coloridas (Bougainvillea).', 'Ovario súpero de un carpelo con un solo óvulo basal.', 'La base del perianto persiste y endurece alrededor del fruto (antocarpo).'],
      en: ['Herbs, shrubs or climbers; opposite leaves.', 'No petals: the perianth is a petaloid tube (often mistaken for a corolla).', 'Calyx-like bracts (Mirabilis) or large coloured bracts (Bougainvillea).', 'Superior ovary of one carpel with a single basal ovule.', 'The base of the perianth persists and hardens around the fruit (anthocarp).'] },
    fruit: { es: 'Aquenio envuelto por la base del perianto (antocarpo).', en: 'Achene enclosed by the base of the perianth (anthocarp).' },
    mx: { es: 'La maravilla o don Diego de noche es nativa; la bugambilia, de Brasil, adorna casas y bardas de todo el país.', en: 'Four-o\'clock is native; bougainvillea, from Brazil, adorns houses and walls all over the country.' },
    species: [
      { sci: 'Mirabilis jalapa', es: 'maravilla, don Diego de noche', en: 'four-o\'clock', st: 'nat', note: { es: 'Abre al atardecer; lo que parece cáliz es un involucro de brácteas.', en: 'Opens at dusk; what looks like a calyx is an involucre of bracts.' }, m: { base: 'typical' } },
      { sci: 'Bougainvillea spectabilis', es: 'bugambilia', en: 'bougainvillea', st: 'cult', note: { es: 'Tres brácteas vistosas rodean tres flores tubulares pequeñas.', en: 'Three showy bracts surround three small tubular flowers.' }, m: { base: 'typical', A: { w: [8] }, colors: { P: '#f1e6c0' }, look: { perianth: null } } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'polygonaceae', name: 'Polygonaceae', es: 'poligonáceas', en: 'knotweed family', order: 'Caryophyllales',
    typical: { sym: 'actino', P: { w: [3, 3], like: 'K' }, A: { w: [{ n: 6, ang: [170, 190, 50, 70, 290, 310] }] }, G: { w: [{ n: 3, connate: true }], plac: 'basal', loc: 1, ov: 1 }, colors: { P: '#a8a86a', A: '#e8d67a', G: '#b9a86a' } },
    chars: { es: ['Hierbas, trepadoras o árboles con nudos hinchados.', 'Ócrea: una vaina membranosa formada por las estípulas que rodea al tallo sobre cada nudo.', 'Flores pequeñas con tres a seis tépalos, a menudo persistentes y que crecen con el fruto.', 'Seis a nueve estambres; en Rumex, seis en tres pares frente a los tépalos externos.', 'Ovario súpero de un lóculo, casi siempre trígono, con un solo óvulo basal ortótropo.'],
      en: ['Herbs, climbers or trees with swollen nodes.', 'Ocrea: a membranous sheath formed by the stipules that wraps the stem above each node.', 'Small flowers with three to six tepals, often persistent and enlarging with the fruit.', 'Six to nine stamens; in Rumex, six in three pairs opposite the outer tepals.', 'Superior ovary with one locule, usually three-angled, and a single basal orthotropous ovule.'] },
    fruit: { es: 'Aquenio trígono o lenticular, a menudo envuelto por los tépalos.', en: 'Three-angled or lens-shaped achene, often enclosed by the tepals.' },
    mx: { es: 'La uva de mar crece en las dunas costeras; el San Miguelito es una trepadora nativa muy cultivada; las lenguas de vaca (Rumex) son quelites y malezas.', en: 'Sea grape grows on coastal dunes; coral vine is a widely grown native climber; docks (Rumex) are greens and weeds.' },
    species: [
      { sci: 'Antigonon leptopus', es: 'San Miguelito, rosa de montaña', en: 'coral vine', st: 'nat', note: { es: 'Cinco tépalos rosados que crecen con el fruto; ocho estambres unidos en la base.', en: 'Five pink tepals that enlarge in fruit; eight stamens joined at the base.' }, m: { base: 'typical', P: { w: [5], like: 'C' }, A: { w: [{ n: 8, connate: true }] }, colors: { P: '#e8638a', A: '#f0e0a8' }, look: { stigma: 'capitate' } } },
      { sci: 'Coccoloba uvifera', es: 'uva de mar', en: 'sea grape', st: 'nat', note: { es: 'Árbol costero, funcionalmente dioico; el perianto se vuelve carnoso alrededor del fruto.', en: 'A coastal tree, functionally dioecious; the perianth becomes fleshy around the fruit.' }, m: { base: 'typical', P: { w: [5], like: 'K' }, A: { w: [8] }, colors: { P: '#f1ecd0' }, look: { stigma: 'capitate' } } },
      { sci: 'Rumex crispus', es: 'lengua de vaca', en: 'curly dock', st: 'intro', note: { es: 'Los tres tépalos internos crecen como alas alrededor del aquenio.', en: 'The three inner tepals grow into wings around the achene.' }, m: { base: 'typical' } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'portulacaceae', name: 'Portulacaceae', es: 'portulacáceas', en: 'purslane family', order: 'Caryophyllales',
    typical: { sym: 'actino', K: { w: [2] }, C: { w: [5] }, A: { w: [{ n: [6, 12] }] }, G: { w: [{ n: [3, 5], connate: true }], pos: 'half', plac: 'freecentral', ov: '∞' }, look: { stigma: 'lobed' }, colors: { K: '#8aa04a', C: '#f6d937', A: '#f0c23a', G: '#9cc76a' } },
    chars: { es: ['Hierbas suculentas, rastreras; hojas carnosas.', 'Solo dos sépalos y de cuatro a seis pétalos efímeros.', 'Estambres de seis a muchos.', 'Ovario semiínfero de un lóculo, con placentación central libre.', 'En sentido estricto (APG IV) incluye solo al género Portulaca.'],
      en: ['Succulent, prostrate herbs; fleshy leaves.', 'Only two sepals and four to six short-lived petals.', 'Six to many stamens.', 'Half-inferior ovary with one locule and free-central placentation.', 'In the strict sense (APG IV) it contains only the genus Portulaca.'] },
    fruit: { es: 'Pixidio: cápsula que abre por una tapa.', en: 'Pyxis: a capsule that opens by a lid.' },
    mx: { es: 'La verdolaga es un quelite muy consumido; su origen se discute, pero hay semillas precolombinas en Norteamérica.', en: 'Purslane is a widely eaten green; its origin is debated, but pre-Columbian seeds are known from North America.' },
    species: [
      { sci: 'Portulaca oleracea', es: 'verdolaga', en: 'purslane', st: 'nat', note: { es: 'Flores amarillas que abren solo por la mañana.', en: 'Yellow flowers that open only in the morning.' }, m: { base: 'typical' } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'crassulaceae', name: 'Crassulaceae', es: 'crasuláceas', en: 'stonecrop family', order: 'Saxifragales',
    typical: { sym: 'actino', K: { w: [5] }, C: { w: [5] }, A: { w: [{ n: 5, opp: true }, 5] }, G: { w: [5], plac: 'marginal', ov: '∞' }, colors: { K: '#8aa04a', C: '#f2c12e', A: '#e8b83a', G: '#9cc76a' } },
    chars: { es: ['Plantas suculentas, a menudo en rosetas, con metabolismo CAM.', 'Flores isómeras (de cuatro o cinco piezas por verticilo).', 'Estambres tantos o el doble que los pétalos, a menudo obdiplostémonos.', 'Carpelos libres o casi, cada uno con una escama nectarífera en la base.'],
      en: ['Succulent plants, often in rosettes, with CAM metabolism.', 'Isomerous flowers (four or five members per whorl).', 'As many stamens as petals or twice as many, often obdiplostemonous.', 'Free or nearly free carpels, each with a nectar scale at its base.'] },
    fruit: { es: 'Agregado de folículos.', en: 'Aggregate of follicles.' },
    mx: { es: 'México es centro de diversidad de Echeveria y Sedum, con muchas especies endémicas muy buscadas por coleccionistas.', en: 'Mexico is a centre of diversity for Echeveria and Sedum, with many endemic species sought by collectors.' },
    species: [
      { sci: 'Echeveria elegans', es: 'conchita, rosa de alabastro', en: 'Mexican snowball', st: 'end', note: { es: 'Corola de pétalos unidos en la base, rosa y amarilla.', en: 'Corolla with petals joined at the base, pink and yellow.' }, m: { base: 'typical', C: { w: [{ n: 5, connate: true }] }, colors: { C: '#f08a6a' } } },
      { sci: 'Sedum morganianum', es: 'cola de burro', en: 'burro\'s tail', st: 'end', note: { es: 'Colgante, de Veracruz; hojas carnosas en espiral.', en: 'A trailing plant from Veracruz; fleshy spirally arranged leaves.' }, m: { base: 'typical', colors: { C: '#d9486a' } } },
      { sci: 'Graptopetalum paraguayense', es: 'planta fantasma', en: 'ghost plant', st: 'end', note: { es: 'Pese a su nombre, es mexicana; pétalos blancos con motas rojas.', en: 'Despite its name, it is Mexican; white petals with red speckles.' }, m: { base: 'typical', C: { w: [{ n: 5, connate: true }] }, colors: { C: '#f4efe6' } } },
      { sci: 'Kalanchoe blossfeldiana', es: 'kalanchoe', en: 'flaming Katy', st: 'cult', note: { es: 'De Madagascar; flores tetrámeras con corola tubular.', en: 'From Madagascar; tetramerous flowers with a tubular corolla.' }, m: { sym: 'actino', K: { w: [4] }, C: { w: [{ n: 4, connate: true }] }, A: { w: [{ n: 4, opp: true }, 4] }, G: { w: [4], plac: 'marginal', ov: '∞' }, adn: [['C', 'A']], look: { corolla: 'salverform', tube: 0.5 }, colors: { K: '#8aa04a', C: '#e0452f', A: '#f0c23a', G: '#9cc76a' } } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'vitaceae', name: 'Vitaceae', es: 'vitáceas', en: 'grape family', order: 'Vitales',
    typical: { sym: 'actino', K: { w: [{ n: 5, connate: true }] }, C: { w: [5], aest: 'valvate' }, A: { w: [{ n: 5, opp: true }] }, G: { w: [{ n: 2, connate: true }], plac: 'axile', ov: 4 }, disc: 'intra', look: { stigma: 'capitate' }, colors: { K: '#8aa04a', C: '#b9cf6a', A: '#e8d67a', G: '#9cc76a' } },
    chars: { es: ['Trepadoras leñosas con zarcillos opuestos a las hojas.', 'Flores pequeñas, verdosas, en cimas opuestas a las hojas.', 'Cáliz reducido a un borde; pétalos valvados que en la vid se sueldan en la punta y caen juntos como un capuchón (caliptra).', 'Estambres tantos como los pétalos y frente a ellos; disco nectarífero dentro de los estambres.', 'Ovario súpero de dos lóculos con dos óvulos cada uno.'],
      en: ['Woody climbers with tendrils opposite the leaves.', 'Small greenish flowers in cymes opposite the leaves.', 'Calyx reduced to a rim; valvate petals that in grapevine cohere at the tip and fall together as a cap (calyptra).', 'As many stamens as petals, opposite them; a nectary disc inside the stamens.', 'Superior ovary with two locules and two ovules in each.'] },
    fruit: { es: 'Baya.', en: 'Berry.' },
    mx: { es: 'Sonora produce la mayor parte de la uva del país (sobre todo de mesa); la de vino viene de Baja California, Coahuila y Querétaro. Hay uvas silvestres nativas (Vitis) y la parra virgen.', en: 'Sonora grows most of the country\'s grapes (mainly table grapes); wine grapes come from Baja California, Coahuila and Querétaro. There are native wild grapes (Vitis) and Virginia creeper.' },
    species: [
      { sci: 'Vitis vinifera', es: 'vid', en: 'grapevine', st: 'cult', note: { es: 'Los pétalos no se abren: caen juntos como una caperuza.', en: 'The petals do not open: they fall together as a cap.' }, m: { base: 'typical' } },
      { sci: 'Parthenocissus quinquefolia', es: 'parra virgen', en: 'Virginia creeper', st: 'nat', note: { es: 'Zarcillos con discos adhesivos; hojas de cinco folíolos; el disco nectarífero es casi nulo.', en: 'Tendrils with adhesive pads; leaves of five leaflets; the nectary disc is obscure.' }, m: { base: 'typical', disc: null } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'fabaceae', name: 'Fabaceae', es: 'fabáceas (leguminosas)', en: 'legume family', order: 'Fabales',
    typical: 'sp:phaseolus',
    variants: [
      { label: { es: 'Clado mimosoide (Caesalpinioideae): flor actinomorfa, estambres vistosos', en: 'Mimosoid clade (Caesalpinioideae): actinomorphic flower, showy stamens' }, m: { sym: 'actino', B: 1, K: { w: [{ n: 5, connate: true }], aest: 'valvate' }, C: { w: [5], aest: 'valvate' }, A: { w: [5, 5] }, G: { w: [1], plac: 'marginal', ov: '∞' }, look: { stigma: 'punctiform' }, colors: { K: '#8aa04a', C: '#e8e0a8', A: '#f4f0e0', G: '#9cc76a' } } },
      { label: { es: 'Cercidoideae (pata de vaca): corola casi regular', en: 'Cercidoideae (orchid tree): nearly regular corolla' }, m: { sym: 'zygo', B: 1, Bt: 2, oddK: 'abaxial', K: { w: [{ n: 5, connate: true }] }, C: { w: [{ parts: [{ n: 1, label: { es: 'pétalo adaxial', en: 'adaxial petal' }, size: 1.1 }, { n: 4 }] }], aest: 'imbricate' }, A: { w: [5] }, G: { w: [1], plac: 'marginal', ov: '∞' }, look: { stigma: 'capitate' }, colors: { K: '#8aa04a', C: '#d58fd8', A: '#f0e0e8', G: '#9cc76a' } } },
      { label: { es: 'Detarioideae (tamarindo): tres pétalos y tres estambres fértiles', en: 'Detarioideae (tamarind): three petals and three fertile stamens' }, m: { sym: 'zygo', B: 1, Bt: 2, oddK: 'abaxial', K: { w: [{ parts: [{ n: 2, connate: true }, { n: 3 }] }] }, C: { w: [{ parts: [{ n: 3 }, { n: 2, size: 0.3, label: { es: 'reducidos a escamas', en: 'reduced to scales' } }] }], aest: 'imbricate' }, A: { w: [{ parts: [{ n: [4, 7], state: 'sterile', label: { es: 'estaminodios diminutos', en: 'minute staminodes' } }, { n: 3, connate: true, label: { es: 'fértiles, en una vaina', en: 'fertile, in a sheath' } }] }] }, G: { w: [1], plac: 'marginal', ov: '∞' }, colors: { K: '#e8c9a0', C: '#f2d34a', A: '#e8b83a', G: '#9cc76a' } } },
    ],
    chars: { es: ['Hojas casi siempre compuestas, con estípulas y pulvínulos (se mueven).', 'Un solo carpelo con placentación marginal: el fruto es una legumbre.', 'Tres tipos de flor: papilionácea (frijol), mimosoide con estambres vistosos (mezquite, huizache) y otras casi regulares o reducidas (tamarindo, pata de vaca).', 'Muchas tienen raíces con nódulos donde bacterias (rizobios) fijan nitrógeno del aire (casi todas las papilionoideas y mimosoides; pocas cercidoideas y detarioideas).'],
      en: ['Leaves almost always compound, with stipules and pulvini (they move).', 'A single carpel with marginal placentation: the fruit is a legume.', 'Three kinds of flower: papilionaceous (bean), mimosoid with showy stamens (mesquite, huisache) and others nearly regular or reduced (tamarind, orchid tree).', 'Many have roots with nodules in which bacteria (rhizobia) fix nitrogen from the air (almost all papilionoids and mimosoids; few Cercidoideae and Detarioideae).'] },
    fruit: { es: 'Legumbre (vaina) que abre por dos suturas; a veces indehiscente (tamarindo, cacahuate).', en: 'Legume (pod) opening along two sutures; sometimes indehiscent (tamarind, peanut).' },
    mx: { es: 'Segunda familia más diversa del país; el frijol y el ayocote se domesticaron en México; mezquite, huizache y guaje dominan matorrales y selvas secas.', en: 'The second most diverse family in the country; common and runner beans were domesticated in Mexico; mesquite, huisache and leadtree dominate scrub and dry forests.' },
    species: [
      { sci: 'Phaseolus vulgaris', es: 'frijol', en: 'common bean', st: 'dom', note: { es: 'Quilla enrollada en espiral junto con el estilo.', en: 'Keel coiled in a spiral together with the style.' }, m: 'sp:phaseolus' },
      { sci: 'Phaseolus coccineus', es: 'ayocote', en: 'runner bean', st: 'dom', note: { es: 'Flores rojas o blancas; de clima fresco.', en: 'Red or white flowers; a cool-climate bean.' }, m: { base: 'typical', colors: { C: '#e0452f' } } },
      { sci: 'Arachis hypogaea', es: 'cacahuate', en: 'peanut', st: 'cult', note: { es: 'Sudamericano, cultivado en Mesoamérica desde antes de la Conquista; tras la polinización, el ginóforo (la «clavija») en la base del ovario se alarga y entierra el fruto (geocarpia).', en: 'South American, grown in Mesoamerica before the Conquest; after pollination, the gynophore (the "peg") at the base of the ovary elongates and buries the fruit (geocarpy).' } },
      { sci: 'Erythrina americana', es: 'colorín, pichoco', en: 'coral tree', st: 'end', note: { es: 'Estandarte largo que envuelve a las alas y la quilla, pequeñas; polinizado por colibríes.', en: 'A long standard wrapping the small wings and keel; pollinated by hummingbirds.' }, m: { base: 'typical', colors: { C: '#e0342f', K: '#b0402f' } } },
      { sci: 'Leucaena leucocephala', es: 'guaje', en: 'white leadtree', st: 'nat', note: { es: 'Cabezuelas blancas de flores con diez estambres; se comen las semillas tiernas.', en: 'White heads of flowers with ten stamens; the young seeds are eaten.' }, m: { base: 'variant:0' } },
      { sci: 'Neltuma laevigata', es: 'mezquite', en: 'smooth mesquite', st: 'nat', note: { es: 'Antes Prosopis laevigata (los mezquites americanos pasaron a Neltuma en 2022); espigas de flores amarillentas; vainas dulces comestibles.', en: 'Formerly Prosopis laevigata (American mesquites were moved to Neltuma in 2022); spikes of yellowish flowers; sweet edible pods.' }, m: { base: 'variant:0', colors: { C: '#e8d67a', A: '#f2d34a' } } },
      { sci: 'Vachellia farnesiana', es: 'huizache', en: 'sweet acacia', st: 'nat', note: { es: 'Cabezuelas amarillas perfumadas; estambres numerosos y corola de pétalos unidos.', en: 'Fragrant yellow heads; numerous stamens and a corolla of united petals.' }, m: { base: 'variant:0', C: { w: [{ n: 5, connate: true }], aest: 'valvate' }, A: { w: [{ n: '∞' }] }, colors: { C: '#f2d34a', A: '#f2c12e' } } },
      { sci: 'Tamarindus indica', es: 'tamarindo', en: 'tamarind', st: 'cult', note: { es: 'Africano; tres pétalos desarrollados y tres estambres fértiles, más estaminodios diminutos.', en: 'African; three developed petals and three fertile stamens, plus minute staminodes.' }, m: { base: 'variant:2' } },
      { sci: 'Bauhinia variegata', es: 'pata de vaca', en: 'orchid tree', st: 'cult', note: { es: 'Asiática; hojas bilobuladas; cinco estambres fértiles.', en: 'Asian; two-lobed leaves; five fertile stamens.' }, m: { base: 'variant:1' } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'rosaceae', name: 'Rosaceae', es: 'rosáceas', en: 'rose family', order: 'Rosales',
    typical: 'sp:prunus',
    variants: [
      { label: { es: 'Rosa: hipanto en urna con muchos carpelos libres', en: 'Rose: urn-shaped hypanthium with many free carpels' }, m: { sym: 'actino', hyp: 'tube', K: { w: [5], aest: 'imbricate' }, C: { w: [5], aest: 'imbricate' }, A: { w: [{ n: '∞' }] }, G: { w: [{ n: '∞' }], plac: 'apical', ov: 1 }, look: { corolla: 'rosaceous' }, colors: { K: '#6f9a45', C: '#e8638a', A: '#f2c12e', G: '#b9cf88' } } },
      { label: { es: 'Manzano y tejocote: ovario ínfero (pomo)', en: 'Apple and hawthorn: inferior ovary (pome)' }, m: { sym: 'actino', K: { w: [5], aest: 'imbricate' }, C: { w: [5], aest: 'imbricate' }, A: { w: [{ n: [15, 20] }] }, G: { w: [{ n: 5, connate: true }], pos: 'inferior', plac: 'axile', ov: 10 }, look: { corolla: 'rosaceous' }, colors: { K: '#6f9a45', C: '#f6e6ea', A: '#e8c63a', G: '#9cc76a' } } },
    ],
    chars: { es: ['Árboles, arbustos o hierbas; hojas alternas, casi siempre con estípulas.', 'Flores pentámeras con hipanto (copa floral) de donde nacen sépalos, pétalos y estambres.', 'Estambres numerosos, a menudo en múltiplos de cinco.', 'Gineceo muy variable: un carpelo (ciruelos), muchos libres (rosas, fresas) o unidos al hipanto en ovario ínfero (manzanos).'],
      en: ['Trees, shrubs or herbs; alternate leaves, usually with stipules.', 'Pentamerous flowers with a hypanthium (floral cup) from which sepals, petals and stamens arise.', 'Numerous stamens, often in multiples of five.', 'A very variable gynoecium: one carpel (plums), many free ones (roses, strawberries) or united with the hypanthium in an inferior ovary (apples).'] },
    fruit: { es: 'Drupa (durazno, capulín), pomo (manzana, tejocote), agregado de aquenios sobre receptáculo carnoso (fresa) o escaramujo (rosa).', en: 'Drupe (peach, capulin), pome (apple, hawthorn), aggregate of achenes on a fleshy receptacle (strawberry) or hip (rose).' },
    mx: { es: 'El tejocote es fruta de las posadas y del ponche navideño, y el capulín madura en verano; ambos son nativos. Michoacán y Guanajuato producen fresa, Chihuahua manzana.', en: 'Mexican hawthorn is a fruit of the Christmas posadas and punch, and capulin cherry ripens in summer; both are native. Michoacán and Guanajuato grow strawberries, Chihuahua apples.' },
    species: [
      { sci: 'Prunus persica', es: 'durazno', en: 'peach', st: 'cult', note: { es: 'Chino; flor perígina de un solo carpelo.', en: 'Chinese; perigynous flower with a single carpel.' }, m: 'sp:prunus' },
      { sci: 'Prunus serotina subsp. capuli', es: 'capulín', en: 'capulin cherry', st: 'nat', note: { es: 'Racimos de flores blancas; drupas negras comestibles.', en: 'Racemes of white flowers; edible black drupes.' }, m: { base: 'typical', colors: { K: '#6f9a45', C: '#faf8f4', A: '#e8c63a' } } },
      { sci: 'Crataegus mexicana', es: 'tejocote', en: 'Mexican hawthorn', st: 'nat', note: { es: 'Pomo amarillo con dos a cinco huesos; se usa en el ponche navideño.', en: 'Yellow pome with two to five stones; used in Christmas punch.' }, m: { base: 'variant:1', G: { w: [{ n: [2, 5], connate: true }], pos: 'inferior', plac: 'axile', ov: [4, 10] } } },
      { sci: 'Rosa montezumae', es: 'rosa de Moctezuma', en: 'Montezuma rose', st: 'end', note: { es: 'Rosa silvestre de pétalos rosados; los carpelos quedan dentro del hipanto.', en: 'A wild rose with pink petals; the carpels sit inside the hypanthium.' }, m: { base: 'variant:0' } },
      { sci: 'Fragaria × ananassa', es: 'fresa', en: 'strawberry', st: 'cult', note: { es: 'Epicáliz bajo los sépalos; muchos carpelos sobre un receptáculo abombado que se vuelve carnoso.', en: 'An epicalyx below the sepals; many carpels on a domed receptacle that becomes fleshy.' }, m: { sym: 'actino', hyp: 'cup', E: { w: [5] }, K: { w: [5] }, C: { w: [5] }, A: { w: [{ n: [20, 30] }] }, G: { w: [{ n: '∞' }], plac: 'marginal', ov: 1 }, look: { corolla: 'rosaceous', receptacle: 'elongate' }, colors: { E: '#6f9a45', K: '#6f9a45', C: '#faf8f4', A: '#f2c12e', G: '#d8d060' } } },
      { sci: 'Malus domestica', es: 'manzano', en: 'apple', st: 'cult', note: { es: 'De Asia central; cinco carpelos unidos al hipanto.', en: 'From Central Asia; five carpels united with the hypanthium.' }, m: { base: 'variant:1' } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'rhamnaceae', name: 'Rhamnaceae', es: 'ramnáceas', en: 'buckthorn family', order: 'Rosales',
    typical: { sym: 'actino', hyp: 'cup', K: { w: [5], aest: 'valvate' }, C: { w: [5] }, A: { w: [{ n: 5, opp: true }] }, G: { w: [{ n: [2, 3], connate: true }], pos: 'half', plac: 'axile', ov: [2, 3] }, disc: 'intra', look: { stigma: 'lobed' }, colors: { K: '#b9cf6a', C: '#e8e8b0', A: '#e8d67a', G: '#9cc76a' } },
    chars: { es: ['Árboles y arbustos, a menudo espinosos; hojas simples con nervios muy marcados.', 'Flores pequeñas con hipanto y sépalos valvados, a menudo con una quilla por dentro.', 'Pétalos pequeños, en forma de capucha, que abrazan a los estambres.', 'Estambres tantos como los pétalos y frente a ellos (antepétalos); disco nectarífero.', 'Ovario de dos o tres lóculos, con un óvulo basal en cada uno.'],
      en: ['Trees and shrubs, often spiny; simple leaves with prominent veins.', 'Small flowers with a hypanthium and valvate sepals, often keeled inside.', 'Small hooded petals that clasp the stamens.', 'As many stamens as petals, opposite them (antepetalous); a nectary disc.', 'Ovary with two or three locules and one basal ovule in each.'] },
    fruit: { es: 'Drupa o cápsula.', en: 'Drupe or capsule.' },
    mx: { es: 'La tullidora (Karwinskia) es tóxica: su fruto causa parálisis; el ceanoto azul adorna los bosques de pino y encino.', en: 'Coyotillo (Karwinskia) is toxic: its fruit causes paralysis; blue ceanothus adorns pine-oak forests.' },
    species: [
      { sci: 'Karwinskia humboldtiana', es: 'tullidora, coyotillo', en: 'coyotillo', st: 'nat', note: { es: 'Arbusto del norte; su drupa negra es venenosa.', en: 'A northern shrub; its black drupe is poisonous.' }, m: { base: 'typical' } },
      { sci: 'Ceanothus caeruleus', es: 'chaquira, ceanoto azul', en: 'Mexican ceanothus', st: 'nat', note: { es: 'Panículas de flores azules con pétalos en forma de cuchara.', en: 'Panicles of blue flowers with spoon-shaped petals.' }, m: { base: 'typical', G: { w: [{ n: 3, connate: true }], pos: 'half', plac: 'axile', ov: 3 }, colors: { K: '#6a7fe0', C: '#6a7fe0', A: '#d0d8f0' } } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'urticaceae', name: 'Urticaceae', es: 'urticáceas', en: 'nettle family', order: 'Rosales',
    typical: [
      { label: { es: 'Flor estaminada', en: 'Staminate flower' }, m: { sym: 'actino', sex: 'staminate', P: { w: [4], like: 'K' }, A: { w: [{ n: 4, opp: true }] }, G: { w: [{ n: 1, state: 'sterile' }] }, colors: { P: '#a8b86a', A: '#e8e0a8', G: '#c9d88a' } } },
      { label: { es: 'Flor pistilada', en: 'Pistillate flower' }, m: { sym: 'actino', sex: 'pistillate', P: { w: [4], like: 'K' }, G: { w: [1], plac: 'basal', ov: 1 }, look: { stigma: 'plumose' }, colors: { P: '#a8b86a', G: '#9cc76a' } } },
    ],
    chars: { es: ['Hierbas o árboles, a menudo con pelos urticantes (ortigas) y cistolitos en las hojas.', 'Flores diminutas, unisexuales, verdosas, polinizadas por el viento.', 'En la flor estaminada, los estambres están doblados en el botón y se estiran de golpe, lanzando el polen.', 'Flor pistilada con un solo carpelo, un óvulo basal y un estigma en pincel.', 'Incluye a los guarumbos (Cecropia), árboles pioneros de la selva.'],
      en: ['Herbs or trees, often with stinging hairs (nettles) and cystoliths in the leaves.', 'Minute, unisexual, greenish, wind-pollinated flowers.', 'In the staminate flower the stamens are bent inwards in bud and spring out suddenly, throwing the pollen.', 'Pistillate flower with a single carpel, one basal ovule and a brush-like stigma.', 'It includes the trumpet trees (Cecropia), pioneer trees of the rainforest.'] },
    fruit: { es: 'Aquenio, a veces envuelto por el perianto.', en: 'Achene, sometimes enclosed by the perianth.' },
    mx: { es: 'La ortiga es medicinal; el guarumbo es de los primeros árboles en crecer en los claros de la selva y vive en simbiosis con hormigas.', en: 'Nettle is medicinal; trumpet tree is among the first trees in rainforest clearings and lives in symbiosis with ants.' },
    species: [
      { sci: 'Urtica dioica', es: 'ortiga', en: 'stinging nettle', st: 'intro', note: { es: 'Ortiga europea, generalmente dioica; en México crecen además ortigas nativas, como Urtica chichicaxtle. Sus pelos inyectan histamina, acetilcolina y serotonina.', en: 'The European nettle, usually dioecious; Mexico also has native nettles such as Urtica chichicaxtle. Its hairs inject histamine, acetylcholine and serotonin.' }, flowers: [{ label: { es: 'Flor estaminada', en: 'Staminate flower' }, m: { base: 'typical:0' } }, { label: { es: 'Flor pistilada', en: 'Pistillate flower' }, m: { base: 'typical:1' } }] },
      { sci: 'Cecropia obtusifolia', es: 'guarumbo', en: 'trumpet tree', st: 'nat', note: { es: 'Dioico; flores diminutas en espigas carnosas agrupadas como dedos.', en: 'Dioecious; minute flowers in fleshy, finger-like spikes.' } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'moraceae', name: 'Moraceae', es: 'moráceas', en: 'mulberry family', order: 'Rosales',
    typical: [
      { label: { es: 'Flor estaminada', en: 'Staminate flower' }, m: { sym: 'actino', sex: 'staminate', P: { w: [4], like: 'K' }, A: { w: [{ n: 4, opp: true }] }, colors: { P: '#a8b86a', A: '#e8e0a8' } } },
      { label: { es: 'Flor pistilada', en: 'Pistillate flower' }, m: { sym: 'actino', sex: 'pistillate', P: { w: [4], like: 'K' }, G: { w: [{ n: 2, connate: true }], plac: 'apical', loc: 1, ov: 1 }, look: { stigma: 'bifid' }, colors: { P: '#a8b86a', G: '#9cc76a' } } },
    ],
    chars: { es: ['Árboles y arbustos con látex blanco.', 'Estípulas que dejan una cicatriz anular en el nudo (como en los higos).', 'Flores diminutas, unisexuales, en inflorescencias muy variadas: amentos, cabezuelas o el sicono de los higos (un receptáculo hueco).', 'Flor pistilada con ovario de un lóculo y un solo óvulo colgante; dos estigmas.'],
      en: ['Trees and shrubs with white latex.', 'Stipules leaving a ring scar at the node (as in figs).', 'Minute unisexual flowers in very varied inflorescences: catkins, heads or the syconium of figs (a hollow receptacle).', 'Pistillate flower with a one-locular ovary and a single hanging ovule; two stigmas.'] },
    fruit: { es: 'Infrutescencias carnosas: mora (sorosis), higo (sicono), ramón.', en: 'Fleshy infructescences: mulberry (sorosis), fig (syconium), Maya nut.' },
    mx: { es: 'Con la corteza de varios Ficus (amate) se hace papel desde tiempos prehispánicos; las semillas del ramón se comen y sirven de forraje en el área maya.', en: 'The bark of several Ficus (amate) has been made into paper since pre-Hispanic times; Maya nut seeds are eaten and used as fodder in the Maya area.' },
    species: [
      { sci: 'Morus celtidifolia', es: 'mora', en: 'Mexican mulberry', st: 'nat', note: { es: 'Flores de cuatro tépalos; los tépalos de las flores pistiladas se vuelven carnosos.', en: 'Flowers with four tepals; the tepals of pistillate flowers become fleshy.' }, flowers: [{ label: { es: 'Flor estaminada', en: 'Staminate flower' }, m: { base: 'typical:0' } }, { label: { es: 'Flor pistilada', en: 'Pistillate flower' }, m: { base: 'typical:1' } }] },
      { sci: 'Ficus carica', es: 'higo', en: 'fig', st: 'cult', note: { es: 'Mediterráneo; las flores están dentro del sicono y las polinizan avispitas.', en: 'Mediterranean; the flowers are inside the syconium and tiny wasps pollinate them.' } },
      { sci: 'Ficus cotinifolia', es: 'amate', en: 'amate fig', st: 'nat', note: { es: 'Uno de los amates con cuya corteza se hace papel.', en: 'One of the amates whose bark is made into paper.' } },
      { sci: 'Brosimum alicastrum', es: 'ramón, ojite', en: 'Maya nut', st: 'nat', note: { es: 'Árbol de la selva maya; semillas comestibles.', en: 'A tree of the Maya forest; edible seeds.' } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'fagaceae', name: 'Fagaceae', es: 'fagáceas', en: 'beech family', order: 'Fagales',
    typical: [
      { label: { es: 'Flor estaminada (amento)', en: 'Staminate flower (catkin)' }, m: { sym: 'actino', sex: 'staminate', P: { w: [{ n: 6, connate: true }], like: 'K' }, A: { w: [{ n: [6, 12] }] }, colors: { P: '#a8b86a', A: '#e8d67a' } } },
      { label: { es: 'Flor pistilada', en: 'Pistillate flower' }, m: { sym: 'actino', sex: 'pistillate', B: 1, P: { w: [{ n: 6, connate: true }], like: 'K' }, G: { w: [{ n: 3, connate: true }], pos: 'inferior', plac: 'axile', ov: 6 }, look: { stigma: 'lobed' }, colors: { P: '#a8b86a', G: '#8fb86a' } } },
    ],
    chars: { es: ['Árboles y arbustos monoicos; hojas simples, alternas, con estípulas caducas.', 'Flores estaminadas en amentos colgantes, polinizadas por el viento.', 'Flores pistiladas solitarias o en grupos pequeños, rodeadas de una cúpula de escamas.', 'Ovario ínfero de tres (a seis) lóculos con dos óvulos cada uno, de los que solo uno madura.'],
      en: ['Monoecious trees and shrubs; simple, alternate leaves with deciduous stipules.', 'Staminate flowers in hanging, wind-pollinated catkins.', 'Pistillate flowers solitary or in small groups, surrounded by a cupule of scales.', 'Inferior ovary with three (to six) locules and two ovules in each, of which only one matures.'] },
    fruit: { es: 'Nuez (bellota, castaña) en una cúpula.', en: 'Nut (acorn, chestnut) in a cupule.' },
    mx: { es: 'México es el centro de diversidad de los encinos (Quercus), con unas 160 especies, más de la mitad endémicas; su madera y carbón son muy usados.', en: 'Mexico is the centre of oak (Quercus) diversity, with some 160 species, more than half of them endemic; their wood and charcoal are widely used.' },
    species: [
      { sci: 'Quercus rugosa', es: 'encino quiebra hacha', en: 'netleaf oak', st: 'nat', note: { es: 'Hojas gruesas y rugosas; bosques templados.', en: 'Thick, wrinkled leaves; temperate forests.' }, flowers: [{ label: { es: 'Flor estaminada (amento)', en: 'Staminate flower (catkin)' }, m: { base: 'typical:0' } }, { label: { es: 'Flor pistilada', en: 'Pistillate flower' }, m: { base: 'typical:1' } }] },
      { sci: 'Quercus crassipes', es: 'encino tesmilillo', en: 'Mexican red oak', st: 'end', note: { es: 'Encino rojo del centro del país; bellota madura en dos años.', en: 'A red oak of central Mexico; the acorn takes two years to ripen.' } },
      { sci: 'Castanea sativa', es: 'castaño', en: 'sweet chestnut', st: 'cult', note: { es: 'Europeo; cúpula espinosa; ovario de seis lóculos.', en: 'European; spiny cupule; six-locular ovary.' } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'juglandaceae', name: 'Juglandaceae', es: 'juglandáceas', en: 'walnut family', order: 'Fagales',
    typical: [
      { label: { es: 'Flor estaminada (amento)', en: 'Staminate flower (catkin)' }, m: { sym: 'actino', sex: 'staminate', B: 1, Bt: 2, P: { w: [4], like: 'K' }, A: { w: [{ n: [7, 40] }] }, colors: { P: '#a8b86a', A: '#e8d67a' } } },
      { label: { es: 'Flor pistilada', en: 'Pistillate flower' }, m: { sym: 'actino', sex: 'pistillate', B: 1, Bt: 2, P: { w: [4], like: 'K' }, G: { w: [{ n: 2, connate: true }], pos: 'inferior', plac: 'basal', loc: 1, ov: 1 }, look: { stigma: 'plumose' }, colors: { P: '#a8b86a', G: '#8fb86a' } } },
    ],
    chars: { es: ['Árboles monoicos, aromáticos; hojas pinnadas, alternas, sin estípulas.', 'Flores estaminadas en amentos colgantes; flores pistiladas pocas, en espigas cortas.', 'Bráctea y bractéolas soldadas al ovario ínfero.', 'Ovario de dos carpelos con un solo óvulo basal; dos estigmas plumosos; polinización por el viento.'],
      en: ['Aromatic monoecious trees; pinnate, alternate leaves without stipules.', 'Staminate flowers in hanging catkins; few pistillate flowers in short spikes.', 'Bract and bracteoles fused to the inferior ovary.', 'Ovary of two carpels with a single basal ovule; two plumose stigmas; wind pollination.'] },
    fruit: { es: 'Nuez dentro de una cáscara (involucro) verde que se abre (nuez encarcelada) o no (nogal).', en: 'Nut inside a green husk (involucre) that splits (pecan) or not (walnut).' },
    mx: { es: 'El nogal pecanero es nativo del norte y México es gran productor de nuez; la nuez de Castilla va en los chiles en nogada.', en: 'Pecan is native to the north and Mexico is a major producer; English walnut goes into chiles en nogada.' },
    species: [
      { sci: 'Carya illinoinensis', es: 'nogal pecanero, nuez encarcelada', en: 'pecan', st: 'nat', note: { es: 'La flor pistilada carece de perianto propio.', en: 'The pistillate flower lacks a perianth of its own.' } },
      { sci: 'Juglans pyriformis', es: 'nogal de Veracruz', en: 'Veracruz walnut', st: 'end', note: { es: 'Nogal de los bosques de niebla del Golfo; amenazado.', en: 'A walnut of the Gulf cloud forests; threatened.' } },
      { sci: 'Juglans regia', es: 'nuez de Castilla', en: 'English walnut', st: 'cult', note: { es: 'De Asia; amentos gruesos con muchos estambres.', en: 'From Asia; thick catkins with many stamens.' }, flowers: [{ label: { es: 'Flor estaminada (amento)', en: 'Staminate flower (catkin)' }, m: { base: 'typical:0' } }, { label: { es: 'Flor pistilada', en: 'Pistillate flower' }, m: { base: 'typical:1' } }] },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'cucurbitaceae', name: 'Cucurbitaceae', es: 'cucurbitáceas', en: 'gourd family', order: 'Cucurbitales',
    typical: [
      { label: { es: 'Flor estaminada', en: 'Staminate flower' }, m: 'sp:cucurbita:0' },
      { label: { es: 'Flor pistilada', en: 'Pistillate flower' }, m: 'sp:cucurbita:1' },
    ],
    chars: { es: ['Hierbas rastreras o trepadoras con zarcillos espirales a un lado del pecíolo.', 'Plantas casi siempre monoicas, con flores estaminadas y pistiladas separadas.', 'Flores pentámeras, a menudo amarillas, con corola de pétalos unidos.', 'Estambres con anteras retorcidas, a menudo unidas en una columna.', 'Ovario ínfero de tres carpelos con placentación parietal (placentas muy engrosadas).'],
      en: ['Trailing or climbing herbs with coiled tendrils beside the petiole.', 'Plants usually monoecious, with separate staminate and pistillate flowers.', 'Pentamerous, often yellow flowers with a corolla of united petals.', 'Stamens with twisted anthers, often united in a column.', 'Inferior ovary of three carpels with parietal placentation (much thickened placentas).'] },
    fruit: { es: 'Pepónide: baya de corteza dura (calabaza, sandía, pepino).', en: 'Pepo: a berry with a hard rind (squash, watermelon, cucumber).' },
    mx: { es: 'Las calabazas se domesticaron en México hace unos 10,000 años, antes que el maíz; con el maíz y el frijol forman la milpa. El chayote también es mesoamericano.', en: 'Squashes were domesticated in Mexico some 10,000 years ago, before maize; with maize and beans they make up the milpa. Chayote is also Mesoamerican.' },
    species: [
      { sci: 'Cucurbita pepo', es: 'calabaza, calabacita', en: 'squash, zucchini', st: 'dom', note: { es: 'La flor de calabaza (estaminada) se come en quesadillas.', en: 'The (staminate) squash blossom is eaten in quesadillas.' }, flowers: [{ label: { es: 'Flor estaminada', en: 'Staminate flower' }, m: 'sp:cucurbita:0' }, { label: { es: 'Flor pistilada', en: 'Pistillate flower' }, m: 'sp:cucurbita:1' }] },
      { sci: 'Cucurbita moschata', es: 'calabaza de Castilla', en: 'butternut squash', st: 'dom', note: { es: 'Pedúnculo acampanado en la base del fruto; domesticada en América, su origen exacto se discute.', en: 'Stalk flared at the base of the fruit; domesticated in the Americas, its exact origin is debated.' } },
      { sci: 'Cucurbita ficifolia', es: 'chilacayote', en: 'fig-leaf gourd', st: 'dom', note: { es: 'Perenne, de clima fresco; con su pulpa se hacen dulces. Su origen (México o los Andes) se discute.', en: 'A perennial of cool climates; its flesh is made into sweets. Its origin (Mexico or the Andes) is debated.' } },
      { sci: 'Sechium edule', es: 'chayote', en: 'chayote', st: 'dom', note: { es: 'Ovario de un solo óvulo: el fruto tiene una sola semilla, que germina dentro.', en: 'Ovary with a single ovule: the fruit has one seed, which germinates inside it.' } },
      { sci: 'Citrullus lanatus', es: 'sandía', en: 'watermelon', st: 'cult', note: { es: 'Africana; flores pequeñas, amarillo pálido.', en: 'African; small, pale yellow flowers.' } },
      { sci: 'Cucumis sativus', es: 'pepino', en: 'cucumber', st: 'cult', note: { es: 'De la India; estambres libres.', en: 'From India; free stamens.' } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'euphorbiaceae', name: 'Euphorbiaceae', es: 'euforbiáceas', en: 'spurge family', order: 'Malpighiales',
    typical: [
      { label: { es: 'Flor estaminada', en: 'Staminate flower' }, m: { sym: 'actino', sex: 'staminate', P: { w: [5], like: 'K' }, A: { w: [{ n: '∞' }] }, colors: { P: '#a8b86a', A: '#f0e08a' } } },
      { label: { es: 'Flor pistilada', en: 'Pistillate flower' }, m: { sym: 'actino', sex: 'pistillate', P: { w: [5], like: 'K' }, G: { w: [{ n: 3, connate: true }], plac: 'axile', ov: 3 }, look: { stigma: 'bifid' }, colors: { P: '#a8b86a', G: '#c94a3a' } } },
    ],
    variants: [
      { label: { es: 'Ciatio de Euphorbia: flor estaminada (un estambre)', en: 'Euphorbia cyathium: staminate flower (one stamen)' }, m: { sym: 'actino', sex: 'staminate', A: { w: [1] }, colors: { A: '#f2c12e' } } },
      { label: { es: 'Ciatio de Euphorbia: flor pistilada (un pistilo desnudo)', en: 'Euphorbia cyathium: pistillate flower (a naked pistil)' }, m: { sym: 'actino', sex: 'pistillate', G: { w: [{ n: 3, connate: true }], plac: 'axile', ov: 3 }, look: { stigma: 'bifid' }, colors: { G: '#8fb86a' } } },
    ],
    chars: { es: ['Hierbas, arbustos o árboles, a menudo con látex blanco y tóxico.', 'Flores unisexuales, casi siempre sin pétalos.', 'En Euphorbia, las flores forman un ciatio: una copa de brácteas con glándulas que encierra varias flores estaminadas de un estambre y una flor pistilada central; parece una sola flor.', 'Ovario súpero de tres carpelos, con un óvulo colgante por lóculo.'],
      en: ['Herbs, shrubs or trees, often with white, toxic latex.', 'Unisexual flowers, usually without petals.', 'In Euphorbia the flowers form a cyathium: a cup of glandular bracts holding several one-stamen staminate flowers and a central pistillate flower; it looks like a single flower.', 'Superior ovary of three carpels, with one hanging ovule per locule.'] },
    fruit: { es: 'Esquizocarpo que se separa en tres cocos y lanza las semillas, a menudo con carúncula.', en: 'Schizocarp that splits into three cocci and ejects the seeds, often carunculate.' },
    mx: { es: 'La nochebuena (cuetlaxóchitl) es nativa de México y hoy es la planta en maceta que más se vende en Navidad en muchos países; la chaya es quelite maya; la yuca y la higuerilla se cultivan.', en: 'Poinsettia (cuetlaxochitl) is native to Mexico and is now the best-selling Christmas pot plant in many countries; chaya is a Maya green; cassava and castor are grown.' },
    species: [
      { sci: 'Euphorbia pulcherrima', es: 'nochebuena, cuetlaxóchitl', en: 'poinsettia', st: 'nat', note: { es: 'Lo rojo son brácteas; las flores están en ciatios amarillos al centro.', en: 'The red parts are bracts; the flowers are in yellow cyathia in the centre.' }, flowers: [{ label: { es: 'Flor estaminada del ciatio', en: 'Staminate flower of the cyathium' }, m: { base: 'variant:0' } }, { label: { es: 'Flor pistilada del ciatio', en: 'Pistillate flower of the cyathium' }, m: { base: 'variant:1' } }] },
      { sci: 'Ricinus communis', es: 'higuerilla', en: 'castor bean', st: 'intro', note: { es: 'Estambres numerosos con los filamentos unidos en haces muy ramificados; estigmas rojos y plumosos; semilla muy tóxica.', en: 'Numerous stamens with filaments united in much-branched bundles; red feathery stigmas; very toxic seed.' }, flowers: [{ label: { es: 'Flor estaminada', en: 'Staminate flower' }, m: { base: 'typical:0', A: { w: [{ n: [5, 10], fasc: { g: [5, 10], per: '∞' } }] } } }, { label: { es: 'Flor pistilada', en: 'Pistillate flower' }, m: { base: 'typical:1' } }] },
      { sci: 'Manihot esculenta', es: 'yuca', en: 'cassava', st: 'cult', note: { es: 'Sudamericana; se come la raíz tuberosa, tras eliminar su cianuro.', en: 'South American; the tuberous root is eaten after removing its cyanide.' } },
      { sci: 'Jatropha curcas', es: 'piñón', en: 'physic nut', st: 'nat', note: { es: 'Sí tiene pétalos; en Veracruz y Puebla hay variedades no tóxicas que se comen.', en: 'It does have petals; in Veracruz and Puebla there are non-toxic varieties that are eaten.' } },
      { sci: 'Cnidoscolus aconitifolius', es: 'chaya', en: 'chaya', st: 'dom', note: { es: 'Quelite maya; cáliz blanco petaloide.', en: 'A Maya green; white petaloid calyx.' } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'passifloraceae', name: 'Passifloraceae', es: 'pasifloráceas', en: 'passion-flower family', order: 'Malpighiales',
    typical: { sym: 'actino', hyp: 'cup', K: { w: [5] }, C: { w: [5] }, corona: { n: 60, color: '#7e57c2' }, A: { w: [5] }, G: { w: [{ n: 3, connate: true }], plac: 'parietal', ov: '∞' }, look: { stigma: 'capitate' }, colors: { K: '#8aa04a', C: '#f6f3f0', A: '#e8d67a', G: '#9cc76a' } },
    chars: { es: ['Trepadoras con zarcillos axilares (Passiflora) o hierbas y arbustos (Turnera).', 'Flores con hipanto; entre la corola y los estambres, una corona de filamentos de colores.', 'Estambres y ovario elevados sobre una columna (androginóforo) en Passiflora.', 'Ovario súpero de un lóculo con tres placentas parietales y tres estilos.', 'En sentido amplio (APG IV) incluye a las turneráceas.'],
      en: ['Climbers with axillary tendrils (Passiflora) or herbs and shrubs (Turnera).', 'Flowers with a hypanthium; between corolla and stamens, a corona of coloured filaments.', 'Stamens and ovary raised on a column (androgynophore) in Passiflora.', 'Superior ovary with one locule, three parietal placentas and three styles.', 'In the broad sense (APG IV) it includes the Turneraceae.'] },
    fruit: { es: 'Baya con semillas envueltas en arilo jugoso (maracuyá, granadilla) o cápsula (Turnera).', en: 'Berry with seeds wrapped in a juicy aril (passion fruit, granadilla) or capsule (Turnera).' },
    mx: { es: 'Hay muchas Passiflora nativas; la granadilla, andina, se cultiva en el sur; la damiana es medicinal y se usa en licores de Baja California Sur.', en: 'There are many native Passiflora; sweet granadilla, from the Andes, is grown in the south; damiana is medicinal and used in liqueurs from Baja California Sur.' },
    species: [
      { sci: 'Passiflora edulis', es: 'maracuyá', en: 'passion fruit', st: 'cult', note: { es: 'Sudamericana; corona morada y blanca.', en: 'South American; purple and white corona.' }, m: { base: 'typical' } },
      { sci: 'Passiflora ligularis', es: 'granadilla', en: 'sweet granadilla', st: 'cult', note: { es: 'Andina (algunos autores extienden su área hasta el sur de México); fruto anaranjado con arilo dulce.', en: 'Andean (some authors extend its range to southern Mexico); orange fruit with a sweet aril.' }, m: { base: 'typical', corona: { n: 60, color: '#9b6bd1' } } },
      { sci: 'Turnera diffusa', es: 'damiana', en: 'damiana', st: 'nat', note: { es: 'Sin corona; pétalos amarillos insertos en la garganta de un tubo floral; tres estilos con estigmas en pincel.', en: 'No corona; yellow petals inserted at the throat of a floral tube; three styles with brush-like stigmas.' }, m: { sym: 'actino', hyp: 'tube', K: { w: [{ n: 5, connate: true }] }, C: { w: [5] }, A: { w: [5] }, G: { w: [{ n: 3, connate: true }], plac: 'parietal', ov: '∞' }, look: { stigma: 'lobed' }, colors: { K: '#8aa04a', C: '#f6d937', A: '#f0c23a', G: '#9cc76a' } } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'salicaceae', name: 'Salicaceae', es: 'salicáceas', en: 'willow family', order: 'Malpighiales',
    typical: [
      { label: { es: 'Flor estaminada (sauce)', en: 'Staminate flower (willow)' }, m: { sym: 'actino', sex: 'staminate', B: 1, A: { w: [2] }, colors: { A: '#f2d34a' } } },
      { label: { es: 'Flor pistilada (sauce)', en: 'Pistillate flower (willow)' }, m: { sym: 'actino', sex: 'pistillate', B: 1, G: { w: [{ n: 2, connate: true }], plac: 'parietal', ov: '∞' }, look: { stigma: 'bifid' }, colors: { G: '#9cc76a' } } },
    ],
    chars: { es: ['Árboles y arbustos dioicos, de lugares húmedos (sauces, álamos).', 'Flores desnudas en amentos, cada una en la axila de una bráctea, con glándulas nectaríferas (sauce) o un disco en copa (álamo).', 'Flor estaminada de dos a muchos estambres.', 'Ovario súpero de dos carpelos, un lóculo y placentación parietal.', 'En sentido amplio (APG IV) incluye muchos géneros tropicales antes en las flacourtiáceas.'],
      en: ['Dioecious trees and shrubs of damp places (willows, poplars).', 'Naked flowers in catkins, each in the axil of a bract, with nectar glands (willow) or a cup-shaped disc (poplar).', 'Staminate flower with two to many stamens.', 'Superior ovary of two carpels, one locule and parietal placentation.', 'In the broad sense (APG IV) it includes many tropical genera formerly in the Flacourtiaceae.'] },
    fruit: { es: 'Cápsula con semillas diminutas cubiertas de pelos algodonosos.', en: 'Capsule with minute seeds covered in cottony hairs.' },
    mx: { es: 'El ahuejote sostiene las chinampas de Xochimilco con sus raíces; los álamos bordean ríos del norte.', en: 'Ahuejote willow holds the chinampas of Xochimilco together with its roots; cottonwoods line northern rivers.' },
    species: [
      { sci: 'Salix bonplandiana', es: 'ahuejote', en: 'Bonpland willow', st: 'nat', note: { es: 'De tronco erguido y copa angosta; plantado en los bordes de las chinampas.', en: 'Upright trunk and narrow crown; planted along the edges of chinampas.' } },
      { sci: 'Populus fremontii', es: 'álamo', en: 'Fremont cottonwood', st: 'nat', note: { es: 'Polinizado por el viento; cada flor se asienta en un disco en copa que no produce néctar; flores estaminadas con muchos estambres.', en: 'Wind-pollinated; each flower sits in a cup-shaped disc that makes no nectar; staminate flowers with many stamens.' },
        flowers: [
          { label: { es: 'Flor estaminada', en: 'Staminate flower' }, m: { base: 'typical:0', A: { w: [{ n: [30, 60] }] }, colors: { A: '#c0392b' } } },
          { label: { es: 'Flor pistilada', en: 'Pistillate flower' }, m: { base: 'typical:1', G: { w: [{ n: [2, 3], connate: true }], plac: 'parietal', ov: '∞' }, look: { stigma: 'lobed' } } },
        ] },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'violaceae', name: 'Violaceae', es: 'violáceas', en: 'violet family', order: 'Malpighiales',
    typical: { sym: 'zygo', B: 1, Bt: 2, K: { w: [5] }, C: { w: [{ parts: [{ n: 2, label: { es: 'superiores', en: 'upper' } }, { n: 2, label: { es: 'laterales', en: 'lateral' } }, { n: 1, label: { es: 'inferior, con espolón', en: 'lower, spurred' }, size: 1.3 }] }], aest: 'imbricate' }, A: { w: [5] }, G: { w: [{ n: 3, connate: true }], plac: 'parietal', ov: '∞' }, look: { stigma: 'capitate' }, colors: { K: '#6f9a45', C: '#7e57c2', A: '#f2c12e', G: '#9cc76a' } },
    chars: { es: ['Hierbas (en regiones templadas) o arbustos y árboles (en el trópico).', 'Flores zigomorfas con el pétalo inferior prolongado en un espolón.', 'Cinco estambres con las anteras juntas alrededor del ovario; los dos inferiores con apéndices nectaríferos dentro del espolón.', 'Ovario súpero de un lóculo con tres placentas parietales.'],
      en: ['Herbs (in temperate regions) or shrubs and trees (in the tropics).', 'Zygomorphic flowers with the lower petal extended into a spur.', 'Five stamens with the anthers close together around the ovary; the two lower ones with nectar appendages inside the spur.', 'Superior ovary with one locule and three parietal placentas.'] },
    fruit: { es: 'Cápsula que abre en tres valvas y lanza las semillas.', en: 'Capsule that splits into three valves and ejects the seeds.' },
    mx: { es: 'Hay violetas nativas en los bosques de montaña; pensamientos y violetas perfumadas se cultivan como ornamentales.', en: 'There are native violets in mountain forests; pansies and sweet violets are grown as ornamentals.' },
    species: [
      { sci: 'Viola odorata', es: 'violeta', en: 'sweet violet', st: 'cult', note: { es: 'Europea; flores perfumadas.', en: 'European; fragrant flowers.' }, m: { base: 'typical' } },
      { sci: 'Viola × wittrockiana', es: 'pensamiento', en: 'garden pansy', st: 'cult', note: { es: 'Híbrido de jardín; los cuatro pétalos superiores apuntan hacia arriba.', en: 'A garden hybrid; the four upper petals point upwards.' }, m: { base: 'typical', colors: { C: '#f2c12e' } } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'malpighiaceae', name: 'Malpighiaceae', es: 'malpighiáceas', en: 'Barbados-cherry family', order: 'Malpighiales',
    typical: { sym: 'zygo', K: { w: [5] }, C: { w: [{ parts: [{ n: 1, label: { es: 'pétalo estandarte', en: 'flag petal' }, size: 1.1 }, { n: 4 }] }] }, A: { w: [5, 5], connate: true }, G: { w: [{ n: 3, connate: true }], plac: 'axile', ov: 3 }, look: { stigma: 'punctiform' }, colors: { K: '#8aa04a', C: '#f2c12e', A: '#e8b83a', G: '#9cc76a' } },
    chars: { es: ['Árboles, arbustos o trepadoras; hojas opuestas; pelos en forma de T (malpighiáceos).', 'Sépalos con pares de glándulas de aceite por fuera (elaióforos) que visitan abejas recolectoras de aceite.', 'Pétalos con uña larga, a menudo con el borde flecado; el posterior (estandarte) distinto.', 'Diez estambres unidos en la base; ovario súpero de tres carpelos con un óvulo cada uno y tres estilos.'],
      en: ['Trees, shrubs or climbers; opposite leaves; T-shaped (malpighiaceous) hairs.', 'Sepals with pairs of oil glands on the outside (elaiophores) visited by oil-collecting bees.', 'Clawed petals, often with a fringed margin; the posterior (flag) petal distinct.', 'Ten stamens joined at the base; superior ovary of three carpels, each with one ovule, and three styles.'] },
    fruit: { es: 'Drupa (nanche, acerola) o sámaras aladas.', en: 'Drupe (nance, acerola) or winged samaras.' },
    mx: { es: 'El nanche es fruta popular del trópico; la calderona (Galphimia) es medicinal; muchas trepadoras de la selva seca.', en: 'Nance is a popular tropical fruit; Galphimia is medicinal; many climbers of the dry forest.' },
    species: [
      { sci: 'Byrsonima crassifolia', es: 'nanche', en: 'nance', st: 'nat', note: { es: 'Flores amarillas que se vuelven rojizas; fruto amarillo aromático.', en: 'Yellow flowers that turn reddish; aromatic yellow fruit.' }, m: { base: 'typical' } },
      { sci: 'Malpighia emarginata', es: 'acerola, nanche de Castilla', en: 'acerola', st: 'nat', note: { es: 'Pétalos rosados; fruto muy rico en vitamina C.', en: 'Pink petals; fruit very rich in vitamin C.' }, m: { base: 'typical', colors: { C: '#e8638a' } } },
      { sci: 'Galphimia glauca', es: 'calderona, flor de estrella', en: 'thryallis', st: 'nat', note: { es: 'A diferencia de la mayoría de las malpighiáceas americanas, sus sépalos no tienen glándulas.', en: 'Unlike most American Malpighiaceae, its sepals lack glands.' }, m: { base: 'typical' } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'oxalidaceae', name: 'Oxalidaceae', es: 'oxalidáceas', en: 'wood-sorrel family', order: 'Oxalidales',
    typical: { sym: 'actino', K: { w: [5] }, C: { w: [5], aest: 'contort' }, A: { w: [{ n: 5, opp: true }, 5], connate: true }, G: { w: [{ n: 5, connate: true }], plac: 'axile', ov: '∞' }, look: { stigma: 'capitate' }, colors: { K: '#8aa04a', C: '#e8638a', A: '#f2d34a', G: '#9cc76a' } },
    chars: { es: ['Hierbas (Oxalis) o árboles (carambola) con ácido oxálico (sabor agrio).', 'Hojas compuestas, a menudo trifolioladas, que se pliegan de noche.', 'Pétalos con prefloración contorta; diez estambres unidos en la base, en dos alturas.', 'Ovario súpero de cinco carpelos y cinco estilos; muchas especies son heterostilas (tres longitudes de estilo).'],
      en: ['Herbs (Oxalis) or trees (carambola) containing oxalic acid (sour taste).', 'Compound, often trifoliolate leaves that fold at night.', 'Contort petals; ten stamens joined at the base, at two heights.', 'Superior ovary of five carpels and five styles; many species are heterostylous (three style lengths).'] },
    fruit: { es: 'Cápsula que lanza las semillas o baya carnosa (carambola).', en: 'Capsule that ejects the seeds, or a fleshy berry (carambola).' },
    mx: { es: 'Los agritos (Oxalis) son nativos y se comen; el trébol de cuatro hojas de jardín es Oxalis tetraphylla.', en: 'Wood sorrels (Oxalis) are native and edible; the garden "four-leaf clover" is Oxalis tetraphylla.' },
    species: [
      { sci: 'Oxalis tetraphylla', es: 'agrito, trébol de cuatro hojas', en: 'four-leaved pink-sorrel', st: 'nat', note: { es: 'Hojas de cuatro folíolos con una banda morada.', en: 'Leaves of four leaflets with a purple band.' }, m: { base: 'typical' } },
      { sci: 'Averrhoa carambola', es: 'carambola', en: 'star fruit', st: 'cult', note: { es: 'Del sureste de Asia; cinco estambres fértiles y cinco estaminodios; fruto de cinco costillas.', en: 'From South-East Asia; five fertile stamens and five staminodes; five-ribbed fruit.' }, m: { base: 'typical', A: { w: [{ n: 5, opp: true, state: 'sterile' }, 5], connate: true }, colors: { C: '#b0476a' } } },
    ] },
]);
