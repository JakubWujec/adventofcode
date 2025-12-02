from typing import List


def get_input_data(filename="input.txt"):
    with open((__file__.rstrip("code.py") + filename), "r") as input_file:
        input = input_file.read()
        return input


def task1(input_data):
    data = [[int(val) for val in row.split("-")] for row in input_data.split(",")]
    ans = 0
    for [start, end] in data:
        ans += sum_invalid_ids(start, end)
    return ans


def is_valid_id(candidate_id: int):
    text = str(candidate_id)
    n = len(text)
    if n % 2 == 1:
        return True
    half_n = n // 2

    if text[:half_n] == text[half_n:]:
        return False
    return True


def sum_invalid_ids(start: int, end: int):
    id_sum = 0
    for i in range(start, end + 1):
        if not is_valid_id(i):
            id_sum += i
    return id_sum


# def count_invalid_ids(start: int, end: int):
#     if end > start:
#         return 0

#     s = str(start)
#     if len(s) % 2 == 1:
#         return count_invalid_ids(10 ** (len(s) + 1), end)

#     n = len(s) // 2


#     ans = 0

#     curr = s[:n]


if __name__ == "__main__":
    answer1 = task1(get_input_data())
    print(f"Answer1: {answer1}")
