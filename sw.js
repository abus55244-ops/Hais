/* ============================================================
   HAIS Service Worker — Heritage Academic Intelligence System
   Auto-Update Strategy: Network-first, Cache fallback
   প্রতিবার নতুন version deploy হলে CACHE_VERSION বাড়িয়ে দিন
   ============================================================ */

const CACHE_VERSION = 'hais-v7.1';
const CACHE_NAME = `hais-cache-${CACHE_VERSION}`;

const CORE_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-72.png',
  './icon-96.png',
  './icon-128.png',
  './icon-144.png',
  './icon-152.png',
  './icon-192.png',
  './icon-512.png',
  './favicon.ico'
];

// ── Install: core ফাইলগুলো cache করো ──
self.addEventListener('install', event => {
  console.log('[SW] Installing HAIS Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching core files');
      return cache.addAll(CORE_FILES);
    }).then(() => {
      // নতুন SW সাথে সাথে activate হবে, পুরনো কে অপেক্ষা করাবে না
      return self.skipWaiting();
    })
  );
});

// ── Activate: পুরনো cache মুছে দাও ──
self.addEventListener('activate', event => {
  console.log('[SW] Activating new Service Worker...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name.startsWith('hais-cache-') && name !== CACHE_NAME)
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      // সমস্ত client কে এখনই নতুন SW দিয়ে নিয়ন্ত্রণ করো
      return self.clients.claim();
    }).then(() => {
      // সব খোলা tab কে reload করার নির্দেশ দাও
      return self.clients.matchAll({ type: 'window' }).then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'SW_UPDATED', version: CACHE_VERSION });
        });
      });
    })
  );
});

// ── Fetch: Network-first strategy ──
// প্রথমে network থেকে আনার চেষ্টা করো (সবসময় latest পাবে)
// Network না পেলে cache থেকে দাও (offline কাজ করবে)
self.addEventListener('fetch', event => {
  // Firebase ও CDN request গুলো সরাসরি network এ পাঠাও
  if (
    event.request.url.includes('firebaseio.com') ||
    event.request.url.includes('googleapis.com') ||
    event.request.url.includes('cdnjs.cloudflare.com') ||
    event.request.url.includes('generativelanguage.googleapis.com') ||
    event.request.url.includes('gstatic.com')
  ) {
    return; // SW handle করবে না
  }

  event.respondWith(
    fetch(event.request, { cache: 'no-store' })
      .then(networkResponse => {
        // Network থেকে পেলে cache আপডেট করো
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Network নেই? Cache থেকে দাও
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Cache-ও নেই? index.html দাও (SPA fallback)
          return caches.match('./index.html');
        });
      })
  );
});
