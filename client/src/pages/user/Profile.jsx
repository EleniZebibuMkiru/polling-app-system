import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("currentUser"));

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(storedUser?.name || "");
  const [email, setEmail] = useState(storedUser?.email || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleUpdate = async () => {
    if (!name || !email) {
      setError("All fields are required!");
      return;
    }

    try {
      //  Get JWT token from localStorage
      const token = localStorage.getItem("token");

      const res = await API.put(
        "/auth/update-profile",
        { name, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update localStorage & UI state
      localStorage.setItem("currentUser", JSON.stringify(res.data.user));
      setSuccess("Profile updated successfully!");
      setError("");
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed!");
      setSuccess("");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1 className="profile-title">My Profile</h1>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <div className="profile-info">
          {editMode ? (
            <>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </>
          ) : (
            <>
              <div className="profile-row">
                <span className="label">Full Name</span>
                <span className="value">{storedUser?.name}</span>
              </div>

              <div className="profile-row">
                <span className="label">Email Address</span>
                <span className="value">{storedUser?.email}</span>
              </div>

              <div className="profile-row">
                <span className="label">Account Role</span>
                <span className="value role">{storedUser?.role?.toUpperCase()}</span>
              </div>
            </>
          )}
        </div>

        {editMode ? (
          <button className="save-btn" onClick={handleUpdate}>
            Save Changes
          </button>
        ) : (
          <button className="edit-btn" onClick={() => setEditMode(true)}>
            Edit Profile
          </button>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;