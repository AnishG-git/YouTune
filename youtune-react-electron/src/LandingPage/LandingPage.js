import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./LandingPage.css";
import Modal from "../Modal/Modal";
// Import necessary dependencies

export const LandingPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const location = useLocation();
  const logoutStatus = location.state || null;
  const [modalOpen, setModalOpen] = useState(false);

  // Necessary registration functions;
  useEffect(() => {
    // Use useEffect to set the success message once after the component mounts
    if (logoutStatus) {
      setErrorMessage("");
      setSuccessMessage("Logged out successfully");
    }
  }, [logoutStatus]);

  const navigate = useNavigate();
  const handleLogin = async () => {
    setSuccessMessage("");
    if (!username || !password) {
      setErrorMessage("Please enter both username and password.");
    } else {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/login/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        });

        if (!response.ok) {
          throw new Error("Login failed");
        }
        const result = await response.json();
        const token = result["token"];
        const getUserData = await fetch(
          "http://127.0.0.1:8000/api/user-data/",
          {
            method: "GET",
            headers: {
              Authorization: "Token " + token,
            },
          }
        );
        if (!getUserData.ok) {
          throw new Error("failed to fetch user data");
        }
        const userData = await getUserData.json();
        console.log("Login successful");
        setErrorMessage("");
        // Cleaning playlist data to only include playlist names and # of songs in each playlist
        let cleanedPlaylists = [];
        for (let i = 0; i < userData.playlists.length; i++) {
          const nameAndLength = {
            "name": userData.playlists[i].name,
            "length": userData.playlists[i].songs.length,
            "index": i
          }
          cleanedPlaylists.push(nameAndLength);
        }
        console.log(cleanedPlaylists);
        navigate("/homepage", { state: { token: token, userData: userData, cleanedPlaylists: cleanedPlaylists } });
      } catch (error) {
        console.error("Error during login:", error);
        setErrorMessage("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="login-background">
      <div className="you-tune">
        <span className="you-tune-span">You</span>
        <span className="you-tune-span2">Tune</span>
      </div>
      <div className="login-form-wrapper">
        <div className="login-form-title">
          <div className="screw-the-ads">
            <span className="screw-the-ads-span">Screw the </span>
            <span className="screw-the-ads-span2">ads</span>
          </div>
        </div>
        <div className="login-form">
          <div className="username">
            <div className="username2">Username </div>
            <div className="username-input">
              <input
                type="text"
                id="loginUsername"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div className="password">
            <div className="password2">Password </div>
            <div className="password-input">
              <input
                type="password"
                id="loginPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="error-message">
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && (
              <p className="success-message">{successMessage}</p>
            )}
          </div>
        </div>
        <div className="buttons">
          <div className="button" onClick={handleLogin}>
            <div className="login">Login</div>
          </div>
          <div
            className="button"
            onClick={() => {
              setModalOpen(true);
              setSuccessMessage("");
            }}
          >
            <div className="login">Register</div>
          </div>
          {modalOpen && <Modal setOpenModal={setModalOpen} />}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
