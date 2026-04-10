import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initiateRazorpayPayment } from '../utils/razorpay';
import './CheckoutPage.css';

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export default function CheckoutPage({ cartItems, setCartItems }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });

  const [errors, setErrors] = useState({});

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = subtotal >= 3000 ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal >= 1499 ? 0 : 99;
  const total = subtotal - discount + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) newErrors.phone = 'Enter a valid 10-digit number';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(form.pincode.replace(/\s/g, ''))) newErrors.pincode = 'Enter a valid 6-digit pincode';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePay = () => {
    if (!validate()) return;

    setLoading(true);

    initiateRazorpayPayment({
      amount: total,
      customerInfo: {
        name: form.name,
        email: form.email,
        phone: form.phone,
      },
      onSuccess: (response) => {
        setLoading(false);
        navigate('/order-confirmation', {
          state: {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id || null,
            amount: total,
            items: cartItems,
            customer: form,
          },
        });
        setCartItems([]);
      },
      onFailure: () => {
        setLoading(false);
      },
    });
  };

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-back-bar">
          <button className="checkout-back-btn" onClick={() => navigate('/')}>
            <ArrowLeftIcon /> Back to Shop
          </button>
        </div>
        <div className="checkout-container" style={{ display: 'block', maxWidth: 500, textAlign: 'center' }}>
          <div className="checkout-empty">
            <p>Your cart is empty</p>
            <small>Add some organic goodness before checking out!</small>
            <button className="checkout-empty-btn" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-back-bar">
        <button className="checkout-back-btn" onClick={() => navigate('/')}>
          <ArrowLeftIcon /> Back to Shop
        </button>
      </div>

      <div className="checkout-container">
        {/* LEFT — Form */}
        <div className="checkout-form-card">
          <h2>Shipping Details</h2>
          <p className="checkout-form-subtitle">
            Enter your details to complete the order
          </p>

          <div className="checkout-form">
            <div className="form-row">
              <div className={`form-group ${errors.name ? 'error' : ''}`}>
                <label htmlFor="checkout-name">Full Name</label>
                <input
                  id="checkout-name"
                  name="name"
                  type="text"
                  placeholder="Harsh Punde"
                  value={form.name}
                  onChange={handleChange}
                />
                {errors.name && <span className="form-error-msg">{errors.name}</span>}
              </div>
              <div className={`form-group ${errors.phone ? 'error' : ''}`}>
                <label htmlFor="checkout-phone">Phone Number</label>
                <input
                  id="checkout-phone"
                  name="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={handleChange}
                />
                {errors.phone && <span className="form-error-msg">{errors.phone}</span>}
              </div>
            </div>

            <div className={`form-group ${errors.email ? 'error' : ''}`}>
              <label htmlFor="checkout-email">Email Address</label>
              <input
                id="checkout-email"
                name="email"
                type="email"
                placeholder="harshpunde@example.com"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <span className="form-error-msg">{errors.email}</span>}
            </div>

            <div className={`form-group ${errors.address ? 'error' : ''}`}>
              <label htmlFor="checkout-address">Delivery Address</label>
              <textarea
                id="checkout-address"
                name="address"
                placeholder="House/Flat No., Street, Landmark"
                value={form.address}
                onChange={handleChange}
              />
              {errors.address && <span className="form-error-msg">{errors.address}</span>}
            </div>

            <div className="form-row">
              <div className={`form-group ${errors.city ? 'error' : ''}`}>
                <label htmlFor="checkout-city">City</label>
                <input
                  id="checkout-city"
                  name="city"
                  type="text"
                  placeholder="Mumbai"
                  value={form.city}
                  onChange={handleChange}
                />
                {errors.city && <span className="form-error-msg">{errors.city}</span>}
              </div>
              <div className={`form-group ${errors.pincode ? 'error' : ''}`}>
                <label htmlFor="checkout-pincode">Pincode</label>
                <input
                  id="checkout-pincode"
                  name="pincode"
                  type="text"
                  placeholder="400001"
                  value={form.pincode}
                  onChange={handleChange}
                />
                {errors.pincode && <span className="form-error-msg">{errors.pincode}</span>}
              </div>
            </div>

            {/* Secure badge */}
            <div className="checkout-secure-badge">
              <ShieldIcon />
              <span>Your data is encrypted & secure. We never store card details.</span>
            </div>

            {/* Pay button */}
            <button
              className="checkout-pay-btn"
              onClick={handlePay}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="pay-spinner" />
                  Processing…
                </>
              ) : (
                <>
                  <LockIcon />
                  Pay ₹{total.toLocaleString('en-IN')} with Razorpay
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT — Order Summary */}
        <div className="checkout-summary-card">
          <h3>Order Summary ({cartItems.reduce((s, i) => s + i.qty, 0)} items)</h3>

          <div className="checkout-summary-items">
            {cartItems.map((item) => (
              <div className="checkout-summary-item" key={`${item.id}-${item.variant}`}>
                <img src={item.image} alt={item.name} />
                <div className="checkout-summary-item-info">
                  <div className="checkout-summary-item-name">{item.name}</div>
                  <div className="checkout-summary-item-meta">
                    {item.variant} × {item.qty}
                  </div>
                </div>
                <div className="checkout-summary-item-price">
                  ₹{(item.price * item.qty).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-summary-divider" />

          <div className="checkout-summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>

          {discount > 0 && (
            <div className="checkout-summary-row">
              <span>Discount (10%)</span>
              <span className="discount">−₹{discount.toLocaleString('en-IN')}</span>
            </div>
          )}

          <div className="checkout-summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? <span className="discount">FREE</span> : `₹${shipping}`}</span>
          </div>

          <div className="checkout-summary-divider" />

          <div className="checkout-summary-row total">
            <span>Total</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>

          {subtotal >= 3000 && (
            <div className="checkout-promo-tag">
              🎉 TBOF10 discount applied — you're saving ₹{discount.toLocaleString('en-IN')}!
            </div>
          )}

          {subtotal < 3000 && subtotal >= 1499 && (
            <div className="checkout-promo-tag">
              🚚 Free shipping unlocked!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
