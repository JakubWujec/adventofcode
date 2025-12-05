from typing import List


def get_input_data(filename="input.txt"):
    with open((__file__.rstrip("code.py") + filename), "r") as input_file:
        input = input_file.read()
        return input


def process_input(input_data: str):
    rows = input_data.split()
    ranges = []
    ids = []
    for row in rows:
        if "-" in row:
            s, e = row.split("-")
            ranges.append([int(s), int(e)])
        else:
            ids.append(int(row))

    return (merge_overlapping_ranges(ranges), ids)


def merge_overlapping_ranges(ranges):
    ranges.sort()
    rstack = []
    for r in ranges:
        rstack.append(r)
        while len(rstack) >= 2 and rstack[-1][0] <= rstack[-2][1]:
            pop1 = rstack.pop()
            pop2 = rstack.pop()
            rstack.append([min(pop1[0], pop2[0]), max(pop1[1], pop2[1])])
    return rstack


def binary_check(ranges, check):
    left = 0
    right = len(ranges)

    while left < right:
        mid = left + (right - left) // 2
        mid_range = ranges[mid]

        if check < mid_range[0]:
            right = mid
        elif check > mid_range[1]:
            left = mid + 1
        else:
            return True

    return


def task1(input_data: str):
    ranges, ids = process_input(input_data)
    answer = 0

    for ingredient_id in ids:
        if binary_check(ranges, ingredient_id):
            print(ingredient_id)
            answer += 1

    return answer


def task2(input_data: str):
    ranges, ids = process_input(input_data)
    answer = 0
    for [start, end] in ranges:
        answer += end - start + 1
    return answer


if __name__ == "__main__":
    input_data = get_input_data()

    answer1 = task1(input_data)
    print(f"Answer1: {answer1}")

    answer2 = task2(input_data)
    print(f"Answer2: {answer2}")
