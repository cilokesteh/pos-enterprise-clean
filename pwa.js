/* Copyright © 2026 CilokTech (ciloktech.my.id) | Proprietary Software | Unauthorized copying/distribution prohibited | License: Commercial - Contact ciloktech.my.id */

// pwa.js v11.2 — register service worker + dynamic manifest
(function() {
  if (typeof STORE === 'undefined') return;
  var manifest = {
    name: STORE.name + ' POS',
    short_name: 'POS',
    description: 'POS Enterprise v11.2 — Toko HP, stok IMEI/SN, kasir dengan scanner hardware, laporan, dan offline sync.',
    start_url: './index.html?v=11.2',
    display: 'standalone',
    orientation: 'any',
    background_color: '#0a0a0b',
    theme_color: (typeof THEME !== 'undefined' && THEME.hex) ? THEME.hex : '#10b981',
    icons: [
      { src: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%2310b981%22/%3E%3Cpath d=%22M22 25h9l5 31h38l9-23H34M42 71a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm35 0a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z%22 fill=%22none%22 stroke=%22%23fff%22 stroke-width=%226%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/%3E%3C/svg%3E', sizes: '192x192', type: 'image/svg+xml' }
    ]
  };
  try {
    var blob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
    var link = document.createElement('link');
    link.rel = 'manifest';
    link.href = URL.createObjectURL(blob);
    document.head.appendChild(link);
  } catch(e) {}
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('sw.js?v=35').catch(function(e) {
        console.warn('SW register failed:', e);
      });
    });
  }
})();
