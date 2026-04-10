import React, { useState } from 'react';
import { useAdmin } from './AdminContext';

function Toggle({ checked, onChange }) {
  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="toggle-slider" />
    </label>
  );
}

export default function AdminSettings({ showToast }) {
  const { settings, updateSettings } = useAdmin();
  const [form, setForm] = useState({ ...settings });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(form);
    showToast('✅ Settings saved!', 'success');
  };

  return (
    <form onSubmit={handleSave}>
      <div className="settings-grid">

        {/* Store Info */}
        <div className="settings-section">
          <div className="settings-section-title">🏪 Store Information</div>
          <div className="settings-form">
            <div className="admin-form-group">
              <label>Store Name</label>
              <input value={form.storeName || ''} onChange={e => set('storeName', e.target.value)} />
            </div>
            <div className="admin-form-group">
              <label>Tagline</label>
              <input value={form.tagline || ''} onChange={e => set('tagline', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Discount */}
        <div className="settings-section">
          <div className="settings-section-title">🏷️ Discount & Promo</div>
          <div className="settings-form">
            <div className="settings-row">
              <div>
                <div className="settings-row-label">Enable Discount Code</div>
                <div className="settings-row-desc">Show coupon in cart drawer</div>
              </div>
              <Toggle checked={!!form.discountCodeEnabled} onChange={v => set('discountCodeEnabled', v)} />
            </div>
            <div className="admin-form-group">
              <label>Discount Code</label>
              <input value={form.discountCode || ''} onChange={e => set('discountCode', e.target.value)} />
            </div>
            <div className="admin-form-group">
              <label>Discount % (e.g. 10)</label>
              <input type="number" min="0" max="100" value={form.discountPercent || ''} onChange={e => set('discountPercent', e.target.value)} />
            </div>
            <div className="admin-form-group">
              <label>Min. Cart Value for Discount (₹)</label>
              <input type="number" min="0" value={form.discountThreshold || ''} onChange={e => set('discountThreshold', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="settings-section">
          <div className="settings-section-title">🚚 Shipping</div>
          <div className="settings-form">
            <div className="settings-row">
              <div>
                <div className="settings-row-label">Free Shipping Banner</div>
                <div className="settings-row-desc">Show in cart drawer</div>
              </div>
              <Toggle checked={!!form.showFreeShippingBanner} onChange={v => set('showFreeShippingBanner', v)} />
            </div>
            <div className="admin-form-group">
              <label>Free Shipping Threshold (₹)</label>
              <input type="number" min="0" value={form.freeShippingThreshold || ''} onChange={e => set('freeShippingThreshold', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="settings-section">
          <div className="settings-section-title">🎨 Brand Colors</div>
          <div className="settings-form">
            <div className="admin-form-group">
              <label>Primary (Green)</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input type="color" value={form.primaryColor || '#2b5e1a'} onChange={e => set('primaryColor', e.target.value)}
                  style={{ width: 48, height: 38, padding: 2, border: '1.5px solid #e0e0e0', borderRadius: 6, cursor: 'pointer' }} />
                <input value={form.primaryColor || '#2b5e1a'} onChange={e => set('primaryColor', e.target.value)}
                  style={{ flex: 1 }} />
              </div>
            </div>
            <div className="admin-form-group">
              <label>Accent (Orange)</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input type="color" value={form.accentColor || '#e07b2a'} onChange={e => set('accentColor', e.target.value)}
                  style={{ width: 48, height: 38, padding: 2, border: '1.5px solid #e0e0e0', borderRadius: 6, cursor: 'pointer' }} />
                <input value={form.accentColor || '#e07b2a'} onChange={e => set('accentColor', e.target.value)}
                  style={{ flex: 1 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="settings-section full" style={{ borderLeft: '4px solid #ffcdd2' }}>
          <div className="settings-section-title">⚠️ Danger Zone</div>
          <div className="settings-row">
            <div>
              <div className="settings-row-label">Reset All Products</div>
              <div className="settings-row-desc">Restore default product catalog from initial data</div>
            </div>
            <button type="button" className="admin-btn admin-btn-danger"
              onClick={() => {
                if (window.confirm('Reset all products to defaults?')) {
                  localStorage.removeItem('tbof_products');
                  window.location.reload();
                }
              }}>
              Reset Products
            </button>
          </div>
        </div>

      </div>

      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" className="admin-btn admin-btn-primary" style={{ padding: '12px 32px', fontSize: 15 }}>
          💾 Save All Settings
        </button>
      </div>
    </form>
  );
}
