import React from "react";
import { Link } from "react-router-dom";
import "./pollCard.css";

function PollCard({ poll }) {
  return (
    <div className="poll-card">
      <h2>{poll.question}</h2>

      {/* Optional preview of options */}
      <ul>
        {poll.options.map((opt, i) => (
          <li key={i}>{opt}</li>
        ))}
      </ul>

      <Link to={`/vote/${poll.id}`}>
        <button>Vote</button>
      </Link>
    </div>
  );
}

export default PollCard;