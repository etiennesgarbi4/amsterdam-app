// Scheda Strumenti: vicino a me, spese condivise, documenti, navigatore, sicurezza.
(function () {
  'use strict';

  // Indirizzo del Firebase Realtime Database delle spese (es. https://nome-default-rtdb.firebaseio.com). Vuoto = spese solo su questo telefono.
  const SYNC_URL = 'https://amsterdam-spese-default-rtdb.europe-west1.firebasedatabase.app';

  const DEFAULT_PEOPLE = 'Etienne, Fabiana, Checca, Irene';
  const DEFAULT_TRIP = 'ams-098ca9ac';
  const ADMIN = 'Etienne';   // solo chi sceglie questo nome vede il pulsante per eliminare le spese

  const HOTEL = { name: 'Acostar Hotel', lat: 52.3653, lon: 4.8858, q: 'Acostar Hotel Kerkstraat 45 Amsterdam' };

  const FAMOUS = [
    { n: 'Rijksmuseum', ic: '🖼️', lat: 52.3598, lon: 4.8850, t: 'Museo, Rembrandt e Vermeer', d: 'Il museo nazionale dei Paesi Bassi, con La ronda di notte di Rembrandt e La lattaia di Vermeer. Raccoglie i capolavori del Secolo d\'oro olandese.', c: 'circa €25, biglietto online a orario fisso; gratis sotto i 18 anni.' },
    { n: 'Van Gogh Museum', ic: '🌻', lat: 52.3584, lon: 4.8811, t: 'Museo', d: 'La più grande collezione al mondo di opere di Van Gogh, dai Mangiatori di patate ai Girasoli, con le sue lettere e i quadri degli amici.', c: '€25. Nel tuo itinerario hai già lo slot di sabato alle 10:00.' },
    { n: 'Moco Museum', ic: '🎨', lat: 52.3587, lon: 4.8820, t: 'Museo, Banksy e arte moderna', d: 'Piccolo museo di arte moderna e contemporanea. Ci sono Banksy, Warhol, Basquiat e Kusama, e si visita in circa un\'ora e mezza.', c: 'circa €18-23 a seconda del giorno e dell\'orario. Hai già lo slot di sabato alle 13:30.' },
    { n: 'Stedelijk Museum', ic: '🖼️', lat: 52.3579, lon: 4.8799, t: 'Arte moderna', d: 'Il museo di arte moderna e design della città, con opere di Mondrian, Kandinsky e Warhol. L\'ala nuova ha la forma di una grande vasca da bagno.', c: '€22,50 per gli adulti; gratis sotto i 19 anni, ma serve comunque il biglietto.' },
    { n: 'Casa di Anna Frank', ic: '🏠', lat: 52.3752, lon: 4.8841, t: 'Museo, serve prenotazione', d: 'Il nascondiglio dove la famiglia Frank visse per più di due anni durante l\'occupazione nazista e dove Anna scrisse il diario. Si visita in silenzio, in circa un\'ora.', c: 'circa €16,50, solo online: i biglietti finiscono con settimane di anticipo.' },
    { n: 'Dam e Palazzo Reale', ic: '🏛️', lat: 52.3731, lon: 4.8913, t: 'Piazza principale', d: 'La piazza centrale della città, con il Palazzo Reale e il Monumento Nazionale. È il punto di partenza naturale per girare il centro.', c: 'Piazza gratuita; il Palazzo Reale si visita a pagamento quando è aperto.' },
    { n: 'Vondelpark', ic: '🌳', lat: 52.3572, lon: 4.8641, t: 'Parco', d: 'Il parco più grande della città, ideale per una pausa a piedi o in bici. Al centro c\'è il Blauwe Theehuis, un padiglione rotondo con bar.', c: 'Gratuito.' },
    { n: 'Bloemenmarkt', ic: '🌷', lat: 52.3669, lon: 4.8908, t: 'Mercato dei fiori', d: 'L\'unico mercato dei fiori galleggiante al mondo, con bancarelle su chiatte lungo il Singel. Si trovano bulbi di tulipano e souvenir.', c: 'Ingresso libero: paghi solo quello che compri.' },
    { n: 'Begijnhof', ic: '⛪', lat: 52.3694, lon: 4.8900, t: 'Cortile storico nascosto', d: 'Un cortile del Seicento nascosto dietro un portone in pieno centro. Silenzio assoluto, casette medievali e una piccola chiesa.', c: 'Gratuito. Entra senza fare rumore: ci vivono delle persone.' },
    { n: 'De 9 Straatjes', ic: '🛍️', lat: 52.3689, lon: 4.8850, t: 'Negozi e caffè', d: 'Nove vie trasversali tra i canali con negozi indipendenti, vintage e caffè. Si gira bene a piedi, senza una meta.', c: 'Gratuito: paghi solo se compri.' },
    { n: 'Westerkerk e Jordaan', ic: '⛪', lat: 52.3745, lon: 4.8840, t: 'Quartiere e chiesa', d: 'La chiesa con la torre più alta della città, accanto alla Casa di Anna Frank. Intorno c\'è il Jordaan, con canali stretti, botteghe e cortili.', c: 'Passeggiata gratuita. La salita alla torre di solito è a pagamento e stagionale: verifica sul posto.' },
    { n: 'Leidseplein', ic: '🎭', lat: 52.3640, lon: 4.8828, t: 'Piazza, locali e teatri', d: 'Piazza animata con teatri, locali e ristoranti. Ci passano i tram e la sera è piena di gente.', c: 'Gratuito.' },
    { n: 'Rembrandtplein', ic: '🍻', lat: 52.3660, lon: 4.8966, t: 'Piazza, locali', d: 'Piazza con terrazze e locali, e con le sculture in bronzo de La ronda di notte. È uno dei centri della vita serale.', c: 'Gratuito.' },
    { n: 'Heineken Experience', ic: '🍺', lat: 52.3578, lon: 4.8918, t: 'Visita alla fabbrica', d: 'L\'ex birrificio, con un percorso interattivo sulla storia e la produzione della birra che finisce con la degustazione. Dura circa un\'ora e mezza.', c: '€23, con due birre incluse. Venerdì 30 hai già lo slot alle 16:30.' },
    { n: 'Albert Cuyp Market', ic: '🧇', lat: 52.3552, lon: 4.8918, t: 'Mercato di strada', d: 'Il mercato di strada più grande d\'Olanda, nel quartiere De Pijp. Si mangia camminando: stroopwafel, aringa, formaggi, patatine.', c: 'Ingresso libero: paghi solo quello che mangi o compri. Chiuso la domenica.' },
    { n: 'Magere Brug', ic: '🌉', lat: 52.3636, lon: 4.9024, t: 'Ponte sull\'Amstel', d: 'Il ponte levatoio di legno sull\'Amstel, il più famoso della città. La sera è illuminato da centinaia di lampadine.', c: 'Gratuito.' },
    { n: 'Hortus Botanicus', ic: '🌿', lat: 52.3668, lon: 4.9078, t: 'Orto botanico', d: 'Uno dei più antichi orti botanici del mondo, fondato nel 1638. Ha una serra tropicale e piante da tutto il pianeta.', c: 'circa €14-15; si paga solo con carta.' },
    { n: 'Rembrandthuis', ic: '🖌️', lat: 52.3694, lon: 4.9013, t: 'Casa museo', d: 'La casa dove Rembrandt visse e lavorò per circa vent\'anni. È arredata come ai suoi tempi, con dimostrazioni di incisione.', c: 'circa €19,50, con prenotazione a orario (prezzo da confermare).' },
    { n: 'Nieuwmarkt', ic: '🏰', lat: 52.3726, lon: 4.9003, t: 'Piazza con la Waag', d: 'Piazza con la Waag, un edificio del 1488 che era una porta delle mura. Oggi ci sono caffè e, in certi giorni, un mercato.', c: 'Gratuito.' },
    { n: 'Oude Kerk', ic: '⛪', lat: 52.3744, lon: 4.8981, t: 'Chiesa più antica', d: 'La chiesa più antica della città, fondata nel 1213 e consacrata nel 1306, in mezzo al quartiere a luci rosse. Dentro ci sono vetrate, la tomba di Saskia (moglie di Rembrandt) e mostre d\'arte.', c: 'circa €14-14,50; con la torre circa €22 (la torre si visita da aprile a ottobre).' },
    { n: 'De Wallen', ic: '🚦', lat: 52.3734, lon: 4.8983, t: 'Quartiere a Luci Rosse', d: 'Il centro più antico della città e il quartiere a luci rosse, con vicoli, canali e coffee shop. Di giorno è tranquillo, la sera molto affollato.', c: 'Gratuito. Vietato fotografare le vetrine.' },
    { n: 'Amsterdam Centraal', ic: '🚉', lat: 52.3789, lon: 4.9006, t: 'Stazione e traghetti per il Nord', d: 'La stazione principale, in mattoni neogotici. Da qui partono i treni per Schiphol e i traghetti gratuiti per Amsterdam Nord.', c: 'Stazione e traghetto gratuiti; il treno si paga a parte.' },
    { n: 'NEMO Science Museum', ic: '🔬', lat: 52.3739, lon: 4.9121, t: 'Museo, terrazza panoramica', d: 'Museo della scienza con esperimenti da toccare, in un edificio a forma di nave. Sul tetto c\'è una grande terrazza con vista sul porto.', c: 'circa €21,50; la terrazza sul tetto dovrebbe essere gratuita (da verificare).' },
    { n: "A'DAM Lookout", ic: '🎡', lat: 52.3838, lon: 4.9021, t: 'Panorama e altalena', d: 'La torre con la vista a 360° sulla città, ad Amsterdam Nord, raggiungibile con il traghetto gratuito. C\'è anche l\'altalena Over The Edge a 100 metri.', c: 'Il tuo biglietto è già preso: €28 con drink e VR Rollercoaster. L\'altalena costa extra.' },
  ];

  // Luoghi con miniatura (stesse chiavi di AMS_IMG)
  // curiosità e luoghi insoliti scelti a mano: le descrizioni vengono da fonti citate sul sito e da verifiche del 22/10/2026
  const CURIOSITA = [{"n": "De Poezenboot", "ic": "🐈", "lat": 52.37813, "lon": 4.89311, "t": "Il rifugio dei gatti sull'acqua", "d": "Rifugio per gatti randagi su una casa galleggiante del canale Singel, attivo da decenni. Si entra a guardare e accarezzare i gatti, ma i posti sono pochi alla volta e gli orari sono limitati, di solito nel primo pomeriggio e solo in alcuni giorni. Le fonti non concordano sugli orari: controlla prima di andare.", "c": "ingresso gratuito, offerta libera", "addr": "Singel 38G"}, {"n": "Tom e Jerry (street art)", "ic": "🐭", "lat": 52.37745, "lon": 4.89299, "t": "Murale di Tom e Jerry", "d": "Piccola opera di street art dell'artista Frankey in Koggestraat, con Tom e Jerry dipinti sul muro. Il sito che la censisce dice che dovrebbe esserci ancora, ma l'ultima foto è su Instagram: non c'è una data certa, quindi potrebbe essere cambiata. Frankey ha dipinto molte altre opere nel centro, per esempio in Langestraat e in Oudebrugsteeg.", "c": "gratuito, si vede dalla strada", "addr": "Koggestraat"}, {"n": "Het Muizenhuis", "ic": "🏠", "lat": 52.36719, "lon": 4.8927, "t": "Casette in miniatura per topi", "d": "Piccolo museo in miniatura, ispirato a un libro per bambini olandese sui topi: casette arredate in scala minuscola. Non c'entra con Tom e Jerry, ma resta a tema topi.", "addr": "Muntplein 8"}, {"n": "Huis met de Kabouters", "ic": "🍄", "lat": 52.35594, "lon": 4.90419, "t": "La casa con gli gnomi", "d": "Edificio del 1884 con due statue di gnomi (kabouters) sulla facciata, monumento nazionale dal 1984. Si trova a De Pijp, vicino al mercato di Albert Cuyp: si vede dall'esterno.", "c": "gratuito, si vede dalla strada", "addr": "Ceintuurbaan 251-255"}, {"n": "La casa più piccola di Amsterdam", "ic": "🚪", "lat": 52.37123, "lon": 4.89767, "t": "Circa 2 metri di larghezza", "d": "Una casa larga poco più di due metri e profonda cinque, in Oude Hoogstraat, considerata la più piccola della città. Si vede solo dall'esterno.", "c": "gratuito, si vede dalla strada", "addr": "Oude Hoogstraat 22"}, {"n": "Singel 7, la casa stretta", "ic": "📏", "lat": 52.37823, "lon": 4.89384, "t": "Spesso detta la più stretta del mondo", "d": "Casa famosa per essere strettissima sul retro e per questo citata spesso tra le più strette di Amsterdam. È privata, si fotografa solo da fuori. Le fonti non sono d'accordo su quale sia la più stretta, quindi la fama è soprattutto turistica.", "c": "gratuito, si vede dalla strada", "addr": "Singel 7"}, {"n": "Tuschinski", "ic": "🎬", "lat": 52.36651, "lon": 4.89471, "t": "Cinema art déco del 1921", "d": "Uno dei cinema più belli d'Europa, con facciata e sale decorate in stile art déco e Scuola di Amsterdam. Il modo migliore per vederlo dentro è comprare un biglietto per un film.", "addr": "Reguliersbreestraat 26"}, {"n": "Cannabis College", "ic": "🌿", "lat": 52.37221, "lon": 4.89739, "t": "Centro informativo sulla cannabis", "d": "Centro no profit con informazioni sulla cannabis, aperto a tutti, anche a chi non la usa. In cantina c'è un piccolo giardino visitabile con un'offerta. Gli orari variano a seconda della fonte, di solito dalla tarda mattina al tardo pomeriggio: controlla.", "c": "ingresso gratuito", "addr": "Oudezijds Achterburgwal 124"}, {"n": "Torensluis", "ic": "🌉", "lat": 52.37463, "lon": 4.88948, "t": "Ponte con la statua di Multatuli", "d": "Uno dei ponti più larghi della città, sul canale Singel, con la statua dello scrittore Multatuli. In passato sotto il ponte c'era una piccola prigione.", "c": "gratuito", "addr": "Singel"}];
  const FAMOUS_IMG = { 'Van Gogh Museum': 'vangogh', 'Moco Museum': 'moco', 'Heineken Experience': 'heineken', "A'DAM Lookout": 'adam', 'Rembrandtplein': 'rembrandtplein', 'Vondelpark': 'vondelpark', 'Bloemenmarkt': 'bloemenmarkt', 'Dam e Palazzo Reale': 'dam', 'Begijnhof': 'begijnhof', 'Magere Brug': 'magerebrug', 'Oude Kerk': 'oudekerk', 'Albert Cuyp Market': 'albertcuyp', 'Amsterdam Centraal': 'centraal', 'De Wallen': 'redlight', 'Westerkerk e Jordaan': 'jordaan' };
  const DAY_SHORT = ['Ven 30 ott', 'Sab 31 ott', 'Dom 1 nov', 'Lun 2 nov', 'Mar 3 nov'];
  const DAY_MINI = ['Ven 30', 'Sab 31', 'Dom 1', 'Lun 2', 'Mar 3'];
  const WHEN = {
    'Bloemenmarkt': [0], 'Heineken Experience': [0], 'Albert Cuyp Market': [0], 'Leidseplein': [0, 4],
    'Van Gogh Museum': [1], 'Moco Museum': [1], 'Rembrandtplein': [1],
    'Vondelpark': [2], 'De 9 Straatjes': [2], 'Westerkerk e Jordaan': [2], 'De Wallen': [2], 'Oude Kerk': [2],
    'Dam e Palazzo Reale': [3], 'Begijnhof': [3], 'Magere Brug': [3], "A'DAM Lookout": [3],
    'Amsterdam Centraal': [1, 3], 'Nieuwmarkt': [4],
  };

  const CATS = {
    cibo:   { l: '🍽️ Mangiare',   r: 600,  f: ['[amenity~"^(restaurant|fast_food|cafe)$"]'], ic: '🍽️' },
    bar:    { l: '🍺 Bar',        r: 600,  f: ['[amenity~"^(bar|pub)$"]'], ic: '🍺' },
    farm:   { l: '💊 Farmacie',   r: 600,  f: ['[amenity=pharmacy]'], ic: '💊' },
    atm:    { l: '🏧 Bancomat',   r: 600,  f: ['[amenity=atm]'], ic: '🏧' },
    stop:   { l: '🚋 Fermate',    r: 600,  f: ['[railway=tram_stop]', '[highway=bus_stop]', '[railway=station]'], ic: '🚋' },
    wc:     { l: '🚻 Bagni',      r: 600,  f: ['[amenity=toilets]'], ic: '🚻' },
    spesa:  { l: '🛒 Supermercati', r: 600, f: ['[shop=supermarket]'], ic: '🛒' },
    visita: { l: '📸 Altri luoghi', r: 1000, f: ['[tourism~"^(attraction|museum|viewpoint|gallery)$"]'], ic: '📸' },
  };

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };
  const eur = (c) => (c / 100).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });
  const mapsPlace = (lat, lon, name) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(name ? name + ' ' : '') + lat + ',' + lon;

  function distM(a, b) {
    const R = 6371000, rad = Math.PI / 180;
    const dLat = (b.lat - a.lat) * rad, dLon = (b.lon - a.lon) * rad;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function fmtDist(m) {
    const walk = Math.max(1, Math.round((m * 1.25) / 80));
    const d = m < 1000 ? Math.round(m / 10) * 10 + ' m' : m < 20000 ? (m / 1000).toFixed(1).replace('.', ',') + ' km' : Math.round(m / 1000) + ' km';
    return d + (walk <= 60 ? '<br>' + walk + ' min a piedi' : '');
  }

  // ── Schede ──
  $$('.tool-tab').forEach((b) => b.addEventListener('click', () => {
    $$('.tool-tab').forEach((x) => x.classList.toggle('active', x === b));
    $$('.tool').forEach((t) => t.classList.toggle('active', t.id === 'tool-' + b.dataset.tool));
    if (b.dataset.tool === 'spese') { renderSpese(); syncSpese(); }
  }));

  // ── Vicino a me ──
  let pos = null;
  let nearCat = 'famosi';
  let nearToken = 0;

  function renderChips() {
    const box = $('#near-chips');
    box.innerHTML = '<button class="chip' + (nearCat === 'famosi' ? ' active' : '') + '" data-c="famosi">⭐ Più famosi</button>' +
      '<button class="chip' + (nearCat === 'curio' ? ' active' : '') + '" data-c="curio">🎭 Curiosità</button>' +
      Object.keys(CATS).map((k) => '<button class="chip' + (nearCat === k ? ' active' : '') + '" data-c="' + k + '">' + CATS[k].l + '</button>').join('');
    $$('.chip', box).forEach((c) => c.addEventListener('click', () => { nearCat = c.dataset.c; renderChips(); loadNear(); }));
  }

  // Copertura dei dati salvati (Amsterdam e Schiphol); fuori da qui si cerca in diretta
  const COVER = { S: 52.28, N: 52.43, W: 4.72, E: 5.03 };
  const inCover = (p) => p.lat >= COVER.S && p.lat <= COVER.N && p.lon >= COVER.W && p.lon <= COVER.E;
  const OVERPASS = ['https://overpass.openstreetmap.fr/api/interpreter', 'https://z.overpass-api.de/api/interpreter', 'https://overpass-api.de/api/interpreter'];
  const NAMED = ['cibo', 'bar', 'stop', 'visita'];
  const CUISINE = { italian: 'italiana', pizza: 'pizza', burger: 'hamburger', sandwich: 'panini', indian: 'indiana', japanese: 'giapponese', chinese: 'cinese', asian: 'asiatica', french: 'francese', indonesian: 'indonesiana', thai: 'thailandese', sushi: 'sushi', kebab: 'kebab', mexican: 'messicana', turkish: 'turca', friture: 'patatine e fritti', breakfast: 'colazioni', regional: 'locale', international: 'internazionale', ramen: 'ramen', steak_house: 'carne alla griglia', bubble_tea: 'bubble tea', mediterranean: 'mediterranea', argentinian: 'argentina', spanish: 'spagnola', korean: 'coreana', seafood: 'pesce', fish: 'pesce', surinamese: 'surinamese', dutch: 'olandese', greek: 'greca', american: 'americana', vietnamese: 'vietnamita', lebanese: 'libanese', ethiopian: 'etiope', vegetarian: 'vegetariana', vegan: 'vegana', tapas: 'tapas', irish: 'irlandese', belgian: 'belga', barbecue: 'barbecue', chicken: 'pollo', coffee_shop: 'caffetteria', cake: 'dolci', ice_cream: 'gelato', pancake: 'pancake', pasta: 'pasta', dessert: 'dolci', bakery: 'forno', portuguese: 'portoghese', moroccan: 'marocchina', persian: 'persiana', georgian: 'georgiana', german: 'tedesca', peruvian: 'peruviana', brazilian: 'brasiliana', caribbean: 'caraibica', middle_eastern: 'mediorientale', falafel: 'falafel', poke: 'poke', salad: 'insalate', juice: 'succhi', tea: 'tè', coffee: 'caffè' };
  const TYPE = { attraction: 'attrazione', museum: 'museo', gallery: "galleria d'arte", viewpoint: 'punto panoramico' };
  const cleanWeb = (w) => (w || '').replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
  const hrefWeb = (w) => (/^https?:/.test(w) ? w : 'https://' + w);

  // Riga con la stessa forma dei dati salvati: [nome, lat, lon, orari, cucina o tipo, costo, sito, indirizzo]
  function rowFromTags(k, t, lat, lon) {
    const name = t.name || t['name:en'] || '';
    let x = '', fee = '';
    if (k === 'cibo' || k === 'bar') x = (t.cuisine || '').split(/[;,]/).map((c) => CUISINE[c.trim()]).filter(Boolean).slice(0, 2).join(', ');
    if (k === 'visita') {
      x = t.amenity === 'marketplace' ? 'mercato' : (TYPE[t.tourism] || '');
      if (t.fee === 'no') fee = 'ingresso gratuito'; else if (t.fee === 'yes') fee = 'a pagamento' + (t.charge ? ' (' + t.charge + ')' : '');
    }
    return [name, lat, lon, t.opening_hours || '', x, fee, cleanWeb(t.website || t['contact:website']), ((t['addr:street'] || '') + ' ' + (t['addr:housenumber'] || '')).trim()];
  }

  // Interroga insieme i server di OpenStreetMap e prende la prima risposta valida (massimo 15 secondi)
  function liveRows(k, p) {
    const cat = CATS[k], around = '(around:' + cat.r + ',' + p.lat + ',' + p.lon + ')', nm = NAMED.includes(k) ? '["name"]' : '';
    const q = '[out:json][timeout:25];(' + cat.f.map((f) => 'nwr' + around + f + nm + ';').join('') + ');out center 150;';
    const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 15000);
    return Promise.any(OVERPASS.map((u) => fetch(u, { method: 'POST', body: 'data=' + encodeURIComponent(q), signal: ctl.signal })
      .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })))
      .then((d) => {
        clearTimeout(timer); ctl.abort();
        return d.elements.map((e) => {
          const lat = e.lat != null ? e.lat : e.center && e.center.lat, lon = e.lon != null ? e.lon : e.center && e.center.lon;
          return lat == null ? null : rowFromTags(k, e.tags || {}, lat, lon);
        }).filter(Boolean);
      })
      .catch((e) => { clearTimeout(timer); throw e; });
  }

  // descrizioni scritte a mano dei luoghi da visitare più noti; per gli altri una riga generica in base al tipo
  const VISITA_DESC = {"Het Muizenhuis":"Piccolo museo di casette in miniatura abitate da topi, per bambini e curiosi.","The Fault In Our Stars Bench":"Panchina resa famosa dal film «Colpa delle stelle», vicino al canale.","Spinhuispoort": "Passaggio storico nel quartiere universitario che porta a un cortile interno. Un tempo ospitava una casa di correzione per donne.", "Huis aan 3 grachten": "Casa storica affacciata sul punto in cui si incontrano tre canali.", "Oudemanhuispoort": "Passaggio coperto nel centro, noto per le bancarelle di libri usati. Collega due canali ed è un angolo tranquillo.", "The Amsterdam Dungeon": "Spettacolo itinerante con attori, che racconta in chiave horror e ironica gli episodi più cupi della storia di Amsterdam.", "Hash Marihuana & Hemp Museum": "Museo sulla storia e sugli usi della cannabis e della canapa, dalle fibre alla medicina. Si trova vicino al quartiere a luci rosse.", "Oost-Indisch Huis": "Antica sede della Compagnia olandese delle Indie orientali (VOC), oggi parte dell'università.", "Allard Pierson Museum": "Museo archeologico dell'università, con reperti di Egitto, Grecia, Roma e Medio Oriente.", "Rederij Kooij": "Compagnia di giri in barca sui canali, con partenza da Rokin.", "Ruiterstandbeeld van Koningin Wilhelmina": "Monumento equestre alla regina Guglielmina dei Paesi Bassi.", "UvA Bijzondere Collecties": "Biblioteca delle collezioni speciali dell'università: manoscritti e libri antichi.", "Ripley's Believe It or Not": "Museo delle stranezze, con oggetti e record incredibili. Adatto anche a chi viaggia con ragazzi.", "Zuiderkerk": "Chiesa del primo Seicento, opera dell'architetto Hendrick de Keyser. Dalla torre, quando è aperta, si vede il centro.", "Zuiderkerktoren": "Torre della Zuiderkerk, con vista sul centro quando è aperta.", "Madame Tussauds Amsterdam": "Museo delle statue di cera di personaggi famosi, sul Dam.", "Amsterdam Museum": "Museo che racconta la storia della città, dalle origini a oggi.", "Rondvaart Canal": "Giro turistico in barca sui canali, di solito di circa un'ora.", "Postzegelmarkt": "Mercato di francobolli e monete da collezione, aperto solo in alcuni giorni.", "Begijnhof": "Cortile nascosto del Trecento con casette e giardino, uno dei luoghi più tranquilli del centro. L'ingresso è libero: si chiede silenzio perché ci abitano delle persone.", "Dancing Houses": "Case storiche dalle facciate inclinate, che sembrano «ballare», affacciate sull'acqua.", "Dam": "La piazza principale della città, con il Palazzo Reale, la Nieuwe Kerk e il monumento nazionale.", "Munttoren": "Torre del Seicento con orologio e carillon, vicino al mercato dei fiori.", "Houten Huis": "Una delle pochissime case in legno rimaste ad Amsterdam, nel Begijnhof (Quattrocento).", "Spui": "Piazza del centro circondata da librerie e caffè. Di solito il venerdì c'è il mercatino dei libri e la domenica quello dell'arte, ma gli orari variano con la stagione.", "W139": "Spazio d'arte contemporanea gestito da artisti, a due passi dal Dam.", "de Wallen": "Il quartiere a luci rosse, nel cuore del centro storico: vicoli, canali, vetrine e vita notturna. Fotografare le vetrine è vietato.", "Koninklijk Paleis": "Il Palazzo Reale del Seicento affacciato sul Dam. Si visita quando non ci sono eventi di stato.", "Warmoesstraat": "Una delle vie più antiche della città, tra locali, negozi e vita notturna.", "Waterloopleinmarkt": "Mercato delle pulci storico, aperto dal lunedì al sabato.", "Bloemenmarkt": "Il mercato dei fiori galleggiante sul canale Singel: bulbi di tulipano, fiori recisi e ricordi.", "Torture Museum": "Museo degli strumenti di tortura medievali.", "Waag": "Edificio medievale sulla piazza Nieuwmarkt, un tempo porta della città e poi pesa pubblica.", "Red Light Secrets": "Museo del quartiere a luci rosse: racconta la vita e il lavoro dietro le vetrine.", "Nieuwe Kerk": "Chiesa del Quattrocento accanto al Palazzo Reale, oggi sede di grandi mostre. Qui si svolgono le cerimonie di incoronazione dei sovrani olandesi.", "Erotisch Museum": "Museo sull'arte erotica, distribuito su più piani.", "Oude Kerk": "La chiesa più antica della città (fondata nel 1213, consacrata nel 1306), nel cuore del quartiere a luci rosse. Oggi ospita anche mostre.", "Chinatown": "Zona attorno a Zeedijk e Nieuwmarkt con ristoranti asiatici e un tempio buddhista.", "Body Worlds": "Mostra di corpi umani conservati con la plastinazione, dedicata all'anatomia.", "Fo Guang Shan He Hua Tempel": "Grande tempio buddhista sulla Zeedijk, tra i più grandi d'Europa. Si visita con rispetto.", "Magna Plaza": "Centro commerciale dentro l'ex palazzo delle poste neogotico, dietro il Palazzo Reale.", "Beurs van Berlage": "Ex borsa merci progettata da Berlage, simbolo dell'architettura moderna olandese, oggi sede di eventi.", "Kattenkabinet": "Museo dei gatti nell'arte, in una casa sul canale Herengracht.", "Willet-Holthuysen": "Casa-museo sul canale Herengracht, con arredi e giardino dell'Ottocento.", "Blauwbrug": "Ponte sull'Amstel, ispirato al Pont Alexandre III di Parigi.", "Gassan Diamonds": "Laboratorio di taglio dei diamanti con visita e negozio.", "7 Bruggen op een rij": "Punto di vista da cui si vedono sette ponti in fila sul canale Reguliersgracht.", "Ons' Lieve Heer op Solder": "Chiesa cattolica clandestina nascosta nel sottotetto di una casa del Seicento, a due passi dall'Oude Kerk.", "Art Zoo Museum": "Museo d'arte contemporanea in una casa sul canale Herengracht: animali impagliati disposti come nature morte del Seicento, opera del duo Darwin, Sinke & Van Tongeren. Aperto dal 2025.", "Grachtenhuis": "Museo dei canali: racconta come è nata Amsterdam, con installazioni multimediali.", "Joods Museum": "Museo della storia e della cultura ebraica nei Paesi Bassi.", "Collectie Six": "Collezione privata della famiglia Six, con capolavori del Seicento tra cui un Rembrandt. Si visita su prenotazione.", "H'ART Museum": "Museo d'arte sull'Amstel, con mostre temporanee importanti.", "foam": "Museo della fotografia.", "Venustempel Sexmuseum": "Museo del sesso, vicino alla stazione.", "Montelbaanstoren": "Torre difensiva del Cinquecento sul canale Oude Schans.", "Portugese Synagoge": "Sinagoga sefardita del Seicento, ancora in uso.", "Museum Van Loon": "Casa-museo del Seicento sul canale, con giardino.", "Huis Marseille": "Museo di fotografia in una casa del Seicento sul canale Keizersgracht.", "Scheepvaarthuis": "Edificio del 1916 in stile Scuola di Amsterdam, oggi albergo.", "Museum of Illusions": "Museo delle illusioni ottiche e dei giochi di percezione, ideale anche con ragazzi.", "Schreierstoren": "Torre medievale dove, secondo la tradizione, si salutavano i marinai in partenza.", "Multatuli Museum": "Museo dedicato allo scrittore Multatuli.", "Houseboat Museum": "Museo delle case galleggianti: una vera chiatta aperta ai visitatori.", "Embassy of the Free Mind": "Biblioteca con manoscritti e libri rari di filosofia ed esoterismo.", "Het Huis met den Hoofden": "Casa del 1622 con sei teste scolpite sulla facciata.", "Drie-klimaten-kas": "Serra dell'Hortus Botanicus con piante di tre climi diversi.", "Magere Brug": "Il «ponte magro» sull'Amstel, ponte levatoio in legno molto fotografato la sera.", "Westerkerk": "Chiesa del Seicento con la torre più alta della città. Vi è sepolto Rembrandt, anche se la tomba esatta non è nota.", "Westertoren": "La torre della Westerkerk, alta 87 metri, con vista sul centro. Si sale con una visita guidata, in stagione.", "Anne Frank Huis": "La casa dove Anna Frank e la sua famiglia si nascosero. Il biglietto va prenotato online con largo anticipo.", "Vlinderkas": "Serra con farfalle tropicali nell'Hortus Botanicus.", "Hortus Botanicus": "Giardino botanico del 1638, tra i più antichi del mondo.", "Amsterdam Hop on Hop Off": "Giro turistico in barca sui canali, con fermate dove si può scendere e risalire.", "Canal Cruise": "Giro turistico in barca sui canali.", "Pijpenkabinet": "Museo delle pipe e degli oggetti dei fumatori.", "Amsterdam Tulip Museum": "Museo del tulipano e della storia della «tulipanomania».", "Amsterdam Cheese Museum": "Museo-negozio del formaggio olandese, con assaggi.", "Leidseplein": "Piazza animata con teatri, locali e ristoranti, vicino al Vondelpark.", "Nationaal Holocaustmuseum": "Museo nazionale della Shoah, vicino alla Hollandsche Schouwburg.", "Electric Ladyland": "Piccolo museo dell'arte fluorescente, molto particolare.", "Hollandsche Schouwburg": "Ex teatro usato per radunare gli ebrei prima della deportazione, oggi memoriale.", "Max Euwe Centrum": "Museo degli scacchi.", "Arcam": "Centro dell'architettura di Amsterdam.", "NEMO Science Museum": "Museo della scienza interattivo, in un edificio a forma di nave progettato da Renzo Piano. Sul tetto c'è una terrazza panoramica.", "Verzetsmuseum": "Museo della Resistenza olandese durante l'occupazione tedesca.", "Pianola Museum": "Museo dei pianoforti meccanici (pianola), nel quartiere Jordaan.", "Micropia": "Il museo dei microbi, unico al mondo, vicino allo zoo Artis.", "Rijksmuseum": "Il museo nazionale: la Ronda di notte di Rembrandt, Vermeer e secoli di arte olandese. Meglio prenotare il biglietto con l'orario.", "Het Scheepvaartmuseum": "Museo della marineria olandese, con la replica di un vascello del Settecento ormeggiata davanti.", "Heineken Experience": "Percorso nell'ex birrificio con degustazione.", "House of Bols": "Museo del gin e dei liquori Bols, con un cocktail compreso.", "Moco Museum": "Piccolo museo d'arte moderna e contemporanea con Banksy, Warhol, Basquiat e Kusama.", "Van Gogh Museum": "La più grande collezione di opere di Vincent van Gogh.", "Albert Cuyp-markt": "Il mercato di strada più grande della città, nel quartiere De Pijp.", "A'dam Lookout": "Terrazza panoramica in cima alla torre A'DAM, oltre l'IJ, con altalena sul vuoto.", "Eye Filmmuseum": "Museo del cinema sull'IJ, raggiungibile con il traghetto gratuito da Centraal.", "This is Holland": "Esperienza di volo simulato sopra i Paesi Bassi, con sedili sospesi.", "Over The Edge": "Altalena sul vuoto in cima alla torre A'DAM.", "Stedelijk Museum Amsterdam": "Museo d'arte moderna e contemporanea, accanto al Van Gogh Museum.", "Wereldmuseum Amsterdam": "Museo etnografico (ex Tropenmuseum) sulle culture del mondo.", "Hollandsche Manege": "Maneggio coperto del 1882, ispirato alla scuola di equitazione di Vienna.", "Fabrique des Lumières": "Mostra immersiva con grandi proiezioni digitali sui capolavori dei più noti artisti.", "Nxt Museum": "Museo d'arte digitale e di nuovi media.", "Cacaomuseum": "Museo del cacao e del cioccolato.", "Banksy museum": "Museo dedicato a Banksy e alla sua arte di strada.", "Museum Het Schip": "Museo della Scuola di Amsterdam, dentro un complesso di case popolari del 1919.", "STRAAT": "Museo della street art in un ex capannone, nel quartiere Noord."};
  const VISITA_GEN = {"museo": "Museo. Per orari e biglietti guarda il sito o cerca su Google.", "galleria d'arte": "Galleria d'arte: di solito l'ingresso è libero, ma gli orari variano.", "mercato": "Mercato di strada.", "punto panoramico": "Punto da cui si ha una bella vista.", "attrazione": ""};
  const ARTIS = { lat: 52.3660, lon: 4.9163 };
  function buildList(k, rows) {
    const cat = CATS[k], food = k === 'cibo' || k === 'bar', visit = k === 'visita', label = cat.l.replace(/^\S+\s/, '');
    return rows.map((r) => ({
      n: r[0] || label, lat: r[1], lon: r[2], ic: cat.ic, t: (visit && r[4]) ? r[4] : (r[0] ? '' : 'senza nome'),
      hours: r[3] || '', cuisine: food ? (r[4] || '') : '', kind: visit ? (r[4] || '') : '',
      d: visit ? (VISITA_DESC[r[0]] || (r[4] === 'attrazione' && distM(ARTIS, { lat: r[1], lon: r[2] }) < 350 ? 'Animale o recinto dello zoo Artis.' : (/cruise|boat|canal tours|stromma|rederij/i.test(r[0]) ? 'Giro turistico in barca sui canali.' : (VISITA_GEN[r[4]] || '')))) : '',
      c: visit ? (r[5] || 'non indicato nei dati, controlla il sito') : '',
      addr: r[7] || '', web: r[6] ? hrefWeb(r[6]) : '', menu: food && !!r[0], info: visit && !!r[0],
      d0: distM(pos, { lat: r[1], lon: r[2] }),
    })).filter((p) => p.d0 <= cat.r).sort((a, b) => a.d0 - b.d0).slice(0, 30);
  }

  const gsearch = (q) => 'https://www.google.com/search?q=' + encodeURIComponent(q);

  // Riga di un luogo; se ha dettagli (descrizione, costo, menù) si apre con un tocco
  function placeRow(p) {
    const more = [];
    const days = p.g || [];
    if (p.d) more.push('<p>' + esc(p.d) + '</p>');
    if (days.length) more.push('<p class="pm-line"><b>Nel programma:</b> ' + days.map((i) => DAY_SHORT[i]).join(' e ') + '</p>');
    if (p.kind) more.push('<p class="pm-line"><b>Tipo:</b> ' + esc(p.kind) + '</p>');
    if (p.cuisine) more.push('<p class="pm-line"><b>Cucina:</b> ' + esc(p.cuisine) + '</p>');
    if (p.c) more.push('<p class="pm-line"><b>Costo:</b> ' + esc(p.c) + '</p>');
    if (p.addr) more.push('<p class="pm-line"><b>Indirizzo:</b> ' + esc(p.addr) + '</p>');
    if (p.hours) more.push('<p class="pm-line"><b>Orari:</b> ' + esc(p.hours) + '</p>');
    const btns = [];
    if (p.menu) btns.push('<a class="btn-m btn-yellow" href="' + gsearch(p.n + ' Amsterdam menu') + '" target="_blank">Menù su Google</a>');
    if (p.web) btns.push('<a class="btn-m btn-yellow" href="' + esc(p.web) + '" target="_blank">Sito</a>');
    days.forEach((i) => btns.push('<a class="btn-m btn-yellow" href="#" data-day="' + i + '">Apri ' + DAY_SHORT[i] + '</a>'));
    if (p.info) btns.push('<a class="btn-m btn-outline" href="' + gsearch(p.n + ' Amsterdam') + '" target="_blank">Cos\'è? Cerca su Google</a>');
    if (btns.length) more.push('<div class="maps-row">' + btns.join('') + '</div>');
    const has = more.length > 0;
    return '<div class="place-wrap"><div class="place"><div class="place-ic">' + (p.img && window.AMS_IMG && window.AMS_IMG[p.img] ? '<img src="' + window.AMS_IMG[p.img].src + '" alt="" loading="lazy">' : p.ic) + '</div>' +
      (has ? '<button class="place-body" aria-expanded="false">' : '<div class="place-body">') +
      '<div class="place-name">' + esc(p.n) + (has ? ' <span class="chev" aria-hidden="true">▾</span>' : '') + '</div><div class="place-sub">' + esc(p.t || '') + '</div>' +
      (days.length ? '<div class="when">Ci andiamo: ' + days.map((i) => DAY_MINI[i]).join(' e ') + '</div>' : '') +
      (has ? '</button>' : '</div>') +
      '<div class="place-dist">' + fmtDist(p.d0) + '</div><a class="btn-m btn-outline" href="' + mapsPlace(p.lat, p.lon, p.q) + '" target="_blank">Maps</a></div>' +
      (has ? '<div class="place-more" hidden>' + more.join('') + '</div>' : '') + '</div>';
  }
  function bindRows(box) {
    $$('a[data-day]', box).forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); if (typeof go === 'function') go(+a.dataset.day); }));
    $$('button.place-body', box).forEach((b) => b.addEventListener('click', () => {
      const wrap = b.closest('.place-wrap'), more = wrap.querySelector('.place-more');
      const open = more.hidden;
      more.hidden = !open;
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
      wrap.classList.toggle('open', open);
    }));
  }

  async function loadNear() {
    const out = $('#near-out');
    if (!pos) { out.innerHTML = '<div class="t-note">Premi "Usa la mia posizione" oppure "Parti dall\'hotel".</div>'; return; }
    if (nearCat === 'famosi') {
      const list = FAMOUS.map((p) => Object.assign({}, p, { d0: distM(pos, p), q: p.n + ' Amsterdam', g: WHEN[p.n] || [], img: FAMOUS_IMG[p.n] || '' })).sort((a, b) => a.d0 - b.d0);
      out.innerHTML = '<div class="t-note small" style="margin-bottom:6px">Tocca un luogo per leggere cos\'è e quanto costa. I prezzi sono indicativi: controlla sempre il sito prima di andare.</div>' + list.map(placeRow).join('');
      bindRows(out);
      return;
    }
    if (nearCat === 'curio') {
      const list = CURIOSITA.map((p) => Object.assign({}, p, { d0: distM(pos, p), q: p.n + ' ' + (p.addr || '') + ' Amsterdam', info: true })).sort((a, b) => a.d0 - b.d0);
      out.innerHTML = '<div class="t-note small" style="margin-bottom:6px">Luoghi insoliti scelti a mano. Tocca un luogo per i dettagli: alcuni sono piccoli e si vedono solo dall\'esterno, e gli orari possono cambiare.</div>' + list.map(placeRow).join('');
      bindRows(out);
      return;
    }
    const k = nearCat, cat = CATS[k], visit = k === 'visita', token = ++nearToken;
    const saved = (window.AMS_OSM && window.AMS_OSM[k]) || [];
    const hint = visit ? '<div class="t-note small" style="margin-bottom:6px">Tocca un luogo per i dettagli. Il costo è quello indicato su OpenStreetMap, quando c\'è.</div>' : '';
    const draw = (rows, source, warn) => {
      if (token !== nearToken) return;
      const list = buildList(k, rows);
      out.innerHTML = '<div class="src-line"><span>' + source + '</span><button class="t-btn small ghost" id="near-live">Aggiorna in diretta</button></div>' +
        (warn ? '<div class="t-note small" style="margin-bottom:6px">' + warn + '</div>' : '') + hint +
        (list.length ? list.map(placeRow).join('') : '<div class="t-note">Niente di segnato nel raggio di ' + cat.r + ' m. Prova con "Più famosi" o con "Aggiorna in diretta".</div>');
      bindRows(out);
      $('#near-live').addEventListener('click', () => runLive(false));
    };
    const runLive = async (auto) => {
      out.innerHTML = '<div class="t-note">' + (auto ? 'Sei fuori dall\'area salvata: ' : '') + 'cerco in diretta nel raggio di ' + cat.r + ' m…</div>';
      try {
        const rows = await liveRows(k, pos);
        draw(rows, 'Dati in diretta, letti adesso');
      } catch (e) {
        if (token !== nearToken) return;
        if (auto) out.innerHTML = '<div class="t-note">Sei fuori dall\'area salvata e il servizio in diretta non risponde. Controlla la rete e riprova tra poco; "Più famosi" funziona sempre.</div><div class="t-gap"><button class="t-btn small ghost" id="near-live">Riprova</button></div>';
        else draw(saved, 'Dati salvati', 'Il servizio in diretta non risponde: restano i dati salvati.');
        const b = $('#near-live'); if (auto && b) b.addEventListener('click', () => runLive(true));
      }
    };
    if (inCover(pos)) draw(saved, 'Dati salvati il 22 ott, funzionano anche senza rete'); else runLive(true);
  }

  function setPos(p, label) {
    pos = p;
    $('#near-pos').textContent = label;
    loadNear();
  }
  $('#near-gps').addEventListener('click', () => {
    if (!navigator.geolocation) { $('#near-pos').textContent = 'Posizione non disponibile su questo dispositivo.'; return; }
    $('#near-pos').textContent = 'Cerco la posizione…';
    const ok = (g) => {
      const p = { lat: g.coords.latitude, lon: g.coords.longitude };
      const far = distM(p, HOTEL);
      setPos(p, far > 25000
        ? '📍 Posizione attuale, ma sei a ' + Math.round(far / 1000) + ' km da Amsterdam: i risultati qui valgono solo in città. Per provare l\'app usa "Parti dall\'hotel".'
        : '📍 Posizione attuale');
    };
    const ko = (e) => {
      const why = e && e.code === 1
        ? 'Il telefono non ha dato il permesso. Su iPhone: Impostazioni > Privacy e sicurezza > Localizzazione > attiva, poi Siti web di Safari (o l\'app installata) > "Mentre usi l\'app". Su Android: tocca il lucchetto accanto all\'indirizzo in Chrome > Autorizzazioni > Posizione.'
        : e && e.code === 3 ? 'Il telefono ci mette troppo a trovarti (succede al chiuso). Riprova all\'aperto, oppure usa "Parti dall\'hotel".'
        : 'Il telefono non riesce a darmi la posizione. Controlla che la localizzazione sia accesa, oppure usa "Parti dall\'hotel".';
      $('#near-pos').textContent = why;
    };
    // prima con precisione normale e rete (veloce anche al chiuso), poi non serve altro
    navigator.geolocation.getCurrentPosition(ok, (e) => {
      if (e && e.code === 1) return ko(e);
      navigator.geolocation.getCurrentPosition(ok, ko, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
    }, { enableHighAccuracy: false, timeout: 8000, maximumAge: 120000 });
  });
  // indirizzo scritto a mano (serve la rete): la ricerca usa il servizio di OpenStreetMap
  async function findAddr() {
    const q = ($('#near-addr').value || '').trim(), box = $('#near-addr-res');
    if (q.length < 3) { box.innerHTML = '<div class="t-note small t-gap">Scrivi almeno tre lettere.</div>'; return; }
    box.innerHTML = '<div class="t-note small t-gap">Cerco…</div>';
    try {
      const full = /amsterdam/i.test(q) ? q : q + ', Amsterdam';
      const u = 'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&countrycodes=nl&accept-language=it&viewbox=4.72,52.43,5.03,52.28&q=' + encodeURIComponent(full);
      const res = await fetch(u);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const raw = await res.json(), seen = new Set();
      const nice = (r) => { const p = r.display_name.split(',').map((x) => x.trim()); return (/^\d/.test(p[0]) && p[1] ? p[1] + ' ' + p[0] : p[0]) + (p[2] ? ', ' + p[2] : ''); };
      const list = raw.filter((r) => { const k = nice(r); if (seen.has(k)) return false; seen.add(k); return true; });
      if (!list.length) { box.innerHTML = '<div class="t-note small t-gap">Non trovo niente. Prova con via e numero civico, per esempio "Prinsengracht 263".</div>'; return; }
      box.innerHTML = '<div class="t-gap">' + list.map((r, i) => '<button class="t-btn ghost addr-res" data-i="' + i + '">' + esc(nice(r)) + '</button>').join('') + '</div>';
      $$('.addr-res', box).forEach((b) => b.addEventListener('click', () => {
        const r = list[Number(b.dataset.i)];
        setPos({ lat: Number(r.lat), lon: Number(r.lon) }, '📍 Parti da: ' + nice(r));
        box.innerHTML = '';
      }));
    } catch (e) {
      box.innerHTML = '<div class="t-note small t-gap">Per cercare un indirizzo serve la connessione a internet. Riprova quando sei online.</div>';
    }
  }
  $('#near-find').addEventListener('click', findAddr);
  $('#near-addr').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); findAddr(); } });
  $('#near-hotel').addEventListener('click', () => setPos({ lat: HOTEL.lat, lon: HOTEL.lon }, '🏨 Partenza: ' + HOTEL.name));
  renderChips();
  loadNear();

  // ── Spese ──
  const SK = 'ams-spese';
  let S = store.get(SK, { code: '', me: '', people: [], records: [] });
  const saveS = () => store.set(SK, S);
  const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const CAT_IC = { Cibo: '🍽️', Trasporti: '🚋', Ingressi: '🎟️', Alloggio: '🏨', Altro: '🧾' };
  let syncState = 'off';

  function liveExpenses() {
    const dead = new Set(S.records.filter((r) => r.t === 'd').map((r) => r.target));
    const closed = new Set(); closures().forEach((c) => (c.ids || []).forEach((i) => closed.add(i)));
    return S.records.filter((r) => r.t === 'e' && !dead.has(r.id) && !closed.has(r.id)).sort((a, b) => b.ts - a.ts);
  }
  // chiusure dei conti: ogni record 'c' elenca le spese chiuse e il risultato di quel momento
  function closures() {
    return S.records.filter((r) => r.t === 'c').sort((a, b) => b.ts - a.ts);
  }
  function closedExpenses(c) {
    const ids = new Set(c.ids || []), dead = new Set(S.records.filter((r) => r.t === 'd').map((r) => r.target));
    return S.records.filter((r) => r.t === 'e' && ids.has(r.id) && !dead.has(r.id)).sort((a, b) => b.ts - a.ts);
  }
  function peopleRecord() {
    return S.records.filter((r) => r.t === 'p').sort((a, b) => b.ts - a.ts)[0];
  }
  function applyPeople() {
    const p = peopleRecord();
    if (p) S.people = p.names;
  }

  function splitShares(amount, who) {
    const base = Math.floor(amount / who.length); let rest = amount - base * who.length;
    const o = {}; who.forEach((w) => { o[w] = base + (rest-- > 0 ? 1 : 0); });
    return o;
  }

  function calcConti(ex) {
    const paid = {}, share = {};
    S.people.forEach((p) => { paid[p] = 0; share[p] = 0; });
    let total = 0;
    ex.forEach((e) => {
      total += e.amount;
      if (paid[e.payer] != null) paid[e.payer] += e.amount;
      const sh = splitShares(e.amount, e.who.length ? e.who : S.people);
      Object.keys(sh).forEach((p) => { if (share[p] != null) share[p] += sh[p]; });
    });
    const net = S.people.map((p) => ({ p, v: paid[p] - share[p] }));
    const cred = net.filter((x) => x.v > 0).map((x) => ({ ...x })).sort((a, b) => b.v - a.v);
    const deb = net.filter((x) => x.v < 0).map((x) => ({ p: x.p, v: -x.v })).sort((a, b) => b.v - a.v);
    const settle = [];
    let i = 0, j = 0;
    while (i < deb.length && j < cred.length) {
      const m = Math.min(deb[i].v, cred[j].v);
      if (m > 0) settle.push(deb[i].p + ' deve ' + eur(m) + ' a ' + cred[j].p);
      deb[i].v -= m; cred[j].v -= m;
      if (deb[i].v <= 0) i++;
      if (cred[j].v <= 0) j++;
    }
    return { total, net, settle };
  }

  function renderSpese() {
    applyPeople();
    const box = $('#spese-body');
    if (!S.people.length) {
      box.innerHTML = '<div class="t-card"><div class="t-title">Prepariamo le spese</div>' +
        '<div class="t-note">Scrivi i nomi di chi viaggia, separati da virgola. Poi scegli chi sei tu su questo telefono.</div>' +
        '<label class="t-label">NOMI</label><input class="t-input" id="sp-names" value="' + esc(DEFAULT_PEOPLE) + '">' +
        '<label class="t-label">TU CHI SEI?</label><select class="t-select" id="sp-me0"></select>' +
        '<label class="t-label">CODICE VIAGGIO (uguale su tutti i telefoni)</label><input class="t-input" id="sp-code" value="' + esc(S.code || DEFAULT_TRIP) + '">' +
        '<div class="t-gap"><button class="t-btn yellow" id="sp-start">Inizia</button></div></div>';
      const fillMe = () => {
        const list = $('#sp-names').value.split(',').map((x) => x.trim()).filter(Boolean);
        const cur = $('#sp-me0').value;
        $('#sp-me0').innerHTML = list.map((p) => '<option' + (p === cur ? ' selected' : '') + '>' + esc(p) + '</option>').join('');
      };
      fillMe();
      $('#sp-names').addEventListener('input', fillMe);
      $('#sp-start').addEventListener('click', () => {
        const names = $('#sp-names').value.split(',').map((x) => x.trim()).filter(Boolean);
        if (names.length < 1) return;
        S.code = $('#sp-code').value.trim().replace(/[.$#\[\]\/]/g, '-') || DEFAULT_TRIP;
        S.records.push({ id: 'people', t: 'p', names, ts: Date.now(), synced: false });
        S.people = names; S.me = names.includes($('#sp-me0').value) ? $('#sp-me0').value : names[0];
        saveS(); renderSpese(); syncSpese();
      });
      return;
    }
    if (!S.me || !S.people.includes(S.me)) S.me = S.people[0];
    const ex = liveExpenses();
    const { total, net, settle } = calcConti(ex);
    const closed = closures();
    const closedTotal = closed.reduce((t, c) => t + (c.total || 0), 0);
    const statusTxt = { off: 'Solo su questo telefono', ok: 'Sincronizzato con gli altri', err: 'Non riesco a sincronizzare, riprovo' }[syncState];
    box.innerHTML =
      '<div class="t-card"><div class="t-row" style="justify-content:space-between"><div><div class="t-note small">' + (closed.length ? 'DA SALDARE' : 'TOTALE SPESO') + '</div><div class="t-title" style="font-size:24px">' + eur(total) + '</div>' + (closed.length ? '<div class="t-note small">Totale del viaggio ' + eur(total + closedTotal) + '</div>' : '') + '</div>' +
      '<div class="t-note small"><span class="sync-dot ' + (syncState === 'ok' ? 'ok' : syncState === 'err' ? 'err' : '') + '"></span>' + statusTxt + '</div></div></div>' +

      '<div class="t-card"><div class="t-title">Aggiungi una spesa</div>' +
      '<label class="t-label">IMPORTO (€)</label><input class="t-input" id="sp-amt" inputmode="decimal" placeholder="0,00">' +
      '<label class="t-label">COSA</label><input class="t-input" id="sp-desc" placeholder="Es. cena Foodhallen">' +
      '<label class="t-label">CATEGORIA</label><select class="t-select" id="sp-cat">' + Object.keys(CAT_IC).map((c) => '<option>' + c + '</option>').join('') + '</select>' +
      '<label class="t-label">PAGATO DA</label><select class="t-select" id="sp-payer">' + S.people.map((p) => '<option' + (p === S.me ? ' selected' : '') + '>' + esc(p) + '</option>').join('') + '</select>' +
      '<label class="t-label">DIVISO TRA</label><div class="t-checks">' + S.people.map((p) => '<label class="t-check"><input type="checkbox" class="sp-who" value="' + esc(p) + '" checked> ' + esc(p) + '</label>').join('') + '</div>' +
      '<div class="t-gap"><button class="t-btn yellow" id="sp-add">Aggiungi</button></div></div>' +

      '<div class="t-card"><div class="t-title">Chi deve a chi</div>' +
      (settle.length ? settle.map((s) => '<div class="settle">' + esc(s) + '</div>').join('') : '<div class="t-note">Per ora siete pari.</div>') +
      '<div class="t-gap">' + net.map((x) => '<div class="balance"><span>' + esc(x.p) + '</span><span class="' + (x.v >= 0 ? 'pos' : 'neg') + '">' + (x.v >= 0 ? '+' : '') + eur(x.v) + '</span></div>').join('') + '</div>' +
      (S.me === ADMIN && ex.length ? '<div class="t-gap"><button class="t-btn ghost small" id="sp-close">Chiudi i conti</button><div class="t-note small t-gap">Le spese qui sopra vanno nello storico e i saldi ripartono da zero.</div></div>' : '') + '</div>' +

      '<div class="t-card"><div class="t-title">Spese registrate (' + ex.length + ')</div>' +
      (ex.length ? ex.map((e) => '<div class="exp"><div class="place-ic">' + (CAT_IC[e.cat] || '🧾') + '</div><div class="exp-body"><div class="exp-desc">' + esc(e.desc || e.cat) + '</div><div class="exp-sub">' +
        esc(e.payer) + ' ha pagato · ' + new Date(e.ts).toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) + ' · tra ' + e.who.length +
        '</div></div><div class="exp-amt">' + eur(e.amount) + '</div>' + (S.me === ADMIN ? '<button class="x-btn" data-del="' + e.id + '" aria-label="Elimina">✕</button>' : '') + '</div>').join('') : '<div class="t-note">Nessuna spesa ancora.</div>') + '</div>' +

      (closed.length ? '<div class="t-card"><div class="t-title">Storico (' + closed.length + (closed.length === 1 ? ' chiusura' : ' chiusure') + ')</div>' +
        closed.map((c) => '<details class="t-gap"><summary><b>' + new Date(c.ts).toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) + '</b> · ' + eur(c.total || 0) + '</summary>' +
          (c.settle && c.settle.length ? c.settle.map((x) => '<div class="settle">' + esc(x) + '</div>').join('') : '<div class="t-note">Erano pari.</div>') +
          closedExpenses(c).map((e) => '<div class="exp"><div class="place-ic">' + (CAT_IC[e.cat] || '🧾') + '</div><div class="exp-body"><div class="exp-desc">' + esc(e.desc || e.cat) + '</div><div class="exp-sub">' + esc(e.payer) + ' ha pagato · tra ' + e.who.length + '</div></div><div class="exp-amt">' + eur(e.amount) + '</div></div>').join('') + '</details>').join('') + '</div>' : '') +

      '<details class="t-card"><summary class="t-title">Impostazioni</summary>' +
      '<label class="t-label">SONO</label><select class="t-select" id="sp-me">' + S.people.map((p) => '<option' + (p === S.me ? ' selected' : '') + '>' + esc(p) + '</option>').join('') + '</select>' +
      '<label class="t-label">CODICE VIAGGIO</label><input class="t-input" id="sp-code2" value="' + esc(S.code) + '">' +
      '<label class="t-label">PARTECIPANTI</label><input class="t-input" id="sp-names2" value="' + esc(S.people.join(', ')) + '">' +
      '<div class="t-row t-gap"><button class="t-btn ghost small" id="sp-save">Salva</button><button class="t-btn ghost small" id="sp-reset">Cancella i dati di questo telefono</button></div>' +
      (SYNC_URL ? '' : '<div class="t-note small t-gap">Il database condiviso non è ancora collegato: le spese restano su questo telefono.</div>') + '</details>';

    $('#sp-add').addEventListener('click', () => {
      const amount = Math.round(parseFloat(($('#sp-amt').value || '').replace(',', '.')) * 100);
      if (!(amount > 0)) { $('#sp-amt').focus(); return; }
      const who = $$('.sp-who').filter((c) => c.checked).map((c) => c.value);
      if (!who.length) return;
      S.records.push({ id: newId(), t: 'e', amount, desc: $('#sp-desc').value.trim(), cat: $('#sp-cat').value, payer: $('#sp-payer').value, who, ts: Date.now(), synced: false });
      S.me = $('#sp-payer').value;
      saveS(); renderSpese(); syncSpese();
    });
    const cb = $('#sp-close');
    if (cb) cb.addEventListener('click', () => {
      if (!confirm('Chiudere i conti? Le ' + ex.length + ' spese vanno nello storico e i saldi ripartono da zero.')) return;
      S.records.push({ id: newId(), t: 'c', ts: Date.now(), ids: ex.map((e) => e.id), total, settle, synced: false });
      saveS(); renderSpese(); syncSpese();
    });
    $$('[data-del]').forEach((b) => b.addEventListener('click', () => {
      if (!confirm('Eliminare questa spesa?')) return;
      S.records.push({ id: newId(), t: 'd', target: b.dataset.del, ts: Date.now(), synced: false });
      saveS(); renderSpese(); syncSpese();
    }));
    $('#sp-me').addEventListener('change', (e) => { S.me = e.target.value; saveS(); });
    $('#sp-save').addEventListener('click', () => {
      const names = $('#sp-names2').value.split(',').map((x) => x.trim()).filter(Boolean);
      S.code = $('#sp-code2').value.trim() || S.code;
      if (names.length && names.join('|') !== S.people.join('|')) S.records.push({ id: 'people', t: 'p', names, ts: Date.now(), synced: false });
      saveS(); renderSpese(); syncSpese();
    });
    $('#sp-reset').addEventListener('click', () => {
      if (!confirm('Cancello tutte le spese salvate su questo telefono?')) return;
      S = { code: '', me: '', people: [], records: [] }; saveS(); renderSpese();
    });
  }

  // Ogni record è una riga a sé in Firebase: /trips/<codice>/<tipo>-<id>.json, quindi nessuna sovrascrittura tra telefoni
  async function syncSpese() {
    if (!SYNC_URL || !S.code) return;
    const base = SYNC_URL.replace(/\/$/, '') + '/trips/' + encodeURIComponent(S.code);
    const pending = S.records.filter((r) => !r.synced);
    try {
      await Promise.all(pending.map(({ synced, ...r }) =>
        fetch(base + '/' + r.t + '-' + encodeURIComponent(r.id) + '.json', { method: 'PUT', body: JSON.stringify(r) })
          .then((res) => { if (!res.ok) throw new Error('HTTP ' + res.status); })));
      pending.forEach((r) => { r.synced = true; });
      const res = await fetch(base + '.json');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const remote = (await res.json()) || {};
      const byId = new Map(S.records.map((r) => [r.id + r.t, r]));
      Object.values(remote).forEach((r) => {
        if (!r || !r.id || !r.t) return;
        const cur = byId.get(r.id + r.t);
        if (!cur) { const n = Object.assign({}, r, { synced: true }); S.records.push(n); byId.set(r.id + r.t, n); }
        else if (r.t === 'p' && r.ts > cur.ts) Object.assign(cur, r, { synced: true });
      });
      syncState = 'ok';
    } catch (e) {
      syncState = 'err';
    }
    saveS();
    if ($('#tool-spese').classList.contains('active') && !document.activeElement.matches('input,select')) renderSpese();
  }
  if (SYNC_URL) {
    syncState = 'ok';
    setInterval(() => { if (!document.hidden && $('#tool-spese').classList.contains('active')) syncSpese(); }, 20000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) syncSpese(); });
  }

  // ── Documenti (IndexedDB) ──
  let db = null;
  function openDb() {
    return new Promise((ok, ko) => {
      const rq = indexedDB.open('amsterdam-docs', 1);
      rq.onupgradeneeded = () => rq.result.createObjectStore('docs', { keyPath: 'id' });
      rq.onsuccess = () => ok(rq.result); rq.onerror = () => ko(rq.error);
    });
  }
  // attività a cui si può collegare un biglietto: il nome è lo stesso della tappa
  const DOC_STOPS = ['Heineken Experience', 'Van Gogh Museum', 'Moco Museum', 'SmokeBoat', "A'DAM Lookout", 'Rembrandt Corner', 'Volo', 'Hotel Acostar'];
  let docFilter = '', docsCache = [];
  (function () { const sel = $('#doc-stop'); if (sel) sel.innerHTML = '<option value="">Altro (passaporto, assicurazione...)</option>' + DOC_STOPS.map((x) => '<option>' + esc(x) + '</option>').join(''); })();
  const blobOf = (d) => d.blob || new Blob([d.data], { type: d.type });
  const tx = (mode) => db.transaction('docs', mode).objectStore('docs');
  const dbAll = () => new Promise((ok, ko) => { const r = tx('readonly').getAll(); r.onsuccess = () => ok(r.result); r.onerror = () => ko(r.error); });

  async function renderDocs() {
    const box = $('#doc-list');
    if (!db) { box.innerHTML = '<div class="t-note">Il salvataggio dei documenti non è disponibile in questo browser.</div>'; return; }
    docsCache = (await dbAll()).sort((a, b) => b.added - a.added);
    const docs = docFilter ? docsCache.filter((d) => d.stop === docFilter) : docsCache;
    const bar = docFilter ? '<div class="doc-filter"><span>Biglietti: ' + esc(docFilter) + '</span><button id="doc-all">Mostra tutti</button></div>' : '';
    if (!docs.length && docFilter) { box.innerHTML = bar + '<div class="t-note">Nessun biglietto caricato per questa attività. Scegli "' + esc(docFilter) + '" nel menù qui sopra e aggiungi la foto o il PDF.</div>'; $('#doc-all').onclick = () => { docFilter = ''; renderDocs(); }; const sel = $('#doc-stop'); if (sel) sel.value = docFilter; return; }
    if (!docs.length) { box.innerHTML = '<div class="t-note">Nessun documento. Aggiungi biglietti, QR delle prenotazioni, passaporto o assicurazione.</div>'; return; }
    box.innerHTML = bar + '<div class="doc-grid">' + docs.map((d) =>
      '<div class="doc" data-id="' + d.id + '"><div class="doc-thumb">' + (d.type.startsWith('image/') ? '<img alt="" data-thumb="' + d.id + '">' : '📄') +
      '</div><div class="doc-name">' + esc(d.title) + '</div>' + (d.stop ? '<div class="doc-stop">' + esc(d.stop) + '</div>' : '') + '<button class="x-btn" data-rm="' + d.id + '" aria-label="Elimina">✕</button></div>').join('') + '</div>';
    if (docFilter) { $('#doc-all').onclick = () => { docFilter = ''; renderDocs(); }; const sel = $('#doc-stop'); if (sel) sel.value = docFilter; }
    docs.forEach((d) => { const im = $('[data-thumb="' + d.id + '"]'); if (im) im.src = URL.createObjectURL(blobOf(d)); });
    $$('.doc', box).forEach((el) => el.addEventListener('click', (ev) => {
      if (ev.target.closest('[data-rm]')) return;
      const d = docs.find((x) => x.id === el.dataset.id);
      openDoc(d);
    }));
    $$('[data-rm]', box).forEach((b) => b.addEventListener('click', () => {
      if (!confirm('Eliminare questo documento dal telefono?')) return;
      const r = tx('readwrite').delete(b.dataset.rm); r.onsuccess = renderDocs;
    }));
  }
  function openDoc(d) {
    const url = URL.createObjectURL(blobOf(d));
    if (d.type.startsWith('image/')) {
      $('#viewer-title').textContent = d.title; $('#viewer-img').src = url; $('#viewer').classList.add('open');
    } else {
      window.open(url, '_blank');
    }
  }
  $('#viewer-close').addEventListener('click', () => { $('#viewer').classList.remove('open'); $('#viewer-img').removeAttribute('src'); });
  // dal pulsante "Biglietto" di una tappa: un solo biglietto si apre subito, più biglietti si vedono in elenco
  window.AMS_openTickets = (nome, goDoc) => {
    const key = DOC_STOPS.find((k) => (nome || '').indexOf(k) === 0) || '';
    const mine = key ? docsCache.filter((d) => d.stop === key) : [];
    if (mine.length === 1) { openDoc(mine[0]); return; }
    docFilter = key; goDoc(); renderDocs();
  };
  $('#doc-add').addEventListener('click', () => $('#doc-file').click());
  $('#doc-file').addEventListener('change', async (e) => {
    const files = Array.from(e.target.files || []), msg = $('#doc-msg');
    if (msg) msg.textContent = '';
    let fatti = 0;
    for (const f of files) {
      const title = $('#doc-title').value.trim() || f.name.replace(/\.[^.]+$/, '') || 'Documento';
      try {
        if (!db) db = await openDb();
        // si salva il contenuto, non il File: su iPhone il File preso dal selettore non si lascia memorizzare
        const data = await f.arrayBuffer();
        await new Promise((ok, ko) => { const r = tx('readwrite').put({ id: newId(), title, type: f.type || 'application/octet-stream', data, stop: ($('#doc-stop') || {}).value || '', added: Date.now() }); r.onsuccess = ok; r.onerror = () => ko(r.error); });
        fatti++;
      } catch (err) {
        if (msg) msg.textContent = 'Non sono riuscito a salvare "' + f.name + '": ' + ((err && (err.message || err.name)) || 'errore sconosciuto') + '. Se il file è molto grande, prova con una foto o uno screenshot del biglietto.';
      }
    }
    if (fatti && msg) msg.textContent = fatti === 1 ? 'Documento salvato su questo telefono.' : fatti + ' documenti salvati su questo telefono.';
    $('#doc-title').value = ''; e.target.value = '';
    renderDocs();
  });
  openDb().then((d) => { db = d; renderDocs(); if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); }).catch(() => renderDocs());

  // ── Navigatore ──
  function buildDestinations() {
    const groups = [{ label: 'Hotel', items: [{ n: HOTEL.name, q: HOTEL.q }] }];
    $$('.screen').slice(0, 5).forEach((s) => {
      const day = ($('.day-hero-date', s) || {}).textContent || '';
      const items = [];
      $$('.tappa', s).forEach((t) => {
        const a = $('a[href*="maps.google.com/?q="]', t), nm = $('.tappa-name', t);
        if (!a || !nm) return;
        const q = decodeURIComponent(a.getAttribute('href').split('?q=')[1].replace(/\+/g, ' '));
        items.push({ n: nm.textContent.trim(), q });
      });
      if (items.length) groups.push({ label: day.trim(), items });
    });
    groups.push({ label: 'Luoghi famosi', items: FAMOUS.map((p) => ({ n: p.n, q: p.n + ' Amsterdam' })) });
    return groups;
  }
  (function initNav() {
    const sel = $('#nav-dest');
    const groups = buildDestinations();
    sel.innerHTML = groups.map((g, gi) => '<optgroup label="' + esc(g.label) + '">' + g.items.map((it, ii) => '<option value="' + gi + '.' + ii + '">' + esc(it.n) + '</option>').join('') + '</optgroup>').join('');
    $$('[data-mode]').forEach((b) => b.addEventListener('click', () => {
      const [gi, ii] = sel.value.split('.').map(Number);
      const dest = groups[gi].items[ii];
      window.open('https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(dest.q) + '&travelmode=' + b.dataset.mode, '_blank');
    }));
  })();

  // ── Punti da ricordare: foto scattata sul momento e posizione presa dal telefono ──
  let pdb = null, pinImg = null, pinShown = [];
  function openPinDb() {
    return new Promise((ok, ko) => {
      const rq = indexedDB.open('amsterdam-pins', 1);
      rq.onupgradeneeded = () => rq.result.createObjectStore('pins', { keyPath: 'id' });
      rq.onsuccess = () => ok(rq.result); rq.onerror = () => ko(rq.error);
    });
  }
  const ptx = (m) => pdb.transaction('pins', m).objectStore('pins');
  const pAll = () => new Promise((ok, ko) => { const r = ptx('readonly').getAll(); r.onsuccess = () => ok(r.result); r.onerror = () => ko(r.error); });
  const pPut = (v) => new Promise((ok, ko) => { const r = ptx('readwrite').put(v); r.onsuccess = ok; r.onerror = () => ko(r.error); });
  const pDel = (id) => new Promise((ok) => { const r = ptx('readwrite').delete(id); r.onsuccess = ok; r.onerror = ok; });

  // foto rimpicciolita: tiene il telefono leggero e non perde nulla di utile
  async function shrinkPhoto(file) {
    try {
      const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
      const k = Math.min(1, 1400 / Math.max(bmp.width, bmp.height));
      const c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
      c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
      const blob = await new Promise((ok) => c.toBlob(ok, 'image/jpeg', 0.82));
      if (blob) return { data: await blob.arrayBuffer(), type: 'image/jpeg' };
    } catch (e) { /* si salva l'originale */ }
    return { data: await file.arrayBuffer(), type: file.type || 'image/jpeg' };
  }
  // posizione: prima un tentativo veloce, poi uno preciso
  function locate() {
    return new Promise((ok) => {
      if (!navigator.geolocation) return ok(null);
      const fine = () => navigator.geolocation.getCurrentPosition((g) => ok(g), () => ok(null), { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
      navigator.geolocation.getCurrentPosition((g) => ok(g), (e) => { if (e && e.code === 1) ok(null); else fine(); }, { enableHighAccuracy: false, timeout: 8000, maximumAge: 120000 });
    });
  }
  const pinBlob = (p) => new Blob([p.photo], { type: p.ptype || 'image/jpeg' });
  const when = (ts) => new Date(ts).toLocaleString('it-IT', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  async function renderPins() {
    const box = $('#pin-list');
    if (!pdb) { box.innerHTML = '<div class="t-note">Il salvataggio dei punti non è disponibile in questo browser.</div>'; return; }
    pinShown = (await pAll()).sort((a, b) => b.ts - a.ts);
    if (!pinShown.length) { box.innerHTML = '<div class="t-title">I tuoi punti</div><div class="t-note">Nessun punto ancora. Quando vedi qualcosa da ricordare, scatta una foto e salvalo qui.</div>'; return; }
    box.innerHTML = '<div class="t-title">I tuoi punti (' + pinShown.length + ')</div>' + pinShown.map((p) => {
      const where = p.lat != null ? 'https://maps.google.com/?q=' + p.lat + ',' + p.lon : '';
      const route = p.lat != null ? 'https://www.google.com/maps/dir/?api=1&destination=' + p.lat + ',' + p.lon + '&travelmode=walking' : '';
      return '<div class="pin" data-id="' + p.id + '"><button class="pin-th" data-view="' + p.id + '" aria-label="Apri la foto">' + (p.photo ? '<img alt="" data-pth="' + p.id + '">' : '📌') + '</button>' +
        '<div class="pin-body"><div class="pin-name">' + esc(p.title || 'Punto senza nome') + '</div>' +
        '<div class="pin-sub">' + esc(when(p.ts)) + (p.lat == null ? ' · posizione non trovata' : '') + '</div>' + (p.note ? '<div class="pin-sub">' + esc(p.note) + '</div>' : '') +
        '<div class="pin-btns">' + (where ? '<a class="btn-m btn-dark" href="' + where + '" target="_blank">📍 Maps</a><a class="btn-m btn-yellow" href="' + route + '" target="_blank">🚶 Come arrivare</a>' : '') +
        '<button class="t-btn ghost small" data-pdel="' + p.id + '">Elimina</button></div></div></div>';
    }).join('');
    pinShown.forEach((p) => { const im = $('[data-pth="' + p.id + '"]', box); if (im) im.src = URL.createObjectURL(pinBlob(p)); });
    $$('[data-view]', box).forEach((b) => b.addEventListener('click', () => {
      const p = pinShown.find((x) => x.id === b.dataset.view);
      if (!p || !p.photo) return;
      $('#viewer-title').textContent = p.title || 'Punto'; $('#viewer-img').src = URL.createObjectURL(pinBlob(p)); $('#viewer').classList.add('open');
    }));
    $$('[data-pdel]', box).forEach((b) => b.addEventListener('click', async () => {
      if (!confirm('Eliminare questo punto dal telefono?')) return;
      await pDel(b.dataset.pdel); renderPins();
    }));
  }
  function setPinPhoto(file) {
    if (!file) return;
    pinImg = file;
    $('#pin-prev').innerHTML = '<img alt="Anteprima della foto">';
    $('#pin-prev img').src = URL.createObjectURL(file);
  }
  $('#pin-cam').addEventListener('click', () => $('#pin-file-cam').click());
  $('#pin-gal').addEventListener('click', () => $('#pin-file-gal').click());
  ['#pin-file-cam', '#pin-file-gal'].forEach((id) => $(id).addEventListener('change', (e) => { setPinPhoto((e.target.files || [])[0]); e.target.value = ''; }));
  function resetPin() { pinImg = null; $('#pin-prev').innerHTML = ''; $('#pin-title').value = ''; $('#pin-note').value = ''; $('#pin-pos').textContent = 'Posizione: la prendo da sola quando salvi.'; }
  $('#pin-clear').addEventListener('click', () => { resetPin(); $('#pin-msg').textContent = ''; });
  $('#pin-save').addEventListener('click', async () => {
    const msg = $('#pin-msg'), btn = $('#pin-save');
    if (!pdb) { msg.textContent = 'Il salvataggio non è disponibile in questo browser.'; return; }
    const title = $('#pin-title').value.trim();
    if (!title && !pinImg) { msg.textContent = 'Scrivi un nome o scatta una foto.'; return; }
    btn.disabled = true; msg.textContent = 'Cerco la posizione…'; $('#pin-pos').textContent = 'Cerco la posizione…';
    const g = await locate();
    let photo = null, ptype = '';
    try { if (pinImg) { const s = await shrinkPhoto(pinImg); photo = s.data; ptype = s.type; } } catch (e) { msg.textContent = 'Non riesco a leggere la foto: salvo il punto senza.'; }
    try {
      await pPut({ id: newId(), title, note: $('#pin-note').value.trim(), lat: g ? g.coords.latitude : null, lon: g ? g.coords.longitude : null, acc: g ? Math.round(g.coords.accuracy) : null, photo, ptype, ts: Date.now() });
      msg.textContent = g ? 'Punto salvato con la posizione (precisione circa ' + Math.round(g.coords.accuracy) + ' m).' : 'Punto salvato, ma senza posizione: controlla che la localizzazione sia attiva e permessa.';
      resetPin();
    } catch (e) { msg.textContent = 'Non sono riuscito a salvare: ' + ((e && (e.message || e.name)) || 'errore sconosciuto') + '.'; }
    btn.disabled = false;
    renderPins();
  });
  openPinDb().then((d) => { pdb = d; renderPins(); }).catch(() => renderPins());

  // ── Orari del bus 397 (tappa di martedì) ──
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-bus]');
    if (b) { e.preventDefault(); $('#bus-modal').classList.add('open'); }
  });
  $('#bus-close').addEventListener('click', () => $('#bus-modal').classList.remove('open'));

  // ── Torna al primo schermo quando si apre da un link con #strumenti ──
  if (location.hash === '#strumenti' && typeof showScreen === 'function') showScreen(6, false);
})();
