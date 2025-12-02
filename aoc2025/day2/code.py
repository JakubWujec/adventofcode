from typing import List, Protocol
import re


def get_input_data(filename="input.txt"):
    with open((__file__.rstrip("code.py") + filename), "r") as input_file:
        input = input_file.read()
        return input


class Validator(Protocol):
    def is_valid(self, num: int) -> bool: ...


class DoubledPatternValidator:
    def is_valid(self, num: int):
        text = str(num)
        n = len(text)
        if n % 2 == 1:
            return True
        half_n = n // 2

        if text[:half_n] == text[half_n:]:
            return False
        return True


class RepeatedPatternValidator:
    def is_valid(self, num: int):
        text = str(num)
        n = len(text)

        for pat_len in range(1, n):
            pattern = re.compile(f"^({text[:pat_len]})+$")
            if pattern.fullmatch(text):
                return False
        return True


def task(input_data, validator: Validator):
    data = [[int(val) for val in row.split("-")] for row in input_data.split(",")]
    return sum(sum_invalid_ids(validator, start, end) for [start, end] in data)


def sum_invalid_ids(validator: Validator, start: int, end: int):
    return sum(i for i in range(start, end + 1) if not validator.is_valid(i))


if __name__ == "__main__":
    input_data = get_input_data()

    answer1 = task(input_data, DoubledPatternValidator())
    print(f"Answer1: {answer1}")

    answer2 = task(input_data, RepeatedPatternValidator())
    print(f"Answer2: {answer2}")
