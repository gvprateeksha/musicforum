import React from 'react';

const SongItem = ({ song }) => {
  return (
    <li>
      <h2>{song.title}</h2>
      <p>{song.artist}</p> {/* Adjust according to your song object structure */}
    </li>
  );
};

export default SongItem;
