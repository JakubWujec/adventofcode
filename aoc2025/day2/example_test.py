import unittest

import pytest

from day2.code import (
    RepeatedPatternValidator,
    DoubledPatternValidator,
    get_input_data,
    sum_invalid_ids,
    task,
)


class TestExample:
    @classmethod
    def setup_class(cls):
        """Setup any state you want to share across tests."""
        test_file = "test_input.txt"
        cls.input_data = get_input_data(test_file)

    def test_first_task(self):
        assert task(self.input_data, DoubledPatternValidator()) == 1227775554

    def test_second_task(self):
        assert task(self.input_data, RepeatedPatternValidator()) == 4174379265

    @pytest.mark.parametrize(
        "start,end,expected",
        [(11, 22, 33), (95, 115, 210), (998, 1012, 2009)],
    )
    def test_sum_invalid_ids2(self, start, end, expected):
        assert sum_invalid_ids(RepeatedPatternValidator(), start, end) == expected


class TestRepeatedPatternValidator:
    @classmethod
    def setup_class(cls):
        cls.validator = RepeatedPatternValidator()

    @pytest.mark.parametrize("text,expected", [(11, False), (12, True), (22, False)])
    def test_validator(self, text, expected):
        assert self.validator.is_valid(text) == expected


if __name__ == "__main__":
    unittest.main()
