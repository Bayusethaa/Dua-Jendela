/* Dua Jendela · username pemain untuk semua game live.
   Dipasang tepat setelah script PeerJS di tiap halaman game:
   <script src="nama.js"></script>
   - Membaca username dari menu (localStorage "dj-player-name").
   - Saling bertukar nama dengan pasangan begitu terhubung.
   - Mengganti tulisan "Pasanganmu" / "Kamu" di layar dengan nama masing-masing.
   - Menampilkan label nama kecil di pojok kiri bawah. */
(() => {
  const clean = s => String(s || '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 24);
  const safe = n => /^(kamu|pasanganmu|dia)$/i.test(n) ? n + '*' : n;
  const mine = () => { try { return safe(clean(localStorage.getItem('dj-player-name'))); } catch (_) { return ''; } };
  let partner = '';

  // ---------- label nama ----------
  const pill = document.createElement('div');
  pill.style.cssText = 'position:fixed;left:10px;bottom:10px;z-index:60;background:#1d2140ee;color:#f3ecdf;border:1px solid #343968;border-radius:999px;padding:6px 12px;font:700 12px Nunito,system-ui,sans-serif;pointer-events:none;max-width:calc(100vw - 20px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
  const updatePill = () => {
    const a = mine();
    pill.textContent = a ? `🙂 ${a}${partner ? ' · 💞 ' + partner : ''}` : 'Username belum diatur (atur di menu utama)';
  };
  document.addEventListener('DOMContentLoaded', () => {
    document.body.append(pill);
    updatePill();
    fix(document.body);
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
  });

  // ---------- ganti tulisan di layar ----------
  const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'NOSCRIPT']);
  function fix(node) {
    if (node.nodeType === 3) {
      const t = node.nodeValue, a = mine();
      let n = t;
      if (partner) n = n.replace(/Pasanganmu|pasanganmu/g, () => partner);
      if (a && t.trim() === 'Kamu') n = n.replace('Kamu', () => a);
      if (partner && t.trim() === 'Dia') n = n.replace('Dia', () => partner);
      if (n !== t) node.nodeValue = n;
      return;
    }
    if (node.nodeType !== 1 || SKIP.has(node.tagName) || node === pill) return;
    for (let c = node.firstChild; c; c = c.nextSibling) fix(c);
  }
  const obs = new MutationObserver(muts => {
    obs.disconnect();
    for (const m of muts) {
      if (m.type === 'characterData') fix(m.target);
      else m.addedNodes.forEach(fix);
    }
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
  });
  const setPartner = v => {
    partner = safe(clean(v));
    updatePill();
    if (document.body) { obs.disconnect(); fix(document.body); obs.observe(document.body, { childList: true, subtree: true, characterData: true }); }
  };

  // ---------- tukar nama lewat koneksi PeerJS ----------
  const P = window.Peer;
  if (!P || !P.prototype) return;
  function hook(c) {
    if (!c || c.__dj) return;
    c.__dj = true;
    const on0 = c.on.bind(c);
    c.on = function (ev, fn, ctx) {
      if (ev === 'data') {
        return on0(ev, function (d) {
          if (d && d.t === 'nm') { setPartner(d.v); return; }
          return fn.apply(this, arguments);
        }, ctx);
      }
      return on0(ev, fn, ctx);
    };
    const hello = () => { try { c.send({ t: 'nm', v: mine() }); } catch (_) {} };
    on0('open', hello);
    if (c.open) hello();
  }
  const connect0 = P.prototype.connect;
  P.prototype.connect = function () { const c = connect0.apply(this, arguments); hook(c); return c; };
  const on1 = P.prototype.on;
  P.prototype.on = function (ev, fn, ctx) {
    if (ev === 'connection') {
      return on1.call(this, ev, function (cn) { hook(cn); return fn.apply(this, arguments); }, ctx);
    }
    return on1.call(this, ev, fn, ctx);
  };
})();
