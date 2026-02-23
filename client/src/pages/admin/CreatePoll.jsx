import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/admin/AdminNavbar";
import "./createPoll.css"; // ✅ Import CSS for styling

function CreatePoll() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [status, setStatus] = useState("active");

  // Add a new option input
  const addOption = () => setOptions([...options, ""]);

  // Update option text
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!question || options.some(opt => !opt)) {
      return alert("Fill all fields");
    }

    const storedPolls = JSON.parse(localStorage.getItem("polls")) || [];

    const newPoll = {
      id: Date.now(),
      question,
      options: options.map(opt => ({
        text: opt,
        votes: 0
      })),
      status,
      votedUsers: [] // ⭐ for one vote per user
    };

    const updatedPolls = [...storedPolls, newPoll];
    localStorage.setItem("polls", JSON.stringify(updatedPolls));

    alert("Poll created!");
    navigate("/admin/manage-polls");
  };

  return (
    <div className="create-poll-container">
      {/* Admin Navbar at the top */}
      <AdminNavbar />

      {/* Page heading */}
      <h1>Create Poll</h1>

      {/* Poll form */}
      <form onSubmit={handleSubmit}>
        {/* Question input */}
        <input
          type="text"
          placeholder="Question"
          value={question}
          onChange={e => setQuestion(e.target.value)}
        />

        {/* Options inputs */}
        {options.map((opt, idx) => (
          <input
            key={idx}
            value={opt}
            onChange={e => handleOptionChange(idx, e.target.value)}
            placeholder={`Option ${idx + 1}`}
          />
        ))}

        {/* Add new option button */}
        <button type="button" onClick={addOption}>
          Add Option
        </button>

        {/* Poll status */}
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
        </select>

        {/* Submit */}
        <button type="submit">Create Poll</button>
      </form>
    </div>
  );
}

export default CreatePoll;