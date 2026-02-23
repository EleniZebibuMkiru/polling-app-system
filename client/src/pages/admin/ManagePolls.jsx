import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/admin/AdminNavbar";
import "./managePolls.css"; // ✅ Import CSS for styling

function ManagePolls() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("polls")) || [];
    setPolls(stored);
  }, []);

  const handleDelete = (id) => {
    const updated = polls.filter(p => p.id !== id);
    setPolls(updated);
    localStorage.setItem("polls", JSON.stringify(updated));
  };

  const toggleStatus = (id) => {
    const updated = polls.map(p =>
      p.id === id
        ? { ...p, status: p.status === "active" ? "closed" : "active" }
        : p
    );
    setPolls(updated);
    localStorage.setItem("polls", JSON.stringify(updated));
  };

  return (
    <div className="manage-polls-container">
      <AdminNavbar />

      <h1>Manage Polls</h1>

      {polls.length === 0 && <p style={{ textAlign: "center" }}>No polls created yet.</p>}

      {polls.map(p => (
        <div key={p.id} className="poll-card">
          <h3>{p.question}</h3>
          <p>Status: {p.status}</p>

          <div className="poll-actions">
            <button
              onClick={() => toggleStatus(p.id)}
              className="toggle"
            >
              {p.status === "active" ? "Close" : "Reopen"}
            </button>

            <button
              onClick={() => handleDelete(p.id)}
              className="delete"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ManagePolls;