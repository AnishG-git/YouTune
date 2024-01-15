// HomePage.js
import React, { useState, useEffect } from "react";
import "./HomePage.css";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaTimesCircle, FaPlay } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import SearchResultsTable from "../SearchTable/SearchTable";
import CustomAudioPlayer from "../CustomAudioPlayer/CustomAudioPlayer";
import PlaylistTable from "../PlaylistTable/PlaylistTable";
import PlaylistModal from "../PlaylistModal/PlaylistModal";

export const HomePage = ({ className, ...props }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, userData, cleanedPlaylists } = location.state || {};
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  // loading for search results in SearchTable
  const [loading, setLoading] = useState(false);

  // searchTableAudioUrl is only for selected songs from SearchTable
  const [searchTableAudioUrl, setSearchTableAudioUrl] = useState(null);

  // current song playing if it is in playlist
  const [playlistSong, setPlaylistSong] = useState(null);

  // boolean to show playlist modal
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  // boolean showing whether song clicked is in a playlist or not
  const [playingPlaylist, setPlayingPlaylist] = useState(false);

  // boolean showing whether playlist is currently refreshing or not
  const [refreshingAll, setRefreshingAll] = useState(false);

  // index showing which individual playlist song is refreshing
  const [refreshing, setRefreshing] = useState(-1);

  // useState version of userData for lazy loading
  const [updatedUserData, setUpdatedUserData] = useState(userData);

  const [playlistClickedIndex, setPlaylistClickedIndex] = useState(null);
  // index of playlist that was clicked
//  let playlistClickedIndex = null;

  const clearSearch = () => {
    setSearchTerm("");
  };

  const searchTableSongSelection = (searchTableSongUrl) => {
    setPlayingPlaylist(false);
    setSearchTableAudioUrl(searchTableSongUrl);
  };

  const playlistSongSelection = (songInfo) => {
    setPlayingPlaylist(true);
    setPlaylistSong({ ...songInfo });
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // handleSearch function start ////////////////////////////////////////
  const handleSearch = async () => {
    if (searchTerm === "") {
      console.log("empty query");
      return;
    }

    if (searchTerm.split("").every((char) => char === " ")) {
      return;
    }
    setSearchResults([]);
    try {
      // Progressively holds song information as audio conversion api is called
      let finalResults = [];
      // Loading will be true until all api calls are done
      setLoading(true);
      // This API calls the youtube data api and gets the title, channel, and duration
      const incompleteSongInfo = await fetch(
        "http://127.0.0.1:8000/api/youtube-search/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: searchTerm,
          }),
        }
      );
      if (!incompleteSongInfo.ok) {
        throw new Error("Search failed");
      }
      const incompleteResults = await incompleteSongInfo.json();
      for (let i = 0; i < incompleteResults.length; i++) {
        if (incompleteResults[i] !== "undefined") {
          const curr_result = incompleteResults[i];
          const get_audio_url = await fetch(
            "http://127.0.0.1:8000/api/convert-2-audio/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                url: curr_result["url"],
              }),
            }
          );
          if (!get_audio_url.ok) {
            throw new Error(
              "audio url conversion failed for " + curr_result["url"]
            );
          }
          const audio = await get_audio_url.json();
          curr_result.audio_url = audio.audio_url;
          curr_result.id = i;
          if (audio.audio_url !== null) {
            finalResults.push(curr_result);
          }
          setSearchResults([...finalResults]);
        }
      }
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setLoading(false);
    }
  };
  // handleSearch function end ////////////////////////////////////////

  // logout function start ////////////////////////////////////////
  const handleLogout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/logout/", {
        method: "GET",
        headers: {
          Authorization: "Token " + token,
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }
      const result = await response.json();
      console.log("Logged out successfully");
      // Perform any further actions based on the result
      navigate("/", { state: "Logged out successfully!" });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  // logout function end ////////////////////////////////////////

  const handlePlaylistClicked = (cleanedPlaylist) => {
    setPlaylistClickedIndex(cleanedPlaylist.index);
  };

  useEffect(() => {
    if (playlistClickedIndex !== null) {
      setShowPlaylistModal(true);
    }
  }, [playlistClickedIndex]);

  const handleClosePlaylistModal = () => {
    setPlaylistClickedIndex(null);
    setShowPlaylistModal(false);
  };

  

  // handleRefresh function start ////////////////////////////////////////
  const handleRefresh = async () => {
    setRefreshingAll(true);
    const playlist = updatedUserData.playlists[playlistClickedIndex];
    for (let i = 1; i <= playlist.songs.length; i++) { 
      const refresh_song = await fetch(
        "http://127.0.0.1:8000/api/refresh-song/",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + token,
          },
          body: JSON.stringify({
            name: playlist.name,
            position: i,
          }),
        }
      );
      if (!refresh_song.ok) {
        throw new Error(
          "unable to refresh song in " + playlist.name + " at position " + i
        );
      }
      const { audio_url } = await refresh_song.json();
      const playlistSongs = userData.playlists[playlistClickedIndex].songs;
      playlistSongs[i - 1].audio_url = audio_url;
      if (playlistSongs[playlistSong.position] === i) {
        setPlaylistSong({ ...playlistSongs[playlistSong.position] });
      }
      setUpdatedUserData({ ...userData });
    }
    setRefreshingAll(false);
  };
  // handleRefresh end ////////////////////////////////////////

  const playNextSong = () => {
    const playlist = updatedUserData.playlists[playlistClickedIndex];
    const nextSongIndex = playlistSong.position;
    if (playlist.songs[nextSongIndex]) {
      // set song to next song in playlist if it exists
      setPlaylistSong(playlist.songs[nextSongIndex]);
    } else {
      // otherwise loop back to the start of the playlist
      setPlaylistSong(playlist.songs[0]);
    }
  }

  return (
    <div className={"dashboard " + className}>
      <div className="frame-9">
        <div className="you-tune-homepage">
          <p className="you-tune-homespan">You</p>
          <p className="you-tune-homespan2">Tune</p>
        </div>
      </div>
      <div className="logout-container"> </div>
      <p className="logout" onClick={handleLogout}>
        Logout
      </p>
      <div className="frame-18">
        <div className="frame-15">
          <div className="rectangle-2">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search a song"
                value={searchTerm}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
              />
              {searchTerm && (
                <FaTimesCircle className="clear-icon" onClick={clearSearch} />
              )}
              <FaSearch className="search-icon" onClick={handleSearch} />
            </div>
          </div>
        </div>
      </div>
      <div className="frame-16">
        <div className="rectangle-22">
          <div className="playlists">
            <div className="playlistTitle">Playlists</div>
            <div className="add-playlist">
              <IoIosAdd />{" "}
            </div>
          </div>
          <PlaylistTable
            cleanedPlaylists={cleanedPlaylists}
            onPlaylistClicked={handlePlaylistClicked}
          />
          {showPlaylistModal && (
            <PlaylistModal
              playlist={updatedUserData.playlists[playlistClickedIndex]}
              onClose={() => setTimeout(handleClosePlaylistModal, 290)}
              isActive={showPlaylistModal}
              onPlaylistSongSelect={playlistSongSelection}
              refreshing={refreshing}
              refreshingAll = {refreshingAll}
            />
          )}
          
        </div>
      </div>
      <div className="frame-17">
        <div className="rectangle-1">
          <SearchResultsTable
            searchResults={searchResults}
            onSongSelect={searchTableSongSelection}
          />
          {loading && <span className="loader"></span>}
        </div>
      </div>
      <div className="player">
        <CustomAudioPlayer
          searchTableAudioUrl={searchTableAudioUrl}
          playlist={updatedUserData.playlists[playlistClickedIndex]}
          playingPlaylist={playingPlaylist}
          handleRefresh={handleRefresh}
          playlistSongPlaying={playlistSong}
          refreshing={refreshingAll}
          playNextSong={playNextSong}
        />
      </div>
    </div>
  );
};
export default HomePage;
