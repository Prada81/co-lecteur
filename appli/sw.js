// Copie hors ligne de l'appli CO Espoirs (version 2026-10-29T07:42:20.466Z).
const CACHE = "co-espoirs";
const FICHIERS = ["./", "manifest.webmanifest", "icone-192.png", "icone-512.png", "icone-512-masque.png", "apple-touch-icon.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FICHIERS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) { return; }
  if (url.pathname.endsWith("/version.json")) { return; }
  if (e.request.mode === "navigate" || url.pathname.endsWith("/") || url.pathname.endsWith("/index.html")) {
    e.respondWith(fetch(e.request).then((r) => { const copie = r.clone(); caches.open(CACHE).then((c) => c.put("./", copie)); return r; })
      .catch(() => caches.match("./")));
    return;
  }
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
