import React, { useState } from "react";
import API from "../../api"; 

function VoteForm({ poll, onVoteSuccess }) {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVote = async () => {
    if (selected === null) {
      alert("Please select an option!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // JWT token of logged-in user
      await API.post(
        "/polls/vote",
        { optionId: poll.options[selected].id }, // send option id
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Vote submitted for: ${poll.options[selected].option_text}`);
      setSelected(null); // reset selection

      // Notify parent to refresh results
      if (onVoteSuccess) onVoteSuccess();
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "Error submitting vote");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {poll.options.map((option, index) => (
        <label key={option.id} className="flex items-center gap-2">
          <input
            type="radio"
            name="option"
            checked={selected === index}
            onChange={() => setSelected(index)}
            className="accent-green-500"
          />
          <span>{option.option_text}</span>
        </label>
      ))}

      <button
        onClick={handleVote}
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 mt-3 rounded hover:bg-green-600 transition disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Vote"}
      </button>
    </div>
  );
}

export default VoteForm;
