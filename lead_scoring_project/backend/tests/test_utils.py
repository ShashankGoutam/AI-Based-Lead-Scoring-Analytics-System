"""Unit tests for score utility helpers."""

import unittest
from pathlib import Path
import sys

BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))

from utils import probability_to_score, score_to_category


class UtilsTests(unittest.TestCase):
    """Validate score conversion and category thresholds."""

    def test_probability_to_score_bounds(self) -> None:
        self.assertEqual(probability_to_score(-0.5), 0)
        self.assertEqual(probability_to_score(1.5), 100)

    def test_probability_to_score_rounding(self) -> None:
        self.assertEqual(probability_to_score(0.734), 73)
        self.assertEqual(probability_to_score(0.736), 74)

    def test_score_to_category_thresholds(self) -> None:
        self.assertEqual(score_to_category(39), "Low")
        self.assertEqual(score_to_category(40), "Medium")
        self.assertEqual(score_to_category(69), "Medium")
        self.assertEqual(score_to_category(70), "High")


if __name__ == "__main__":
    unittest.main()
