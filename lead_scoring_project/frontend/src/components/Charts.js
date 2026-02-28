import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement
);

// Visual analytics for historical prediction outputs.
function Charts({ history }) {
  const labels = history.map((_, index) => `Lead ${index + 1}`).reverse();
  const scores = history.map((item) => item.score).reverse();

  const categoryCounts = history.reduce(
    (acc, row) => {
      acc[row.category] = (acc[row.category] || 0) + 1;
      return acc;
    },
    { High: 0, Medium: 0, Low: 0 }
  );

  const barData = {
    labels,
    datasets: [
      {
        label: "Lead Score",
        data: scores,
        backgroundColor: "rgba(54, 162, 235, 0.7)"
      }
    ]
  };

  const doughnutData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Category Distribution",
        data: Object.values(categoryCounts),
        backgroundColor: ["#2ecc71", "#f1c40f", "#e74c3c"]
      }
    ]
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1.5rem" }}>
      <div>
        <h3>Score Distribution</h3>
        <Bar data={barData} />
      </div>
      <div>
        <h3>Conversion Category Distribution</h3>
        <Doughnut data={doughnutData} />
      </div>
    </div>
  );
}

export default Charts;
