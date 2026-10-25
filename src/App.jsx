import { useState } from 'react';

export default function App() {
  const [photos, setPhotos] = useState([]);

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '900px',
      margin: '40px auto',
      padding: '20px'
    }}>
      <h1>📸 Cloud Photo Gallery</h1>
      <p>Upload and manage your photos in the cloud.</p>

      <input
        type="file"
        accept="image/*"
        onChange={(event) => {
          const files = Array.from(event.target.files || []);
          const previews = files.map((file) => ({
            name: file.name,
            url: URL.createObjectURL(file)
          }));
          setPhotos((previous) => [...previous, ...previews]);
        }}
        multiple
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginTop: '24px'
      }}>
        {photos.map((photo, index) => (
          <div key={`${photo.name}-${index}`}>
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
            <p>{photo.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
