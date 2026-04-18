import React, { useMemo } from "react";
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
import "./Charts.css";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement
);

// Visual analytics for historical prediction outputs with lead ID & name tracking
function Charts({ history }) {
  const chartData = useMemo(() => {
    if (!history || history.length === 0) {
      return { bar: null, doughnut: null, breakdown: [] };
    }

    // Prepare bar chart data with lead names/IDs
    const reversedHistory = [...history].reverse();
    const labels = reversedHistory.map(
      (item) => item.lead_name || item.lead_id || `Lead #${item.id}`
    );
    const scores = reversedHistory.map((item) => item.score);
    const leadIds = reversedHistory.map((item) => item.lead_id);
    const leadNames = reversedHistory.map((item) => item.lead_name);

    // Prepare doughnut chart data with lead tracking
    const categoryCounts = history.reduce(
      (acc, row) => {
        acc[row.category] = (acc[row.category] || 0) + 1;
        return acc;
      },
      { High: 0, Medium: 0, Low: 0 }
    );

    // Build detailed breakdown for each category
    const breakdown = {};
    history.forEach((item) => {
      const cat = item.category;
      if (!breakdown[cat]) {
        breakdown[cat] = [];
      }
      breakdown[cat].push({
        name: item.lead_name || item.lead_id || `Lead #${item.id}`,
        leadId: item.lead_id,
        score: item.score,
        probability: item.probability
      });
    });

    const barData = {
      labels,
      datasets: [
        {
          label: "Lead Score",
          data: scores,
          backgroundColor: "rgba(54, 162, 235, 0.7)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          borderRadius: 6,
          hoverBackgroundColor: "rgba(54, 162, 235, 0.9)"
        }
      ]
    };

    const doughnutData = {
      labels: Object.keys(categoryCounts),
      datasets: [
        {
          label: "Category Distribution",
          data: Object.values(categoryCounts),
          backgroundColor: ["#27ae60", "#f39c12", "#e74c3c"],
          borderColor: ["#229954", "#d68910", "#c0392b"],
          borderWidth: 2
        }
      ]
    };

    return { bar: barData, doughnut: doughnutData, breakdown, categoryCounts };
  }, [history]);

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          font: { size: 12, weight: "bold" }
        }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: { size: 13, weight: "bold" },
        bodyFont: { size: 12 },
        callbacks: {
          title: (context) => {
            const item = history.find(
              (h) => h.score === context[0].parsed.y
            );
            return item?.lead_name || item?.lead_id || `Lead #${item?.id}`;
          },
          afterLabel: (context) => {
            const item = history.find(
              (h) => h.score === context.parsed.y
            );
            return `ID: ${item?.lead_id}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          font: { size: 11 }
        }
      },
      x: {
        ticks: {
          font: { size: 10 }
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 12, weight: "bold" },
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: { size: 13, weight: "bold" },
        bodyFont: { size: 12 },
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.parsed;
            const percentage = (
              (value / history.length) *
              100
            ).toFixed(1);
            return `${label}: ${value} leads (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="charts-container">
      <h2 className="charts-title">📊 Analytics & Predictions</h2>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Bar Chart */}
        <div className="chart-card">
          <h3 className="chart-title">Score Distribution by Lead</h3>
          {chartData.bar ? (
            <Bar data={chartData.bar} options={barOptions} />
          ) : (
            <p className="no-data">No data available</p>
          )}
        </div>

        {/* Doughnut Chart */}
        <div className="chart-card">
          <h3 className="chart-title">Conversion Category Distribution</h3>
          {chartData.doughnut ? (
            <Doughnut data={chartData.doughnut} options={doughnutOptions} />
          ) : (
            <p className="no-data">No data available</p>
          )}
        </div>
      </div>

      {/* Category Breakdown */}
      {Object.keys(chartData.breakdown).length > 0 && (
        <div className="breakdown-container">
          <h3 className="breakdown-title">📋 Lead Breakdown by Category</h3>
          <div className="breakdown-grid">
            {Object.entries(chartData.breakdown).map(([category, leads]) => (
              <div key={category} className={`breakdown-card category-${category.toLowerCase()}`}>
                <h4 className="breakdown-category-title">
                  {category === "High" && "🟢"}
                  {category === "Medium" && "🟡"}
                  {category === "Low" && "🔴"}
                  {" "} {category} Priority ({leads.length})
                </h4>
                <ul className="leads-list">
                  {leads.map((lead, idx) => (
                    <li key={idx} className="lead-item">
                      <div className="lead-info">
                        <span className="lead-name">{lead.name}</span>
                        <span className="lead-id-small">{lead.leadId}</span>
                      </div>
                      <div className="lead-metrics">
                        <span className="score-badge">{lead.score}</span>
                        <span className="probability-badge">
                          {(lead.probability * 100).toFixed(1)}%
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {history.length > 0 && (
        <div className="summary-stats">
          <h3 className="summary-title">📈 Summary Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <h4 className="stat-label">Total Leads</h4>
              <p className="stat-value">{history.length}</p>
            </div>
            <div className="stat-card">
              <h4 className="stat-label">Average Score</h4>
              <p className="stat-value">
                {(history.reduce((sum, h) => sum + h.score, 0) / history.length).toFixed(1)}
              </p>
            </div>
            <div className="stat-card">
              <h4 className="stat-label">High Priority</h4>
              <p className="stat-value" style={{ color: "#27ae60" }}>
                {chartData.categoryCounts?.High || 0}
              </p>
            </div>
            <div className="stat-card">
              <h4 className="stat-label">Medium Priority</h4>
              <p className="stat-value" style={{ color: "#f39c12" }}>
                {chartData.categoryCounts?.Medium || 0}
              </p>
            </div>
            <div className="stat-card">
              <h4 className="stat-label">Low Priority</h4>
              <p className="stat-value" style={{ color: "#e74c3c" }}>
                {chartData.categoryCounts?.Low || 0}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Predictions Table */}
      {history.length > 0 && (
        <div className="predictions-table-container">
          <h3 className="table-title">📊 All Predictions</h3>
          <div className="table-wrapper">
            <table className="predictions-table">
              <thead>
                <tr>
                  <th>Lead ID</th>
                  <th>Customer Name</th>
                  <th>Score</th>
                  <th>Probability</th>
                  <th>Category</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {[...history].reverse().map((item, idx) => (
                  <tr key={idx} className={`row-${item.category.toLowerCase()}`}>
                    <td className="lead-id-cell">
                      <code>{item.lead_id}</code>
                    </td>
                    <td className="lead-name-cell">
                      {item.lead_name || "—"}
                    </td>
                    <td className="score-cell">
                      <strong>{item.score}</strong>
                    </td>
                    <td className="probability-cell">
                      {(item.probability * 100).toFixed(1)}%
                    </td>
                    <td className="category-cell">
                      <span className={`category-badge category-${item.category.toLowerCase()}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="timestamp-cell">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Charts;