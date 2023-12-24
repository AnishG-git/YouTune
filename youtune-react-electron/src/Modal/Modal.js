import React, { useState } from "react";
import "./Modal.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import DynamicForm from "../DynamicForm/DynamicForm";

function Modal({ setOpenModal }) {
  const [statusMessage, setStatusMessage] = useState("");
  const fieldHeader = ["Username", "Email", "Password"];
  const handleRegister = async (formData) => {
    const username = formData["Username"];
    const email = formData["Email"];
    const password = formData["Password"];
    if (!username || !password || !email) {
      setStatusMessage("Please enter username, email, and password.");
    } else {
      setStatusMessage("");
      try {
        console.log("entered try statement");
        const response = await fetch("http://127.0.0.1:8000/api/register/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            email: email,
            password: password,
          }),
        });

        if (!response.ok) {
          throw new Error("Registration failed");
        }
        setStatusMessage("Registered Successfully!");
        // setOpenModal(false);
        const result = await response.json();
        console.log(result);
        setStatusMessage(result["response"]);
      } catch (error) {
        console.error("Error during registration:", error);
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
        <DynamicForm
          fieldHeaders={fieldHeader}
          buttonName={"Register"}
          onSubmit={handleRegister}
          statusMessage={statusMessage}
        ></DynamicForm>
      </div>
    </div>
  );
}

export default Modal;
