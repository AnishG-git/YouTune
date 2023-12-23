// LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
    <div className="login-container">
      <h2>Login</h2>
      <form>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
};

export default HomePage;
