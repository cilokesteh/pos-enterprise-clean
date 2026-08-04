# POS Enterprise v9 — Toko HP

POS clean rebuild, monolith 3046 lines, Firebase Auth + Firestore, ready for production.

## Fitur v9 Baru
- Camera Barcode Scanner (Html5Qrcode), Search+Filter Produk, Stock Moves Filter, History Pagination, Low Stock Banner, KB Shortcuts, IMEI Global Guard, Receipt QR

## Deploy
firebase login
firebase use pos-enterprise-9dde0
firebase deploy --only hosting,firestore

## Tests
node tests/dashboard-stock.test.js
node tests/stock-guards.test.js
node tests/v9-features.test.js

Version v9 2026-08-04 — Camera Scan + Filters + Pagination + IMEI Guard + QR

© 2026 ciloktech.my.id
