import React from "react";
import { polls } from "../../data/Data"; // make sure this path is correct
import "./Results.css";

function Results() {
  return (
    <div className="results-container">
      <h1>Poll Results</h1>

      {polls.map((poll) => {
        const maxVotes = Math.max(...poll.votes);
        return (
          <div key={poll.id} className="poll-result-card">
            <h2>{poll.question}</h2>

            {poll.options.map((opt, i) => (
              <p
                key={i}
                className={poll.votes[i] === maxVotes ? "most-votes" : ""}
              >
                {opt}: {poll.votes[i]} votes
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default Results;