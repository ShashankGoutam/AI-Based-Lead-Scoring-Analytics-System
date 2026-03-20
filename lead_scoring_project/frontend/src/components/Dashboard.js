import React, { useEffect, useState } from "react";
import axios from "axios";
import LeadForm from "./LeadForm";
import Charts from "./Charts";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

// Main dashboard orchestrates prediction calls and analytics.
function Dashboard() {
  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE}/history`);
      setHistory(response.data);
    } catch {
      setError("Failed to load prediction history.");
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSubmit = async (payload) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_BASE}/predict`, payload);
      setPrediction(response.data);
      await loadHistory();
    } catch (submitError) {
      setError(submitError?.response?.data?.detail || "Prediction request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <LeadForm onSubmit={handleSubmit} loading={loading} />

      {error && <p style={{ color: "red" }}>{error}</p>}

      {prediction && (
        <div style={{ marginTop: "1rem", padding: "1rem", background: "#f7f7f7", borderRadius: "8px" }}>
          <h3>Latest Prediction</h3>
          <p><strong>Probability:</strong> {(prediction.probability * 100).toFixed(2)}%</p>
          <p><strong>Lead Score:</strong> {prediction.score}</p>
          <p><strong>Category:</strong> {prediction.category}</p>
        </div>
      )}

      {history.length > 0 && <Charts history={history} />}
    </section>
  );
}

export default Dashboard;
