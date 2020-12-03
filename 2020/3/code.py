# Advent of code Year 2020 Day 3 solution
# Author = ?
# Date = December 2020

with open((__file__.rstrip("code.py") + "input.txt"), 'r') as input_file:
    input = input_file.read()

input_list: [str] = input.split('\n')
TREE = '#'
FREE = '.'


def z1(rows: [str], slope_right, slope_down):
    row = 0
    col = 0
    counter = 0
    cols = len(rows[0])
    while row < len(input_list):
        if input_list[row][col % cols] == TREE:
            counter += 1
        row += slope_down
        col += slope_right
    return counter


def z2():
    counter = 1
    for (s_right, s_down) in [(1, 1), (3, 1), (5, 1), (7, 1), (1, 2)]:
        counter *= z1(input_list, s_right, s_down)
    return counter


print("Part One : " + str(z1(input_list, 3, 1)))
print("Part Two : " + str(z2()))
