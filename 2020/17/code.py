# Advent of code Year 2020 Day 17 solution
# Author = ?
# Date = December 2020
import copy
import numpy as np

with open((__file__.rstrip("code.py") + "input.txt"), 'r') as input_file:
    input = input_file.read()

cube = [list(map(list, input.split('\n')))]
hipercube = [[list(map(list, input.split('\n')))]]
x, y, z = len(cube[0][0]), len(cube[0]), len(cube)
ACTIVE = '#'
INACTIVE = '.'


def get_inactive_structure(*dims):
    return np.full(dims, INACTIVE).tolist()


def expand_cube(old_cube):
    new_cube = copy.deepcopy(old_cube)
    x, y, z = len(new_cube[0][0]), len(new_cube[0]), len(new_cube)
    for layer in new_cube:
        for row in layer:
            row.append(INACTIVE)
            row.insert(0, INACTIVE)
        layer.append(get_inactive_structure(x + 2))
        layer.insert(0, get_inactive_structure(x + 2))

    new_cube.append(get_inactive_structure(y + 2, x + 2))
    new_cube.insert(0, get_inactive_structure(y + 2, x + 2))
    return new_cube


def expand_hipercube(old_hipercube):
    new_hipercube = copy.deepcopy(old_hipercube)

    for i, cube in enumerate(new_hipercube):
        new_hipercube[i] = expand_cube(cube)

    x, y, z, w = len(new_hipercube[0][0][0]), len(new_hipercube[0][0]), \
                 len(new_hipercube[0]), len(new_hipercube)

    new_hipercube.append(get_inactive_structure(z, y, x))
    new_hipercube.insert(0, get_inactive_structure(z, y, x))
    return new_hipercube


def print_cube(cube):
    for layer in cube:
        for row in layer:
            print(row)
        print()


def print_hipercube(hipercube):
    for w, cube in enumerate(hipercube):
        for z, layer in enumerate(cube):
            print('w: ', w, 'z:', z)
            for row in layer:
                print(row)
            print()
        print()


def get_neighbours_of_hipercube(hipercube, x, y, z, w):
    neighbours = []
    for i in [-1, 0, 1]:
        for j in [-1, 0, 1]:
            for k in [-1, 0, 1]:
                for l in [-1, 0, 1]:
                    if [i, j, k, l] != [0, 0, 0, 0]:
                        try:
                            if hipercube[w + i][z + j][y + k][x + l]:
                                neighbours.append(hipercube[w + i][z + j][y + k][x + l])
                        except IndexError:
                            neighbours.append(INACTIVE)
    return neighbours


def get_neighbours(cube, x, y, z):
    neighbours = []
    for i in [-1, 0, 1]:
        for j in [-1, 0, 1]:
            for k in [-1, 0, 1]:
                if [i, j, k] != [0, 0, 0]:
                    try:
                        if cube[z + i][y + j][x + k]:
                            neighbours.append(cube[z + i][y + j][x + k])
                    except IndexError:
                        neighbours.append(INACTIVE)
    return neighbours


def count(pocket: [], to_count):
    return np.array(pocket).flatten().tolist().count(to_count)


def z1(new_cube):
    rounds = 6
    for i in range(rounds):
        old_cube = expand_cube(new_cube)
        new_cube = copy.deepcopy(old_cube)
        for z, layer in enumerate(old_cube):
            for y, row in enumerate(layer):
                for x, s_cube in enumerate(row):
                    neighbours = get_neighbours(old_cube, x, y, z)
                    active_count = neighbours.count(ACTIVE)
                    if s_cube == ACTIVE:
                        if not (2 <= active_count <= 3):
                            new_cube[z][y][x] = INACTIVE
                    elif s_cube == INACTIVE:
                        if active_count == 3:
                            new_cube[z][y][x] = ACTIVE
    return count(new_cube, ACTIVE)


def z2(new_hipercube):
    rounds = 6
    for i in range(rounds):
        old_hipercube = expand_hipercube(new_hipercube)
        new_hipercube = copy.deepcopy(old_hipercube)
        for w, cube in enumerate(old_hipercube):
            for z, layer in enumerate(cube):
                for y, row in enumerate(layer):
                    for x, s_cube in enumerate(row):
                        neighbours = get_neighbours_of_hipercube(old_hipercube, x, y, z, w)
                        active_count = neighbours.count(ACTIVE)
                        if s_cube == ACTIVE:
                            if not (2 <= active_count <= 3):
                                new_hipercube[w][z][y][x] = INACTIVE
                        elif s_cube == INACTIVE:
                            if active_count == 3:
                                new_hipercube[w][z][y][x] = ACTIVE
    return count(new_hipercube, ACTIVE)


print("Part One : " + str(z1(cube)))

print("Part Two : " + str(z2(hipercube)))
