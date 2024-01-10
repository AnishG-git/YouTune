// PlaylistModal.js
import {React, useState} from 'react';
import './PlaylistModal.css';

const PlaylistModal = ({ playlist, onClose, isActive, onPlaylistSongSelect, refreshing, refreshingAll }) => {
  const [modalClass, setModalClass] = useState(`playlist-modal ${isActive ? 'active' : 'closed'}`);
  const [rowClicked, setRowClicked] = useState(null);

  const handleRowClicked = (songInfo) => {
    setRowClicked(songInfo.url);
    onPlaylistSongSelect(songInfo);
  };

  const handleClose = () => {
    setModalClass(`playlist-modal ${isActive ? 'closed' : 'active'}`);
    onClose();
  }

  return (
    <div className={modalClass}>
      <h2>{playlist.name}</h2>
      <table>
        <thead>
          <tr>
            <th>Song</th>
            <th>Artist</th>
            <th>Duration (s)</th>
            <th>Position</th>
            {/* <th>Loading</th> */}
          </tr>
        </thead>
        <tbody>
          {playlist.songs.map((songInfo) => (
            <tr key={songInfo.id} className={rowClicked===songInfo.url ? 'rowClicked':'tableRow'} onClick={() => handleRowClicked(songInfo)}>
              <td>{songInfo.title}</td>
              <td>{songInfo.artist}</td>
              <td>{songInfo.duration}</td>
              <td>{songInfo.position}</td>
              {/* <td>{(refreshing === songInfo.position) && <span className="loader"></span>}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
      {refreshingAll && <span className="loader"></span>}
      <button className="onClose" onClick={handleClose}>Close</button>
    </div>
  );
};

export default PlaylistModal;
