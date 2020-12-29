# Advent of code Year 2020 Day 24 solution
# Author = ?
# Date = December 2020
import copy


with open((__file__.rstrip("code.py") + "input.txt"), 'r') as input_file:
    input = input_file.read()

lines = input.split('\n')


def sum_tuples(*tuples):
    return [sum(x) for x in zip(*tuples)]


def find_tile(start: [int, int], line):
    ne = line.count('ne')
    nw = line.count('nw')
    se = line.count('se')
    sw = line.count('sw')
    e = line.count('e') - ne - se
    w = line.count('w') - nw - sw
    hor = 2 * (e - w) + (ne + se) - (nw + sw)
    ver = (nw + ne) - (sw + se)
    tile = sum_tuples(start, [hor, ver])
    return tile


def adjacent_tiles(tile):
    hor, ver = tile[0], tile[1]
    return [
        [hor + 2, ver], [hor - 2, ver], [hor + 1, ver + 1], [hor + 1, ver - 1], [hor - 1, ver + 1], [hor - 1, ver - 1]
    ]


def flip_tile(black_tiles, tile):
    if is_black(black_tiles, tile):
        black_tiles.remove(tile)
    else:
        black_tiles.append(tile)


def is_black(black_tiles, tile):
    return tile in black_tiles


def z1(_lines):
    black_tiles = []
    for line in _lines:
        tile = find_tile([0, 0], line)
        flip_tile(black_tiles, tile)
    return black_tiles


def z2(_lines, days):
    black_tiles = z1(_lines)
    for day in range(days):
        old_black_tiles = copy.deepcopy(black_tiles)
        old_white_tiles = []
        for b in old_black_tiles:
            for w in adjacent_tiles(b):
                if not is_black(old_black_tiles, w) and w not in old_white_tiles:
                    old_white_tiles.append(w)

        # first condition
        for tile in old_black_tiles:
            adjs = adjacent_tiles(tile)
            blacks_adjs_num = len(list(filter(lambda t: is_black(old_black_tiles, t), adjs)))
            if blacks_adjs_num == 0 or blacks_adjs_num > 2:
                flip_tile(black_tiles, tile)

        # second condition
        for tile in old_white_tiles:
            adjs = adjacent_tiles(tile)
            blacks_adjs_num = len(list(filter(lambda t: is_black(old_black_tiles, t), adjs)))
            if blacks_adjs_num == 2:
                flip_tile(black_tiles, tile)
        del old_white_tiles
        del old_black_tiles
        print(day+1, len(black_tiles))
    return len(black_tiles)


print(z2(lines, 100))

print("Part One : " + str(len(z1(lines))))

print("Part Two : " + str())
