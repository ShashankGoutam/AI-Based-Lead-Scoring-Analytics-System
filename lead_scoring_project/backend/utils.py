"""Utility helpers for lead score post-processing."""

from datetime import datetime
from typing import Literal
from uuid import uuid4


def generate_lead_id() -> str:
    """
    Generate a unique lead ID with timestamp and UUID.
    
    Format: LEAD-YYYYMMDDHHMMSS-XXXXXXXX
    Example: LEAD-20260418143022-A3F7B9E2
    
    Returns:
        str: Unique lead identifier
    """
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    unique_suffix = str(uuid4())[:8].upper()
    return f"LEAD-{timestamp}-{unique_suffix}"


def probability_to_score(probability: float) -> int:
    """Convert probability [0, 1] to integer score [0, 100]."""
    bounded_probability = max(0.0, min(1.0, probability))
    return int(round(bounded_probability * 100))


def score_to_category(score: int) -> Literal["Low", "Medium", "High"]:
    """Map lead score to business-friendly bucket."""
    if score >= 70:
        return "High"
    if score >= 40:
        return "Medium"
    return "Low"