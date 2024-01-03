  // SearchResultsTable.js
  import React, {useState} from 'react';
  import './PlaylistTable.css';
  const PlaylistTable = ({ cleanedPlaylists, onPlaylistClicked }) => {
    // const [playlistClicked, setPlaylistClicked] = useState(null);

    const handlePlaylistClicked = (cleanedPlaylist) => {
      // setPlaylistClicked(cleanedPlaylist.name);
      onPlaylistClicked(cleanedPlaylist);
    };

    return (
      <table className='playlist-table'>
        <thead>
          <tr className='playlist-header'>
            <th>Playlist</th>
            <th>Songs</th>
          </tr>
        </thead>
        <tbody>
          {cleanedPlaylists.map((cleanedPlaylist, index) => (
            <tr key={index} className="playlistTableRow" onClick={() => handlePlaylistClicked(cleanedPlaylist)}>
              <td>{cleanedPlaylist.name}</td>
              <td>{cleanedPlaylist.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  export default PlaylistTable;
