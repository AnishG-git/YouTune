import React, { useRef, useEffect } from "react";
import "./CustomAudioPlayer.css";

const CustomAudioPlayer = ({ audioUrl }) => {
  const audioRef = useRef(null);
  
  useEffect(() => {
    // Use optional chaining to check if the ref and current property exist
    const audioElement = audioRef.current;
    
    // Check if the audio element and its play method are available
    if (audioElement && audioElement.play && audioUrl) {
      audioElement.load();
      audioElement.play().catch(error => {
        console.error('Error auto-playing audio:', error);
      });
    }
  }, [audioUrl]);

  return (
    <div>
      <audio ref={audioRef} className="audioPlayer" src={audioUrl} controls>
        Your browser does not support the audio tag.
      </audio>
    </div>
  );
};

export default CustomAudioPlayer;
