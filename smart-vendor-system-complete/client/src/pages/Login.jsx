import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: email,
          password: password
        }
      );

      // ✅ If login successful
      if (res.data.success && res.data.data) {
        const { token, email: returnedEmail } = res.data.data;

        // 🔐 Save token
        localStorage.setItem("token", token);

        // 🔥 VERY IMPORTANT (for profile system)
        // Using email as unique user ID
        localStorage.setItem("userId", returnedEmail);

        // 🚀 Redirect
        navigate("/dashboard");
      } else {
        alert("Login failed: invalid login response");
      }

    } catch (error) {
      console.log(error);
      alert("Login Failed");
    }

  };

  return (
    <div className="login-container">

      <div className="login-card">

        <h2>Smart Vendor Login</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>

          <p className="forgot">
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>

          <p className="register">
            Don't have an account? <Link to="/register">Register</Link>
          </p>

        </form>

      </div>

    </div>
  );
};

export default Login;