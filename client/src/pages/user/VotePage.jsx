import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Vote.css";

function VotePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [poll, setPoll] = useState(null);
  const [currentUser, setCurrentUser] = useState(""); // input username
  const [hasVoted, setHasVoted] = useState(false);
  const [usernameEntered, setUsernameEntered] = useState(false);

  // 1️⃣ Load poll only after username is entered
  useEffect(() => {
    if (!usernameEntered) return;

    const storedPolls = JSON.parse(localStorage.getItem("polls")) || [];
    const normalizedPolls = storedPolls.map(p => ({
      id: p.id,
      question: p.question,
      options: p.options.map(o => (typeof o === "object" ? o.text : o)),
      votes: p.votes || p.options.map(() => 0),
      votedUsers: p.votedUsers || [],
      status: p.status || "active"
    }));

    localStorage.setItem("polls", JSON.stringify(normalizedPolls));

    const foundPoll = normalizedPolls.find(p => p.id.toString() === id);
    if (!foundPoll) return;

    setPoll(foundPoll);
    setHasVoted(foundPoll.votedUsers.includes(currentUser));
  }, [usernameEntered, currentUser, id]);

  const handleStart = () => {
    if (!currentUser) return alert("Please enter your name");
    setUsernameEntered(true);
  };

  const handleVote = (optionIndex) => {
    if (!poll || !currentUser) return;
    if (poll.status === "closed") return alert("This poll is closed.");
    if (poll.votedUsers.includes(currentUser)) return alert("You have already voted.");

    const storedPolls = JSON.parse(localStorage.getItem("polls")) || [];
    const pollIndex = storedPolls.findIndex(p => p.id.toString() === poll.id.toString());

    storedPolls[pollIndex].votes[optionIndex] += 1;
    storedPolls[pollIndex].votedUsers.push(currentUser);

    localStorage.setItem("polls", JSON.stringify(storedPolls));
    setHasVoted(true);

    alert(`You voted for: ${poll.options[optionIndex]}`);
    navigate("/results");
  };

  if (!usernameEntered) {
    return (
      <div className="vote-container">
        <div className="vote-card">
          <h2>Enter your name to vote</h2>
          <input
            type="text"
            placeholder="Your name"
            value={currentUser}
            onChange={(e) => setCurrentUser(e.target.value)}
          />
          <button onClick={handleStart}>Start Voting</button>
        </div>
      </div>
    );
  }

  if (!poll) return <p className="vote-notfound">Poll not found!</p>;

  return (
    <div className="vote-container">
      <div className="vote-card">
        <h2 className="vote-title">{poll.question}</h2>
        <div className="vote-options">
          {poll.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleVote(idx)}
              className="vote-option-btn"
              disabled={hasVoted || poll.status === "closed"}
            >
              {opt}
            </button>
          ))}
        </div>

        {hasVoted && <p className="vote-warning">You have already voted.</p>}
        {poll.status === "closed" && <p className="vote-warning">This poll is closed.</p>}
      </div>
    </div>
  );
}

export default VotePage;