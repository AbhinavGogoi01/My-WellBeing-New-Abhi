// src/components/layout/Sidebar.js
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { auth } from '../Auth/firebase'; // Adjust path as needed
import { signOut } from 'firebase/auth';
import '../../styles/Sidebar.css';

const Sidebar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(true);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userInitial, setUserInitial] = useState('U');
  
  // Get current user info when component mounts
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      // Use displayName for username
      const displayName = user.displayName || 'User';
      setUserName(displayName);
      setUserEmail(user.email || 'user@example.com');
      setUserInitial(displayName.charAt(0).toUpperCase());
    } else {
      // If no user is logged in, redirect to login
      navigate('/login');
    }
  }, [navigate]);
  
  // Define feature categories
  const mainFeatures = [
    { path: '', label: 'Dashboard', icon: '📊' },
    { path: 'health-tracker', label: 'Health Tracker', icon: '📈' },
    { path: 'water-tracker', label: 'Water Tracker', icon: '💧' },
    { path: 'exercise', label: 'Exercise Routines', icon: '🏋️' },
    { path: 'sleep', label: 'Sleep Tracker', icon: '😴' }
  ];
  
  const medicalFeatures = [
    { path: 'medicine-reminders', label: 'Medicine Reminders', icon: '💊' },
    { path: 'doctor-consultation', label: 'Doctor Consultation', icon: '👨‍⚕️' },
    { path: 'symptoms', label: 'Symptom Checker', icon: '🔍' },
    { path: 'first-aid', label: 'First Aid Guide', icon: '🩹' }
  ];
  
  const wellnessFeatures = [
    { path: 'mental-wellness', label: 'Mental Wellness', icon: '🧠' },
    { path: 'recipes', label: 'Healthy Recipes', icon: '🥗' },
    { path: 'forum', label: 'Community Forum', icon: '💬' },
    { path: 'challenges', label: 'Daily Challenges', icon: '🏆' }
  ];

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const isActive = (path) => {
    if (path === '') {
      return location.pathname === '/dashboardHome' || location.pathname === '/dashboardHome/';
    }
    return location.pathname.includes(`/dashboard/${path}`);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Force clear any cached auth tokens
      window.localStorage.removeItem('firebase:authUser');
      
      // Navigate to home page after logout
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  return (
    <div className={`sidebar ${darkMode ? 'dark' : ''} ${expanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-header">
        <div className="app-logo">
          <span className="logo-icon">❤️</span>
          {expanded && <h1>My Well Being</h1>}
        </div>
        <button className="toggle-button" onClick={toggleSidebar}>
          {expanded ? '◀' : '▶'}
        </button>
      </div>
      
      {expanded && (
        <div className="user-profile">
          <div className="avatar">
            {userInitial}
          </div>
          <div className="user-info">
            <h3>{userName}</h3>
            <p>{userEmail}</p>
          </div>
        </div>
      )}
      
      <div className="sidebar-content">
        <div className="menu-category">
          {expanded && <h4>Main Features</h4>}
          <div className="menu-items">
            {mainFeatures.map((item) => (
              <NavLink
                key={item.path}
                to={`/dashboard/${item.path}`}
                className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
                title={item.label}
              >
                <div className="menu-icon">{item.icon}</div>
                {expanded && <span>{item.label}</span>}
              </NavLink>
            ))}
          </div>
        </div>
        
        <div className="menu-category">
          {expanded && <h4>Medical</h4>}
          <div className="menu-items">
            {medicalFeatures.map((item) => (
              <NavLink
                key={item.path}
                to={`/dashboard/${item.path}`}
                className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
                title={item.label}
              >
                <div className="menu-icon">{item.icon}</div>
                {expanded && <span>{item.label}</span>}
              </NavLink>
            ))}
          </div>
        </div>
        
        <div className="menu-category">
          {expanded && <h4>Wellness</h4>}
          <div className="menu-items">
            {wellnessFeatures.map((item) => (
              <NavLink
                key={item.path}
                to={`/dashboard/${item.path}`}
                className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
                title={item.label}
              >
                <div className="menu-icon">{item.icon}</div>
                {expanded && <span>{item.label}</span>}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
      
      <div className="sidebar-footer">
        <button 
          className="theme-toggle" 
          onClick={toggleDarkMode}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <div className="menu-icon">
            {darkMode ? '☀️' : '🌙'}
          </div>
          {expanded && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
        
        <button 
          className="logout-button" 
          onClick={handleLogout}
          title="Logout"
        >
          <div className="menu-icon">🚪</div>
          {expanded && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;