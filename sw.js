const CACHE = 'mapa-medita-v1';

const ASSETS = [
  '/meditacion/',
  '/meditacion/index.html',
  '/meditacion/apple-touch-icon.png',
  '/meditacion/manifest.json',
  '/meditacion/meditacion_agradecer.mpeg',
  '/meditacion/meditacion_dormir.mpeg',
  '/meditacion/meditacion_perdonar.mpeg',
  '/meditacion/meditacion_respirar.mpeg',
  '/meditacion/meditacion_visualizar.mpeg'
];

// Instalar — guarda todo en caché
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activar — elimina cachés viejas
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — sirve desde caché, si no hay red falla silenciosamente
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        // Guardar nuevas respuestas en caché
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});