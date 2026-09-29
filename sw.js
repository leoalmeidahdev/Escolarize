/**
 * Escolarize — Service Worker
 * Cache básico da estrutura principal para permitir funcionamento offline.
 * O site funciona normalmente sem a instalação como PWA; o SW é apenas um
 * reforço de performance/offline.
 */

// Incrementar a versão sempre que CSS/JS mudarem: o fetch é cache-first e o
// cache antigo é apagado no activate.
const CACHE_NAME = "escolarize-cache-v9";

const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./css/responsive.css",
  "./js/storage.js",
  "./js/mockData.js",
  "./js/components.js",
  "./js/map.js",
  "./js/mapView.js",
  "./js/welcome.js",
  "./js/home.js",
  "./js/schools.js",
  "./js/rides.js",
  "./js/schedule.js",
  "./js/profile.js",
  "./js/navigation.js",
  "./js/app.js",
  "./data/schools.js",
  "./assets/icons/favicon.svg",
  "./assets/icons/icon-192.svg",
  "./assets/icons/icon-512.svg",
  // biblioteca de mapa local: a interface do mapa abre offline
  // (apenas os tiles do OpenStreetMap exigem conexão)
  "./assets/vendor/leaflet/leaflet.css",
  "./assets/vendor/leaflet/leaflet.js",
  "./assets/vendor/leaflet/images/marker-icon.png",
  "./assets/vendor/leaflet/images/marker-icon-2x.png",
  "./assets/vendor/leaflet/images/marker-shadow.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET" || !request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          if (request.mode === "navigate") {
            return caches.match("./index.html");
          }
          return undefined;
        });
    })
  );
});
