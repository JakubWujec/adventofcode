# Advent of code Year 2020 Day 7 solution
# Author = ?
# Date = December 2020

with open((__file__.rstrip("code.py") + "input.txt"), 'r') as input_file:
    input = input_file.read()
lines = input.split('\n')

color_bag_map = {}
seek = 'shiny gold'

for line in lines:
    outer_bag_color, inner_bags = line.split(' bags contain ')
    color_bag_map[outer_bag_color] = dict()
    for inner_bag in inner_bags.split(', '):
        inner_bag_split = inner_bag.split(' ')
        if inner_bag_split[0].startswith('no'):
            continue
        else:
            amount = int(inner_bag_split[0])
        inner_bag_color = ' '.join(inner_bag_split[1:3])
        color_bag_map[outer_bag_color][inner_bag_color] = amount


### Z1 ###
def rec_search(_outer, _seek):
    if len(_outer) == 0:
        return False
    if _seek in color_bag_map[_outer]:
        return True
    for c in color_bag_map[_outer]:
        if rec_search(c, _seek):
            return True
    return False


z1_counter = 0
for color in color_bag_map:
    z1_counter += rec_search(color, seek)

print("Part One : " + str(z1_counter))


### Z2 ###
def rec_calc(_outer_color):
    return sum(color_bag_map[_outer_color].values()) + \
           sum([color_bag_map[_outer_color][key] * rec_calc(key) for key in color_bag_map[_outer_color].keys()])


print("Part Two : " + str(rec_calc(seek)))
