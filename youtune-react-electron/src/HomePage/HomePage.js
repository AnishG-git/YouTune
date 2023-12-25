// HomePage.js
import React, { useState } from "react";
import "./HomePage.css";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaTimesCircle } from "react-icons/fa";

export const HomePage = ({ className, ...props }) => {
  const navigate = useNavigate();

  const location = useLocation();
  const { token } = location.state || {};

  // Handles search form input
  const [searchTerm, setSearchTerm] = useState("");
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleKeyPress = event => {
    if (event.key === 'Enter') {
        // Handle search here, can be removed after testing
        console.log(`Searching for: ${searchTerm}`);
    }
  };
  const clearSearch = () => {
    setSearchTerm('');
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
              {searchTerm && <FaTimesCircle className="clear-icon" onClick={clearSearch} />}
              <FaSearch className="search-icon" />
            </div>
          </div>
        </div>
      </div>
      <div className="frame-16">
        <div className="rectangle-22"></div>
        <div className="playlists">Playlists </div>
      </div>
      <div className="frame-17">
        <div className="rectangle-1"></div>
      </div>
    </div>
  );
};
export default HomePage;
