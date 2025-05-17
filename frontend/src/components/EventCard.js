import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { handleApiError, showSuccessMessage, showWarningMessage } from "../utils/errorHandler";

const API_BASE_URL = "https://epic-gather-dua2cncsh4g5gxg8.uaenorth-01.azurewebsites.net/api/v1";

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease-in-out;
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }
`;

const EventImage = styled.div`
  height: 200px;
  background: ${({ theme }) => theme.primary};
  background-image: ${({ $imageUrl }) => $imageUrl ? `url(${$imageUrl})` : 'none'};
  background-size: cover;
  background-position: center;
  position: relative;
`;

const EventDate = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.secondary};
  padding: 5px 10px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
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

const EventContent = styled.div`
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const EventTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: ${({ theme }) => theme.secondary};
  font-size: 1.25rem;
`;

const EventDescription = styled.p`
  color: #666;
  margin: 0 0 1rem 0;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const EventLocation = styled.p`
  color: #666;
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: ${({ theme }) => theme.primary};
  }
`;

const EventDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const EventPrice = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.primary};
  font-size: 1.1rem;
`;

const BookButton = styled.button`
  background: ${({ theme, $variant }) => 
    $variant === 'primary' ? theme.primary : theme.accent};
  color: ${({ theme, $variant }) => 
    $variant === 'primary' ? 'white' : theme.secondary};
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme, $variant }) => 
      $variant === 'primary' ? theme.accent : theme.primary};
    color: ${({ theme, $variant }) => 
      $variant === 'primary' ? theme.secondary : 'white'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [booking, setBooking] = useState(null);
  const formattedDate = moment(event.eventDate).format("MMM D, YYYY");
  const formattedTime = moment(event.eventDate).format("h:mm A");

  useEffect(() => {
    const checkBookingStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const bookingsResponse = await axios.get(
            `${API_BASE_URL}/bookings`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          
          const foundBooking = bookingsResponse.data.content.find(
            booking => booking.eventId === event.id
          );
          
          if (foundBooking) {
            setIsBooked(true);
            setBookingId(foundBooking.bookingId);
            setBooking(foundBooking);
          } else {
            setIsBooked(false);
            setBookingId(null);
            setBooking(null);
          }
        } catch (error) {
          console.error('Error checking booking status:', error);
          setIsBooked(false);
          setBookingId(null);
          setBooking(null);
        }
      }
    };

    checkBookingStatus();
  }, [event.id]);

  const handleCardClick = (e) => {
    // Prevent navigation if clicking on buttons
    if (e.target.closest('button')) {
      return;
    }
    navigate(`/event/${event.id}`);
  };

  const handleBookNow = async (e) => {
    e.stopPropagation(); // Prevent card click
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
      } else {
        // Book event
        try {
          const response = await axios.post(
            `${API_BASE_URL}/bookings/${event.id}/book`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          if (response.status === 201) {
            showSuccessMessage('Event booked successfully!');
            // Get the booking ID from the response data
            const newBookingId = response.data.bookingId;
            if (newBookingId) {
              setIsBooked(true);
              setBookingId(newBookingId);
            } else {
              // If bookingId is not in response data, fetch all bookings to find it
              const bookingsResponse = await axios.get(`${API_BASE_URL}/bookings`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              
              const booking = bookingsResponse.data.content.find(
                booking => booking.eventId === event.id
              );
              
              if (booking) {
                setIsBooked(true);
                setBookingId(booking.bookingId);
              }
            }
          }
        } catch (error) {
          if (error.response?.status === 400) {
            showWarningMessage('This event is already booked. Please try another event.');
          } else if (error.response?.status === 409) {
            showWarningMessage('This event is already fully booked. Please try another event.');
          } else {
            handleApiError(error, navigate);
          }
        }
      }
    } catch (error) {
      handleApiError(error, navigate);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <Card onClick={handleCardClick}>
      <EventImage $imageUrl={event.imageUrl}>
        <EventDate>{formattedDate}</EventDate>
      </EventImage>
      <EventContent>
        <EventTitle>{event.name}</EventTitle>
        <EventDescription>{event.description}</EventDescription>
        <EventLocation>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {event.venue}
        </EventLocation>
        {isBooked && (
          <BookedDate>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Booked on {moment(booking?.bookedAt).format('MMMM D, YYYY h:mm A')}
          </BookedDate>
        )}
        <EventDetails>
          <EventPrice>${event.price}</EventPrice>
          <BookButton 
            onClick={handleBookNow}
            disabled={isBooking}
            $isBooked={isBooked}
          >
            {isBooking 
              ? (isBooked ? "Cancelling..." : "Booking...") 
              : (isBooked ? "Cancel Booking" : "Book Now")}
          </BookButton>
        </EventDetails>
      </EventContent>
    </Card>
  );
};

export default EventCard;
