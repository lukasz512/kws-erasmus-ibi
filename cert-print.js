// Printable A4 certificate shared by cert.html (participant) and consent.html (organiser batch print).
(function () {
  const css = `
  .certs { display: none; }
  @media print { .certs { display: block; } }
    .cert { box-sizing: border-box; background: #fff; width: 210mm; height: 296mm; margin: 0; padding: 8mm; page-break-after: always; break-after: page; break-inside: avoid; page-break-inside: avoid; overflow: hidden; font-family: 'Public Sans', Arial, sans-serif; color: #0B1F3A; }
    .cert .bd { box-sizing: border-box; height: 100%; border: 5px solid #0B1F3A; padding: 4px; }
    .cert:last-child { page-break-after: auto; break-after: auto; }
    .cert .fr { box-sizing: border-box; height: 100%; border: 1.5px solid #0B1F3A; position: relative; padding: 24px 44px 16px; display: flex; flex-direction: column; align-items: center; text-align: center; }
    .cert .fr::before { content: ''; position: absolute; top: 6px; left: 6px; right: 6px; bottom: 6px; border: 1px solid #E5B800; pointer-events: none; }
    .cert h1, .cert h3, .cert p, .cert ul { margin: 0; }
    .cert .kick { font: 700 10.5px 'Public Sans', Arial; letter-spacing: .26em; text-transform: uppercase; color: #003399; }
    .cert h1 { font: 600 40px/1.1 'Source Serif 4', Georgia, serif; margin-top: 10px; }
    .cert .nm { font: italic 500 34px 'Source Serif 4', Georgia, serif; margin-top: 20px; padding: 0 28px 5px; border-bottom: 1.5px solid #E5B800; min-width: 62%; }
    .cert .body { font-size: 14px; line-height: 1.55; margin-top: 16px; max-width: 580px; }
    .cert .lead { font-size: 13.5px; font-weight: 700; margin-top: 18px; }
    .cert .comp { width: 100%; text-align: left; }
    .cert h3 { font: 700 12px 'Public Sans', Arial; letter-spacing: .14em; text-transform: uppercase; color: #003399; margin: 13px 0 4px; display: flex; align-items: center; gap: 10px; }
    .cert h3::after { content: ''; flex: 1; height: 1px; background: #D9DEE8; }
    .cert .fr > * { flex-shrink: 0; }
    .cert ul { font-size: 13px; line-height: 1.5; padding-left: 17px; }
    .cert.es ul { font-size: 12.5px; } .cert.es .body { font-size: 13px; }
    .cert .date { margin-top: auto; padding-top: 10px; font-size: 12px; }
    .cert .signs { display: flex; justify-content: space-between; gap: 40px; width: 100%; }
    .cert .sg { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; position: relative; min-height: 92px; font-size: 10.5px; }
    .cert .sg img { height: 56px; max-width: 100%; object-fit: contain; }
    .cert .sg .line { width: 100%; border-top: 1px solid #0B1F3A; padding-top: 4px; }
    .cert .sg .stamp { position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%); height: 96px; max-width: none; opacity: .85; z-index: 0; }
    .cert .sg .boss { position: relative; z-index: 1; }
    .cert footer { width: 100%; margin-top: 12px; padding-top: 10px; border-top: 1px solid #D9DEE8; display: grid; gap: 7px; }
    /* Same header as the consent form: foundation + Blue Beehive left, EU right, navy rule under. */
    .cert .logos { width: 100%; display: flex; align-items: center; gap: 14px; border-bottom: 3px solid #0B1F3A; padding-bottom: 10px; margin-bottom: 14px; }
    .cert .logos img { height: 40px; } .cert .logos .bb { height: 32px; } .cert .logos .eu { height: 40px; margin-left: auto; }
    .cert .fund p { font-size: 9px; line-height: 1.4; color: #4A5568; }
    .cert .fund .no { font-size: 10px; color: #0B1F3A; margin-top: 2px; }`;
  document.head.append(Object.assign(document.createElement('style'), { textContent: css }));
  // Certificates print edge to edge (margin 0 also drops the browser's URL/page-number header and footer); consents pass a margin.
  const page = document.head.appendChild(document.createElement('style'));
  window.setPage = (size, margin = 0) => { page.textContent = `@page { size: ${size}; margin: ${margin}mm; } @media print { html, body { margin: 0 !important; padding: 0 !important; } }`; };
  setPage('A4 portrait');
  // Shared files (window.BOSS_FILES) win over anything an older version left in this browser.
  window.bossData = () => Object.assign({}, store('kws-boss') || {}, window.BOSS_FILES);
  const esc = (t) => String(t || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // boss = { sig, stamp } as data URLs; when missing, the line stays empty for a pen signature.
  window.certHtml = function (name, sig, boss) {
    boss = boss || {};
    const plain = (t) => L(t).replace(/^[^\p{L}]+/u, ''); // headings without leading emoji
    const groups = UI.certGroups.map((g) => `<h3>${plain(g.h)}</h3><ul>${g.li.map((x) => `<li>${L(x)}</li>`).join('')}</ul>`).join('');
    return `<div class="cert ${LANG}"><div class="bd"><div class="fr">
      <div class="logos"><img src="img/kaszebi-logo.png" alt=""><img class="bb" src="img/bluebeehive.jpg" alt=""><img class="eu" src="img/eu-pl.jpg" alt=""></div>
      <div class="kick">${L(UI.certKick)}</div>
      <h1>${L(UI.certTitle)}</h1>
      <div class="nm"${String(name || '').length > 26 ? ' style="font-size:24px"' : ''}>${esc(name)}</div>
      <p class="body">${L(UI.certBody)}</p>
      <p class="lead">${L(UI.certSkillsTitle)}</p>
      <div class="comp">${groups}</div>
      <div class="date">${L(UI.certPlace)}</div>
      <div class="signs">
        <div class="sg">${sig ? `<img src="${sig}" alt="">` : ''}<div class="line">${L(UI.certSignP)}</div></div>
        <div class="sg">${boss.stamp ? `<img class="stamp" src="${boss.stamp}" alt="">` : ''}${boss.sig ? `<img class="boss" src="${boss.sig}" alt="">` : ''}<div class="line">${L(UI.certSignBoss)}</div></div>
      </div>
      <footer>
        <div class="fund">${UI.certFund.map((t) => `<p>${L(t)}</p>`).join('')}<p class="no">${L(UI.certProjNo)}: <b>${esc(window.PROJECT_NO)}</b></p></div>
      </footer>
    </div></div></div>`;
  };
  // PDF built in the page (one image per A4 page), so phone and desktop browsers can never split a certificate over two pages.
  const lib = (src) => new Promise((ok, no) => document.head.append(Object.assign(document.createElement('script'), { src, onload: ok, onerror: no })));
  let libs;
  window.certPdf = async function (people, file) {
    libs = libs || Promise.all([lib('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'), lib('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')]);
    await libs; await document.fonts.ready;
    const box = Object.assign(document.createElement('div'), { style: 'position:fixed;left:-3000px;top:0;width:210mm;background:#fff' });
    document.body.append(box);
    const pdf = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    try {
      for (let i = 0; i < people.length; i++) {
        box.innerHTML = certHtml(people[i].name, people[i].sig, people[i].boss);
        await Promise.all([...box.querySelectorAll('img')].map((im) => im.complete ? 0 : new Promise((r) => { im.onload = im.onerror = r; })));
        const cv = await window.html2canvas(box.firstElementChild, { scale: 3, backgroundColor: '#fff', useCORS: true, logging: false });
        if (i) pdf.addPage();
        pdf.addImage(cv.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 210, 297);
      }
    } finally { box.remove(); }
    const blob = pdf.output('blob');
    const f = new File([blob], file, { type: 'application/pdf' });
    if (navigator.canShare && navigator.canShare({ files: [f] }) && /Android|iPhone|iPad/i.test(navigator.userAgent)) {
      try { await navigator.share({ files: [f] }); return; } catch (e) { if (e.name === 'AbortError') return; }
    }
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: file });
    document.body.append(a); a.click(); a.remove();
  };
})();
