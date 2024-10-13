// sw.js
const CACHE_NAME = 'jarvis-cache-v1';
const urlsToCache = [
  '/jarvis2.0/',
  '/jarvis2.0/index.html',
  '/jarvis2.0/manifest.json',
  '/jarvis2.0/styles.css',
  '/jarvis2.0/js/script.js',
  '/jarvis2.0/images/icon.jpg',
  '/jarvis2.0/images/jarvis.jpg',
  // Add other assets to cache
];

self.addEventListener('install', (event) => {
  // Pre-cache the specified resources
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', (event) => {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Cache-first strategy: try to return cached response, fall back to network
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // Optionally cache the new fetched resource
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    }).catch(() => {
      // Fallback content if offline and not cached
      return caches.match('/jarvis2.0/index.html');
    })
  );
});
