// Pre/post survey: the single store and statistics used by the presentation slides, the menu and report.html.
// Answers come from phones (live channel / sheet) and paper forms; all of them land in one place: localStorage 'kws-survey-v1'.
(function () {
  const KEY = 'kws-survey-v1', FB = 'kws-fb';
  const SV = store(KEY) || {};
  const TESTS = window.SURVEY.filter((x) => x.type === 'test');
  const avg = (xs, d = 0) => (xs.length ? Math.round((10 ** d * xs.reduce((a, b) => a + b, 0)) / xs.length) / 10 ** d : null);
  const pct = (ans) => Math.round((100 * TESTS.filter((x) => ans[x.id] === x.ok).length) / TESTS.length);
  const entries = (phase) => Object.values(SV).filter((e) => e.phase === phase && e.ans && !Array.isArray(e.ans));
  const ok = (phase) => phase === 'pre' || phase === 'post';

  function put(phase, code, ans, t, src, g, dev) {
    if (!ok(phase) || !ans || typeof ans !== 'object' || Array.isArray(ans)) return false;
    code = String(code || '').trim().toUpperCase();
    SV[phase + '|' + (code || 'dev-' + dev)] = { phase, code, g, ans, t, src };
    return true;
  }

  window.Survey = {
    TESTS, pct, entries, avg,
    itemsFor: (phase) => window.SURVEY.filter((x) => x.ph.includes(phase)),
    save: () => store(KEY, SV),
    fbCount: () => Object.keys(store(FB) || {}).length,
    // One live-channel message → survey answer or Facebook post. Returns true when something was stored.
    ingest(m, x) {
      if (!x) return false;
      if (x.k === 's') { const r = put(x.phase, x.code, x.ans, m.time, 'phone', x.g, x.d); if (r) Survey.save(); return r; }
      if (x.k === 'fb' && x.d) { const fb = store(FB) || {}; fb[x.d] = { g: x.g, t: m.time }; store(FB, fb); return true; }
      return false;
    },
    paper(phase, code, ans) { put(phase, code, ans, Date.now() / 1000, 'paper'); Survey.save(); if (Sheet.url()) Sheet.postSure({ phase, code: String(code).trim().toUpperCase(), ans, src: 'paper', d: 'paper' }); },
    async pullSheet() {
      if (!Sheet.url()) return 0;
      const rows = await Sheet.rows();
      rows.forEach((r) => put(r.phase, r.code, r.ans, r.t, r.src, r.g, r.key));
      if (rows.length) Survey.save();
      return rows.length;
    },
    // Everything a page needs when it opens later: the session's channel history plus the sheet.
    async pull(topic) {
      if (topic) (await Live.history(topic)).forEach((m) => Survey.ingest(m, Live.parse(m)));
      await Survey.pullSheet();
    },
    dist(list, item) {
      const c = item.a.map(() => 0);
      list.forEach((e) => { const v = e.ans[item.id]; if (v >= 0 && v < c.length) c[v]++; });
      return c;
    },
    stats() {
      const pre = entries('pre'), post = entries('post');
      const perQ = (list) => TESTS.map((q) => (list.length ? Math.round((100 * list.filter((e) => e.ans[q.id] === q.ok).length) / list.length) : null));
      const likert = (list, id) => avg(list.map((e) => e.ans[id]).filter((v) => v >= 1 && v <= 5), 1);
      const by = (list) => Object.fromEntries(list.filter((e) => e.code).map((e) => [e.code, e]));
      const P = by(pre), Q = by(post);
      const people = Object.keys(P).filter((c) => Q[c]).map((c) => ({ code: c, pre: pct(P[c].ans), post: pct(Q[c].ans) })).sort((x, y) => (y.post - y.pre) - (x.post - x.pre));
      const preAvg = avg(pre.map((e) => pct(e.ans))), postAvg = avg(post.map((e) => pct(e.ans)));
      const share = (fn) => (post.length ? Math.round((100 * post.filter(fn).length) / post.length) : null);
      return {
        pre, post, preAvg, postAvg, people,
        gain: preAvg != null && postAvg != null ? postAvg - preAvg : null,
        reached: people.filter((p) => p.post - p.pre >= 40).length,
        preQ: perQ(pre), postQ: perQ(post),
        B: window.SURVEY.filter((x) => x.type === 'likert').map((x) => ({ item: x, pre: likert(pre, x.id), post: likert(post, x.id) })),
        d1: share((e) => e.ans.D1 === 0),
        d2: share((e) => e.ans.D2 === 0 || e.ans.D2 === 2)
      };
    },
    csv() {
      const head = ['faza', 'kod', 'zrodlo', 'czas', 'test_%', ...window.SURVEY.map((x) => x.id)];
      const cell = (x, v) => (v == null ? '' : x.type === 'likert' ? v : 'ABCD'[v] + (x.type === 'test' && v === x.ok ? ' ✓' : ''));
      const rows = [head, ...Object.values(SV).filter((e) => e.ans && !Array.isArray(e.ans)).map((e) => [e.phase, e.code, e.src, new Date(e.t * 1000).toISOString(), pct(e.ans), ...window.SURVEY.map((x) => cell(x, e.ans[x.id]))])];
      const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
      const el = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv' })), download: 'kws-ankieta-dezinformacja.csv' });
      document.body.append(el); el.click(); el.remove();
    }
  };
})();
