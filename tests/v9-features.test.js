// v9 feature guard tests — search filters, pagination, IMEI global duplicate, camera scan hooks
const fs = require('fs');
const assert = require('assert');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');

function has(str) {
  assert.ok(html.includes(str), `Must contain: ${str}`);
  console.log('✓', str);
}

// CDN libs
has('qrcode.min.js');
has('html2pdf');

// v9 UI markers
has('id="lowstock-banner"');
has('id="prod-search"');
has('id="prod-cat-filter"');
has('id="prod-brand-filter"');
has('id="prod-stock-filter"');
has('id="stock-search"');
has('id="stock-type-filter"');
has('id="history-search"');
has('id="history-method-filter"');
has('id="history-date-filter"');
has('imei-scan');
has('id="prod-count-badge"');
has('history-page-info');
has('prod-filter-bar');
has('kb-badge');
has('count-badge');
has('lowstock-banner');

// v9 JS functions
has('function fillBrandFilter');
has('function clearProdFilters');
has('function exportProdukExcel');
has('function clearStockFilters');
has('function filterHistoryAndRender');
has('function historyPrevPage');
has('function historyNextPage');
has('function clearHistoryFilters');
has('imei-scan');

// Global IMEI dup check
has('globalMap');
has('sudah terdaftar di produk');

// Receipt QR
has('receipt-qrcode');
has('QRCode');

// Keyboard shortcuts
has('F2');
has('kb-badge');

// Version
has('v11');
has('>v11.1<');
// v10 features: delete product + text PDF fallback
has('function deleteProduct');
has('function buildTextReceipt');
// v11 features: garansi + offline
has('id="view-garansi"');
has('id="offline-dot"');
has('enablePersistence');
has('ensureWarrantyForSale');
has('garansi-table-body');

// No HTML leak
const jsStart = html.indexOf('// ============ STATE');
const jsPart = html.slice(jsStart);
assert.ok(!jsPart.includes('<div id="app"'), 'No HTML leak into JS');
console.log('✓ No HTML leak');

// Script counts
assert.strictEqual((html.match(/<script src="config.js">/g) || []).length, 1, 'config.js once');
assert.strictEqual((html.match(/<script src="pwa.js">/g) || []).length, 1, 'pwa.js once');
console.log('✓ Script counts OK');

// Extract and run pure function
function extractFunction(name) {
  const marker = `function ${name}(`;
  const start = html.indexOf(marker);
  if (start === -1) return null;
  const brace = html.indexOf('{', start);
  let depth = 0;
  for (let i = brace; i < html.length; i++) {
    if (html[i] === '{') depth++;
    if (html[i] === '}') {
      depth--;
      if (depth === 0) return html.slice(start, i + 1);
    }
  }
  return null;
}

const ctx = {};
vm.createContext(ctx);
vm.runInContext(extractFunction('getDashboardStockData'), ctx);

const r = ctx.getDashboardStockData([
  { id: 'a', name: 'Phone A', category: 'HP', brand: 'Alpha', stock: 0, imeiPool: [] },
  { id: 'b', name: 'Phone B', category: 'HP', brand: 'Beta', stock: 2, imeiPool: ['1','2'] },
  { id: 'c', name: 'Cable', category: 'Aksesoris', brand: 'Gamma', stock: 8, imeiPool: ['x'] },
]);

assert.deepStrictEqual(JSON.parse(JSON.stringify(r.summary)), { totalProducts: 3, totalStock: 10, outOfStock: 1, lowStock: 1 });
console.log('✓ getDashboardStockData still works');

console.log('\n=== v9 feature guards: ALL PASSED ===');
