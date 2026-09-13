import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import './Navigation.css';

function Navigation() {
  const { user, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🛒 Grocery Helper
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/pantry" className="nav-link">Pantry</Link>
          </li>
          <li className="nav-item">
            <Link to="/budget" className="nav-link">Budget</Link>
          </li>
          <li className="nav-item">
            <Link to="/shopping" className="nav-link">Shopping List</Link>
          </li>
          <li className="nav-item">
            <Link to="/ai" className="nav-link">AI Assistant</Link>
          </li>
          <li className="nav-item user-menu">
            <span className="user-name">{user?.name}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
