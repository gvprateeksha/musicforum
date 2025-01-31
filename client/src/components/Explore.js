import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const SearchInput = styled.input`
  width: 80%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const SongList = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SongItem = styled.div`
  width: 80%;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://www.theaudiodb.com/api/v1/json/2/search.php?s=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch songs');
      }
      const data = await response.json();
      setSongs(data.track || []);
    } catch (error) {
      setError('Failed to fetch songs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <SearchInput
        type="text"
        placeholder="Search for songs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <SearchButton onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </SearchButton>

      {error && <p>{error}</p>}

      <SongList>
        {songs.length > 0 ? (
          songs.map((song) => (
            <SongItem key={song.idTrack}>
              <h3>{song.strTrack}</h3>
              <p>{song.strArtist}</p>
            </SongItem>
          ))
        ) : (
          <p>No songs found</p>
        )}
      </SongList>
    </Container>
  );
};

export default Explore;
