// Copie hors ligne de l'appli CO Espoirs (version 2026-10-29T09:27:11.710Z).
const CACHE = "co-espoirs";
const FICHIERS = ["./", "manifest.webmanifest", "icone-192.png", "icone-512.png", "icone-512-masque.png", "apple-touch-icon.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FICHIERS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) { return; }
  if (url.pathname.endsWith("/version.json")) { return; }
  if (e.request.mode === "navigate" || url.pathname.endsWith("/") || url.pathname.endsWith("/index.html")) {
    // Toujours demander au serveur s'il y a plus récent (cache: "no-cache" : GitHub laisse sinon 10 min de copie).
    // Réseau lent (plus de 2 s) : la copie du téléphone tout de suite, la nouvelle version se range pour la prochaine fois.
    const reseau = fetch(e.request.url, { cache: "no-cache", credentials: "same-origin" }).then((r) => {
      if (r.ok) { const copie = r.clone(); e.waitUntil(caches.open(CACHE).then((c) => c.put("./", copie))); }
      return r;
    });
    e.respondWith(caches.match("./").then((copie) => {
      if (!copie) { return reseau; }
      const delai = new Promise((ok) => setTimeout(() => ok(copie), 2000));
      return Promise.race([reseau.catch(() => copie), delai]);
    }));
    return;
  }
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
