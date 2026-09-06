/* Copyright © 2026 CilokTech (ciloktech.my.id) | Proprietary Software | Unauthorized copying/distribution prohibited | License: Commercial - Contact ciloktech.my.id */

// sw.js — service worker v11.3 (network-first for app shell, never cache Firebase)
const CACHE = 'pos-clean-v36';
const ASSETS = [
  './',
  './index.html',
  './login.html',
  './config.js',
  './pwa.js',
  './manifest.json',
  './404.html'
];

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
  if (e.request.method !== 'GET') return;
  var url = e.request.url;
  if (/firestore\.googleapis\.com|identitytoolkit\.googleapis\.com|firebaseinstallations|fcm|gstatic\.com|cdnjs\.cloudflare\.com|cdn\.tailwindcss\.com|jsdelivr/.test(url)) return;
  if (!url.startsWith(self.location.origin) && !ASSETS.some(function(a) { return url.includes(a); })) {
    return;
  }
  e.respondWith(
    fetch(e.request).then(function(resp) {
      if (resp && resp.status === 200) {
        var clone = resp.clone();
        caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
      }
      return resp;
    }).catch(function() {
      return caches.match(e.request).then(function(cached) {
        return cached || caches.match('./404.html');
      });
    })
  );
});
