import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { FiEdit, FiTrash2, FiRefreshCw, FiUserCheck, FiUserX, FiUsers } from 'react-icons/fi';
import styled, { createGlobalStyle } from 'styled-components';
import {
  fetchUsers,
  updateUser,
  deleteUser,
  suspendUser,
  activateUser,
  setUserRole,
  logoutUser
} from '../store/adminSlice';
import ThemeToggle from "./ThemeToggle/ThemeToggle";
import { useNavigate } from 'react-router-dom';

// ===== Styled Components =====
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
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  border: none;
  color: #000;
  font-weight: 700;
  border-radius: 20px;
  text-align: center;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 12px 40px rgba(0, 230, 118, 0.3);
  position: relative;
  padding:10px;
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
    box-shadow: 0 20px 60px rgba(0, 230, 118, 0.5);
    &::before {
      opacity: 1;
    }
  }
`;

const SearchInput = styled(Form.Control)`
  max-width: 400px;
  background: linear-gradient(135deg, var(--card-background), rgba(20, 26, 21, 0.9));
  border: 2px solid var(--border-color);
  color: var(--text-light);
  border-radius: 16px;
  padding: 14px 18px;
  font-weight: 600;
  transition: all 0.4s ease;
  font-size: 1rem;
  &:focus {
    background: var(--card-background);
    border-color: var(--primary);
    box-shadow: 0 0 0 0.3rem rgba(0, 230, 118, 0.3);
    color: var(--text-light);
    transform: scale(1.03);
  }
  &::placeholder {
    color: var(--text-secondary);
    font-weight: 500;
  }
`;

const ActionButton = styled(Button)`
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
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
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
    background: var(--success-color);
    border-color: var(--success-color);
    &:hover {
      background: #26d467;
      border-color: #26d467;
    }
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px;
  background: var(--card-background);
  border-radius: 20px;
  margin: 50px 0;
  .spinner-border {
    color: var(--primary);
    width: 4rem;
    height: 4rem;
  }
  span {
    color: var(--text-light);
    font-size: 1.2rem;
    font-weight: 600;
  }
`;

const FilterSection = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
  .form-select {
    background: var(--card-background);
    border: 2px solid var(--border-color);
    color: var(--text-light);
    border-radius: 12px;
    font-weight: 600;
    transition: all 0.4s ease;
    padding: 12px 16px;
    &:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 0.3rem rgba(0, 230, 118, 0.3);
      background: var(--card-background);
      color: var(--text-light);
    }
    option {
      background: var(--card-background);
      color: var(--text-light);
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
  &.table-dark {
    background: transparent;

    th {
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      color: var(--heading-color);
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      border: none;
      padding: 20px 16px;
      font-size: 0.95rem;
      text-align: center;
    }

    td {
      background: var(--card-background);
      color: var(--text-light);
      border-color: var(--border-color);
      padding: 18px 16px;
      font-weight: 600;
      vertical-align: middle;
      text-align: center;
      font-size: 0.95rem;
    }

    tbody tr {
      transition: all 0.4s ease;

      &:hover {
        background: rgba(120, 144, 156, 0.1); /* optional hover fallback */
        transform: scale(1.01);
      }
    }
  }
`;


const StyledModal = styled(Modal)`
  .modal-content {
    background: var(--card-background);
    border: 2px solid var(--border-color);
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  }
  .modal-header {
    border-bottom: 2px solid var(--border-color);
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    color: #000;
    font-weight: 800;
    border-radius: 18px 18px 0 0;
  }
  .modal-body {
    background: var(--card-background);
    color: var(--text-light);
  }
  .modal-footer {
    border-top: 2px solid var(--border-color);
    background: var(--card-background);
    border-radius: 0 0 18px 18px;
  }
  .form-control, .form-select {
    background: rgba(20, 26, 21, 0.8);
    border: 2px solid var(--border-color);
    color: var(--text-light);
    border-radius: 10px;
    &:focus {
      background: var(--card-background);
      border-color: var(--primary);
      box-shadow: 0 0 0 0.25rem rgba(0, 230, 118, 0.25);
      color: var(--text-light);
    }
  }
  .form-label {
    color: var(--text-light);
    font-weight: 700;
    margin-bottom: 10px;
  }
`;

const MainContainer = styled(Container)`
  background: var(--background-dark);
  color: var(--text-light);
  min-height: 100vh;
  padding: 30px;
  &.container-fluid {
    background: var(--background-dark);
    width: 100%;
    height: 100%;
  }
`;

// ===== Main Component =====
function AdminDashboard() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector(state => state.admin);
  const navigate = useNavigate();

  // Local state
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
    const filterParams = { page: 1, limit: 100 };
    if (filters.role) filterParams.role = filters.role;
    if (filters.isActive !== '') filterParams.isActive = filters.isActive === 'true';
    dispatch(fetchUsers(filterParams));
  }, [dispatch, filters]);

  const handleRefresh = () => {
    const filterParams = { page: 1, limit: 100 };
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
      await dispatch(updateUser({ id: selectedUser.id, data: editForm })).unwrap();
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

  const handleLogout = async () => {
    await dispatch(logoutUser());
    window.location.href = '/'; // توجيه إجباري
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

  const getStats = () => ({
    total: users.length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
    admins: users.filter(u => u.role?.toLowerCase() === 'admin').length,
    educators: users.filter(u => u.role?.toLowerCase() === 'educator').length,
    students: users.filter(u => u.role?.toLowerCase() === 'student').length
  });

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

        {/* Header Section with Logout */}
        <HeaderSection>
          <div>
            <h2>Admin Dashboard</h2>
            <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              Manage users, roles, and system actions
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ThemeToggle />
            <ActionButton
              variant="outline-danger"
              onClick={handleLogout}
              title="Logout"
            >
              <FiUserX /> Logout
            </ActionButton>
          </div>
        </HeaderSection>

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={2}><StatsCard><div>Total Users</div><h3>{stats.total}</h3></StatsCard></Col>
          <Col md={2}><StatsCard><div>Active</div><h3>{stats.active}</h3></StatsCard></Col>
          <Col md={2}><StatsCard><div>Suspended</div><h3>{stats.inactive}</h3></StatsCard></Col>
          <Col md={2}><StatsCard><div>Admins</div><h3>{stats.admins}</h3></StatsCard></Col>
          <Col md={2}><StatsCard><div>Educators</div><h3>{stats.educators}</h3></StatsCard></Col>
          <Col md={2}><StatsCard><div>Students</div><h3>{stats.students}</h3></StatsCard></Col>
        </Row>

        {/* Search and Filter */}
        <FilterSection className="mb-3">
          <SearchInput
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Form.Select
            value={filters.role}
            onChange={e => setFilters(f => ({ ...f, role: e.target.value }))}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="educator">Educator</option>
            <option value="student">Student</option>
          </Form.Select>
          <Form.Select
            value={filters.isActive}
            onChange={e => setFilters(f => ({ ...f, isActive: e.target.value }))}
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Suspended</option>
          </Form.Select>
          <ActionButton variant="outline-primary" onClick={handleRefresh}>
            <FiRefreshCw /> Refresh
          </ActionButton>
        </FilterSection>

        {/* User Table */}
        <StyledCard>
          <StyledTable striped bordered hover variant="dark" responsive>
            <thead>
              <tr>
                <th>#</th>
                {/* <th>First Name</th>
                <th>Last Name</th> */}
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <tr key={user.id}>
                  <td>{idx + 1}</td>
                  {/* <td>{user.firstName}</td>
                  <td>{user.lastName}</td> */}
                  <td>{user.email}</td>
                  <td>
                    <StatusBadge bg={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </StatusBadge>
                  </td>
                  <td>
                    <StatusBadge bg={user.isActive ? "success" : "secondary"}>
                      {user.isActive ? "Active" : "Suspended"}
                    </StatusBadge>
                  </td>
                  <td>
                    <ActionButton
                      variant="outline-primary"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setEditForm({ firstName: user.firstName, lastName: user.lastName });
                        setShowEditModal(true);
                      }}
                      title="Edit"
                    >
                      <FiEdit /> Edit
                    </ActionButton>
                    <ActionButton
                      variant="outline-warning"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setNewRole(user.role);
                        setShowRoleModal(true);
                      }}
                      title="Change Role"
                    >
                      <FiUsers /> Role
                    </ActionButton>
                    {user.isActive ? (
                      <ActionButton
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleSuspendUser(user.id)}
                        title="Suspend"
                      >
                        <FiUserX /> Suspend
                      </ActionButton>
                    ) : (
                      <ActionButton
                        variant="success"
                        size="sm"
                        onClick={() => handleActivateUser(user.id)}
                        title="Activate"
                      >
                        <FiUserCheck /> Activate
                      </ActionButton>
                    )}
                    <ActionButton
                      variant="outline-danger"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDeleteModal(true);
                      }}
                      title="Delete"
                    >
                      <FiTrash2 /> Delete
                    </ActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </StyledCard>

        {/* Modals for Edit, Change Role, Delete */}
        <StyledModal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editForm.firstName}
                  onChange={e => setEditForm(f => ({ ...f, firstName: e.target.value }))}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editForm.lastName}
                  onChange={e => setEditForm(f => ({ ...f, lastName: e.target.value }))}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateUser} disabled={actionLoading}>
              {actionLoading ? <Spinner animation="border" size="sm" /> : "Save"}
            </Button>
          </Modal.Footer>
        </StyledModal>

        <StyledModal show={showRoleModal} onHide={() => setShowRoleModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Change User Role</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="educator">Educator</option>
                  <option value="student">Student</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRoleModal(false)}>
              Cancel
            </Button>
            <Button variant="warning" onClick={handleSetRole} disabled={actionLoading}>
              {actionLoading ? <Spinner animation="border" size="sm" /> : "Change"}
            </Button>
          </Modal.Footer>
        </StyledModal>

        <StyledModal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Delete User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete user <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong>?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteUser} disabled={actionLoading}>
              {actionLoading ? <Spinner animation="border" size="sm" /> : "Delete"}
            </Button>
          </Modal.Footer>
        </StyledModal>
      </MainContainer>
    </>
  );
}

export default AdminDashboard;
