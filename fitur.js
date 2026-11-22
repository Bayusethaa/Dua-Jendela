/* Dua Jendela · fitur tambahan untuk menu (index.html)
   Pasang SATU baris ini di index.html, tepat setelah <div id="toast" ...></div>:
   <script src="fitur.js"></script>                                              */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ls = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (_) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {} }
  };
  const today = () => new Date().toLocaleDateString('sv-SE');
  const dayAgo = n => { const d = new Date(); d.setDate(d.getDate() - n); return d.toLocaleDateString('sv-SE'); };
  let tt;
  const toast = m => {
    const t = $('#toast'); if (!t) return;
    t.textContent = m; t.classList.add('show');
    clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 3200);
  };

  // ---------- CSS ----------
  const css = document.createElement('style');
  css.textContent = `
html[data-theme=senja]{--bg:#2a1530;--bg2:#3a1f45;--bg3:#4a2a58;--glow:#ffb870;--rose:#ff7aa0;--mute:#c9a9c9}
html[data-theme=fajar]{--bg:#0f2736;--bg2:#163a50;--bg3:#1f4a66;--glow:#7fe3d0;--rose:#ff9fb8;--mute:#9fc4d4}
html[data-theme] body{background:radial-gradient(ellipse at 20% 0,var(--bg3) 0,var(--bg) 55%) fixed}
.theme{display:flex;gap:8px;align-items:center;margin:-8px 0 18px;font-size:13px;color:var(--mute)}
.theme button{width:26px;height:26px;border-radius:50%;border:2px solid transparent;cursor:pointer;padding:0}
.theme button[aria-pressed=true]{border-color:var(--ink)}
.ldr2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px}
@media(max-width:540px){.ldr2{grid-template-columns:1fr}}
.ldr2 .box h3{font-size:1.05rem;color:var(--glow)}
.ldr2 .box.rose h3{color:var(--rose)}
.ldr2 select,.ldr2 input[type=date]{width:100%;background:var(--bg);border:2px solid #343968;color:var(--ink);padding:7px 10px;border-radius:10px;font:inherit;font-size:14px}
.clk{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
.clk b{font:800 1.6rem/1 Fraunces,Georgia,serif}
.clk small{color:var(--mute);font-size:12px}
.hint{font-size:13px;color:var(--mute)}
.big2{font:800 1.9rem/1.1 Fraunces,Georgia,serif;color:var(--rose)}
.daily{background:linear-gradient(90deg,#f6c76822,#ff8fa322);border:2px solid var(--glow);border-radius:16px;padding:12px 16px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.daily small{color:var(--glow);font-weight:700;font-size:12px;letter-spacing:.04em;text-transform:uppercase}
.daily p{margin:2px 0 0;font-size:15px}
.ach{margin-top:16px}
.ach .bd{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin-top:12px}
.ach .b{background:var(--bg);border:2px solid #343968;border-radius:14px;padding:10px;font-size:13px;text-align:center;opacity:.55}
.ach .b.on{opacity:1;border-color:var(--glow);background:#f6c76818}
.ach .b i{display:block;font-style:normal;font-size:1.8rem}
.ach .b b{display:block;color:var(--ink);font-size:14px}
.ach .b span{color:var(--mute)}
.ach .sm{display:flex;gap:14px;flex-wrap:wrap;margin-top:8px;color:var(--ink);font-weight:700}
`;
  document.head.append(css);

  // ---------- kartu game baru: Ruang Kangen ----------
  const grid = $('#grid');
  const NEW = [
    ['rindu', 'rindu.html', '#ff7aa0', '💓', 'Ruang Kangen', 'Kirim peluk, cium, dan bisikan langsung ke layar pasangan. Ketuk bareng untuk sinkron!', 'Live · kapan saja'],
    ['monopoli', 'monopoli.html', '#d9282a', '🎩', 'Monopoli', 'Beli kota, tagih sewa, bangun rumah. Pilih bidak klasik: topi, mobil, anjing, dan lainnya.', 'Live · 20–40 menit']
  ];
  if (grid) {
    NEW.slice().reverse().forEach(([id, href, c, ic, title, desc, tag]) => {
      if ($(`[data-id="${id}"]`)) return;
      const d = document.createElement('div');
      d.className = 'g-item'; d.dataset.k = 'live'; d.dataset.id = id;
      d.innerHTML = `<a class="g" href="${href}" style="--c:${c}"><span class="ic">${ic}</span><div><h2>${title}</h2><p>${desc}</p><em>${tag}</em></div></a><button class="fav" aria-label="Favoritkan ${title}">🤍</button>`;
      grid.prepend(d);
    });
  }

  // ---------- tema warna ----------
  const themes = [['malam', 'Malam', '#f6c768'], ['senja', 'Senja', '#ff7aa0'], ['fajar', 'Fajar', '#7fe3d0']];
  const applyTheme = t => {
    if (t === 'malam') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.dataset.theme = t;
  };
  let theme = ls.get('dj-theme', 'malam');
  applyTheme(theme);
  const th = document.createElement('div');
  th.className = 'theme';
  th.innerHTML = 'Tema: ' + themes.map(([k, n, c]) => `<button data-t="${k}" style="background:${c}" aria-label="Tema ${n}" aria-pressed="${k === theme}"></button>`).join('');
  ($('.sub') || $('h1'))?.after(th);
  th.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    theme = b.dataset.t; ls.set('dj-theme', theme); applyTheme(theme);
    $$('button', th).forEach(x => x.setAttribute('aria-pressed', x === b));
  });

  // ---------- jam dua kota + hari bersama ----------
  const ZONES = [['Jakarta (WIB)', 'Asia/Jakarta'], ['Makassar (WITA)', 'Asia/Makassar'], ['Jayapura (WIT)', 'Asia/Jayapura'], ['Singapura', 'Asia/Singapore'], ['Kuala Lumpur', 'Asia/Kuala_Lumpur'], ['Hong Kong', 'Asia/Hong_Kong'], ['Taipei', 'Asia/Taipei'], ['Tokyo', 'Asia/Tokyo'], ['Seoul', 'Asia/Seoul'], ['Sydney', 'Australia/Sydney'], ['Melbourne', 'Australia/Melbourne'], ['Mekkah / Riyadh', 'Asia/Riyadh'], ['Dubai', 'Asia/Dubai'], ['Istanbul', 'Europe/Istanbul'], ['Amsterdam', 'Europe/Amsterdam'], ['London', 'Europe/London'], ['New York', 'America/New_York'], ['Los Angeles', 'America/Los_Angeles']];
  const ownTz = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (_) { return 'Asia/Jakarta'; } })();
  const zl = ZONES.slice();
  if (!zl.some(z => z[1] === ownTz)) zl.unshift(['Zona perangkatmu', ownTz]);
  const tzSaved = ls.get('dj-tz', { a: ownTz, b: 'Asia/Tokyo' });
  const opt = v => zl.map(z => `<option value="${z[1]}"${z[1] === v ? ' selected' : ''}>${z[0]}</option>`).join('');

  const sec = document.createElement('section');
  sec.className = 'ldr2'; sec.setAttribute('aria-label', 'Alat pasangan jarak jauh');
  sec.innerHTML = `
<div class="box"><h3>🕰️ Jam Dua Kota</h3>
 <div><select id="tz-a" aria-label="Kotamu">${opt(tzSaved.a)}</select><div class="clk"><b id="tc-a">--:--</b><small id="td-a"></small></div></div>
 <div><select id="tz-b" aria-label="Kota pasangan">${opt(tzSaved.b)}</select><div class="clk"><b id="tc-b">--:--</b><small id="td-b"></small></div></div>
 <div class="hint" id="tz-h"></div></div>
<div class="box rose"><h3>💞 Hari Bersama</h3>
 <div class="big2" id="an-v">Belum diatur</div>
 <div class="hint" id="an-n">Isi tanggal jadian untuk melihat hitungan hari dan milestone berikutnya.</div>
 <input type="date" id="an-in" aria-label="Tanggal jadian"></div>`;
  ($('.ldr') || $('.win'))?.after(sec);

  const offMin = tz => {
    const d = new Date();
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }).formatToParts(d).map(x => [x.type, x.value]));
    return Math.round((Date.UTC(+p.year, p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - d.getTime()) / 6e4);
  };
  const hourOf = tz => +new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: 'numeric', hourCycle: 'h23' }).format(new Date());
  const tickClock = () => {
    const a = $('#tz-a').value, b = $('#tz-b').value, now = new Date();
    const f = tz => now.toLocaleTimeString('id-ID', { timeZone: tz, hour: '2-digit', minute: '2-digit' }).replace('.', ':');
    const g = tz => now.toLocaleDateString('id-ID', { timeZone: tz, weekday: 'long', day: 'numeric', month: 'short' });
    $('#tc-a').textContent = f(a); $('#td-a').textContent = g(a);
    $('#tc-b').textContent = f(b); $('#td-b').textContent = g(b);
    const diff = offMin(b) - offMin(a), h = Math.abs(diff) / 60;
    const ha = hourOf(a), hb = hourOf(b);
    const ok = x => x >= 8 && x < 22, sleepy = x => x < 6 || x >= 23;
    const msg = ok(ha) && ok(hb) ? 'Jam yang enak untuk call berdua 🎧' : sleepy(ha) || sleepy(hb) ? 'Salah satu mungkin sedang tidur. Kirim pesan manis dulu 💌' : 'Masih oke untuk call singkat ☕';
    $('#tz-h').textContent = (diff === 0 ? 'Zona waktu kalian sama. ' : `Pasanganmu ${h % 1 ? h.toFixed(1) : h} jam ${diff > 0 ? 'lebih cepat' : 'lebih lambat'}. `) + msg;
  };
  ['tz-a', 'tz-b'].forEach(id => $('#' + id).addEventListener('change', () => { ls.set('dj-tz', { a: $('#tz-a').value, b: $('#tz-b').value }); tickClock(); }));
  tickClock(); setInterval(tickClock, 20000);

  const MS = [100, 200, 300, 365, 500, 730, 1000, 1095, 1460, 1500, 1825, 2000, 2555, 3000, 3650];
  const renderAn = () => {
    const s = ls.get('dj-anniv', '');
    if (!s) return;
    $('#an-in').value = s;
    const days = Math.floor((new Date().setHours(0, 0, 0, 0) - new Date(s + 'T00:00:00')) / 864e5);
    if (days < 0) { $('#an-v').textContent = `${-days} hari lagi mulai`; $('#an-n').textContent = 'Tanggalnya masih di masa depan.'; return; }
    const y = Math.floor(days / 365), m = Math.floor((days % 365) / 30);
    $('#an-v').textContent = `${days.toLocaleString('id-ID')} hari`;
    const next = MS.find(x => x > days) || (Math.floor(days / 365) + 1) * 365;
    $('#an-n').textContent = `Sekitar ${y ? y + ' tahun ' : ''}${m} bulan bersama. Menuju hari ke-${next.toLocaleString('id-ID')}: ${(next - days).toLocaleString('id-ID')} hari lagi.`;
  };
  $('#an-in').addEventListener('change', e => { ls.set('dj-anniv', e.target.value); renderAn(); toast('Tanggal jadian disimpan'); });
  renderAn();

  // ---------- pencatat main, game hari ini, lencana ----------
  const items = () => $$('.g-item', grid || document);
  const meta = it => ({ id: it.dataset.id, title: it.querySelector('h2')?.textContent.trim() || it.dataset.id, href: it.querySelector('a.g')?.getAttribute('href') || '#', k: it.dataset.k });
  const all = items().map(meta);
  const hash = s => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const daily = all.length ? all[hash(today()) % all.length] : null;

  const record = id => {
    const plays = ls.get('dj-plays', {});
    plays[id] = (plays[id] || 0) + 1; ls.set('dj-plays', plays);
    const days = ls.get('dj-days', []);
    if (!days.includes(today())) { days.push(today()); ls.set('dj-days', days.slice(-400)); }
    if (daily && id === daily.id) {
      const dd = ls.get('dj-daily', { dates: [] });
      if (!dd.dates.includes(today())) { dd.dates.push(today()); ls.set('dj-daily', dd); }
    }
  };
  grid?.addEventListener('click', e => {
    const a = e.target.closest('a.g');
    if (a) record(a.closest('.g-item').dataset.id);
    else if (e.target.closest('.fav')) setTimeout(renderAch, 0);
  }, true);

  const dailyBox = document.createElement('div');
  dailyBox.className = 'daily';
  const renderDaily = () => {
    if (!daily) return;
    const done = ls.get('dj-daily', { dates: [] }).dates.includes(today());
    dailyBox.innerHTML = `<div><small>⭐ Game Hari Ini</small><p><b>${daily.title}</b>${done ? ' · sudah kalian mainkan hari ini ✅' : ' · mainkan bareng untuk lencana Pemburu Harian'}</p></div><a class="btn-s" href="${daily.href}">${done ? 'Main lagi' : 'Main sekarang'}</a>`;
    $('a', dailyBox).addEventListener('click', () => record(daily.id));
  };
  renderDaily();
  $('.bar')?.before(dailyBox);

  const BADGES = [
    ['🎬', 'Perdana', 'Buka game pertamamu', s => s.total >= 1],
    ['🧭', 'Penjelajah', 'Coba 5 game berbeda', s => s.distinct >= 5],
    ['🎯', 'Setia', 'Buka game 15 kali', s => s.total >= 15],
    ['🔥', 'Api Unggun', 'Main 3 hari berturut-turut', s => s.streak >= 3],
    ['🌟', 'Pemburu Harian', 'Selesaikan Game Hari Ini 5 kali', s => s.dailyN >= 5],
    ['🧠', 'Kutu Buku', 'Coba Cerdas Cermat', s => (s.plays.cerdas || 0) >= 1],
    ['❤️', 'Kolektor Hati', 'Favoritkan 3 game', s => s.favs >= 3],
    ['👑', 'Tamat Menu', 'Coba semua game live', s => s.liveAll]
  ];
  const det = document.createElement('details');
  det.className = 'ach';
  ($('.idea') || $('#grid'))?.after(det);
  function renderAch(silent) {
    const plays = ls.get('dj-plays', {}), days = ls.get('dj-days', []);
    let streak = 0, i = days.includes(today()) ? 0 : 1;
    while (days.includes(dayAgo(i))) { streak++; i++; }
    const cur = items().map(meta);
    const s = {
      plays, streak,
      total: Object.values(plays).reduce((a, b) => a + b, 0),
      distinct: Object.keys(plays).filter(k => plays[k] > 0).length,
      favs: ls.get('dj-favs', []).length,
      dailyN: ls.get('dj-daily', { dates: [] }).dates.length,
      liveAll: cur.filter(x => x.k === 'live').every(x => plays[x.id] > 0)
    };
    const earned = BADGES.filter(b => b[3](s)).map(b => b[1]);
    det.innerHTML = `<summary>🏅 Lencana &amp; Streak (${earned.length}/${BADGES.length})</summary>
<div class="sm"><span>🔥 Streak: ${streak} hari</span><span>🎮 Total buka game: ${s.total}</span></div>
<div class="bd">${BADGES.map(b => `<div class="b ${earned.includes(b[1]) ? 'on' : ''}"><i>${earned.includes(b[1]) ? b[0] : '🔒'}</i><b>${b[1]}</b><span>${b[2]}</span></div>`).join('')}</div>`;
    if (silent) return;
    const known = ls.get('dj-badges', null);
    if (known) { const fresh = earned.filter(x => !known.includes(x)); if (fresh.length) toast('🏅 Lencana baru: ' + fresh.join(', ')); }
    ls.set('dj-badges', earned);
  }
  renderAch();
})();
