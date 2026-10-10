// Presenter (and EN/ES reader) for the decks.
const READER = params.get('view') === '1';
if (READER) document.body.classList.add('reader');
else if (!params.get('lang')) LANG = 'pl';

let topic = params.get('t') || store('kws-topic');
if (!topic) { topic = 'kws-ibi-' + Math.random().toString(36).slice(2, 12); }
if (!READER) store('kws-topic', topic);

const S = Object.assign({ deck: 0, slide: 0, step: 0, hand: {} }, READER ? {} : store('kws-state-' + topic) || {});
const startDeck = window.DECKS.findIndex((d) => d.id === params.get('d'));
if (startDeck >= 0) { S.deck = startDeck; S.slide = Math.max(0, parseInt(params.get('s') || '0', 10)); S.step = 0; }
if (!window.DECKS[S.deck]) { S.deck = 0; S.slide = 0; }
if (!window.DECKS[S.deck].slides[S.slide]) S.slide = 0;

const votes = {};    // poll key → { device: {a, g, t} }
const joined = {};   // device → group
const geo = {};      // guess/pin key → { device: {at, g} }
const revealed = {};
const seen = new Set();
// Survey answers survive across days on this laptop (the live channel keeps messages only ~12 h).
const SV = (!READER && store('kws-survey-v1')) || {};
const saveSV = () => store('kws-survey-v1', SV);
const save = () => { if (!READER) store('kws-state-' + topic, { deck: S.deck, slide: S.slide, step: S.step, hand: S.hand }); };

function ingest(m) {
  if (seen.has(m.id)) return false;
  seen.add(m.id);
  const x = Live.parse(m);
  if (!x || x.d == null) return false;
  if (x.g != null && x.g >= 0) joined[x.d] = x.g;
  if (x.k === 'v' && x.key) (votes[x.key] = votes[x.key] || {})[x.d] = { a: x.a, g: x.g, t: m.time };
  else if ((x.k === 'gs' || x.k === 'pin') && x.key && Array.isArray(x.at)) (geo[x.key] = geo[x.key] || {})[x.d] = { at: x.at, g: x.g };
  else if (x.k === 's' && (x.phase === 'pre' || x.phase === 'post') && Array.isArray(x.ans)) {
    const code = String(x.code || '').trim().toUpperCase();
    SV[x.phase + '|' + (code || 'dev-' + x.d)] = { phase: x.phase, code, g: x.g, ans: x.ans, t: m.time, src: 'phone' };
    saveSV();
  }
  return true;
}

// ---------- survey statistics ----------
const pct = (ans) => Math.round((100 * ans.filter((a, i) => a === window.SURVEY[i].ok).length) / window.SURVEY.length);
const entries = (phase) => Object.values(SV).filter((e) => e.phase === phase);
const avg = (xs) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null);
function surveyStats() {
  const pre = entries('pre'), post = entries('post');
  const perQ = (list) => window.SURVEY.map((q, i) => (list.length ? Math.round((100 * list.filter((e) => e.ans[i] === q.ok).length) / list.length) : null));
  const preBy = {}, postBy = {};
  pre.forEach((e) => { if (e.code) preBy[e.code] = e; });
  post.forEach((e) => { if (e.code) postBy[e.code] = e; });
  const people = Object.keys(preBy).filter((c) => postBy[c]).map((c) => ({ code: c, pre: pct(preBy[c].ans), post: pct(postBy[c].ans) })).sort((a, b) => (b.post - b.pre) - (a.post - a.pre));
  const team = [0, 1, 2].map((g) => {
    const a = avg(pre.filter((e) => e.g === g).map((e) => pct(e.ans))), b = avg(post.filter((e) => e.g === g).map((e) => pct(e.ans)));
    return a == null || b == null ? 0 : b - a;
  });
  return { pre, post, preAvg: avg(pre.map((e) => pct(e.ans))), postAvg: avg(post.map((e) => pct(e.ans))), preQ: perQ(pre), postQ: perQ(post), people, team };
}
const scores = () => surveyStats().team;

function tally(key) {
  const q = qOf(key);
  const counts = q.a.map(() => 0);
  for (const v of Object.values(votes[key] || {})) if (v.a >= 0 && v.a < counts.length) counts[v.a]++;
  (S.hand[key] || []).forEach((n, i) => { counts[i] += n; });
  return { counts, total: counts.reduce((a, b) => a + b, 0) };
}

const deck = () => window.DECKS[S.deck];
const cur = () => deck().slides[S.slide];
const bg = (url) => `background-image:url('${url}')`;
const voteUrl = () => window.BASE + 'vote.html?t=' + topic;
const langUrl = () => window.BASE + 'lang.html?d=' + deck().id + '&s=' + S.slide + '&t=' + topic;
const slideKey = (s) => (s.k === 'q' ? keyOf(s) : s.k === 'guess' ? s.g : s.k === 'pins' ? 'pins-' + deck().id : s.k === 'survey' ? 'survey-' + s.phase : null);
const grpColor = (g) => (GROUPS[g] || { color: '#8A94A6' }).color;

function euLogo() {
  if (LANG === 'pl') return h('img', { class: 'eu-img', src: 'img/eu-pl.jpg', alt: L(UI.cofund) });
  const box = h('div', { class: 'eu-html' }, h('span', {}, L(UI.cofund)), h('i'));
  box.querySelector('i').innerHTML = EU_FLAG;
  return box;
}
function footer() {
  const sc = scores();
  return h('div', { class: 'footer' },
    h('div', { class: 'mini-score', title: L(SURVEY_UI.teams) }, GROUPS.map((g, i) => h('span', { style: `background:${g.color}` }, (sc[i] > 0 ? '+' : '') + sc[i]))),
    h('span', { class: 'pg' }, `${S.slide + 1} / ${deck().slides.length}`),
    READER ? null : h('div', { class: 'ctl' }, h('button', { 'data-act': 'prev' }, '◀'), h('button', { 'data-act': 'next' }, '▶'),
      h('button', { 'data-act': 'reveal' }, 'R'), h('button', { 'data-act': 'full' }, '⛶'), h('button', { 'data-act': 'menu' }, '☰')),
    window.PROJECT_NO ? h('span', { class: 'pno' }, window.PROJECT_NO) : null,
    h('span', { class: 'sp' }),
    h('div', { class: 'logos' },
      h('img', { src: 'img/kaszebi-logo.png', alt: 'Kaszëbi we swiecë', class: 'lg-kws' }),
      h('img', { src: 'img/bluebeehive.jpg', alt: 'Blue Beehive', class: 'lg-bb' }),
      euLogo()));
}

function decorate(el) {
  el.append(footer());
  if (!READER) {
    const box = h('div', { class: 'langqr' }, h('div', {}), h('small', {}, 'EN · ES · PL'));
    el.append(box);
    qr(box.firstChild, langUrl(), 128);
  }
  return el;
}

function bullets(li, ordered) { return h(ordered ? 'ol' : 'ul', { class: ordered ? 'steps' : 'big' }, li.map((x) => h('li', {}, L(x)))); }
function joinBox(size) { const b = h('div', { class: 'qbox' }); qr(b, voteUrl(), size); return b; }

const FLAGS = {
  ksz: '<svg viewBox="0 0 30 20"><rect width="30" height="10" fill="#111"/><rect y="10" width="30" height="10" fill="#FFD700"/></svg>',
  es: '<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#AA151B"/><rect y="5" width="30" height="10" fill="#F1BF00"/></svg>',
  val: '<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#FCDD09"/>' + [0, 1, 2, 3].map((i) => `<rect x="8" y="${2 + i * 4.4}" width="22" height="2.2" fill="#DA121A"/>`).join('') + '<rect width="8" height="20" fill="#0057A5"/></svg>'
};
let mapCtl = null; // live map of the current slide
let afterFns = [];
const after = (fn) => afterFns.push(fn);

function journeyCard() {
  const st = window.STOPS[S.step];
  return h('div', { class: 'jcard' },
    h('span', { class: 'chip' }, L(st.date)), h('h2', {}, L(st.h)), h('p', {}, L(st.p)),
    st.img ? h('div', { class: 'jpic', style: bg(st.img) }) : null,
    h('div', { class: 'dots' }, window.STOPS.map((_, i) => h('i', { class: i === S.step ? 'on' : i < S.step ? 'past' : '' }))));
}

const R = {
  title(s) {
    return decorate(h('section', { class: 'slide s-title' },
      h('div', { class: 'left' }, h('div', { class: 'kicker' }, L(s.kicker)), h('h1', {}, L(s.h)), h('p', { class: 'muted' }, L(s.p))),
      h('div', { class: 'right', style: bg(s.img) })));
  },
  join() {
    const counts = [0, 0, 0];
    Object.values(joined).forEach((g) => { if (g >= 0 && g < 3) counts[g]++; });
    return decorate(h('section', { class: 'slide' },
      h('h2', {}, L(UI.join)),
      h('div', { class: 'join' }, joinBox(460),
        h('div', { class: 'groups' },
          h('p', { class: 'muted' }, L(UI.scan)),
          h('p', {}, L(UI.pickGroup) + ':'),
          GROUPS.map((g, i) => h('div', { class: 'grp' }, h('i', { style: `background:${g.color}` }), L(g.name), h('span', { class: 'n' }, String(counts[i])))),
          h('p', { class: 'muted', style: 'font-size:28px' }, voteUrl().replace('https://', ''))))));
  },
  text(s) {
    return decorate(h('section', { class: 'slide' }, h('h2', {}, L(s.h)),
      h('div', { class: 'cols' + (s.wide || s.video ? ' wide' : '') }, h('div', { class: 'txt' }, bullets(s.li)),
        s.video ? h('div', { class: 'vid' }, h('iframe', { src: `https://www.youtube-nocookie.com/embed/${s.video}?rel=0&modestbranding=1`, title: L(s.h), allow: 'autoplay; encrypted-media; picture-in-picture; fullscreen', allowfullscreen: '' }), h('small', {}, s.videoSrc))
          : s.img ? h('div', { class: 'pic', style: bg(s.img) }) : null)));
  },
  compare(s) {
    const fig = (x) => h('figure', {}, h('div', { class: 'pic', style: bg(x.img) }), h('figcaption', {}, L(x.h)));
    return decorate(h('section', { class: 'slide' }, h('div', { class: 'compare' }, fig(s.a), fig(s.b))));
  },
  table(s) {
    const t = h('table', { class: 't' + (s.rows.length > 6 ? ' dense' : '') }, s.rows.map((r) => h('tr', {}, r.map((c) => h('td', {}, L(c))))));
    return decorate(h('section', { class: 'slide' }, h('h2', {}, L(s.h)), t));
  },
  stop(s) {
    return decorate(h('section', { class: 'slide' }, h('h2', {}, L(s.h)),
      h('div', { class: 'stopgrid' }, s.items.map((it) => h('div', { class: 'stopcard' },
        h('div', { class: 'octa' }, it.l), h('div', { class: 'emo' }, it.i), h('h3', {}, L(it.h)), h('p', {}, L(it.p)))))));
  },
  phrases(s) {
    const head = [['', L(T('Polski', 'English', 'Español'))], [FLAGS.ksz, 'Kaszëbsczi'], [FLAGS.es, 'Español'], [FLAGS.val, 'Valencià']];
    const th = h('tr', {}, head.map(([f, n], i) => { const c = h('th', {}, h('span', { class: 'flag' }), n); if (f) c.querySelector('.flag').innerHTML = f; else c.querySelector('.flag').remove(); return c; }));
    const t = h('table', { class: 'phr' }, th, s.rows.map((r) => h('tr', {}, h('td', {}, L(r[0])), h('td', { class: 'ksz' }, r[1]), h('td', {}, r[2]), h('td', {}, r[3]))));
    return decorate(h('section', { class: 'slide' }, h('h2', {}, L(s.h)), t, h('p', { class: 'muted', style: 'font-size:26px' }, L(s.note))));
  },
  post(s) {
    const card = s.sms
      ? h('div', { class: 'post sms' }, h('div', { class: 'who' }, h('i'), '+48 512 *** ***'), h('p', {}, L(s.text)))
      : h('div', { class: 'post' }, h('div', { class: 'who' }, h('i'), L(T('Prawdziwe Wiadomości 24', 'Real News 24', 'Noticias Reales 24'))), h('p', {}, L(s.text)),
        s.img ? h('div', { class: 'postimg', style: bg(s.img) }, h('span', { class: 'stamp' }, L(s.stamp))) : null,
        h('div', { class: 'acts' }, h('span', {}, '👍 12K'), h('span', {}, '💬 3.4K'), h('span', {}, '↗ 8.9K')));
    return decorate(h('section', { class: 'slide', style: 'justify-content:center' }, card,
      h('p', { class: 'muted', style: 'text-align:center;font-size:28px' }, L(s.note))));
  },
  q(s) {
    const key = keyOf(s), q = qOf(key), t = tally(key);
    const max = Math.max(1, ...t.counts);
    const opts = h('div', { class: 'opts' }, q.a.map((a, i) => {
      const b = h('button', { class: 'opt', title: 'klik = +1 głos z sali' },
        h('span', { class: 'fill', style: `width:${READER ? 0 : (100 * t.counts[i]) / max}%` }),
        h('span', { class: 'letter' }, 'ABCD'[i]), h('span', { class: 'lbl' }, L(a)),
        READER ? null : h('span', { class: 'n' }, String(t.counts[i])));
      if (!READER) b.addEventListener('click', () => { (S.hand[key] = S.hand[key] || q.a.map(() => 0))[i]++; save(); render(); });
      return b;
    }));
    const el = h('section', { class: 'slide' },
      h('div', { class: 'qwrap' },
        h('div', { class: 'qleft' }, h('span', { class: 'badge' }, L(T('SONDA', 'POLL', 'SONDEO'))), h('h2', {}, L(q.q)), opts),
        h('div', { class: 'qright' }, joinBox(340), READER ? null : h('div', { class: 'count' }, `${L(UI.votes)}: ${t.total}`))));
    if (READER) el.querySelector('.qright').append(h('a', { class: 'badge quiz', href: voteUrl(), style: 'text-decoration:none;text-align:center' }, '📱 ' + L(UI.join)));
    return decorate(el);
  },
  task(s) {
    return decorate(h('section', { class: 'slide s-task' }, h('span', { class: 'tag' }, '📲 ' + L(UI.tablet)), h('h2', {}, L(s.h)),
      h('div', { class: 'cols' }, h('div', { class: 'txt' }, bullets(s.li, true)), s.img ? h('div', { class: 'pic', style: bg(s.img) }) : null)));
  },

  // ---------- map slides ----------
  journey() {
    S.step = Math.min(Math.max(0, S.step), window.STOPS.length - 1);
    const mapEl = h('div', { class: 'mapfull' });
    const el = decorate(h('section', { class: 'slide s-map' }, mapEl, journeyCard()));
    after(() => {
      if (!window.maplibregl) { mapEl.textContent = 'Mapa wymaga internetu.'; return; }
      mapCtl = journeyMap(mapEl, () => mapCtl.show(S.step));
    });
    return el;
  },
  guess(s) {
    const G = window.GUESS[s.g], key = s.g, n = Object.keys(geo[key] || {}).length;
    const mapEl = h('div', { class: 'mapbox' });
    let result = null;
    if (revealed[key]) {
      const best = Object.values(geo[key] || {}).map((v) => ({ ...v, d: km(v.at, G.at) })).sort((a, b) => a.d - b.d)[0];
      result = h('div', { class: 'result' }, h('b', {}, '📍 ' + L(G.name)),
        best ? h('span', {}, `${L(MAP_UI.closest)}: `, h('i', { class: 'dot', style: `background:${grpColor(best.g)}` }), ` ${L((GROUPS[best.g] || GROUPS[0]).name)} · ${best.d.toFixed(1)} ${L(MAP_UI.km)}`) : null);
    }
    const el = decorate(h('section', { class: 'slide' },
      h('div', { class: 'gwrap' },
        h('div', { class: 'gleft' }, h('span', { class: 'badge' }, L(T('ZGADNIJ', 'GUESS', 'ADIVINA'))), h('h2', {}, L(MAP_UI.guessQ)),
          h('div', { class: 'gpic', style: bg(G.img) }),
          result || h('div', { class: 'grow' }, joinBox(200), h('div', {}, h('div', { class: 'count' }, `${L(MAP_UI.answers)}: ${n}`), h('p', { class: 'muted' }, READER ? '' : L(UI.reveal))))),
        mapEl)));
    after(() => {
      if (!window.maplibregl) return;
      mapCtl = pinsMap(mapEl, window.REGION_VIEW, false);
      mapCtl.update = () => {
        for (const [d, v] of Object.entries(geo[key] || {})) mapCtl.set(d, v.at, grpColor(v.g));
        if (revealed[key]) mapCtl.reveal(G.at, Object.values(geo[key] || {}).map((v) => v.at));
      };
      mapCtl.map.on('load', mapCtl.update);
    });
    return el;
  },
  pins() {
    const key = 'pins-' + deck().id, n = Object.keys(geo[key] || {}).length;
    const mapEl = h('div', { class: 'mapfull' });
    const el = decorate(h('section', { class: 'slide s-map' }, mapEl,
      h('div', { class: 'jcard' }, h('span', { class: 'chip' }, '📍'), h('h2', {}, L(MAP_UI.pinQ)), h('p', {}, L(MAP_UI.pinHelp)),
        joinBox(220), h('div', { class: 'count' }, `${L(MAP_UI.answers)}: ${n}`))));
    after(() => {
      if (!window.maplibregl) return;
      mapCtl = pinsMap(mapEl, { center: [-0.45, 38.42], zoom: 8.8, pitch: 40 }, false);
      mapCtl.update = () => { for (const [d, v] of Object.entries(geo[key] || {})) mapCtl.set(d, v.at, grpColor(v.g)); };
      mapCtl.map.on('load', mapCtl.update);
    });
    return el;
  },

  // ---------- survey ----------
  survey(s) {
    const list = entries(s.phase);
    return decorate(h('section', { class: 'slide' },
      h('span', { class: 'badge quiz' }, L(SURVEY_UI.title)),
      h('h2', {}, L(SURVEY_UI[s.phase])),
      h('div', { class: 'join' }, joinBox(440),
        h('div', { class: 'groups' },
          h('p', {}, L(UI.scan)),
          h('p', { class: 'muted' }, L(SURVEY_UI.codeHelp)),
          h('div', { class: 'count big' }, `${L(SURVEY_UI.filled)}: ${list.length}`),
          h('div', { class: 'codes' }, list.map((e) => h('span', { style: `border-color:${grpColor(e.g)}` }, e.code || '–')))))));
  },
  results() {
    const st = surveyStats();
    const gain = st.preAvg != null && st.postAvg != null ? st.postAvg - st.preAvg : null;
    const big = (label, v, sub, cls) => h('div', { class: 'kpi ' + (cls || '') }, h('div', { class: 'v' }, v), h('div', { class: 'l' }, label), sub ? h('div', { class: 's' }, sub) : null);
    const rows = window.SURVEY.map((q, i) => h('div', { class: 'qrow' },
      h('span', { class: 'qn' }, String(i + 1)),
      h('div', { class: 'qbars' }, h('i', { class: 'b-pre', style: `width:${st.preQ[i] || 0}%` }), h('i', { class: 'b-post', style: `width:${st.postQ[i] || 0}%` })),
      h('span', { class: 'qv' }, `${st.preQ[i] ?? '–'} → ${st.postQ[i] ?? '–'}%`)));
    return decorate(h('section', { class: 'slide' },
      h('h2', {}, L(SURVEY_UI.growth)),
      h('div', { class: 'res' },
        h('div', { class: 'kpis' },
          big(L(UI.before), st.preAvg == null ? '–' : st.preAvg + '%', `n = ${st.pre.length}`),
          big(L(UI.after), st.postAvg == null ? '–' : st.postAvg + '%', `n = ${st.post.length} · ${L(SURVEY_UI.target)}: 80%`, st.postAvg >= 80 ? 'ok' : ''),
          big(L(SURVEY_UI.growth), gain == null ? '–' : (gain > 0 ? '+' : '') + gain + ' pp', `${L(SURVEY_UI.target)}: +40 pp`, gain >= 40 ? 'ok' : 'accent')),
        h('div', { class: 'qlist' }, h('div', { class: 'legend' }, h('i', { class: 'b-pre' }), L(UI.before), h('i', { class: 'b-post' }), L(UI.after)), rows))));
  },
  people() {
    const st = surveyStats();
    return decorate(h('section', { class: 'slide' }, h('h2', {}, L(SURVEY_UI.perPerson)),
      h('p', { class: 'muted' }, `${st.people.length} ${L(SURVEY_UI.paired)}`),
      h('div', { class: 'people' }, st.people.map((p) => h('div', { class: 'person' },
        h('b', {}, p.code), h('span', {}, `${p.pre}% → ${p.post}%`), h('em', { class: p.post - p.pre >= 40 ? 'ok' : '' }, `${p.post - p.pre > 0 ? '+' : ''}${p.post - p.pre}`))))));
  },
  teams() {
    const sc = scores(), max = Math.max(10, ...sc.map(Math.abs));
    return decorate(h('section', { class: 'slide' }, h('h2', {}, L(SURVEY_UI.teams)),
      h('div', { class: 'score' }, GROUPS.map((g, i) => h('div', { class: 'col' },
        h('div', { class: 'pts' }, (sc[i] > 0 ? '+' : '') + sc[i] + ' pp'),
        h('div', { class: 'bar', style: `height:${(520 * Math.max(0, sc[i])) / max}px;background:${g.color}` }),
        h('div', { class: 'nm' }, L(g.name)))))));
  },

  cert() {
    const box = h('div', { class: 'qbox' });
    const url = window.BASE + 'cert.html';
    const el = h('section', { class: 'slide' }, h('h2', {}, L(UI.certTitle)),
      h('div', { class: 'join' }, box, h('div', { class: 'groups' }, h('p', {}, L(UI.scan)), h('p', { class: 'muted' }, url.replace('https://', '')))));
    qr(box, url, 460);
    return decorate(el);
  },
  credits() {
    return decorate(h('section', { class: 'slide' }, h('h2', {}, 'Zdjęcia · Photos · Fotos'),
      h('div', { class: 'credits' }, window.CREDITS.map((c) => h('p', {}, `${c.title} — ${c.author}, ${c.license}, Wikimedia Commons`)),
        h('p', {}, 'Mapy / Maps: © OpenStreetMap contributors, OpenFreeMap, MapLibre'))));
  },
  end(s) {
    return decorate(h('section', { class: 'slide s-end' }, h('h1', {}, L(s.h)), h('p', { class: 'disc' }, L(UI.disclaimer))));
  }
};

function fit() {
  if (READER) return;
  const k = Math.min(innerWidth / 1920, innerHeight / 1080);
  document.querySelectorAll('#viewport .slide').forEach((el) => { el.style.transform = `translate(-50%, -50%) scale(${k})`; });
}

let lastOpen = null;
let navTimer = null;
function broadcast() {
  if (READER) return;
  clearTimeout(navTimer);
  navTimer = setTimeout(() => Live.send(topic, { k: 'nav', dk: deck().id, s: S.slide, st: S.step }), 600);
}

// Reader (EN/ES via QR) follows the presenter until the viewer navigates on their own.
let follow = READER && !!params.get('t');
function followBtn() {
  const b = document.getElementById('follow');
  if (b) b.style.display = follow ? 'none' : '';
}
function applyNav(x) {
  const i = window.DECKS.findIndex((dd) => dd.id === x.dk);
  if (i < 0 || !window.DECKS[i].slides[x.s]) return;
  S.deck = i; S.slide = x.s; S.step = x.st || 0;
  render(); scrollTo(0, 0);
}

let ANIM = params.get('anim') || (!READER && store('kws-anim')) || 'mix';
function skeletons(root) {
  root.querySelectorAll('[style*="background-image"]').forEach((el) => {
    const m = /url\(['"]?([^'")]+)/.exec(el.style.backgroundImage);
    if (!m) return;
    const img = new Image();
    img.src = m[1];
    if (img.complete && img.naturalWidth) return;
    el.classList.add('sk');
    const done = () => { el.classList.remove('sk'); el.classList.add('ld'); };
    img.onload = done; img.onerror = done;
  });
}
function render(dir = 0) {
  if (mapCtl) { mapCtl.destroy(); mapCtl = null; }
  afterFns = [];
  const s = cur();
  const vp = document.getElementById('viewport');
  const frame = h('div', { class: 'frame' }, R[s.k](s));
  const old = [...vp.children];
  const animate = !READER && dir !== 0 && ANIM !== 'none';
  if (animate) {
    const move = ANIM === 'a' ? 'a' : 'b', items = ANIM === 'b' ? 'b' : 'a';
    frame.classList.add('in-' + move, 'items-' + items, dir > 0 ? 'fwd' : 'back');
    old.forEach((o) => { o.classList.add('out-' + move, dir > 0 ? 'fwd' : 'back'); setTimeout(() => o.remove(), 900); });
    setTimeout(() => frame.classList.remove('in-' + move, 'items-' + items, 'fwd', 'back'), 1600);
  } else old.forEach((o) => o.remove());
  vp.append(frame);
  skeletons(frame);
  fit();
  afterFns.forEach((f) => f());
  document.getElementById('pos').textContent = `${S.slide + 1}/${deck().slides.length}`;
  broadcast();
  const key = slideKey(s);
  if (!READER && key && lastOpen !== key) {
    lastOpen = key;
    const mode = s.k === 'q' ? 'q' : s.k === 'guess' ? 'guess' : s.k === 'pins' ? 'pin' : 'survey';
    Live.send(topic, { k: 'o', key, mode, phase: s.phase });
  }
}

// Live refresh: map slides update pins in place, others re-render.
function refresh() {
  const s = cur();
  if (['guess', 'pins'].includes(s.k) && mapCtl && mapCtl.update) {
    const c = document.querySelector('.count');
    if (c) c.textContent = `${L(MAP_UI.answers)}: ${Object.keys(geo[slideKey(s)] || {}).length}`;
    mapCtl.update();
  } else if (['q', 'join', 'survey', 'results', 'people', 'teams'].includes(s.k)) render();
}

function go(d, auto) {
  if (READER && !auto && follow) { follow = false; followBtn(); }
  if (cur().k === 'journey') {
    const n = window.STOPS.length;
    if ((d > 0 && S.step < n - 1) || (d < 0 && S.step > 0)) {
      S.step += d; save();
      const card = document.querySelector('.jcard');
      if (card && mapCtl) { card.replaceWith(journeyCard()); mapCtl.show(S.step); broadcast(); } else render();
      return;
    }
  }
  const n = deck().slides.length;
  const next = Math.min(n - 1, Math.max(0, S.slide + d));
  if (next === S.slide) return;
  S.slide = next;
  S.step = deck().slides[next].k === 'journey' && d < 0 ? window.STOPS.length - 1 : 0;
  save(); render(d);
  if (READER) scrollTo(0, 0);
}
function reveal() {
  const s = cur();
  if (s.k !== 'guess') return;
  revealed[s.g] = true;
  Live.send(topic, { k: 'r', key: s.g });
  render();
}
function full() { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); }

function paperForm() {
  const c = document.getElementById('menucard');
  c.innerHTML = '';
  const ph = h('select', {}, h('option', { value: 'pre' }, 'PRZED'), h('option', { value: 'post' }, 'PO'));
  const code = h('input', { placeholder: 'Kod, np. A07' });
  const grp = h('select', {}, GROUPS.map((g, i) => h('option', { value: i }, L(g.name))));
  const ans = h('input', { placeholder: 'Odpowiedzi: 10 liter A/B/C, np. BAABAACBCC' });
  const info = h('p', {}, `Zapisanych: przed ${entries('pre').length}, po ${entries('post').length}`);
  c.append(h('h3', {}, 'Ankieta z kartki'), ph, code, grp, ans,
    h('div', { class: 'row' },
      h('button', { onclick: () => {
        const a = ans.value.toUpperCase().replace(/[^ABC]/g, '');
        if (a.length !== window.SURVEY.length || !code.value.trim()) { alert('Potrzebny kod i 10 odpowiedzi (A/B/C).'); return; }
        const cd = code.value.trim().toUpperCase();
        SV[ph.value + '|' + cd] = { phase: ph.value, code: cd, g: +grp.value, ans: [...a].map((x) => 'ABC'.indexOf(x)), t: Date.now() / 1000, src: 'paper' };
        saveSV(); code.value = ''; ans.value = ''; code.focus();
        info.textContent = `Zapisano ${cd}. Zapisanych: przed ${entries('pre').length}, po ${entries('post').length}`;
      } }, 'Zapisz i następna'),
      h('button', { onclick: () => { menu(false); render(); } }, 'Zamknij')),
    info);
}

function menu(on) {
  const m = document.getElementById('menu');
  m.classList.toggle('on', on);
  if (!on) return;
  const c = document.getElementById('menucard');
  c.innerHTML = '';
  c.append(
    h('h3', {}, 'Kaszëbi w Europie! – wybierz prezentację'),
    h('div', { class: 'decks' }, window.DECKS.map((d, i) => h('button', { onclick: () => { S.deck = i; S.slide = 0; S.step = 0; lastOpen = null; save(); menu(false); render(); } }, `${i + 1}. ${L(d.title)} (${d.slides.length})`))),
    h('div', { class: 'row' },
      ['pl', 'en', 'es'].map((l) => h('button', { onclick: () => { LANG = l; menu(false); render(); } }, 'Język: ' + l.toUpperCase())),
      h('button', { onclick: paperForm }, '✍ Ankieta z kartki'),
      h('button', { onclick: exportCsv }, '⬇ CSV ankiety'),
      h('a', { href: 'survey-print.html', target: '_blank' }, '🖨 Ankieta do druku'),
      [['mix', 'Animacja: przejścia B + lista A'], ['a', 'Animacja A'], ['b', 'Animacja B'], ['none', 'Bez animacji']].map(([v, t]) => h('button', { style: ANIM === v ? 'background:#0B1F3A;color:#fff' : '', onclick: () => { ANIM = v; store('kws-anim', v); menu(true); } }, t)),
      h('button', { onclick: () => { if (confirm('Nowa sesja głosowania? (wyniki ankiety zostają na tym laptopie)')) { store('kws-topic', null); location.search = ''; } } }, '↺ Nowa sesja')),
    h('p', {}, 'Sesja: ', h('code', {}, topic), ` · ankieta: przed ${entries('pre').length}, po ${entries('post').length}`),
    h('p', {}, 'Klawisze: ← → / spacja / pilot (na mapie podróży: kolejne przystanki) · R pokaż odpowiedź w zgadywance · F pełny ekran · M menu. Klik w odpowiedź sondy = +1 głos z sali.'),
    h('button', { onclick: () => menu(false) }, 'Zamknij'));
}

function exportCsv() {
  const head = ['faza', 'kod', 'druzyna', 'zrodlo', 'czas', 'wynik_%', ...window.SURVEY.map((_, i) => 'p' + (i + 1))];
  const rows = [head, ...Object.values(SV).map((e) => [e.phase, e.code, GROUPS[e.g] ? L(GROUPS[e.g].name) : '', e.src, new Date(e.t * 1000).toISOString(), pct(e.ans), ...e.ans.map((a, i) => 'ABC'[a] + (a === window.SURVEY[i].ok ? ' ✓' : ''))])];
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = h('a', { href: URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv' })), download: 'kws-ankieta-dezinformacja.csv' });
  document.body.append(a); a.click(); a.remove();
}

addEventListener('resize', fit);
new ResizeObserver(fit).observe(document.documentElement);
setTimeout(fit, 300);
addEventListener('keydown', (e) => {
  if (document.getElementById('menu').classList.contains('on')) { if (e.key === 'Escape') menu(false); return; }
  if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); go(1); }
  else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); go(-1); }
  else if (READER) return;
  else if (e.key === 'r' || e.key === 'R') reveal();
  else if (e.key === 'f' || e.key === 'F') full();
  else if (e.key === 'm' || e.key === 'M') menu(true);
});
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]');
  if (!b) return;
  const a = b.dataset.act;
  if (a === 'prev') go(-1); else if (a === 'next') go(1); else if (a === 'reveal') reveal(); else if (a === 'full') full(); else if (a === 'menu') menu(true);
});
document.getElementById('prev').onclick = () => go(-1);
document.getElementById('next').onclick = () => go(1);
if (READER) {
  document.getElementById('chrome').style.display = 'none';
  if (params.get('t')) {
    const fb = h('button', { id: 'follow', style: 'display:none' }, '● LIVE');
    fb.onclick = () => { follow = true; followBtn(); Live.history(topic).then((ms) => { const n = ms.map(Live.parse).filter((x) => x && x.k === 'nav').pop(); if (n) applyNav(n); }); };
    document.getElementById('nav').append(fb);
    Live.history(topic).then((ms) => { const n = ms.map(Live.parse).filter((x) => x && x.k === 'nav').pop(); if (n && follow) applyNav(n); });
    Live.listen(topic, (m) => { const x = Live.parse(m); if (x && x.k === 'nav' && follow) applyNav(x); });
  }
}

render();
if (!READER) {
  if (startDeck < 0 && !params.get('d')) menu(true);
  const live = document.getElementById('live');
  let t = null;
  const later = () => { clearTimeout(t); t = setTimeout(refresh, 300); };
  Live.history(topic).then((ms) => {
    ms.forEach((m) => { ingest(m); const x = Live.parse(m); if (x && x.k === 'r') revealed[x.key] = true; });
    later();
  });
  Live.listen(topic, (m) => { if (ingest(m)) later(); }, (ok) => { live.textContent = ok ? '● na żywo' : '○ brak połączenia – liczcie ręce / ankieta z kartki'; });
}
