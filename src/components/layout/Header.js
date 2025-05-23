// src/components/layout/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../Auth/firebase'; // Adjust path as needed
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/Header.css';
// Import your logo image from the correct path
import logoImage from './logo.png'; // Using the path you provided

function Header() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userName, setUserName] = useState('');
  const { darkMode, toggleDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Set up auth state listener when component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setUserName(user.displayName || user.email || 'User');
      }
    });
    
    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  // Add scroll listener to add shadow to header when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  // Don't render header on dashboard pages
  if (location.pathname.includes('/dashboard')) {
    return null;
  }

  return (
    <header className={`site-header ${darkMode ? 'dark' : ''} ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <Link to="/" className="logo">
          {/* Using the imported logo image from the correct path */}
          <img src={logoImage} alt="My Well Being Logo" className="logo-img" />
          <span className="logo-text">My Well Being</span>
        </Link>

        <nav className="desktop-nav">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <a href="#features" className="nav-link">Features</a>
          
          {currentUser ? (
            <div className="nav-group">
              <span className="username-display">Hi, {userName}</span>
              <Link to="/dashboardHome" className={`nav-link ${location.pathname === '/dashboardHome' ? 'active' : ''}`}>Dashboard</Link>
              <button onClick={handleLogout} className="nav-link logout-btn">
                Log out
              </button>
              <button 
                onClick={toggleDarkMode}
                className="theme-toggle-btn"
                aria-label="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          ) : (
            <div className="nav-group auth-buttons">
              <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>Log in</Link>
              <Link to="/signup" className="nav-button">Get Started</Link>
              <button 
                onClick={toggleDarkMode}
                className="theme-toggle-btn"
                aria-label="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          )}
        </nav>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="menu-button"
          aria-label="Toggle menu"
        >
          <span className="menu-icon">
            <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
          </span>
        </button>

        {isMenuOpen && (
          <div className="mobile-nav-container">
            <nav className="mobile-nav">
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Home</Link>
              <a href="#features" className="nav-link" onClick={() => setIsMenuOpen(false)}>Features</a>
              
              {currentUser ? (
                <>
                  <span className="username-display mobile">Hi, {userName}</span>
                  <Link to="/dashboardHome" className={`nav-link ${location.pathname === '/dashboardHome' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                  <button onClick={handleLogout} className="nav-link logout-btn">
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Log in</Link>
                  <Link to="/signup" className="nav-button mobile-cta" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                </>
              )}
              
              <button
                onClick={() => { toggleDarkMode(); setIsMenuOpen(false); }}
                className="theme-toggle-mobile"
              >
                {darkMode ? 'Switch to Light Mode ☀️' : 'Switch to Dark Mode 🌙'}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;