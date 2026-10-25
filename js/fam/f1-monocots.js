/* FloralPro — families 1–22: early-diverging angiosperms, magnoliids and monocots. */
FAMILIES_ADD([
  /* ------------------------------------------------------------------ */
  { id: 'nymphaeaceae', name: 'Nymphaeaceae', es: 'ninfáceas (nenúfares)', en: 'water lily family', order: 'Nymphaeales',
    typical: { sym: 'actino', K: { w: [4] }, C: { w: [{ n: [8, '∞'] }] }, A: { w: [{ n: '∞' }] }, G: { w: [{ n: [5, 35], connate: true }], pos: 'half', plac: 'laminar', ov: '∞' }, look: { stigma: 'discoid' }, colors: { K: '#5f8f45', C: '#f7f4fb', A: '#f2c12e', G: '#c9d88a' } },
    chars: { es: ['Hierbas acuáticas con rizoma y hojas flotantes, a menudo peltadas.', 'Flores grandes y solitarias; cuatro a seis sépalos.', 'Pétalos numerosos, en espiral, que pasan gradualmente a estambres laminares.', 'Carpelos unidos, hundidos en el receptáculo, con los estigmas en un disco radiado.', 'Placentación laminar: los óvulos cubren las caras de los tabiques.'],
      en: ['Aquatic herbs with a rhizome and floating, often peltate leaves.', 'Large solitary flowers; four to six sepals.', 'Numerous spirally arranged petals grading into laminar stamens.', 'United carpels sunk in the receptacle, with the stigmas on a radiate disc.', 'Laminar placentation: ovules cover the faces of the septa.'] },
    fruit: { es: 'Baya esponjosa que madura bajo el agua; semillas con arilo.', en: 'Spongy berry that ripens under water; arillate seeds.' },
    mx: { es: 'Nymphaea mexicana crece en el norte y N. ampla en lagunas tropicales; varias especies se cultivan en estanques.', en: 'Nymphaea mexicana grows in the north and N. ampla in tropical lagoons; several species are grown in ponds.' },
    species: [
      { sci: 'Nymphaea mexicana', es: 'ninfa amarilla', en: 'yellow water lily', st: 'nat', note: { es: 'Flores amarillas que abren de día.', en: 'Yellow flowers that open by day.' }, m: { base: 'typical', colors: { C: '#f6e27a', K: '#8aa04a' } } },
      { sci: 'Nymphaea ampla', es: 'ninfa blanca', en: 'dotleaf waterlily', st: 'nat', note: { es: 'Flores blancas grandes de las lagunas tropicales.', en: 'Large white flowers of tropical lagoons.' }, m: { base: 'typical' } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'magnoliaceae', name: 'Magnoliaceae', es: 'magnoliáceas', en: 'magnolia family', order: 'Magnoliales',
    typical: { sym: 'actino', B: 1, P: { w: [3, 3, 3], like: 'C' }, A: { w: [{ n: '∞' }] }, G: { w: [{ n: '∞' }], plac: 'marginal', ov: 2 }, look: { receptacle: 'elongate' }, colors: { P: '#fbf6e6', A: '#e6c98a', G: '#b9c98a' } },
    chars: { es: ['Árboles o arbustos aromáticos; hojas simples alternas.', 'Estípulas que envuelven la yema y dejan una cicatriz anular en el nudo.', 'Flores grandes, solitarias y terminales.', 'Tépalos en verticilos de tres; los externos a menudo sepaloides.', 'Estambres y carpelos numerosos, libres, en espiral sobre un receptáculo alargado (flor hemicíclica).'],
      en: ['Aromatic trees or shrubs; simple alternate leaves.', 'Stipules enclosing the bud and leaving a ring scar at the node.', 'Large, solitary, terminal flowers.', 'Tepals in whorls of three; the outer ones often sepaloid.', 'Numerous free stamens and carpels spirally arranged on an elongated receptacle (hemicyclic flower).'] },
    fruit: { es: 'Agregado de folículos en forma de cono; semillas rojas o anaranjadas que cuelgan de un hilo.', en: 'Cone-like aggregate of follicles; red or orange seeds hanging on a thread.' },
    mx: { es: 'México tiene más de 30 especies de Magnolia, muchas endémicas y amenazadas; el yoloxóchitl («flor del corazón») se usa en la medicina tradicional.', en: 'Mexico has over 30 Magnolia species, many endemic and threatened; yoloxóchitl ("heart flower") is used in traditional medicine.' },
    species: [
      { sci: 'Magnolia mexicana', es: 'yoloxóchitl', en: 'yoloxochitl', st: 'end', note: { es: 'Tépalos blancos, gruesos, muy aromáticos. Es de la sección Talauma: sus carpelos se sueldan en un fruto leñoso que se abre en rebanadas.', en: 'Thick, very fragrant white tepals. It belongs to section Talauma: its carpels fuse into a woody fruit that splits into slices.' }, m: { base: 'typical' } },
      { sci: 'Magnolia dealbata', es: 'eloxóchitl', en: 'Mexican bigleaf magnolia', st: 'end', note: { es: 'Especie de bosque mesófilo, en peligro.', en: 'A cloud-forest species, endangered.' }, m: { base: 'typical' } },
      { sci: 'Magnolia grandiflora', es: 'magnolia', en: 'southern magnolia', st: 'cult', note: { es: 'Del sureste de Estados Unidos; muy plantada en parques.', en: 'From the south-eastern United States; widely planted in parks.' }, m: 'sp:magnolia' },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'annonaceae', name: 'Annonaceae', es: 'anonáceas', en: 'custard-apple family', order: 'Magnoliales',
    typical: { sym: 'actino', K: { w: [3], aest: 'valvate' }, C: { w: [3, 3], aest: 'valvate' }, A: { w: [{ n: '∞' }] }, G: { w: [{ n: '∞' }], plac: 'basal', ov: 1 }, colors: { K: '#6f8f4a', C: '#e8dcae', A: '#efe0b0', G: '#cfc38a' } },
    chars: { es: ['Árboles o arbustos aromáticos; hojas simples, alternas, dispuestas en dos filas, sin estípulas.', 'Flores trímeras: tres sépalos y seis pétalos carnosos en dos verticilos, con prefloración valvar.', 'Estambres numerosos en espiral, con el conectivo prolongado en un escudo.', 'Carpelos numerosos y libres en la flor, que en Annona se sueldan al madurar.'],
      en: ['Aromatic trees or shrubs; simple, alternate leaves in two rows, without stipules.', 'Trimerous flowers: three sepals and six fleshy petals in two whorls, valvate.', 'Numerous spirally arranged stamens with the connective extended into a shield.', 'Numerous carpels, free in the flower, which fuse as they ripen in Annona.'] },
    fruit: { es: 'Sincarpo carnoso (guanábana, chirimoya) o agregado de carpelos libres.', en: 'Fleshy syncarp (soursop, cherimoya) or aggregate of free carpels.' },
    mx: { es: 'Guanábana, chirimoya y saramuyo son de origen americano y se cultivan en el trópico y los valles templados; el orejuelo aromatizaba el chocolate prehispánico.', en: 'Soursop, cherimoya and sugar apple are of American origin and are grown in the tropics and temperate valleys; orejuelo flavoured pre-Hispanic chocolate.' },
    species: [
      { sci: 'Annona muricata', es: 'guanábana', en: 'soursop', st: 'nat', note: { es: 'Nativa del sur de México a Sudamérica; pétalos externos gruesos y verdosos.', en: 'Native from southern Mexico to South America; thick greenish outer petals.' }, m: { base: 'typical' } },
      { sci: 'Annona cherimola', es: 'chirimoya', en: 'cherimoya', st: 'dom', note: { es: 'Fruta de clima templado; los estudios genéticos apuntan a un origen mesoamericano. Los pétalos internos son diminutos o faltan.', en: 'A fruit of mild climates; genetic studies point to a Mesoamerican origin. The inner petals are minute or absent.' }, m: { base: 'typical', C: { w: [3, { parts: [{ n: 3, size: 0.3, label: { es: 'internos diminutos', en: 'minute inner petals' } }] }], aest: 'valvate' } } },
      { sci: 'Annona squamosa', es: 'saramuyo', en: 'sugar apple', st: 'nat', note: { es: 'Fruto con segmentos que se separan al madurar.', en: 'Fruit whose segments come apart when ripe.' } },
      { sci: 'Cymbopetalum penduliflorum', es: 'orejuelo, xochinacaztli', en: 'ear flower', st: 'nat', note: { es: 'Sus pétalos carnosos se usaban como especia.', en: 'Its fleshy petals were used as a spice.' } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'lauraceae', name: 'Lauraceae', es: 'lauráceas', en: 'laurel family', order: 'Laurales',
    typical: { sym: 'actino', P: { w: [3, 3], like: 'K' }, A: { w: [3, 3, 3, { n: 3, state: 'sterile' }] }, G: { w: [1], plac: 'apical', ov: 1 }, look: { dehisc: 'valvular' }, colors: { P: '#c9d88a', A: '#e3c35a', G: '#9cc76a' } },
    chars: { es: ['Árboles y arbustos aromáticos, con aceites esenciales.', 'Hojas simples, alternas, sin estípulas.', 'Flores pequeñas, trímeras, con seis tépalos.', 'Estambres en cuatro verticilos de tres: el tercero con glándulas en la base y el cuarto estéril.', 'Anteras que abren por valvas que se levantan.', 'Un solo carpelo con un óvulo colgante.'],
      en: ['Aromatic trees and shrubs with essential oils.', 'Simple, alternate leaves without stipules.', 'Small trimerous flowers with six tepals.', 'Stamens in four whorls of three: the third with basal glands, the fourth sterile.', 'Anthers that open by lifting flaps.', 'A single carpel with one hanging ovule.'] },
    fruit: { es: 'Drupa o baya de una sola semilla, a veces sobre una cúpula formada por el receptáculo.', en: 'Single-seeded drupe or berry, sometimes on a cup formed by the receptacle.' },
    mx: { es: 'El aguacate se domesticó en Mesoamérica y México es su mayor productor; el laurel mexicano se usa como condimento y en ritos.', en: 'Avocado was domesticated in Mesoamerica and Mexico is its largest producer; Mexican bay is used as a spice and in rituals.' },
    species: [
      { sci: 'Persea americana', es: 'aguacate', en: 'avocado', st: 'dom', note: { es: 'Sus flores abren dos veces, una como femeninas y otra como masculinas (dicogamia).', en: 'Its flowers open twice, first as female and then as male (dichogamy).' }, m: { base: 'typical' } },
      { sci: 'Litsea glaucescens', es: 'laurel mexicano', en: 'Mexican bay', st: 'nat', note: { es: 'Planta dioica: flores unisexuales en plantas separadas.', en: 'A dioecious plant: unisexual flowers on separate plants.' } },
      { sci: 'Cinnamomum verum', es: 'canela', en: 'cinnamon', st: 'cult', note: { es: 'La canela es la corteza; originaria de Sri Lanka.', en: 'Cinnamon is the bark; native to Sri Lanka.' }, m: { base: 'typical' } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'piperaceae', name: 'Piperaceae', es: 'piperáceas', en: 'pepper family', order: 'Piperales',
    typical: { sym: 'actino', B: 1, A: { w: [{ n: [2, 6] }] }, G: { w: [{ n: [3, 4], connate: true }], plac: 'basal', loc: 1, ov: 1 }, look: { stigma: 'lobed' }, colors: { A: '#e8e0a8', G: '#b9cf88' } },
    chars: { es: ['Hierbas, arbustos o trepadoras aromáticas con nudos engrosados.', 'Hojas simples, alternas, a menudo asimétricas en la base.', 'Flores diminutas, sin perianto, apretadas en espigas; cada una protegida por una bráctea peltada.', 'Ovario súpero de un lóculo con un solo óvulo basal.'],
      en: ['Aromatic herbs, shrubs or climbers with swollen nodes.', 'Simple alternate leaves, often unequal at the base.', 'Minute flowers without a perianth, crowded in spikes; each sheltered by a peltate bract.', 'Superior ovary with one locule and a single basal ovule.'] },
    fruit: { es: 'Drupa pequeña (el grano de pimienta).', en: 'Small drupe (the peppercorn).' },
    mx: { es: 'La hoja santa, acuyo o tlanepa es condimento del sur; muchas Peperomia crecen como epífitas.', en: 'Hoja santa is a spice of the south; many Peperomia grow as epiphytes.' },
    species: [
      { sci: 'Piper auritum', es: 'hoja santa, acuyo', en: 'hoja santa', st: 'nat', note: { es: 'Hojas grandes con olor anisado; espigas blancas colgantes.', en: 'Large anise-scented leaves; hanging white spikes.' }, m: { base: 'typical' } },
      { sci: 'Piper nigrum', es: 'pimienta', en: 'black pepper', st: 'cult', note: { es: 'Trepadora de la India; la pimienta negra es el fruto seco.', en: 'A climber from India; black pepper is the dried fruit.' }, m: { base: 'typical' } },
      { sci: 'Peperomia obtusifolia', es: 'peperomia', en: 'baby rubber plant', st: 'nat', note: { es: 'Hojas carnosas; espigas delgadas.', en: 'Fleshy leaves; slender spikes.' } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'aristolochiaceae', name: 'Aristolochiaceae', es: 'aristoloquiáceas', en: 'birthwort family', order: 'Piperales',
    typical: { sym: 'zygo', P: { w: [{ connate: true, parts: [{ n: 1, size: 1.4 }, { n: 2 }] }], like: 'C' }, A: { w: [6] }, G: { w: [{ n: 6, connate: true }], pos: 'inferior', plac: 'axile', ov: '∞' }, adn: [['A', 'G']], look: { corolla: 'tubular' }, colors: { P: '#8a4a2e', A: '#e8d6a0', G: '#9cc76a' } },
    chars: { es: ['Trepadoras o hierbas; hojas simples, alternas, a menudo acorazonadas.', 'Perianto de un solo verticilo, tubular, a menudo curvado y con olor a carroña que atrae moscas.', 'Estambres unidos al estilo en un ginostemio.', 'Ovario ínfero de seis lóculos.'],
      en: ['Climbers or herbs; simple, alternate, often heart-shaped leaves.', 'A single-whorled perianth, tubular, often bent and carrion-scented to attract flies.', 'Stamens united with the style in a gynostemium.', 'Inferior ovary with six locules.'] },
    fruit: { es: 'Cápsula; semillas aplanadas.', en: 'Capsule; flattened seeds.' },
    mx: { es: 'La flor de pato tiene una de las flores más grandes de la flora mexicana; el guaco es medicinal, pero sus ácidos aristolóquicos son tóxicos.', en: 'Pelican flower has one of the largest flowers of the Mexican flora; guaco is medicinal, but its aristolochic acids are toxic.' },
    species: [
      { sci: 'Aristolochia grandiflora', es: 'flor de pato', en: 'pelican flower', st: 'nat', note: { es: 'Perianto enorme, jaspeado, con un apéndice largo.', en: 'Huge mottled perianth with a long tail.' }, m: { base: 'typical' } },
      { sci: 'Aristolochia taliscana', es: 'guaco', en: 'guaco', st: 'end', note: { es: 'Raíz usada en medicina tradicional.', en: 'Root used in traditional medicine.' } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'araceae', name: 'Araceae', es: 'aráceas', en: 'arum family', order: 'Alismatales',
    typical: { sym: 'actino', P: { w: [2, 2], like: 'K' }, A: { w: [2, 2] }, G: { w: [{ n: 2, connate: true }], plac: 'axile', ov: 2 }, colors: { P: '#e6dca0', A: '#f0e08a', G: '#c9d88a' } },
    variants: [
      { label: { es: 'Flor desnuda (Monstera)', en: 'Naked flower (Monstera)' }, m: { sym: 'actino', A: { w: [4] }, G: { w: [{ n: 2, connate: true }], plac: 'axile', ov: 4 }, colors: { A: '#f0e8c0', G: '#e8dca0' } } },
    ],
    chars: { es: ['Hierbas, a menudo trepadoras o epífitas, con rafidios (cristales que irritan la boca).', 'Hojas grandes, a menudo con nervación reticulada.', 'Inflorescencia en espádice, envuelta por una espata con frecuencia vistosa.', 'Flores diminutas, hermafroditas o unisexuales (las femeninas abajo y las masculinas arriba del espádice).'],
      en: ['Herbs, often climbing or epiphytic, with raphides (crystals that irritate the mouth).', 'Large leaves, often with reticulate venation.', 'Inflorescence a spadix, enclosed by an often showy spathe.', 'Minute flowers, bisexual or unisexual (female below and male above on the spadix).'] },
    fruit: { es: 'Baya, generalmente en infrutescencias.', en: 'Berry, usually in infructescences.' },
    mx: { es: 'La costilla de Adán es nativa de las selvas del sur; malanga y quequeste se comen; el alcatraz está naturalizado en el centro del país.', en: 'Swiss cheese plant is native to the southern rainforests; taro and quequeste are eaten; calla lily is naturalised in central Mexico.' },
    species: [
      { sci: 'Monstera deliciosa', es: 'costilla de Adán, piñanona', en: 'Swiss cheese plant', st: 'nat', note: { es: 'Flores desnudas y hermafroditas; el espádice maduro es comestible.', en: 'Naked bisexual flowers; the ripe spadix is edible.' }, m: { base: 'variant:0' } },
      { sci: 'Zantedeschia aethiopica', es: 'alcatraz', en: 'calla lily', st: 'intro', note: { es: 'De Sudáfrica; lo blanco es la espata.', en: 'From South Africa; the white part is the spathe.' },
        flowers: [
          { label: { es: 'Flor estaminada', en: 'Staminate flower' }, m: { sym: 'actino', sex: 'staminate', A: { w: [3] }, colors: { A: '#f2c12e' } } },
          { label: { es: 'Flor pistilada', en: 'Pistillate flower' }, m: { sym: 'actino', sex: 'pistillate', A: { w: [{ n: 3, state: 'sterile' }] }, G: { w: [{ n: 3, connate: true }], plac: 'axile', ov: '∞' }, colors: { G: '#b9cf88' } } },
        ] },
      { sci: 'Colocasia esculenta', es: 'malanga', en: 'taro', st: 'cult', note: { es: 'Del sureste de Asia; flores unisexuales desnudas.', en: 'From South-East Asia; naked unisexual flowers.' } },
      { sci: 'Xanthosoma robustum', es: 'quequeste, capote', en: 'quequeste', st: 'nat', note: { es: 'Hojas gigantes; tubérculos y hojas comestibles.', en: 'Giant leaves; edible tubers and leaves.' } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'alismataceae', name: 'Alismataceae', es: 'alismatáceas', en: 'water-plantain family', order: 'Alismatales',
    typical: { sym: 'actino', K: { w: [3] }, C: { w: [3] }, A: { w: [{ n: [6, '∞'] }] }, G: { w: [{ n: [6, '∞'] }], plac: 'basal', ov: 1 }, colors: { K: '#6f9a45', C: '#fbfbf7', A: '#f2d34a', G: '#9cc76a' } },
    chars: { es: ['Hierbas acuáticas o de pantano, con látex.', 'Hojas basales largamente pecioladas, a menudo en forma de flecha (sagitadas).', 'Flores trímeras: tres sépalos verdes y tres pétalos blancos, efímeros.', 'Estambres de seis a numerosos; carpelos numerosos y libres.', 'Muchas especies de Sagittaria son monoicas.'],
      en: ['Aquatic or marsh herbs with latex.', 'Long-stalked basal leaves, often arrow-shaped (sagittate).', 'Trimerous flowers: three green sepals and three white, short-lived petals.', 'Six to many stamens; numerous free carpels.', 'Many Sagittaria species are monoecious.'] },
    fruit: { es: 'Agregado de aquenios.', en: 'Aggregate of achenes.' },
    mx: { es: 'La papa de agua crece en canales y lagos y sus tubérculos se comían; la del Valle de México y Xochimilco es sobre todo Sagittaria macrophylla, endémica y amenazada.', en: 'Arrowhead grows in canals and lakes and its tubers were eaten; the one of the Valley of Mexico and Xochimilco is mainly Sagittaria macrophylla, endemic and threatened.' },
    species: [
      { sci: 'Sagittaria latifolia', es: 'papa de agua, flecha de agua', en: 'broadleaf arrowhead', st: 'nat', note: { es: 'Monoica: flores masculinas arriba y femeninas abajo en la inflorescencia.', en: 'Monoecious: male flowers above and female ones below in the inflorescence.' },
        flowers: [
          { label: { es: 'Flor estaminada', en: 'Staminate flower' }, m: { base: 'typical', sex: 'staminate', G: null } },
          { label: { es: 'Flor pistilada', en: 'Pistillate flower' }, m: { base: 'typical', sex: 'pistillate', A: null } },
        ] },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'dioscoreaceae', name: 'Dioscoreaceae', es: 'dioscoreáceas', en: 'yam family', order: 'Dioscoreales',
    typical: [
      { label: { es: 'Flor estaminada', en: 'Staminate flower' }, m: { sym: 'actino', sex: 'staminate', P: { w: [3, 3], connate: true, like: 'K' }, A: { w: [3, 3] }, colors: { P: '#b9cf6a', A: '#e8d67a' } } },
      { label: { es: 'Flor pistilada', en: 'Pistillate flower' }, m: { sym: 'actino', sex: 'pistillate', P: { w: [3, 3], connate: true, like: 'K' }, G: { w: [{ n: 3, connate: true }], pos: 'inferior', plac: 'axile', ov: 6 }, look: { stigma: 'lobed' }, colors: { P: '#b9cf6a', G: '#8fb86a' } } },
    ],
    chars: { es: ['Trepadoras volubles con tubérculos o rizomas.', 'Hojas acorazonadas con nervios curvos que convergen en el ápice y nervación reticulada entre ellos.', 'Plantas dioicas con flores pequeñas, verdosas y trímeras.', 'Ovario ínfero de tres lóculos, con dos óvulos por lóculo.'],
      en: ['Twining climbers with tubers or rhizomes.', 'Heart-shaped leaves with curved veins converging at the tip and reticulate venation between them.', 'Dioecious plants with small, greenish, trimerous flowers.', 'Inferior ovary with three locules and two ovules in each.'] },
    fruit: { es: 'Cápsula con tres alas; semillas aladas.', en: 'Three-winged capsule; winged seeds.' },
    mx: { es: 'El barbasco (D. composita) fue la base de la industria mexicana de hormonas esteroides (diosgenina) a mediados del siglo XX.', en: 'Barbasco (D. composita) was the basis of the Mexican steroid-hormone industry (diosgenin) in the mid-20th century.' },
    species: [
      { sci: 'Dioscorea composita', es: 'barbasco', en: 'barbasco', st: 'nat', note: { es: 'Sus tubérculos tienen diosgenina, precursora de hormonas.', en: 'Its tubers contain diosgenin, a hormone precursor.' }, flowers: [{ label: { es: 'Flor estaminada', en: 'Staminate flower' }, m: { base: 'typical:0' } }, { label: { es: 'Flor pistilada', en: 'Pistillate flower' }, m: { base: 'typical:1' } }] },
      { sci: 'Dioscorea alata', es: 'ñame', en: 'water yam', st: 'cult', note: { es: 'Tubérculo comestible, del sureste de Asia.', en: 'Edible tuber from South-East Asia.' } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'liliaceae', name: 'Liliaceae', es: 'liliáceas', en: 'lily family', order: 'Liliales',
    typical: 'sp:lilium',
    chars: { es: ['Hierbas perennes con bulbo; hojas simples de nervación paralela.', 'Flores grandes y vistosas, trímeras, con seis tépalos petaloides, a menudo manchados y con nectarios en la base.', 'Seis estambres, a menudo con anteras versátiles.', 'Ovario súpero de tres lóculos con muchos óvulos.', 'En sentido estricto (APG IV) ya no incluye a cebollas, magueyes ni espárragos.'],
      en: ['Perennial herbs with bulbs; simple leaves with parallel veins.', 'Large, showy trimerous flowers with six petaloid tepals, often spotted and nectar-bearing at the base.', 'Six stamens, often with versatile anthers.', 'Superior ovary with three locules and many ovules.', 'In the strict sense (APG IV) it no longer includes onions, agaves or asparagus.'] },
    fruit: { es: 'Cápsula loculicida (septicida en Calochortus); semillas planas.', en: 'Loculicidal capsule (septicidal in Calochortus); flat seeds.' },
    mx: { es: 'Pocas especies nativas (Calochortus); azucenas y tulipanes son ornamentales importadas.', en: 'Few native species (Calochortus); lilies and tulips are imported ornamentals.' },
    species: [
      { sci: 'Lilium longiflorum', es: 'azucena', en: 'Easter lily', st: 'cult', note: { es: 'Tépalos blancos, libres, que se juntan formando una trompeta.', en: 'Free white tepals that close together into a trumpet.' }, m: 'sp:lilium' },
      { sci: 'Tulipa gesneriana', es: 'tulipán', en: 'tulip', st: 'cult', note: { es: 'Estigma sésil de tres lóbulos sobre el ovario; anteras basifijas.', en: 'Sessile three-lobed stigma on the ovary; basifixed anthers.' }, m: { base: 'typical', colors: { P: '#d9362f', A: '#3a2a2a', G: '#b9cf88' }, look: { stigma: 'lobed', perianth: null, anther: 'basifixed' } } },
      { sci: 'Calochortus barbatus', es: 'ayatito', en: 'bearded mariposa lily', st: 'end', note: { es: 'Aquí sí se distinguen tres sépalos y tres pétalos barbados.', en: 'Here three sepals and three bearded petals can be told apart.' }, m: { sym: 'actino', K: { w: [3] }, C: { w: [3] }, A: { w: [3, 3] }, G: { w: [{ n: 3, connate: true }], plac: 'axile', ov: '∞' }, look: { stigma: 'lobed' }, colors: { K: '#b9b04a', C: '#e9c63a', A: '#e8d67a' } } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'orchidaceae', name: 'Orchidaceae', es: 'orquidáceas', en: 'orchid family', order: 'Asparagales',
    typical: { sym: 'zygo', B: 1, resup: true, P: { w: [3, { parts: [{ n: 1, label: { es: 'labelo', en: 'lip (labellum)' }, size: 1.25 }, { n: 2 }] }], like: 'C' }, A: { w: [1] }, G: { w: [{ n: 3, connate: true }], pos: 'inferior', plac: 'parietal', ov: '∞' }, adn: [['A', 'G']], look: { corolla: 'orchid', pollinia: true }, colors: { P: '#c77dc9', A: '#f2e2a0', G: '#8fb86a' } },
    chars: { es: ['Hierbas terrestres, epífitas o trepadoras, a menudo con seudobulbos y raíces cubiertas de velamen.', 'Flores zigomorfas, casi siempre resupinadas (giran 180°).', 'Seis tépalos; el interno mediano transformado en labelo.', 'Estambre y estilo unidos en una columna (ginostemio); polen agrupado en polinios.', 'Ovario ínfero con miles de óvulos diminutos.'],
      en: ['Terrestrial, epiphytic or climbing herbs, often with pseudobulbs and velamen-covered roots.', 'Zygomorphic flowers, almost always resupinate (turned 180°).', 'Six tepals; the median inner one modified into a lip.', 'Stamen and style united in a column (gynostemium); pollen in pollinia.', 'Inferior ovary with thousands of minute ovules.'] },
    fruit: { es: 'Cápsula con miles de semillas diminutas sin endospermo, que necesitan hongos para germinar.', en: 'Capsule with thousands of minute seeds without endosperm, which need fungi to germinate.' },
    mx: { es: 'Una de las familias más diversas del país, con más de 1,200 especies, muchas endémicas; la vainilla se domesticó en la región totonaca de Veracruz.', en: 'One of the most diverse families in the country, with over 1,200 species, many endemic; vanilla was domesticated in the Totonac region of Veracruz.' },
    species: [
      { sci: 'Vanilla planifolia', es: 'vainilla', en: 'vanilla', st: 'dom', note: { es: 'Sin polinios, a diferencia de casi todas las orquídeas; el fruto curado es la vainilla.', en: 'Without pollinia, unlike almost all orchids; the cured fruit is vanilla.' }, m: 'sp:vanilla' },
      { sci: 'Laelia speciosa', es: 'flor de mayo, flor de Corpus', en: 'Mayflower orchid', st: 'end', note: { es: 'Epífita de encinos; flores rosa-lila.', en: 'An epiphyte on oaks; pinkish-lilac flowers.' }, m: { base: 'typical', colors: { P: '#d58fd8' } } },
      { sci: 'Prosthechea citrina', es: 'limoncillo', en: 'citrus-scented orchid', st: 'end', note: { es: 'Flores amarillas colgantes, con olor a limón.', en: 'Hanging yellow flowers with a lemon scent.' }, m: { base: 'typical', colors: { P: '#f2d23a' } } },
      { sci: 'Rhynchostele cervantesii', es: 'orquídea lirio', en: 'Cervantes orchid', st: 'end', note: { es: 'Flores blancas con bandas rojas.', en: 'White flowers with red bands.' }, m: { base: 'typical', colors: { P: '#f7f0f0' } } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'iridaceae', name: 'Iridaceae', es: 'iridáceas', en: 'iris family', order: 'Asparagales',
    typical: { sym: 'actino', B: 1, P: { w: [3, 3], like: 'C' }, A: { w: [3] }, G: { w: [{ n: 3, connate: true }], pos: 'inferior', plac: 'axile', ov: '∞' }, look: { stigma: 'lobed' }, colors: { P: '#7e57c2', A: '#f2d34a', G: '#8fb86a' } },
    chars: { es: ['Hierbas con rizoma, bulbo o cormo.', 'Hojas equitantes: en abanico, dobladas sobre sí mismas.', 'Flores trímeras con seis tépalos petaloides.', 'Solo tres estambres, frente a los tépalos externos.', 'Ovario ínfero de tres lóculos; estilo con tres ramas, a veces anchas y petaloides (Iris).'],
      en: ['Herbs with a rhizome, bulb or corm.', 'Equitant leaves: fan-like, folded on themselves.', 'Trimerous flowers with six petaloid tepals.', 'Only three stamens, opposite the outer tepals.', 'Inferior ovary with three locules; style with three branches, sometimes broad and petaloid (Iris).'] },
    fruit: { es: 'Cápsula loculicida.', en: 'Loculicidal capsule.' },
    mx: { es: 'El cacomite o flor de tigre (Tigridia pavonia) es nativo y sus cormos se comían; gladiolas e iris son ornamentales.', en: 'Tiger flower (Tigridia pavonia) is native and its corms were eaten; gladioli and irises are ornamentals.' },
    species: [
      { sci: 'Tigridia pavonia', es: 'cacomite, flor de tigre', en: 'tiger flower', st: 'nat', note: { es: 'Tépalos rojos con el centro moteado; filamentos unidos en una columna larga; cada flor dura un día.', en: 'Red tepals with a mottled centre; filaments united in a long column; each flower lasts a day.' }, m: { base: 'typical', A: { w: [{ n: 3, connate: true }] }, colors: { P: '#e0452f' }, look: { stigma: 'bifid' } } },
      { sci: 'Iris germanica', es: 'lirio', en: 'bearded iris', st: 'cult', note: { es: 'Tépalos unidos abajo en un tubo; ramas del estilo petaloides que cubren a los estambres.', en: 'Tepals united below in a tube; petaloid style branches covering the stamens.' }, m: { base: 'typical', P: { w: [3, 3], connate: true, like: 'C' }, look: { stigma: 'petaloid', tube: 0.25 } } },
      { sci: 'Gladiolus × hortulanus', es: 'gladiola', en: 'gladiolus', st: 'cult', note: { es: 'Flores algo zigomorfas en espiga.', en: 'Somewhat zygomorphic flowers in a spike.' } },
      { sci: 'Crocus sativus', es: 'azafrán', en: 'saffron crocus', st: 'cult', note: { es: 'El azafrán son las tres ramas rojas del estilo.', en: 'Saffron is the three red style branches.' }, m: { base: 'typical', P: { w: [3, 3], connate: true, like: 'C' }, adn: [['P', 'A']], colors: { P: '#9b6bd1' }, look: { stigma: 'lobed', tube: 0.5 } } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'amaryllidaceae', name: 'Amaryllidaceae', es: 'amarilidáceas', en: 'amaryllis family', order: 'Asparagales',
    typical: { sym: 'actino', B: 1, P: { w: [3, 3], like: 'C' }, A: { w: [3, 3] }, G: { w: [{ n: 3, connate: true }], pos: 'inferior', plac: 'axile', ov: '∞' }, look: { stigma: 'lobed' }, colors: { P: '#f4efe6', A: '#f2d34a', G: '#8fb86a' } },
    variants: [
      { label: { es: 'Ajos y cebollas (Allioideae): ovario súpero', en: 'Onions and garlic (Allioideae): superior ovary' }, m: { sym: 'actino', B: 1, P: { w: [3, 3], like: 'C' }, A: { w: [3, 3] }, G: { w: [{ n: 3, connate: true }], plac: 'axile', ov: 6 }, look: { stigma: 'capitate' }, colors: { P: '#f1eef4', A: '#e8d6a0', G: '#9cc76a' } } },
    ],
    chars: { es: ['Hierbas con bulbo; hojas lineares basales.', 'Flores en umbelas protegidas por una o más brácteas (espata).', 'Seis tépalos, a veces unidos en tubo y con corona (narciso); seis estambres.', 'Ovario ínfero en las amarilidoideas; súpero en ajos y cebollas (alioideas), que además huelen a azufre.'],
      en: ['Bulbous herbs; linear basal leaves.', 'Flowers in umbels sheltered by one or more bracts (spathe).', 'Six tepals, sometimes united into a tube and with a corona (daffodil); six stamens.', 'Inferior ovary in the Amaryllidoideae; superior in onions and garlic (Allioideae), which also smell of sulphur.'] },
    fruit: { es: 'Cápsula loculicida; a veces baya.', en: 'Loculicidal capsule; sometimes a berry.' },
    mx: { es: 'La flor de San Juan o lirio azteca (Sprekelia formosissima) es nativa; ajo y cebolla se cultivan en grandes extensiones.', en: 'Aztec lily (Sprekelia formosissima) is native; garlic and onion are grown on a large scale.' },
    species: [
      { sci: 'Allium cepa', es: 'cebolla', en: 'onion', st: 'cult', note: { es: 'Ovario súpero: flor de las alioideas.', en: 'Superior ovary: a flower of the Allioideae.' }, m: { base: 'variant:0' } },
      { sci: 'Allium sativum', es: 'ajo', en: 'garlic', st: 'cult', note: { es: 'Casi no produce semilla; se propaga por dientes.', en: 'It hardly sets seed; it is propagated by cloves.' } },
      { sci: 'Sprekelia formosissima', es: 'flor de San Juan, lirio azteca', en: 'Aztec lily', st: 'nat', note: { es: 'De México y Guatemala; flor roja zigomorfa, con los tépalos inferiores enrollados. Hoy se incluye en Zephyranthes.', en: 'From Mexico and Guatemala; red zygomorphic flower with the lower tepals rolled together. Now included in Zephyranthes.' } },
      { sci: 'Narcissus pseudonarcissus', es: 'narciso', en: 'daffodil', st: 'cult', note: { es: 'Corona en forma de trompeta entre los tépalos y los estambres; estambres soldados al tubo.', en: 'A trumpet-shaped corona between the tepals and the stamens; stamens fused to the tube.' }, m: { base: 'typical', P: { w: [3, 3], connate: true, like: 'C' }, adn: [['P', 'A']], corona: { n: 60, color: '#f2c12e' }, colors: { P: '#f6e27a' }, look: { tube: 0.3 } } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'asparagaceae', name: 'Asparagaceae', es: 'asparagáceas (incluye magueyes)', en: 'asparagus family (including agaves)', order: 'Asparagales',
    typical: { sym: 'actino', B: 1, P: { w: [3, 3], connate: true, like: 'C' }, A: { w: [3, 3] }, G: { w: [{ n: 3, connate: true }], pos: 'inferior', plac: 'axile', ov: '∞' }, adn: [['P', 'A']], look: { stigma: 'lobed', tube: 0.35 }, colors: { P: '#e8e07a', A: '#e8c63a', G: '#8fb86a' } },
    variants: [
      { label: { es: 'Yucas y espárragos: ovario súpero', en: 'Yuccas and asparagus: superior ovary' }, m: { sym: 'actino', B: 1, P: { w: [3, 3], like: 'C' }, A: { w: [3, 3] }, G: { w: [{ n: 3, connate: true }], plac: 'axile', ov: '∞' }, look: { stigma: 'lobed', corolla: 'campanulate' }, colors: { P: '#f6f3e6', A: '#e8e0a8', G: '#b9cf88' } } },
    ],
    chars: { es: ['Muy diversa en sentido amplio (APG IV): magueyes y yucas con hojas en roseta, suculentas o fibrosas, nardos, espárragos.', 'Flores trímeras con seis tépalos, libres o unidos en tubo; seis estambres.', 'Ovario ínfero en magueyes y nardos; súpero en yucas y espárragos; de tres lóculos.', 'Los magueyes florecen una sola vez al final de su vida, con un quiote enorme.'],
      en: ['Very diverse in the broad sense (APG IV): agaves and yuccas with rosettes of succulent or fibrous leaves, tuberose, asparagus.', 'Trimerous flowers with six tepals, free or united in a tube; six stamens.', 'Inferior ovary in agaves and tuberose; superior in yuccas and asparagus; three locules.', 'Agaves flower only once, at the end of their life, on a huge flowering stalk.'] },
    fruit: { es: 'Cápsula (magueyes, muchas yucas), baya (espárrago) o fruto carnoso que no se abre (izote).', en: 'Capsule (agaves, many yuccas), berry (asparagus) or a fleshy fruit that does not open (izote).' },
    mx: { es: 'México es el centro de diversidad de los agaves, con más de 150 especies, la mayoría endémicas; de ellos salen el pulque, el mezcal, el tequila y fibras como el henequén.', en: 'Mexico is the centre of agave diversity, with over 150 species, most of them endemic; they give pulque, mezcal, tequila and fibres such as henequen.' },
    species: [
      { sci: 'Agave salmiana', es: 'maguey pulquero', en: 'pulque agave', st: 'end', note: { es: 'Su savia fresca es el aguamiel; fermentada da el pulque.', en: 'Its fresh sap is aguamiel; fermented, it gives pulque.' }, m: { base: 'typical' } },
      { sci: 'Agave tequilana', es: 'agave azul', en: 'blue agave', st: 'dom', note: { es: 'Cultígeno que se propaga por hijuelos; materia prima del tequila (Jalisco).', en: 'A cultigen propagated by offshoots; the raw material of tequila (Jalisco).' }, m: { base: 'typical' } },
      { sci: 'Yucca filifera', es: 'izote, palma china', en: 'Saint Peter\'s palm', st: 'end', note: { es: 'Ovario súpero; flores blancas comestibles; polinizada por palomillas del género Tegeticula.', en: 'Superior ovary; edible white flowers; pollinated by Tegeticula moths.' }, m: { base: 'variant:0' } },
      { sci: 'Polianthes tuberosa', es: 'nardo, omixóchitl', en: 'tuberose', st: 'dom', note: { es: 'Tubo blanco muy perfumado; estambres soldados al tubo. Hoy muchos autores la incluyen en Agave (A. amica).', en: 'Very fragrant white tube; stamens fused to the tube. Many authors now include it in Agave (A. amica).' }, m: { base: 'typical', colors: { P: '#fbfaf2', A: '#e8e0a8' }, look: { tube: 0.6, corolla: 'salverform' } } },
      { sci: 'Beaucarnea recurvata', es: 'pata de elefante', en: 'ponytail palm', st: 'end', note: { es: 'Tallo engrosado en la base; planta dioica.', en: 'Stem swollen at the base; a dioecious plant.' } },
      { sci: 'Asparagus officinalis', es: 'espárrago', en: 'asparagus', st: 'cult', note: { es: 'Lo que se come son los brotes; hojas reducidas a escamas; plantas funcionalmente dioicas.', en: 'The edible part is the shoot; leaves reduced to scales; functionally dioecious plants.' },
        flowers: [
          { label: { es: 'Flor estaminada', en: 'Staminate flower' }, m: { base: 'variant:0', sex: 'staminate', P: { w: [3, 3], connate: true, like: 'C' }, G: { w: [{ n: 3, connate: true, state: 'sterile' }] }, colors: { P: '#e8ecb0' } } },
          { label: { es: 'Flor pistilada', en: 'Pistillate flower' }, m: { base: 'variant:0', sex: 'pistillate', P: { w: [3, 3], connate: true, like: 'C' }, A: { w: [{ n: 3, state: 'sterile' }, { n: 3, state: 'sterile' }] }, colors: { P: '#e8ecb0' } } },
        ] },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'arecaceae', name: 'Arecaceae', es: 'arecáceas (palmas)', en: 'palm family', order: 'Arecales',
    typical: { sym: 'actino', B: 1, K: { w: [3] }, C: { w: [3] }, A: { w: [3, 3] }, G: { w: [{ n: 3, connate: true }], plac: 'axile', ov: 3 }, look: { stigma: 'lobed' }, colors: { K: '#d8d09a', C: '#efe6b8', A: '#e8d67a', G: '#c9d88a' } },
    variants: [
      { label: { es: 'Palmas de abanico (Coryphoideae): carpelos libres unidos por los estilos', en: 'Fan palms (Coryphoideae): free carpels united by the styles' }, m: { sym: 'actino', B: 1, K: { w: [{ n: 3, connate: true }] }, C: { w: [{ n: 3, connate: true }] }, A: { w: [3, 3] }, G: { w: [{ n: 3, connate: 'apical' }], plac: 'basal', ov: 1 }, adn: [['C', 'A']], colors: { K: '#d8d09a', C: '#f4efd0', A: '#e8d67a', G: '#c9d88a' } } },
    ],
    chars: { es: ['Árboles, arbustos o trepadoras con un tallo no ramificado (estípite) y un penacho de hojas grandes, pinnadas o palmeadas, plegadas.', 'Inflorescencias grandes protegidas por brácteas (espatas).', 'Flores pequeñas, trímeras, con tres sépalos y tres pétalos, hermafroditas o unisexuales.', 'Seis estambres; tres carpelos, cada uno con un óvulo, unidos (cocotero) o libres y unidos solo por los estilos (palmas de abanico).'],
      en: ['Trees, shrubs or climbers with an unbranched stem and a crown of large, pleated, pinnate or palmate leaves.', 'Large inflorescences sheltered by bracts (spathes).', 'Small trimerous flowers with three sepals and three petals, bisexual or unisexual.', 'Six stamens; three carpels, each with one ovule, united (coconut) or free and joined only by the styles (fan palms).'] },
    fruit: { es: 'Drupa (coco) o baya (dátil), de una semilla.', en: 'Drupe (coconut) or berry (date), single-seeded.' },
    mx: { es: 'La palma camedor se exporta como follaje; los sombreros se tejen con soyate; Washingtonia robusta es endémica del noroeste.', en: 'Parlour palm is exported as foliage; hats are woven from soyate; Washingtonia robusta is endemic to the north-west.' },
    species: [
      { sci: 'Cocos nucifera', es: 'cocotero', en: 'coconut palm', st: 'cult', note: { es: 'Monoica: flores masculinas arriba y femeninas abajo en la inflorescencia.', en: 'Monoecious: male flowers above and female ones below in the inflorescence.' },
        flowers: [
          { label: { es: 'Flor estaminada', en: 'Staminate flower' }, m: { base: 'typical', sex: 'staminate', C: { w: [3], aest: 'valvate' }, G: { w: [{ n: 3, connate: true, state: 'sterile' }] } } },
          { label: { es: 'Flor pistilada', en: 'Pistillate flower' }, m: { base: 'typical', sex: 'pistillate', C: { w: [3], aest: 'imbricate' }, A: null } },
        ] },
      { sci: 'Chamaedorea elegans', es: 'palma camedor', en: 'parlour palm', st: 'nat', note: { es: 'Palma pequeña del sotobosque; dioica.', en: 'A small understorey palm; dioecious.' } },
      { sci: 'Washingtonia robusta', es: 'palma de abanico', en: 'Mexican fan palm', st: 'end', note: { es: 'Del noroeste (Baja California Sur y Sonora); hojas palmeadas; flores hermafroditas.', en: 'From the north-west (Baja California Sur and Sonora); palmate leaves; bisexual flowers.' }, m: { base: 'variant:0' } },
      { sci: 'Brahea dulcis', es: 'soyate, palma', en: 'rock palm', st: 'nat', note: { es: 'Sus hojas se tejen en sombreros y petates.', en: 'Its leaves are woven into hats and mats.' }, m: { base: 'variant:0', K: { w: [3] } } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'commelinaceae', name: 'Commelinaceae', es: 'commelináceas', en: 'spiderwort family', order: 'Commelinales',
    typical: { sym: 'actino', K: { w: [3] }, C: { w: [3] }, A: { w: [3, 3] }, G: { w: [{ n: 3, connate: true }], plac: 'axile', ov: 6 }, look: { stigma: 'capitate' }, colors: { K: '#6f9a45', C: '#7e57c2', A: '#f2d34a', G: '#9cc76a' } },
    chars: { es: ['Hierbas algo suculentas, con nudos marcados.', 'Hojas con una vaina cerrada en la base.', 'Flores trímeras efímeras (duran un día), con tres sépalos verdes y tres pétalos azules, morados o blancos.', 'Estambres a menudo con pelos largos en los filamentos; en Commelina, solo tres son fértiles.', 'Ovario súpero de tres lóculos.'],
      en: ['Somewhat succulent herbs with distinct nodes.', 'Leaves with a closed sheath at the base.', 'Ephemeral trimerous flowers (lasting one day) with three green sepals and three blue, purple or white petals.', 'Stamens often with long hairs on the filaments; in Commelina only three are fertile.', 'Superior ovary with three locules.'] },
    fruit: { es: 'Cápsula.', en: 'Capsule.' },
    mx: { es: 'Muchas especies nativas; el matalí y el maguey morado se usan como medicinales y ornamentales.', en: 'Many native species; wandering Jew and oyster plant are used as medicinals and ornamentals.' },
    species: [
      { sci: 'Tradescantia zebrina', es: 'matalí', en: 'inch plant', st: 'nat', note: { es: 'Hojas rayadas de plata y morado; flores rosadas.', en: 'Silver- and purple-striped leaves; pink flowers.' }, m: { base: 'typical', colors: { C: '#d57fc0' } } },
      { sci: 'Tradescantia spathacea', es: 'maguey morado', en: 'oyster plant', st: 'nat', note: { es: 'Flores blancas escondidas entre brácteas en forma de concha.', en: 'White flowers hidden between shell-shaped bracts.' }, m: { base: 'typical', colors: { C: '#f7f5f0' } } },
      { sci: 'Commelina coelestis', es: 'hierba del pollo', en: 'Mexican dayflower', st: 'nat', note: { es: 'Flor zigomorfa: dos pétalos azules grandes y uno pequeño; tres estambres fértiles y tres estaminodios.', en: 'Zygomorphic flower: two large blue petals and a small one; three fertile stamens and three staminodes.' } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'musaceae', name: 'Musaceae', es: 'musáceas', en: 'banana family', order: 'Zingiberales',
    typical: [
      { label: { es: 'Flor estaminada', en: 'Staminate flower' }, m: { sym: 'zygo', sex: 'staminate', P: { w: [{ n: 3, connate: true }, { parts: [{ n: 1, label: { es: 'tépalo interno libre', en: 'free inner tepal' } }, { n: 2, connate: true, label: { es: 'internos laterales, soldados a los tres externos en un tépalo compuesto', en: 'lateral inner tepals, fused with the three outer ones into a compound tepal' } }] }], like: 'C' }, A: { w: [3, { parts: [{ n: 1, state: 'lost' }, { n: 2 }] }] }, G: { w: [{ n: 3, connate: true, state: 'sterile' }], pos: 'inferior' }, colors: { P: '#f1e6c0', A: '#e8d67a', G: '#c9d88a' } } },
      { label: { es: 'Flor pistilada', en: 'Pistillate flower' }, m: { sym: 'zygo', sex: 'pistillate', P: { w: [{ n: 3, connate: true }, { parts: [{ n: 1, label: { es: 'tépalo interno libre', en: 'free inner tepal' } }, { n: 2, connate: true, label: { es: 'internos laterales, soldados a los tres externos en un tépalo compuesto', en: 'lateral inner tepals, fused with the three outer ones into a compound tepal' } }] }], like: 'C' }, A: { w: [{ n: 3, state: 'sterile' }, { parts: [{ n: 1, state: 'lost' }, { n: 2, state: 'sterile' }] }] }, G: { w: [{ n: 3, connate: true }], pos: 'inferior', plac: 'axile', ov: '∞' }, colors: { P: '#f1e6c0', G: '#9cc76a' } } },
    ],
    chars: { es: ['Hierbas gigantes con un seudotallo formado por las vainas de las hojas.', 'Hojas enormes, con nervios paralelos que salen de la nervadura central y se rasgan con el viento.', 'Inflorescencia colgante con grandes brácteas moradas; flores femeninas en la base y masculinas hacia la punta.', 'Flores zigomorfas: cinco tépalos unidos y uno libre; cinco estambres.', 'Ovario ínfero de tres lóculos.'],
      en: ['Giant herbs with a pseudostem formed by the leaf sheaths.', 'Huge leaves with parallel veins arising from the midrib, which tear in the wind.', 'Hanging inflorescence with large purple bracts; female flowers at the base and male ones towards the tip.', 'Zygomorphic flowers: five united tepals and a free one; five stamens.', 'Inferior ovary with three locules.'] },
    fruit: { es: 'Baya (el plátano); en las variedades cultivadas se forma sin fecundación y sin semillas (partenocarpia).', en: 'Berry (the banana); in cultivated varieties it forms without fertilisation and without seeds (parthenocarpy).' },
    mx: { es: 'El plátano, del sureste de Asia, se cultiva en todo el trópico mexicano; sus hojas envuelven tamales.', en: 'Banana, from South-East Asia, is grown throughout tropical Mexico; its leaves wrap tamales.' },
    species: [
      { sci: 'Musa × paradisiaca', es: 'plátano', en: 'banana', st: 'cult', note: { es: 'Híbrido cultivado, estéril.', en: 'A sterile cultivated hybrid.' }, flowers: [{ label: { es: 'Flor estaminada', en: 'Staminate flower' }, m: { base: 'typical:0' } }, { label: { es: 'Flor pistilada', en: 'Pistillate flower' }, m: { base: 'typical:1' } }] },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'cannaceae', name: 'Cannaceae', es: 'canáceas', en: 'canna family', order: 'Zingiberales',
    typical: { sym: 'asym', B: 1, K: { w: [3] }, C: { w: [{ n: 3, connate: true }] }, A: { w: [{ n: 3, state: 'sterile' }, { parts: [{ n: 1 }, { n: 2, state: 'sterile' }] }] }, G: { w: [{ n: 3, connate: true }], pos: 'inferior', plac: 'axile', ov: '∞' }, adn: [['C', 'A']], colors: { K: '#c9563c', C: '#d9483b', A: '#f07a3a', G: '#8fb86a' } },
    chars: { es: ['Hierbas robustas con rizoma; hojas grandes con vaina y nervios pinnado-paralelos.', 'Flores asimétricas.', 'Tres sépalos y tres pétalos poco vistosos; lo vistoso son los estaminodios petaloides.', 'Un solo estambre fértil, con media antera, unido a un estaminodio.', 'Ovario ínfero de tres lóculos, verrugoso.'],
      en: ['Robust herbs with rhizomes; large leaves with a sheath and pinnate-parallel veins.', 'Asymmetric flowers.', 'Three sepals and three inconspicuous petals; the showy parts are petaloid staminodes.', 'A single fertile stamen with half an anther, joined to a staminode.', 'Warty inferior ovary with three locules.'] },
    fruit: { es: 'Cápsula verrugosa; semillas duras y redondas, usadas como cuentas.', en: 'Warty capsule; hard round seeds used as beads.' },
    mx: { es: 'Canna indica es nativa de la América tropical; sus híbridos se cultivan como ornamentales.', en: 'Canna indica is native to tropical America; its hybrids are grown as ornamentals.' },
    species: [
      { sci: 'Canna indica', es: 'platanillo, caña de Indias', en: 'Indian shot', st: 'nat', note: { es: 'Esquema simplificado: los estaminodios petaloides varían.', en: 'Simplified scheme: the petaloid staminodes vary.' }, m: { base: 'typical' } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'zingiberaceae', name: 'Zingiberaceae', es: 'zingiberáceas', en: 'ginger family', order: 'Zingiberales',
    typical: { sym: 'zygo', B: 1, K: { w: [{ n: 3, connate: true }] }, C: { w: [{ n: 3, connate: true }] }, A: { w: [{ parts: [{ n: 2, state: 'sterile' }, { n: 1, state: 'lost' }] }, { parts: [{ n: 1 }, { n: 2, state: 'sterile', connate: true, label: { es: 'labelo', en: 'labellum' } }] }] }, G: { w: [{ n: 3, connate: true }], pos: 'inferior', plac: 'axile', ov: '∞' }, colors: { K: '#b9cf6a', C: '#f2d34a', A: '#e05a3a', G: '#8fb86a' } },
    chars: { es: ['Hierbas aromáticas con rizomas carnosos.', 'Hojas dísticas con vaina y lígula.', 'Flores zigomorfas con cáliz tubular y corola de tres lóbulos.', 'Lo más vistoso es el labelo, formado por dos estaminodios unidos.', 'Un solo estambre fértil que abraza al estilo; ovario ínfero.'],
      en: ['Aromatic herbs with fleshy rhizomes.', 'Distichous leaves with a sheath and ligule.', 'Zygomorphic flowers with a tubular calyx and a three-lobed corolla.', 'The showiest part is the lip, formed by two united staminodes.', 'A single fertile stamen clasping the style; inferior ovary.'] },
    fruit: { es: 'Cápsula o baya; semillas con arilo.', en: 'Capsule or berry; arillate seeds.' },
    mx: { es: 'Jengibre, cúrcuma y cardamomo, de Asia, se cultivan; el cardamomo se produce en Chiapas. El género nativo Renealmia crece en las selvas del sureste.', en: 'Ginger, turmeric and cardamom, from Asia, are cultivated; cardamom is grown in Chiapas. The native genus Renealmia grows in the south-eastern rainforests.' },
    species: [
      { sci: 'Zingiber officinale', es: 'jengibre', en: 'ginger', st: 'cult', note: { es: 'Se usa el rizoma.', en: 'The rhizome is used.' }, m: { base: 'typical' } },
      { sci: 'Curcuma longa', es: 'cúrcuma', en: 'turmeric', st: 'cult', note: { es: 'Rizoma anaranjado, colorante.', en: 'Orange rhizome, a dye.' } },
      { sci: 'Elettaria cardamomum', es: 'cardamomo', en: 'cardamom', st: 'cult', note: { es: 'Se usan las cápsulas y semillas.', en: 'The capsules and seeds are used.' } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'bromeliaceae', name: 'Bromeliaceae', es: 'bromeliáceas', en: 'bromeliad family', order: 'Poales',
    typical: { sym: 'actino', B: 1, K: { w: [3] }, C: { w: [3] }, A: { w: [3, 3] }, G: { w: [{ n: 3, connate: true }], plac: 'axile', ov: '∞' }, look: { stigma: 'lobed' }, colors: { K: '#e8638a', C: '#7e57c2', A: '#f2d34a', G: '#9cc76a' } },
    chars: { es: ['Hierbas terrestres o epífitas con hojas en roseta, a menudo formando un tanque que junta agua.', 'Hojas cubiertas de escamas que absorben agua y nutrientes.', 'Flores trímeras con cáliz y corola distintos; seis estambres.', 'Ovario súpero (Tillandsia) a ínfero (piña).'],
      en: ['Terrestrial or epiphytic herbs with rosette leaves, often forming a water-holding tank.', 'Leaves covered with scales that absorb water and nutrients.', 'Trimerous flowers with distinct calyx and corolla; six stamens.', 'Ovary superior (Tillandsia) to inferior (pineapple).'] },
    fruit: { es: 'Cápsula con semillas plumosas (Tillandsia) o baya; en la piña, las bayas y brácteas se sueldan en una infrutescencia carnosa.', en: 'Capsule with plumed seeds (Tillandsia) or berry; in pineapple, the berries and bracts fuse into a fleshy infructescence.' },
    mx: { es: 'Muchas Tillandsia epífitas; el heno se usa en los nacimientos navideños; la piña se cultiva en Veracruz y Oaxaca.', en: 'Many epiphytic Tillandsia; Spanish moss is used in Christmas cribs; pineapple is grown in Veracruz and Oaxaca.' },
    species: [
      { sci: 'Ananas comosus', es: 'piña', en: 'pineapple', st: 'cult', note: { es: 'Ovario ínfero; infrutescencia carnosa.', en: 'Inferior ovary; fleshy infructescence.' }, m: { base: 'typical', G: { w: [{ n: 3, connate: true }], pos: 'inferior', plac: 'axile', ov: '∞' }, colors: { C: '#8e6fd0', K: '#d88a6a' } } },
      { sci: 'Tillandsia usneoides', es: 'heno, pastle', en: 'Spanish moss', st: 'nat', note: { es: 'Sin raíces; cuelga de los árboles.', en: 'Rootless; hangs from trees.' }, m: { base: 'typical', colors: { C: '#b9cf6a', K: '#b9cf6a' } } },
      { sci: 'Tillandsia recurvata', es: 'gallinita, paixtle', en: 'ball moss', st: 'nat', note: { es: 'Epífita pequeña, común en cables y árboles urbanos.', en: 'A small epiphyte, common on wires and urban trees.' } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'cyperaceae', name: 'Cyperaceae', es: 'ciperáceas', en: 'sedge family', order: 'Poales',
    typical: { sym: 'actino', B: 1, A: { w: [3] }, G: { w: [{ n: 3, connate: true }], plac: 'basal', loc: 1, ov: 1 }, look: { stigma: 'lobed' }, colors: { A: '#e8d67a', G: '#b9a86a' } },
    chars: { es: ['Hierbas parecidas a los pastos, pero con tallos macizos, a menudo de sección triangular.', 'Hojas en tres filas, con vaina cerrada.', 'Flores diminutas en espiguillas, cada una en la axila de una gluma.', 'Perianto ausente o reducido a cerdas; tres estambres.', 'Ovario súpero con un solo óvulo basal.'],
      en: ['Grass-like herbs, but with solid, often triangular stems.', 'Leaves in three rows, with closed sheaths.', 'Minute flowers in spikelets, each in the axil of a glume.', 'Perianth absent or reduced to bristles; three stamens.', 'Superior ovary with a single basal ovule.'] },
    fruit: { es: 'Aquenio (núcula), a menudo trígono.', en: 'Achene (nutlet), often three-sided.' },
    mx: { es: 'El tule de los lagos se usa para tejer petates y sillas; el coquillo es una de las peores malezas de cultivo.', en: 'Lake tule is woven into mats and chairs; nutsedge is one of the worst crop weeds.' },
    species: [
      { sci: 'Schoenoplectus acutus', es: 'tule', en: 'hardstem bulrush', st: 'nat', note: { es: 'Perianto de seis cerdas.', en: 'Perianth of six bristles.' }, m: { base: 'typical', P: { w: [{ n: 6, label: { es: 'cerdas', en: 'bristles' } }], like: 'K' } } },
      { sci: 'Cyperus esculentus', es: 'coquillo', en: 'yellow nutsedge', st: 'nat', note: { es: 'Tubérculos comestibles (chufa); maleza.', en: 'Edible tubers (tiger nut); a weed.' }, m: { base: 'typical' } },
      { sci: 'Cyperus papyrus', es: 'papiro', en: 'papyrus', st: 'cult', note: { es: 'De África; con él se hacía papel en el antiguo Egipto.', en: 'From Africa; paper was made from it in ancient Egypt.' } },
    ] },

  /* ------------------------------------------------------------------ */
  { id: 'poaceae', name: 'Poaceae', es: 'poáceas (gramíneas)', en: 'grass family', order: 'Poales',
    typical: { sym: 'zygo', B: 1, Bt: 1, oddK: 'adaxial', P: { w: [{ parts: [{ n: 1, state: 'lost' }, { n: 2, size: 0.5, label: { es: 'lodículas', en: 'lodicules' } }], ang: [0, 150, 210] }], like: 'K' }, A: { w: [{ n: 3, ang: [180, 300, 60] }] }, G: { w: [{ n: 2, connate: true }], plac: 'basal', loc: 1, ov: 1, ang: 90 }, look: { stigma: 'plumose', anther: 'versatile' }, colors: { P: '#d8d8a0', A: '#e8c63a', G: '#c9d88a' } },
    chars: { es: ['Hierbas (a veces leñosas, como los bambúes) con tallos cilíndricos huecos (cañas) y nudos macizos.', 'Hojas dísticas con vaina abierta y lígula.', 'Flores diminutas (flósculos) en espiguillas, entre la lema y la pálea.', 'Perianto reducido a dos o tres lodículas; tres estambres con anteras versátiles.', 'Ovario súpero con un óvulo y dos estigmas plumosos; polinización por el viento.'],
      en: ['Herbs (sometimes woody, like bamboos) with hollow cylindrical stems (culms) and solid nodes.', 'Distichous leaves with an open sheath and a ligule.', 'Minute flowers (florets) in spikelets, between the lemma and the palea.', 'Perianth reduced to two or three lodicules; three stamens with versatile anthers.', 'Superior ovary with one ovule and two plumose stigmas; wind pollination.'] },
    fruit: { es: 'Cariópside (grano): fruto y semilla soldados.', en: 'Caryopsis (grain): fruit and seed fused.' },
    mx: { es: 'El maíz se domesticó en México a partir del teocintle hace unos 9,000 años; pastos nativos como la navajita forman los pastizales del norte.', en: 'Maize was domesticated in Mexico from teosinte some 9,000 years ago; native grasses such as blue grama make up the northern grasslands.' },
    species: [
      { sci: 'Zea mays', es: 'maíz', en: 'maize', st: 'dom', note: { es: 'Monoico: espiguillas masculinas en la espiga (panoja) y femeninas en la mazorca; los «pelos» del elote son los estilos, largos y papilosos. Los flósculos femeninos no tienen lodículas.', en: 'Monoecious: male spikelets in the tassel and female ones on the ear; corn silks are the long, papillose styles. Female florets have no lodicules.' },
        flowers: [
          { label: { es: 'Flósculo estaminado (espiga)', en: 'Staminate floret (tassel)' }, m: { base: 'typical', sex: 'staminate', G: null } },
          { label: { es: 'Flósculo pistilado (mazorca)', en: 'Pistillate floret (ear)' }, m: { base: 'typical', sex: 'pistillate', P: null, A: null, look: { stigma: null } } },
        ] },
      { sci: 'Zea mays subsp. mexicana', es: 'teocintle', en: 'teosinte', st: 'end', note: { es: 'Pariente silvestre del maíz, del centro de México.', en: 'Wild relative of maize, from central Mexico.' } },
      { sci: 'Triticum aestivum', es: 'trigo', en: 'wheat', st: 'cult', note: { es: 'Espiguillas de varios flósculos.', en: 'Spikelets of several florets.' }, m: { base: 'typical' } },
      { sci: 'Oryza sativa', es: 'arroz', en: 'rice', st: 'cult', note: { es: 'Seis estambres en vez de tres.', en: 'Six stamens instead of three.' }, m: { base: 'typical', A: { w: [3, 3] } } },
      { sci: 'Saccharum officinarum', es: 'caña de azúcar', en: 'sugarcane', st: 'cult', note: { es: 'De Nueva Guinea; se cultiva en todo el trópico mexicano.', en: 'From New Guinea; grown throughout tropical Mexico.' } },
      { sci: 'Bouteloua gracilis', es: 'navajita azul', en: 'blue grama', st: 'nat', note: { es: 'Pasto forrajero de los pastizales del norte.', en: 'A forage grass of the northern grasslands.' }, m: { base: 'typical' } },
    ] },
]);
