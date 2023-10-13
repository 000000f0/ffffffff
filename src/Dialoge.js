import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AWS from 'aws-sdk';

function SpeechToTextComponent() {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [apiResponseText, setApiResponseText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  recognition.onstart = () => {
    setIsListening(true);
  };

  recognition.onresult = async (event) => {
    const result = event.results[0][0].transcript;

    console.log('Recognized Speech:', result);

    try {
      setIsListening(false);

      const response = await axios.post(
        '/api/chatgpt',
        {
          name: 'Eva',
          prompt: result,
          userId: 'user_2VgCI4SWPiAgpPIBgCwGBFIRo1P',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      const chatbotResponse = response.data;

      console.log('Chatbot Response:', chatbotResponse);

      // Extract the chatbot response text
      const responseText = chatbotResponse;

      AWS.config.update({
        accessKeyId: 'AKIAR22DSRP6A3INZCOZ',
        secretAccessKey: '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',
        region: 'eu-west-1',
      });

      const polly = new AWS.Polly();
      const pollyResponse = await polly.synthesizeSpeech({
        Text: responseText,
        OutputFormat: 'mp3',
        VoiceId: 'Joanna',
      }).promise();

      const blob = new Blob([pollyResponse.AudioStream], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);

      setApiResponseText(responseText);
      setAudioUrl(url);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    setIsListening(false);
  };

  useEffect(() => {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      setIsSupported(false);
    }

    return () => {
      if (isListening) {
        recognition.stop();
      }
    };
  }, [isListening]);

  
  return (
    <div className="speech-to-text-container" > {/* Apply CSS class */}
      <button style={{      }} className={`listen-button ${isListening ? 'listening' : ''}`} onClick={() => {
        if (isListening) {
          recognition.stop();
        } else {
          recognition.start();
        }
      }}>
        {isListening ? '⏹︎ Dialogue' : '⏺︎ Dialogue'}
      </button>

      {!isSupported && <p>Speech recognition is not supported in this browser.</p>}


      {audioUrl && (
        <div className="audio-container"> {/* Apply CSS class */}
<br />
          <audio key={audioUrl} controls autoPlay>
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}

export default SpeechToTextComponent;
