/* Service Worker — Constante de Catalan (PWA, funcionamiento offline) */
var CACHE = 'catalan-g-v1.0.3'; // versión de la app: la muestra el chip de index.html

var ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './favicon.ico',
  './icons/icon.svg',
  './icons/favicon-16.png',
  './icons/favicon-32.png',
  './icons/icon-48.png',
  './icons/icon-72.png',
  './icons/icon-96.png',
  './icons/icon-144.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (cache) {
      // Precacheado resiliente: un recurso que falte no rompe la instalación
      return Promise.all(ASSETS.map(function (url) {
        return cache.add(url).catch(function () {
          console.warn('[sw] No se pudo precachear:', url);
        });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      // Filtrar por prefijo propio: caches.keys() es global al origen y
      // sin este filtro se borraban las cachés del portal y demás apps.
      return Promise.all(keys.filter(function (k) { return k.startsWith('catalan-g-') && k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

// Consulta de versión desde la página: index.html pide la versión (CACHE) para su chip
self.addEventListener('message', function (e) {
  if (e.data && e.data.type === 'GET_VERSION') {
    var payload = { type: 'VERSION', version: CACHE };
    var port = e.ports && e.ports[0];
    if (port) {
      try { port.postMessage(payload); } catch (err) {}
    } else if (e.source) {
      try { e.source.postMessage(payload); } catch (err) {}
    }
  }
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
      if (hit) return hit;
      return fetch(e.request).then(function (resp) {
        if (resp && resp.status === 200 && resp.type === 'basic') {
          var clone = resp.clone();
          caches.open(CACHE).then(function (cache) { cache.put(e.request, clone); });
        }
        return resp;
      }).catch(function () {
        // Sin conexión: sirve la app para cualquier navegación pendiente
        if (e.request.mode === 'navigate') return caches.match('./index.html');
        return undefined;
      });
    })
  );
});
