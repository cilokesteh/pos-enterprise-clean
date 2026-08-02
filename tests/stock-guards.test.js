const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const source = fs.readFileSync('index.html', 'utf8');

function extractFunction(name) {
  const marker = `function ${name}(`;
  const start = source.indexOf(marker);
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

const context = {};
vm.createContext(context);
vm.runInContext(extractFunction('normalizeImei'), context);
vm.runInContext(extractFunction('validateCartStock'), context);

assert.strictEqual(
  context.validateCartStock(
    [{ id: 'p1', name: 'Phone', stock: 0, imeiPool: [] }],
    [{ productId: 'p1', name: 'Phone', qty: 1, imei: ['123'] }]
  ),
  'Stok Phone sudah habis'
);

assert.strictEqual(
  context.validateCartStock(
    [{ id: 'p1', name: 'Phone', stock: 1, imeiPool: ['123'] }],
    [{ productId: 'p1', name: 'Phone', qty: 2, imei: ['123', '456'] }]
  ),
  'Stok Phone tidak cukup. Tersedia: 1'
);

assert.strictEqual(
  context.validateCartStock(
    [{ id: 'p1', name: 'Phone', stock: 1, imeiPool: ['999'] }],
    [{ productId: 'p1', name: 'Phone', qty: 1, imei: ['123'] }]
  ),
  'IMEI/SN 123 sudah tidak tersedia di stok'
);

assert.strictEqual(
  context.validateCartStock(
    [{ id: 'p1', name: 'Phone', stock: 1, imeiPool: ['123'] }],
    [{ productId: 'p1', name: 'Phone', qty: 1, imei: ['123'] }]
  ),
  ''
);

assert.match(source, /function addScannedToCart[\s\S]*?validateCartStock\(products, candidateCart\)/);
assert.match(source, /async function processPayment[\s\S]*?validateCartStock\(products, cart\)/);
assert.match(source, /var newStock = isRestock[\s\S]*?if \(newStock < 0\)/);

console.log('stock guards: all tests passed');
