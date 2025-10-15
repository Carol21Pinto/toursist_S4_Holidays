import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ForgotPassword.css';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function ForgotPassword() {
  const [formData, setFormData] = useState({
    username: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.username || !formData.newPassword || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
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
          username: formData.username,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - redirect to login with success message
        navigate('/admin/login', { 
          state: { message: 'Password updated successfully! Please login with your new password.' }
        });
      } else {
        setError(data.message || 'Failed to update password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      {/* Mountain Background */}
      <div className="mountain-bg">
        <div className="mountain-layer mountain-1"></div>
        <div className="mountain-layer mountain-2"></div>
        <div className="mountain-layer mountain-3"></div>
      </div>

      {/* Forgot Password Form */}
      <div className="forgot-password-card">
        <div className="form-header">
          <div className="travel-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
              <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h2>Reset Password</h2>
          <p>Enter your username and new password</p>
        </div>
        
        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="input-group">
            <input 
              type="text"
              name="username"
              placeholder="Username or Email" 
              value={formData.username} 
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="input-group">
            <input 
              type="password" 
              name="newPassword"
              placeholder="New Password" 
              value={formData.newPassword} 
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="input-group">
            <input 
              type="password" 
              name="confirmPassword"
              placeholder="Confirm New Password" 
              value={formData.confirmPassword} 
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="reset-btn" disabled={loading}>
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>

          <div className="back-to-login">
            <Link to="/admin/login" className="back-link">
              ← Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
