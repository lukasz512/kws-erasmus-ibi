// Printable A4 certificate shared by cert.html (participant) and consent.html (organiser batch print).
(function () {
  const css = `
  .certs { display: none; }
  @media print { .certs { display: block; } }
    .cert { box-sizing: border-box; background: #fff; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; border: 8px solid #0B1F3A; outline: 2px solid #FFCC00; outline-offset: -16px; padding: 18px 36px; width: 281mm; height: 192mm; page-break-after: always; break-after: page; font-family: 'Public Sans', Arial, sans-serif; color: #0B1F3A; }
    .cert:last-child { page-break-after: auto; break-after: auto; }
    .cert .logos { display: flex; gap: 24px; align-items: center; } .cert .logos img { height: 42px; }
    .cert h1 { font: 600 30px 'Source Serif 4', Georgia, serif; margin: 0; } .cert .nm { font: 600 30px 'Source Serif 4', Georgia, serif; border-bottom: 2px solid #0B1F3A; padding: 0 30px 2px; min-width: 50%; }
    .cert p { font-size: 13px; line-height: 1.45; max-width: 920px; margin: 0; }
    .cert .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 22px; text-align: left; width: 100%; max-width: 980px; }
    .cert .grid .full { grid-column: 1 / -1; }
    .cert h3 { font-size: 14px; margin: 6px 0 3px; color: #003399; }
    .cert ul { font-size: 12.5px; line-height: 1.5; margin: 0; padding-left: 16px; }
    .cert .signs { display: flex; justify-content: space-between; width: 92%; margin-top: auto; align-items: flex-end; }
    .cert .sg { width: 30%; display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 10.5px; position: relative; }
    .cert .sg img { height: 56px; max-width: 100%; object-fit: contain; } .cert .sg .line { width: 100%; border-top: 1px solid #0B1F3A; padding-top: 3px; }
    .cert .sg .stamp { position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%); height: 96px; max-width: none; opacity: .85; z-index: 0; }
    .cert .sg .boss { position: relative; z-index: 1; }
    .cert .eu { height: 42px; } .cert .pno { font-size: 11.5px; color: #4A5568; }`;
  document.head.append(Object.assign(document.createElement('style'), { textContent: css }));
  // One @page rule at a time: consents print portrait, certificates landscape.
  const page = document.head.appendChild(document.createElement('style'));
  window.setPage = (size) => { page.textContent = `@page { size: ${size}; margin: ${size.includes('landscape') ? 8 : 12}mm; }`; };
  setPage('A4 landscape');
  const esc = (t) => String(t || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // boss = { sig, stamp } as data URLs; when missing, the line stays empty for a pen signature.
  window.certHtml = function (name, sig, boss) {
    boss = boss || {};
    const groups = UI.certGroups.map((g, i) => `<div class="${i === UI.certGroups.length - 1 ? 'full' : ''}"><h3>${L(g.h)}</h3><ul>${g.li.map((x) => `<li>${L(x)}</li>`).join('')}</ul></div>`).join('');
    return `<div class="cert">
      <div class="logos"><img src="img/kaszebi-logo.png" alt=""><img src="img/bluebeehive.jpg" alt="" style="height:30px"></div>
      <h1>${L(UI.certTitle)}</h1>
      <div class="nm">${esc(name)}</div>
      <p>${L(UI.certBody)}</p>
      ${window.PROJECT_NO ? `<p class="pno">${L(UI.certProjNo)}: <b>${esc(window.PROJECT_NO)}</b></p>` : ''}
      <p><b>${L(UI.certSkillsTitle)}</b></p>
      <div class="grid">${groups}</div>
      <div class="signs">
        <div class="sg">${sig ? `<img src="${sig}" alt="">` : ''}<div class="line">${L(UI.certSignP)}</div></div>
        <div class="sg"><img class="eu" src="img/eu-pl.jpg" alt=""><div>${L(UI.certPlace)}</div></div>
        <div class="sg">${boss.stamp ? `<img class="stamp" src="${boss.stamp}" alt="">` : ''}${boss.sig ? `<img class="boss" src="${boss.sig}" alt="">` : ''}<div class="line">${L(UI.certSignBoss)}</div></div>
      </div></div>`;
  };
})();
