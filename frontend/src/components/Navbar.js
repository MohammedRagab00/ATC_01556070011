import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const NavbarContainer = styled.nav`
  background: ${({ theme }) => theme.primary};
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
`;

const Logo = styled.img`
  height: 40px;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const Navbar = () => {
  return (
    <NavbarContainer>
      <Logo src="/assets/logo.png" alt="Epic Gather Logo" />
      <NavLinks>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
      </NavLinks>
    </NavbarContainer>
  );
};

export default Navbar;
