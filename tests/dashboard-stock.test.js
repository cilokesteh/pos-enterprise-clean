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
vm.runInContext(extractFunction('getDashboardStockData'), context);

const result = context.getDashboardStockData([
  { id: 'a', name: 'Phone A', category: 'HP', brand: 'Alpha', stock: 0, imeiPool: [] },
  { id: 'b', name: 'Phone B', category: 'HP', brand: 'Beta', stock: 2, imeiPool: ['1', '2'] },
  { id: 'c', name: 'Cable', category: 'Aksesoris', brand: 'Gamma', stock: 8, imeiPool: ['x'] },
  { id: 'd', name: 'Case', category: 'Aksesoris', brand: 'Delta', stock: -3, imeiPool: [] }
]);

assert.deepStrictEqual(JSON.parse(JSON.stringify(result.summary)), {
  totalProducts: 4,
  totalStock: 10,
  outOfStock: 2,
  lowStock: 1
});
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(result.rows.map(p => [p.name, p.stock, p.status]))),
  [
    ['Case', 0, 'Habis'],
    ['Phone A', 0, 'Habis'],
    ['Phone B', 2, 'Menipis'],
    ['Cable', 8, 'Tersedia']
  ]
);

assert.match(source, /id="db-stock-total"/);
assert.match(source, /id="db-stock-empty"/);
assert.match(source, /id="db-stock-low"/);
assert.match(source, /id="db-stock-check-tbody"/);
assert.match(source, /function loadDashboard[\s\S]*?renderDashboardStock\(products\)/);

console.log('dashboard stock check: all tests passed');
