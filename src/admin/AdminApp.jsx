import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAdmin } from './AdminContext';
import AdminLogin from './AdminLogin';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminDeliveryPartners from './AdminDeliveryPartners';
import AdminAnnouncements from './AdminAnnouncements';
import AdminSettings from './AdminSettings';
import './admin.css';

// ── Toast Notification ────────────────────────────────────────
function Toast({ message, type, onHide }) {
  React.useEffect(() => {
    const t = setTimeout(onHide, 3000);
    return () => clearTimeout(t);
  }, [message, onHide]);

  return (
    <div className={`admin-toast ${type}`}>
      {message}
    </div>
  );
}

// ── Page wrapper with topbar ──────────────────────────────────
function AdminPage({ title, subtitle, children }) {
  return (
    <>
      <div className="admin-topbar">
        <div>
          <div className="admin-topbar-title">{title}</div>
          {subtitle && <div className="admin-topbar-subtitle">{subtitle}</div>}
        </div>
        <div className="admin-topbar-right">
          <a href="/" target="_blank" rel="noreferrer" className="admin-view-store-btn">
            🏪 View Store
          </a>
        </div>
      </div>
      <div className="admin-page-content">{children}</div>
    </>
  );
}

// ── Protected Route ───────────────────────────────────────────
function RequireAuth({ children }) {
  const { isAuthenticated } = useAdmin();
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

// ── Admin Layout ──────────────────────────────────────────────
function AdminLayout({ showToast }) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <Routes>
          <Route path="/" element={
            <AdminPage title="Dashboard" subtitle="Welcome back, Admin 👋">
              <AdminDashboard />
            </AdminPage>
          } />
          <Route path="/products" element={
            <AdminPage title="Products" subtitle="Manage your product catalog">
              <AdminProducts showToast={showToast} />
            </AdminPage>
          } />
          <Route path="/delivery-partners" element={
            <AdminPage title="Delivery Partners" subtitle="Manage shipping & delivery options">
              <AdminDeliveryPartners showToast={showToast} />
            </AdminPage>
          } />
          <Route path="/announcements" element={
            <AdminPage title="Announcements" subtitle="Manage your scrolling banner messages">
              <AdminAnnouncements showToast={showToast} />
            </AdminPage>
          } />
          <Route path="/settings" element={
            <AdminPage title="Settings" subtitle="Configure your store preferences">
              <AdminSettings showToast={showToast} />
            </AdminPage>
          } />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
}

// ── Root Admin entry ──────────────────────────────────────────
export default function AdminApp() {
  const { isAuthenticated } = useAdmin();
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/admin" replace /> : <AdminLogin />}
        />
        <Route
          path="/*"
          element={
            <RequireAuth>
              <AdminLayout showToast={showToast} />
            </RequireAuth>
          }
        />
      </Routes>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onHide={() => setToast(null)}
        />
      )}
    </>
  );
}
