import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import moment from 'moment';
import { handleApiError, showSuccessMessage, showWarningMessage } from '../utils/errorHandler';
import { EyeOutlined, EyeInvisibleOutlined, CalendarOutlined, ClockCircleOutlined, EditOutlined, LockOutlined } from '@ant-design/icons';

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

const ProfileHeader = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 2rem;
  border: 1px solid ${({ theme }) => theme.primary}20;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${({ theme }) => theme.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
  position: relative;
  cursor: pointer;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover::after {
    content: 'Change Photo';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    font-weight: normal;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h1`
  color: ${({ theme }) => theme.text};
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
`;

const UserEmail = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  margin: 0;
  font-size: 1.1rem;
`;

const Section = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.primary}20;
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.text};
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: ${({ theme }) => theme.primary};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.background};
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.primary}20;
`;

const StatValue = styled.div`
  color: ${({ theme }) => theme.primary};
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 1.1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.textSecondary};
`;

const ViewAllLink = styled(Link)`
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    transform: translateX(5px);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ShowAllButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme.primary}20;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.primary}10;
    transform: translateY(-1px);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Form = styled.form`
  display: grid;
  gap: 1.5rem;
  margin-top: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.primary}20;
  border-radius: 8px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}20;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.primary}20;
  border-radius: 8px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}20;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.accent};
    transform: translateY(-1px);
  }

  &:disabled {
    background: ${({ theme }) => theme.disabledBackground};
    cursor: not-allowed;
    transform: none;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const ErrorMessage = styled.p`
  color: #ff4d4f;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const EventList = styled.div`
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
`;

const EventCard = styled.div`
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.primary}20;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const EventInfo = styled.div`
  flex: 1;
`;

const EventTitle = styled.h3`
  color: ${({ theme }) => theme.text};
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
`;

const EventDate = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  margin: 0;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    gender: '',
    birthDate: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingEvents: 0,
    pastEvents: 0
  });
  const [bookings, setBookings] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const [profileResponse, bookingsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/user/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_BASE_URL}/bookings`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setProfile(profileResponse.data);
        setFormData({
          firstname: profileResponse.data.firstName || '',
          lastname: profileResponse.data.lastName || '',
          gender: profileResponse.data.gender || '',
          birthDate: profileResponse.data.birthDate || ''
        });

        const bookings = bookingsResponse.data.content || [];
        setBookings(bookings);
        const now = new Date();

        setStats({
          totalBookings: bookings.length,
          upcomingEvents: bookings.filter(b => new Date(b.eventDate) > now).length,
          pastEvents: bookings.filter(b => new Date(b.eventDate) <= now).length
        });
      } catch (error) {
        handleApiError(error, navigate);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `${API_BASE_URL}/user/profile`,
        {
          firstname: formData.firstname,
          lastname: formData.lastname,
          gender: formData.gender,
          birthDate: formData.birthDate
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 200) {
        showSuccessMessage('Profile updated successfully!');
        setProfile(prev => ({
          ...prev,
          firstName: formData.firstname,
          lastName: formData.lastname,
          gender: formData.gender,
          birthDate: formData.birthDate
        }));
      }
    } catch (error) {
      handleApiError(error, navigate);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      setIsChangingPassword(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_BASE_URL}/user/password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 200) {
        showSuccessMessage('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      if (error.response?.data) {
        const { details, message } = error.response.data;
        setPasswordError(details || message || 'Failed to change password');
      } else {
        setPasswordError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showWarningMessage('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showWarningMessage('Image size should be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.put(
        `${API_BASE_URL}/user/photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 200) {
        showSuccessMessage('Profile photo updated successfully!');
        setProfile(prev => ({
          ...prev,
          photoUrl: response.data.photoUrl
        }));
        // Trigger auth state change to update navbar
        window.dispatchEvent(new Event('authStateChange'));
      }
    } catch (error) {
      handleApiError(error, navigate);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>Loading profile...</LoadingContainer>
      </Container>
    );
  }

  const pastEvents = bookings.filter(b => new Date(b.eventDate) <= new Date());
  const upcomingEvents = bookings.filter(b => new Date(b.eventDate) > new Date());

  return (
    <Container>
      <ProfileHeader>
        <Avatar onClick={() => document.getElementById('photo-upload').click()}>
          {profile?.photoUrl ? (
            <img src={profile.photoUrl} alt="Profile" />
          ) : (
            profile?.firstName?.charAt(0) || ''
          )}
          <HiddenInput
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            disabled={isUploading}
          />
        </Avatar>
        <UserInfo>
          <UserName>{profile?.firstName} {profile?.lastName}</UserName>
          <UserEmail>{profile?.email}</UserEmail>
        </UserInfo>
      </ProfileHeader>

      <Section>
        <SectionTitle>
          <EditOutlined />
          Edit Profile
        </SectionTitle>
        <Form onSubmit={handleSubmit}>
          <FormGroup key="firstname-group">
            <Label htmlFor="firstname">First Name</Label>
            <Input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup key="lastname-group">
            <Label htmlFor="lastname">Last Name</Label>
            <Input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup key="gender-group">
            <Label htmlFor="gender">Gender</Label>
            <Select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
            </Select>
          </FormGroup>

          <FormGroup key="birthdate-group">
            <Label htmlFor="birthDate">Birth Date</Label>
            <Input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update Profile'}
          </Button>
        </Form>
      </Section>

      <Section>
        <SectionTitle>
          <LockOutlined />
          Change Password
        </SectionTitle>
        <Form onSubmit={handlePasswordChange}>
          <FormGroup key="current-password-group">
            <Label>Current Password</Label>
            <InputWrapper>
              <Input
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => {
                  setPasswordData(prev => ({
                    ...prev,
                    currentPassword: e.target.value
                  }));
                  setPasswordError('');
                }}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                aria-label={showCurrentPassword ? "Hide password" : "Show password"}
              >
                {showCurrentPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </PasswordToggle>
            </InputWrapper>
          </FormGroup>

          <FormGroup key="new-password-group">
            <Label>New Password</Label>
            <InputWrapper>
              <Input
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => {
                  setPasswordData(prev => ({
                    ...prev,
                    newPassword: e.target.value
                  }));
                  setPasswordError('');
                }}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </PasswordToggle>
            </InputWrapper>
          </FormGroup>

          <FormGroup key="confirm-password-group">
            <Label>Confirm New Password</Label>
            <InputWrapper>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => {
                  setPasswordData(prev => ({
                    ...prev,
                    confirmPassword: e.target.value
                  }));
                  setPasswordError('');
                }}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </PasswordToggle>
            </InputWrapper>
          </FormGroup>

          {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
          
          <Button type="submit" disabled={isChangingPassword}>
            {isChangingPassword ? 'Changing Password...' : 'Change Password'}
          </Button>
        </Form>
      </Section>

      <Section>
        <SectionTitle>
          <CalendarOutlined />
          Event Statistics
        </SectionTitle>
        <StatsGrid>
          <StatCard key="total-bookings">
            <StatValue>{stats.totalBookings}</StatValue>
            <StatLabel>Total Bookings</StatLabel>
          </StatCard>
          <StatCard key="upcoming-events">
            <StatValue>{stats.upcomingEvents}</StatValue>
            <StatLabel>Upcoming Events</StatLabel>
          </StatCard>
          <StatCard key="past-events">
            <StatValue>{stats.pastEvents}</StatValue>
            <StatLabel>Past Events</StatLabel>
          </StatCard>
        </StatsGrid>
        {stats.totalBookings > 0 && (
          <ShowAllButton to="/bookings">
            <CalendarOutlined />
            Show All Bookings
          </ShowAllButton>
        )}
      </Section>

      {upcomingEvents.length > 0 && (
        <Section>
          <SectionTitle>
            <ClockCircleOutlined />
            Upcoming Events
          </SectionTitle>
          <EventList>
            {upcomingEvents.map((booking, index) => (
              <EventCard key={`upcoming-${booking.eventId || booking.id || index}`}>
                <EventInfo>
                  <EventTitle>{booking.eventName}</EventTitle>
                  <EventDate>
                    <CalendarOutlined />
                    {moment(booking.eventDate).format('MMMM D, YYYY')}
                  </EventDate>
                </EventInfo>
                <ViewAllLink to={`/event/${booking.eventId}`}>
                  View Details
                </ViewAllLink>
              </EventCard>
            ))}
          </EventList>
        </Section>
      )}

      {pastEvents.length > 0 && (
        <Section>
          <SectionTitle>
            <ClockCircleOutlined />
            Past Events
          </SectionTitle>
          <EventList>
            {pastEvents.map((booking, index) => (
              <EventCard key={`past-${booking.eventId || booking.id || index}`}>
                <EventInfo>
                  <EventTitle>{booking.eventName}</EventTitle>
                  <EventDate>
                    <CalendarOutlined />
                    {moment(booking.eventDate).format('MMMM D, YYYY')}
                  </EventDate>
                </EventInfo>
                <ViewAllLink to={`/event/${booking.eventId}`}>
                  View Details
                </ViewAllLink>
              </EventCard>
            ))}
          </EventList>
        </Section>
      )}

      {stats.totalBookings === 0 && (
        <Section>
          <EmptyState>
            <h3>No Bookings Yet</h3>
            <p>You haven't booked any events yet. Start exploring our events!</p>
          </EmptyState>
        </Section>
      )}
    </Container>
  );
};

export default Profile;