# Advent of code Year 2020 Day 11 solution
# Author = ?
# Date = December 2020
import copy

with open((__file__.rstrip("code.py") + "input.txt"), 'r') as input_file:
    input = input_file.read()

grid = input.split('\n')
grid = [list(line) for line in grid]
grid_rows = len(grid)
grid_cols = len(grid[0])
directions = [(i, j) for i in [-1, 0, 1] for j in [-1, 0, 1]]
directions.remove((0, 0))
FLOOR = '.'
EMPTY = 'L'
OCCUPIED = '#'


def print_grid(_grid):
    for r in range(len(_grid)):
        for c in range(len(_grid[0])):
            print(_grid[r][c], end='')
        print()


def is_valid_indexing(r, c):
    return 0 <= r < grid_rows and 0 <= c < grid_cols


def get_neighbours(_grid, _row, _col):
    neighbours = [_grid[_row + row][_col + col]
                  if is_valid_indexing(_row + row, _col + col)
                  else None
                  for (row, col) in directions]
    neighbours = list(filter(lambda x: x is not None, neighbours))
    return neighbours


def get_visible_seats(_grid, _row, _col):
    visible_seats = []
    for (r, c) in directions:
        m = 1
        while is_valid_indexing(_row + r * m, _col + c * m):
            seat = _grid[_row + r * m][_col + c * m]
            if seat == EMPTY:
                visible_seats.append(EMPTY)
                break
            if seat == OCCUPIED:
                visible_seats.append(OCCUPIED)
                break
            m += 1
    return visible_seats


def count_occupied_seats(_grid, neighbours_count_func, neighbours_limit):
    changes = 1
    while changes > 0:
        grid_copy = copy.deepcopy(_grid)
        changes = 0
        for _row in range(len(grid_copy)):
            for _col in range(len(grid_copy[0])):
                neighbours = neighbours_count_func(grid_copy, _row, _col)
                seat = grid_copy[_row][_col]
                if seat == EMPTY:
                    if neighbours.count(OCCUPIED) == 0:
                        _grid[_row][_col] = OCCUPIED
                        changes += 1
                elif seat == OCCUPIED:
                    if neighbours.count(OCCUPIED) >= neighbours_limit:
                        _grid[_row][_col] = EMPTY
                        changes += 1
    return [elem for line in _grid for elem in line].count(OCCUPIED)


def z1():
    global grid
    grid_copy = copy.deepcopy(grid)
    return count_occupied_seats(grid_copy, get_neighbours, 4)


def z2():
    global grid
    grid_copy = copy.deepcopy(grid)
    return count_occupied_seats(grid_copy, get_visible_seats, 5)

print("Part One : " + str(z1()))

print("Part Two : " + str(z2()))
