"""FastAPI application for serving lead scoring predictions."""

import os
from datetime import datetime
from pathlib import Path
from typing import Literal

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import JSON, DateTime, Float, Integer, String, create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker

from utils import probability_to_score, score_to_category


class Base(DeclarativeBase):
    """Base SQLAlchemy model class."""


class PredictionRecord(Base):
    """Stores prediction requests and responses for analytics/history."""

    __tablename__ = "predictions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    payload: Mapped[dict] = mapped_column(JSON, nullable=False)
    probability: Mapped[float] = mapped_column(Float, nullable=False)
    score: Mapped[int] = mapped_column(Integer, nullable=False)
    category: Mapped[str] = mapped_column(String(16), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class LeadFeatures(BaseModel):
    """Validated payload expected by the trained model."""

    age: int = Field(..., ge=18, le=100)
    job: str
    marital: str
    education: str
    default: Literal["yes", "no"]
    balance: float
    housing: Literal["yes", "no"]
    loan: Literal["yes", "no"]
    contact: str
    day: int = Field(..., ge=1, le=31)
    month: str
    duration: int = Field(..., ge=0)
    campaign: int = Field(..., ge=1)
    pdays: int
    previous: int = Field(..., ge=0)
    poutcome: str


class PredictionResponse(BaseModel):
    probability: float
    score: int
    category: Literal["Low", "Medium", "High"]


APP_DIR = Path(__file__).resolve().parent
MODEL_PATH = APP_DIR / "model.pkl"

MODEL = None
FEATURE_COLUMNS: list[str] = []
MODEL_LOAD_ERROR: str | None = None


def load_model_bundle() -> None:
    """Attempt to load serialized model bundle from disk."""
    global MODEL, FEATURE_COLUMNS, MODEL_LOAD_ERROR
    try:
        bundle = joblib.load(MODEL_PATH)
        MODEL = bundle["model"]
        FEATURE_COLUMNS = bundle["feature_columns"]
        MODEL_LOAD_ERROR = None
    except Exception as exc:  # pragma: no cover - startup guard
        MODEL = None
        FEATURE_COLUMNS = []
        MODEL_LOAD_ERROR = str(exc)


load_model_bundle()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./lead_predictions.db")
engine = create_engine(DATABASE_URL, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI-Based Lead Scoring & Analytics System", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check() -> dict:
    """Liveness/readiness probe endpoint."""
    return {
        "status": "ok",
        "model_loaded": MODEL is not None,
        "model_load_error": MODEL_LOAD_ERROR,
    }


@app.post("/predict", response_model=PredictionResponse)
def predict_lead(features: LeadFeatures) -> PredictionResponse:
    """Predict conversion probability and return scoring metadata."""
    if MODEL is None:
        raise HTTPException(
            status_code=503,
            detail="Model is not loaded. Run notebook/model_training.ipynb to generate backend/model.pkl.",
        )

    try:
        payload = features.model_dump()
        frame = pd.DataFrame([payload], columns=FEATURE_COLUMNS)
        probability = float(MODEL.predict_proba(frame)[0][1])
        score = probability_to_score(probability)
        category = score_to_category(score)

        with SessionLocal() as session:
            session.add(
                PredictionRecord(
                    payload=payload,
                    probability=probability,
                    score=score,
                    category=category,
                )
            )
            session.commit()

        return PredictionResponse(probability=round(probability, 4), score=score, category=category)
    except Exception as exc:  # pragma: no cover - defensive API guard
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}") from exc


@app.get("/history")
def prediction_history(limit: int = 50) -> list[dict]:
    """Return historical predictions for dashboard analytics."""
    safe_limit = int(np.clip(limit, 1, 500))
    with SessionLocal() as session:
        records = (
            session.query(PredictionRecord)
            .order_by(PredictionRecord.created_at.desc())
            .limit(safe_limit)
            .all()
        )

    return [
        {
            "id": record.id,
            "payload": record.payload,
            "probability": record.probability,
            "score": record.score,
            "category": record.category,
            "created_at": record.created_at.isoformat(),
        }
        for record in records
    ]
