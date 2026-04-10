import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartDrawer.css';

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);

const CartEmptyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"
    fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const suggestions = [
  {
    id: 'sug1',
    name: 'Khapli Wheat Atta',
    price: 2278,
    discount: '12% OFF',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=70',
  },
  {
    id: 'sug2',
    name: 'A2 Ghee (Gir Cow)',
    price: 1199,
    discount: '10% OFF',
    image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=200&q=70',
  },
  {
    id: 'sug3',
    name: 'Raw Wildflower Honey',
    price: 699,
    discount: '8% OFF',
    image: 'https://images.unsplash.com/photo-1587049352851-8d4a463abb88?w=200&q=70',
  },
  {
    id: 'sug4',
    name: 'Cold Pressed Oil',
    price: 650,
    discount: '15% OFF',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&q=70',
  },
];

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQty, onRemove }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('best');

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

  // Progress toward ₹3000 for 10% OFF
  const target = 3000;
  const progress = Math.min((totalPrice / target) * 100, 100);
  const remaining = Math.max(target - totalPrice, 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="cart-overlay" onClick={onClose} />

      {/* Drawer */}
      <div className="cart-drawer">

        {/* Header */}
        <div className="cart-header">
          <h2>YOUR CART ({totalItems})</h2>
          <button className="cart-close-btn" onClick={onClose}><CloseIcon /></button>
        </div>

        {/* Promo Banner */}
        <div className="cart-promo-banner">
          <span>🏷️</span>
          <span>Get 10% OFF on orders above ₹3000 | Use code - TBOF10</span>
        </div>

        {/* Progress toward ₹3000 */}
        <div className="cart-progress-section">
          {remaining > 0 ? (
            <div className="cart-progress-label">
              Add <strong>₹{remaining.toLocaleString('en-IN')}</strong> more to unlock <strong>FREE Shipping + 10% OFF</strong> 🎉
            </div>
          ) : (
            <div className="cart-progress-label" style={{ color: 'var(--green-primary)' }}>
              🎉 Hurray! You've unlocked 10% + FREE Shipping
            </div>
          )}

          <div className="cart-progress-track">
            <div className="cart-progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <div className="cart-progress-milestones">
            <div className="cart-milestone">
              <div className={`milestone-check ${totalPrice >= 1499 ? '' : 'inactive'}`}>✓</div>
              <span className="milestone-amount">₹1499</span>
              <span>Free Shipping</span>
            </div>
            <div className="cart-milestone">
              <div className={`milestone-check ${totalPrice >= 3000 ? '' : 'inactive'}`}>✓</div>
              <span className="milestone-amount">₹3000</span>
              <span>10% OFF</span>
            </div>
          </div>
        </div>

        {/* Cart Items or Empty */}
        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <CartEmptyIcon />
            <p>Your cart is empty</p>
            <small>Add some organic goodness!</small>
          </div>
        ) : (
          <div className="cart-items">
            {cartItems.map(item => (
              <div className="cart-item" key={`${item.id}-${item.variant}`}>
                <img
                  className="cart-item-img"
                  src={item.image}
                  alt={item.name}
                />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-variant">{item.variant}</div>
                  <div className="cart-item-price">₹{(item.price * item.qty).toLocaleString('en-IN')}</div>

                  {/* Qty stepper */}
                  <div className="cart-item-qty">
                    <button
                      className="qty-btn-drawer"
                      onClick={() => onUpdateQty(item.id, item.variant, item.qty - 1)}
                    >−</button>
                    <span className="qty-num">{item.qty}</span>
                    <button
                      className="qty-btn-drawer"
                      onClick={() => onUpdateQty(item.id, item.variant, item.qty + 1)}
                    >+</button>
                  </div>
                </div>

                <button
                  className="cart-item-delete"
                  onClick={() => onRemove(item.id, item.variant)}
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
        )}

        {cartItems.length > 0 && (
          <>
            {/* Coupon */}
            <div className="cart-coupon-section">
              <div className="cart-coupon-left">
                <span className="cart-coupon-save">
                  💚 Save ₹{Math.round(totalPrice * 0.1).toLocaleString('en-IN')}
                </span>
                <span className="cart-coupon-code">with 'TBOF10'</span>
              </div>
              <button className="cart-apply-btn">Apply</button>
            </div>

            <div className="cart-more-offers">
              💰 +2 more offers
              <span style={{ marginLeft: 'auto', fontWeight: 500, fontSize: 12 }}>View all coupons &gt;</span>
            </div>

            {/* Tabs */}
            <div className="cart-tabs">
              <div
                className={`cart-tab ${activeTab === 'best' ? 'active' : ''}`}
                onClick={() => setActiveTab('best')}
              >
                Best offers
              </div>
              <div
                className={`cart-tab ${activeTab === 'like' ? 'active' : ''}`}
                onClick={() => setActiveTab('like')}
              >
                You might also like
              </div>
            </div>

            {/* Suggestions */}
            <div className="cart-suggestions">
              {suggestions.map(s => (
                <div className="cart-suggestion-card" key={s.id}>
                  <img src={s.image} alt={s.name} />
                  <div className="cart-suggestion-info">
                    <div className="cart-suggestion-discount">{s.discount}</div>
                    <div className="cart-suggestion-name">{s.name}</div>
                    <div className="cart-suggestion-price">₹{s.price.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="cart-footer">
              <div className="cart-prepaid-badge">
                ⚡ Extra discount with prepaid payment
              </div>
              <button
                className="cart-checkout-btn"
                onClick={() => { onClose(); navigate('/checkout'); }}
              >
                <span>Checkout</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, opacity: 0.85 }}>
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                  <span>→</span>
                </span>
              </button>
              <div className="cart-checkout-powered">
                Powered by <strong>shopflo</strong>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
