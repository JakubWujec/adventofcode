import unittest
from day12.code import (
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
        assert task1(self.input_data) == 5

    # def test_second_task(self):
    #     assert task2(self.input_data) == 25272


# class TestProductionOne:
#     @classmethod
#     def setup_class(cls):
#         """Setup any state you want to share across tests."""
#         test_file = "input.txt"
#         cls.input_data = get_input_data(test_file)

#     def test_first_task(self):
#         assert task1(self.input_data) < 646700

#     # def test_second_task(self):
#     #     assert task2(self.input_data) == 40


if __name__ == "__main__":
    unittest.main()
