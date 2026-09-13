import React, { useState, useEffect, useContext, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Pages
import Login from './pages/Login';
import PantryTracker from './pages/PantryTracker';
import BudgetTracker from './pages/BudgetTracker';
import ShoppingList from './pages/ShoppingList';
import AIAssistant from './pages/AIAssistant';

// Components
import Navigation from './components/Navigation';
import PrivateRoute from './components/PrivateRoute';

// Create Auth Context
export const AuthContext = createContext();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch('http://localhost:5000/api/auth/verify', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.data);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, handleLogin, handleLogout }}>
      <Router>
        {isAuthenticated && <Navigation />}
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/pantry" /> : <Login />}
          />
          <Route
            path="/pantry"
            element={
              <PrivateRoute>
                <PantryTracker />
              </PrivateRoute>
            }
          />
          <Route
            path="/budget"
            element={
              <PrivateRoute>
                <BudgetTracker />
              </PrivateRoute>
            }
          />
          <Route
            path="/shopping"
            element={
              <PrivateRoute>
                <ShoppingList />
              </PrivateRoute>
            }
          />
          <Route
            path="/ai"
            element={
              <PrivateRoute>
                <AIAssistant />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
