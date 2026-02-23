import React from "react";
import PollCard from "../../components/general/PollCard";
import { polls } from "../../data/Data";
import "./userDashboard.css";

function UserDashboard() {
  return (
    <div className="dashboard-container">
      <h1>Active Polls</h1>
      <div className="polls">
        {polls.map((poll) => (
          <PollCard key={poll.id} poll={poll} />
        ))}
      </div>
    </div>
  );
}

export default UserDashboard;