import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background: linear-gradient(to right, #2d1b36, #1a1a1a);
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  color: #ffd700;
  font-size: 1.8rem;
  font-weight: bold;
  text-decoration: none;
  &:hover {
    color: #fff;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 1.1rem;
  &:hover {
    color: #ffd700;
  }
`;

const Navbar = ({ isAuthenticated }) => {
  return (
    <Nav>
      <NavContainer>
        <Logo to="/">MusicForum</Logo>
        <NavLinks>
          <NavLink to="/blog">Blog</NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/profile">Profile</NavLink>
              <NavLink to="/logout">Logout</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
