// PlaylistModal.js
import {React, useState} from 'react';
import './PlaylistModal.css';
import { IoChevronForwardCircleOutline } from "react-icons/io5";


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
      <div className='modal-header'>
        <div className="onClose" onClick={handleClose} align="right"><IoChevronForwardCircleOutline /></div>
        <h2 className='playlist-title'>{playlist.name}</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>Song</th>
            <th>Artist</th>
            <th>Duration</th>
            <th>Position</th>
            {/* <th>Loading</th> */}
          </tr>
        </thead>
        <tbody>
          {playlist.songs.map((songInfo) => (
            <tr key={songInfo.id} className={rowClicked===songInfo.url ? 'rowClicked':'tableRow'} onClick={() => handleRowClicked(songInfo)}>
              <td>{songInfo.title}</td>
              <td>{songInfo.artist}</td>
              <td>{Math.floor((songInfo.duration)/60).toString() + ":" + (songInfo.duration % 60).toString().padStart(2, '0')}</td>
              <td>{songInfo.position}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {refreshingAll && <span className="loader"></span>}
      
    </div>
  );
};

export default PlaylistModal;
