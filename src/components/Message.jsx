import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';

// Example usage in your component:
const Message = ({ message, variant }) => {
  const [show, setShow] = useState(true);

  return (
    <div>
      <Alert variant={variant} show={show} onClose={() => setShow(false)} dismissible>
        <Alert.Heading>Error!</Alert.Heading>
        <p>{message}</p>
      </Alert>
    </div>
  );
};

export default Message;