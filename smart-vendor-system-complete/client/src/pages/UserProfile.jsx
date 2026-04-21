import React, { useState, useEffect } from "react";

const UserProfile = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    setImage(localStorage.getItem("img") || "");
    setName(localStorage.getItem("name") || "");
    setBio(localStorage.getItem("bio") || "");
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      localStorage.setItem("img", reader.result);
      setImage(reader.result);
    };

    if (file) reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem("name", name);
    localStorage.setItem("bio", bio);
    alert("Saved ✅");
  };

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h2>My Profile</h2>

      <img
        src={image || "https://via.placeholder.com/150"}
        style={{ width: "150px", borderRadius: "50%" }}
      />

      <br /><br />

      <input type="file" onChange={handleImage} />

      <br /><br />

      <input
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Write Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default UserProfile;