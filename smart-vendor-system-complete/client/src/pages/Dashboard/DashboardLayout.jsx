import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import "./dashboard.css";

const DashboardLayout = () => {
  return (
    <div className="dashboard-container">

      {/* Sidebar */}

      <div className="sidebar">

        <h2 className="logo">Vendor Panel</h2>

        <nav>

          <NavLink to="/dashboard" end className="nav-item">
            Dashboard
          </NavLink>

          <NavLink to="/dashboard/profit" className="nav-item">
            Profit
          </NavLink>

          <NavLink to="/dashboard/loss" className="nav-item">
            Loss
          </NavLink>

          <NavLink to="/dashboard/expense" className="nav-item">
            Expense
          </NavLink>

          <NavLink to="/dashboard/weekly" className="nav-item">
            Weekly Report
          </NavLink>

          <NavLink to="/dashboard/monthly" className="nav-item">
            Monthly Report
          </NavLink>

          <NavLink to="/dashboard/inflation" className="nav-item">
            Inflation Loss
          </NavLink>

          <NavLink to="/dashboard/analytics" className="nav-item">
            Analytics
          </NavLink>

        </nav>

      </div>


      {/* Main Content Area */}

      <div className="dashboard-main">

        {/* Live Market Background */}

        <div className="market-background"></div>

        {/* Page Content */}

        <div className="dashboard-content">
          <Outlet />
        </div>

      </div>

    </div>
  );
};

export default DashboardLayout;