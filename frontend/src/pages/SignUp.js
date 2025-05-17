import React, { useState } from "react";
import authService from "../services/authService";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
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

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  margin: 8px 0;
  border: 2px solid ${({ theme }) => theme.primary}20;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}20;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  margin: 8px 0;
  border: 2px solid ${({ theme }) => theme.primary}20;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}20;
  }
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

const SignUp = () => {
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    birthDate: "",
    gender: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);

  const handleSignUp = async () => {
    try {
      await authService.register(userData);
      alert(
        "Registration successful! Please activate your account via the email sent."
      );
      navigate("/activate-account"); // ✅ Redirects user to activation page
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(Object.values(error.response.data.errors));
      } else if (error.response?.data?.validationErrors) {
        setErrors(error.response.data.validationErrors);
      } else {
        setErrors(["Something went wrong. Please try again."]);
      }
    }
  };

  return (
    <Container>
      <Card>
        <Title>Sign Up</Title>
        <Input
          type="text"
          placeholder="First Name"
          onChange={(e) =>
            setUserData({ ...userData, firstname: e.target.value })
          }
        />
        <Input
          type="text"
          placeholder="Last Name"
          onChange={(e) =>
            setUserData({ ...userData, lastname: e.target.value })
          }
        />
        <Input
          type="email"
          placeholder="Email"
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        />
        <Input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setUserData({ ...userData, password: e.target.value })
          }
        />
        <Input
          type="date"
          placeholder="Birth Date"
          onChange={(e) =>
            setUserData({ ...userData, birthDate: e.target.value })
          }
        />
        <Select
          onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
        >
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="PREFER_NOT_TO_SAY">Prefer Not to Say</option>
        </Select>
        <Button onClick={handleSignUp}>Sign Up</Button>
        {errors.length > 0 && (
          <div style={{ color: "red", marginTop: "10px" }}>
            {errors.map((err, index) => (
              <p key={index}>{err}</p>
            ))}
          </div>
        )}
        <SignUpLink>
          Already have an account? <a href="/login">Login</a>
        </SignUpLink>
      </Card>
    </Container>
  );
};

export default SignUp;
