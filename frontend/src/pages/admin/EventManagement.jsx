import { useState, useEffect } from "react";
import { Layout } from "antd";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  message,
  Popconfirm,
  Tag,
  Space,
  Upload,
  Select,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useSidebar } from "../../context/SidebarContext";
import EventForm from "../../components/admin/EventForm"; // Adjust the import based on your project structure

const { Column } = Table;

const Container = styled.div`
  padding: 32px 24px;
  margin-left: ${({ $collapsed }) => ($collapsed ? "80px" : "250px")};
  transition: all 0.3s ease;
  min-height: 100vh;
  width: calc(100% - ${({ $collapsed }) => ($collapsed ? "80px" : "250px")});
  background: ${({ theme }) => theme.admin.background};

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

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  @media (max-width: 480px) {
    margin-bottom: 16px;
    gap: 12px;
  }
`;

const PageTitle = styled.h2`
  color: ${({ theme }) => theme.primary};
  font-size: 24px;
  font-weight: 600;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const CreateButton = styled(Button)`
  background: ${({ theme }) => theme.primary};
  color: white;
  font-weight: 500;
  height: 40px;
  padding: 0 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.accent};
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }

  @media (max-width: 480px) {
    height: 36px;
    font-size: 14px;
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  .ant-table {
    overflow-x: auto;
  }

  .ant-table-thead > tr > th {
    background: ${({ theme }) => theme.admin.background};
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 8px;
      font-size: 14px;
    }

    .ant-table-cell {
      white-space: nowrap;
    }
  }

  @media (max-width: 480px) {
    border-radius: 8px;
    
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 6px;
      font-size: 13px;
    }

    .ant-table-cell {
      white-space: nowrap;
    }

    .ant-btn {
      padding: 4px 8px;
      font-size: 12px;
      height: 28px;
    }
  }
`;

const EventManagement = () => {
  const { collapsed } = useSidebar();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  // Fetch events on load
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://epic-gather-dua2cncsh4g5gxg8.uaenorth-01.azurewebsites.net/api/v1/event"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      // Events already include tags in their response
      setEvents(data.content || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    setCurrentEvent(null);
    setShowForm(true);
  };

  const handleEditEvent = (event) => {
    setCurrentEvent(event);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    fetchEvents(); // Refresh the list
  };

  const handleDeleteEvent = async (eventId) => {
    // First check if event can be deleted
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      if (!token) {
        alert("You must be logged in as admin to delete events.");
        return;
      }

      // Check if event can be deleted
      const checkResponse = await fetch(
        `https://epic-gather-dua2cncsh4g5gxg8.uaenorth-01.azurewebsites.net/api/v1/admin/event/${eventId}/can-delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const checkResult = await checkResponse.json();

      // If there are reasons why it can't be deleted, show them
      if (checkResult.hasBookings || checkResult.isPast) {
        let message = "Cannot delete this event because:";
        if (checkResult.hasBookings) message += "\n- It has active bookings";
        if (checkResult.isPast) message += "\n- The event has already passed";

        alert(message);
        return;
      }

      // Confirm deletion
      if (!window.confirm("Are you sure you want to delete this event?")) {
        return;
      }

      // Delete the event
      const deleteResponse = await fetch(
        `https://epic-gather-dua2cncsh4g5gxg8.uaenorth-01.azurewebsites.net/api/v1/admin/event/${eventId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (deleteResponse.ok) {
        alert("Event deleted successfully");
        fetchEvents(); // Refresh the list
      } else {
        alert("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("An error occurred while deleting the event");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", position: 'relative' }}>
      <Container $collapsed={collapsed}>
        <PageHeader>
          <PageTitle>Event Management</PageTitle>
          <CreateButton
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateEvent}
          >
            Create New Event
          </CreateButton>
        </PageHeader>

        {showForm && (
          <EventForm event={currentEvent} onClose={handleCloseForm} />
        )}

        <TableContainer>
          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center' }}>
              <p>Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center' }}>
              <p>No events found. Create your first event!</p>
            </div>
          ) : (
            <Table
              dataSource={events}
              loading={loading}
              rowKey="id"
              scroll={{ x: true }}
              size="small"
              pagination={{
                responsive: true,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} items`,
                pageSizeOptions: ['10', '20', '50'],
                defaultPageSize: 10,
                size: 'small',
              }}
            >
              <Column
                title="Name"
                dataIndex="name"
                key="name"
                render={(text) => <span style={{ fontWeight: 500 }}>{text}</span>}
              />
              <Column
                title="Date"
                dataIndex="eventDate"
                key="eventDate"
                render={(date) => new Date(date).toLocaleDateString()}
              />
              <Column
                title="Venue"
                dataIndex="venue"
                key="venue"
              />
              <Column
                title="Price"
                dataIndex="price"
                key="price"
                render={(price) => `$${price}`}
              />
              <Column
                title="Category"
                dataIndex="category"
                key="category"
                render={(category) => (
                  <Tag color="blue">
                    {category}
                  </Tag>
                )}
              />
              <Column
                title="Actions"
                key="actions"
                render={(_, record) => (
                  <Space size="small">
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => handleEditEvent(record)}
                      size="small"
                    >
                      Edit
                    </Button>
                    <Popconfirm
                      title="Are you sure you want to delete this event?"
                      onConfirm={() => handleDeleteEvent(record.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                      >
                        Delete
                      </Button>
                    </Popconfirm>
                  </Space>
                )}
              />
            </Table>
          )}
        </TableContainer>
      </Container>
    </Layout>
  );
};

export default EventManagement;
