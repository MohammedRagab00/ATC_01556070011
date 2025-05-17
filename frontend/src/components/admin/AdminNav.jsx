import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled, { useTheme, css } from 'styled-components';
import { useSidebar } from '../../context/SidebarContext';
import {
  DashboardOutlined,
  CalendarOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  MenuOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

const StyledSider = styled(Sider)`
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  background: ${({ theme }) => theme?.admin?.sidebar?.background || '#001529'};
  background: linear-gradient(180deg, 
    ${({ theme }) => theme?.admin?.sidebar?.background || '#001529'} 0%, 
    ${({ theme }) => theme?.admin?.sidebar?.background || '#001529'}dd 100%);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    transform: ${({ $forceVisible, $collapsed }) => 
      $forceVisible ? 'translateX(0)' : 
      $collapsed ? 'translateX(-100%)' : 'translateX(-100%)'};
  }
`;

const MobileOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;

  @media (max-width: 768px) {
    display: ${({ $visible }) => ($visible ? 'block' : 'none')};
  }
`;

const MobileToggleButton = styled.button`
  position: fixed;
  left: 0;
  top: 16px;
  z-index: 998;
  background: ${({ theme }) => theme?.primary || '#1890ff'};
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  display: none;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
  }

  svg {
    font-size: 20px;
  }
`;

const SiderHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  padding: 0;
  background: ${({ theme }) => theme?.admin?.sidebar?.header || 'rgba(0, 0, 0, 0.15)'};
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
`;

const Logo = styled.div`
  color: ${({ theme }) => theme?.admin?.sidebar?.text || '#ffffff'};
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.5px;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: ${({ $collapsed }) => ($collapsed ? 'none' : 'flex')};
  align-items: center;
  transition: all 0.3s ease;
  padding-left: 16px;
  
  &:before {
    content: '';
    display: ${({ $collapsed }) => ($collapsed ? 'none' : 'block')};
    width: 8px;
    height: 24px;
    background: ${({ theme }) => theme?.primary || '#1890ff'};
    border-radius: 4px;
    margin-right: 14px;
    transition: all 0.3s ease;
  }
`;

const CollapseButton = styled(Button)`
  background: ${({ $collapsed }) => ($collapsed ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.08)')};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $collapsed }) => ($collapsed ? '60px' : '40px')};
  height: ${({ $collapsed }) => ($collapsed ? '60px' : '40px')};
  border-radius: ${({ $collapsed }) => ($collapsed ? '12px' : '8px')};
  transition: all 0.3s ease;
  position: ${({ $collapsed }) => ($collapsed ? 'static' : 'absolute')};
  right: ${({ $collapsed }) => ($collapsed ? 'auto' : '16px')};
  
  .anticon {
    color: white;
    font-size: ${({ $collapsed }) => ($collapsed ? '28px' : '18px')};
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const MenuContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 0;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const IconContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const CustomMenu = styled.div`
  padding: 8px 0;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ $collapsed }) => ($collapsed ? '0' : '0 16px')};
  margin: 8px 12px;
  height: 50px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
  color: rgba(255, 255, 255, 0.7);
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  
  ${({ $active }) => $active && css`
    background: rgba(255, 90, 54, 0.2);
    color: white;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 3px;
      background: #FF5A36;
    }
  `}
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.9);
  }
  
  span.menu-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    min-width: ${({ $collapsed }) => ($collapsed ? '0' : '24px')};
  }
  
  span.menu-text {
    margin-left: 12px;
    font-weight: 500;
    display: ${({ $collapsed }) => ($collapsed ? 'none' : 'block')};
    white-space: nowrap;
  }
`;

const SidebarFooter = styled.div`
  padding: 16px 12px 24px;
  margin-top: auto;
`;

const LogoutButton = styled(Button)`
  width: ${({ $collapsed }) => ($collapsed ? '48px' : '100%')};
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  background: transparent;
  border: 1px solid rgba(255, 77, 79, 0.3);
  border-radius: 8px;
  padding: ${({ $collapsed }) => ($collapsed ? '0' : '0 16px')};
  margin: 0 auto;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 77, 79, 0.1);
    border-color: rgba(255, 77, 79, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 77, 79, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  .logout-icon {
    color: #ff4d4f !important;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .logout-text {
    color: #ff4d4f;
    font-size: 15px;
    font-weight: 500;
    margin-left: 12px;
    display: ${({ $collapsed }) => ($collapsed ? 'none' : 'inline-block')};
  }
`;

const AdminNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { collapsed, setCollapsed } = useSidebar();
  const [mobileNavVisible, setMobileNavVisible] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('fullName');
    window.dispatchEvent(new Event('authStateChange'));
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      text: 'Dashboard',
      path: '/admin'
    },
    {
      key: '/admin/events',
      icon: <CalendarOutlined />,
      text: 'Events',
      path: '/admin/events'
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      text: 'Users',
      path: '/admin/users'
    },
  ];
  
  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleMobileNav = () => {
    setMobileNavVisible(!mobileNavVisible);
  };

  const closeMobileNav = () => {
    setMobileNavVisible(false);
  };

  return (
    <>
      <MobileToggleButton onClick={toggleMobileNav}>
        <MenuOutlined />
      </MobileToggleButton>

      <MobileOverlay $visible={mobileNavVisible} onClick={closeMobileNav} />

      <StyledSider
        width={250}
        collapsed={collapsed}
        collapsedWidth={80}
        theme="dark"
        trigger={null}
        $forceVisible={mobileNavVisible}
        $collapsed={collapsed}
      >
        <SiderHeader $collapsed={collapsed}>
          <Logo $collapsed={collapsed}>{!collapsed && "EpicGather"}</Logo>
          <CollapseButton
            type="text"
            icon={collapsed ? 
              <MenuUnfoldOutlined style={{ fontSize: collapsed ? '32px' : '18px' }} /> : 
              <MenuFoldOutlined style={{ fontSize: '18px' }} />
            }
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
            $collapsed={collapsed}
          />
        </SiderHeader>
        
        <MenuContainer>
          <CustomMenu>
            {menuItems.map(item => (
              <MenuItem
                key={item.key}
                $active={location.pathname === item.key}
                $collapsed={collapsed}
                onClick={() => handleNavigation(item.path)}
              >
                <span className="menu-icon">
                  {item.icon}
                </span>
                <span className="menu-text">
                  {item.text}
                </span>
              </MenuItem>
            ))}
          </CustomMenu>
        </MenuContainer>
        
        <SidebarFooter>
          <LogoutButton
            type="text"
            onClick={handleLogout}
            $collapsed={collapsed}
          >
            <span className="logout-icon">
              <LogoutOutlined />
            </span>
            <span className="logout-text">
              Logout
            </span>
          </LogoutButton>
        </SidebarFooter>
      </StyledSider>
    </>
  );
};

export default AdminNav; 