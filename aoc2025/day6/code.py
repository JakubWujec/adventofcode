from typing import List
import math


def get_input_data(filename="input.txt"):
    with open((__file__.rstrip("code.py") + filename), "r") as input_file:
        input = input_file.read()
        return input


def process_input(input_data: str):
    lines = input_data.split("\n")
    result = [line.split() for line in lines if line]
    operation_lines = result.pop()
    number_lines = [list(map(int, row)) for row in result]
    return (number_lines, operation_lines)


def task1(input_data: str):
    lines, operations = process_input(input_data)
    lines_T = transpose(lines)

    return sum(
        calculate_line(line, operations[idx]) for idx, line in enumerate(lines_T)
    )


def calculate_line(line: List[int], operation: str):
    if operation == "+":
        return sum(line)
    if operation == "*":
        return math.prod(line)
    raise Exception("Unknown operation")


def transpose(arr):
    return [list(i) for i in zip(*arr)]


def task2(input_data: str):
    return 0


if __name__ == "__main__":
    input_data = get_input_data("test_input.txt")

    answer1 = task1(input_data)
    print(f"Answer1: {answer1}")

    answer2 = task2(input_data)
    print(f"Answer2: {answer2}")
