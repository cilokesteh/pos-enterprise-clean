const fs = require('fs');
const assert = require('assert');

const index = fs.readFileSync('index.html', 'utf8');
const login = fs.readFileSync('login.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
const pwa = fs.readFileSync('pwa.js', 'utf8');
const manifest = fs.readFileSync('manifest.json', 'utf8');

function ok(condition, message) {
  assert.ok(condition, message);
  console.log('✓ ' + message);
}

ok(/RETAIL COMMAND CENTER v11\.3/.test(index), 'app declares the v11.3 command-center layer');
ok(/class="scanner-command[^\"]*"/.test(index), 'scanner has a dedicated dominant command surface');
ok(/class="checkout-command[^\"]*"/.test(index), 'checkout has a dedicated dominant command surface');
ok(/class="workstation-eyebrow"/.test(index), 'cashier view carries a compact workstation context label');
ok(/id="cart-item-count"[^>]*aria-live="polite"/.test(index), 'cart count is announced and visible');
ok(/cartCountEl\.textContent\s*=\s*cart\.length\s*\+\s*\(cart\.length\s*===\s*1\s*\?\s*' item'\s*:\s*' items'\)/.test(index), 'cart count updates from live cart state');
ok(/font-family:\s*'IBM Plex Sans'/.test(index), 'app replaces Inter-only typography with IBM Plex Sans');
ok(/font-family:\s*'IBM Plex Mono'/.test(index), 'operational values use a purpose-built mono face');
ok(/@media \(max-width:768px\)[\s\S]*#checkout-btn[\s\S]*position:\s*sticky/.test(index), 'mobile checkout remains ergonomically reachable');
ok(/@media \(prefers-reduced-motion:reduce\)/.test(index), 'command center preserves reduced-motion support');
ok(/html, body \{ overflow-x:\s*hidden/.test(index), 'command center guards against page overflow');
ok(/RETAIL LOGIN v11\.3/.test(login), 'login declares its professional v11.3 visual layer');
ok(!/backdrop-filter:\s*blur\(12px\)/.test(login), 'login removes glass-panel treatment');
ok(/POS Enterprise v11\.3/.test(login), 'login displays the current UI version');
ok(/pos-clean-v36/.test(sw), 'service-worker cache is bumped to v36');
ok(/register\('sw\.js\?v=36'\)/.test(pwa), 'PWA registration points at service-worker v36');
ok((index.match(/v11\.3/g) || []).length >= 2, 'app shell consistently displays v11.3');
ok(/v11\.3/.test(manifest), 'static manifest is bumped to v11.3');

console.log('Retail Command Center visual contracts: all tests passed');
