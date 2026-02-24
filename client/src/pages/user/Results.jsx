import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Results() {
  const storedPolls = JSON.parse(localStorage.getItem("polls")) || [];

  const getColor = (percentage, max) => {
    if (percentage === max) return "#16a34a";
    const red = 255 - Math.floor((percentage / 100) * 200);
    const blue = Math.floor((percentage / 100) * 200);
    return `rgb(${red}, 0, ${blue})`;
  };

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
      <h1 style={{ textAlign: "center", color: "#4f46e5" }}>Poll Results</h1>

      {storedPolls.map(poll => {
        const totalVotes = poll.votes.reduce((a, b) => a + b, 0);
        const maxVotes = Math.max(...poll.votes);

        const data = {
          labels: poll.options,
          datasets: [
            {
              label: "Votes",
              data: poll.votes,
              backgroundColor: poll.votes.map(v =>
                getColor(totalVotes > 0 ? (v / totalVotes) * 100 : 0, maxVotes)
              )
            }
          ]
        };

        const options = {
          indexAxis: "y",
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: true, text: poll.question }
          },
          scales: { x: { beginAtZero: true } }
        };

        return <div key={poll.id} style={{ marginBottom: "2rem" }}><Bar data={data} options={options} /></div>;
      })}
    </div>
  );
}

export default Results;