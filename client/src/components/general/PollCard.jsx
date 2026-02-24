import React from "react";
import { Link } from "react-router-dom";
import "./pollCard.css";

function PollCard({ poll }) {
  const totalVotes = poll.votes.reduce((a, b) => a + b, 0);

  // Function to calculate vote percentage
  const getPercentage = (votes) => {
    return totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(0) : 0;
  };

  return (
    <div className="poll-card">
      <h2>{poll.question}</h2>

      <ul>
        {poll.options.map((opt, i) => (
          <li key={i}>
            {opt} — {poll.votes[i]} votes ({getPercentage(poll.votes[i])}%)
            <div
              className="vote-bar"
              style={{
                width: `${getPercentage(poll.votes[i])}%`,
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