"""Utility helpers for lead score post-processing."""

from typing import Literal


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
