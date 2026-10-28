const uploadPhoto = async (event) => {
  const file = event.target.files[0];

  if (!file) return;

  const filePath = `${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("Photos")
    .upload(filePath, file);

  if (error) {
    alert("Upload failed: " + error.message);
    console.error(error);
    return;
  }

  alert("Photo uploaded successfully!");
  console.log(data);
};




















        
