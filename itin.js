// Itinerario a tappe numerate, giorni in alto, barra in basso a quattro voci.
(function () {
  'use strict';

  const TRIP_DAYS = ['2026-10-30', '2026-10-31', '2026-11-01', '2026-11-02', '2026-11-03'];
  const DAY_CHIP = [['Ven', 30], ['Sab', 31], ['Dom', 1], ['Lun', 2], ['Mar', 3]];
  const COORDS = window.AMS_COORDS || {};
  const IMG = window.AMS_IMG || {};
  // Tappe e quartieri che hanno un'immagine al posto dell'icona
  const TAPPA_IMG = [['Canali Kerkstraat', 'bloemenmarkt'], ['Heineken Experience', 'heineken'], ['Van Gogh Museum', 'vangogh'], ['Moco Museum', 'moco'], ['Halloween a Rembrandtplein', 'rembrandtplein'], ["A'DAM Lookout", 'adam'], ['Waterlooplein', 'waterlooplein'], ["Brouwerij 't IJ", 'brouwerij'], ['Acostar Hotel', 'acostar'], ['Check-in e riposo', 'acostar'], ['Boerejongens', 'boerejongens'], ['Atterraggio a Schiphol', 'schiphol'], ['Bus 397', 'schiphol'], ['Albert Heijn', 'albertheijn'], ['SmokeBoat', 'smokeboat'], ['Dampkring', 'dampkring'], ['Paradox', 'paradox'], ['The Bulldog', 'bulldog+greenhouse'], ['Tha Dogg House', 'doggohouse'], ['Café Hill Street Blues', 'hillstreetblues'], ["Barney's", 'barneys+doggohouse'], ['Jazz Café Alto', 'jazzalto'], ['Tyson 2.0', 'tyson']];
  const QUARTIERE_IMG = { 'DE PIJP': 'albertcuyp', 'JORDAAN': 'jordaan', 'VONDELPARK': 'vondelpark', 'RED LIGHT DISTRICT': 'redlight', 'CENTRO STORICO': 'dam' };
  const one = (k) => '<img src="' + IMG[k].src + '" alt="" loading="lazy">';
  const imgTag = (k, cls) => (k.indexOf('+') > 0 ? k.split('+').map((x) => '<span class="sq">' + one(x) + '</span>').join('') : IMG[k] ? '<img class="' + (cls || '') + '" src="' + IMG[k].src + '" alt="" loading="lazy">' : '');
  const HOTEL_Q = 'Acostar+Hotel+Kerkstraat+45+Amsterdam';

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };
  const iso = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

  function distM(a, b) {
    const R = 6371000, rad = Math.PI / 180;
    const dLat = (b[0] - a[0]) * rad, dLon = (b[1] - a[1]) * rad;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * rad) * Math.cos(b[0] * rad) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  const qOf = (t) => { const a = $('a[href*="maps.google.com/?q="]', t); return a ? a.getAttribute('href').split('?q=')[1] : null; };
  const plain = (q) => decodeURIComponent(q.replace(/\+/g, ' '));
  const dir = (from, to, mode) => 'https://www.google.com/maps/dir/?api=1&origin=' + encodeURIComponent(plain(from)) + '&destination=' + encodeURIComponent(plain(to)) + '&travelmode=' + mode;

  const titleCase = (s) => s.replace(/[^A-Za-zÀ-ÿ' ]/g, '').trim().toLowerCase().replace(/(^|\s)(\S)/g, (m, x, y) => x + y.toUpperCase());

  // Riga di spostamento tra due luoghi consecutivi (tappe o quartieri), inserita prima di "before"
  function connector(prev, cur, toName, before, fromHotel) {
    if (!(prev && prev.q && cur.q && prev.c && cur.c)) return;
    const d = distM(prev.c, cur.c), walk = Math.max(1, Math.round((d * 1.3) / 80));
    const km = d < 1000 ? Math.round(d / 10) * 10 + ' m' : (d / 1000).toFixed(1).replace('.', ',') + ' km';
    const ferry = /ADAM\+Lookout/.test(prev.q) || /ADAM\+Lookout/.test(cur.q), foot = !ferry && walk <= 30, mv = document.createElement('div');
    const alt = !ferry && d > 500;   // oltre 500 m si propongono entrambe le opzioni: a piedi e tram o bus
    mv.className = 'mv';
    const badge = ferry ? '⛴️' : foot ? '🚶' : '🚋';
    const title = ferry ? 'Traghetto gratuito' : foot ? walk + ' min a piedi' : 'Con i mezzi';
    const sub = ferry
      ? (fromHotel ? 'Dall\'hotel a Centraal (a piedi o in tram), poi traghetto di 5 min, verso ' + toName : 'Da Amsterdam Centraal, 5 min di traversata, verso ' + toName)
      : km + (fromHotel ? ' dall\'hotel verso ' : ' verso ') + toName;
    const card = 'carta contactless quando sali e quando scendi (check-out)';
    const tip = ferry ? (fromHotel ? '<em class="mv-tip">Se prendi il tram: ' + card + '. Il traghetto è gratuito</em>' : '')
      : foot ? (alt ? '<em class="mv-tip">Oppure tram o bus: ' + card + '</em>' : '')
      : '<em class="mv-tip">' + card.charAt(0).toUpperCase() + card.slice(1) + '</em>';
    const link = (mode, text, cls) => '<a class="' + (cls || '') + '" href="' + dir(prev.q, cur.q, mode) + '" target="_blank">' + text + '</a>';
    const btns = alt
      ? (foot ? link('walking', '🚶 A piedi') + link('transit', '🚋 Tram o bus', 'alt') : link('transit', '🚋 Tram o bus') + link('walking', '🚶 A piedi', 'alt'))
      : link(ferry ? 'transit' : 'walking', 'Indicazioni');
    mv.innerHTML = '<div class="st-rail"><div class="mv-badge ' + (foot ? 'foot' : 'ride') + '">' + badge + '</div></div>' +
      '<div class="mv-t' + (alt ? ' two' : '') + '"><div class="mv-main"><b>' + title + '</b><span>' + sub + '</span>' + tip + '</div><div class="mv-btns">' + btns + '</div></div>';
    before.parentNode.insertBefore(mv, before);
  }

  // ── Tappe ──
  const done = new Set(store.get('ams-fatto', []));
  const saveDone = () => store.set('ams-fatto', Array.from(done));

  $$('.screen').slice(0, 5).forEach((scr, di) => {
    const tappe = $$('.tappa', scr);
    let prev = null;
    const seq = $$('.tappa, .quartiere', scr);
    // ogni giorno (tranne l'arrivo) si parte dall'hotel
    if (di > 0 && seq.length) {
      const first = seq[0], fq = qOf(first), fc = fq && COORDS[fq] ? fq : null;
      const hotel = { q: HOTEL_Q, c: COORDS[HOTEL_Q] };
      const fname = first.classList.contains('quartiere') ? titleCase($('.quartiere-title', first).textContent) : $('.tappa-name', first).textContent.split(' – ')[0].trim();
      if (fc) connector(hotel, { q: fq, c: COORDS[fq] }, fname, first, true);
    }
    seq.forEach((t) => {
      if (t.classList.contains('quartiere')) {
        const q0 = qOf(t), c0 = q0 && COORDS[q0] ? COORDS[q0] : null;
        const em = $('.quartiere-emoji', t), tt = $('.quartiere-title', t).textContent.replace(/[^A-Za-z ]/g, '').trim(), ik = QUARTIERE_IMG[tt];
        if (em && ik && IMG[ik]) em.innerHTML = imgTag(ik);
        connector(prev, { q: q0, c: c0 }, titleCase($('.quartiere-title', t).textContent), t);
        if (q0 && c0) prev = { q: q0, c: c0 };
        return;
      }
      const i = tappe.indexOf(t);
      const n = i + 1, key = 'd' + di + '-' + n;
      const timeEl = $('.tappa-time', t), time = timeEl ? timeEl.textContent.trim() : '';
      const icon = $('.tappa-icon', t);
      const tag = $('.tappa-tag', t), name = $('.tappa-name', t), desc = $('.tappa-desc', t), maps = $('.maps-row', t);
      const q = qOf(t), c = q && COORDS[q] ? COORDS[q] : null;

      // spostamento dalla tappa o dal quartiere precedente
      connector(prev, { q, c }, $('.tappa-name', t).textContent.split(' – ')[0].trim(), t);
      if (q && c) prev = { q, c };

      const nomeT = name ? name.textContent.trim() : '', hit = TAPPA_IMG.find((x) => nomeT.indexOf(x[0]) === 0), pic = hit ? imgTag(hit[1]) : '';
      const timeOk = time && time !== '-';
      t.classList.add('st');
      if (i === tappe.length - 1) t.classList.add('last');
      if (done.has(key)) t.classList.add('done');
      t.innerHTML =
        '<div class="st-rail"><div class="st-pin">' + n + '</div></div>' +
        '<div class="st-card"><div class="st-top">' + (timeOk ? '<span class="st-time">' + time + '</span>' : '') +
        '<span class="st-tag"></span><label class="st-done"><input type="checkbox"' + (done.has(key) ? ' checked' : '') + '> Fatto</label></div>' +
        '<div class="st-main"><div class="st-text"></div><div class="st-ic ' + (icon ? icon.className.replace('tappa-icon', '').trim() : 'ic-default') + (pic ? ' has-img' + (pic.indexOf('class="sq"') > 0 ? ' dual' : '') : '') + '">' + (pic || (icon ? icon.textContent : '')) + '</div></div></div>';
      if (tag) $('.st-tag', t).replaceWith(tag); else $('.st-tag', t).remove();
      const text = $('.st-text', t);
      text.appendChild(name); text.appendChild(desc);
      desc.classList.add('clamp');
      if (tag && tag.classList.contains('tag-book')) {
        const row = maps || Object.assign(document.createElement('div'), { className: 'maps-row' });
        const tk = document.createElement('a');
        tk.className = 'btn-m btn-yellow'; tk.href = '#'; tk.textContent = 'Biglietto';
        tk.addEventListener('click', (e) => { e.preventDefault(); if (window.AMS_openTickets) window.AMS_openTickets(nomeT, () => go('doc')); else go('doc'); });
        row.appendChild(tk);
        $('.st-card', t).appendChild(row);
      } else if (maps) $('.st-card', t).appendChild(maps);

      // "Mostra tutto" solo se il testo supera le due righe
      const more = document.createElement('button');
      more.className = 'st-more'; more.textContent = 'Mostra tutto'; more.hidden = true;
      text.appendChild(more);
      more.addEventListener('click', () => {
        const open = desc.classList.toggle('clamp');
        more.textContent = open ? 'Mostra tutto' : 'Mostra meno';
      });
      $('input', t).addEventListener('change', (e) => {
        t.classList.toggle('done', e.target.checked);
        if (e.target.checked) done.add(key); else done.delete(key);
        saveDone();
      });
      t._more = more; t._desc = desc;
    });

    // a fine giornata si rientra in hotel (non nel giorno della partenza)
    const lastT = tappe[tappe.length - 1], lastName = lastT ? ($('.tappa-name', lastT) || {}).textContent || '' : '';
    if (di <= 3 && lastT && prev && !/^(Acostar|Check-in)/.test(lastName.trim())) {
      const end = document.createElement('div');
      end.className = 'tappa st last';
      end.innerHTML = '<div class="st-rail"><div class="st-pin">🏨</div></div>' +
        '<div class="st-card"><div class="st-main"><div class="st-text"><div class="tappa-name">Rientro in hotel</div>' +
        '<div class="tappa-desc">Acostar Hotel, Kerkstraat 45</div></div>' + (IMG.acostar ? '<div class="st-ic has-img">' + imgTag('acostar') + '</div>' : '') + '</div>' +
        '<div class="maps-row"><a class="btn-m btn-dark" href="https://maps.google.com/?q=' + HOTEL_Q + '" target="_blank">📍 Hotel</a></div></div>';
      lastT.classList.remove('last');
      lastT.parentNode.insertBefore(end, lastT.nextSibling);
      connector(prev, { q: HOTEL_Q, c: COORDS[HOTEL_Q] }, 'l\'hotel', end);
    }

    // prenotazioni del giorno in cima
    const booked = tappe.filter((t) => $('.tag-book', t));
    if (booked.length) {
      const box = document.createElement('div');
      box.className = 'rs-list';
      box.innerHTML = booked.map((t) => {
        const tm = $('.st-time', t), nm = $('.tappa-name', t).textContent.trim();
        const tg = $('.tag-book', t).textContent.replace('🔖', '').replace(/^\s*Prenotato\s*·?\s*/, '').trim();
        return '<div class="rs"><span class="rs-ic">🎟️</span><div class="rs-t">' + nm + '<small>' + (tg || (tm ? tm.textContent : 'orario nell\'itinerario')) + '</small></div><em>Prenotato</em></div>';
      }).join('');
      $('.day-hero', scr).after(box);
    }
  });

  function measureClamps() {
    $$('.tappa.st').forEach((t) => {
      if (!t._desc || !t.offsetParent) return;
      t._more.hidden = !(t._desc.classList.contains('clamp') && t._desc.scrollHeight > t._desc.clientHeight + 2);
    });
  }

  // ── Intestazione e barra dei giorni ──
  const XXX = '<svg class="xxx" viewBox="0 0 52 14" aria-hidden="true"><g stroke="#000" stroke-width="3.4"><path d="M1.5 1.5 12.5 12.5M12.5 1.5 1.5 12.5"/><path d="M19.5 1.5 30.5 12.5M30.5 1.5 19.5 12.5" transform="translate(-1 0)"/><path d="M37.5 1.5 48.5 12.5M48.5 1.5 37.5 12.5" transform="translate(-1 0)"/></g></svg>';
  const header = $('.app-header');
  const todayIso = iso(new Date());
  const todayIdx = TRIP_DAYS.indexOf(todayIso);
  header.innerHTML =
    '<div class="app-header-inner"><div><div class="app-title">AMSTERDAM'+ XXX +'</div><div class="app-dates">30 ottobre - 3 novembre 2026</div></div><div class="header-count" id="hc"></div></div>' +
    '<div class="day-chips" id="chips">' + DAY_CHIP.map((d, i) => '<button class="chip-day' + (i === todayIdx ? ' today' : '') + '" data-day="' + i + '">' + d[0] + '<span>' + d[1] + '</span></button>').join('') + '</div>';

  function headerCount() {
    const now = new Date(), start = new Date('2026-10-30T00:00:00'), end = new Date('2026-11-03T23:59:59');
    if (now < start) { const d = Math.ceil((start - now) / 864e5); return 'Mancano <b>' + d + '</b> ' + (d === 1 ? 'giorno' : 'giorni'); }
    if (now > end) return 'Viaggio concluso';
    let out = 'Giorno <b>' + (todayIdx + 1) + ' di 5</b>';
    const hm = now.getHours() * 60 + now.getMinutes();
    const next = $$('.tappa.st', $('#s' + todayIdx)).map((t) => {
      const m = ($('.st-time', t) || {}).textContent || '', r = /^~?(\d{1,2}):(\d{2})/.exec(m);
      return r ? { min: +r[1] * 60 + +r[2], name: $('.tappa-name', t).textContent.trim() } : null;
    }).filter(Boolean).find((x) => x.min > hm);
    if (next) out += '<br>Poi <b>' + String(Math.floor(next.min / 60)).padStart(2, '0') + ':' + String(next.min % 60).padStart(2, '0') + '</b> ' + next.name.slice(0, 22);
    return out;
  }
  $('#hc').innerHTML = headerCount();

  // ── Schermata Altro e rientri ──
  const altro = document.createElement('div');
  altro.className = 'screen hidden'; altro.id = 's7';
  altro.innerHTML = '<div class="page-title">Altro</div>' +
    [['doc', '📎', 'Documenti', 'Biglietti, QR, passaporto'], ['nav', '🧭', 'Percorsi', 'Come arrivare a una tappa'],
     ['safe', '🛡️', 'Sicurezza', 'Consigli e numeri utili'], ['info', '📋', 'Info e prenotazioni', 'Trasporti, coffee shop, prenotazioni'], ['crediti', '🖼️', 'Crediti foto e loghi', 'Autori, licenze e fonti']]
      .map((r) => '<button class="menu-row" data-go="' + r[0] + '"><span class="menu-ic">' + r[1] + '</span><span>' + r[2] + '<small>' + r[3] + '</small></span><span class="menu-go">›</span></button>').join('');
  $('#s6').before(altro);
  const cred = document.createElement('div');
  cred.className = 'screen hidden'; cred.id = 's8';
  const esc = (x) => String(x || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  cred.innerHTML = '<div class="page-title">Crediti</div><p class="t-note" style="margin-bottom:12px">Le miniature dei luoghi vengono da Wikimedia Commons (con licenza libera, citata qui sotto) o da siti esterni. Loghi e immagini di terzi restano dei rispettivi titolari e servono solo a riconoscere il luogo.</p>' +
    Object.keys(IMG).map((k) => { const m = IMG[k]; const host = (m.fonte.match(/^https?:\/\/([^/]+)/) || [])[1] || '';
      return '<div class="cr"><img src="' + m.src + '" alt=""><div><b>' + esc(m.luogo) + '</b><br><span>' + (m.autore ? 'Foto: ' + esc(m.autore) + ' · ' : '') + esc(m.licenza) + '</span><br><a href="' + esc(m.fonte) + '" target="_blank">' + esc(host) + '</a></div></div>'; }).join('');
  $('#s6').before(cred);
  [$('#s5'), $('#s6'), cred].forEach((s) => {
    const b = document.createElement('button');
    b.className = 'back-link'; b.textContent = '‹ Altro';
    b.addEventListener('click', () => go('altro'));
    s.prepend(b); s._back = b;
  });
  $$('.menu-row', altro).forEach((b) => b.addEventListener('click', () => go(b.dataset.go)));

  // ── Navigazione ──
  const ICONS = {
    it: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
    ne: '<svg viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    sp: '<svg viewBox="0 0 24 24"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8M12 17.5v-11"/></svg>',
    al: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/></svg>',
  };
  const nav = $('.bottom-nav');
  nav.innerHTML = [['day', ICONS.it, 'Itinerario'], ['near', ICONS.ne, 'Vicino'], ['spese', ICONS.sp, 'Spese'], ['altro', ICONS.al, 'Altro']]
    .map((r) => '<button class="nav-btn" data-v="' + r[0] + '"><span class="nav-icon">' + r[1] + '</span><span class="nav-label">' + r[2] + '</span></button>').join('');

  let lastDay = todayIdx >= 0 ? todayIdx : 0;
  const TOOLS = ['near', 'spese', 'doc', 'nav', 'safe'];

  function show(id) {
    $$('.screen').forEach((s) => { const on = s.id === id; s.classList.toggle('active', on); s.classList.toggle('hidden', !on); });
  }
  function go(view, quiet) {
    let screen, navKey, day = null;
    if (typeof view === 'number') { day = view; view = 'day'; }
    if (view === 'day') { day = day == null ? lastDay : day; lastDay = day; screen = 's' + day; navKey = 'day'; }
    else if (view === 'altro') { screen = 's7'; navKey = 'altro'; }
    else if (view === 'crediti') { screen = 's8'; navKey = 'altro'; }
    else if (view === 'info') { screen = 's5'; navKey = 'altro'; }
    else if (TOOLS.includes(view)) { screen = 's6'; navKey = view === 'near' || view === 'spese' ? view : 'altro'; }
    else return;
    show(screen);
    $$('.nav-btn').forEach((b) => b.classList.toggle('active', b.dataset.v === navKey));
    $('#chips').classList.toggle('show', view === 'day');
    $$('.chip-day').forEach((b) => b.classList.toggle('on', view === 'day' && +b.dataset.day === day));
    if (view === 'day') { const on = $('.chip-day.on'); if (on) on.scrollIntoView({ inline: 'center', block: 'nearest' }); }
    if (TOOLS.includes(view)) {
      const tab = $('.tool-tab[data-tool="' + view + '"]');
      if (tab) tab.click();
      $('#s6')._back.classList.toggle('show', !(view === 'near' || view === 'spese'));
    }
    $('#s5')._back.classList.add('show');
    store.set('ams-view', view === 'day' ? day : view);
    window.scrollTo({ top: 0, behavior: quiet ? 'auto' : 'smooth' });
    setTimeout(measureClamps, 50);
  }
  window.go = go;
  // compatibilità con il vecchio nome
  window.showScreen = function (i, smooth) { go(i <= 4 ? i : i === 5 ? 'info' : 'near', smooth === false); };

  $$('.nav-btn').forEach((b) => b.addEventListener('click', () => go(b.dataset.v === 'day' ? lastDay : b.dataset.v)));
  $$('.chip-day').forEach((b) => b.addEventListener('click', () => go(+b.dataset.day)));

  // apertura: durante il viaggio il giorno corrente, altrimenti l'ultima schermata vista
  setTimeout(() => {
    let v = todayIdx >= 0 ? todayIdx : store.get('ams-view', 0);
    if (!(typeof v === 'number' || ['altro', 'info', ...TOOLS].includes(v))) v = 0;
    if (typeof v === 'number' && !(v >= 0 && v <= 4)) v = 0;
    go(v, true);
  }, 0);
  window.addEventListener('resize', measureClamps);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureClamps);
})();
