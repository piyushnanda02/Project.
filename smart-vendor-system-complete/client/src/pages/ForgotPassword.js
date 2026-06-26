import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from './utils/axiosInstance';
import "./Auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetLink, setResetLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    setResetLink('');

    try {
      const response = await axiosInstance.post(
        '/api/auth/forgot-password',
        { email }
      );

      if (response.data.success) {
        setMessage('Reset link generated!');
        setResetLink(response.data.resetLink);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating reset link. Please check the email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">SmartVendor</div>
          <p className="auth-subtitle">Enter your email to receive a password reset link</p>
        </div>

        {message && (
          <div className="auth-alert auth-alert-success mb-20">
            <span>✅</span> {message}
          </div>
        )}

        {resetLink && (
          <div className="auth-alert auth-alert-info mb-20" style={{ display: 'block', textAlign: 'left' }}>
            <strong>Local Dev Testing Link:</strong>
            <div style={{ marginTop: '8px', wordBreak: 'break-all' }}>
              <a 
                href={resetLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="auth-link"
              >
                {resetLink}
              </a>
            </div>
            <div style={{ fontSize: '11px', marginTop: '6px', opacity: 0.8 }}>
              (Click the link above to proceed with setting a new password)
            </div>
          </div>
        )}

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

          <button
            type="submit"
            disabled={loading}
            className="auth-btn"
          >
            {loading ? 'Sending Request...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="auth-footer">
          <Link to="/login" className="auth-link">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;