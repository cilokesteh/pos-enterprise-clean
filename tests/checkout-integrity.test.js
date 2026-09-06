const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const html = fs.readFileSync('index.html', 'utf8');
const config = fs.readFileSync('config.js', 'utf8');
const rules = fs.readFileSync('firestore.rules', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');

function extractFunction(name) {
  const patterns = [`async function ${name}(`, `function ${name}(`];
  const start = patterns.map(p => html.indexOf(p)).find(i => i >= 0);
  assert.notStrictEqual(start, undefined, `${name} must exist`);
  const brace = html.indexOf('{', start);
  let depth = 0;
  for (let i = brace; i < html.length; i++) {
    if (html[i] === '{') depth++;
    if (html[i] === '}' && --depth === 0) return html.slice(start, i + 1);
  }
  throw new Error(`Could not extract ${name}`);
}

const checkout = extractFunction('commitCheckout');
assert.match(checkout, /db\.runTransaction/, 'checkout must use compat runTransaction');
assert.match(checkout, /transaction\.get\(checkoutRef\)/, 'checkout must read deterministic transaction ref');
assert.match(checkout, /alreadyCommitted:\s*true/, 'checkout retry must be idempotent');
assert.match(checkout, /transaction\.get\(productRef\)/, 'checkout must authoritatively read products');
assert.match(checkout, /transaction\.get\(counterRef\)/, 'receipt counter must be read atomically');
assert.match(checkout, /transaction\.set\(counterRef/, 'receipt counter must be written atomically');
assert.match(checkout, /transaction\.get\((?:entry\.)?claimRef\)/, 'IMEI registry claims must be read atomically');
assert.match(checkout, /transaction\.set\(claimRef/, 'IMEI registry claims must be written atomically');
assert.match(checkout, /transaction\.set\(warrantyRef/, 'warranty must be written in checkout transaction');
assert.match(checkout, /transaction\.set\(moveRef/, 'stock movements need deterministic transactional refs');

const stock = extractFunction('commitStockMove');
assert.match(stock, /db\.runTransaction/, 'restock/return must use a transaction');
assert.match(stock, /transaction\.get\(productRef\)/, 'restock/return must read authoritative product');
assert.match(stock, /transaction\.set\(moveRef/, 'restock/return movement must be atomic');
assert.match(stock, /transaction\.get\(registryRef\)/, 'restock must check authoritative IMEI registry');

assert.doesNotMatch(extractFunction('getSplitCards'), /cards\.push\([^\n]*number\s*:/, 'split data must not retain raw PAN');
assert.match(extractFunction('processPayment'), /paymentSubmitLocked/, 'payment needs a double-submit lock');
assert.match(extractFunction('saveStockMove'), /stockSubmitLocked/, 'stock movement needs a double-submit lock');
assert.match(extractFunction('toggleSidebar'), /\.inert\s*=/, 'closed drawer must be inert');
assert.match(extractFunction('closeSidebar'), /\.focus\(\)/, 'closing drawer must restore focus');
assert.match(config, /const STORE\s*=\s*{[\s\S]*?id:\s*['"][^'"]+['"]/, 'STORE.id must be configured');
for (const collection of ['v3-products','v3-stock-moves','v3-transactions','v3-users','v3-garansi','receiptCounters','imeiClaims']) {
  assert.ok(rules.includes(`match /${collection}/`), `rules must cover ${collection}`);
}
assert.match(rules, /storeId[\s\S]*?role/, 'rules must enforce tenant and role');
assert.match(sw, /fetch\(e\.request\)[\s\S]*?caches\.match/, 'service worker must be network-first');
for (const file of ['_headers','404.html','health','ready','package.json']) assert.ok(fs.existsSync(file), `${file} must exist`);

const ctx = { STORE: { name:'<img src=x>', address:'<a>', phone:'<b>', hours:'<c>', wa:'<d>', instagram:'<e>', facebook:'<f>', tiktok:'<g>', website:'<h>', footer:'<script>x</script>' } };
vm.createContext(ctx);
vm.runInContext(extractFunction('esc'), ctx);
ctx.formatRp = String;
vm.runInContext(extractFunction('maskCardNumber'), ctx);
vm.runInContext(extractFunction('buildReceiptHtml'), ctx);
const receipt = ctx.buildReceiptHtml({createdAt:0,method:'<svg>',receiptNo:'<b>R</b>',customerName:'<img>',customerWA:'<script>',kasirName:'<i>K</i>',items:[{name:'<u>P</u>',qty:1,price:1,subtotal:1}],total:1,split:{cards:[{amount:1,type:'<x>',masked:'<raw>'}]}});
for (const unsafe of ['<img src=x>','<script>x</script>','<b>R</b>','<img>','<i>K</i>','<u>P</u>','<svg>','<raw>','<a>','<c>']) assert.ok(!receipt.includes(unsafe), `receipt must escape ${unsafe}`);
assert.doesNotMatch(extractFunction('updateStockHint'), /innerHTML\s*=/, 'stock hint must not interpolate HTML');
console.log('checkout integrity: all tests passed');
