// src/pages/admin/AdminLogin.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './AdminLogin.css';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  // Forgot password form states
  const [forgotData, setForgotData] = useState({
    username: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    const res = await fetch(`${API_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.token) {
      setError(data.message || "Login failed");
      return;
    }
    localStorage.setItem("adminToken", data.token);
    navigate("/admin", { replace: true });
  }

  async function handleForgotPasswordSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validation
    if (!forgotData.username || !forgotData.newPassword || !forgotData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (forgotData.newPassword !== forgotData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (forgotData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/admin/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: forgotData.username,
          newPassword: forgotData.newPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Password updated successfully! You can now login with your new password.');
        setShowForgotPassword(false);
        setForgotData({ username: '', newPassword: '', confirmPassword: '' });
      } else {
        setError(data.message || 'Failed to update password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleForgotDataChange = (e) => {
    setForgotData({
      ...forgotData,
      [e.target.name]: e.target.value
    });
  };

  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
    setError("");
    setSuccessMessage("");
    setForgotData({ username: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="login-container">
      {/* Mountain Background Elements */}
      {/* <div className="mountain-bg">
        <div className="mountain-layer mountain-1"></div>
        <div className="mountain-layer mountain-2"></div>
        <div className="mountain-layer mountain-3"></div>
      </div>
     */}
    <div className="birds-container">
      <div className="bird bird--one"></div>
      <div className="bird bird--two"></div>
      <div className="bird bird--three"></div>
      <div className="bird bird--four"></div>
      <div className="bird bird--five"></div>
    </div>
    
    <div className="clouds-container">
      <div className="cloud cloud--one"></div>
      <div className="cloud cloud--two"></div>
      <div className="cloud cloud--three"></div>
      <div className="cloud cloud--four"></div>
      <div className="cloud cloud--five"></div>
      <div className="cloud cloud--six"></div>
    </div>

      {/* Login Form */}
      <div className="login-card">
        <div className="form-header">
          <div className="travel-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
              <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 1V3" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 21V23" stroke="currentColor" strokeWidth="2"/>
              <path d="M4.22 4.22L5.64 5.64" stroke="currentColor" strokeWidth="2"/>
              <path d="M18.36 18.36L19.78 19.78" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h2>{showForgotPassword ? 'Reset Password' : 'Admin Portal'}</h2>
          <p>{showForgotPassword ? 'Enter your username and new password' : 'Travel Dashboard Access'}</p>
        </div>
        
        {!showForgotPassword ? (
          // LOGIN FORM
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <input 
                placeholder="Email Address" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                className="form-input"
                type="email"
                required
              />
            </div>
            
            <div className="input-group">
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>
            
            <div className="checkbox-wrapper">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Keep me signed in</label>
            </div>

            <div className="forgot-password-link">
              <button 
                type="button" 
                onClick={toggleForgotPassword} 
                className="forgot-link"
              >
                Forgot Password?
              </button>
            </div>
            
            {successMessage && <div className="success-message">{successMessage}</div>}
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" className="login-btn">
              Access Dashboard
            </button>
          </form>
        ) : (
          // FORGOT PASSWORD FORM
          <form onSubmit={handleForgotPasswordSubmit} className="login-form">
            <div className="input-group">
              <input 
                type="text"
                name="username"
                placeholder="Username or Email" 
                value={forgotData.username} 
                onChange={handleForgotDataChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="input-group">
              <input 
                type="password" 
                name="newPassword"
                placeholder="New Password" 
                value={forgotData.newPassword} 
                onChange={handleForgotDataChange}
                className="form-input"
                required
              />
            </div>

            <div className="input-group">
              <input 
                type="password" 
                name="confirmPassword"
                placeholder="Confirm New Password" 
                value={forgotData.confirmPassword} 
                onChange={handleForgotDataChange}
                className="form-input"
                required
              />
            </div>

            <div className="forgot-password-link">
              <button 
                type="button" 
                onClick={toggleForgotPassword} 
                className="forgot-link"
              >
                ← Back to Login
              </button>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        )}

        <div className="login-footer">
          <small>Secure admin access for travel management</small>
        </div>
      </div>
    </div>
  );
}
