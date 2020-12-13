# Advent of code Year 2020 Day 13 solution
# Author = ?
# Date = December 2020
import math
from functools import reduce


def lcm(l: [int]):
    result = l[0]
    for elem in l[1:]:
        result = abs(result * elem) // math.gcd(result, elem)
    return result


with open((__file__.rstrip("code.py") + "input.txt"), 'r') as input_file:
    input = input_file.read()
timestamp, departures = input.split('\n')
timestamp = int(timestamp)
departures_strings = departures.split(',')

departure_offset = {}
departures = []
for index, dep in enumerate(departures_strings):
    if dep != 'x':
        departure_offset[int(dep)] = int(dep) - (index % int(dep))
        departures.append(int(dep))


def z1(_departures, _timestamp):
    for dep in _departures:
        if _timestamp % dep == 0:
            return _timestamp
    dividers = list(map(lambda x: _timestamp // x, _departures))
    close_departures = [(dividers[i] + 1) * _departures[i] for i in range(len(_departures))]
    closest_departure = min(close_departures)
    waiting_time = closest_departure - _timestamp
    return _departures[close_departures.index(closest_departure)] * waiting_time


def chinese_remainder(n, a):
    sum = 0
    prod = reduce(lambda a, b: a * b, n)
    for n_i, a_i in zip(n, a):
        p = prod // n_i
        sum += a_i * mul_inv(p, n_i) * p
    return sum % prod


def mul_inv(a, b):
    b0 = b
    x0, x1 = 0, 1
    if b == 1: return 1
    while a > 1:
        q = a // b
        a, b = b, a % b
        x0, x1 = x1 - q * x0, x0
    if x1 < 0: x1 += b0
    return x1


def z2(_departures):
    return chinese_remainder(departure_offset.keys(), departure_offset.values())


print("Part One : " + str(z1(departures, timestamp)))

print("Part Two : " + str(z2(departures)))
