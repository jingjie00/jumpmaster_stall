
const cacheName = 'cache-v1';
const precacheResources = [
  '/',
  'index.html',
  'product.html',
  'cart.html',
  'upcoming.html',
  'images/products/pro9.jpg',
  'images/products/fivestar.jpg',
  'images/products/pro10.jpg',
  'images/products/pro11.jpg',
  'images/products/pro12.jpg',
  'images/products/pro13.jpg',
  'images/products/pro14.jpg',
  'images/products/pro15.jpg',
  'images/products/pro16.jpg',
  'images/products/pro17.jpg',
  'images/products/pro18.jpg',
  'images/products/pro19.jpg',
  'images/products/pro20.jpg',
  'css/style.css',
  'js/user.js'
];

self.addEventListener('install', event => {
  console.log('Service worker install event!');
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll(precacheResources);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Service worker activate event!');
});

self.addEventListener('fetch', event => {
  console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(caches.match(event.request)
    .then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});


// TODO 2.6 - Handle the notificationclose event
self.addEventListener('notificationclose', event => {
  const notification = event.notification;
  const primaryKey = notification.data.primaryKey;

  console.log('Closed notification: ' + primaryKey);
});

// TODO 2.7 - Handle the notificationclick event
self.addEventListener('notificationclick', event => {
  const notification = event.notification;
  const action = event.action;

  if (action === 'close') {
    notification.close();
  } else {
    clients.openWindow('product.html');
    notification.close();
  }

  // TODO 5.3 - close all notifications when one is clicked
});


// TODO 3.1 - add push event listener
self.addEventListener('push', event => {
  const options = {
    body: 'Pushing an Egg Tart From Us to You!',
    icon: 'images/products/pro14.jpg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore', title: 'Go to the site',
        icon: 'images/checkmark.png'
      },
      {
        action: 'close', title: 'Close the notification',
        icon: 'images/xmark.png'
      },
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});


