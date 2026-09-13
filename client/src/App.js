import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './pages/Login';
import PantryTracker from './pages/PantryTracker';
import BudgetTracker from './pages/BudgetTracker';
import ShoppingList from './pages/ShoppingList';
import AIAssistant from './pages/AIAssistant';

function App() {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState('pantry');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setActivePage('pantry');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setActivePage('pantry');
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>🛒 Grocery Helper</h1>
        </div>
        <div className="navbar-menu">
          <button
            className={`nav-btn ${activePage === 'pantry' ? 'active' : ''}`}
            onClick={() => setActivePage('pantry')}
          >
            📦 Pantry
          </button>
          <button
            className={`nav-btn ${activePage === 'budget' ? 'active' : ''}`}
            onClick={() => setActivePage('budget')}
          >
            💰 Budget
          </button>
          <button
            className={`nav-btn ${activePage === 'shopping' ? 'active' : ''}`}
            onClick={() => setActivePage('shopping')}
          >
            🛍️ Lists
          </button>
          <button
            className={`nav-btn ${activePage === 'ai' ? 'active' : ''}`}
            onClick={() => setActivePage('ai')}
          >
            🤖 AI
          </button>
        </div>
        <div className="navbar-user">
          <span className="user-name">👤 {user.name}</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main className="main-content">
        {activePage === 'pantry' && <PantryTracker user={user} />}
        {activePage === 'budget' && <BudgetTracker user={user} />}
        {activePage === 'shopping' && <ShoppingList user={user} />}
        {activePage === 'ai' && <AIAssistant user={user} />}
      </main>
    </div>
  );
}

export default App;
