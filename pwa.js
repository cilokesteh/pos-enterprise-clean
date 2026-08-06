/* Copyright © 2026 CilokTech (ciloktech.my.id) | Proprietary Software | Unauthorized copying/distribution prohibited | License: Commercial - Contact ciloktech.my.id */

// pwa.js v10 — register service worker + dynamic manifest
(function() {
  if (typeof STORE === 'undefined') return;
  var manifest = {
    name: STORE.name + ' POS',
    short_name: 'POS',
    description: 'POS Enterprise v10 — Toko HP, stok IMEI/SN, kasir scanner kamera, laporan.',
    start_url: './index.html?v=10',
    display: 'standalone',
    orientation: 'any',
    background_color: '#0a0a0b',
    theme_color: (typeof THEME !== 'undefined' && THEME.hex) ? THEME.hex : '#10b981',
    icons: [
      { src: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%2310b981%22/%3E%3Ctext x=%2250%22 y=%2265%22 font-size=%2250%22 text-anchor=%22middle%22 fill=%22white%22%3E%F0%9F%9B%92%3C/text%3E%3C/svg%3E', sizes: '192x192', type: 'image/svg+xml' }
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
      navigator.serviceWorker.register('sw.js?v=9').catch(function(e) {
        console.warn('SW register failed:', e);
      });
    });
  }
})();
