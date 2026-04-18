import React, { useState } from "react";
import "./LeadForm.css";

const initialFormState = {
  lead_name: "",  // Lead/customer name
  age: 35,        // ← AGE FIELD (IMPORTANT!)
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

const fieldLabels = {
  lead_name: "Customer Name",
  age: "Age (Years)",         // ← AGE LABEL
  job: "Job Type",
  marital: "Marital Status",
  education: "Education Level",
  default: "Credit Default",
  balance: "Account Balance (€)",
  housing: "Housing Loan",
  loan: "Personal Loan",
  contact: "Contact Method",
  day: "Day of Month",
  month: "Month",
  duration: "Call Duration (Sec)",
  campaign: "Campaign Contacts",
  pdays: "Days Since Contact",
  previous: "Previous Contacts",
  poutcome: "Previous Outcome"
};

const fieldDescriptions = {
  lead_name: "Name or identifier for this lead",
  age: "Customer's age in years (18-100)",  // ← AGE DESCRIPTION
  job: "Type of occupation",
  marital: "Marital status",
  education: "Highest education level",
  default: "Has customer defaulted on credit?",
  balance: "Current account balance",
  housing: "Has housing/mortgage loan?",
  loan: "Has personal loan?",
  contact: "How to contact customer",
  day: "Day of month (1-31)",
  month: "Month of contact",
  duration: "Duration of call in seconds",
  campaign: "Contacts in current campaign",
  pdays: "Days since last contact (-1 = never)",
  previous: "Previous campaign contacts",
  poutcome: "Outcome of previous campaign"
};

const selectOptions = {
  job: ["admin", "blue-collar", "entrepreneur", "housemaid", "management", "retired", "services", "student", "technician", "unemployed", "unknown"],
  marital: ["single", "married", "divorced", "unknown"],
  education: ["primary", "secondary", "tertiary", "unknown"],
  default: ["no", "yes", "unknown"],
  housing: ["no", "yes", "unknown"],
  loan: ["no", "yes", "unknown"],
  contact: ["cellular", "telephone", "unknown"],
  month: ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"],
  poutcome: ["unknown", "failure", "success", "other"]
};

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

  // Split fields into left and right columns
  // Exclude lead_name (displayed full-width at top)
  const fields = Object.keys(formData).filter(field => field !== "lead_name");
  const midpoint = Math.ceil(fields.length / 2);
  const leftFields = fields.slice(0, midpoint);
  const rightFields = fields.slice(midpoint);

  const renderField = (fieldName) => {
    const value = formData[fieldName];
    const label = fieldLabels[fieldName];
    const description = fieldDescriptions[fieldName];
    const options = selectOptions[fieldName];

    return (
      <div key={fieldName} className="form-field">
        <label htmlFor={fieldName} className="field-label">
          {label}
          <span className="tooltip" title={description}>ℹ️</span>
        </label>
        {options ? (
          <select
            id={fieldName}
            name={fieldName}
            value={value}
            onChange={handleChange}
            className="field-input field-select"
            required
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={fieldName}
            type={["age", "balance", "day", "duration", "campaign", "pdays", "previous"].includes(fieldName) ? "number" : "text"}
            name={fieldName}
            value={value}
            onChange={handleChange}
            className="field-input"
            placeholder={description}
            {...(fieldName === "age" && { min: "18", max: "100" })}
            required
          />
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="lead-form">
      <h2 className="form-title">Lead Scoring Form</h2>
      
      {/* Lead Name - Full Width (Only Once!) */}
      <div className="form-full-width">
        {renderField("lead_name")}
      </div>

      <div className="form-container">
        {/* Left Column */}
        <div className="form-column">
          {leftFields.map((fieldName) => renderField(fieldName))}
        </div>

        {/* Right Column */}
        <div className="form-column">
          {rightFields.map((fieldName) => renderField(fieldName))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="submit-button"
      >
        {loading ? "🔄 Scoring..." : "🎯 Score Lead"}
      </button>
    </form>
  );
}

export default LeadForm;