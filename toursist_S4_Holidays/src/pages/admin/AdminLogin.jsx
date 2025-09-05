// src/pages/admin/AdminLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 360, margin: "80px auto" }}>
      <h2>Admin Login</h2>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:"100%",padding:12,margin:"8px 0"}} />
      <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:"100%",padding:12,margin:"8px 0"}} />
      {error && <div style={{color:"red"}}>{error}</div>}
      <button type="submit" style={{width:"100%",padding:12}}>Login</button>
    </form>
  );
}
