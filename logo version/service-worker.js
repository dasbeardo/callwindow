const CACHE_NAME = 'callwindow-v1.0.0'; // Bump this version to force updates

const URLS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './areacodes.json',
  './logo.svg',
  './logo.png',
  './manifest.json'
];

// Install: cache everything needed for offline
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate: remove old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames.filter(name => name !== CACHE_NAME)
        .map(name => caches.delete(name))
    ))
  );
  self.clients.claim();
});

// Fetch: try network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Only handle GET requests for this site's origin
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Optionally update cache with fresh version
        if (event.request.url.endsWith('.json') ||
            event.request.url.endsWith('.js') ||
            event.request.url.endsWith('.css') ||
            event.request.url.endsWith('.html')) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request).then((response) => response || caches.match('./'))
      )
  );
});