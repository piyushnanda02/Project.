import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("user") || "{}");

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempBio, setTempBio] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Load saved profile
  useEffect(() => {
    if (userId && token) {
      const savedData = JSON.parse(localStorage.getItem(`profile_${userId}`)) || {};
      setImage(savedData.image || "");
      setName(savedData.name || userData.name || "");
      setEmail(savedData.email || userData.email || "");
      setBio(savedData.bio || "");
    }
  }, [userId, token, userData]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        // Auto-save image
        const data = { image: reader.result, name, email, bio };
        localStorage.setItem(`profile_${userId}`, JSON.stringify(data));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setTempName(name);
    setTempBio(bio);
    setIsEditing(true);
  };

  const handleSave = () => {
    setName(tempName);
    setBio(tempBio);
    const data = { image, name: tempName, email, bio: tempBio };
    localStorage.setItem(`profile_${userId}`, JSON.stringify(data));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!token) {
    return null;
  }

  return (
    <div style={container}>
      {/* Navigation Bar */}
      <nav style={navbar}>
        <button onClick={handleBack} style={backButton}>
          ← Back to Dashboard
        </button>
        {!isEditing && (
          <button onClick={handleEdit} style={editButton}>
            Edit Profile
          </button>
        )}
      </nav>

      {/* Profile Content */}
      <div style={content}>
        <div style={profileCard}>
          {/* Avatar Section */}
          <div style={avatarSection}>
            <div style={avatarWrapper}>
              <img
                src={image || "https://ui-avatars.com/api/?background=2c3e50&color=fff&bold=true&size=120&name=" + (name || "User")}
                alt="Profile"
                style={avatar}
              />
              <label style={cameraIcon} htmlFor="profile-image">
                📷
              </label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImage}
                style={{ display: "none" }}
              />
            </div>
            <p style={uploadHint}>Click camera to change photo</p>
          </div>

          {/* Info Section */}
          <div style={infoSection}>
            {isEditing ? (
              // Edit Mode
              <>
                <div style={field}>
                  <label style={label}>Full Name</label>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    style={input}
                    autoFocus
                  />
                </div>

                <div style={field}>
                  <label style={label}>Email</label>
                  <input
                    type="email"
                    value={email}
                    style={{ ...input, background: "#f5f5f5" }}
                    disabled
                  />
                  <p style={note}>Email cannot be changed</p>
                </div>

                <div style={field}>
                  <label style={label}>Bio</label>
                  <textarea
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows="4"
                    style={textarea}
                  />
                </div>

                <div style={actionButtons}>
                  <button onClick={handleSave} style={saveButton}>
                    Save Changes
                  </button>
                  <button onClick={handleCancel} style={cancelButton}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              // View Mode
              <>
                <h1 style={displayName}>{name || "Set your name"}</h1>
                <p style={displayEmail}>{email}</p>
                <div style={bioBox}>
                  <p style={displayBio}>{bio || "No bio added yet. Click Edit to add one."}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div style={statsContainer}>
          <div style={statCard}>
            <div style={statNumber}>0</div>
            <div style={statLabel}>Transactions</div>
          </div>
          <div style={statCard}>
            <div style={statNumber}>0</div>
            <div style={statLabel}>Total Profit</div>
          </div>
          <div style={statCard}>
            <div style={statNumber}>0</div>
            <div style={statLabel}>Total Loss</div>
          </div>
          <div style={statCard}>
            <div style={statNumber}>0</div>
            <div style={statLabel}>Expenses</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Professional Styles
const container = {
  minHeight: "100vh",
  width: "100%",
  background: "#f8f9fa",
  position: "relative",
};

const navbar = {
  background: "#ffffff",
  padding: "16px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #e9ecef",
  position: "sticky",
  top: 0,
  zIndex: 10,
};

const backButton = {
  background: "transparent",
  border: "none",
  color: "#495057",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  padding: "8px 12px",
  borderRadius: "6px",
  transition: "all 0.2s",
};

const editButton = {
  background: "#2c3e50",
  color: "#fff",
  border: "none",
  padding: "8px 20px",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "all 0.2s",
};

const content = {
  maxWidth: "900px",
  margin: "0 auto",
  padding: "40px 24px",
};

const profileCard = {
  background: "#ffffff",
  borderRadius: "16px",
  padding: "40px",
  marginBottom: "32px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  border: "1px solid #e9ecef",
  display: "flex",
  gap: "48px",
  flexWrap: "wrap",
  justifyContent: "center",
};

const avatarSection = {
  textAlign: "center",
  flexShrink: 0,
};

const avatarWrapper = {
  position: "relative",
  display: "inline-block",
};

const avatar = {
  width: "140px",
  height: "140px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "4px solid #fff",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const cameraIcon = {
  position: "absolute",
  bottom: "8px",
  right: "8px",
  background: "#2c3e50",
  color: "#fff",
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: "16px",
  transition: "all 0.2s",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const uploadHint = {
  fontSize: "12px",
  color: "#6c757d",
  marginTop: "8px",
};

const infoSection = {
  flex: 1,
  minWidth: "280px",
};

const field = {
  marginBottom: "20px",
};

const label = {
  display: "block",
  fontSize: "13px",
  fontWeight: "500",
  color: "#495057",
  marginBottom: "6px",
};

const input = {
  width: "100%",
  padding: "10px 14px",
  fontSize: "15px",
  border: "1px solid #dee2e6",
  borderRadius: "8px",
  background: "#fff",
  color: "#212529",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

const textarea = {
  width: "100%",
  padding: "10px 14px",
  fontSize: "15px",
  border: "1px solid #dee2e6",
  borderRadius: "8px",
  background: "#fff",
  color: "#212529",
  outline: "none",
  resize: "vertical",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const note = {
  fontSize: "11px",
  color: "#adb5bd",
  marginTop: "4px",
};

const actionButtons = {
  display: "flex",
  gap: "12px",
  marginTop: "24px",
};

const saveButton = {
  flex: 1,
  padding: "10px",
  background: "#2c3e50",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "all 0.2s",
};

const cancelButton = {
  flex: 1,
  padding: "10px",
  background: "#f8f9fa",
  color: "#6c757d",
  border: "1px solid #dee2e6",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "all 0.2s",
};

const displayName = {
  fontSize: "28px",
  fontWeight: "600",
  color: "#212529",
  margin: "0 0 8px 0",
};

const displayEmail = {
  fontSize: "15px",
  color: "#6c757d",
  margin: "0 0 20px 0",
};

const bioBox = {
  background: "#f8f9fa",
  borderRadius: "12px",
  padding: "20px",
  marginTop: "8px",
};

const displayBio = {
  fontSize: "15px",
  color: "#495057",
  lineHeight: "1.6",
  margin: 0,
};

const statsContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
};

const statCard = {
  background: "#ffffff",
  borderRadius: "12px",
  padding: "24px",
  textAlign: "center",
  border: "1px solid #e9ecef",
};

const statNumber = {
  fontSize: "32px",
  fontWeight: "600",
  color: "#2c3e50",
  marginBottom: "8px",
};

const statLabel = {
  fontSize: "13px",
  color: "#6c757d",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

export default Profile;