// POS Enterprise — test module v9 (extended)
class POSManager {
  constructor() {
    this.products = [];
    this.cart = [];
  }

  addProduct(name, price, stock, opts) {
    opts = opts || {};
    this.products.push({
      id: opts.id || String(Date.now()),
      name: name,
      price: price,
      stock: stock,
      category: opts.category || '',
      brand: opts.brand || '',
      costPrice: opts.costPrice || 0,
      imeiPool: opts.imeiPool || [],
      hasImei: (opts.imeiPool || []).length > 0
    });
  }

  addToCart(productId, quantity) {
    var product = this.products.find(function(p){ return p.id === productId; });
    if (product && product.stock >= quantity) {
      this.cart.push({
        productId: productId,
        name: product.name,
        price: product.price,
        quantity: quantity,
        qty: quantity,
        subtotal: product.price * quantity,
        costPrice: product.costPrice || 0,
        category: product.category || '',
        brand: product.brand || ''
      });
      return true;
    }
    return false;
  }

  getCartTotal() {
    return this.cart.reduce(function(sum, item){ return sum + item.subtotal; }, 0);
  }

  checkout() {
    var total = this.getCartTotal();
    this.cart = [];
    return total;
  }

  // v9 helpers for tests
  normalizeImei(s) {
    return String(s||'').replace(/\s+/g,'').toLowerCase();
  }

  hasDuplicateGlobal(imeiList, excludeProductId) {
    var normSet = {};
    this.products.forEach(function(p){
      if (excludeProductId && p.id === excludeProductId) return;
      (p.imeiPool||[]).forEach(function(im){
        normSet[String(im).replace(/\s+/g,'').toLowerCase()] = p.name;
      });
    });
    for (var i=0;i<imeiList.length;i++){
      var k = String(imeiList[i]).replace(/\s+/g,'').toLowerCase();
      if (normSet[k]) return { imei: imeiList[i], product: normSet[k] };
    }
    return null;
  }
}

export { POSManager };
