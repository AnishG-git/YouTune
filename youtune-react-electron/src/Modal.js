import React, { useState } from "react";
import "./Modal.css";
import { IoIosCloseCircleOutline } from "react-icons/io";

function Modal({ setOpenModal }) {

    //Registration handling
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    // Necessary registration functions;
  
    //const navigate = useNavigate();
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
              //navigate('/homepage');
            } catch (error) {
              console.error('Error during login:', error);
              setErrorMessage('Login failed. Please try again.');
              setSuccessMessage(''); 
            }
      }
    };
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            <IoIosCloseCircleOutline />
          </button>
        </div>
        <div className="title">
          <h1>First time? Register now:</h1>
        </div>
        <div className="body">
          Username:
        </div>
        <div className="usernameInput">
        <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="footer">
          <button>Register</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;