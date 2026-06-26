import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "./utils/axiosInstance";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/api/auth/login", {
        email: email,
        password: password
      });

      if (res.data.success && res.data.data) {
        const { token, email: returnedEmail, name } = res.data.data;

        // Save token and user details to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("userId", returnedEmail);
        
        // Store full user object for avatar generation & displays
        localStorage.setItem("user", JSON.stringify({
          name: name,
          email: returnedEmail
        }));

        navigate("/dashboard");
      } else {
        setError("Invalid response format from server.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">SmartVendor</div>
          <p className="auth-subtitle font-medium">Welcome back! Sign in to manage your ledger</p>
        </div>

        {error && (
          <div className="auth-alert auth-alert-error mb-20">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">Email Address</label>
            <input
              id="email-input"
              type="email"
              placeholder="e.g. name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label className="form-label" htmlFor="password-input">Password</label>
              <Link to="/forgot-password" className="auth-link forgot-password-link">
                Forgot password?
              </Link>
            </div>
            <input
              id="password-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account yet?{" "}
          <Link to="/register" className="auth-link">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;