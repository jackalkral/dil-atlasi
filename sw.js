const CACHE_NAME = 'dil-atlasi-v33';
// Stil ve betik dosyaları index.html'de sürümlü adla (?v=…) istenir ve önbellekte de o adla durur. Böylece ağdan gelen yeni
// index.html hiçbir zaman eski önbellekteki CSS/JS ile karışmaz (v31'de karıştı: yeni sayfa eski stille açıldı, tema düğmesi çalışmadı).
// Sürüm dört yerde aynı olmalı: CACHE_NAME, APP_VERSION (app.js), index.html ?v= ve buradaki ?v= — içerik testi denetler.
const APP_SHELL = ['./', './index.html', './styles.css?v=v33', './app.js?v=v33', './theme.js?v=v33', './content/en.js?v=v33', './content/fr.js?v=v33', './content/it.js?v=v33', './content/de.js?v=v33', './content/media.js?v=v33', './content/emoji.js?v=v33', './content/freq-en.js?v=v33', './content/freq-fr.js?v=v33', './content/freq-it.js?v=v33', './content/freq-de.js?v=v33', './content/stories.js?v=v33', './fonts/inter-latin.woff2', './fonts/inter-latin-ext.woff2', './manifest.webmanifest', './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png'];

// Yeni sürüm kendiliğinden devreye girmez; sayfa "Yenile" onayıyla SKIP_WAITING gönderir.
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
