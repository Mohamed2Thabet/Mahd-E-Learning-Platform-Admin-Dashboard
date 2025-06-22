import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FiUsers, FiUser, FiSettings, FiShield, FiLogOut } from 'react-icons/fi';
import AdminDashboard from './components/AdminDashboard';
import UserProfile from './components/UserProfile';
import Login from './components/Login';
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

function App() {
  const [activeTab, setActiveTab] = useState('admin');
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      // In a real app, you'd validate the token here
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
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setUser(null);
    setActiveTab('admin');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen">
      <StyledNavbar expand="lg" variant="dark">
        <Container fluid>
          <Navbar.Brand href="#home">
            <FiShield style={{ marginRight: '8px' }} />
            Admin Dashboard
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {(user?.role === 'Admin' || user?.role === 'Manager') && (
                <Nav.Link 
                  active={activeTab === 'admin'} 
                  onClick={() => setActiveTab('admin')}
                >
                  <NavIcon><FiUsers /></NavIcon>
                  User Management
                </Nav.Link>
              )}
              <Nav.Link 
                active={activeTab === 'profile'} 
                onClick={() => setActiveTab('profile')}
              >
                <NavIcon><FiUser /></NavIcon>
                Profile
              </Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link>
                <NavIcon><FiSettings /></NavIcon>
                Settings
              </Nav.Link>
              <Nav.Item>
                <LogoutButton onClick={handleLogout}>
                  <FiLogOut />
                  Logout
                </LogoutButton>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </StyledNavbar>

      <Container fluid className="py-4">
        {activeTab === 'admin' && (user?.role === 'Admin' || user?.role === 'Manager') && <AdminDashboard />}
        {activeTab === 'profile' && <UserProfile />}
      </Container>
    </div>
  );
}

export default App;