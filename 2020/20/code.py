# Advent of code Year 2020 Day 20 solution
# Author = ?
# Date = December 2020
import math
import copy
import random


class Tile:
    def __init__(self, tid, tile_data: [str]):
        self.tid = tid
        self.tile_data: [str] = tile_data

    def rotate(self):
        self.tile_data = list(map(lambda x: ''.join(x), list(zip(*self.tile_data[::-1]))))

    def flip(self):
        self.tile_data = list(map(lambda row: row[::-1], self.tile_data))

    def left_border(self):
        return ''.join([row[0] for row in self.tile_data])

    def right_border(self):
        return ''.join([row[-1] for row in self.tile_data])

    def top_border(self):
        return self.tile_data[0]

    def bottom_border(self):
        return self.tile_data[-1]

    def remove_borders(self):
        self.tile_data = self.tile_data[1:-1]
        self.tile_data = list((map(lambda row: row[1:-1], self.tile_data)))

    def dims(self):
        return len(self.tile_data), len(self.tile_data[0])

    def count(self, char):
        count = 0
        for row in self.tile_data:
            count += row.count(char)
        return count

    def __repr__(self):
        return str('Tile (id: ' + str(self.tid) + ' data:' + str(self.tile_data))

    def __str__(self):
        return str(self.tile_data)


class Image:
    def __init__(self, side_len: int):
        self.tiles: [Tile] = []
        self.side_len = side_len

    def add_tile(self, tile: Tile):
        self.tiles.append(tile)

    def remove_tile(self, tile: Tile):
        self.tiles.remove(tile)

    def contains(self, tile: Tile):
        return tile in self.tiles

    def place_tile(self, tile: Tile, row: int, col: int):
        self.tiles[self.row_col_to_index(row, col)] = tile

    def tile_has_mismatched_neighbours(self, tile):
        if tile not in self.tiles:
            raise Exception('Tile not found')
        tile_index = self.index_of(tile)
        row, col = self.index_to_row_col(tile_index)
        top_neighbour, right_neighbour, bottom_neighbour, left_neighbour = [self.tile_at(row - 1, col),
                                                                            self.tile_at(row, col + 1),
                                                                            self.tile_at(row + 1, col),
                                                                            self.tile_at(row, col - 1)]
        if top_neighbour is not None:
            if tile.top_border() != top_neighbour.bottom_border():
                return True
        if right_neighbour is not None:
            if tile.right_border() != right_neighbour.left_border():
                return True
        if bottom_neighbour is not None:
            if tile.bottom_border() != bottom_neighbour.top_border():
                return True
        if left_neighbour is not None:
            if tile.left_border() != left_neighbour.right_border():
                return True
        return False

    def has_mismatched_tiles(self):
        for tile in self.tiles:
            if self.tile_has_mismatched_neighbours(tile):
                return True
        return False

    def index_of(self, tile: Tile):
        if tile in self.tiles:
            return self.tiles.index(tile)
        return None

    def horizontal_check(self) -> bool:
        for row in range(self.side_len):
            for col in range(self.side_len - 1):
                if self.tile_at(row, col) is not None and self.tile_at(row, col + 1) is not None:
                    if self.tile_at(row, col).right_border() != self.tile_at(row, col + 1).left_border():
                        return False
        return True

    def vertical_check(self) -> bool:
        for row in range(self.side_len - 1):
            for col in range(self.side_len):
                if self.tile_at(row, col) is not None and self.tile_at(row + 1, col) is not None:
                    if self.tile_at(row, col).bottom_border() != self.tile_at(row + 1, col).top_border():
                        return False
        return True

    def index_to_row_col(self, index) -> (int, int):
        row = index // self.side_len
        col = index % self.side_len
        return row, col

    def row_col_to_index(self, row: int, col: int) -> int or None:
        if 0 <= row < self.side_len and 0 <= col < self.side_len:
            return row * self.side_len + col
        return None

    def tile_at(self, row, col) -> Tile or None:
        index = self.row_col_to_index(row, col)
        if index is not None:
            if index in range(len(self.tiles)):
                return self.tiles[index]
        return None

    def corners(self) -> [Tile]:
        return [self.tile_at(0, 0),
                self.tile_at(0, self.side_len - 1),
                self.tile_at(self.side_len - 1, 0),
                self.tile_at(self.side_len - 1, self.side_len - 1)]

    def remove_tiles_borders(self):
        for tile in self.tiles:
            tile.remove_borders()

    @staticmethod
    def concat_tiles(*tiles):
        tiles_data = list(map(lambda t: t.tile_data, tiles))
        return list(map(''.join, zip(*tiles_data)))

    def with_removed_gaps(self):
        with_removed_gaps = []
        for i in range(self.side_len):
            row_tiles = self.tiles[i * self.side_len: i * self.side_len + self.side_len]
            merged_row_tile = Image.concat_tiles(*row_tiles)
            with_removed_gaps += merged_row_tile
        return with_removed_gaps

    def check(self) -> bool:
        if len(self.tiles) == self.side_len * self.side_len:
            return self.vertical_check() and self.horizontal_check()
        return False

    def contains_monster(self, monster: [str]):
        return False


def solve_image(free_tiles: [Tile], assembled: Image, solutions: [Image]):
    if assembled.check():
        solutions.append(assembled)
    else:
        for index, tile in enumerate(free_tiles):
            for i in range(4):
                assembled.add_tile(tile)
                if not assembled.tile_has_mismatched_neighbours(tile):
                    solve_image(copy.deepcopy(free_tiles[:index] + free_tiles[index + 1:]), copy.deepcopy(assembled),
                                solutions)
                tile.rotate()
                assembled.remove_tile(tile)
            tile.flip()
            for i in range(4):
                assembled.add_tile(tile)
                if not assembled.tile_has_mismatched_neighbours(tile):
                    solve_image(copy.deepcopy(free_tiles[:index] + free_tiles[index + 1:]), copy.deepcopy(assembled),
                                solutions)
                tile.rotate()
                assembled.remove_tile(tile)
            tile.flip()


with open((__file__.rstrip("code.py") + "input.txt"), 'r') as input_file:
    input = input_file.read()

MONSTER = [
    '                  # ',
    '#    ##    ##    ###',
    ' #  #  #  #  #  #   ',
]
MONSTER = list(map(lambda x: x.replace(' ', '.'), MONSTER))

input = input.split('\n\n')
tiles_dict = {}
N = int(math.sqrt(len(input)))
for tile_input in input:
    tile_input = tile_input.split('\n')
    title = tile_input.pop(0)
    tile_id = int(title.replace('Tile ', '').replace(':', ''))
    new_tile = Tile(tile_id, tile_input)
    tiles_dict[tile_id] = new_tile

solutions: [Image] = []
solve_image(list(tiles_dict.values()), Image(N), solutions)
solution_0: Image = solutions[0]


def z1(corner_tiles: [Tile]):
    corners_ids = list(map(lambda t: t.tid, corner_tiles))
    return corners_ids[0] * corners_ids[1] * corners_ids[2] * corners_ids[3]


def z2(solution: Image, monster):
    monster_rows, monster_cols = len(monster), len(monster[0])
    monster_tuples = []
    for row, monster_line in enumerate(MONSTER):
        for col, letter in enumerate(monster_line):
            if letter == '#':
                monster_tuples.append((row, col))

    solution.remove_tiles_borders()
    big_tile = Tile(1, solution.with_removed_gaps())
    big_tile_rows = len(big_tile.tile_data)
    big_tile_cols = len(big_tile.tile_data[0])
    all_hashtags = big_tile.count('#')

    for i in range(8):
        taken_tuples = []

        for row, data_row in enumerate(big_tile.tile_data):
            if row + monster_rows < big_tile_rows:
                for col, data_col in enumerate(data_row):
                    if col + monster_cols < big_tile_cols:
                        m_slice = matrix_slice(row, row + monster_rows, col, col + monster_cols, big_tile.tile_data)
                        x = list((map(lambda tup: m_slice[tup[0]][tup[1]], monster_tuples)))
                        if x.count('.') == 0:
                            taken_tuples += list(map(lambda tup: (row+tup[0], col+tup[1]), monster_tuples))
        l = len(set(taken_tuples))
        result = all_hashtags - l

        if l > 0:
            return result

        if i == 4:
            big_tile.flip()
        else:
            big_tile.rotate()
    return None


def matrix_slice(start_row, stop_row, start_col, stop_col, matrix):
    return [matrix[i][start_col: stop_col] for i in range(start_row, stop_row)]


print("Part One : " + str(z1(solution_0.corners())))
print("Part Two : " + str(z2(solution_0, MONSTER)))
