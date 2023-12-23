import React from 'react';
import './DynamicForm.css';

const DynamicForm = ({ className, fieldHeaders }) => {
  // Generate an array of input elements based on the fieldHeaders
  const renderTextFields = () => {
    const textFields = [];

    for (let i = 0; i < fieldHeaders.length; i++) {
      let fieldType = 'text';

      if (fieldHeaders[i] === 'Password') {
        fieldType = 'password';
      } else if (fieldHeaders[i] === 'Email') {
        fieldType = 'email';
      }

      textFields.push(
        <div className='textFieldDiv'>
          <label className='textFieldHeader'>{fieldHeaders[i]}</label>
          <input
            className='textField'
            type={fieldType}
            id={fieldHeaders[i]}
          />
        </div>
      );
    }

    return textFields;
  };

  return (
    <form>
      {renderTextFields()}
      <label className='statusMessage'>Status Message</label>
    </form>
  );
};

export default DynamicForm;