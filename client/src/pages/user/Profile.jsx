import React from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div className="profile-container">
      <div className="profile-card">

        <h1 className="profile-title">My Profile</h1>

        <div className="profile-info">
          <div className="profile-row">
            <span className="label">Full Name</span>
            <span className="value">{currentUser?.name}</span>
          </div>

          <div className="profile-row">
            <span className="label">Email Address</span>
            <span className="value">{currentUser?.email}</span>
          </div>

          <div className="profile-row">
            <span className="label">Account Role</span>
            <span className="value role">
              {currentUser?.role?.toUpperCase()}
            </span>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

      </div>
    </div>
  );
}

export default Profile;