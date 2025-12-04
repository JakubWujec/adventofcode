import unittest
import pytest
from day4.code import (
    get_input_data,
    task1,
    task2,
)


class TestExampleOne:
    @classmethod
    def setup_class(cls):
        """Setup any state you want to share across tests."""
        test_file = "test_input.txt"
        cls.input_data = get_input_data(test_file)

    def test_first_task(self):
        assert task1(self.input_data) == 13

    # @pytest.mark.parametrize(
    #     "bank,expected_joltage",
    #     [
    #         ("987654321111111", 98),
    #         ("811111111111119", 89),
    #         ("234234234234278", 78),
    #         ("818181911112111", 92),
    #     ],
    # )
    # def test_calculate_bank_joltage(self, bank, expected_joltage):
    #     assert calculate_bank_joltage(bank, 2) == expected_joltage

    # @pytest.mark.parametrize(
    #     "bank,expected_joltage",
    #     [
    #         ("987654321111111", 987654321111),
    #         ("811111111111119", 811111111119),
    #         ("234234234234278", 434234234278),
    #         ("818181911112111", 888911112111),
    #     ],
    # )
    # def test_calculate_bank_joltage2(self, bank, expected_joltage):
    #     assert calculate_bank_joltage(bank, 12) == expected_joltage

    # def test_calculate_bank_joltage2_is_not_too_low(self):
    #     input_data = get_input_data("input.txt")
    #     assert task2(input_data) > 169276109288631


if __name__ == "__main__":
    unittest.main()
