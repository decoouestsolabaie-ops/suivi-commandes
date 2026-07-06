// Service Worker - pas de cache pour les données
var CACHE = 'eco-ouest-v2';
var STATIC_FILES = [
  './index.html',
  './anatole.html',
  './artiom.html',
  './antonio.html',
  './vincent.html',
  './lamri.html'
];

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function(c) { return c.addAll(STATIC_FILES); })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    // Supprimer les anciens caches
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  var url = e.request.url;
  // Ne JAMAIS mettre en cache les appels à la Web App Google
  if (url.includes('script.google.com') || url.includes('googleapis.com')) {
    e.respondWith(fetch(e.request));
    return;
  }
  // Pour les fichiers HTML : toujours essayer le réseau d'abord
  if (url.endsWith('.html') || url.endsWith('/')) {
    e.respondWith(
      fetch(e.request).catch(function() { return caches.match(e.request); })
    );
    return;
  }
  // Pour le reste : cache puis réseau
  e.respondWith(
    caches.match(e.request).then(function(r) { return r || fetch(e.request); })
  );
});
