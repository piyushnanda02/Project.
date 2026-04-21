import React from "react";
import { Outlet, Link } from "react-router-dom";

const DashboardLayout = () => {
  const user = localStorage.getItem("loggedInUser") || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div style={{ display: "flex" }}>

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>Vendor Panel</h2>

        <Link to="/dashboard">Dashboard</Link>
        <Link to="/dashboard/profit">Profit</Link>
        <Link to="/dashboard/loss">Loss</Link>
        <Link to="/dashboard/expense">Expense</Link>
        <Link to="/dashboard/analytics">Analytics</Link>
        <Link to="/dashboard/profile">Profile</Link>

        <button className="btn logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="main">
        <h1 style={{ color: "lightblue" }}>Welcome, {user}</h1>
        <Outlet />
      </div>

    </div>
  );
};

export default DashboardLayout;