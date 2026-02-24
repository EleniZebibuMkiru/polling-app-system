import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/admin/AdminNavbar";
import "./createPoll.css";

function CreatePoll() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [status, setStatus] = useState("active");

  const addOption = () => setOptions([...options, ""]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question || options.some(opt => !opt)) return alert("Fill all fields");

    const storedPolls = JSON.parse(localStorage.getItem("polls")) || [];

    const newPoll = {
      id: Date.now(),
      question,
      options,                  // array of strings
      votes: options.map(() => 0), // parallel array of vote counts
      votedUsers: [],           // track usernames who voted
      status
    };

    localStorage.setItem("polls", JSON.stringify([...storedPolls, newPoll]));
    alert("Poll created!");
    navigate("/admin/manage-polls");
  };

  return (
    <div className="create-poll-container">
      <AdminNavbar />
      <h1>Create Poll</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Question"
          value={question}
          onChange={e => setQuestion(e.target.value)}
        />

        {options.map((opt, idx) => (
          <input
            key={idx}
            value={opt}
            onChange={e => handleOptionChange(idx, e.target.value)}
            placeholder={`Option ${idx + 1}`}
          />
        ))}

        <button type="button" onClick={addOption}>Add Option</button>

        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
        </select>

        <button type="submit">Create Poll</button>
      </form>
    </div>
  );
}

export default CreatePoll;