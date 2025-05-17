import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Tag, Popconfirm, Layout, Upload } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, TagsOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import styled from 'styled-components';
import { useTheme } from 'styled-components';
import { useSidebar } from '../../context/SidebarContext';

const { Content } = Layout;
const { Option } = Select;
const API_BASE_URL = 'https://epic-gather-dua2cncsh4g5gxg8.uaenorth-01.azurewebsites.net/api/v1';

const GlobalStyles = styled.div`
  @media (forced-colors: active) {
    .ant-btn {
      border: 1px solid CanvasText !important;
    }
    .ant-input {
      border: 1px solid CanvasText !important;
    }
    .ant-select-selector {
      border: 1px solid CanvasText !important;
    }
    .ant-tag {
      border: 1px solid CanvasText !important;
    }
    .ant-table {
      border: 1px solid CanvasText !important;
    }
    .ant-table-thead > tr > th {
      border: 1px solid CanvasText !important;
    }
    .ant-table-tbody > tr > td {
      border: 1px solid CanvasText !important;
    }
    .ant-modal-content {
      border: 1px solid CanvasText !important;
    }
    .ant-modal-header {
      border-bottom: 1px solid CanvasText !important;
    }
    .ant-modal-footer {
      border-top: 1px solid CanvasText !important;
    }
    .ant-form-item-label > label {
      color: CanvasText !important;
    }
  }
`;

const StyledTag = styled(Tag)`
  margin: 4px;
  padding: 4px 8px;
  border-radius: 4px;
`;

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
`;

const ResponsiveTable = styled(Table)`
  .ant-table {
    overflow-x: auto;
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
`;

const ActionButton = styled(Button)`
  @media (max-width: 768px) {
    padding: 4px 8px;
    font-size: 12px;
  }
`;

const TagInput = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    background: ${({ theme }) => theme.background};
    border-radius: 8px;
  }

  .ant-modal-header {
    background: ${({ theme }) => theme.background};
    border-bottom: 1px solid ${({ theme }) => theme.border};
  }

  .ant-modal-title {
    color: ${({ theme }) => theme.text};
  }

  .ant-modal-close {
    color: ${({ theme }) => theme.text};
  }

  @media (max-width: 768px) {
    .ant-modal-content {
      padding: 16px;
    }

    .ant-form-item-label {
      padding-bottom: 4px;
    }

    .ant-form-item {
      margin-bottom: 16px;
    }
  }

  @media (forced-colors: active) {
    .ant-modal-content {
      border: 1px solid CanvasText !important;
      background: Canvas !important;
    }
    .ant-modal-header {
      border-bottom: 1px solid CanvasText !important;
      background: Canvas !important;
    }
    .ant-modal-title {
      color: CanvasText !important;
    }
    .ant-modal-close {
      color: CanvasText !important;
    }
    .ant-modal-footer {
      border-top: 1px solid CanvasText !important;
    }
    .ant-btn {
      border: 1px solid CanvasText !important;
      background: Canvas !important;
      color: CanvasText !important;
    }
    .ant-btn-primary {
      background: Highlight !important;
      color: HighlightText !important;
    }
  }
`;

const StyledForm = styled(Form)`
  .ant-form-item-label > label {
    color: ${({ theme }) => theme.text};
  }

  .ant-input,
  .ant-input-number,
  .ant-select-selector {
    border: 1px solid ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
  }

  .ant-input:hover,
  .ant-input-number:hover,
  .ant-select:hover .ant-select-selector {
    border-color: ${({ theme }) => theme.primary};
  }

  .ant-input:focus,
  .ant-input-number-focused,
  .ant-select-focused .ant-select-selector {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}20;
  }

  @media (forced-colors: active) {
    .ant-form-item-label > label {
      color: CanvasText !important;
    }
    .ant-input,
    .ant-input-number,
    .ant-select-selector {
      border: 1px solid CanvasText !important;
      background: Canvas !important;
      color: CanvasText !important;
    }
    .ant-input:hover,
    .ant-input-number:hover,
    .ant-select:hover .ant-select-selector {
      border-color: Highlight !important;
    }
    .ant-input:focus,
    .ant-input-number-focused,
    .ant-select-focused .ant-select-selector {
      border-color: Highlight !important;
      outline: 2px solid Highlight !important;
      outline-offset: 2px !important;
    }
    .ant-select-dropdown {
      border: 1px solid CanvasText !important;
      background: Canvas !important;
    }
    .ant-select-item {
      color: CanvasText !important;
    }
    .ant-select-item-option-selected {
      background: Highlight !important;
      color: HighlightText !important;
    }
  }
`;

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newTag, setNewTag] = useState('');
  const [form] = Form.useForm();
  const [editingEvent, setEditingEvent] = useState(null);
  const { collapsed } = useSidebar();
  const theme = useTheme();

  useEffect(() => {
    fetchEvents();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/event`, {
        headers: getAuthHeader()
      });
      setEvents(response.data.content || []);
    } catch (error) {
      message.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditEvent = (record) => {
    setEditingEvent(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      eventDate: record.eventDate,
      price: record.price,
      venue: record.venue,
      category: record.category,
    });
    setModalVisible(true);
  };

  const handleDeleteEvent = async (id) => {
    try {
      // First check if event can be deleted
      const checkResponse = await axios.get(`${API_BASE_URL}/admin/event/${id}/can-delete`, {
        headers: getAuthHeader()
      });

      const checkResult = checkResponse.data;
      if (checkResult.hasBookings || checkResult.isPast) {
        let message = "Cannot delete this event because:";
        if (checkResult.hasBookings) message += "\n- It has active bookings";
        if (checkResult.isPast) message += "\n- The event has already passed";
        message.error(message);
        return;
      }

      await axios.delete(`${API_BASE_URL}/admin/event/${id}`, {
        headers: getAuthHeader()
      });
      message.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      message.error('Failed to delete event');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const eventData = {
        ...values,
        eventDate: new Date(values.eventDate).toISOString(),
        price: parseFloat(values.price)
      };

      if (editingEvent) {
        await axios.put(`${API_BASE_URL}/admin/event/${editingEvent.id}/update`, eventData, {
          headers: getAuthHeader()
        });
        message.success('Event updated successfully');
      } else {
        await axios.post(`${API_BASE_URL}/admin/event`, eventData, {
          headers: getAuthHeader()
        });
        message.success('Event created successfully');
      }

      setModalVisible(false);
      fetchEvents();
    } catch (error) {
      message.error('Failed to save event');
    }
  };

  const handleManageTags = (event) => {
    setSelectedEvent(event);
    setTagModalVisible(true);
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;

    try {
      await axios.patch(
        `${API_BASE_URL}/admin/event/${selectedEvent.id}/add-tag`,
        { tagName: newTag.trim() },
        { headers: getAuthHeader() }
      );
      message.success('Tag added successfully');
      setNewTag('');
      fetchEvents(); // Refresh events to get updated tags
    } catch (error) {
      message.error('Failed to add tag');
    }
  };

  const handleRemoveTag = async (tag) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/admin/event/${selectedEvent.id}/remove-tag/${tag}`,
        { headers: getAuthHeader() }
      );
      message.success('Tag removed successfully');
      fetchEvents(); // Refresh events to get updated tags
    } catch (error) {
      message.error('Failed to remove tag');
    }
  };

  const handlePhotoUpload = async (eventId, file) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        message.error("You must be logged in as admin to upload photos.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${API_BASE_URL}/admin/event/${eventId}/photo`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload photo");
      }

      message.success("Photo uploaded successfully!");
      fetchEvents(); // Refresh the events list to show the new photo
    } catch (error) {
      console.error("Error uploading photo:", error);
      message.error("Failed to upload photo");
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'Date',
      dataIndex: 'eventDate',
      key: 'eventDate',
      render: (date) => new Date(date).toLocaleDateString(),
      responsive: ['md', 'lg', 'xl'],
    },
    {
      title: 'Venue',
      dataIndex: 'venue',
      key: 'venue',
      ellipsis: true,
      responsive: ['md', 'lg', 'xl'],
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price}`,
      responsive: ['sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      responsive: ['lg', 'xl'],
    },
    {
      title: 'Status',
      dataIndex: 'isUpcoming',
      key: 'isUpcoming',
      render: (isUpcoming) => (
        <Tag color={isUpcoming ? 'green' : 'red'}>
          {isUpcoming ? 'Upcoming' : 'Past'}
        </Tag>
      ),
      responsive: ['md', 'lg', 'xl'],
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags) => (
        <Space wrap>
          {tags?.map(tag => (
            <StyledTag key={tag} color="blue">
              {tag}
            </StyledTag>
          ))}
        </Space>
      ),
      responsive: ['lg', 'xl'],
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditEvent(record)}
            size="small"
          >
            Edit
          </Button>
          <Button
            type="primary"
            icon={<TagsOutlined />}
            onClick={() => handleManageTags(record)}
            size="small"
          >
            Tags
          </Button>
          <Upload
            name="photo"
            showUploadList={false}
            beforeUpload={(file) => {
              handlePhotoUpload(record.id, file);
              return false;
            }}
          >
            <Button
              type="primary"
              icon={<UploadOutlined />}
              size="small"
            >
              Photo
            </Button>
          </Upload>
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
      ),
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  ];

  return (
    <GlobalStyles>
      <Layout style={{ minHeight: '100vh', background: theme.admin.background }}>
        <ResponsiveContent $collapsed={collapsed}>
          <PageTitle>Event Management</PageTitle>

          <div style={{ marginBottom: '16px' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddEvent}
            >
              Add Event
            </Button>
          </div>

          <ResponsiveTable
            columns={columns}
            dataSource={events}
            loading={loading}
            rowKey="id"
            scroll={{ x: true }}
            pagination={{
              responsive: true,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} items`,
              pageSizeOptions: ['10', '20', '50'],
              defaultPageSize: 10,
            }}
          />

          {/* Tag Management Modal */}
          <Modal
            title={`Manage Tags - ${selectedEvent?.name}`}
            open={tagModalVisible}
            onCancel={() => {
              setTagModalVisible(false);
              setSelectedEvent(null);
              setNewTag('');
            }}
            footer={null}
          >
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Input
                  placeholder="Enter new tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onPressEnter={handleAddTag}
                />
                <Button type="primary" onClick={handleAddTag}>
                  Add Tag
                </Button>
              </Space>
            </div>

            <div style={{ marginTop: 16 }}>
              <h4>Current Tags:</h4>
              <Space wrap>
                {selectedEvent?.tags?.map((tag) => (
                  <Tag
                    key={tag}
                    closable
                    onClose={() => handleRemoveTag(tag)}
                  >
                    {tag}
                  </Tag>
                ))}
              </Space>
            </div>
          </Modal>

          <StyledModal
            title={editingEvent ? 'Edit Event' : 'Add Event'}
            open={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
            width="90%"
            style={{ maxWidth: '600px' }}
          >
            <StyledForm
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter event name' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please enter event description' }]}
              >
                <Input.TextArea />
              </Form.Item>

              <Form.Item
                name="eventDate"
                label="Date"
                rules={[{ required: true, message: 'Please select event date' }]}
              >
                <Input type="datetime-local" />
              </Form.Item>

              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: 'Please enter event price' }]}
              >
                <Input type="number" min={0} step={0.01} />
              </Form.Item>

              <Form.Item
                name="venue"
                label="Venue"
                rules={[{ required: true, message: 'Please enter event venue' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select event category' }]}
              >
                <Select>
                <Option value="">Select a category</Option>
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
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    {editingEvent ? 'Update' : 'Create'}
                  </Button>
                  <Button onClick={() => setModalVisible(false)}>
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </StyledForm>
          </StyledModal>
        </ResponsiveContent>
      </Layout>
    </GlobalStyles>
  );
};

export default EventList; 