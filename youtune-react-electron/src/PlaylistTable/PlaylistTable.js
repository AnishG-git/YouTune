  // SearchResultsTable.js
  import React, {useState} from 'react';
  import './PlaylistTable.css';
  const PlaylistTable = ({ playlists, onPlaylistClicked }) => {

    return (
      <table className='playlist-table'>
        <thead>
          <tr className='playlist-header'>
            <th>Playlist</th>
            <th>Songs</th>
          </tr>
        </thead>
        <tbody>
          {playlists.map((playlist, index) => (
            <tr key={index} className="playlistTableRow" onClick={() => onPlaylistClicked(index)}>
              <td>{playlist.name}</td>
              <td>{playlist.songs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  export default PlaylistTable;
