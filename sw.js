/* Copyright © 2026 CilokTech (ciloktech.my.id) | Proprietary Software | Unauthorized copying/distribution prohibited | License: Commercial - Contact ciloktech.my.id */

// sw.js — service worker v9 (cache-first for app shell, never cache Firebase)
const CACHE = 'pos-clean-v19';
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
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
  'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
];

function isFirebaseHost(url) {
  return /firestore\.googleapis\.com|identitytoolkit\.googleapis\.com|firebase|googleapis\.com|gstatic\.com|unpkg\.com|cdnjs\.cloudflare/.test(url) ? false : false;
}
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
  if (/firestore\.googleapis\.com|identitytoolkit\.googleapis\.com|firebaseinstallations|fcm/.test(url)) return;
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
