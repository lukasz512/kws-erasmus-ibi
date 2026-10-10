// Presenter (and EN/ES reader) for the five decks.
const READER = params.get('view') === '1';
if (READER) document.body.classList.add('reader');
else if (!params.get('lang')) LANG = 'pl';

let topic = params.get('t') || store('kws-topic');
if (!topic) { topic = 'kws-ibi-' + Math.random().toString(36).slice(2, 12); }
if (!READER) store('kws-topic', topic);

const S = Object.assign(
  { deck: 0, slide: 0, manual: [0, 0, 0], revealed: {}, hand: {} },
  READER ? {} : store('kws-state-' + topic) || {}
);
const startDeck = window.DECKS.findIndex((d) => d.id === params.get('d'));
if (startDeck >= 0) { S.deck = startDeck; S.slide = Math.max(0, parseInt(params.get('s') || '0', 10)); }

const votes = {};    // key → { device: {a, g} }
const joined = {};   // device → group
const seen = new Set();
const save = () => { if (!READER) store('kws-state-' + topic, { deck: S.deck, slide: S.slide, manual: S.manual, revealed: S.revealed, hand: S.hand }); };

function ingest(m) {
  if (seen.has(m.id)) return false;
  seen.add(m.id);
  const x = Live.parse(m);
  if (!x) return false;
  if (x.k === 'v' && x.key && x.d != null) {
    (votes[x.key] = votes[x.key] || {})[x.d] = { a: x.a, g: x.g, t: m.time };
    if (x.g != null) joined[x.d] = x.g;
  } else if (x.k === 'j' && x.d != null) {
    joined[x.d] = x.g;
  }
  return true;
}

function tally(key) {
  const q = qOf(key);
  const counts = q.a.map(() => 0);
  const byGroup = [0, 1, 2].map(() => ({ n: 0, ok: 0 }));
  for (const v of Object.values(votes[key] || {})) {
    if (v.a >= 0 && v.a < counts.length) counts[v.a]++;
    if (v.g >= 0 && v.g < 3) { byGroup[v.g].n++; if (q.ok === v.a) byGroup[v.g].ok++; }
  }
  (S.hand[key] || []).forEach((n, i) => { counts[i] += n; });
  return { counts, total: counts.reduce((a, b) => a + b, 0), byGroup };
}

function scores() {
  const s = S.manual.slice();
  for (const key of Object.keys(S.revealed)) {
    const q = qOf(key);
    if (!q || q.ok == null) continue;
    tally(key).byGroup.forEach((g, i) => { if (g.n) s[i] += Math.round((10 * g.ok) / g.n); });
  }
  return s;
}

const deck = () => window.DECKS[S.deck];
const cur = () => deck().slides[S.slide];
const bg = (url) => `background-image:url('${url}')`;
const voteUrl = (key) => window.BASE + 'vote.html?t=' + topic + (key ? '&k=' + encodeURIComponent(key) : '');
const langUrl = () => window.BASE + 'lang.html?d=' + deck().id + '&s=' + S.slide + '&t=' + topic;

function footer() {
  const sc = scores();
  return h('div', { class: 'footer' },
    h('div', { class: 'eu', html: '' }),
    h('span', {}, L(UI.cofund)),
    h('span', { class: 'sp' }),
    h('span', {}, `${S.slide + 1} / ${deck().slides.length}`),
    h('div', { class: 'mini-score' }, GROUPS.map((g, i) => h('span', { style: `background:${g.color}` }, String(sc[i]))))
  );
}
function topbar() { return h('div', { class: 'topbar' }, h('img', { src: 'img/kaszebi-logo.png', alt: 'Kaszëbi we swiecë' })); }

function decorate(el, opts = {}) {
  if (opts.top !== false) el.append(topbar());
  el.append(footer());
  el.querySelectorAll('.footer .eu').forEach((e) => { e.innerHTML = EU_FLAG; });
  if (!READER) {
    const box = h('div', { class: 'langqr' }, h('div', {}), h('small', {}, 'EN · ES · PL'));
    el.append(box);
    qr(box.firstChild, langUrl(), 128);
  }
  return el;
}

function bullets(li, ordered) { return h(ordered ? 'ol' : 'ul', { class: ordered ? 'steps' : 'big' }, li.map((x) => h('li', {}, L(x)))); }

const R = {
  title(s) {
    const el = h('section', { class: 'slide s-title' },
      h('div', { class: 'left' }, h('div', { class: 'kicker' }, L(s.kicker)), h('h1', {}, L(s.h)), h('p', { class: 'muted' }, L(s.p))),
      h('div', { class: 'right', style: bg(s.img) }));
    return decorate(el);
  },
  join() {
    const counts = [0, 0, 0];
    Object.values(joined).forEach((g) => { if (g >= 0 && g < 3) counts[g]++; });
    const box = h('div', { class: 'qbox' });
    const el = h('section', { class: 'slide' },
      h('h2', {}, L(UI.join)),
      h('div', { class: 'join' }, box,
        h('div', { class: 'groups' },
          h('p', { class: 'muted' }, L(UI.scan)),
          h('p', {}, L(UI.pickGroup) + ':'),
          GROUPS.map((g, i) => h('div', { class: 'grp' }, h('i', { style: `background:${g.color}` }), L(g.name), h('span', { class: 'n' }, String(counts[i])))),
          h('p', { class: 'muted', style: 'font-size:28px' }, voteUrl().replace('https://', '')))));
    qr(box, voteUrl(), 460);
    return decorate(el);
  },
  text(s) {
    const el = h('section', { class: 'slide' }, h('h2', {}, L(s.h)),
      h('div', { class: 'cols' }, h('div', { class: 'txt' }, bullets(s.li)), s.img ? h('div', { class: 'pic', style: bg(s.img) }) : null));
    return decorate(el);
  },
  img(s) {
    const el = h('section', { class: 'slide s-img' }, h('div', { class: 'photo', style: bg(s.img) }),
      h('div', { class: 'cap' }, h('h2', {}, L(s.h)), h('p', {}, L(s.p))));
    return decorate(el, { top: false });
  },
  compare(s) {
    const fig = (x) => h('figure', {}, h('div', { class: 'pic', style: bg(x.img) }), h('figcaption', {}, L(x.h)));
    return decorate(h('section', { class: 'slide' }, h('div', { class: 'compare' }, fig(s.a), fig(s.b))));
  },
  map(s) {
    const src = `https://www.openstreetmap.org/export/embed.html?bbox=${s.bbox}&layer=mapnik&marker=${s.marker}`;
    return decorate(h('section', { class: 'slide' }, h('h2', {}, L(s.h)), h('iframe', { class: 'map', src, title: L(s.h), loading: 'lazy' }), h('p', {}, L(s.p))));
  },
  table(s) {
    const t = h('table', { class: 't' + (s.rows.length > 6 ? ' dense' : '') }, s.rows.map((r) => h('tr', {}, r.map((c) => h('td', {}, L(c))))));
    return decorate(h('section', { class: 'slide' }, h('h2', {}, L(s.h)), t));
  },
  post(s) {
    return decorate(h('section', { class: 'slide', style: 'justify-content:center' },
      h('div', { class: 'post' }, h('div', { class: 'who' }, h('i'), L(T('Prawdziwe Wiadomości 24', 'Real News 24', 'Noticias Reales 24'))), h('p', {}, L(s.text)),
        h('div', { class: 'acts' }, h('span', {}, '👍 12K'), h('span', {}, '💬 3.4K'), h('span', {}, '↗ 8.9K'))),
      h('p', { class: 'muted', style: 'text-align:center;font-size:28px' }, L(s.note))));
  },
  q(s) {
    const key = keyOf(s), q = qOf(key), t = tally(key), shown = !!S.revealed[key];
    const max = Math.max(1, ...t.counts);
    const opts = h('div', { class: 'opts' }, q.a.map((a, i) => {
      const cls = 'opt' + (shown && q.ok != null ? (i === q.ok ? ' ok' : ' dim') : '');
      const b = h('button', { class: cls, title: 'klik = +1 głos z sali' },
        h('span', { class: 'fill', style: `width:${READER ? 0 : (100 * t.counts[i]) / max}%` }),
        h('span', { class: 'letter' }, 'ABCD'[i]), h('span', { class: 'lbl' }, L(a)),
        READER ? null : h('span', { class: 'n' }, String(t.counts[i])));
      if (!READER) b.addEventListener('click', () => { (S.hand[key] = S.hand[key] || q.a.map(() => 0))[i]++; save(); render(); });
      return b;
    }));
    const box = h('div', { class: 'qbox' });
    const badge = s.phase === 'pre' ? 'TEST · START' : s.phase === 'post' ? 'TEST · KONIEC' : q.ok != null ? 'QUIZ' : '?';
    const el = h('section', { class: 'slide' },
      h('div', { class: 'qwrap' },
        h('div', { class: 'qleft' }, h('span', { class: 'badge' + (q.ok != null ? ' quiz' : '') }, badge), h('h2', {}, L(q.q)),
          q.img ? h('div', { class: 'qimg', style: bg(q.img) }) : null, opts),
        h('div', { class: 'qright' }, box, READER ? null : h('div', { class: 'count' }, `${L(UI.votes)}: ${t.total}`),
          READER ? null : h('div', { class: 'muted', style: 'font-size:24px' }, q.ok != null && !shown ? L(UI.reveal) : ''))));
    qr(box, voteUrl(key), 340);
    if (READER) {
      const btn = h('a', { class: 'badge quiz', href: voteUrl(key), style: 'text-decoration:none;text-align:center' }, '📱 ' + L(UI.join));
      el.querySelector('.qright').append(btn);
    }
    return decorate(el);
  },
  task(s) {
    const pts = h('div', { class: 'task-pts' }, GROUPS.map((g, i) => h('button', { style: `background:${g.color}`, onclick: () => bump(i, 1) }, '+1 ' + L(g.name))));
    const el = h('section', { class: 'slide s-task' }, h('span', { class: 'tag' }, '📲 ' + L(UI.tablet)), h('h2', {}, L(s.h)),
      h('div', { class: 'cols' }, h('div', { class: 'txt' }, bullets(s.li, true)), s.img ? h('div', { class: 'pic', style: bg(s.img) }) : null), READER ? null : pts);
    return decorate(el);
  },
  score() {
    const sc = scores(), max = Math.max(10, ...sc);
    const el = h('section', { class: 'slide' }, h('h2', {}, L(UI.score)),
      h('div', { class: 'score' }, GROUPS.map((g, i) => h('div', { class: 'col' },
        h('div', { class: 'pts' }, String(sc[i])),
        h('div', { class: 'bar', style: `height:${(560 * sc[i]) / max}px;background:${g.color}` }),
        h('div', { class: 'nm' }, L(g.name)),
        READER ? null : h('div', { class: 'ctrl-row' }, h('button', { onclick: () => bump(i, -1) }, '−1'), h('button', { onclick: () => bump(i, 1) }, '+1'))))));
    return decorate(el);
  },
  prepost(s) {
    const pct = (key) => { const q = qOf(key), t = tally(key); return t.total ? Math.round((100 * t.counts[q.ok]) / t.total) : null; };
    const bar = (v, color, label) => h('div', { class: 'b', style: `width:${Math.max(18, v || 0)}%;background:${color}` }, `${label}: ${v == null ? '–' : v + '%'}`);
    const el = h('section', { class: 'slide' }, h('h2', {}, L(UI.before) + ' / ' + L(UI.after)),
      h('div', { class: 'pp' }, s.qs.map((id) => h('div', { class: 'row' }, h('div', {}, L(window.Q[id].q)),
        h('div', { class: 'bars' }, bar(pct(id + ':pre'), '#8A94A6', L(UI.before)), bar(pct(id + ':post'), '#1E7B4A', L(UI.after)))))));
    return decorate(el);
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
      h('div', { class: 'credits' }, window.CREDITS.map((c) => h('p', {}, `${c.title} — ${c.author}, ${c.license}, Wikimedia Commons`)))));
  },
  end(s) {
    return decorate(h('section', { class: 'slide s-end' }, h('h1', {}, L(s.h)), h('p', { class: 'disc' }, L(UI.disclaimer))));
  }
};

function bump(i, d) { S.manual[i] += d; save(); render(); }

function fit() {
  const el = document.querySelector('#viewport .slide');
  if (!el || READER) return;
  const k = Math.min(innerWidth / 1920, innerHeight / 1080);
  el.style.transform = `translate(-50%, -50%) scale(${k})`;
}

let lastOpen = null;
function render() {
  const s = cur();
  const vp = document.getElementById('viewport');
  vp.innerHTML = '';
  vp.append(R[s.k](s));
  fit();
  document.getElementById('pos').textContent = `${S.slide + 1}/${deck().slides.length}`;
  if (!READER && s.k === 'q') {
    const key = keyOf(s);
    if (lastOpen !== key) { lastOpen = key; Live.send(topic, { k: 'o', key }); }
  }
}

function go(d) {
  const n = deck().slides.length;
  S.slide = Math.min(n - 1, Math.max(0, S.slide + d));
  save(); render();
  if (READER) scrollTo(0, 0);
}
function reveal() {
  const s = cur();
  if (s.k !== 'q') return;
  const key = keyOf(s);
  S.revealed[key] = true; save(); render();
  Live.send(topic, { k: 'r', key });
}
function full() { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); }

function menu(on) {
  const m = document.getElementById('menu');
  m.classList.toggle('on', on);
  if (!on) return;
  const c = document.getElementById('menucard');
  c.innerHTML = '';
  c.append(
    h('h3', {}, 'Kaszëbi w Europie! – wybierz prezentację'),
    h('div', { class: 'decks' }, window.DECKS.map((d, i) => h('button', { onclick: () => { S.deck = i; S.slide = 0; lastOpen = null; save(); menu(false); render(); } }, `${i + 1}. ${L(d.title)} (${d.slides.length})`))),
    h('div', { class: 'row' },
      ['pl', 'en', 'es'].map((l) => h('button', { onclick: () => { LANG = l; menu(false); render(); } }, 'Język: ' + l.toUpperCase())),
      h('button', { onclick: exportCsv }, '⬇ CSV (głosy + test pre/post)'),
      h('button', { onclick: () => { if (confirm('Nowa sesja: zerujemy wyniki i głosy?')) { store('kws-topic', null); location.search = ''; } } }, '↺ Nowa sesja')),
    h('p', {}, 'Sesja: ', h('code', {}, topic)),
    h('p', {}, 'Klawisze: ← → / spacja / pilot · R odpowiedź · 1 2 3 = +1 drużynie (Shift = −1) · F pełny ekran · M menu. Klik w odpowiedź = +1 głos z sali (gdy nie ma internetu, liczcie ręce).'),
    h('button', { onclick: () => menu(false) }, 'Zamknij'));
}

function exportCsv() {
  const rows = [['czas', 'pytanie', 'faza', 'odpowiedz', 'poprawna', 'druzyna', 'urzadzenie']];
  for (const [key, byDev] of Object.entries(votes)) {
    const q = qOf(key);
    for (const [d, v] of Object.entries(byDev)) {
      rows.push([new Date(v.t * 1000).toISOString(), key.split(':')[0], key.split(':')[1] || '', L(q.a[v.a]), q.ok == null ? '' : v.a === q.ok ? '1' : '0', v.g >= 0 ? L(GROUPS[v.g].name) : '', d]);
    }
  }
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = h('a', { href: URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv' })), download: `kws-glosy-${topic}.csv` });
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
  else if (['1', '2', '3', '!', '@', '#'].includes(e.key)) {
    const i = { 1: 0, 2: 1, 3: 2, '!': 0, '@': 1, '#': 2 }[e.key];
    bump(i, e.shiftKey ? -1 : 1);
  }
});
document.getElementById('chrome').addEventListener('click', (e) => {
  const a = e.target.dataset.act;
  if (a === 'prev') go(-1); else if (a === 'next') go(1); else if (a === 'reveal') reveal(); else if (a === 'full') full(); else if (a === 'menu') menu(true);
});
document.getElementById('prev').onclick = () => go(-1);
document.getElementById('next').onclick = () => go(1);
if (READER) document.getElementById('chrome').style.display = 'none';

render();
if (!READER) {
  if (startDeck < 0 && !params.get('d')) menu(true);
  const live = document.getElementById('live');
  let redraw = null;
  const later = () => { clearTimeout(redraw); redraw = setTimeout(() => { if (['q', 'join', 'score', 'prepost'].includes(cur().k)) render(); }, 300); };
  Live.history(topic).then((ms) => { ms.forEach(ingest); later(); });
  Live.listen(topic, (m) => { if (ingest(m)) later(); }, (ok) => { live.textContent = ok ? '● na żywo' : '○ brak połączenia – liczcie ręce'; });
}
