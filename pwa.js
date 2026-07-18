// pwa.js — register service worker + dynamic manifest
(function() {
  if (typeof STORE === 'undefined') return;

  // Dynamic manifest
  const manifest = {
    name: STORE.name + ' POS',
    short_name: 'POS',
    description: 'POS Enterprise — Toko HP, stok IMEI/SN, kasir scanner, laporan.',
    start_url: './index.html',
    display: 'standalone',
    orientation: 'any',
    background_color: '#0a0a0b',
    theme_color: THEME && THEME.hex ? THEME.hex : '#10b981',
    icons: []
  };
  const blob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
  const link = document.createElement('link');
  link.rel = 'manifest';
  link.href = URL.createObjectURL(blob);
  document.head.appendChild(link);

  // Register SW
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('sw.js?v=4').catch(function(e) {
        console.warn('SW register failed:', e);
      });
    });
  }
})();