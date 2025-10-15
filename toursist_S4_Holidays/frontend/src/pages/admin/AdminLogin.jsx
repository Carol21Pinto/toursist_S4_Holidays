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
  
  // NEW: Multi-step forgot password states
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [forgotData, setForgotData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
    resetToken: ''
  });
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  
  const navigate = useNavigate();

  // OTP Timer countdown
  useEffect(() => {
    let interval = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(timer => timer - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Format timer display
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // LOGIN FUNCTION (unchanged)
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

  // NEW: STEP 1 - Request OTP
  async function handleRequestOTP(e) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!forgotData.email) {
      setError('Email is required');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/admin/forgot-password/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(`OTP sent successfully to ${forgotData.email}`);
        setForgotStep(2);
        setOtpTimer(600); // 10 minutes
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // NEW: STEP 2 - Verify OTP
  async function handleVerifyOTP(e) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!forgotData.otp) {
      setError('OTP is required');
      return;
    }

    if (forgotData.otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/admin/forgot-password/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: forgotData.email, 
          otp: forgotData.otp 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('OTP verified successfully!');
        setForgotData(prev => ({ ...prev, resetToken: data.resetToken }));
        setForgotStep(3);
        setOtpTimer(0);
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // NEW: STEP 3 - Reset Password
  async function handleResetPassword(e) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validation
    if (!forgotData.newPassword || !forgotData.confirmPassword) {
      setError('Both password fields are required');
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
      const response = await fetch(`${API_URL}/admin/forgot-password/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resetToken: forgotData.resetToken,
          newPassword: forgotData.newPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Password updated successfully! You can now login with your new password.');
        // Reset everything and go back to login
        setTimeout(() => {
          setShowForgotPassword(false);
          setForgotStep(1);
          setForgotData({ email: '', otp: '', newPassword: '', confirmPassword: '', resetToken: '' });
          setError('');
          setSuccessMessage('');
        }, 2000);
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
    setForgotStep(1);
    setForgotData({ email: '', otp: '', newPassword: '', confirmPassword: '', resetToken: '' });
    setOtpTimer(0);
  };

  // NEW: Handle OTP input (only numbers)
  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setForgotData(prev => ({ ...prev, otp: value }));
  };

  // NEW: Resend OTP
  const handleResendOTP = async () => {
    setOtpTimer(0);
    await handleRequestOTP({ preventDefault: () => {} });
  };

  return (
    <div className="login-container">
      {/* Keep your existing background elements */}
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

      {/* Enhanced Login Card */}
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
          <h2>
            {!showForgotPassword 
              ? 'Admin Portal' 
              : forgotStep === 1 
                ? 'Reset Password' 
                : forgotStep === 2 
                  ? 'Verify OTP' 
                  : 'New Password'
            }
          </h2>
          <p>
            {!showForgotPassword 
              ? 'Travel Dashboard Access' 
              : forgotStep === 1 
                ? 'Enter your email to receive OTP' 
                : forgotStep === 2 
                  ? `OTP sent to ${forgotData.email}` 
                  : 'Enter your new password'
            }
          </p>
        </div>

        {!showForgotPassword ? (
          // LOGIN FORM (unchanged)
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
          // NEW: MULTI-STEP FORGOT PASSWORD FORM
          <div className="forgot-password-form">
            {forgotStep === 1 && (
              // STEP 1: Email Input
              <form onSubmit={handleRequestOTP} className="login-form">
                <div className="input-group">
                  <input 
                    type="email"
                    name="email"
                    placeholder="Enter your email address" 
                    value={forgotData.email} 
                    onChange={handleForgotDataChange}
                    className="form-input"
                    required
                  />
                </div>
                
                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                
                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>

                <div className="forgot-password-link">
                  <button 
                    type="button" 
                    onClick={toggleForgotPassword} 
                    className="forgot-link"
                  >
                    ← Back to Login
                  </button>
                </div>
              </form>
            )}

            {forgotStep === 2 && (
              // STEP 2: OTP Verification
              <form onSubmit={handleVerifyOTP} className="login-form">
                <div className="input-group">
                  <input 
                    type="text"
                    name="otp"
                    placeholder="Enter 6-digit OTP" 
                    value={forgotData.otp} 
                    onChange={handleOTPChange}
                    className="form-input otp-input"
                    maxLength="6"
                    required
                  />
                </div>

                {otpTimer > 0 && (
                  <div className="otp-timer">
                    ⏰ OTP expires in: <strong>{formatTimer(otpTimer)}</strong>
                  </div>
                )}

                {otpTimer === 0 && (
                  <div className="resend-otp">
                    <button 
                      type="button" 
                      onClick={handleResendOTP} 
                      className="forgot-link"
                    >
                      Resend OTP
                    </button>
                  </div>
                )}
                
                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                
                <button type="submit" className="login-btn" disabled={loading || forgotData.otp.length !== 6}>
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>

                <div className="forgot-password-link">
                  <button 
                    type="button" 
                    onClick={() => setForgotStep(1)} 
                    className="forgot-link"
                  >
                    ← Back to Email
                  </button>
                </div>
              </form>
            )}

            {forgotStep === 3 && (
              // STEP 3: New Password
              <form onSubmit={handleResetPassword} className="login-form">
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
                
                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                
                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? 'Updating Password...' : 'Update Password'}
                </button>
              </form>
            )}
          </div>
        )}

        <div className="login-footer">
          <small>Secure admin access for travel management</small>
        </div>
      </div>
    </div>
  );
}
