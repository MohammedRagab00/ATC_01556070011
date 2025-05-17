import React from 'react';
import styled from 'styled-components';
import { CheckCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

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
  max-width: 500px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.primary}20;
  backdrop-filter: blur(10px);
`;

const Icon = styled(CheckCircleFilled)`
  font-size: 64px;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 24px;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.primary};
  margin-bottom: 16px;
  font-size: 28px;
  font-weight: 600;
`;

const Message = styled.p`
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  margin-bottom: 32px;
  line-height: 1.6;
`;

const Button = styled.button`
  padding: 12px 24px;
  background: ${({ theme }) => theme.primary};
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 8px;

  &:hover {
    background: ${({ theme }) => theme.accent};
    transform: translateY(-2px);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
`;

const Congratulations = ({ eventName, onClose }) => {
  const navigate = useNavigate();

  const handleBackToEvents = () => {
    if (onClose) {
      onClose();
    }
    navigate('/', { replace: true });
  };

  const handleViewBookings = () => {
    if (onClose) {
      onClose();
    }
    navigate('/profile', { replace: true });
  };

  return (
    <Container>
      <Card>
        <Icon />
        <Title>Booking Confirmed!</Title>
        <Message>
          Congratulations! You have successfully booked your ticket for {eventName}.
          You can view your booking details in your profile.
        </Message>
        <ButtonGroup>
          <Button onClick={handleBackToEvents}>
            Back to Events
          </Button>
          <Button onClick={handleViewBookings}>
            View My Bookings
          </Button>
        </ButtonGroup>
      </Card>
    </Container>
  );
};

export default Congratulations; 