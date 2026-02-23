import React, { useState } from "react";
import AdminNavbar from "../../components/admin/AdminNavbar";
import "./manageUsers.css"; // ✅ Import CSS for styling

// Mock users
const initialUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", banned: false },
  { id: 2, name: "Jane Smith", email: "jane@example.com", banned: false },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", banned: true },
];

function ManageUsers() {
  const [users, setUsers] = useState(initialUsers);

  const toggleBan = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, banned: !u.banned } : u));
  };

  const deleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const resetVotes = (id) => {
    alert(`Votes for user ID ${id} have been reset! (mock)`);
  };

  return (
    <div className="manage-users-container">
      <AdminNavbar />

      <h1>Manage Users</h1>

      <div className="space-y-3">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-info">
              <p><strong>{user.name}</strong> ({user.email})</p>
              <p>Status: {user.banned ? "Banned" : "Active"}</p>
            </div>

            <div className="user-actions">
              <button
                onClick={() => toggleBan(user.id)}
                className={user.banned ? "unban" : "ban"}
              >
                {user.banned ? "Unban" : "Ban"}
              </button>

              <button
                onClick={() => resetVotes(user.id)}
                className="reset"
              >
                Reset Votes
              </button>

              <button
                onClick={() => deleteUser(user.id)}
                className="delete"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageUsers;