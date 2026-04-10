import React from 'react';

const announcements = [
  { emoji: '🌿', text: 'OFF on orders above ₹3000 | Use code - TBOF10' },
  { emoji: '🎁', text: 'So many perks await! Membership now LIVE 🎉' },
  { emoji: '🌾', text: 'Our Atta Fest is LIVE 🎉 Get All and Every Atta at 12% OFF | Use Code ATTA12' },
  { emoji: '💰', text: 'Big Savings Alert! Shop now and save big!' },
  { emoji: '🌿', text: 'OFF on orders above ₹3000 | Use code - TBOF10' },
  { emoji: '🎁', text: 'So many perks await! Membership now LIVE 🎉' },
  { emoji: '🌾', text: 'Our Atta Fest is LIVE 🎉 Get All and Every Atta at 12% OFF | Use Code ATTA12' },
  { emoji: '💰', text: 'Big Savings Alert! Shop now and save big!' },
];

export default function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      <div className="announcement-track">
        {announcements.map((item, i) => (
          <span className="announcement-item" key={i}>
            <span className="emoji">{item.emoji}</span>
            {item.text}
            <span style={{ color: 'rgba(255,255,255,0.4)', marginLeft: 16 }}>|</span>
          </span>
        ))}
      </div>
    </div>
  );
}
