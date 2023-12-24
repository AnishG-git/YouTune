import React from "react";
import "./DynamicForm.css";

const DynamicForm = ({ className, fieldHeaders, buttonName, onSubmit, statusMessage, }) => {
  // Generate an array of input elements based on the fieldHeaders
  const renderTextFields = () => {
    const textFields = [];

    for (let i = 0; i < fieldHeaders.length; i++) {
      let fieldType = "text";

      if (fieldHeaders[i] === "Password") {
        fieldType = "password";
      } else if (fieldHeaders[i] === "Email") {
        fieldType = "email";
      }

      textFields.push(
        <div className="textFieldDiv">
          <label className="textFieldHeader">{fieldHeaders[i]}</label>
          <input className="textField" type={fieldType} id={fieldHeaders[i]} />
        </div>
      );
    }

    return textFields;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {};
    for (let i = 0; i < fieldHeaders.length; i++) {
      formData[fieldHeaders[i]] = document.getElementById(
        fieldHeaders[i]
      ).value;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {renderTextFields()}
      <label className="statusMessage">{statusMessage}</label>
      <div className="footer">
        <button className="submitButton" type="submit">
          {buttonName}
        </button>
      </div>
    </form>
  );
};

export default DynamicForm;
