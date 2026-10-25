/* FloralPro — Block 4 data core: the APG IV tree and the family registry.

   A family:
   { id, name, es, en (vernacular names of the family), order, clade (id in APG below),
     typical: model | [{label, m}]     the typical flower (several when the flowers are unisexual),
     variants: [{label, m}]            other flower types of the family (e.g. subfamilies),
     chars: {es: [...], en: [...]}     distinctive characters,
     fruit: {es, en}, mx: {es, en}     fruit, and importance in Mexico,
     species: [{ sci, es, en, st, note: {es, en}, m | flowers: [{label, m}] }] }
   st (status in Mexico): 'end' endemic, 'nat' native, 'dom' domesticated in Mexico or
   Mesoamerica, 'cult' cultivated (foreign origin), 'intro' introduced and naturalised.
   A species model may be a full model, 'sp:<specimen>[:i]', or {base: 'typical' | 'typical:i' |
   'variant:i', …overrides}; top-level keys of the overrides replace those of the base,
   except colors and look, which are merged. A species without a model is listed without
   a flower of its own. */

const APG = {
  /* clades in the order they are shown; parent null = top */
  clades: [
    { id: 'angio', parent: null, es: 'Angiospermas', en: 'Angiosperms' },
    { id: 'ana', parent: 'angio', es: 'Angiospermas de divergencia temprana (grado ANA)', en: 'Early-diverging angiosperms (ANA grade)' },
    { id: 'magnoliids', parent: 'angio', es: 'Magnólidas', en: 'Magnoliids' },
    { id: 'monocots', parent: 'angio', es: 'Monocotiledóneas', en: 'Monocots' },
    { id: 'commelinids', parent: 'monocots', es: 'Commelínidas', en: 'Commelinids' },
    { id: 'eudicots', parent: 'angio', es: 'Eudicotiledóneas', en: 'Eudicots' },
    { id: 'core', parent: 'eudicots', es: 'Eudicotiledóneas núcleo', en: 'Core eudicots' },
    { id: 'pentapetalae', parent: 'core', es: 'Pentapetalae', en: 'Pentapetalae' },
    { id: 'superrosids', parent: 'pentapetalae', es: 'Superrósidas', en: 'Superrosids' },
    { id: 'rosids', parent: 'superrosids', es: 'Rósidas', en: 'Rosids' },
    { id: 'fabids', parent: 'rosids', es: 'Fábidas', en: 'Fabids' },
    { id: 'malvids', parent: 'rosids', es: 'Málvidas', en: 'Malvids' },
    { id: 'superasterids', parent: 'pentapetalae', es: 'Superastéridas', en: 'Superasterids' },
    { id: 'asterids', parent: 'superasterids', es: 'Astéridas', en: 'Asterids' },
    { id: 'lamiids', parent: 'asterids', es: 'Lámidas', en: 'Lamiids' },
    { id: 'campanulids', parent: 'asterids', es: 'Campanúlidas', en: 'Campanulids' },
  ],
  /* orders, each in a clade, in APG IV order */
  orders: [
    ['Nymphaeales', 'ana'], ['Magnoliales', 'magnoliids'], ['Laurales', 'magnoliids'], ['Piperales', 'magnoliids'],
    ['Alismatales', 'monocots'], ['Dioscoreales', 'monocots'], ['Liliales', 'monocots'], ['Asparagales', 'monocots'],
    ['Arecales', 'commelinids'], ['Commelinales', 'commelinids'], ['Zingiberales', 'commelinids'], ['Poales', 'commelinids'],
    ['Ranunculales', 'eudicots'],
    ['Saxifragales', 'superrosids'], ['Vitales', 'rosids'],
    ['Fabales', 'fabids'], ['Rosales', 'fabids'], ['Fagales', 'fabids'], ['Cucurbitales', 'fabids'], ['Oxalidales', 'fabids'], ['Malpighiales', 'fabids'],
    ['Geraniales', 'malvids'], ['Myrtales', 'malvids'], ['Sapindales', 'malvids'], ['Malvales', 'malvids'], ['Brassicales', 'malvids'],
    ['Caryophyllales', 'superasterids'], ['Ericales', 'asterids'],
    ['Gentianales', 'lamiids'], ['Boraginales', 'lamiids'], ['Solanales', 'lamiids'], ['Lamiales', 'lamiids'],
    ['Asterales', 'campanulids'], ['Apiales', 'campanulids'], ['Dipsacales', 'campanulids'],
  ],
};

const FAMILIES = [];
/* the catalogue follows the linear sequence of APG IV, order by order (a stable
   sort keeps the families of one order in the sequence of the data files) */
function FAMILIES_ADD(list) {
  list.forEach(f => FAMILIES.push(f));
  const oi = f => APG.orders.findIndex(o => o[0] === f.order);
  FAMILIES.sort((a, b) => oi(a) - oi(b));
}

const Fam = (function () {
  const ST = {
    end: { es: 'endémica de México', en: 'endemic to Mexico', cls: 'end' },
    nat: { es: 'nativa de México', en: 'native to Mexico', cls: 'nat' },
    dom: { es: 'domesticada en México o Mesoamérica', en: 'domesticated in Mexico or Mesoamerica', cls: 'dom' },
    cult: { es: 'cultivada, de origen extranjero', en: 'cultivated, of foreign origin', cls: 'cult' },
    intro: { es: 'introducida y naturalizada', en: 'introduced and naturalised', cls: 'intro' },
  };
  const byId = id => FAMILIES.find(f => f.id === id);
  const orderOf = f => APG.orders.find(o => o[0] === f.order);
  function cladePath(f) {
    const o = orderOf(f);
    const path = [];
    let c = o ? APG.clades.find(x => x.id === o[1]) : null;
    while (c) { path.unshift(c); c = c.parent ? APG.clades.find(x => x.id === c.parent) : null; }
    return path;
  }
  /* the typical flowers of a family, always as a list */
  const typicalList = f => Array.isArray(f.typical) ? f.typical : [{ label: null, m: f.typical }];
  function fromSpecimen(ref) {
    const [, id, i] = ref.split(':');
    const sp = SPECIMENS.find(x => x.id === id);
    return sp ? sp.flowers[+(i || 0)].m : null;
  }
  function resolve(f, m) {
    if (!m) return null;
    if (typeof m === 'string') return m.startsWith('sp:') ? fromSpecimen(m) : null;
    if (!m.base) return m;
    const [kind, idx] = m.base.split(':');
    let base = null;
    if (kind === 'typical') base = typicalList(f)[+(idx || 0)].m;
    if (kind === 'variant') base = (f.variants || [])[+(idx || 0)].m;
    base = resolve(f, base);
    const out = JSON.parse(JSON.stringify(base));
    for (const k in m) {
      if (k === 'base') continue;
      if ((k === 'colors' || k === 'look') && m[k] && typeof m[k] === 'object') out[k] = Object.assign({}, out[k] || {}, m[k]);
      else if (m[k] === null) delete out[k];
      else out[k] = JSON.parse(JSON.stringify(m[k]));
    }
    return out;
  }
  /* the flowers of a species: its own, or none */
  function speciesFlowers(f, s) {
    if (s.flowers) return s.flowers.map(x => ({ label: x.label || null, m: resolve(f, x.m) }));
    if (s.m) return [{ label: null, m: resolve(f, s.m) }];
    return [];
  }
  function allFlowers(f) {
    const out = [];
    typicalList(f).forEach((x, i) => out.push({ kind: 'typical', i, label: x.label, m: resolve(f, x.m) }));
    (f.variants || []).forEach((x, i) => out.push({ kind: 'variant', i, label: x.label, m: resolve(f, x.m) }));
    f.species.forEach((s, si) => speciesFlowers(f, s).forEach((x, i) => out.push({ kind: 'species', si, i, label: x.label, m: x.m, sp: s })));
    return out;
  }
  return { ST, byId, cladePath, typicalList, resolve, speciesFlowers, allFlowers, orderOf };
})();
window.APG = APG; window.FAMILIES = FAMILIES; window.FAMILIES_ADD = FAMILIES_ADD; window.Fam = Fam;
