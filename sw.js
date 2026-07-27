/* Copyright © 2026 CilokTech (ciloktech.my.id) | Proprietary Software | Unauthorized copying/distribution prohibited | License: Commercial - Contact ciloktech.my.id */

// sw.js — service worker (cache-first for app shell, never cache Firebase)
const CACHE = 'pos-clean-v12';
const ASSETS = [
  './',
  './index.html',
  './login.html',
  './config.js',
  './pwa.js',
  'https://cdn.tailwindcss.com',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// Skip Firebase hosts
function isFirebaseHost(url) {
  return /firestore\.googleapis\.com|identitytoolkit\.googleapis\.com|firebase|googleapis\.com|gstatic\.com/.test(url);
}

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) {
      return c.addAll(ASSETS).catch(function() {});
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
  const url = e.request.url;
  if (isFirebaseHost(url)) return; // bypass, always network
  e.respondWith(
    caches.match(e.request).then(function(resp) {
      return resp || fetch(e.request).then(function(resp) {
        // Cache new resources
        if (resp && resp.status === 200 && e.request.method === 'GET') {
          const clone = resp.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
        }
        return resp;
      }).catch(function() { return resp; });
    })
  );
});