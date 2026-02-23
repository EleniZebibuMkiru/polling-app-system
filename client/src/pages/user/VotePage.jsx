import React from "react";
import { useParams } from "react-router-dom";
import { polls } from "../../data/Data";
import "./Vote.css";

function VotePage() {
  const { id } = useParams();
  const poll = polls.find((p) => p.id === parseInt(id));

  if (!poll) return <p className="vote-notfound">Poll not found!</p>;

  const handleVote = (optionIndex) => {
  poll.votes[optionIndex] += 1;
    alert(`You voted for: ${poll.options[optionIndex]}`);
  };

  return (
    <>

      <div className="vote-container">
        <div className="vote-card">

          <h2 className="vote-title">{poll.question}</h2>

          <div className="vote-options">
            {poll.options.map((opt, index) => (
              <button
                key={index}
                onClick={() => handleVote(index)}
                className="vote-option-btn"
              >
                {opt}
              </button>
            ))}
          </div>

        </div>
      </div>

    </>
  );
}

export default VotePage;