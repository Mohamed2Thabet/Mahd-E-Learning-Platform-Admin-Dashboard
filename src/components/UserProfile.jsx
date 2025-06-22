import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { FiUser, FiLock, FiTrash2, FiSave, FiEdit } from 'react-icons/fi';
import styled from 'styled-components';
import { getUserProfile, updateUserProfile, changePassword, deleteAccount } from '../services/api';

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

const ProfileHeader = styled.div`
  text-align: center;
  padding: 32px 0;
  border-bottom: 1px solid var(--border-color);
`;

const ProfileAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 48px;
  color: #000;
  font-weight: bold;
`;

const ActionButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

const SectionTitle = styled.h5`
  color: var(--heading-color);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

function UserProfile() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      setProfile(data || { firstName: '', lastName: '', email: '' });
    } catch (error) {
      showAlert('error', 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await updateUserProfile({
        firstName: profile.firstName,
        lastName: profile.lastName
      });
      setIsEditing(false);
      showAlert('success', 'Profile updated successfully');
    } catch (error) {
      showAlert('error', 'Failed to update profile');
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      showAlert('error', 'New passwords do not match');
      return;
    }

    if (passwords.newPassword.length < 6) {
      showAlert('error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      setActionLoading(true);
      await changePassword({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword
      });
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      showAlert('success', 'Password changed successfully');
    } catch (error) {
      showAlert('error', 'Failed to change password');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setActionLoading(true);
      await deleteAccount();
      showAlert('success', 'Account deleted successfully');
      setShowDeleteModal(false);
      // Here you would typically redirect to login page
    } catch (error) {
      showAlert('error', 'Failed to delete account');
    } finally {
      setActionLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const getInitials = () => {
    const first = profile.firstName || '';
    const last = profile.lastName || '';
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || 'U';
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" size="lg" />
        <span className="ms-3">Loading profile...</span>
      </Container>
    );
  }

  return (
    <Container>
      {alert.show && (
        <Alert variant={alert.type === 'error' ? 'danger' : 'success'} dismissible onClose={() => setAlert({ show: false, type: '', message: '' })}>
          {alert.message}
        </Alert>
      )}

      <Row>
        <Col lg={4}>
          <StyledCard>
            <ProfileHeader>
              <ProfileAvatar>
                {getInitials()}
              </ProfileAvatar>
              <h4 style={{ color: 'var(--heading-color)' }}>
                {`${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'User'}
              </h4>
              <p className="text-muted">{profile.email}</p>
              <ActionButton
                variant="outline-primary"
                onClick={() => setIsEditing(!isEditing)}
              >
                <FiEdit />
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </ActionButton>
            </ProfileHeader>
          </StyledCard>
        </Col>

        <Col lg={8}>
          <Row>
            <Col md={12} className="mb-4">
              <StyledCard>
                <Card.Header>
                  <SectionTitle>
                    <FiUser />
                    Personal Information
                  </SectionTitle>
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={handleUpdateProfile}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>First Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={profile.firstName}
                            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                            disabled={!isEditing}
                            placeholder="Enter first name"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={profile.lastName}
                            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                            disabled={!isEditing}
                            placeholder="Enter last name"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={profile.email}
                        disabled
                        placeholder="Enter email"
                      />
                      <Form.Text className="text-muted">
                        Email cannot be changed
                      </Form.Text>
                    </Form.Group>
                    {isEditing && (
                      <ActionButton
                        variant="primary"
                        type="submit"
                        disabled={actionLoading}
                      >
                        {actionLoading ? <Spinner animation="border" size="sm" className="me-2" /> : <FiSave />}
                        Save Changes
                      </ActionButton>
                    )}
                  </Form>
                </Card.Body>
              </StyledCard>
            </Col>

            <Col md={12} className="mb-4">
              <StyledCard>
                <Card.Header>
                  <SectionTitle>
                    <FiLock />
                    Change Password
                  </SectionTitle>
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={handleChangePassword}>
                    <Form.Group className="mb-3">
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={passwords.oldPassword}
                        onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                        placeholder="Enter current password"
                        required
                      />
                    </Form.Group>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>New Password</Form.Label>
                          <Form.Control
                            type="password"
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                            placeholder="Enter new password"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Confirm New Password</Form.Label>
                          <Form.Control
                            type="password"
                            value={passwords.confirmPassword}
                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                            placeholder="Confirm new password"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <ActionButton
                      variant="primary"
                      type="submit"
                      disabled={actionLoading}
                    >
                      {actionLoading ? <Spinner animation="border" size="sm" className="me-2" /> : <FiLock />}
                      Change Password
                    </ActionButton>
                  </Form>
                </Card.Body>
              </StyledCard>
            </Col>

            <Col md={12}>
              <StyledCard>
                <Card.Header>
                  <SectionTitle>
                    <FiTrash2 />
                    Danger Zone
                  </SectionTitle>
                </Card.Header>
                <Card.Body>
                  <Alert variant="danger">
                    <strong>Delete Account</strong>
                    <p className="mb-3">Once you delete your account, there is no going back. Please be certain.</p>
                    <ActionButton
                      variant="danger"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <FiTrash2 />
                      Delete Account
                    </ActionButton>
                  </Alert>
                </Card.Body>
              </StyledCard>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Delete Account Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Account Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            <strong>This action cannot be undone!</strong>
          </Alert>
          <p>Are you sure you want to delete your account? This will permanently remove all your data.</p>
          <p className="text-muted">Type your email to confirm: <strong>{profile.email}</strong></p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount} disabled={actionLoading}>
            {actionLoading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            Delete Account
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default UserProfile;