/* Copyright © 2026 CilokTech (ciloktech.my.id) | Proprietary Software | Unauthorized copying/distribution prohibited | License: Commercial - Contact ciloktech.my.id */

// sw.js — service worker v11.3 (cache-first for app shell, never cache Firebase)
const CACHE = 'pos-clean-v36';
const ASSETS = [
  './',
  './index.html',
  './login.html',
  './config.js',
  './pwa.js',
  './manifest.json'
];

function shouldBypass(url) {
  return /firestore\.googleapis\.com|identitytoolkit\.googleapis\.com/.test(url)
      || /fcm|firebase/.test(url) && url.includes('googleapis');
}

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) {
      return c.addAll(ASSETS).catch(function(err) { console.warn('SW cache addAll partial fail', err); });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  var url = e.request.url;
  if (/firestore\.googleapis\.com|identitytoolkit\.googleapis\.com|firebaseinstallations|fcm|gstatic\.com|cdnjs\.cloudflare\.com|cdn\.tailwindcss\.com/.test(url)) return;
  if (e.request.method !== 'GET') return;
  // Only cache same-origin GET
  if (!url.startsWith(self.location.origin) && !ASSETS.some(function(a){ return url.includes(a); })) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(resp) {
        if (resp && resp.status === 200) {
          var clone = resp.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
        }
        return resp;
      }).catch(function() { return cached; });
    })
  );
});
