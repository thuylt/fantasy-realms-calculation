var APP_PREFIX = 'fantasy-realms-';
var VERSION = '1.0';
var CACHE_NAME = APP_PREFIX + VERSION;
var URLS = [
  '/fantasy-realms/',
  '/fantasy-realms/index.html',
  '/fantasy-realms/manifest.json',
  '/fantasy-realms/favicon.ico',
  '/fantasy-realms/img/fantasy-realms.jpg',
  '/fantasy-realms/img/background.jpg',
  '/fantasy-realms/img/cursed-hoard.png',
  '/fantasy-realms/img/wizkids.png',
  '/fantasy-realms/css/style.css',
  '/fantasy-realms/css/bootstrap.min.css',
  '/fantasy-realms/service-worker.js',
  '/fantasy-realms/js/app.js',
  '/fantasy-realms/js/deck.js',
  '/fantasy-realms/js/discard.js',
  '/fantasy-realms/js/hand.js',
  '/fantasy-realms/js/bootstrap.bundle.min.js',
  '/fantasy-realms/js/handlebars.min-v4.7.7.js',
  '/fantasy-realms/js/jquery-3.6.0.min.js',
  '/fantasy-realms/sound/clear.mp3',
  '/fantasy-realms/sound/click.mp3',
  '/fantasy-realms/sound/magic.mp3',
  '/fantasy-realms/sound/swoosh.mp3',
  '/fantasy-realms/browserconfig.xml',
  '/fantasy-realms/icons/android-icon-144x144.png',
  '/fantasy-realms/icons/android-icon-192x192.png',
  '/fantasy-realms/icons/android-icon-36x36.png',
  '/fantasy-realms/icons/android-icon-48x48.png',
  '/fantasy-realms/icons/android-icon-72x72.png',
  '/fantasy-realms/icons/android-icon-96x96.png',
  '/fantasy-realms/icons/apple-icon-114x114.png',
  '/fantasy-realms/icons/apple-icon-120x120.png',
  '/fantasy-realms/icons/apple-icon-144x144.png',
  '/fantasy-realms/icons/apple-icon-152x152.png',
  '/fantasy-realms/icons/apple-icon-180x180.png',
  '/fantasy-realms/icons/apple-icon-57x57.png',
  '/fantasy-realms/icons/apple-icon-60x60.png',
  '/fantasy-realms/icons/apple-icon-72x72.png',
  '/fantasy-realms/icons/apple-icon-76x76.png',
  '/fantasy-realms/icons/apple-icon-precomposed.png',
  '/fantasy-realms/icons/apple-icon.png',
  '/fantasy-realms/icons/favicon-16x16.png',
  '/fantasy-realms/icons/favicon-32x32.png',
  '/fantasy-realms/icons/favicon-96x96.png',
  '/fantasy-realms/icons/ms-icon-144x144.png',
  '/fantasy-realms/icons/ms-icon-150x150.png',
  '/fantasy-realms/icons/ms-icon-310x310.png',
  '/fantasy-realms/icons/ms-icon-70x70.png'
];

self.addEventListener('fetch', function (e) {
  console.log('fetch request: ' + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) {
        console.log('responding with cache: ' + e.request.url);
        return request;
      } else {
        console.log('file is not cached, fetching: ' + e.request.url);
        return fetch(e.request);
      }
    })
  );
});

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache: ' + CACHE_NAME)
      return cache.addAll(URLS);
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      cacheWhitelist.push(CACHE_NAME);
      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('deleting cache: ' + keyList[i]);
          return caches.delete(keyList[i]);
        }
      }));
    })
  );
});
