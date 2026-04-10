import React, { useState } from 'react';

// SVG Icons
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const WishlistIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

export default function Header({ cartCount = 0, onCartClick }) {
  const [search, setSearch] = useState('');

  return (
    <header className="header">
      {/* Search */}
      <div className="header-search">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search organic products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Logo */}
      <div className="header-logo">
        <span className="logo-title">TWO<br/>BROTHERS</span>
        <span className="logo-subtitle">Organic Farms</span>
      </div>

      {/* Actions */}
      <div className="header-actions">
        <button className="header-icon-btn" aria-label="Account">
          <UserIcon />
        </button>
        <button className="header-icon-btn" aria-label="Wishlist">
          <WishlistIcon />
        </button>
        <button className="header-icon-btn" aria-label="Cart" style={{ position: 'relative' }} onClick={onCartClick}>
          <CartIcon />
          <span className="cart-badge">{cartCount}</span>
        </button>
      </div>
    </header>
  );
}
