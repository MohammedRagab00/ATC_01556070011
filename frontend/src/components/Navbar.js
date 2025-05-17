import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { handleApiError } from '../utils/errorHandler';
import logo from "../assets/logo.png";
import axios from "axios";
import { HomeOutlined, LoginOutlined, UserAddOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';

const API_BASE_URL = "https://epic-gather-dua2cncsh4g5gxg8.uaenorth-01.azurewebsites.net/api/v1";

const Nav = styled.nav`
  background: linear-gradient(45deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.accent});
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  img {
    height: 40px;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.05);
    }
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const Button = styled.button`
  background: white;
  color: ${({ theme }) => theme.primary};
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const HomeButton = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1.2rem;
  border-radius: 25px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const LoginButton = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: white;
  color: ${({ theme }) => theme.primary};
  padding: 0.5rem 1.2rem;
  border-radius: 25px;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.accent};
    color: white;
    transform: translateY(-2px);
  }
`;

const SignUpButton = styled(Button)`
  background: white;
  color: ${({ theme }) => theme.primary};
  padding: 0.5rem 1.2rem;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.accent};
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ProfileLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1.2rem;
  border-radius: 25px;
  
  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid white;
  }

  span {
    background: white;
    color: ${({ theme }) => theme.primary};
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.2rem;
  }
`;

const MenuIcon = styled.div`
  display: none;
  cursor: pointer;
  font-size: 24px;
  color: white;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.primary};
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  @media (min-width: 769px) {
    display: none;
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;

  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (token) {
      try {
        const response = await axios.get(`${API_BASE_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userData = {
          ...response.data,
          isAdmin: response.data.isAdmin || isAdmin
        };
        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserData();

    // Listen for storage changes (for cross-tab updates)
    const handleStorageChange = () => {
      fetchUserData();
    };

    // Listen for custom auth state changes
    const handleAuthChange = () => {
      fetchUserData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChange', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('fullName');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">
          <img src={logo} alt="Epic Gather Logo" />
          EpicGather
        </Logo>
        <NavLinks>
          <HomeButton to="/">
            <HomeOutlined />
            Home
          </HomeButton>
          {isLoggedIn ? (
            <>
              {user?.isAdmin && (
                <NavLink to="/admin">Admin Dashboard</NavLink>
              )}
              <ProfileLink to="/profile">
                {user?.photoUrl ? (
                  <img src={user.photoUrl} alt="Profile" />
                ) : (
                  <span>{user?.firstName?.[0]}</span>
                )}
                Profile
              </ProfileLink>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <LoginButton to="/login">
                <LoginOutlined />
                Login
              </LoginButton>
              <SignUpButton onClick={() => navigate('/signup')}>
                <UserAddOutlined />
                Sign Up
              </SignUpButton>
            </>
          )}
          <ThemeToggle onClick={toggleTheme}>
            {!isDarkMode ? (
              <SunOutlined style={{ color: '#FFF6F2' }} />
            ) : (
              <MoonOutlined style={{ color: '#1a1a1a' }} />
            )}
          </ThemeToggle>
        </NavLinks>
        <MenuIcon onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</MenuIcon>
      </NavContainer>
      {isMenuOpen && (
        <MobileMenu>
          <HomeButton to="/" onClick={() => setIsMenuOpen(false)}>
            <HomeOutlined />
            Home
          </HomeButton>
          {isLoggedIn ? (
            <>
              {user?.isAdmin && (
                <NavLink to="/admin" onClick={() => setIsMenuOpen(false)}>
                  Admin Dashboard
                </NavLink>
              )}
              <ProfileLink to="/profile" onClick={() => setIsMenuOpen(false)}>
                {user?.photoUrl ? (
                  <img src={user.photoUrl} alt="Profile" />
                ) : (
                  <span>{user?.firstName?.[0]}</span>
                )}
                Profile
              </ProfileLink>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <LoginButton to="/login" onClick={() => setIsMenuOpen(false)}>
                <LoginOutlined />
                Login
              </LoginButton>
              <SignUpButton onClick={() => {
                setIsMenuOpen(false);
                navigate('/signup');
              }}>
                <UserAddOutlined />
                Sign Up
              </SignUpButton>
            </>
          )}
          <ThemeToggle onClick={toggleTheme}>
            {!isDarkMode ? (
              <SunOutlined style={{ color: '#FFF6F2' }} />
            ) : (
              <MoonOutlined style={{ color: '#1a1a1a' }} />
            )}
          </ThemeToggle>
        </MobileMenu>
      )}
    </Nav>
  );
};

export default Navbar;
