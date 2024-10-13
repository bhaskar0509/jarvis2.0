// Service Worker

const CACHE_NAME = 'jarvis-cache-v1'; // Name of the cache
const urlsToCache = [
  './index.html', // Cache the main HTML file
  './js/script.js', // Cache your main JavaScript file
  './css/styles.css', // Cache your CSS file (if you have one)
  './avatar.png', // Cache any images (update as needed)
  './giphy.gif', // Cache any images (update as needed)
  './jarvis.jpeg', // Cache any images (update as needed)
  './manifest.json' // Cache manifest
   // Cache any other images
  // Add any other assets you want to cache
];

// Install the Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching assets');
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
        return response || fetch(event.request)
          .catch(() => {
            // Fallback content can be served here
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html'); // Serve index.html for navigation requests
            }
          });
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
            console.log(`Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName); // Delete old caches
          }
        })
      );
    })
  );
});
