import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SideDrawer = () => {
  const [open, setOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is logged in
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const isLoggedIn = !!token && !!userId;

  // Load profile image
  useEffect(() => {
    if (isLoggedIn && userId) {
      const data = JSON.parse(localStorage.getItem(`profile_${userId}`)) || {};
      setProfileImage(data.image || "");
    }
  }, [isLoggedIn, userId]);

  // Pages where SideDrawer should NOT be shown
  const authPages = ["/", "/login", "/register", "/otp-verify", "/forgot-password", "/reset-password"];
  const isAuthPage = authPages.includes(location.pathname);
  const isProfilePage = location.pathname === "/dashboard/profile";

  // Don't render on auth pages
  if (isAuthPage || !isLoggedIn) {
    return null;
  }

  const handleNavigation = (path) => {
    navigate(path);
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    navigate("/login");
    setOpen(false);
  };

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = userData.name || "User";
  const userEmail = userData.email || "";

  return (
    <>
      {/* ☰ MENU BUTTON - TOP LEFT */}
      {!isProfilePage && (
        <button
          onClick={() => setOpen(!open)}
          style={menuButton}
          onMouseEnter={(e) => e.target.style.background = "#2a2a2a"}
          onMouseLeave={(e) => e.target.style.background = "#1a1a1a"}
        >
          ☰
        </button>
      )}

      {/* 🔥 PROFILE BUTTON - TOP RIGHT (COMPLETELY SEPARATE) */}
      {!isProfilePage && (
        <div 
          onClick={() => navigate("/dashboard/profile")} 
          style={profileButton}
        >
          <img
            src={profileImage || `https://ui-avatars.com/api/?background=2c3e50&color=fff&bold=true&size=44&name=${userName.charAt(0)}`}
            alt="Profile"
            style={profileAvatar}
          />
        </div>
      )}

      {/* SIDEBAR - LEFT SIDE (SLIDES FROM LEFT) */}
      <div
        style={{
          ...sidebar,
          left: open ? "0" : "-300px",
        }}
      >
        <div style={sidebarHeader}>
          <img
            src={profileImage || `https://ui-avatars.com/api/?background=2c3e50&color=fff&bold=true&size=80&name=${userName.charAt(0)}`}
            alt="User"
            style={sidebarAvatar}
          />
          <div style={sidebarName}>{userName}</div>
          <div style={sidebarEmail}>{userEmail}</div>
        </div>

        <ul style={navList}>
          <li style={navItem} onClick={() => handleNavigation("/dashboard")}>
            <span style={navIcon}>📊</span> Dashboard
          </li>
          <li style={navItem} onClick={() => handleNavigation("/dashboard/profit")}>
            <span style={navIcon}>📈</span> Profit
          </li>
          <li style={navItem} onClick={() => handleNavigation("/dashboard/loss")}>
            <span style={navIcon}>📉</span> Loss
          </li>
          <li style={navItem} onClick={() => handleNavigation("/dashboard/expense")}>
            <span style={navIcon}>💰</span> Expense
          </li>
          <li style={navItem} onClick={() => handleNavigation("/dashboard/analytics")}>
            <span style={navIcon}>📊</span> Analytics
          </li>
          <li style={navItem} onClick={() => handleNavigation("/dashboard/profile")}>
            <span style={navIcon}>👤</span> My Profile
          </li>
          <li style={{ ...navItem, borderTop: "1px solid #2a2a2a", marginTop: "20px", color: "#dc3545" }} onClick={handleLogout}>
            <span style={navIcon}>🚪</span> Logout
          </li>
        </ul>
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={overlay}
        />
      )}
    </>
  );
};

// ============ STYLES ============

// ☰ Menu Button - Top Left
const menuButton = {
  position: "fixed",
  top: "20px",
  left: "20px",
  zIndex: 1000,
  fontSize: "20px",
  background: "#1a1a1a",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "all 0.2s",
  fontWeight: "500",
};

// 🔥 Profile Button - Top Right (Separate)
const profileButton = {
  position: "fixed",
  top: "20px",
  right: "20px",
  zIndex: 1000,
  cursor: "pointer",
  width: "46px",
  height: "46px",
  borderRadius: "50%",
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  transition: "transform 0.2s",
};

const profileAvatar = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: "50%",
  border: "2px solid #fff",
};

// Sidebar Styles
const sidebar = {
  position: "fixed",
  top: 0,
  left: "-300px",
  width: "280px",
  height: "100%",
  background: "#111",
  color: "#fff",
  transition: "0.25s ease-out",
  zIndex: 999,
  boxShadow: "2px 0 20px rgba(0,0,0,0.3)",
};

const sidebarHeader = {
  padding: "30px 20px",
  textAlign: "center",
  borderBottom: "1px solid #2a2a2a",
  marginBottom: "20px",
};

const sidebarAvatar = {
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  objectFit: "cover",
  marginBottom: "12px",
  border: "2px solid #3a3a3a",
};

const sidebarName = {
  fontSize: "16px",
  fontWeight: "500",
  color: "#fff",
  marginBottom: "4px",
};

const sidebarEmail = {
  fontSize: "12px",
  color: "#888",
};

const navList = {
  listStyle: "none",
  padding: 0,
  margin: 0,
};

const navItem = {
  padding: "12px 24px",
  cursor: "pointer",
  transition: "background 0.2s",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  color: "#ccc",
};

const navIcon = {
  fontSize: "18px",
  width: "28px",
  display: "inline-block",
};

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  zIndex: 998,
};

export default SideDrawer;