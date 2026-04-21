import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/dashboard.css";

function Sidebar() {

  return (
    <div className="sidebar">

      <h2 className="logo">VendorAI</h2>

      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/dashboard/profit">Profit</NavLink>
      <NavLink to="/dashboard/loss">Loss</NavLink>
      <NavLink to="/dashboard/expense">Expense</NavLink>
      <NavLink to="/dashboard/weekly">Weekly</NavLink>
      <NavLink to="/dashboard/monthly">Monthly</NavLink>
      <NavLink to="/dashboard/inflation">Inflation Loss</NavLink>
      <NavLink to="/dashboard/analytics">Analytics</NavLink>

    </div>
  );
}

export default Sidebar;