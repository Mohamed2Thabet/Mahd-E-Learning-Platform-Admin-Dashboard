import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import { Navbar } from 'react-bootstrap';
import styled from 'styled-components';

const StyledNavbar = styled(Navbar)`
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const NavIcon = styled.div`
  display: inline-flex;
  align-items: center;
  margin-right: 8px;
  font-size: 1.1rem;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: var(--text-light);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 77, 79, 0.1);
    color: var(--error-color);
  }
`;

const App = () => {
  const [activeTab, setActiveTab] = useState('admin');
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
      setUser({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        role: 'Admin'
      });
    }
  }, []);

  const handleLogin = (loginResponse) => {
    setIsAuthenticated(true);
    setUser(loginResponse.user || {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      role: 'Admin'
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setUser(null);
    setActiveTab('admin');
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
