# Advent of code Year 2020 Day 20 solution
# Author = ?
# Date = December 2020
import math
import copy
import random


class Tile:
    def __init__(self, tid, tile_data):
        self.tid = tid
        self.tile_data = tile_data

    def rotate(self):
        self.tile_data = [*zip(*self.tile_data)]

    def flip(self):
        #lustrzane odbicie
        pass

    def left(self):
        return ''.join([row[0] for row in self.tile_data])

    def right(self):
        return ''.join([row[-1] for row in self.tile_data])

    def top(self):
        return self.tile_data[0]

    def bottom(self):
        return self.tile_data[-1]

    def borders(self):
        return [self.top(), self.right(), self.bottom(), self.left()]

    def __repr__(self):
        return str('Tile (id: ' + str(self.tid) + ' data:' + str(self.tile_data))

    def __str__(self):
        return str(self.tile_data)


def find_uniques(data):
    unique = []
    seen = set()
    for item in data:
        if item in seen:
            if item in unique:
                unique.remove(item)
        else:
            seen.add(item)
            unique.append(item)
    return unique


with open((__file__.rstrip("code.py")+"input.txt"), 'r') as input_file:
    input = input_file.read()

input = input.split('\n\n')
tiles_dict = {}
N = int(math.sqrt(len(input)))
ALL_BORDERS = []


for tile_input in input:
    tile_input = tile_input.split('\n')
    title = tile_input.pop(0)
    tile_id = int(title.replace('Tile ', '').replace(':', ''))
    new_tile = Tile(tile_id, tile_input)
    tiles_dict[tile_id] = new_tile
    ALL_BORDERS = ALL_BORDERS + new_tile.borders()

print(ALL_BORDERS)

OUTERMOST_EDGES = find_uniques(ALL_BORDERS)
print(len(ALL_BORDERS), len(OUTERMOST_EDGES))


def z1(tiles: [Tile]):
    corner_tiles = list(filter(lambda t: len(set(t.borders()).intersection(OUTERMOST_EDGES)) == 2, tiles))
    corner_tiles_ids = list(map(lambda tile: tile.tid, corner_tiles))
    print(corner_tiles_ids)
    # find 4 corners
    # znajdz idki tych ktore maja dokladnie dwa wspolne brzegi z outermost_edges


z1(tiles_dict.values())


# def list_to_matrix(l, side):
#     return [l[i:i+side] for i in range(0, len(l), side)]

#
# def horizontal_check(tiles):
#     for row in tiles:
#         for index in range(len(row) - 1):
#             if right_side(row[index]) != left_side(row[index + 1]):
#                 return False
#     return True
#
#
# def vertical_check(tiles):
#     _N = len(tiles)
#     for row_index in range(_N - 1):
#         for col_index in range(_N):
#             if bottom_side(tiles[row_index][col_index]) != top_side(tiles[row_index + 1][col_index]):
#                 return False
#     return True
#
#
# def z1(tiles_keys):
#     ids = list_to_matrix(tiles_keys, N)
#     tiles = [list(map(lambda tid: tiles_dict[tid], x)) for x in ids]
#     ver = vertical_check(tiles)
#     hor = horizontal_check(tiles)
#     while not (ver and hor):
#         random.shuffle(ids)
#         tiles = [list(map(lambda tid: tiles_dict[tid], x)) for x in ids]
#         ver = vertical_check(tiles)
#         hor = horizontal_check(tiles)
#
#     print(ids)

# z1(list(tiles_dict.keys()))






print("Part One : " + str(None))
print("Part Two : " + str(None))