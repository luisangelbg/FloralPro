/* FloralPro — the teacher's own photos (Block 8).

   Photos are kept in the browser: in IndexedDB, reduced to at most 1600 px;
   where IndexedDB does not answer (some browsers, for pages opened as files)
   in localStorage, reduced to 1000 px, which holds a few dozen. Each keeps
   its tags — family, species, gymnosperm, atlas plate, part of the plant — and
   its caption, author and licence.

   A photo package is a small script file:
       window.FLORALPRO_PHOTOS = { app: 'FloralPro', v: 1, photos: [ … ] };
   It is exported from the Photos tab, imported by another teacher, or copied
   as fotos/fotos.js into the FloralPro folder: the app loads that file on start,
   so the photos travel with the published app (they are shown read-only, with
   a mark). Nothing is sent anywhere.

   Photos.ready → Promise; Photos.list() → the photos (browser + bundled);
   Photos.add(files) → Promise<[photo]>; Photos.update(id, fields); Photos.remove(id);
   Photos.forFamily(id), forSpecies(sci), forGym(ex), forPlate(id);
   Photos.packageText(ids), Photos.importText(text); 'photoschange' event. */

const Photos = (function () {
  const DBN = 'floralpro-photos', ST = 'photos';
  const S = { db: null, list: [], bundled: [], mem: false, ls: false, full: false, ready: null };
  const LSK = 'floralpro:photos';
  /* without IndexedDB (some browsers, for pages opened as files) the photos go to localStorage, smaller */
  function lsRead() { try { const v = JSON.parse(localStorage.getItem(LSK) || '[]'); return Array.isArray(v) ? v : []; } catch (e) { return []; } }
  function lsWrite() { try { localStorage.setItem(LSK, JSON.stringify(S.list)); S.full = false; return true; } catch (e) { S.full = true; return false; } }
  const PARTS = [
    ['plant', 'Planta', 'Plant'], ['flower', 'Flor', 'Flower'], ['infl', 'Inflorescencia', 'Inflorescence'], ['fruit', 'Fruto', 'Fruit'],
    ['seed', 'Semilla', 'Seed'], ['leaf', 'Hoja', 'Leaf'], ['pcone', 'Cono de polen', 'Pollen cone'], ['scone', 'Cono de semillas', 'Seed cone'], ['detail', 'Detalle', 'Detail'],
  ];
  const LICENSES = ['CC BY 4.0', 'CC BY-SA 4.0', 'CC BY-NC 4.0', 'CC BY-NC-SA 4.0', 'CC0 1.0', 'Todos los derechos reservados'];

  /* ---------------- storage ---------------- */
  function openDB() {
    return new Promise(resolve => {
      let req, done = false;
      const end = v => { if (!done) { done = true; resolve(v); } };
      /* some browsers never answer for pages opened as files: after a while, keep photos in memory */
      setTimeout(() => end(null), 3000);
      try { req = indexedDB.open(DBN, 1); } catch (e) { end(null); return; }
      req.onupgradeneeded = () => { const db = req.result; if (!db.objectStoreNames.contains(ST)) db.createObjectStore(ST, { keyPath: 'id' }); };
      req.onsuccess = () => { if (done) { try { req.result.close(); } catch (e) { /* late */ } } end(req.result); };
      req.onerror = () => end(null);
      req.onblocked = () => end(null);
    });
  }
  const tx = (mode, fn) => new Promise((resolve, reject) => {
    if (!S.db) { resolve(); return; }
    const t = S.db.transaction(ST, mode), st = t.objectStore(ST);
    const r = fn(st);
    t.oncomplete = () => resolve(r && r.result);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error || new Error('abort'));
  });
  async function load() {
    S.db = await openDB();
    if (!S.db) { try { localStorage.setItem(LSK + ':probe', '1'); localStorage.removeItem(LSK + ':probe'); S.ls = true; } catch (e) { S.ls = false; } }
    S.mem = !S.db && !S.ls;
    if (S.ls) S.list = lsRead().filter(valid);
    if (S.db) {
      S.list = await new Promise(resolve => {
        const out = [];
        const req = S.db.transaction(ST).objectStore(ST).openCursor();
        req.onsuccess = () => { const c = req.result; if (c) { out.push(c.value); c.continue(); } else resolve(out); };
        req.onerror = () => resolve(out);
      });
    }
    const pkg = window.FLORALPRO_PHOTOS;
    S.bundled = pkg && Array.isArray(pkg.photos) ? pkg.photos.filter(valid).map(p => Object.assign({}, p, { b: true })) : [];
    S.list.sort((a, b) => (a.t || 0) - (b.t || 0));
    changed();
  }
  const valid = p => p && typeof p.id === 'string' && typeof p.src === 'string' && /^data:image\//.test(p.src);
  const changed = () => document.dispatchEvent(new CustomEvent('photoschange'));
  function list() {
    const own = new Set(S.list.map(p => p.id));
    return S.list.concat(S.bundled.filter(p => !own.has(p.id)));
  }
  const byId = id => list().find(p => p.id === id) || null;

  /* ---------------- adding photos ---------------- */
  function fnv(s) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i += 7) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(16).padStart(8, '0'); }
  function loadImage(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file), img = new Image();
      img.onload = () => { resolve(img); setTimeout(() => URL.revokeObjectURL(url), 1000); };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('image')); };
      img.src = url;
    });
  }
  function scaled(img, max, q) {
    const w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
    const k = Math.min(1, max / Math.max(w, h));
    const cv = document.createElement('canvas');
    cv.width = Math.max(1, Math.round(w * k)); cv.height = Math.max(1, Math.round(h * k));
    const ctx = cv.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.drawImage(img, 0, 0, cv.width, cv.height);
    return { src: cv.toDataURL('image/jpeg', q), w: cv.width, h: cv.height };
  }
  async function add(files, tags) {
    const out = [], bad = [];
    for (const f of files) {
      if (!/^image\//.test(f.type || '') && !/\.(jpe?g|png|webp|gif|bmp)$/i.test(f.name || '')) { bad.push(f.name); continue; }
      let img;
      try { img = await loadImage(f); } catch (e) { bad.push(f.name); continue; }
      const big = S.ls ? scaled(img, 1000, 0.78) : scaled(img, 1600, 0.85), th = scaled(img, S.ls ? 240 : 360, 0.75);
      const p = Object.assign({ id: 'p' + fnv(big.src) + big.src.length.toString(36), src: big.src, th: th.src, w: big.w, h: big.h, fam: '', sp: '', gym: '', plate: '', part: '', cap: (f.name || '').replace(/\.[^.]+$/, ''), author: '', lic: '', date: '', place: '', t: Date.now() + out.length }, tags || {});
      if (S.list.some(x => x.id === p.id)) continue;
      try { await put(p); } catch (e) { if (e.message === 'full') { bad.push(f.name); break; } throw e; }
      out.push(p);
    }
    changed();
    return { added: out, bad, full: S.full };
  }
  async function put(p) {
    if (S.db) await tx('readwrite', st => st.put(p));
    const i = S.list.findIndex(x => x.id === p.id), prev = i >= 0 ? S.list[i] : null;
    if (i >= 0) S.list[i] = p; else S.list.push(p);
    /* localStorage is small: when it is full the photo is not kept and the caller is told */
    if (S.ls && !lsWrite()) {
      if (prev) S.list[i] = prev; else S.list.pop();
      throw new Error('full');
    }
  }
  async function update(id, fields) {
    const p = S.list.find(x => x.id === id);
    if (!p) return null;
    Object.assign(p, fields);
    await put(p);
    changed();
    return p;
  }
  async function remove(id) {
    if (S.db) await tx('readwrite', st => st.delete(id));
    S.list = S.list.filter(p => p.id !== id);
    if (S.ls) lsWrite();
    changed();
  }

  /* ---------------- packages ---------------- */
  const KEEP = ['id', 'src', 'th', 'w', 'h', 'fam', 'sp', 'gym', 'plate', 'part', 'cap', 'author', 'lic', 'date', 'place', 't'];
  function packageText(ids) {
    const pick = ids ? list().filter(p => ids.includes(p.id)) : list();
    const photos = pick.map(p => { const o = {}; KEEP.forEach(k => { if (p[k] != null && p[k] !== '') o[k] = p[k]; }); return o; });
    return '/* FloralPro · paquete de fotos. Cópialo como fotos/fotos.js dentro de la carpeta de FloralPro para que viaje con la app. */\n' +
      'window.FLORALPRO_PHOTOS = ' + JSON.stringify({ app: 'FloralPro', v: 1, made: new Date().toISOString().slice(0, 10), photos }) + ';\n';
  }
  async function importText(text) {
    const a = text.indexOf('{'), b = text.lastIndexOf('}');
    if (a < 0 || b < a) throw new Error('format');
    const pkg = JSON.parse(text.slice(a, b + 1));
    if (!pkg || !Array.isArray(pkg.photos)) throw new Error('format');
    let n = 0, dup = 0;
    for (const p of pkg.photos) {
      if (!valid(p)) continue;
      if (S.list.some(x => x.id === p.id)) { dup++; continue; }
      const q = {}; KEEP.forEach(k => { q[k] = p[k] != null ? p[k] : ''; });
      if (!q.th) q.th = q.src;
      try { await put(q); } catch (e) { if (e.message === 'full') break; throw e; }
      n++;
    }
    changed();
    return { added: n, dup, full: S.full };
  }

  /* ---------------- finding photos ---------------- */
  const forFamily = id => list().filter(p => p.fam === id);
  const forSpecies = sci => list().filter(p => p.sp && p.sp === sci);
  const forGym = ex => list().filter(p => p.gym === ex);
  const forPlate = id => list().filter(p => p.plate === id);
  const partName = k => { const p = PARTS.find(x => x[0] === k); return p ? p.slice(1) : null; };
  function credit(p) {
    const bits = [p.author, p.lic, p.date, p.place].filter(Boolean);
    return bits.join(' · ');
  }
  /* the name a photo is known by: its species, family or gymnosperm */
  function label(p) {
    const T = (es, en) => (window.I18N && I18N.lang === 'en') ? en : es;
    if (p.sp) return p.sp;
    if (p.fam && window.Fam && Fam.byId(p.fam)) return Fam.byId(p.fam).name;
    if (p.gym && window.GYMNO && GYMNO.exById(p.gym)) return GYMNO.exById(p.gym).sci;
    return T('Sin etiquetar', 'Untagged');
  }
  async function usage() {
    try { if (navigator.storage && navigator.storage.estimate) { const e = await navigator.storage.estimate(); return e.usage || 0; } } catch (e) { /* not available */ }
    return S.list.reduce((s, p) => s + (p.src || '').length + (p.th || '').length, 0);
  }

  S.ready = load();
  return { S, get ready() { return S.ready; }, list, byId, add, update, remove, packageText, importText, forFamily, forSpecies, forGym, forPlate, PARTS, LICENSES, partName, credit, label, usage };
})();
window.Photos = Photos;

/* ---------------- a photo viewer shared by every block ---------------- */
const PhotoView = (function () {
  let dlg = null, items = [], i = 0;
  function build() {
    dlg = mk('dialog', { class: 'ph-dlg' });
    dlg.innerHTML = `<button class="icon-btn ph-x" data-ph="close" data-es-title="Cerrar" data-en-title="Close" title="Cerrar">✕</button>
      <button class="icon-btn ph-prev" data-ph="prev">‹</button><figure class="ph-fig"><img alt=""><figcaption></figcaption></figure><button class="icon-btn ph-next" data-ph="next">›</button>`;
    document.body.appendChild(dlg);
    dlg.addEventListener('click', e => {
      const b = e.target.closest('[data-ph]');
      if (b) { const a = b.dataset.ph; if (a === 'close') dlg.close(); else show(i + (a === 'next' ? 1 : -1)); return; }
      if (e.target === dlg) dlg.close();
    });
    dlg.addEventListener('keydown', e => { if (e.key === 'ArrowRight') show(i + 1); if (e.key === 'ArrowLeft') show(i - 1); });
  }
  function show(k) {
    i = (k + items.length) % items.length;
    const p = items[i];
    dlg.querySelector('img').src = p.src;
    dlg.querySelector('figcaption').innerHTML = `<b>${esc(Photos.label(p))}</b>${p.cap ? ' — ' + esc(p.cap) : ''}${Photos.credit(p) ? `<span class="ph-cr">${esc(Photos.credit(p))}</span>` : ''}`;
    dlg.querySelectorAll('.ph-prev, .ph-next').forEach(b => { b.style.visibility = items.length > 1 ? '' : 'hidden'; });
  }
  function open(list, k) {
    if (!list || !list.length) return;
    if (!dlg) build();
    items = list;
    show(k || 0);
    I18N.apply(dlg);
    if (!dlg.open) { try { dlg.showModal(); } catch (e) { dlg.setAttribute('open', ''); } }
  }
  /* a strip of thumbnails that opens the viewer */
  function strip(list, title) {
    if (!list.length) return '';
    return `<div class="ph-strip" data-ids="${list.map(p => p.id).join(',')}">${title ? `<div class="ph-strip-t">${title}</div>` : ''}${list.map((p, k) => `<button class="ph-th" data-k="${k}" title="${esc(Photos.label(p))}${p.cap ? ' — ' + esc(p.cap) : ''}"><img src="${p.th || p.src}" alt=""></button>`).join('')}</div>`;
  }
  document.addEventListener('click', e => {
    const t = e.target.closest('.ph-strip .ph-th');
    if (!t) return;
    const ids = t.closest('.ph-strip').dataset.ids.split(',');
    open(ids.map(Photos.byId).filter(Boolean), +t.dataset.k);
  });
  return { open, strip };
})();
window.PhotoView = PhotoView;
