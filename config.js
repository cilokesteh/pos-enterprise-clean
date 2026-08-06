/* Copyright © 2026 CilokTech (ciloktech.my.id) | Proprietary Software | Unauthorized copying/distribution prohibited | License: Commercial - Contact ciloktech.my.id */

// ============================================================
// POS Enterprise Clean — Configuration
// Edit this file with your Firebase project credentials.
// ============================================================

// --- Firebase project config ---
// ISI dengan config dari Firebase Console > Project Settings > Web App.
// Untuk sekarang pakai placeholder — ganti setelah buat Firebase project.
const FIREBASE_CONFIG = {
  apiKey:            'AIzaSyDpH1Svxj5GhYr6Pf-PXOf4UReLXCF6p3Y',
  authDomain:        'pos-enterprise-37856.firebaseapp.com',
  projectId:         'pos-enterprise-37856',
  storageBucket:     'pos-enterprise-37856.firebasestorage.app',
  messagingSenderId: '1053332732202',
  appId:             '1:1053332732202:web:5c62f6751f5cca6be70653'
};

// --- Store identity ---
const STORE = {
  name:    'Toko HP',
  address: 'Jl. Contoh No. 1, Kota',
  phone:   '0812-0000-0000',
  hours:   'Senin - Sabtu: 08.00 - 17.00',
  wa:      '0812-0000-0000',
  instagram: '@tokohp',
  facebook:  'Toko HP Official',
  tiktok:    '@tokohp',
  website:   'www.tokohp.com',
  // Footer nota
  footer:  'Terima kasih atas kunjungan Anda'
};

// --- Receipt / printer ---
const RECEIPT = {
  width: 80,        // mm — thermal paper width (57 / 80)
  copies: 1
};

// --- Firestore collections (prefix v3- untuk clean rebuild) ---
const COLLECTIONS = {
  products:      'v3-products',
  stockMoves:    'v3-stock-moves',
  transactions:  'v3-transactions',
  users:         'v3-users',
  garansi:       'v3-garansi'
};

// --- Auth / roles ---
// Admin email (dapat akses semua). Email lain = kasir (kasir + history own + reprint).
const ADMIN_EMAIL = 'Admin@enterprise.com';

// --- Theme ---
const THEME = {
  primary: 'emerald',  // Tailwind color base
  hex:     '#10b981'    // override hex
};