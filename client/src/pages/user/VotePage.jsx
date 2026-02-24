// src/pages/user/VotePage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { polls } from "../../data/Data";
import "./Vote.css";

function VotePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Load polls from localStorage or fallback to Data.js
  let storedPolls = JSON.parse(localStorage.getItem("polls"));
  if (!storedPolls || !Array.isArray(storedPolls)) {
    localStorage.setItem("polls", JSON.stringify(polls));
    storedPolls = polls;
  }

  const poll = storedPolls.find((p) => p.id.toString() === id);
  if (!poll) return <p className="vote-notfound">Poll not found!</p>;

  const handleVote = (optionIndex) => {
    // ✅ Get current user
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      alert("Please login first to vote!");
      return;
    }

    // ✅ Load usersVotes from localStorage
    const usersVotes = JSON.parse(localStorage.getItem("usersVotes")) || {};
    const userId = currentUser.id;

    // ✅ Check if this user already voted this poll
    if (usersVotes[userId]?.includes(poll.id)) {
      alert("You have already voted on this poll!");
      return;
    }

    // ✅ Update vote count
    const latestPolls = JSON.parse(localStorage.getItem("polls")) || polls;
    const updatedPolls = latestPolls.map((p) => {
      if (p.id.toString() === id) {
        const newVotes = [...p.votes];
        newVotes[optionIndex] += 1;
        return { ...p, votes: newVotes };
      }
      return p;
    });

    // ✅ Save updated polls
    localStorage.setItem("polls", JSON.stringify(updatedPolls));

    // ✅ Update user's voted polls
    if (!usersVotes[userId]) usersVotes[userId] = [];
    usersVotes[userId].push(poll.id);
    localStorage.setItem("usersVotes", JSON.stringify(usersVotes));

    alert(`You voted for: ${poll.options[optionIndex]}`);
    navigate("/dashboard");
  };

  return (
    <div className="vote-container">
      <div className="vote-card">
        <h2 className="vote-title">{poll.question}</h2>
        <div className="vote-options">
          {poll.options.map((opt, index) => (
            <button
              key={index}
              className="vote-option-btn"
              onClick={() => handleVote(index)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VotePage;