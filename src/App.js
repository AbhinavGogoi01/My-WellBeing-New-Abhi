// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import DashboardPage from './pages/DashboardPage';
import DashboardHome from './components/features/dashboard/DashboardHome';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from '../src/components/common/ProtectedRoute1';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

// Wrapper component to conditionally render Header and Footer
const AppLayout = () => {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');

  return (
    <div className="app-container">
      {!isDashboard && <Header />}
      <main className={isDashboard ? "dashboard-main" : "main-content"}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboardHome" 
            element={
              <ProtectedRoute>
                <DashboardHome />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppLayout />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;