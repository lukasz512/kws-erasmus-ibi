// Kaszëbi w Europie! – survey storage. Paste into the Google Sheet: Extensions → Apps Script, then Deploy → Web app.
const SHEET = 'Ankieta';
const IDS = ['A1','A2','A3','A4','B1','B2','B3','B4','B5','C1','C2','C3','C4','C5','C6','C7','C8','C9','C10','D1','D2','D3','D4','D5'];
const HEAD = ['czas', 'klucz', 'faza', 'kod', 'druzyna', 'zrodlo', 'odpowiedzi_json'].concat(IDS);

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
  if (sh.getLastRow() === 0) sh.appendRow(HEAD);
  return sh;
}

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.phase !== 'pre' && d.phase !== 'post') return out_({ ok: false, error: 'phase' });
    const code = String(d.code || '').toUpperCase().slice(0, 6);
    const ans = d.ans || {};
    sheet_().appendRow([new Date(), d.phase + '|' + (code || 'dev-' + d.d), d.phase, code, d.g, d.src || 'phone', JSON.stringify(ans)]
      .concat(IDS.map(function (id) { return ans[id] === undefined ? '' : ans[id]; })));
    return out_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  const v = sheet_().getDataRange().getValues();
  const rows = v.slice(1).map(function (r) {
    return { t: r[0] instanceof Date ? r[0].getTime() / 1000 : 0, key: r[1], phase: r[2], code: r[3], g: r[4] === '' ? null : Number(r[4]), src: r[5], ans: JSON.parse(r[6] || '{}') };
  });
  return out_({ ok: true, rows: rows });
}
