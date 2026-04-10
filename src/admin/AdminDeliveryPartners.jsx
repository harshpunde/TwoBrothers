import React, { useState } from 'react';
import { useAdmin } from './AdminContext';

export default function AdminDeliveryPartners({ showToast }) {
  const { deliveryPartners, togglePartnerActive, updatePartnerOption } = useAdmin();
  const [editingOption, setEditingOption] = useState(null); // { partnerId, optionIndex }
  const [editPrice, setEditPrice] = useState('');

  const handleEditStart = (partnerId, optionIndex, currentPrice) => {
    setEditingOption({ partnerId, optionIndex });
    setEditPrice(String(currentPrice));
  };

  const handleEditSave = () => {
    if (editingOption) {
      const price = parseInt(editPrice, 10);
      if (!isNaN(price) && price >= 0) {
        updatePartnerOption(editingOption.partnerId, editingOption.optionIndex, { price });
        showToast('Delivery price updated');
      }
      setEditingOption(null);
      setEditPrice('');
    }
  };

  const handleEditCancel = () => {
    setEditingOption(null);
    setEditPrice('');
  };

  return (
    <div>
      {/* Overview stat cards */}
      <div className="admin-stats-grid" style={{ marginBottom: 28 }}>
        <div className="admin-stat-card green">
          <div className="admin-stat-icon green">🚚</div>
          <div className="admin-stat-value">{deliveryPartners.length}</div>
          <div className="admin-stat-label">Total Partners</div>
          <div className="admin-stat-change">↑ all configured</div>
        </div>
        <div className="admin-stat-card blue">
          <div className="admin-stat-icon blue">✅</div>
          <div className="admin-stat-value">{deliveryPartners.filter(p => p.active).length}</div>
          <div className="admin-stat-label">Active Partners</div>
          <div className="admin-stat-change">shown at checkout</div>
        </div>
        <div className="admin-stat-card orange">
          <div className="admin-stat-icon orange">⚡</div>
          <div className="admin-stat-value">
            {deliveryPartners.reduce((s, p) => s + p.options.length, 0)}
          </div>
          <div className="admin-stat-label">Total Options</div>
          <div className="admin-stat-change">across all partners</div>
        </div>
        <div className="admin-stat-card purple">
          <div className="admin-stat-icon purple">🆓</div>
          <div className="admin-stat-value">
            {deliveryPartners.filter(p => p.options.some(o => o.price === 0)).length}
          </div>
          <div className="admin-stat-label">Free Shipping</div>
          <div className="admin-stat-change">partners with free option</div>
        </div>
      </div>

      {/* Partners list */}
      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">Delivery Partners</span>
          <span style={{ fontSize: 12, color: '#888' }}>
            Toggle partners on/off • Click price to edit
          </span>
        </div>

        <div className="dp-table">
          {/* Table header */}
          <div className="dp-table-header">
            <div className="dp-col-partner">Partner</div>
            <div className="dp-col-options">Delivery Options</div>
            <div className="dp-col-status">Status</div>
          </div>

          {/* Rows */}
          {deliveryPartners.map(partner => (
            <div className={`dp-row ${!partner.active ? 'dp-row-inactive' : ''}`} key={partner.id}>
              {/* Partner info */}
              <div className="dp-col-partner">
                <span className="dp-logo">{partner.logo}</span>
                <div>
                  <div className="dp-name">{partner.name}</div>
                  {partner.freeAbove && (
                    <div className="dp-free-note">
                      Free Standard above ₹{partner.freeAbove.toLocaleString('en-IN')}
                    </div>
                  )}
                </div>
              </div>

              {/* Options */}
              <div className="dp-col-options">
                {partner.options.map((opt, idx) => (
                  <div className="dp-option-chip" key={idx}>
                    <span className="dp-option-speed">{opt.speed}</span>
                    <span className="dp-option-days">{opt.days}</span>
                    {editingOption?.partnerId === partner.id && editingOption?.optionIndex === idx ? (
                      <span className="dp-option-edit-group">
                        <span style={{ color: '#888' }}>₹</span>
                        <input
                          className="dp-price-input"
                          type="number"
                          value={editPrice}
                          onChange={e => setEditPrice(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleEditSave();
                            if (e.key === 'Escape') handleEditCancel();
                          }}
                          autoFocus
                        />
                        <button className="dp-save-btn" onClick={handleEditSave}>✓</button>
                        <button className="dp-cancel-btn" onClick={handleEditCancel}>✕</button>
                      </span>
                    ) : (
                      <span
                        className="dp-option-price"
                        onClick={() => partner.active && handleEditStart(partner.id, idx, opt.price)}
                        title={partner.active ? 'Click to edit price' : ''}
                      >
                        {opt.price === 0 ? 'FREE' : `₹${opt.price}`}
                        {partner.active && <span className="dp-edit-hint">✎</span>}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Status toggle */}
              <div className="dp-col-status">
                <button
                  className={`dp-toggle ${partner.active ? 'dp-toggle-on' : 'dp-toggle-off'}`}
                  onClick={() => {
                    togglePartnerActive(partner.id);
                    showToast(
                      `${partner.name} ${partner.active ? 'disabled' : 'enabled'}`,
                      partner.active ? 'error' : 'success'
                    );
                  }}
                >
                  <span className="dp-toggle-thumb" />
                </button>
                <span className={`dp-status-label ${partner.active ? '' : 'dp-status-off'}`}>
                  {partner.active ? 'Active' : 'Disabled'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
