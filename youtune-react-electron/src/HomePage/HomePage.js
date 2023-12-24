// HomePage.js
import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { useNavigate, useLocation } from 'react-router-dom';

export const HomePage = ({ className, ...props }) => {
  const navigate = useNavigate();

  const location = useLocation();
  const { token } = location.state || {};

  const handleLogout = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/logout/', {
        method: 'GET',
        headers: {
          'Authorization': 'Token ' + token,
        },
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }
      const result = await response.json();
      console.log("Logged out successfully");
      // Perform any further actions based on the result
      navigate('/', { state: "Logged out successfully!" });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className={"dashboard " + className}>
      <div className="frame-9">
        <div className="you-tune">
          <span>
            <span className="you-tune-span">You</span>
            <span className="you-tune-span2">Tune</span>
          </span>{" "}
        </div>
      </div>
      <div className="logout-container"> </div>
        <p className='logout' onClick={handleLogout}> Logout</p>
      <div className="frame-18">
        <div className="frame-15">
          <div className="rectangle-2"></div>
          <div className="search">Search </div>
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