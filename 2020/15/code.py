# Advent of code Year 2020 Day 15 solution
# Author = ?
# Date = December 2020

with open((__file__.rstrip("code.py") + "input.txt"), 'r') as input_file:
    input = input_file.read()

input_numbers = list(map(int, input.split(',')))


def z1(numbers: [int], _limit):
    numbers = numbers.copy()
    last_spoken = {}
    for index, num in enumerate(numbers):
        last_spoken[num] = index
    start = len(numbers)

    for i in range(start, _limit):
        last_number = numbers[i - 1]
        if last_number not in last_spoken.keys():
            # say 0
            numbers.append(0)
            last_spoken[last_number] = i - 1
            if 0 not in last_spoken.keys():
                last_spoken[0] = i
        else:
            numbers.append(i - 1 - last_spoken[last_number])
            last_spoken[last_number] = i - 1
    return numbers[-1]


print("Part One : " + str(z1(input_numbers, 2020)))
print("Part Two : " + str(z1(input_numbers, 30000000)))
