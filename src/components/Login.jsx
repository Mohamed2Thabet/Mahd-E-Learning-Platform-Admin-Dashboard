import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginAdmin } from '../store/adminSlice';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
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
          <Col md={6} lg={5} xl={4}>
            <StyledCard>
              <LogoSection>
                <LogoIcon>
                  <FiShield />
                </LogoIcon>
                <BrandTitle>Admin Dashboard</BrandTitle>
                <BrandSubtitle>Secure access to your management portal</BrandSubtitle>
              </LogoSection>

              <CardBody>
                {alert.show && (
                  <StyledAlert
                    variant={alert.type === 'error' ? 'danger' : 'success'}
                    dismissible
                    onClose={() => setAlert({ show: false, type: '', message: '' })}
                  >
                    {alert.message}
                  </StyledAlert>
                )}

                <DemoCredentials>
                  <DemoTitle>Demo Access</DemoTitle>
                  <DemoInfo>
                    <div>Email: admin@example.com</div>
                    <div>Password: admin123</div>
                  </DemoInfo>
                  <AutoFillButton variant="link" size="sm" onClick={fillDemoCredentials}>
                    Auto-fill credentials
                  </AutoFillButton>
                </DemoCredentials>

                <LoginForm onSubmit={handleSubmit}>
                  <InputGroup>
                    <InputLabel>Email Address</InputLabel>
                    <InputWrapper>
                      <InputIcon><FiMail /></InputIcon>
                      <StyledInput
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </InputWrapper>
                  </InputGroup>

                  <InputGroup>
                    <InputLabel>Password</InputLabel>
                    <InputWrapper>
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
                      <PasswordToggle
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </PasswordToggle>
                    </InputWrapper>
                  </InputGroup>

                  <LoginButton type="submit" disabled={loading}>
                    {loading ? (
                      <LoadingContent>
                        <Spinner animation="border" size="sm" />
                        <span>Authenticating...</span>
                      </LoadingContent>
                    ) : (
                      'Sign In'
                    )}
                  </LoginButton>
                </LoginForm>
              </CardBody>
            </StyledCard>
          </Col>
        </Row>
      </Container>
    </LoginContainer>
  );
}

export default Login;

// Styled Components
const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, var(--background-dark) 0%, #0a0f0a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const StyledCard = styled(Card)`
  background: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: var(--box-shadow);
  backdrop-filter: blur(15px);
  overflow: hidden;
  width: 100%;
  max-width: 440px;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: var(--box-shadow-hover);
  }
`;

const LogoSection = styled.div`
  text-align: center;
  padding: 3rem 2rem 2rem;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: #000;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--border-color);
  }
`;

const LogoIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 28px;
  color: #000;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const BrandTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  letter-spacing: -0.025em;
  color: #000;
`;

const BrandSubtitle = styled.p`
  font-size: 0.925rem;
  opacity: 0.8;
  margin: 0;
  font-weight: 400;
  color: #000;
`;

const CardBody = styled(Card.Body)`
  padding: 2.5rem;
  background: var(--card-background);
`;

const StyledAlert = styled(Alert)`
  border-radius: 12px;
  border: none;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  
  &.alert-success {
    background-color: rgba(46, 213, 115, 0.15);
    color: var(--success-color);
    border: 1px solid rgba(46, 213, 115, 0.3);
  }
  
  &.alert-danger {
    background-color: rgba(255, 71, 87, 0.15);
    color: var(--error-color);
    border: 1px solid rgba(255, 71, 87, 0.3);
  }
`;

const DemoCredentials = styled.div`
  background: rgba(0, 230, 118, 0.08);
  border: 1px solid rgba(0, 230, 118, 0.3);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 2rem;
`;

const DemoTitle = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--primary);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DemoInfo = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 0.75rem;
  font-family: 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', monospace;
`;

const AutoFillButton = styled(Button)`
  padding: 0;
  font-size: 0.875rem;
  color: var(--primary) !important;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
    color: var(--primary-dark) !important;
  }
`;

const LoginForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InputLabel = styled.label`
  font-weight: 500;
  font-size: 0.875rem;
  color: #374151;
  margin: 0;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  color: #9ca3af;
  z-index: 2;
  font-size: 1.1rem;
`;

const StyledInput = styled(({ hasToggle, ...props }) => (
  <Form.Control {...props} />
))`
  padding-left: 2.75rem;
  padding-right: ${props => props.hasToggle ? '2.75rem' : '1rem'};
  height: 48px;
  background: #ffffff;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  color: #374151;
  font-size: 0.925rem;
  transition: all 0.2s ease;

  &:focus {
    background: #ffffff;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    color: #374151;
    outline: none;
  }

  &::placeholder {
    color: #9ca3af;
  }

  &:hover {
    border-color: #9ca3af;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  z-index: 2;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;

  &:hover {
    color: #4f46e5;
  }

  &:focus {
    outline: none;
  }
`;

const LoginButton = styled(Button)`
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.925rem;
  color: white;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &:focus {
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.3);
  }
`;

const LoadingContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;