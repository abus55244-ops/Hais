/* ============================================================
   HAIS Service Worker — Heritage Academic Intelligence System
   Update Strategy: Network-first, Cache fallback,
   ★ প্রম্পট-ভিত্তিক আপডেট (v8.0): নতুন ভার্সন আর নিজে নিজে চালু হয় না —
   পেজ থেকে ব্যবহারকারী "আপডেট করুন" চাপলে SKIP_WAITING বার্তা আসে,
   তখনই activate হয়। এতে টাইপ করার মাঝপথে জোরপূর্বক reload বন্ধ হলো।
   প্রতিবার নতুন version deploy হলে CACHE_VERSION বাড়িয়ে দিন
   ============================================================ */

const CACHE_VERSION = 'hais-v8.6';
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
// ★ আগে এখানে self.skipWaiting() ছিল — নতুন SW জোর করে সাথে সাথে দখল নিত।
//   এখন সে "waiting" অবস্থায় অপেক্ষা করে; ব্যবহারকারী অনুমতি দিলে তবেই চালু হয়।
self.addEventListener('install', event => {
  console.log('[SW] Installing HAIS Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching core files');
      return cache.addAll(CORE_FILES);
    })
  );
});

// ── পেজ থেকে "আপডেট করুন" বার্তা এলে তবেই দখল নাও ──
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
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
