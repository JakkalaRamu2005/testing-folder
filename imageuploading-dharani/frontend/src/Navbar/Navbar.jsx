import React, { useState } from 'react';
import { Link } from 'react-router';
import './navbar.css';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = React.useContext(AuthContext);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`navbar ${isMenuOpen ? 'active' : ''}`}>
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🌱</span>
          <span className="logo-text">Smart Dharani</span>
        </Link>

        {/* Navigation Links */}
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              <span className="nav-icon">🏠</span>
              <span className="nav-label">Home</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link">
              <span className="nav-icon">ℹ️</span>
              <span className="nav-label">About</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/services" className="nav-link">
              <span className="nav-icon">⚙️</span>
              <span className="nav-label">Services</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">
              <span className="nav-icon">📊</span>
              <span className="nav-label">Dashboard</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/learn" className="nav-link">
              <span className="nav-icon">📚</span>
              <span className="nav-label">Learn</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link">
              <span className="nav-icon">📞</span>
              <span className="nav-label">Contact</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/join" className="nav-link">
              <span className="nav-icon">👥</span>
              <span className="nav-label">Join Us</span>
            </Link>
          </li>
        </ul>

        {/* CTA Button */}
        <div className="nav-cta">
          <button className="ask-dharani-btn">
            🎤 <span>Ask Dharani</span>
          </button>
        </div>

        {/* Logout Button */}
        <div className="nav-footer">
          <button className="logout-btn" onClick={logout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </div>

      {/* Hamburger Menu - Mobile Only */}
      <button className="nav-toggle" onClick={toggleMenu}>
        <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
      </button>
    </nav>
  );
}
