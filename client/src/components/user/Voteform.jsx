import React, { useState } from "react";

function VoteForm({ poll, onVote }) {
  const [selected, setSelected] = useState(null);

  const handleVote = () => {
    if (selected === null) {
      alert("Please select an option!");
      return;
    }

    // Send selected vote to parent
    if (onVote) onVote(selected);

    alert(`Vote submitted for: ${poll.options[selected]}`);
    setSelected(null); // reset selection
  };

  return (
    <div className="flex flex-col gap-4">
      {poll.options.map((option, index) => (
        <label key={index} className="flex items-center gap-2">
          <input
            type="radio"
            name="option"
            checked={selected === index}
            onChange={() => setSelected(index)}
            className="accent-green-500"
          />
          <span>{option}</span>
        </label>
      ))}

      <button
        onClick={handleVote}
        className="bg-green-500 text-white px-4 py-2 mt-3 rounded hover:bg-green-600 transition"
      >
        Submit Vote
      </button>
    </div>
  );
}

export default VoteForm;