import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './index.css';
import './App.css';

// Shop
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import Navbar from './components/Navbar';
import FilterSort from './components/FilterSort';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';

// Checkout
import CheckoutPage from './components/CheckoutPage';
import OrderConfirmation from './components/OrderConfirmation';

// Admin
import AdminApp from './admin/AdminApp';
import { useAdmin } from './admin/AdminContext';

// ── Shop page ─────────────────────────────────────────────────
function ShopPage({ cartItems, setCartItems, cartOpen, setCartOpen }) {
  const { products } = useAdmin();

  const totalQty = cartItems.reduce((sum, i) => sum + i.qty, 0);

  const handleAddToCart = (product, variant) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id && i.variant === variant);
      if (existing) {
        return prev.map(i =>
          i.id === product.id && i.variant === variant
            ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, {
        id: product.id, name: product.name,
        price: product.price, image: product.image,
        variant, qty: 1,
      }];
    });
    setCartOpen(true);
  };

  const handleUpdateQty = (productId, variant, newQty) => {
    if (newQty <= 0) {
      setCartItems(prev => prev.filter(i => !(i.id === productId && i.variant === variant)));
    } else {
      setCartItems(prev => prev.map(i =>
        i.id === productId && i.variant === variant ? { ...i, qty: newQty } : i
      ));
    }
  };

  const handleRemove = (productId, variant) => {
    setCartItems(prev => prev.filter(i => !(i.id === productId && i.variant === variant)));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-cream)' }}>
      <AnnouncementBar />
      <Header cartCount={totalQty} onCartClick={() => setCartOpen(true)} />
      <Navbar />
      <FilterSort count={products.length} />
      <ProductGrid
        products={products}
        cartItems={cartItems}
        onAddToCart={handleAddToCart}
        onUpdateQty={handleUpdateQty}
      />
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemove}
      />
    </div>
  );
}

// ── Root Router ───────────────────────────────────────────────
export default function App() {
  // Lift cart state so checkout can access it
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <Routes>
      <Route path="/admin/*" element={<AdminApp />} />
      <Route
        path="/checkout"
        element={
          <CheckoutPage
            cartItems={cartItems}
            setCartItems={setCartItems}
          />
        }
      />
      <Route
        path="/order-confirmation"
        element={<OrderConfirmation />}
      />
      <Route
        path="/*"
        element={
          <ShopPage
            cartItems={cartItems}
            setCartItems={setCartItems}
            cartOpen={cartOpen}
            setCartOpen={setCartOpen}
          />
        }
      />
    </Routes>
  );
}
