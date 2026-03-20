# Deployment Instructions (Render)

## 1) Deploy Backend (FastAPI)
1. Push repository to GitHub.
2. In Render, click **New +** → **Web Service**.
3. Connect repo and set:
   - **Root Directory:** `lead_scoring_project/backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variable(s):
   - `DATABASE_URL` (optional, PostgreSQL URL)
5. Deploy and verify `/health` endpoint.

## 2) Deploy Frontend (React)
1. Create another Render **Static Site**.
2. Configure:
   - **Root Directory:** `lead_scoring_project/frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`
3. Add environment variable:
   - `REACT_APP_API_BASE_URL=https://<your-backend-service>.onrender.com`
4. Deploy and open dashboard URL.

## 3) PostgreSQL on Render (Optional)
1. Provision Render PostgreSQL instance.
2. Copy internal/external connection URL.
3. Set backend `DATABASE_URL` to that value.
4. Restart backend service.

## 4) Optional Docker Deployment
From repo root:
```bash
docker build -t lead-scoring-api -f lead_scoring_project/backend/Dockerfile .
docker run -p 8000:8000 lead-scoring-api
```
