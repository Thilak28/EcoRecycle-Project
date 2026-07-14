import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

const Login = () => {
  const [portal, setPortal] = useState("user");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", { ...form, portal });
      login(data.token, data.user);

      if (data.user.role === "admin") navigate("/admin/dashboard");
      else if (data.user.role === "agency") navigate("/agency/dashboard");
      else navigate("/user/my-pickups");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <div className="auth-logo-center"><Logo size={44} /></div>

        <div className="portal-tabs">
          <button type="button" className={portal === "user" ? "tab active" : "tab"} onClick={() => setPortal("user")}>User</button>
          <button type="button" className={portal === "agency" ? "tab active" : "tab"} onClick={() => setPortal("agency")}>Agency</button>
          <button type="button" className={portal === "admin" ? "tab active" : "tab"} onClick={() => setPortal("admin")}>Admin</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <h2>{portal.charAt(0).toUpperCase() + portal.slice(1)} Login</h2>
          {error && <p className="error-text">{error}</p>}
          <input type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button type="submit" className="btn-primary">Login</button>
          {portal === "user" && <p>Don't have an account? <Link to="/register">Register</Link></p>}
        </form>
      </div>
    </div>
  );
};

export default Login;