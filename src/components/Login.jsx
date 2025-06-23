import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginAdmin } from '../store/adminSlice'; // تأكد من المسار
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const navigate =useNavigate()
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resultAction = await dispatch(loginAdmin(formData));
      if (loginAdmin.fulfilled.match(resultAction)) {
        showAlert('success', 'Login successful!');
        setTimeout(() => onLogin(resultAction.payload), 1000);
      } else {
        throw new Error(resultAction.payload || 'Login failed');
      }
    } catch (error) {
      showAlert('error', error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 4000);
  };

  const fillDemoCredentials = () => {
    setFormData({ email: 'admin@example.com', password: 'admin123' });
  };

  return (
    <LoginContainer>
      <Container>
        <Row className="justify-content-center">
          <Col>
            <StyledCard>
              <LogoSection>
                <LogoIcon><FiShield /></LogoIcon>
                <h3 style={{ color: 'var(--heading-color)' }}>Admin Dashboard</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Sign in to manage your system</p>
              </LogoSection>

              <Card.Body style={{ padding: '40px' }}>
                {alert.show && (
                  <Alert
                    variant={alert.type === 'error' ? 'danger' : 'success'}
                    dismissible
                    onClose={() => setAlert({ show: false, type: '', message: '' })}>
                    {alert.message}
                  </Alert>
                )}

                <DemoCredentials>
                  <strong>Demo Credentials:</strong><br />
                  Email: admin@example.com<br />
                  Password: admin123<br />
                  <Button variant="link" size="sm" onClick={fillDemoCredentials}>
                    Click to fill automatically
                  </Button>
                </DemoCredentials>

                <Form onSubmit={handleSubmit}>
                  <InputGroup>
                    <InputIcon><FiMail /></InputIcon>
                    <StyledInput
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputIcon><FiLock /></InputIcon>
                    <StyledInput
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      hasToggle
                      required
                    />
                    <PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </PasswordToggle>
                  </InputGroup>

                  <LoginButton type="submit" disabled={loading} onClick={() => navigate('/dashboard')}>
                    {loading ? (<><Spinner animation="border" size="sm" /> Signing in...</>) : 'Sign In'}
                  </LoginButton>
                </Form>
              </Card.Body>
            </StyledCard>
          </Col>
        </Row>
      </Container>
    </LoginContainer>
  );
}

export default Login;




const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, var(--background-dark) 0%, #0a0f0a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const StyledCard = styled(Card)`
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  max-width: 450px;
  width: 100%;
`;

const LogoSection = styled.div`
  text-align: center;
  padding: 40px 0 20px;
  border-bottom: 1px solid var(--border-color);
`;

const LogoIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 32px;
  color: #000;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  z-index: 2;
`;

const StyledInput = styled(Form.Control)`
  padding-left: 48px;
  padding-right: ${props => props.hasToggle ? '48px' : '16px'};
  height: 50px;
  background-color: var(--card-background);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-light);
  font-size: 16px;
  transition: all 0.3s ease;

  &:focus {
    background-color: var(--card-background);
    border-color: var(--primary);
    box-shadow: 0 0 0 0.2rem rgba(0, 230, 118, 0.25);
    color: var(--text-light);
  }

  &::placeholder {
    color: var(--text-secondary);
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0;
  z-index: 2;
  
  &:hover {
    color: var(--primary);
  }
`;

const LoginButton = styled(Button)`
  width: 100%;
  height: 50px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  color: #000;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 230, 118, 0.3);
    background: linear-gradient(135deg, var(--primary-dark), var(--primary));
  }

  &:disabled {
    opacity: 0.7;
    transform: none;
    box-shadow: none;
  }
`;

const DemoCredentials = styled.div`
  background-color: rgba(0, 230, 118, 0.1);
  border: 1px solid var(--primary);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
  font-size: 14px;
  color: var(--primary);
`;