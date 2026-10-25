/* FloralPro — Block 5 data: the characters of the interactive key and the
   characters of each family that the flower models cannot give.

   Floral characters (grp 'flor', 'per', 'and', 'gin') are read from the flower
   models of Block 4 (key.js does it); the others are coded here by hand for
   each family. A family may show several states of a character (polymorphic):
   they are written separated by spaces. */

const KEYCHARS = [
  /* ---------- the flower as a whole ---------- */
  { id: 'sym', grp: 'flor', ease: 1, term: 'sym-actino', q: ['Simetría de la flor', 'Symmetry of the flower'],
    st: [['act', 'radial (actinomorfa)', 'radial (actinomorphic)'], ['zyg', 'bilateral (zigomorfa)', 'bilateral (zygomorphic)'], ['asi', 'asimétrica', 'asymmetric']] },
  { id: 'sex', grp: 'flor', ease: 1, term: 'sex-bisexual', q: ['Sexo de las flores', 'Sex of the flowers'],
    st: [['bis', 'hermafroditas (estambres y carpelos en la misma flor)', 'bisexual (stamens and carpels in the same flower)'], ['uni', 'unisexuales (flores solo estaminadas o solo pistiladas)', 'unisexual (flowers only staminate or only pistillate)']] },
  { id: 'mer', grp: 'flor', ease: 2, term: 'merosity', q: ['Piezas por verticilo (merosidad)', 'Members per whorl (merosity)'],
    st: [['3', 'tres (trímera)', 'three (trimerous)'], ['4', 'cuatro (tetrámera)', 'four (tetramerous)'], ['5', 'cinco (pentámera)', 'five (pentamerous)'], ['x', 'otro número (dos, seis o muchas)', 'another number (two, six or many)']] },
  /* ---------- perianth ---------- */
  { id: 'per', grp: 'per', ease: 1, term: 'heterochlamydeous', q: ['Perianto', 'Perianth'],
    st: [['cc', 'cáliz y corola distintos', 'distinct calyx and corolla'], ['tep', 'tépalos parecidos entre sí (perigonio)', 'similar tepals (perigon)'], ['uno', 'un solo verticilo', 'a single whorl'], ['no', 'sin perianto (flor desnuda)', 'no perianth (naked flower)']] },
  { id: 'conC', grp: 'per', ease: 1, term: 'gamopetalous', q: ['Pétalos (o tépalos)', 'Petals (or tepals)'],
    st: [['lib', 'libres entre sí', 'free from each other'], ['uni', 'unidos en un tubo, campana o copa', 'united in a tube, bell or cup']] },
  { id: 'conK', grp: 'per', ease: 2, term: 'gamosepalous', q: ['Sépalos', 'Sepals'],
    st: [['lib', 'libres entre sí', 'free from each other'], ['uni', 'unidos entre sí', 'united with each other']] },
  /* ---------- androecium ---------- */
  { id: 'nA', grp: 'and', ease: 1, term: 'androecium', q: ['Estambres fértiles', 'Fertile stamens'],
    st: [['a', 'uno o dos', 'one or two'], ['b', 'tres o cuatro', 'three or four'], ['c', 'cinco', 'five'], ['d', 'de seis a diez', 'six to ten'], ['e', 'más de diez', 'more than ten']] },
  { id: 'relA', grp: 'and', ease: 2, term: 'isostemonous', q: ['Número de estambres respecto a los pétalos', 'Number of stamens compared with the petals'],
    st: [['igual', 'igual, alternos con los pétalos', 'the same, alternating with the petals'], ['ant', 'igual, frente a los pétalos', 'the same, opposite the petals'], ['doble', 'el doble', 'twice as many'], ['mas', 'más del doble', 'more than twice'], ['menos', 'menos', 'fewer']] },
  { id: 'epi', grp: 'and', ease: 2, term: 'epipetalous', q: ['Estambres soldados a la corola o a los tépalos', 'Stamens fused to the corolla or tepals'],
    st: [['si', 'sí', 'yes'], ['no', 'no', 'no']] },
  { id: 'fus', grp: 'and', ease: 2, term: 'monadelphous', q: ['Estambres entre sí', 'Stamens with each other'],
    st: [['lib', 'libres', 'free'], ['fil', 'filamentos unidos (en tubo o haces)', 'filaments united (in a tube or bundles)'], ['ant', 'anteras unidas en un tubo', 'anthers united in a tube']] },
  /* ---------- gynoecium ---------- */
  { id: 'carp', grp: 'gin', ease: 1, term: 'syncarpous', q: ['Carpelos', 'Carpels'],
    st: [['uno', 'uno solo', 'a single one'], ['lib', 'varios, libres entre sí', 'several, free'], ['uni', 'varios, unidos en un ovario', 'several, united in one ovary']] },
  { id: 'nG', grp: 'gin', ease: 2, term: 'carpel', q: ['Número de carpelos (cuenta estigmas, estilos o lóculos)', 'Number of carpels (count stigmas, styles or locules)'],
    st: [['1', 'uno', 'one'], ['2', 'dos', 'two'], ['3', 'tres', 'three'], ['45', 'cuatro o cinco', 'four or five'], ['m', 'más de cinco', 'more than five']] },
  { id: 'pos', grp: 'gin', ease: 1, term: 'ovary-superior', q: ['Posición del ovario', 'Position of the ovary'],
    st: [['sup', 'súpero (sobre la inserción de las demás piezas)', 'superior (above the insertion of the other parts)'], ['semi', 'semiínfero', 'half-inferior'], ['inf', 'ínfero (debajo de las demás piezas)', 'inferior (below the other parts)']] },
  { id: 'plac', grp: 'gin', ease: 3, term: 'placenta', q: ['Placentación', 'Placentation'],
    st: [['axi', 'axilar', 'axile'], ['par', 'parietal', 'parietal'], ['cen', 'central libre', 'free-central'], ['bas', 'basal', 'basal'], ['api', 'apical', 'apical'], ['mar', 'marginal', 'marginal'], ['lam', 'laminar', 'laminar']] },
  { id: 'ovn', grp: 'gin', ease: 3, term: 'ovule', q: ['Óvulos por ovario (o por carpelo libre)', 'Ovules per ovary (or per free carpel)'],
    st: [['1', 'uno', 'one'], ['p', 'pocos (de dos a diez)', 'few (two to ten)'], ['m', 'muchos', 'many']] },
  { id: 'sty', grp: 'gin', ease: 2, term: 'gynobasic', q: ['Estilo', 'Style'],
    st: [['ter', 'en la punta del ovario', 'at the tip of the ovary'], ['gin', 'ginobásico (sale de la base, entre los lóbulos del ovario)', 'gynobasic (from the base, between the ovary lobes)'], ['lat', 'lateral', 'lateral']] },
  { id: 'esp', grp: 'flor', ease: 2, term: 'corona', q: ['Estructuras especiales', 'Special structures'],
    st: [['cor', 'corona entre el perianto y los estambres', 'corona between perianth and stamens'], ['epi', 'epicáliz (brácteas bajo el cáliz)', 'epicalyx (bracts below the calyx)'], ['hip', 'hipanto (copa floral)', 'hypanthium (floral cup)'], ['nin', 'ninguna de ellas', 'none of these']] },
  /* only flowers with a disc record it, so it serves the dichotomous key (where every family in play
     has a disc) but not the multi-access key, where it would exclude almost nothing (multi: false) */
  { id: 'dis', grp: 'flor', ease: 3, term: 'disc', multi: false, q: ['Disco nectarífero (si lo hay)', 'Nectary disc (if there is one)'],
    st: [['int', 'por dentro de los estambres', 'inside the stamens'], ['ext', 'por fuera de los estambres', 'outside the stamens']] },
  /* ---------- the plant ---------- */
  { id: 'hab', grp: 'veg', ease: 1, term: null, q: ['Forma de vida', 'Growth form'],
    st: [['h', 'hierba', 'herb'], ['a', 'arbusto', 'shrub'], ['r', 'árbol', 'tree'], ['t', 'trepadora', 'climber'], ['e', 'epífita', 'epiphyte'], ['q', 'acuática', 'aquatic'], ['s', 'suculenta (tallo carnoso)', 'succulent (fleshy stem)']] },
  { id: 'fil', grp: 'veg', ease: 1, term: null, q: ['Disposición de las hojas', 'Leaf arrangement'],
    st: [['a', 'alternas', 'alternate'], ['o', 'opuestas', 'opposite'], ['v', 'verticiladas', 'whorled'], ['b', 'en roseta basal', 'in a basal rosette'], ['n', 'sin hojas visibles', 'no visible leaves']] },
  { id: 'hoj', grp: 'veg', ease: 1, term: null, q: ['Hojas', 'Leaves'],
    st: [['s', 'simples (una sola lámina, aunque esté lobulada)', 'simple (a single blade, even if lobed)'], ['c', 'compuestas (varios folíolos)', 'compound (several leaflets)']] },
  { id: 'ner', grp: 'veg', ease: 1, term: null, q: ['Nervación de la hoja', 'Leaf venation'],
    st: [['p', 'paralela', 'parallel'], ['r', 'reticulada (en red)', 'reticulate (net-like)']] },
  { id: 'est', grp: 'veg', ease: 2, term: null, q: ['Estípulas (búscalas en las puntas de las ramas: a veces caen pronto y solo dejan una cicatriz)', 'Stipules (look at the shoot tips: they often fall early and leave only a scar)'],
    st: [['1', 'presentes', 'present'], ['0', 'ausentes', 'absent']] },
  { id: 'lat', grp: 'veg', ease: 2, term: null, q: ['Látex o savia de color al cortar la planta', 'Latex or coloured sap when the plant is cut'],
    st: [['1', 'sí', 'yes'], ['0', 'no', 'no']] },
  { id: 'res', grp: 'veg', ease: 2, term: null, q: ['Resina aromática que escurre de la corteza', 'Aromatic resin oozing from the bark'],
    st: [['1', 'sí', 'yes'], ['0', 'no', 'no']] },
  { id: 'pun', grp: 'veg', ease: 2, term: null, q: ['Hojas con puntos translúcidos (glándulas de aceite) al verlas a contraluz', 'Leaves with translucent dots (oil glands) against the light'],
    st: [['1', 'sí', 'yes'], ['0', 'no', 'no']] },
  { id: 'sub', grp: 'veg', ease: 2, term: null, q: ['Órgano subterráneo de reserva', 'Underground storage organ'],
    st: [['bul', 'bulbo', 'bulb'], ['cor', 'cormo', 'corm'], ['riz', 'rizoma', 'rhizome'], ['tub', 'tubérculo o raíz tuberosa', 'tuber or tuberous root'], ['no', 'ninguno', 'none']] },
  /* ---------- inflorescence and fruit ---------- */
  { id: 'inf', grp: 'inf', ease: 2, term: null, q: ['Inflorescencia', 'Inflorescence'],
    st: [['sol', 'flor solitaria', 'solitary flower'], ['rac', 'racimo o espiga', 'raceme or spike'], ['pan', 'panícula', 'panicle'], ['cim', 'cima o glomérulo', 'cyme or glomerule'], ['umb', 'umbela', 'umbel'], ['cab', 'cabezuela (capítulo)', 'head (capitulum)'], ['esp', 'espádice con espata', 'spadix with a spathe'], ['ame', 'amento', 'catkin'], ['esg', 'espiguillas', 'spikelets'], ['cia', 'ciatio', 'cyathium'], ['sic', 'sicono (higo)', 'syconium (fig)']] },
  { id: 'fru', grp: 'inf', ease: 2, term: null, q: ['Fruto', 'Fruit'],
    st: [['cap', 'cápsula', 'capsule'], ['bay', 'baya', 'berry'], ['dru', 'drupa', 'drupe'], ['leg', 'legumbre (vaina)', 'legume (pod)'], ['aqu', 'aquenio, cipsela o núcula', 'achene, cypsela or nutlet'], ['fol', 'folículo', 'follicle'], ['esq', 'esquizocarpo (se parte en mericarpos)', 'schizocarp (splits into mericarps)'], ['sil', 'silicua o silícula', 'silique or silicle'], ['car', 'cariópside (grano)', 'caryopsis (grain)'], ['pep', 'pepónide', 'pepo'], ['hes', 'hesperidio', 'hesperidium'], ['pom', 'pomo', 'pome'], ['sam', 'sámara', 'samara'], ['nuz', 'nuez', 'nut'], ['agr', 'fruto agregado o sincarpo', 'aggregate fruit or syncarp'], ['inf', 'infrutescencia (fruto múltiple)', 'infructescence (multiple fruit)']] },
];

const KEYGROUPS = [
  { id: 'flor', es: 'La flor en conjunto', en: 'The flower as a whole' },
  { id: 'per', es: 'Perianto', en: 'Perianth' },
  { id: 'and', es: 'Androceo', en: 'Androecium' },
  { id: 'gin', es: 'Gineceo', en: 'Gynoecium' },
  { id: 'veg', es: 'La planta', en: 'The plant' },
  { id: 'inf', es: 'Inflorescencia y fruto', en: 'Inflorescence and fruit' },
];

/* Plant, inflorescence and fruit characters, coded per family and reviewed against
   the literature. A family is excluded when the observed state is not in its list,
   so every state that common members show is listed; rare exceptions are left out.
   sub (underground organ), res (aromatic resin) and pun (translucent dots) take the
   values of KEYVEG_DEFAULT unless written. */
const KEYVEG_DEFAULT = { sub: 'no', res: '0', pun: '0' };
const KEYVEG = {
  nymphaeaceae:     { hab: 'q', fil: 'a b', hoj: 's', ner: 'r', est: '0 1', lat: '0', inf: 'sol', fru: 'bay', sub: 'riz tub' },
  magnoliaceae:     { hab: 'r a', fil: 'a', hoj: 's', ner: 'r', est: '1', lat: '0', inf: 'sol', fru: 'agr fol' },
  annonaceae:       { hab: 'r a', fil: 'a', hoj: 's', ner: 'r', est: '0', lat: '0', inf: 'sol cim', fru: 'agr bay fol' },
  lauraceae:        { hab: 'r a t', fil: 'a o', hoj: 's', ner: 'r', est: '0', lat: '0', inf: 'pan cim umb', fru: 'dru bay' },
  piperaceae:       { hab: 'h a e t r', fil: 'a o v', hoj: 's', ner: 'r', est: '0 1', lat: '0', inf: 'rac', fru: 'dru bay', pun: '0 1' },
  aristolochiaceae: { hab: 't h', fil: 'a', hoj: 's', ner: 'r', est: '0 1', lat: '0', inf: 'sol cim rac', fru: 'cap', sub: 'no riz tub' },
  araceae:          { hab: 'h t e q', fil: 'a b', hoj: 's c', ner: 'r p', est: '0', lat: '0 1', inf: 'esp', fru: 'bay inf', sub: 'cor riz tub no' },
  alismataceae:     { hab: 'q h', fil: 'b', hoj: 's', ner: 'p r', est: '0', lat: '1', inf: 'rac pan umb sol', fru: 'aqu agr', sub: 'tub riz no' },
  dioscoreaceae:    { hab: 't', fil: 'a o', hoj: 's c', ner: 'r p', est: '0', lat: '0', inf: 'rac pan', fru: 'cap', sub: 'tub riz' },
  liliaceae:        { hab: 'h', fil: 'a v b', hoj: 's', ner: 'p', est: '0', lat: '0', inf: 'sol rac', fru: 'cap', sub: 'bul' },
  orchidaceae:      { hab: 'h e t', fil: 'a b', hoj: 's', ner: 'p', est: '0', lat: '0', inf: 'rac pan sol', fru: 'cap', sub: 'riz tub no cor' },
  iridaceae:        { hab: 'h', fil: 'b a', hoj: 's', ner: 'p', est: '0', lat: '0', inf: 'cim rac sol', fru: 'cap', sub: 'cor riz bul no' },
  amaryllidaceae:   { hab: 'h', fil: 'b', hoj: 's', ner: 'p', est: '0', lat: '0', inf: 'umb sol', fru: 'cap bay', sub: 'bul riz' },
  asparagaceae:     { hab: 'h a r s t', fil: 'b a', hoj: 's', ner: 'p', est: '0', lat: '0', inf: 'rac pan umb sol cim', fru: 'cap bay', sub: 'riz tub no bul cor' },
  arecaceae:        { hab: 'r a t', fil: 'a', hoj: 'c s', ner: 'p', est: '0', lat: '0', inf: 'pan esp rac', fru: 'dru bay' },
  commelinaceae:    { hab: 'h', fil: 'a b', hoj: 's', ner: 'p', est: '0', lat: '0', inf: 'cim', fru: 'cap', sub: 'no tub' },
  musaceae:         { hab: 'h', fil: 'a', hoj: 's', ner: 'p', est: '0', lat: '1', inf: 'rac', fru: 'bay', sub: 'riz cor' },
  cannaceae:        { hab: 'h', fil: 'a', hoj: 's', ner: 'p', est: '0', lat: '0', inf: 'rac pan', fru: 'cap', sub: 'riz' },
  zingiberaceae:    { hab: 'h', fil: 'a', hoj: 's', ner: 'p', est: '0', lat: '0', inf: 'rac pan', fru: 'cap bay', sub: 'riz' },
  bromeliaceae:     { hab: 'h e', fil: 'b a', hoj: 's', ner: 'p', est: '0', lat: '0', inf: 'rac pan sol cab', fru: 'cap bay inf', sub: 'no riz' },
  cyperaceae:       { hab: 'h q', fil: 'a b', hoj: 's', ner: 'p', est: '0', lat: '0', inf: 'esg umb cab', fru: 'aqu', sub: 'riz tub no' },
  poaceae:          { hab: 'h a r', fil: 'a', hoj: 's', ner: 'p', est: '0', lat: '0', inf: 'esg', fru: 'car', sub: 'riz no' },
  papaveraceae:     { hab: 'h a r', fil: 'a b', hoj: 's c', ner: 'r', est: '0', lat: '1 0', inf: 'sol cim rac pan', fru: 'cap aqu' },
  ranunculaceae:    { hab: 'h t', fil: 'a o b', hoj: 's c', ner: 'r', est: '0', lat: '0', inf: 'sol rac cim pan', fru: 'aqu fol agr', sub: 'no riz tub' },
  cactaceae:        { hab: 's a r t e', fil: 'n a', hoj: 's', ner: 'r', est: '0', lat: '0 1', inf: 'sol cim', fru: 'bay cap', sub: 'no tub' },
  amaranthaceae:    { hab: 'h a s q', fil: 'a o n', hoj: 's', ner: 'r', est: '0', lat: '0 1', inf: 'rac pan cim cab', fru: 'aqu cap', sub: 'no tub' },
  caryophyllaceae:  { hab: 'h', fil: 'o v', hoj: 's', ner: 'r', est: '0 1', lat: '0', inf: 'cim sol pan', fru: 'cap' },
  nyctaginaceae:    { hab: 'h a t r', fil: 'o a', hoj: 's', ner: 'r', est: '0', lat: '0', inf: 'cim pan umb cab', fru: 'aqu', sub: 'tub no' },
  polygonaceae:     { hab: 'h t a r', fil: 'a b', hoj: 's', ner: 'r', est: '1', lat: '0', inf: 'rac pan cim', fru: 'aqu bay', sub: 'no tub riz' },
  portulacaceae:    { hab: 'h s', fil: 'a o', hoj: 's', ner: 'r', est: '0 1', lat: '0', inf: 'sol cim', fru: 'cap' },
  crassulaceae:     { hab: 'h s a', fil: 'b a o v', hoj: 's c', ner: 'r', est: '0', lat: '0', inf: 'cim rac pan', fru: 'fol' },
  vitaceae:         { hab: 't', fil: 'a', hoj: 's c', ner: 'r', est: '1', lat: '0', inf: 'cim pan', fru: 'bay' },
  fabaceae:         { hab: 'h a r t', fil: 'a', hoj: 'c s', ner: 'r', est: '1', lat: '0', inf: 'rac cab pan umb sol', fru: 'leg', sub: 'no tub', pun: '0 1', res: '0 1' },
  rosaceae:         { hab: 'h a r t', fil: 'a', hoj: 's c', ner: 'r', est: '1 0', lat: '0', inf: 'sol cim rac pan umb', fru: 'dru pom agr aqu' },
  rhamnaceae:       { hab: 'a r t', fil: 'a o', hoj: 's', ner: 'r', est: '1 0', lat: '0', inf: 'cim pan', fru: 'dru cap esq' },
  urticaceae:       { hab: 'h a r', fil: 'a o', hoj: 's', ner: 'r', est: '1', lat: '0 1', inf: 'cim rac pan', fru: 'aqu', sub: 'no riz' },
  moraceae:         { hab: 'r a h e t', fil: 'a', hoj: 's', ner: 'r', est: '1', lat: '1', inf: 'sic ame cab rac', fru: 'inf dru bay' },
  fagaceae:         { hab: 'r a', fil: 'a', hoj: 's', ner: 'r', est: '1 0', lat: '0', inf: 'ame sol rac', fru: 'nuz' },
  juglandaceae:     { hab: 'r', fil: 'a o', hoj: 'c', ner: 'r', est: '0', lat: '0', inf: 'ame rac sol', fru: 'nuz dru sam' },
  cucurbitaceae:    { hab: 'h t', fil: 'a', hoj: 's c', ner: 'r', est: '0', lat: '0', inf: 'sol rac cim', fru: 'pep bay cap', sub: 'no tub' },
  euphorbiaceae:    { hab: 'h a r s t', fil: 'a o', hoj: 's c', ner: 'r', est: '1 0', lat: '1 0', inf: 'cia rac cim pan', fru: 'esq cap', sub: 'no tub' },
  passifloraceae:   { hab: 't h a', fil: 'a', hoj: 's', ner: 'r', est: '1 0', lat: '0', inf: 'sol cim', fru: 'bay cap' },
  salicaceae:       { hab: 'r a', fil: 'a', hoj: 's', ner: 'r', est: '1 0', lat: '0', inf: 'ame cim rac pan', fru: 'cap bay', pun: '0 1' },
  violaceae:        { hab: 'h a r', fil: 'a b o', hoj: 's', ner: 'r', est: '1', lat: '0', inf: 'sol rac', fru: 'cap', sub: 'riz no' },
  malpighiaceae:    { hab: 'a r t', fil: 'o', hoj: 's', ner: 'r', est: '1', lat: '0', inf: 'rac pan cim umb', fru: 'dru sam esq cap' },
  oxalidaceae:      { hab: 'h r', fil: 'a b', hoj: 'c', ner: 'r', est: '0 1', lat: '0', inf: 'cim umb pan', fru: 'cap bay', sub: 'bul no tub' },
  geraniaceae:      { hab: 'h a', fil: 'o a b', hoj: 's c', ner: 'r', est: '1', lat: '0', inf: 'umb cim sol', fru: 'esq' },
  onagraceae:       { hab: 'h a r q', fil: 'a o v b', hoj: 's', ner: 'r', est: '0 1', lat: '0', inf: 'sol rac pan', fru: 'cap bay nuz', sub: 'no tub' },
  myrtaceae:        { hab: 'r a', fil: 'o a', hoj: 's', ner: 'r', est: '0', lat: '0', inf: 'cim sol pan rac umb', fru: 'bay cap', pun: '1' },
  lythraceae:       { hab: 'h a r q', fil: 'o v a', hoj: 's', ner: 'r', est: '0', lat: '0', inf: 'rac cim sol pan', fru: 'cap bay' },
  anacardiaceae:    { hab: 'r a t', fil: 'a', hoj: 'c s', ner: 'r', est: '0', lat: '1 0', inf: 'pan rac', fru: 'dru nuz sam', res: '1 0' },
  rutaceae:         { hab: 'r a h', fil: 'a o', hoj: 'c s', ner: 'r', est: '0', lat: '0', inf: 'cim pan sol rac', fru: 'hes cap dru bay fol sam', pun: '1' },
  meliaceae:        { hab: 'r a', fil: 'a', hoj: 'c', ner: 'r', est: '0', lat: '0', inf: 'pan', fru: 'cap dru' },
  sapindaceae:      { hab: 'r a t', fil: 'a o', hoj: 'c s', ner: 'r', est: '0 1', lat: '0 1', inf: 'pan rac cim', fru: 'cap dru sam bay esq' },
  burseraceae:      { hab: 'r a', fil: 'a', hoj: 'c s', ner: 'r', est: '0', lat: '0', inf: 'pan rac cim', fru: 'dru cap', res: '1' },
  malvaceae:        { hab: 'h a r t', fil: 'a', hoj: 's c', ner: 'r', est: '1', lat: '0', inf: 'sol cim pan rac', fru: 'cap esq bay nuz' },
  bixaceae:         { hab: 'a r', fil: 'a', hoj: 's', ner: 'r', est: '1', lat: '1', inf: 'pan', fru: 'cap' },
  brassicaceae:     { hab: 'h q a', fil: 'a b', hoj: 's c', ner: 'r', est: '0', lat: '0', inf: 'rac', fru: 'sil', sub: 'no tub' },
  caricaceae:       { hab: 'r a h', fil: 'a', hoj: 's c', ner: 'r', est: '0', lat: '1', inf: 'pan cim sol', fru: 'bay', sub: 'no tub' },
  tropaeolaceae:    { hab: 'h t', fil: 'a', hoj: 's', ner: 'r', est: '0', lat: '0', inf: 'sol', fru: 'esq' },
  ericaceae:        { hab: 'a r h e', fil: 'a v', hoj: 's', ner: 'r', est: '0', lat: '0', inf: 'rac pan umb sol', fru: 'bay dru cap' },
  sapotaceae:       { hab: 'r a', fil: 'a', hoj: 's', ner: 'r', est: '0', lat: '1', inf: 'cim sol', fru: 'bay' },
  ebenaceae:        { hab: 'r a', fil: 'a', hoj: 's', ner: 'r', est: '0', lat: '0', inf: 'cim sol', fru: 'bay' },
  primulaceae:      { hab: 'h a r', fil: 'a o b v', hoj: 's', ner: 'r', est: '0', lat: '0', inf: 'sol umb rac pan cim', fru: 'cap dru bay', pun: '0 1', sub: 'no tub riz' },
  polemoniaceae:    { hab: 'h t a', fil: 'a o', hoj: 's c', ner: 'r', est: '0', lat: '0', inf: 'cim sol pan cab', fru: 'cap' },
  fouquieriaceae:   { hab: 'a r s', fil: 'a n', hoj: 's', ner: 'r', est: '0', lat: '0', inf: 'pan rac', fru: 'cap' },
  rubiaceae:        { hab: 'r a h t', fil: 'o v', hoj: 's', ner: 'r', est: '1', lat: '0', inf: 'cim pan cab sol', fru: 'dru bay cap esq' },
  apocynaceae:      { hab: 'r a h t s', fil: 'o a v', hoj: 's', ner: 'r', est: '0', lat: '1', inf: 'cim umb sol rac', fru: 'fol dru bay cap', sub: 'no tub' },
  boraginaceae:     { hab: 'h a r t', fil: 'a b', hoj: 's', ner: 'r', est: '0', lat: '0', inf: 'cim pan rac', fru: 'aqu dru cap' },
  convolvulaceae:   { hab: 't h a r', fil: 'a n', hoj: 's c', ner: 'r', est: '0', lat: '1 0', inf: 'sol cim', fru: 'cap', sub: 'tub no' },
  solanaceae:       { hab: 'h a r t e', fil: 'a', hoj: 's c', ner: 'r', est: '0', lat: '0', inf: 'cim sol rac pan umb', fru: 'bay cap', sub: 'no tub' },
  oleaceae:         { hab: 'r a t', fil: 'o a', hoj: 's c', ner: 'r', est: '0', lat: '0', inf: 'pan cim rac sol', fru: 'dru sam bay cap' },
  plantaginaceae:   { hab: 'h a t q', fil: 'a o b v', hoj: 's', ner: 'r p', est: '0', lat: '0', inf: 'rac sol pan cim', fru: 'cap' },
  lamiaceae:        { hab: 'h a r', fil: 'o', hoj: 's c', ner: 'r', est: '0', lat: '0', inf: 'cim rac cab pan sol', fru: 'aqu dru', sub: 'no riz' },
  verbenaceae:      { hab: 'h a r t', fil: 'o v', hoj: 's', ner: 'r', est: '0', lat: '0', inf: 'rac cab pan', fru: 'dru esq aqu' },
  bignoniaceae:     { hab: 'r t a', fil: 'o a v', hoj: 'c s', ner: 'r', est: '0', lat: '0', inf: 'pan rac sol cim', fru: 'cap bay' },
  acanthaceae:      { hab: 'h a t r', fil: 'o', hoj: 's', ner: 'r', est: '0', lat: '0', inf: 'rac cim sol pan', fru: 'cap', sub: 'no tub' },
  scrophulariaceae: { hab: 'h a r', fil: 'o a b', hoj: 's', ner: 'r', est: '0', lat: '0', inf: 'pan rac cim sol', fru: 'cap' },
  asteraceae:       { hab: 'h a r t s', fil: 'a o b', hoj: 's c', ner: 'r', est: '0', lat: '0 1', inf: 'cab', fru: 'aqu', pun: '0 1', sub: 'no tub riz' },
  campanulaceae:    { hab: 'h a', fil: 'a b', hoj: 's', ner: 'r', est: '0', lat: '1', inf: 'rac sol pan cab', fru: 'cap bay' },
  apiaceae:         { hab: 'h q', fil: 'a b', hoj: 'c s', ner: 'r p', est: '0', lat: '0', inf: 'umb cab', fru: 'esq', sub: 'no tub' },
  adoxaceae:        { hab: 'a r', fil: 'o', hoj: 'c s', ner: 'r', est: '0 1', lat: '0', inf: 'cim umb', fru: 'dru bay' },
};

/* plant characters of one kind of flower of a family, when they differ within it
   (keys: 'typical:i', 'variant:i' or 'sp:<scientific name>'; a species built on a
   variant inherits what is written for that variant) */
const KEYROW = {
  asparagaceae: { 'variant:0': { hab: 'a r', fil: 'b', sub: 'no' }, 'sp:Asparagus officinalis': { hab: 'h', fil: 'a', sub: 'riz' } },
  oxalidaceae: { 'typical:0': { hab: 'h', sub: 'bul no tub' }, 'sp:Averrhoa carambola': { hab: 'r', fil: 'a', sub: 'no' } },
  malvaceae: { 'variant:0': { hoj: 's', hab: 'r a' } },
  apocynaceae: { 'sp:Cascabela thevetia': { hab: 'r a', fil: 'a', fru: 'dru' } },
  boraginaceae: { 'sp:Heliotropium curassavicum': { hab: 'h', fru: 'aqu' } },
  scrophulariaceae: { 'typical:0': { hab: 'h a' }, 'variant:0': { hab: 'a r', fil: 'o', est: '0 1' }, 'sp:Verbascum thapsus': { hab: 'h', fil: 'a b' } },
  bignoniaceae: { 'typical:0': { hoj: 'c', hab: 'r t a', fil: 'o v' }, 'sp:Crescentia alata': { hoj: 'c s', hab: 'r', fil: 'a', fru: 'bay' } },
};

/* floral states of a family that its flower models do not show (known variation) */
const KEYFIX = {
  euphorbiaceae: { per: 'cc' },           /* Jatropha has petals */
  cucurbitaceae: { fus: 'lib' },          /* cucumber has free stamens */
};

window.KEYCHARS = KEYCHARS; window.KEYGROUPS = KEYGROUPS; window.KEYVEG = KEYVEG; window.KEYVEG_DEFAULT = KEYVEG_DEFAULT; window.KEYROW = KEYROW; window.KEYFIX = KEYFIX;
