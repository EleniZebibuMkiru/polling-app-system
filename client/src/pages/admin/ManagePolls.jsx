// src/pages/admin/ManagePolls.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/admin/AdminNavbar";
import API from "../../api";
import "./managePolls.css";

function ManagePolls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const res = await API.get("/polls"); // token auto-attached
      setPolls(res.data);
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Error fetching polls");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this poll?")) return;

    try {
      await API.delete(`/polls/${id}`);
      setPolls(polls.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete poll");
    }
  };

  const toggleStatus = async (poll) => {
    try {
      const newStatus = poll.status === "active" ? "closed" : "active";
      await API.patch(`/polls/${poll.id}/status`, { status: newStatus });
      setPolls(polls.map((p) => (p.id === poll.id ? { ...p, status: newStatus } : p)));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) return <p>Loading polls...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="manage-polls-container">
      <AdminNavbar />
      <h1>Manage Polls</h1>

      {polls.length === 0 && <p style={{ textAlign: "center" }}>No polls created yet.</p>}

      {polls.map((p) => (
        <div key={p.id} className="poll-card">
          <h3>{p.question}</h3>
          <p>Status: {p.status}</p>

          <div className="poll-actions">
            <button onClick={() => navigate(`/admin/results/${p.id}`)}>View Results</button>
            <button onClick={() => toggleStatus(p)}>
              {p.status === "active" ? "Close" : "Reopen"}
            </button>
            <button onClick={() => handleDelete(p.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ManagePolls;