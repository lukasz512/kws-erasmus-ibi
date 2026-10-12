// Shared helpers: language, device id, live channel (ntfy.sh), QR codes.
const params = new URLSearchParams(location.search);

function detectLang() {
  const p = params.get('lang');
  if (['pl', 'en', 'es'].includes(p)) return p;
  const n = (navigator.language || 'pl').slice(0, 2);
  return n === 'es' ? 'es' : n === 'pl' ? 'pl' : 'en';
}
let LANG = detectLang();
const L = (x) => (x == null ? '' : typeof x === 'string' ? x : x[LANG] || x.pl || '');

function store(key, val) {
  try {
    if (val === undefined) return JSON.parse(localStorage.getItem(key) || 'null');
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) { return null; }
}

function deviceId() {
  let d = store('kws-device');
  if (!d) { d = Math.random().toString(36).slice(2, 10); store('kws-device', d); }
  return d;
}

// "dz1:pre" → question dz1, phase pre
const keyOf = (slide) => slide.q + (slide.phase ? ':' + slide.phase : '');
const qOf = (key) => window.Q[key.split(':')[0]];

const NTFY = 'https://ntfy.sh/';
// Survey storage in a Google Sheet (reliable, no per-IP quota). Text body avoids a CORS preflight.
const Sheet = {
  url: () => (window.SHEET_URL || '').trim(),
  async post(row) {
    try { const r = await fetch(Sheet.url(), { method: 'POST', body: JSON.stringify(row) }); const j = await r.json(); return !!j.ok; }
    catch (e) { return false; }
  },
  async postSure(row, onTry, tries = 12) {
    for (let k = 0; k < tries; k++) {
      if (await Sheet.post(row)) return true;
      if (onTry) onTry(k + 1);
      await new Promise((r) => setTimeout(r, 3000 + Math.random() * 3000));
    }
    return false;
  },
  async rows() {
    try { const r = await fetch(Sheet.url()); const j = await r.json(); return j.ok ? j.rows : []; } catch (e) { return []; }
  }
};
const Live = {
  send(topic, msg) {
    return fetch(NTFY + topic, { method: 'POST', body: JSON.stringify(msg) }).then((r) => r.ok).catch(() => false);
  },
  // Important messages (survey answers): retry with back-off until the service accepts them (it rate-limits per IP).
  async sendSure(topic, msg, onTry, tries = 24) {
    for (let k = 0; k < tries; k++) {
      if (await Live.send(topic, msg)) return true;
      if (onTry) onTry(k + 1);
      await new Promise((r) => setTimeout(r, 4000 + Math.random() * 4000));
    }
    return false;
  },
  async history(topic) {
    try {
      const r = await fetch(NTFY + topic + '/json?poll=1&since=all');
      const txt = await r.text();
      return txt.split('\n').filter(Boolean).map((l) => JSON.parse(l)).filter((m) => m.event === 'message');
    } catch (e) { return []; }
  },
  listen(topic, onMsg, onStatus) {
    const es = new EventSource(NTFY + topic + '/sse');
    es.onopen = () => onStatus && onStatus(true);
    es.onerror = () => onStatus && onStatus(false);
    es.onmessage = (e) => {
      try { const m = JSON.parse(e.data); if (m.event === 'message') onMsg(m); } catch (err) { /* ignore */ }
    };
    return es;
  },
  parse(m) { try { return JSON.parse(m.message); } catch (e) { return null; } }
};

function qr(el, text, size) {
  el.innerHTML = '';
  if (!window.QRCode) { el.textContent = text; return; }
  new QRCode(el, { text, width: size, height: size, colorDark: '#0B1F3A', colorLight: '#FFFFFF', correctLevel: QRCode.CorrectLevel.M });
}

function h(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === 'class') e.className = v;
    else if (k === 'style') e.style.cssText = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  for (const k of kids.flat()) if (k != null && k !== false) e.append(k.nodeType ? k : document.createTextNode(k));
  return e;
}

const EU_FLAG = '<svg viewBox="0 0 60 40" aria-label="EU"><rect width="60" height="40" fill="#003399"/>' +
  Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6, x = 30 + 12 * Math.sin(a), y = 20 - 12 * Math.cos(a);
    return `<text x="${x}" y="${y + 2.2}" font-size="6.5" text-anchor="middle" fill="#FFCC00">★</text>`;
  }).join('') + '</svg>';

// Pages caches HTML for ~10 min: when a newer version is deployed, reload once with a fresh URL.
fetch('version.txt?' + Date.now(), { cache: 'no-store' }).then((r) => r.text()).then((v) => {
  v = v.trim();
  if (v && window.APP_V && v !== window.APP_V) {
    const u = new URL(location.href);
    if (u.searchParams.get('_v') === v) return;
    u.searchParams.set('_v', v);
    location.replace(u.toString());
  }
}).catch(() => {});

// Preview mode (?pv=…, used by podglad.html): pages render normally but send nothing to the live channel or the sheet.
if (params.get('pv') !== null) {
  const ok = () => Promise.resolve(true);
  Live.send = ok; if (Live.sendSure) Live.sendSure = ok; Sheet.post = ok;
}
