import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { handleApiError, showSuccessMessage } from "../utils/errorHandler";

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

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    general: ""
  });
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    // Reset errors
    setErrors({ email: "", general: "" });

    // Validate email
    if (!email) {
      setErrors(prev => ({ ...prev, email: "Email is required" }));
      return;
    }
    if (!validateEmail(email)) {
      setErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "https://epic-gather-dua2cncsh4g5gxg8.uaenorth-01.azurewebsites.net/api/v1/auth/forgot-password",
        { email }
      );
      setSuccess(true);
      showSuccessMessage("Password reset instructions have been sent to your email");
    } catch (error) {
      if (error.response?.data) {
        const { message, errors, details, validationErrors } = error.response.data;
        
        // Handle 401 Unauthorized specifically
        if (error.response.status === 401) {
          setErrors({
            email: "",
            general: message || details || "Authentication failed. Please check your credentials."
          });
          return;
        }

        setErrors({
          email: errors?.email || "",
          general: message || details || validationErrors?.[0] || "Failed to process request. Please try again."
        });
      } else {
        setErrors({
          email: "",
          general: "An unexpected error occurred. Please try again."
        });
      }
      // Only call handleApiError for non-401 errors
      if (error.response?.status !== 401) {
        handleApiError(error, navigate);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container>
        <Card>
          <Title>Check Your Email</Title>
          <Description>
            We've sent password reset instructions to your email address.
            Please check your inbox and follow the instructions to reset your password.
          </Description>
          <BackToLogin href="/login">Back to Login</BackToLogin>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <Title>Forgot Password</Title>
        <Description>
          Enter your email address and we'll send you instructions to reset your password.
        </Description>
        <Input
          type="email"
          placeholder="Enter your email"
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
          {loading ? "Sending..." : "Send Reset Instructions"}
        </Button>
        <BackToLogin href="/login">Back to Login</BackToLogin>
      </Card>
    </Container>
  );
};

export default ForgotPassword; 