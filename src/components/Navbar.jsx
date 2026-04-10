import React from 'react';

const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const LeafIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);



const navItems = [

  { label: 'ATTA', hasIcon: true, iconType: 'grain' },
  { label: 'SHOP BY CATEGORY', hasDropdown: true },
  { label: 'JOIN', specialCollective: true },
  { label: 'SHOP BY CONCERN', hasDropdown: true },
  { label: 'FARM LIFE', hasDropdown: true, hasLeaf: true },
  { label: 'CONNECT', hasDropdown: true },
];

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {navItems.map((item, i) => (
          <React.Fragment key={item.label}>
            {i > 0 && <div className="nav-divider" />}

            {item.specialCollective ? (
              <div className="nav-item join-collective">
                <span>JOIN</span>
                <div className="collective-badge">
                  <span>COLLECTIVE</span>
                  <span>🎉</span>
                </div>
              </div>
            ) : (
              <div className="nav-item">
                {item.iconType === 'ghee' && (
                  <span style={{ color: 'var(--orange-primary)', fontSize: 18 }}>🧈</span>
                )}
                {item.iconType === 'grain' && (
                  <span style={{ fontSize: 18 }}>🌾</span>
                )}
                <span>{item.label}</span>
                {item.hasLeaf && (
                  <span style={{ fontSize: 16 }}>🌿</span>
                )}
                {item.hasDropdown && <ChevronDown />}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}
