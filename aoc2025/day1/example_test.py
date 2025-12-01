import unittest

from day1.code import get_input, task1, task2


class TestExample(unittest.TestCase):
    def setUp(self) -> None:
        test_file = "test_input.txt"
        self.commands = get_input(test_file)

    def test_first_task(self):
        self.assertEqual(task1(self.commands), 3)

    def test_second_task(self):
        self.assertEqual(task2(self.commands), 6)


if __name__ == "__main__":
    unittest.main()
