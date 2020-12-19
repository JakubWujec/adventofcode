# Advent of code Year 2020 Day 18 solution
# Author = ?
# Date = December 2020
import re

with open((__file__.rstrip("code.py") + "input.txt"), 'r') as input_file:
    input = input_file.read()

lines = input.split('\n')
L_PAR = '('
R_PAR = ')'
pars = re.compile('[(].*[)]')
print(re.match(pars, lines[0]))


def calculate_simple(expression: str):
    ''' calculate line expr without parenthesis'''
    factors = []
    operators = []
    exs = expression.split(' ')
    for ex in exs:
        if ex.isnumeric():
            factors.append(int(ex))
        else:
            operators.append(ex)
    while len(factors) > 1:
        res = eval(str(factors.pop(0)) + operators.pop(0) + str(factors.pop(0)))
        factors.insert(0, res)
    return factors[0]


def calculate_simple_with_add_precedence(expression: str):
    factors = []
    operators = []
    exs = expression.split(' ')
    for ex in exs:
        if ex.isnumeric():
            factors.append(int(ex))
        else:
            operators.append(ex)
    while len(factors) > 1:
        if '+' in operators:
            i = operators.index('+')
            res = eval(str(factors.pop(i)) + operators.pop(i) + str(factors.pop(i)))
            factors.insert(i, res)
        else:
            res = eval(str(factors.pop(0)) + operators.pop(0) + str(factors.pop(0)))
            factors.insert(0, res)
    return factors[0]


def find_inner_parentheses(expr):
    start = None
    for index, x in enumerate(expr):
        if x == L_PAR:
            start = index
        if x == R_PAR:
            end = index
            return expr[start: end+1]
    return None


def z1(lines):
    lines = lines[:]
    result1 = 0
    for line in lines:
        inner = find_inner_parentheses(line)
        while inner is not None:
            res = calculate_simple(inner[1:-1])
            line = line.replace(inner, str(res))
            inner = find_inner_parentheses(line)
        result1 += calculate_simple(line)
    return result1


def z2(lines):
    lines = lines[:]
    result2 = 0
    for line in lines:
        inner = find_inner_parentheses(line)
        while inner is not None:
            res = calculate_simple_with_add_precedence(inner[1:-1])
            line = line.replace(inner, str(res))
            inner = find_inner_parentheses(line)
        result2 += calculate_simple_with_add_precedence(line)
    return result2



print("Part One : " + str(z1(lines)))

print("Part Two : " + str(z2(lines)))
