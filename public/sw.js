const CACHE_NAME = 'portfolio-v1.0.0';
const STATIC_CACHE_NAME = 'portfolio-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'portfolio-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.php',
  '/manifest.json',
  '/offline.html',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/lightgallery/2.7.1/css/lightgallery.min.css',
  'https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/lightgallery/2.7.1/lightgallery.min.js'
];

// Install event - cache static files
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Static files cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Error caching static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Serving from cache:', request.url);
          return cachedResponse;
        }

        // Otherwise fetch from network
        return fetch(request)
          .then(response => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache dynamic content
            caches.open(DYNAMIC_CACHE_NAME)
              .then(cache => {
                cache.put(request, responseToCache);
              });

            return response;
          })
          .catch(error => {
            console.log('Network request failed, serving offline page:', error);
            
            // If it's a navigation request, serve offline page
            if (request.mode === 'navigate') {
              return caches.match('/offline.html');
            }

            // For other requests, return a basic response
            return new Response('Offline content not available', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Background sync for contact form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'contact-form-sync') {
    console.log('Background sync triggered for contact form');
    event.waitUntil(syncContactForm());
  }
});

// Push notification handling
self.addEventListener('push', event => {
  console.log('Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Portfolio',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Portfolio Update', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('Notification clicked');
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper function for contact form sync
async function syncContactForm() {
  try {
    // Get pending form submissions from IndexedDB
    const pendingSubmissions = await getPendingSubmissions();
    
    for (const submission of pendingSubmissions) {
      try {
        const response = await fetch('/contact.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(submission)
        });

        if (response.ok) {
          console.log('Contact form synced successfully');
          await removePendingSubmission(submission.id);
        }
      } catch (error) {
        console.error('Error syncing contact form:', error);
      }
    }
  } catch (error) {
    console.error('Error in contact form sync:', error);
  }
}

// IndexedDB helper functions (simplified)
async function getPendingSubmissions() {
  // This would typically use IndexedDB
  // For now, return empty array
  return [];
}

async function removePendingSubmission(id) {
  // This would typically remove from IndexedDB
  console.log('Removing pending submission:', id);
}