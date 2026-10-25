/* FloralPro — Block 6: self-assessment.

   Practice: the student picks the kinds of question, the level, the formula
   convention and how many; every answer is corrected at once and explained.

   Exam: the teacher prepares an exam (kinds, level, convention, number, time,
   what to show at the end) and shares a link or a code; everyone gets the same
   questions (quiz.js draws them from a seed). No feedback is shown during the
   exam; answers are kept in the browser in case the page is reloaded. At the
   end the student downloads a certificate whose code holds the exam and the
   answers, so the teacher's copy of the app grades them again and can tell a
   certificate that was altered. Everything works without a server. */

const B6 = (function () {
  const S = { built: false, tab: 'practice', mode: null, cfg: null, qs: [], i: 0, ans: [], shown: [], t0: 0, t1: 0, timer: 0, name: '', mat: '', att: 1, f3d: null, last: null, tcfg: null };
  const T2 = x => Array.isArray(x) ? (I18N.lang === 'en' ? x[1] : x[0]) : (x && typeof x === 'object' ? (I18N.lang === 'en' ? (x.en || x.es) : x.es) : x);
  const Lp = p => L2(p[0], p[1]);
  const Lo = o => L2(o.es, o.en);
  const KEYS = ['✱', '*', '↑', '↓', '⚥', '♂', '♀', 'K', 'C', 'P', 'A', 'G', 'E', '(', ')', '[', ']', '+', ':', '∞', '–', '°', 'ʳ', '⁰', 'G̲', 'Ğ', '-G-'];
  const typeOf = id => QUIZ.TYPES.find(t => t.id === id);
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem('floralpro:q6:' + k) || 'null'); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem('floralpro:q6:' + k, JSON.stringify(v)); } catch (e) { /* private window */ } },
  };
  const convName = c => c === 'prenner' ? ['de Prenner', 'Prenner'] : ['clásica', 'classic'];
  const fmt = ms => { const s = Math.max(0, Math.round(ms / 1000)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const when = t => new Date(t).toLocaleString(I18N.lang === 'en' ? 'en-GB' : 'es-MX', { dateStyle: 'short', timeStyle: 'short' });

  /* ---------------- screens ---------------- */
  function show(screen) {
    ['q6Home', 'q6Teacher', 'q6Run', 'q6End'].forEach(id => { el(id).style.display = id === screen ? '' : 'none'; });
    el('q6Tabs').style.display = screen === 'q6Home' || screen === 'q6Teacher' ? '' : 'none';
  }
  function showTab(t) {
    S.tab = t;
    els('#q6Tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === t));
    if (t === 'teacher') { renderTeacher(); show('q6Teacher'); } else { renderHome(); show('q6Home'); }
  }

  /* ---------------- options shared by practice and the teacher ---------------- */
  function typeBoxes(sel, name) {
    const grp = (g, es, en) => `<fieldset class="q-grp"><legend>${L2(es, en)}</legend>${QUIZ.TYPES.filter(t => t.grp === g).map(t =>
      `<label class="tgl"><input type="checkbox" name="${name}" value="${t.id}"${sel.includes(t.id) ? ' checked' : ''}> ${Lo(t)}</label>`).join('')}</fieldset>`;
    return grp('f', 'Fórmula floral', 'Floral formula') + grp('t', 'Términos del atlas', 'Atlas terms') + (window.GYMNO ? grp('g', 'Gimnospermas', 'Gymnosperms') : '');
  }
  const seg = (name, val, opts) => `<div class="seg q-seg" data-seg="${name}">${opts.map(o => `<button type="button" data-v="${o[0]}"${o[0] === val ? ' class="on"' : ''}>${L2(o[1], o[2])}</button>`).join('')}</div>`;
  const LEVELS = () => QUIZ.LEVELS.map(l => [l.id, l.es, l.en]);
  const CONVS = [['classic', 'Clásica', 'Classic'], ['prenner', 'Prenner', 'Prenner']];
  function readForm(root, name) {
    const types = els(`input[name="${name}"]:checked`, root).map(i => i.value);
    const segv = n => { const b = root.querySelector(`[data-seg="${n}"] .on`); return b ? b.dataset.v : null; };
    return { types, level: segv('level'), conv: segv('conv') };
  }

  /* ---------------- practice ---------------- */
  function renderHome() {
    const p = Prefs.get('q6', { types: QUIZ.TYPES.map(t => t.id), level: 'basic', conv: state.conv, n: 10 });
    el('q6Home').innerHTML = `
      <div class="q-cols">
        <section class="card q-setup">
          <h3>${L2('Practica', 'Practise')}</h3>
          <p class="hint">${L2('Elige qué quieres practicar. Cada respuesta se corrige al momento y se explica.', 'Choose what to practise. Each answer is corrected at once and explained.')}</p>
          <div class="q-types">${typeBoxes(p.types, 'q6t')}</div>
          <div class="q-row"><span class="q-lab">${L2('Nivel', 'Level')}</span>${seg('level', p.level, LEVELS())}</div>
          <div class="q-row"><span class="q-lab">${L2('Fórmula', 'Formula')}</span>${seg('conv', p.conv, CONVS)}</div>
          <div class="q-row"><span class="q-lab">${L2('Preguntas', 'Questions')}</span><select class="sel" id="q6N" aria-label="${T('Número de preguntas', 'Number of questions')}" data-es-title="Número de preguntas" data-en-title="Number of questions">${[5, 10, 15, 20].map(n => `<option${n === p.n ? ' selected' : ''}>${n}</option>`).join('')}</select></div>
          <p class="hint q-lvl-note">${L2('Básico: flores regulares y sencillas; intermedio: agrega adnación, flores unisexuales y estaminodios; avanzado: piezas desiguales, haces y todo el catálogo.', 'Basic: simple regular flowers; intermediate: adds adnation, unisexual flowers and staminodes; advanced: unequal members, bundles and the whole catalogue.')}</p>
          <button class="btn btn-primary" id="q6Start">${L2('Empezar', 'Start')}</button>
          <span class="q-msg" id="q6Msg"></span>
        </section>
        <section class="card q-join">
          <h3>${L2('¿Te dieron un examen?', 'Were you given an exam?')}</h3>
          <p class="hint">${L2('Abre el enlace que te dio tu profesor, o pega aquí el código del examen.', 'Open the link your teacher gave you, or paste the exam code here.')}</p>
          <input class="at-search" id="q6ExCode" placeholder="FPX.…" aria-label="${T('Código del examen', 'Exam code')}" data-es-title="Código del examen" data-en-title="Exam code">
          <button class="btn btn-secondary btn-sm" id="q6ExOpen">${L2('Abrir el examen', 'Open the exam')}</button>
          <span class="q-msg" id="q6ExMsg"></span>
        </section>
      </div>`;
  }
  function startPractice() {
    const f = readForm(el('q6Home'), 'q6t');
    if (!f.types.length) { el('q6Msg').innerHTML = L2('Elige al menos un tipo de pregunta.', 'Choose at least one kind of question.'); return; }
    const n = +el('q6N').value;
    Prefs.set('q6', { types: f.types, level: f.level, conv: f.conv, n });
    begin('practice', { types: f.types, level: f.level, conv: f.conv, n, seed: QUIZ.newSeed(), reveal: 'full', time: 0 });
  }
  function begin(mode, cfg, resume) {
    S.mode = mode; S.cfg = cfg;
    S.qs = QUIZ.generate(cfg);
    S.i = 0;
    S.ans = resume ? resume.ans.slice() : new Array(S.qs.length).fill(null);
    S.shown = new Array(S.qs.length).fill(false);
    S.t0 = resume ? resume.t0 : Date.now();
    show('q6Run');
    startTimer();
    renderQ();
    window.scrollTo({ top: 0 });
  }

  /* ---------------- one question ---------------- */
  function stimFlower(q, withSection) {
    return `<div class="q-views">
      <div class="q-pane q-3d" id="q6F3d"></div>
      <div class="q-pane paper">${Diagram.svg(q.flower.m, { colors: 'natural' })}</div>
      ${withSection ? `<div class="q-pane paper">${Section.svg(q.flower.m, { colors: 'natural', labels: false })}</div>` : ''}
    </div>`;
  }
  const formulaBig = m => `<div class="q-formula">${Formula.html(m, S.cfg.conv, {})}</div>`;
  function optionHTML(q, o, k) {
    let inner;
    if (q.type === 'fpick') inner = Formula.html(o.m, S.cfg.conv, {});
    else if (q.type === 'fdiag') inner = `<div class="q-optfig paper">${Diagram.svg(o.m, { colors: 'natural' })}</div>`;
    else if (q.type === 'fread') inner = Lo(o);
    else if (q.type === 'tname') inner = Lp(o.plate.t);
    else if (q.type === 'tdef') inner = Lp(o.plate.d);
    else if (q.type === 'tfig') { const f = QUIZ.cleanFig(o.plate); inner = `<div class="q-optfig ${f.t === '3d' ? 'soft' : 'paper'}">${B3.figSVG(o.plate, f)}</div>`; }
    else if (q.type === 'gname') inner = Lo(GYMNO.ORG[o.org]);
    else if (q.type === 'ggroup') { const g = GYMNO.grpById(o.grp); inner = `${esc(g.name)} <span class="muted">(${L2(esc(g.es), esc(g.en))})</span>`; }
    else if (q.type === 'gflor') inner = Lp(GFLOR[o.key]);
    const fig = q.type === 'fdiag' || q.type === 'tfig';
    return `<button class="q-opt${fig ? ' fig' : ''}" data-k="${k}"><span class="q-letter">${'ABCD'[k]}</span><span class="q-otext">${inner}</span></button>`;
  }
  function prompt(q) {
    switch (q.type) {
      case 'fwrite': return L2(`Escribe la fórmula floral de esta flor (convención ${convName(S.cfg.conv)[0]}).`, `Write the floral formula of this flower (${convName(S.cfg.conv)[1]} convention).`);
      case 'fpick': return L2('¿Cuál es la fórmula de esta flor?', 'Which is the formula of this flower?');
      case 'fdiag': return L2('¿Qué diagrama corresponde a esta fórmula?', 'Which diagram matches this formula?');
      case 'fread': return Lp(q.q);
      case 'tname': return L2('¿Cómo se llama lo que muestra la figura?', 'What is shown in the figure called?');
      case 'tdef': return L2(`¿Qué significa «${esc(q.plate.t[0])}»?`, `What does "${esc(q.plate.t[1])}" mean?`);
      case 'tfig': return L2(`¿Qué figura muestra: «${esc(q.plate.t[0])}»?`, `Which figure shows: "${esc(q.plate.t[1])}"?`);
      case 'gname': return L2('¿Qué parte del estróbilo está resaltada en el corte?', 'Which part of the strobilus is highlighted in the section?');
      case 'ggroup': return L2('¿A qué familia pertenece esta estructura?', 'Which family does this structure belong to?');
      case 'gflor': return q.kind === 'stmt' ? L2('¿De quién es esta característica?', 'Whose feature is this?') : L2('¿Es una flor o una estructura reproductora de gimnosperma?', 'Is this a flower or a gymnosperm reproductive structure?');
    }
    return '';
  }
  const GFLOR = { flower: ['Una flor (angiosperma)', 'A flower (angiosperm)'], strob: ['Un estróbilo o estructura de gimnosperma', 'A strobilus or gymnosperm structure'], ang: ['Angiospermas', 'Angiosperms'], gym: ['Gimnospermas', 'Gymnosperms'], both: ['Ambas', 'Both'] };
  const gModel = q => GYMNO.byId(q.strob);
  const gWho = q => { const m = gModel(q), e = GYMNO.exById(m.ex), g = GYMNO.grpById(e.grp); return `<i>${esc(e.sci)}</i> (${esc(g.name)}) · ${m.sex === 'm' ? L2('estructura masculina', 'male structure') : L2('estructura femenina', 'female structure')}${m.sex === 'f' ? ' · ' + (q.stage === 'pol' ? L2('en la polinización', 'at pollination') : L2('madura', 'ripe')) : ''}`; };
  function stimulus(q) {
    switch (q.type) {
      case 'fwrite': return stimFlower(q, true);
      case 'fpick': return stimFlower(q, false);
      case 'fdiag': case 'fread': return formulaBig(q.flower.m);
      case 'tname': { const f = QUIZ.cleanFig(q.plate); return `<div class="q-fig ${f.t === '3d' ? 'soft' : 'paper'}">${B3.figSVG(q.plate, f)}</div>`; }
      case 'gname': return `<div class="q-fig paper">${ConeFig.section(gModel(q), { stage: q.stage, labels: false, focus: q.org })}</div>`;
      case 'ggroup': return `<div class="q-fig soft">${Cone3D.staticSVG(gModel(q), { stage: q.stage, open: q.stage === 'pol' ? 0.3 : 0 })}</div>`;
      case 'gflor':
        if (q.kind === 'stmt') return `<div class="q-stmt">«${Lo(GYMNO.TRAITS[q.trait])}»</div>`;
        return `<div class="q-fig soft">${q.flower ? Flower3D.staticSVG(q.flower.m, { colors: 'natural' }) : Cone3D.staticSVG(gModel(q), { stage: q.stage })}</div>`;
    }
    return '';
  }
  function answerArea(q) {
    if (q.type === 'fwrite') {
      const v = S.ans[S.i] || '';
      return `<div class="q-write">
        <input class="b2-finput q-input" id="q6Input" value="${esc(v)}" aria-label="${esc(T('Tu respuesta: la fórmula floral', 'Your answer: the floral formula'))}" autocomplete="off" spellcheck="false" placeholder="${S.cfg.conv === 'prenner' ? '* K5 C(5) A5 G̲(2)' : '✱ K5 C(5) A5 G̲(2)'}">
        <div class="kbd" id="q6Keys">${KEYS.map(k => `<button class="kb" data-k="${esc(k)}">${esc(k)}</button>`).join('')}<button class="kb kb-wide" data-k="⌫">⌫</button></div>
        <div class="q-echo" id="q6Echo"></div>
      </div>`;
    }
    return `<div class="q-opts${q.type === 'fdiag' || q.type === 'tfig' ? ' figs' : ''}">${q.opts.map((o, k) => optionHTML(q, o, k)).join('')}</div>`;
  }
  function renderQ() {
    if (S.f3d) { try { S.f3d.destroy(); } catch (e) { /* gone */ } S.f3d = null; }
    const q = S.qs[S.i], n = S.qs.length, exam = S.mode === 'exam';
    const answered = S.ans.filter(a => a != null && a !== '').length;
    const pts = S.qs.reduce((s, qq, k) => s + (S.shown[k] ? QUIZ.grade(qq, S.ans[k], S.cfg).score : 0), 0);
    el('q6Run').innerHTML = `
      <div class="q-top card">
        <div class="q-prog"><b>${L2(`Pregunta ${S.i + 1} de ${n}`, `Question ${S.i + 1} of ${n}`)}</b><div class="q-bar"><span style="width:${100 * (exam ? answered : S.i) / n}%"></span></div></div>
        ${exam ? `<span class="q-who">${esc(S.cfg.title || '')} · ${esc(S.name)}</span><span class="q-timer" id="q6Timer"></span>` : `<span class="q-score">${L2('Puntos', 'Points')}: <b>${pts.toFixed(1)}</b> / ${S.shown.filter(Boolean).length}</span>`}
        <button class="btn btn-ghost btn-sm" data-act="quit">${exam ? L2('Guardar y salir', 'Save and leave') : L2('Salir', 'Leave')}</button>
      </div>
      ${exam ? `<div class="q-dots">${S.qs.map((qq, k) => `<button class="q-dot${k === S.i ? ' on' : ''}${S.ans[k] != null && S.ans[k] !== '' ? ' done' : ''}" data-go="${k}">${k + 1}</button>`).join('')}</div>` : ''}
      <article class="card q-card" data-type="${q.type}">
        <div class="q-type">${Lo(typeOf(q.type))}</div>
        <h3 class="q-prompt">${prompt(q)}</h3>
        <div class="q-stim">${stimulus(q)}</div>
        <div class="q-answer">${answerArea(q)}</div>
        <div class="q-fb" id="q6Fb"></div>
        <div class="q-nav">
          ${exam && S.i > 0 ? `<button class="btn btn-ghost" data-act="prev">← ${L2('Anterior', 'Previous')}</button>` : ''}
          ${!exam && q.type === 'fwrite' && !S.shown[S.i] ? `<button class="btn btn-primary" data-act="check">${L2('Comprobar', 'Check')}</button>` : ''}
          ${(exam || S.shown[S.i]) && S.i < n - 1 ? `<button class="btn btn-primary" data-act="next">${L2('Siguiente', 'Next')} →</button>` : ''}
          ${(exam || S.shown[S.i]) && S.i === n - 1 ? `<button class="btn btn-primary" data-act="finish">${exam ? L2('Revisar y entregar', 'Review and hand in') : L2('Ver resultado', 'See the result')}</button>` : ''}
        </div>
      </article>`;
    I18N.apply(el('q6Run'));
    const host = el('q6F3d');
    if (host) S.f3d = Flower3D.mount(host, q.flower.m, { height: 230, colors: 'natural', drag: true, az: 20, el: 32 });
    markOptions();
    if (q.type === 'fwrite') { echo(); if (S.shown[S.i]) feedback(); }
    else if (S.shown[S.i]) feedback();
    tick();
  }
  function markOptions() {
    const q = S.qs[S.i];
    if (q.type === 'fwrite') return;
    els('#q6Run .q-opt').forEach(b => {
      const k = +b.dataset.k;
      b.classList.toggle('on', S.ans[S.i] != null && +S.ans[S.i] === k);
      if (S.shown[S.i]) { b.classList.toggle('right', k === q.correct); b.classList.toggle('wrong', +S.ans[S.i] === k && k !== q.correct); b.disabled = true; }
    });
  }
  /* what the formula reader understood, while the student types */
  function echo() {
    const box = el('q6Echo'), v = el('q6Input').value.trim();
    if (!v) { box.innerHTML = `<span class="muted">${L2('La app te mostrará aquí cómo lee lo que escribes.', 'The app will show here how it reads what you type.')}</span>`; return; }
    let r;
    try { r = Formula.parse(v); } catch (e) { box.innerHTML = esc(e.message); return; }
    box.innerHTML = `${L2('La app lee', 'The app reads')}: ${Formula.html(r.model, S.cfg.conv, {})}${r.warnings.length ? `<div class="q-warn">${r.warnings.map(esc).join('<br>')}</div>` : ''}`;
  }
  function whoText(q) {
    const f = Fam.byId(q.flower.fam);
    return `${q.flower.sci ? `<i>${esc(q.flower.sci)}</i>, ` : L2('Flor típica de ', 'Typical flower of ')}<a href="#" class="q-fam" data-f="${f.id}">${esc(f.name)}</a>${q.flower.label ? ' · ' + Lo(q.flower.label) : ''}`;
  }
  function feedback() {
    const q = S.qs[S.i], g = QUIZ.grade(q, S.ans[S.i], S.cfg);
    let h = '';
    const pct = Math.round(g.score * 100);
    h += `<div class="q-verdict ${g.score === 1 ? 'ok' : g.score > 0 ? 'part' : 'bad'}">${g.score === 1 ? L2('¡Correcto!', 'Correct!') : g.score > 0 ? L2(`Parcialmente correcto: ${pct} %`, `Partly correct: ${pct} %`) : L2('Incorrecto', 'Incorrect')}</div>`;
    if (q.type === 'fwrite') {
      h += `<div class="q-right">${L2('Fórmula correcta', 'Correct formula')}: ${Formula.html(q.target, S.cfg.conv, {})}</div>`;
      if (g.checks) h += `<table class="q-checks">${g.checks.map(c => `<tr class="${c.ok ? 'ok' : 'bad'}"><td>${c.ok ? '✓' : '✗'}</td><th>${Lp(c.what)}</th><td>${Lp(c.right)}${c.ok ? '' : ` <span class="muted">(${L2('escribiste', 'you wrote')}: ${Lp(c.yours)})</span>`}</td></tr>`).join('')}</table>`;
    }
    /* a wrong option is explained too: what it changes, or what it names */
    const chosen = q.opts && g.score === 0 && S.ans[S.i] != null ? q.opts[+S.ans[S.i]] : null;
    if (chosen && chosen.m) {
      const diff = QUIZ.compare(q.flower.m, chosen.m, 'adv').checks.filter(c => !c.ok);
      if (diff.length) h += `<div class="q-why"><b>${L2('Lo que cambia en la opción que elegiste', 'What changes in the option you picked')}</b><ul>${diff.map(c => `<li>${Lp(c.what)} — ${L2('tu opción', 'your option')}: ${Lp(c.yours)}; ${L2('la flor', 'the flower')}: ${Lp(c.right)}</li>`).join('')}</ul></div>`;
    }
    if (q.type === 'gname') {
      const o = GYMNO.ORG[q.org], gl = o.term && (GYMNO.GLOSS[o.term] || ATLAS.GLOSS[o.term]);
      h += `<p class="q-who2"><b>${Lo(o)}</b>${gl ? `: ${L2(esc(gl[0][1]), esc(gl[1][1]))}` : ''}</p>`;
      if (chosen && chosen.org !== q.org) { const c = GYMNO.ORG[chosen.org], cg = c.term && (GYMNO.GLOSS[c.term] || ATLAS.GLOSS[c.term]); h += `<p class="q-who2 muted">${L2('Lo que elegiste', 'What you picked')}: <b>${Lo(c)}</b>${cg ? ` — ${L2(esc(cg[0][1]), esc(cg[1][1]))}` : ''}</p>`; }
    }
    if (q.type === 'ggroup') { const g = GYMNO.grpById(q.grp); h += `<p class="q-who2"><b>${esc(g.name)}</b>: ${L2(esc(g.chars.es[1] || g.chars.es[0]), esc(g.chars.en[1] || g.chars.en[0]))}</p>`; }
    if (q.type === 'gflor' && q.kind === 'stmt') { const t = GYMNO.TRAITS[q.trait]; h += `<p class="q-who2">${L2('Respuesta', 'Answer')}: <b>${Lp(GFLOR[t.who])}</b>.</p>`; }
    if (q.strob) h += `<p class="q-who2">${L2('Era', 'It was')}: ${gWho(q)} <a href="#" class="q-g7" data-x="${gModel(q).ex}" data-s="${gModel(q).sex}" data-e="${q.stage}">${L2('Ver en Gimnospermas', 'See in Gymnosperms')} →</a></p>`;
    if (q.flower) h += `<p class="q-who2">${L2('Era', 'It was')}: ${whoText(q)}</p>`;
    if (q.plate) h +=`<p class="q-who2"><b>${Lp(q.plate.t)}</b>: ${Lp(q.plate.d)} <a href="#" class="q-plate" data-p="${q.plate.id}">${L2('Ver la lámina', 'See the plate')} →</a></p>`;
    if (chosen && chosen.plate && chosen.plate !== q.plate) {
      h += q.type === 'tdef'
        ? `<p class="q-who2 muted">${L2('Lo que elegiste define otro término', 'What you picked defines another term')}: <b>${Lp(chosen.plate.t)}</b>.</p>`
        : `<p class="q-who2 muted">${L2('Lo que elegiste', 'What you picked')}: <b>${Lp(chosen.plate.t)}</b> — ${Lp(chosen.plate.d)}</p>`;
    }
    el('q6Fb').innerHTML = h;
  }
  function answerMC(k) {
    if (S.mode === 'practice' && S.shown[S.i]) return;
    S.ans[S.i] = k;
    if (S.mode === 'practice') { S.shown[S.i] = true; renderQ(); }
    else { saveExam(); markOptions(); els('#q6Run .q-dot')[S.i].classList.add('done'); }
  }

  /* ---------------- the end ---------------- */
  function finish() {
    clearInterval(S.timer); S.timer = 0;
    if (S.f3d) { try { S.f3d.destroy(); } catch (e) { /* gone */ } S.f3d = null; }
    S.t1 = Date.now();
    const pts = QUIZ.total(S.qs, S.ans, S.cfg), n = S.qs.length;
    const pct = Math.round(1000 * pts / n) / 10;
    if (S.mode === 'exam') {
      const res = { v: 1, cfg: S.cfg, name: S.name, mat: S.mat, att: S.att, t0: S.t0, t1: S.t1, ans: S.ans, pct };
      const code = QUIZ.resultCode(res);
      S.last = { res, code };
      store.set(QUIZ.examId(S.cfg), { name: S.name, mat: S.mat, att: S.att, t0: S.t0, t1: S.t1, ans: S.ans, done: true, code });
    }
    renderEnd(pts, pct);
    show('q6End');
    window.scrollTo({ top: 0 });
  }
  function reviewRows(showRight) {
    return S.qs.map((q, k) => {
      const g = QUIZ.grade(q, S.ans[k], S.cfg);
      const mark = g.empty ? '—' : g.score === 1 ? '✓' : g.score > 0 ? Math.round(g.score * 100) + ' %' : '✗';
      let your = '—', right = '';
      if (S.ans[k] != null && S.ans[k] !== '') {
        if (q.type === 'fwrite') your = esc(S.ans[k]);
        else your = 'ABCD'[+S.ans[k]];
      }
      if (showRight) right = q.type === 'fwrite' ? esc(Formula.text(q.target, S.cfg.conv, {})) : 'ABCD'[q.correct];
      return `<tr class="${g.score === 1 ? 'ok' : g.score > 0 ? 'part' : 'bad'}"><td>${k + 1}</td><td>${Lo(typeOf(q.type))}</td><td class="q-ans">${your}</td>${showRight ? `<td class="q-ans">${right}</td>` : ''}${showRight !== null ? `<td>${mark}</td>` : ''}</tr>`;
    }).join('');
  }
  function renderEnd(pts, pct) {
    const n = S.qs.length, exam = S.mode === 'exam';
    const reveal = exam ? S.cfg.reveal : 'full';
    const head = `<tr><th>#</th><th>${L2('Tipo', 'Kind')}</th><th>${L2('Tu respuesta', 'Your answer')}</th>${reveal === 'full' ? `<th>${L2('Correcta', 'Correct')}</th>` : ''}${reveal !== 'none' ? `<th>${L2('Resultado', 'Result')}</th>` : ''}</tr>`;
    el('q6End').innerHTML = `
      <section class="card q-end">
        <h3>${exam ? L2('Examen entregado', 'Exam handed in') : L2('Resultado de la práctica', 'Practice result')}</h3>
        ${reveal !== 'none' ? `<div class="q-big">${pct} %<span>${L2(`${pts.toFixed(1)} de ${n} puntos`, `${pts.toFixed(1)} of ${n} points`)}</span></div>` : `<p>${L2('Tus respuestas quedaron registradas en el comprobante. Tu profesor te dará el resultado.', 'Your answers are recorded in the certificate. Your teacher will give you the result.')}</p>`}
        ${exam ? certificateBox() : ''}
        <h4>${L2('Tus respuestas', 'Your answers')}</h4>
        <table class="q-review">${head}${reviewRows(reveal === 'full' ? true : reveal === 'marks' ? false : null)}</table>
        <div class="q-nav">
          ${exam ? `<button class="btn btn-ghost" data-act="home">${L2('Volver', 'Back')}</button>` : `<button class="btn btn-primary" data-act="again">${L2('Otra ronda', 'Another round')}</button><button class="btn btn-ghost" data-act="home">${L2('Cambiar las opciones', 'Change the options')}</button>`}
        </div>
      </section>`;
    I18N.apply(el('q6End'));
  }
  function certificateBox() {
    return `<div class="q-cert">
      <p>${L2('Entrega a tu profesor el comprobante (archivo) o este código. Con él, su copia de FloralPro califica de nuevo tus respuestas.', 'Give your teacher the certificate (file) or this code. With it, their copy of FloralPro grades your answers again.')}</p>
      <textarea class="q-code" readonly rows="3">${esc(S.last.code)}</textarea>
      <div class="q-nav"><button class="btn btn-primary" data-act="cert">${L2('Descargar el comprobante', 'Download the certificate')}</button><button class="btn btn-secondary" data-act="copy">${L2('Copiar el código', 'Copy the code')}</button></div>
    </div>`;
  }
  /* a standalone page the student hands in */
  function certificateFile() {
    const r = S.last.res, lang = I18N.lang === 'en' ? 1 : 0;
    const tx = (es, en) => lang ? en : es;
    const reveal = r.cfg.reveal;
    const rows = S.qs.map((q, k) => {
      const g = QUIZ.grade(q, r.ans[k], r.cfg);
      const your = r.ans[k] == null || r.ans[k] === '' ? '—' : q.type === 'fwrite' ? esc(r.ans[k]) : 'ABCD'[+r.ans[k]];
      return `<tr><td>${k + 1}</td><td>${esc(tx(typeOf(q.type).es, typeOf(q.type).en))}</td><td>${your}</td>${reveal !== 'none' ? `<td>${g.score === 1 ? '✓' : g.score > 0 ? Math.round(g.score * 100) + ' %' : '✗'}</td>` : ''}</tr>`;
    }).join('');
    return `<!DOCTYPE html><html lang="${lang ? 'en' : 'es'}"><head><meta charset="UTF-8"><title>${tx('Comprobante', 'Certificate')} — ${esc(r.name)}</title>
<style>body{font-family:system-ui,sans-serif;max-width:760px;margin:30px auto;padding:0 16px;color:#231a20}h1{font-size:1.4rem;margin:0 0 4px}.m{color:#6f5f69}table{border-collapse:collapse;width:100%;margin:12px 0;font-size:.9rem}td,th{border-bottom:1px solid #eadfe4;padding:4px 8px;text-align:left}.code{font-family:ui-monospace,monospace;font-size:.72rem;word-break:break-all;background:#f2ebee;padding:10px;border-radius:8px}.big{font-size:2rem;font-weight:800;color:#8c2f6f}</style></head><body>
<h1>FloralPro · ${tx('Comprobante de examen', 'Exam certificate')}</h1>
<p class="m">${esc(r.cfg.title || '')} · ${tx('examen', 'exam')} ${QUIZ.examId(r.cfg)} · ${tx('intento', 'attempt')} ${r.att}</p>
<p><b>${esc(r.name)}</b>${r.mat ? ' · ' + esc(r.mat) : ''}<br>${tx('Inicio', 'Start')}: ${when(r.t0)} · ${tx('Entrega', 'Handed in')}: ${when(r.t1)} (${fmt(r.t1 - r.t0)})</p>
${reveal !== 'none' ? `<div class="big">${r.pct} %</div>` : ''}
<table><tr><th>#</th><th>${tx('Tipo', 'Kind')}</th><th>${tx('Respuesta', 'Answer')}</th>${reveal !== 'none' ? `<th>${tx('Resultado', 'Result')}</th>` : ''}</tr>${rows}</table>
<p class="m">${tx('Código de verificación (el profesor lo pega en FloralPro › Autoevaluación › Para el profesor):', 'Verification code (the teacher pastes it into FloralPro › Self-assessment › For the teacher):')}</p>
<div class="code">${esc(S.last.code)}</div>
</body></html>`;
  }

  /* ---------------- exam ---------------- */
  function openExam(cfg) {
    if (!S.built) build();
    goStep(6, { keepScroll: true });
    S.mode = 'exam'; S.cfg = cfg;
    const id = QUIZ.examId(cfg), prev = store.get(id);
    const stale = cfg.dv && cfg.dv !== QUIZ.dataVersion();
    const n = cfg.n, kinds = cfg.types.map(t => T2(typeOf(t))).join(', ');
    el('q6Run').innerHTML = `<section class="card q-intro">
      <div class="q-type">${L2('Examen', 'Exam')} ${id}</div>
      <h3>${esc(cfg.title || T2(['Examen de FloralPro', 'FloralPro exam']))}</h3>
      <p>${L2(`${n} preguntas · ${kinds} · nivel ${T2(QUIZ.LEVELS.find(l => l.id === cfg.level))} · fórmula ${convName(cfg.conv)[0]}`, `${n} questions · ${kinds} · ${T2(QUIZ.LEVELS.find(l => l.id === cfg.level))} level · ${convName(cfg.conv)[1]} formula`)}${cfg.time ? L2(` · ${cfg.time} minutos`, ` · ${cfg.time} minutes`) : ''}</p>
      ${stale ? `<p class="q-warn">${L2('Este examen se preparó con otra versión de FloralPro; las preguntas pueden no coincidir con las de tu profesor.', 'This exam was prepared with another version of FloralPro; the questions may not match your teacher’s.')}</p>` : ''}
      ${prev && prev.done ? `<p class="q-warn">${L2(`Ya entregaste este examen (${when(prev.t1)}).`, `You already handed in this exam (${when(prev.t1)}).`)}</p>` : ''}
      <div class="q-row"><label>${L2('Nombre completo', 'Full name')} <input class="at-search" id="q6Name" value="${esc(prev ? prev.name : '')}"></label></div>
      <div class="q-row"><label>${L2('Matrícula (opcional)', 'Student ID (optional)')} <input class="at-search" id="q6Mat" value="${esc(prev ? prev.mat : '')}"></label></div>
      <p class="hint">${L2('Durante el examen no verás si aciertas. Tus respuestas se guardan en este navegador por si se cierra la página. Al final descargarás un comprobante para tu profesor.', 'During the exam you will not see whether you are right. Your answers are kept in this browser in case the page closes. At the end you will download a certificate for your teacher.')}</p>
      <div class="q-nav">
        ${prev && !prev.done ? `<button class="btn btn-primary" data-act="resume">${L2('Continuar el examen', 'Continue the exam')}</button>` : ''}
        ${prev && prev.done ? `<button class="btn btn-secondary" data-act="showcert">${L2('Ver mi comprobante', 'See my certificate')}</button>` : ''}
        <button class="btn ${prev ? 'btn-ghost' : 'btn-primary'}" data-act="startexam">${prev ? L2('Empezar de nuevo', 'Start again') : L2('Comenzar', 'Begin')}</button>
        <button class="btn btn-ghost" data-act="home">${L2('Cancelar', 'Cancel')}</button>
      </div>
      <span class="q-msg" id="q6ExIntroMsg"></span>
    </section>`;
    I18N.apply(el('q6Run'));
    show('q6Run');
  }
  function startExam(resume) {
    const id = QUIZ.examId(S.cfg), prev = store.get(id);
    if (resume && prev) {
      S.name = prev.name; S.mat = prev.mat; S.att = prev.att || 1;
      begin('exam', S.cfg, prev);
      return;
    }
    const name = el('q6Name').value.trim();
    if (!name) { el('q6ExIntroMsg').innerHTML = L2('Escribe tu nombre para empezar.', 'Type your name to begin.'); return; }
    S.name = name; S.mat = el('q6Mat').value.trim();
    S.att = prev ? (prev.att || 1) + 1 : 1;
    begin('exam', S.cfg);
    saveExam();
  }
  function saveExam() {
    if (S.mode !== 'exam') return;
    store.set(QUIZ.examId(S.cfg), { name: S.name, mat: S.mat, att: S.att, t0: S.t0, ans: S.ans, done: false });
  }
  function startTimer() {
    clearInterval(S.timer); S.timer = 0;
    if (S.mode === 'exam' && S.cfg.time) S.timer = setInterval(tick, 1000);
  }
  function tick() {
    const box = el('q6Timer');
    if (!box || S.mode !== 'exam') return;
    if (!S.cfg.time) { box.textContent = fmt(Date.now() - S.t0); return; }
    const left = S.t0 + S.cfg.time * 60000 - Date.now();
    box.textContent = fmt(left);
    box.classList.toggle('late', left < 60000);
    if (left <= 0) finish();
  }
  function reviewBeforeHandIn() {
    const miss = S.ans.map((a, k) => a == null || a === '' ? k + 1 : null).filter(Boolean);
    el('q6Fb').innerHTML = `<div class="q-handin">
      <p>${miss.length ? L2(`Te faltan ${miss.length} preguntas: ${miss.join(', ')}.`, `${miss.length} questions are unanswered: ${miss.join(', ')}.`) : L2('Respondiste todas las preguntas.', 'You answered every question.')} ${L2('Puedes volver a cualquiera con los números de arriba.', 'You can go back to any of them with the numbers above.')}</p>
      <button class="btn btn-primary" data-act="handin">${L2('Entregar el examen', 'Hand in the exam')}</button>
    </div>`;
  }

  /* ---------------- the teacher ---------------- */
  function renderTeacher() {
    const c = S.tcfg || (S.tcfg = { title: '', types: QUIZ.TYPES.map(t => t.id), level: 'basic', conv: state.conv, n: 10, time: 30, reveal: 'marks', seed: QUIZ.newSeed() });
    el('q6Teacher').innerHTML = `
      <div class="q-cols">
        <section class="card q-setup">
          <h3>${L2('Preparar un examen', 'Prepare an exam')}</h3>
          <div class="q-row"><label>${L2('Título', 'Title')} <input class="at-search" id="q6TTitle" value="${esc(c.title)}" placeholder="${T2(['Parcial 1 · Botánica', 'Midterm 1 · Botany'])}"></label></div>
          <div class="q-types">${typeBoxes(c.types, 'q6tt')}</div>
          <div class="q-row"><span class="q-lab">${L2('Nivel', 'Level')}</span>${seg('level', c.level, LEVELS())}</div>
          <div class="q-row"><span class="q-lab">${L2('Fórmula', 'Formula')}</span>${seg('conv', c.conv, CONVS)}</div>
          <div class="q-row"><span class="q-lab">${L2('Preguntas', 'Questions')}</span><input type="number" class="sel q-num" id="q6TN" min="3" max="60" value="${c.n}">
            <span class="q-lab">${L2('Minutos', 'Minutes')}</span><input type="number" class="sel q-num" id="q6TTime" min="0" max="240" value="${c.time}"> <span class="hint">${L2('(0 = sin límite)', '(0 = no limit)')}</span></div>
          <div class="q-row"><span class="q-lab">${L2('Al terminar', 'At the end')}</span><select class="sel" id="q6TReveal">
            ${[['full', 'mostrar puntaje y respuestas correctas', 'show score and correct answers'], ['marks', 'mostrar puntaje y qué acertó, sin las respuestas', 'show score and what was right, without the answers'], ['none', 'no mostrar nada al estudiante', 'show nothing to the student']].map(o => `<option value="${o[0]}"${o[0] === c.reveal ? ' selected' : ''}>${T2([o[1], o[2]])}</option>`).join('')}</select></div>
          <div class="q-row"><span class="q-lab">${L2('Variante', 'Variant')}</span><code>${c.seed}</code> <button class="btn btn-ghost btn-xs" data-act="reseed">${L2('Otra variante', 'Another variant')}</button></div>
          <button class="btn btn-primary" data-act="make">${L2('Crear el examen', 'Create the exam')}</button>
          <div id="q6TOut"></div>
        </section>
        <section class="card q-verify">
          <h3>${L2('Verificar comprobantes', 'Check certificates')}</h3>
          <p class="hint">${L2('Pega los códigos (uno por línea) o abre los archivos de comprobante. La app vuelve a calificar cada examen a partir de las respuestas, así que un puntaje alterado no pasa.', 'Paste the codes (one per line) or open the certificate files. The app grades each exam again from its answers, so an altered score does not pass.')}</p>
          <textarea class="q-code" id="q6VCodes" rows="5" placeholder="FP6.…"></textarea>
          <div class="q-nav"><label class="btn btn-ghost btn-sm">${L2('Abrir comprobantes', 'Open certificates')}<input type="file" id="q6VFiles" accept=".html,.htm,.txt" multiple hidden></label><button class="btn btn-primary btn-sm" data-act="verify">${L2('Verificar', 'Check')}</button></div>
          <div id="q6VOut"></div>
        </section>
      </div>`;
    I18N.apply(el('q6Teacher'));
  }
  function readTeacher() {
    const root = el('q6Teacher'), f = readForm(root, 'q6tt');
    Object.assign(S.tcfg, { title: el('q6TTitle').value.trim(), types: f.types, level: f.level, conv: f.conv, n: Math.max(3, Math.min(60, +el('q6TN').value || 10)), time: Math.max(0, Math.min(240, +el('q6TTime').value || 0)), reveal: el('q6TReveal').value });
    return S.tcfg;
  }
  function makeExam() {
    const c = readTeacher();
    if (!c.types.length) { el('q6TOut').innerHTML = `<p class="q-warn">${L2('Elige al menos un tipo de pregunta.', 'Choose at least one kind of question.')}</p>`; return; }
    const cfg = Object.assign({}, c, { dv: QUIZ.dataVersion() });
    const code = QUIZ.examCode(cfg), id = QUIZ.examId(cfg);
    const link = location.href.split('#')[0] + '#b6&ex=' + code;
    S.lastExam = cfg;
    el('q6TOut').innerHTML = `<div class="q-made">
      <p><b>${L2('Examen', 'Exam')} ${id}</b> · ${L2(`${cfg.n} preguntas`, `${cfg.n} questions`)}</p>
      <label>${L2('Enlace para el grupo', 'Link for the group')} <input class="at-search" readonly id="q6TLink" value="${esc(link)}"></label>
      <label>${L2('Código del examen (si abren la app desde su propia copia)', 'Exam code (if they open the app from their own copy)')} <input class="at-search" readonly id="q6TCode" value="${esc(code)}"></label>
      <div class="q-nav"><button class="btn btn-secondary btn-sm" data-act="copylink">${L2('Copiar el enlace', 'Copy the link')}</button><button class="btn btn-secondary btn-sm" data-act="copycode">${L2('Copiar el código', 'Copy the code')}</button>
        <button class="btn btn-ghost btn-sm" data-act="keylist">${L2('Ver la clave de respuestas', 'See the answer key')}</button><button class="btn btn-ghost btn-sm" data-act="try">${L2('Probar el examen', 'Try the exam')}</button></div>
      <p class="hint">${L2('El enlace abre la app en la dirección desde la que la usas: si está publicada en internet, sirve tal cual; si la abriste como archivo, comparte mejor el código.', 'The link opens the app at the address you are using it from: if it is published online it works as is; if you opened it as a file, share the code instead.')}</p>
      <div id="q6TKey"></div>
    </div>`;
    I18N.apply(el('q6TOut'));
  }
  function answerKey(cfg) {
    const qs = QUIZ.generate(cfg);
    el('q6TKey').innerHTML = `<table class="q-review">${qs.map((q, k) => {
      let what, right;
      if (q.flower) what = `${Lo(typeOf(q.type))} · ${whoText(q)}`;
      else if (q.strob) what = `${Lo(typeOf(q.type))} · ${gWho(q)}`;
      else if (q.type === 'gflor') what = `${Lo(typeOf(q.type))} · «${Lo(GYMNO.TRAITS[q.trait])}»`;
      else what = `${Lo(typeOf(q.type))} · ${Lp(q.plate.t)}`;
      if (q.type === 'fwrite') right = esc(Formula.text(q.target, cfg.conv, {}));
      else if (q.type === 'fread') right = `${'ABCD'[q.correct]} · ${Lo(q.opts[q.correct])}`;
      else if (q.type === 'gname') right = `${'ABCD'[q.correct]} · ${Lo(GYMNO.ORG[q.org])}`;
      else if (q.type === 'ggroup') right = `${'ABCD'[q.correct]} · ${esc(GYMNO.grpById(q.grp).name)}`;
      else if (q.type === 'gflor') right = `${'ABCD'[q.correct]} · ${Lp(GFLOR[q.opts[q.correct].key])}`;
      else right = 'ABCD'[q.correct];
      return `<tr><td>${k + 1}</td><td>${what}</td><td class="q-ans">${right}</td></tr>`;
    }).join('')}</table>`;
    I18N.apply(el('q6TKey'));
  }
  function verifyCodes(text) {
    const codes = [...new Set((String(text).match(/FP6\.[A-Za-z0-9_-]+\.[0-9a-f]{8}/g) || []))];
    const rows = codes.map(c => QUIZ.verify(c));
    S.verified = rows;
    if (!rows.length) { el('q6VOut').innerHTML = `<p class="q-warn">${L2('No encontré códigos de comprobante (empiezan con FP6.).', 'No certificate codes found (they start with FP6.).')}</p>`; return; }
    el('q6VOut').innerHTML = `<table class="q-review q-vtab"><tr><th>${L2('Nombre', 'Name')}</th><th>${L2('Matrícula', 'ID')}</th><th>${L2('Examen', 'Exam')}</th><th>${L2('Entrega', 'Handed in')}</th><th>${L2('Duración', 'Time')}</th><th>${L2('Puntaje', 'Score')}</th><th>${L2('Estado', 'Status')}</th></tr>
      ${rows.map(v => v.res ? `<tr class="${v.ok ? 'ok' : 'bad'}"><td>${esc(v.res.name)}</td><td>${esc(v.res.mat || '')}</td><td>${esc(v.res.cfg.title || '')} ${v.id}</td><td>${when(v.res.t1)}</td><td>${fmt(v.res.t1 - v.res.t0)}</td><td><b>${v.pct} %</b></td><td>${v.ok ? L2('✓ válido', '✓ valid') : !v.intact ? L2('✗ código alterado', '✗ code altered') : !v.sameData ? L2('⚠ otra versión del catálogo', '⚠ another catalogue version') : L2(`✗ declaraba ${v.claimed} %`, `✗ claimed ${v.claimed} %`)}</td></tr>` : `<tr class="bad"><td colspan="7">${L2('Código ilegible', 'Unreadable code')}</td></tr>`).join('')}
    </table><button class="btn btn-secondary btn-sm" data-act="csv">${L2('Descargar la tabla (CSV)', 'Download the table (CSV)')}</button>`;
    I18N.apply(el('q6VOut'));
  }
  function csv() {
    const q = s => '"' + String(s == null ? '' : s).replace(/"/g, '""') + '"';
    const head = ['nombre', 'matricula', 'examen', 'id', 'intento', 'inicio', 'entrega', 'minutos', 'puntaje', 'estado'];
    const lines = [head.join(',')].concat((S.verified || []).filter(v => v.res).map(v => [v.res.name, v.res.mat, v.res.cfg.title, v.id, v.res.att, new Date(v.res.t0).toISOString(), new Date(v.res.t1).toISOString(), ((v.res.t1 - v.res.t0) / 60000).toFixed(1), v.pct, v.ok ? 'valido' : !v.intact ? 'alterado' : !v.sameData ? 'otra version' : 'no coincide'].map(q).join(',')));
    download('﻿' + lines.join('\r\n'), 'floralpro-comprobantes.csv', 'text/csv;charset=utf-8');
  }

  /* ---------------- wiring ---------------- */
  function build() {
    if (S.built) return;
    S.built = true;
    renderHome();
  }
  function fromHash() {
    const m = /[#&]ex=(FPX\.[A-Za-z0-9_-]+\.[0-9a-f]{8})/.exec(location.hash || '');
    if (!m) return false;
    const cfg = QUIZ.readExam(m[1]);
    if (!cfg) return false;
    openExam(cfg);
    return true;
  }
  function init() {
    if (!el('panel-6')) return;
    document.addEventListener('stepchange', e => {
      if (e.detail.step !== 6) return;
      if (!S.built) { build(); if (!fromHash()) showTab('practice'); }
    });
    window.addEventListener('hashchange', () => { if (el('panel-6').classList.contains('active')) fromHash(); });
    if (el('panel-6').classList.contains('active')) { build(); if (!fromHash()) showTab('practice'); }
    el('q6Tabs').addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (b) showTab(b.dataset.tab); });
    const panel = el('panel-6');
    panel.addEventListener('click', e => {
      if (e.target.closest('dfn')) return;
      const sb = e.target.closest('.q-seg button');
      if (sb) { els('button', sb.parentNode).forEach(b => b.classList.toggle('on', b === sb)); return; }
      const opt = e.target.closest('.q-opt');
      if (opt && !opt.disabled) { answerMC(+opt.dataset.k); return; }
      const kb = e.target.closest('#q6Keys .kb');
      if (kb) { typeKey(kb.dataset.k); return; }
      const dot = e.target.closest('[data-go]');
      if (dot && S.mode === 'exam') { S.i = +dot.dataset.go; renderQ(); return; }
      const fam = e.target.closest('.q-fam');
      if (fam) { e.preventDefault(); B4.openFamily(fam.dataset.f); return; }
      const pl = e.target.closest('.q-plate');
      if (pl) { e.preventDefault(); B3.goPlate(pl.dataset.p); return; }
      const g7 = e.target.closest('.q-g7');
      if (g7) { e.preventDefault(); B7.goExample(g7.dataset.x, g7.dataset.s, g7.dataset.e); return; }
      const b = e.target.closest('[data-act]');
      if (!b) return;
      const a = b.dataset.act;
      if (a === 'next') { S.i++; renderQ(); }
      else if (a === 'prev') { S.i--; renderQ(); }
      else if (a === 'check') { S.ans[S.i] = el('q6Input').value.trim(); S.shown[S.i] = true; renderQ(); }
      else if (a === 'finish') { if (S.mode === 'exam') reviewBeforeHandIn(); else finish(); }
      else if (a === 'handin') finish();
      else if (a === 'quit') { clearInterval(S.timer); S.timer = 0; if (S.mode === 'exam') saveExam(); S.mode = null; showTab(S.tab); }
      else if (a === 'again') begin('practice', Object.assign({}, S.cfg, { seed: QUIZ.newSeed() }));
      else if (a === 'home') { S.mode = null; try { history.replaceState(null, '', '#b6'); } catch (err) { /* file:// */ } showTab('practice'); }
      else if (a === 'cert') download(certificateFile(), 'comprobante-' + slug(S.name) + '-' + QUIZ.examId(S.cfg) + '.html', 'text/html;charset=utf-8');
      else if (a === 'copy') Views.copyText(S.last.code, b);
      else if (a === 'startexam') startExam(false);
      else if (a === 'resume') startExam(true);
      else if (a === 'showcert') {
        const prev = store.get(QUIZ.examId(S.cfg));
        S.name = prev.name; S.mat = prev.mat; S.att = prev.att; S.t0 = prev.t0; S.t1 = prev.t1; S.ans = prev.ans;
        S.qs = QUIZ.generate(S.cfg); S.mode = 'exam';
        const pts = QUIZ.total(S.qs, S.ans, S.cfg);
        S.last = { res: { v: 1, cfg: S.cfg, name: S.name, mat: S.mat, att: S.att, t0: S.t0, t1: S.t1, ans: S.ans, pct: Math.round(1000 * pts / S.qs.length) / 10 }, code: prev.code };
        renderEnd(pts, S.last.res.pct); show('q6End');
      }
      else if (a === 'reseed') { readTeacher(); S.tcfg.seed = QUIZ.newSeed(); renderTeacher(); }
      else if (a === 'make') makeExam();
      else if (a === 'copylink') Views.copyText(el('q6TLink').value, b);
      else if (a === 'copycode') Views.copyText(el('q6TCode').value, b);
      else if (a === 'keylist') answerKey(S.lastExam);
      else if (a === 'try') { S.name = T2(['Profesor', 'Teacher']); openExam(S.lastExam); }
      else if (a === 'verify') verifyCodes(el('q6VCodes').value);
      else if (a === 'csv') csv();
    });
    panel.addEventListener('input', e => {
      if (e.target.id === 'q6Input') { S.ans[S.i] = e.target.value.trim(); echo(); if (S.mode === 'exam') { saveExam(); const d = els('#q6Run .q-dot')[S.i]; if (d) d.classList.toggle('done', !!S.ans[S.i]); } }
    });
    panel.addEventListener('keydown', e => { if (e.target.id === 'q6Input' && e.key === 'Enter' && S.mode === 'practice' && !S.shown[S.i]) { e.preventDefault(); S.ans[S.i] = e.target.value.trim(); S.shown[S.i] = true; renderQ(); } });
    panel.addEventListener('change', async e => {
      if (e.target.id !== 'q6VFiles') return;
      const texts = await Promise.all([...e.target.files].map(f => f.text()));
      el('q6VCodes').value = (el('q6VCodes').value + '\n' + texts.join('\n')).trim();
      verifyCodes(el('q6VCodes').value);
      e.target.value = '';
    });
    el('q6Home').addEventListener('click', e => {
      if (e.target.closest('#q6Start')) startPractice();
      if (e.target.closest('#q6ExOpen')) {
        const cfg = QUIZ.readExam(el('q6ExCode').value);
        if (cfg) openExam(cfg); else el('q6ExMsg').innerHTML = L2('Ese código no es válido.', 'That code is not valid.');
      }
    });
    document.addEventListener('langchange', () => {
      if (!S.built) return;
      if (el('q6Run').style.display !== 'none' && S.mode && S.qs.length && document.querySelector('#q6Run .q-card')) renderQ();
      else if (el('q6Run').style.display !== 'none' && S.mode === 'exam') openExam(S.cfg);
      else if (el('q6End').style.display !== 'none') renderEnd(QUIZ.total(S.qs, S.ans, S.cfg), Math.round(1000 * QUIZ.total(S.qs, S.ans, S.cfg) / S.qs.length) / 10);
      else if (S.tab === 'teacher' && el('q6Teacher').style.display !== 'none') { readTeacher(); renderTeacher(); }
      else if (el('q6Home').style.display !== 'none') renderHome();
    });
  }
  function typeKey(k) {
    const inp = el('q6Input');
    if (!inp || inp.disabled) return;
    const s = inp.selectionStart ?? inp.value.length, en = inp.selectionEnd ?? inp.value.length;
    if (k === '⌫') {
      if (s === en && s > 0) { inp.value = inp.value.slice(0, s - 1) + inp.value.slice(en); inp.setSelectionRange(s - 1, s - 1); }
      else { inp.value = inp.value.slice(0, s) + inp.value.slice(en); inp.setSelectionRange(s, s); }
    } else {
      const ins = /^[KCPAGE]$/.test(k) && s > 0 && inp.value[s - 1] !== ' ' && inp.value[s - 1] !== '[' ? ' ' + k : k;
      inp.value = inp.value.slice(0, s) + ins + inp.value.slice(en);
      inp.setSelectionRange(s + ins.length, s + ins.length);
    }
    inp.dispatchEvent(new Event('input', { bubbles: true }));
    inp.focus();
  }
  document.addEventListener('DOMContentLoaded', init);

  return { S, begin, openExam, finish, renderQ, answerMC, verifyCodes, certificateFile, showTab, startExam };
})();
window.B6 = B6;
