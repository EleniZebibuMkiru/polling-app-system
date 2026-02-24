import React, { useEffect, useState } from "react";
import PollCard from "../../components/general/PollCard";
import { polls as defaultPolls } from "../../data/Data";
import "./userDashboard.css";

function UserDashboard() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    // Load polls from localStorage or fallback to default
    const storedPolls = JSON.parse(localStorage.getItem("polls"));
    if (storedPolls && Array.isArray(storedPolls)) {
      setPolls(storedPolls);
    } else {
      localStorage.setItem("polls", JSON.stringify(defaultPolls));
      setPolls(defaultPolls);
    }
  }, []);

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