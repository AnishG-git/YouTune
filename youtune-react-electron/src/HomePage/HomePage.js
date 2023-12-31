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
  const [loading, setLoading] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [playlistClicked, setPlaylistClicked] = useState(null);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleSongSelection = (selectedSong) => {
    setSelectedSong(selectedSong);
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

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
      console.log(incompleteResults);
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
          finalResults.push(curr_result);
          setSearchResults([...finalResults]);
        }
      }
    } catch (error) {
      console.error("Error during search:", error);
      // new lines
    } finally {
      setLoading(false);
    }
  };

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

  const handlePlaylistClicked = (cleanedPlaylist) => {
    setPlaylistClicked(cleanedPlaylist.name);
    setShowPlaylistModal(true);
  };

  const handleClosePlaylistModal = () => {
    setPlaylistClicked(null);
    setShowPlaylistModal(false);
  };

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
              playlist={playlistClicked}
              onClose={() => setTimeout(handleClosePlaylistModal, 290)}
              isActive={showPlaylistModal}
            />
          )}
        </div>
      </div>
      <div className="frame-17">
        <div className="rectangle-1">
          <SearchResultsTable
            searchResults={searchResults}
            onSongSelect={handleSongSelection}
          />
          {loading && <span className="loader"></span>}
        </div>
      </div>
      <div className="player">
        <CustomAudioPlayer audioUrl={selectedSong} />
      </div>
    </div>
  );
};
export default HomePage;
