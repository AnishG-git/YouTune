import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import Modal from '../Modal/Modal';
// Import necessary dependencies

export const LandingPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    // Necessary registration functions;
  
    const navigate = useNavigate();
    const handleLogin = async () => {
      // Simple validation
      if (!username || !password) {
        setErrorMessage('Please enter both username and password.');
      } else {
          try {
              const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  username: username,
                  password: password,
                }),
              });
        
              if (!response.ok) {
                throw new Error('Login failed');
              }
        
              // Assuming the server responds with a JSON object
              const result = await response.json();
        
              // Perform any further actions based on the result
              console.log('Login successful, Token: ', result['token']);
              setSuccessMessage("Logged in Successfully");
              setErrorMessage('');
              navigate('/homepage');
            } catch (error) {
              console.error('Error during login:', error);
              setErrorMessage('Login failed. Please try again.');
              setSuccessMessage(''); 
            }
      }
    };
  return (
    <div className='login-background'> 
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
         {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
        </div>
        <div className="buttons">
          <div className="button" onClick={handleLogin}>
            <div className="login">Login </div>
          </div>
          <div className="button" onClick={setModalOpen}>
            <div className="login">Register </div>
          </div>
          {modalOpen && <Modal setOpenModal={setModalOpen} />}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;