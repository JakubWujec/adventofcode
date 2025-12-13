import math
import heapq


def get_input_data(filename="input.txt"):
    with open((__file__.rstrip("code.py") + filename), "r") as input_file:
        input = input_file.read()
        return input


def process_data(input_data):
    lines = input_data.split("\n")
    return [[int(x) for x in line.split(",")] for line in lines]


def task1(input_data: str, number_of_connections=1000):
    answer = 0

    return answer


def task2(input_data: str):
    answer = 0

    return answer


if __name__ == "__main__":
    input_data = get_input_data()

    answer1 = task1(input_data)
    print(f"Answer1: {answer1}")

    answer2 = task2(input_data)
    print(f"Answer2: {answer2}")
