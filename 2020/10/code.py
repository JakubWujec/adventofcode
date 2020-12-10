# Advent of code Year 2020 Day 10 solution
# Author = ?
# Date = December 2020

with open((__file__.rstrip("code.py") + "input.txt"), 'r') as input_file:
    input = input_file.read()

adapters = list(map(int, input.split('\n')))
charging_outlet = 0
builtin_adapter = max(adapters) + 3
adapters.append(charging_outlet)
adapters.append(builtin_adapter)
sorted_adapters = sorted(adapters)
ones = 0
threes = 0
n = len(sorted_adapters)

for i in range(1, n):
    if sorted_adapters[i] - sorted_adapters[i - 1] == 3:
        threes += 1
    if sorted_adapters[i] - sorted_adapters[i - 1] == 1:
        ones += 1

result1 = ones * threes

arrangements = [0 for i in range(builtin_adapter + 1)]
arrangements[0] = 1

for adapter in sorted_adapters:
    if adapter != 0:
        arrangements[adapter] = \
            arrangements[adapter - 1] + \
            (arrangements[adapter - 2] or 0) + \
            (arrangements[adapter - 3] or 0)
result2 = arrangements[-1]

print("Part One : " + str(result1))
print("Part Two : " + str(result2))
