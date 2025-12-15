import unittest
from day9.code import (
    Point,
    get_input_data,
    task1,
    task2,
    process_data,
    get_outside_points_by_row,
)


class TestInput2:
    @classmethod
    def setup_class(cls):
        """Setup any state you want to share across tests."""
        test_file = "test_input2.txt"
        cls.input_data = get_input_data(test_file)
        cls.data = process_data(get_input_data(test_file))

    def test_second_task(self):
        assert task2(self.input_data) == 10

    def test_number_of_nodes(self):
        assert len(self.data) == 12

    def test_outside_dots(self):
        points = [Point(x, y) for [x, y] in self.data]
        outside_dots = get_outside_points_by_row(points)
        dots_count = 0
        for k, v in outside_dots.items():
            dots_count += len(set(v))
        assert dots_count == 24


if __name__ == "__main__":
    unittest.main()
