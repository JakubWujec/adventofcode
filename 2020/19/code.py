# Advent of code Year 2020 Day 19 solution
# Author = ?
# Date = December 2020
import copy

with open((__file__.rstrip("code.py")+"input.txt"), 'r') as input_file:
    input = input_file.read()
rules_input, examples_input = input.split('\n\n')
PIPE = '|'
RULES = dict()
for line in rules_input.split('\n'):
    key, val = line.split(':')
    key = int(key)
    if PIPE in val:
        vals = val.split(PIPE)
        for v in vals:
            v = v.strip()
            v = v.split(' ')
            if key in RULES:
                RULES[key].append(list(map(int, v)))
            else:
                RULES[key] = [list(map(int, v))]
    else:
        v = val.strip()
        if v.startswith('"'):
            v = v.replace('"', '')
            RULES[key] = [list(v)]
        else:
            v = v.split(' ')
            RULES[key] = [list(map(int, v))]
examples = examples_input.split('\n')
RULES2 = copy.deepcopy(RULES)
RULES2[8] = [[42], [42, 8]]
RULES2[11] = [[42, 31], [42, 11, 31]]

def z1(words):
    counter = 0
    for word in words:
        stack = [0]
        if word_matches_rules(word, stack, RULES):
            counter += 1
    return counter


def word_matches_rules(word, stack, rules):
    if stack == [] and word == '':
        return True
    elif stack == [] or word == '':
        return False
    else:
        top = stack.pop(0)
        rule = rules[top]  # [[a]] or [[4,1,5]] or [[2,3] [4,5]]
        if len(rule) > 1:
            # pipe
            p1, p2 = rule
            stack1 = p1 + stack
            stack2 = p2 + stack
            return word_matches_rules(word, stack1, rules) or word_matches_rules(word, stack2, rules)
        else:
            rule = rule[0]  # [a] or [4,1,5]
            if type(rule[0]) is int:
                stack = rule + stack
                return word_matches_rules(word, stack, rules)
            else:
                letter = rule[0]
                if word[0] == letter:
                    return word_matches_rules(word[1:], stack, rules)
                else:
                    return False


def z2(words):
    counter = 0
    for word in words:
        stack = [0]
        if word_matches_rules(word, stack, RULES2):
            counter += 1
    return counter

print("Part One : "+ str(z1(examples)))



print("Part Two : "+ str(z2(examples)))