# Advent of code Year 2020 Day 6 solution
# Author = ?
# Date = December 2020

with open((__file__.rstrip("code.py")+"input.txt"), 'r') as input_file:
    input = input_file.read()

# z1
groups = input.split('\n\n')
counter1 = 0
for group in groups:
    group_score = len(set(group.replace('\n','')))
    counter1 += group_score

print("Part One : "+ str(counter1))

# z2
counter2 = 0
groups = list(map(lambda x: x.split('\n'), groups))
for group in groups:
    group = list(map(lambda x: set(x), group))
    counter2 += len(group[0].intersection(*group))


print("Part Two : "+ str(counter2))