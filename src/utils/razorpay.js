/**
 * Razorpay Payment Utility
 * ─────────────────────────
 * Set DEMO_MODE = false and replace RAZORPAY_KEY with your real key
 * once you have a Razorpay account.
 */

const RAZORPAY_KEY = 'rzp_test_XXXXXXXXXXXXXX'; // ← Replace with your real test key
const DEMO_MODE = true; // Set to false when you have a real Razorpay key

/**
 * @param {Object}   opts
 * @param {number}   opts.amount        – Amount in ₹ (will be converted to paise)
 * @param {Object}   opts.customerInfo  – { name, email, phone }
 * @param {Function} opts.onSuccess     – Called with Razorpay response on payment success
 * @param {Function} opts.onFailure     – Called with error response on modal dismiss / failure
 */
export function initiateRazorpayPayment({ amount, customerInfo, onSuccess, onFailure }) {

  // ── DEMO MODE: simulate payment without Razorpay ──────────
  if (DEMO_MODE) {
    // Simulate a short processing delay, then auto-succeed
    setTimeout(() => {
      if (onSuccess) {
        onSuccess({
          razorpay_payment_id: 'pay_DEMO_' + Date.now(),
          razorpay_order_id: null,
          razorpay_signature: null,
        });
      }
    }, 1500); // 1.5s simulated processing
    return;
  }

  // ── REAL MODE: use actual Razorpay SDK ────────────────────
  if (typeof window.Razorpay === 'undefined') {
    alert('Razorpay SDK failed to load. Please check your internet connection.');
    if (onFailure) onFailure({ reason: 'Razorpay SDK not loaded' });
    return;
  }

  try {
    const options = {
      key: RAZORPAY_KEY,
      amount: Math.round(amount * 100), // Convert ₹ → paise
      currency: 'INR',
      name: 'Two Brothers Organic Farms',
      description: 'Order Payment',
      image: '',
      prefill: {
        name: customerInfo.name || '',
        email: customerInfo.email || '',
        contact: customerInfo.phone || '',
      },
      theme: {
        color: '#2b5e1a',
      },
      handler(response) {
        if (onSuccess) onSuccess(response);
      },
      modal: {
        ondismiss() {
          if (onFailure) onFailure({ reason: 'Payment modal was closed' });
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', (resp) => {
      if (onFailure) onFailure(resp.error);
    });

    rzp.open();
  } catch (err) {
    console.error('Razorpay error:', err);
    if (onFailure) onFailure({ reason: err.message || 'Failed to open payment modal' });
  }
}
