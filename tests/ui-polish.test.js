const fs = require('fs');
const assert = require('assert');

const index = fs.readFileSync('index.html', 'utf8');
const login = fs.readFileSync('login.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
const pwa = fs.readFileSync('pwa.js', 'utf8');

function ok(condition, message) {
  assert.ok(condition, message);
  console.log('✓ ' + message);
}

ok(!/user-scalable\s*=\s*no/i.test(index), 'pinch zoom is not disabled');
ok(!/maximum-scale\s*=\s*1(?:\.0)?/i.test(index), 'viewport does not cap zoom');
ok(/href="#main-content"[^>]*class="skip-link"/.test(index), 'app has a keyboard skip link');
ok(/id="main-content"/.test(index), 'main content has a skip-link target');
ok(/id="mobile-tabbar"/.test(index), 'mobile app has a bottom navigation bar');
ok((index.match(/class="mobile-nav-btn/g) || []).length === 4, 'mobile bottom navigation is limited to 4 primary actions');
ok(/\.mobile-nav-btn\.active/.test(index), 'mobile navigation has a visible active state');
ok(/focus-visible/.test(index), 'app defines visible keyboard focus styles');
ok(/prefers-reduced-motion:\s*reduce/.test(index), 'app respects reduced-motion preference');
ok(/id="toast-region"[^>]*aria-live="polite"/.test(index), 'toast updates use an aria-live region');
ok(/function enhanceModalA11y\(/.test(index), 'dynamic modals receive accessible dialog behavior');
ok((index.match(/enhanceModalA11y\('/g) || []).length === 4, 'all 4 dynamic modals use accessibility enhancement');
ok(/var _modalFocusStack = \[\]/.test(index), 'modal focus restoration supports nested dialogs');
ok(/backdrop\.addEventListener\('keydown'/.test(index), 'dynamic modals trap keyboard focus');
ok(/for=\\?"pay-method\\?"/.test(index) && /for=\\?"sm-product\\?"/.test(index), 'dynamic modal labels are associated with controls');
ok(/aria-labelledby=\\?"sm-imei-label\\?"/.test(index), 'generated IMEI fields reference their visible label');
ok(!/focus:outline-none/.test(index + login), 'focus outlines are not suppressed by utilities');
ok(/aria-expanded/.test(index), 'expandable controls expose expanded state');
ok(/overscroll-behavior:\s*contain/.test(index), 'drawers and modals contain overscroll');
ok(!/\.nav-btn\s*\{[^}]*transition:\s*all/s.test(index), 'navigation avoids transition-all');
ok(/placeholder="Cari nama, kategori, brand, atau IMEI…"/.test(index), 'product search uses professional copy without emoji');
ok(/placeholder="Scan barcode atau ketik IMEI\/SN…"/.test(index), 'scanner placeholder uses a typographic ellipsis');

ok(/name="email"/.test(login) && /name="password"/.test(login), 'login fields have stable names');
ok(/for="email"/.test(login) && /for="password"/.test(login), 'login labels are explicitly associated');
ok(/id="password-toggle"/.test(login), 'login includes password visibility control');
ok(/id="error"[^>]*aria-live="polite"/.test(login), 'login errors are announced accessibly');
ok(/localStorage\.getItem\('pos-accent'\)/.test(login), 'login inherits the saved brand accent');
ok(/prefers-reduced-motion:\s*reduce/.test(login), 'login respects reduced-motion preference');
ok(!/\sautofocus(?:\s|>)/i.test(login), 'login avoids forced autofocus on mobile');
ok(/pos-clean-v36/.test(sw), 'service-worker cache is bumped for the UI release');
const assets = (sw.match(/const ASSETS = \[([\s\S]*?)\];/) || [null, ''])[1];
ok(!/cdnjs|gstatic|cdn\.tailwindcss/.test(assets), 'service worker precaches only same-origin app-shell files');
ok(/register\('sw\.js\?v=36'\)/.test(pwa), 'PWA registration uses the current service-worker version');

console.log('UI polish guards: all tests passed');
