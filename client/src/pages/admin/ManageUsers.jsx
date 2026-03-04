// src/pages/admin/ManageUsers.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import "./manageUsers.css"; // styles for user cards/table

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users"); // token auto-attached
      setUsers(res.data);
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Error fetching users");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // delete a user (admin only)
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await API.delete(`/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  // reset votes cast by a user
  const handleResetVotes = async (id) => {
    if (!window.confirm("Reset all votes for this user? This cannot be undone.")) return;

    try {
      await API.post(`/users/${id}/reset-votes`);
      alert("User votes have been cleared");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reset votes");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="manage-users-container">
      <h1>Manage Users</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.created_at}</td>
                <td>
                  <button
                    className="reset"
                    onClick={() => handleResetVotes(u.id)}
                  >
                    Reset Votes
                  </button>
                  <button
                    className="delete"
                    onClick={() => handleDeleteUser(u.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageUsers;