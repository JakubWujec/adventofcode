# Advent of code Year 2020 Day 12 solution
# Author = ?
# Date = December 2020

from operator import add, mul

with open((__file__.rstrip("code.py") + "input.txt"), 'r') as input_file:
    input = input_file.read()

commands = input.split('\n')

# (lat, lon)
directions = {
    'N': (0, 1),
    'E': (1, 0),
    'S': (0, -1),
    'W': (-1, 0),
}


def move(current: (int, int), change: (int, int), times: int):
    return tuple(map(add, current, tuple(map(lambda x: x*times, change))))


def rotate(current_direction, degrees, right: bool):
    rotates = (degrees // 90) % 4
    if not right:
        rotates = 4 - rotates
    for _ in range(rotates):
        lat, lon = current_direction
        current_direction = (lon, -lat)
    return current_direction


def z1(_commands):
    current_direction = (1, 0)
    current_position = (0, 0)
    for command in _commands:
        instruction = command[0]
        value = int(command[1:])
        if instruction == 'R':
            current_direction = rotate(current_direction, value, True)
        elif instruction == 'L':
            current_direction = rotate(current_direction, value, False)
        elif instruction == 'F':
            current_position = move(current_position, current_direction, value)
        else:
            current_position = move(current_position, directions[instruction], value)
    return abs(current_position[0]) + abs(current_position[1])


def z2(_commands):
    current_direction = (10, 1)
    current_position = (0, 0)

    for command in _commands:
        instruction = command[0]
        val = int(command[1:])
        if instruction == 'R':
            current_direction = rotate(current_direction, val, True)
        elif instruction == 'L':
            current_direction = rotate(current_direction, val, False)
        elif instruction == 'F':
            current_position = move(current_position, current_direction, val)
        else:
            current_direction = move(current_direction, directions[instruction], val)
    return abs(current_position[0]) + abs(current_position[1])



print("Part One : " + str(z1(commands)))

print("Part Two : " + str(z2(commands)))
