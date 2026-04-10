import React from 'react';
import { useAdmin } from './AdminContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { products } = useAdmin();
  const navigate = useNavigate();

  const totalProducts = products.length;
  const avgPrice = products.length
    ? Math.round(products.reduce((s, p) => s + p.price, 0) / products.length)
    : 0;

  const stats = [
    { label: 'Total Products', value: totalProducts, icon: '📦', color: 'green',  change: '+2 this week' },
    { label: 'Avg Price',      value: `₹${avgPrice.toLocaleString('en-IN')}`, icon: '💰', color: 'orange', change: 'across all products' },
    { label: 'Badges Active',  value: products.filter(p => p.badge).length, icon: '🏷️', color: 'blue',   change: 'labeled products' },
    { label: 'Total Reviews',  value: '12k+', icon: '⭐', color: 'purple', change: 'across all products' },
  ];

  const quickActions = [
    { icon: '➕', label: 'Add Product',      desc: 'List a new product',         path: '/admin/products' },
    { icon: '📢', label: 'Edit Banners',     desc: 'Update announcements',        path: '/admin/announcements' },
    { icon: '⚙️', label: 'Site Settings',    desc: 'Colors, theme & details',    path: '/admin/settings' },
    { icon: '🏪', label: 'View Storefront',  desc: 'Open the live shop',          path: '/' },
  ];

  return (
    <div>
      {/* Stats */}
      <div className="admin-stats-grid">
        {stats.map(s => (
          <div key={s.label} className={`admin-stat-card ${s.color}`}>
            <div className={`admin-stat-icon ${s.color}`}>{s.icon}</div>
            <div className="admin-stat-value">{s.value}</div>
            <div className="admin-stat-label">{s.label}</div>
            <div className="admin-stat-change">↑ {s.change}</div>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="dashboard-grid">
        {/* Recent Products */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Recent Products</span>
            <button className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={() => navigate('/admin/products')}>
              View All
            </button>
          </div>
          <div className="recent-products-list">
            {products.slice(0, 6).map(p => (
              <div className="recent-product-row" key={p.id}>
                <img
                  src={p.image}
                  alt={p.name}
                  className="admin-table-img"
                  style={{ width: 42, height: 42 }}
                />
                <span className="recent-product-name">{p.name}</span>
                {p.badge && (
                  <span className={`admin-badge-tag ${p.badge}`}>{p.badgeLabel}</span>
                )}
                <span className="recent-product-price">
                  ₹{p.price.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Quick Actions</span>
          </div>
          <div className="quick-actions-list">
            {quickActions.map(a => (
              <div key={a.label} className="quick-action-item"
                onClick={() => navigate(a.path)}>
                <div className="quick-action-icon">{a.icon}</div>
                <div>
                  <div className="quick-action-label">{a.label}</div>
                  <div className="quick-action-desc">{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
