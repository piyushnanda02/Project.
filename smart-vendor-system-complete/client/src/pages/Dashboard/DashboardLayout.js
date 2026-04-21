import React from "react";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const user = localStorage.getItem("loggedInUser") || "User";

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* LEFT SIDEBAR */}
      <div className="sidebar">
        {/* Your sidebar content here */}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column",
        background: "url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d') center/cover no-repeat",
        position: "relative",
        overflowY: "auto"
      }}>
        
        {/* This div takes all available space and centers the welcome card */}
        <div style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "0"
        }}>
          <div style={{
            textAlign: "center",
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(10px)",
            padding: "50px 80px",
            borderRadius: "20px",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            animation: "fadeIn 0.6s ease-out"
          }}>
            <h1 style={{
              color: "#38bdf8",
              fontSize: "48px",
              marginBottom: "15px",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)"
            }}>
              Welcome, {user}! 👋
            </h1>
            <p style={{
              color: "#e2e8f0",
              fontSize: "18px",
              margin: 0
            }}>
              Glad to have you here
            </p>
          </div>
        </div>

        {/* Vendor Panel Section - this will appear below the centered welcome */}
        <div style={{
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(5px)",
          padding: "20px",
          borderRadius: "10px",
          margin: "20px"
        }}>
          <h2 style={{
            textAlign: "center",
            color: "white",
            marginBottom: "20px"
          }}>Vendor Panel</h2>
          <Outlet />
        </div>
      </div>

    </div>
  );
};

export default DashboardLayout;

// Add this CSS animation to your global CSS file or add style tag
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);