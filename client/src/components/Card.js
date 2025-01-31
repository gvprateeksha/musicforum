import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  width: 250px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  margin: 15px;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-10px);
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
`;

const CardImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 15px;
  text-align: center;
`;

const CardTitle = styled.h3`
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
`;

const CardGenre = styled.p`
  font-size: 0.9em;
  color: #666;
  margin-bottom: 10px;
`;

const CardBio = styled.p`
  font-size: 0.85em;
  color: #888;
  margin-bottom: 15px;
`;

const CardFooter = styled.div`
  text-align: center;
  margin-bottom: 15px;
`;

const CardButton = styled.button`
  padding: 10px 15px;
  font-size: 0.9em;
  color: #fff;
  background-color: #5c6bc0;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #3f51b5;
  }
`;

const Card = ({ song }) => {
  return (
    <CardContainer>
      <CardImage>
        <CardImg
          src={song.strArtistThumb || 'https://via.placeholder.com/150'}
          alt={song.strArtist}
        />
      </CardImage>
      <CardContent>
        <CardTitle>{song.strArtist}</CardTitle>
        <CardGenre>{song.strGenre || 'Unknown Genre'}</CardGenre>
        <CardBio>
          {song.strBiographyEN ? song.strBiographyEN.slice(0, 100) + '...' : 'No bio available.'}
        </CardBio>
      </CardContent>
      <CardFooter>
        <CardButton>Learn More</CardButton>
      </CardFooter>
    </CardContainer>
  );
};

export default Card;
