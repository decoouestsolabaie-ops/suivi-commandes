var CACHE = 'eco-ouest-v1';
var FILES = [
  './',
  './index.html',
  './anatole.html',
  './artiom.html',
  './antonio.html'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) { return c.addAll(FILES); })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) {
      return r || fetch(e.request);
    })
  );
});
