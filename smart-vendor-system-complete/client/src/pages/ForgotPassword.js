import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
            const response = await axios.post(
                'http://localhost:5000/api/auth/forgot-password',
                { email }
            );

            if (response.data.success) {
                setMessage('Reset link generated!');
                setResetLink(response.data.resetLink);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error sending reset link');
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        container: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        },
        card: {
            background: 'white',
            padding: '40px',
            borderRadius: '10px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        },
        title: {
            textAlign: 'center',
            color: '#333',
            marginBottom: '10px'
        },
        subtitle: {
            textAlign: 'center',
            color: '#666',
            marginBottom: '30px'
        },
        input: {
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '16px',
            marginBottom: '20px'
        },
        button: {
            width: '100%',
            padding: '12px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer'
        },
        buttonDisabled: {
            opacity: 0.6,
            cursor: 'not-allowed'
        },
        message: {
            padding: '12px',
            background: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
            borderRadius: '6px',
            marginBottom: '20px'
        },
        error: {
            padding: '12px',
            background: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '6px',
            marginBottom: '20px'
        },
        linkBox: {
            padding: '12px',
            background: '#e7f3ff',
            color: '#004085',
            border: '1px solid #b8daff',
            borderRadius: '6px',
            marginBottom: '20px',
            wordBreak: 'break-all'
        },
        link: {
            color: '#667eea',
            textDecoration: 'none'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Reset Password</h2>
                <p style={styles.subtitle}>Enter your email to receive reset link</p>

                {message && (
                    <div style={styles.message}>
                        {message}
                    </div>
                )}

                {resetLink && (
                    <div style={styles.linkBox}>
                        <strong>Copy this link:</strong><br />
                        <a 
                            href={resetLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={styles.link}
                        >
                            {resetLink}
                        </a>
                        <br />
                        <small>Open this link in new tab to reset password</small>
                    </div>
                )}

                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={loading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Link to="/login" style={styles.link}>
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;