import React, { useState, useEffect } from "react";
import "./slider.css";

const Home = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  // Load saved data
  useEffect(() => {
    setImage(localStorage.getItem("profileImage") || "");
    setName(localStorage.getItem("profileName") || "");
    setBio(localStorage.getItem("profileBio") || "");
  }, []);

  // Upload image
  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
      localStorage.setItem("profileImage", reader.result);
    };

    if (file) reader.readAsDataURL(file);
  };

  // Save data
  const handleSave = () => {
    localStorage.setItem("profileName", name);
    localStorage.setItem("profileBio", bio);
    alert("Profile Saved ✅");
  };

  return (
    <div>

      {/* 👤 Profile Button (Top Right) */}
      <button
        onClick={() => setShowProfile(!showProfile)}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          padding: "10px 20px",
          borderRadius: "25px",
          border: "none",
          background: "linear-gradient(45deg, #ff6b6b, #ff9f43)",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Profile
      </button>

      {/* 🧾 Profile Panel */}
      {showProfile && (
        <div
          style={{
            position: "fixed",
            top: "70px",
            right: "20px",
            width: "300px",
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            textAlign: "center",
          }}
        >
          <h3>My Profile</h3>

          {/* Image */}
          <img
            src={image || "https://via.placeholder.com/100"}
            alt="profile"
            style={{ width: "100px", borderRadius: "50%" }}
          />

          <br /><br />

          <input type="file" onChange={handleImage} />

          <br /><br />

          {/* Name */}
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: "8px", width: "90%" }}
          />

          <br /><br />

          {/* Bio */}
          <textarea
            placeholder="Write your bio..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            style={{ width: "90%", height: "80px" }}
          />

          <br /><br />

          <button onClick={handleSave}>Save</button>
        </div>
      )}

      {/* 🛒 Grocery Slider */}
      <div className="slider">
        <div className="slide-track">
          <img src="https://images.unsplash.com/photo-1542838132-92c53300491e" />
          <img src="https://images.unsplash.com/photo-1606787366850-de6330128bfc" />
          <img src="https://images.unsplash.com/photo-1516684669134-de6f7c473a2a" />
          <img src="https://images.unsplash.com/photo-1586201375761-83865001e31c" />

          {/* repeat */}
          <img src="https://images.unsplash.com/photo-1542838132-92c53300491e" />
          <img src="https://images.unsplash.com/photo-1606787366850-de6330128bfc" />
        </div>
      </div>

      {/* Main Content */}
      <h1 style={{ textAlign: "center", marginTop: "30px" }}>
        Welcome to Auction 🚀
      </h1>

    </div>
  );
};

export default Home;