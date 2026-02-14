// SwaraSutra Service Worker v1.0
const CACHE_NAME = 'swarasutra-v1';
const STATIC_CACHE = 'swarasutra-static-v1';
const DYNAMIC_CACHE = 'swarasutra-dynamic-v1';

// Files to pre-cache on install
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/manifest.json',
];

// Install event: pre-cache essential resources
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker v1.0');
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            return cache.addAll(PRECACHE_URLS);
        }).then(() => {
            // Force the waiting service worker to become active
            return self.skipWaiting();
        })
    );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker v1.0');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
                    .map((name) => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => {
            // Take control of all clients immediately
            return self.clients.claim();
        })
    );
});

// Fetch event: serve from cache with network fallback
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip cross-origin requests except for fonts and CDN assets
    if (url.origin !== self.location.origin) {
        // Cache Google Fonts
        if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
            event.respondWith(
                caches.match(request).then((cached) => {
                    return cached || fetch(request).then((response) => {
                        const clone = response.clone();
                        caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
                        return response;
                    });
                })
            );
            return;
        }
        // Don't cache API calls (Gemini API, etc)
        return;
    }

    // For navigation requests (HTML pages), use network-first
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const clone = response.clone();
                    caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
                    return response;
                })
                .catch(() => {
                    return caches.match(request).then((cached) => {
                        return cached || caches.match('/');
                    });
                })
        );
        return;
    }

    // For static assets (JS, CSS, images), use cache-first
    if (
        url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|webp|woff2?|ttf|eot|ico)$/) ||
        url.pathname.startsWith('/assets/')
    ) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached;
                return fetch(request).then((response) => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
                    }
                    return response;
                });
            })
        );
        return;
    }

    // Default: network-first for everything else
    event.respondWith(
        fetch(request)
            .then((response) => {
                if (response.ok) {
                    const clone = response.clone();
                    caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
                }
                return response;
            })
            .catch(() => caches.match(request))
    );
});

// Listen for messages from the app
self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
