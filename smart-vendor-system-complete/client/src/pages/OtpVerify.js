import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const resetEmail = localStorage.getItem("resetEmail");
    if (!resetEmail) {
      navigate("/forgot-password");
    } else {
      setEmail(resetEmail);
    }
  }, [navigate]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      setError("Please enter complete 6-digit OTP");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { email, otp: otpString }
      );

      if (res.data.success) {
        setMessage("OTP verified successfully!");
        localStorage.setItem("otpVerified", "true");
        
        setTimeout(() => {
          navigate("/reset-password");
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      if (res.data.success) {
        setMessage("New OTP sent successfully!");
      }
    } catch (error) {
      setError("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Verify OTP</h2>
        <p style={styles.subtitle}>
          Enter the 6-digit code sent to<br />
          <strong>{email}</strong>
        </p>

        {message && <div style={styles.successMessage}>{message}</div>}
        {error && <div style={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                style={styles.otpInput}
                disabled={loading}
              />
            ))}
          </div>

          <button 
            type="submit" 
            style={loading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div style={styles.resendSection}>
          <button 
            onClick={handleResendOTP} 
            style={styles.resendButton}
            disabled={loading}
          >
            Resend OTP
          </button>
        </div>

        <div style={styles.links}>
          <Link to="/login" style={styles.link}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px"
  },
  card: {
    background: "white",
    borderRadius: "10px",
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
  },
  title: {
    margin: "0 0 10px 0",
    color: "#333",
    fontSize: "28px",
    fontWeight: "600",
    textAlign: "center"
  },
  subtitle: {
    color: "#666",
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "14px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  otpContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px"
  },
  otpInput: {
    width: "50px",
    height: "50px",
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "600",
    border: "1px solid #ddd",
    borderRadius: "6px",
    outline: "none",
    transition: "border-color 0.3s"
  },
  button: {
    padding: "12px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer"
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed"
  },
  successMessage: {
    padding: "12px",
    background: "#d4edda",
    color: "#155724",
    border: "1px solid #c3e6cb",
    borderRadius: "6px",
    marginBottom: "20px"
  },
  errorMessage: {
    padding: "12px",
    background: "#f8d7da",
    color: "#721c24",
    border: "1px solid #f5c6cb",
    borderRadius: "6px",
    marginBottom: "20px"
  },
  resendSection: {
    marginTop: "15px",
    textAlign: "center"
  },
  resendButton: {
    background: "none",
    border: "none",
    color: "#667eea",
    cursor: "pointer",
    fontSize: "14px",
    textDecoration: "underline"
  },
  links: {
    marginTop: "20px",
    textAlign: "center"
  },
  link: {
    color: "#667eea",
    textDecoration: "none",
    fontSize: "14px"
  }
};

export default VerifyOTP;