import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ user, setUser }) {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar">

      <h2>
        <Link to="/">Online Polling System</Link>
      </h2>

      <div className="navbar-links">

        <Link to="/">Home</Link>

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/results">Results</Link>
            <Link to="/profile">{user.name}</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;