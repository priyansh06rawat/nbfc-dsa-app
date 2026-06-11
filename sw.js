/* ============================================================
   India Shelter Home Loan — Service Worker (PWA Offline Support)
   ============================================================ */

const CACHE_NAME = 'india-shelter-home-loan-v1.0.2';
const CACHE_URLS = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/manifest.json',
  '/css/style.css',
  '/css/mobile.css',
  '/css/dashboard.css',
  '/js/app.js',
  '/js/dashboard.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap'
];

// ── Install: pre-cache all assets ──────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching assets...');
      // Cache what we can, skip failures (e.g. external fonts on first install)
      return Promise.allSettled(
        CACHE_URLS.map(url => cache.add(url).catch(() => {}))
      );
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: clean old caches ─────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// ── Fetch: Network-first for local, network-first with cache fallback for remote ─
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Local assets → network-first strategy
  if (url.origin === location.origin) {
    event.respondWith(
      fetch(request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => {
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          // Fallback to index.html for navigation requests
          if (request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
    );
    return;
  }

  // External resources (fonts, etc.) → network-first with cache fallback
  event.respondWith(
    fetch(request).then((response) => {
      if (response && response.status === 200) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
      }
      return response;
    }).catch(() => caches.match(request))
  );
});

// ── Background Sync (for lead submissions) ─────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-leads') {
    event.waitUntil(syncLeads());
  }
});

async function syncLeads() {
  console.log('[SW] Syncing pending leads...');
  // In production: flush IndexedDB pending queue to API
}

// ── Push Notifications ─────────────────────────────────────
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'India Shelter Home Loan';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-96.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'open' || !event.action) {
    const url = event.notification.data.url;
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        const client = clientList.find(c => c.url === url && 'focus' in c);
        return client ? client.focus() : clients.openWindow(url);
      })
    );
  }
});
