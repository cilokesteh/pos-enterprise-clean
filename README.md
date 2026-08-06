# POS Enterprise v10 — Toko HP

POS clean rebuild, monolith 3050+ lines, Firebase Auth + Firestore, ready for production.

## Fitur v10 Baru
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

Version v10 2026-08-06 — PDF Hybrid + Delete Product + XSS Hardening + SW v20

© 2026 ciloktech.my.id
