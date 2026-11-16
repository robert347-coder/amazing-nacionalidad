/* =========================================================================
   AMAZING NACIONALIDAD · sw.js (service worker)
   Guarda una copia de la app para que funcione sin internet.
   IMPORTANTE: cada vez que cambies el contenido, sube el número de VERSION
   (an-v1 → an-v2 …) para que los móviles descarguen la versión nueva.
   ========================================================================= */
const VERSION = "an-v1";
const ARCHIVOS = [
  "./", "index.html", "styles.css", "config.js", "ccse.js", "dele.js", "extras.js", "app.js",
  "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(claves => Promise.all(claves.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Primero la copia guardada; si no está, la descarga y la guarda.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    caches.match(e.request).then(guardado => guardado || fetch(e.request).then(resp => {
      const copia = resp.clone();
      caches.open(VERSION).then(c => c.put(e.request, copia));
      return resp;
    }))
  );
});
