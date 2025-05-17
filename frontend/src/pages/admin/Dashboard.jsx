import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Statistic, Layout, ConfigProvider, Tabs, Tag } from 'antd';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import styled, { useTheme } from 'styled-components';
import { message } from 'antd';
import { useSidebar } from '../../context/SidebarContext';

const { Content } = Layout;
const API_BASE_URL = 'https://epic-gather-dua2cncsh4g5gxg8.uaenorth-01.azurewebsites.net/api/v1';

const ResponsiveContent = styled(Content)`
  margin-left: ${({ $collapsed }) => ($collapsed ? '80px' : '250px')};
  padding: 32px 24px;
  background: ${({ theme }) => theme.admin.background};
  min-height: 100vh;
  transition: all 0.2s ease;
  width: calc(100% - ${({ $collapsed }) => ($collapsed ? '80px' : '250px')});

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 16px;
    width: 100%;
    position: relative;
    z-index: 10;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const PageTitle = styled.h1`
  margin-bottom: 32px;
  color: ${({ theme }) => theme.primary};
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -1px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 16px;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
    margin-bottom: 12px;
  }
`;

const StyledCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background: ${({ theme }) => theme.admin.cardBackground};
  border: 1px solid ${({ theme }) => theme.primary}20;
  height: 100%;
  
  .ant-statistic-title {
    color: ${({ theme }) => theme.admin.textLight};
    font-size: 15px;
    font-weight: 500;
  }
  
  .ant-statistic-content {
    color: ${({ theme }) => theme.admin.text};
    font-size: 28px;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .ant-statistic-content {
      font-size: 24px;
    }
  }

  @media (max-width: 480px) {
    .ant-statistic-title {
      font-size: 14px;
    }
    
    .ant-statistic-content {
      font-size: 20px;
    }
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`;

const EventCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: ${({ theme }) => theme.admin.cardBackground};
  border: 1px solid ${({ theme }) => theme.primary}20;
  transition: all 0.3s ease;
  
  .ant-card-head {
    border-bottom: 1px solid ${({ theme }) => theme.admin.border};
    padding: 12px 16px;
  }
  
  .ant-card-head-title {
    color: ${({ theme }) => theme.admin.text};
    font-weight: 600;
  }
  
  .ant-card-body {
    padding: 16px;
  }
  
  .event-date {
    color: ${({ theme }) => theme.primary};
    margin-bottom: 8px;
  }
  
  .event-venue {
    color: ${({ theme }) => theme.admin.textLight};
    margin-bottom: 8px;
  }
  
  .event-price {
    color: ${({ theme }) => theme.accent};
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .ant-card-head-title {
      font-size: 16px;
    }
    
    .event-date, .event-venue {
      font-size: 14px;
    }
  }

  @media (max-width: 480px) {
    margin-bottom: 12px;
    
    .ant-card-head {
      padding: 8px 12px;
    }
    
    .ant-card-body {
      padding: 12px;
    }
    
    .ant-card-head-title {
      font-size: 14px;
    }
    
    .event-date, .event-venue {
      font-size: 13px;
    }
    
    .event-price {
      font-size: 14px;
    }
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`;

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    pastEvents: 0
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const theme = useTheme();
  const { collapsed } = useSidebar();

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/event`, {
          headers: getAuthHeader()
        });
        const events = response.data.content || [];
        
        const upcomingEvents = events.filter(event => event.isUpcoming);
        const pastEvents = events.filter(event => !event.isUpcoming);
        
        setEvents(events);
        setStats({
          totalEvents: events.length,
          upcomingEvents: upcomingEvents.length,
          pastEvents: pastEvents.length
        });
      } catch (error) {
        message.error('Failed to fetch dashboard data');
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const tabItems = [
    {
      key: 'upcoming',
      label: 'Upcoming Events',
      children: events
        .filter(event => event.isUpcoming)
        .map(event => (
          <EventCard key={event.id} title={event.name}>
            <div className="event-date">
              <CalendarOutlined style={{ marginRight: 8 }} />
              {formatDate(event.eventDate)}
            </div>
            <div className="event-venue">{event.venue}</div>
            <div className="event-price">${event.price}</div>
            <div className="event-tags" style={{ marginTop: '8px' }}>
              {event.tags?.map(tag => (
                <Tag key={tag} color="blue" style={{ marginRight: '4px' }}>
                  {tag}
                </Tag>
              ))}
            </div>
          </EventCard>
        ))
    },
    {
      key: 'past',
      label: 'Past Events',
      children: events
        .filter(event => !event.isUpcoming)
        .map(event => (
          <EventCard key={event.id} title={event.name}>
            <div className="event-date">
              <CalendarOutlined style={{ marginRight: 8 }} />
              {formatDate(event.eventDate)}
            </div>
            <div className="event-venue">{event.venue}</div>
            <div className="event-price">${event.price}</div>
            <div className="event-tags" style={{ marginTop: '8px' }}>
              {event.tags?.map(tag => (
                <Tag key={tag} color="blue" style={{ marginRight: '4px' }}>
                  {tag}
                </Tag>
              ))}
            </div>
          </EventCard>
        ))
    }
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: theme.primary,
          colorBgContainer: theme.admin.cardBackground,
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: theme.admin.background, position: 'relative' }}>
        <ResponsiveContent $collapsed={collapsed}>
          <PageTitle>Admin Dashboard</PageTitle>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={8}>
              <StyledCard>
                <Statistic
                  title="Total Events"
                  value={stats.totalEvents}
                  prefix={<CalendarOutlined />}
                />
              </StyledCard>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <StyledCard>
                <Statistic
                  title="Upcoming Events"
                  value={stats.upcomingEvents}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: theme.primary }}
                />
              </StyledCard>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <StyledCard>
                <Statistic
                  title="Past Events"
                  value={stats.pastEvents}
                  prefix={<CalendarOutlined />}
                  valueStyle={{ color: theme.secondary }}
                />
              </StyledCard>
            </Col>
          </Row>

          <StyledCard 
            title="Recent Events" 
            style={{ marginTop: '24px' }}
          >
            <Tabs 
              defaultActiveKey="upcoming" 
              items={tabItems}
              style={{ overflowX: 'auto' }}
              size="small"
            />
          </StyledCard>
        </ResponsiveContent>
      </Layout>
    </ConfigProvider>
  );
};

export default Dashboard;
