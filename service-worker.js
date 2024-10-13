// Define the cache name and list of files to cache
const CACHE_NAME = 'jarvis-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './js/script.js',
  './style.css',
  './images/avatar.png',
  './images/giphy.gif',
  './images/jarvis.jpeg',
  './images/iron_man.jpg',
  './manifest.json'
];

// Install the Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache); // Add files to the cache
      })
  );
});

// Fetch event: Serve files from cache first, then network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return the cached response if available, otherwise fetch from the network
        return response || fetch(event.request);
      })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]; // List of caches to keep
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName); // Delete old caches
          }
        })
      );
    })
  );
});
