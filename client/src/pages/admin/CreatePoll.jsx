// src/pages/admin/CreatePoll.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/admin/AdminNavbar";
import API from "../../api"; // Axios instance with token
import "./createPoll.css";

function CreatePoll() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]); // start with 2 options
  const [loading, setLoading] = useState(false);
  const addOption = () => setOptions([...options, ""]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim() || options.some((opt) => !opt.trim()))
      return alert("Please fill in the question and all options");

    try {
      setLoading(true);
      await API.post("/polls", { question, options }); // token auto-attached via API.js
      alert("Poll created successfully!");
      navigate("/admin/manage"); // updated to match App.jsx route
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "Error creating poll");
    } finally {
      setLoading(false);
    }
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
          onChange={(e) => setQuestion(e.target.value)}
        />

        {options.map((opt, idx) => (
          <input
            key={idx}
            value={opt}
            onChange={(e) => handleOptionChange(idx, e.target.value)}
            placeholder={`Option ${idx + 1}`}
          />
        ))}

        <button type="button" onClick={addOption}>
          Add Option
        </button>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Poll"}
        </button>
      </form>
    </div>
  );
}

export default CreatePoll;