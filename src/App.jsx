
import React, { useState, useEffect } from 'react';
import supabase from './supabase';

function App() {
const [selectedFile, setSelectedFile] = useState(null);
const [photos, setPhotos] = useState([]);
const [message, setMessage] = useState('');

const Photos = 'Photos';

// Fetch photos from Supabase Storage
const fetchPhotos = async () => {
const { data, error } = await supabase.storage
.from("Photos")
.list('', {
limit: 100,
sortBy: { column: 'created_at', order: 'desc' }
});

if (error) {
  setMessage('Could not load photos: ' + error.message);
  return;
}

const imageFiles = (data || []).filter(
  file =>
    file.name &&
    file.name !== '.emptyFolderPlaceholder' &&
    !file.name.startsWith('.')
);

const photoList = imageFiles.map(file => {
  const { data: urlData } = supabase.storage
    .from("Photos")
    .getPublicUrl(file.name);

  return {
    name: file.name,
    url: urlData.publicUrl
  };
});

setPhotos(photoList);

};

// Load photos when the website opens
useEffect(() => {
fetchPhotos();
}, []);

// Upload a photo
const uploadPhoto = async () => {
if (!selectedFile) {
setMessage('Please select a photo first.');
return;
}

setMessage('Uploading photo...');

const fileName = `${Date.now()}-${selectedFile.name}`;

const { error } = await supabase.storage
  .from("Photos")
  .upload(fileName, selectedFile, {
    contentType: selectedFile.type,
    upsert: false
  });

if (error) {
  setMessage('Upload failed: ' + error.message);
  return;
}

setMessage('Photo uploaded successfully!');
setSelectedFile(null);

await fetchPhotos();

};

return (
<div
style={{
padding: '20px',
fontFamily: 'Arial, sans-serif',
maxWidth: '1000px',
margin: '0 auto'
}}
>
<h1>☁️ Cloud Photo Gallery</h1>

  <p>Upload and view your photos stored in Supabase.</p>

  <input
    type="file"
    accept="image/*"
    onChange={event =>
      setSelectedFile(event.target.files?.[0] || null)
    }
  />

  <button
    onClick={uploadPhoto}
    style={{
      marginLeft: '10px',
      padding: '8px 14px',
      cursor: 'pointer'
    }}
  >
    Upload Photo
  </button>

  {message && <p>{message}</p>}

  <h2>My Photos</h2>

  {photos.length === 0 ? (
    <p>No photos uploaded yet.</p>
  ) : (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px'
      }}
    >
      {photos.map(photo => (
        <div key={photo.name}>
          <img
            src={photo.url}
            alt={photo.name}
            style={{
              width: '100%',
              height: '180px',
              objectFit: 'cover',
              borderRadius: '8px'
            }}
          />
        </div>
      ))}
    </div>
  )}
</div>

);
}

export default App;



        
  
