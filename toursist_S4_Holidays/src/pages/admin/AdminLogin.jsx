// src/pages/admin/AdminLogin.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './AdminLogin.css';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pandaState, setPandaState] = useState('normal'); // 'normal', 'watching', 'hiding'
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
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

  // Panda animation handlers
  const handleEmailFocus = () => {
    setPandaState('watching');
  };

  const handlePasswordFocus = () => {
    setPandaState('hiding');
  };

  const handleInputBlur = () => {
    setPandaState('normal');
  };

  // Click outside to reset panda
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.login-form')) {
        setPandaState('normal');
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="login-container">
      {/* Realistic Panda */}
      <div className={`panda ${pandaState}`}>
        <div className="panda-head">
          <div className="ear left"></div>
          <div className="ear right"></div>
          <div className="face">
            <div className="eye-patch left"></div>
            <div className="eye-patch right"></div>
            <div className="eye left">
              <div className="eyeball"></div>
              <div className="pupil"></div>
            </div>
            <div className="eye right">
              <div className="eyeball"></div>
              <div className="pupil"></div>
            </div>
            <div className="nose"></div>
            <div className="mouth"></div>
          </div>
          <div className="hand left"></div>
          <div className="hand right"></div>
        </div>
        
        {/* Half body */}
        <div className="panda-body">
          <div className="torso"></div>
        </div>
      </div>

      {/* Login Form with your original layout */}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-header">
          <div className="logo-circle"></div>
          <h2>Admin Login</h2>
        </div>
        
        <input 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)}
          onFocus={handleEmailFocus}
          onBlur={handleInputBlur}
          className="form-input"
          type="email"
          required
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)}
          onFocus={handlePasswordFocus}
          onBlur={handleInputBlur}
          className="form-input"
          required
        />
        
        <div className="checkbox-wrapper">
          <input type="checkbox" id="remember" />
          <label htmlFor="remember">Remember Me</label>
        </div>
        
        {error && <div className="error">{error}</div>}
        
        <button type="submit" className="login-btn">Login</button>
      </form>
    </div>
  );
}
