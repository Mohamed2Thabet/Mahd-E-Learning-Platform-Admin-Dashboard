import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert, Spinner, Badge, Dropdown, ButtonGroup } from 'react-bootstrap';
import { FiEdit, FiTrash2, FiRefreshCw, FiSearch, FiUserPlus, FiUserCheck, FiUserX, FiUsers, FiFilter, FiMoreVertical } from 'react-icons/fi';
import styled from 'styled-components';
import { getUsers, setUserRole, deleteUser, suspendUser, activateUser, activateAllUsers, updateUser } from '../services/api';

const StyledCard = styled(Card)`
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 230, 118, 0.1);
  }
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const StatsCard = styled(Card)`
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  border: none;
  color: #000;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 230, 118, 0.3);
  }
`;

const SearchInput = styled(Form.Control)`
  max-width: 300px;
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  color: var(--text-light);
  
  &:focus {
    background-color: var(--card-background);
    border-color: var(--primary);
    box-shadow: 0 0 0 0.2rem rgba(0, 230, 118, 0.25);
    color: var(--text-light);
  }
`;

const ActionButton = styled(Button)`
  margin: 0 4px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const StatusBadge = styled(Badge)`
  font-size: 0.75rem;
  padding: 4px 8px;
`;

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
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
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const filterParams = {};
      if (filters.role) filterParams.role = filters.role;
      if (filters.isActive !== '') filterParams.isActive = filters.isActive === 'true';
      
      const data = await getUsers(filterParams);
      setUsers(data || []);
    } catch (error) {
      showAlert('error', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSetRole = async () => {
    try {
      setActionLoading(true);
      await setUserRole(selectedUser.id, newRole);
      await fetchUsers();
      setShowRoleModal(false);
      showAlert('success', 'User role updated successfully');
    } catch (error) {
      showAlert('error', 'Failed to update user role');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    try {
      setActionLoading(true);
      await updateUser(selectedUser.id, editForm);
      await fetchUsers();
      setShowEditModal(false);
      showAlert('success', 'User updated successfully');
    } catch (error) {
      showAlert('error', 'Failed to update user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setActionLoading(true);
      await deleteUser(selectedUser.id);
      await fetchUsers();
      setShowDeleteModal(false);
      showAlert('success', 'User deleted successfully');
    } catch (error) {
      showAlert('error', 'Failed to delete user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspendUser = async (userId) => {
    try {
      setActionLoading(true);
      await suspendUser(userId);
      await fetchUsers();
      showAlert('success', 'User suspended successfully');
    } catch (error) {
      showAlert('error', 'Failed to suspend user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      setActionLoading(true);
      await activateUser(userId);
      await fetchUsers();
      showAlert('success', 'User activated successfully');
    } catch (error) {
      showAlert('error', 'Failed to activate user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivateAllUsers = async () => {
    try {
      setActionLoading(true);
      await activateAllUsers();
      await fetchUsers();
      showAlert('success', 'All users activated successfully');
    } catch (error) {
      showAlert('error', 'Failed to activate all users');
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
      case 'manager': return 'warning';
      case 'user': return 'primary';
      default: return 'secondary';
    }
  };

  const getStats = () => {
    return {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      inactive: users.filter(u => !u.isActive).length,
      admins: users.filter(u => u.role?.toLowerCase() === 'admin').length,
      managers: users.filter(u => u.role?.toLowerCase() === 'manager').length,
      regularUsers: users.filter(u => u.role?.toLowerCase() === 'user').length
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <LoadingSpinner>
        <Spinner animation="border" size="lg" />
        <span className="ms-3">Loading users...</span>
      </LoadingSpinner>
    );
  }

  return (
    <Container fluid>
      {alert.show && (
        <Alert variant={alert.type === 'error' ? 'danger' : 'success'} dismissible onClose={() => setAlert({ show: false, type: '', message: '' })}>
          {alert.message}
        </Alert>
      )}

      <HeaderSection>
        <div>
          <h2 className="mb-1" style={{ color: 'var(--heading-color)' }}>User Management</h2>
          <p className="text-muted">Manage users, roles, and permissions</p>
        </div>
        <FilterSection>
          <div className="position-relative">
            <FiSearch className="position-absolute" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <SearchInput
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>
          
          <Form.Select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            style={{ maxWidth: '150px', backgroundColor: 'var(--card-background)', borderColor: 'var(--border-color)', color: 'var(--text-light)' }}
          >
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="User">User</option>
          </Form.Select>

          <Form.Select
            value={filters.isActive}
            onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
            style={{ maxWidth: '150px', backgroundColor: 'var(--card-background)', borderColor: 'var(--border-color)', color: 'var(--text-light)' }}
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Form.Select>

          <ActionButton variant="outline-primary" onClick={fetchUsers}>
            <FiRefreshCw />
            Refresh
          </ActionButton>

          <ActionButton variant="success" onClick={handleActivateAllUsers} disabled={actionLoading}>
            <FiUsers />
            Activate All
          </ActionButton>
        </FilterSection>
      </HeaderSection>

      <Row className="mb-4">
        <Col md={2}>
          <StatsCard>
            <Card.Body className="text-center">
              <h3 className="mb-1">{stats.total}</h3>
              <p className="mb-0">Total Users</p>
            </Card.Body>
          </StatsCard>
        </Col>
        <Col md={2}>
          <StatsCard>
            <Card.Body className="text-center">
              <h3 className="mb-1">{stats.active}</h3>
              <p className="mb-0">Active</p>
            </Card.Body>
          </StatsCard>
        </Col>
        <Col md={2}>
          <StatsCard>
            <Card.Body className="text-center">
              <h3 className="mb-1">{stats.inactive}</h3>
              <p className="mb-0">Inactive</p>
            </Card.Body>
          </StatsCard>
        </Col>
        <Col md={2}>
          <StatsCard>
            <Card.Body className="text-center">
              <h3 className="mb-1">{stats.admins}</h3>
              <p className="mb-0">Admins</p>
            </Card.Body>
          </StatsCard>
        </Col>
        <Col md={2}>
          <StatsCard>
            <Card.Body className="text-center">
              <h3 className="mb-1">{stats.managers}</h3>
              <p className="mb-0">Managers</p>
            </Card.Body>
          </StatsCard>
        </Col>
        <Col md={2}>
          <StatsCard>
            <Card.Body className="text-center">
              <h3 className="mb-1">{stats.regularUsers}</h3>
              <p className="mb-0">Users</p>
            </Card.Body>
          </StatsCard>
        </Col>
      </Row>

      <StyledCard>
        <Card.Header>
          <h5 className="mb-0" style={{ color: 'var(--heading-color)' }}>Users List ({filteredUsers.length})</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No users found</p>
            </div>
          ) : (
            <Table responsive variant="dark" className="mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A'}</td>
                    <td>{user.email || 'N/A'}</td>
                    <td>
                      <Badge bg={getRoleBadgeVariant(user.role)}>
                        {user.role || 'User'}
                      </Badge>
                    </td>
                    <td>
                      <StatusBadge bg={user.isActive ? 'success' : 'secondary'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </StatusBadge>
                    </td>
                    <td>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
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
                          style={{ borderLeft: '1px solid var(--border-color)' }}
                        />

                        <Dropdown.Menu style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border-color)' }}>
                          <Dropdown.Item
                            onClick={() => {
                              setSelectedUser(user);
                              setNewRole(user.role || '');
                              setShowRoleModal(true);
                            }}
                            style={{ color: 'var(--text-light)' }}
                          >
                            <FiEdit className="me-2" />
                            Change Role
                          </Dropdown.Item>
                          
                          {user.isActive ? (
                            <Dropdown.Item
                              onClick={() => handleSuspendUser(user.id)}
                              style={{ color: 'var(--text-light)' }}
                            >
                              <FiUserX className="me-2" />
                              Suspend User
                            </Dropdown.Item>
                          ) : (
                            <Dropdown.Item
                              onClick={() => handleActivateUser(user.id)}
                              style={{ color: 'var(--text-light)' }}
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
                            style={{ color: 'var(--error-color)' }}
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
            </Table>
          )}
        </Card.Body>
      </StyledCard>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
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
          <Button variant="primary" onClick={handleUpdateUser} disabled={actionLoading}>
            {actionLoading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            Update User
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Role Modal */}
      <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)} centered>
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
                <option value="User">User</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRoleModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSetRole} disabled={actionLoading}>
            {actionLoading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            Update Role
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this user?</p>
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
          <Button variant="danger" onClick={handleDeleteUser} disabled={actionLoading}>
            {actionLoading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminDashboard;