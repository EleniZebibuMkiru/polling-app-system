// src/components/general/PollCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./pollCard.css";

function PollCard({ poll }) {
  // Ensure votes array exists
  const votes = poll.options?.map((opt) => opt.votes_count || 0) || [];
  const totalVotes = votes.reduce((a, b) => a + b, 0);

  const getPercentage = (votesCount) =>
    totalVotes > 0 ? ((votesCount / totalVotes) * 100).toFixed(0) : 0;

  return (
    <div className="poll-card">
      <h2>{poll.question}</h2>

      <ul>
        {poll.options?.map((opt, i) => (
          <li key={opt.id || i}>
            {opt.option_text} — {votes[i]} votes ({getPercentage(votes[i])}%)
            <div
              className="vote-bar"
              style={{
                width: `${getPercentage(votes[i])}%`,
                backgroundColor: `hsl(${(i * 70) % 360}, 70%, 50%)`,
                height: "10px",
                borderRadius: "5px",
                marginTop: "3px",
              }}
            />
          </li>
        ))}
      </ul>

      <Link to={`/vote/${poll.id}`}>
        <button>Vote</button>
      </Link>
    </div>
  );
}

export default PollCard;