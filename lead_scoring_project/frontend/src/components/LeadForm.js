import React, { useState } from "react";

const initialFormState = {
  age: 35,
  job: "management",
  marital: "single",
  education: "tertiary",
  default: "no",
  balance: 1200,
  housing: "yes",
  loan: "no",
  contact: "cellular",
  day: 15,
  month: "may",
  duration: 180,
  campaign: 1,
  pdays: -1,
  previous: 0,
  poutcome: "unknown"
};

// Collect lead attributes required by backend API.
function LeadForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["age", "balance", "day", "duration", "campaign", "pdays", "previous"].includes(name)
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.8rem", maxWidth: "500px" }}>
      {Object.entries(formData).map(([key, value]) => (
        <label key={key} style={{ display: "flex", flexDirection: "column" }}>
          {key}
          <input
            name={key}
            value={value}
            onChange={handleChange}
            required
            style={{ padding: "0.4rem", borderRadius: "4px" }}
          />
        </label>
      ))}
      <button type="submit" disabled={loading} style={{ padding: "0.7rem", cursor: "pointer" }}>
        {loading ? "Scoring..." : "Score Lead"}
      </button>
    </form>
  );
}

export default LeadForm;
