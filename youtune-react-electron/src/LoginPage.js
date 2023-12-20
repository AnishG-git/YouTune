// LoginPage.js
import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
            setErrorMessage('Token: ', result['token']);
          } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('Login failed. Please try again.');
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
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
