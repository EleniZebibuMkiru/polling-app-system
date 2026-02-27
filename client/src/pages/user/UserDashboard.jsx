// src/pages/user/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PollCard from "../../components/general/PollCard";
import API from "../../api";
import "./userDashboard.css";

function UserDashboard() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You must log in to view polls.");
          navigate("/login");
          return;
        }

        const res = await API.get("/polls"); // Axios sends token automatically
        setPolls(res.data);
      } catch (err) {
        console.error(err.response?.data?.message || err.message);
        if (err.response?.status === 401) {
          alert("Session expired or unauthorized. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("currentUser");
          navigate("/login");
        } else {
          alert(err.response?.data?.message || "Error fetching polls");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, [navigate]);

  if (loading) return <p>Loading polls...</p>;

  return (
    <div className="dashboard-container">
      <h1>Active Polls</h1>
      <div className="polls">
        {polls.length > 0 ? (
          polls.map((poll) => <PollCard key={poll.id} poll={poll} />)
        ) : (
          <p>No polls available!</p>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;