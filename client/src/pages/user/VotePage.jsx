import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api";
import "./Vote.css";

function VotePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch poll
  useEffect(() => {
    const fetchPoll = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must log in to vote.");
        navigate("/login");
        return;
      }

      try {
        const res = await API.get(`/polls/${id}`);
        setPoll(res.data);
      } catch (err) {
        console.error(err.response?.data?.message || err.message);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("currentUser");
          navigate("/login");
        } else {
          alert(err.response?.data?.message || "Error fetching poll");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPoll();
  }, [id, navigate]);

  const handleVote = async () => {
    if (!selectedOption) return alert("Please select an option!");
    setLoading(true);

    try {
      await API.post("/polls/vote", { optionId: selectedOption });
      alert("Vote submitted successfully!");
      navigate(`/results/${id}`);
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        navigate("/login");
      } else {
        alert(err.response?.data?.message || "Error submitting vote");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading poll...</p>;
  if (!poll) return <p>Poll not found!</p>;

  return (
    <div className="vote-container">
      <h2>{poll.question}</h2>
      {poll.options?.map((opt) => (
        <label key={opt.id}>
          <input
            type="radio"
            name="option"
            value={opt.id}
            onChange={() => setSelectedOption(opt.id)}
          />
          {opt.option_text}
        </label>
      ))}
      <button onClick={handleVote}>Submit Vote</button>
    </div>
  );
}

export default VotePage;