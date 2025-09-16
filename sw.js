const CACHE_NAME = 'weather-forecast-v1';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll([
                '/',
                '/weather.js',
                '/weather.css',
                '/manifest.json',
                '/icon512.png'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    if (event.request.url.includes('weather.php')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request).then(cachedResponse => {
                        return cachedResponse || new Response(JSON.stringify({ error: 'Offline mode' }), {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
                })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                return cachedResponse || fetch(event.request);
            })
        );
    }
});