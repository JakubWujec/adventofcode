# Advent of code Year 2020 Day 1 solution
# Author = ?
# Date = December 2020

with open((__file__.rstrip("code.py") + "input.txt"), 'r') as input_file:
    input = input_file.read()

input_list: [int] = list(map(int, input.split('\n')))
n = len(input_list)


def z1(l: [int], n: int):
    for index1 in range(n):
        for index2 in range(index1 + 1, n):
            if l[index1] + l[index2] == 2020:
                return l[index1] * l[index2]


def z2(l: [int], n: int):
    for index1 in range(n):
        for index2 in range(index1 + 1, n):
            for index3 in range(index2 + 1, n):
                if l[index1] + l[index2] + l[index3] == 2020:
                    return l[index1] * l[index2] * l[index3]


print("Part One : " + str(z1(input_list, n)))

print("Part Two : " + str(z2(input_list, n)))
