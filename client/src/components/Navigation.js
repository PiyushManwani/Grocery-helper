import React from 'react';

const Navigation = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>🛒 Grocery Helper</h1>
      </div>
      <div className="navbar-content">
        <span className="user-info">Welcome, {user?.name}!</span>
        <button className="btn-logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
