// PlaylistModal.js
import {React, useState} from 'react';
import './PlaylistModal.css';

const PlaylistModal = ({ playlist, onClose, isActive }) => {
  const [modalClass, setModalClass] = useState(`playlist-modal ${isActive ? 'active' : 'closed'}`);

  const handleClose = () => {
    setModalClass(`playlist-modal ${isActive ? 'closed' : 'active'}`);
    onClose();
  }
  // const modalClass = `playlist-modal ${isActive ? 'active' : 'closed'}`;

  return (
    <div className={modalClass}>
      <h2>{playlist.name}</h2>
      {/* Add more modal content as needed */}
      <button className="onClose" onClick={handleClose}>Close</button>
    </div>
  );
};

export default PlaylistModal;
