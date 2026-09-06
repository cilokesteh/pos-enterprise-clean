const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const path = require('node:path');
const assert = require('node:assert');

(async () => {
  const server = spawn('python3', ['-m', 'http.server', '4176', '--bind', '127.0.0.1'], { cwd: path.resolve(__dirname, '..'), stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 700));
  const browser = await chromium.launch({ headless: true });
  try {
    for (const width of [390, 345]) {
      const page = await browser.newPage({ viewport: { width, height: 844 } });
      await page.goto('http://127.0.0.1:4176/index.html', { waitUntil: 'domcontentloaded' });
      const m = await page.evaluate(() => {
        const btn = document.querySelector('#checkout-btn').getBoundingClientRect();
        const nav = document.querySelector('#mobile-tabbar').getBoundingClientRect();
        const scanner = document.querySelector('.scanner-command').getBoundingClientRect();
        const checkout = document.querySelector('.checkout-command').getBoundingClientRect();
        return { vw: innerWidth, sw: document.documentElement.scrollWidth, btn, nav, scanner, checkout };
      });
      assert.equal(m.sw, m.vw, `${width}px must have zero document overflow`);
      assert.ok(m.btn.bottom <= m.nav.top, `${width}px checkout button must not overlap bottom navigation`);
      for (const [name, box] of Object.entries({ scanner: m.scanner, checkout: m.checkout, button: m.btn })) {
        assert.ok(box.left >= 0 && box.right <= m.vw, `${width}px ${name} must remain inside viewport`);
      }
      await page.close();
      console.log(`✓ ${width}px geometry: no overflow or checkout/nav overlap`);
    }
  } finally {
    await browser.close();
    server.kill('SIGTERM');
  }
})().catch(err => { console.error(err); process.exit(1); });
