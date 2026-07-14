import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";
import NotificationBell from "./NotificationBell";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="app-header">
      <Link to="/" style={{ textDecoration: "none" }}>
        <Logo size={36} />
      </Link>

      {user && (
        <nav className="app-nav">
          {user.role === "user" && (
            <>
              <Link to="/user/my-pickups">My Pickups</Link>
              <Link to="/user/create-pickup">New Request</Link>
              <Link to="/user/reward-history">Rewards</Link>
            </>
          )}
          {user.role === "agency" && <Link to="/agency/dashboard">Dashboard</Link>}
          {user.role === "admin" && <Link to="/admin/dashboard">Dashboard</Link>}

          <NotificationBell />
          <span className="user-chip">{user.name} ({user.role})</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </nav>
      )}
    </header>
  );
};

export default Header;