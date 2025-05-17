import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { handleApiError, showSuccessMessage } from "../utils/errorHandler";
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${({ theme }) => theme.secondary};
  padding: 20px;
`;

const Card = styled.div`
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.primary};
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
`;

const Description = styled.p`
  color: #666;
  margin-bottom: 24px;
  line-height: 1.5;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  margin: 8px 0;
  border: 2px solid ${({ $hasError }) => $hasError ? '#ff4d4f' : '#eee'};
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;

  &:focus {
    border-color: ${({ theme, $hasError }) => $hasError ? '#ff4d4f' : theme.primary};
    outline: none;
    box-shadow: 0 0 0 3px ${({ $hasError }) => $hasError ? 'rgba(255, 77, 79, 0.1)' : 'rgba(255, 87, 51, 0.1)'};
  }

  &:disabled {
    background: #f5f5f5;
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
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const BackToLogin = styled.a`
  display: inline-block;
  margin-top: 20px;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    general: ""
  });
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setErrors(prev => ({
        ...prev,
        general: "Invalid or missing reset token. Please request a new password reset."
      }));
    }
  }, [token]);

  const validatePassword = (password) => {
    // At least 8 characters, 1 number, 1 character
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    // Reset errors
    setErrors({ password: "", confirmPassword: "", general: "" });

    // Validate password
    if (!password) {
      setErrors(prev => ({ ...prev, password: "Password is required" }));
      return;
    }
    if (!validatePassword(password)) {
      setErrors(prev => ({
        ...prev,
        password: "Password must be at least 8 characters long and contain at least one letter and one number"
      }));
      return;
    }

    // Validate confirm password
    if (!confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "Please confirm your password" }));
      return;
    }
    if (password !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `https://epic-gather-dua2cncsh4g5gxg8.uaenorth-01.azurewebsites.net/api/v1/auth/reset-password?token=${token}`,
        {
          password: password
        }
      );
      setSuccess(true);
      showSuccessMessage("Password has been reset successfully");
    } catch (error) {
      if (error.response?.data) {
        const { message, errors, details, validationErrors } = error.response.data;
        setErrors({
          password: errors?.password || "",
          confirmPassword: errors?.confirmPassword || "",
          general: message || details || validationErrors?.[0] || "Failed to reset password. Please try again."
        });
      } else {
        setErrors({
          password: "",
          confirmPassword: "",
          general: "An unexpected error occurred. Please try again."
        });
      }
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <Container>
        <Card>
          <Title>Invalid Reset Link</Title>
          <Description>
            The password reset link is invalid or has expired.
            Please request a new password reset link.
          </Description>
          <BackToLogin href="/forgot-password">Request New Reset Link</BackToLogin>
        </Card>
      </Container>
    );
  }

  if (success) {
    return (
      <Container>
        <Card>
          <Title>Password Reset Successful</Title>
          <Description>
            Your password has been reset successfully.
            You can now login with your new password.
          </Description>
          <BackToLogin href="/login">Back to Login</BackToLogin>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <Title>Reset Password</Title>
        <Description>
          Please enter your new password below.
          Make sure it's strong and secure.
        </Description>
        <InputWrapper>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
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
            disabled={loading}
          >
            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </PasswordToggle>
        </InputWrapper>
        {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        
        <InputWrapper>
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors(prev => ({ ...prev, confirmPassword: "", general: "" }));
            }}
            onKeyDown={handleKeyPress}
            disabled={loading}
            $hasError={!!errors.confirmPassword}
          />
          <PasswordToggle
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={loading}
          >
            {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </PasswordToggle>
        </InputWrapper>
        {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
        
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
        
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
        <BackToLogin href="/login">Back to Login</BackToLogin>
      </Card>
    </Container>
  );
};

export default ResetPassword; 