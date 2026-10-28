import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  async function loadPhotos() {
    const { data, error } = await supabase.storage
      .from('P1hotos')
      .list('', { limit: 100 });

    if (error) {
      setMessage(error.message);
      return;
    }

    const images = (data || [])
      .filter(file => file.name && !file.name.startsWith('.'))
      .map(file => {
        const { data } = supabase.storage
          .from('Photos')
          .getPublicUrl(file.name);

        return {
          name: file.name,
          url: data.publicUrl
        };
      });

    setPhotos(images);
  }

  async function uploadPhotos(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setUploading(true);
    setMessage('');

    for (const file of files) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `${Date.now()}-${safeName}`;

      const { error } = await supabase.storage
        .from('Photos')
        .upload(filePath, file);

      if (error) {
        setMessage(`Upload failed: ${error.message}`);
        setUploading(false);
        return;
      }
    }

    setMessage('Photos uploaded successfully!');
    event.target.value = '';
    await loadPhotos();
    setUploading(false);
  }

  useEffect(() => {
    loadPhotos();
  }, []);

  return (
    <main style={{
      maxWidth: 900,
      margin: '30px auto',
      padding: 20,
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>📸 Cloud Photo Gallery</h1>
      <p>Upload and view your photos stored in Supabase.</p>

      <input
        type="file"
        accept="image/*"
        multiple
        disabled={uploading}
        onChange={uploadPhotos}
      />

      {uploading && <p>Uploading photos...</p>}
      {message && <p>{message}</p>}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 16,
        marginTop: 24
      }}>
        {photos.map(photo => (
          <div key={photo.name}>
            <img
              src={photo.url}
              alt={photo.name}
              style={{
                width: '100%',
                height: 180,
                objectFit: 'cover',
                borderRadius: 8
              }}
            />
            <p>{photo.name}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
