# AI-Based Lead Scoring & Analytics System

Production-oriented, end-to-end full-stack machine learning project for predicting lead conversion probability using the UCI-style Bank Marketing dataset.

## Features
- Data preprocessing and model experimentation in Jupyter Notebook
- Two models: Logistic Regression and Random Forest
- Evaluation: Accuracy, Precision, Recall, ROC-AUC
- FastAPI inference service (`/predict`, `/history`, `/health`)
- Lead score (0–100) and categories (High/Medium/Low)
- React dashboard with forms + charts
- Prediction persistence with SQLAlchemy (SQLite default; PostgreSQL-ready)
- Deployment-ready docs for Render and Docker

## Project Structure
```text
lead_scoring_project/
│
├── data/
│   └── bank.csv
├── notebook/
│   └── model_training.ipynb
├── backend/
│   ├── main.py
│   ├── model.pkl
│   ├── requirements.txt
│   ├── utils.py
│   └── Dockerfile
├── frontend/
│   ├── package.json
│   ├── public/index.html
│   └── src/
│       ├── App.js
│       ├── index.js
│       └── components/
│           ├── Dashboard.js
│           ├── LeadForm.js
│           └── Charts.js
├── README.md
└── deployment_instructions.md
```


## Dataset Source
- **Primary source (official):** UCI Machine Learning Repository — Bank Marketing Data Set: https://archive.ics.uci.edu/dataset/222/bank+marketing
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
- **Direct CSV used in this repository:** `lead_scoring_project/data/bank.csv` (sample subset for offline/demo workflow).
- For production training, download the full dataset (`bank-additional.zip` / `bank.zip`) from UCI and replace `data/bank.csv` before retraining.
=======
- **Required training file:** `lead_scoring_project/data/bank-full.csv` (semicolon-separated from UCI archive).
- The included `data/bank.csv` is a small demo sample only and should not be used for final model quality claims.
>>>>>>> theirs
=======
- **Required training file:** `lead_scoring_project/data/bank-full.csv` (semicolon-separated from UCI archive).
- The included `data/bank.csv` is a small demo sample only and should not be used for final model quality claims.
>>>>>>> theirs
=======
- **Required training file:** `lead_scoring_project/data/bank-full.csv` (semicolon-separated from UCI archive).
- The included `data/bank.csv` is a small demo sample only and should not be used for final model quality claims.
>>>>>>> theirs

## Local Setup

### 1) Train and Save Model
1. Create Python environment and install dependencies listed in `backend/requirements.txt` plus notebook libraries if needed.
2. Run notebook:
   - Open `notebook/model_training.ipynb`
   - Execute all cells
3. Confirm output file generated:
   - `backend/model.pkl`

### 2) Run Backend
```bash
cd lead_scoring_project/backend
pip install -r requirements.txt
uvicorn main:app --reload
```
Backend runs at: `http://localhost:8000`

### 3) Run Frontend
```bash
cd lead_scoring_project/frontend
npm install
npm start
```
Frontend runs at: `http://localhost:3000`

## API Usage

### POST `/predict`
Example request:
```json
{
  "age": 35,
  "job": "management",
  "marital": "single",
  "education": "tertiary",
  "default": "no",
  "balance": 1200,
  "housing": "yes",
  "loan": "no",
  "contact": "cellular",
  "day": 15,
  "month": "may",
  "duration": 180,
  "campaign": 1,
  "pdays": -1,
  "previous": 0,
  "poutcome": "unknown"
}
```

Example response:
```json
{
  "probability": 0.7342,
  "score": 73,
  "category": "High"
}
```

### GET `/history`
Returns recent saved predictions for dashboard analytics.

## Database Notes
- Default: SQLite (`lead_predictions.db`) for zero-config local run.
- PostgreSQL: Replace `DATABASE_URL` handling in backend for environment-driven config and set Render variable.

## Production Hardening Checklist
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
- Replace sample `data/bank.csv` with full UCI dataset.
=======
- Use `data/bank-full.csv` from UCI for training and evaluation (avoid tiny sample datasets for reporting).
- Consider dropping `duration` for pre-call scoring use-cases to reduce label leakage.
- Use stratified cross-validation + holdout metrics for model selection.
>>>>>>> theirs
=======
- Use `data/bank-full.csv` from UCI for training and evaluation (avoid tiny sample datasets for reporting).
- Consider dropping `duration` for pre-call scoring use-cases to reduce label leakage.
- Use stratified cross-validation + holdout metrics for model selection.
>>>>>>> theirs
=======
- Use `data/bank-full.csv` from UCI for training and evaluation (avoid tiny sample datasets for reporting).
- Consider dropping `duration` for pre-call scoring use-cases to reduce label leakage.
- Use stratified cross-validation + holdout metrics for model selection.
>>>>>>> theirs
- Re-run notebook to produce trained `backend/model.pkl`.
- Add auth/rate limiting for public APIs.
- Restrict CORS origins to trusted frontends.
- Add CI tests and monitoring.

## Deployment
See `deployment_instructions.md` for Render and Docker deployment steps.
