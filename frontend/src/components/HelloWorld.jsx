//import React from 'react';
//import './HelloWorld.css';

import { useEffect, useState } from 'react';

function HelloWorld() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Update the URL to match your Express backend address and port
    fetch('http://localhost:3000/helloworld')
      .then(response => response.text())
      .then(data => setMessage(data))
      .catch(error => console.error('There was an error!', error));
  }, []);

  return <div>{message}</div>;
}

export default HelloWorld;