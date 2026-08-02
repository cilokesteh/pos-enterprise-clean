const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const source = fs.readFileSync('index.html', 'utf8');

function extractFunction(name) {
  const markers = [`function ${name}(`, `async function ${name}(`];
  let start = -1;
  for (const marker of markers) {
    start = source.indexOf(marker);
    if (start !== -1) break;
  }
  assert.notStrictEqual(start, -1, `${name} must exist`);
  const brace = source.indexOf('{', start);
  let depth = 0;
  for (let i = brace; i < source.length; i++) {
    if (source[i] === '{') depth++;
    if (source[i] === '}') {
      depth--;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  throw new Error(`Could not extract ${name}`);
}

const context = {
  STORE: { name: 'Test Store' },
  formatRp: value => 'Rp ' + Number(value || 0).toLocaleString('id-ID')
};
vm.createContext(context);
vm.runInContext(extractFunction('methodLabelOf'), context);
vm.runInContext(extractFunction('buildReceiptText'), context);
vm.runInContext(extractFunction('normalizeWaTarget'), context);

const tx = {
  receiptNo: 'POS-001', createdAt: new Date('2026-08-03T10:30:00Z').getTime(),
  customerName: 'Budi', customerWA: '0812-3456-7890', method: 'cash',
  cash: 150000, change: 10000, total: 140000,
  items: [{ qty: 1, name: 'Phone', subtotal: 140000 }]
};
const text = context.buildReceiptText(tx);
assert.match(text, /Test Store/);
assert.match(text, /POS-001/);
assert.match(text, /Phone/);
assert.match(text, /TOTAL/);
assert.strictEqual(context.normalizeWaTarget('0812-3456-7890'), '6281234567890');
assert.strictEqual(context.normalizeWaTarget(''), '');

assert.match(source, /function createReceiptPdfFile/);
assert.match(source, /new File\(\[blob\]/);
assert.match(source, /navigator\.canShare\(\{ files: \[pdfFile\] \}\)/);
assert.match(source, /navigator\.share\(\{[\s\S]*?files: \[pdfFile\][\s\S]*?text: textMsg/);
const sendFn = extractFunction('sendReceiptToWA');
assert.match(sendFn, /await navigator\.share\([\s\S]*?\);\s*openReceiptTextInWhatsApp\(\);\s*return;/);
assert.match(source, /function downloadReceiptPdfForDesktop/);
assert.match(source, /downloadReceiptPdfForDesktop\(pdfFile\)/);
assert.match(source, /Mode PC\/Laptop/);
assert.match(source, /async function sendReceiptToWA[\s\S]*?createReceiptPdfFile/);
assert.match(source, />Kirim PDF</);

console.log('receipt PDF sharing: all tests passed');
