# Advent of code Year 2020 Day 9 solution
# Author = ?
# Date = December 2020

with open((__file__.rstrip("code.py")+"input.txt"), 'r') as input_file:
    input = input_file.read()

PREAMBLE_LENGTH = 25
numbers = list(map(int, input.split('\n')))


def preamble_check(_preamble: [int], _expected: int):
    n = len(_preamble)
    for i in range(n):
        for j in range(i, n):
            if _preamble[i] + _preamble[j] == _expected:
                return True
    return False


def z1(_numbers: [int], preamble_length: int):
    for i in range(preamble_length, len(_numbers)):
        if not preamble_check(numbers[(i - preamble_length): i], _numbers[i]):
            return _numbers[i]
    return None


result1 = z1(numbers, PREAMBLE_LENGTH)


def z2(_numbers: [int], _expected: int):
    for index1 in range(len(_numbers)):
        for index2 in range(index1 + 1, len(_numbers)):
            l = _numbers[index1:index2]
            s = sum(l)
            if _expected == s:
                if len(l) > 1:
                    return min(l) + max(l)
            elif s > result1:
                break


result2 = z2(numbers, result1)

print("Part One : "+ str(result1))
print("Part Two : "+ str(result2))