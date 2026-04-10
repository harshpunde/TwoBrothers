import React, { useState } from 'react';
import { useAdmin } from './AdminContext';

export default function AdminAnnouncements({ showToast }) {
  const { settings, updateSettings } = useAdmin();
  const [items, setItems] = useState([...settings.announcements]);

  const handleChange = (i, val) => {
    setItems(prev => prev.map((item, idx) => idx === i ? val : item));
  };

  const handleDelete = (i) => {
    setItems(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleAdd = () => {
    setItems(prev => [...prev, '🌿 New announcement text here']);
  };

  const handleSave = () => {
    updateSettings({ announcements: items.filter(Boolean) });
    showToast('✅ Announcements saved!', 'success');
  };

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">Announcement Bar</span>
          <div className="admin-card-actions">
            <button className="admin-btn admin-btn-secondary" onClick={handleAdd}>
              + Add Message
            </button>
            <button className="admin-btn admin-btn-primary" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>

        <div style={{ padding: '20px 22px' }}>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
            These messages scroll across the top announcement bar of your store. Drag to reorder (edit text inline).
          </p>

          <div className="announcement-list">
            {items.map((item, i) => (
              <div className="announcement-item-row" key={i}>
                <span style={{ fontSize: 18 }}>☰</span>
                <span style={{ fontSize: 16, marginRight: 4 }}>
                  {item.split(' ')[0]}
                </span>
                <input
                  value={item}
                  onChange={e => handleChange(i, e.target.value)}
                  style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 13.5, fontFamily: 'Inter,sans-serif', outline: 'none' }}
                />
                <button className="announcement-delete-btn" onClick={() => handleDelete(i)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <div style={{ textAlign: 'center', color: '#aaa', padding: '40px 0', fontSize: 14 }}>
              No announcements. Click "+ Add Message" to add one.
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="admin-card" style={{ marginTop: 20 }}>
        <div className="admin-card-header">
          <span className="admin-card-title">Live Preview</span>
        </div>
        <div style={{ background: '#2b5e1a', color: '#fff', padding: '10px 24px', fontSize: 13, overflowX: 'auto', whiteSpace: 'nowrap' }}>
          {items.map((item, i) => (
            <span key={i} style={{ marginRight: 60 }}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
