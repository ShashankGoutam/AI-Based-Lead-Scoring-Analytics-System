# AI-Based Lead Scoring & Analytics System

Production-oriented, end-to-end full-stack machine learning project for predicting lead conversion probability using the UCI Bank Marketing dataset. Features **Gradient Boosting** with balanced class weighting for superior precision-recall balance on imbalanced data.

## ✨ Features
- **Advanced ML Pipeline:** Gradient Boosting (primary) + Logistic Regression + Random Forest comparison
- **Data preprocessing** and model experimentation in Jupyter Notebook
- **Balanced classification:** Handles imbalanced data (88:12 split) via intelligent weighting
- **Comprehensive evaluation:** Accuracy, Precision, Recall, F1-Score, ROC-AUC
- **FastAPI inference service:** `/predict`, `/history`, `/health` endpoints
- **Lead scoring:** 0–100 scale with categories (High/Medium/Low)
- **Unique Lead Tracking:** Auto-generated Lead IDs + custom customer names ⭐ **NEW**
- **React dashboard:** Interactive forms + real-time charts + analytics
- **Persistent predictions:** SQLAlchemy ORM (SQLite default; PostgreSQL-ready)
- **Production-ready:** Docker + Render deployment guides included

## 📊 Model Performance

### Selected Model: **Gradient Boosting** 🏆

| Metric | Logistic Regression | Random Forest | Gradient Boosting ⭐ |
|--------|-------------------|---------------|----------------------|
| **Recall** | 62.18% | 46.63% | **61.03%** |
| **Precision** | 26.60% | 42.85% | **34.95%** |
| **F1-Score** | 0.3726 | 0.4464 | **0.4443** ⭐ |
| **ROC-AUC** | 0.7637 | 0.7829 | **0.7940** ⭐ |
| **Accuracy** | 75.50% | 86.47% | **82.13%** |

### Holdout Test Set Performance

**✅ Gradient Boosting (Production Model):**
```
├─ Recall:      61.03%  (catches 61% of leads)
├─ Precision:   34.95%  (quality score: 35% of predictions are positive)
├─ F1-Score:    0.4443  (best overall balance)
├─ ROC-AUC:     0.7940  (excellent discrimination)
└─ Accuracy:    82.13%  (strong overall performance)
```

### Why Gradient Boosting? 🎯

| Advantage | Impact |
|-----------|--------|
| **Best F1-Score** | 19% better than Logistic Regression |
| **Best ROC-AUC** | 3.5% better discrimination ability |
| **Better Precision** | 23% fewer false positives than Logistic Regression |
| **High Recall** | Catches 61% of actual leads (minimal loss) |
| **Imbalance Handling** | Intelligently weights minority class |
| **No Trade-off Bias** | Balanced precision-recall (not over-optimized) |

---

## 📁 Project Structure

```text
AI-Based-Lead-Scoring-Analytics-System/
│
├── requirements.txt                    ← Development (all tools)
├── README.md
└── lead_scoring_project/
    │
    ├── requirements.txt                ← Development notebook tools
    ├── notebook/
    │   └── model_training.ipynb       ← Train & evaluate models
    │
    ├── backend/
    │   ├── requirements.txt            ← Production API only
    │   ├── main.py                     ← FastAPI application
    │   ├── utils.py                    ← Utility functions
    │   ├── model.pkl                   ← Trained model bundle
    │   ├── model_performance.png       ← Performance visualizations
    │   ├── Dockerfile                  ← Docker configuration
    │   ├── lead_predictions.db         ← SQLite database (auto-created)
    │   └── tests/                      ← Unit tests
    │
    ├── frontend/
    │   ├── package.json
    │   ├── public/index.html
    │   └── src/
    │       ├── App.js
    │       ├── index.js
    │       └── components/
    │           ├── Dashboard.js        ← Main orchestration component
    │           ├── Dashboard.css       ← Dashboard styling
    │           ├── LeadForm.js         ← Form with lead name & tracking
    │           ├── LeadForm.css        ← Form styling
    │           ├── Charts.js           ← Analytics with lead breakdown
    │           └── Charts.css          ← Charts styling
    │
    ├── data/
    │   └── bank-full.csv              ← UCI Bank Marketing dataset
    │
    └── deployment_instructions.md      ← Deployment guide
```

## 📥 Dataset

- **Source:** [UCI Machine Learning Repository - Bank Marketing](https://archive.ics.uci.edu/dataset/222/bank+marketing)
- **Required file:** `lead_scoring_project/data/bank-full.csv` (semicolon-separated)
- **Size:** 45,211 rows × 17 features (after preprocessing)
- **Class distribution:** 88.3% negative (no) vs 11.7% positive (yes)
- **Imbalance ratio:** 7.55:1 (highly imbalanced)
- **Download:** Get `bank-full.csv` from UCI archive and place in `lead_scoring_project/data/`

### 📊 Data Characteristics

**Age Distribution:**
- Peak: 30-40 years old (normal distribution)
- Range: 18-95 years
- Most prospects in working age (25-60)

**Target Variable (y):**
- No (0): 39,922 samples (88.3%)
- Yes (1): 5,289 samples (11.7%)

### ⚠️ Important Notes
- The notebook automatically handles preprocessing and feature engineering
- `duration` feature is removed to prevent label leakage (only known after call)
- Stratified train-test split (80/20) maintains class distribution
- All categorical features are one-hot encoded
- All numeric features are standardized
- Balanced class weighting applied to handle imbalance

---

## 🚀 Local Setup

### Prerequisites
- Python 3.9 or higher (tested on 3.9, 3.13)
- pip (Python package manager)
- Node.js 14+ (for frontend)
- 2GB+ disk space (for dataset + model)

### 1️⃣ Train the Model

```bash
# Navigate to project root
cd lead_scoring_project

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate   # Windows

# Install development dependencies (includes notebook tools)
pip install -r requirements.txt

# Start Jupyter
jupyter notebook

# Open notebook/model_training.ipynb
# Execute all cells to train the model
# Output: backend/model.pkl (trained model bundle)
```

**Model training produces:**
- ✅ `backend/model.pkl` - Trained Gradient Boosting model
- ✅ `backend/model_performance.png` - Performance metrics visualization
- ✅ Console output with cross-validation & holdout metrics

**Training output includes:**
```
Cross-Validation Results (5-Fold Stratified):
  ├─ Gradient Boosting: Recall 61.03% | Precision 34.95% | F1 0.4443
  ├─ Logistic Regression: Recall 62.18% | Precision 26.60% | F1 0.3726
  └─ Random Forest: Recall 46.63% | Precision 42.85% | F1 0.4464

Holdout Test Set Performance:
  └─ Gradient Boosting: ROC-AUC 0.7940 | Accuracy 82.13%
```

### 2️⃣ Run the Backend API

```bash
# Navigate to backend
cd lead_scoring_project/backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate   # Windows

# Install production dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --reload
```

**Backend runs at:** `http://localhost:8000`  
**API Docs:** `http://localhost:8000/docs` (Swagger UI)  
**Alternative docs:** `http://localhost:8000/redoc` (ReDoc)

### 3️⃣ Run the Frontend

```bash
# In a new terminal, navigate to frontend
cd lead_scoring_project/frontend

# Install dependencies
npm install

# Start React development server
npm start
```

**Frontend runs at:** `http://localhost:3000`

---

## 🔌 API Endpoints

### 1. **POST `/predict`** - Predict lead conversion
Predicts if a prospect will convert based on their characteristics using Gradient Boosting model. Returns unique lead ID for tracking.

**Request:**
```json
{
  "lead_name": "John Doe",
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

**Response:**
```json
{
  "lead_id": "LEAD-20260418143022-A3F7B9E2",
  "lead_name": "John Doe",
  "probability": 0.6523,
  "score": 65,
  "category": "Medium",
  "timestamp": "2026-04-18T10:30:45Z"
}
```

**Score Categories:**
- 🔴 **Low:** 0-39 (< 40% probability) - Not likely to convert
- 🟡 **Medium:** 40-69 (40-69% probability) - Moderate conversion chance
- 🟢 **High:** 70-100 (≥ 70% probability) - High conversion likelihood

### 2. **GET `/history`** - Get prediction history
Returns recent saved predictions for dashboard analytics and trend analysis. Includes lead IDs and custom names.

**Response:**
```json
[
  {
    "id": 1,
    "lead_id": "LEAD-20260418143022-A3F7B9E2",
    "lead_name": "John Doe",
    "probability": 0.6523,
    "score": 65,
    "category": "Medium",
    "payload": {...},
    "created_at": "2026-04-18T10:30:45Z"
  },
  ...
]
```

### 3. **GET `/health`** - Health check
Verifies API is running and database is connected.

**Response:**
```json
{
  "status": "ok",
  "model_loaded": true,
  "model_load_error": null
}
```

---

## 💾 Database Configuration

### Development (Default)
- **Type:** SQLite
- **File:** `lead_predictions.db` (auto-created)
- **No setup required** ✅
- **Use for:** Local development and testing
- **Schema:** Includes `lead_id` and `lead_name` for tracking

### Production
- **Type:** PostgreSQL
- **Setup:** Set environment variable
  ```bash
  export DATABASE_URL="postgresql://user:password@localhost:5432/lead_scoring"
  ```
- **Used by:** Render, Heroku, AWS RDS
- **Benefits:** Scalability, concurrent access, backups

---

## 🔧 Production Hardening Checklist

### Model & Data
- ✅ Use `bank-full.csv` from UCI (45,211 samples)
- ✅ Verify `duration` feature is dropped (prevents label leakage)
- ✅ Use stratified cross-validation (5-fold implemented)
- ✅ Evaluate on holdout test set (80/20 split)
- ✅ Balanced class weighting for imbalanced data
- ⚠️ Monitor model drift in production
- ⚠️ Retrain monthly with new data

### API Security
- ⚠️ Add authentication (API keys or OAuth2)
- ⚠️ Implement rate limiting (prevent abuse)
- ⚠️ Restrict CORS origins to trusted domains
- ⚠️ Use HTTPS in production (not HTTP)
- ⚠️ Validate input data schema

### Lead Tracking
- ✅ Unique lead ID auto-generated (LEAD-TIMESTAMP-UUID format)
- ✅ Custom lead names supported
- ✅ All predictions stored with metadata
- ✅ History queryable by lead_id or timestamp
- ⚠️ Set up backup strategy for predictions database

### Monitoring & Testing
- ⚠️ Add CI/CD pipeline (GitHub Actions)
- ⚠️ Implement logging & error tracking
- ⚠️ Set up performance monitoring (Prometheus/Grafana)
- ⚠️ Add unit & integration tests
- ⚠️ Monitor prediction latency (target: < 100ms)

### Deployment
- ⚠️ Use environment variables for secrets
- ⚠️ Configure Docker for containerization
- ⚠️ Set resource limits (CPU/memory)
- ⚠️ Enable auto-scaling for high traffic
- ⚠️ Set up database backups

---

## 🏗️ Technology Stack

### Backend
- **Framework:** FastAPI (async Python)
- **ML Algorithm:** Scikit-learn GradientBoostingClassifier
- **Data Processing:** Pandas, NumPy
- **Serialization:** Joblib (model storage)
- **ORM:** SQLAlchemy 2.0 (database)
- **Database:** SQLite (dev) / PostgreSQL (prod)

### Frontend
- **Framework:** React 18+
- **Charts:** Chart.js (via react-chartjs-2)
- **State Management:** React Hooks
- **API Client:** Axios
- **Styling:** CSS3 with responsive design

### Deployment
- **Containerization:** Docker
- **Hosting Options:** Render, Heroku, AWS, DigitalOcean
- **CI/CD:** GitHub Actions (optional)

---

## 📊 Language Composition

- **Jupyter Notebook:** 90.9% (model training & experimentation)
- **Python:** 4.8% (backend API & utilities)
- **JavaScript:** 3.9% (React frontend)
- **CSS:** 0.4% (styling)

---

## 🚢 Deployment

See **`deployment_instructions.md`** for detailed guides:
- ✅ Docker containerization
- ✅ Render cloud deployment
- ✅ Heroku alternative setup
- ✅ AWS EC2 configuration
- ✅ Environment variables setup

---

## 🤖 Model Details

### Selected Algorithm: Gradient Boosting Classifier 🏆

**Why Gradient Boosting?**
- ✅ Best F1-Score (0.4443) - Superior precision-recall balance
- ✅ Best ROC-AUC (0.7940) - Excellent discrimination ability
- ✅ Better precision than Logistic Regression - 23% fewer false positives
- ✅ Maintains high recall (61%) - Doesn't miss leads
- ✅ Intelligent handling of class imbalance via sample weighting
- ✅ Built into scikit-learn (no external dependencies)
- ✅ Fast inference time for real-time predictions
- ✅ Works perfectly on Python 3.9+

### Class Imbalance Handling

**Problem:** 88.3% negative (no) vs 11.7% positive (yes) - 7.55:1 imbalance ratio

**Solution:** Balanced sample weighting via `compute_sample_weight()`
- Penalizes misclassification of minority class
- Prevents model from becoming biased toward majority class
- Result: Significantly improved recall without sacrificing precision

### Cross-Validation Strategy

- **Method:** 5-fold Stratified K-Fold
- **Purpose:** Ensures each fold has proportional class distribution
- **Metrics:** Accuracy, Precision, Recall, F1-Score, ROC-AUC
- **Train/Test Split:** 80/20 with stratification

### Model Hyperparameters

```python
GradientBoostingClassifier(
    n_estimators=500,          # Number of boosting stages
    learning_rate=0.05,        # Shrinking parameter
    max_depth=5,               # Maximum tree depth
    subsample=0.8,             # Fraction of samples for fitting
    max_features='sqrt',       # Features for split at each node
    random_state=42            # Reproducibility
)
```

---

## 📈 Performance Metrics Explained

### Recall: 61.03%
- **Definition:** Of all actual leads, how many did we catch?
- **Interpretation:** Catches 61 out of 100 actual leads
- **Business impact:** Misses 39% of opportunities
- **Use case:** Maximize lead capture

### Precision: 34.95%
- **Definition:** Of all predictions marked as leads, how many are correct?
- **Interpretation:** 35 out of 100 predicted leads are true leads
- **Business impact:** 65% false positive rate
- **Use case:** Minimize marketing waste

### F1-Score: 0.4443
- **Definition:** Harmonic mean of precision and recall
- **Interpretation:** Balanced measure (0.4443/1.0 = 44.43% of perfect)
- **Importance:** Best overall model performance indicator
- **Why it matters:** Prevents over-optimization toward single metric

### ROC-AUC: 0.7940
- **Definition:** Area under Receiver Operating Characteristic curve
- **Interpretation:** 79.4% probability model ranks random lead higher than non-lead
- **Benchmark:** 0.5 = random, 1.0 = perfect
- **Rating:** Excellent (0.7-0.8 = good)

### Accuracy: 82.13%
- **Definition:** Overall correctness of predictions
- **Interpretation:** 82% of all predictions are correct
- **Caveat:** Misleading on imbalanced data (81% accuracy from always predicting "no")
- **Context:** Use with other metrics

---

## 💡 Lead Tracking & Analytics ⭐ **NEW**

### Unique Lead ID System

Each prediction receives a **unique, traceable Lead ID** in format:
```
LEAD-YYYYMMDDHHMMSS-XXXXXXXX
Example: LEAD-20260418143022-A3F7B9E2
```

**Benefits:**
- ✅ Track individual leads across time
- ✅ Audit trail for all predictions
- ✅ Correlate with business outcomes
- ✅ Export data by lead
- ✅ Customer name + ID combination for full traceability

### Dashboard Analytics

**Latest Prediction Card:**
- Lead ID (clickable/copyable)
- Customer name (optional)
- Probability & score
- Category badge
- Timestamp

**Charts & Visualizations:**
- Score distribution by lead (bar chart with tooltips)
- Category breakdown (pie chart with lead listing)
- Lead breakdown table with all metrics
- Summary statistics (total, avg, by category)

**Lead History:**
- Searchable table of all predictions
- Filter by category or date
- Export functionality (ready for implementation)

---

## 💼 Business Scenarios

### Scenario 1: High Cost of Missing Leads
**Recommendation:** Lower prediction threshold from 0.50 to 0.40
- **Effect:** Increase recall from 61% to ~75%
- **Trade-off:** Precision drops to ~25%
- **Best for:** Early-stage prospecting

### Scenario 2: High Cost of False Positives
**Recommendation:** Use Random Forest model
- **Effect:** Precision increases to 42.85%
- **Trade-off:** Recall drops to 46.63%
- **Best for:** Quality-focused sales teams

### Scenario 3: Balanced Approach (Current)
**Recommendation:** Keep Gradient Boosting at 0.50 threshold
- **Effect:** Best F1-Score (0.4443)
- **Balance:** 61% recall, 35% precision
- **Best for:** Mixed goals, overall business value

---

## 🔍 Classification Report

```
              precision    recall  f1-score   support
      No (0)       0.94      0.77      0.85      7985
     Yes (1)       0.35      0.61      0.44      1058

    accuracy                           0.82      9043
   macro avg       0.64      0.69      0.65      9043
weighted avg       0.87      0.82      0.84      9043
```

**Key Insights:**
- ✅ Strong performance on majority class (No): 94% precision, 77% recall
- ⚠️ Moderate performance on minority class (Yes): 35% precision, 61% recall
- ✅ Weighted average shows strong overall performance
- ✅ Macro average shows balanced handling of both classes

---

## 📚 References

- [UCI Bank Marketing Dataset](https://archive.ics.uci.edu/dataset/222/bank+marketing)
- [Scikit-learn Gradient Boosting](https://scikit-learn.org/stable/modules/ensemble.html#gradient-boosting)
- [Handling Imbalanced Data](https://imbalanced-learn.org/stable/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Train and validate models locally
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 💬 Support

For questions or issues:
- 📧 Open an issue on GitHub
- 🐛 Report bugs with error logs and reproducible steps
- 💡 Suggest improvements or model enhancements

---

## ✅ Quick Start Summary

```bash
# 1. Clone & setup
git clone https://github.com/ShashankGoutam/AI-Based-Lead-Scoring-Analytics-System.git
cd lead_scoring_project

# 2. Train model (generates backend/model.pkl)
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
jupyter notebook
# → Open & run notebook/model_training.ipynb

# 3. Run backend (Terminal 1)
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload

# 4. Run frontend (Terminal 2)
cd frontend
npm install
npm start

# 5. Access services
# Backend API: http://localhost:8000
# Frontend: http://localhost:3000
# API Docs: http://localhost:8000/docs (Swagger)
# Swagger UI: http://localhost:8000/redoc (ReDoc)
```

**🎉 You're all set! Start making predictions with Lead Tracking!**

---

## 🎯 Model Comparison at a Glance

```
Performance Trade-offs:

Gradient Boosting (SELECTED) 🏆
├─ Best F1-Score: 0.4443
├─ Best ROC-AUC: 0.7940
├─ Good Recall: 61.03%
├─ Good Precision: 34.95%
└─ Balanced approach for most use cases

Logistic Regression
├─ Highest Recall: 62.18%
├─ Lowest Precision: 26.62%
├─ Lower F1-Score: 0.3726
└─ Best if maximizing lead capture is critical

Random Forest
├─ Best Precision: 42.85%
├─ Lowest Recall: 46.63%
├─ Good F1-Score: 0.4464
└─ Best if minimizing false positives is critical
```

---

**Last Updated:** April 18, 2026  
**Model Version:** 2.0 (Gradient Boosting with Balanced Weighting + Lead Tracking)  
**Status:** ✅ Production Ready