import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert, Spinner, Badge, Dropdown, ButtonGroup } from 'react-bootstrap';
import { FiEdit, FiTrash2, FiRefreshCw, FiSearch, FiUserPlus, FiUserCheck, FiUserX, FiUsers, FiFilter, FiMoreVertical } from 'react-icons/fi';
import styled, { createGlobalStyle } from 'styled-components';
import {
  fetchUsers,
  updateUser,
  deleteUser,
  suspendUser,
  activateUser,
  setUserRole
} from '../store/adminSlice';
import ThemeToggle from "./ThemeToggle/ThemeToggle";

// Global styles for full background coverage
const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    background: var(--background-dark);
    color: var(--text-light);
  }
`;

const StyledCard = styled(Card)`
  background: linear-gradient(135deg, var(--card-background), rgba(20, 26, 21, 0.95));
  border: 1px solid var(--border-color);
  border-radius: 20px;
  backdrop-filter: blur(15px);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  
  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 20px 60px rgba(0, 230, 118, 0.2);
    border-color: var(--primary);
  }
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 24px;
  padding: 32px 24px;
  border-bottom: 3px solid var(--primary);
  background: linear-gradient(135deg, var(--background-dark), var(--card-background));
  border-radius: 16px;
  margin-top: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const StatsCard = styled(Card)`
  --stats-primary: var(--primary);
  --stats-primary-dark: var(--primary-dark);
  --stats-shadow-color: rgba(0, 230, 118, 0.3);
  --stats-hover-shadow: rgba(0, 230, 118, 0.5);
  
  background: linear-gradient(135deg, var(--stats-primary), var(--stats-primary-dark));
  border: none;
  color: #000;
  font-weight: 700;
  border-radius: 20px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 12px 40px var(--stats-shadow-color);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.15));
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.08);
    box-shadow: 0 20px 60px var(--stats-hover-shadow);
    
    &::before {
      opacity: 1;
    }
  }
`;

const SearchInput = styled(Form.Control)`
  --search-bg: var(--card-background);
  --search-bg-secondary: rgba(20, 26, 21, 0.9);
  --search-border: var(--border-color);
  --search-text: var(--text-light);
  --search-placeholder: var(--text-secondary);
  --search-focus-shadow: rgba(0, 230, 118, 0.3);
  
  max-width: 400px;
  background: linear-gradient(135deg, var(--search-bg), var(--search-bg-secondary));
  border: 2px solid var(--search-border);
  color: var(--search-text);
  border-radius: 16px;
  padding: 14px 18px;
  font-weight: 600;
  transition: all 0.4s ease;
  font-size: 1rem;
  
  &:focus {
    background: var(--search-bg);
    border-color: var(--primary);
    box-shadow: 0 0 0 0.3rem var(--search-focus-shadow);
    color: var(--search-text);
    transform: scale(1.03);
  }
  
  &::placeholder {
    color: var(--search-placeholder);
    font-weight: 500;
  }
`;

const ActionButton = styled(Button)`
  --btn-hover-shadow: rgba(0, 0, 0, 0.4);
  --btn-success-bg: var(--success-color);
  --btn-success-hover: #26d467;
  
  margin: 0 8px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  font-weight: 700;
  padding: 12px 20px;
  border: 2px solid transparent;
  font-size: 0.95rem;
  
  &:hover {
    transform: translateY(-3px) scale(1.08);
    box-shadow: 0 12px 30px var(--btn-hover-shadow);
  }
  
  &.btn-outline-primary {
    border-color: var(--primary);
    color: var(--primary);
    background: transparent;
    
    &:hover {
      background: var(--primary);
      border-color: var(--primary);
      color: #000;
    }
  }
  
  &.btn-success {
    background: var(--btn-success-bg);
    border-color: var(--btn-success-bg);
    
    &:hover {
      background: var(--btn-success-hover);
      border-color: var(--btn-success-hover);
    }
  }
`;

const LoadingSpinner = styled.div`
  --spinner-bg: var(--card-background);
  --spinner-color: var(--primary);
  --spinner-text: var(--text-light);
  
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px;
  background: var(--spinner-bg);
  border-radius: 20px;
  margin: 50px 0;
  
  .spinner-border {
    color: var(--spinner-color);
    width: 4rem;
    height: 4rem;
  }
  
  span {
    color: var(--spinner-text);
    font-size: 1.2rem;
    font-weight: 600;
  }
`;

const FilterSection = styled.div`
  --filter-bg: var(--card-background);
  --filter-border: var(--border-color);
  --filter-text: var(--text-light);
  --filter-focus-shadow: rgba(0, 230, 118, 0.3);
  
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
  
  .form-select {
    background: var(--filter-bg);
    border: 2px solid var(--filter-border);
    color: var(--filter-text);
    border-radius: 12px;
    font-weight: 600;
    transition: all 0.4s ease;
    padding: 12px 16px;
    
    &:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 0.3rem var(--filter-focus-shadow);
      background: var(--filter-bg);
      color: var(--filter-text);
    }
    
    option {
      background: var(--filter-bg);
      color: var(--filter-text);
    }
  }
`;

const StatusBadge = styled(Badge)`
  font-size: 0.85rem;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
`;

const StyledTable = styled(Table)`
  --table-header-bg: var(--primary);
  --table-header-bg-dark: var(--primary-dark);
  --table-cell-bg: rgba(20, 26, 21, 0.7);
  --table-text: var(--text-light);
  --table-border: var(--border-color);
  --table-hover-bg: rgba(0, 230, 118, 0.15);
  
  &.table-dark {
    background: transparent;
    
    th {
      background: linear-gradient(135deg, var(--table-header-bg), var(--table-header-bg-dark));
      color: #000;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      border: none;
      padding: 20px 16px;
      font-size: 0.95rem;
      text-align: center;
    }
    
    td {
      background: var(--table-cell-bg);
      color: var(--table-text);
      border-color: var(--table-border);
      padding: 18px 16px;
      font-weight: 600;
      vertical-align: middle;
      text-align: center;
      font-size: 0.95rem;
    }
    
    tbody tr {
      transition: all 0.4s ease;
      
      &:hover {
        background: var(--table-hover-bg);
        transform: scale(1.02);
      }
    }
  }
`;

const StyledModal = styled(Modal)`
  --modal-bg: var(--card-background);
  --modal-border: var(--border-color);
  --modal-header-bg: var(--primary);
  --modal-header-bg-dark: var(--primary-dark);
  --modal-text: var(--text-light);
  --modal-input-bg: rgba(20, 26, 21, 0.8);
  --modal-focus-shadow: rgba(0, 230, 118, 0.25);
  
  .modal-content {
    background: var(--modal-bg);
    border: 2px solid var(--modal-border);
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  }
  
  .modal-header {
    border-bottom: 2px solid var(--modal-border);
    background: linear-gradient(135deg, var(--modal-header-bg), var(--modal-header-bg-dark));
    color: #000;
    font-weight: 800;
    border-radius: 18px 18px 0 0;
  }
  
  .modal-body {
    background: var(--modal-bg);
    color: var(--modal-text);
  }
  
  .modal-footer {
    border-top: 2px solid var(--modal-border);
    background: var(--modal-bg);
    border-radius: 0 0 18px 18px;
  }
  
  .form-control, .form-select {
    background: var(--modal-input-bg);
    border: 2px solid var(--modal-border);
    color: var(--modal-text);
    border-radius: 10px;
    
    &:focus {
      background: var(--modal-bg);
      border-color: var(--primary);
      box-shadow: 0 0 0 0.25rem var(--modal-focus-shadow);
      color: var(--modal-text);
    }
  }
  
  .form-label {
    color: var(--modal-text);
    font-weight: 700;
    margin-bottom: 10px;
  }
`;

const MainContainer = styled(Container)`
  --main-bg: var(--background-dark);
  --main-text: var(--text-light);
  
  background: var(--main-bg);
  color: var(--main-text);
  min-height: 100vh;
  padding: 30px;
  
  &.container-fluid {
    background: var(--main-bg);
    width: 100%;
    height: 100%;
  }
`;

function AdminDashboard() {
  const dispatch = useDispatch();

  // Redux state
  const { users, loading, error } = useSelector(state => state.admin);

  // Local state for UI
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ role: '', isActive: '' });
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const filterParams = {
      page: 1,
      limit: 100
    };

    if (filters.role) filterParams.role = filters.role;
    if (filters.isActive !== '') filterParams.isActive = filters.isActive === 'true';

    dispatch(fetchUsers(filterParams));
  }, [dispatch, filters]);

  const handleRefresh = () => {
    const filterParams = {
      page: 1,
      limit: 100
    };

    if (filters.role) filterParams.role = filters.role;
    if (filters.isActive !== '') filterParams.isActive = filters.isActive === 'true';

    dispatch(fetchUsers(filterParams));
  };

  const handleSetRole = async () => {
    try {
      setActionLoading(true);
      await dispatch(setUserRole({ userId: selectedUser.id, role: newRole })).unwrap();
      handleRefresh();
      setShowRoleModal(false);
      showAlert('success', 'User role updated successfully');
    } catch (error) {
      showAlert('error', error || 'Failed to update user role');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    try {
      setActionLoading(true);
      await dispatch(updateUser({
        id: selectedUser.id,
        data: editForm
      })).unwrap();
      handleRefresh();
      setShowEditModal(false);
      showAlert('success', 'User updated successfully');
    } catch (error) {
      showAlert('error', error || 'Failed to update user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setActionLoading(true);
      await dispatch(deleteUser(selectedUser.id)).unwrap();
      handleRefresh();
      setShowDeleteModal(false);
      showAlert('success', 'User deleted successfully');
    } catch (error) {
      showAlert('error', error || 'Failed to delete user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspendUser = async (userId) => {
    try {
      setActionLoading(true);
      await dispatch(suspendUser(userId)).unwrap();
      handleRefresh();
      showAlert('success', 'User suspended successfully');
    } catch (error) {
      showAlert('error', error || 'Failed to suspend user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      setActionLoading(true);
      await dispatch(activateUser(userId)).unwrap();
      handleRefresh();
      showAlert('success', 'User activated successfully');
    } catch (error) {
      showAlert('error', error || 'Failed to activate user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivateAllUsers = async () => {
    try {
      setActionLoading(true);
      const response = await fetch('/api/users/activate-all', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to activate all users');

      handleRefresh();
      showAlert('success', 'All users activated successfully');
    } catch (error) {
      showAlert('error', error.message || 'Failed to activate all users');
    } finally {
      setActionLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const filteredUsers = users.filter(user =>
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeVariant = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'danger';
      case 'educator': return 'warning';
      case 'student': return 'primary';
      default: return 'secondary';
    }
  };

  const getStats = () => {
    return {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      inactive: users.filter(u => !u.isActive).length,
      admins: users.filter(u => u.role?.toLowerCase() === 'admin').length,
      educators: users.filter(u => u.role?.toLowerCase() === 'educator').length,
      students: users.filter(u => u.role?.toLowerCase() === 'student').length
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <>
        <GlobalStyle />
        <LoadingSpinner>
          <Spinner animation="border" size="lg" />
          <span className="ms-3">Loading users...</span>
        </LoadingSpinner>
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <MainContainer fluid>
        {alert.show && (
          <Alert variant={alert.type === 'error' ? 'danger' : 'success'} dismissible onClose={() => setAlert({ show: false, type: '', message: '' })}>
            {alert.message}
          </Alert>
        )}

        {error && (
          <Alert variant="danger" dismissible onClose={() => dispatch({ type: 'admin/clearError' })}>
            {error}
          </Alert>
        )}

        <HeaderSection>
          <div>
            <h1 className="mb-2" style={{ color: 'var(--heading-color)', fontSize: '3rem', fontWeight: '800', letterSpacing: '1px' }}>
              User Management Dashboard
            </h1>
            <p className="text-muted" style={{ fontSize: '1.2rem', fontWeight: '600' }}>
              Advanced user administration and role management system
            </p>
          </div>
          <FilterSection>
            <div className="position-relative">
              <FiSearch className="position-absolute" style={{ left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '1.2rem' }} />
              <SearchInput
                type="text"
                placeholder="Search users by email, name, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '52px' }}
              />
            </div>

            <Form.Select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              style={{ maxWidth: '180px' }}
            >
              <option value="">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Educator">Educator</option>
              <option value="Student">Student</option>
            </Form.Select>

            <Form.Select
              value={filters.isActive}
              onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
              style={{ maxWidth: '180px' }}
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Form.Select>

            <ActionButton variant="outline-primary" onClick={handleRefresh} disabled={loading}>
              <FiRefreshCw />
              Refresh Data
            </ActionButton>

            <ActionButton variant="success" onClick={handleActivateAllUsers} disabled={actionLoading}>
              <FiUsers />
              Activate All Users
            </ActionButton>
            <ThemeToggle />
          </FilterSection>
        </HeaderSection>

        <Row className="mb-5">
          <Col md={2}>
            <StatsCard>
              <Card.Body className="text-center">
                <h2 className="mb-1" style={{ fontSize: '2.5rem', fontWeight: '900' }}>{stats.total}</h2>
                <p className="mb-0" style={{ fontWeight: '700', fontSize: '1rem' }}>Total Users</p>
              </Card.Body>
            </StatsCard>
          </Col>
          <Col md={2}>
            <StatsCard>
              <Card.Body className="text-center">
                <h2 className="mb-1" style={{ fontSize: '2.5rem', fontWeight: '900' }}>{stats.active}</h2>
                <p className="mb-0" style={{ fontWeight: '700', fontSize: '1rem' }}>Active</p>
              </Card.Body>
            </StatsCard>
          </Col>
          <Col md={2}>
            <StatsCard>
              <Card.Body className="text-center">
                <h2 className="mb-1" style={{ fontSize: '2.5rem', fontWeight: '900' }}>{stats.inactive}</h2>
                <p className="mb-0" style={{ fontWeight: '700', fontSize: '1rem' }}>Inactive</p>
              </Card.Body>
            </StatsCard>
          </Col>
          <Col md={2}>
            <StatsCard>
              <Card.Body className="text-center">
                <h2 className="mb-1" style={{ fontSize: '2.5rem', fontWeight: '900' }}>{stats.admins}</h2>
                <p className="mb-0" style={{ fontWeight: '700', fontSize: '1rem' }}>Admins</p>
              </Card.Body>
            </StatsCard>
          </Col>
          <Col md={2}>
            <StatsCard>
              <Card.Body className="text-center">
                <h2 className="mb-1" style={{ fontSize: '2.5rem', fontWeight: '900' }}>{stats.educators}</h2>
                <p className="mb-0" style={{ fontWeight: '700', fontSize: '1rem' }}>Educators</p>
              </Card.Body>
            </StatsCard>
          </Col>
          <Col md={2}>
            <StatsCard>
              <Card.Body className="text-center">
                <h2 className="mb-1" style={{ fontSize: '2.5rem', fontWeight: '900' }}>{stats.students}</h2>
                <p className="mb-0" style={{ fontWeight: '700', fontSize: '1rem' }}>Students</p>
              </Card.Body>
            </StatsCard>
          </Col>
        </Row>

        <StyledCard>
          <Card.Header style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', border: 'none', borderRadius: '18px 18px 0 0' }}>
            <h4 className="mb-0" style={{ color: '#000', fontWeight: '800', fontSize: '1.5rem', textAlign: 'center', letterSpacing: '1px' }}>
              Users Database ({filteredUsers.length} entries)
            </h4>
          </Card.Header>
          <Card.Body className="p-0">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted" style={{ fontSize: '1.2rem', fontWeight: '600' }}>No users found matching your criteria</p>
              </div>
            ) : (
              <StyledTable responsive variant="dark" className="mb-0">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Email Address</th>
                    <th>User Role</th>
                    <th>Account Status</th>
                    <th>Management Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td style={{ fontWeight: '700', fontSize: '1rem' }}>{user.id}</td>
                      <td style={{ fontWeight: '600', fontSize: '0.95rem' }}>{user.email || 'N/A'}</td>
                      <td>
                        <Badge bg={getRoleBadgeVariant(user.role)} style={{ fontSize: '0.85rem', padding: '8px 16px', borderRadius: '10px', fontWeight: '700' }}>
                          {user.role || 'Student'}
                        </Badge>
                      </td>
                      <td>
                        <StatusBadge bg={user.isActive ? 'success' : 'secondary'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </StatusBadge>
                      </td>
                      <td>
                        <Dropdown as={ButtonGroup}>
                          <ActionButton
                            variant="outline-primary"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setEditForm({ firstName: user.firstName || '', lastName: user.lastName || '' });
                              setShowEditModal(true);
                            }}
                          >
                            <FiEdit />
                          </ActionButton>

                          <Dropdown.Toggle
                            split
                            variant="outline-primary"
                            size="sm"
                            style={{ borderLeft: '2px solid var(--border-color)' }}
                          />

                          <Dropdown.Menu style={{ backgroundColor: 'var(--card-background)', border: '2px solid var(--border-color)', borderRadius: '10px' }}>
                            <Dropdown.Item
                              onClick={() => {
                                setSelectedUser(user);
                                setNewRole(user.role || '');
                                setShowRoleModal(true);
                              }}
                              style={{ color: 'var(--text-light)', fontWeight: '600' }}
                            >
                              <FiEdit className="me-2" />
                              Change Role
                            </Dropdown.Item>

                            {user.isActive ? (
                              <Dropdown.Item
                                onClick={() => handleSuspendUser(user.id)}
                                style={{ color: 'var(--text-light)', fontWeight: '600' }}
                              >
                                <FiUserX className="me-2" />
                                Suspend User
                              </Dropdown.Item>
                            ) : (
                              <Dropdown.Item
                                onClick={() => handleActivateUser(user.id)}
                                style={{ color: 'var(--text-light)', fontWeight: '600' }}
                              >
                                <FiUserCheck className="me-2" />
                                Activate User
                              </Dropdown.Item>
                            )}

                            <Dropdown.Divider style={{ borderColor: 'var(--border-color)' }} />

                            <Dropdown.Item
                              onClick={() => {
                                setSelectedUser(user);
                                setShowDeleteModal(true);
                              }}
                              style={{ color: 'var(--error-color)', fontWeight: '600' }}
                            >
                              <FiTrash2 className="me-2" />
                              Delete User
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            )}
          </Card.Body>
        </StyledCard>

        {/* Edit User Modal */}
        <StyledModal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit User Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={selectedUser?.email || ''}
                  disabled
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  placeholder="Enter first name"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  placeholder="Enter last name"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateUser} disabled={actionLoading} style={{ background: 'var(--primary)', borderColor: 'var(--primary)', color: '#000', fontWeight: '700' }}>
              {actionLoading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
              Update User
            </Button>
          </Modal.Footer>
        </StyledModal>

        {/* Role Modal */}
        <StyledModal show={showRoleModal} onHide={() => setShowRoleModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Update User Role</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>User</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser ? `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() : ''}
                  disabled
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <option value="">Select Role</option>
                  <option value="Student">Student</option>
                  <option value="Educator">Educator</option>
                  <option value="Admin">Admin</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRoleModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSetRole} disabled={actionLoading} style={{ background: 'var(--primary)', borderColor: 'var(--primary)', color: '#000', fontWeight: '700' }}>
              {actionLoading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
              Update Role
            </Button>
          </Modal.Footer>
        </StyledModal>

        {/* Delete Modal */}
        <StyledModal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>Are you sure you want to delete this user?</p>
            <p className="text-muted">
              <strong>{selectedUser ? `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() : ''}</strong>
            </p>
            <Alert variant="danger">
              This action cannot be undone.
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteUser} disabled={actionLoading} style={{ background: 'var(--error-color)', borderColor: 'var(--error-color)', fontWeight: '700' }}>
              {actionLoading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
              Delete User
            </Button>
          </Modal.Footer>
        </StyledModal>
      </MainContainer>
    </>
  );
}

export default AdminDashboard;
