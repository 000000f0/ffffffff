import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AWS from 'aws-sdk';

function ChatComponent() {
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [polly, setPolly] = useState(null); // Polly instance
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [loadingAnimation, setLoadingAnimation] = useState('');

  useEffect(() => {
    // Configure AWS with your credentials and region
    AWS.config.update({
      accessKeyId: 'AKIAR22DSRP6A3INZCOZ',
      secretAccessKey: 'MnTUbMkLlEqSFcBEylwgcxvOP4chUm91It1/qrGx',
      region: 'eu-west-1',
    });

    // Create an instance of Polly
    setPolly(new AWS.Polly());
  }, []);

  useEffect(() => {
    if (isLoading) {
      // Display a loading animation while loading
      const interval = setInterval(() => {
        setLoadingAnimation((prevAnimation) =>
          prevAnimation.length === 3 ? '' : prevAnimation + '.'
        );
      }, 500);

      return () => {
        clearInterval(interval);
      };
    } else {
      // Reset loading animation when not loading
      setLoadingAnimation('');
    }
  }, [isLoading]);

  const stopAudio = () => {
    if (audio && isPlaying) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleClickBubble = async (text) => {
    if (polly) {
      try {
        // Stop any currently playing audio
        stopAudio();

        // Define the parameters for Polly
        const params = {
          Text: text, // Text to convert to speech
          OutputFormat: 'mp3', // Output format (e.g., mp3)
          VoiceId: 'Joanna', // Voice ID (e.g., Joanna)
        };

        // Use Polly to synthesize speech
        polly.synthesizeSpeech(params, (err, data) => {
          if (err) {
            console.error('Polly Error:', err);
            return;
          }

          // Create a URL for the audio data
          const audioUrl = URL.createObjectURL(
            new Blob([data.AudioStream], { type: 'audio/mpeg' })
          );

          // Create an audio element
          const newAudio = new Audio(audioUrl);

          newAudio.addEventListener('ended', () => {
            setIsPlaying(false);
          });

          setAudio(newAudio);
          setIsPlaying(false); // Set to false to prevent autoplay
        });
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handlePlayPause = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputMessage.trim() === '') {
      return; // Don't submit empty messages
    }

    // Set loading state to true when submitting
    setIsLoading(true);

    try {
      const response = await axios.post(
        '/api/chatgpt',
        {
          name: 'Eva',
          prompt: inputMessage,
          userId: 'user_2VgCI4SWPiAgpPIBgCwGBFIRo1P',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      // Stop any currently playing audio
      stopAudio();

      // Update the chat history with the user's input and bot's response
      setChatHistory([
        ...chatHistory,
        { user: 'User', text: inputMessage },
        { user: 'Eva', text: response.data },
      ]);

      // Clear the input field
      setInputMessage('');

      // Generate speech for the bot's response
      handleClickBubble(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      // Set loading state to false when the response is received
      setIsLoading(false);
    }
  };

  const handleVoiceRecognition = () => {
    const recognition = new window.webkitSpeechRecognition(); // Create a speech recognition instance
    recognition.lang = 'en-US'; // Set the recognition language

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setInputMessage(result); // Set the recognized speech as the input message
      recognition.stop(); // Stop the recognition
    };

    recognition.start(); // Start listening for speech
  };

  return (
    <div className="terminal">
      <div className="terminal-header">Eva</div>
      <div className="terminal-window">
        <div className="terminal-body" style={{ width: '100%', maxHeight: '300px', height: '300px', overflowY: 'auto' }}>
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`message ${message.user.toLowerCase()}`}
              onClick={() => {
                if (message.user === 'Eva') {
                  handleClickBubble(message.text);
                }
              }}
            >
              {message.user}: {message.text}
            </div>
          ))}
        </div>
      </div>
      <div className="terminal-input">
        <form onSubmit={handleSubmit}>
          <table>
            <tbody>
              <tr>
                <td>
                  <input
                    style={{ width: '30vw' }}
                    type="text"
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <button style={{borderRadius: '4px'}} onClick={handleVoiceRecognition}>Mic</button>
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          {isLoading && (






            <><table style={{marginTop:'-20px',paddingLeft:'5px'}}>
              <tbody>
                <tr>
                  <td>
                    

                  <div className="loading-animation">

<div style={{ backgroundColor: 'white', borderRadius: '50%', width: '20px', height: '20px' }}> {/* Add this line for the Pac-Man animation */}
  <div className="loading-pacman"></div>

  </div>
</div>
<div style={{padding: '8px'}}></div>


                  </td>
                  <td style={{paddingLeft:'10px'}}>
                    



                  <div  className="loading-dot"></div>




                  </td>

                </tr>
              </tbody>
            </table>
            
            
            
            
            
            
              </>
          )}
        </form>
      </div>
      <div className="audio-controls">
        {audio && (
          <button onClick={handlePlayPause}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        )}
      </div>
    </div>
  );
}

export default ChatComponent;