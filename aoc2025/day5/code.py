from typing import List


def get_input_data(filename="input.txt"):
    with open((__file__.rstrip("code.py") + filename), "r") as input_file:
        input = input_file.read()
        return input


def task1(input_data: str):
    return 0


def task2(input_data: str):
    return 0


if __name__ == "__main__":
    input_data = get_input_data()
    answer1 = task1(input_data)
    print(f"Answer1: {answer1}")

    answer2 = task2(input_data)
    print(f"Answer2: {answer2}")
