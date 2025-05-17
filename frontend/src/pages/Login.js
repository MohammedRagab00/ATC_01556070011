import React, { useState } from "react";
import authService from "../services/authService";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { handleApiError, showSuccessMessage } from "../utils/errorHandler";
import { message } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  padding: 20px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 400px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.primary}20;
  backdrop-filter: blur(10px);
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.primary};
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  margin: 8px 0;
  border: 2px solid ${({ $hasError }) => $hasError ? '#ff4d4f' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
  color: #000000;

  &:focus {
    border-color: ${({ theme, $hasError }) => $hasError ? '#ff4d4f' : theme.primary};
    outline: none;
    box-shadow: 0 0 0 3px ${({ $hasError }) => $hasError ? 'rgba(255, 77, 79, 0.1)' : 'rgba(255, 87, 51, 0.1)'};
  }

  &:disabled {
    background: rgba(0, 0, 0, 0.05);
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4d4f;
  font-size: 14px;
  margin-top: 4px;
  text-align: left;
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background: ${({ theme }) => theme.primary};
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;

  &:hover {
    background: ${({ theme }) => theme.accent};
    transform: translateY(-2px);
  }

  &:disabled {
    background: ${({ theme }) => theme.disabledBackground};
    cursor: not-allowed;
    transform: none;
  }
`;

const SignUpLink = styled.p`
  margin-top: 20px;
  color: ${({ theme }) => theme.textSecondary};
  
  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ForgotPasswordLink = styled.a`
  display: block;
  text-align: right;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  font-size: 14px;
  margin-top: 8px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.textSecondary};
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: ""
  });

  const navigate = useNavigate();
  const location = useLocation();

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
      general: ""
    };
    let isValid = true;

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrors({ email: "", password: "", general: "" });
      
      const response = await authService.login({ email, password });
      const { token, refreshToken, isAdmin, fullName } = response.data;

      // Store securely in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("isAdmin", isAdmin);
      localStorage.setItem("fullName", fullName);

      showSuccessMessage("Login successful!");

      // Dispatch custom event for auth state change
      window.dispatchEvent(new Event('authStateChange'));

      // Redirect based on role and previous location
      const from = location.state?.from?.pathname || "/";
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate(from);
      }
    } catch (error) {
      if (error.response?.data) {
        const { message, errors, validationErrors } = error.response.data;
        
        setErrors({
          email: errors?.email || "",
          password: errors?.password || "",
          general: message || errors?.account || validationErrors?.[0] || "An unexpected error occurred. Please try again."
        });
      } else {
        setErrors({
          email: "",
          password: "",
          general: "An unexpected error occurred. Please try again."
        });
      }
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>Welcome Back</Title>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors(prev => ({ ...prev, email: "", general: "" }));
          }}
          onKeyDown={handleKeyPress}
          disabled={loading}
          $hasError={!!errors.email}
        />
        {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        
        <InputWrapper>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors(prev => ({ ...prev, password: "", general: "" }));
            }}
            onKeyDown={handleKeyPress}
            disabled={loading}
            $hasError={!!errors.password}
          />
          <PasswordToggle
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </PasswordToggle>
        </InputWrapper>
        {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        
        <ForgotPasswordLink href="/forgot-password">
          Forgot Password?
        </ForgotPasswordLink>
        
        {errors.general && (
          <ErrorMessage 
            style={{ 
              textAlign: 'center', 
              marginTop: '10px',
              backgroundColor: 'rgba(255, 77, 79, 0.1)',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid rgba(255, 77, 79, 0.2)'
            }}
          >
            {errors.general}
          </ErrorMessage>
        )}
        
        <Button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
        <SignUpLink>
          Don't have an account? <a href="/signup">Sign up</a>
        </SignUpLink>
      </Card>
    </Container>
  );
};

export default Login;
