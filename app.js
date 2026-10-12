// Presenter (and EN/ES reader) for the decks.
const READER = params.get('view') === '1';
if (READER) document.body.classList.add('reader');
else if (!params.get('lang')) LANG = 'pl';

let topic = params.get('t') || store('kws-topic');
if (!topic) { topic = 'kws-ibi-' + Math.random().toString(36).slice(2, 12); }
if (!READER) store('kws-topic', topic);

const S = Object.assign({ deck: 0, slide: 0, step: 0, hand: {}, day: autoDay() }, READER ? {} : store('kws-state-' + topic) || {});
if (S.day === 'd1') S.day = autoDay('d1');
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
const save = () => { if (!READER) store('kws-state-' + topic, { deck: S.deck, slide: S.slide, step: S.step, hand: S.hand, day: S.day }); };

function ingest(m) {
  if (seen.has(m.id)) return false;
  seen.add(m.id);
  const x = Live.parse(m);
  if (!x || x.d == null) return false;
  joined[x.d] = 1;
  if (x.k === 'v' && x.key) (votes[x.key] = votes[x.key] || {})[x.d] = { a: x.a, g: x.g, t: m.time };
  else if ((x.k === 'gs' || x.k === 'pin') && x.key && Array.isArray(x.at)) (geo[x.key] = geo[x.key] || {})[x.d] = { at: x.at, g: x.g };
  else Survey.ingest(m, x);
  return true;
}

// Survey store and statistics live in survey.js (shared with report.html).
const { TESTS, entries, itemsFor } = Survey;
const surveyStats = () => Survey.stats();
let sheetAt = 0;
async function pullSheet(force) {
  if (READER || !Sheet.url() || (!force && Date.now() - sheetAt < 15000)) return;
  sheetAt = Date.now();
  if (await Survey.pullSheet() && ['survey', 'results', 'people', 'teams', 'problem', 'confidence', 'evaluation'].includes(cur().k)) render();
}

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
// One QR per day: every slide shows the same join link; the phone lists all of the day's tasks.
const voteUrl = () => window.BASE + 'vote.html?t=' + topic + '&day=' + S.day;
const langUrl = () => window.BASE + 'lang.html?d=' + deck().id + '&s=' + S.slide + '&t=' + topic;
const slideKey = (s) => (s.k === 'q' ? keyOf(s) : s.k === 'guess' ? s.g : s.k === 'pins' ? 'pins-' + deck().id : s.k === 'survey' ? 'survey-' + s.phase : null);
const grpColor = () => '#C8102E';

function euLogo() {
  if (LANG === 'pl') return h('img', { class: 'eu-img', src: 'img/eu-pl.jpg', alt: L(UI.cofund) });
  const box = h('div', { class: 'eu-html' }, h('span', {}, L(UI.cofund)), h('i'));
  box.querySelector('i').innerHTML = EU_FLAG;
  return box;
}
function footer() {
  return h('div', { class: 'footer' },
    h('span', { class: 'pg' }, `${S.slide + 1} / ${deck().slides.length}`),
    READER ? null : h('div', { class: 'ctl' }, h('button', { 'data-act': 'prev' }, '◀'), h('button', { 'data-act': 'next' }, '▶'),
      h('button', { 'data-act': 'reveal' }, 'R'), h('button', { 'data-act': 'lang', title: 'EN / ES (L)' }, '🌐'), h('button', { 'data-act': 'full' }, '⛶'), h('button', { 'data-act': 'menu' }, '☰')),
    window.PROJECT_NO ? h('span', { class: 'pno' }, window.PROJECT_NO) : null,
    h('span', { class: 'sp' }),
    h('div', { class: 'logos' },
      h('img', { src: 'img/kaszebi-logo.png', alt: 'Kaszëbi we swiecë', class: 'lg-kws' }),
      h('img', { src: 'img/bluebeehive.jpg', alt: 'Blue Beehive', class: 'lg-bb' }),
      euLogo()));
}

function decorate(el) {
  el.append(footer());
  return el;
}

function bullets(li, ordered) { return h(ordered ? 'ol' : 'ul', { class: ordered ? 'steps' : 'big' }, li.map((x) => h('li', {}, L(x)))); }
function joinBox(size, url) { const b = h('div', { class: 'qbox' }); qr(b, url || voteUrl(), size); return b; }

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
      h('div', { class: 'left' }, h('div', { class: 'kicker' }, L(s.kicker)), h('h1', {}, L(s.h)),
        h('p', { class: 'muted' }, ...L(s.p).split(' · ').map((part, i, all) => (i < all.length - 1 ? [part, h('br')] : h('span', { class: 'when' }, part))).flat())),
      h('div', { class: 'right', style: bg(s.img) })));
  },
  join() {
    return decorate(h('section', { class: 'slide' },
      h('h2', {}, L(UI.join)),
      h('div', { class: 'join' }, joinBox(460),
        h('div', { class: 'groups' },
          h('p', { class: 'muted' }, L(UI.scan)),
          h('div', { class: 'count big' }, `👥 ${Object.keys(joined).length} ${L(GAME_UI.joined)}`),
          h('p', { class: 'muted', style: 'font-size:28px' }, voteUrl().replace('https://', ''))))));
  },
  fb(s) {
    return decorate(h('section', { class: 'slide' }, h('h2', {}, L(s.h)),
      h('div', { class: 'join' }, joinBox(420, window.FB.event), h('div', { class: 'groups' }, bullets(s.li)))));
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
  rules(s) {
    const V = {
      link: () => h('div', { class: 'rv link' }, h('div', { class: 'url' }, '🔗 paczka-doplata.co'), h('div', { class: 'ban' }, '🚫')),
      call: () => h('div', { class: 'rv call' }, h('div', { class: 'ph' }, '📱'), h('div', { class: 'num' }, '📇 Bank · Syn · Gmina'), h('div', { class: 'ok' }, '✓')),
      pass: () => h('div', { class: 'rv pass' }, h('div', { class: 'pw' }, '••••••••••••••••'), h('div', { class: 'meter' }, h('i')), h('div', { class: 'code' }, '2FA · 482 913')),
      blik: () => h('div', { class: 'rv blik' }, h('div', { class: 'cd' }, '123 456'), h('div', { class: 'lock' }, '🔒')),
      family: () => h('div', { class: 'rv family' }, h('div', { class: 'fam' }, '👪'), h('div', { class: 'bub' }, L(T('Hasło? „Gryf”!', 'Code word? “Griffin”!', '¿Clave? «Grifo»!'))))
    };
    return decorate(h('section', { class: 'slide' }, h('h2', {}, L(s.h)),
      h('div', { class: 'rules' }, s.items.map((it, k) => h('div', { class: 'rule' }, h('div', { class: 'rn' }, String(k + 1)), V[it.v](), h('h3', {}, L(it.h)), h('p', {}, L(it.p)))))));
  },
  disinfo(s) {
    const n = 7, R = 150, C = 190;
    const nodes = Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2 - Math.PI / 2; return [C + R * Math.cos(t), C + R * Math.sin(t)]; });
    const net = `<svg viewBox="0 0 380 380" class="net">${nodes.map(([x, y], i) => `<line x1="${C}" y1="${C}" x2="${x}" y2="${y}" class="ln" style="animation-delay:${i * 0.35}s"/>`).join('')}
      ${nodes.map(([x, y], i) => `<g class="nd"><circle cx="${x}" cy="${y}" r="30" style="animation-delay:${0.6 + i * 0.35}s"/><text x="${x}" y="${y + 11}" text-anchor="middle" font-size="30">${['👵', '👴', '👩', '🧑', '👨', '👧', '🧓'][i]}</text></g>`).join('')}
      <circle cx="${C}" cy="${C}" r="46" class="src"/><text x="${C}" y="${C + 9}" text-anchor="middle" class="srct">FAKE</text></svg>`;
    const visuals = [
      h('div', { class: 'dv money' }, h('span', {}, '💰'), h('span', {}, '🏛️'), h('span', {}, '🖱️')),
      h('div', { class: 'dv faces' }, h('span', {}, '😨'), h('span', {}, '😠'), h('span', {}, '😤')),
      h('div', { class: 'dv spread' })
    ];
    visuals[2].innerHTML = net;
    return decorate(h('section', { class: 'slide' }, h('h2', {}, L(s.h)),
      h('div', { class: 'dgrid3' }, s.cards.map((c, i) => h('div', { class: 'dicard' }, visuals[i], h('h3', {}, L(c.h)), h('p', {}, L(c.p)))))));
  },
  scams(s) {
    const phone = (it) => {
      let screen;
      if (it.kind === 'sms') screen = h('div', { class: 'scr sms' }, h('div', { class: 'top' }, it.from), h('div', { class: 'typing' }, h('i'), h('i'), h('i')), h('div', { class: 'bub in' }, L(it.msg)));
      else if (it.kind === 'call') screen = h('div', { class: 'scr call' }, h('div', { class: 'ring' }, h('span'), h('span'), h('div', { class: 'av' }, '👵')), h('div', { class: 'who' }, L(it.from)), h('div', { class: 'cbtns' }, h('i', { class: 'no' }, '✕'), h('i', { class: 'yes' }, '✆')));
      else if (it.kind === 'chat') screen = h('div', { class: 'scr chat' }, h('div', { class: 'top' }, '+48 6** *** ***'), it.msgs.map((m, k) => h('div', { class: 'bub in m' + k }, L(m))));
      else screen = h('div', { class: 'scr ad' }, h('div', { class: 'star' }, '🤵'), h('div', { class: 'headline' }, L(it.head)), h('div', { class: 'chart' }, h('i'), h('i'), h('i'), h('i'), h('i')), h('div', { class: 'cta' }, L(it.btn)));
      return h('div', { class: 'scam' }, h('div', { class: 'phone ' + it.kind }, screen), h('p', {}, L(it.l)));
    };
    return decorate(h('section', { class: 'slide' }, h('h2', {}, L(s.h)), h('div', { class: 'scams' }, s.items.map(phone))));
  },
  unite(s) {
    const grid = h('div', { class: 'ugrid' }, s.items.map((it) => {
      const el = h('div', { class: 'ucard' }, h('div', { class: 'ic' }, it.i), h('h3', {}, L(it.h)),
        h('div', { class: 'pair' }, h('div', {}, h('span', { class: 'flag' }), L(it.a)), h('div', {}, h('span', { class: 'flag' }), L(it.b))));
      const f = el.querySelectorAll('.flag'); f[0].innerHTML = FLAGS.ksz; f[1].innerHTML = FLAGS.val;
      return el;
    }));
    return decorate(h('section', { class: 'slide' }, h('h2', {}, L(s.h)),
      h('div', { class: 'cols wide unite' }, h('div', { class: 'txt' }, grid, h('p', { class: 'muted fact' }, '🥚 ' + L(s.note))), h('div', { class: 'pic heart', style: bg(s.img) }))));
  },
  rhythm(s) {
    const H0 = 7, H1 = 24, pos = (t) => (100 * (t - H0)) / (H1 - H0);
    const lane = (key, flag, name) => {
      const row = h('div', { class: 'lane' }, h('div', { class: 'who' }, h('span', { class: 'flag' }), name), h('div', { class: 'track' }));
      row.querySelector('.flag').innerHTML = flag;
      const tr = row.querySelector('.track');
      s.meals.forEach((m) => tr.append(h('div', { class: 'meal ' + key, style: `left:${pos(m[key][0])}%;width:${pos(m[key][1]) - pos(m[key][0])}%` },
        h('b', {}, m.i + ' ' + L(m.l)), h('span', {}, `${fmt(m[key][0])}–${fmt(m[key][1])}`))));
      return row;
    };
    const fmt = (t) => `${Math.floor(t)}:${t % 1 ? '30' : '00'}`;
    const ticks = h('div', { class: 'ticks' }, [8, 10, 12, 14, 16, 18, 20, 22, 24].map((t) => h('span', { style: `left:${pos(t)}%` }, `${t}:00`)));
    const cards = h('div', { class: 'rcards' }, s.cards.map((c) => {
      const el = h('div', { class: 'rcard' }, h('div', { class: 'ic' }, c.i), h('h3', {}, L(c.l)),
        h('div', { class: 'cmp' }, h('div', {}, h('span', { class: 'flag' }), L(c.ksz)), h('div', {}, h('span', { class: 'flag' }), L(c.es))));
      const f = el.querySelectorAll('.flag'); f[0].innerHTML = FLAGS.ksz; f[1].innerHTML = FLAGS.es;
      return el;
    }));
    return decorate(h('section', { class: 'slide' }, h('h2', {}, L(s.h)),
      h('div', { class: 'timeline' }, lane('ksz', FLAGS.ksz, L(T('Kaszuby', 'Kashubia', 'Casubia'))), lane('es', FLAGS.es, L(T('Hiszpania', 'Spain', 'España'))), ticks), cards));
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
    const steps = h('div', { class: 'tsteps' }, s.li.map((x, k) => h('div', { class: 'tstep' },
      h('div', { class: 'tn' }, String(k + 1)), h('div', { class: 'ti' }, (s.icons || [])[k] || '👉'), h('p', {}, L(x)))));
    let scr = null;
    if (s.screen === 'ai') scr = h('div', { class: 'tscr ai' },
      h('div', { class: 'prompt' }, h('span', { class: 'type' }, L(s.li[1]).replace(/^[^„“«"]*[„“«"]?/, '').replace(/[”»"]$/, ''))),
      h('div', { class: 'gen' }, h('div', { class: 'gimg' }, '🎸🎸🏖️'), h('i', { class: 'err e1' }), h('i', { class: 'err e2' }), h('i', { class: 'err e3' }), h('div', { class: 'loupe' }, '🔍')));
    else if (s.screen === 'translate') scr = h('div', { class: 'tscr tr' }, h('div', { class: 'cam' }, h('div', { class: 'menu' }, h('b', {}, 'MENÚ DEL DÍA'), h('span', {}, 'Paella · Horchata · Turrón')),
      h('div', { class: 'over' }, h('b', {}, L(T('MENU DNIA', 'SET MENU', 'MENÚ DEL DÍA'))), h('span', {}, L(T('Paella · Horchata · Turrón', 'Paella · Horchata · Turrón', 'Paella · Horchata · Turrón'))))), h('div', { class: 'shutter' }));
    else if (s.screen === 'lens') scr = h('div', { class: 'tscr lens' }, h('div', { class: 'limg', style: bg(s.img) }, h('div', { class: 'scan' })), h('div', { class: 'lres' }, '📍 Chocolatería Valor'));
    else if (s.screen === 'link') scr = h('div', { class: 'tscr lnk' }, h('div', { class: 'top' }, '+48 731 *** ***'),
      h('div', { class: 'bub' }, L(T('Twoja paczka czeka. Dopłać 1,99 zł: ', 'Your parcel is waiting. Pay €0.99: ', 'Tu paquete te espera. Paga 0,99 €: ')), h('u', {}, 'paczka-doplata.co')),
      h('div', { class: 'finger' }, '👆'), h('div', { class: 'pop' }, h('b', {}, 'https://paczka-doplata.co/pay'), h('span', { class: 'vs' }, '≠ inpost.pl'), h('span', { class: 'bad' }, '⚠️ ' + L(T('OSZUSTWO', 'SCAM', 'ESTAFA')))));
    else if (s.screen === 'password') scr = h('div', { class: 'tscr pwd' }, h('div', { class: 'words' }, ['zielony', 'gryf', 'pije', 'kawę'].map((w, k) => h('span', { class: 'w w' + k }, w))),
      h('div', { class: 'meter' }, h('i')), h('div', { class: 'crack' }, '🛡️ ' + L(T('Złamanie: ponad 100 lat', 'Cracking time: over 100 years', 'Tiempo para descifrarla: más de 100 años'))));
    else if (s.screen === 'secure') scr = h('div', { class: 'tscr sec' }, [L(T('Blokada ekranu', 'Screen lock', 'Bloqueo de pantalla')), L(T('Lokalizacja', 'Location', 'Localización')), L(T('Aktualizacje', 'Updates', 'Actualizaciones'))].map((t, k) => h('div', { class: 'tg tg' + k }, h('span', {}, t), h('i'))));
    return decorate(h('section', { class: 'slide s-task' }, h('span', { class: 'tag' }, '📲 ' + L(UI.tablet)), h('h2', {}, L(s.h)),
      h('div', { class: 'tlay' }, steps, scr ? h('div', { class: 'tablet' }, scr) : s.img ? h('div', { class: 'pic', style: bg(s.img) }) : null)));
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
        best ? h('span', {}, `${L(MAP_UI.closest)}: ${best.d.toFixed(1)} ${L(MAP_UI.km)}`) : null);
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
          teamBars(list)))));
  },
  results() {
    const st = surveyStats();
    const gain = st.preAvg != null && st.postAvg != null ? st.postAvg - st.preAvg : null;
    const big = (label, v, sub, cls) => h('div', { class: 'kpi ' + (cls || '') }, h('div', { class: 'v' }, v), h('div', { class: 'l' }, label), sub ? h('div', { class: 's' }, sub) : null);
    const rows = TESTS.map((q, i) => h('div', { class: 'qrow' },
      h('span', { class: 'qn' }, String(i + 1)),
      h('div', { class: 'qbars' }, h('i', { class: 'b-pre', style: `width:${st.preQ[i] || 0}%` }), h('i', { class: 'b-post', style: `width:${st.postQ[i] || 0}%` })),
      h('span', { class: 'qv' }, `${st.preQ[i] ?? '–'} → ${st.postQ[i] ?? '–'}%`)));
    return decorate(h('section', { class: 'slide' },
      h('h2', {}, L(SURVEY_UI.outcomes)),
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

  teamsLive() {
    const pre = entries('pre'), post = entries('post');
    const guesses = Object.values(geo).reduce((n, byDev) => n + Object.keys(byDev).length, 0);
    const stat = (ic, v, label) => h('div', { class: 'tlive', style: '--c:#003399' }, h('div', { class: 'big' }, ic), h('div', { class: 'stat' }, h('b', {}, String(v)), h('span', {}, L(label))));
    const cards = [
      stat('👥', Object.keys(joined).length, GAME_UI.joined),
      stat('📝', pre.length, SURVEY_UI.pre),
      stat('📝', post.length, SURVEY_UI.post),
      stat('📍', guesses, MAP_UI.answers),
      stat('📣', Survey.fbCount(), T('posty na Facebooku', 'Facebook posts', 'publicaciones en Facebook'))
    ];
    return decorate(h('section', { class: 'slide' }, h('h2', {}, L(GAME_UI.teamsLive)), h('div', { class: 'tlives' }, cards)));
  },
  problem() {
    const st = surveyStats();
    const items = window.SURVEY.filter((x) => x.part === 'A');
    return decorate(h('section', { class: 'slide' }, h('h2', {}, L(SURVEY_UI.problem)),
      h('p', { class: 'muted', style: 'font-size:26px' }, `n = ${st.pre.length}`),
      h('div', { class: 'dgrid' }, items.map((it) => distCard(it, st.pre)))));
  },
  confidence() {
    const st = surveyStats();
    return decorate(h('section', { class: 'slide' }, h('h2', {}, L(SURVEY_UI.confidence)),
      h('div', { class: 'conf' }, h('div', { class: 'legend' }, h('i', { class: 'b-pre' }), L(UI.before), h('i', { class: 'b-post' }), L(UI.after)),
        st.B.map((b) => h('div', { class: 'crow' }, h('div', { class: 'ct' }, L(b.item.q)),
          h('div', { class: 'cbars' },
            h('div', { class: 'cb pre', style: `width:${((b.pre || 0) / 5) * 100}%` }, b.pre == null ? '–' : String(b.pre)),
            h('div', { class: 'cb post', style: `width:${((b.post || 0) / 5) * 100}%` }, b.post == null ? '–' : String(b.post))),
          h('div', { class: 'cd' }, b.pre != null && b.post != null ? (b.post - b.pre >= 0 ? '+' : '') + (Math.round((b.post - b.pre) * 10) / 10) : ''))))));
  },
  evaluation() {
    const st = surveyStats();
    const items = window.SURVEY.filter((x) => x.part === 'D');
    return decorate(h('section', { class: 'slide' }, h('h2', {}, L(SURVEY_UI.evaluation)),
      h('p', { class: 'muted', style: 'font-size:26px' }, `n = ${st.post.length}`),
      h('div', { class: 'dgrid five' }, items.map((it) => distCard(it, st.post)))));
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
    return decorate(h('section', { class: 'slide' }, h('h2', {}, L(T('Źródła', 'Sources', 'Fuentes'))),
      h('div', { class: 'credits' }, window.CREDITS.map((c) => h('p', {}, `${c.title} — ${c.author}, ${c.license}, Wikimedia Commons`)),
        h('p', {}, 'Mapy / Maps: © OpenStreetMap contributors, OpenFreeMap, MapLibre'))));
  },
  end(s) {
    return decorate(h('section', { class: 'slide s-end' }, h('h1', {}, L(s.h)), h('p', { class: 'disc' }, L(UI.disclaimer))));
  }
};

function teamBars(list) {
  const members = Object.keys(joined).length, fin = list.length, tot = Math.max(members, fin, 1);
  return h('div', { class: 'tbars' }, h('div', { class: 'tbar' }, h('span', { class: 'tic', style: 'background:#003399' }, '👥'), h('b', {}, L(GAME_UI.finished)),
    h('div', { class: 'track2' }, h('i', { style: `width:${(100 * fin) / tot}%;background:#003399` })), h('em', {}, `${fin} / ${members || '–'}`)));
}
function distCard(it, list) {
  const c = Survey.dist(list, it), n = Math.max(1, c.reduce((x, y) => x + y, 0)), mx = Math.max(...c);
  return h('div', { class: 'dcard' }, h('h3', {}, L(it.q)),
    it.a.map((o, i) => h('div', { class: 'drow' + (c[i] === mx && mx > 0 ? ' top' : '') },
      h('span', { class: 'dl' }, L(o)), h('div', { class: 'dbar' }, h('i', { style: `width:${(100 * c[i]) / n}%` })), h('b', {}, Math.round((100 * c[i]) / n) + '%'))));
}

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
  // Throttled: the free live channel rate-limits per IP, so the presenter sends at most one position update per 4 s.
  navTimer = setTimeout(() => Live.send(topic, { k: 'nav', dk: deck().id, s: S.slide, st: S.step }), 4000);
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
// Preload every picture once; a loaded picture is never faded or skeleton-ed again.
const LOADED = new Set();
const preload = (src) => new Promise((res) => {
  if (LOADED.has(src)) return res();
  const im = new Image();
  im.onload = im.onerror = () => { LOADED.add(src); res(); };
  im.src = src;
});
(JSON.stringify([window.DECKS, window.STOPS, window.GUESS]).match(/img\/[^"'\s)]+\.(?:jpg|png|svg)(?:\?v=\d+)?/g) || [])
  .filter((v, i, all) => all.indexOf(v) === i).forEach((src) => preload(src));
function skeletons(root) {
  root.querySelectorAll('[style*="background-image"]').forEach((el) => {
    const m = /url\(['"]?([^'")]+)/.exec(el.style.backgroundImage);
    if (!m || LOADED.has(m[1])) return;
    el.classList.add('sk');
    preload(m[1]).then(() => { el.classList.remove('sk'); el.classList.add('ld'); });
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
  if (['survey', 'results', 'people', 'teams', 'problem', 'confidence', 'evaluation'].includes(s.k)) pullSheet();
  broadcast();
  const lo = document.getElementById('langov');
  if (lo && lo.classList.contains('on')) qr(lo.querySelector('.q'), langUrl(), 380);
  const key = slideKey(s);
  if (!READER && key && lastOpen !== key) {
    lastOpen = key;
    const mode = s.k === 'q' ? 'q' : s.k === 'guess' ? 'guess' : s.k === 'pins' ? 'pin' : 'survey';
    Live.sendSure(topic, { k: 'o', key, mode, phase: s.phase }, null, 6);
  }
}

// Live refresh: map slides update pins in place, others re-render.
function refresh() {
  const s = cur();
  if (['guess', 'pins'].includes(s.k) && mapCtl && mapCtl.update) {
    const c = document.querySelector('.count');
    if (c) c.textContent = `${L(MAP_UI.answers)}: ${Object.keys(geo[slideKey(s)] || {}).length}`;
    mapCtl.update();
  } else if (['q', 'join', 'survey', 'results', 'people', 'teams', 'problem', 'confidence', 'evaluation', 'teamsLive'].includes(s.k)) render();
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
// Language QR lives in an overlay the presenter opens when needed (🌐 or L), not on every slide.
function langOverlay(show) {
  let ov = document.getElementById('langov');
  if (!ov) {
    ov = h('div', { id: 'langov', onclick: () => langOverlay(false) }, h('div', { class: 'card' }, h('div', { class: 'q' }), h('p', {}, 'English · Español · Polski'), h('small', {}, L(UI.lang))));
    document.body.append(ov);
  }
  const on = show === undefined ? !ov.classList.contains('on') : show;
  ov.classList.toggle('on', on);
  if (on) qr(ov.querySelector('.q'), langUrl(), 380);
}
function full() { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); }

function paperForm() {
  const c = document.getElementById('menucard');
  c.innerHTML = '';
  const ph = h('select', {}, h('option', { value: 'pre' }, 'PRZED'), h('option', { value: 'post' }, 'PO'));
  const code = h('input', { placeholder: 'Kod, np. A07' });
  const ans = h('input', {});
  const hint = h('p', { class: 'hint' });
  const setHint = () => {
    const it = itemsFor(ph.value);
    ans.placeholder = `${it.length} znaków`;
    hint.textContent = 'Kolejno: ' + it.map((x) => x.id + (x.type === 'likert' ? '(1-5)' : '(' + 'ABCD'.slice(0, x.a.length) + ')')).join(' ');
  };
  ph.onchange = setHint; setHint();
  const info = h('p', {}, `Zapisanych: przed ${entries('pre').length}, po ${entries('post').length}`);
  c.append(h('h3', {}, 'Ankieta z kartki'), ph, code, ans, hint,
    h('div', { class: 'row' },
      h('button', { onclick: () => {
        const it = itemsFor(ph.value), raw = ans.value.toUpperCase().replace(/[^A-D1-5]/g, '');
        if (raw.length !== it.length || !code.value.trim()) { alert(`Potrzebny kod i ${it.length} odpowiedzi.`); return; }
        const out = {};
        for (let k = 0; k < it.length; k++) {
          const x = it[k], ch = raw[k];
          if (x.type === 'likert') { if (!/[1-5]/.test(ch)) { alert(`${x.id}: cyfra 1–5`); return; } out[x.id] = +ch; }
          else { const v = 'ABCD'.indexOf(ch); if (v < 0 || v >= x.a.length) { alert(`${x.id}: litera ${'ABCD'.slice(0, x.a.length)}`); return; } out[x.id] = v; }
        }
        const cd = code.value.trim().toUpperCase();
        Survey.paper(ph.value, cd, out); code.value = ''; ans.value = ''; code.focus();
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
      Object.keys(window.DAYS).map((k) => h('button', { style: S.day === k ? 'background:#0B1F3A;color:#fff' : '', onclick: () => { S.day = k; save(); menu(true); render(); } }, '📅 ' + L(window.DAYS[k].name))),
      h('button', { onclick: paperForm }, '✍ Ankieta z kartki'),
      h('button', { onclick: Survey.csv }, '⬇ CSV ankiety'),
      h('a', { href: 'survey-print.html', target: '_blank' }, '🖨 Ankieta do druku'),
      h('a', { href: 'report.html', target: '_blank' }, '📄 Raport wyników (PDF)'),
      h('a', { href: 'consent.html', target: '_blank' }, '✍️ Zgody RODO (tablet)'),
      h('a', { href: 'social.html', target: '_blank' }, '📣 Posty na FB (seria)'),
      [['mix', 'Animacja: przejścia B + lista A'], ['a', 'Animacja A'], ['b', 'Animacja B'], ['none', 'Bez animacji']].map(([v, t]) => h('button', { style: ANIM === v ? 'background:#0B1F3A;color:#fff' : '', onclick: () => { ANIM = v; store('kws-anim', v); menu(true); } }, t)),
      h('button', { onclick: () => { if (confirm('Nowa sesja głosowania? (wyniki ankiety zostają na tym laptopie)')) { store('kws-topic', null); location.search = ''; } } }, '↺ Nowa sesja')),
    h('p', {}, 'Sesja: ', h('code', {}, topic), ` · ankieta: przed ${entries('pre').length}, po ${entries('post').length}`, Sheet.url() ? h('button', { onclick: () => pullSheet(true) }, '↻ pobierz z arkusza') : null),
    h('p', {}, 'Klawisze: ← → / spacja / pilot (na mapie podróży: kolejne przystanki) · R pokaż odpowiedź w zgadywance · F pełny ekran · M menu. Klik w odpowiedź sondy = +1 głos z sali.'),
    h('button', { onclick: () => menu(false) }, 'Zamknij'));
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
  else if (e.key === 'l' || e.key === 'L') langOverlay();
  else if (e.key === 'Escape') langOverlay(false);
});
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]');
  if (!b) return;
  const a = b.dataset.act;
  if (a === 'prev') go(-1); else if (a === 'next') go(1); else if (a === 'reveal') reveal(); else if (a === 'full') full(); else if (a === 'menu') menu(true); else if (a === 'lang') langOverlay();
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
