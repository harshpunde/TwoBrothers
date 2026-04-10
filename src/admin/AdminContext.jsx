import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '../data/products';
import { deliveryPartners as initialPartners } from '../data/deliveryPartners';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  // ── Products ──────────────────────────────────────────────
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('tbof_products');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch { return initialProducts; }
  });

  useEffect(() => {
    localStorage.setItem('tbof_products', JSON.stringify(products));
  }, [products]);

  const addProduct = (product) => {
    const newProduct = { ...product, id: Date.now() };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id, updates) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // ── Auth ──────────────────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_auth') === 'true';
  });

  const login = (username, password) => {
    if (username === 'admin' && password === 'tbof2024') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
  };

  // ── Site Settings ──────────────────────────────────────────
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('tbof_settings');
      return saved ? JSON.parse(saved) : {
        storeName: 'Two Brothers Organic Farms',
        tagline: 'ORGANIC FARMS',
        showFreeShippingBanner: true,
        freeShippingThreshold: 1499,
        discountCodeEnabled: true,
        discountCode: 'TBOF10',
        discountPercent: 10,
        discountThreshold: 3000,
        announcements: [
          '🌿 OFF on orders above ₹3000 | Use code - TBOF10',
          '🎁 So many perks await! Membership now LIVE 🎉',
          '🌾 Our Atta Fest is LIVE 🎉 Get All and Every Atta at 12% OFF | Use Code ATTA12',
          '💰 Big Savings Alert! Shop now and save big!',
        ],
        primaryColor: '#2b5e1a',
        accentColor: '#e07b2a',
      };
    } catch { return {}; }
  });

  const updateSettings = (updates) => {
    setSettings(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem('tbof_settings', JSON.stringify(next));
      return next;
    });
  };

  // ── Delivery Partners ──────────────────────────────────────
  const [deliveryPartners, setDeliveryPartners] = useState(() => {
    try {
      const saved = localStorage.getItem('tbof_delivery_partners');
      return saved ? JSON.parse(saved) : initialPartners;
    } catch { return initialPartners; }
  });

  useEffect(() => {
    localStorage.setItem('tbof_delivery_partners', JSON.stringify(deliveryPartners));
  }, [deliveryPartners]);

  const updateDeliveryPartner = (id, updates) => {
    setDeliveryPartners(prev =>
      prev.map(p => p.id === id ? { ...p, ...updates } : p)
    );
  };

  const togglePartnerActive = (id) => {
    setDeliveryPartners(prev =>
      prev.map(p => p.id === id ? { ...p, active: !p.active } : p)
    );
  };

  const updatePartnerOption = (partnerId, optionIndex, updates) => {
    setDeliveryPartners(prev =>
      prev.map(p => {
        if (p.id !== partnerId) return p;
        const newOptions = [...p.options];
        newOptions[optionIndex] = { ...newOptions[optionIndex], ...updates };
        return { ...p, options: newOptions };
      })
    );
  };

  return (
    <AdminContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct,
      isAuthenticated, login, logout,
      settings, updateSettings,
      deliveryPartners, updateDeliveryPartner, togglePartnerActive, updatePartnerOption,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
