const CACHE_NAME = 'boids-algo-v1';
const ASSETS = [
    '/Boids-Algo/',
    '/Boids-Algo/index.html',
    '/Boids-Algo/manifest.json',
    '/Boids-Algo/sw.js',
    '/Boids-Algo/icons/icon-128x128.png',
    '/Boids-Algo/icons/icon-512x512.png'
];


self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});

// Handle notifications
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    clients.openWindow('/');
});

self.addEventListener('push', (event) => {
    if (event.data) {
        event.waitUntil(
            self.registration.showNotification(event.data.title, {
                body: event.data.message,
                icon: '/icons/icon-192x192.png'
            })
        );
    }
});

// Check for timers periodically
setInterval(checkTimers, 60000); // Check every minute

function checkTimers() {
    const savedTimer = JSON.parse(localStorage.getItem('currentTimer'));
    
    if (savedTimer) {
        const now = new Date().getTime();
        const timeLeft = savedTimer.expiration - now;
        
        if (timeLeft <= 0) {
            showNotification({
                title: 'Final Alert',
                message: `Your ${savedTimer.line} train to ${savedTimer.destination} is departing now!`
            });
        }
    }
}

function showNotification(options) {
    self.registration.showNotification(options.title, {
        body: options.body,
        icon: '/icons/icon-192x192.png'
    });
}