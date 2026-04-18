import React, { useEffect, useState } from "react";
import axios from "axios";
import LeadForm from "./LeadForm";
import Charts from "./Charts";
import "./Dashboard.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

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
    <section className="dashboard-section">
      <LeadForm onSubmit={handleSubmit} loading={loading} />

      {error && <div className="error-message">{error}</div>}

      {/* Latest Prediction with Lead ID & Name ← NEW */}
      {prediction && (
        <div className="latest-prediction">
          <h3>✅ Latest Prediction</h3>
          <div className="prediction-details">
            <div className="detail-item">
              <span className="detail-label">Lead ID:</span>
              <code className="lead-id">{prediction.lead_id}</code>
            </div>
            {prediction.lead_name && (
              <div className="detail-item">
                <span className="detail-label">Customer Name:</span>
                <span className="lead-name">{prediction.lead_name}</span>
              </div>
            )}
            <div className="detail-item">
              <span className="detail-label">Probability:</span>
              <span className="probability">{(prediction.probability * 100).toFixed(2)}%</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Lead Score:</span>
              <span className="score">{prediction.score}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Category:</span>
              <span className={`category category-${prediction.category?.toLowerCase()}`}>
                {prediction.category}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Timestamp:</span>
              <span className="timestamp">{new Date(prediction.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {history.length > 0 && <Charts history={history} />}
    </section>
  );
}

export default Dashboard;