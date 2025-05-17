import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, message, Input, Select, Spin } from 'antd';
import { SearchOutlined, CalendarOutlined, PictureOutlined } from '@ant-design/icons';
import axios from 'axios';
import styled from 'styled-components';
import { useTheme } from 'styled-components';
import { handleApiError, showSuccessMessage, showWarningMessage } from '../utils/errorHandler';
import Congratulations from '../components/Congratulations';

const { Search } = Input;
const { Option } = Select;
const API_BASE_URL = 'https://epic-gather-dua2cncsh4g5gxg8.uaenorth-01.azurewebsites.net/api/v1';

const StyledCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  height: 100%;
  background: ${({ theme }) => theme.cardBackground};
  border: 1px solid ${({ theme }) => theme.primary}20;
  backdrop-filter: blur(10px);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  .ant-card-cover {
    position: relative;
    height: 200px;
    background: ${({ theme }) => theme.primary}10;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px 16px 0 0;
    overflow: hidden;

    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }

    .placeholder-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      text-align: center;
      color: ${({ theme }) => theme.primary};
      
      .placeholder-icon {
        font-size: 48px;
        margin-bottom: 12px;
        opacity: 0.8;
      }

      .placeholder-text {
        font-size: 16px;
        font-weight: 500;
        opacity: 0.9;
      }
    }
  }

  .ant-card-body {
    padding: 20px;
    background: ${({ theme }) => theme.cardBackground};
  }

  .event-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: ${({ theme }) => theme.text};
  }

  .event-date {
    color: ${({ theme }) => theme.primary};
    font-weight: 500;
    margin-bottom: 12px;
  }

  .event-price {
    font-size: 1.1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.accent};
  }

  .event-venue {
    color: ${({ theme }) => theme.textSecondary};
    margin-bottom: 12px;
  }

  .event-category {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    background: ${({ theme }) => theme.primary}20;
    color: ${({ theme }) => theme.primary};
    font-size: 0.9rem;
    margin-bottom: 12px;
  }

  .event-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
  }

  .event-tag {
    padding: 4px 12px;
    border-radius: 20px;
    background: ${({ theme }) => theme.secondary}20;
    color: ${({ theme }) => theme.secondary};
    font-size: 0.9rem;
  }
`;

const BookButton = styled.button`
  background: ${({ theme, $isBooked }) => 
    $isBooked 
      ? 'linear-gradient(45deg, #dc3545, #ff4d4d)'
      : `linear-gradient(45deg, ${theme.primary}, ${theme.accent})`};
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
  margin-top: 12px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

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

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [bookings, setBookings] = useState({});
  const [isBooking, setIsBooking] = useState({});
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [bookedEvent, setBookedEvent] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/event`);
      // Filter only upcoming events
      const upcomingEvents = response.data.content.filter(event => event.isUpcoming);
      setEvents(upcomingEvents);

      // Check booking status for each event
      const token = localStorage.getItem('token');
      if (token) {
        const bookingsResponse = await axios.get(`${API_BASE_URL}/bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const bookingStatus = {};
        bookingsResponse.data.content.forEach(booking => {
          bookingStatus[booking.eventId] = {
            isBooked: true,
            bookingId: booking.bookingId
          };
        });
        setBookings(bookingStatus);
      }
    } catch (error) {
      message.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const handleBookNow = async (eventId, e) => {
    e.stopPropagation(); // Prevent card click
    try {
      setIsBooking(prev => ({ ...prev, [eventId]: true }));
      const token = localStorage.getItem('token');
      
      if (!token) {
        showWarningMessage('Please login to book events');
        navigate('/login');
        return;
      }

      const booking = bookings[eventId];
      if (booking?.isBooked && booking?.bookingId) {
        // Cancel booking
        const response = await axios.delete(
          `${API_BASE_URL}/bookings/${booking.bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.status === 204) {
          showSuccessMessage('Booking cancelled successfully!');
          setBookings(prev => ({
            ...prev,
            [eventId]: { isBooked: false, bookingId: null }
          }));
        }
      } else {
        // Book event
        try {
          const response = await axios.post(
            `${API_BASE_URL}/bookings/${eventId}/book`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          if (response.status === 201) {
            const newBookingId = response.data.bookingId;
            if (newBookingId) {
              setBookings(prev => ({
                ...prev,
                [eventId]: { isBooked: true, bookingId: newBookingId }
              }));
              // Show congratulations screen
              const event = events.find(e => e.id === eventId);
              setBookedEvent(event);
              setShowCongratulations(true);
            } else {
              // If bookingId is not in response data, fetch all bookings to find it
              const bookingsResponse = await axios.get(`${API_BASE_URL}/bookings`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              
              const booking = bookingsResponse.data.content.find(
                booking => booking.eventId === eventId
              );
              
              if (booking) {
                setBookings(prev => ({
                  ...prev,
                  [eventId]: { isBooked: true, bookingId: booking.bookingId }
                }));
                // Show congratulations screen
                const event = events.find(e => e.id === eventId);
                setBookedEvent(event);
                setShowCongratulations(true);
              }
            }
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
      setIsBooking(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || event.category === category;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (showCongratulations && bookedEvent) {
    return (
      <Congratulations 
        eventName={bookedEvent.name} 
        onClose={() => {
          setShowCongratulations(false);
          setBookedEvent(null);
        }}
      />
    );
  }

  return (
    <Container>
      <div style={{ 
        marginBottom: '32px', 
        display: 'flex', 
        flexDirection: 'column',
        gap: '16px',
        alignItems: 'center'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 700, 
          color: theme.primary,
          textAlign: 'center',
          marginBottom: '16px'
        }}>
          Upcoming Events
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: theme.textSecondary,
          textAlign: 'center',
          maxWidth: '600px',
          marginBottom: '24px'
        }}>
          Discover and book tickets for exciting upcoming events in your area
        </p>
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          width: '100%',
          maxWidth: '800px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <Search
            placeholder="Search events..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%',
              maxWidth: '400px'
            }}
          />
          <Select
            defaultValue="all"
            style={{ width: 200 }}
            onChange={handleCategoryChange}
            size="large"
          >
            <Option value="all">All Categories</Option>
            <Option value="Sports">Sports</Option>
            <Option value="Music">Music</Option>
            <Option value="Conference">Conference</Option>
            <Option value="Workshop">Workshop</Option>
            <Option value="Festival">Festival</Option>
            <Option value="Networking">Networking</Option>
            <Option value="Party">Party</Option>
            <Option value="Seminar">Seminar</Option>
            <Option value="Exhibition">Exhibition</Option>
            <Option value="Comedy">Comedy</Option>
            <Option value="Theater">Theater</Option>
            <Option value="Family">Family</Option>
            <Option value="Food & Drink">Food & Drink</Option>
            <Option value="Charity">Charity</Option>
            <Option value="Technology">Technology</Option>
          </Select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {filteredEvents.map(event => (
            <Col xs={24} sm={12} lg={8} key={event.id}>
              <StyledCard
                hoverable
                cover={
                  event.imageUrl ? (
                    <img alt={event.name} src={event.imageUrl} />
                  ) : (
                    <div className="placeholder-content">
                      <PictureOutlined className="placeholder-icon" />
                      <div className="placeholder-text">{event.name}</div>
                    </div>
                  )
                }
                onClick={() => navigate(`/event/${event.id}`)}
              >
                <div className="event-category">{event.category}</div>
                <h2 className="event-title">{event.name}</h2>
                <div className="event-date">
                  <CalendarOutlined style={{ marginRight: 8 }} />
                  {formatDate(event.eventDate)}
                </div>
                <div className="event-venue">{event.venue}</div>
                <div className="event-tags">
                  {event.tags.map(tag => (
                    <span key={tag} className="event-tag">{tag}</span>
                  ))}
                </div>
                <div className="event-price">${event.price}</div>
                <BookButton 
                  onClick={(e) => handleBookNow(event.id, e)}
                  disabled={isBooking[event.id]}
                  $isBooked={bookings[event.id]?.isBooked}
                >
                  {isBooking[event.id] 
                    ? (bookings[event.id]?.isBooked ? "Cancelling..." : "Booking...") 
                    : (bookings[event.id]?.isBooked ? "Cancel Booking" : "Book Now")}
                </BookButton>
              </StyledCard>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Home;
