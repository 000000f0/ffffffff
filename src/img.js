import React, { useState } from 'react';
import axios from 'axios';

function ImageCaptionApp() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Use response.data to set the caption state
      setCaption(response.data.caption);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {image && <img src={URL.createObjectURL(image)} alt="Uploaded" />}
      {caption && <p>{caption}</p>}
    </div>
  );
}

export default ImageCaptionApp;
