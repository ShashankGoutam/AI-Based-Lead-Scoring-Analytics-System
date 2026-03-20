FROM python:3.11-slim

WORKDIR /app
COPY lead_scoring_project/backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY lead_scoring_project/backend /app
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
