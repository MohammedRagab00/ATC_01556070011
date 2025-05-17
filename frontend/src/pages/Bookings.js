import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import moment from 'moment';
import { handleApiError } from '../utils/errorHandler';

const API_BASE_URL = "https://epic-gather-dua2cncsh4g5gxg8.uaenorth-01.azurewebsites.net/api/v1";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: calc(100vh - 64px);
  background: ${({ theme }) => theme.background};
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.text};
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 600;
  text-align: center;
`;

const BookingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

const BookingCard = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.primary}20;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &::after {
    content: '→';
    color: ${({ theme }) => theme.primary};
    font-size: 1.2rem;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const BookingInfo = styled.div`
  flex: 1;
`;

const BookingTitle = styled.h3`
  color: ${({ theme }) => theme.text};
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
`;

const BookingDate = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  margin: 0;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: ${({ theme }) => theme.primary};
  }
`;

const BookedDate = styled.p`
  color: #888;
  margin: 0.5rem 0 0 0;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: ${({ theme }) => theme.accent};
  }
`;

const EventVenue = styled.p`
  color: #666;
  margin: 0;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: ${({ theme }) => theme.primary};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1.2rem;
  color: #666;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h3 {
    color: ${({ theme }) => theme.secondary};
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  p {
    color: #666;
    margin-bottom: 1.5rem;
  }
`;

const Button = styled.button`
  background: linear-gradient(45deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.accent});
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const Bookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 6; // Number of items per page

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(
          `${API_BASE_URL}/bookings?page=${currentPage}&size=${pageSize}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setBookings(response.data.content || []);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } catch (error) {
        handleApiError(error, navigate);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>Loading your bookings...</LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle>My Bookings</PageTitle>
      {bookings.length === 0 ? (
        <EmptyState>
          <h3>No Bookings Yet</h3>
          <p>You haven't booked any events yet. Start exploring our events!</p>
          <Button onClick={() => navigate('/')}>Browse Events</Button>
        </EmptyState>
      ) : (
        <BookingsGrid>
          {bookings.map(booking => (
            <BookingCard 
              key={booking.bookingId}
              onClick={() => navigate(`/event/${booking.eventId}`)}
            >
              <BookingInfo>
                <BookingTitle>{booking.eventName}</BookingTitle>
                <BookingDate>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM16 2v4M8 2v4M3 10h18"/>
                  </svg>
                  {moment(booking.eventDate).format('MMMM D, YYYY h:mm A')}
                </BookingDate>
                <BookedDate>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Booked on {moment(booking.bookedAt).format('MMMM D, YYYY h:mm A')}
                </BookedDate>
              </BookingInfo>
            </BookingCard>
          ))}
        </BookingsGrid>
      )}
    </Container>
  );
};

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
`;

const PaginationButton = styled.button`
  background: ${({ theme, disabled }) => 
    disabled ? '#ccc' : `linear-gradient(45deg, ${theme.primary}, ${theme.accent})`};
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const PageInfo = styled.span`
  color: ${({ theme }) => theme.secondary};
  font-size: 1rem;
  font-weight: 500;
`;

export default Bookings; 