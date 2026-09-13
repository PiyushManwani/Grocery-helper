import React, { useState, useEffect } from 'react';

const Navigation = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('pantry');
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>🛒 Grocery Helper</h1>
        </div>

        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'pantry' ? 'active' : ''}`}
            onClick={() => setActiveTab('pantry')}
          >
            📦 Pantry
          </button>
          <button
            className={`nav-tab ${activeTab === 'budget' ? 'active' : ''}`}
            onClick={() => setActiveTab('budget')}
          >
            💰 Budget
          </button>
          <button
            className={`nav-tab ${activeTab === 'shopping' ? 'active' : ''}`}
            onClick={() => setActiveTab('shopping')}
          >
            🛍️ Shopping
          </button>
          <button
            className={`nav-tab ${activeTab === 'ai' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai')}
          >
            🤖 AI Helper
          </button>
        </div>

        <div className="nav-user">
          <div className="user-info">
            <span className="user-name">{user?.name || 'User'}</span>
            <button
              className="user-menu-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              ⚙️
            </button>
          </div>
          {showUserMenu && (
            <div className="user-menu">
              <button onClick={onLogout} className="btn-logout">
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
