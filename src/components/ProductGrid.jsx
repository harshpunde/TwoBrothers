import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, cartItems, onAddToCart, onUpdateQty }) {
  const getQty = (productId) => {
    const item = cartItems.find(ci => ci.id === productId);
    return item ? item.qty : 0;
  };

  return (
    <section className="product-grid-section">
      <div className="product-grid">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            cartQty={getQty(product.id)}
            onAddToCart={onAddToCart}
            onUpdateQty={onUpdateQty}
          />
        ))}
      </div>
    </section>
  );
}
