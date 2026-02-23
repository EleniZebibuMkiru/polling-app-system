import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "../../components/admin/AdminNavbar";
import "./adminDashboard.css";

function AdminDashboard() {

  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const storedPolls = JSON.parse(localStorage.getItem("polls")) || [];
    setPolls(storedPolls);
  }, []);

  const activePolls = polls.filter(p => p.status === "active");
  const closedPolls = polls.filter(p => p.status === "closed");
  const totalVotes = polls.reduce(
    (sum, poll) => sum + poll.options.reduce((a, b) => a + b.votes, 0),
    0
  );

  return (
    <div className="admin-dashboard">
      <AdminNavbar />

      <h1>Admin Dashboard</h1>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Active Polls</h2>
          <p>{activePolls.length}</p>
        </div>
        <div className="dashboard-card">
          <h2>Closed Polls</h2>
          <p>{closedPolls.length}</p>
        </div>
        <div className="dashboard-card">
          <h2>Total Votes</h2>
          <p>{totalVotes}</p>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/admin/create" className="create-btn">Create Poll</Link>
        <Link to="/admin/manage-polls" className="manage-btn">Manage Polls</Link>
        <Link to="/admin/users" className="users-btn">Manage Users</Link>
      </div>
    </div>
  );
}

export default AdminDashboard;