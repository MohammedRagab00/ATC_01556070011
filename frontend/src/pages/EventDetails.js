import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import moment from "moment";
import axios from "axios";
import { handleApiError, showSuccessMessage, showWarningMessage } from "../utils/errorHandler";
import { CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined, TagOutlined, TagsOutlined, UserOutlined, PictureOutlined } from '@ant-design/icons';
import Congratulations from '../components/Congratulations';

const API_BASE_URL = "https://epic-gather-dua2cncsh4g5gxg8.uaenorth-01.azurewebsites.net/api/v1";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: calc(100vh - 64px);
  background: ${({ theme }) => theme.background};

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const EventHeader = styled.div`
  display: flex;
  gap: 3rem;
  margin-bottom: 3rem;
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
    gap: 2rem;
  }
`;

const EventImage = styled.div`
  flex: 1;
  min-height: 500px;
  background: ${({ theme }) => theme.primary}10;
  background-image: ${({ $imageUrl }) => $imageUrl ? `url(${$imageUrl})` : 'none'};
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to top, rgba(0,0,0,0.3), transparent);
  }

  @media (max-width: 768px) {
    min-height: 300px;
    width: 100%;
    margin-bottom: 1rem;
  }

  @media (max-width: 480px) {
    min-height: 250px;
  }
`;

const EventInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem 0;
`;

const EventTitle = styled.h1`
  color: ${({ theme }) => theme.secondary};
  margin: 0;
  font-size: 2.8rem;
  font-weight: 700;
  line-height: 1.2;
  background: linear-gradient(45deg, ${({ theme }) => theme.secondary}, ${({ theme }) => theme.primary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const EventMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin: 1rem 0;
  padding: 1.5rem;
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.background};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  .anticon {
    color: ${({ theme }) => theme.primary};
    font-size: 1.2rem;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin: 1rem 0;
  padding: 1.5rem;
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
`;

const TagChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.primary};
  border: 1px solid ${({ theme }) => theme.primary}30;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-2px);
    background: ${({ theme }) => theme.primary}10;
    border-color: ${({ theme }) => theme.primary};
  }

  .anticon {
    font-size: 1rem;
  }
`;

const EventDescription = styled.div`
  color: ${({ theme }) => theme.text};
  line-height: 1.8;
  font-size: 1.1rem;
  margin: 1rem 0;
  padding: 1.5rem;
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  border-left: 4px solid ${({ theme }) => theme.primary};
`;

const PriceTag = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  margin: 1rem 0;
  padding: 1rem 2rem;
  background: linear-gradient(45deg, ${({ theme }) => theme.primary}15, ${({ theme }) => theme.accent}15);
  border-radius: 12px;
  display: inline-block;
`;

const BookButton = styled.button`
  background: ${({ theme, $isBooked }) => 
    $isBooked 
      ? 'linear-gradient(45deg, #dc3545, #ff4d4d)'
      : `linear-gradient(45deg, ${theme.primary}, ${theme.accent})`};
  color: white;
  padding: 1.2rem 2.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);

    &::before {
      left: 100%;
    }
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.textSecondary};
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  padding: 2rem;
`;

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [bookedEvent, setBookedEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          showWarningMessage('Please login to view event details');
          navigate('/login');
          return;
        }

        // Get the event details
        const eventResponse = await axios.get(`${API_BASE_URL}/event/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setEvent(eventResponse.data);

        // Check if the event is booked
        try {
          const bookingsResponse = await axios.get(`${API_BASE_URL}/bookings`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const booking = bookingsResponse.data.content.find(
            booking => booking.eventId === parseInt(id)
          );
          
          if (booking) {
            setIsBooked(true);
            setBookingId(booking.bookingId);
          }
        } catch (error) {
          console.error('Error checking booking status:', error);
        }
      } catch (error) {
        handleApiError(error, navigate);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const handleBookNow = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    try {
      setIsBooking(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        showWarningMessage('Please login to book events');
        navigate('/login');
        return;
      }

      if (isBooked && bookingId) {
        // Cancel booking
        try {
          const response = await axios.delete(
            `${API_BASE_URL}/bookings/${bookingId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          if (response.status === 204) {
            showSuccessMessage('Booking cancelled successfully!');
            setIsBooked(false);
            setBookingId(null);
          }
        } catch (error) {
          showWarningMessage(error.response?.data?.message || 'Failed to cancel booking');
        }
      } else {
        // Book event
        try {
          const response = await axios.post(
            `${API_BASE_URL}/bookings/${id}/book`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          if (response.status === 201) {
            setBookedEvent(event);
            setShowCongratulations(true);
          }
        } catch (error) {
          if (error.response?.status === 409) {
            showWarningMessage('This event is already fully booked. Please try another event.');
          } else {
            showWarningMessage(error.response?.data?.message || 'Failed to book event');
          }
        }
      }
    } catch (error) {
      handleApiError(error, navigate);
    } finally {
      setIsBooking(false);
    }
  };

  if (showCongratulations && bookedEvent) {
    return <Congratulations eventName={bookedEvent.name} />;
  }

  if (loading) {
    return (
      <Container>
        <LoadingContainer>Loading event details...</LoadingContainer>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container>
        <LoadingContainer>Event not found</LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <EventHeader>
        <EventImage $imageUrl={event.imageUrl}>
          {!event.imageUrl && (
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: 'white'
            }}>
              <PictureOutlined style={{ fontSize: '48px', marginBottom: '12px' }} />
              <div style={{ fontSize: '18px', fontWeight: 500 }}>{event.name}</div>
            </div>
          )}
        </EventImage>
        <EventInfo>
          <EventTitle>{event.name}</EventTitle>
          <EventMeta>
            <MetaItem>
              <CalendarOutlined />
              {moment(event.eventDate).format("MMMM D, YYYY")}
            </MetaItem>
            <MetaItem>
              <ClockCircleOutlined />
              {moment(event.eventDate).format("h:mm A")}
            </MetaItem>
            <MetaItem>
              <EnvironmentOutlined />
              {event.venue}
            </MetaItem>
            <MetaItem>
              <TagOutlined />
              {event.category}
            </MetaItem>
          </EventMeta>
          {event.tags?.length > 0 && (
            <TagsContainer>
              {event.tags.map((tag, index) => (
                <TagChip key={index}>
                  <TagsOutlined />
                  {tag}
                </TagChip>
              ))}
            </TagsContainer>
          )}
          <EventDescription>{event.description}</EventDescription>
          <PriceTag>${event.price}</PriceTag>
          <BookButton 
            onClick={(e) => handleBookNow(e)}
            disabled={isBooking}
            $isBooked={isBooked}
          >
            {isBooking 
              ? (isBooked ? "Cancelling..." : "Booking...") 
              : (isBooked ? "Cancel Booking" : "Book Now")}
          </BookButton>
        </EventInfo>
      </EventHeader>
    </Container>
  );
};

export default EventDetails;
