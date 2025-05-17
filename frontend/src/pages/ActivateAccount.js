import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f5f5f5;
`;

const Card = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 350px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background: #ff5733;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: #e04e2b;
  }
`;

const ActivateAccount = () => {
  const [tokenInput, setTokenInput] = useState("");
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setTokenInput(tokenFromUrl); // ✅ Set initial token from URL only once
    }
  }, [searchParams]); // ✅ Runs only when `searchParams` changes

  const handleActivate = async () => {
    if (!tokenInput) {
      setMessage("❌ No activation token provided.");
      return;
    }

    try {
      await axios.get(
        `https://epic-gather-dua2cncsh4g5gxg8.uaenorth-01.azurewebsites.net/api/v1/auth/activate-account?token=${tokenInput}`
      );
      navigate("/login"); // ✅ Redirect to login page
    } catch (error) {
      setMessage(error.response?.data?.details || "❌ Activation failed.");
    }
  };

  return (
    <Container>
      <Card>
        <h2>Activate Account</h2>
        <Input
          type="text"
          placeholder="Enter activation token"
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
        />

        <Button onClick={handleActivate}>Activate</Button>
        <p style={{ color: "red", marginTop: "10px" }}>{message}</p>
      </Card>
    </Container>
  );
};

export default ActivateAccount;
