// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/admin/AdminNavbar";
import API from "../../api"; // Axios instance with token
import "./adminDashboard.css";

function AdminDashboard() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setLoading(true);
        const res = await API.get("/polls"); // token auto-attached via API.js
        setPolls(res.data);
      } catch (err) {
        console.error(err.response?.data?.message || err.message);
        setError(err.response?.data?.message || "Failed to fetch polls");
        // Redirect to login if token expired or invalid
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("currentUser");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, [navigate]);

  // Compute dashboard stats
  // polls with status "open" are considered active on dashboard
  const activePolls = polls.filter((p) => p.status === "open");
  const closedPolls = polls.filter((p) => p.status === "closed");
  const totalVotes = polls.reduce(
    (sum, poll) =>
      sum + poll.options.reduce((acc, opt) => acc + (opt.votes_count || 0), 0),
    0
  );

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="error">{error}</p>;

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
        <Link to="/admin/create" className="create-btn">
          Create Poll
        </Link>
        <Link to="/admin/manage" className="manage-btn">
          Manage Polls
        </Link>
        <Link to="/admin/users" className="users-btn">
          Manage Users
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;