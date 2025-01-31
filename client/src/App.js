import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import SongItem from './components/SongItem';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Blog from './components/Blog';
import Home from './components/Home';
import styled from 'styled-components';

// Styled components for main content
const MainContent = styled.main`
  padding: 2rem;
  background-color: #1e1e1e; /* Set background to black/dark gray */
  color: white;
  min-height: 100vh;
`;

const AppContainer = styled.div`
  background-color: #1e1e1e; /* Dark background for entire app */
  color: white;
  min-height: 100vh;
`;

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  return (
    <Router>
      <AppContainer>
        <Navbar isAuthenticated={isAuthenticated} />
        <MainContent>
          <Routes>
            <Route path="/blog" element={<Blog />} /> {/* Blog component route */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<h1>User Profile</h1>} />
            <Route path="/logout" element={<h1>Logging out...</h1>} />
            <Route path="/" element={<Home />} /> {/* Home component route */}
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
};

export default App;
