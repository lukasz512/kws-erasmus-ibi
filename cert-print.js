// Printable A4 certificate shared by cert.html (participant) and consent.html (organiser batch print).
(function () {
  const css = `
  .certs { display: none; }
  @media print { .certs { display: block; } }
    .cert { box-sizing: border-box; background: #fff; display: flex; flex-direction: column; align-items: center; text-align: center; border: 7px solid #0B1F3A; outline: 2px solid #FFCC00; outline-offset: -15px; padding: 34px 40px 26px; width: 186mm; height: 272mm; page-break-after: always; break-after: page; font-family: 'Public Sans', Arial, sans-serif; color: #0B1F3A; }
    .cert:last-child { page-break-after: auto; break-after: auto; }
    .cert .kick { font: 900 12px 'Public Sans', Arial; letter-spacing: .22em; color: #003399; margin-top: 8px; }
    .cert h1 { font: 600 38px 'Source Serif 4', Georgia, serif; margin: 6px 0 22px; }
    .cert .nm { font: 600 32px 'Source Serif 4', Georgia, serif; border-bottom: 2px solid #0B1F3A; padding: 0 24px 4px; min-width: 70%; }
    .cert p { font-size: 14px; line-height: 1.5; margin: 14px 0 0; }
    .cert .pno { font-size: 11.5px; color: #4A5568; margin-top: 6px; }
    .cert .lead { font-weight: 700; margin-top: 20px; }
    .cert .comp { text-align: left; width: 100%; margin-top: 4px; }
    .cert h3 { font-size: 14px; margin: 13px 0 4px; color: #003399; text-transform: uppercase; letter-spacing: .06em; border-bottom: 1px solid #D9D5C8; padding-bottom: 3px; }
    .cert ul { font-size: 13px; line-height: 1.6; margin: 0; padding-left: 18px; }
    .cert .date { margin-top: auto; padding-top: 14px; font-size: 12.5px; }
    .cert .signs { display: flex; justify-content: space-between; width: 100%; margin-top: 10px; align-items: flex-end; }
    .cert .sg { width: 42%; display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 11px; position: relative; min-height: 96px; justify-content: flex-end; }
    .cert .sg img { height: 60px; max-width: 100%; object-fit: contain; } .cert .sg .line { width: 100%; border-top: 1px solid #0B1F3A; padding-top: 4px; }
    .cert .sg .stamp { position: absolute; bottom: 6px; left: 50%; transform: translateX(-50%); height: 100px; max-width: none; opacity: .85; z-index: 0; }
    .cert .sg .boss { position: relative; z-index: 1; }
    .cert .logos { display: flex; justify-content: space-between; align-items: center; width: 100%; border-top: 1px solid #D9D5C8; padding-top: 12px; margin-top: 18px; }
    .cert .logos img { height: 40px; } .cert .logos .bb { height: 30px; } .cert .logos .eu { height: 44px; }`;
  document.head.append(Object.assign(document.createElement('style'), { textContent: css }));
  // Consents and certificates both print A4 portrait; setPage stays for pages that need another size.
  const page = document.head.appendChild(document.createElement('style'));
  window.setPage = (size) => { page.textContent = `@page { size: ${size}; margin: ${size.includes('landscape') ? 8 : 12}mm; }`; };
  setPage('A4 portrait');
  const esc = (t) => String(t || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // boss = { sig, stamp } as data URLs; when missing, the line stays empty for a pen signature.
  window.certHtml = function (name, sig, boss) {
    boss = boss || {};
    const plain = (t) => L(t).replace(/^[^\p{L}]+/u, ''); // headings without leading emoji
    const groups = UI.certGroups.map((g) => `<h3>${plain(g.h)}</h3><ul>${g.li.map((x) => `<li>${L(x)}</li>`).join('')}</ul>`).join('');
    return `<div class="cert">
      <div class="kick">ERASMUS+ · KA122-ADU</div>
      <h1>${L(UI.certTitle)}</h1>
      <div class="nm"${String(name || '').length > 26 ? ' style="font-size:24px"' : ''}>${esc(name)}</div>
      <p>${L(UI.certBody)}</p>
      ${window.PROJECT_NO ? `<p class="pno">${L(UI.certProjNo)}: <b>${esc(window.PROJECT_NO)}</b></p>` : ''}
      <p class="lead">${L(UI.certSkillsTitle)}</p>
      <div class="comp">${groups}</div>
      <div class="date">${L(UI.certPlace)}</div>
      <div class="signs">
        <div class="sg">${sig ? `<img src="${sig}" alt="">` : ''}<div class="line">${L(UI.certSignP)}</div></div>
        <div class="sg">${boss.stamp ? `<img class="stamp" src="${boss.stamp}" alt="">` : ''}${boss.sig ? `<img class="boss" src="${boss.sig}" alt="">` : ''}<div class="line">${L(UI.certSignBoss)}</div></div>
      </div>
      <div class="logos"><img src="img/kaszebi-logo.png" alt=""><img class="bb" src="img/bluebeehive.jpg" alt=""><img class="eu" src="img/eu-pl.jpg" alt=""></div>
    </div>`;
  };
})();
