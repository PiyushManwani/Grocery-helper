import React, { useState, useEffect } from 'react';

const Navigation = ({ user, currentPage, onPageChange, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);

  const pages = [
    { id: 'pantry', label: '📦 Pantry', icon: '📦' },
    { id: 'budget', label: '💰 Budget', icon: '💰' },
    { id: 'shopping', label: '🛍 Shopping', icon: '🛍' },
    { id: 'ai', label: '🤖 AI Assistant', icon: '🤖' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>🛒 Grocery Helper</h1>
        </div>

        <div className="navbar-menu">
          {pages.map(page => (
            <button
              key={page.id}
              className={`nav-button ${currentPage === page.id ? 'active' : ''}`}
              onClick={() => onPageChange(page.id)}
            >
              {page.label}
            </button>
          ))}
        </div>

        <div className="navbar-user">
          <span className="user-greeting">👤 {user?.name}</span>
          <button className="btn-logout" onClick={onLogout}>
            Logout
          </button>
        </div>

        <button
          className="navbar-toggle"
          onClick={() => setShowMenu(!showMenu)}
        >
          ☰
        </button>
      </div>

      {showMenu && (
        <div className="mobile-menu">
          {pages.map(page => (
            <button
              key={page.id}
              className={`mobile-menu-item ${currentPage === page.id ? 'active' : ''}`}
              onClick={() => {
                onPageChange(page.id);
                setShowMenu(false);
              }}
            >
              {page.label}
            </button>
          ))}
          <button className="mobile-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
