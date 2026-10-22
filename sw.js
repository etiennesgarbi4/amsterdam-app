// Cache per l'uso offline. Cambiare VERSION a ogni modifica dei file.
const VERSION = 'amsterdam-v68';
const CORE = ['./', 'index.html', 'tools.css', 'itin.css', 'itin.js', 'itin-data.js', 'tools.js', 'data-osm.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png', 'img/vangogh.webp', 'img/moco.webp', 'img/heineken.webp', 'img/adam.webp', 'img/rembrandtplein.webp', 'img/vondelpark.webp', 'img/bloemenmarkt.webp', 'img/dam.webp', 'img/begijnhof.webp', 'img/magerebrug.webp', 'img/oudekerk.webp', 'img/albertcuyp.webp', 'img/centraal.webp', 'img/brouwerij.webp', 'img/waterlooplein.webp', 'img/jordaan.webp', 'img/acostar.webp', 'img/schiphol.webp', 'img/albertheijn.webp', 'img/smokeboat.webp', 'img/dampkring.webp', 'img/paradox.webp', 'img/bulldog.webp', 'img/greenhouse.webp', 'img/doggohouse.webp', 'img/hillstreetblues.webp', 'img/barneys.webp', 'img/jazzalto.webp', 'img/tyson.webp', 'img/boerejongens.webp', 'img/redlight.webp'];

// Alla prima installazione i file si scaricano sempre dalla rete (cache: 'reload'), mai dalla memoria temporanea del browser
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION)
      .then((c) => Promise.all(CORE.map((u) => fetch(new Request(u, { cache: 'reload' })).then((r) => { if (!r.ok) throw new Error(u); return c.put(u, r); }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// File dell'app: prima la rete (così gli aggiornamenti arrivano subito), se manca o è lenta la copia salvata
async function networkFirst(req) {
  const cache = await caches.open(VERSION);
  const key = req.mode === 'navigate' ? 'index.html' : req;
  try {
    const res = await Promise.race([
      fetch(req, { cache: 'no-cache' }),
      new Promise((_, no) => setTimeout(() => no(new Error('lento')), 4000)),
    ]);
    if (res && res.ok) cache.put(key, res.clone());
    return res;
  } catch (err) {
    return (await cache.match(key)) || Response.error();
  }
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) { e.respondWith(networkFirst(req)); return; }
  // font di Google: prima la copia salvata
  if (/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(VERSION).then((c) => c.put(req, copy));
      return res;
    })));
  }
});
