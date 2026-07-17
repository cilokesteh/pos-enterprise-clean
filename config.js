// ============================================================
// POS Enterprise Clean — Configuration
// Edit this file with your Firebase project credentials.
// ============================================================

// --- Firebase project config ---
// ISI dengan config dari Firebase Console > Project Settings > Web App.
// Untuk sekarang pakai placeholder — ganti setelah buat Firebase project.
const FIREBASE_CONFIG = {
  apiKey:            'REPLACE_WITH_YOUR_API_KEY',
  authDomain:        'REPLACE_WITH_YOUR_PROJECT.firebaseapp.com',
  projectId:         'REPLACE_WITH_YOUR_PROJECT_ID',
  storageBucket:     'REPLACE_WITH_YOUR_PROJECT.appspot.com',
  messagingSenderId: 'REPLACE_WITH_YOUR_SENDER_ID',
  appId:             'REPLACE_WITH_YOUR_APP_ID'
};

// --- Store identity ---
const STORE = {
  name:    'Toko HP',
  address: 'Jl. Contoh No. 1, Kota',
  phone:   '0812-0000-0000',
  // Footer nota
  footer:  'Terima kasih atas kunjungan Anda'
};

// --- Receipt / printer ---
const RECEIPT = {
  width: 80,        // mm — thermal paper width (58 / 80)
  copies: 1
};

// --- Firestore collections (prefix v3- untuk clean rebuild) ---
const COLLECTIONS = {
  products:      'v3-products',
  stockMoves:    'v3-stock-moves',
  transactions:  'v3-transactions',
  users:         'v3-users'
};

// --- Auth / roles ---
// Admin email (dapat akses semua). Email lain = kasir (kasir + history own + reprint).
const ADMIN_EMAIL = 'admin@tokohp.com';

// --- Theme ---
const THEME = {
  primary: 'emerald',  // Tailwind color base
  hex:     '#10b981'    // override hex
};