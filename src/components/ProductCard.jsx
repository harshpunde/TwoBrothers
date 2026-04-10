import React, { useState } from 'react';

const HeartIcon = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill={filled ? '#e03a3a' : 'none'}
    stroke={filled ? '#e03a3a' : '#666'}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  return (
    <div className="stars">
      {Array.from({ length: fullStars }).map((_, i) => (
        <span key={i} className="star">★</span>
      ))}
      {halfStar && <span className="star" style={{ opacity: 0.6 }}>★</span>}
    </div>
  );
};

const badgeClass = {
  'trending': 'badge trending',
  'best-seller': 'badge best-seller',
  'winter-special': 'badge winter-special',
};

export default function ProductCard({ product, cartQty, onAddToCart, onUpdateQty }) {
  const [wishlisted, setWishlisted] = useState(product.wishlist);
  const [selectedVariant, setSelectedVariant] = useState(product.defaultVariant);

  const inCart = cartQty > 0;

  const handleAdd = () => {
    if (onAddToCart) onAddToCart(product, selectedVariant);
  };

  const handleInc = () => {
    if (onUpdateQty) onUpdateQty(product.id, selectedVariant, cartQty + 1);
  };

  const handleDec = () => {
    if (onUpdateQty) onUpdateQty(product.id, selectedVariant, cartQty - 1);
  };

  return (
    <div className="product-card">
      {/* Image */}
      <div className="product-card-image-wrapper">
        <img src={product.image} alt={product.name} loading="lazy" />

        {/* Badge */}
        {product.badge && (
          <div className={badgeClass[product.badge]}>
            <span className="badge-dot" />
            <span className="badge-divider" />
            <span>{product.badgeLabel}</span>
          </div>
        )}

        {/* Wishlist */}
        <button
          className={`wishlist-btn${wishlisted ? ' active' : ''}`}
          onClick={() => setWishlisted(w => !w)}
          aria-label="Add to wishlist"
        >
          <HeartIcon filled={wishlisted} />
        </button>
      </div>

      {/* Body */}
      <div className="product-card-body">
        <div className="product-name-price">
          <span className="product-name">{product.name}</span>
          <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
        </div>

        <div className="product-tags">{product.tags}</div>

        <div className="product-rating">
          <StarRating rating={product.rating} />
          <span className="rating-score">{product.rating}</span>
          <span className="reviews-count">{product.reviews}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="product-card-footer">
        <select
          className="variant-select"
          value={selectedVariant}
          onChange={e => setSelectedVariant(e.target.value)}
        >
          {product.variants.map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>

        {/* Toggle: ADD TO CART ↔ quantity stepper */}
        {inCart ? (
          <div className="qty-stepper">
            <button className="qty-stepper-btn" onClick={handleDec}>−</button>
            <span className="qty-stepper-count">{cartQty}</span>
            <button className="qty-stepper-btn" onClick={handleInc}>+</button>
          </div>
        ) : (
          <button className="add-to-cart-btn" onClick={handleAdd}>
            ADD TO CART
          </button>
        )}
      </div>
    </div>
  );
}
