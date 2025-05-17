import { useState } from "react";
import { Layout, Table, Button, Input, Space, Tag, message, Card } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useSidebar } from "../../context/SidebarContext";
import { useTheme } from "styled-components";

const { Content } = Layout;
const API_BASE_URL = 'https://epic-gather-dua2cncsh4g5gxg8.uaenorth-01.azurewebsites.net/api/v1';

const StyledContent = styled(Content)`
  padding: 32px 24px;
  margin-left: ${({ $collapsed }) => ($collapsed ? "80px" : "250px")};
  transition: all 0.2s ease;
  min-height: 100vh;
  background: ${({ theme }) => theme.admin.background};
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

const SearchCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: ${({ theme }) => theme.admin.cardBackground};
  border: 1px solid ${({ theme }) => theme.primary}20;

  .ant-card-body {
    padding: 24px;
  }

  @media (max-width: 768px) {
    .ant-card-body {
      padding: 16px;
    }
  }

  @media (max-width: 480px) {
    margin-bottom: 16px;
    border-radius: 8px;
    
    .ant-card-body {
      padding: 12px;
    }
  }
`;

const SearchForm = styled.form`
  display: flex;
  gap: 16px;
  align-items: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const SearchInput = styled(Input)`
  flex: 1;
  
  @media (max-width: 768px) {
    width: 100%;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const SearchButton = styled(Button)`
  height: 40px;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    width: 100%;
  }

  @media (max-width: 480px) {
    height: 36px;
    font-size: 14px;
  }
`;

const StyledTable = styled(Table)`
  .ant-table {
    overflow-x: auto;
    background: ${({ theme }) => theme.admin.cardBackground};
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  }
`;

const ActionButton = styled(Button)`
  @media (max-width: 768px) {
    padding: 4px 8px;
    font-size: 12px;
  }

  @media (max-width: 480px) {
    padding: 2px 6px;
    font-size: 11px;
    height: 28px;
  }
`;

const UserManagement = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [emailPattern, setEmailPattern] = useState("");
  const { collapsed } = useSidebar();
  const theme = useTheme();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (emailPattern.length < 3) {
      message.warning("Search term must be at least 3 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("You must be logged in as admin to search users.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/admin/users/search?email=${encodeURIComponent(
          emailPattern
        )}&page=${currentPage}&size=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to search users");
      }

      const data = await response.json();
      setSearchResults(data.content || []);
      setTotalPages(data.totalPages || 0);
      setCurrentPage(data.page || 0);
      setSearchPerformed(true);
    } catch (error) {
      console.error("Error searching users:", error);
      message.error("An error occurred while searching for users");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAdminRole = async (userId, isCurrentlyAdmin) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("You must be logged in as admin to update user roles.");
        return;
      }

      const confirmed = window.confirm(
        `Are you sure you want to ${
          isCurrentlyAdmin ? "remove" : "grant"
        } admin privileges to this user?`
      );

      if (!confirmed) return;

      const response = await fetch(
        `${API_BASE_URL}/admin/users/${userId}/roles`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isAdmin: !isCurrentlyAdmin,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user role");
      }

      setSearchResults((prevResults) =>
        prevResults.map((user) =>
          user.id === userId ? { ...user, isAdmin: !isCurrentlyAdmin } : user
        )
      );

      message.success("User role updated successfully");
    } catch (error) {
      console.error("Error updating user role:", error);
      message.error("An error occurred while updating the user role");
    }
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <Space>
          <UserOutlined />
          {email}
        </Space>
      ),
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: "Status",
      dataIndex: "isAdmin",
      key: "isAdmin",
      render: (isAdmin) => (
        <Tag color={isAdmin ? "green" : "blue"}>
          {isAdmin ? "Admin" : "User"}
        </Tag>
      ),
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <ActionButton
          type={record.isAdmin ? "primary" : "default"}
          danger={record.isAdmin}
          onClick={() => toggleAdminRole(record.id, record.isAdmin)}
        >
          {record.isAdmin ? "Remove Admin" : "Make Admin"}
        </ActionButton>
      ),
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: theme.admin.background, position: 'relative' }}>
      <StyledContent $collapsed={collapsed}>
        <PageTitle>User Management</PageTitle>

        <SearchCard>
          <SearchForm onSubmit={handleSearch}>
            <SearchInput
              prefix={<SearchOutlined />}
              placeholder="Search users by email (min. 3 characters)"
              value={emailPattern}
              onChange={(e) => setEmailPattern(e.target.value)}
              allowClear
            />
            <SearchButton
              type="primary"
              htmlType="submit"
              loading={isLoading}
              icon={<SearchOutlined />}
            >
              Search
            </SearchButton>
          </SearchForm>
        </SearchCard>

        {searchPerformed && (
          <Card>
            <StyledTable
              columns={columns}
              dataSource={searchResults}
              rowKey="id"
              loading={isLoading}
              scroll={{ x: true }}
              size="small"
              pagination={{
                current: currentPage + 1,
                total: totalPages * 10,
                pageSize: 10,
                onChange: (page) => {
                  setCurrentPage(page - 1);
                  handleSearch({ preventDefault: () => {} });
                },
                showTotal: (total) => `Total ${total} items`,
                responsive: true,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50'],
                size: 'small',
              }}
              locale={{
                emptyText: "No users found. Try searching with a different email pattern."
              }}
            />
          </Card>
        )}
      </StyledContent>
    </Layout>
  );
};

export default UserManagement;
