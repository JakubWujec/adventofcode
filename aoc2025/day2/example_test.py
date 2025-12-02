import unittest

from day2.code import get_input_data, task1


class TestExample(unittest.TestCase):
    def setUp(self) -> None:
        test_file = "test_input.txt"
        self.input_data = get_input_data(test_file)

    def test_first_task(self):
        self.assertEqual(task1(self.input_data), 1227775554)

    # def test_second_task(self):
    #     self.assertEqual(task2(self.commands), 6)


if __name__ == "__main__":
    unittest.main()
