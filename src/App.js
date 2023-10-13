import React, { useEffect } from 'react';
import './App.css';
import LambdaCommunication from './LambdaCommunication';
import Dialoge from './Dialoge';

function App() {
  useEffect(() => {
    console.log('App component mounted.');
    // You can add more console logs or perform any other actions when the component mounts.
  }, []);

  return (
    <div className="App" style={{
      background: `url('https://amplify-amplifya785c969872c4-staging-111600-deployment.s3.amazonaws.com/green.png')`, // Replace with your image URL
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>

      <div
        className=""
        style={{
          marginTop: '-10vh',

          width: '70vw', // Make it full width
           padding: '20px',
          boxSizing: 'border-box',
          marginLeft:'-7vw',
        }}
      >
        {/* Include your React components within the HTML structure */}
        <LambdaCommunication />
        <br />
        <Dialoge />
      </div>
    </div>
  );
}

export default App;
