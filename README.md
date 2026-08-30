# POS Enterprise v11.2 — Toko HP

POS clean rebuild, Firebase Auth + Firestore, ready for production.

## Fitur v11.2 Baru
- **Mobile navigation** — bottom bar 4 aksi utama, safe-area aware, sidebar tetap untuk menu lengkap
- **Responsive dashboard** — KPI dan status stok lebih ringkas, tabel punya petunjuk horizontal scroll
- **Accessible interactions** — pinch zoom aktif, skip link, focus-visible, reduced motion, ARIA dialog/toast, touch target ≥44px
- **Polished login** — mengikuti accent pilihan, password visibility, label dan error announcement yang aksesibel

## Fitur v11 Baru (upgrade value 3,5jt)
- **Garansi IMEI** — tracking garansi otomatis saat HP/Tablet/Laptop terjual (1 tahun default), status aktif/akan-expired/expired/klaim, klaim & selesai 1-klik, filter + export Excel
- **Offline mode penuh** — Firestore persistence (synchronizeTabs), transaksi jalan tanpa internet, sync otomatis pas online, indikator Online/Offline di sidebar

## Fitur v10 (sebelumnya)
- **Hapus Produk** (guard: stok harus 0) — bersihkan daftar produk usang
- **PDF Hybrid** — fallback text-PDF kalau html2canvas blank di PWA/WebView (fix struk blank)
- **XSS hardening** — esc() di semua titik render data user (scan result, laporan, dashboard, history)
- **Low stock banner** — dismiss persisten (localStorage)
- **History** — load cap naik 100 → 200 transaksi
- **Version bump** v9 → v10, SW cache pos-clean-v20

## Fitur v9 (sebelumnya)
- Camera Barcode Scanner (Html5Qrcode), Search+Filter Produk, Stock Moves Filter, History Pagination, Low Stock Banner, KB Shortcuts, IMEI Global Guard, Receipt QR

## Deploy
firebase login
firebase use pos-enterprise-9dde0
firebase deploy --only hosting,firestore

## Tests
node tests/dashboard-stock.test.js
node tests/stock-guards.test.js
node tests/v9-features.test.js

Version v11.2 2026-08-30 — UI/UX polish desktop/mobile + accessibility + SW v35

© 2026 ciloktech.my.id
