import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  LineChart, 
  User, 
  LogOut, 
  Menu, 
  X,
  ChevronDown
} from "lucide-react";
import "./dashboard.css";

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [greeting, setGreeting] = useState("Hello");
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // Determine dynamic greeting based on time of day
  useEffect(() => {
    const hr = new Date().getHours();
    if (hr < 12) setGreeting("Good Morning");
    else if (hr < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // Fetch saved profile image
  useEffect(() => {
    if (token && userId) {
      const data = JSON.parse(localStorage.getItem(`profile_${userId}`)) || {};
      setProfileImage(data.image || "");
    }
  }, [token, userId, location.pathname]); // re-run on page transitions in case avatar changes

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  if (!token) return null;

  // Retrieve user details from localStorage
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = userData.name || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} />, end: true },
    { to: "/dashboard/profit", label: "Profit Ledger", icon: <TrendingUp size={18} /> },
    { to: "/dashboard/loss", label: "Loss Ledger", icon: <TrendingDown size={18} /> },
    { to: "/dashboard/expense", label: "Expense Logs", icon: <DollarSign size={18} /> },
    { to: "/dashboard/analytics", label: "Analytics", icon: <LineChart size={18} /> },
    { to: "/dashboard/profile", label: "My Profile", icon: <User size={18} /> },
  ];

  return (
    <div className="db-layout">
      {/* 1. LEFT SIDEBAR (Desktop) */}
      <aside className={`db-sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          SmartVendor<span>.</span>
          <button className="btn-close-sidebar" onClick={() => setMobileOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="link-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-sidebar-logout" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Background Overlay for mobile drawer */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* 2. MAIN WORKSPACE */}
      <div className="db-main">
        {/* TOP NAVBAR HEADER */}
        <header className="db-header">
          <button className="btn-hamburger" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>

          <div className="header-greeting">
            <h3>{greeting}, <span>{userName}</span>! 👋</h3>
            <p>Here is your business overview for today.</p>
          </div>

          <div className="header-actions">
            <div className="profile-dropdown-wrapper">
              <button 
                className={`btn-header-profile ${dropdownOpen ? "active" : ""}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img
                  src={profileImage || `https://ui-avatars.com/api/?background=6366f1&color=fff&bold=true&size=40&name=${userName.charAt(0)}`}
                  alt="Profile"
                  className="header-avatar"
                />
                <span className="header-username">{userName}</span>
                <ChevronDown size={14} className="dropdown-arrow" />
              </button>

              {dropdownOpen && (
                <>
                  <div className="dropdown-overlay" onClick={() => setDropdownOpen(false)} />
                  <div className="profile-dropdown-menu">
                    <button onClick={() => { navigate("/dashboard/profile"); setDropdownOpen(false); }}>
                      <User size={14} /> My Profile
                    </button>
                    <hr className="dropdown-divider" />
                    <button onClick={handleLogout} className="logout-item">
                      <LogOut size={14} /> Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="db-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;