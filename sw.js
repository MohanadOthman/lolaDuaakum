/* ═══════════════════════════════════════════════════════════
   SERVICE WORKER — لولا دعاؤكم PWA
   Strategy: Cache First for assets, Network First for JSON data
   ═══════════════════════════════════════════════════════════ */

const CACHE_NAME = 'lda-v1';
const DATA_CACHE = 'lda-data-v1';

// Core shell files — cached on install
const SHELL_FILES = [
  '/',
  '/index.html',
  '/kharita.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// Data files — cached with network-first strategy
const DATA_FILES = [
  '/data/duas.json',
  '/data/adkar.json',
  '/data/adab-mawadi3.json',
  '/data/kharita-adkar.json',
];

// External fonts — cache on first use
const FONT_ORIGINS = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
];

// ── INSTALL ──────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(SHELL_FILES))
      .then(() => self.skipWaiting())
      .catch(err => console.warn('[SW] Install cache partial failure:', err))
  );
});

// ── ACTIVATE ─────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== DATA_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH ────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET and chrome-extension requests
  if (event.request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // ① hisnmuslim.com API — Network first, fallback to cache
  if (url.hostname === 'hisnmuslim.com' || url.hostname === 'www.hisnmuslim.com') {
    event.respondWith(networkFirstWithCache(event.request, DATA_CACHE));
    return;
  }

  // ② Local JSON data files — Network first, fallback to cache
  if (url.pathname.startsWith('/data/') && url.pathname.endsWith('.json')) {
    event.respondWith(networkFirstWithCache(event.request, DATA_CACHE));
    return;
  }

  // ③ Google Fonts — Cache first (they rarely change)
  if (FONT_ORIGINS.some(origin => url.href.startsWith(origin))) {
    event.respondWith(cacheFirstWithNetwork(event.request, CACHE_NAME));
    return;
  }

  // ④ Audio files (MP3) — Network only with no SW interference
  if (url.pathname.endsWith('.mp3') || url.pathname.endsWith('.ogg')) {
    return; // Let browser handle audio normally
  }

  // ⑤ App shell & local assets — Cache first
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirstWithNetwork(event.request, CACHE_NAME));
    return;
  }
});

// ── STRATEGIES ───────────────────────────────────────────

// Network first: try network, if offline return cache
async function networkFirstWithCache(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Return offline fallback for JSON
    return new Response(
      JSON.stringify({ error: 'offline', message: 'لا يوجد اتصال بالإنترنت' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Cache first: serve from cache, update cache in background
async function cacheFirstWithNetwork(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) {
    // Background refresh (stale-while-revalidate)
    fetch(request).then(response => {
      if (response && response.ok) {
        caches.open(cacheName).then(cache => cache.put(request, response));
      }
    }).catch(() => {});
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

// ── BACKGROUND SYNC ──────────────────────────────────────
// Handle shortcut URLs from manifest
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CACHE_DATA') {
    caches.open(DATA_CACHE).then(cache => {
      DATA_FILES.forEach(url => {
        fetch(url).then(r => { if (r.ok) cache.put(url, r); }).catch(() => {});
      });
    });
  }
});
