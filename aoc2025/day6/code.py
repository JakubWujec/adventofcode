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

    return (result, operation_lines)


def task1(input_data: str):
    lines, operations = process_input(input_data)
    number_lines = [list(map(int, row)) for row in lines]
    number_lines_T = transpose(number_lines)

    return sum(
        calculate_line(line, operations[idx]) for idx, line in enumerate(number_lines_T)
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
    data = input_data.split("\n")
    data = transpose(input_data.split("\n"))
    answer = 0
    groups = []
    curr_group = []
    for arr in data:
        if len(arr) == arr.count(" "):
            groups.append(curr_group)
            curr_group = []
        else:
            curr_group.append(arr)
    groups.append(curr_group)

    for group in groups:
        operation = group[0].pop()
        answer += calculate_line([int("".join(arr)) for arr in group], operation)
        print(group)

    return answer


if __name__ == "__main__":
    input_data = get_input_data()
    # print(input_data)

    answer1 = task1(input_data)
    print(f"Answer1: {answer1}")

    answer2 = task2(input_data)
    print(f"Answer2: {answer2}")
