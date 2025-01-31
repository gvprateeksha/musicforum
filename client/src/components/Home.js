import React from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import styled from 'styled-components';

const HomeContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(rgba(45, 27, 54, 0.7), rgba(26, 26, 26, 0.7)),
    url('https://wallpaperaccess.com/full/8711385.jpg') no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
`;

const Hero = styled.div`
  text-align: center;
`;

const Title = styled.h1`
  color: #ffd700;
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  background: #ffd700;
  color: #2d1b36;
  padding: 1rem 2rem;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background: #ffed4a;
  }
`;

const Home = () => {
  const navigate = useNavigate();

  // Handler to navigate to the login page
  const handleStartExploring = () => {
    navigate("/login");
  };

  return (
    <HomeContainer>
      <Hero>
        <Title>Welcome to MusicForum</Title>
        <Subtitle>Discover, Share, and Discuss Music from Around the World</Subtitle>
        <Button onClick={handleStartExploring}>Start Exploring</Button>
      </Hero>
    </HomeContainer>
  );
};

export default Home;
