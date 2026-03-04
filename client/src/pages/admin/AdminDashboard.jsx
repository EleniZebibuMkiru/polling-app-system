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

  // tooltip state for hover details
  const [hoveredCard, setHoveredCard] = useState(null);

  const getTooltipContent = () => {
    if (!hoveredCard) return "";
    switch (hoveredCard) {
      case "active":
        return activePolls.length
          ? activePolls.map((p) => p.question).join("\n")
          : "No active polls";
      case "closed":
        return closedPolls.length
          ? closedPolls.map((p) => p.question).join("\n")
          : "No closed polls";
      case "votes":
        if (!polls.length) return "No polls";
        return polls
          .map(
            (p) =>
              `${p.question}: ${p.options
                .reduce((a, o) => a + (o.votes_count || 0), 0)} votes`
          )
          .join("\n");
      default:
        return "";
    }
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="admin-dashboard">
      <AdminNavbar />

      <h1>Admin Dashboard</h1>

      <div className="dashboard-grid">
        <div
          className="dashboard-card"
          onMouseEnter={() => setHoveredCard("active")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <h2>Active Polls</h2>
          <p>{activePolls.length}</p>
          {hoveredCard === "active" && (
            <div className="tooltip">
              {getTooltipContent().split("\n").map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          )}
        </div>
        <div
          className="dashboard-card"
          onMouseEnter={() => setHoveredCard("closed")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <h2>Closed Polls</h2>
          <p>{closedPolls.length}</p>
          {hoveredCard === "closed" && (
            <div className="tooltip">
              {getTooltipContent().split("\n").map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          )}
        </div>
        <div
          className="dashboard-card"
          onMouseEnter={() => setHoveredCard("votes")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <h2>Total Votes</h2>
          <p>{totalVotes}</p>
          {hoveredCard === "votes" && (
            <div className="tooltip">
              {getTooltipContent().split("\n").map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          )}
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