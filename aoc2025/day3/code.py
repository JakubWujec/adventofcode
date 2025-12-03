import heapq
from typing import List, Protocol, Tuple
import re


def get_input_data(filename="input.txt"):
    with open((__file__.rstrip("code.py") + filename), "r") as input_file:
        input = input_file.read()
        return input


# def calculate_bank_joltage(bank: str) -> int:
#     first_digit = "0"
#     first_digit_index = -1

#     for i in range(len(bank) - 1):
#         digit = bank[i]
#         if digit > first_digit:
#             first_digit = digit
#             first_digit_index = i

#     second_digit = "0"
#     for i in range(first_digit_index + 1, len(bank)):
#         digit = bank[i]
#         if digit > second_digit:
#             second_digit = digit

#     return 10 * int(first_digit) + int(second_digit)


def calculate_bank_joltage(bank: str, batteries: int):
    heap = []
    n = len(bank)
    first = "0"

    for i in range(n - 1, -1, -1):
        if len(heap) < batteries or bank[i] >= first:
            heapq.heappush(heap, (bank[i], i))
            first = bank[i]

        while len(heap) > batteries:
            heapq.heappop(heap)
    heap.sort(key=lambda x: x[1])
    s = "".join([item[0] for item in heap])
    return int(s)


def task1(input_data: str):
    banks = input_data.split("\n")
    banks = [b for b in banks if len(b) > 0]
    return sum(calculate_bank_joltage(bank, 2) for bank in banks)


def task2(input_data: str):
    banks = input_data.split("\n")
    banks = [b for b in banks if len(b) > 0]
    return sum(calculate_bank_joltage(bank, 12) for bank in banks)


if __name__ == "__main__":
    input_data = get_input_data()
    answer1 = task1(input_data)
    print(f"Answer1: {answer1}")
