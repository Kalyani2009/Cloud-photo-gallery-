import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import "./index.css";

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadPhotos = async () => {
    const { data, error } = await supabase.storage
      .from("Photos")
      .list("", { sortBy: { column: "created_at", order: "desc" } });

    if (error) {
      console.error("Load error:", error.message);
      return;
    }

    const photoList = (data || [])
      .filter((file) => file.name)
      .map((file) => {
        const { data: urlData } = supabase.storage
          .from("Photos")
          .getPublicUrl(file.name);

        return {a
          name: file.name,
          url: urlData.publicUrl,
        };
      });

    setPhotos(photoList);
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const uploadPhoto = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setLoading(true);

    try {
      const filePath = `${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("Photos")
        .upload(filePath, file);

      if (error) {
        alert("Upload failed: " + error.message);
        console.error(error);
        return;
      }

      alert("Photo uploaded successfully!");
      await loadPhotos();
    } catch (error) {
      alert("Error: " + error.message);
      console.error(error);
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  return (
    <main>
      <h1>Cloud Photo Gallery</h1>
      <p>Upload and view your photos stored in Supabase.</p>

      <input
        type="file"
        accept="image/*"
        onChange={uploadPhoto}
        disabled={loading}
      />

      {loading && <p>Uploading photo...</p>}

      <div className="gallery">
        {photos.map((photo) => (
          <div key={photo.name} className="photo-card">
            <img src={photo.url} alt={photo.name} />
          </div>
        ))}
      </div>
    </main>
  );
}









