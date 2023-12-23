// LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

export const HomePage = ({ className, ...props }) => {
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
        <span className='logout'> Logout</span>
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