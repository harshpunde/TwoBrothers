import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './OrderConfirmation.css';

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  if (!state) {
    return (
      <div className="confirmation-page">
        <div className="confirmation-card">
          <h1>No Order Found</h1>
          <p className="confirm-subtitle">
            It seems you landed here by mistake. Head back to the shop!
          </p>
          <button className="confirm-shop-btn" onClick={() => navigate('/')}>
            Go to Shop
          </button>
        </div>
      </div>
    );
  }

  const { paymentId, amount, items, customer } = state;

  return (
    <div className="confirmation-page">
      <div className="confirmation-card confirm-confetti">
        {/* Animated checkmark */}
        <div className="confirm-check-circle">
          <CheckIcon />
        </div>

        <h1>Order Confirmed!</h1>
        <p className="confirm-subtitle">
          Thank you, <strong>{customer.name}</strong>! Your payment was successful and
          your order is being processed. You'll receive a confirmation at <strong>{customer.email}</strong>.
        </p>

        {/* Payment details */}
        <div className="confirm-details">
          <div className="confirm-detail-row">
            <span className="confirm-detail-label">Payment ID</span>
            <span className="confirm-detail-value payment-id">{paymentId}</span>
          </div>
          <div className="confirm-detail-row">
            <span className="confirm-detail-label">Amount Paid</span>
            <span className="confirm-detail-value">₹{amount.toLocaleString('en-IN')}</span>
          </div>
          <div className="confirm-detail-row">
            <span className="confirm-detail-label">Delivery To</span>
            <span className="confirm-detail-value">
              {customer.address}, {customer.city} — {customer.pincode}
            </span>
          </div>
          <div className="confirm-detail-row">
            <span className="confirm-detail-label">Phone</span>
            <span className="confirm-detail-value">{customer.phone}</span>
          </div>
        </div>

        {/* Order items */}
        {items && items.length > 0 && (
          <div className="confirm-items">
            <h4>Items Ordered</h4>
            {items.map((item) => (
              <div className="confirm-item" key={`${item.id}-${item.variant}`}>
                <span className="confirm-item-name">
                  {item.name} ({item.variant}) × {item.qty}
                </span>
                <span className="confirm-item-price">
                  ₹{(item.price * item.qty).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        )}

        <button className="confirm-shop-btn" onClick={() => navigate('/')}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
