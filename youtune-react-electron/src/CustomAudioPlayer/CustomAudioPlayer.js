import React, { useRef, useEffect, useState } from "react";
import "./CustomAudioPlayer.css";

const CustomAudioPlayer = ({searchTableAudioUrl, playlistSongPlaying, playlist, playingPlaylist, handleRefresh, refreshingAll, playNextSong}) => {
  const audioRef = useRef(null);
  const [waitingForNextSong, setWaitingForNextSong] = useState(false);
  

  useEffect(() => {
    const audioElement = audioRef.current;
    // Check if the audio element and its play method are available

    if (audioElement && audioElement.play && (searchTableAudioUrl || playlistSongPlaying)) {
      if (playingPlaylist) {
        audioElement.load();
        audioElement.play().catch((error) => {
          console.error("Error playing audio:", error);
          if (!refreshingAll) {
            handleRefresh();
          }
        });
        audioElement.addEventListener("ended", playNextSong);
        setWaitingForNextSong(true);
      } else {
        audioElement.load();
        audioElement.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
        if (waitingForNextSong) {
          audioElement.removeEventListener("ended", playNextSong);
          setWaitingForNextSong(false);
        }
      }
    }
  }, [searchTableAudioUrl, playlistSongPlaying]);

  return (
    <div>
      <audio
        ref={audioRef}
        className="audioPlayer"
        src={
          playingPlaylist ? playlistSongPlaying.audio_url : searchTableAudioUrl
        }
        controls
      >
        Your browser does not support the audio tag.
      </audio>
    </div>
  );
};

export default CustomAudioPlayer;
