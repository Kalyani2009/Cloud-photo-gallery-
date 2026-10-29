import React, { useState, useEffect } from "react";
import { supabase } from "./supabase";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const Photos= "photos";

  // Load uploaded photos
  const fetchPhotos = async () => {
    const { data, error } = await supabase.storage
      .from("Photos")
      .list("", {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      setMessage("Unable to load photos: " + error.message);
      return;
    }

    const imageFiles = (data || []).filter(
      (item) => item.name && item.id
    );

    const photoList = imageFiles.map((item) => {
      const { data: urlData } = supabase.storage
        .from("Photos")
        .getPublicUrl(item.name);

      return {
        name: item.name,
        url: urlData.publicUrl,
      };
    });

    setPhotos(photoList);
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // Upload a photo
  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a photo first.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image file.");
      return;
    }

    setLoading(true);
    setMessage("");

    const filePath = `${Date.now()}-${file.name.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    )}`;

    const { error } = await supabase.storage
      .from("Photos")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    setLoading(false);

    if (error) {
      setMessage("Upload failed: " + error.message);
      return;
    }

    setMessage("Photo uploaded successfully!");

    setFile(null);

    const input = document.getElementById("photo-input");
    if (input) input.value = "";

    await fetchPhotos();
  };

  return (
    <div className="app">
      <h1>☁️ Cloud Photo Gallery</h1>

      <p>Upload and view your photos using Supabase Storage.</p>

      <div className="upload-box">
        <input
          id="photo-input"
          type="file"
          accept="image/*"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />

        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload Photo"}
        </button>
      </div>

      {message && <p>{message}</p>}

      <h2>My Photos</h2>

      {photos.length === 0 ? (
        <p>No photos uploaded yet.</p>
      ) : (
        <div className="photo-grid">
          {photos.map((photo) => (
            <div className="photo-card" key={photo.name}>
              <img src={photo.url} alt={photo.name} />
              <p>{photo.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;














      
