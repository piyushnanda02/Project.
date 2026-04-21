import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";
import shopImage from "../assets/shop.jpg";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {

    if (!name || !email || !mobile || !fatherName || !dob || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        mobile,
        fatherName,
        dob,
        password
      });

      alert("Registered Successfully ✅");
      navigate("/login");

    } catch (error) {
      alert(error.response?.data || "Registration failed");
    }
  };

  return (
    <div className="auth-container">

      {/* Background Image */}
      <div
        className="background"
        style={{ backgroundImage: `url(${shopImage})` }}
      ></div>

      {/* Register Box */}
      <div className="auth-box">

        <h2>Smart Vendor Register</h2>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />

        <input
          type="text"
          placeholder="Father's Name"
          value={fatherName}
          onChange={(e) => setFatherName(e.target.value)}
        />

        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button onClick={handleRegister}>Register</button>

        <p>
          Already have an account?{" "}
          <Link to="/login" className="link">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;